import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from './tabs';
import { BothThemes } from '../story-helpers';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Switch between views of the same thing. Built on React Aria\'s Tabs.',
          '',
          '**When to use:** two to six related views on one page, like "Upcoming" and "Paid".',
          '',
          '**When not to:** to change how one list shows ("Week" or "Month"), use a segmented control. To go to another page, use a link.',
          '',
          '**Do:** Keep labels to one or two words. **Don\'t:** Nest tabs inside tabs.',
          '',
          '**Accessibility:** one Tab stop for the list, arrow keys move between tabs, Home and End jump to the ends. The list needs an aria-label. The chosen tab has an underline and bolder text, not just color.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const panel = { margin: 0, color: 'var(--color-ink-secondary)' };

/** Three views of the bills list. */
export const Default: Story = {
  render: () => (
    <BothThemes>
      <Tabs defaultSelectedKey="upcoming">
        <TabList aria-label="Bills">
          <Tab id="upcoming">Upcoming</Tab>
          <Tab id="paid">Paid</Tab>
          <Tab id="all">All bills</Tab>
        </TabList>
        <TabPanel id="upcoming"><p style={panel}>Three bills due this week.</p></TabPanel>
        <TabPanel id="paid"><p style={panel}>Nine bills paid this month.</p></TabPanel>
        <TabPanel id="all"><p style={panel}>Twelve bills in all.</p></TabPanel>
      </Tabs>
    </BothThemes>
  ),
};

/** Every state, side by side. */
export const States: Story = {
  render: () => (
    <BothThemes>
      <Tabs defaultSelectedKey="selected" disabledKeys={['disabled']}>
        <TabList aria-label="Tab states">
          <Tab id="rest">Rest</Tab>
          <Tab id="hover" data-state="hover">Hover</Tab>
          <Tab id="focus" data-state="focus">Focus</Tab>
          <Tab id="selected">Selected</Tab>
          <Tab id="disabled">Disabled</Tab>
        </TabList>
        {['rest', 'hover', 'focus', 'selected', 'disabled'].map((id) => (
          <TabPanel key={id} id={id}><p style={panel}>Panel for {id}.</p></TabPanel>
        ))}
      </Tabs>
    </BothThemes>
  ),
};
