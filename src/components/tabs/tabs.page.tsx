import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Tab, TabList, TabPanel, Tabs } from './tabs';

const panel = { margin: 0, color: 'var(--color-ink-secondary)' };

// Storybook only: what Tabs' Docs page says (the component page template).
export const tabsPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Switches between views of the same thing on one page.',
  status: 'ready',
  builtWith: { reactAria: 'Tabs' },
  useFor: ['Two to six related views on one page, like Overview and Details.'],
  useElse: [
    { job: 'Changing how one list shows, like Week or Month', instead: { name: 'Toggle button group', title: 'Components/Toggle button group' } },
    { job: 'Going to another page', instead: { name: 'Link', title: 'Components/Link' } },
  ],
  do: {
    example: (
      <Tabs defaultSelectedKey="1">
        <TabList aria-label="Label">
          <Tab id="1">Overview</Tab>
          <Tab id="2">Details</Tab>
        </TabList>
        <TabPanel id="1">
          <p style={panel}>Tab 1 content</p>
        </TabPanel>
        <TabPanel id="2">
          <p style={panel}>Tab 2 content</p>
        </TabPanel>
      </Tabs>
    ),
    rules: ['Keep labels to one or two words, and give the list an aria-label.'],
  },
  dont: {
    example: (
      <Tabs defaultSelectedKey="1">
        <TabList aria-label="Label">
          <Tab id="1">Everything you need to know first</Tab>
          <Tab id="2">More details</Tab>
        </TabList>
        <TabPanel id="1">
          <Tabs defaultSelectedKey="a">
            <TabList aria-label="Inner label">
              <Tab id="a">Tab 1</Tab>
              <Tab id="b">Tab 2</Tab>
            </TabList>
            <TabPanel id="a">
              <p style={panel}>Tab 1 content</p>
            </TabPanel>
            <TabPanel id="b">
              <p style={panel}>Tab 2 content</p>
            </TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel id="2">
          <p style={panel}>Tab 2 content</p>
        </TabPanel>
      </Tabs>
    ),
    rules: ['Write long labels, or nest tabs inside tabs.'],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves focus to the chosen tab, then on to its panel.' },
    { keys: ['←', '→'], result: 'Moves to the next or previous tab and shows its panel.' },
    { keys: ['Home', 'End'], result: 'Jumps to the first or last tab.' },
  ],
  screenReader: { pattern: '[Label], tab, selected, [n] of [total]', example: 'Overview, tab, selected, 1 of 2' },
  accessibility: [
    'The tab list is one Tab stop, and it needs an aria-label.',
    'The chosen tab has an underline and bolder text, so color is never the only signal.',
  ],
  imports: ['Tabs', 'TabList', 'Tab', 'TabPanel'],
  tokens: ['--color-accent-base', '--color-ink-[state]', '--color-border-subtle', '--control-height-large', '--motion-switch-duration'],
  related: [
    { name: 'Toggle button group', title: 'Components/Toggle button group' },
    { name: 'Link', title: 'Components/Link' },
  ],
  states: { disabled: { isDisabled: true } },
};
