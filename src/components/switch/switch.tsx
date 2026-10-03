import { useId, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './switch.css';

// Mirrors the Figma "Switch" set: checked (true, false).
// Follows the W3C switch pattern: a button with role="switch" and aria-checked.
export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** The visible label, for example "Email reminders". */
  label: ReactNode;
  /** Controlled on or off. Leave out to let the switch manage itself. */
  checked?: boolean;
  /** Starting value when uncontrolled. */
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  id,
  className,
  ...rest
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = checked ?? internal;
  const autoId = useId();
  const labelId = `${id ?? autoId}-label`;
  const classes = ['ds-switch'];
  if (className) classes.push(className);

  const toggle = () => {
    const next = !isOn;
    if (checked === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <span className={classes.join(' ')}>
      <button
        id={id ?? autoId}
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-labelledby={labelId}
        className="ds-switch__track"
        disabled={disabled}
        onClick={toggle}
        {...rest}
      >
        <span className="ds-switch__knob" aria-hidden="true" />
      </button>
      <span id={labelId} className="ds-switch__label" onClick={disabled ? undefined : toggle}>
        {label}
      </span>
    </span>
  );
}
