import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Tile } from './tile';
import { BothThemes, Row, StatePictures, choice, hidden, onOff, setting, storyIcons, words } from '../story-helpers';
import { tilePage } from './tile.page';
import type { Appearance } from '../material';
import type { IconPosition } from '../tile-header';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Tile> = {
  title: 'Components/Tile',
  component: Tile,
  args: {
    title: 'Title',
    label: 'Label',
    description: 'Description',
    appearance: 'solid',
    icon: storyIcons.wallet,
    iconPosition: 'top',
    iconVariant: 'filled',
    isDisabled: false,
    ...pageArgs,
  } as Meta<typeof Tile>['args'],
  argTypes: {
    title: words('Title', 'What the tile is\n\n`title`'),
    label: words('Label', 'A small line above the title\n\n`label`'),
    description: words('Description', 'One short line about where it goes or what it does\n\n`description`'),
    appearance: choice('Style', 'Solid, or clear glass that takes its light from the page\n\n`appearance`', ['solid', 'glass']),
    icon: setting('Icon', 'An icon in an icon tile\n\n`icon`', { control: false }),
    iconPosition: choice('Icon position', 'Above the label, or before the label and title\n\n`iconPosition`', ['top', 'start']),
    iconVariant: choice('Icon background', 'A soft background behind the icon, or the icon alone\n\n`iconVariant`', ['filled', 'plain']),
    iconSize: choice('Icon size', 'The icon tile: small, medium, large or xlarge\n\n`iconSize`', ['small', 'medium', 'large', 'xlarge']),
    href: words('Link to', 'Goes to this page, as a link\n\n`href`'),
    onPress: setting('On press', 'Does this when pressed, as a button\n\n`onPress`', { control: false }),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be pressed\n\n`isDisabled`"),
    ...pageArgTypes({ states: ['rest', 'hover', 'pressed', 'focus', 'disabled'], glass: true }),
    'data-state': hidden,
    className: hidden,
  },
  parameters: { componentPage: tilePage },
};
export default meta;
type Story = StoryObj<typeof Tile>;

/** Tile's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, calc(var(--space-10) * 3)), 1fr))', gap: 'var(--space-3)', flex: '1 1 auto' };

type PlaygroundArgs = { appearance: Appearance; showIcon: boolean; iconPosition: IconPosition; iconVariant: 'filled' | 'plain'; showLabel: boolean; title: string; showDescription: boolean };

/** Every setting, in the Controls tab. */
export const Playground: StoryObj<PlaygroundArgs> = {
  tags: ['!dev'],
  args: { appearance: 'solid', showIcon: true, iconPosition: 'top', iconVariant: 'filled', showLabel: true, title: 'Title', showDescription: true },
  argTypes: {
    showIcon: onOff('Icon', 'An icon in an icon tile'),
    iconPosition: { ...choice('Icon position', 'Above the label, or before the label and title', ['top', 'start']), if: { arg: 'showIcon' } },
    iconVariant: { ...choice('Icon background', 'A soft background behind the icon, or the icon alone', ['filled', 'plain']), if: { arg: 'showIcon' } },
    showLabel: onOff('Label', 'A small line above the title'),
    showDescription: onOff('Description', 'One short line about where it goes'),
    // The component's own props this story doesn't use.
    ...Object.fromEntries(['label', 'description', 'icon', 'iconSize', 'href', 'onPress', 'isDisabled'].map((k) => [k, hidden])),
  },
  render: ({ appearance, showIcon, iconPosition, iconVariant, showLabel, title, showDescription }) => (
    <div style={grid}>
      <Tile
        onPress={() => {}}
        appearance={appearance}
        icon={showIcon ? storyIcons.wallet : undefined}
        iconPosition={iconPosition}
        iconVariant={iconVariant}
        label={showLabel ? 'Label' : undefined}
        title={title}
        description={showDescription ? 'Description' : undefined}
      />
    </div>
  ),
};

/** Solid (the theme's card surface, the starting look) and Glass (clear, only its edge light and shadow). Drag the sun to move the light. */
export const SolidAndGlass: Story = {
  tags: ['!dev'],
  name: 'Solid and glass',
  render: () => (
    <BothThemes>
      <div style={grid}>
        <Tile href="#" appearance="solid" icon={storyIcons.wallet} label="Solid" title="Title" description="Description" />
        <Tile href="#" appearance="glass" icon={storyIcons.wallet} label="Glass" title="Title" description="Description" />
      </div>
    </BothThemes>
  ),
};

/** Every state, in Solid and Glass: rest, hover (rises), pressed (sinks back), keyboard focus (a soft glow) and disabled (half strength). */
export const States: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <StatePictures>
        {(['solid', 'glass'] as Appearance[]).map((a) => (
          <Row key={a} label={a === 'glass' ? 'Glass' : 'Solid'}>
            <div style={grid}>
              <Tile appearance={a} onPress={() => {}} label="Rest" title="Title" description="Description" />
              <Tile appearance={a} onPress={() => {}} data-state="hover" label="Hover" title="Title" description="Description" />
              <Tile appearance={a} onPress={() => {}} data-state="pressed" label="Pressed" title="Title" description="Description" />
              <Tile appearance={a} onPress={() => {}} data-state="focus" label="Focus" title="Title" description="Description" />
              <Tile appearance={a} onPress={() => {}} isDisabled label="Disabled" title="Title" description="Description" />
            </div>
          </Row>
        ))}
      </StatePictures>
    </BothThemes>
  ),
};
