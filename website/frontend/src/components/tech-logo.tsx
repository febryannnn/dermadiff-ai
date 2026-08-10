import Image from "next/image";

const DIMENSIONS = {
  "/nextjs.jpeg": { width: 1176, height: 1056 },
  "/react.webp": { width: 1280, height: 1139 },
  "/tailwind.webp": { width: 800, height: 302 },
  "/modal.svg": { width: 1024, height: 192 },
  "/fast_api.png": { width: 1024, height: 369 },
  "/medgemma.png": { width: 1300, height: 731 },
  "/hf.webp": { width: 960, height: 256 },
} as const;

export type LogoSrc = keyof typeof DIMENSIONS;

export function TechLogo({ src, alt }: { src: LogoSrc; alt: string }) {
  const { width, height } = DIMENSIONS[src];
  return (
    <span className="inline-flex h-14 items-center justify-center rounded-xl border border-black/10 bg-white px-5 shadow-sm">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-7 w-auto object-contain"
      />
    </span>
  );
}
