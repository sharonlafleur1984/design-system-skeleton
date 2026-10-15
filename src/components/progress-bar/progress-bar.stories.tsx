import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './progress-bar';
import { BothThemes, hidden, onOff, setting, words } from '../story-helpers';
import { progressBarPage } from './progress-bar.page';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/Progress bar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { value: 3, max: 5, label: 'Label', showLabel: true },
  argTypes: {
    label: words('Label', 'Names what is being measured. Always read by screen readers'),
    value: setting('Value', 'How much is done', { control: { type: 'number', min: 0 } }),
    max: setting('Maximum', 'The value that means finished. Defaults to 100', { control: { type: 'number', min: 1 } }),
    showLabel: onOff('Show label', 'Shows the label and value above the bar'),
    color: words('Color', 'Fill color as a token, like var(--color-accent-base)'),
    className: hidden,
    style: hidden,
  },
  parameters: { componentPage: progressBarPage },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

/** Every setting, in the Controls tab. */
export const Playground: Story = {};

/** Empty, partway and complete, with the label shown, and a bar alone for when the label sits nearby. */
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
