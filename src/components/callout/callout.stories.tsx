import type { Meta, StoryObj } from '@storybook/react-vite';
import { Callout } from './callout';
import { BothThemes, choice, hidden, words } from '../story-helpers';
import { calloutPage } from './callout.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Callout> = {
  title: 'Components/Callout',
  component: Callout,
  args: { tone: 'info', title: 'Title', children: 'Description', ...pageArgs } as Meta<typeof Callout>['args'],
  argTypes: {
    tone: choice('Tone', 'What the message means\n\n`tone`', ['info', 'warning', 'success', 'error', 'neutral']),
    title: words('Title', 'An optional bold first line\n\n`title`'),
    children: words('Description', 'The message\n\n`children`'),
    toneLabel: words('Screen reader word', 'Read before the message, like "Error". Defaults to the tone name\n\n`toneLabel`'),
    ...pageArgTypes(),
    className: hidden,
  },
  parameters: { componentPage: calloutPage },
};
export default meta;
type Story = StoryObj<typeof Callout>;

/** Callout's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every setting, in the Controls tab. */
export const Playground: Story = { tags: ['!dev'] };

/** Info, warning, success, error and neutral: the same names as the status colors. Each has its own symbol. */
export const Tones: Story = {
  tags: ['!dev'],
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
  tags: ['!dev'],
  name: 'Without title',
  render: () => (
    <BothThemes>
      <Callout tone="info">Description</Callout>
      <Callout tone="neutral">Description</Callout>
    </BothThemes>
  ),
};
