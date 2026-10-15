import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { ROUTES } from '@/core/config/app';
import { getCategory, getSection } from '@/catalog';
import { getEntriesForCategory } from '@/modules/registry';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PostureFigureIcon } from '@/components/catalog/RehabIllustrations';
import './pages.css';

function getPostureVariant(title: string): 'flexion' | 'abduction' | 'rotation' | 'scapular' | 'angels' | 'hand' | 'knee' {
  const t = title.toLowerCase();
  if (t.includes('flexion')) return 'flexion';
  if (t.includes('abduction')) return 'abduction';
  if (t.includes('rotation')) return 'rotation';
  if (t.includes('scapular') || t.includes('retraction')) return 'scapular';
  if (t.includes('angel') || t.includes('wall')) return 'angels';
  if (t.includes('hand') || t.includes('finger') || t.includes('wrist')) return 'hand';
  if (t.includes('knee') || t.includes('leg') || t.includes('hip')) return 'knee';
  return 'flexion';
}

export function CategoryPage() {
  const { sectionId = '', categoryId = '' } = useParams();
  const category = getCategory(categoryId);
  const section = getSection(sectionId);
  useDocumentTitle(category ? `${category.title} Rehabilitation` : 'Category');

  if (!category || !section || category.sectionId !== section.id) {
    return <Navigate to="/not-found" replace />;
  }

  const { activities, extras } = getEntriesForCategory(category.id);
  const priority = category.priority === 'P0' ? 'High' : category.priority === 'P1' ? 'Medium' : 'Low';

  // Determine initial focus items (Screen 3)
  const focusItems = category.initialFocus && category.initialFocus.length > 0
    ? category.initialFocus
    : category.activities.slice(0, 4);

  return (
    <div className="page category-page">
      {/* Header: Back arrow & Title (Screen 3) */}
      <div className="section-header">
        <Link to={ROUTES.section(section.id)} className="section-header__back" aria-label="Back to Section">
          <ArrowLeft size={18} />
        </Link>
        <div className="section-header__titles">
          <h1 className="section-header__title">{category.title} Rehabilitation</h1>
          <p className="section-header__subtitle">
            {priority} priority · {activities.length} activities
          </p>
        </div>
      </div>

      {/* Initial Build Focus Card (Screen 3) */}
      <section className="focus-card" aria-labelledby="focus-title">
        <div className="focus-card__header">
          <CheckCircle2 size={18} className="focus-card__icon" />
          <h2 id="focus-title" className="focus-card__title">Initial build focus</h2>
        </div>
        <ul className="focus-card__list">
          {focusItems.map((item) => (
            <li key={item} className="focus-card__item">
              <span className="focus-card__bullet">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Activities List (Screen 3) */}
      <section className="activities-section" aria-labelledby="activities-heading">
        <h2 id="activities-heading" className="activities-section__heading">
          Activities ({activities.length})
        </h2>

        <div className="activities-list">
          {activities.map((entry) => {
            const isAvailable = entry.state === 'available';
            const posture = getPostureVariant(entry.title);

            return (
              <Link
                key={entry.slug}
                to={ROUTES.module(section.id, category.id, entry.slug)}
                className="activity-item-card"
              >
                {/* Posture Figure Icon */}
                <div className="activity-item-card__icon">
                  <PostureFigureIcon variant={posture} />
                </div>

                {/* Title & Badges */}
                <div className="activity-item-card__content">
                  <span className="activity-item-card__title">{entry.title}</span>
                  <div className="activity-item-card__badges">
                    {isAvailable ? (
                      <>
                        <span className="badge badge--demo">Demo</span>
                        <span className="badge badge--available">Module available</span>
                      </>
                    ) : (
                      <span className="badge badge--planned">Planned</span>
                    )}
                  </div>
                </div>

                <ChevronRight size={18} className="activity-item-card__arrow" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Platform modules (copy to create new) (Screen 3) */}
      {extras.length > 0 && (
        <section className="platform-modules-section" aria-labelledby="platform-heading">
          <h2 id="platform-heading" className="platform-modules-section__heading">
            Platform modules (copy to create new)
          </h2>

          <div className="platform-modules-list">
            {extras.map((extra) => (
              <Link
                key={extra.slug}
                to={ROUTES.module(section.id, category.id, extra.slug)}
                className="activity-item-card"
              >
                <div className="activity-item-card__icon activity-item-card__icon--purple">
                  <RotateCcw size={20} />
                </div>

                <div className="activity-item-card__content">
                  <span className="activity-item-card__title">{extra.title}</span>
                  <span className="activity-item-card__subtitle">{category.title}</span>
                </div>

                <span className="badge badge--template" style={{ marginRight: 8 }}>Template</span>
                <ChevronRight size={18} className="activity-item-card__arrow" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
