import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { IconTile } from './icon-tile';
import { Body } from '../text/text';
import { storyIcons } from '../story-helpers';

// Storybook only: what Icon tile's page says (the component page template).
export const iconTilePage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Shows an icon in a small square, with a soft background or without one.',
  status: 'ready',
  builtWith: { source: 'src/components/icon-tile/icon-tile.tsx' },
  useFor: ['An icon next to a title or label, so a list or a header is quicker to scan.', 'The icon in a Card, Tile or Action tile header.'],
  useElse: [
    { job: 'An icon that does something when pressed', instead: { name: 'Button', title: 'Components/Button' } },
    { job: 'A status, like an error or a success', instead: { name: 'Callout', title: 'Components/Callout' } },
  ],
  do: {
    example: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <IconTile icon={storyIcons.calendar} />
        <Body>Label</Body>
      </span>
    ),
    rules: ['Put it next to words that say what it is.', 'It stays in the text color around it.'],
  },
  dont: {
    example: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-accent-text)' }}>
        <IconTile icon={storyIcons.calendar} />
        <IconTile icon={storyIcons.wallet} />
      </span>
    ),
    rules: ['Color it for decoration, or let it stand alone without a label.', 'Color only communicates.'],
  },
  keys: [{ keys: ['Tab'], result: 'Skips it: it isn’t interactive.' }],
  screenReader: { pattern: '[Label], image', example: 'Calendar, image' },
  accessibility: [
    'Decorative by default, so screen readers skip it: the words next to it say what it is.',
    'When it stands alone and means something, give it a label to read out.',
  ],
  imports: ['IconTile'],
  tokens: ['--control-height-[size]', '--space-9', '--space-[size]', '--control-icon', '--radius-control'],
  related: [
    { name: 'Card', title: 'Components/Card' },
    { name: 'Tile', title: 'Components/Tile' },
    { name: 'Action tile', title: 'Components/Action tile' },
  ],
};
