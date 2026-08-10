export type PanDermResult = {
  probs: Record<string, number>;
  predicted_class: string;
  predicted_prob: number;
  heatmap_png_b64: string;
  heatmap_b64?: string;
  heatmap_mime?: string;
};

export type ExplainResult = {
  explanation: string;
};

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const RAW_BASE = process.env.NEXT_PUBLIC_MODAL_API_URL ?? "";
const API_BASE = RAW_BASE.replace(/\/+$/, "");

export function isApiConfigured() {
  return API_BASE.length > 0;
}

async function messageFromResponse(res: Response): Promise<string> {
  try {
    const data = await res.clone().json();
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.error === "string") return data.error;
  } catch {
    // response wasn't JSON — fall through to status text
  }
  return `${res.status} ${res.statusText}`.trim();
}

export async function classifyImage(
  file: File,
  signal?: AbortSignal,
): Promise<PanDermResult> {
  if (!isApiConfigured()) {
    throw new ApiError(
      "NEXT_PUBLIC_MODAL_API_URL isn't set. The classifier backend has no address to call.",
    );
  }
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${API_BASE}/api/classify`, {
    method: "POST",
    body: form,
    signal,
  });
  if (!res.ok) throw new ApiError(await messageFromResponse(res), res.status);
  return res.json();
}

export async function explainImage(
  file: File,
  pandermResult: PanDermResult,
  signal?: AbortSignal,
): Promise<ExplainResult> {
  if (!isApiConfigured()) {
    throw new ApiError(
      "NEXT_PUBLIC_MODAL_API_URL isn't set. The classifier backend has no address to call.",
    );
  }
  const form = new FormData();
  form.append("image", file);
  form.append("panderm_result", JSON.stringify(pandermResult));

  const res = await fetch(`${API_BASE}/api/explain`, {
    method: "POST",
    body: form,
    signal,
  });
  if (!res.ok) throw new ApiError(await messageFromResponse(res), res.status);
  return res.json();
}

/**
 * Streaming counterpart to explainImage(). Calls onDelta as each text chunk
 * arrives over SSE, so the UI can render the explanation as it's written
 * instead of waiting for the full generation to finish.
 */
export async function explainImageStream(
  file: File,
  pandermResult: PanDermResult,
  onDelta: (delta: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (!isApiConfigured()) {
    throw new ApiError(
      "NEXT_PUBLIC_MODAL_API_URL isn't set. The classifier backend has no address to call.",
    );
  }
  const form = new FormData();
  form.append("image", file);
  form.append("panderm_result", JSON.stringify(pandermResult));

  const res = await fetch(`${API_BASE}/api/explain_stream`, {
    method: "POST",
    body: form,
    signal,
  });
  if (!res.ok || !res.body) {
    throw new ApiError(await messageFromResponse(res), res.status);
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6);
      if (payload === "[DONE]") return;
      const parsed = JSON.parse(payload) as { delta?: string; error?: string };
      if (parsed.error) throw new ApiError(parsed.error);
      if (parsed.delta) onDelta(parsed.delta);
    }
  }
}
