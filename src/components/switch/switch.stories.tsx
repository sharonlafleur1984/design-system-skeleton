import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch';
import { BothThemes, Row, hidden, onOff, setting, words } from '../story-helpers';
import { switchPage } from './switch.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  args: { label: 'Label', isDisabled: false, ...pageArgs } as Meta<typeof Switch>['args'],
  argTypes: {
    label: words('Label', 'The words next to the switch. Clicking them toggles it too\n\n`label`'),
    isSelected: onOff('On', 'Whether the setting is on\n\n`isSelected`'),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be changed\n\n`isDisabled`"),
    onChange: setting('On change', 'Runs when it is turned on or off\n\n`onChange`', { control: false }),
    ...pageArgTypes({ states: ['rest', 'disabled'] }),
    checked: hidden,
    defaultChecked: hidden,
    disabled: hidden,
    className: hidden,
  },
  parameters: { componentPage: switchPage },
};
export default meta;
type Story = StoryObj<typeof Switch>;

/** Switch's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every setting, in the Controls tab. */
export const Playground: Story = { tags: ['!dev'] };

/** Off and on, each also disabled. */
export const States: Story = {
  tags: ['!dev'],
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
