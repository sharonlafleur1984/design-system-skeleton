import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconTile, type IconTileSize } from './icon-tile';
import { BothThemes, Row, choice, hidden, setting, storyIcons, words } from '../story-helpers';
import { iconTilePage } from './icon-tile.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof IconTile> = {
  title: 'Components/Icon tile',
  component: IconTile,
  args: { icon: storyIcons.calendar, size: 'medium', variant: 'filled', ...pageArgs } as Meta<typeof IconTile>['args'],
  argTypes: {
    icon: setting('Icon', 'The icon, drawn in the text color around it\n\n`icon`', { control: false }),
    size: choice('Size', 'Small 24px, medium 32px, large 40px or xlarge 48px\n\n`size`', ['small', 'medium', 'large', 'xlarge']),
    variant: choice('Background', 'A soft background behind the icon, or the icon alone\n\n`variant`', ['filled', 'plain']),
    label: words('Label', 'What the icon means, read out. Leave empty when the words next to it say it\n\n`label`'),
    ...pageArgTypes(),
    className: hidden,
  },
  parameters: { componentPage: iconTilePage },
};
export default meta;
type Story = StoryObj<typeof IconTile>;

/** Icon tile's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every setting, in the Controls tab. */
export const Playground: Story = { tags: ['!dev'] };

const sizes: IconTileSize[] = ['small', 'medium', 'large', 'xlarge'];

/** Every size, with a soft background (filled) or without one (plain). Medium is the default. */
export const SizesAndBackgrounds: Story = {
  tags: ['!dev'],
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
