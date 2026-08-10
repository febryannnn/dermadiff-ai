import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="dark flex flex-col gap-8 rounded-2xl border border-border bg-background px-8 py-10 text-foreground sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-12">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Upload a dermoscopic image. See what the model sees.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A prediction, a heatmap, and a written rationale, usually
              within a minute.
            </p>
          </div>
          <Button asChild size="lg" className="group h-11 shrink-0 px-5">
            <Link href="/product">
              Try the classifier
              <ArrowRight
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
