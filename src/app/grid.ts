export type Grid = {
  id: number;
  cells: { id: number, alive: boolean }[];
}[]


export function toBoolArray(grid: Grid): boolean[][] {
  return grid.map(row => row.cells.map(cell => cell.alive));
}

export function fromBoolArray(boolArray: boolean[][]): Grid {
    return boolArray.map((row, rowIndex) => ({
        id: rowIndex,
        cells: row.map((alive, colIndex) => ({
            id: colIndex,
            alive
        }))
    }));
}

export function initialize(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, (_, rowIndex) => ({
    id: rowIndex,
    cells: Array.from({ length: cols }, (_, colIndex) => ({
      id: colIndex,
      alive: false
    }))
  }));
}
