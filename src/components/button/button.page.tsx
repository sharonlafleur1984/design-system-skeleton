import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { Button } from './button';

// Storybook only: what Button's Docs page says (the component page template).
export const buttonPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Starts an action, like saving or sending.',
  reactAria: { name: 'Button', href: 'https://react-aria.adobe.com/Button' },
  status: 'ready',
  useFor: ['The one main action on a screen: Primary.', 'Other choices beside it: Secondary, or Tertiary for side trips.'],
  useElse: [
    <>
      Going to another page: use <DocLink href={docsPath('Components/Link')}>Link</DocLink>.
    </>,
    <>
      Turning a setting on or off: use <DocLink href={docsPath('Components/Switch')}>Switch</DocLink>.
    </>,
    <>
      Picking one of a few options: use <DocLink href={docsPath('Components/Toggle button group')}>Toggle button group</DocLink>.
    </>,
  ],
  do: {
    example: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button>Save changes</Button>
      </>
    ),
    text: 'One primary button per screen, with a label that says what happens.',
  },
  dont: {
    example: (
      <>
        <Button>Cancel</Button>
        <Button>Submit</Button>
      </>
    ),
    text: 'Two primary buttons side by side, or a vague label like Submit.',
  },
  keys: [
    { keys: ['Tab'], does: 'Moves focus to it' },
    { keys: ['Enter', 'Space'], does: 'Runs the action' },
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
    { name: 'Link', href: docsPath('Components/Link') },
    { name: 'Toggle button group', href: docsPath('Components/Toggle button group') },
    { name: 'Radius', href: '/?path=/story/foundations-space-radius-and-shadow--radius' },
  ],
};
