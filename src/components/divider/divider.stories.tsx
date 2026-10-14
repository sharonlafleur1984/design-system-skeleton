import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './divider';
import { BothThemes } from '../story-helpers';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'A thin line between groups. From the Figma "Divider".',
          '',
          '**When to use:** Only when spacing alone can\'t show where one group ends.',
          '',
          '**When not to:** Between every row, or around cards (cards use shadows).',
          '',
          '**Accessibility:** An `<hr>`, so screen readers announce a separator.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Playground: Story = {};

export const Orientations: Story = {
  render: () => (
    <BothThemes>
      <span>Item 1</span>
      <Divider />
      <span>Item 2</span>
      <div style={{ display: 'flex', gap: 'var(--space-3)', blockSize: '24px' }}>
        <span>Item 1</span>
        <Divider orientation="vertical" />
        <span>Item 2</span>
      </div>
    </BothThemes>
  ),
};
