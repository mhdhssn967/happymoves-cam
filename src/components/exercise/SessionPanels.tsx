import { Pause, Play, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui';
import { formatDuration } from '@/core/utils/format';
import type { SessionResult, SessionStatus } from '@/core/types/session';
import './exercise.css';

interface StatsProps {
  reps: number;
  targetReps: number;
  elapsedMs: number;
}

/** Rep counter, timer and progress bar. Reused by every module. */
export function SessionStats({ reps, targetReps, elapsedMs }: StatsProps) {
  const pct = Math.min(100, Math.round((reps / targetReps) * 100));
  return (
    <section className="side-card" aria-label="Session progress">
      <h2>Session</h2>
      <div className="stats">
        <div className="stat">
          <span className="stat__value">{reps}</span>
          <span className="stat__label">Reps</span>
        </div>
        <div className="stat">
          <span className="stat__value">{targetReps}</span>
          <span className="stat__label">Target</span>
        </div>
        <div className="stat">
          <span className="stat__value">{formatDuration(elapsedMs / 1000)}</span>
          <span className="stat__label">Time</span>
        </div>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Repetitions completed"
        aria-valuemin={0}
        aria-valuemax={targetReps}
        aria-valuenow={Math.min(reps, targetReps)}
      >
        <div className="progress__bar" style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}

interface ControlsProps {
  status: SessionStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  /** Disable Start (e.g. camera not ready). */
  startDisabled?: boolean;
}

export function SessionControls({ status, onStart, onPause, onResume, onReset, startDisabled }: ControlsProps) {
  return (
    <div className="control-row">
      {status === 'idle' && (
        <Button variant="success" glow onClick={onStart} disabled={startDisabled} icon={<Play size={18} aria-hidden="true" />}>
          Start session
        </Button>
      )}
      {status === 'running' && (
        <Button variant="amber" onClick={onPause} icon={<Pause size={18} aria-hidden="true" />}>
          Pause
        </Button>
      )}
      {status === 'paused' && (
        <Button variant="success" glow onClick={onResume} icon={<Play size={18} aria-hidden="true" />}>
          Resume
        </Button>
      )}
      {(status === 'running' || status === 'paused') && (
        <Button variant="secondary" onClick={onReset} icon={<RotateCcw size={18} aria-hidden="true" />}>
          Reset
        </Button>
      )}
    </div>
  );
}

export function SessionSummary({ result, onRestart }: { result: SessionResult; onRestart: () => void }) {
  return (
    <section className="side-card summary" aria-label="Session summary" aria-live="polite">
      <span className="summary__icon"><Trophy size={28} aria-hidden="true" /></span>
      <h2>Session complete</h2>
      <p>
        {result.reps} of {result.targetReps} repetitions in {formatDuration(result.durationMs / 1000)}.
      </p>
      <Button variant="success" glow onClick={onRestart} icon={<RotateCcw size={18} aria-hidden="true" />}>New session</Button>
    </section>
  );
}
