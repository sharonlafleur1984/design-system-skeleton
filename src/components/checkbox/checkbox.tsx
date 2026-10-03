import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import '../material.css';
import './checkbox.css';

// Mirrors the Figma "Checkbox" set: checked (true, false) and state (rest, hover, focus, disabled).
// A real <input type="checkbox">, so keyboard and screen readers work without extra code.
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** The visible label. Clicking it toggles the box. */
  label: ReactNode;
}

export function Checkbox({ label, id, className, ...rest }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const classes = ['ds-checkbox'];
  if (className) classes.push(className);
  return (
    <label className={classes.join(' ')} htmlFor={inputId}>
      <input id={inputId} type="checkbox" className="ds-checkbox__input" {...rest} />
      <span className="ds-checkbox__box" aria-hidden="true" />
      <span className="ds-checkbox__label">{label}</span>
    </label>
  );
}
