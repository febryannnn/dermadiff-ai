import { Reveal } from "@/components/reveal";

const STATS = [
  {
    value: "58:1",
    label: "Class imbalance in HAM10000",
    detail: "Melanoma vs. nevi sample counts: the rarest, most dangerous classes are the hardest to learn.",
  },
  {
    value: "~60%",
    label: "Unaided visual accuracy",
    detail: "Diagnostic accuracy for skin lesions without dermoscopy (Kittler et al., 2002).",
  },
  {
    value: "80%+",
    label: "of skin-cancer deaths",
    detail: "Caused by melanoma, despite it being under 2% of diagnosed cases.",
  },
  {
    value: "99%",
    label: "5-year survival, caught early",
    detail: "Drops sharply once melanoma reaches an advanced stage at diagnosis.",
  },
];

export function StatsSection() {
  return (
    <section className="dark bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <div className="font-mono text-xs tracking-wide text-primary uppercase">
              The diagnostic gap
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Two problems stand between a dermoscope and a confident call.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Skewed training data degrades exactly the classes where a
              missed call costs the most, and a black-box prediction gives
              a clinician nothing to weigh it against.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-background px-6 py-7">
                <div className="font-mono text-4xl font-medium tracking-tight text-foreground sm:text-[2.75rem]">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-medium text-foreground">
                  {stat.label}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
