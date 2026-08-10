import type { ReactNode } from "react";

export function DocSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-border py-12 first:border-t-0 first:pt-0"
    >
      <div className="font-mono text-xs tracking-wide text-primary uppercase">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5 text-[15px] leading-relaxed text-foreground/85 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p+p]:mt-4">
        {children}
      </div>
    </section>
  );
}
