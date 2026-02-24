import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameEngine {
  #grid = signal<boolean[][]>([]);
  #rows = signal(0);
  #cols = signal(0);
  #running = signal(false);
  #intervalId: ReturnType<typeof setInterval> | undefined;

  public rows = this.#rows.asReadonly();
  public cols = this.#cols.asReadonly();
  public grid = this.#grid.asReadonly();
  public running = this.#running.asReadonly();

  public initialize(rows: number, cols: number, initialState: boolean[][]) {
    this.#rows.set(rows);
    this.#cols.set(cols);
    //Create a deep copy of the initial state to avoid mutating the original array
    this.#grid.set(initialState.map(row => [...row]));
  }

  public run(speed: number = 100) {
    this.#intervalId = setInterval(() => {
      this.update();
    }, speed);
    this.#running.set(true);
  }

  public stop() {
    if (this.#intervalId === undefined) return;
    clearInterval(this.#intervalId);
    this.#intervalId = undefined;
    this.#running.set(false);
  }

  private update() {
    const currentGrid = this.#grid();
    const nextGrid = Array.from({ length: this.rows() }, () => Array<boolean>(this.cols()).fill(false));
    for (let row = 0; row < this.rows(); row++) {
      for (let col = 0; col < this.cols(); col++) {
        nextGrid[row][col] = this.wilBeAlive(currentGrid, row, col);
      }
    }
    this.#grid.set(nextGrid);
    console.log('Grid updated, currently alive cells:', nextGrid.flat().filter(cell => cell).length);
  }

  private wilBeAlive(grid: boolean[][], row: number, col: number): boolean {
    const wasAlive = grid[row][col];
    let livingNeighbors = this.countLivingNeighbors(grid, row, col);
    return livingNeighbors === 3 || (wasAlive && livingNeighbors === 2);
  }

  private countLivingNeighbors(grid: boolean[][], row: number, col: number): number {
    let livingNeighbors = 0;

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        if (rowOffset === 0 && colOffset === 0) continue; // Current cell is irrelevant
        const neighborRow = row + rowOffset;
        const neighborCol = col + colOffset;

        //TODO: What to do at boundaries? For now we just skip assume everything outside as dead, but we could also consider the grid to be slightly larger and wrap around, or we could mirror the edge values.
        if (neighborRow < 0) continue; // Skip out of bounds rows
        if (neighborRow >= this.rows()) continue; // Skip out of bounds rows
        if (neighborCol < 0) continue; // Skip out of bounds cols
        if (neighborCol >= this.cols()) continue; // Skip out of bounds cols
        if (!grid[neighborRow][neighborCol]) continue; // Skip dead neighbors
        livingNeighbors++;
      }
    }
    return livingNeighbors;
  }
}
