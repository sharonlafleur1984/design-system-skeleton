import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox';
import { BothThemes, Row, StatePictures } from '../story-helpers';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Label' },
  parameters: {
    docs: {
      description: {
        component: [
          'Turns one option on or off, or marks a task done. From the Figma "Checkbox" set (checked, state).',
          '',
          '**When to use:** Lists where people can pick several, and to-do items.',
          '',
          '**When not to:** For a setting that takes effect right away, use a Switch. For one choice from a list, use radio buttons.',
          '',
          '**Accessibility:** Built on React Aria: a real checkbox input inside the label. Works with Space, touch and a screen reader.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <BothThemes>
      <StatePictures>
        <Row label="Unchecked">
          <Checkbox label="Rest" />
          <Checkbox label="Hover" data-state="hover" />
          <Checkbox label="Focus" data-state="focus" />
          <Checkbox label="Disabled" isDisabled />
        </Row>
        <Row label="Checked">
          <Checkbox label="Rest" defaultSelected />
          <Checkbox label="Hover" defaultSelected data-state="hover" />
          <Checkbox label="Focus" defaultSelected data-state="focus" />
          <Checkbox label="Disabled" defaultSelected isDisabled />
        </Row>
      </StatePictures>
    </BothThemes>
  ),
};
