import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './progress-bar';
import { BothThemes, hidden, onOff, setting, words } from '../story-helpers';
import { progressBarPage } from './progress-bar.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/Progress bar',
  component: ProgressBar,
  args: { value: 3, max: 5, label: 'Label', showLabel: true, ...pageArgs } as Meta<typeof ProgressBar>['args'],
  argTypes: {
    label: words('Label', 'Names what is being measured. Always read by screen readers\n\n`label`'),
    value: setting('Value', 'How much is done\n\n`value`', { control: { type: 'number', min: 0 } }),
    max: setting('Maximum', 'The value that means finished. Defaults to 100\n\n`max`', { control: { type: 'number', min: 1 } }),
    showLabel: onOff('Show label', 'Shows the label and value above the bar\n\n`showLabel`'),
    color: words('Color', 'Fill color as a token, like var(--color-accent-base)\n\n`color`'),
    ...pageArgTypes(),
    className: hidden,
    style: hidden,
  },
  parameters: { componentPage: progressBarPage },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

/** Progress bar's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every setting, in the Controls tab. */
export const Playground: Story = { tags: ['!dev'] };

/** Empty, partway and complete, with the label shown, and a bar alone for when the label sits nearby. */
export const Values: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <ProgressBar value={0} max={5} label="Empty" showLabel />
      <ProgressBar value={3} max={5} label="Partway" showLabel />
      <ProgressBar value={100} label="Complete" showLabel />
      <ProgressBar value={60} label="Bar only (label read by screen readers)" />
    </BothThemes>
  ),
};
