"""
core/constants.py
-----------------
shared constants used across the classification pipeline, explanation
prompt builder, and api response schema.

keeping these in one place prevents the class list and label map from
drifting out of sync between the panderm model output and the medgemma
prompt.
"""

CLASSES = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]

LABELS = {
    "akiec": "Actinic Keratosis (suspicious)",
    "bcc":   "Basal Cell Carcinoma (malignant)",
    "bkl":   "Benign Keratosis (low risk)",
    "df":    "Dermatofibroma (low risk)",
    "mel":   "Melanoma (malignant)",
    "nv":    "Melanocytic Nevus (low risk)",
    "vasc":  "Vascular Lesion (low risk)",
}

# heatmap overlay is capped before jpeg encode so large phone photos
# do not produce oversized base64 payloads.
MAX_OVERLAY_PX = 512
OVERLAY_JPEG_QUALITY = 88

# token budget for medgemma generation.  1000 gives the five structured
# sections enough room to include the full abcd/tds scoring in section 1
# without truncating the overall assessment.
MAX_NEW_TOKENS = 1000
