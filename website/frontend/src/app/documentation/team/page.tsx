import type { Metadata } from "next";
import { DocSection } from "@/components/docs/doc-section";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The three-person team behind DermaDiff, and the one-week sprint the three parallel tracks ran on.",
};

const TEAM = [
  {
    initials: "FF",
    name: "Farel Febryan Ghiffari P.A.",
    id: "5025241137",
    // track: "Fine-tuned Stable Diffusion 2.1",
    tone: "bg-risk-info text-risk-info-foreground",
  },
  {
    initials: "JK",
    name: "Jason Kumarkono",
    id: "5025241105",
    // track: "Fine-tuned Stable Diffusion XL (LoRA + DoRA)",
    tone: "bg-risk-moderate text-risk-moderate-foreground",
  },
  {
    initials: "IR",
    name: "M. Ilyas Rusdi",
    id: "5025241007",
    // track: "Fine-tuned Stable Diffusion 3.5 Large",
    tone: "bg-risk-low text-risk-low-foreground",
  },
];

const TIMELINE = [
  {
    days: "Day 1",
    theme: "Setup",
    farel: "Dataset scraping, PanDerm setup, baseline classifier (Exp A)",
    jason: "Longitudinal dataset request, stratified split, PanDerm setup",
    ilyas: "Dataset exploration, environment and pipeline planning",
  },
  {
    days: "Day 2–3",
    theme: "Fine-tuning",
    farel: "SD 2.1 LoRA pipeline and fine-tuning on all three datasets",
    jason: "SDXL LoRA and DoRA fine-tuning in parallel",
    ilyas: "SD 3.5 Large LoRA pipeline and fine-tuning",
  },
  {
    days: "Day 4–5",
    theme: "Train + evaluate",
    farel: "Experiment B training, FID/LPIPS/SSIM for SD 2.1",
    jason: "Experiment C and E training, FID/LPIPS/SSIM for both SDXL variants",
    ilyas: "Experiment D training, FID/LPIPS/SSIM for SD 3.5, F1/recall plots",
  },
  {
    days: "Day 6–7",
    theme: "Ship",
    farel: "Site documentation, PanDerm classifier deployed",
    jason: "Cross-domain PAD-UFES-20 evaluation, methodology write-up",
    ilyas: "Presentation slides, final write-up, paper draft",
  },
];

export default function TeamPage() {
  return (
    <>
      <div className="max-w-2xl">
        <div className="font-mono text-xs tracking-wide text-primary uppercase">
          Team
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Three people, one week.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Three tracks ran in parallel for most of the week (one fine-tuned
          Stable Diffusion architecture each), converging on the final two
          days for cross-experiment evaluation and deployment.
        </p>
      </div>

      <DocSection id="roster" eyebrow="01" title="Roster">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TEAM.map((member) => (
            <div
              key={member.id}
              className="dark rounded-xl border border-border bg-background p-5 text-foreground"
            >
              <div
                className={`flex size-11 items-center justify-center rounded-full font-mono text-sm font-medium ${member.tone}`}
              >
                {member.initials}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {member.name}
              </h3>
              <p className="font-mono text-xs text-muted-foreground">
                {member.id}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Department of Informatics, Institut Teknologi Sepuluh Nopember.
        </p>
      </DocSection>

      {/* <DocSection id="timeline" eyebrow="02" title="One-week timeline">
        <p>
          Each person owned one diffusion architecture end to end (fine-tune,
          generate, evaluate) in parallel, then the team converged on a
          shared comparison methodology to close out the week.
        </p>
        <div className="mt-5 flex flex-col gap-4">
          {TIMELINE.map((row) => (
            <div
              key={row.days}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-medium text-foreground">
                  {row.days}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {row.theme}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-2.5 border-t border-border pt-3 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-medium text-foreground">
                    Farel
                  </dt>
                  <dd className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {row.farel}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-foreground">
                    Jason
                  </dt>
                  <dd className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {row.jason}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-foreground">
                    Ilyas
                  </dt>
                  <dd className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {row.ilyas}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </DocSection> */}
    </>
  );
}
