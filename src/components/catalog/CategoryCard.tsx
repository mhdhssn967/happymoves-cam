import { NavCard } from '@/components/ui';
import { PriorityBadge } from './StatusBadge';
import { ROUTES } from '@/core/config/app';
import { accentFor } from '@/core/utils/accent';
import { pluralize } from '@/core/utils/format';
import { getEntriesForCategory } from '@/modules/registry';
import type { CategoryDefinition } from '@/core/types/catalog';

/** Category summary card: icon, title, activity list and live module count. */
export function CategoryCard({ category }: { category: CategoryDefinition }) {
  const { activities, extras } = getEntriesForCategory(category.id);
  const live = [...activities, ...extras].filter((e) => e.state === 'available').length;

  return (
    <NavCard
      to={ROUTES.category(category.sectionId, category.id)}
      accent={accentFor(category.sectionId)}
      icon={category.icon}
      title={category.title}
      description={category.description}
      badges={<PriorityBadge priority={category.priority} />}
      items={category.activities}
      maxItems={4}
      footer={`${pluralize(category.activities.length, 'activity', 'activities')} · ${live} available`}
      cta="Explore category"
    />
  );
}
