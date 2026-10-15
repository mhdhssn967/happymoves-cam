import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Point } from '@/core/utils/geometry';
import { clamp } from '@/core/utils/geometry';
import { SereneMeadowBackdrop } from '@/components/catalog/RehabIllustrations';
import type { Target } from '../logic/targetGame';
import '../template.css';

interface TargetStageProps {
  target: Target;
  holdProgress: number;
  running: boolean;
  /** Reports the input position (0–1 in both axes) or null when the pointer leaves. */
  onInput: (point: Point | null) => void;
}

const KEY_STEP = 0.04;

export function TargetStage({ target, holdProgress, running, onInput }: TargetStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<Point>({ x: 0.5, y: 0.5 });

  const update = useCallback(
    (point: Point | null) => {
      if (point) setCursor(point);
      onInput(point);
    },
    [onInput],
  );

  // Stop reporting input when the session is not running.
  useEffect(() => {
    if (!running) onInput(null);
  }, [running, onInput]);

  const fromPointer = (e: PointerEvent<HTMLDivElement>): Point | null => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clamp((e.clientX - rect.left) / rect.width, 0, 1),
      y: clamp((e.clientY - rect.top) / rect.height, 0, 1),
    };
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta: Record<string, Point> = {
      ArrowLeft: { x: -KEY_STEP, y: 0 },
      ArrowRight: { x: KEY_STEP, y: 0 },
      ArrowUp: { x: 0, y: -KEY_STEP },
      ArrowDown: { x: 0, y: KEY_STEP },
    };
    const d = delta[e.key];
    if (!d) return;
    e.preventDefault();
    update({ x: clamp(cursor.x + d.x, 0, 1), y: clamp(cursor.y + d.y, 0, 1) });
  };

  return (
    <div
      ref={stageRef}
      className="target-stage"
      tabIndex={0}
      role="application"
      aria-label="Shoulder mobility stage. Hold the target with your mouse to complete the exercise."
      onPointerMove={(e) => update(fromPointer(e))}
      onPointerDown={(e) => update(fromPointer(e))}
      onPointerLeave={() => onInput(null)}
      onKeyDown={onKeyDown}
    >
      {/* Serene Meadow Illustrated Backdrop (Screen 4) */}
      <SereneMeadowBackdrop />

      {/* Concentric Circular Target Rings (Screen 4) */}
      <div
        className={`target-rings ${running ? 'target-rings--active' : 'target-rings--idle'}`}
        style={
          {
            left: `${target.x * 100}%`,
            top: `${target.y * 100}%`,
            '--p': holdProgress,
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        <div className="target-ring target-ring--outer" />
        <div className="target-ring target-ring--middle" />
        <div className="target-ring target-ring--center" />
        {holdProgress > 0 && (
          <div
            className="target-ring--progress"
            style={{ transform: `scale(${0.3 + holdProgress * 0.7})` }}
          />
        )}
      </div>

      {/* Patient Cursor / Pointer (Screen 4) */}
      <div
        className="patient-cursor"
        style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" width={22} height={22}>
          <path
            d="M5.5 3.5L18.5 10.5L12 13L9 19.5L5.5 3.5Z"
            fill="#1e293b"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
