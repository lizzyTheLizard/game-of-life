import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';
import { Grid } from './grid';
import { GameEngine } from './game-engine';

interface AppComponentAllPublic {
  rows: () => number;
  cols: () => number;
  canStart: () => boolean;
  canStop: () => boolean;
  initialGrid: () => Grid;
  updateRows: (value: string) => void;
  updateCols: (value: string) => void;
  start: () => void;
  stop: () => void;
  toggleCell: (row: number, col: number) => void;
}

function getEmptyGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, (_, row) => ({
    id: row,
    cells: Array.from({ length: cols }, (_, col) => ({ id: col, alive: false })),
  }));
}

const gameEngineMock = {
  rows: vi.fn().mockReturnValue(10),
  cols: vi.fn().mockReturnValue(10),
  grid: vi.fn().mockReturnValue([]),
  running: vi.fn().mockReturnValue(false),
  initialize: vi.fn(),
  run: vi.fn(),
  stop: vi.fn(),
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: GameEngine,
          useValue: gameEngineMock,
        },
      ],
    }).compileComponents();
  });

  it('initialState', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as unknown as AppComponentAllPublic;

    expect(app.rows()).toBe(10);
    expect(app.cols()).toBe(10);
    expect(app.canStart()).toBe(true);
    expect(app.canStop()).toBe(false);
    expect(app.initialGrid()).toEqual(getEmptyGrid(10, 10));
  });

  it('updateRows', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as unknown as AppComponentAllPublic;

    app.updateRows('15');

    expect(app.rows()).toBe(15);
    expect(app.cols()).toBe(10);
    expect(app.canStart()).toBe(true);
    expect(app.canStop()).toBe(false);
    expect(app.initialGrid()).toEqual(getEmptyGrid(15, 10));
  });

  it('updateCols', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as unknown as AppComponentAllPublic;

    app.updateCols('15');

    expect(app.rows()).toBe(10);
    expect(app.cols()).toBe(15);
    expect(app.initialGrid()).toEqual(getEmptyGrid(10, 15));
  });

  it('start', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as unknown as AppComponentAllPublic;

    app.start();
    gameEngineMock.running.mockReturnValue(true);

    expect(gameEngineMock.initialize).toHaveBeenCalledWith(10, 10, expect.anything());
    expect(gameEngineMock.run).toHaveBeenCalledWith(100);
  });

  it('start stop', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as unknown as AppComponentAllPublic;

    app.start();
    gameEngineMock.running.mockReturnValue(true);
    app.stop();

    expect(gameEngineMock.stop).toHaveBeenCalled();
  });
});
