"""
api/web.py
----------
fastapi application mounted as a modal asgi endpoint.

the function is intentionally kept thin: it only handles http concerns
(cors, input validation, cache lookup, sse framing) and delegates all
computation to the panderm and medgemma modal classes via async remote
calls.

endpoint summary:
  get  /              health check, returns service info
  get  /api/health    same as above
  post /api/classify  panderm classification + heatmap
  post /api/explain   blocking medgemma explanation
  post /api/explain_stream  streaming medgemma explanation (sse)

caching:
  a modal.dict (shared across all containers) is keyed by sha-256 of the
  image bytes, with a class-name suffix for explanation keys so different
  predicted classes produce distinct cache entries.  the cache is write-
  through: every miss stores the result immediately after generation.

concurrency:
  @modal.concurrent(max_inputs=10) allows up to ten simultaneous requests
  on one cpu container.  the async remote calls (.remote.aio()) release
  the event loop while waiting for gpu results, so this works without
  blocking.

cors:
  the api is a public, unauthenticated research endpoint.  allow_origins=["*"]
  is intentional so the next.js frontend can be hosted on any vercel
  deployment without additional configuration.
"""

import hashlib
import json

import modal

from app import app, web_image, cache
from models.panderm import PanDermModel
from models.medgemma import MedGemmaModel


@app.function(
    image=web_image,
    max_containers=1,
)
@modal.concurrent(max_inputs=10)
@modal.asgi_app()
def ui():
    from fastapi import FastAPI, File, Form, HTTPException, UploadFile
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import StreamingResponse
    from PIL import Image
    import io

    panderm_model = PanDermModel()
    medgemma_model = MedGemmaModel()

    web_app = FastAPI(title="DermaDiff-XAI API")

    web_app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    _info = {
        "service": "DermaDiff-XAI API",
        "status": "ok",
        "endpoints": ["/api/classify", "/api/explain", "/api/explain_stream"],
    }

    # -------------------------------------------------------------- #
    # helpers                                                          #
    # -------------------------------------------------------------- #

    async def _read_image_bytes(image: UploadFile) -> bytes:
        """
        reads the upload and verifies it is a valid image before returning
        raw bytes.  raises http 400 if verification fails so the caller
        gets a clear error rather than a cryptic gpu exception later.
        """
        image_bytes = await image.read()
        try:
            Image.open(io.BytesIO(image_bytes)).verify()
        except Exception:
            raise HTTPException(
                status_code=400, detail="uploaded file is not a readable image."
            )
        return image_bytes

    def _parse_result(panderm_result: str) -> dict:
        """parses the panderm_result form field, raising http 400 on invalid json."""
        try:
            return json.loads(panderm_result)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=400, detail="panderm_result must be valid json."
            )

    def _classify_cache_key(image_bytes: bytes) -> str:
        return "cls:" + hashlib.sha256(image_bytes).hexdigest()

    def _explain_cache_key(image_bytes: bytes, parsed_result: dict) -> str:
        return (
            "exp:" + hashlib.sha256(image_bytes).hexdigest()
            + ":" + str(parsed_result.get("predicted_class", ""))
        )

    # -------------------------------------------------------------- #
    # routes                                                           #
    # -------------------------------------------------------------- #

    @web_app.get("/")
    def root():
        return _info

    @web_app.get("/api/health")
    def health():
        return _info

    @web_app.post("/api/classify")
    async def classify(image: UploadFile = File(...)):
        """
        runs panderm vit-large on the uploaded image.

        returns 7-class probabilities, predicted class and confidence, and
        a base64-encoded jpeg of the attention-rollout heatmap overlaid on
        the (resized) original image.

        side effect: spawns the medgemma container in the background so its
        cold start runs in parallel with the time the user spends reviewing
        the classification result.
        """
        image_bytes = await _read_image_bytes(image)
        cache_key = _classify_cache_key(image_bytes)
        cached = cache.get(cache_key)
        if cached is not None:
            return cached

        try:
            await medgemma_model.warm.spawn.aio()
        except Exception as e:
            print(f"[warn] medgemma pre-warm failed (ignored): {e}")

        try:
            result = await panderm_model.predict_with_attention.remote.aio(image_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"classification failed: {e}")

        cache[cache_key] = result
        return result

    @web_app.post("/api/explain")
    async def explain(
        image: UploadFile = File(...),
        panderm_result: str = Form(...),
    ):
        """
        blocking counterpart to /api/explain_stream.

        prefer the streaming endpoint for interactive use; this one is
        provided for clients that cannot consume server-sent events.
        """
        image_bytes = await _read_image_bytes(image)
        parsed_result = _parse_result(panderm_result)
        cache_key = _explain_cache_key(image_bytes, parsed_result)

        cached = cache.get(cache_key)
        if cached is not None:
            return {"explanation": cached}

        try:
            explanation = await medgemma_model.explain.remote.aio(image_bytes, parsed_result)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"explanation failed: {e}")

        cache[cache_key] = explanation
        return {"explanation": explanation}

    @web_app.post("/api/explain_stream")
    async def explain_stream(
        image: UploadFile = File(...),
        panderm_result: str = Form(...),
    ):
        """
        streaming (server-sent events) medgemma explanation.

        each chunk is sent as "data: {json}\\n\\n" with a "delta" key.
        the stream ends with "data: [done]\\n\\n".

        on a cache hit, the full explanation is replayed as a single chunk
        rather than re-running generation.
        """
        image_bytes = await _read_image_bytes(image)
        parsed_result = _parse_result(panderm_result)
        cache_key = _explain_cache_key(image_bytes, parsed_result)
        cached = cache.get(cache_key)

        sse_headers = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}

        if cached is not None:
            async def cached_source():
                yield f"data: {json.dumps({'delta': cached})}\n\n"
                yield "data: [DONE]\n\n"

            return StreamingResponse(
                cached_source(), media_type="text/event-stream", headers=sse_headers
            )

        async def event_source():
            chunks = []
            try:
                async for chunk in medgemma_model.explain_stream.remote_gen.aio(
                    image_bytes, parsed_result
                ):
                    chunks.append(chunk)
                    yield f"data: {json.dumps({'delta': chunk})}\n\n"
                cache[cache_key] = "".join(chunks)
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            event_source(), media_type="text/event-stream", headers=sse_headers
        )

    return web_app
