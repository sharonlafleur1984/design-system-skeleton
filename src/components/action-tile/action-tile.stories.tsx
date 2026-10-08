import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useGlassLight } from '../glass-light/glass-light';
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
  decorators: [(Story) => <div data-theme="after-graduation"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ActionTile>;

// Storybook only: a slice of the header, with its rays and light low on the right.
function OnHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGlassLight(ref, { light: { x: 0.85, y: 1 }, selector: '.ds-tile' });
  const style: CSSProperties = {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    padding: 'var(--layout-gutter)',
    borderRadius: 'var(--radius-panel)',
    background:
      'repeating-conic-gradient(from 0deg at 85% 100%, rgb(255 255 255 / 0.12) 0 2deg, transparent 2deg 7deg), linear-gradient(var(--color-accent-base), var(--shell-frame))',
  };
  return <div ref={ref} style={style}>{children}</div>;
}

const episodes = [
  { id: 'explore', label: 'Episode 1', title: 'Explore Schools', description: 'Select your favorites' },
  { id: 'pay', label: 'Episode 2', title: 'Financial Planning', description: 'How will you pay for it?' },
  { id: 'dates', label: 'Episode 3', title: 'Important Dates', description: "What's next, step by step" },
];

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
        <ActionTilePanel key={e.id} id={e.id} style={{ paddingBlock: 'var(--space-4)' }}>
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

/** Every state: rest, hover, keyboard focus and chosen. */
export const States: Story = {
  render: () => (
    <OnHeader>
      <ActionTileGroup aria-label="States">
        <ActionTile label="Rest" title="Explore Schools" description="Select your favorites" />
        <ActionTile data-state="hover" label="Hover" title="Explore Schools" description="Select your favorites" />
        <ActionTile data-state="focus" label="Keyboard focus" title="Explore Schools" description="Select your favorites" />
        <ActionTile data-state="chosen" label="Chosen" title="Explore Schools" description="Select your favorites" />
      </ActionTileGroup>
    </OnHeader>
  ),
};
