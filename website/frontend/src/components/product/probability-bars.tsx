import { CLASS_INFO, TIER_STYLES, sortedProbs } from "@/lib/classes";
import { cn } from "@/lib/utils";

export function ProbabilityBars({
  probs,
  predictedClass,
}: {
  probs: Record<string, number>;
  predictedClass: string;
}) {
  const ranked = sortedProbs(probs);

  return (
    <div className="flex flex-col gap-3">
      {ranked.map(({ code, prob }) => {
        const info = CLASS_INFO[code];
        const tier = TIER_STYLES[info?.tier ?? "low"];
        const isTop = code === predictedClass;
        return (
          <div key={code}>
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "truncate text-sm",
                    isTop
                      ? "font-semibold text-foreground"
                      : "text-foreground/85",
                  )}
                >
                  {info?.name ?? code}
                </span>
                {isTop && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
                      tier.badge,
                    )}
                  >
                    {tier.label}
                  </span>
                )}
              </div>
              <span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
                {(prob * 100).toFixed(1)}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-700 ease-out",
                  tier.bar,
                  !isTop && "opacity-40",
                )}
                style={{ width: `${Math.max(prob * 100, 1.5)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
