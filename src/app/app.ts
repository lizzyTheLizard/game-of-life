import { Component, computed, inject, signal } from '@angular/core';
import { GameEngine } from './game-engine';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { fromBoolArray, Grid, initialize, toBoolArray, updateCell } from './grid';
import { FormsModule } from '@angular/forms';
import { appConfig } from './app.config';

@Component({
  selector: 'app-root',
  imports: [MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly gameEngine = inject(GameEngine);
  protected readonly rows = signal(appConfig.client.initialRows);
  protected readonly cols = signal(appConfig.client.initialColumns);
  protected readonly canStart = computed(
    () => this.rows() > 0 && this.cols() > 0 && !this.gameEngine.running(),
  );
  protected readonly canStop = this.gameEngine.running;
  protected readonly initialGrid = signal<Grid>(initialize(this.rows(), this.cols()));
  protected readonly grid = computed(() =>
    this.gameEngine.running() ? fromBoolArray(this.gameEngine.grid()) : this.initialGrid(),
  );

  protected updateRows(value: string) {
    let rows = parseInt(value, 10);
    if (isNaN(rows)) rows = 0;
    this.rows.set(rows);
    this.initialGrid.set(initialize(this.rows(), this.cols(), this.initialGrid()));
  }

  protected updateCols(value: string) {
    let cols = parseInt(value, 10);
    if (isNaN(cols)) cols = 0;
    this.cols.set(cols);
    this.initialGrid.set(initialize(this.rows(), this.cols(), this.initialGrid()));
  }

  protected start() {
    if (!this.canStart()) return;
    this.gameEngine.initialize(this.rows(), this.cols(), toBoolArray(this.initialGrid()));
    this.gameEngine.run(appConfig.client.speed);
  }

  protected stop() {
    this.gameEngine.stop();
    if (appConfig.client.preserveGridOnStop)
      this.initialGrid.set(fromBoolArray(this.gameEngine.grid()));
  }

  protected toggleCell(row: number, col: number) {
    if (this.gameEngine.running()) return;
    this.initialGrid.set(
      updateCell(this.initialGrid(), row, col, !this.initialGrid()[row].cells[col].alive),
    );
  }
}
