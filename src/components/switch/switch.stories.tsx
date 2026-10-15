import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch';
import { BothThemes, Row, hidden, onOff, setting, words } from '../story-helpers';
import { switchPage } from './switch.page';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Label' },
  argTypes: {
    label: words('Label', 'The words next to the switch. Clicking them toggles it too'),
    isSelected: onOff('On', 'Whether the setting is on'),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be changed"),
    onChange: setting('On change', 'Runs when it is turned on or off', { control: false }),
    checked: hidden,
    defaultChecked: hidden,
    disabled: hidden,
    className: hidden,
  },
  parameters: { componentPage: switchPage },
};
export default meta;
type Story = StoryObj<typeof Switch>;

/** Every setting, in the Controls tab. */
export const Playground: Story = {};

/** Off and on, each also disabled. */
export const States: Story = {
  render: () => (
    <BothThemes>
      <Row label="Off">
        <Switch label="Label" />
        <Switch label="Disabled" isDisabled />
      </Row>
      <Row label="On">
        <Switch label="Label" defaultSelected />
        <Switch label="Disabled" defaultSelected isDisabled />
      </Row>
    </BothThemes>
  ),
};
