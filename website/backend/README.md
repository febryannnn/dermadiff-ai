dermadiff-xai
a modal-deployed skin lesion classification and explainability system.

the pipeline combines panderm (vit-large, fine-tuned on ham10000) for
7-class dermoscopy classification and attention-rollout heatmap generation,
with medgemma-4b-it for structured clinical explanation of the classifier
output.

project structure
-----------------

  app.py              modal app, image definitions, build-time helpers
  core/
    constants.py      class names, label map, generation limits
  models/
    panderm.py        panderm vit-large modal class
    medgemma.py       medgemma-4b-it modal class
  api/
    web.py            fastapi asgi app mounted as modal endpoint

getting started
---------------

prerequisites:
  modal account with a valid token (modal token new)
  huggingface token with access to google/medgemma-4b-it

create the huggingface modal secret:

  modal secret create huggingface-secret HF_TOKEN=<your_token>

deploy:

  modal deploy app.py

the deployed url follows the pattern:
  https://<user>--dermadiff-xai-ui.modal.run

api reference
-------------

get /
get /api/health

  returns service status and a list of available endpoints.

post /api/classify

  accepts: multipart/form-data with an "image" file field
  returns: json

    {
      "probs":           {"akiec": 0.01, "bcc": 0.02, ...},
      "predicted_class": "nv",
      "predicted_prob":  0.91,
      "heatmap_b64":     "<jpeg bytes, base64>",
      "heatmap_mime":    "image/jpeg"
    }

  the heatmap is a jpeg of the attention-rollout overlay blended onto the
  original image, capped at 512 px on the longest edge.

  as a side effect, this endpoint spawns the medgemma container so its
  cold start runs in parallel with the user reading the result.

post /api/explain

  accepts: multipart/form-data
    image           the same image sent to /api/classify
    panderm_result  the full json response body from /api/classify

  returns: {"explanation": "<text>"}

  blocking.  use /api/explain_stream for interactive use.

post /api/explain_stream

  accepts: same as /api/explain
  returns: text/event-stream (server-sent events)

  each event: data: {"delta": "<chunk>"}
  terminal:   data: [DONE]

  on a cache hit the full explanation is sent as one chunk.  on a miss
  tokens arrive as they are generated, reducing time-to-first-token from
  roughly 20 s to 1-2 s.

caching
-------

results are stored in a modal.dict keyed by sha-256 of the image bytes.
explanation keys include the predicted class name so different results
for the same image do not collide.  the cache is shared across all
containers and persists across deployments.

cold start
----------

both model containers use modal memory snapshots (enable_memory_snapshot=True).
the snapshot is taken after the cpu-only setup (model construction and
weight loading) completes.  subsequent cold starts restore from the
snapshot and skip past the python import and weight-loading phase.

the snap=True / snap=False split on the enter decorator is required: cuda
state cannot be captured in a plain cpu memory snapshot, so moving the
model to gpu and running the cudnn warmup pass happen in a separate
snap=False enter method that runs fresh after every restore.

notes
-----

this is a research prototype.  the explanation output is intended to
support, not replace, clinical judgment.  the system does not produce
an independent diagnosis.
