import { angleDeg, distance, normalize, type Point } from '@/core/utils/geometry';
import { HAND, POSE } from '@/services/tracking/landmarks';
import type { HandResult, Landmark } from '@/services/tracking/types';

/**
 * Pure functions that turn landmarks into clinical-style measurements.
 * No React and no MediaPipe imports, so they are easy to unit test and reuse.
 */

/** Normalised x/y are different units on a non-square frame; scale x so geometry is correct. */
function toSquare(l: Landmark, aspect: number): Point {
  return { x: l.x * aspect, y: l.y };
}

const FINGERS: ReadonlyArray<readonly [mcp: number, tip: number]> = [
  [HAND.INDEX_MCP, HAND.INDEX_TIP],
  [HAND.MIDDLE_MCP, HAND.MIDDLE_TIP],
  [HAND.RING_MCP, HAND.RING_TIP],
  [HAND.PINKY_MCP, HAND.PINKY_TIP],
];

export type HandState = 'Open' | 'Partial' | 'Closed';

export interface HandMetrics {
  /** 0 = fist, 1 = fully open. */
  openness: number;
  state: HandState;
}

/**
 * Openness from how far each fingertip extends beyond its knuckle, measured
 * from the wrist. Curled fingers bring the tip back towards the palm.
 */
export function computeHandMetrics(hand: HandResult, aspect: number): HandMetrics {
  const wrist = toSquare(hand.landmarks[HAND.WRIST], aspect);
  const ratios = FINGERS.map(([mcp, tip]) => {
    const knuckle = distance(wrist, toSquare(hand.landmarks[mcp], aspect));
    const fingertip = distance(wrist, toSquare(hand.landmarks[tip], aspect));
    return knuckle === 0 ? 0 : fingertip / knuckle;
  });
  const average = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  const openness = normalize(average, 1.1, 1.9);
  const state: HandState = openness >= 0.65 ? 'Open' : openness <= 0.3 ? 'Closed' : 'Partial';
  return { openness, state };
}

export interface PoseAngles {
  leftElbow?: number;
  rightElbow?: number;
  leftShoulder?: number;
  rightShoulder?: number;
}

const MIN_VISIBILITY = 0.5;

function joint(pose: Landmark[], a: number, b: number, c: number, aspect: number): number | undefined {
  const [pa, pb, pc] = [pose[a], pose[b], pose[c]];
  if (!pa || !pb || !pc) return undefined;
  if ([pa, pb, pc].some((p) => (p.visibility ?? 1) < MIN_VISIBILITY)) return undefined;
  return angleDeg(toSquare(pa, aspect), toSquare(pb, aspect), toSquare(pc, aspect));
}

/** Elbow angle (shoulder–elbow–wrist) and shoulder angle (hip–shoulder–elbow). */
export function computePoseAngles(pose: Landmark[], aspect: number): PoseAngles {
  return {
    leftElbow: joint(pose, POSE.LEFT_SHOULDER, POSE.LEFT_ELBOW, POSE.LEFT_WRIST, aspect),
    rightElbow: joint(pose, POSE.RIGHT_SHOULDER, POSE.RIGHT_ELBOW, POSE.RIGHT_WRIST, aspect),
    leftShoulder: joint(pose, POSE.LEFT_HIP, POSE.LEFT_SHOULDER, POSE.LEFT_ELBOW, aspect),
    rightShoulder: joint(pose, POSE.RIGHT_HIP, POSE.RIGHT_SHOULDER, POSE.RIGHT_ELBOW, aspect),
  };
}

export function countVisibleLandmarks(pose: Landmark[]): number {
  return pose.filter((l) => (l.visibility ?? 1) >= MIN_VISIBILITY).length;
}
