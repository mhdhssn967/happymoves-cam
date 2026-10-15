import { categories, getCategory } from '@/catalog';
import { slugify } from '@/core/utils/slug';
import type { ModuleDefinition, ModuleEntry } from '@/core/types/module';

/**
 * Central module registry.
 *
 * Every folder under `src/modules/` that has an `index.ts` default-exporting a
 * `ModuleDefinition` is picked up here automatically. Only the small manifest
 * is loaded eagerly; each module's screen is lazy-loaded on demand.
 */
const manifests = import.meta.glob<{ default: ModuleDefinition }>('./*/index.ts', {
  eager: true,
});

const allModules: ModuleDefinition[] = Object.values(manifests).map((m) => m.default);

if (import.meta.env.DEV) validateRegistry(allModules);

function validateRegistry(modules: ModuleDefinition[]): void {
  const seen = new Set<string>();
  for (const m of modules) {
    if (seen.has(m.id)) console.error(`[registry] Duplicate module id "${m.id}"`);
    seen.add(m.id);

    const category = getCategory(m.categoryId);
    if (!category) {
      console.error(`[registry] Module "${m.id}" references unknown category "${m.categoryId}"`);
      continue;
    }
    if (m.activityId) {
      const known = category.activities.some((a) => slugify(a) === m.activityId);
      if (!known) {
        console.error(
          `[registry] Module "${m.id}" references unknown activity "${m.activityId}" in category "${m.categoryId}"`,
        );
      }
    }
  }
}

export function getAllModules(): ModuleDefinition[] {
  return allModules;
}

export function getModuleById(id: string): ModuleDefinition | undefined {
  return allModules.find((m) => m.id === id);
}

export function getModulesForCategory(categoryId: string): ModuleDefinition[] {
  return allModules.filter((m) => m.categoryId === categoryId);
}

export interface CategoryEntries {
  /** Activities from the module document, implemented or planned. */
  activities: ModuleEntry[];
  /** Stand-alone modules (templates, demos) registered in this category. */
  extras: ModuleEntry[];
}

/** Everything a category page needs to list. */
export function getEntriesForCategory(categoryId: string): CategoryEntries {
  const category = getCategory(categoryId);
  const modules = getModulesForCategory(categoryId);
  if (!category) return { activities: [], extras: [] };

  const activities: ModuleEntry[] = category.activities.map((title) => {
    const slug = slugify(title);
    const module = modules.find((m) => m.activityId === slug);
    return module
      ? { slug, title, summary: module.summary, state: 'available', module }
      : { slug, title, state: 'planned' };
  });

  const extras: ModuleEntry[] = modules
    .filter((m) => !m.activityId)
    .map((m) => ({ slug: m.id, title: m.title, summary: m.summary, state: 'available', module: m }));

  return { activities, extras };
}

export function resolveEntry(categoryId: string, slug: string): ModuleEntry | undefined {
  const { activities, extras } = getEntriesForCategory(categoryId);
  return [...activities, ...extras].find((e) => e.slug === slug);
}

export interface CatalogStats {
  categories: number;
  activities: number;
  modules: number;
}

export function getCatalogStats(): CatalogStats {
  return {
    categories: categories.length,
    activities: categories.reduce((n, c) => n + c.activities.length, 0),
    modules: allModules.length,
  };
}
