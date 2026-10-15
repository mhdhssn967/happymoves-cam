import type { IconName } from '@/core/config/icons';

/** The two top-level clinical sections shown on the dashboard. */
export type SectionId = 'upper-body' | 'lower-body';

/** Development priority taken from the Happy Moves Cam module document. */
export type Priority = 'P0' | 'P1' | 'P2';

export interface SectionDefinition {
  id: SectionId;
  title: string;
  description: string;
  icon: IconName;
}

/**
 * A rehabilitation category (e.g. "Shoulder Mobility").
 * Pure data – no React, no logic. Add a new one by appending to the
 * relevant file in `src/catalog/<section>/categories.ts`.
 */
export interface CategoryDefinition {
  /** Stable kebab-case id, unique across the whole catalog. Used in URLs. */
  id: string;
  /** Number from the module document (kept for traceability). */
  number: number;
  sectionId: SectionId;
  title: string;
  description: string;
  icon: IconName;
  priority: Priority;
  /** Every activity listed for the category in the module document. */
  activities: string[];
  /** "Initial activities to develop" from the priority table. */
  initialFocus: string[];
}
