import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleButton, ToggleButtonGroup } from './toggle-button-group';
import { BothThemes, StatePictures } from '../story-helpers';
import { Card } from '../card/card';

const meta: Meta<typeof ToggleButtonGroup> = {
  title: 'Components/Toggle button group',
  component: ToggleButtonGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Pick one of two to five options that change how the same content shows. Built on React Aria\'s ToggleButtonGroup. Called "Segmented control" in Figma.',
          '',
          '**When to use:** "Week" or "Month", "List" or "Calendar".',
          '',
          '**When not to:** to switch between different content, use tabs. For more than five options, use a select.',
          '',
          '**Do:** Keep labels short and about the same length. **Don\'t:** Use it for an action.',
          '',
          '**Accessibility:** needs an aria-label. Arrow keys move between options and screen readers hear which one is chosen. The chosen option sits under a glass lens with bolder text, not just color.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ToggleButtonGroup>;

/** Pick one option; the content changes to match. */
export const Default: Story = {
  render: () => (
    <BothThemes>
      <ToggleButtonGroup aria-label="Label" defaultSelectedKeys={['1']}>
        <ToggleButton id="1">Option 1</ToggleButton>
        <ToggleButton id="2">Option 2</ToggleButton>
        <ToggleButton id="3">Option 3</ToggleButton>
      </ToggleButtonGroup>
    </BothThemes>
  ),
};

/** Every state, side by side. */
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
