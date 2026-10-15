import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './ui.css';

export interface Crumb {
  label: string;
  to?: string;
}

/** The last crumb is the current page and is not a link. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li>
                {last || !item.to ? (
                  <span aria-current={last ? 'page' : undefined}>{item.label}</span>
                ) : (
                  <Link to={item.to}>{item.label}</Link>
                )}
                {!last && <ChevronRight size={14} aria-hidden="true" />}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
