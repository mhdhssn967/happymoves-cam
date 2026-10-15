/** Normalised landmark: x and y are 0–1 across the video frame. */
export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export type TrackerKind = 'pose' | 'hands';

export type Handedness = 'Left' | 'Right';

export interface HandResult {
  /** The patient's actual hand (already corrected for the un-mirrored camera frame). */
  handedness: Handedness;
  score: number;
  landmarks: Landmark[];
}

/** Everything detected in one video frame. Modules only ever see this shape. */
export interface TrackingFrame {
  timestamp: number;
  /** Video width / height. Normalised x and y are not equal units, so angle maths must correct for it. */
  aspect: number;
  pose?: Landmark[];
  hands?: HandResult[];
}

export interface Connection {
  start: number;
  end: number;
}

/** Contract implemented by each MediaPipe-backed tracker. */
export interface Tracker {
  readonly kind: TrackerKind;
  /** Skeleton lines to draw. Available after `init()`. */
  readonly connections: Connection[];
  /** Landmark indices that should not be drawn (e.g. facial points). */
  readonly hiddenLandmarks: ReadonlySet<number>;
  init(): Promise<void>;
  detect(video: HTMLVideoElement, timestampMs: number): TrackingFrame;
  dispose(): void;
}

export type TrackerErrorCode = 'wasm-load-failed' | 'model-load-failed' | 'runtime-error';

export class TrackerError extends Error {
  readonly code: TrackerErrorCode;

  constructor(code: TrackerErrorCode, message: string) {
    super(message);
    this.name = 'TrackerError';
    this.code = code;
  }
}
