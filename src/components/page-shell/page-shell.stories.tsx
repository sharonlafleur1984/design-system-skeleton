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

const episodes = [
  { id: 'explore', label: 'Episode 1', title: 'Explore Schools', description: 'Select your favorites' },
  { id: 'pay', label: 'Episode 2', title: 'Financial Planning', description: 'How will you pay for it?' },
  { id: 'dates', label: 'Episode 3', title: 'Important Dates', description: "What's next, step by step" },
];

/** The shell with the episodes as action tiles, as After Graduation uses it. Pick an episode to switch pages. Replays its entrance each time the story opens. */
export const WithEpisodes: Story = {
  render: () => (
    <ActionTileSwitch defaultSelectedKey="explore">
      <PageShell
        title="After Graduation"
        subtitle="Alex, get ready for Season 2"
        navigation={
          <ActionTileGroup aria-label="Episodes" behavior="switch">
            {episodes.map((e) => (
              <ActionTile key={e.id} id={e.id} label={e.label} title={e.title} />
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
