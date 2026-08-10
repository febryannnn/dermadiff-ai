import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DocSection } from "@/components/docs/doc-section";
import { CLASS_INFO, TIER_STYLES } from "@/lib/classes";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "How DermaDiff is built: pipeline, models, datasets, results, the team, and references, plus the class reference, limitations, and API used by the product.",
};

const DOC_LINKS = [
  {
    href: "/documentation/methodology",
    title: "Methodology",
    description:
      "The training and inference pipeline, PanDerm/MedGemma/Stable Diffusion specs, datasets, and the attention-rollout explainability method.",
  },
  {
    href: "/documentation/results",
    title: "Results",
    description:
      "The five-experiment comparison, accuracy and per-class recall, confusion matrices, and synthetic image quality metrics.",
  },
  {
    href: "/documentation/team",
    title: "Team",
    description:
      "Who built DermaDiff, and the one-week sprint the three parallel tracks ran on.",
  },
  {
    href: "/documentation/references",
    title: "References",
    description:
      "The published research DermaDiff is built on and validated against.",
  },
];

function DocCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="dark group flex flex-col justify-between rounded-xl border border-border bg-background p-5 text-foreground transition-colors hover:border-foreground/20"
    >
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
        Read
        <ArrowRight
          weight="bold"
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/40 p-4 font-mono text-[12.5px] leading-relaxed text-foreground">
      <code>{children}</code>
    </pre>
  );
}

export default function DocumentationPage() {
  return (
    <>
      <div className="max-w-2xl">
        <div className="font-mono text-xs tracking-wide text-primary uppercase">
          Documentation
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          How DermaDiff is built.
        </h1>
        <p className="mt-3 text-muted-foreground">
          DermaDiff is a clinical decision-support framework for
          interpretable skin lesion triage. It fine-tunes Stable Diffusion
          per minority class to synthesize additional dermoscopic training
          images, uses the resulting augmented dataset to fine-tune a
          PanDerm ViT-Large classifier, and pairs every prediction with a
          MedGemma-written clinical rationale grounded in the
          classifier&apos;s own attention pattern. It is positioned as a
          fast, always-available second opinion for clinicians with
          dermoscope access. The clinician remains the accountable
          decision-maker in every case.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DOC_LINKS.map((link) => (
          <DocCard key={link.href} {...link} />
        ))}
      </div>

      <DocSection id="classes" eyebrow="Reference" title="Class reference">
        <p>
          Classification is limited to the seven-category HAM10000 taxonomy.
          DermaDiff&apos;s tiering below reflects clinical concern, not model
          confidence. A low-tier prediction is never presented as a clean
          bill of health.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(CLASS_INFO).map((info) => (
                <TableRow key={info.code}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {info.code}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {info.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={TIER_STYLES[info.tier].badge}
                      variant="outline"
                    >
                      {info.note}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DocSection>

      <DocSection id="limitations" eyebrow="Reference" title="Limitations">
        <ul className="flex flex-col gap-3">
          {[
            "Dermoscope images only. Plain smartphone photos aren't supported yet. Cross-domain evaluation on PAD-UFES-20 showed accuracy degradation that isn't safe for triage.",
            "Classification is limited to the seven HAM10000 categories; a lesion outside that taxonomy has no correct label to predict.",
            "This is decision support, not a replacement for evaluation by a qualified clinician.",
            "Model selection during development prioritized sensitivity on the malignant classes over aggregate accuracy. DermaDiff would rather over-flag than miss a melanoma.",
          ].map((item) => (
            <li key={item} className="flex gap-2.5 text-sm">
              <WarningCircle
                weight="bold"
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="api" eyebrow="Reference" title="API reference">
        <p>
          The product page calls these endpoints directly from the browser.
          All three are hosted on Modal, alongside the model weights, so
          there is no separate backend to run.
        </p>

        <h3 className="mt-6 text-sm font-medium text-foreground">
          POST /api/classify
        </h3>
        <p className="mt-2">
          Runs PanDerm ViT-Large on an uploaded image and returns the
          probability distribution and the attention-rollout heatmap, JPEG
          encoded and capped at 512px on the long edge.
        </p>
        <div className="mt-3">
          <CodeBlock>{`Content-Type: multipart/form-data
image: <file>

→ 200 OK
{
  "probs": { "mel": 0.62, "nv": 0.21, "bkl": 0.09, ... },
  "predicted_class": "mel",
  "predicted_prob": 0.62,
  "heatmap_b64": "/9j/4AAQSkZJRgABAQAAAQABAAD...",
  "heatmap_mime": "image/jpeg",
  "heatmap_png_b64": "/9j/4AAQSkZJRgABAQAAAQABAAD..."
}`}</CodeBlock>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          heatmap_png_b64 is kept as an alias of heatmap_b64 for older
          callers, despite the name: read heatmap_mime rather than assuming
          PNG.
        </p>

        <h3 className="mt-8 text-sm font-medium text-foreground">
          POST /api/explain_stream
        </h3>
        <p className="mt-2">
          Streams MedGemma 4B-IT&apos;s written rationale over the same
          image, the heatmap, and the classification result, as
          server-sent events. This is what the product page uses, so the
          explanation renders as it&apos;s written instead of after the
          full generation finishes.
        </p>
        <div className="mt-3">
          <CodeBlock>{`Content-Type: multipart/form-data
image: <file>
panderm_result: <JSON string (the response body from /api/classify)>

→ 200 OK, Content-Type: text/event-stream
data: {"delta": "1. ABCD rule "}

data: {"delta": "assessment\\n..."}

data: [DONE]`}</CodeBlock>
        </div>

        <h3 className="mt-8 text-sm font-medium text-foreground">
          POST /api/explain
        </h3>
        <p className="mt-2">
          Non-streaming counterpart to /api/explain_stream: same inputs,
          returns the complete written rationale in one response.
        </p>
        <div className="mt-3">
          <CodeBlock>{`Content-Type: multipart/form-data
image: <file>
panderm_result: <JSON string (the response body from /api/classify)>

→ 200 OK
{
  "explanation": "1. ABCD rule assessment\\n..."
}`}</CodeBlock>
        </div>
      </DocSection>

      <DocSection id="citation" eyebrow="Reference" title="Citation">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="font-mono text-[12.5px] leading-relaxed text-foreground/85">
            M. I. Rusdi, A. F. Ghiffari P.A., and J. Kumarkono.
            &ldquo;DermaDiff: Deteksi Kanker Kulit secara Interpretatif
            melalui Optimisasi Vision Foundation Model dengan Augmentasi
            Sintetis Berbasis Stable Diffusion.&rdquo; Department of
            Informatics, Institut Teknologi Sepuluh Nopember, 2026.
          </p>
        </div>
        <p className="mt-4">
          See <Link href="/documentation/references">references</Link> for
          the full reading list, or{" "}
          <Link href="/documentation/team">the team</Link> for who built it.
        </p>
      </DocSection>
    </>
  );
}
