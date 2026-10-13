import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useGlassLight } from '../glass-light/glass-light';
import { OnEveryBackground, storyBackgrounds } from '../story-helpers';

const onDark: CSSProperties = { padding: 'var(--space-4)', borderRadius: 'var(--radius-panel)', background: storyBackgrounds.dark.value };
import { ActionTile, ActionTileGroup, ActionTilePanel, ActionTileSwitch } from './action-tile';

const meta: Meta<typeof ActionTile> = {
  title: 'Components/Action tile',
  component: ActionTile,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'A glass tile you click to make something happen. One look, three behaviors, each on the React Aria piece that keeps it accessible.',
          '',
          '**Switch:** in an `ActionTileGroup behavior="switch"`, tiles swap content shown elsewhere on the page, like After Graduation\'s episodes. **Link:** give it `href` to go to a page. **Action:** give it `onPress`.',
          '',
          '**When not to:** for views inside a card, use Tabs. For a plain action, use Button.',
          '',
          '**Do:** keep the description to one short line. **Don\'t:** put a button or link inside a tile; each tile is one click target.',
          '',
          '**Accessibility:** switch tiles are one Tab stop, with arrow keys between them and Home and End to the ends; screen readers hear "tab, 2 of 3, selected." The chosen tile turns frosted white and shows a star, so color is never the only signal. White text on the header red passes 4.5:1.',
          '',
          '**Light:** drawn with the shared glass recipe, the same one cards use. In the page shell the wheel is the light: rims are brightest facing it, shadows fall away from it, and the glass bends and softens the rays behind it (the bend shows in Chrome and Edge; other browsers show clear glass).',
          '',
          '**Hover:** the tile rises 4px (`motion-lift-large`) and its shadow deepens; a chosen tile settles back down. Hover only happens with a mouse; on phones the episodes move to a bottom bar.',
        ].join('\n'),
      },
    },
  },
  // Clear glass with white text needs something behind it, so these stories sit on Dark until you
  // pick another background with Storybook's Background button. "On every background" shows them all.
  decorators: [
    (Story, context) => (
      <div data-theme="after-graduation" style={context.globals.backgrounds?.value ? undefined : onDark}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ActionTile>;

// Storybook only: lights the tiles from low on the right, as the wheel does in the page shell.
// No background of its own: pick one with Storybook's Background button, or see "On every background".
// The full art (light, rays, wheel) lives only in Page shell.
function OnHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGlassLight(ref, { light: { x: 0.85, y: 1 }, selector: '.ds-tile' });
  const style: CSSProperties = {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    padding: 'var(--layout-gutter)',
  };
  return <div ref={ref} style={style}>{children}</div>;
}

// The switched content sits on the page, like the sheet in Page shell, so its dark text stays readable.
const panelOnPage: CSSProperties = {
  marginBlockStart: 'var(--space-4)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-panel)',
  background: 'var(--color-surface-page)',
  color: 'var(--color-ink-primary)',
};

const episodes = [
  { id: 'explore', label: 'Episode 1', title: 'Explore Schools', description: 'Select your favorites' },
  { id: 'pay', label: 'Episode 2', title: 'Financial Planning', description: 'How will you pay for it?' },
  { id: 'dates', label: 'Episode 3', title: 'Important Dates', description: "What's next, step by step" },
];

/** Chosen, rest and disabled tiles on every test background at once: light, dark, mid-tone, a busy pattern and a gradient. */
export const EveryBackground: Story = {
  name: 'On every background',
  render: () => (
    <OnEveryBackground>
      <OnHeader>
        <ActionTileGroup aria-label="Tiles">
          <ActionTile data-state="chosen" label="Chosen" title="Explore Schools" description="Select your favorites" onPress={() => {}} />
          <ActionTile label="Rest" title="Financial Planning" description="How will you pay for it?" onPress={() => {}} />
          <ActionTile isDisabled label="Disabled" title="Important Dates" description="What's next, step by step" onPress={() => {}} />
        </ActionTileGroup>
      </OnHeader>
    </OnEveryBackground>
  ),
};

/** Switch: three episodes, the first chosen. Use the arrow keys to move between them. */
export const Switch: Story = {
  render: () => (
    <ActionTileSwitch defaultSelectedKey="explore">
      <OnHeader>
        <ActionTileGroup aria-label="Episodes" behavior="switch">
          {episodes.map((e) => (
            <ActionTile key={e.id} id={e.id} label={e.label} title={e.title} description={e.description} />
          ))}
        </ActionTileGroup>
      </OnHeader>
      {episodes.map((e) => (
        <ActionTilePanel key={e.id} id={e.id} style={panelOnPage}>
          {e.title} goes here.
        </ActionTilePanel>
      ))}
    </ActionTileSwitch>
  ),
};

/** Links and actions: each tile is its own link or button. */
export const LinksAndActions: Story = {
  render: () => (
    <OnHeader>
      <ActionTileGroup aria-label="Next steps">
        <ActionTile href="#fafsa" label="Link" title="Start the FAFSA" description="Opens the official site" />
        <ActionTile onPress={() => {}} label="Action" title="Add a school" description="Puts a new car on the track" />
        <ActionTile isDisabled label="Disabled" title="Compare aid offers" description="After your first offer arrives" />
      </ActionTileGroup>
    </OnHeader>
  ),
};

type PlaygroundArgs = { showLabel: boolean; label: string; title: string; showDescription: boolean; description: string };

/** Try it: turn the label and description on or off, and change the words. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { showLabel: true, label: 'Episode 1', title: 'Explore Schools', showDescription: true, description: 'Select your favorites' },
  argTypes: {
    showLabel: { name: 'Label', control: 'boolean' },
    label: { name: 'Label text', if: { arg: 'showLabel' } },
    showDescription: { name: 'Description', control: 'boolean' },
    description: { name: 'Description text', if: { arg: 'showDescription' } },
  },
  render: ({ showLabel, label, title, showDescription, description }) => (
    <OnHeader>
      <ActionTileGroup aria-label="Playground">
        <ActionTile onPress={() => {}} title={title} label={showLabel ? label : undefined} description={showDescription ? description : undefined} />
      </ActionTileGroup>
    </OnHeader>
  ),
};

/** Variants: the title is the only required part. Label and description are each optional. */
export const Variants: Story = {
  render: () => (
    <OnHeader>
      <ActionTileGroup aria-label="Variants">
        <ActionTile onPress={() => {}} title="Title only" />
        <ActionTile onPress={() => {}} label="Label" title="Label and title" />
        <ActionTile onPress={() => {}} title="Title and description" description="One short line" />
        <ActionTile onPress={() => {}} label="Label" title="All three" description="One short line" />
      </ActionTileGroup>
    </OnHeader>
  ),
};

/** Every state: rest, hover, keyboard focus, chosen and disabled. */
export const States: Story = {
  render: () => (
    <OnHeader>
      <ActionTileGroup aria-label="States">
        <ActionTile label="Rest" title="Explore Schools" description="Select your favorites" />
        <ActionTile data-state="hover" label="Hover" title="Explore Schools" description="Select your favorites" />
        <ActionTile data-state="focus" label="Keyboard focus" title="Explore Schools" description="Select your favorites" />
        <ActionTile data-state="chosen" label="Chosen" title="Explore Schools" description="Select your favorites" />
        <ActionTile isDisabled label="Disabled" title="Explore Schools" description="Select your favorites" />
      </ActionTileGroup>
    </OnHeader>
  ),
};
