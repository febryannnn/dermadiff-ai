"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr/ArrowClockwise";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { parseExplanation } from "@/lib/parse-explanation";

// MedGemma writes plain text but still slips into markdown occasionally
// (**bold**, "* " bullets) despite instructions not to — LLMs reliably do
// this. Rather than fight it in the prompt, render the two markers it
// actually uses instead of showing literal asterisks.
function renderInline(text: string): ReactNode {
  return text
    .split(/\*\*([^*]+)\*\*/g)
    .map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="font-semibold text-foreground">
          {part}
        </strong>
      ) : (
        part
      ),
    );
}

function renderBody(body: string): ReactNode {
  const blocks: { type: "list" | "p"; lines: string[] }[] = [];

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const bullet = line.match(/^[*-]\s+(.*)$/);
    const last = blocks[blocks.length - 1];
    if (bullet) {
      if (last?.type === "list") last.lines.push(bullet[1]);
      else blocks.push({ type: "list", lines: [bullet[1]] });
    } else if (last?.type === "p") {
      last.lines.push(line);
    } else {
      blocks.push({ type: "p", lines: [line] });
    }
  }

  return blocks.map((block, i) =>
    block.type === "list" ? (
      <ul key={i} className="list-disc space-y-1 pl-4">
        {block.lines.map((l, j) => (
          <li key={j}>{renderInline(l)}</li>
        ))}
      </ul>
    ) : (
      <p key={i} className="whitespace-pre-line">
        {renderInline(block.lines.join("\n"))}
      </p>
    ),
  );
}

const LOADING_MESSAGES = [
  "Analyzing dermoscopic morphology",
  "Cross-referencing the probability distribution",
  "Interpreting attention heatmap regions",
  "Drafting a structured clinical rationale",
];

const SKELETON_WIDTHS = ["100%", "94%", "88%", "97%", "60%"];

function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % LOADING_MESSAGES.length),
      2200,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p className="shimmer text-sm font-medium text-foreground">
        {LOADING_MESSAGES[index]}…
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        {SKELETON_WIDTHS.map((w, i) => (
          <Skeleton key={i} className="h-3.5" style={{ width: w }} />
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        MedGemma is reading the image, the heatmap, and the full probability
        spread. This usually takes under a minute.
      </p>
    </div>
  );
}

export function ExplanationPanel({
  status,
  text,
  errorMessage,
  onRetry,
}: {
  status: "idle" | "loading" | "error" | "done";
  text?: string;
  errorMessage?: string;
  onRetry?: () => void;
}) {
  if (status === "idle") {
    return (
      <p className="text-sm text-muted-foreground">
        The written rationale appears here once classification finishes.
      </p>
    );
  }

  if (status === "loading") {
    return <LoadingState />;
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-start gap-2 text-sm text-destructive">
          <WarningCircle weight="bold" className="mt-0.5 size-4 shrink-0" />
          <span>{errorMessage ?? "Couldn't generate an explanation."}</span>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <ArrowClockwise weight="bold" />
            Retry explanation
          </Button>
        )}
      </div>
    );
  }

  const sections = parseExplanation(text ?? "");
  const structured = sections.filter((s) => s.title).length >= 3;

  if (!structured) {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
        {renderBody(text ?? "")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {sections.map((section, i) => (
        <div key={i}>
          {section.title && (
            <div className="flex items-center gap-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[10px] text-muted-foreground">
                {i + 1}
              </span>
              <h4 className="text-sm font-medium text-foreground">
                {section.title}
              </h4>
            </div>
          )}
          <div className="mt-1.5 space-y-2 pl-7 text-sm leading-relaxed text-foreground/85">
            {renderBody(section.body)}
          </div>
        </div>
      ))}
    </div>
  );
}
