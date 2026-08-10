"""
app.py
------
modal app definition and image declarations for dermadiff-xai.

all three modal.Image objects are defined here so they can be imported
by both the model classes and the web entrypoint without circular
dependency.  the build-time functions (prepare_panderm_weights,
download_medgemma) also live here because they run inside the image
build context and must not import any project-local modules.
"""

import modal

from core.constants import CLASSES  # noqa: F401 — re-exported for convenience

app = modal.App("dermadiff-xai")

cache = modal.Dict.from_name("dermadiff-cache", create_if_missing=True)


# ------------------------------------------------------------------ #
# build-time helpers                                                   #
# ------------------------------------------------------------------ #

def prepare_panderm_weights():
    """
    runs once during image build.

    loads the raw training checkpoint (which contains optimizer state and
    uses pickle), strips everything except model tensors, and saves the
    result as a safetensors file.  subsequent container starts do a cheap
    mmap load instead of unpickling the full checkpoint.
    """
    import torch
    from huggingface_hub import hf_hub_download
    from safetensors.torch import save_file

    path = hf_hub_download(
        repo_id="farelfebryan/panderm-ham10000",
        filename="checkpoint-best.pth",
    )
    ckpt = torch.load(path, map_location="cpu", weights_only=False)
    state = ckpt.get("model", ckpt.get("state_dict", ckpt))
    state = {
        k.replace("module.", ""): v.contiguous()
        for k, v in state.items()
        if isinstance(v, torch.Tensor)
    }
    save_file(state, "/opt/panderm_weights.safetensors")
    print(f"saved {len(state)} tensors to /opt/panderm_weights.safetensors")


def download_medgemma():
    """
    runs once during image build with the huggingface secret in scope.

    bakes the full medgemma-4b-it weights into the image so runtime
    containers never make outbound network calls to the hub.
    """
    import os
    from huggingface_hub import snapshot_download

    snapshot_download(
        repo_id="google/medgemma-4b-it",
        token=os.environ["HF_TOKEN"],
    )


# ------------------------------------------------------------------ #
# modal images                                                         #
# ------------------------------------------------------------------ #

panderm_image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install("git")
    .pip_install(
        "torch==2.1.2",
        "torchvision==0.16.2",
        "timm==0.4.12",
        "huggingface_hub==0.25.2",
        "safetensors",
        "pillow",
        "einops",
        "scipy",
        "numpy<2",
        "matplotlib",
    )
    .run_commands(
        "git clone https://github.com/SiyuanYan1/PanDerm.git /opt/PanDerm",
    )
    .run_function(prepare_panderm_weights)
    # hf_hub_offline prevents etag/head requests on every cold start even
    # when weights are already baked into the image.
    .env({"HF_HUB_OFFLINE": "1"})
)

# top-level imports captured here are included in the memory snapshot,
# so the snapshot restores past the python import cost (8-12 s) entirely.
with panderm_image.imports():
    import sys
    import importlib.util
    import torch
    import matplotlib.cm as cm
    from torchvision import transforms
    from safetensors.torch import load_file  # noqa: F401


medgemma_image = (
    modal.Image.debian_slim(python_version="3.10")
    .pip_install(
        "torch",
        "transformers>=4.50.0",
        "accelerate",
        "huggingface_hub",
        "pillow",
    )
    .run_function(
        download_medgemma,
        secrets=[modal.Secret.from_name("huggingface-secret")],
    )
    .env({"HF_HUB_OFFLINE": "1"})
)

# the web container is cpu-only and runs fastapi exclusively.  keeping
# it on a minimal image avoids pulling torch/torchvision/timm (~3 gb)
# into a container that never uses them.
web_image = modal.Image.debian_slim(python_version="3.10").pip_install(
    "fastapi==0.112.2",
    "pydantic==2.8.2",
    "python-multipart==0.0.9",
    "pillow",
)
