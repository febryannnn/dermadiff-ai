"""
models/medgemma.py
------------------
modal class wrapping medgemma-4b-it for structured dermatology explanation.

responsibilities:
  - load model weights and processor at container start (snap=True enter)
  - move model to gpu after every snapshot restore (snap=False enter)
  - build the structured five-section prompt from panderm output
  - expose both a blocking explain() method and a streaming explain_stream()
    generator for the web layer to choose between

design notes:

  device_map="auto" is intentionally not used here.  for a single-gpu
  container, explicit .to("cuda") is faster than auto because auto
  installs an aligndeviceshook on every submodule, which adds python
  overhead on every decode step.

  the warm() no-op method exists solely to give the web layer a way to
  boot this container via .spawn() during classification, so its cold
  start (~60-120 s) runs in parallel with the panderm forward pass rather
  than sequentially after it.

  the prompt instructs medgemma to write five sections and to reference
  concrete visual details from both the original image and the heatmap.
  vague instructions produce generic output; the current prompt is tuned
  to elicit structure that maps directly to the frontend's section renderer.
"""

import io
import base64

import modal

from app import app, medgemma_image
from core.constants import LABELS, MAX_NEW_TOKENS


@app.cls(
    image=medgemma_image,
    gpu="a10g",
    scaledown_window=180,
    timeout=900,
    enable_memory_snapshot=True,
    secrets=[modal.Secret.from_name("huggingface-secret")],
)
class MedGemmaModel:

    # -------------------------------------------------------------- #
    # lifecycle                                                        #
    # -------------------------------------------------------------- #

    @modal.enter(snap=True)
    def load(self):
        """
        cpu-only setup captured by the memory snapshot.

        loads medgemma-4b-it from the local image cache (hf_hub_offline=1
        prevents any network access).  bfloat16 is used throughout;
        sdpa provides flash-attention-style memory-efficient attention
        without a separate dependency.
        """
        import os
        import torch
        from transformers import AutoProcessor, AutoModelForImageTextToText

        hf_token = os.environ.get("HF_TOKEN")
        if not hf_token:
            raise RuntimeError(
                "HF_TOKEN not found in container environment.  "
                "confirm that the 'huggingface-secret' modal secret exists "
                "and has an HF_TOKEN key."
            )

        model_id = "google/medgemma-4b-it"
        self.model = AutoModelForImageTextToText.from_pretrained(
            model_id,
            torch_dtype=torch.bfloat16,
            low_cpu_mem_usage=True,
            token=hf_token,
            attn_implementation="sdpa",
        ).eval()
        self.processor = AutoProcessor.from_pretrained(model_id, token=hf_token)

    @modal.enter(snap=False)
    def to_gpu(self):
        """moves the model to cuda after every snapshot restore."""
        self.model = self.model.to("cuda")

    # -------------------------------------------------------------- #
    # public no-op for pre-warming                                     #
    # -------------------------------------------------------------- #

    @modal.method()
    def warm(self) -> str:
        """
        no-op called via .spawn() from /api/classify.

        spawning this during classification boots the medgemma container
        in the background so its cold start is hidden behind the time the
        user spends reading the classification result, rather than adding
        to the explain latency.
        """
        return "ok"

    # -------------------------------------------------------------- #
    # prompt construction                                              #
    # -------------------------------------------------------------- #

    @staticmethod
    def _build_prompt(panderm_result: dict) -> str:
        """
        constructs the structured dermatologist prompt from panderm output.

        the ranked class list and top-two labels are interpolated so the
        model can reference specific class names and probabilities rather
        than speaking abstractly about "the top prediction".
        """
        probs = panderm_result["probs"]
        ranked = sorted(probs.items(), key=lambda kv: kv[1], reverse=True)
        ranked_lines = "\n".join(
            f"  {i + 1}. {LABELS.get(c, c)} ({c}) — {p:.1%}"
            for i, (c, p) in enumerate(ranked)
        )
        top_class, top_prob = ranked[0]
        second_class, second_prob = ranked[1]
        top_label = LABELS.get(top_class, top_class)
        second_label = LABELS.get(second_class, second_class)

        return f"""You are an expert dermatologist providing a second-opinion review of an AI-assisted skin lesion classification.

You are shown two images of the SAME lesion: (1) the original dermoscopic photograph, and (2) an attention rollout heatmap where warmer colors mark the regions a vision transformer classifier (PanDerm, fine-tuned on HAM10000) weighted most heavily.

CLASSIFIER OUTPUT (all 7 classes):
{ranked_lines}

Top: {top_label} ({top_prob:.1%}) | Runner-up: {second_label} ({second_prob:.1%})

Write five sections. Reference concrete visual details you actually observe; avoid generic statements.

1. Morphological findings (ABCD rule, dermoscopy) — briefly score Asymmetry (0-2), Border (0-8), Color (1-6), and Differential structures (1-5, e.g. pigment network/streaks/dots/globules — not diameter). State the TDS (A x 1.3 + B x 0.1 + C x 0.5 + D x 0.5) and its band: <4.75 benign, 4.75-5.45 suspicious, >5.45 malignant.

2. Heatmap interpretation — which regions are highlighted, and whether they correspond to the diagnostically relevant structures from section 1 or to something clinically irrelevant (artifact, hair, ruler marking, healthy skin).

3. Reasoning for the top prediction — step by step, why the visual evidence is or is not consistent with {top_label}.

4. Reasoning for the distribution — comment on {second_label} and any other non-trivial class; what visual features could plausibly cause confusion between them.

5. Overall assessment — is the classifier's output well-supported, partially supported, or inconsistent? Note any feature raising concern for a different diagnosis.

Do NOT provide an independent, self-contained diagnosis outside this structured evaluation. This is a research prototype intended to support, not replace, clinical judgment."""

    # -------------------------------------------------------------- #
    # input preparation                                                #
    # -------------------------------------------------------------- #

    def _prepare_inputs(self, image_bytes: bytes, panderm_result: dict):
        """
        decodes both the original image and the heatmap, resizes them to
        896x896 (medgemma's native resolution), assembles the chat-template
        message list, and tokenises the result.

        the system message and five-section user prompt are kept separate
        so the processor can apply its chat template correctly and
        add_generation_prompt inserts the assistant turn prefix.
        """
        import torch
        from PIL import Image

        original_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        heatmap_key = "heatmap_b64" if "heatmap_b64" in panderm_result else "heatmap_png_b64"
        heatmap_bytes = base64.b64decode(panderm_result[heatmap_key])
        heatmap_img = Image.open(io.BytesIO(heatmap_bytes)).convert("RGB")

        original_img = original_img.resize((896, 896), Image.BICUBIC)
        heatmap_img = heatmap_img.resize((896, 896), Image.BICUBIC)

        messages = [
            {
                "role": "system",
                "content": [{
                    "type": "text",
                    "text": (
                        "You are an expert dermatologist assisting in a systematic review "
                        "of an AI-assisted skin lesion classification. Be specific and "
                        "evidence-based; avoid generic statements."
                    ),
                }],
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Image 1 — original dermoscopic photograph:"},
                    {"type": "image", "image": original_img},
                    {"type": "text", "text": "Image 2 — attention rollout heatmap of the same "
                                             "lesion (warmer = higher model attention):"},
                    {"type": "image", "image": heatmap_img},
                    {"type": "text", "text": self._build_prompt(panderm_result)},
                ],
            },
        ]

        return self.processor.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt",
            do_pan_and_scan=False,
        ).to(self.model.device, dtype=torch.bfloat16)

    # -------------------------------------------------------------- #
    # public modal methods                                             #
    # -------------------------------------------------------------- #

    @modal.method()
    def explain(self, image_bytes: bytes, panderm_result: dict) -> str:
        """
        blocking (non-streaming) explanation generation.

        kept for api compatibility.  for user-facing requests,
        explain_stream() is preferred because it reduces perceived latency
        from ~20 s to ~1-2 s (time-to-first-token).
        """
        import time
        import torch

        t0 = time.time()
        inputs = self._prepare_inputs(image_bytes, panderm_result)
        input_len = inputs["input_ids"].shape[-1]
        t1 = time.time()
        print(f"[timing] preprocess={t1 - t0:.1f}s input_tokens={input_len}")

        with torch.inference_mode():
            output_ids = self.model.generate(
                **inputs, max_new_tokens=MAX_NEW_TOKENS, do_sample=False
            )
        t2 = time.time()
        n_out = output_ids.shape[-1] - input_len
        print(f"[timing] generate={t2 - t1:.1f}s output_tokens={n_out} "
              f"({n_out / max(t2 - t1, 1e-6):.1f} tok/s)")

        return self.processor.decode(output_ids[0][input_len:], skip_special_tokens=True)

    @modal.method()
    def explain_stream(self, image_bytes: bytes, panderm_result: dict):
        """
        streaming explanation generator.

        total wall-clock time matches explain(), but the caller receives
        tokens as they are produced so the frontend can begin rendering
        immediately.  generation runs on a background thread via
        transformers.textiteratorstreamer so the main thread can yield
        each chunk without blocking cuda.
        """
        import time
        from threading import Thread
        from transformers import TextIteratorStreamer

        t0 = time.time()
        inputs = self._prepare_inputs(image_bytes, panderm_result)
        print(f"[timing] preprocess={time.time() - t0:.1f}s "
              f"input_tokens={inputs['input_ids'].shape[-1]}")

        streamer = TextIteratorStreamer(
            self.processor.tokenizer, skip_prompt=True, skip_special_tokens=True
        )
        gen_kwargs = dict(
            **inputs,
            max_new_tokens=MAX_NEW_TOKENS,
            do_sample=False,
            streamer=streamer,
        )

        thread = Thread(target=self.model.generate, kwargs=gen_kwargs)
        thread.start()
        try:
            for chunk in streamer:
                yield chunk
        finally:
            thread.join()
        print(f"[timing] stream_total={time.time() - t0:.1f}s")
