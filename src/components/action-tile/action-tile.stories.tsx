import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useGlassLight } from '../glass-light/glass-light';
import { OnEveryBackground, WithReducedMotion, storyBackgrounds } from '../story-helpers';
import { PageShell } from '../page-shell/page-shell';

const onDark: CSSProperties = { padding: 'var(--space-4)', borderRadius: 'var(--radius-panel)', background: storyBackgrounds.dark.value };
import { ActionTile, ActionTileGroup, ActionTilePanel, ActionTileSwitch } from './action-tile';
import { afterGraduationOnly } from '../product-only';

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
          '**When to use:** on artwork the design system controls, like After Graduation\'s header. **When not to:** on a plain page or a photo the system doesn\'t control; use a Card or Button there.',
          '',
          '**Accessibility:** switch tiles are one Tab stop, with arrow keys between them and Home and End to the ends; screen readers hear "tab, 2 of 3, selected." The chosen tile turns frosted white and shows a star, so color is never the only signal. White text on the header red passes 4.5:1, with lens glass too. Text on glass has no shadow; it uses the same typography as everywhere else. The lens canvas is decorative and hidden from screen readers; focus rings, keyboard behavior and touch targets are the same as the classic glass.',
          '',
          '**Light:** lit from the page\'s one light (in the page shell, the wheel): rims are brightest facing it, shadows fall away from it, and light weakens with distance.',
          '',
          '**Lens glass (Oct 12):** on artwork the design system controls (After Graduation\'s header), tiles are lens glass. The art behind them bends at their curved edge, strongest at the very edge and clear in the middle, with almost no blur. Their text and icons never bend or blur: they stay crisp HTML on top. Anywhere else, tiles keep the classic glass recipe, the same one cards use.',
          '',
          '**How the lens works:** the page shell paints its art (the red, the rays and the wheel) into one WebGL canvas behind the row of tiles, not one per tile. For each tile the canvas works out how far each point is from the tile\'s rounded edge and treats the glass as a rounded bevel 22px deep (`glass-lens-edge-depth`): flat in the middle, tilting most at the edge, so the art shifts most there. It adds a faint color split, a 5% white body with a 4% warm tint, a 1px rim brightest facing the light, a soft highlight just inside that edge and a shadow 2px away from the light. While it draws, the tile\'s own fill steps aside. It only redraws when something changes and pauses off screen.',
          '',
          '**Motion:** the glass moves over the art as you scroll; a pressed tile swells about 2% and settles back over 300ms; on phones, tilting nudges the light so highlights drift, then ease back when the phone is still. On iPhone, motion access is asked for on your first tap on a tile, never on load. Reduced motion, from the device or Settings, turns all of it off.',
          '',
          '**Fallback:** with no WebGL, a lost graphics context, Reduce transparency or Increase contrast, tiles show the classic glass recipe exactly (and solid glass for Reduce transparency and Increase contrast). Never a blank tile.',
          '',
          '**Hover:** the tile rises 4px (`motion-lift-large`) and its shadow deepens; a chosen tile settles back down. Hover only happens with a mouse; on phones the episodes move to a bottom bar.',
        ].join('\n'),
      },
    },
  },
  // Clear glass with white text needs something behind it, so these stories sit on Dark until you
  // pick another background with Storybook's Background button. "On every background" shows them all.
  // After Graduation only for now; with Life Hub picked, afterGraduationOnly shows a message instead.
  decorators: [
    (Story, context) => (
      <div data-theme="after-graduation" style={context.globals.backgrounds?.value ? undefined : onDark}>
        <Story />
      </div>
    ),
    afterGraduationOnly,
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

// Lens glass needs art the design system controls, so these stories use the real page shell header.
function ShellWithTiles({ glassLens = true }: { glassLens?: boolean }) {
  return (
    <ActionTileSwitch defaultSelectedKey="explore">
      <PageShell
        title="After Graduation"
        subtitle="Alex, get ready for Season 2"
        glassLens={glassLens}
        navigation={
          <ActionTileGroup aria-label="Episodes" behavior="switch">
            {episodes.map((e) => (
              <ActionTile key={e.id} id={e.id} label={e.label} title={e.title} description={e.description} />
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
  );
}

/**
 * Lens glass on After Graduation's header art: the rays and the wheel bend at each tile's curved edge,
 * clear in the middle, and the words stay crisp. Rims are brightest facing the wheel. Press a tile to see
 * it swell and settle. (Life Hub has no action tile skin yet.)
 */
export const LensOnArtwork: Story = {
  name: 'Lens glass on artwork',
  parameters: { layout: 'fullscreen' },
  render: () => <ShellWithTiles />,
};

/**
 * The fallback: what people see without WebGL, after the graphics context is lost, or with Reduce
 * transparency or Increase contrast (then the glass also turns solid). The classic glass recipe.
 */
export const LensFallback: Story = {
  name: 'Lens glass: fallback',
  parameters: { layout: 'fullscreen' },
  render: () => <ShellWithTiles glassLens={false} />,
};

/** With Reduce motion on (Settings, or the device): the lens still bends the art, but presses don't swell and phone tilt is off. */
export const LensReducedMotion: Story = {
  name: 'Lens glass: reduced motion',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <WithReducedMotion>
      <ShellWithTiles />
    </WithReducedMotion>
  ),
};
