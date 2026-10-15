/**
 * MediaPipe configuration.
 *
 * - The WASM runtime is copied to `public/mediapipe/wasm` so it works offline.
 * - Each model is tried locally first (`public/models/…`, ideal for clinics
 *   without reliable internet) and falls back to Google's hosted copy.
 *
 * Override any value with VITE_* variables (see `.env.example`).
 */
const GOOGLE_MODELS = 'https://storage.googleapis.com/mediapipe-models';

export const MEDIAPIPE_CONFIG = {
  wasmBaseUrl: (import.meta.env.VITE_MEDIAPIPE_WASM_URL as string | undefined) ?? '/mediapipe/wasm',
  models: {
    pose: {
      local: '/models/pose_landmarker_lite.task',
      remote:
        (import.meta.env.VITE_POSE_MODEL_URL as string | undefined) ??
        `${GOOGLE_MODELS}/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task`,
    },
    hands: {
      local: '/models/hand_landmarker.task',
      remote:
        (import.meta.env.VITE_HAND_MODEL_URL as string | undefined) ??
        `${GOOGLE_MODELS}/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task`,
    },
  },
  numPoses: 1,
  numHands: 2,
} as const;
