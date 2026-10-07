import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { EpisodeTab, EpisodeTabList, EpisodeTabs } from './episode-tabs';

const meta: Meta<typeof EpisodeTabs> = {
  title: 'Components/Episode tabs',
  component: EpisodeTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          "Switch between After Graduation's episodes. Sits on the header art inside the page shell. Built on React Aria's Tabs.",
          '',
          '**When to use:** the top-level episodes only, in the page shell header.',
          '',
          '**When not to:** for views inside a page, use Tabs. To go somewhere else, use a link.',
          '',
          '**Do:** keep the description to one short line. **Don\'t:** add a fourth episode without checking the phone layout.',
          '',
          '**Accessibility:** one Tab stop for the list; arrow keys move between episodes, Home and End jump to the ends. The chosen episode turns frosted white and shows a star, so color is never the only signal. White text on the header red passes 4.5:1.',
        ].join('\n'),
      },
    },
  },
  decorators: [(Story) => <div data-theme="after-graduation"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof EpisodeTabs>;

// Storybook only: the header's red, so the glass is shown on what it was designed for.
const onHeader: CSSProperties = {
  padding: 'var(--layout-gutter)',
  borderRadius: 'var(--radius-panel)',
  background: 'linear-gradient(var(--color-accent-base), var(--shell-frame))',
};

const episodes = [
  { id: 'explore', label: 'Episode 1', title: 'Explore Schools', description: 'Select your favorites' },
  { id: 'pay', label: 'Episode 2', title: 'Financial Planning', description: 'How will you pay for it?' },
  { id: 'dates', label: 'Episode 3', title: 'Important Dates', description: "What's next, step by step" },
];

/** Three episodes, the third chosen. Three across when there's room, stacked on phones. */
export const Default: Story = {
  render: () => (
    <div style={onHeader}>
      <EpisodeTabs defaultSelectedKey="dates">
        <EpisodeTabList aria-label="Episodes">
          {episodes.map((e) => (
            <EpisodeTab key={e.id} id={e.id} label={e.label} title={e.title} description={e.description} />
          ))}
        </EpisodeTabList>
      </EpisodeTabs>
    </div>
  ),
};

/** Every state: rest, hover, keyboard focus and chosen. */
export const States: Story = {
  render: () => (
    <div style={onHeader}>
      <EpisodeTabs defaultSelectedKey="chosen">
        <EpisodeTabList aria-label="States">
          <EpisodeTab id="rest" label="Rest" title="Explore Schools" description="Select your favorites" />
          <EpisodeTab id="hover" data-state="hover" label="Hover" title="Explore Schools" description="Select your favorites" />
          <EpisodeTab id="focus" data-state="focus" label="Keyboard focus" title="Explore Schools" description="Select your favorites" />
          <EpisodeTab id="chosen" label="Chosen" title="Explore Schools" description="Select your favorites" />
        </EpisodeTabList>
      </EpisodeTabs>
    </div>
  ),
};
