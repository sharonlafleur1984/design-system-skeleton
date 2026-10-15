import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, TagGroup } from './tag';
import { BothThemes, StatePictures, choice, hidden, onOff, setting, words } from '../story-helpers';
import { tagPage } from './tag.page';
import { Card } from '../card/card';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof TagGroup> = {
  title: 'Components/Tag',
  component: TagGroup,
  args: {
    label: 'Label',
    selectionMode: 'multiple',
    disallowEmptySelection: false,
    // The tags Try it out shows. Stories that write their own tags replace these.
    children: (
      <>
        <Tag id="1">Tag 1</Tag>
        <Tag id="2">Tag 2</Tag>
        <Tag id="3">Tag 3</Tag>
      </>
    ),
    ...pageArgs,
  } as Meta<typeof TagGroup>['args'],
  argTypes: {
    label: words('Label', 'The name above the group\n\n`label`'),
    'aria-label': words('Hidden label', 'Names the group for screen readers when there is no visible label\n\n`aria-label`'),
    selectionMode: choice('Picking', 'None, pick one, or pick any number\n\n`selectionMode`', ['none', 'single', 'multiple']),
    disallowEmptySelection: onOff('Always one picked', "Stops the last selected tag from being cleared\n\n`disallowEmptySelection`"),
    onRemove: setting('When removed', 'Makes tags removable, and gets the ids of the removed tags\n\n`onRemove`', { control: false }),
    ...pageArgTypes(),
    children: hidden,
    className: hidden,
  },
  parameters: { componentPage: tagPage },
};
export default meta;
type Story = StoryObj<typeof TagGroup>;

/** Tag's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Filters: pick any number. Every setting, in the Controls tab. */
export const Filters: Story = {
  tags: ['!dev'],
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
  tags: ['!dev'],
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
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <RemovableDemo />
    </BothThemes>
  ),
};

/** Every state, side by side: rest, hover, focus, selected and disabled. */
export const States: Story = {
  tags: ['!dev'],
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
  tags: ['!dev'],
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
