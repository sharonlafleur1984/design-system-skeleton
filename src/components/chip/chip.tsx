import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Label,
  Tag,
  TagGroup,
  TagList,
  type Key,
  type TagGroupProps,
  type TagProps,
} from 'react-aria-components';
import '../material.css';
import './chip.css';

// Chips: filters, picks and tags. Built on React Aria's TagGroup, which handles arrow keys between chips,
// selection, Delete and Backspace to remove, and screen reader announcements. This file only adds the look.
// Chips are controls, so they are glass with the same thin line of light as buttons. Selected chips show
// a check mark as well as a fill, so color is never the only signal.

export interface ChipGroupProps extends Omit<TagGroupProps, 'children' | 'className' | 'style'> {
  /** Visible name for the group, for example "Filter by area". Leave out only if aria-label is given. */
  label?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function ChipGroup({ label, className, children, ...rest }: ChipGroupProps) {
  const classes = ['ds-chip-group'];
  if (className) classes.push(className);
  return (
    <TagGroup {...rest} className={classes.join(' ')}>
      {label && <Label className="ds-chip-group__label">{label}</Label>}
      <TagList className="ds-chip-group__list">{children}</TagList>
    </TagGroup>
  );
}

export interface ChipProps extends Omit<TagProps, 'children' | 'className' | 'style' | 'id'> {
  /** Unique within its group. Selection and removal report this id. */
  id: Key;
  /** Storybook only: forces a look ("hover" or "focus") for the state gallery. */
  'data-state'?: 'hover' | 'focus';
  className?: string;
  children: ReactNode;
}

const Check = () => (
  <svg className="ds-chip__check" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Remove = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export function Chip({ id, className, children, ...rest }: ChipProps) {
  const classes = ['ds-chip'];
  if (className) classes.push(className);
  const textValue = typeof children === 'string' ? children : undefined;
  return (
    <Tag {...rest} id={id} textValue={textValue} className={classes.join(' ')}>
      {({ isSelected, allowsRemoving }) => (
        <>
          {isSelected && <Check />}
          <span className="ds-chip__label">{children}</span>
          {allowsRemoving && (
            // React Aria adds the chip's name after this label, so screen readers hear "Remove FAFSA".
            <AriaButton slot="remove" className="ds-chip__remove" aria-label="Remove">
              <Remove />
            </AriaButton>
          )}
        </>
      )}
    </Tag>
  );
}
