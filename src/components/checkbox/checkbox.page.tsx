import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Checkbox } from './checkbox';

const stack = { display: 'grid', gap: 'var(--space-2)' } as const;

// Storybook only: what Checkbox's page says (the component page template).
export const checkboxPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Turns one option on or off, or marks a task done.',
  status: 'ready',
  builtWith: { reactAria: 'Checkbox' },
  useFor: ['Lists where people can pick several options.', 'To-do items that get marked done.'],
  useElse: [
    { job: 'A setting that takes effect right away', instead: { name: 'Switch', title: 'Components/Switch' } },
    { job: 'Picking one of a few options', instead: { name: 'Toggle button group', title: 'Components/Toggle button group' } },
  ],
  do: {
    example: (
      <div style={stack}>
        <Checkbox label="Option 1" defaultSelected />
        <Checkbox label="Option 2" />
        <Checkbox label="Option 3" defaultSelected />
      </div>
    ),
    rules: ['A list where people can pick several, each with its own label.'],
  },
  dont: {
    example: <Checkbox label="Dark mode" defaultSelected />,
    rules: ['A checkbox for a setting that changes right away.', 'Use a Switch.'],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves focus to it.' },
    { keys: ['Space'], result: 'Checks or unchecks it.' },
  ],
  screenReader: { pattern: '[Label], checkbox, [checked or not checked]', example: 'Option 1, checkbox, checked' },
  accessibility: ['A real checkbox input sits inside the label, so clicking or tapping the label toggles it too.'],
  imports: ['Checkbox'],
  tokens: ['--control-box', '--radius-box', '--color-border-strong', '--color-accent-base', '--color-surface-glass', '--color-border-focus'],
  related: [
    { name: 'Switch', title: 'Components/Switch' },
    { name: 'Toggle button group', title: 'Components/Toggle button group' },
    { name: 'Settings', title: 'Patterns/Settings' },
  ],
  states: {
    hover: { 'data-state': 'hover' },
    focus: { 'data-state': 'focus' },
    disabled: { isDisabled: true },
  },
};
