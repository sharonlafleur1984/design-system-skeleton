import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Card } from './card';
import { Button } from '../button/button';
import { BothThemes, Row, StatePictures } from '../story-helpers';
import type { Appearance } from '../material';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Groups related content, or is one big link or button. Same look as Action tile, in every theme: a label, a title and a description in the theme\'s own type styles, on a Solid or Glass surface.',
          '',
          '**Solid and glass:** `appearance="solid"` (the starting look) is the theme\'s card surface with a soft shadow. `appearance="glass"` is clear glass: its edge, highlight and shadow come from the page\'s light, its text takes the color of what it sits on, and on artwork the design system paints (Life Hub\'s marble, Spotlight\'s header) it bends the art at its edges. Opaque, translucent and transparent are gone (Oct 15).',
          '',
          '**Content:** `title` is the card\'s name, in the theme\'s heading style. `label` (a small line above it) and `description` (a short line under it) are optional. Anything else, like buttons, goes inside as children, under the description.',
          '',
          '**Pressable:** give the card `href` to go to a page (React Aria Link) or `onPress` to do something (React Aria Button). Then the whole card is one click target, with the same hover, pressed and focus states as Action tile. Never put a button or link inside a pressable card. A card that only holds content doesn\'t move.',
          '',
          '**When to use:** a group of related content, or a big choice that leads somewhere. **When not to:** to switch between sections of a page, use Action tile; to box a single line of text, use nothing.',
          '',
          '**Do:** let the shadow lift the card; no borders needed. **Don\'t:** nest cards inside cards.',
          '',
          '**Accessibility:** pick the right element with `as` (for example `section` or `article`). A pressable card is a real link or button: screen readers hear its title, label and description, and keyboard focus is a soft glow in the theme\'s focus color. With Reduce transparency or Increase contrast on, Glass turns solid.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, calc(var(--space-10) * 3)), 1fr))', gap: 'var(--space-3)', flex: '1 1 auto' };

type PlaygroundArgs = { appearance: Appearance; pressable: boolean; showLabel: boolean; label: string; title: string; showDescription: boolean; description: string; showButton: boolean };

/** Try it: pick Solid or Glass, make it pressable, and turn each part on or off. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { appearance: 'solid', pressable: false, showLabel: true, label: 'Label', title: 'Title', showDescription: true, description: 'Description', showButton: true },
  argTypes: {
    appearance: { name: 'Appearance', control: 'inline-radio', options: ['solid', 'glass'] },
    pressable: { name: 'Pressable (the whole card is a button)', control: 'boolean' },
    showLabel: { name: 'Label', control: 'boolean' },
    label: { name: 'Label text', if: { arg: 'showLabel' } },
    title: { name: 'Title' },
    showDescription: { name: 'Description', control: 'boolean' },
    description: { name: 'Description text', if: { arg: 'showDescription' } },
    showButton: { name: 'Button inside', control: 'boolean', if: { arg: 'pressable', truthy: false } },
  },
  render: ({ appearance, pressable, showLabel, label, title, showDescription, description, showButton }) => (
    <div style={grid}>
      <Card
        appearance={appearance}
        onPress={pressable ? () => {} : undefined}
        label={showLabel ? label : undefined}
        title={title}
        description={showDescription ? description : undefined}
      >
        {!pressable && showButton && (
          <div>
            <Button size="small" variant="secondary">
              Button
            </Button>
          </div>
        )}
      </Card>
    </div>
  ),
};

/** The two appearances on the theme's own page: Solid (the card surface) and Glass (clear, only its edge light and shadow). Drag the sun to move the light. */
export const SolidAndGlass: Story = {
  name: 'Solid and glass',
  render: () => (
    <BothThemes>
      <div style={grid}>
        <Card appearance="solid" label="Solid" title="Title" description="Description" />
        <Card appearance="glass" label="Glass" title="Title" description="Description" />
      </div>
    </BothThemes>
  ),
};

/** A pressable card's states: rest, hover, pressed, keyboard focus and disabled, in Solid and Glass. */
export const States: Story = {
  render: () => (
    <BothThemes>
      <StatePictures>
        {(['solid', 'glass'] as Appearance[]).map((a) => (
          <Row key={a} label={a === 'glass' ? 'Glass' : 'Solid'}>
            <div style={grid}>
              <Card appearance={a} onPress={() => {}} label="Rest" title="Title" description="Description" />
              <Card appearance={a} onPress={() => {}} data-state="hover" label="Hover" title="Title" description="Description" />
              <Card appearance={a} onPress={() => {}} data-state="pressed" label="Pressed" title="Title" description="Description" />
              <Card appearance={a} onPress={() => {}} data-state="focus" label="Focus" title="Title" description="Description" />
              <Card appearance={a} onPress={() => {}} isDisabled label="Disabled" title="Title" description="Description" />
            </div>
          </Row>
        ))}
      </StatePictures>
    </BothThemes>
  ),
};

/** What a card can hold: the title is the only part most cards need. Label, description and anything else (like buttons) are optional. */
export const Content: Story = {
  render: () => (
    <BothThemes>
      <div style={grid}>
        <Card title="Title only" />
        <Card label="Label" title="Label and title" />
        <Card title="Title and description" description="One short line" />
        <Card label="Label" title="With a button" description="One short line">
          <div>
            <Button size="small" variant="secondary">
              Button
            </Button>
          </div>
        </Card>
      </div>
    </BothThemes>
  ),
};

/** A card that holds only an empty state: what's missing, and the one action that fills it. */
export const EmptyState: Story = {
  render: () => (
    <BothThemes>
      <div style={grid}>
        <Card appearance="glass" title="Nothing here yet" description="Add the first item to see it here.">
          <div>
            <Button size="small" variant="secondary">
              Button
            </Button>
          </div>
        </Card>
        <Card appearance="solid" title="Nothing here yet" description="Add the first item to see it here.">
          <div>
            <Button size="small" variant="secondary">
              Button
            </Button>
          </div>
        </Card>
      </div>
    </BothThemes>
  ),
};
