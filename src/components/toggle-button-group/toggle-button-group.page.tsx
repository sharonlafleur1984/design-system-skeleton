import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { ToggleButton, ToggleButtonGroup } from './toggle-button-group';

// Storybook only: what Toggle button group's Docs page says (the component page template).
export const toggleButtonGroupPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Picks one of two to five options that change how the same content shows.',
  reactAria: { name: 'ToggleButtonGroup', href: 'https://react-aria.adobe.com/ToggleButtonGroup' },
  status: 'ready',
  useFor: ['Changing how the same content shows, like Week or Month, or List or Calendar.'],
  useElse: [
    <>
      Switching between different content: use <DocLink href={docsPath('Components/Tabs')}>Tabs</DocLink>.
    </>,
    <>
      More than five options: use <DocLink href={docsPath('Components/Select')}>Select</DocLink>.
    </>,
    <>
      An action: use <DocLink href={docsPath('Components/Button')}>Button</DocLink>.
    </>,
  ],
  do: {
    example: (
      <ToggleButtonGroup aria-label="Label" defaultSelectedKeys={['1']}>
        <ToggleButton id="1">Week</ToggleButton>
        <ToggleButton id="2">Month</ToggleButton>
      </ToggleButtonGroup>
    ),
    text: 'Keep labels short and about the same length.',
  },
  dont: {
    example: (
      <ToggleButtonGroup aria-label="Label" defaultSelectedKeys={['1']}>
        <ToggleButton id="1">Save changes</ToggleButton>
        <ToggleButton id="2">Cancel</ToggleButton>
      </ToggleButtonGroup>
    ),
    text: 'Use it for actions, like Save changes or Cancel. Those are buttons.',
  },
  keys: [
    { keys: ['Tab'], does: 'Moves focus into the group, then out of it' },
    { keys: ['←', '→'], does: 'Moves between options' },
    { keys: ['Space', 'Enter'], does: 'Picks the option' },
  ],
  screenReader: { pattern: '[Label], radio, checked, [n] of [total]', example: 'Week, radio, checked, 1 of 2' },
  accessibility: [
    'The group needs an aria-label, like “Show by”.',
    'One option is always chosen. It sits under an indicator with bolder text, so color is never the only signal.',
  ],
  imports: ['ToggleButtonGroup', 'ToggleButton'],
  tokens: ['--color-surface-sunken', '--color-surface-card', '--color-ink-[state]', '--control-height-medium', '--radius-medium', '--motion-duration-base'],
  related: [
    { name: 'Tabs', href: docsPath('Components/Tabs') },
    { name: 'Select', href: docsPath('Components/Select') },
    { name: 'Tag', href: docsPath('Components/Tag') },
  ],
};
