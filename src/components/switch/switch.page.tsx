import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Button } from '../button/button';
import { Switch } from './switch';

// Storybook only: what Switch's Docs page says (the component page template).
export const switchPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Turns a setting on or off right away.',
  status: 'ready',
  builtWith: { reactAria: 'Switch' },
  useFor: ['Settings that apply the moment they change, like reminders.'],
  useElse: [
    { job: "A choice in a form that's saved later", instead: { name: 'Checkbox', title: 'Components/Checkbox' } },
    { job: 'A to-do item', instead: { name: 'Checkbox', title: 'Components/Checkbox' } },
    { job: 'Picking one of a few options', instead: { name: 'Toggle button group', title: 'Components/Toggle button group' } },
  ],
  do: {
    example: <Switch label="Reminders" defaultSelected />,
    rules: ['A setting that applies the moment it changes, named by its label.'],
  },
  dont: {
    example: (
      <>
        <Switch label="Label" />
        <Button>Save changes</Button>
      </>
    ),
    rules: ["A switch in a form that's saved later.", 'Use a Checkbox.'],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves focus to it.' },
    { keys: ['Space'], result: 'Turns it on or off.' },
  ],
  screenReader: { pattern: '[Label], switch, [on or off]', example: 'Reminders, switch, on' },
  accessibility: ['A real input with role="switch" sits inside the label, so clicking or tapping the label toggles it too.', 'The knob slides only when Reduce motion is off.'],
  imports: ['Switch'],
  tokens: ['--control-switch-[part]', '--radius-control', '--color-accent-base', '--color-ink-muted', '--color-surface-card', '--motion-duration-fast'],
  related: [
    { name: 'Checkbox', title: 'Components/Checkbox' },
    { name: 'Settings', title: 'Patterns/Settings' },
    { name: 'Motion', title: 'Foundations/Motion' },
  ],
  states: { disabled: { isDisabled: true } },
};
