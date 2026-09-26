import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressMeter } from './progress-meter';
import { BothThemes } from '../story-helpers';

const meta: Meta<typeof ProgressMeter> = {
  title: 'Components/ProgressMeter',
  component: ProgressMeter,
  tags: ['autodocs'],
  args: { value: 3, max: 5, label: 'Senior year checklist', showLabel: true },
  parameters: {
    docs: {
      description: {
        component: [
          'Shows how much of something is done. From the Figma "ProgressMeter" set.',
          '',
          '**When to use:** Progress toward a clear finish line, like a checklist.',
          '',
          '**When not to:** For loading. For a single yes or no, use a checkbox.',
          '',
          '**Do:** Say what is being measured. **Don\'t:** Show a bar with no label anywhere nearby.',
          '',
          '**Accessibility:** `role="progressbar"` with a label and a spoken value ("3 of 5").',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressMeter>;

export const Playground: Story = {};

export const Values: Story = {
  render: () => (
    <BothThemes>
      <ProgressMeter value={0} max={5} label="Not started" showLabel />
      <ProgressMeter value={3} max={5} label="Senior year checklist" showLabel />
      <ProgressMeter value={100} label="Applications sent" showLabel />
      <ProgressMeter value={60} label="Bar only (label read by screen readers)" />
    </BothThemes>
  ),
};
