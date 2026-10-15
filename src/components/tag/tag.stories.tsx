import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, TagGroup } from './tag';
import { BothThemes, StatePictures, choice, hidden, onOff, setting, words } from '../story-helpers';
import { tagPage } from './tag.page';
import { Card } from '../card/card';

const meta: Meta<typeof TagGroup> = {
  title: 'Components/Tag',
  component: TagGroup,
  tags: ['autodocs'],
  argTypes: {
    label: words('Label', 'The name above the group'),
    'aria-label': words('Hidden label', 'Names the group for screen readers when there is no visible label'),
    selectionMode: choice('Picking', 'None, pick one, or pick any number', ['none', 'single', 'multiple']),
    disallowEmptySelection: onOff('Always one picked', "Stops the last selected tag from being cleared"),
    onRemove: setting('When removed', 'Makes tags removable, and gets the ids of the removed tags', { control: false }),
    children: hidden,
    className: hidden,
  },
  parameters: { componentPage: tagPage },
};
export default meta;
type Story = StoryObj<typeof TagGroup>;

/** Filters: pick any number. Every setting, in the Controls tab. */
export const Filters: Story = {
  render: (args) => (
    <BothThemes>
      <TagGroup label="Label" selectionMode="multiple" defaultSelectedKeys={['1']} {...args}>
        <Tag id="1">Tag 1</Tag>
        <Tag id="2">Tag 2</Tag>
        <Tag id="3">Tag 3</Tag>
        <Tag id="4">Tag 4</Tag>
      </TagGroup>
    </BothThemes>
  ),
};

/** Pick one from a short set; one is always picked. */
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

/** Every state, side by side: rest, hover, focus, selected and disabled. */
export const States: Story = {
  render: () => (
    <BothThemes>
      <StatePictures>
        <TagGroup aria-label="Tag states" selectionMode="multiple" defaultSelectedKeys={['selected', 'selected-hover']} disabledKeys={['disabled']}>
          <Tag id="rest">Rest</Tag>
          <Tag id="hover" data-state="hover">Hover</Tag>
          <Tag id="focus" data-state="focus">Focus</Tag>
          <Tag id="selected">Selected</Tag>
          <Tag id="selected-hover" data-state="hover">Selected hover</Tag>
          <Tag id="disabled">Disabled</Tag>
        </TagGroup>
      </StatePictures>
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
