import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageShell } from './page-shell';
import { ActionTile, ActionTileGroup, ActionTilePanel, ActionTileSwitch } from '../action-tile/action-tile';
import { afterGraduationOnly } from '../product-only';
import { choice, hidden, setting, words } from '../story-helpers';
import { pageShellPage } from './page-shell.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof PageShell> = {
  title: 'Components/Page shell',
  component: PageShell,
  args: { title: 'Page title', subtitle: 'Subtitle', appearance: 'glass', ...pageArgs } as Meta<typeof PageShell>['args'],
  argTypes: {
    title: words('Title', "The product name: the page's only h1\n\n`title`"),
    subtitle: words('Subtitle', 'One line under the title, like a greeting\n\n`subtitle`'),
    appearance: choice('Style', 'Glass bends the header art at the tiles\' edges; Solid gives them the card surface\n\n`appearance`', ['solid', 'glass']),
    navigation: setting('Navigation', 'Page-switching tiles in the header; the bottom bar on phones\n\n`navigation`', { control: false }),
    actions: setting('Actions', 'App-wide actions at the top right, like Settings\n\n`actions`', { control: false }),
    children: setting('Page content', 'The page itself, on the sheet\n\n`children`', { control: false }),
    ...pageArgTypes({ glass: true }),
    material: hidden,
    glassLens: hidden,
    className: hidden,
  },
  parameters: { layout: 'fullscreen', componentPage: pageShellPage },
  // After Graduation only for now; with Life Hub picked, shows a message instead.
  decorators: [afterGraduationOnly],
};
export default meta;
type Story = StoryObj<typeof PageShell>;

/** Page shell's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

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

const tiles = [
  { id: 'explore', label: 'Label', title: 'Tile 1', shortTitle: 'Tile 1', icon: icons.schools, description: 'Description' },
  { id: 'pay', label: 'Label', title: 'Tile 2', shortTitle: 'Tile 2', icon: icons.finances, description: 'Description' },
  { id: 'dates', label: 'Label', title: 'Tile 3', shortTitle: 'Tile 3', icon: icons.dates, description: 'Description' },
];

/**
 * Every setting, in the Controls tab. The shell with page-switching tiles; pick a phone size in the
 * toolbar to see them become the bottom bar. Replays its entrance each time it opens.
 */
export const WithNavigation: Story = {
  tags: ['!dev'],
  name: 'With navigation',
  render: (args) => (
    <ActionTileSwitch defaultSelectedKey="explore">
      <PageShell
        {...args}
        navigation={
          <ActionTileGroup aria-label="Navigation" behavior="switch">
            {tiles.map((e) => (
              <ActionTile key={e.id} id={e.id} label={e.label} title={e.title} shortTitle={e.shortTitle} icon={e.icon} />
            ))}
          </ActionTileGroup>
        }
      >
        {tiles.map((e) => (
          <ActionTilePanel key={e.id} id={e.id}>
            <p style={{ margin: 0 }}>{e.title} content</p>
          </ActionTilePanel>
        ))}
      </PageShell>
    </ActionTileSwitch>
  ),
};

/** Just the title and the sheet, with no navigation: for an app with one page. */
export const TitleOnly: Story = {
  tags: ['!dev'],
  args: {
    title: 'Page title',
    subtitle: 'Subtitle',
    children: (
      <p style={{ margin: 0 }}>Page content</p>
    ),
  },
};
