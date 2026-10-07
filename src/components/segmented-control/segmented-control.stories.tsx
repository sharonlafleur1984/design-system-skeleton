import type { Meta, StoryObj } from '@storybook/react-vite';
import { Segment, SegmentedControl } from './segmented-control';
import { BothThemes } from '../story-helpers';
import { Card } from '../card/card';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/Segmented control',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Pick one of two to five options that change how the same content shows. Built on React Aria\'s ToggleButtonGroup.',
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
type Story = StoryObj<typeof SegmentedControl>;

/** Show the calendar by week or month. */
export const Default: Story = {
  render: () => (
    <BothThemes>
      <SegmentedControl aria-label="Show by" defaultSelectedKeys={['week']}>
        <Segment id="day">Day</Segment>
        <Segment id="week">Week</Segment>
        <Segment id="month">Month</Segment>
      </SegmentedControl>
    </BothThemes>
  ),
};

/** Every state, side by side. */
export const States: Story = {
  render: () => (
    <BothThemes>
      <SegmentedControl aria-label="Segment states" defaultSelectedKeys={['selected']}>
        <Segment id="rest">Rest</Segment>
        <Segment id="hover" data-state="hover">Hover</Segment>
        <Segment id="focus" data-state="focus">Focus</Segment>
        <Segment id="selected">Selected</Segment>
        <Segment id="disabled" isDisabled>Disabled</Segment>
      </SegmentedControl>
    </BothThemes>
  ),
};

/** On a card: the lens drops its own blur, so it is never glass on glass. */
export const OnACard: Story = {
  render: () => (
    <BothThemes>
      <Card>
        <SegmentedControl aria-label="View" defaultSelectedKeys={['list']}>
          <Segment id="list">List</Segment>
          <Segment id="calendar">Calendar</Segment>
        </SegmentedControl>
      </Card>
    </BothThemes>
  ),
};
