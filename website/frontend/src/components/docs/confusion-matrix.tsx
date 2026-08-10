export function ConfusionMatrix({
  title,
  labels,
  matrix,
}: {
  title: string;
  labels: string[];
  matrix: number[][];
}) {
  return (
    <div>
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-3 overflow-x-auto">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-1.5" />
              {labels.map((label) => (
                <th
                  key={label}
                  className="p-1.5 font-mono font-normal text-muted-foreground"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => {
              const rowSum = row.reduce((a, b) => a + b, 0);
              return (
                <tr key={labels[i]}>
                  <th className="p-1.5 pr-3 text-right font-mono font-normal text-muted-foreground">
                    {labels[i]}
                  </th>
                  {row.map((value, j) => {
                    const ratio = rowSum ? value / rowSum : 0;
                    const isDiagonal = i === j;
                    return (
                      <td
                        key={j}
                        className={
                          isDiagonal
                            ? "p-1.5 text-center font-mono tabular-nums font-semibold text-foreground"
                            : "p-1.5 text-center font-mono tabular-nums text-foreground/70"
                        }
                        style={{
                          backgroundColor: `color-mix(in oklab, var(--heat) ${Math.round(ratio * 85)}%, transparent)`,
                        }}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Rows: actual class. Columns: predicted class.
      </p>
    </div>
  );
}
