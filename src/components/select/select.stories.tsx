import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './select';
import { BothThemes, Row } from '../story-helpers';

const options = [1, 2, 3, 4, 5, 6].map((n) => ({ id: String(n), label: `Option ${n}` }));

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Label', options, placeholder: 'Select an option' },
  parameters: {
    docs: {
      description: {
        component: [
          'Pick one option from a list. Built on React Aria\'s Select.',
          '',
          '**When to use:** five or more options. For two to five, use a toggle button group so every option shows at once.',
          '',
          '**When not to:** to pick several options (use tags) or to go to another page (use links).',
          '',
          '**Do:** give it a visible label. Use `aria-label` only when the label already shows nearby, like in a settings row.',
          '',
          '**Accessibility:** opens with Enter, Space or the arrow keys, and typing jumps to a match. Screen readers hear the label and the current choice.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Playground: Story = {};

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

/** With a visible label above it. */
export const WithLabel: Story = {
  name: 'With label',
  render: () => (
    <BothThemes>
      <Select label="Label" options={options} defaultSelectedKey="1" />
    </BothThemes>
  ),
};
