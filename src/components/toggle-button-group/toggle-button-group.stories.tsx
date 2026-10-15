import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleButton, ToggleButtonGroup } from './toggle-button-group';
import { BothThemes, StatePictures, choice, hidden, onOff, words } from '../story-helpers';
import { toggleButtonGroupPage } from './toggle-button-group.page';
import { Card } from '../card/card';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof ToggleButtonGroup> = {
  title: 'Components/Toggle button group',
  component: ToggleButtonGroup,
  args: {
    'aria-label': 'Label',
    appearance: 'solid',
    isDisabled: false,
    // The options Try it out shows. Stories that write their own options replace these.
    defaultSelectedKeys: ['1'],
    children: (
      <>
        <ToggleButton id="1">Option 1</ToggleButton>
        <ToggleButton id="2">Option 2</ToggleButton>
        <ToggleButton id="3">Option 3</ToggleButton>
      </>
    ),
    ...pageArgs,
  } as Meta<typeof ToggleButtonGroup>['args'],
  argTypes: {
    'aria-label': words('Label', 'Names the group for screen readers, like Show by\n\n`aria-label`'),
    appearance: choice('Style', 'The sliding indicator: solid, or clear glass for artwork\n\n`appearance`', ['solid', 'glass']),
    isDisabled: onOff('Disabled', "Turns every option off, so none can be picked\n\n`isDisabled`"),
    ...pageArgTypes({ states: ['rest', 'disabled'], glass: true }),
    defaultSelectedKeys: hidden,
    disallowEmptySelection: hidden,
    material: hidden,
    children: hidden,
    className: hidden,
  },
  parameters: { componentPage: toggleButtonGroupPage },
};
export default meta;
type Story = StoryObj<typeof ToggleButtonGroup>;

/** Toggle button group's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every setting, in the Controls tab. */
export const Default: Story = {
  tags: ['!dev'],
  render: (args) => (
    <BothThemes>
      <ToggleButtonGroup defaultSelectedKeys={['1']} {...args} aria-label={args['aria-label'] ?? 'Label'}>
        <ToggleButton id="1">Option 1</ToggleButton>
        <ToggleButton id="2">Option 2</ToggleButton>
        <ToggleButton id="3">Option 3</ToggleButton>
      </ToggleButtonGroup>
    </BothThemes>
  ),
};

/** Every state, side by side: rest, hover, focus, selected and disabled. */
export const States: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <StatePictures>
        <ToggleButtonGroup aria-label="ToggleButton states" defaultSelectedKeys={['selected']}>
          <ToggleButton id="rest">Rest</ToggleButton>
          <ToggleButton id="hover" data-state="hover">Hover</ToggleButton>
          <ToggleButton id="focus" data-state="focus">Focus</ToggleButton>
          <ToggleButton id="selected">Selected</ToggleButton>
          <ToggleButton id="disabled" isDisabled>Disabled</ToggleButton>
        </ToggleButtonGroup>
      </StatePictures>
    </BothThemes>
  ),
};

/** On a card: the indicator drops its own blur, so it is never glass on glass. */
export const OnACard: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <Card>
        <ToggleButtonGroup aria-label="Label" defaultSelectedKeys={['1']}>
          <ToggleButton id="1">Option 1</ToggleButton>
          <ToggleButton id="2">Option 2</ToggleButton>
        </ToggleButtonGroup>
      </Card>
    </BothThemes>
  ),
};
