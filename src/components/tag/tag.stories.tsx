import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, TagGroup } from './tag';
import { BothThemes } from '../story-helpers';
import { Card } from '../card/card';

const meta: Meta<typeof TagGroup> = {
  title: 'Components/Tag',
  component: TagGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Filters, picks and tags in a group. Built on React Aria\'s TagGroup. Called "Chip" in Figma.',
          '',
          '**When to use:** to filter a list ("Unread"), to pick one or more options from a short set, or to show tags someone can remove.',
          '',
          '**When not to:** for an action, use a button. For more than about eight options, use a select.',
          '',
          '**Do:** Keep labels to one or two words. **Don\'t:** Use color to mean something on its own.',
          '',
          '**Accessibility:** one Tab stop for the whole group, arrow keys move between tags, Space or Enter selects, Delete or Backspace removes. Selected tags show a check mark as well as a fill. The group needs a visible label or an aria-label. Remove buttons are 24px, the WCAG minimum.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof TagGroup>;

/** Filters: pick any number. */
export const Filters: Story = {
  render: () => (
    <BothThemes>
      <TagGroup label="Label" selectionMode="multiple" defaultSelectedKeys={['1']}>
        <Tag id="1">Tag 1</Tag>
        <Tag id="2">Tag 2</Tag>
        <Tag id="3">Tag 3</Tag>
        <Tag id="4">Tag 4</Tag>
      </TagGroup>
    </BothThemes>
  ),
};

/** Pick one. */
export const SingleChoice: Story = {
  render: () => (
    <BothThemes>
      <TagGroup label="Label" selectionMode="single" disallowEmptySelection defaultSelectedKeys={['1']}>
        <Tag id="1">Tag 1</Tag>
        <Tag id="2">Tag 2</Tag>
        <Tag id="3">Tag 3</Tag>
      </TagGroup>
    </BothThemes>
  ),
};

function RemovableDemo() {
  const [tags, setTags] = useState(['Tag 1', 'Tag 2', 'Tag 3']);
  return (
    <TagGroup label="Label" onRemove={(keys) => setTags((t) => t.filter((x) => !keys.has(x)))}>
      {tags.map((t) => (
        <Tag key={t} id={t}>
          {t}
        </Tag>
      ))}
    </TagGroup>
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
      <TagGroup aria-label="Tag states" selectionMode="multiple" defaultSelectedKeys={['selected', 'selected-hover']} disabledKeys={['disabled']}>
        <Tag id="rest">Rest</Tag>
        <Tag id="hover" data-state="hover">Hover</Tag>
        <Tag id="focus" data-state="focus">Focus</Tag>
        <Tag id="selected">Selected</Tag>
        <Tag id="selected-hover" data-state="hover">Selected hover</Tag>
        <Tag id="disabled">Disabled</Tag>
      </TagGroup>
    </BothThemes>
  ),
};

/** On a card: tags drop their own blur, so it is never glass on glass. */
export const OnACard: Story = {
  render: () => (
    <BothThemes>
      <Card>
        <TagGroup label="Label" selectionMode="multiple" defaultSelectedKeys={['1']}>
          <Tag id="1">Tag 1</Tag>
          <Tag id="2">Tag 2</Tag>
          <Tag id="3">Tag 3</Tag>
        </TagGroup>
      </Card>
    </BothThemes>
  ),
};
