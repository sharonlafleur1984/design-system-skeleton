import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card';
import { BothThemes } from '../story-helpers';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: { variant: 'translucent', children: 'Card content' },
  parameters: {
    docs: {
      description: {
        component: [
          'Groups related content. From the Figma "Card" set (variant, state).',
          '',
          '**When to use:** Opaque for the main, focused content. Translucent for most cards. Transparent for background context.',
          '',
          '**When not to:** To box a single line of text, or to nest cards inside cards.',
          '',
          '**Do:** Let shadows lift cards; no borders needed. **Don\'t:** Make a card interactive unless the whole card does one thing.',
          '',
          '**Accessibility:** Pick the right element with `as` (for example `section` or `article`). Interactive cards show a focus ring around the link or button inside.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

const Content = ({ title }: { title: string }) => (
  <>
    <strong style={{ fontSize: 'var(--type-heading-subheading-size)' }}>{title}</strong>
    <span style={{ color: 'var(--color-ink-secondary)', fontSize: 'var(--type-body-small-size)' }}>
      Three things due this week.
    </span>
  </>
);

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <BothThemes>
      <Card variant="opaque"><Content title="Opaque" /></Card>
      <Card variant="translucent"><Content title="Translucent" /></Card>
      <Card variant="transparent"><Content title="Transparent" /></Card>
    </BothThemes>
  ),
};

export const States: Story = {
  render: () => (
    <BothThemes>
      <Card variant="opaque" interactive><Content title="Rest" /></Card>
      <Card variant="opaque" interactive data-state="hover"><Content title="Hover" /></Card>
    </BothThemes>
  ),
};
