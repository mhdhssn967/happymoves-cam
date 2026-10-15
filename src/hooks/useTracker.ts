import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { createTracker } from '@/services/tracking/createTracker';
import { clearCanvas, drawSkeleton } from '@/services/tracking/drawing';
import { TrackerError, type Tracker, type TrackerKind, type TrackingFrame } from '@/services/tracking/types';

export type TrackerStatus = 'idle' | 'loading' | 'running' | 'error';

interface UseTrackerOptions {
  kind: TrackerKind;
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** Start tracking only when true (typically: camera is active). */
  enabled: boolean;
  /**
   * Called for every new video frame, outside React rendering. Put exercise
   * logic here (rep counting, scoring); do not set React state per frame.
   */
  onFrame?: (frame: TrackingFrame) => void;
}

export interface UseTracker {
  status: TrackerStatus;
  error: TrackerError | null;
  fps: number;
  /** Latest frame, throttled (~8 Hz) so the UI can show live values cheaply. */
  frame: TrackingFrame | null;
  retry: () => void;
}

const UI_UPDATE_INTERVAL_MS = 125;

/**
 * Runs a MediaPipe tracker against a <video>, draws the skeleton on a <canvas>
 * and reports frames. Owns the animation loop and cleans everything up.
 */
export function useTracker({ kind, videoRef, canvasRef, enabled, onFrame }: UseTrackerOptions): UseTracker {
  const [status, setStatus] = useState<TrackerStatus>('idle');
  const [error, setError] = useState<TrackerError | null>(null);
  const [fps, setFps] = useState(0);
  const [frame, setFrame] = useState<TrackingFrame | null>(null);
  const [attempt, setAttempt] = useState(0);

  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      setFrame(null);
      setFps(0);
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let tracker: Tracker | null = null;

    setStatus('loading');
    setError(null);
    setFrame(null);

    const run = async () => {
      try {
        tracker = createTracker(kind);
        await tracker.init();
      } catch (err) {
        tracker?.dispose();
        tracker = null;
        if (cancelled) return;
        setError(err instanceof TrackerError ? err : new TrackerError('model-load-failed', String(err)));
        setStatus('error');
        return;
      }
      if (cancelled) {
        tracker.dispose();
        return;
      }

      setStatus('running');

      let lastVideoTime = -1;
      let lastUiUpdate = 0;
      let frames = 0;
      let fpsWindowStart = performance.now();
      const active = tracker;

      const loop = () => {
        if (cancelled) return;
        rafId = requestAnimationFrame(loop);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0) return;
        if (video.currentTime === lastVideoTime) return; // no new camera frame yet
        lastVideoTime = video.currentTime;

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const now = performance.now();
        let result: TrackingFrame;
        try {
          result = active.detect(video, now);
        } catch (err) {
          cancelled = true;
          cancelAnimationFrame(rafId);
          setError(new TrackerError('runtime-error', err instanceof Error ? err.message : 'Tracking failed.'));
          setStatus('error');
          return;
        }

        clearCanvas(canvas);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (result.pose) drawSkeleton(ctx, result.pose, active.connections, active.hiddenLandmarks);
          result.hands?.forEach((h) => drawSkeleton(ctx, h.landmarks, active.connections, active.hiddenLandmarks));
        }

        onFrameRef.current?.(result);

        frames += 1;
        if (now - lastUiUpdate >= UI_UPDATE_INTERVAL_MS) {
          lastUiUpdate = now;
          setFrame(result);
          const elapsed = now - fpsWindowStart;
          if (elapsed >= 1000) {
            setFps(Math.round((frames * 1000) / elapsed));
            frames = 0;
            fpsWindowStart = now;
          }
        }
      };
      rafId = requestAnimationFrame(loop);
    };

    void run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      tracker?.dispose();
      const canvas = canvasRef.current;
      if (canvas) clearCanvas(canvas);
    };
  }, [enabled, kind, attempt, videoRef, canvasRef]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { status, error, fps, frame, retry };
}
