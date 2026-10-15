import { useCallback, useEffect, useRef, useState } from 'react';
import type { SessionResult, SessionStatus } from '@/core/types/session';

interface Options {
  targetReps: number;
}

export interface ExerciseSession {
  status: SessionStatus;
  reps: number;
  targetReps: number;
  elapsedMs: number;
  result: SessionResult | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  /** Call when the exercise logic detects one completed repetition. */
  addRep: () => void;
}

/**
 * Generic session state machine shared by all modules:
 * idle → running ⇄ paused → complete. Exercise-specific logic only needs to
 * call `addRep()`; timing, counting and completion are handled here.
 */
export function useExerciseSession({ targetReps }: Options): ExerciseSession {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [reps, setReps] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState<SessionResult | null>(null);

  const statusRef = useRef<SessionStatus>('idle');
  const repsRef = useRef(0);
  const accumulatedRef = useRef(0);
  const segmentStartRef = useRef(0);

  const changeStatus = useCallback((next: SessionStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  useEffect(() => {
    if (status !== 'running') return;
    const id = window.setInterval(() => {
      setElapsedMs(accumulatedRef.current + (performance.now() - segmentStartRef.current));
    }, 200);
    return () => window.clearInterval(id);
  }, [status]);

  const start = useCallback(() => {
    repsRef.current = 0;
    accumulatedRef.current = 0;
    segmentStartRef.current = performance.now();
    setReps(0);
    setElapsedMs(0);
    setResult(null);
    changeStatus('running');
  }, [changeStatus]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'running') return;
    accumulatedRef.current += performance.now() - segmentStartRef.current;
    setElapsedMs(accumulatedRef.current);
    changeStatus('paused');
  }, [changeStatus]);

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return;
    segmentStartRef.current = performance.now();
    changeStatus('running');
  }, [changeStatus]);

  const reset = useCallback(() => {
    repsRef.current = 0;
    accumulatedRef.current = 0;
    setReps(0);
    setElapsedMs(0);
    setResult(null);
    changeStatus('idle');
  }, [changeStatus]);

  const addRep = useCallback(() => {
    if (statusRef.current !== 'running') return;
    repsRef.current += 1;
    setReps(repsRef.current);

    if (repsRef.current >= targetReps) {
      const durationMs = accumulatedRef.current + (performance.now() - segmentStartRef.current);
      setElapsedMs(durationMs);
      setResult({
        reps: repsRef.current,
        targetReps,
        durationMs,
        completedAt: new Date().toISOString(),
      });
      changeStatus('complete');
    }
  }, [changeStatus, targetReps]);

  return { status, reps, targetReps, elapsedMs, result, start, pause, resume, reset, addRep };
}
