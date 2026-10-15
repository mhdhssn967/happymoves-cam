import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from '@/core/config/icons';
import type { Accent } from './NavCard';
import './ui.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  accent?: Accent;
  meta?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, icon, accent = 'upper', meta, actions }: PageHeaderProps) {
  const style = {
    '--accent': accent === 'lower' ? 'var(--accent-lower)' : 'var(--accent-upper)',
    '--accent-soft': accent === 'lower' ? 'var(--accent-lower-soft)' : 'var(--accent-upper-soft)',
  } as CSSProperties;

  return (
    <header className="page-header" style={style}>
      <div className="page-header__lead">
        {icon && (
          <span className="page-header__icon">
            <Icon name={icon} size={30} />
          </span>
        )}
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="page-header__sub">{subtitle}</p>}
          {meta && <div className="page-header__meta">{meta}</div>}
        </div>
      </div>
      {actions && <div>{actions}</div>}
    </header>
  );
}
