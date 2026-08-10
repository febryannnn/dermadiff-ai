"""
models/panderm.py
-----------------
modal class wrapping the panderm vit-large classifier.

responsibilities:
  - load safetensors weights at container start (snap=True enter)
  - move model to gpu after every snapshot restore (snap=False enter)
  - run a single forward pass that produces both class probabilities and
    an attention-rollout heatmap without a second forward pass
  - return a json-serialisable dict to the web layer

design notes:

  the memory snapshot (enable_memory_snapshot=True) is the primary tool
  for reducing cold start.  the split between snap=True (load) and
  snap=False (to_gpu) is mandatory: cuda state cannot be captured by a
  plain cpu memory snapshot, so anything gpu-specific must run fresh
  after every restore.

  the panderm checkpoint uses a custom modeling_finetune module that is
  not on pypi.  it is cloned into the image at /opt/PanDerm and imported
  at runtime via importlib to avoid polluting the module namespace with a
  path that only exists inside the container.

  forward_with_attention accumulates the rollout incrementally inside the
  transformer block loop rather than storing all 24 attention tensors and
  processing them afterwards.  peak memory is roughly 0.3 mb instead of
  ~60 mb, with identical numerical output.
"""

import io
import base64

import modal

from app import app, panderm_image
from core.constants import CLASSES, MAX_OVERLAY_PX, OVERLAY_JPEG_QUALITY


@app.cls(
    image=panderm_image,
    gpu="T4",
    scaledown_window=180,
    timeout=600,
    enable_memory_snapshot=True,
    experimental_options={"enable_gpu_snapshot": True},
)
class PanDermModel:

    # -------------------------------------------------------------- #
    # lifecycle                                                        #
    # -------------------------------------------------------------- #

    @modal.enter(snap=True)
    def load(self):
        """
        cpu-only setup that runs once before the memory snapshot is taken.

        imports the panderm modeling module from the cloned repo, builds
        the vit-large architecture, and loads safetensors weights.  the
        matplotlib colormap and torchvision transform pipeline are also
        initialised here so the snapshot captures them and the first real
        request does not pay the matplotlib import cost (~0.8 s).
        """
        import sys
        import importlib.util
        import torch
        import matplotlib.cm as cm
        from torchvision import transforms
        from safetensors.torch import load_file

        PANDERM_DIR = "/opt/PanDerm"
        sys.path.insert(0, f"{PANDERM_DIR}/classification")
        sys.path.insert(0, f"{PANDERM_DIR}/classification/models")

        spec = importlib.util.spec_from_file_location(
            "modeling_finetune",
            f"{PANDERM_DIR}/classification/models/modeling_finetune.py",
        )
        mod = importlib.util.module_from_spec(spec)
        sys.modules["modeling_finetune"] = mod
        spec.loader.exec_module(mod)

        self.model = mod.panderm_large_patch16_224_finetune(
            pretrained=False,
            num_classes=7,
            drop_rate=0.0,
            drop_path_rate=0.2,
            attn_drop_rate=0.0,
            drop_block_rate=None,
            use_mean_pooling=True,
            init_scale=0.001,
            use_rel_pos_bias=False,
            init_values=0.1,
            lin_probe=False,
        )

        state = load_file("/opt/panderm_weights.safetensors")
        missing, unexpected = self.model.load_state_dict(state, strict=False)
        print(f"weights loaded: missing={len(missing)} unexpected={len(unexpected)}")
        self.model.eval()

        self.cmap = cm.jet
        self.tfm = transforms.Compose([
            transforms.Resize(256, interpolation=transforms.InterpolationMode.BICUBIC),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ])

    @modal.enter(snap=False)
    def to_gpu(self):
        """
        runs after every snapshot restore.

        moves the already-built model to cuda and executes one dummy
        forward pass to pay the cudnn workspace allocation and autotune
        cost before the first real request arrives.
        """
        import torch

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)

        if self.device == "cuda":
            dummy = torch.zeros(1, 3, 224, 224, device=self.device)
            with torch.inference_mode():
                self._forward_with_attention(dummy)
            torch.cuda.synchronize()

    # -------------------------------------------------------------- #
    # attention mechanics                                              #
    # -------------------------------------------------------------- #

    @staticmethod
    def _attention_and_output(attn_module, x, rel_pos_bias=None):
        """
        computes both the softmax attention matrix and the projected block
        output in a single qkv pass.

        the standard block.forward() discards the attention weights after
        computing attn @ v.  this method returns them alongside the output
        so the caller can accumulate the rollout without a second pass.

        parameters
        ----------
        attn_module : the BEiT/ViT attention submodule
        x           : (B, N, C) input token sequence
        rel_pos_bias: optional relative position bias tensor

        returns
        -------
        out  : (B, N, C) projected attention output
        attn : (B, heads, N, N) softmax attention weights
        """
        import torch
        import torch.nn.functional as F

        B, N, C = x.shape
        qkv_bias = None
        if attn_module.q_bias is not None:
            qkv_bias = torch.cat((
                attn_module.q_bias,
                torch.zeros_like(attn_module.v_bias, requires_grad=False),
                attn_module.v_bias,
            ))
        qkv = F.linear(input=x, weight=attn_module.qkv.weight, bias=qkv_bias)
        qkv = qkv.reshape(B, N, 3, attn_module.num_heads, -1).permute(2, 0, 3, 1, 4)
        q, k, v = qkv[0], qkv[1], qkv[2]
        q = q * attn_module.scale
        attn = q @ k.transpose(-2, -1)

        if attn_module.relative_position_bias_table is not None:
            rpb = attn_module.relative_position_bias_table[
                attn_module.relative_position_index.view(-1)
            ].view(
                attn_module.window_size[0] * attn_module.window_size[1] + 1,
                attn_module.window_size[0] * attn_module.window_size[1] + 1,
                -1,
            )
            rpb = rpb.permute(2, 0, 1).contiguous()
            attn = attn + rpb.unsqueeze(0)
        if rel_pos_bias is not None:
            attn = attn + rel_pos_bias

        attn = attn.softmax(dim=-1)
        out = (attn @ v).transpose(1, 2).reshape(B, N, -1)
        out = attn_module.proj(out)
        out = attn_module.proj_drop(out)
        return out, attn

    def _forward_with_attention(self, x):
        """
        replicates visiontransformer.forward_features() while accumulating
        attention rollout incrementally inside the block loop.

        rollout algorithm: abnar & zuidema, 2020 (attention rollout).
        at each layer, the per-head attention is averaged, the residual
        identity is added, rows are renormalised, and the result is
        composed with the running rollout via matrix multiplication.

        storing all 24 attention tensors post-hoc would require ~60 mb;
        the incremental version keeps only two (B, N, N) tensors alive at
        once (~0.3 mb) with identical output.

        returns
        -------
        logits : (B, 7) raw class scores
        mask   : (B, num_patches) rollout influence per patch token
        """
        import torch

        m = self.model
        x = m.patch_embed(x)
        B, N, _ = x.shape
        cls_tokens = m.cls_token.expand(B, -1, -1)
        x = torch.cat((cls_tokens, x), dim=1)
        if m.pos_embed is not None:
            x = x + m.pos_embed.expand(B, -1, -1).type_as(x).to(x.device)
        x = m.pos_drop(x)
        rel_pos_bias = m.rel_pos_bias() if m.rel_pos_bias is not None else None

        rollout = None
        eye = None

        for blk in m.blocks:
            normed = blk.norm1(x)
            attn_out, attn = self._attention_and_output(
                blk.attn, normed, rel_pos_bias=rel_pos_bias
            )

            a = attn.mean(dim=1)
            if eye is None:
                eye = torch.eye(a.size(-1), device=a.device).unsqueeze(0)
            a = (a + eye) / 2
            a = a / a.sum(dim=-1, keepdim=True)
            rollout = a if rollout is None else a @ rollout
            del attn, a

            if blk.gamma_1 is None:
                x = x + blk.drop_path(attn_out)
                x = x + blk.drop_path(blk.mlp(blk.norm2(x)))
            else:
                x = x + blk.drop_path(blk.gamma_1 * attn_out)
                x = x + blk.drop_path(blk.gamma_2 * blk.mlp(blk.norm2(x)))

        x = m.norm(x)
        if m.fc_norm is not None:
            pooled = m.fc_norm(x[:, 1:, :].mean(1))
        else:
            pooled = x[:, 0]
        logits = m.head(pooled)

        # drop cls row/column before averaging, consistent with the
        # mean-pooling head that excludes the cls token.
        mask = rollout[:, 1:, 1:].mean(dim=1)
        return logits, mask

    # -------------------------------------------------------------- #
    # heatmap rendering                                                #
    # -------------------------------------------------------------- #

    def _make_heatmap_overlay(self, pil_image, mask):
        """
        reshapes the flat patch mask into a spatial grid, normalises it to
        [0, 1], resizes the original image to MAX_OVERLAY_PX on its longest
        edge, blends with a jet colormap heatmap, and returns the composite
        as a PIL image.
        """
        import numpy as np
        from PIL import Image as PILImage

        grid = int(round(mask.shape[-1] ** 0.5))
        m = mask[0].reshape(grid, grid).float().cpu().numpy()
        m = (m - m.min()) / (m.max() - m.min() + 1e-8)

        base = pil_image.convert("RGB")
        if max(base.size) > MAX_OVERLAY_PX:
            base.thumbnail((MAX_OVERLAY_PX, MAX_OVERLAY_PX), PILImage.BICUBIC)

        heat = PILImage.fromarray(np.uint8(self.cmap(m) * 255)).convert("RGB")
        heat = heat.resize(base.size, resample=PILImage.BICUBIC)
        return PILImage.blend(base, heat, alpha=0.45)

    # -------------------------------------------------------------- #
    # public modal method                                              #
    # -------------------------------------------------------------- #

    @modal.method()
    def predict_with_attention(self, image_bytes: bytes) -> dict:
        """
        runs classification and heatmap generation for one image.

        the forward pass runs in plain fp32.  t4 has no meaningful fp16
        tensor-core advantage for this model size, and skipping autocast
        keeps probability values consistent with the numbers reported in
        the panderm paper.

        returns a dict with keys:
          probs           : {class: probability}
          predicted_class : str
          predicted_prob  : float
          heatmap_b64     : jpeg bytes, base64-encoded
          heatmap_mime    : "image/jpeg"
          heatmap_png_b64 : alias for heatmap_b64 (backward compat)
        """
        import time
        import torch
        from PIL import Image

        t0 = time.time()
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        x = self.tfm(img).unsqueeze(0).to(self.device)

        with torch.inference_mode():
            logits, mask = self._forward_with_attention(x)

        probs = torch.softmax(logits, dim=1)[0].cpu().tolist()
        t1 = time.time()

        overlay = self._make_heatmap_overlay(img, mask)
        buf = io.BytesIO()
        overlay.save(buf, format="JPEG", quality=OVERLAY_JPEG_QUALITY)
        heatmap_b64 = base64.b64encode(buf.getvalue()).decode()
        t2 = time.time()

        print(f"[timing] forward={t1 - t0:.2f}s overlay={t2 - t1:.2f}s")

        probs_dict = {CLASSES[i]: float(probs[i]) for i in range(len(CLASSES))}
        pred_idx = max(range(len(probs)), key=lambda i: probs[i])

        return {
            "probs": probs_dict,
            "predicted_class": CLASSES[pred_idx],
            "predicted_prob": float(probs[pred_idx]),
            "heatmap_b64": heatmap_b64,
            "heatmap_png_b64": heatmap_b64,   # backward-compat alias
            "heatmap_mime": "image/jpeg",
        }
