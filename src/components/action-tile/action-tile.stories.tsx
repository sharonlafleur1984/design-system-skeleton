import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { BothThemes, Row, WithReducedMotion, StatePictures, choice, hidden, onOff, setting, storyIcons, words } from '../story-helpers';
import { actionTilePage } from './action-tile.page';
import type { IconPosition } from '../tile-header';
import { PageShell } from '../page-shell/page-shell';
import { ActionTile, ActionTileGroup, ActionTilePanel, ActionTileSwitch } from './action-tile';
import { afterGraduationOnly } from '../product-only';
import type { Appearance } from '../material';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof ActionTile> = {
  title: 'Components/Action tile',
  component: ActionTile,
  args: {
    title: 'Title',
    label: 'Label',
    description: 'Description',
    appearance: 'solid',
    icon: storyIcons.book,
    iconVariant: 'filled',
    iconSize: 'medium',
    isDisabled: false,
    ...pageArgs,
  } as Meta<typeof ActionTile>['args'],
  argTypes: {
    title: words('Title', 'What the tile is\n\n`title`'),
    label: words('Label', 'A small line above the title\n\n`label`'),
    description: words('Description', 'One short line about what happens there\n\n`description`'),
    shortTitle: words('Short title', 'One or two words for the phone bottom bar. Falls back to the title\n\n`shortTitle`'),
    appearance: choice('Style', 'Solid, or clear glass that takes its light from the page. Never on other glass\n\n`appearance`', ['solid', 'glass']),
    icon: setting('Icon', 'Shown in the phone bottom bar, and in the tile when Icon position is set\n\n`icon`', { control: false }),
    iconPosition: choice('Icon position', 'Shows the icon in the tile: above the label, or before the label and title\n\n`iconPosition`', ['top', 'start']),
    iconVariant: choice('Icon background', 'A soft background behind the icon, or the icon alone\n\n`iconVariant`', ['filled', 'plain']),
    iconSize: choice('Icon size', 'The icon tile: small, medium, large or xlarge\n\n`iconSize`', ['small', 'medium', 'large', 'xlarge']),
    chosenIcon: setting('Chosen mark', "Shown when the tile is chosen, in place of the theme's mark\n\n`chosenIcon`", { control: false }),
    id: setting('ID', 'Matches the ActionTilePanel it shows\n\n`id`', { control: false }),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be chosen\n\n`isDisabled`"),
    ...pageArgTypes({ states: ['rest', 'hover', 'focus', 'disabled'], glass: true }),
    href: hidden,
    onPress: hidden,
    material: hidden,
    fill: hidden,
    'data-state': hidden,
  },
  parameters: { componentPage: actionTilePage },
};
export default meta;
type Story = StoryObj<typeof ActionTile>;

/** Action tile's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

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

/** Every setting, in the Controls tab. */
export const Playground: StoryObj<PlaygroundArgs> = {
  tags: ['!dev'],
  args: { appearance: 'solid', showIcon: false, iconPosition: 'top', iconVariant: 'filled', showLabel: true, title: 'Tile 1', showDescription: true },
  argTypes: {
    showIcon: onOff('Icon', 'Shows each icon in its tile'),
    iconPosition: { ...choice('Icon position', 'Above the label, or before the label and title', ['top', 'start']), if: { arg: 'showIcon' } },
    iconVariant: { ...choice('Icon background', 'A soft background behind the icon, or the icon alone', ['filled', 'plain']), if: { arg: 'showIcon' } },
    showLabel: onOff('Label', 'A small line above each title'),
    title: words('First title', 'What the first tile is'),
    showDescription: onOff('Description', 'One short line on each tile'),
    // The component's own props this story doesn't use.
    ...Object.fromEntries(['label', 'description', 'shortTitle', 'icon', 'iconSize', 'chosenIcon', 'id', 'isDisabled'].map((k) => [k, hidden])),
  },
  render: ({ appearance, showIcon, iconPosition, iconVariant, showLabel, title, showDescription }) => (
    <NavigationTiles appearance={appearance} iconPosition={showIcon ? iconPosition : undefined} iconVariant={iconVariant} showLabel={showLabel} showDescription={showDescription} title={title} label="Playground" />
  ),
};

/** Solid (the theme's card surface, the starting look) and Glass (clear, only its edge light and shadow). Drag the sun to move the light. */
export const SolidAndGlass: Story = {
  tags: ['!dev'],
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

/** Every state, in Solid and Glass: rest, hover, keyboard focus, chosen (the theme's mark) and disabled. */
export const States: Story = {
  tags: ['!dev'],
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

/** Three tiles that switch the content under them; use the arrow keys between them. Pick a phone size in the toolbar to see the bottom bar. */
export const Navigation: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <NavigationTiles />
    </BothThemes>
  ),
};

/** Screenshot check only (hidden from the sidebar): with reduced motion, Glass still bends the art, but presses don't swell and phone tilt is off. */
export const GlassReducedMotion: Story = {
  tags: ['!dev'],
  name: 'Glass: reduced motion',
  parameters: { layout: 'fullscreen' },
  decorators: [afterGraduationOnly],
  render: () => (
    <WithReducedMotion>
      <ShellWithTiles />
    </WithReducedMotion>
  ),
};
