import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleButton, ToggleButtonGroup } from './toggle-button-group';
import { BothThemes, StatePictures, choice, hidden, onOff, words } from '../story-helpers';
import { toggleButtonGroupPage } from './toggle-button-group.page';
import { Card } from '../card/card';

const meta: Meta<typeof ToggleButtonGroup> = {
  title: 'Components/Toggle button group',
  component: ToggleButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    'aria-label': words('Label', 'Names the group for screen readers, like Show by'),
    appearance: choice('Appearance', 'The sliding indicator: solid, or clear glass for artwork', ['solid', 'glass']),
    isDisabled: onOff('Disabled', "Turns every option off, so none can be picked"),
    disallowEmptySelection: hidden,
    material: hidden,
    children: hidden,
    className: hidden,
  },
  parameters: { componentPage: toggleButtonGroupPage },
};
export default meta;
type Story = StoryObj<typeof ToggleButtonGroup>;

/** Every setting, in the Controls tab. */
export const Default: Story = {
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
