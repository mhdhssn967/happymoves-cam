import { Camera } from 'lucide-react';
import { Badge, NavCard } from '@/components/ui';
import { EntryStatusBadge } from './StatusBadge';
import { ROUTES } from '@/core/config/app';
import { accentFor } from '@/core/utils/accent';
import type { CategoryDefinition } from '@/core/types/catalog';
import type { ModuleEntry } from '@/core/types/module';

interface ModuleCardProps {
  category: CategoryDefinition;
  entry: ModuleEntry;
}

/** One module (or planned activity) inside a category. */
export function ModuleCard({ category, entry }: ModuleCardProps) {
  const planned = entry.state === 'planned';

  return (
    <NavCard
      to={ROUTES.module(category.sectionId, category.id, entry.slug)}
      accent={accentFor(category.sectionId)}
      icon={planned ? category.icon : entry.module?.requiresCamera ? 'camera' : 'puzzle'}
      title={entry.title}
      description={planned ? 'Exercise logic not implemented yet.' : entry.summary}
      badges={
        <>
          <EntryStatusBadge entry={entry} />
          {entry.module?.requiresCamera && (
            <Badge>
              <Camera size={12} aria-hidden="true" /> Camera
            </Badge>
          )}
        </>
      }
      muted={planned}
      cta={planned ? 'View Roadmap' : 'Launch Module'}
    />
  );
}
