import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { Select } from './select';

const options = [1, 2, 3, 4, 5, 6].map((n) => ({ id: String(n), label: `Option ${n}` }));

// Storybook only: what Select's Docs page says (the component page template).
export const selectPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Picks one option from a list that opens.',
  reactAria: { name: 'Select', href: 'https://react-aria.adobe.com/Select' },
  status: 'ready',
  useFor: ['Picking one option from more than five.', 'A choice in a settings row, where the label already shows nearby.'],
  useElse: [
    <>
      Two to five options, all shown at once: use <DocLink href={docsPath('Components/Toggle button group')}>Toggle button group</DocLink>.
    </>,
    <>
      Picking several options: use <DocLink href={docsPath('Components/Tag')}>Tag</DocLink>.
    </>,
    <>
      Going to another page: use <DocLink href={docsPath('Components/Link')}>Link</DocLink>.
    </>,
  ],
  do: {
    example: <Select label="Label" options={options} defaultSelectedKey="1" />,
    text: 'Give it a visible label. Use aria-label only when the label already shows nearby.',
  },
  dont: {
    example: <Select aria-label="Label" options={options} placeholder="Label" />,
    text: 'Leave out the label and put it in the placeholder, where it disappears once something is picked.',
  },
  keys: [
    { keys: ['Tab'], does: 'Moves focus to it' },
    { keys: ['Enter', 'Space', '↓', '↑'], does: 'Opens the list' },
    { keys: ['↓', '↑'], does: 'Moves through the options while the list is open' },
    { keys: ['Enter', 'Space'], does: 'Picks the option and closes the list' },
    { keys: ['Esc'], does: 'Closes the list without changing the choice' },
    { keys: ['A–Z'], does: 'Jumps to the option that starts with what you type' },
  ],
  screenReader: { pattern: '[Choice] [Label], button', example: 'Option 2 Label, button' },
  accessibility: ['Screen readers hear the current choice and the label together, before anything opens.'],
  imports: ['Select', 'SelectOption'],
  tokens: ['--color-border-[state]', '--color-surface-card', '--color-accent-surface', '--radius-panel', '--shadow-float', '--motion-open-duration'],
  related: [
    { name: 'Toggle button group', href: docsPath('Components/Toggle button group') },
    { name: 'Settings', href: docsPath('Patterns/Settings') },
  ],
};
