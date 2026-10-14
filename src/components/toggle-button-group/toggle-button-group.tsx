import type { ReactNode } from 'react';
import {
  SelectionIndicator,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type Key,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from 'react-aria-components';
import '../material.css';
import './toggle-button-group.css';

// Toggle button group (Figma: "Segmented control"): pick one of two to five options that change how
// the same content shows ("Week" or "Month"). Built on React Aria's ToggleButtonGroup, which handles
// arrow keys and announces which option is chosen. One option is always chosen. This file only adds the look.
// The track is sunken; the chosen option sits under an indicator that slides to it, with the same thin
// line of light as buttons. The indicator's shape marks the choice, so color is never the only signal.

export interface ToggleButtonGroupProps
  extends Omit<AriaToggleButtonGroupProps, 'className' | 'style' | 'children' | 'selectionMode' | 'orientation'> {
  /** Required: names the group for screen readers, for example "Show by". */
  'aria-label': string;
  className?: string;
  children: ReactNode;
}

export function ToggleButtonGroup({ className, children, disallowEmptySelection = true, ...rest }: ToggleButtonGroupProps) {
  const classes = ['ds-toggle-group'];
  if (className) classes.push(className);
  return (
    <AriaToggleButtonGroup {...rest} selectionMode="single" disallowEmptySelection={disallowEmptySelection} className={classes.join(' ')}>
      {children}
    </AriaToggleButtonGroup>
  );
}

export interface ToggleButtonProps extends Omit<AriaToggleButtonProps, 'className' | 'style' | 'children' | 'id'> {
  /** Unique within its group. Selection reports this id. */
  id: Key;
  /** Storybook only: forces a look ("hover" or "focus") for the state gallery. */
  'data-state'?: 'hover' | 'focus';
  className?: string;
  children: ReactNode;
}

export function ToggleButton({ className, children, ...rest }: ToggleButtonProps) {
  const classes = ['ds-toggle-group__option'];
  if (className) classes.push(className);
  return (
    <AriaToggleButton {...rest} className={classes.join(' ')}>
      <SelectionIndicator className="ds-toggle-group__indicator" />
      <span className="ds-toggle-group__label">{children}</span>
    </AriaToggleButton>
  );
}

/** @deprecated Renamed to ToggleButtonGroup, React Aria's name. Kept so existing apps keep working. */
export const SegmentedControl = ToggleButtonGroup;
/** @deprecated Renamed to ToggleButton. */
export const Segment = ToggleButton;
/** @deprecated Renamed to ToggleButtonGroupProps. */
export type SegmentedControlProps = ToggleButtonGroupProps;
/** @deprecated Renamed to ToggleButtonProps. */
export type SegmentProps = ToggleButtonProps;
