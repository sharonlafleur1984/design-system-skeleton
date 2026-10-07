import type { ReactNode } from 'react';
import {
  SelectionIndicator,
  ToggleButton,
  ToggleButtonGroup,
  type Key,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from 'react-aria-components';
import '../material.css';
import './segmented-control.css';

// Segmented control: pick one of two to five options that change how the same content shows
// ("Week" or "Month"). Built on React Aria's ToggleButtonGroup, which handles arrow keys and announces
// which option is chosen. This file only adds the look.
// The track is sunken; the chosen option sits under a glass lens that slides to it, with the same thin
// line of light as buttons. The lens shape marks the choice, so color is never the only signal.

export interface SegmentedControlProps
  extends Omit<ToggleButtonGroupProps, 'className' | 'style' | 'children' | 'selectionMode' | 'orientation'> {
  /** Required: names the group for screen readers, for example "Show by". */
  'aria-label': string;
  className?: string;
  children: ReactNode;
}

export function SegmentedControl({ className, children, disallowEmptySelection = true, ...rest }: SegmentedControlProps) {
  const classes = ['ds-segmented'];
  if (className) classes.push(className);
  return (
    <ToggleButtonGroup {...rest} selectionMode="single" disallowEmptySelection={disallowEmptySelection} className={classes.join(' ')}>
      {children}
    </ToggleButtonGroup>
  );
}

export interface SegmentProps extends Omit<ToggleButtonProps, 'className' | 'style' | 'children' | 'id'> {
  /** Unique within its control. Selection reports this id. */
  id: Key;
  /** Storybook only: forces a look ("hover" or "focus") for the state gallery. */
  'data-state'?: 'hover' | 'focus';
  className?: string;
  children: ReactNode;
}

export function Segment({ className, children, ...rest }: SegmentProps) {
  const classes = ['ds-segmented__option'];
  if (className) classes.push(className);
  return (
    <ToggleButton {...rest} className={classes.join(' ')}>
      <SelectionIndicator className="ds-segmented__lens" />
      <span className="ds-segmented__label">{children}</span>
    </ToggleButton>
  );
}
