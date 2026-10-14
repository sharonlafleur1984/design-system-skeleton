import type { ReactNode } from 'react';
import { Switch as AriaSwitch, type SwitchProps as AriaSwitchProps } from 'react-aria-components';
import '../material.css';
import './switch.css';

// Mirrors the Figma "Switch" set: checked (true, false).
// Built on React Aria's Switch: a real, visually hidden input with role="switch" inside the label,
// so keyboard, touch and screen readers work the same everywhere. This file only adds the look.
export interface SwitchProps
  extends Omit<AriaSwitchProps, 'children' | 'className' | 'style'> {
  /** The visible label, for example "Email reminders". */
  label: ReactNode;
  /** @deprecated Use isSelected, React Aria's name. */
  checked?: boolean;
  /** @deprecated Use defaultSelected, React Aria's name. */
  defaultChecked?: boolean;
  /** @deprecated Use isDisabled, React Aria's name. */
  disabled?: boolean;
  className?: string;
}

export function Switch({ label, isSelected, defaultSelected, isDisabled, checked, defaultChecked, disabled, className, ...rest }: SwitchProps) {
  const classes = ['ds-switch'];
  if (className) classes.push(className);
  return (
    <AriaSwitch {...rest} className={classes.join(' ')} isSelected={isSelected ?? checked} defaultSelected={defaultSelected ?? defaultChecked} isDisabled={isDisabled ?? disabled}>
      <span className="ds-switch__track" aria-hidden="true">
        <span className="ds-switch__knob" />
      </span>
      <span className="ds-switch__label">{label}</span>
    </AriaSwitch>
  );
}
