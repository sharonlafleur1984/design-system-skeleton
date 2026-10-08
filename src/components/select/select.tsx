import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  type Key,
  type SelectProps as AriaSelectProps,
} from 'react-aria-components';
import './select.css';

// Select: pick one from a list that's too long for a segmented control (more than about four options),
// like a school year or a state. Built on React Aria's Select: it opens with Enter, Space or the arrow
// keys, typing jumps to a match, and screen readers hear the label and the current choice.

export interface SelectOption {
  id: Key;
  label: string;
}

export interface SelectProps extends Omit<AriaSelectProps<SelectOption>, 'children' | 'className' | 'style' | 'items'> {
  /** Names the select for screen readers when there's no visible label next to it. */
  'aria-label'?: string;
  options: SelectOption[];
  className?: string;
  /** Shown before anything is picked. */
  placeholder?: string;
  children?: ReactNode;
}

export function Select({ options, className, ...rest }: SelectProps) {
  return (
    <AriaSelect {...rest} className={className ? `ds-select ${className}` : 'ds-select'}>
      <AriaButton className="ds-select__button">
        <SelectValue className="ds-select__value" />
        <span className="ds-select__chevron" aria-hidden="true" />
      </AriaButton>
      <Popover className="ds-select__popover" offset={4}>
        <ListBox className="ds-select__list" items={options}>
          {(o) => (
            <ListBoxItem id={o.id} textValue={o.label} className="ds-select__option">
              {o.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
