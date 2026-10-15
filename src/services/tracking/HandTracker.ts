import type { HandLandmarker } from '@mediapipe/tasks-vision';
import { MEDIAPIPE_CONFIG } from './config';
import { createWithDelegateFallback, loadVisionRuntime, resolveModelUrl } from './mediapipeLoader';
import type { Connection, Handedness, Tracker, TrackingFrame } from './types';

/** Two-hand tracking (21 landmarks per hand). */
export class HandTracker implements Tracker {
  readonly kind = 'hands' as const;
  readonly hiddenLandmarks: ReadonlySet<number> = new Set();
  connections: Connection[] = [];

  private landmarker: HandLandmarker | null = null;

  async init(): Promise<void> {
    const { vision, fileset } = await loadVisionRuntime();
    const { local, remote } = MEDIAPIPE_CONFIG.models.hands;
    const modelAssetPath = await resolveModelUrl(local, remote);

    this.landmarker = await createWithDelegateFallback((delegate) =>
      vision.HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath, delegate },
        runningMode: 'VIDEO',
        numHands: MEDIAPIPE_CONFIG.numHands,
      }),
    );

    this.connections = vision.HandLandmarker.HAND_CONNECTIONS.map((c) => ({ start: c.start, end: c.end }));
  }

  detect(video: HTMLVideoElement, timestampMs: number): TrackingFrame {
    const aspect = video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 1;
    if (!this.landmarker) return { timestamp: timestampMs, aspect };
    const result = this.landmarker.detectForVideo(video, timestampMs);

    const hands = result.landmarks.map((landmarks, i) => {
      const category = result.handedness[i]?.[0];
      return {
        handedness: correctHandedness(category?.categoryName),
        score: category?.score ?? 0,
        landmarks: landmarks.map((l) => ({ x: l.x, y: l.y, z: l.z })),
      };
    });

    return { timestamp: timestampMs, aspect, hands };
  }

  dispose(): void {
    this.landmarker?.close();
    this.landmarker = null;
  }
}

/**
 * MediaPipe assumes a mirrored (selfie) image when labelling hands. We feed it
 * the raw, un-mirrored camera frame, so the label is the opposite of the
 * patient's actual hand and must be swapped.
 */
function correctHandedness(label: string | undefined): Handedness {
  return label === 'Left' ? 'Right' : 'Left';
}
