export type Grid = {
  id: number;
  cells: { id: number; alive: boolean }[];
}[];

export function toBoolArray(grid: Grid): boolean[][] {
  return grid.map((row) => row.cells.map((cell) => cell.alive));
}

export function fromBoolArray(boolArray: boolean[][]): Grid {
  return boolArray.map((row, rowIndex) => ({
    id: rowIndex,
    cells: row.map((alive, colIndex) => ({
      id: colIndex,
      alive,
    })),
  }));
}

export function initialize(rows: number, cols: number, old?: Grid): Grid {
  return Array.from({ length: rows }, (_, rowIndex) => ({
    id: rowIndex,
    cells: Array.from({ length: cols }, (_, colIndex) => ({
      id: colIndex,
      alive: old?.[rowIndex]?.cells?.[colIndex]?.alive ?? false,
    })),
  }));
}

export function updateCell(grid: Grid, row: number, col: number, alive: boolean): Grid {
  //TODO: Create a deep copy. This is not the most efficient way to update a single cell, but it ensures immutability and triggers change detection properly.
  return grid.map((r) => ({
    ...r,
    cells: r.cells.map((c) => ({
      ...c,
      alive: r.id === row && c.id === col ? alive : c.alive,
    })),
  }));
}
