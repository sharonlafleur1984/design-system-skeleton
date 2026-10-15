import type { Meta, StoryObj } from '@storybook/react-vite';
import { Callout } from './callout';
import { BothThemes, choice, hidden, words } from '../story-helpers';
import { calloutPage } from './callout.page';

const meta: Meta<typeof Callout> = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
  args: { tone: 'info', title: 'Title', children: 'Description' },
  argTypes: {
    tone: choice('Tone', 'What the message means', ['info', 'warning', 'success', 'error', 'neutral']),
    title: words('Title', 'An optional bold first line'),
    children: words('Description', 'The message'),
    toneLabel: words('Screen reader word', 'Read before the message, like "Error". Defaults to the tone name'),
    className: hidden,
  },
  parameters: { componentPage: calloutPage },
};
export default meta;
type Story = StoryObj<typeof Callout>;

/** Every setting, in the Controls tab. */
export const Playground: Story = {};

/** Info, warning, success, error and neutral: the same names as the status colors. Each has its own symbol. */
export const Tones: Story = {
  render: () => (
    <BothThemes>
      <Callout tone="info" title="Info">Description</Callout>
      <Callout tone="warning" title="Warning">Description</Callout>
      <Callout tone="success" title="Success">Description</Callout>
      <Callout tone="error" title="Error">Description</Callout>
      <Callout tone="neutral" title="Neutral">Description</Callout>
    </BothThemes>
  ),
};

/** Description only, for a message short enough to need no title. */
export const WithoutTitle: Story = {
  name: 'Without title',
  render: () => (
    <BothThemes>
      <Callout tone="info">Description</Callout>
      <Callout tone="neutral">Description</Callout>
    </BothThemes>
  ),
};
