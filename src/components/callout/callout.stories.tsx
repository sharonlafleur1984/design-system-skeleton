import type { Meta, StoryObj } from '@storybook/react-vite';
import { Callout } from './callout';
import { BothThemes } from '../story-helpers';

const meta: Meta<typeof Callout> = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
  args: { tone: 'info', title: 'FAFSA opens Oct 1', children: 'File early. Some aid is first come, first served.' },
  parameters: {
    docs: {
      description: {
        component: [
          'A short message inside a page. From the Figma "Callout" set (tone, title).',
          '',
          '**Tones:** info (good to know), due (coming up), settled (done), overdue (late), quiet (a side note).',
          '',
          '**When not to:** For errors about a form field, show the message next to the field. For a message that needs a decision, use a dialog.',
          '',
          '**Do:** Lead with the fact, then the next step. **Don\'t:** Stack several callouts; pick the most important.',
          '',
          '**Accessibility:** Each tone has its own symbol and a hidden word ("Overdue:") read before the message, so color is never the only signal.',
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
      <Callout tone="info" title="FAFSA opens Oct 1">File early. Some aid is first come, first served.</Callout>
      <Callout tone="due" title="Due in 5 days">Application fee for State U.</Callout>
      <Callout tone="settled" title="Transcript sent">State U confirmed it arrived.</Callout>
      <Callout tone="overdue" title="2 days late">Recommendation letter request.</Callout>
      <Callout tone="quiet" title="Tip">You can change your list anytime.</Callout>
    </BothThemes>
  ),
};

export const WithoutTitle: Story = {
  render: () => (
    <BothThemes>
      <Callout tone="info">File early. Some aid is first come, first served.</Callout>
      <Callout tone="quiet">You can change your list anytime.</Callout>
    </BothThemes>
  ),
};
