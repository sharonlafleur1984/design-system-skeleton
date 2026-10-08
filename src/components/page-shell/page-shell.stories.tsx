import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageShell } from './page-shell';
import { EpisodeTab, EpisodeTabList, EpisodeTabs } from '../episode-tabs/episode-tabs';
import { TabPanel } from '../tabs/tabs';
import { Card } from '../card/card';

const meta: Meta<typeof PageShell> = {
  title: 'Components/Page shell',
  component: PageShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          "After Graduation's page: a red header that runs edge to edge, and the page as a sheet rising over its bottom edge. On desktop the sheet sits in from the sides so the header's red frames it.",
          '',
          '**When to use:** once per app, around every page.',
          '',
          "**When not to:** Life Hub has no shell yet; its theme doesn't define the shell tokens.",
          '',
          '**Spacing:** all from tokens. `layout-gutter`, `layout-section` and `layout-title-gap` set the space; `shell-sheet-overlap` and `shell-sheet-inset` shape the sheet; `shell-content-max` caps the width. They change on phone, tablet and desktop on their own. Resize, or pick a size in the toolbar.',
          '',
          '**Accessibility:** the title is the page\'s only h1. The header is a `header` landmark and the sheet is `main`.',
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

/** The shell with the episode tabs, as After Graduation uses it. Pick an episode to switch pages. */
export const WithEpisodes: Story = {
  render: () => (
    <EpisodeTabs defaultSelectedKey="dates">
      <PageShell
        title="After Graduation"
        subtitle="Alex, get ready for Season 2"
        navigation={
          <EpisodeTabList aria-label="Episodes">
            {episodes.map((e) => (
              <EpisodeTab key={e.id} id={e.id} label={e.label} title={e.title} description={e.description} />
            ))}
          </EpisodeTabList>
        }
      >
        {episodes.map((e) => (
          <TabPanel key={e.id} id={e.id}>
            <Card>
              <p style={{ margin: 0 }}>{e.title} goes here.</p>
            </Card>
          </TabPanel>
        ))}
      </PageShell>
    </EpisodeTabs>
  ),
};

/** Just the title and the sheet, with no navigation. */
export const TitleOnly: Story = {
  args: {
    title: 'After Graduation',
    subtitle: 'Alex, get ready for Season 2',
    children: (
      <Card>
        <p style={{ margin: 0 }}>The page goes here.</p>
      </Card>
    ),
  },
};
