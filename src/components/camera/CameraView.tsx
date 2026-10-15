import type { ReactNode, RefObject } from 'react';
import './camera.css';

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** True while the camera is delivering video; unhides the <video>. */
  live: boolean;
  mirrored?: boolean;
  /** Top-bar badges (status, FPS). */
  badges?: ReactNode;
  /** Full-cover overlay for prompts, loading and errors. */
  overlay?: ReactNode;
  /** Bottom hint text, e.g. "No hand detected". */
  hint?: ReactNode;
}

/**
 * Reusable camera stage: <video> + landmark <canvas> + overlay slots.
 * Both elements stay mounted so refs are always valid when the camera starts.
 */
export function CameraView({ videoRef, canvasRef, live, mirrored = true, badges, overlay, hint }: CameraViewProps) {
  return (
    <div
      className={`camera-view ${mirrored ? 'camera-view--mirrored' : ''}`}
      data-live={live}
      role="region"
      aria-label="Camera view"
    >
      <video ref={videoRef} className="camera-view__video" muted playsInline />
      <canvas ref={canvasRef} className="camera-view__canvas" aria-hidden="true" />
      {badges && <div className="camera-view__badges">{badges}</div>}
      {hint && <div className="camera-view__hint-bottom">{hint}</div>}
      {overlay}
    </div>
  );
}

export function CameraPill({ children, warn = false }: { children: ReactNode; warn?: boolean }) {
  return (
    <span className="camera-pill">
      <span className={`camera-pill__dot ${warn ? 'camera-pill__dot--warn' : ''}`} aria-hidden="true" />
      {children}
    </span>
  );
}
