import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Select } from './select';

const options = [1, 2, 3, 4, 5, 6].map((n) => ({ id: String(n), label: `Option ${n}` }));

// Storybook only: what Select's Docs page says (the component page template).
export const selectPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Picks one option from a list that opens.',
  status: 'ready',
  builtWith: { reactAria: 'Select' },
  useFor: ['Picking one option from more than five.', 'A choice in a settings row, where the label already shows nearby.'],
  useElse: [
    { job: 'Two to five options, all shown at once', instead: { name: 'Toggle button group', title: 'Components/Toggle button group' } },
    { job: 'Picking several options', instead: { name: 'Tag', title: 'Components/Tag' } },
    { job: 'Going to another page', instead: { name: 'Link', title: 'Components/Link' } },
  ],
  do: {
    example: <Select label="Label" options={options} defaultSelectedKey="1" />,
    rules: ['Give it a visible label.', 'Use aria-label only when the label already shows nearby.'],
  },
  dont: {
    example: <Select aria-label="Label" options={options} placeholder="Label" />,
    rules: ['Leave out the label and put it in the placeholder, where it disappears once something is picked.'],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves focus to it.' },
    { keys: ['Enter', 'Space', '↓', '↑'], result: 'Opens the list.' },
    { keys: ['↓', '↑'], result: 'Moves through the options while the list is open.' },
    { keys: ['Enter', 'Space'], result: 'Picks the option and closes the list.' },
    { keys: ['Esc'], result: 'Closes the list without changing the choice.' },
    { keys: ['A–Z'], result: 'Jumps to the option that starts with what you type.' },
  ],
  screenReader: { pattern: '[Choice] [Label], button', example: 'Option 2 Label, button' },
  accessibility: ['Screen readers hear the current choice and the label together, before anything opens.'],
  imports: ['Select', 'SelectOption'],
  tokens: ['--color-border-[state]', '--color-surface-card', '--color-accent-surface', '--radius-panel', '--shadow-float', '--motion-open-duration'],
  related: [
    { name: 'Toggle button group', title: 'Components/Toggle button group' },
    { name: 'Settings', title: 'Patterns/Settings' },
  ],
  states: { disabled: { isDisabled: true } },
};
