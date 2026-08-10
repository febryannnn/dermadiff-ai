import { cn } from "@/lib/utils";

/**
 * Small 3x3 patch grid — a literal nod to PanDerm's patch-token attention
 * mechanism (the product's actual classification unit), not a decorative
 * abstract mark.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => {
          const isHot = (row === 0 && col === 2) || (row === 1 && col === 1);
          return (
            <rect
              key={`${row}-${col}`}
              x={col * 8.5 + 1}
              y={row * 8.5 + 1}
              width="6"
              height="6"
              rx="1.25"
              className={isHot ? "fill-heat" : "fill-current opacity-20"}
            />
          );
        }),
      )}
    </svg>
  );
}
