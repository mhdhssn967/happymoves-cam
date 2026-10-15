import type { ReactNode } from 'react';
import { CircleCheck, Info, OctagonAlert, TriangleAlert } from 'lucide-react';
import './ui.css';

type Tone = 'info' | 'warning' | 'danger' | 'success';

const ICON = { info: Info, warning: TriangleAlert, danger: OctagonAlert, success: CircleCheck } as const;

interface CalloutProps {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
}

/** Errors use role="alert" so assistive tech announces them; others use role="status". */
export function Callout({ tone = 'info', title, children, actions }: CalloutProps) {
  const Glyph = ICON[tone];
  return (
    <div className={`callout callout--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <Glyph size={20} className="callout__icon" aria-hidden="true" />
      <div>
        {title && <p className="callout__title">{title}</p>}
        {children && <div className="callout__body">{children}</div>}
        {actions && <div className="callout__actions">{actions}</div>}
      </div>
    </div>
  );
}
