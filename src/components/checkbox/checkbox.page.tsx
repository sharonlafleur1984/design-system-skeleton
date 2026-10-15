import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { Checkbox } from './checkbox';

const stack = { display: 'grid', gap: 'var(--space-2)' } as const;

// Storybook only: what Checkbox's Docs page says (the component page template).
export const checkboxPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Turns one option on or off, or marks a task done.',
  reactAria: { name: 'Checkbox', href: 'https://react-aria.adobe.com/Checkbox' },
  status: 'ready',
  useFor: ['Lists where people can pick several options.', 'To-do items that get marked done.'],
  useElse: [
    <>
      A setting that takes effect right away: use <DocLink href={docsPath('Components/Switch')}>Switch</DocLink>.
    </>,
    <>
      Picking one of a few options: use <DocLink href={docsPath('Components/Toggle button group')}>Toggle button group</DocLink>.
    </>,
  ],
  do: {
    example: (
      <div style={stack}>
        <Checkbox label="Option 1" defaultSelected />
        <Checkbox label="Option 2" />
        <Checkbox label="Option 3" defaultSelected />
      </div>
    ),
    text: 'A list where people can pick several, each with its own label.',
  },
  dont: {
    example: <Checkbox label="Dark mode" defaultSelected />,
    text: 'A checkbox for a setting that changes right away. Use a Switch.',
  },
  keys: [
    { keys: ['Tab'], does: 'Moves focus to it' },
    { keys: ['Space'], does: 'Checks or unchecks it' },
  ],
  screenReader: { pattern: '[Label], checkbox, [checked or not checked]', example: 'Option 1, checkbox, checked' },
  accessibility: ['A real checkbox input sits inside the label, so clicking or tapping the label toggles it too.'],
  imports: ['Checkbox'],
  tokens: ['--control-box', '--radius-box', '--color-border-strong', '--color-accent-base', '--color-surface-glass', '--color-border-focus'],
  related: [
    { name: 'Switch', href: docsPath('Components/Switch') },
    { name: 'Toggle button group', href: docsPath('Components/Toggle button group') },
    { name: 'Settings', href: docsPath('Patterns/Settings') },
  ],
};
