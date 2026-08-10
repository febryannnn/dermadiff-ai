import { Hero } from "@/components/home/hero";
import { VideoSection } from "@/components/home/video-section";
import { InteractiveDemo } from "@/components/home/interactive-demo";
import { StatsSection } from "@/components/home/stats-section";
import { ValuePropsSection } from "@/components/home/value-props-section";
import { CredibilitySection } from "@/components/home/credibility-section";
import { TechStackSection } from "@/components/home/tech-stack-section";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <VideoSection />
      <InteractiveDemo />
      <StatsSection />
      <ValuePropsSection />
      <CredibilitySection />
      <TechStackSection />
      <FinalCta />
    </>
  );
}
