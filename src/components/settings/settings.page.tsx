import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Button } from '../button/button';
import { Switch } from '../switch/switch';
import { SettingRow, SettingsGroup } from './settings';

// A row whose switch carries the row's label and description, as every setting does.
const Row = () => (
  <SettingRow label="Label" description="Description">
    {({ descriptionId }) => <Switch label={<span className="ds-visually-hidden">Label</span>} aria-describedby={descriptionId} />}
  </SettingRow>
);

// Storybook only: what Settings' page says (the component page template).
export const settingsPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Holds app-wide settings in a full-size dialog, opened from the Settings button at the top right of the header.',
  status: 'ready',
  builtWith: { reactAria: 'Modal' },
  onlyIn: ['after-graduation'],
  useFor: [
    'Settings for the whole app, in sections down the left. On phones the list comes first and each section opens with a Back button.',
    'Settings that apply right away. Anything the device can tell us, like theme or motion, starts on Match device.',
  ],
  useElse: [
    { job: 'A setting for one page only', instead: { name: 'Switch', title: 'Components/Switch' } },
    { job: 'Picking one of a few options inside a setting', instead: { name: 'Toggle button group', title: 'Components/Toggle button group' } },
    { job: 'Moving between views of a page', instead: { name: 'Tabs', title: 'Components/Tabs' } },
  ],
  do: {
    example: (
      <SettingsGroup>
        <Row />
      </SettingsGroup>
    ),
    rules: ['Each change applies the moment it is made.', 'The control is named by its row label.'],
  },
  dont: {
    example: (
      <SettingsGroup>
        <Row />
        <Button>Save changes</Button>
      </SettingsGroup>
    ),
    rules: ['A Save button, or a close that asks to discard changes.'],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves between the sections, the settings and Close. Focus stays inside.' },
    { keys: ['Arrow Up', 'Arrow Down'], result: 'Moves to the previous or next section and shows it.' },
    { keys: ['Home', 'End'], result: 'Moves to the first or last section.' },
    { keys: ['Escape'], result: 'Closes it, and focus goes back to the Settings button.' },
  ],
  screenReader: { pattern: '[Title], dialog', example: 'Settings, dialog' },
  accessibility: [
    "Every control is named by its row label. Pass SettingRow a function to get the description's id for aria-describedby.",
    'If the device asks for reduced motion, motion stays reduced whatever is picked here.',
  ],
  imports: ['SettingsDialog', 'SettingsGroup', 'SettingRow'],
  tokens: ['--color-surface-scrim', '--radius-panel', '--settings-nav-width', '--color-accent-surface', '--color-accent-base', '--motion-open-duration'],
  related: [
    { name: 'Page shell', title: 'Components/Page shell' },
    { name: 'Switch', title: 'Components/Switch' },
    { name: 'Toggle button group', title: 'Components/Toggle button group' },
  ],
};
