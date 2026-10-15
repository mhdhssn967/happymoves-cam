import type { SectionId } from '@/core/types/catalog';

export type Accent = 'upper' | 'lower';

export function accentFor(sectionId: SectionId): Accent {
  return sectionId === 'lower-body' ? 'lower' : 'upper';
}
