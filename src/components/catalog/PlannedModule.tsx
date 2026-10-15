import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/app';
import type { CategoryDefinition } from '@/core/types/catalog';
import type { ModuleEntry } from '@/core/types/module';
import { PlannedJointIllustration } from './RehabIllustrations';
import '@/pages/pages.css';

/** Placeholder shown for catalog activities that have no module yet (Screen 7). */
export function PlannedModule({
  category,
  entry,
}: {
  category: CategoryDefinition;
  entry: ModuleEntry;
}) {
  const backTo = ROUTES.category(category.sectionId, category.id);

  return (
    <div className="planned-module-container">
      {/* Friendly joint posture illustration */}
      <div className="planned-module-art">
        <PlannedJointIllustration width={130} height={130} />
      </div>

      <p className="planned-module-lead">
        “{entry.title}” is not yet available.
      </p>

      {/* "Here's how it will be built:" Card (Screen 7) */}
      <div className="build-steps-card">
        <h2 className="build-steps-card__title">Here's how it will be built:</h2>
        <ol className="build-steps-card__list">
          <li className="build-steps-card__item">
            <span className="build-steps-card__num">1</span>
            <span>Create the exercise logic in the template</span>
          </li>
          <li className="build-steps-card__item">
            <span className="build-steps-card__num">2</span>
            <span>Add movement tracking (MediaPipe)</span>
          </li>
          <li className="build-steps-card__item">
            <span className="build-steps-card__num">3</span>
            <span>Configure reps, timer and feedback</span>
          </li>
        </ol>
      </div>

      {/* Back to Category Button (Screen 7) */}
      <div className="planned-module-actions">
        <Link to={backTo} className="btn btn--secondary btn--full">
          Back to Category
        </Link>
      </div>
    </div>
  );
}
