import { Suspense } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Navigate, useLocation, useParams, Link } from 'react-router-dom';
import { ErrorBoundary, Loading } from '@/components/ui';
import { PlannedModule } from '@/components/catalog/PlannedModule';
import { ROUTES } from '@/core/config/app';
import { getCategory, getSection } from '@/catalog';
import { resolveEntry } from '@/modules/registry';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import './pages.css';

export function ModulePage() {
  const { sectionId = '', categoryId = '', moduleSlug = '' } = useParams();
  const { pathname } = useLocation();
  const section = getSection(sectionId);
  const category = getCategory(categoryId);
  const entry = category ? resolveEntry(category.id, moduleSlug) : undefined;
  useDocumentTitle(entry?.title);

  if (!section || !category || category.sectionId !== section.id || !entry) {
    return <Navigate to="/not-found" replace />;
  }

  const backTo = ROUTES.category(section.id, category.id);
  const Screen = entry.module?.component;

  return (
    <div className="page module-shell-page">
      {/* Top Patient Breadcrumb Navigation (Screens 4, 5, 7) */}
      <nav className="module-breadcrumbs" aria-label="Breadcrumb">
        <Link to={backTo} className="module-breadcrumbs__back" aria-label="Back">
          <ArrowLeft size={16} />
        </Link>
        <div className="module-breadcrumbs__trail">
          <Link to={ROUTES.section(section.id)} className="module-breadcrumbs__crumb">
            {section.id === 'upper-body' ? 'Upper Body' : 'Lower Body'}
          </Link>
          <ChevronRight size={14} className="module-breadcrumbs__sep" />
          <Link to={backTo} className="module-breadcrumbs__crumb">
            {category.title}
          </Link>
          <ChevronRight size={14} className="module-breadcrumbs__sep" />
          <span className="module-breadcrumbs__current">{entry.title}</span>
        </div>
      </nav>

      {/* For Planned modules without a component */}
      {!entry.module || !Screen ? (
        <div className="planned-module-wrapper">
          <div className="module-header">
            <div className="module-header__top">
              <h1 className="module-header__title">{entry.title}</h1>
              <span className="badge badge--planned">Planned</span>
            </div>
          </div>
          <PlannedModule category={category} entry={entry} />
        </div>
      ) : (
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<Loading label="Loading exercise…" />}>
            <Screen definition={entry.module} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
