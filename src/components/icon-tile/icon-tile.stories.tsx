import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconTile, type IconTileSize } from './icon-tile';
import { BothThemes, Row, storyIcons } from '../story-helpers';

const meta: Meta<typeof IconTile> = {
  title: 'Components/Icon tile',
  component: IconTile,
  tags: ['autodocs'],
  args: { icon: storyIcons.calendar, size: 'medium', variant: 'filled' },
  argTypes: {
    icon: { control: false },
    size: { name: 'Size', control: 'inline-radio', options: ['small', 'medium', 'large', 'xlarge'] },
    variant: { name: 'Background', control: 'inline-radio', options: ['filled', 'plain'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'An icon in a small square, with a soft background (`filled`) or without one (`plain`), in four sizes: small 24px, medium 32px (the default), large 40px and xlarge 48px. Card, Tile and Action tile headers use it, and it works on its own.',
          '',
          '**Color:** the icon draws in the text color around it, and the background is a faint wash of that same color, so it reads on Solid, on Glass and in dark mode without a color of its own. Color only communicates.',
          '',
          '**Accessibility:** decorative by default, since the words next to it say what it is. When it stands alone and means something, give it a `label` to read out.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof IconTile>;

/** Try it: pick a size and the background. */
export const Playground: Story = {};

const sizes: IconTileSize[] = ['small', 'medium', 'large', 'xlarge'];

/** Every size, filled and plain. */
export const SizesAndBackgrounds: Story = {
  name: 'Sizes and backgrounds',
  render: () => (
    <BothThemes>
      {(['filled', 'plain'] as const).map((variant) => (
        <Row key={variant} label={variant === 'filled' ? 'Filled' : 'Plain'}>
          {sizes.map((size) => (
            <IconTile key={size} icon={storyIcons.calendar} size={size} variant={variant} />
          ))}
        </Row>
      ))}
    </BothThemes>
  ),
};
