import type { PoseLandmarker } from '@mediapipe/tasks-vision';
import { MEDIAPIPE_CONFIG } from './config';
import { POSE_FACE_LANDMARKS } from './landmarks';
import { createWithDelegateFallback, loadVisionRuntime, resolveModelUrl } from './mediapipeLoader';
import type { Connection, Tracker, TrackingFrame } from './types';

/** Full-body pose tracking (33 landmarks). */
export class PoseTracker implements Tracker {
  readonly kind = 'pose' as const;
  readonly hiddenLandmarks = POSE_FACE_LANDMARKS;
  connections: Connection[] = [];

  private landmarker: PoseLandmarker | null = null;

  async init(): Promise<void> {
    const { vision, fileset } = await loadVisionRuntime();
    const { local, remote } = MEDIAPIPE_CONFIG.models.pose;
    const modelAssetPath = await resolveModelUrl(local, remote);

    this.landmarker = await createWithDelegateFallback((delegate) =>
      vision.PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath, delegate },
        runningMode: 'VIDEO',
        numPoses: MEDIAPIPE_CONFIG.numPoses,
      }),
    );

    this.connections = vision.PoseLandmarker.POSE_CONNECTIONS.filter(
      (c) => !POSE_FACE_LANDMARKS.has(c.start) && !POSE_FACE_LANDMARKS.has(c.end),
    );
  }

  detect(video: HTMLVideoElement, timestampMs: number): TrackingFrame {
    const aspect = video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 1;
    if (!this.landmarker) return { timestamp: timestampMs, aspect };
    const result = this.landmarker.detectForVideo(video, timestampMs);
    const first = result.landmarks[0];
    return {
      timestamp: timestampMs,
      aspect,
      pose: first?.map((l) => ({ x: l.x, y: l.y, z: l.z, visibility: l.visibility })),
    };
  }

  dispose(): void {
    this.landmarker?.close();
    this.landmarker = null;
  }
}
