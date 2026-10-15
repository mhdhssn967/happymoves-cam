import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import './ui.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'indigo' | 'amber' | 'outline';
export type ButtonSize = 'md' | 'sm' | 'lg';

function classes(variant: ButtonVariant, size: ButtonSize, extra?: string, glow?: boolean) {
  return [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    glow ? 'btn--glow' : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  glow?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  glow,
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, className, glow)} {...rest}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

export interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  glow?: boolean;
}

export function LinkButton({
  variant = 'secondary',
  size = 'md',
  glow,
  icon,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link className={classes(variant, size, className, glow)} {...rest}>
      {icon}
      <span>{children}</span>
    </Link>
  );
}
