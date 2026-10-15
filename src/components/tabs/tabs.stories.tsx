import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from './tabs';
import { BothThemes, StatePictures, choice, hidden, onOff } from '../story-helpers';
import { tabsPage } from './tabs.page';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    keyboardActivation: choice('Arrow keys', 'Automatic shows a panel as soon as its tab gets focus; manual waits for Enter or Space', ['automatic', 'manual']),
    isDisabled: onOff('Disabled', "Turns every tab off, so none can be chosen"),
    children: hidden,
    className: hidden,
  },
  parameters: { componentPage: tabsPage },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const panel = { margin: 0, color: 'var(--color-ink-secondary)' };

/** Every setting, in the Controls tab. */
export const Default: Story = {
  render: (args) => (
    <BothThemes>
      <Tabs defaultSelectedKey="1" {...args}>
        <TabList aria-label="Label">
          <Tab id="1">Tab 1</Tab>
          <Tab id="2">Tab 2</Tab>
          <Tab id="3">Tab 3</Tab>
        </TabList>
        <TabPanel id="1"><p style={panel}>Tab 1 content</p></TabPanel>
        <TabPanel id="2"><p style={panel}>Tab 2 content</p></TabPanel>
        <TabPanel id="3"><p style={panel}>Tab 3 content</p></TabPanel>
      </Tabs>
    </BothThemes>
  ),
};

/** Every state, side by side: rest, hover, focus, selected and disabled. */
export const States: Story = {
  render: () => (
    <BothThemes>
      <StatePictures>
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
      </StatePictures>
    </BothThemes>
  ),
};
