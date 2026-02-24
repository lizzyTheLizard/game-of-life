import { Component, computed, inject, signal } from '@angular/core';
import { GameEngine } from './game-engine';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { fromBoolArray, Grid, initialize, toBoolArray } from './grid';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-root',
  imports: [MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly gameEngine = inject(GameEngine);
  protected readonly rows = signal(10);
  protected readonly cols = signal(10);
  protected readonly canStart = computed(() => this.rows() > 0 && this.cols() > 0 && !this.gameEngine.running());
  protected readonly canStop = this.gameEngine.running;
  protected readonly initialGrid = signal<Grid>(initialize(this.rows(), this.cols()));
  protected readonly grid = computed(() => this.gameEngine.running() ? fromBoolArray(this.gameEngine.grid()) : this.initialGrid());

  protected updateRows(value: string) {
    let rows = parseInt(value, 10);
    if(isNaN(rows)) rows = 0;
    this.rows.set(rows);
    //TODO: This overwrites the grid every time the rows or cols are updated. We should ideally preserve the existing state as much as possible.
    this.initialGrid.set(initialize(this.rows(), this.cols()));
  }

  protected updateCols(value: string) {
    let cols = parseInt(value, 10);
    if(isNaN(cols)) cols = 0;
    this.cols.set(cols);
    //TODO: This overwrites the grid every time the rows or cols are updated. We should ideally preserve the existing state as much as possible.
    this.initialGrid.set(initialize(this.rows(), this.cols()));
  }

  protected start(){
    if(!this.canStart()) return;
    this.gameEngine.initialize(this.rows(), this.cols(), toBoolArray(this.initialGrid()));
    this.gameEngine.run();
    console.log('Game started');
  }

  protected stop(){
    this.gameEngine.stop();
    //TODO: We loose the end state of the game when we stop it. Shoud we preseve it?
    console.log('Game stopped');
  }

  protected toggleCell(row: number, col: number) {
    //TODO: Create a deep copy. This is not the most efficient way to update a single cell, but it ensures immutability and triggers change detection properly.
    const newGrid = this.initialGrid().map(r => ({
      ...r,
      cells: r.cells.map(c => ({
        ...c,
        alive: r.id === row && c.id === col ? !c.alive : c.alive
      }))
    }));
    this.initialGrid.set(newGrid);
  }
}
