import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';
import { BothThemes, Row } from '../story-helpers';

const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Add school', variant: 'primary', size: 'medium' },
  parameters: {
    docs: {
      description: {
        component: [
          'Starts an action. From the Figma "Button" set (Style, Size, Destructive, Is Enabled, Show Icon).',
          '',
          '**When to use:** Primary for the one main action on a screen. Secondary for other choices. Tertiary for side trips.',
          '',
          '**When not to:** To go to another page, use a link. Never put two primary buttons side by side.',
          '',
          '**Do:** Start the label with a verb that says what happens ("Add school"). **Don\'t:** Use "Submit" or "Click here".',
          '',
          '**Glass:** in Life Hub, buttons are liquid glass. People who turn on Reduce Transparency or Increase Contrast get solid buttons instead.',
          '',
          '**Accessibility:** A real `<button>`. Focus ring always visible. Destructive buttons say what they remove, so color is never the only signal. Loading sets `aria-busy`.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Styles: Story = {
  render: () => (
    <BothThemes>
      <Row label="Primary">
        <Button>Add school</Button>
        <Button icon={<Plus />}>Add school</Button>
      </Row>
      <Row label="Secondary">
        <Button variant="secondary">Compare</Button>
        <Button variant="secondary" icon={<Plus />}>Compare</Button>
      </Row>
      <Row label="Tertiary">
        <Button variant="tertiary">See all</Button>
        <Button variant="tertiary" icon={<Plus />}>See all</Button>
      </Row>
    </BothThemes>
  ),
};

export const Sizes: Story = {
  render: () => (
    <BothThemes>
      <Row label="Small">
        <Button size="small">Save</Button>
      </Row>
      <Row label="Medium">
        <Button size="medium">Save</Button>
      </Row>
      <Row label="Large">
        <Button size="large">Save</Button>
      </Row>
    </BothThemes>
  ),
};

export const States: Story = {
  render: () => (
    <BothThemes>
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <Row key={variant} label={variant}>
          <Button variant={variant}>Rest</Button>
          <Button variant={variant} data-state="hover">Hover</Button>
          <Button variant={variant} data-state="pressed">Pressed</Button>
          <Button variant={variant} disabled>Disabled</Button>
          <Button variant={variant} loading>Loading</Button>
        </Row>
      ))}
    </BothThemes>
  ),
};

export const Destructive: Story = {
  render: () => (
    <BothThemes>
      <Row label="Destructive">
        <Button destructive>Delete plan</Button>
        <Button destructive variant="secondary">Delete plan</Button>
        <Button destructive variant="tertiary">Delete plan</Button>
      </Row>
    </BothThemes>
  ),
};
