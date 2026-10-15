import type { CategoryDefinition, SectionDefinition, SectionId } from '@/core/types/catalog';
import { sections } from './sections';
import { upperBodyCategories } from './upper-body/categories';
import { lowerBodyCategories } from './lower-body/categories';

/** Every category, in document order. */
export const categories: CategoryDefinition[] = [...upperBodyCategories, ...lowerBodyCategories];

export { sections };

export function getSection(id: string): SectionDefinition | undefined {
  return sections.find((s) => s.id === id);
}

export function getCategory(id: string): CategoryDefinition | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoriesForSection(sectionId: SectionId): CategoryDefinition[] {
  return categories.filter((c) => c.sectionId === sectionId);
}
