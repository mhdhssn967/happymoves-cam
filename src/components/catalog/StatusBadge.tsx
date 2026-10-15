import { Badge } from '@/components/ui';
import type { ModuleEntry, ModuleStatus } from '@/core/types/module';
import type { Priority } from '@/core/types/catalog';

const STATUS_LABEL: Record<ModuleStatus, string> = {
  template: 'Template',
  demo: 'Demo',
  beta: 'Beta',
  stable: 'Stable',
};

const STATUS_TONE: Record<ModuleStatus, 'info' | 'warning' | 'success'> = {
  template: 'info',
  demo: 'warning',
  beta: 'warning',
  stable: 'success',
};

/** Badge describing an entry: Planned, or the module's lifecycle status. */
export function EntryStatusBadge({ entry }: { entry: ModuleEntry }) {
  if (!entry.module) return <Badge>Planned</Badge>;
  const { status } = entry.module;
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge tone="accent">{priority}</Badge>;
}
