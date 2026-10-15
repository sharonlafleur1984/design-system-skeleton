import type { Meta, StoryObj } from '@storybook/react-vite';
import { Orb } from './orb';
import { OrbSection, type OrbSectionProps } from './orb-example';
import { choice, hidden, marbles, setting } from '../story-helpers';
import { orbPage } from './orb.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Orb> = {
  title: 'Components/Orb',
  component: Orb,
  // On its own page the orb starts in the middle, like every component's example. It opens in dark
  // mode, where its light shows best (Sharon).
  args: { size: 'medium', look: 'glow', defaultPosition: { x: 0.5, y: 0.5 }, ...pageArgs, sbMode: 'dark' } as Meta<typeof Orb>['args'],
  argTypes: {
    size: choice('Size', 'How big it is: small 16px (the height of body text, for Try it out windows), medium 32px (the usual), large 48px\n\n`size`', ['small', 'medium', 'large']),
    look: choice('Look', 'Glow: lit from inside, its light spreading over the section. Tinted: glass in the page\'s color. Clear: completely see-through\n\n`look`', ['glow', 'tinted', 'clear']),
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

/** The small orb on the picked theme's real backgrounds (every theme's with Compare all), in each one's color. Drag any of them. */
export const OnEveryBackground: Story = {
  tags: ['!dev'],
  parameters: { layout: 'padded' },
  // Follows the theme picker: only the picked theme's backgrounds, or every theme's with Compare all.
  render: ({ look }, { globals }) => {
    const shows = (theme: string) => globals.theme === 'both' || globals.theme === theme;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        {shows('after-graduation') && <OrbSection backdrop="header" size="small" look={look} label="Spotlight header" />}
        {shows('life-hub') &&
          marbles
            .filter((m) => ['dashboard', 'parenting', 'health', 'time'].includes(m.area ?? ''))
            .map((m) => <OrbSection key={m.name} size="small" look={look} backdrop="marble" area={m.area!} texture={m.texture} palette={m.palette} label={`Sunrise, ${m.name}`} />)}
        {shows('designer-toolkit') && <OrbSection backdrop="fireside" size="small" look={look} label="Fireside" />}
        {shows('life-hub') && <OrbSection backdrop="light" size="small" look={look} label="Light page" />}
      </div>
    );
  },
};

/** The CSS glow alone (the fallback without 3D) beside the renderer-lit light, the default (D59). Drag either orb. */
export const LitByTheRenderer: Story = {
  tags: ['!dev'],
  parameters: { layout: 'padded' },
  render: (_args, { globals }) => {
    const shows = (theme: string) => globals.theme === 'both' || globals.theme === theme;
    const pair = (key: string, props: Omit<OrbSectionProps, 'label' | 'lit'>, name: string) => (
      <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <OrbSection {...props} size="small" lit={false} label={`${name}, CSS glow`} />
        <OrbSection {...props} size="small" label={`${name}, lit by the renderer`} />
      </div>
    );
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <p style={{ margin: 0, color: 'var(--color-ink-secondary)' }}>Left: the CSS glow alone (where 3D isn&apos;t available). Right: lit by the renderer, the default.</p>
        {shows('after-graduation') && pair('header', { backdrop: 'header' }, 'Spotlight header')}
        {shows('life-hub') &&
          marbles
            .filter((m) => ['dashboard', 'parenting', 'health', 'time'].includes(m.area ?? ''))
            .map((m) => pair(m.name, { backdrop: 'marble', area: m.area!, texture: m.texture, palette: m.palette }, `Sunrise, ${m.name}`))}
        {shows('designer-toolkit') && pair('fireside', { backdrop: 'fireside' }, 'Fireside')}
        {shows('life-hub') && pair('light', { backdrop: 'light' }, 'Light page')}
      </div>
    );
  },
};
