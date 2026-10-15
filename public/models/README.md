# Local MediaPipe models (optional)

The app loads these files first and falls back to Google's CDN if they are missing. Place them here for offline or
low-connectivity clinics:

| File | Download |
| --- | --- |
| `pose_landmarker_lite.task` | https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task |
| `hand_landmarker.task` | https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task |

For higher pose accuracy, use `pose_landmarker_full` or `pose_landmarker_heavy` and update the file names in
`src/services/tracking/config.ts`.
