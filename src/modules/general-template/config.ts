/** Tunable settings for this module. Keep magic numbers here, not in components. */
export const TEMPLATE_CONFIG = {
  /** Repetitions needed to finish a session. */
  targetReps: 8,
  /** How long the patient must hold inside a target for it to count (ms). */
  holdMs: 700,
  /** Target radius as a fraction of the stage height. */
  targetRadius: 0.11,
  /** Stage width / height; used to keep targets circular and distances fair. */
  stageAspect: 4 / 3,
} as const;
