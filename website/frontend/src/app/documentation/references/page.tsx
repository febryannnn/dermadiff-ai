import type { Metadata } from "next";
import { Package } from "@phosphor-icons/react/dist/ssr/Package";
import { Code } from "@phosphor-icons/react/dist/ssr/Code";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { Badge } from "@/components/ui/badge";
import { DocSection } from "@/components/docs/doc-section";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "References",
  description:
    "The published research DermaDiff is built on, and the open-source models and libraries that make it reproducible.",
};

type Paper = {
  authors: string;
  title: string;
  venue: string;
  tag: string;
  url: string;
};

const PAPERS: Paper[] = [
  {
    authors: "Yan, S. et al.",
    title: "A multimodal vision foundation model for clinical dermatology",
    venue: "Nature Medicine, 2025",
    tag: "Classification",
    url: "https://www.nature.com/articles/s41591-024-03399-4",
  },
  {
    authors: "Sellergren, A. et al.",
    title: "MedGemma 1.5 Technical Report",
    venue: "arXiv:2604.05081, 2026",
    tag: "Explanation",
    url: "https://arxiv.org/abs/2604.05081",
  },
  {
    authors: "Stolz, W. et al.",
    title:
      "The ABCD rule of dermatoscopy: high prospective value in the diagnosis of doubtful melanocytic skin lesions",
    venue: "Journal of the American Academy of Dermatology 32(4), 1994",
    tag: "Explanation",
    url: "https://doi.org/10.1016/0190-9622(94)70061-3",
  },
  {
    authors: "Tschandl, P., Rosendahl, C. & Kittler, H.",
    title: "The HAM10000 dataset",
    venue: "Scientific Data 5, 180161, 2018",
    tag: "Dataset",
    url: "https://doi.org/10.1038/sdata.2018.161",
  },
  {
    authors: "Codella, N. et al.",
    title:
      "Skin Lesion Analysis Toward Melanoma Detection: 2018/2019 Challenge",
    venue: "ISIC Archive / arXiv:1902.03368",
    tag: "Dataset",
    url: "https://arxiv.org/abs/1902.03368",
  },
  {
    authors: "Pacheco, A. et al.",
    title:
      "PAD-UFES-20: A skin lesion dataset composed of patient data and clinical images collected from smartphones",
    venue: "Data in Brief 32, 106221, 2020",
    tag: "Dataset",
    url: "https://data.mendeley.com/datasets/zr7vgbcyr2/1",
  },
  {
    authors: "Rombach, R. et al.",
    title: "High-Resolution Image Synthesis with Latent Diffusion Models",
    venue: "CVPR, 2022",
    tag: "Diffusion",
    url: "https://arxiv.org/abs/2112.10752",
  },
  {
    authors: "Hu, E. et al.",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    venue: "ICLR, 2022",
    tag: "Fine-tuning",
    url: "https://arxiv.org/abs/2106.09685",
  },
  {
    authors: "Liu, S.-Y. et al.",
    title: "DoRA: Weight-Decomposed Low-Rank Adaptation",
    venue: "ICML, 2024",
    tag: "Fine-tuning",
    url: "https://arxiv.org/abs/2402.09353",
  },
  {
    authors: "Kim, M. et al.",
    title:
      "Diffusion-based skin disease data augmentation with fine-grained detail preservation",
    venue: "PLOS ONE 20(1), 2025",
    tag: "Augmentation",
    url: "https://doi.org/10.1371/journal.pone.0315498",
  },
  {
    authors: "Fayyad, J. et al.",
    title:
      "LesionGen: A Concept-Guided Diffusion Model for Dermatology Image Synthesis",
    venue: "MICCAI, 2025",
    tag: "Generation",
    url: "https://arxiv.org/abs/2507.23001",
  },
  {
    authors: "Unattributed",
    title:
      "SkinDualGen: Prompt-Driven Dual Generation of Skin Images and Masks",
    venue: "arXiv:2507.19970, 2025",
    tag: "Generation",
    url: "https://arxiv.org/abs/2507.19970",
  },
];

const TAG_COLORS: Record<string, string> = {
  Classification: "bg-violet-400/10 text-violet-700",
  Explanation: "bg-blue-400/10 text-blue-700",
  Dataset: "bg-slate-400/15 text-slate-700",
  Diffusion: "bg-emerald-400/10 text-emerald-700",
  "Fine-tuning": "bg-rose-400/10 text-rose-700",
  Augmentation: "bg-amber-400/10 text-amber-700",
  Generation: "bg-teal-400/10 text-teal-700",
};

type Resource = {
  name: string;
  org: string;
  description: string;
  tags: string[];
  url: string;
  kind: "model" | "library";
};

const RESOURCES: Resource[] = [
  {
    name: "PanDerm",
    org: "SiyuanYan1",
    description:
      "Official implementation of PanDerm, a multimodal vision foundation model for clinical dermatology. Used as the backbone classifier across all experiments in this project.",
    tags: ["Classifier", "Model"],
    url: "https://github.com/SiyuanYan1/PanDerm",
    kind: "model",
  },
  {
    name: "MedGemma 4B-IT",
    org: "Google",
    description:
      "Medical vision-language model that reads the original image, the attention heatmap, and the full probability spread to write the clinical rationale.",
    tags: ["Explanation", "Model"],
    url: "https://huggingface.co/google/medgemma-4b-it",
    kind: "model",
  },
  {
    name: "Stable Diffusion 2.1",
    org: "Stability AI",
    description:
      "Pretrained Stable Diffusion 2.1 base model (865M-parameter UNet). Fine-tuned with LoRA for Experiment B to generate synthetic dermoscopic images.",
    tags: ["Generator", "Model"],
    url: "https://huggingface.co/stabilityai/stable-diffusion-2-1",
    kind: "model",
  },
  {
    name: "Stable Diffusion XL Base 1.0",
    org: "Stability AI",
    description:
      "Pretrained SDXL base model (2.6B-parameter UNet with dual CLIP encoders). Fine-tuned with LoRA in Experiment C and DoRA in Experiment E.",
    tags: ["Generator", "Model"],
    url: "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
    kind: "model",
  },
  {
    name: "Stable Diffusion 3.5 Large",
    org: "Stability AI",
    description:
      "Pretrained SD 3.5 Large model (8.1B-parameter MMDiT architecture with a T5-XXL encoder). Fine-tuned with LoRA in Experiment D.",
    tags: ["Generator", "Model"],
    url: "https://huggingface.co/stabilityai/stable-diffusion-3.5-large",
    kind: "model",
  },
  {
    name: "diffusers",
    org: "Hugging Face",
    description:
      "Diffusion model library used to load, fine-tune, and run inference across all three Stable Diffusion variants.",
    tags: ["Library"],
    url: "https://github.com/huggingface/diffusers",
    kind: "library",
  },
  {
    name: "PEFT",
    org: "Hugging Face",
    description:
      "Parameter-efficient fine-tuning library providing the LoRA and DoRA implementations used across every generation experiment.",
    tags: ["Library"],
    url: "https://github.com/huggingface/peft",
    kind: "library",
  },
];

export default function ReferencesPage() {
  return (
    <>
      <div className="max-w-2xl">
        <div className="font-mono text-xs tracking-wide text-primary uppercase">
          References
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          What DermaDiff is built on.
        </h1>
        <p className="mt-3 text-muted-foreground">
          The published research behind the method, kept separate from the
          actual models and libraries the running product depends on.
        </p>
      </div>

      <DocSection id="papers" eyebrow="01" title="Papers">
        <div className="flex flex-col gap-3">
          {PAPERS.map((paper, i) => (
            <a
              key={paper.url}
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-5 text-foreground transition-colors hover:border-foreground/25"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">{paper.authors}</span>{" "}
                  &ldquo;{paper.title}&rdquo;
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {paper.venue}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("border-transparent", TAG_COLORS[paper.tag])}
                  >
                    {paper.tag}
                  </Badge>
                </div>
              </div>
            </a>
          ))}
        </div>
      </DocSection>

      <DocSection id="resources" eyebrow="02" title="Models & source code">
        <p>
          Open-source models and libraries that make this project
          reproducible. Each card links to the official upstream repository
          or model card.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {RESOURCES.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-border bg-background p-6 text-foreground transition-colors hover:border-foreground/25"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  {resource.kind === "model" ? (
                    <Package weight="bold" className="size-4" />
                  ) : (
                    <Code weight="bold" className="size-4" />
                  )}
                </span>
                <ArrowUpRight
                  weight="bold"
                  className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {resource.name}
              </h3>
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                {resource.org}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {resource.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </a>
          ))}
        </div>
      </DocSection>
    </>
  );
}
