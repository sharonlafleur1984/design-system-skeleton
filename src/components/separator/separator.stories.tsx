import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';
import { BothThemes, choice, hidden } from '../story-helpers';
import { separatorPage } from './separator.page';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: choice('Orientation', 'A line across, or up and down between items in a row', ['horizontal', 'vertical']),
    className: hidden,
  },
  parameters: { componentPage: separatorPage },
};
export default meta;
type Story = StoryObj<typeof Separator>;

/** Every setting, in the Controls tab. */
export const Playground: Story = {};

/** Horizontal between stacked groups, vertical between items in a row. */
export const Orientations: Story = {
  render: () => (
    <BothThemes>
      <span>Item 1</span>
      <Separator />
      <span>Item 2</span>
      <div style={{ display: 'flex', gap: 'var(--space-3)', blockSize: '24px' }}>
        <span>Item 1</span>
        <Separator orientation="vertical" />
        <span>Item 2</span>
      </div>
    </BothThemes>
  ),
};
