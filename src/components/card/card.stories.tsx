import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Card } from './card';
import { Button } from '../button/button';
import { BothThemes, StatePictures } from '../story-helpers';

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
          '**Glass:** each theme decides. Life Hub cards are glass, lit by one sun in the header (top right); After Graduation cards are solid. Buttons inside a card get no blur of their own, so it is never glass on glass.',
          '',
          '**Glass material (the lens): empty cards only.** A card that holds just an empty state can be `material="glass"`: it has nothing to read yet, so it can play with the light like a control. Once it has content, set it back to `default`, so what people read sits on a steady surface. See the Empty state story.',
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
      Card description.
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
      <StatePictures>
        <Card variant="opaque" interactive><Content title="Rest" /></Card>
        <Card variant="opaque" interactive data-state="hover"><Content title="Hover" /></Card>
      </StatePictures>
    </BothThemes>
  ),
};

export const WithControls: Story = {
  render: () => (
    <BothThemes>
      <Card variant="translucent">
        <Content title="Card title" />
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button size="small">Button</Button>
          <Button size="small" variant="secondary">Button</Button>
        </div>
      </Card>
    </BothThemes>
  ),
};

/** The two cards side by side. The theme panel lights the glass from its own background and the sun. */
function Lit({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>{children}</div>;
}

/** Glass while the card is empty; the default material once it has content. */
export const EmptyState: Story = {
  render: () => (
    <BothThemes>
      <Lit>
        <Card material="glass" style={{ alignItems: 'center', textAlign: 'center' }}>
          <Content title="Empty state" />
          <Button size="small" variant="secondary">Button</Button>
        </Card>
        <Card>
          <Content title="Card title" />
          <Button size="small" variant="secondary">Button</Button>
        </Card>
      </Lit>
    </BothThemes>
  ),
};
