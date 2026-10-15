import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { IconTile } from './icon-tile';
import { Body } from '../text/text';
import { storyIcons } from '../story-helpers';

// Storybook only: what Icon tile's Docs page says (the component page template).
export const iconTilePage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Shows an icon in a small square, with a soft background or without one.',
  status: 'ready',
  useFor: ['An icon next to a title or label, so a list or a header is quicker to scan.', 'The icon in a Card, Tile or Action tile header.'],
  useElse: [
    <>
      An icon that does something when pressed: use <DocLink href={docsPath('Components/Button')}>Button</DocLink> with an icon.
    </>,
    <>
      A status, like an error or a success: use <DocLink href={docsPath('Components/Callout')}>Callout</DocLink>, which pairs the color with an icon and words.
    </>,
  ],
  do: {
    example: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <IconTile icon={storyIcons.calendar} />
        <Body>Label</Body>
      </span>
    ),
    text: 'Put it next to words that say what it is. It stays in the text color around it.',
  },
  dont: {
    example: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-accent-text)' }}>
        <IconTile icon={storyIcons.calendar} />
        <IconTile icon={storyIcons.wallet} />
      </span>
    ),
    text: 'Color it for decoration, or let it stand alone without a label. Color only communicates.',
  },
  keys: [{ keys: ['Tab'], does: 'Skips it: it isn’t interactive' }],
  screenReader: { pattern: '[Label], image', example: 'Calendar, image' },
  accessibility: [
    'Decorative by default, so screen readers skip it: the words next to it say what it is.',
    'When it stands alone and means something, give it a label to read out.',
  ],
  imports: ['IconTile'],
  tokens: ['--control-height-[size]', '--space-9', '--space-[size]', '--control-icon', '--radius-control'],
  related: [
    { name: 'Card', href: docsPath('Components/Card') },
    { name: 'Tile', href: docsPath('Components/Tile') },
    { name: 'Action tile', href: docsPath('Components/Action tile') },
  ],
};
