import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { Button } from '../button/button';
import { Switch } from '../switch/switch';
import { SettingRow, SettingsGroup } from './settings';

// A row whose switch carries the row's label and description, as every setting does.
const Row = () => (
  <SettingRow label="Label" description="Description">
    {({ descriptionId }) => <Switch label={<span className="ds-visually-hidden">Label</span>} aria-describedby={descriptionId} />}
  </SettingRow>
);

// Storybook only: what Settings' Docs page says (the component page template).
export const settingsPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Holds app-wide settings in a full-size dialog, opened from the Settings button at the top right of the header.',
  reactAria: { name: 'Modal', href: 'https://react-aria.adobe.com/Modal' },
  status: 'ready',
  useFor: [
    'Settings for the whole app, in sections down the left. On phones the list comes first and each section opens with a Back button.',
    'Settings that apply right away. Anything the device can tell us, like theme or motion, starts on Match device.',
  ],
  useElse: [
    <>
      A setting for one page only: put a <DocLink href={docsPath('Components/Switch')}>Switch</DocLink> on that page.
    </>,
    <>
      Picking one of a few options inside a setting: use <DocLink href={docsPath('Components/Toggle button group')}>Toggle button group</DocLink>.
    </>,
    <>
      Moving between views of a page: use <DocLink href={docsPath('Components/Tabs')}>Tabs</DocLink>.
    </>,
  ],
  do: {
    example: (
      <SettingsGroup>
        <Row />
      </SettingsGroup>
    ),
    text: 'Each change applies the moment it is made, and the control is named by its row label.',
  },
  dont: {
    example: (
      <SettingsGroup>
        <Row />
        <Button>Save changes</Button>
      </SettingsGroup>
    ),
    text: 'A Save button, or a close that asks to discard changes.',
  },
  keys: [
    { keys: ['Tab'], does: 'Moves between the sections, the settings and Close. Focus stays inside' },
    { keys: ['Arrow Up', 'Arrow Down'], does: 'Moves to the previous or next section and shows it' },
    { keys: ['Home', 'End'], does: 'Moves to the first or last section' },
    { keys: ['Escape'], does: 'Closes it, and focus goes back to the Settings button' },
  ],
  screenReader: { pattern: '[Title], dialog', example: 'Settings, dialog' },
  accessibility: [
    "Every control is named by its row label. Pass SettingRow a function to get the description's id for aria-describedby.",
    'If the device asks for reduced motion, motion stays reduced whatever is picked here.',
  ],
  imports: ['SettingsDialog', 'SettingsGroup', 'SettingRow'],
  tokens: ['--color-surface-scrim', '--radius-panel', '--settings-nav-width', '--color-accent-surface', '--color-accent-base', '--motion-open-duration'],
  related: [
    { name: 'Page shell', href: docsPath('Components/Page shell') },
    { name: 'Switch', href: docsPath('Components/Switch') },
    { name: 'Toggle button group', href: docsPath('Components/Toggle button group') },
  ],
};
