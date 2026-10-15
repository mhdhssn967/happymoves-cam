import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/app';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { NotFoundIllustration } from '@/components/catalog/RehabIllustrations';
import './pages.css';

export function NotFoundPage() {
  useDocumentTitle('Page not found');

  return (
    <div className="page not-found-page">
      <div className="not-found-card">
        <div className="not-found-art">
          <NotFoundIllustration width={180} height={140} />
        </div>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-desc">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to={ROUTES.home} className="btn btn--primary not-found-btn">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
