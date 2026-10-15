import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';
import { BothThemes } from '../story-helpers';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'A thin line between groups. Built on React Aria\'s Separator. Called "Divider" in Figma.',
          '',
          '**When to use:** Only when spacing alone can\'t show where one group ends.',
          '',
          '**When not to:** Between every row, or around cards (cards use shadows).',
          '',
          '**Accessibility:** An `<hr>` (or `role="separator"` when vertical), so screen readers announce a separator.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Playground: Story = {};

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
