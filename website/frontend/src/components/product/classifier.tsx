"use client";

import { useEffect, useRef, useState } from "react";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr/CircleNotch";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr/ArrowClockwise";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dropzone } from "@/components/product/dropzone";
import { HeatmapCompare } from "@/components/product/heatmap-compare";
import { ProbabilityBars } from "@/components/product/probability-bars";
import { ExplanationPanel } from "@/components/product/explanation-panel";
import {
  classifyImage,
  explainImageStream,
  type PanDermResult,
} from "@/lib/api";
import { CLASS_INFO, TIER_STYLES } from "@/lib/classes";
import { cn } from "@/lib/utils";

const TIER_NOTE: Record<string, string> = {
  high: "Malignant-tier top call: flagged for clinical review.",
  moderate: "Suspicious tier: warrants a closer look.",
  low: "Lower visual concern: clinical correlation is still advised.",
};

function TopPredictionSummary({ result }: { result: PanDermResult }) {
  const info = CLASS_INFO[result.predicted_class];
  const tier = TIER_STYLES[info?.tier ?? "low"];
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
        Top prediction
      </div>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-2xl font-semibold text-foreground">
          {info?.name ?? result.predicted_class}
        </span>
        <div className="text-right">
          <span className="font-mono text-2xl text-primary tabular-nums">
            {(result.predicted_prob * 100).toFixed(1)}%
          </span>
          <div className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
            Confidence
          </div>
        </div>
      </div>
      <Badge className={cn("mt-3", tier.badge)} variant="outline">
        {tier.label}
      </Badge>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {TIER_NOTE[info?.tier ?? "low"]}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Confidence is PanDerm&apos;s own softmax score, how strongly it
        favors this label over the other six, not a calibrated probability
        that the lesion actually is that condition. The same caveat applies
        to every percentage in the breakdown below.
      </p>
    </div>
  );
}

type Phase = "idle" | "loading" | "error" | "done";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 font-mono text-xs tracking-wide text-muted-foreground uppercase">
      {children}
    </div>
  );
}

function ProbabilityBarsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i}>
          <div className="flex items-baseline justify-between">
            <Skeleton className="h-3.5" style={{ width: `${58 - i * 4}%` }} />
            <Skeleton className="h-3.5 w-8" />
          </div>
          <Skeleton className="mt-1.5 h-1.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function Classifier() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [classifyStatus, setClassifyStatus] = useState<Phase>("idle");
  const [classifyResult, setClassifyResult] = useState<PanDermResult | null>(
    null,
  );
  const [classifyError, setClassifyError] = useState<string | null>(null);

  const [explainStatus, setExplainStatus] = useState<Phase>("idle");
  const [explainText, setExplainText] = useState<string | null>(null);
  const [explainError, setExplainError] = useState<string | null>(null);

  const genRef = useRef(0);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // Object URLs are an external resource requiring imperative create/revoke —
    // there's no way to derive this value during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    };
  }, [file]);

  function handleFileChange(next: File | null) {
    genRef.current += 1;
    setFile(next);
    setClassifyStatus("idle");
    setClassifyResult(null);
    setClassifyError(null);
    setExplainStatus("idle");
    setExplainText(null);
    setExplainError(null);
  }

  async function runExplain(
    targetFile: File,
    result: PanDermResult,
    gen: number,
  ) {
    setExplainStatus("loading");
    setExplainError(null);
    let text = "";
    try {
      await explainImageStream(targetFile, result, (delta) => {
        if (genRef.current !== gen) return;
        text += delta;
        // First delta flips the panel from the loading skeleton to live
        // text, so reading starts while MedGemma is still writing.
        setExplainText(text);
        setExplainStatus("done");
      });
      if (genRef.current !== gen) return;
      if (!text) {
        setExplainError("MedGemma didn't return an explanation.");
        setExplainStatus("error");
      }
    } catch (err) {
      if (genRef.current !== gen) return;
      setExplainError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the explanation.",
      );
      setExplainStatus("error");
    }
  }

  async function handleAnalyze() {
    if (!file) return;
    const gen = genRef.current;
    setClassifyStatus("loading");
    setClassifyError(null);
    setExplainStatus("idle");
    setExplainText(null);
    setExplainError(null);
    try {
      const result = await classifyImage(file);
      if (genRef.current !== gen) return;
      setClassifyResult(result);
      setClassifyStatus("done");
      runExplain(file, result, gen);
    } catch (err) {
      if (genRef.current !== gen) return;
      setClassifyError(
        err instanceof Error
          ? err.message
          : "Something went wrong while classifying the image.",
      );
      setClassifyStatus("error");
    }
  }

  const heatmapSrc = classifyResult
    ? `data:${classifyResult.heatmap_mime ?? "image/png"};base64,${
        classifyResult.heatmap_b64 ?? classifyResult.heatmap_png_b64
      }`
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
        <div>
          <SectionLabel>Dermoscopic image</SectionLabel>

          {classifyResult && heatmapSrc && previewUrl ? (
            <HeatmapCompare originalSrc={previewUrl} heatmapSrc={heatmapSrc} />
          ) : (
            <Dropzone
              value={file}
              onChange={handleFileChange}
              disabled={classifyStatus === "loading"}
            />
          )}

          <div className="mt-4 flex items-center gap-3">
            {classifyResult ? (
              <Button
                variant="outline"
                onClick={() => handleFileChange(null)}
                className="flex-1"
              >
                Analyze another image
              </Button>
            ) : (
              <Button
                onClick={handleAnalyze}
                disabled={!file || classifyStatus === "loading"}
                size="lg"
                className="flex-1"
              >
                {classifyStatus === "loading" ? (
                  <>
                    <CircleNotch weight="bold" className="animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  "Analyze image"
                )}
              </Button>
            )}
          </div>

          {classifyStatus === "loading" && (
            <p className="mt-2.5 text-xs text-muted-foreground">
              First run after idle can take up to a minute while the model
              warms up.
            </p>
          )}

          {classifyStatus === "error" && (
            <div className="mt-3 flex flex-col items-start gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3">
              <div className="flex items-start gap-2 text-sm text-destructive">
                <WarningCircle
                  weight="bold"
                  className="mt-0.5 size-4 shrink-0"
                />
                <span>{classifyError}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleAnalyze}>
                <ArrowClockwise weight="bold" />
                Retry
              </Button>
            </div>
          )}
        </div>

        <div>
          <SectionLabel>Classification</SectionLabel>

          {classifyStatus === "loading" && <ProbabilityBarsSkeleton />}

          {classifyStatus === "idle" && (
            <p className="text-sm text-muted-foreground">
              {file
                ? "Ready: click Analyze image to run PanDerm ViT-Large."
                : "Upload a dermoscopic image to see the seven-class probability distribution."}
            </p>
          )}

          {classifyStatus === "error" && (
            <p className="text-sm text-muted-foreground">
              Classification didn&apos;t complete: see the error alongside
              the image.
            </p>
          )}

          {classifyResult && (
            <div className="flex flex-col gap-6">
              <TopPredictionSummary result={classifyResult} />
              <ProbabilityBars
                probs={classifyResult.probs}
                predictedClass={classifyResult.predicted_class}
              />
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                <ArrowDown weight="bold" className="size-4 shrink-0" />
                The full clinical explanation is below, once MedGemma
                finishes.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-14 border-t border-border pt-10">
        <SectionLabel>Clinical explanation · MedGemma 4B-IT</SectionLabel>
        <ExplanationPanel
          status={!classifyResult ? "idle" : explainStatus}
          text={explainText ?? undefined}
          errorMessage={explainError ?? undefined}
          onRetry={
            classifyResult && file
              ? () => runExplain(file, classifyResult, genRef.current)
              : undefined
          }
        />
      </div>
    </div>
  );
}
