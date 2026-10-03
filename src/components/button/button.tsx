import type { ButtonHTMLAttributes, ReactNode } from 'react';
import '../material.css';
import './button.css';

// Mirrors the Figma "Button" component set: Style, Size, Destructive, Is Enabled, Show Icon.
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma "Style". One primary button per screen, for the main action. */
  variant?: ButtonVariant;
  /** Figma "Size". */
  size?: ButtonSize;
  /** Figma "Destructive". For actions that remove or undo something. */
  destructive?: boolean;
  /** Figma "Show Icon". Decorative: the label always says what the button does. */
  icon?: ReactNode;
  /** Shows a busy state and blocks repeat clicks. */
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  destructive = false,
  icon,
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = ['ds-button', `ds-button--${variant}`, `ds-button--${size}`];
  if (destructive) classes.push('ds-button--destructive');
  if (className) classes.push(className);
  return (
    <button
      type={type}
      className={classes.join(' ')}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="ds-button__spinner" aria-hidden="true" />
      ) : (
        icon && (
          <span className="ds-button__icon" aria-hidden="true">
            {icon}
          </span>
        )
      )}
      <span className="ds-button__label">{children}</span>
    </button>
  );
}
