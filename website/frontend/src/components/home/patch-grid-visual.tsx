"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { buildHeatGrid, topCells } from "@/lib/heatgrid";

const ROWS = 9;
const COLS = 12;
const cells = buildHeatGrid(ROWS, COLS);
const pulsing = topCells(cells, 3);

// Browsers store CSS <number> values (incl. inline `opacity`) at ~float32
// precision, silently rounding anything set beyond it. The raw JS double
// from the gaussian intensity calc has 16 significant digits, so the value
// baked into the SSR HTML round-trips through the browser's CSS engine at a
// different rounding than the fresh 16-digit float the client computes on
// hydration — a mismatch neither React nor Next.js is doing directly.
// Rounding here keeps both renders within float32's safe range.
function round4(value: number) {
  return Math.round(value * 10000) / 10000;
}

export const PatchGridVisual = memo(function PatchGridVisual() {
  return (
    <div className="relative">
      <div className="absolute -top-3 -left-3 z-10 rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
        Attention rollout · 108 patches
      </div>
      <div
        className="grid gap-[3px] rounded-2xl border border-border bg-card p-4 shadow-[0_30px_60px_-30px_rgba(28,20,16,0.18)]"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {cells.map(({ row, col, intensity }) => {
          const key = `${row}-${col}`;
          const isPulsing = pulsing.has(key);
          const opacity = round4(Math.min(intensity * 1.05, 1));
          return (
            <div
              key={key}
              className="relative aspect-square rounded-[3px] bg-foreground/[0.05]"
            >
              {intensity > 0.08 &&
                (isPulsing ? (
                  <motion.div
                    className="absolute inset-0 rounded-[3px] bg-heat"
                    initial={{ opacity }}
                    animate={{
                      opacity: [opacity, round4(opacity * 0.55), opacity],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: (row + col) * 0.06,
                    }}
                  />
                ) : (
                  <div
                    className="absolute inset-0 rounded-[3px] bg-heat"
                    style={{ opacity }}
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});
