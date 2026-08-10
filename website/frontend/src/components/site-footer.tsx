import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";

const PAGE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Product" },
  { href: "/documentation", label: "Documentation" },
  { href: "/experiences", label: "Experiences" },
];

const BUILT_ON = [
  {
    label: "PanDerm ViT-Large",
    href: "https://github.com/SiyuanYan1/PanDerm",
  },
  {
    label: "PanDerm · Nature Medicine, 2025",
    href: "https://www.nature.com/articles/s41591-024-03399-4",
  },
  {
    label: "MedGemma 4B-IT",
    href: "https://huggingface.co/google/medgemma-4b-it",
  },
  {
    label: "HAM10000 dataset",
    href: "https://doi.org/10.1038/sdata.2018.161",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_0.8fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoMark className="size-5" />
              <span className="text-xl font-semibold tracking-tight">
                DermaDiff
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              An interpretable clinical decision-support tool for dermoscopic
              skin lesion triage, a synthesis-augmented PanDerm classifier
              paired with MedGemma-generated clinical explanations.
            </p>
            {/* <div className="mt-5 flex gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3">
              <WarningCircle
                weight="bold"
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Research prototype. Decision support only, not a diagnosis,
                and not a substitute for evaluation by a qualified clinician.
              </p>
            </div> */}
          </div>

          <div>
            <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Site
            </div>
            <ul className="mt-3 space-y-2.5">
              {PAGE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Built on
            </div>
            <ul className="mt-3 space-y-2.5">
              {BUILT_ON.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            DermaDiff: M. I. Rusdi, A. F. Ghiffari P.A., J. Kumarkono ·
            Department of Informatics, Institut Teknologi Sepuluh Nopember
          </p>
          <p>Not a certified medical device.</p>
        </div>
      </div>
    </footer>
  );
}
