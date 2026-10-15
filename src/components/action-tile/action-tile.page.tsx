import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { ActionTile, ActionTileGroup, ActionTileSwitch } from './action-tile';

// Storybook only: what Action tile's Docs page says (the component page template).
export const actionTilePage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Switches what the page shows, like tabs, with a row of big tiles.',
  reactAria: { name: 'Tabs', href: 'https://react-aria.adobe.com/Tabs' },
  status: 'ready',
  useFor: [
    'Two to five big sections at the top of a page, each with a title and one short line.',
    'The same sections on a phone: under 600px the tiles become the bottom bar.',
  ],
  useElse: [
    <>
      A link or a button that looks like a tile: use <DocLink href={docsPath('Components/Tile')}>Tile</DocLink>.
    </>,
    <>
      Views inside a card: use <DocLink href={docsPath('Components/Tabs')}>Tabs</DocLink>.
    </>,
    <>
      A surface that holds its own buttons: use <DocLink href={docsPath('Components/Card')}>Card</DocLink>.
    </>,
  ],
  do: {
    example: (
      <ActionTileSwitch defaultSelectedKey="one">
        <ActionTileGroup aria-label="Navigation" behavior="switch">
          <ActionTile id="one" title="Tile 1" description="Description" />
          <ActionTile id="two" title="Tile 2" description="Description" />
        </ActionTileGroup>
      </ActionTileSwitch>
    ),
    text: 'A short title and one short line on each tile.',
  },
  dont: {
    example: (
      <ActionTileSwitch defaultSelectedKey="one">
        <ActionTileGroup aria-label="Navigation, too long" behavior="switch">
          <ActionTile id="one" title="Tile 1" description="A long description that runs on for several lines and says more than a tile can hold." />
          <ActionTile id="two" title="Tile 2" description="Another long description that runs on for several lines." />
        </ActionTileGroup>
      </ActionTileSwitch>
    ),
    text: 'Long descriptions, or a button or link inside a tile: each tile is one click target.',
  },
  keys: [
    { keys: ['Tab'], does: 'Moves focus to the chosen tile, then on past the group' },
    { keys: ['Left arrow', 'Right arrow'], does: 'Moves to the previous or next tile and shows its content' },
    { keys: ['Home', 'End'], does: 'Moves to the first or last tile' },
  ],
  screenReader: { pattern: '[Title], tab, [n] of [total], selected', example: 'Tile 2, tab, 2 of 3, selected' },
  accessibility: [
    'A chosen tile shows the theme’s mark and changes color together, so color is never the only sign.',
    'Name the group with aria-label, like “Navigation”.',
    'With Reduce transparency or Increase contrast on, Glass tiles turn solid, and a chosen one shows a line with its mark.',
  ],
  imports: ['ActionTile', 'ActionTileGroup', 'ActionTileSwitch', 'ActionTilePanel'],
  tokens: ['--color-surface-card', '--color-accent-surface', '--shadow-[state]', '--radius-card', '--color-border-focus-glow', '--motion-duration-slow'],
  related: [
    { name: 'Tile', href: docsPath('Components/Tile') },
    { name: 'Tabs', href: docsPath('Components/Tabs') },
    { name: 'Page shell', href: docsPath('Components/Page shell') },
  ],
};
