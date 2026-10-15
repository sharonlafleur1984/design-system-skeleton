import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Button } from './button';

// Storybook only: what Button's page says (the component page template).
export const buttonPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Starts an action, like saving or sending.',
  status: 'ready',
  builtWith: { reactAria: 'Button' },
  useFor: ['The one main action on a screen: Primary.', 'Other choices beside it: Secondary, or Tertiary for side trips.'],
  useElse: [
    { job: 'Going to another page', instead: { name: 'Link', title: 'Components/Link' } },
    { job: 'Turning a setting on or off', instead: { name: 'Switch', title: 'Components/Switch' } },
    { job: 'Picking one of a few options', instead: { name: 'Toggle button group', title: 'Components/Toggle button group' } },
  ],
  do: {
    example: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button>Save changes</Button>
      </>
    ),
    rules: ['One primary button per screen.', 'A label that says what happens, like Save changes.'],
  },
  dont: {
    example: (
      <>
        <Button>Cancel</Button>
        <Button>Submit</Button>
      </>
    ),
    rules: ['Two primary buttons side by side.', 'A vague label like Submit or Add. Add what?'],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves focus to it, and the focus ring shows.' },
    { keys: ['Enter', 'Space'], result: 'Runs the action.' },
  ],
  screenReader: { pattern: '[Label], button', example: 'Save changes, button' },
  accessibility: [
    'Loading keeps the button focusable, blocks a second press and is announced.',
    'Destructive buttons say what they remove, so red is never the only signal.',
    'Glass turns solid when Reduce transparency or Increase contrast is on.',
  ],
  imports: ['Button'],
  tokens: ['--color-accent-[state]', '--radius-[size]', '--control-height-[size]', '--color-border-focus', '--motion-duration-fast'],
  related: [
    { name: 'Link', title: 'Components/Link' },
    { name: 'Toggle button group', title: 'Components/Toggle button group' },
    { name: 'Radius', title: 'Foundations/Space, radius and shadow', story: 'radius' },
  ],
  states: {
    hover: { 'data-state': 'hover' },
    pressed: { 'data-state': 'pressed' },
    focus: { 'data-state': 'focus' },
    disabled: { isDisabled: true },
    loading: { isPending: true },
  },
};
