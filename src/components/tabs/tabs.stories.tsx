import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from './tabs';
import { BothThemes, StatePictures, choice, hidden, onOff } from '../story-helpers';
import { tabsPage } from './tabs.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    keyboardActivation: 'automatic',
    isDisabled: false,
    // What Try it out shows: three tabs and their panels.
    defaultSelectedKey: '1',
    children: (
      <>
        <TabList aria-label="Label">
          <Tab id="1">Tab 1</Tab>
          <Tab id="2">Tab 2</Tab>
          <Tab id="3">Tab 3</Tab>
        </TabList>
        <TabPanel id="1"><p style={{ margin: 0, color: 'var(--color-ink-secondary)' }}>Tab 1 content</p></TabPanel>
        <TabPanel id="2"><p style={{ margin: 0, color: 'var(--color-ink-secondary)' }}>Tab 2 content</p></TabPanel>
        <TabPanel id="3"><p style={{ margin: 0, color: 'var(--color-ink-secondary)' }}>Tab 3 content</p></TabPanel>
      </>
    ),
    ...pageArgs,
  } as Meta<typeof Tabs>['args'],
  argTypes: {
    keyboardActivation: choice('Arrow keys', 'Automatic shows a panel as soon as its tab gets focus; manual waits for Enter or Space\n\n`keyboardActivation`', ['automatic', 'manual']),
    isDisabled: onOff('Disabled', "Turns every tab off, so none can be chosen\n\n`isDisabled`"),
    ...pageArgTypes({ states: ['rest', 'disabled'] }),
    defaultSelectedKey: hidden,
    children: hidden,
    className: hidden,
  },
  parameters: { componentPage: tabsPage },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

/** Tabs' page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

const panel = { margin: 0, color: 'var(--color-ink-secondary)' };

/** Every setting, in the Controls tab. */
export const Default: Story = {
  tags: ['!dev'],
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
  tags: ['!dev'],
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
