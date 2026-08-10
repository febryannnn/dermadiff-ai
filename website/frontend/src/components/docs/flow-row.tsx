import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

export function FlowRow({ nodes }: { nodes: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-3">
      {nodes.map((node, i) => (
        <div key={node} className="flex items-center gap-1.5">
          <span className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
            {node}
          </span>
          {i < nodes.length - 1 && (
            <CaretRight
              weight="bold"
              className="size-3.5 shrink-0 text-muted-foreground"
            />
          )}
        </div>
      ))}
    </div>
  );
}
