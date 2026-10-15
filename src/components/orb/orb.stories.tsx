import type { Meta, StoryObj } from '@storybook/react-vite';
import { Orb } from './orb';
import { OrbSection } from './orb-example';
import { choice, hidden, marbles, setting } from '../story-helpers';
import { orbPage } from './orb.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Orb> = {
  title: 'Components/Orb',
  component: Orb,
  // On its own page the orb starts in the middle, like every component's example.
  args: { size: 'medium', look: 'clear', defaultPosition: { x: 0.5, y: 0.5 }, ...pageArgs } as Meta<typeof Orb>['args'],
  argTypes: {
    size: choice('Size', 'How big it is: small 16px (the height of body text, for Try it out windows), medium 32px (the usual), large 48px\n\n`size`', ['small', 'medium', 'large']),
    look: choice('Look', 'Clear glass with a small bright core, or glass that glows from inside\n\n`look`', ['clear', 'glow']),
    position: setting('Position', 'Where it is in its section, from 0 to 1 across and down. Leave out and it keeps its own, starting on the right, two thirds down (ORB_START)\n\n`position`', { control: false }),
    defaultPosition: setting('Starts at', 'Where it starts when it keeps its own place. Leave out for the right, two thirds down\n\n`defaultPosition`', { control: false }),
    onPositionChange: setting('On position change', 'Called while it is dragged or moved with the arrow keys\n\n`onPositionChange`', { control: false }),
    palette: setting('Color family', "A color family from the theme's palette, for an area's own color. Leave out for the theme's\n\n`palette`", { control: false }),
    ...pageArgTypes(),
    className: hidden,
    style: hidden,
  },
  parameters: { componentPage: orbPage, compareAll: false },
};
export default meta;
type Story = StoryObj<typeof Orb>;

/** The Orb's page. */
export const Overview: Story = { ...pageStory(undefined, { tryIt: false }), tags: ['page'] };
export const UsageRules: Story = { ...pageStory('usage', { tryIt: false }), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y', { tryIt: false }), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related', { tryIt: false }), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** The orb on every theme's real background, in each one's color. Drag any of them. */
export const OnEveryBackground: Story = {
  tags: ['!dev'],
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
      <OrbSection backdrop="header" label="Spotlight header" />
      {marbles
        .filter((m) => ['dashboard', 'parenting', 'health', 'time'].includes(m.area ?? ''))
        .map((m) => (
          <OrbSection key={m.name} backdrop="marble" area={m.area!} texture={m.texture} palette={m.palette} label={`Sunrise, ${m.name}`} />
        ))}
      <OrbSection backdrop="fireside" label="Fireside" />
      <OrbSection backdrop="light" label="Light page" />
    </div>
  ),
};
