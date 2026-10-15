import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox';
import { BothThemes, Row, StatePictures, hidden, onOff, setting, words } from '../story-helpers';
import { checkboxPage } from './checkbox.page';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Label' },
  argTypes: {
    label: words('Label', 'The words next to the box. Clicking them toggles it too'),
    isSelected: onOff('Checked', 'Whether the box is checked'),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be changed"),
    onChange: setting('On change', 'Runs when it is checked or unchecked', { control: false }),
    checked: hidden,
    defaultChecked: hidden,
    disabled: hidden,
    'data-state': hidden,
    className: hidden,
  },
  parameters: { componentPage: checkboxPage },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

/** Every setting, in the Controls tab. */
export const Playground: Story = {};

/** Every state, checked and unchecked: rest, hover, focus and disabled. */
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
