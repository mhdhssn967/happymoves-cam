import { ICONS, type IconName } from '@/core/config/icons';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/** Decorative icon resolved by name. Always aria-hidden; pair with visible text. */
export function Icon({ name, size = 24, className }: IconProps) {
  const Component = ICONS[name];
  return <Component size={size} className={className} aria-hidden="true" strokeWidth={1.9} />;
}
