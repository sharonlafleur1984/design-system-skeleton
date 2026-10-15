import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Label,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList,
  type Key,
  type TagGroupProps as AriaTagGroupProps,
  type TagProps as AriaTagProps,
} from 'react-aria-components';
import '../material.css';
import '../corners.css';
import './tag.css';
import { lensClass, resolveAppearance, type Appearance, type Material } from '../material';

// Tags: filters, picks and labels someone can remove (Figma: "Chip"). Built on React Aria's TagGroup, which handles arrow keys between tags,
// selection, Delete and Backspace to remove, and screen reader announcements. This file only adds the look.
// Tags are controls, so they are glass with the same thin line of light as buttons. Selected tags show
// a check mark as well as a fill, so color is never the only signal.

export interface TagGroupProps extends Omit<AriaTagGroupProps, 'children' | 'className' | 'style'> {
  /** Visible name for the group, for example "Filter by area". Leave out only if aria-label is given. */
  label?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function TagGroup({ label, className, children, ...rest }: TagGroupProps) {
  const classes = ['ds-tag-group'];
  if (className) classes.push(className);
  return (
    <AriaTagGroup {...rest} className={classes.join(' ')}>
      {label && <Label className="ds-tag-group__label">{label}</Label>}
      <TagList className="ds-tag-group__list">{children}</TagList>
    </AriaTagGroup>
  );
}

export interface TagProps extends Omit<AriaTagProps, 'children' | 'className' | 'style' | 'id'> {
  /** Unique within its group. Selection and removal report this id. */
  id: Key;
  /** Solid (the starting look) or Glass, which bends the art behind the tag on artwork the system controls. */
  appearance?: Appearance;
  /** @deprecated Use appearance: "default" is now "solid". */
  material?: Material;
  /** Storybook only: forces a look ("hover" or "focus") for the state gallery. */
  'data-state'?: 'hover' | 'focus';
  className?: string;
  children: ReactNode;
}

const Check = () => (
  <svg className="ds-tag__check" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Remove = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export function Tag({ id, className, appearance, material, children, ...rest }: TagProps) {
  const classes = ['ds-tag'];
  const lens = lensClass(resolveAppearance(appearance, material));
  if (lens) classes.push(lens);
  if (className) classes.push(className);
  const textValue = typeof children === 'string' ? children : undefined;
  return (
    <AriaTag {...rest} id={id} textValue={textValue} className={classes.join(' ')}>
      {({ isSelected, allowsRemoving }) => (
        <>
          {isSelected && <Check />}
          <span className="ds-tag__label">{children}</span>
          {allowsRemoving && (
            // React Aria adds the tag's name after this label, so screen readers hear "Remove" and the tag's name.
            <AriaButton slot="remove" className="ds-tag__remove" aria-label="Remove">
              <Remove />
            </AriaButton>
          )}
        </>
      )}
    </AriaTag>
  );
}

/** @deprecated Renamed to TagGroup, React Aria's name. Kept so existing apps keep working. */
export const ChipGroup = TagGroup;
/** @deprecated Renamed to Tag, React Aria's name. */
export const Chip = Tag;
/** @deprecated Renamed to TagGroupProps. */
export type ChipGroupProps = TagGroupProps;
/** @deprecated Renamed to TagProps. */
export type ChipProps = TagProps;
