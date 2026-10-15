import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { Separator } from './separator';

const stack = { display: 'grid', gap: 'var(--space-3)', inlineSize: '100%' } as const;

// Storybook only: what Separator's Docs page says (the component page template).
export const separatorPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Draws a thin line between groups.',
  reactAria: { name: 'Separator', href: 'https://react-aria.adobe.com/Separator' },
  status: 'ready',
  useFor: ["Showing where one group ends, only when spacing alone can't."],
  useElse: [
    'Between every row: let spacing separate them.',
    <>
      Around a group of content: use <DocLink href={docsPath('Components/Card')}>Card</DocLink>, which uses a shadow.
    </>,
  ],
  do: {
    example: (
      <div style={stack}>
        <span>Item 1</span>
        <span>Item 2</span>
        <Separator />
        <span>Item 3</span>
      </div>
    ),
    text: 'One line where one group ends and the next begins.',
  },
  dont: {
    example: (
      <div style={stack}>
        <span>Item 1</span>
        <Separator />
        <span>Item 2</span>
        <Separator />
        <span>Item 3</span>
        <Separator />
      </div>
    ),
    text: 'A line between every row. Spacing already does that.',
  },
  keys: [{ keys: ['Tab'], does: "Skips it: it isn't interactive" }],
  screenReader: { pattern: 'separator', example: 'separator' },
  accessibility: ['Horizontal, it\'s an <hr>. Vertical, it gets role="separator" and aria-orientation.'],
  imports: ['Separator'],
  tokens: ['--color-border-default'],
  related: [
    { name: 'Card', href: docsPath('Components/Card') },
    { name: 'Space', href: '/?path=/story/foundations-space-radius-and-shadow--space' },
  ],
};
