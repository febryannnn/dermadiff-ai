export type GridCell = {
  row: number;
  col: number;
  intensity: number;
};

/**
 * Deterministic synthetic "attention" field over a patch grid — two soft
 * gaussian foci, echoing PanDerm's attention-rollout heatmap over its
 * 14x14 patch tokens. Pure math so server and client render identically
 * (no Math.random / Date.now — avoids hydration mismatches).
 */
export function buildHeatGrid(rows: number, cols: number): GridCell[] {
  const focus1 = { row: rows * 0.42, col: cols * 0.58, sigma: rows * 0.16 };
  const focus2 = { row: rows * 0.6, col: cols * 0.38, sigma: rows * 0.11 };

  const cells: GridCell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const d1 = Math.hypot(row - focus1.row, col - focus1.col);
      const d2 = Math.hypot(row - focus2.row, col - focus2.col);
      const g1 = Math.exp(-(d1 * d1) / (2 * focus1.sigma * focus1.sigma));
      const g2 =
        0.75 * Math.exp(-(d2 * d2) / (2 * focus2.sigma * focus2.sigma));
      cells.push({ row, col, intensity: Math.max(g1, g2) });
    }
  }
  return cells;
}

export function topCells(cells: GridCell[], count: number): Set<string> {
  const sorted = [...cells].sort((a, b) => b.intensity - a.intensity);
  return new Set(sorted.slice(0, count).map((c) => `${c.row}-${c.col}`));
}
