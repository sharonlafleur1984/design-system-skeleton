import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './progress-bar';
import { BothThemes } from '../story-helpers';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/Progress bar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { value: 3, max: 5, label: 'Label', showLabel: true },
  parameters: {
    docs: {
      description: {
        component: [
          'Shows how much of something is done. Built on React Aria\'s ProgressBar. Called "ProgressMeter" in Figma.',
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
type Story = StoryObj<typeof ProgressBar>;

export const Playground: Story = {};

export const Values: Story = {
  render: () => (
    <BothThemes>
      <ProgressBar value={0} max={5} label="Empty" showLabel />
      <ProgressBar value={3} max={5} label="Partway" showLabel />
      <ProgressBar value={100} label="Complete" showLabel />
      <ProgressBar value={60} label="Bar only (label read by screen readers)" />
    </BothThemes>
  ),
};
