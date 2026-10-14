import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useGlassLight } from '../glass-light/glass-light';
import { OnEveryBackground, WithReducedMotion, storyBackgrounds } from '../story-helpers';
import { PageShell } from '../page-shell/page-shell';

const onDark: CSSProperties = { padding: 'var(--space-4)', borderRadius: 'var(--radius-panel)', background: storyBackgrounds.dark.value };
import { ActionTile, ActionTileGroup, ActionTilePanel, ActionTileSwitch } from './action-tile';
import { afterGraduationOnly } from '../product-only';
import type { Material } from '../material';

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
          '**Switch:** in an `ActionTileGroup behavior="switch"`, tiles swap content shown elsewhere on the page, like After Graduation\'s tiles. **Link:** give it `href` to go to a page. **Action:** give it `onPress`.',
          '',
          '**When not to:** for views inside a card, use Tabs. For a plain action, use Button.',
          '',
          '**Do:** keep the description to one short line. **Don\'t:** put a button or link inside a tile; each tile is one click target.',
          '',
          '**When to use:** on artwork the design system controls, like After Graduation\'s header. **When not to:** on a plain page or a photo the system doesn\'t control; use a Card or Button there.',
          '',
          '**Accessibility:** switch tiles are one Tab stop, with arrow keys between them and Home and End to the ends; screen readers hear "tab, 2 of 3, selected." The chosen tile turns frosted white and shows a star, so color is never the only signal. White text on the header red passes 4.5:1, with Glass too. Text on glass has no shadow; it uses the same typography as everywhere else. The glass canvas is decorative and hidden from screen readers; focus rings, keyboard behavior and touch targets are the same as with Default.',
          '',
          '**Light:** lit from the page\'s one light (in the page shell, the wheel): rims are brightest facing it, shadows fall away from it, and light weakens with distance.',
          '',
          '**Material (Oct 14):** `material="glass"` or `material="default"`. Glass bends the art behind it; Default is the subtle frosted look. Glass only shows on artwork the system controls; elsewhere both look the same. The glass build is due for a review (issue #60).',
          '',
          '**Glass (Oct 12):** on artwork the design system controls (Spotlight\'s header), tiles start as Glass. The art behind them bends at their curved edge, strongest at the very edge and clear in the middle, with almost no blur. Their text and icons never bend or blur: they stay crisp HTML on top. Anywhere else, tiles show Default, the same recipe cards use.',
          '',
          '**How Glass works:** the page shell paints its art (the red, the rays and the wheel) into one WebGL canvas behind the row of tiles, not one per tile. For each tile the canvas works out how far each point is from the tile\'s rounded edge and treats the glass as a rounded bevel 22px deep (`glass-lens-edge-depth`): flat in the middle, tilting most at the edge, so the art shifts most there. It adds a faint color split, a 5% white body with a 4% warm tint, a 1px rim brightest facing the light, a soft highlight just inside that edge and a shadow 2px away from the light. While it draws, the tile\'s own fill steps aside (a chosen tile keeps its frosted white). It only redraws when something changes and pauses off screen.',
          '',
          '**Motion:** the glass moves over the art as you scroll; a pressed tile swells about 2%, text and all, and settles back over 300ms; on phones, tilting nudges the light so highlights drift, then ease back when the phone is still. On iPhone, motion access is asked for on your first tap on a tile, never on load. Reduced motion, from the device or Settings, turns all of it off.',
          '',
          '**Fallback:** with no WebGL, a lost graphics context, Reduce transparency or Increase contrast, tiles show the classic glass recipe exactly (and solid glass for Reduce transparency and Increase contrast). Never a blank tile.',
          '',
          '**Hover:** the tile rises 4px (`motion-lift-large`) and its shadow deepens; a chosen tile settles back down. Hover only happens with a mouse; on phones the tiles move to a bottom bar.',
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

const tiles = [
  { id: 'explore', label: 'Label', title: 'Tile 1', description: 'Description' },
  { id: 'pay', label: 'Label', title: 'Tile 2', description: 'Description' },
  { id: 'dates', label: 'Label', title: 'Tile 3', description: 'Description' },
];

/** Chosen, rest and disabled tiles on every test background at once: light, dark, mid-tone, a busy pattern and a gradient. */
export const EveryBackground: Story = {
  name: 'On every background',
  render: () => (
    <OnEveryBackground>
      <OnHeader>
        <ActionTileGroup aria-label="Tiles">
          <ActionTile data-state="chosen" label="Chosen" title="Title" description="Description" onPress={() => {}} />
          <ActionTile label="Rest" title="Title" description="Description" onPress={() => {}} />
          <ActionTile isDisabled label="Disabled" title="Title" description="Description" onPress={() => {}} />
        </ActionTileGroup>
      </OnHeader>
    </OnEveryBackground>
  ),
};

/** Switch: three tiles, the first chosen. Use the arrow keys to move between them. */
export const Switch: Story = {
  render: () => (
    <ActionTileSwitch defaultSelectedKey="explore">
      <OnHeader>
        <ActionTileGroup aria-label="Navigation" behavior="switch">
          {tiles.map((e) => (
            <ActionTile key={e.id} id={e.id} label={e.label} title={e.title} description={e.description} />
          ))}
        </ActionTileGroup>
      </OnHeader>
      {tiles.map((e) => (
        <ActionTilePanel key={e.id} id={e.id} style={panelOnPage}>
          {e.title} content
        </ActionTilePanel>
      ))}
    </ActionTileSwitch>
  ),
};

/** Links and actions: each tile is its own link or button. */
export const LinksAndActions: Story = {
  render: () => (
    <OnHeader>
      <ActionTileGroup aria-label="Tiles">
        <ActionTile href="#" label="Link" title="Title" description="Goes to another page" />
        <ActionTile onPress={() => {}} label="Action" title="Title" description="Does something on this page" />
        <ActionTile isDisabled label="Disabled" title="Title" description="Description" />
      </ActionTileGroup>
    </OnHeader>
  ),
};

type PlaygroundArgs = { showLabel: boolean; label: string; title: string; showDescription: boolean; description: string };

/** Try it: turn the label and description on or off, and change the words. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { showLabel: true, label: 'Label', title: 'Tile 1', showDescription: true, description: 'Description' },
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
        <ActionTile label="Rest" title="Title" description="Description" />
        <ActionTile data-state="hover" label="Hover" title="Title" description="Description" />
        <ActionTile data-state="focus" label="Keyboard focus" title="Title" description="Description" />
        <ActionTile data-state="chosen" label="Chosen" title="Title" description="Description" />
        <ActionTile isDisabled label="Disabled" title="Title" description="Description" />
      </ActionTileGroup>
    </OnHeader>
  ),
};

// Glass needs art the design system controls, so these stories use the real page shell header.
function ShellWithTiles({ material = 'glass' }: { material?: Material }) {
  return (
    <ActionTileSwitch defaultSelectedKey="explore">
      <PageShell
        title="Page title"
        subtitle="Subtitle"
        material={material}
        navigation={
          <ActionTileGroup aria-label="Navigation" behavior="switch">
            {tiles.map((e) => (
              <ActionTile key={e.id} id={e.id} label={e.label} title={e.title} description={e.description} />
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
  );
}

/**
 * Glass on Spotlight's header art: the rays and the wheel bend at each tile's curved edge,
 * clear in the middle, and the words stay crisp. Rims are brightest facing the wheel. Press a tile to see
 * it swell and settle. (Life Hub has no action tile skin yet.)
 */
export const GlassOnArtwork: Story = {
  name: 'Glass on artwork',
  parameters: { layout: 'fullscreen' },
  render: () => <ShellWithTiles />,
};

/**
 * Default on the same art: the subtle frosted look. It's also what people see with Glass when there's no
 * WebGL, the graphics context is lost, or Reduce transparency or Increase contrast is on (then it turns solid).
 */
export const DefaultOnArtwork: Story = {
  name: 'Default on artwork',
  parameters: { layout: 'fullscreen' },
  render: () => <ShellWithTiles material="default" />,
};

/** With Reduce motion on (Settings, or the device): Glass still bends the art, but presses don't swell and phone tilt is off. */
export const GlassReducedMotion: Story = {
  name: 'Glass: reduced motion',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <WithReducedMotion>
      <ShellWithTiles />
    </WithReducedMotion>
  ),
};
