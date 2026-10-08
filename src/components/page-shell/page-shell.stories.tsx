import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageShell } from './page-shell';
import { ActionTile, ActionTileGroup, ActionTilePanel, ActionTileSwitch } from '../action-tile/action-tile';

const meta: Meta<typeof PageShell> = {
  title: 'Components/Page shell',
  component: PageShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          "After Graduation's page: a red header that runs edge to edge, and the page as a sheet rising over its bottom edge. The sheet is exactly as wide as the header's content and always sits in from the screen sides, so the header's red frames it on every screen size.",
          '',
          '**When to use:** once per app, around every page.',
          '',
          '**Navigation:** pass page-switching tiles as `navigation`. Tablet and up, they sit three across in the header. On phones they become the bottom bar, within thumb reach; give each tile an `icon` and a `shortTitle` for it. The sheet leaves room at the bottom so the bar never covers content.',
          '',
          "**When not to:** Life Hub has no shell yet; its theme doesn't define the shell tokens.",
          '',
          "**Spacing:** all from tokens. `layout-gutter`, `layout-section` and `layout-title-gap` set the space; `shell-sheet-overlap` and `shell-sheet-inset` shape the sheet; `layout-content-max` (1024px, shared by every product) caps the width of the header's content and the sheet together. They change on phone, tablet and desktop on their own. Resize, or pick a size in the toolbar.",
          '',
          "**The light:** the wheel is the page's one light source, at the shared `light-from-right` and `light-top` tokens (Life Hub's sun sits in the same place). The red is lightest at the wheel and deepens with distance, the rays fade as they travel, and every glass surface on the page, tiles and cards, in light and dark mode, is lit from it with the shared glass recipe.",
          '',
          '**Motion:** when the page opens, the title slams in, the rays burst, the subtitle fades down, and the wheel turns, then eases to a stop (`shell-entrance` tokens). Reduced motion only fades.',
          '',
          '**Accessibility:** the title is the page\'s only h1. The header is a `header` landmark and the sheet is `main`. The wheel comes to rest after 20 seconds (WCAG 2.2.2).',
        ].join('\n'),
      },
    },
  },
  // The shell is After Graduation only, whatever the toolbar says.
  decorators: [(Story) => <div data-theme="after-graduation"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof PageShell>;

// Bottom bar icons for the sample (simple line icons, 24 x 24, drawn in the text color).
const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const icons = {
  schools: icon(
    <>
      <path d="M2 9.5 12 5l10 4.5-10 4.5L2 9.5Z" />
      <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
      <path d="M22 9.5v5" />
    </>,
  ),
  finances: icon(
    <>
      <path d="M5 11a7 6 0 0 1 12.5-3.5L20 6v4l1 1v3h-2a7 6 0 0 1-3 2.5V19h-3v-2h-2v2H8v-2.7A6 6 0 0 1 5 11Z" />
      <path d="M10 8.5h3" />
      <circle cx="16" cy="10.5" r="0.5" fill="currentColor" />
    </>,
  ),
  dates: icon(
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
      <path d="M8.5 13.5h.01M12 13.5h.01M15.5 13.5h.01M8.5 16.5h.01M12 16.5h.01" strokeWidth={2.25} />
    </>,
  ),
};

const episodes = [
  { id: 'explore', label: 'Episode 1', title: 'Explore Schools', shortTitle: 'Schools', icon: icons.schools, description: 'Select your favorites' },
  { id: 'pay', label: 'Episode 2', title: 'Financial Planning', shortTitle: 'Finances', icon: icons.finances, description: 'How will you pay for it?' },
  { id: 'dates', label: 'Episode 3', title: 'Important Dates', shortTitle: 'Dates', icon: icons.dates, description: "What's next, step by step" },
];

/**
 * The shell with navigation, as After Graduation uses it for its episodes. Pick one to switch
 * pages. Tablet and up: three tiles across. Phones (under 600px): the same tiles become the bottom bar,
 * each an icon and a short name. Pick a phone size in the toolbar to see it. Replays its entrance each
 * time the story opens.
 */
export const WithNavigation: Story = {
  name: 'With navigation',
  render: () => (
    <ActionTileSwitch defaultSelectedKey="explore">
      <PageShell
        title="After Graduation"
        subtitle="Alex, get ready for Season 2"
        navigation={
          <ActionTileGroup aria-label="Episodes" behavior="switch">
            {episodes.map((e) => (
              <ActionTile key={e.id} id={e.id} label={e.label} title={e.title} shortTitle={e.shortTitle} icon={e.icon} />
            ))}
          </ActionTileGroup>
        }
      >
        {episodes.map((e) => (
          <ActionTilePanel key={e.id} id={e.id}>
            <p style={{ margin: 0 }}>{e.title} goes here.</p>
          </ActionTilePanel>
        ))}
      </PageShell>
    </ActionTileSwitch>
  ),
};

/** Just the title and the sheet, with no navigation. */
export const TitleOnly: Story = {
  args: {
    title: 'After Graduation',
    subtitle: 'Alex, get ready for Season 2',
    children: (
      <p style={{ margin: 0 }}>The page goes here.</p>
    ),
  },
};
