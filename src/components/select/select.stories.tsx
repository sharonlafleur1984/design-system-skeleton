import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './select';
import { BothThemes, Row, hidden, onOff, setting, words } from '../story-helpers';
import { selectPage } from './select.page';

const options = [1, 2, 3, 4, 5, 6].map((n) => ({ id: String(n), label: `Option ${n}` }));

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Label', options, placeholder: 'Select an option' },
  argTypes: {
    label: words('Label', 'The words above it'),
    'aria-label': words('Hidden label', 'Names it for screen readers when there is no visible label'),
    placeholder: words('Placeholder', 'Shown before anything is picked'),
    options: setting('Options', 'The list to pick from, each with an id and a label'),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be opened"),
    className: hidden,
  },
  parameters: { componentPage: selectPage },
};
export default meta;
type Story = StoryObj<typeof Select>;

/** Every setting, in the Controls tab. */
export const Playground: Story = {};

/** Before anything is picked, with a choice, and turned off. */
export const States: Story = {
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
  name: 'With label',
  render: () => (
    <BothThemes>
      <Select label="Label" options={options} defaultSelectedKey="1" />
    </BothThemes>
  ),
};
