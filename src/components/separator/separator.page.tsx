import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Separator } from './separator';

const stack = { display: 'grid', gap: 'var(--space-3)', inlineSize: '100%' } as const;

// Storybook only: what Separator's Docs page says (the component page template).
export const separatorPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Draws a thin line between groups.',
  status: 'ready',
  builtWith: { reactAria: 'Separator' },
  useFor: ["Showing where one group ends, only when spacing alone can't."],
  useElse: [
    { job: 'Between every row: let spacing separate them' },
    { job: 'Around a group of content', instead: { name: 'Card', title: 'Components/Card' } },
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
    rules: ['One line where one group ends and the next begins.'],
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
    rules: ['A line between every row.', 'Spacing already does that.'],
  },
  keys: [{ keys: ['Tab'], result: "Skips it: it isn't interactive." }],
  screenReader: { pattern: 'separator', example: 'separator' },
  accessibility: ['Horizontal, it\'s an <hr>. Vertical, it gets role="separator" and aria-orientation.'],
  imports: ['Separator'],
  tokens: ['--color-border-default'],
  related: [
    { name: 'Card', title: 'Components/Card' },
    { name: 'Space', title: 'Foundations/Space, radius and shadow', story: 'space' },
  ],
};
