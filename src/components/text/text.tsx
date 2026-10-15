import type { ReactNode } from 'react';
import { Heading as AriaHeading, Text as AriaText } from 'react-aria-components';
import './text.css';

// Text parts (Oct 15): each kind of text with its type style already chosen from the theme, so a
// heading on a card and a heading on a page always match. Built on React Aria's Heading and Text, so
// they also fill React Aria's text slots. A heading's look and its rank are separate: `level` (1 to 6)
// is its place in the page outline for screen readers; `variant` is how it looks.

export type HeadingVariant = 'display' | 'title' | 'heading' | 'subheading';

export interface HeadingProps {
  /** Its rank in the page outline: h1 to h6. One h1 per page. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** display (the theme's large display style), title (the default), heading or subheading. */
  variant?: HeadingVariant;
  className?: string;
  children: ReactNode;
}

export function Heading({ level = 2, variant = 'title', className, children }: HeadingProps) {
  return (
    <AriaHeading level={level} className={join('ds-text', `ds-text--${variant}`, className)}>
      {children}
    </AriaHeading>
  );
}

export interface TextPartProps {
  className?: string;
  children: ReactNode;
}

/** Running text. large for reading, default for most text, small for dense places. */
export function Body({ size = 'default', className, children }: TextPartProps & { size?: 'large' | 'default' | 'small' }) {
  return (
    <AriaText elementType="p" className={join('ds-text', `ds-text--body-${size}`, className)}>
      {children}
    </AriaText>
  );
}

/** A small line that names what follows, in the theme's label style (capitals in some themes). */
export function Label({ className, children }: TextPartProps) {
  return (
    <AriaText elementType="p" className={join('ds-text', 'ds-text--label', className)}>
      {children}
    </AriaText>
  );
}

/** A quiet side note, like "Updated 2 hours ago": small, in the secondary text color. */
export function Note({ className, children }: TextPartProps) {
  return (
    <AriaText elementType="p" className={join('ds-text', 'ds-text--note', className)}>
      {children}
    </AriaText>
  );
}

const join = (...names: (string | undefined)[]) => names.filter(Boolean).join(' ');
