import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { ToggleButton, ToggleButtonGroup } from './toggle-button-group';

// Storybook only: what Toggle button group's page says (the component page template).
export const toggleButtonGroupPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Picks one of two to five options that change how the same content shows.',
  status: 'ready',
  builtWith: { reactAria: 'ToggleButtonGroup' },
  useFor: ['Changing how the same content shows, like Week or Month, or List or Calendar.'],
  useElse: [
    { job: 'Switching between different content', instead: { name: 'Tabs', title: 'Components/Tabs' } },
    { job: 'More than five options', instead: { name: 'Select', title: 'Components/Select' } },
    { job: 'An action', instead: { name: 'Button', title: 'Components/Button' } },
  ],
  do: {
    example: (
      <ToggleButtonGroup aria-label="Label" defaultSelectedKeys={['1']}>
        <ToggleButton id="1">Week</ToggleButton>
        <ToggleButton id="2">Month</ToggleButton>
      </ToggleButtonGroup>
    ),
    rules: ['Keep labels short and about the same length.'],
  },
  dont: {
    example: (
      <ToggleButtonGroup aria-label="Label" defaultSelectedKeys={['1']}>
        <ToggleButton id="1">Save changes</ToggleButton>
        <ToggleButton id="2">Cancel</ToggleButton>
      </ToggleButtonGroup>
    ),
    rules: ['Use it for actions, like Save changes or Cancel.', 'Those are buttons.'],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves focus into the group, then out of it.' },
    { keys: ['←', '→'], result: 'Moves between options.' },
    { keys: ['Space', 'Enter'], result: 'Picks the option.' },
  ],
  screenReader: { pattern: '[Label], radio, checked, [n] of [total]', example: 'Week, radio, checked, 1 of 2' },
  accessibility: [
    'The group needs an aria-label, like “Show by”.',
    'One option is always chosen. It sits under an indicator with bolder text, so color is never the only signal.',
  ],
  imports: ['ToggleButtonGroup', 'ToggleButton'],
  tokens: ['--color-surface-sunken', '--color-surface-card', '--color-ink-[state]', '--control-height-medium', '--radius-medium', '--motion-duration-base'],
  related: [
    { name: 'Tabs', title: 'Components/Tabs' },
    { name: 'Select', title: 'Components/Select' },
    { name: 'Tag', title: 'Components/Tag' },
  ],
  states: {
    disabled: { isDisabled: true },
  },
};
