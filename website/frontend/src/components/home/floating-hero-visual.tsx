"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "motion/react";

function Float({
  children,
  duration,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  duration: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.05, y: -8, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

// Pre-rendered 3D card mockups (transparent PNG, 3600x2025). The shadow,
// bevel, and every label are already baked into each image, so these are
// placed directly with no extra chrome.
const CARDS = [
  {
    src: "/3.png",
    alt: "Dermoscopic lesion photo in a frame labeled lesion_0192.jpg",
    className: "absolute top-0 left-0 w-[240px] rotate-[-6deg]",
    duration: 7,
  },
  {
    src: "/1.png",
    alt: "Classification result card showing Melanoma at 62.4% confidence",
    className: "absolute top-0 right-0 z-20 w-[320px] rotate-[5deg]",
    duration: 8.5,
    delay: 0.4,
  },
  {
    src: "/4.png",
    alt: "Diagram of a latent diffusion model architecture",
    className: "absolute top-[36%] left-[27%] z-30 w-[280px] rotate-[-3deg]",
    duration: 6,
    delay: 0.25,
  },
  {
    src: "/2.png",
    // Source render came out upside down. 180deg corrects it, combined
    // with the same slight scattered tilt as the other cards.
    alt: "Dermoscopic lesion photo in a frame labeled lesion_1362.jpg",
    className: "absolute bottom-0 left-2 w-[290px] rotate-[0deg]",
    duration: 9,
    delay: 0.15,
  },
  {
    src: "/5.png",
    alt: "Terminal-style panel showing the explain API drafting a clinical rationale",
    className: "absolute right-0 bottom-0 z-20 w-[250px] rotate-[6deg]",
    duration: 7.5,
    delay: 0.6,
  },
];

export const FloatingHeroVisual = memo(function FloatingHeroVisual() {
  return (
    <div className="relative hidden h-[540px] w-full lg:block">
      <svg
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
        aria-hidden="true"
      >
        <line
          x1="28%"
          y1="22%"
          x2="40%"
          y2="38%"
          className="stroke-foreground/15"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <line
          x1="56%"
          y1="38%"
          x2="68%"
          y2="14%"
          className="stroke-foreground/15"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <line
          x1="40%"
          y1="54%"
          x2="22%"
          y2="70%"
          className="stroke-foreground/15"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <line
          x1="60%"
          y1="52%"
          x2="76%"
          y2="70%"
          className="stroke-foreground/15"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      </svg>

      {CARDS.map((card) => (
        <Float
          key={card.src}
          duration={card.duration}
          delay={card.delay}
          className={card.className}
        >
          <Image
            src={card.src}
            alt={card.alt}
            width={720}
            height={405}
            className="h-auto w-full"
          />
        </Float>
      ))}
    </div>
  );
});
