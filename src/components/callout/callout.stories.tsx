import type { Meta, StoryObj } from '@storybook/react-vite';
import { Callout } from './callout';
import { BothThemes } from '../story-helpers';

const meta: Meta<typeof Callout> = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
  args: { tone: 'info', title: 'Title', children: 'Description' },
  parameters: {
    docs: {
      description: {
        component: [
          'A short message inside a page. From the Figma "Callout" set (tone, title).',
          '',
          '**Tones:** info (good to know), warning (needs attention soon), success (done), error (something went wrong or is late), neutral (a side note). The same names as the status colors. The old names (due, settled, overdue, quiet) still work.',
          '',
          '**When not to:** For errors about a form field, show the message next to the field. For a message that needs a decision, use a dialog.',
          '',
          '**Do:** Lead with the fact, then the next step. **Don\'t:** Stack several callouts; pick the most important.',
          '',
          '**Accessibility:** Each tone has its own symbol and a hidden word ("Error:") read before the message, so color is never the only signal.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Callout>;

export const Playground: Story = {};

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

export const WithoutTitle: Story = {
  render: () => (
    <BothThemes>
      <Callout tone="info">Description</Callout>
      <Callout tone="neutral">Description</Callout>
    </BothThemes>
  ),
};
