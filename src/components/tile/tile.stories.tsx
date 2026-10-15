import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Tile } from './tile';
import { BothThemes, Row, StatePictures, storyIcons } from '../story-helpers';
import type { Appearance } from '../material';
import type { IconPosition } from '../tile-header';

const meta: Meta<typeof Tile> = {
  title: 'Components/Tile',
  component: Tile,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'A whole tile that\'s one link or one button, in every theme: press anywhere on it to go somewhere or do something. The same look as Card and Action tile.',
          '',
          '**Link or button:** give it `href` to go to a page (React Aria Link) or `onPress` to do something here (React Aria Button). Both look the same; screen readers hear "link" or "button," and a link can open in a new tab.',
          '',
          '**When to use:** a few big choices that each lead somewhere, like the sections of an app. **When not to:** if it needs its own buttons inside, use Card (a tile is one click target). To switch between sections of the same page, use Action tile.',
          '',
          '**Solid and glass, icons:** the same as Card: `appearance`, and an `icon` in an icon tile, `iconPosition` top or start, filled or plain.',
          '',
          '**States:** hover rises a little with a deeper shadow, pressed sinks back, keyboard focus is a soft glow in the theme\'s focus color, and disabled fades to half. With reduced motion nothing moves, but the shadow still changes.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Tile>;

const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, calc(var(--space-10) * 3)), 1fr))', gap: 'var(--space-3)', flex: '1 1 auto' };

type PlaygroundArgs = { appearance: Appearance; showIcon: boolean; iconPosition: IconPosition; iconVariant: 'filled' | 'plain'; showLabel: boolean; title: string; showDescription: boolean };

/** Try it: press the tile, pick Solid or Glass, and turn each part on or off. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { appearance: 'solid', showIcon: true, iconPosition: 'top', iconVariant: 'filled', showLabel: true, title: 'Title', showDescription: true },
  argTypes: {
    appearance: { name: 'Appearance', control: 'inline-radio', options: ['solid', 'glass'] },
    showIcon: { name: 'Icon', control: 'boolean' },
    iconPosition: { name: 'Icon position', control: 'inline-radio', options: ['top', 'start'], if: { arg: 'showIcon' } },
    iconVariant: { name: 'Icon background', control: 'inline-radio', options: ['filled', 'plain'], if: { arg: 'showIcon' } },
    showLabel: { name: 'Label', control: 'boolean' },
    title: { name: 'Title' },
    showDescription: { name: 'Description', control: 'boolean' },
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

/** The two appearances on the theme's own page. Drag the sun to move the light. */
export const SolidAndGlass: Story = {
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

/** Every state: rest, hover, pressed, keyboard focus and disabled, in Solid and Glass. */
export const States: Story = {
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
