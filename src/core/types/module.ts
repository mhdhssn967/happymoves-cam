import type { ComponentType, LazyExoticComponent } from 'react';

/**
 * Lifecycle label shown to clinicians / developers.
 *  - template : reference implementation to copy when starting a new module
 *  - demo     : working technology demonstration, not a clinical exercise yet
 *  - beta     : functional, under clinical validation
 *  - stable   : released
 */
export type ModuleStatus = 'template' | 'demo' | 'beta' | 'stable';

/** Tracking technologies a module may rely on. */
export type TrackingKind = 'pose' | 'hands';

/** Props every module screen receives from the shell. */
export interface ModuleScreenProps {
  definition: ModuleDefinition;
}

/**
 * The contract every rehabilitation module must fulfil.
 *
 * A module lives in its own folder under `src/modules/<module-id>/` and
 * default-exports the result of `defineModule({...})` from its `index.ts`.
 * The registry discovers it automatically – nothing else needs editing.
 */
export interface ModuleDefinition {
  /** Unique kebab-case id; must match the folder name. */
  id: string;
  title: string;
  /** One or two sentences for the module card. */
  summary: string;
  /** Must match a `CategoryDefinition.id` in the catalog. */
  categoryId: string;
  /**
   * Optional: slug of the catalog activity this module implements
   * (e.g. "hand-opening-and-closing"). When set, the module replaces the
   * "planned" placeholder for that activity. When omitted, the module is
   * listed in the category as a stand-alone module.
   */
  activityId?: string;
  status: ModuleStatus;
  /** Whether the module needs the webcam. Drives badges and permission UX. */
  requiresCamera: boolean;
  tracking?: TrackingKind[];
  /** Lazy-loaded screen so each module is its own code-split chunk. */
  component: LazyExoticComponent<ComponentType<ModuleScreenProps>>;
}

/** Identity helper that gives authors type-checking and autocompletion. */
export function defineModule(definition: ModuleDefinition): ModuleDefinition {
  return definition;
}

/**
 * What the UI lists inside a category: either an implemented module or a
 * planned activity from the catalog that has no module yet.
 */
export interface ModuleEntry {
  /** URL slug under /section/:section/:category/:slug */
  slug: string;
  title: string;
  summary?: string;
  state: 'available' | 'planned';
  module?: ModuleDefinition;
}
