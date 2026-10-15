import { useCallback, useRef, useEffect } from 'react';
import { Play, Pause, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExerciseSession } from '@/hooks/useExerciseSession';
import type { ModuleScreenProps } from '@/core/types/module';
import type { Point } from '@/core/utils/geometry';
import { formatDuration } from '@/core/utils/format';
import { ROUTES } from '@/core/config/app';
import { CelebrationCheckmark } from '@/components/catalog/RehabIllustrations';
import { TEMPLATE_CONFIG } from './config';
import { TargetStage } from './components/TargetStage';
import { useTargetGame } from './logic/useTargetGame';
import './template.css';

export default function GeneralTemplateModule({ definition }: ModuleScreenProps) {
  const session = useExerciseSession({ targetReps: TEMPLATE_CONFIG.targetReps });
  const inputRef = useRef<Point | null>(null);

  const game = useTargetGame({
    running: session.status === 'running',
    inputRef,
    onRep: session.addRep,
  });

  const handleInput = useCallback((point: Point | null) => {
    inputRef.current = point;
  }, []);

  const start = () => {
    game.reset();
    session.start();
  };

  const restart = () => {
    game.reset();
    session.reset();
  };

  // Auto-start on initial mount if idle so patient can immediately begin
  useEffect(() => {
    if (session.status === 'idle') {
      start();
    }
  }, []);

  const elapsedSec = session.elapsedMs / 1000;
  const timeFormatted = formatDuration(elapsedSec);
  const backToCategory = ROUTES.category('upper-body', definition.categoryId || 'shoulder-mobility');

  // Screen 6: Summary Screen when Exercise Complete
  if (session.status === 'complete') {
    return (
      <div className="summary-view-card">
        <div className="summary-view-art">
          <CelebrationCheckmark />
        </div>

        <h1 className="summary-view-title">Exercise Complete!</h1>
        <h2 className="summary-view-exercise">Shoulder Mobility</h2>
        <p className="summary-view-subtitle">
          You completed {session.targetReps} reps in {timeFormatted}
        </p>

        {/* 3 Metrics Cards (Screen 6) */}
        <div className="summary-metrics-grid">
          <div className="summary-metric-card">
            <span className="summary-metric-card__label">Reps</span>
            <span className="summary-metric-card__val">{session.targetReps} / {session.targetReps}</span>
          </div>

          <div className="summary-metric-card">
            <span className="summary-metric-card__label">Time</span>
            <span className="summary-metric-card__val">{timeFormatted}</span>
          </div>

          <div className="summary-metric-card">
            <span className="summary-metric-card__label">Avg. Accuracy</span>
            <span className="summary-metric-card__val">92%</span>
          </div>
        </div>

        {/* Buttons (Screen 6) */}
        <div className="summary-actions">
          <button
            type="button"
            className="btn btn--primary btn--full"
            onClick={restart}
          >
            Try Again
          </button>
          <Link
            to={backToCategory}
            className="btn btn--secondary btn--full"
          >
            Back to Category
          </Link>
        </div>
      </div>
    );
  }

  // Screen 4: Active General Template Exercise
  return (
    <div className="module-view-flow" data-module={definition.id}>
      {/* Title & Instructions Header */}
      <div className="module-intro">
        <h1 className="module-intro__title">Shoulder Mobility</h1>
        <p className="module-intro__desc">
          Hold the target with your mouse to complete the exercise.
        </p>
      </div>

      {/* Top Patient Status Bar (Reps, Time, Pause/Play) (Screen 4) */}
      <div className="module-status-bar">
        <div className="module-status-bar__item">
          <Award size={18} className="module-status-bar__icon" />
          <span className="module-status-bar__label">Reps</span>
          <strong className="module-status-bar__val">{session.reps} / {session.targetReps}</strong>
        </div>

        <div className="module-status-bar__item">
          <Clock size={18} className="module-status-bar__icon" />
          <strong className="module-status-bar__val">{timeFormatted}</strong>
        </div>

        <div className="module-status-bar__toggle">
          {session.status === 'running' ? (
            <button
              type="button"
              className="module-status-bar__btn"
              onClick={session.pause}
              aria-label="Pause exercise"
            >
              <Pause size={18} />
            </button>
          ) : (
            <button
              type="button"
              className="module-status-bar__btn module-status-bar__btn--play"
              onClick={session.status === 'paused' ? session.resume : start}
              aria-label="Resume exercise"
            >
              <Play size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Serene Target Stage (Screen 4) */}
      <TargetStage
        target={game.target}
        holdProgress={game.holdProgress}
        running={session.status === 'running'}
        onInput={handleInput}
      />

      {/* Bottom Action Buttons (Screen 4) */}
      <div className="module-action-buttons">
        {session.status === 'running' ? (
          <button
            type="button"
            className="btn btn--primary btn--full btn--lg"
            onClick={session.pause}
          >
            Pause
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary btn--full btn--lg"
            onClick={session.status === 'paused' ? session.resume : start}
          >
            {session.status === 'paused' ? 'Resume' : 'Start'}
          </button>
        )}

        <button
          type="button"
          className="btn btn--secondary btn--full btn--lg"
          onClick={restart}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
