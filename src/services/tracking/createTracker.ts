import { HandTracker } from './HandTracker';
import { PoseTracker } from './PoseTracker';
import type { Tracker, TrackerKind } from './types';

/** Factory so callers (and the `useTracker` hook) never import concrete trackers. */
export function createTracker(kind: TrackerKind): Tracker {
  return kind === 'pose' ? new PoseTracker() : new HandTracker();
}
