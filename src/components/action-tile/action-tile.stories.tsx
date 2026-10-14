import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { LIGHT_CHANGE } from '../glass-lens/lens';
import { BothThemes, Row, WithReducedMotion } from '../story-helpers';
import { PageShell } from '../page-shell/page-shell';
import { ActionTile, ActionTileGroup, ActionTilePanel, ActionTileSwitch, type ActionTileFill } from './action-tile';
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
          'A card you press to make something happen, in every theme. One look, three behaviors, each on the React Aria piece that keeps it accessible.',
          '',
          '**Switch:** in an `ActionTileGroup behavior="switch"`, tiles swap content shown elsewhere on the page (React Aria Tabs). **Link:** give it `href` to go to a page (React Aria Link). **Action:** give it `onPress` (React Aria Button).',
          '',
          '**When to use:** a few big choices at the top of a page, each with a title and one short line. **When not to:** for views inside a card, use Tabs. For a plain action, use Button.',
          '',
          '**Do:** keep the description to one short line. **Don\'t:** put a button or link inside a tile; each tile is one click target.',
          '',
          '**Material (Oct 14):** `material="default"` is a solid fill with a soft shadow and light catching its edge. `material="glass"` is fully clear: only the edge light and the shadow show, so it looks the same in every theme and its text takes the color of what it sits on. On artwork the design system controls (Spotlight\'s header), Glass also bends the art at its edges. The glass build is due for a review (issue #60).',
          '',
          '**Fill:** with Default, `fill` picks the inside color from the theme\'s own surfaces: `card` (the default), `raised`, `sunken`, `accent` or `inverse`. Each one switches the text color with it, so it passes 4.5:1 contrast in light and dark mode. The fill changes with light and dark mode on its own.',
          '',
          '**Accessibility:** switch tiles are one Tab stop, with arrow keys between them and Home and End to the ends; screen readers hear "tab, 2 of 3, selected." The chosen tile shows the theme\'s mark (Spotlight\'s star, a check elsewhere, or any icon through `chosenIcon`) and changes its fill: the accent fill for Default; for Glass, light pools inside the clear glass and its whole edge holds the light. Its text color never changes, so it reads wherever the other tiles do. Keyboard focus is a soft glow in the theme\'s focus color, with no ring.',
          '',
          '**States (Oct 14):** soft light throughout, no hard lines. Hover rises 4px with a deeper shadow and a faint tint; pressed sinks back slightly; chosen shows the theme\'s mark, takes its fill (or, for Glass, a glow inside) and sits flat; focus glows; disabled fades to half with no shadow.',
          '',
          '**Light (Oct 14):** Glass catches the page\'s one light even on a plain background: its edge, highlight and shadow face the light and follow it when it moves (see "Glass: move the light"). On art the design system paints, it also bends the art at its edges.',
          '',
          '**Hover:** the tile rises 4px (`motion-lift-large`) and its shadow deepens; a chosen tile settles back down. With reduced motion it doesn\'t move, but the shadow still changes. On phones, switch tiles move to a bottom bar.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ActionTile>;

// The switched content, below the tiles.
const panelStyle: CSSProperties = { marginBlockStart: 'var(--space-4)' };

const tiles = [
  { id: 'one', label: 'Label', title: 'Tile 1', description: 'Description' },
  { id: 'two', label: 'Label', title: 'Tile 2', description: 'Description' },
  { id: 'three', label: 'Label', title: 'Tile 3', description: 'Description' },
];
const fills: ActionTileFill[] = ['card', 'raised', 'sunken', 'accent', 'inverse'];

/** The two materials: Default (a solid fill) and Glass (fully clear, only the edge light and shadow). */
export const Materials: Story = {
  render: () => (
    <BothThemes>
      <ActionTileGroup aria-label="Materials">
        <ActionTile onPress={() => {}} label="Default" title="Title" description="Description" />
        <ActionTile onPress={() => {}} material="glass" label="Glass" title="Title" description="Description" />
      </ActionTileGroup>
    </BothThemes>
  ),
};

/** Every fill a Default tile can have, from the theme's own surfaces. The text color switches with each one. */
export const Fills: Story = {
  render: () => (
    <BothThemes>
      <ActionTileGroup aria-label="Fills">
        {fills.map((f) => (
          <ActionTile key={f} onPress={() => {}} fill={f} label={f} title="Title" description="Description" />
        ))}
      </ActionTileGroup>
    </BothThemes>
  ),
};

/** Every state: rest, hover, keyboard focus, chosen and disabled, in both materials. */
export const States: Story = {
  render: () => (
    <BothThemes>
      {(['default', 'glass'] as Material[]).map((m) => (
        <Row key={m} label={m === 'glass' ? 'Glass' : 'Default'}>
          <ActionTileGroup aria-label={`States, ${m}`}>
            <ActionTile material={m} label="Rest" title="Title" description="Description" />
            <ActionTile material={m} data-state="hover" label="Hover" title="Title" description="Description" />
            <ActionTile material={m} data-state="focus" label="Focus" title="Title" description="Description" />
            <ActionTile material={m} data-state="chosen" label="Chosen" title="Title" description="Description" />
            <ActionTile material={m} isDisabled label="Disabled" title="Title" description="Description" />
          </ActionTileGroup>
        </Row>
      ))}
    </BothThemes>
  ),
};

/** Variants: the title is the only required part. Label and description are each optional. */
export const Variants: Story = {
  render: () => (
    <BothThemes>
      <ActionTileGroup aria-label="Variants">
        <ActionTile onPress={() => {}} title="Title only" />
        <ActionTile onPress={() => {}} label="Label" title="Label and title" />
        <ActionTile onPress={() => {}} title="Title and description" description="One short line" />
        <ActionTile onPress={() => {}} label="Label" title="All three" description="One short line" />
      </ActionTileGroup>
    </BothThemes>
  ),
};

/** Switch: three tiles, the first chosen. Use the arrow keys to move between them. */
export const Switch: Story = {
  render: () => (
    <BothThemes>
      <ActionTileSwitch defaultSelectedKey="one">
        <ActionTileGroup aria-label="Navigation" behavior="switch">
          {tiles.map((e) => (
            <ActionTile key={e.id} id={e.id} label={e.label} title={e.title} description={e.description} />
          ))}
        </ActionTileGroup>
        {tiles.map((e) => (
          <ActionTilePanel key={e.id} id={e.id} style={panelStyle}>
            {e.title} content
          </ActionTilePanel>
        ))}
      </ActionTileSwitch>
    </BothThemes>
  ),
};

/** Links and actions: each tile is its own link or button. */
export const LinksAndActions: Story = {
  render: () => (
    <BothThemes>
      <ActionTileGroup aria-label="Tiles">
        <ActionTile href="#" label="Link" title="Title" description="Goes to another page" />
        <ActionTile onPress={() => {}} label="Action" title="Title" description="Does something on this page" />
        <ActionTile isDisabled label="Disabled" title="Title" description="Description" />
      </ActionTileGroup>
    </BothThemes>
  ),
};

type PlaygroundArgs = { material: Material; fill: ActionTileFill; showLabel: boolean; label: string; title: string; showDescription: boolean; description: string };

/** Try it: pick the material and fill, turn the label and description on or off, and change the words. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { material: 'default', fill: 'card', showLabel: true, label: 'Label', title: 'Tile 1', showDescription: true, description: 'Description' },
  argTypes: {
    material: { name: 'Material', control: 'inline-radio', options: ['default', 'glass'] },
    fill: { name: 'Fill', control: 'select', options: fills, if: { arg: 'material', eq: 'default' } },
    showLabel: { name: 'Label', control: 'boolean' },
    label: { name: 'Label text', if: { arg: 'showLabel' } },
    showDescription: { name: 'Description', control: 'boolean' },
    description: { name: 'Description text', if: { arg: 'showDescription' } },
  },
  render: ({ material, fill, showLabel, label, title, showDescription, description }) => (
    <ActionTileGroup aria-label="Playground">
      <ActionTile onPress={() => {}} material={material} fill={fill} title={title} label={showLabel ? label : undefined} description={showDescription ? description : undefined} />
    </ActionTileGroup>
  ),
};

// Storybook only: the page's light follows the pointer. It moves the light tokens the tiles read
// (--light-from-right, --light-top) and tells the glass to relight.
function LightFollowsPointer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const group = ref.current?.querySelector<HTMLElement>('.ds-tiles');
    if (!group) return;
    const r = group.getBoundingClientRect();
    group.style.setProperty('--light-from-right', `${(((r.right - e.clientX) / r.width) * 100).toFixed(1)}%`);
    group.style.setProperty('--light-top', `${(e.clientY - r.top).toFixed(0)}px`);
    window.dispatchEvent(new Event(LIGHT_CHANGE));
  };
  return (
    <div ref={ref} onPointerMove={move} style={{ padding: 'var(--space-7) var(--space-4)' }}>
      {children}
    </div>
  );
}

/** Glass on a plain background: nothing bends, but the edges, highlight and shadow follow the light. Move the pointer around the tiles to move the light. */
export const GlassFollowsTheLight: Story = {
  name: 'Glass: move the light',
  render: () => (
    <BothThemes>
      <LightFollowsPointer>
        <ActionTileGroup aria-label="Glass tiles">
          <ActionTile onPress={() => {}} material="glass" label="Label" title="Tile 1" description="Description" />
          <ActionTile onPress={() => {}} material="glass" label="Label" title="Tile 2" description="Description" />
          <ActionTile onPress={() => {}} material="glass" label="Label" title="Tile 3" description="Description" />
        </ActionTileGroup>
      </LightFollowsPointer>
    </BothThemes>
  ),
};

// Glass on artwork needs art the design system controls: Spotlight's page shell header.
function ShellWithTiles() {
  return (
    <ActionTileSwitch defaultSelectedKey="one">
      <PageShell
        title="Page title"
        subtitle="Subtitle"
        navigation={
          <ActionTileGroup aria-label="Navigation" behavior="switch">
            {tiles.map((e) => (
              <ActionTile key={e.id} id={e.id} material="glass" label={e.label} title={e.title} description={e.description} />
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
 * Glass on Spotlight's header art: the rays and the wheel bend at each tile's curved edge, clear in the
 * middle, and the words stay crisp. Edges are brightest facing the wheel. (The page shell is Spotlight's
 * for now.)
 */
export const GlassOnArtwork: Story = {
  name: 'Glass on artwork',
  parameters: { layout: 'fullscreen' },
  decorators: [afterGraduationOnly],
  render: () => <ShellWithTiles />,
};

/** With Reduce motion on (Settings, or the device): Glass still bends the art, but presses don't swell and phone tilt is off. */
export const GlassReducedMotion: Story = {
  name: 'Glass: reduced motion',
  parameters: { layout: 'fullscreen' },
  decorators: [afterGraduationOnly],
  render: () => (
    <WithReducedMotion>
      <ShellWithTiles />
    </WithReducedMotion>
  ),
};
