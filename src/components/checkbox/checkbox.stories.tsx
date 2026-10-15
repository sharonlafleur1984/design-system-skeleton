import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox';
import { BothThemes, Row, StatePictures, hidden, onOff, setting, words } from '../story-helpers';
import { checkboxPage } from './checkbox.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Label', isDisabled: false, ...pageArgs } as Meta<typeof Checkbox>['args'],
  argTypes: {
    label: words('Label', 'The words next to the box. Clicking them toggles it too\n\n`label`'),
    isSelected: onOff('Checked', 'Whether the box is checked\n\n`isSelected`'),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be changed\n\n`isDisabled`"),
    onChange: setting('On change', 'Runs when it is checked or unchecked\n\n`onChange`', { control: false }),
    ...pageArgTypes({ states: ['rest', 'hover', 'focus', 'disabled'] }),
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

/** Checkbox's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every setting, in the Controls tab. */
export const Playground: Story = { tags: ['!dev'] };

/** Every state, checked and unchecked: rest, hover, focus and disabled. */
export const States: Story = {
  tags: ['!dev'],
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
