import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { Button } from "@/components/ui/button";
import { PatchGridVisual } from "@/components/home/patch-grid-visual";
import { FloatingHeroVisual } from "@/components/home/floating-hero-visual";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-28 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-6">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Clinical decision support · Dermoscopy
          </div>

          <h1 className="mt-5 max-w-xl text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
            Classify the lesion. See the reasoning.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            DermaDiff pairs a PanDerm vision transformer (trained on
            Stable&nbsp;Diffusion-augmented dermoscopic data) with a
            MedGemma-generated clinical explanation, so a seven-class
            classification comes with the visual evidence behind it, not
            just a label.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="group h-11 px-5">
              <Link href="/product">
                Try the classifier
                <ArrowRight
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-5">
              <Link href="/documentation">
                <FileText weight="bold" />
                Read the documentation
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Built on PanDerm ViT-Large (Yan et al., <em>Nature Medicine</em>,
            2025) and MedGemma 4B-IT. Research prototype: decision support
            only, not a diagnosis.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="w-full">
          <FloatingHeroVisual />
          <div className="mx-auto w-full max-w-md lg:hidden">
            <PatchGridVisual />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
