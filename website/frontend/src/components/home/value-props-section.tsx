import { Broadcast } from "@phosphor-icons/react/dist/ssr/Broadcast";
import { Lightning } from "@phosphor-icons/react/dist/ssr/Lightning";
import { ShieldWarning } from "@phosphor-icons/react/dist/ssr/ShieldWarning";
import { NotePencil } from "@phosphor-icons/react/dist/ssr/NotePencil";
import { Reveal } from "@/components/reveal";

const VALUES = [
  {
    icon: Broadcast,
    title: "Reach",
    description:
      "A generalist clinician with a dermoscope reads at a specialist's level, without first mastering manual dermoscopic pattern interpretation.",
  },
  {
    icon: Lightning,
    title: "Speed",
    description:
      "An interpretable read at the point of care, the moment a specialist referral isn't reachable in time.",
  },
  {
    icon: ShieldWarning,
    title: "Safety",
    description:
      "Escalate, never clear. DermaDiff is prompt-engineered to always surface concerning features. It never tells a clinician a lesion is safe.",
  },
  {
    icon: NotePencil,
    title: "Trust",
    description:
      "Every call ships with a plain-language rationale, so the deciding clinician weighs the evidence instead of trusting a black box.",
  },
];

export function ValuePropsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-24">
            <div className="font-mono text-xs tracking-wide text-primary uppercase">
              Why it&apos;s built this way
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Four constraints the design won&apos;t trade away.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Positioned as a second opinion, not a diagnosis. The
              clinician stays the one accountable for the call.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 0.06}>
              <div className="h-full bg-background px-6 py-7">
                <value.icon
                  weight="duotone"
                  className="size-6 text-primary"
                />
                <h3 className="mt-4 text-base font-medium text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
