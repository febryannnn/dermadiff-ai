import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { TechLogo, type LogoSrc } from "@/components/tech-logo";

const STACK: { src: LogoSrc; alt: string }[] = [
  { src: "/nextjs.jpeg", alt: "Next.js" },
  { src: "/react.webp", alt: "React" },
  { src: "/tailwind.webp", alt: "Tailwind CSS" },
  { src: "/modal.svg", alt: "Modal" },
  { src: "/fast_api.png", alt: "FastAPI" },
  { src: "/hf.webp", alt: "Hugging Face" },
  { src: "/medgemma.png", alt: "MedGemma" },
];

export function TechStackSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <div className="font-mono text-xs tracking-wide text-primary uppercase">
              Under the hood
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Built on a small, boring stack.
            </h2>
            <p className="mt-3 text-muted-foreground">
              A Next.js frontend talking directly to a Modal-hosted backend
              that serves PanDerm and MedGemma on GPU. See the{" "}
              <Link href="/documentation/methodology#deployment">
                full deployment breakdown
              </Link>{" "}
              in the docs.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-3">
            {STACK.map((logo) => (
              <TechLogo key={logo.src} src={logo.src} alt={logo.alt} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
