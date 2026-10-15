import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ChevronRight,
  ArrowLeft,
  Activity,
  PersonStanding,
  RotateCcw,
  Hand,
  Shield,
} from 'lucide-react';
import { ROUTES } from '@/core/config/app';
import { getCategoriesForSection, getSection } from '@/catalog';
import { getEntriesForCategory } from '@/modules/registry';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import './pages.css';

// Pastel styling maps for category cards
const CATEGORY_STYLES: Record<string, { iconBg: string; iconColor: string; priority: 'High' | 'Medium' | 'Low' }> = {
  'shoulder-mobility': { iconBg: '#ccfbf1', iconColor: '#0d9488', priority: 'High' },
  'elbow-rehabilitation': { iconBg: '#fef3c7', iconColor: '#d97706', priority: 'High' },
  'wrist-mobility': { iconBg: '#e0f2fe', iconColor: '#0284c7', priority: 'Medium' },
  'neck-rehab': { iconBg: '#ede9fe', iconColor: '#7c3aed', priority: 'Medium' },
  'trunk-control': { iconBg: '#d1fae5', iconColor: '#059669', priority: 'Low' },
  'fine-motor': { iconBg: '#ffedd5', iconColor: '#ea580c', priority: 'Medium' },
  'hand-gross-motor': { iconBg: '#e0f2fe', iconColor: '#0284c7', priority: 'High' },
  'lower-hip': { iconBg: '#e0e7ff', iconColor: '#4f46e5', priority: 'High' },
  'lower-knee': { iconBg: '#e0f2fe', iconColor: '#0284c7', priority: 'High' },
  'lower-ankle': { iconBg: '#ccfbf1', iconColor: '#0d9488', priority: 'Medium' },
  'lower-balance': { iconBg: '#ede9fe', iconColor: '#7c3aed', priority: 'Medium' },
  'lower-stepping': { iconBg: '#d1fae5', iconColor: '#059669', priority: 'Low' },
};

function getCategoryIcon(id: string) {
  if (id.includes('shoulder')) return RotateCcw;
  if (id.includes('elbow')) return Activity;
  if (id.includes('wrist') || id.includes('hand') || id.includes('motor')) return Hand;
  if (id.includes('neck')) return RotateCcw;
  if (id.includes('trunk') || id.includes('back')) return Shield;
  return PersonStanding;
}

export function SectionPage() {
  const { sectionId = '' } = useParams();
  const section = getSection(sectionId);
  useDocumentTitle(section?.title ?? 'Rehabilitation Section');

  if (!section) return <Navigate to="/not-found" replace />;

  const cats = getCategoriesForSection(section.id);
  const totalActivities = cats.reduce((sum, c) => sum + c.activities.length, 0);

  return (
    <div className="page section-page">
      {/* Back button and Section Title (Screen 2) */}
      <div className="section-header">
        <Link to={ROUTES.home} className="section-header__back" aria-label="Back to Dashboard">
          <ArrowLeft size={18} />
        </Link>
        <div className="section-header__titles">
          <h1 className="section-header__title">{section.title}</h1>
          <p className="section-header__subtitle">
            {cats.length} categories · {totalActivities} activities
          </p>
        </div>
      </div>

      {/* Category List Cards (Screen 2) */}
      <div className="category-cards-list">
        {cats.map((category) => {
          const style = CATEGORY_STYLES[category.id] ?? {
            iconBg: '#eff6ff',
            iconColor: '#2563eb',
            priority: category.priority === 'P0' ? 'High' : category.priority === 'P1' ? 'Medium' : 'Low',
          };
          const IconComp = getCategoryIcon(category.id);
          const { activities, extras } = getEntriesForCategory(category.id);
          const liveCount = [...activities, ...extras].filter((e) => e.state === 'available').length;
          const priority = style.priority;

          return (
            <Link
              key={category.id}
              to={ROUTES.category(section.id, category.id)}
              className="category-card-item"
            >
              {/* Category Icon */}
              <div
                className="category-card-item__icon"
                style={{ backgroundColor: style.iconBg, color: style.iconColor }}
              >
                <IconComp size={24} />
              </div>

              {/* Card Main Info */}
              <div className="category-card-item__content">
                <div className="category-card-item__top">
                  <span className="category-card-item__title">{category.title}</span>
                  <span className={`badge badge--${priority.toLowerCase()}`}>
                    {priority}
                  </span>
                </div>

                <p className="category-card-item__desc">{category.description}</p>

                <div className="category-card-item__meta">
                  <span>
                    {category.activities.length} activities · {liveCount} {liveCount === 1 ? 'module' : 'modules'}
                  </span>
                </div>
              </div>

              {/* Chevron Arrow */}
              <ChevronRight size={18} className="category-card-item__arrow" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
