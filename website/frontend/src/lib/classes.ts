export type RiskTier = "high" | "moderate" | "low";

export type ClassInfo = {
  code: string;
  name: string;
  note: string;
  tier: RiskTier;
};

// Mirrors the LABELS / CLASSES mapping in panderm-modal/modal_app.py exactly —
// the same seven-class HAM10000 taxonomy the classifier was trained on.
export const CLASS_INFO: Record<string, ClassInfo> = {
  mel: { code: "mel", name: "Melanoma", note: "malignant", tier: "high" },
  bcc: {
    code: "bcc",
    name: "Basal Cell Carcinoma",
    note: "malignant",
    tier: "high",
  },
  akiec: {
    code: "akiec",
    name: "Actinic Keratosis",
    note: "suspicious",
    tier: "moderate",
  },
  bkl: {
    code: "bkl",
    name: "Benign Keratosis-like Lesion",
    note: "low concern",
    tier: "low",
  },
  df: {
    code: "df",
    name: "Dermatofibroma",
    note: "low concern",
    tier: "low",
  },
  nv: {
    code: "nv",
    name: "Melanocytic Nevus",
    note: "low concern",
    tier: "low",
  },
  vasc: {
    code: "vasc",
    name: "Vascular Lesion",
    note: "low concern",
    tier: "low",
  },
};

export const TIER_STYLES: Record<
  RiskTier,
  { badge: string; bar: string; label: string }
> = {
  high: {
    badge: "bg-risk-high text-risk-high-foreground",
    bar: "bg-risk-high-foreground",
    label: "Clinical attention",
  },
  moderate: {
    badge: "bg-risk-moderate text-risk-moderate-foreground",
    bar: "bg-risk-moderate-foreground",
    label: "Suspicious",
  },
  low: {
    badge: "bg-risk-low text-risk-low-foreground",
    bar: "bg-risk-low-foreground",
    label: "Lower concern",
  },
};

export function sortedProbs(
  probs: Record<string, number>,
): { code: string; prob: number }[] {
  return Object.entries(probs)
    .map(([code, prob]) => ({ code, prob }))
    .sort((a, b) => b.prob - a.prob);
}
