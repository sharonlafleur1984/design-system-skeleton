import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch';
import { BothThemes, Row } from '../story-helpers';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Email reminders' },
  parameters: {
    docs: {
      description: {
        component: [
          'Turns a setting on or off right away. From the Figma "Switch" set (checked).',
          '',
          '**When to use:** Settings that apply the moment they change, like reminders.',
          '',
          '**When not to:** In a form that is saved later, or for a to-do. Use a Checkbox.',
          '',
          '**Accessibility:** Built on React Aria: a real input with `role="switch"`, toggled by Space, named by its visible label.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <BothThemes>
      <Row label="Off">
        <Switch label="Email reminders" />
        <Switch label="Disabled" disabled />
      </Row>
      <Row label="On">
        <Switch label="Email reminders" defaultChecked />
        <Switch label="Disabled" defaultChecked disabled />
      </Row>
    </BothThemes>
  ),
};
