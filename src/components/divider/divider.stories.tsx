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
      <span>This week</span>
      <Divider />
      <span>Later</span>
      <div style={{ display: 'flex', gap: 'var(--space-3)', blockSize: '24px' }}>
        <span>Schools</span>
        <Divider orientation="vertical" />
        <span>Money</span>
      </div>
    </BothThemes>
  ),
};
