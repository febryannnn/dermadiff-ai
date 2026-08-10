"use client";

import { useRef, useState } from "react";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import { Reveal } from "@/components/reveal";

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  return (
    <section className="dark bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <div className="font-mono text-xs tracking-wide text-primary uppercase">
              Product walkthrough
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Watch a reading happen, start to finish.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="group relative mt-10 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-card">
            <video
              ref={videoRef}
              src="/video-demo.mov"
              controls={started}
              playsInline
              className="size-full object-cover"
            />
            {!started && (
              <button
                type="button"
                aria-label="Play product walkthrough video"
                onClick={() => {
                  setStarted(true);
                  videoRef.current?.play();
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-105">
                  <Play weight="fill" className="size-6 translate-x-0.5" />
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
