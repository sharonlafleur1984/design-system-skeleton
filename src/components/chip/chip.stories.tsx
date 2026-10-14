import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, ChipGroup } from './chip';
import { BothThemes } from '../story-helpers';
import { Card } from '../card/card';

const meta: Meta<typeof ChipGroup> = {
  title: 'Components/Chip',
  component: ChipGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Filters, picks and tags in a group. Built on React Aria\'s TagGroup.',
          '',
          '**When to use:** to filter a list ("Unread"), to pick one or more options from a short set, or to show tags someone can remove.',
          '',
          '**When not to:** for an action, use a button. For more than about eight options, use a select.',
          '',
          '**Do:** Keep labels to one or two words. **Don\'t:** Use color to mean something on its own.',
          '',
          '**Accessibility:** one Tab stop for the whole group, arrow keys move between chips, Space or Enter selects, Delete or Backspace removes. Selected chips show a check mark as well as a fill. The group needs a visible label or an aria-label. Remove buttons are 24px, the WCAG minimum.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ChipGroup>;

/** Filters: pick any number. */
export const Filters: Story = {
  render: () => (
    <BothThemes>
      <ChipGroup label="Label" selectionMode="multiple" defaultSelectedKeys={['1']}>
        <Chip id="1">Chip 1</Chip>
        <Chip id="2">Chip 2</Chip>
        <Chip id="3">Chip 3</Chip>
        <Chip id="4">Chip 4</Chip>
      </ChipGroup>
    </BothThemes>
  ),
};

/** Pick one. */
export const SingleChoice: Story = {
  render: () => (
    <BothThemes>
      <ChipGroup label="Label" selectionMode="single" disallowEmptySelection defaultSelectedKeys={['1']}>
        <Chip id="1">Chip 1</Chip>
        <Chip id="2">Chip 2</Chip>
        <Chip id="3">Chip 3</Chip>
      </ChipGroup>
    </BothThemes>
  ),
};

function RemovableDemo() {
  const [tags, setTags] = useState(['Chip 1', 'Chip 2', 'Chip 3']);
  return (
    <ChipGroup label="Label" onRemove={(keys) => setTags((t) => t.filter((x) => !keys.has(x)))}>
      {tags.map((t) => (
        <Chip key={t} id={t}>
          {t}
        </Chip>
      ))}
    </ChipGroup>
  );
}

/** Tags someone can remove, with the remove button or Delete. */
export const Removable: Story = {
  render: () => (
    <BothThemes>
      <RemovableDemo />
    </BothThemes>
  ),
};

/** Every state, side by side. */
export const States: Story = {
  render: () => (
    <BothThemes>
      <ChipGroup aria-label="Chip states" selectionMode="multiple" defaultSelectedKeys={['selected', 'selected-hover']} disabledKeys={['disabled']}>
        <Chip id="rest">Rest</Chip>
        <Chip id="hover" data-state="hover">Hover</Chip>
        <Chip id="focus" data-state="focus">Focus</Chip>
        <Chip id="selected">Selected</Chip>
        <Chip id="selected-hover" data-state="hover">Selected hover</Chip>
        <Chip id="disabled">Disabled</Chip>
      </ChipGroup>
    </BothThemes>
  ),
};

/** On a card: chips drop their own blur, so it is never glass on glass. */
export const OnACard: Story = {
  render: () => (
    <BothThemes>
      <Card>
        <ChipGroup label="Label" selectionMode="multiple" defaultSelectedKeys={['1']}>
          <Chip id="1">Chip 1</Chip>
          <Chip id="2">Chip 2</Chip>
          <Chip id="3">Chip 3</Chip>
        </ChipGroup>
      </Card>
    </BothThemes>
  ),
};
