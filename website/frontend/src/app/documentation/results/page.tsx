import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocSection } from "@/components/docs/doc-section";
import { ConfusionMatrix } from "@/components/docs/confusion-matrix";
import {
  ChartLegend,
  GroupedBarChart,
  type BarGroup,
} from "@/components/docs/grouped-bar-chart";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Results",
  description:
    "The five-experiment comparison: accuracy, precision, recall, F1, confusion matrices, and synthetic image quality (FID, LPIPS, MS-SSIM), overall and per class.",
};

const EXPERIMENTS = [
  { id: "A", label: "No augmentation (baseline)" },
  { id: "B", label: "Stable Diffusion 2.1" },
  { id: "C", label: "Stable Diffusion XL" },
  { id: "D", label: "Stable Diffusion 3.5 Large" },
  { id: "E", label: "Stable Diffusion XL + DoRA" },
];

const AVG_DATA = [
  {
    exp: "A",
    accuracy: 0.8756,
    macroPrecision: 0.8489,
    weightedPrecision: 0.8863,
    macroRecall: 0.7955,
    weightedRecall: 0.8756,
    macroF1: 0.8114,
    weightedF1: 0.8785,
  },
  {
    exp: "B",
    accuracy: 0.8729,
    macroPrecision: 0.8493,
    weightedPrecision: 0.8918,
    macroRecall: 0.8166,
    weightedRecall: 0.8729,
    macroF1: 0.8218,
    weightedF1: 0.8786,
  },
  {
    exp: "C",
    accuracy: 0.8842,
    macroPrecision: 0.8607,
    weightedPrecision: 0.8987,
    macroRecall: 0.8311,
    weightedRecall: 0.8842,
    macroF1: 0.8409,
    weightedF1: 0.8891,
  },
  {
    exp: "D",
    accuracy: 0.8869,
    macroPrecision: 0.8769,
    weightedPrecision: 0.9011,
    macroRecall: 0.8318,
    weightedRecall: 0.8869,
    macroF1: 0.8482,
    weightedF1: 0.8913,
  },
  {
    exp: "E",
    accuracy: 0.8935,
    macroPrecision: 0.87,
    weightedPrecision: 0.9059,
    macroRecall: 0.836,
    weightedRecall: 0.893,
    macroF1: 0.8471,
    weightedF1: 0.8972,
  },
];

const RECALL_DATA = [
  { exp: "A", akiec: 0.7347, bcc: 0.9091, bkl: 0.8424, df: 0.5882, mel: 0.7126, nv: 0.9175, vasc: 0.8636 },
  { exp: "B", akiec: 0.7959, bcc: 0.9351, bkl: 0.8424, df: 0.5882, mel: 0.7964, nv: 0.8946, vasc: 0.8636 },
  { exp: "C", akiec: 0.8367, bcc: 0.8701, bkl: 0.8364, df: 0.7059, mel: 0.7904, nv: 0.9145, vasc: 0.8636 },
  { exp: "D", akiec: 0.7755, bcc: 0.8961, bkl: 0.8485, df: 0.7059, mel: 0.8204, nv: 0.9125, vasc: 0.8636 },
  { exp: "E", akiec: 0.816, bcc: 0.935, bkl: 0.867, df: 0.647, mel: 0.808, nv: 0.917, vasc: 0.864 },
];

const F1_DATA = [
  { exp: "A", akiec: 0.8, bcc: 0.8589, bkl: 0.7493, df: 0.7407, mel: 0.6879, nv: 0.9385, vasc: 0.9048 },
  { exp: "B", akiec: 0.8125, bcc: 0.8944, bkl: 0.7989, df: 0.7407, mel: 0.6717, nv: 0.9298, vasc: 0.9048 },
  { exp: "C", akiec: 0.8454, bcc: 0.8816, bkl: 0.8142, df: 0.8, mel: 0.6787, nv: 0.9397, vasc: 0.9268 },
  { exp: "D", akiec: 0.8444, bcc: 0.9079, bkl: 0.8211, df: 0.8, mel: 0.7008, nv: 0.9363, vasc: 0.9268 },
  { exp: "E", akiec: 0.842, bcc: 0.923, bkl: 0.824, df: 0.759, mel: 0.712, nv: 0.942, vasc: 0.927 },
];

const HEADLINE_CHART: BarGroup[] = [
  { label: "Accuracy", values: AVG_DATA.map((d) => d.accuracy) },
  { label: "Macro P", values: AVG_DATA.map((d) => d.macroPrecision) },
  { label: "Weighted P", values: AVG_DATA.map((d) => d.weightedPrecision) },
  { label: "Macro R", values: AVG_DATA.map((d) => d.macroRecall) },
  { label: "Weighted R", values: AVG_DATA.map((d) => d.weightedRecall) },
  { label: "Macro F1", values: AVG_DATA.map((d) => d.macroF1) },
  { label: "Weighted F1", values: AVG_DATA.map((d) => d.weightedF1) },
];

const RECALL_CHART: BarGroup[] = [
  { label: "akiec", values: RECALL_DATA.map((d) => d.akiec) },
  { label: "bcc", values: RECALL_DATA.map((d) => d.bcc) },
  { label: "bkl", values: RECALL_DATA.map((d) => d.bkl) },
  { label: "df", values: RECALL_DATA.map((d) => d.df) },
  { label: "mel", values: RECALL_DATA.map((d) => d.mel) },
  { label: "nv", values: RECALL_DATA.map((d) => d.nv) },
  { label: "vasc", values: RECALL_DATA.map((d) => d.vasc) },
];

const F1_CHART: BarGroup[] = [
  { label: "akiec", values: F1_DATA.map((d) => d.akiec) },
  { label: "bcc", values: F1_DATA.map((d) => d.bcc) },
  { label: "bkl", values: F1_DATA.map((d) => d.bkl) },
  { label: "df", values: F1_DATA.map((d) => d.df) },
  { label: "mel", values: F1_DATA.map((d) => d.mel) },
  { label: "nv", values: F1_DATA.map((d) => d.nv) },
  { label: "vasc", values: F1_DATA.map((d) => d.vasc) },
];

const GEN_QUALITY = [
  { exp: "B", fid: "139.5", lpips: "0.4253", mssim: "0.3349" },
  { exp: "C", fid: "175.0", lpips: "0.3980", mssim: "0.3881" },
  { exp: "D", fid: "235.0", lpips: "0.4981", mssim: "0.2834" },
  { exp: "E", fid: "177.6", lpips: "0.4851", mssim: "0.4098" },
];

const GEN_CLASSES = ["akiec", "bcc", "df", "mel", "vasc"] as const;

const FID_PER_CLASS = [
  { exp: "B", akiec: "129.6", bcc: "110.6", df: "213.2", mel: "104.3", vasc: "140.0" },
  { exp: "C", akiec: "174.7", bcc: "157.0", df: "177.1", mel: "105.9", vasc: "260.1" },
  { exp: "D", akiec: "400.2", bcc: "131.7", df: "227.3", mel: "136.2", vasc: "279.8" },
  { exp: "E", akiec: "217.1", bcc: "145.6", df: "218.0", mel: "146.4", vasc: "160.7" },
];

const LPIPS_PER_CLASS = [
  { exp: "B", akiec: "0.4086", bcc: "0.4689", df: "0.3274", mel: "0.5096", vasc: "0.4119" },
  { exp: "C", akiec: "0.4384", bcc: "0.4800", df: "0.3415", mel: "0.4202", vasc: "0.3101" },
  { exp: "D", akiec: "0.2363", bcc: "0.5852", df: "0.6080", mel: "0.5907", vasc: "0.4705" },
  { exp: "E", akiec: "0.5290", bcc: "0.5595", df: "0.4097", mel: "0.4994", vasc: "0.4280" },
];

const MSSIM_PER_CLASS = [
  { exp: "B", akiec: "0.1989", bcc: "0.3703", df: "0.3131", mel: "0.3015", vasc: "0.4907" },
  { exp: "C", akiec: "0.3784", bcc: "0.4358", df: "0.3400", mel: "0.3398", vasc: "0.4465" },
  { exp: "D", akiec: "0.3057", bcc: "0.3330", df: "0.2508", mel: "0.1980", vasc: "0.3294" },
  { exp: "E", akiec: "0.3694", bcc: "0.4444", df: "0.4358", mel: "0.3538", vasc: "0.4459" },
];

const CONFUSION_LABELS = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"];

const CONFUSION_A = [
  [36, 1, 7, 0, 4, 1, 0],
  [1, 70, 5, 0, 1, 0, 0],
  [4, 3, 139, 0, 6, 13, 0],
  [0, 2, 5, 10, 0, 0, 0],
  [0, 2, 23, 0, 119, 23, 0],
  [0, 7, 27, 0, 48, 923, 1],
  [0, 1, 0, 0, 1, 1, 19],
];

const CONFUSION_B = [
  [39, 1, 4, 0, 4, 1, 0],
  [1, 72, 2, 0, 2, 0, 0],
  [6, 2, 139, 0, 8, 10, 0],
  [0, 1, 5, 10, 1, 0, 0],
  [1, 1, 14, 0, 133, 18, 0],
  [0, 7, 18, 0, 80, 900, 1],
  [0, 0, 1, 0, 1, 1, 19],
];

const CONFUSION_C = [
  [41, 1, 4, 0, 1, 2, 0],
  [3, 67, 3, 0, 3, 1, 0],
  [4, 1, 138, 0, 13, 9, 0],
  [0, 1, 3, 12, 1, 0, 0],
  [0, 1, 15, 0, 132, 19, 0],
  [0, 4, 11, 1, 70, 920, 0],
  [0, 0, 0, 0, 2, 1, 19],
];

const CONFUSION_D = [
  [38, 1, 3, 0, 3, 4, 0],
  [0, 69, 3, 1, 1, 3, 0],
  [3, 1, 140, 0, 9, 12, 0],
  [0, 1, 3, 12, 1, 0, 0],
  [0, 1, 12, 0, 137, 17, 0],
  [0, 2, 14, 0, 72, 918, 0],
  [0, 0, 1, 0, 1, 1, 19],
];

const CONFUSION_E = [
  [40, 2, 3, 0, 2, 2, 0],
  [1, 69, 4, 0, 2, 1, 0],
  [5, 1, 139, 0, 8, 12, 0],
  [0, 2, 3, 11, 0, 1, 0],
  [2, 0, 15, 0, 125, 25, 0],
  [0, 2, 13, 0, 39, 952, 0],
  [0, 0, 0, 0, 1, 2, 19],
];

const CONFUSIONS = [
  { exp: "A", matrix: CONFUSION_A },
  { exp: "B", matrix: CONFUSION_B },
  { exp: "C", matrix: CONFUSION_C },
  { exp: "D", matrix: CONFUSION_D },
  { exp: "E", matrix: CONFUSION_E },
];

function pct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

function fmt4(v: number) {
  return v.toFixed(4);
}

export default function ResultsPage() {
  const bestAccuracy = Math.max(...AVG_DATA.map((d) => d.accuracy));
  const bestMacroRecall = Math.max(...AVG_DATA.map((d) => d.macroRecall));
  const bestMacroF1 = Math.max(...AVG_DATA.map((d) => d.macroF1));

  return (
    <>
      <div className="max-w-2xl">
        <div className="font-mono text-xs tracking-wide text-primary uppercase">
          Results
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          What augmentation actually changed.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Five PanDerm ViT-Large runs, identical in every respect except the
          training data. Final model selection weighted malignant-class
          recall over raw accuracy. The numbers below show why that
          distinction mattered.
        </p>
      </div>

      <DocSection id="headline" eyebrow="01" title="Headline metrics">
        <p>
          Stable Diffusion XL fine-tuned with DoRA (Experiment E) came out
          ahead on accuracy, weighted metrics, and macro recall, but the
          margin over the simpler variants is modest, and it didn&apos;t
          win on every axis: Experiment D takes macro F1 and macro
          precision.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Experiment</TableHead>
                <TableHead className="text-right">Accuracy</TableHead>
                <TableHead className="text-right">Macro P</TableHead>
                <TableHead className="text-right">Weighted P</TableHead>
                <TableHead className="text-right">Macro R</TableHead>
                <TableHead className="text-right">Weighted R</TableHead>
                <TableHead className="text-right">Macro F1</TableHead>
                <TableHead className="text-right">Weighted F1</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AVG_DATA.map((row) => (
                <TableRow key={row.exp}>
                  <TableCell className="font-medium text-foreground">
                    {row.exp}:{" "}
                    {EXPERIMENTS.find((e) => e.id === row.exp)?.label}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-mono",
                      row.accuracy === bestAccuracy &&
                        "font-semibold text-primary",
                    )}
                  >
                    {pct(row.accuracy)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.macroPrecision)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.weightedPrecision)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-mono",
                      row.macroRecall === bestMacroRecall &&
                        "font-semibold text-primary",
                    )}
                  >
                    {fmt4(row.macroRecall)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.weightedRecall)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-mono",
                      row.macroF1 === bestMacroF1 &&
                        "font-semibold text-primary",
                    )}
                  >
                    {fmt4(row.macroF1)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.weightedF1)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 rounded-lg border border-border p-5">
          <ChartLegend />
          <div className="mt-4">
            <GroupedBarChart
              data={HEADLINE_CHART}
              min={0.75}
              max={0.92}
              valueFormat={fmt4}
            />
          </div>
        </div>

        <p className="mt-4">
          Notably, macro recall (the metric that treats every class
          equally regardless of how common it is) improved monotonically
          from A through E, even in Experiment B, where raw accuracy
          briefly dipped below baseline. Accuracy is dominated by the
          majority nevi class; macro recall is not, which is precisely why
          it was weighted more heavily in model selection. Macro precision
          tells a related but distinct story: it peaks at Experiment D, not
          E, meaning DoRA&apos;s extra recall at E came with slightly more
          false positives spread across classes.
        </p>
      </DocSection>

      <DocSection id="per-class-recall" eyebrow="02" title="Per-class recall">
        <p>
          Recall (of the lesions that were actually a given class, how
          many did the model catch) is the number that matters most for
          the malignant and suspicious classes, where a miss is the
          costly failure mode.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exp</TableHead>
                <TableHead className="text-right">akiec</TableHead>
                <TableHead className="text-right">bcc</TableHead>
                <TableHead className="text-right">bkl</TableHead>
                <TableHead className="text-right">df</TableHead>
                <TableHead className="text-right">mel</TableHead>
                <TableHead className="text-right">nv</TableHead>
                <TableHead className="text-right">vasc</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECALL_DATA.map((row) => (
                <TableRow key={row.exp}>
                  <TableCell className="font-medium text-foreground">
                    {row.exp}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pct(row.akiec)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pct(row.bcc)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pct(row.bkl)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pct(row.df)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pct(row.mel)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pct(row.nv)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pct(row.vasc)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 rounded-lg border border-border p-5">
          <ChartLegend />
          <div className="mt-4">
            <GroupedBarChart data={RECALL_CHART} min={0.55} max={0.95} valueFormat={pct} />
          </div>
        </div>

        <ul className="mt-5 flex flex-col gap-3">
          <li className="flex gap-2.5 text-sm">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-risk-high-foreground" />
            <span>
              <strong className="text-foreground">Melanoma recall</strong>{" "}
              rose from 71.3% (baseline) to a high of 82.0% under SD 3.5
              Large augmentation, the single largest swing on the class
              where a miss matters most.
            </span>
          </li>
          <li className="flex gap-2.5 text-sm">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-risk-moderate-foreground" />
            <span>
              <strong className="text-foreground">
                Actinic keratosis and dermatofibroma
              </strong>{" "}
              (the two most data-starved classes) saw the clearest,
              most consistent gains across every augmented experiment:
              akiec recall reached 83.7% (from 73.5%), df reached 70.6%
              (from 58.8%).
            </span>
          </li>
          <li className="flex gap-2.5 text-sm">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
            <span>
              <strong className="text-foreground">
                Basal cell carcinoma recall didn&apos;t improve uniformly.
              </strong>{" "}
              It dropped under SDXL-LoRA (87.0%) and SD 3.5 (89.6%)
              relative to the 90.9% baseline, but held at ~93.5% under
              both SD 2.1 and SDXL+DoRA. Swapping LoRA for DoRA on the
              same SDXL backbone (C → E) recovered exactly the recall
              LoRA had cost.
            </span>
          </li>
          <li className="flex gap-2.5 text-sm">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
            <span>
              <strong className="text-foreground">
                Vascular lesion recall barely moved
              </strong>{" "}
              (86.3–86.4% in every experiment). It was already the
              easiest minority class to separate.
            </span>
          </li>
        </ul>
      </DocSection>

      <DocSection id="per-class-f1" eyebrow="03" title="Per-class F1">
        <p>
          Recall alone can hide a precision cost. F1 (the harmonic mean of
          precision and recall) catches cases where a class gained recall
          but only by producing more false positives elsewhere.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exp</TableHead>
                <TableHead className="text-right">akiec</TableHead>
                <TableHead className="text-right">bcc</TableHead>
                <TableHead className="text-right">bkl</TableHead>
                <TableHead className="text-right">df</TableHead>
                <TableHead className="text-right">mel</TableHead>
                <TableHead className="text-right">nv</TableHead>
                <TableHead className="text-right">vasc</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {F1_DATA.map((row) => (
                <TableRow key={row.exp}>
                  <TableCell className="font-medium text-foreground">
                    {row.exp}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.akiec)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.bcc)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.bkl)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.df)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.mel)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.nv)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt4(row.vasc)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 rounded-lg border border-border p-5">
          <ChartLegend />
          <div className="mt-4">
            <GroupedBarChart data={F1_CHART} min={0.6} max={0.95} valueFormat={fmt4} />
          </div>
        </div>

        <p className="mt-4">
          Melanoma is the case in point: recall climbs from 71.3% to 79.6%
          between Experiments A and B, but melanoma F1 actually{" "}
          <em>drops</em>, from 0.6879 to 0.6717. SD 2.1 augmentation
          bought recall by trading away precision, more lesions correctly
          flagged as melanoma, but also more false alarms. That tradeoff
          only clears once SD 3.5 Large and DoRA are in the mix (D and E
          both push melanoma F1 back above baseline, to 0.70–0.71),
          which is one reason final model selection didn&apos;t stop at
          the first augmentation experiment that improved recall.
        </p>
      </DocSection>

      <DocSection id="confusion" eyebrow="04" title="Confusion matrices">
        <p>
          Rows are the actual class, columns the predicted class. The
          diagonal is correct calls. All five experiments share the same
          split and evaluation protocol, so the movement between them is
          attributable to the training data alone.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {CONFUSIONS.map(({ exp, matrix }) => (
            <ConfusionMatrix
              key={exp}
              title={`Experiment ${exp}: ${EXPERIMENTS.find((e) => e.id === exp)?.label}`}
              labels={CONFUSION_LABELS}
              matrix={matrix}
            />
          ))}
        </div>
        <p className="mt-5">
          The clearest shift is melanoma (row <code>mel</code>): the
          baseline correctly calls 119 of 167 melanoma cases, with 23
          misread as benign keratosis and 23 as nevi. Experiment D
          correctly calls 137, cutting both confusions roughly in half
          (12 misread as bkl, 17 as nevi). Actinic keratosis follows the
          same pattern: true positives rise from 36 to 38 out of 49 by
          Experiment D, and 40 by Experiment E. Across all five matrices,
          the dominant confusion never changes: benign keratosis and nevi
          absorb most of melanoma&apos;s misses, which is the expected
          failure mode for pigmented lesions rather than a new one
          introduced by augmentation.
        </p>
      </DocSection>

      <DocSection
        id="generation-quality"
        eyebrow="05"
        title="Synthetic image quality"
      >
        <p>
          FID and LPIPS measure how close the synthetic distribution is to
          real dermoscopic images (lower is closer). MS-SSIM measures
          structural similarity to real references. These are properties
          of the generator alone, independent of the downstream
          classifier.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Experiment</TableHead>
                <TableHead className="text-right">FID ↓</TableHead>
                <TableHead className="text-right">LPIPS ↓</TableHead>
                <TableHead className="text-right">MS-SSIM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GEN_QUALITY.map((row) => (
                <TableRow key={row.exp}>
                  <TableCell className="font-medium text-foreground">
                    {row.exp}:{" "}
                    {EXPERIMENTS.find((e) => e.id === row.exp)?.label}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.fid}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.lpips}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.mssim}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-4">
          The generator with the best (lowest) FID (SD 2.1, at 139.5)
          was not the one that produced the best downstream classifier.
          SDXL+DoRA had a middling FID (177.6) but the best accuracy and
          macro recall of any experiment. Realistic-looking synthetic
          images and{" "}
          <em>classification-useful</em> synthetic images turned out to be
          related but distinct properties.
        </p>

        <h3 className="mt-8 text-sm font-medium text-foreground">
          FID by target class
        </h3>
        <p className="mt-2">
          Only the five minority classes were augmented, so generation
          quality is reported per class, not per the full seven-way
          taxonomy.
        </p>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exp</TableHead>
                {GEN_CLASSES.map((c) => (
                  <TableHead key={c} className="text-right">
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {FID_PER_CLASS.map((row) => (
                <TableRow key={row.exp}>
                  <TableCell className="font-medium text-foreground">
                    {row.exp}
                  </TableCell>
                  {GEN_CLASSES.map((c) => (
                    <TableCell key={c} className="text-right font-mono">
                      {row[c]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <h3 className="mt-6 text-sm font-medium text-foreground">
          LPIPS by target class
        </h3>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exp</TableHead>
                {GEN_CLASSES.map((c) => (
                  <TableHead key={c} className="text-right">
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {LPIPS_PER_CLASS.map((row) => (
                <TableRow key={row.exp}>
                  <TableCell className="font-medium text-foreground">
                    {row.exp}
                  </TableCell>
                  {GEN_CLASSES.map((c) => (
                    <TableCell key={c} className="text-right font-mono">
                      {row[c]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <h3 className="mt-6 text-sm font-medium text-foreground">
          MS-SSIM by target class
        </h3>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exp</TableHead>
                {GEN_CLASSES.map((c) => (
                  <TableHead key={c} className="text-right">
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {MSSIM_PER_CLASS.map((row) => (
                <TableRow key={row.exp}>
                  <TableCell className="font-medium text-foreground">
                    {row.exp}
                  </TableCell>
                  {GEN_CLASSES.map((c) => (
                    <TableCell key={c} className="text-right font-mono">
                      {row[c]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-4">
          The per-class breakdown sharpens the point above rather than
          softening it. SD 3.5 Large&apos;s akiec generator has by far the
          worst FID of any class in any experiment (400.2, more than
          double the next worst), yet Experiment D still reaches the
          second-highest akiec recall (77.6%) of the five runs. Melanoma
          FID, by contrast, stays low and tight across every generator
          (104–146), the most consistently realistic class regardless of
          which diffusion model produced it.
        </p>
      </DocSection>
    </>
  );
}
