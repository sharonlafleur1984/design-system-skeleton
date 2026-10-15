import type { ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import '../material.css';
import '../glass.css';
import '../glass-lens/glass-lens.css';
import './button.css';

// Mirrors the Figma "Button" component set: Style, Size, Destructive, Is Enabled, Show Icon.
// Built on React Aria's Button, which handles press, keyboard, focus and the busy
// announcement the same way on mouse, touch and screen readers. This file only adds the look.
// Glass (Oct 15): for any background except other glass. The container's useGlassLight lights it.
// On artwork the design system controls (After Graduation's header, Life Hub's marble), lens on
// draws it as lens glass.
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'glass';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<AriaButtonProps, 'children' | 'className' | 'style'> {
  /** Figma "Style". One primary button per screen, for the main action. Glass is never on glass. */
  variant?: ButtonVariant;
  /** Figma "Size". */
  size?: ButtonSize;
  /** Figma "Destructive". For actions that remove or undo something. */
  destructive?: boolean;
  /** Figma "Show Icon". Decorative: the label always says what the button does. */
  icon?: ReactNode;
  /** Shows a busy state, announces it, and blocks repeat presses. The button stays focusable. (React Aria's name.) */
  isPending?: boolean;
  /** Figma "Is Enabled = False". (React Aria's name.) */
  isDisabled?: boolean;
  /** @deprecated Use isPending, React Aria's name. */
  loading?: boolean;
  /** @deprecated Use isDisabled, React Aria's name. */
  disabled?: boolean;
  className?: string;
  /** Storybook only: forces a look ("hover" or "pressed") for the state gallery. */
  'data-state'?: 'hover' | 'pressed';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  destructive = false,
  icon,
  isPending,
  isDisabled,
  loading,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const pending = isPending ?? loading ?? false;
  const classes = ['ds-button', `ds-button--${variant}`, `ds-button--${size}`];
  if (variant === 'glass') classes.push('ds-glass', 'ds-lens');
  if (destructive) classes.push('ds-button--destructive');
  if (className) classes.push(className);
  return (
    <AriaButton
      {...rest}
      className={classes.join(' ')}
      isDisabled={isDisabled ?? disabled ?? false}
      isPending={pending}
    >
      {pending ? (
        <span className="ds-button__spinner" aria-hidden="true" />
      ) : (
        icon && (
          <span className="ds-button__icon" aria-hidden="true">
            {icon}
          </span>
        )
      )}
      <span className="ds-button__label">{children}</span>
    </AriaButton>
  );
}
