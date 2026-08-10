import { Reveal } from "@/components/reveal";

const CITATIONS = [
  "Yan et al. · Nature Medicine, 2025 · PanDerm",
  "Sellergren et al. · 2026 · MedGemma 1.5 Technical Report",
  "Tschandl et al. · Scientific Data, 2018 · HAM10000",
  "Rombach et al. · CVPR, 2022 · Latent Diffusion Models",
];

export function CredibilitySection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Grounded in published, peer-reviewed foundations:
            </p>
            <ul className="flex flex-wrap gap-2">
              {CITATIONS.map((citation) => (
                <li
                  key={citation}
                  className="rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground"
                >
                  {citation}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
