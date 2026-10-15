import { Badge } from '@/components/ui';
import type { TrackerKind, TrackingFrame } from '@/services/tracking/types';
import { computeHandMetrics, computePoseAngles, countVisibleLandmarks, type HandState } from '../logic/metrics';

const STATE_TONE: Record<HandState, 'success' | 'warning' | 'neutral'> = {
  Open: 'success',
  Partial: 'warning',
  Closed: 'neutral',
};

interface MetricsPanelProps {
  kind: TrackerKind;
  frame: TrackingFrame | null;
  tracking: boolean;
}

export function MetricsPanel({ kind, frame, tracking }: MetricsPanelProps) {
  if (!tracking) return <p>Start the camera to see live measurements.</p>;

  if (kind === 'hands') {
    const hands = frame?.hands ?? [];
    if (hands.length === 0) return <p>No hands detected. Hold a hand up so it is fully in view.</p>;

    return (
      <div className="metric-list">
        {hands.map((hand, i) => {
          const { openness, state } = computeHandMetrics(hand, frame?.aspect ?? 1);
          const pct = Math.round(openness * 100);
          return (
            <div key={`${hand.handedness}-${i}`} className="metric">
              <div className="metric__row">
                <span className="metric__label">{hand.handedness} hand</span>
                <Badge tone={STATE_TONE[state]}>{state}</Badge>
              </div>
              <div
                className="meter"
                role="meter"
                aria-label={`${hand.handedness} hand openness`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                aria-valuetext={`${pct} percent, ${state}`}
              >
                <div className="meter__fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="metric__value">{pct}% open</span>
            </div>
          );
        })}
      </div>
    );
  }

  const pose = frame?.pose;
  if (!pose) return <p>No person detected. Step back so your upper body is visible.</p>;

  const angles = computePoseAngles(pose, frame?.aspect ?? 1);
  const rows: Array<[string, number | undefined]> = [
    ['Left elbow', angles.leftElbow],
    ['Right elbow', angles.rightElbow],
    ['Left shoulder', angles.leftShoulder],
    ['Right shoulder', angles.rightShoulder],
  ];

  return (
    <div className="metric-list">
      {rows.map(([label, value]) => (
        <div key={label} className="metric metric--inline">
          <span className="metric__label">{label}</span>
          <span className="metric__value">{value === undefined ? '—' : `${Math.round(value)}°`}</span>
        </div>
      ))}
      <p className="metric__note">{countVisibleLandmarks(pose)} of 33 landmarks visible</p>
    </div>
  );
}
