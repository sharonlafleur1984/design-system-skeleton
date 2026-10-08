import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import type { Key } from 'react-aria-components';
import { ActionTile, ActionTileGroup, ActionTilePanel, ActionTileSwitch } from '../action-tile/action-tile';
import { Button } from '../button/button';
import { PageShell } from '../page-shell/page-shell';
import { usePreferences, type Preferences } from '../preferences/preferences';
import { Segment, SegmentedControl } from '../segmented-control/segmented-control';
import { Select } from '../select/select';
import { Switch } from '../switch/switch';
import { SettingRow, SettingsDialog, SettingsGroup, type SettingsSectionDef } from './settings';

const meta: Meta<typeof SettingsDialog> = {
  title: 'Patterns/Settings',
  component: SettingsDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'A full-size dialog for app-wide settings, modeled on Claude\'s. It opens from the Settings button at the top right of the header. Sections run down the left; on phones the list comes first and each section opens with a Back button.',
          '',
          '**Saving:** every change applies right away. No Save button, and closing never asks to discard.',
          '',
          '**Match device:** anything the device can tell us (theme, contrast, transparency, motion) defaults to Match device. If the device asks for reduced motion, motion stays reduced whatever is picked here.',
          '',
          '**Working settings:** Appearance and Accessibility really change the page (try them). The other sections show the planned settings; their data comes from the app.',
          '',
          '**Accessibility:** focus stays inside the dialog, Escape closes it, and focus returns to the Settings button. Every control is named by its row label.',
          '',
          '**Where it goes:** render it once, near the top of the app and outside any tabs or action tile switch (those build a hidden copy of their contents, which would open two dialogs).',
          '',
          '**Why these settings:** see Settings research in the After Graduation wiki: sections, defaults and the research behind each accessibility setting, including why text spacing comes before any dyslexia font.',
        ].join('\n'),
      },
    },
  },
  decorators: [(Story) => <div data-theme="after-graduation"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof SettingsDialog>;

// Three-way choices, with the label naming the row for screen readers.
function Choice<T extends string | number>({
  label,
  describedBy,
  value,
  options,
  onChange,
}: {
  label: string;
  describedBy?: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <SegmentedControl
      aria-label={label}
      aria-describedby={describedBy}
      selectedKeys={new Set([String(value)])}
      onSelectionChange={(keys) => {
        const k = [...keys][0];
        const match = options.find(([v]) => String(v) === String(k));
        if (match) onChange(match[0]);
      }}
    >
      {options.map(([v, text]) => (
        <Segment key={String(v)} id={String(v)}>
          {text}
        </Segment>
      ))}
    </SegmentedControl>
  );
}

function Toggle({ label, describedBy, checked, onChange }: { label: string; describedBy?: string; checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <Switch
      label={<span className="ds-visually-hidden">{label}</span>}
      aria-describedby={describedBy}
      checked={checked}
      onChange={onChange}
    />
  );
}

const years = ['Middle school', 'Freshman year', 'Sophomore year', 'Junior year', 'Senior year', 'In college or trade school'].map((l, i) => ({ id: String(i), label: l }));
const gradYears = [2027, 2028, 2029, 2030, 2031, 2032, 2033].map((y) => ({ id: String(y), label: String(y) }));
const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].map((s) => ({ id: s, label: s }));

const Plain = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--color-ink-secondary)' }}>{children}</span>;

/** After Graduation's settings, filled in with everything planned so far. Edit freely. */
function useAfterGraduationSections(): SettingsSectionDef[] {
  const { prefs, set } = usePreferences();
  const p = <K extends keyof Preferences>(k: K) => (v: Preferences[K]) => set(k, v);
  const [accommodations, setAccommodations] = useState(false);
  const [texts, setTexts] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [emails, setEmails] = useState(true);

  return [
    {
      id: 'account',
      label: 'Account',
      content: (
        <SettingsGroup>
          <SettingRow label="Name" description="Alex Rivera">
            <Button variant="secondary" size="small">Edit</Button>
          </SettingRow>
          <SettingRow label="Email" description="alex@example.com">
            <Button variant="secondary" size="small">Edit</Button>
          </SettingRow>
          <SettingRow label="Sign in with" description="Google">
            <Button variant="secondary" size="small">Change</Button>
          </SettingRow>
        </SettingsGroup>
      ),
    },
    {
      id: 'appearance',
      label: 'Appearance',
      content: (
        <SettingsGroup>
          <SettingRow label="Theme" description="Match device follows your phone or computer's light or dark setting.">
            {({ descriptionId }) => (
              <Choice label="Theme" describedBy={descriptionId} value={prefs.theme} onChange={p('theme')} options={[['system', 'Match device'], ['light', 'Light'], ['dark', 'Dark']]} />
            )}
          </SettingRow>
        </SettingsGroup>
      ),
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      content: (
        <>
          <SettingsGroup title="Seeing">
            <SettingRow label="Text size" description="Makes all text bigger. Your browser's text size still applies on top." stacked>
              {({ descriptionId }) => (
                <Choice label="Text size" describedBy={descriptionId} value={prefs.textSize} onChange={p('textSize')} options={[[100, '100%'], [125, '125%'], [150, '150%'], [200, '200%']]} />
              )}
            </SettingRow>
            <SettingRow label="Increase contrast" description="Stronger edges, and solid backgrounds instead of glass." stacked>
              {({ descriptionId }) => (
                <Choice label="Increase contrast" describedBy={descriptionId} value={prefs.contrast} onChange={p('contrast')} options={[['system', 'Match device'], ['more', 'On'], ['standard', 'Off']]} />
              )}
            </SettingRow>
            <SettingRow label="Reduce transparency" description="Solid backgrounds instead of see-through glass." stacked>
              {({ descriptionId }) => (
                <Choice label="Reduce transparency" describedBy={descriptionId} value={prefs.transparency} onChange={p('transparency')} options={[['system', 'Match device'], ['reduce', 'On'], ['standard', 'Off']]} />
              )}
            </SettingRow>
            <SettingRow label="Underline links" description="So links don't rely on color alone.">
              {({ descriptionId }) => <Toggle label="Underline links" describedBy={descriptionId} checked={prefs.underlineLinks} onChange={p('underlineLinks')} />}
            </SettingRow>
          </SettingsGroup>
          <SettingsGroup title="Motion">
            <SettingRow label="Reduce motion" description="Things fade instead of moving, and the header wheel stays still. If your device asks for less motion, it stays on." stacked>
              {({ descriptionId }) => (
                <Choice label="Reduce motion" describedBy={descriptionId} value={prefs.motion} onChange={p('motion')} options={[['system', 'Match device'], ['reduce', 'On']]} />
              )}
            </SettingRow>
            <SettingRow label="Celebrations" description="Lively animations when you finish a step or a page opens. Off keeps everything calm." stacked>
              {({ descriptionId }) => (
                <Choice label="Celebrations" describedBy={descriptionId} value={prefs.celebrations} onChange={p('celebrations')} options={[['system', 'Match device'], ['on', 'On'], ['off', 'Off']]} />
              )}
            </SettingRow>
          </SettingsGroup>
          <SettingsGroup title="Reading">
            <SettingRow label="Text spacing" description="More space between letters and words. Research shows this helps many readers with dyslexia." stacked>
              {({ descriptionId }) => (
                <Choice label="Text spacing" describedBy={descriptionId} value={prefs.textSpacing} onChange={p('textSpacing')} options={[['normal', 'Normal'], ['wide', 'Wide'], ['extra', 'Extra wide']]} />
              )}
            </SettingRow>
          </SettingsGroup>
        </>
      ),
    },
    {
      id: 'plan',
      label: 'Plan',
      content: (
        <>
          <SettingsGroup>
            <SettingRow label="Current school year" description="Opens the planner on the right season.">
              <Select aria-label="Current school year" options={years} defaultSelectedKey="3" />
            </SettingRow>
            <SettingRow label="Graduation year">
              <Select aria-label="Graduation year" options={gradYears} defaultSelectedKey="2028" />
            </SettingRow>
            <SettingRow label="Home state" description="Sets state aid deadlines.">
              <Select aria-label="Home state" options={states} defaultSelectedKey="Utah" />
            </SettingRow>
            <SettingRow label="Paths" stacked>
              <Choice label="Paths" value="both" onChange={() => {}} options={[['college', 'College'], ['trade', 'Trade school'], ['both', 'Both']]} />
            </SettingRow>
            <SettingRow label="School search" stacked>
              <Choice label="School search" value="open" onChange={() => {}} options={[['state', 'Only my state'], ['open', 'Open to other states']]} />
            </SettingRow>
          </SettingsGroup>
          <SettingsGroup title="Accommodations">
            <SettingRow label="Accommodations" description="Plan with an IEP or 504 plan in mind.">
              {({ descriptionId }) => <Toggle label="Accommodations" describedBy={descriptionId} checked={accommodations} onChange={setAccommodations} />}
            </SettingRow>
            {accommodations && (
              <SettingRow label="Who sees Accommodations" description="Never shared outside this plan." stacked>
                {({ descriptionId }) => (
                  <Choice label="Who sees Accommodations" describedBy={descriptionId} value="me" onChange={() => {}} options={[['me', 'Only me'], ['plan', 'Everyone on this plan']]} />
                )}
              </SettingRow>
            )}
          </SettingsGroup>
        </>
      ),
    },
    {
      id: 'family',
      label: 'Family',
      content: (
        <>
          <SettingsGroup title="People on this plan">
            <SettingRow label="Alex Rivera" description="Student · You">
              <Plain>Owner</Plain>
            </SettingRow>
            <SettingRow label="Jordan Rivera" description="Parent or guardian · Invite sent">
              <Button variant="secondary" size="small">Resend</Button>
              <Button variant="tertiary" size="small">Remove</Button>
            </SettingRow>
            <SettingRow label="Invite someone" description="A parent, guardian or student. Removing someone never deletes their account.">
              <Button variant="primary" size="small">Invite</Button>
            </SettingRow>
          </SettingsGroup>
          <SettingsGroup title="Access">
            <SettingRow label="Parents can" description="Suggest lets parents add ideas for the student to accept." stacked>
              {({ descriptionId }) => (
                <Choice label="Parents can" describedBy={descriptionId} value="suggest" onChange={() => {}} options={[['suggest', 'Suggest'], ['edit', 'Edit']]} />
              )}
            </SettingRow>
          </SettingsGroup>
        </>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <>
          <SettingsGroup title="Email">
            <SettingRow label="Email reminders" description="Deadlines and next steps.">
              {({ descriptionId }) => <Toggle label="Email reminders" describedBy={descriptionId} checked={emails} onChange={setEmails} />}
            </SettingRow>
            <SettingRow label="Email summary">
              <Select aria-label="Email summary" options={[{ id: 'now', label: 'As it happens' }, { id: 'daily', label: 'Daily' }, { id: 'weekly', label: 'Weekly' }]} defaultSelectedKey="weekly" />
            </SettingRow>
          </SettingsGroup>
          <SettingsGroup title="Texts">
            <SettingRow label="Text reminders" description="You'll add a phone number and agree to texts first. Reply STOP anytime.">
              {({ descriptionId }) => <Toggle label="Text reminders" describedBy={descriptionId} checked={texts} onChange={setTexts} />}
            </SettingRow>
          </SettingsGroup>
          <SettingsGroup title="Timing">
            <SettingRow label="Remind me">
              <Select aria-label="Remind me" options={[{ id: '1d', label: '1 day before' }, { id: '1w', label: '1 week before' }, { id: '2w', label: '2 weeks before' }]} defaultSelectedKey="1w" />
            </SettingRow>
            <SettingRow label="Quiet hours" description="No reminders at night or during school.">
              {({ descriptionId }) => <Toggle label="Quiet hours" describedBy={descriptionId} checked={quiet} onChange={setQuiet} />}
            </SettingRow>
          </SettingsGroup>
          <SettingsGroup title="Calendar">
            <SettingRow label="Calendar feed" description="Add deadlines to Google or Apple Calendar. Anyone with the link can see them, so reset it if it's shared by mistake.">
              <Button variant="secondary" size="small">Copy link</Button>
              <Button variant="tertiary" size="small">Reset</Button>
            </SettingRow>
          </SettingsGroup>
        </>
      ),
    },
    {
      id: 'privacy',
      label: 'Privacy and data',
      content: (
        <SettingsGroup>
          <SettingRow label="Download my data" description="A copy of your plan and settings.">
            <Button variant="secondary" size="small">Download</Button>
          </SettingRow>
          <SettingRow label="Consent records" description="Who agreed to texts and sharing, and when.">
            <Button variant="secondary" size="small">View</Button>
          </SettingRow>
          <SettingRow label="Delete account" description="Removes your plan for good. People on your plan keep their own accounts.">
            <Button variant="secondary" size="small" destructive>Delete account</Button>
          </SettingRow>
        </SettingsGroup>
      ),
    },
    {
      id: 'help',
      label: 'Help and legal',
      content: (
        <SettingsGroup>
          <SettingRow label="Help and contact">
            <Button variant="tertiary" size="small">Get help</Button>
          </SettingRow>
          <SettingRow label="Privacy policy">
            <Button variant="tertiary" size="small">Read</Button>
          </SettingRow>
          <SettingRow label="Data retention policy">
            <Button variant="tertiary" size="small">Read</Button>
          </SettingRow>
          <SettingRow label="Terms of use">
            <Button variant="tertiary" size="small">Read</Button>
          </SettingRow>
          <SettingRow label="Version">
            <Plain>0.1.0</Plain>
          </SettingRow>
        </SettingsGroup>
      ),
    },
  ];
}

const episodes = [
  { id: 'explore', label: 'Episode 1', title: 'Explore Schools' },
  { id: 'pay', label: 'Episode 2', title: 'Financial Planning' },
  { id: 'dates', label: 'Episode 3', title: 'Important Dates' },
];

function Demo({ startOpen = false, startSection }: { startOpen?: boolean; startSection?: Key }) {
  const [open, setOpen] = useState(startOpen);
  const sections = useAfterGraduationSections();
  return (
    <>
    <ActionTileSwitch defaultSelectedKey="explore">
      <PageShell
        title="After Graduation"
        subtitle="Alex, get ready for Season 2"
        actions={
          <Button variant="secondary" size="small" onPress={() => setOpen(true)}>
            Settings
          </Button>
        }
        navigation={
          <ActionTileGroup aria-label="Episodes" behavior="switch">
            {episodes.map((e) => (
              <ActionTile key={e.id} id={e.id} label={e.label} title={e.title} />
            ))}
          </ActionTileGroup>
        }
      >
        {episodes.map((e) => (
          <ActionTilePanel key={e.id} id={e.id}>
            <p style={{ margin: 0 }}>{e.title} goes here.</p>
          </ActionTilePanel>
        ))}
      </PageShell>
    </ActionTileSwitch>
    {/* Outside the episode switch: React Aria collections render their children twice to build the list. */}
    <SettingsDialog isOpen={open} onOpenChange={setOpen} sections={sections} section={startSection} />
    </>
  );
}

/** The page with the Settings button at the top right. Press it to open Settings. */
export const FromTheHeader: Story = {
  render: () => <Demo />,
};

/** Settings open on Accessibility. Every setting here changes the page right away. */
export const Accessibility: Story = {
  render: () => <Demo startOpen startSection="accessibility" />,
};

/** Settings open on Plan. */
export const Plan: Story = {
  render: () => <Demo startOpen startSection="plan" />,
};
