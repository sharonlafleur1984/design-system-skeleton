import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Tile } from './tile';
import { storyIcons } from '../story-helpers';
// The don't example draws a button's look inside the tile (a real button can't sit inside one).
import '../button/button.css';

// Storybook only: what Tile's page says (the component page template).
export const tilePage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Goes somewhere or does something when pressed anywhere on it.',
  status: 'ready',
  builtWith: { reactAria: 'Link' },
  useFor: ['A few big choices that each lead somewhere, like the sections of an app.', 'One action that needs more room than a button, with an icon and a short line.'],
  useElse: [
    { job: 'A surface with its own buttons inside', instead: { name: 'Card', title: 'Components/Card' } },
    { job: 'Switching between sections of the same page', instead: { name: 'Action tile', title: 'Components/Action tile' } },
    { job: 'A link inside a sentence', instead: { name: 'Link', title: 'Components/Link' } },
  ],
  do: {
    example: <Tile href="#" icon={storyIcons.wallet} label="Label" title="Title" description="Description" />,
    rules: ['The whole tile is the one click target, with a title that says where it goes.'],
  },
  dont: {
    example: (
      <Tile
        onPress={() => {}}
        title="Title"
        description={
          <span className="ds-button ds-button--secondary ds-button--small" style={{ display: 'inline-flex', marginBlockStart: 'var(--space-2)' }}>
            Button
          </span>
        }
      />
    ),
    rules: ['A button or link inside a tile.', 'If it needs its own buttons, use Card.'],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves focus to it.' },
    { keys: ['Enter'], result: 'Follows the link, or presses the button.' },
    { keys: ['Space'], result: 'Presses it, when it’s a button.' },
  ],
  screenReader: { pattern: '[Label] [Title] [Description], link or button', example: 'Label Title Description, link' },
  accessibility: [
    'With href it’s a link, so it can open in a new tab; with onPress it’s a button.',
    'Disabled fades to half and can’t be pressed.',
    'With Reduce transparency or Increase contrast on, Glass turns solid.',
  ],
  imports: ['Tile'],
  tokens: ['--color-surface-card', '--shadow-[state]', '--radius-card', '--color-border-focus-glow', '--motion-duration-base'],
  related: [
    { name: 'Card', title: 'Components/Card' },
    { name: 'Action tile', title: 'Components/Action tile' },
    { name: 'Icon tile', title: 'Components/Icon tile' },
  ],
  states: {
    hover: { 'data-state': 'hover' },
    pressed: { 'data-state': 'pressed' },
    focus: { 'data-state': 'focus' },
    disabled: { isDisabled: true },
  },
};
