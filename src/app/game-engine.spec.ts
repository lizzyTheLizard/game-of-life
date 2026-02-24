import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GameEngine } from './game-engine';

describe('GameEngine', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    vi.useFakeTimers();
  });

  afterEach(() => {
    engine.stop();
    vi.useRealTimers();
  });

  it('initializes ', () => {
    const initialState = [
      [false, true],
      [true, false],
    ];

    engine.initialize(2, 2, initialState);

    expect(engine.rows()).toBe(2);
    expect(engine.cols()).toBe(2);
    expect(engine.grid()).toEqual(initialState);
    //Ensure that the grid is a deep copy of the initial state, not the same reference
    expect(engine.grid()).not.toBe(initialState);
  });

  it('sets running state on run and stop', () => {
    const verticalBlinker = [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ];

    engine.initialize(3, 3, verticalBlinker);
    expect(engine.running()).toBe(false);

    engine.run(100);
    expect(engine.running()).toBe(true);

    //Update after run is called
    vi.advanceTimersByTime(100);
    expect(engine.grid()).toEqual([
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ]);

    engine.stop();
    expect(engine.running()).toBe(false);

    //Stop update after stop is called
    vi.advanceTimersByTime(100);
    expect(engine.grid()).toEqual([
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ]);
  });

  it('vertical blinker oscillates correctly', () => {
    const verticalBlinker = [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ];

    engine.initialize(3, 3, verticalBlinker);
    engine.run(100);
    vi.advanceTimersByTime(100);

    expect(engine.grid()).toEqual([
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ]);

    vi.advanceTimersByTime(100);

    expect(engine.grid()).toEqual([
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ]);
  });

  it('Glider moves correctly', () => {
    const glider = [
      [false, false, false, false, false, false, false],
      [false, false, true, false, false, false, false],
      [false, false, false, true, false, false, false],
      [false, true, true, true, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
    ];

    engine.initialize(7, 7, glider);
    engine.run(100);
    vi.advanceTimersByTime(100);
    vi.advanceTimersByTime(100);
    vi.advanceTimersByTime(100);
    vi.advanceTimersByTime(100);

    expect(engine.grid()).toEqual([
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, true, false, false, false],
      [false, false, false, false, true, false, false],
      [false, false, true, true, true, false, false],
      [false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false],
    ]);
  });

  it('out-of-bounds neighbors are treated as dead', () => {
    const singleLiveCell = [
      [true, false],
      [false, false],
    ];

    engine.initialize(2, 2, singleLiveCell);
    engine.run(100);
    vi.advanceTimersByTime(100);

    expect(engine.grid()).toEqual([
      [false, false],
      [false, false],
    ]);
  });
});
