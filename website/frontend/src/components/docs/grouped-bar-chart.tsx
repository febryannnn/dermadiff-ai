const EXPERIMENT_IDS = ["A", "B", "C", "D", "E"] as const;

// Sequential ramp, not 5 arbitrary hues: A is lightest, E (the shipped
// model) gets the heat accent so it reads as the answer, not just another
// bar in the set.
const BAR_COLORS = [
  "color-mix(in oklab, var(--foreground) 25%, transparent)",
  "color-mix(in oklab, var(--foreground) 42%, transparent)",
  "color-mix(in oklab, var(--foreground) 60%, transparent)",
  "color-mix(in oklab, var(--foreground) 80%, transparent)",
  "var(--heat)",
];

export type BarGroup = {
  label: string;
  values: number[]; // one per experiment, same order as EXPERIMENT_IDS
};

export function ChartLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {EXPERIMENT_IDS.map((id, i) => (
        <div key={id} className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm"
            style={{ backgroundColor: BAR_COLORS[i] }}
          />
          <span className="font-mono text-[11px] text-muted-foreground">
            {id}
          </span>
        </div>
      ))}
    </div>
  );
}

export function GroupedBarChart({
  data,
  min,
  max,
  height = 200,
  valueFormat = (v: number) => v.toFixed(2),
}: {
  data: BarGroup[];
  min: number;
  max: number;
  height?: number;
  valueFormat?: (v: number) => string;
}) {
  const range = max - min;

  return (
    <div className="overflow-x-auto">
      <div
        className="flex items-end gap-4 border-b border-border pb-0"
        style={{ height, minWidth: data.length * 56 }}
      >
        {data.map((group) => (
          <div
            key={group.label}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <div className="flex h-full items-end gap-[3px]">
              {group.values.map((v, i) => {
                const heightPct = Math.max(((v - min) / range) * 100, 2);
                return (
                  <div
                    key={EXPERIMENT_IDS[i]}
                    className="w-2 rounded-t-[2px] sm:w-2.5"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: BAR_COLORS[i],
                    }}
                    title={`${EXPERIMENT_IDS[i]}: ${valueFormat(v)}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex gap-4"
        style={{ minWidth: data.length * 56 }}
      >
        {data.map((group) => (
          <div
            key={group.label}
            className="flex-1 pt-1.5 text-center font-mono text-[10px] whitespace-nowrap text-muted-foreground"
          >
            {group.label}
          </div>
        ))}
      </div>
    </div>
  );
}
