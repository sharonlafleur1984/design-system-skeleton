import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import '../material.css';
import './card.css';

// Mirrors the Figma "Card" set: variant (transparent, translucent, opaque) and state (rest, hover).
export type CardVariant = 'transparent' | 'translucent' | 'opaque';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /**
   * How much the card stands out.
   * transparent: ambient, context. translucent: the default. opaque: primary, focused content.
   * Never glass: glass is only for controls.
   */
  variant?: CardVariant;
  /** Lifts on hover. Use only when the whole card is a link or button inside. */
  interactive?: boolean;
  /** The HTML element to render, for example "section" or "article". */
  as?: ElementType;
  children: ReactNode;
}

export function Card({
  variant = 'translucent',
  interactive = false,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: CardProps) {
  const classes = ['ds-card', `ds-card--${variant}`];
  if (interactive) classes.push('ds-card--interactive');
  if (className) classes.push(className);
  return (
    <Tag className={classes.join(' ')} {...rest}>
      {children}
    </Tag>
  );
}
