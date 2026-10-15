import type { Connection, Landmark } from './types';

export interface OverlayStyle {
  line: string;
  point: string;
  lineWidth: number;
  pointRadius: number;
}

export const DEFAULT_OVERLAY_STYLE: OverlayStyle = {
  line: 'rgba(45, 212, 191, 0.95)',
  point: '#ffffff',
  lineWidth: 3,
  pointRadius: 4,
};

const MIN_VISIBILITY = 0.4;

function isVisible(l: Landmark | undefined): l is Landmark {
  return !!l && (l.visibility === undefined || l.visibility >= MIN_VISIBILITY);
}

/** Draws one skeleton. Landmarks are normalised, so they are scaled to the canvas here. */
export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  connections: Connection[],
  hidden: ReadonlySet<number>,
  style: OverlayStyle = DEFAULT_OVERLAY_STYLE,
): void {
  const { width, height } = ctx.canvas;

  ctx.lineWidth = style.lineWidth;
  ctx.strokeStyle = style.line;
  ctx.lineCap = 'round';
  for (const { start, end } of connections) {
    const a = landmarks[start];
    const b = landmarks[end];
    if (!isVisible(a) || !isVisible(b)) continue;
    ctx.beginPath();
    ctx.moveTo(a.x * width, a.y * height);
    ctx.lineTo(b.x * width, b.y * height);
    ctx.stroke();
  }

  ctx.fillStyle = style.point;
  landmarks.forEach((l, i) => {
    if (hidden.has(i) || !isVisible(l)) return;
    ctx.beginPath();
    ctx.arc(l.x * width, l.y * height, style.pointRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function clearCanvas(canvas: HTMLCanvasElement): void {
  canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
}
