"use client";

import { useEffect, useRef, useState } from "react";
import { ScanSmiley } from "@phosphor-icons/react/dist/ssr/ScanSmiley";
import { ChartBar } from "@phosphor-icons/react/dist/ssr/ChartBar";
import { ChatCircleText } from "@phosphor-icons/react/dist/ssr/ChatCircleText";
import { PatchGridVisual } from "@/components/home/patch-grid-visual";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "upload",
    icon: ScanSmiley,
    label: "Upload",
    title: "Upload a dermoscopic image",
    description:
      "PanDerm ViT-Large splits the 224×224 frame into 196 patch tokens and encodes it with priors learned from large-scale dermatology pretraining.",
    tag: "224×224 · JPG or PNG",
  },
  {
    id: "classify",
    icon: ChartBar,
    label: "Classify + localize",
    title: "Classify, then localize",
    description:
      "A seven-class probability distribution comes back with an attention-rollout heatmap (the regions the transformer actually weighted, not a post-hoc approximation).",
    tag: "196 patch tokens",
  },
  {
    id: "explain",
    icon: ChatCircleText,
    label: "Explain",
    title: "Explain, in plain language",
    description:
      "MedGemma reads the image, the heatmap, and the full probability spread, then writes a five-part clinical rationale under an escalate-never-clear rule.",
    tag: "5-part rationale",
  },
];

const EXPLANATION_PREVIEW = [
  "1. ABCD rule assessment (dermoscopy)",
  "   A: 2/2 asymmetric axes  B: 6/8 abrupt border",
  "   C: 4 colors  D: 3 structures  TDS: 6.1 (>5.45)",
  "",
  "2. Heatmap interpretation",
  "   Attention concentrates on the darkest,",
  "   most irregular region of the lesion...",
  "",
  "3. Reasoning for the top prediction",
  "   Consistent with the classifier's call...",
];

const AUTO_ADVANCE_MS = 4500;

function WindowChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
      <span className="size-2.5 rounded-full bg-foreground/15" />
      <span className="size-2.5 rounded-full bg-foreground/15" />
      <span className="size-2.5 rounded-full bg-foreground/15" />
      <span className="ml-2 font-mono text-[11px] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function InteractiveDemo() {
  const [active, setActive] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!autoAdvance) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoAdvance]);

  function selectStep(index: number) {
    setAutoAdvance(false);
    setActive(index);
  }

  const step = STEPS[active];

  return (
    <section className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <div className="font-mono text-xs tracking-wide text-primary uppercase">
              See it in action
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Three passes, one upload.
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <Reveal delay={0.05}>
            <div className="flex flex-col gap-2">
              {STEPS.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectStep(i)}
                    className={cn(
                      "flex items-start gap-3.5 rounded-xl border px-4 py-4 text-left transition-colors",
                      isActive
                        ? "dark border-border bg-background text-foreground"
                        : "border-transparent hover:bg-card/60",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs",
                        isActive
                          ? "bg-foreground text-background"
                          : "bg-background text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <s.icon weight="duotone" className="size-4" />
                        {s.title}
                      </div>
                      <p
                        className={cn(
                          "mt-1.5 text-sm leading-relaxed text-muted-foreground transition-[grid-template-rows]",
                          !isActive && "hidden lg:block",
                        )}
                      >
                        {s.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-30px_rgba(28,20,16,0.18)]">
              <WindowChrome label={`dermadiff.app/product/${step.id}`} />
              <div className="relative flex min-h-[360px] items-center justify-center p-8">
                <span className="absolute top-4 left-4 z-10 rounded-full border border-border bg-background/90 px-2.5 py-1 font-mono text-[10px] tracking-wide text-muted-foreground uppercase backdrop-blur-sm">
                  {step.tag}
                </span>

                {step.id === "upload" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/mel.jpg"
                    alt="Placeholder dermoscopic image, replace with a real capture"
                    className="aspect-square w-full max-w-sm rounded-xl object-cover"
                  />
                )}

                {step.id === "classify" && (
                  <div className="w-full max-w-sm">
                    <PatchGridVisual />
                  </div>
                )}

                {step.id === "explain" && (
                  <div className="w-full max-w-sm rounded-xl border border-border bg-secondary/40 p-5">
                    <pre className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-foreground/80">
                      {EXPLANATION_PREVIEW.join("\n")}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
