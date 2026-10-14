import type { ReactNode } from 'react';
import { Checkbox as AriaCheckbox, type CheckboxProps as AriaCheckboxProps } from 'react-aria-components';
import '../material.css';
import './checkbox.css';

// Mirrors the Figma "Checkbox" set: checked (true, false) and state (rest, hover, focus, disabled).
// Built on React Aria's Checkbox: a real, visually hidden checkbox input inside the label, so keyboard,
// touch and screen readers work the same everywhere. This file only adds the look.
export interface CheckboxProps
  extends Omit<AriaCheckboxProps, 'children' | 'className' | 'style'> {
  /** The visible label. Clicking it toggles the box. */
  label: ReactNode;
  /** @deprecated Use isSelected, React Aria's name. */
  checked?: boolean;
  /** @deprecated Use defaultSelected, React Aria's name. */
  defaultChecked?: boolean;
  /** @deprecated Use isDisabled, React Aria's name. */
  disabled?: boolean;
  className?: string;
  /** Storybook only: forces a look ("hover" or "focus") for the state gallery. */
  'data-state'?: 'hover' | 'focus';
}

export function Checkbox({ label, isSelected, defaultSelected, isDisabled, checked, defaultChecked, disabled, className, 'data-state': state, ...rest }: CheckboxProps) {
  const classes = ['ds-checkbox'];
  if (className) classes.push(className);
  return (
    <AriaCheckbox
      {...rest}
      className={classes.join(' ')}
      isSelected={isSelected ?? checked}
      defaultSelected={defaultSelected ?? defaultChecked}
      isDisabled={isDisabled ?? disabled}
      data-state={state}
    >
      <span className="ds-checkbox__box" aria-hidden="true" />
      <span className="ds-checkbox__label">{label}</span>
    </AriaCheckbox>
  );
}
