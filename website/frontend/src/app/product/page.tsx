import type { Metadata } from "next";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Classifier } from "@/components/product/classifier";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Upload a dermoscopic image and get a seven-class PanDerm prediction, an attention-rollout heatmap, and a MedGemma-written clinical rationale.",
};

export default function ProductPage() {
  return (
    <div className="pt-12 sm:pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="font-mono text-xs tracking-wide text-primary uppercase">
            Product
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Upload a dermoscopic image.
          </h1>
          <p className="mt-3 mb-5 text-muted-foreground">
            PanDerm classifies the lesion and localizes its own attention;
            MedGemma reads both, alongside the full probability spread, and
            writes the rationale.
          </p>
        </div>

        {/* <Alert className="mt-8 mb-10">
          <WarningCircle weight="bold" />
          <AlertTitle>Decision support, not a diagnosis</AlertTitle>
          <AlertDescription>
            This is a research prototype for a qualified clinician&apos;s use, not
            a certified medical device. It accepts dermoscope-captured images
            only. Plain smartphone photos aren&apos;t yet supported, since
            cross-domain accuracy hasn&apos;t been validated for safe triage.
            DermaDiff never states that a lesion is safe; it only ever
            escalates.
          </AlertDescription>
        </Alert> */}
      </div>

      <Classifier />
    </div>
  );
}
