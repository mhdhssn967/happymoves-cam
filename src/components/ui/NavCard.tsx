import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Icon } from './Icon';
import type { IconName } from '@/core/config/icons';
import type { Accent } from '@/core/utils/accent';
import './ui.css';

export type { Accent };

interface NavCardProps {
  to: string;
  title: string;
  icon: IconName;
  accent?: Accent;
  description?: string;
  badges?: ReactNode;
  /** Short list shown on the card (e.g. activities). */
  items?: string[];
  /** How many of `items` to show before collapsing into "+N more". */
  maxItems?: number;
  footer?: ReactNode;
  cta?: string;
  size?: 'md' | 'lg';
  muted?: boolean;
  headingLevel?: 2 | 3;
}

/**
 * Rehametrics-styled clinical card used for sections, categories and modules.
 */
export function NavCard({
  to,
  title,
  icon,
  accent = 'upper',
  description,
  badges,
  items,
  maxItems = 4,
  footer,
  cta = 'Open',
  size = 'md',
  muted = false,
  headingLevel = 3,
}: NavCardProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const shown = items?.slice(0, maxItems) ?? [];
  const remaining = (items?.length ?? 0) - shown.length;

  return (
    <article
      className={['nav-card', 'nav-card--link', size === 'lg' ? 'nav-card--lg' : '', muted ? 'nav-card--muted' : ''].join(' ')}
      data-accent={accent}
    >
      <div className="nav-card__body">
        <div className="nav-card__head">
          <span className="nav-card__icon">
            <Icon name={icon} size={size === 'lg' ? 28 : 22} />
          </span>
          <div className="nav-card__titles">
            <Heading className="nav-card__title">
              <Link to={to} className="nav-card__link">
                {title}
              </Link>
            </Heading>
            {description && <p className="nav-card__desc">{description}</p>}
          </div>
        </div>

        {badges && <div className="nav-card__badges">{badges}</div>}

        {shown.length > 0 && (
          <ul className="nav-card__list" aria-label={`${title} activities`}>
            {shown.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {remaining > 0 && (
              <li className="nav-card__more">+{remaining} more</li>
            )}
          </ul>
        )}
      </div>

      <div className="nav-card__footer">
        <span>{footer}</span>
        <span className="nav-card__cta">
          {cta} <ChevronRight size={15} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
