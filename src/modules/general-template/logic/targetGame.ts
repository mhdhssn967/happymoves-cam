import type { Point } from '@/core/utils/geometry';
import { TEMPLATE_CONFIG } from '../config';

/**
 * Pure exercise logic: no React, no DOM, no camera. Because it only consumes a
 * normalised input point, the same logic works with a mouse (this template) or
 * a MediaPipe landmark (a real module).
 */
export interface Target extends Point {
  radius: number;
}

export interface GameState {
  target: Target;
  /** Time spent inside the target so far (ms). */
  holdMs: number;
}

const MARGIN = 0.18;
const MIN_JUMP = 0.3;

export function randomTarget(radius: number, previous?: Target, rng: () => number = Math.random): Target {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = {
      x: MARGIN + rng() * (1 - 2 * MARGIN),
      y: MARGIN + rng() * (1 - 2 * MARGIN),
      radius,
    };
    if (!previous || distanceBetween(candidate, previous) >= MIN_JUMP) return candidate;
  }
  return { x: 0.5, y: 0.5, radius };
}

export function createGameState(radius: number = TEMPLATE_CONFIG.targetRadius): GameState {
  return { target: randomTarget(radius), holdMs: 0 };
}

/** Distance in "stage-height units" so a circle really is round on a 4:3 stage. */
function distanceBetween(a: Point, b: Point): number {
  return Math.hypot((a.x - b.x) * TEMPLATE_CONFIG.stageAspect, a.y - b.y);
}

export function isInsideTarget(point: Point, target: Target): boolean {
  return distanceBetween(point, target) <= target.radius;
}

export interface StepResult {
  state: GameState;
  /** True on the step where the hold completed and a new target was spawned. */
  completed: boolean;
}

/** Advances the game by `dtMs`. Progress drains slowly when the input leaves the target. */
export function stepGame(state: GameState, input: Point | null, dtMs: number): StepResult {
  const inside = input !== null && isInsideTarget(input, state.target);
  const holdMs = inside ? state.holdMs + dtMs : Math.max(0, state.holdMs - dtMs * 2);

  if (holdMs >= TEMPLATE_CONFIG.holdMs) {
    return {
      state: { target: randomTarget(state.target.radius, state.target), holdMs: 0 },
      completed: true,
    };
  }
  return { state: { ...state, holdMs }, completed: false };
}
