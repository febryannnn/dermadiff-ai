export type ExplanationSection = {
  title: string;
  body: string;
};

// MedGemma is prompted for five numbered sections (see dermogpt.py /
// modal_app.py _build_prompt). This is a best-effort structural parse —
// if the model's formatting drifts, sections.length <= 1 and the caller
// falls back to plain prose so no content is ever lost.
const HEADER_RE = /^\*{0,2}\s*([1-5])[.)]\s*\*{0,2}\s*([A-Za-z][^.\n]{2,60}?)\*{0,2}:?\s*$/;

export function parseExplanation(text: string): ExplanationSection[] {
  const lines = text.split(/\r?\n/);
  const sections: ExplanationSection[] = [];
  let current: ExplanationSection | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const match = line.match(HEADER_RE);
    if (match) {
      if (current) sections.push(current);
      current = { title: match[2].trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + rawLine;
    } else if (line) {
      current = { title: "", body: rawLine };
    }
  }
  if (current) sections.push(current);

  return sections
    .map((s) => ({ title: s.title, body: s.body.trim() }))
    .filter((s) => s.title || s.body);
}
