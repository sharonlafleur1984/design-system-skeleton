import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './select';
import { BothThemes, Row, hidden, onOff, setting, words } from '../story-helpers';
import { selectPage } from './select.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const options = [1, 2, 3, 4, 5, 6].map((n) => ({ id: String(n), label: `Option ${n}` }));

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: { label: 'Label', options, placeholder: 'Select an option', isDisabled: false, ...pageArgs } as Meta<typeof Select>['args'],
  argTypes: {
    label: words('Label', 'The words above it\n\n`label`'),
    'aria-label': words('Hidden label', 'Names it for screen readers when there is no visible label\n\n`aria-label`'),
    placeholder: words('Placeholder', 'Shown before anything is picked\n\n`placeholder`'),
    options: setting('Options', 'The list to pick from, each with an id and a label\n\n`options`'),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be opened\n\n`isDisabled`"),
    ...pageArgTypes({ states: ['rest', 'disabled'] }),
    className: hidden,
  },
  parameters: { componentPage: selectPage },
};
export default meta;
type Story = StoryObj<typeof Select>;

/** Select's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every setting, in the Controls tab. */
export const Playground: Story = { tags: ['!dev'] };

/** Before anything is picked, with a choice, and turned off. */
export const States: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <Row label="Placeholder">
        <Select aria-label="Placeholder" options={options} placeholder="Select an option" />
      </Row>
      <Row label="Chosen">
        <Select aria-label="Chosen" options={options} defaultSelectedKey="2" />
      </Row>
      <Row label="Disabled">
        <Select aria-label="Disabled" options={options} defaultSelectedKey="2" isDisabled />
      </Row>
    </BothThemes>
  ),
};

/** With a visible label above it: the usual way to use it. */
export const WithLabel: Story = {
  tags: ['!dev'],
  name: 'With label',
  render: () => (
    <BothThemes>
      <Select label="Label" options={options} defaultSelectedKey="1" />
    </BothThemes>
  ),
};
