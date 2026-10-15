import {
  Accessibility,
  Activity,
  Camera,
  Eye,
  Footprints,
  Grip,
  Hand,
  PersonStanding,
  Pointer,
  RotateCw,
  Scale,
  Target,
  Dumbbell,
  Puzzle,
  type LucideIcon,
} from 'lucide-react';

/**
 * Central icon map. Catalog data refers to icons by name so it stays plain,
 * serialisable data; swap or add icons here only.
 */
export const ICONS = {
  accessibility: Accessibility,
  activity: Activity,
  camera: Camera,
  dumbbell: Dumbbell,
  eye: Eye,
  footprints: Footprints,
  grip: Grip,
  hand: Hand,
  person: PersonStanding,
  pointer: Pointer,
  puzzle: Puzzle,
  rotate: RotateCw,
  scale: Scale,
  target: Target,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
