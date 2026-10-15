export type SessionStatus = 'idle' | 'running' | 'paused' | 'complete';

/** Outcome of one exercise session. Future versions can add accuracy, range of motion, etc. */
export interface SessionResult {
  reps: number;
  targetReps: number;
  durationMs: number;
  completedAt: string; // ISO timestamp
}
