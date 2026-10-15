import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { Button } from '../button/button';
import { Switch } from './switch';

// Storybook only: what Switch's Docs page says (the component page template).
export const switchPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Turns a setting on or off right away.',
  reactAria: { name: 'Switch', href: 'https://react-aria.adobe.com/Switch' },
  status: 'ready',
  useFor: ['Settings that apply the moment they change, like reminders.'],
  useElse: [
    <>
      A choice in a form that's saved later: use <DocLink href={docsPath('Components/Checkbox')}>Checkbox</DocLink>.
    </>,
    <>
      A to-do item: use <DocLink href={docsPath('Components/Checkbox')}>Checkbox</DocLink>.
    </>,
    <>
      Picking one of a few options: use <DocLink href={docsPath('Components/Toggle button group')}>Toggle button group</DocLink>.
    </>,
  ],
  do: {
    example: <Switch label="Reminders" defaultSelected />,
    text: 'A setting that applies the moment it changes, named by its label.',
  },
  dont: {
    example: (
      <>
        <Switch label="Label" />
        <Button>Save changes</Button>
      </>
    ),
    text: "A switch in a form that's saved later. Use a Checkbox.",
  },
  keys: [
    { keys: ['Tab'], does: 'Moves focus to it' },
    { keys: ['Space'], does: 'Turns it on or off' },
  ],
  screenReader: { pattern: '[Label], switch, [on or off]', example: 'Reminders, switch, on' },
  accessibility: ['A real input with role="switch" sits inside the label, so clicking or tapping the label toggles it too.', 'The knob slides only when Reduce motion is off.'],
  imports: ['Switch'],
  tokens: ['--control-switch-[part]', '--radius-control', '--color-accent-base', '--color-ink-muted', '--color-surface-card', '--motion-duration-fast'],
  related: [
    { name: 'Checkbox', href: docsPath('Components/Checkbox') },
    { name: 'Settings', href: docsPath('Patterns/Settings') },
    { name: 'Motion', href: docsPath('Foundations/Motion') },
  ],
};
