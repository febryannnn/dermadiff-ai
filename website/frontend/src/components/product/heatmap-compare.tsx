"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowsLeftRight } from "@phosphor-icons/react/dist/ssr/ArrowsLeftRight";
import { cn } from "@/lib/utils";

export function HeatmapCompare({
  originalSrc,
  heatmapSrc,
}: {
  originalSrc: string;
  heatmapSrc: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-square w-full touch-none overflow-hidden rounded-xl border border-border bg-card select-none"
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heatmapSrc}
          alt="Attention rollout heatmap"
          className="absolute inset-0 size-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalSrc}
            alt="Original dermoscopic image"
            className="absolute inset-0 size-full object-cover"
            draggable={false}
          />
        </div>

        <div
          className="absolute inset-y-0 z-10 w-[2px] bg-background"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md">
            <ArrowsLeftRight weight="bold" className="size-4 text-foreground" />
          </div>
        </div>

        <span className="absolute top-3 left-3 rounded-md bg-background/85 px-2 py-1 font-mono text-[10px] tracking-wide text-foreground uppercase backdrop-blur-sm">
          Original
        </span>
        <span className="absolute top-3 right-3 rounded-md bg-background/85 px-2 py-1 font-mono text-[10px] tracking-wide text-foreground uppercase backdrop-blur-sm">
          Heatmap
        </span>
      </div>
      <p
        className={cn(
          "mt-2 text-center text-xs text-muted-foreground",
        )}
      >
        Drag to compare the original image against the attention rollout
        heatmap.
      </p>
    </div>
  );
}
