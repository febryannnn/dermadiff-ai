import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DermaDiff · Interpretable skin lesion triage",
    template: "%s · DermaDiff",
  },
  description:
    "DermaDiff pairs a PanDerm vision transformer, trained with Stable Diffusion-augmented dermoscopic data, with MedGemma-generated clinical explanations, a fast, explainable second opinion for clinicians reading dermoscopy.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={150}>
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}
