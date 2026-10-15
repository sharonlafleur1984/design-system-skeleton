import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  type Key,
  type SelectProps as AriaSelectProps,
} from 'react-aria-components';
import './select.css';
import '../corners.css';

// Select: pick one from a list that's too long for a segmented control (more than five options),
// like a school year or a state. Built on React Aria's Select: it opens with Enter, Space or the arrow
// keys, typing jumps to a match, and screen readers hear the label and the current choice.

export interface SelectOption {
  id: Key;
  label: string;
}

export interface SelectProps extends Omit<AriaSelectProps<SelectOption>, 'children' | 'className' | 'style' | 'items'> {
  /** The visible label above the select. Leave out only when aria-label is given. */
  label?: ReactNode;
  /** Names the select for screen readers when there's no visible label. */
  'aria-label'?: string;
  options: SelectOption[];
  className?: string;
  /** Shown before anything is picked. */
  placeholder?: string;
}

export function Select({ label, options, className, ...rest }: SelectProps) {
  return (
    <AriaSelect {...rest} className={className ? `ds-select ${className}` : 'ds-select'}>
      {label && <Label className="ds-select__label">{label}</Label>}
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
