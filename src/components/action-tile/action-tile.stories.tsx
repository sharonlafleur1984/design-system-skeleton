import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { BothThemes, Row, WithReducedMotion, StatePictures, storyIcons } from '../story-helpers';
import type { IconPosition } from '../tile-header';
import { PageShell } from '../page-shell/page-shell';
import { ActionTile, ActionTileGroup, ActionTilePanel, ActionTileSwitch } from './action-tile';
import { afterGraduationOnly } from '../product-only';
import type { Appearance } from '../material';

const meta: Meta<typeof ActionTile> = {
  title: 'Components/Action tile',
  component: ActionTile,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Navigation: a row of tiles that switches what the page shows, like tabs, in every theme. Built on React Aria Tabs. After Graduation\'s episodes use it.',
          '',
          '**When to use:** two to five big sections at the top of a page, each with a title and one short line. Put the tiles in `ActionTileGroup behavior="switch"` inside an `ActionTileSwitch`, with one `ActionTilePanel` per tile.',
          '',
          '**When not to:** for a link or a button that looks like a tile, use **Tile**: same look. For views inside a card, use Tabs. (Tiles with `href` or `onPress` still work, but are deprecated.)',
          '',
          '**Solid and glass:** `appearance="solid"` (the starting look) is the theme\'s card surface with a soft shadow. `appearance="glass"` is fully clear: only its edge light and shadow show, and its text takes the color of what it sits on. On artwork the design system paints (Spotlight\'s header), Glass bends the art at its edges. Tiles in the page shell header start as Glass. Fills are gone (Oct 15): hover and pressed are states, not colors to pick.',
          '',
          '**Do:** keep the description to one short line. **Don\'t:** put a button or link inside a tile; each tile is one click target.',
          '',
          '**States:** soft light throughout, no hard lines. Hover rises 4px with a deeper shadow; pressed sinks back slightly; chosen shows the theme\'s mark (Spotlight\'s star, a check elsewhere, or any icon through `chosenIcon`), takes the theme\'s pale primary color (Glass turns milky) and sits flat; focus glows; disabled fades to half. With reduced motion nothing moves, but the shadow still changes.',
          '',
          '**Icons:** give each tile an `icon`. It always shows in the phone bottom bar; set `iconPosition` (top or start) to show it in the tile too, in an icon tile, `filled` or `plain`. The chosen mark stays in the top-right corner.',
          '',
          '**Phones:** under 600px the same tiles become the bottom bar, each an icon (`icon`) and a short name (`shortTitle`), so it\'s one set of tabs on every screen.',
          '',
          '**Accessibility:** one Tab stop, with arrow keys between tiles and Home and End to the ends; screen readers hear "tab, 2 of 3, selected." The mark and the color change together, so color is never the only sign a tile is chosen. Keyboard focus is a soft glow in the theme\'s focus color. With Reduce transparency or Increase contrast on, Glass tiles turn solid, and a chosen one shows a line in its text color with its mark.',
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
  { id: 'one', label: 'Label', title: 'Tile 1', description: 'Description', icon: storyIcons.book },
  { id: 'two', label: 'Label', title: 'Tile 2', description: 'Description', icon: storyIcons.wallet },
  { id: 'three', label: 'Label', title: 'Tile 3', description: 'Description', icon: storyIcons.calendar },
];

/** Three tiles that switch the content under them, the first chosen. */
function NavigationTiles({ appearance, label = 'Navigation', showLabel = true, showDescription = true, title, iconPosition, iconVariant }: { appearance?: Appearance; label?: string; showLabel?: boolean; showDescription?: boolean; title?: string; iconPosition?: IconPosition; iconVariant?: 'filled' | 'plain' }) {
  return (
    <ActionTileSwitch defaultSelectedKey="one">
      <ActionTileGroup aria-label={label} behavior="switch">
        {tiles.map((e, i) => (
          <ActionTile
            key={e.id}
            id={e.id}
            appearance={appearance}
            icon={e.icon}
            iconPosition={iconPosition}
            iconVariant={iconVariant}
            label={showLabel ? e.label : undefined}
            title={i === 0 && title ? title : e.title}
            description={showDescription ? e.description : undefined}
          />
        ))}
      </ActionTileGroup>
      {tiles.map((e) => (
        <ActionTilePanel key={e.id} id={e.id} style={panelStyle}>
          {e.title} content
        </ActionTilePanel>
      ))}
    </ActionTileSwitch>
  );
}

type PlaygroundArgs = { appearance: Appearance; showIcon: boolean; iconPosition: IconPosition; iconVariant: 'filled' | 'plain'; showLabel: boolean; title: string; showDescription: boolean };

/** Try it: pick Solid or Glass, turn the label and description on or off, and press the tiles. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { appearance: 'solid', showIcon: false, iconPosition: 'top', iconVariant: 'filled', showLabel: true, title: 'Tile 1', showDescription: true },
  argTypes: {
    appearance: { name: 'Appearance', control: 'inline-radio', options: ['solid', 'glass'] },
    showIcon: { name: 'Icon', control: 'boolean' },
    iconPosition: { name: 'Icon position', control: 'inline-radio', options: ['top', 'start'], if: { arg: 'showIcon' } },
    iconVariant: { name: 'Icon background', control: 'inline-radio', options: ['filled', 'plain'], if: { arg: 'showIcon' } },
    showLabel: { name: 'Label', control: 'boolean' },
    title: { name: 'First title' },
    showDescription: { name: 'Description', control: 'boolean' },
  },
  render: ({ appearance, showIcon, iconPosition, iconVariant, showLabel, title, showDescription }) => (
    <NavigationTiles appearance={appearance} iconPosition={showIcon ? iconPosition : undefined} iconVariant={iconVariant} showLabel={showLabel} showDescription={showDescription} title={title} label="Playground" />
  ),
};

/** The two appearances on the theme's own page: Solid (the card surface) and Glass (clear, only its edge light and shadow). Drag the sun to move the light. */
export const SolidAndGlass: Story = {
  name: 'Solid and glass',
  render: () => (
    <BothThemes>
      <Row label="Solid">
        <div style={{ flex: '1 1 auto', minInlineSize: 0 }}>
          <NavigationTiles appearance="solid" label="Solid" />
        </div>
      </Row>
      <Row label="Glass">
        <div style={{ flex: '1 1 auto', minInlineSize: 0 }}>
          <NavigationTiles appearance="glass" label="Glass" />
        </div>
      </Row>
    </BothThemes>
  ),
};

/** Every state: rest, hover, keyboard focus, chosen and disabled, in Solid and Glass. */
export const States: Story = {
  render: () => (
    <BothThemes>
      <StatePictures>
        {(['solid', 'glass'] as Appearance[]).map((a) => (
          <Row key={a} label={a === 'glass' ? 'Glass' : 'Solid'}>
            <ActionTileGroup aria-label={`States, ${a}`}>
              <ActionTile appearance={a} label="Rest" title="Title" description="Description" />
              <ActionTile appearance={a} data-state="hover" label="Hover" title="Title" description="Description" />
              <ActionTile appearance={a} data-state="focus" label="Focus" title="Title" description="Description" />
              <ActionTile appearance={a} data-state="chosen" label="Chosen" title="Title" description="Description" />
              <ActionTile appearance={a} isDisabled label="Disabled" title="Title" description="Description" />
            </ActionTileGroup>
          </Row>
        ))}
      </StatePictures>
    </BothThemes>
  ),
};

// For the reduced-motion check: Glass on art the design system paints, Spotlight's page shell header.
function ShellWithTiles() {
  return (
    <ActionTileSwitch defaultSelectedKey="one">
      <PageShell
        title="Page title"
        subtitle="Subtitle"
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
 * Navigation: three tiles that switch the content under them, like tabs. Use the arrow keys to move
 * between them. On a phone (pick a phone size in the toolbar) the same tiles become the bottom bar. In
 * Spotlight's page header they're Glass on the header art: see Page shell.
 */
export const Navigation: Story = {
  render: () => (
    <BothThemes>
      <NavigationTiles />
    </BothThemes>
  ),
};

/** Screenshot check only (hidden from the sidebar): with reduced motion, Glass still bends the art, but presses don't swell and phone tilt is off. */
export const GlassReducedMotion: Story = {
  name: 'Glass: reduced motion',
  tags: ['!dev'],
  parameters: { layout: 'fullscreen' },
  decorators: [afterGraduationOnly],
  render: () => (
    <WithReducedMotion>
      <ShellWithTiles />
    </WithReducedMotion>
  ),
};
