import type { HTMLAttributes } from 'react';
import './divider.css';

// Mirrors the Figma "Divider": a 1px line in border/default.
export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** Vertical dividers sit between items in a row. */
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ orientation = 'horizontal', className, ...rest }: DividerProps) {
  const classes = ['ds-divider', `ds-divider--${orientation}`];
  if (className) classes.push(className);
  return <hr className={classes.join(' ')} aria-orientation={orientation} {...rest} />;
}
