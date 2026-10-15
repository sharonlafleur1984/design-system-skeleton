import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import '../material.css';
import '../glass.css';
import './card.css';
import { materialClass, type Material } from '../material';

// Mirrors the Figma "Card" set: variant (transparent, translucent, opaque) and state (rest, hover).
export type CardVariant = 'transparent' | 'translucent' | 'opaque';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /**
   * How much the card stands out.
   * transparent: ambient, context. translucent: the default. opaque: primary, focused content.
   */
  variant?: CardVariant;
  /**
   * Default is the subtle frosted look. Glass (the lens) is only for a card that holds an empty state:
   * switch back to default once the card has content, so what people read sits on a steady surface.
   */
  material?: Material;
  /** Lifts on hover. Use only when the whole card is a link or button inside. */
  interactive?: boolean;
  /** The HTML element to render, for example "section" or "article". */
  as?: ElementType;
  children: ReactNode;
}

export function Card({
  variant = 'translucent',
  interactive = false,
  material = 'default',
  as: Tag = 'div',
  className,
  children,
  ...rest
}: CardProps) {
  const classes = ['ds-card', 'ds-glass', `ds-card--${variant}`];
  const lens = materialClass(material);
  if (lens) classes.push(lens);
  if (interactive) classes.push('ds-card--interactive');
  if (className) classes.push(className);
  return (
    <Tag className={classes.join(' ')} {...rest}>
      {children}
    </Tag>
  );
}
