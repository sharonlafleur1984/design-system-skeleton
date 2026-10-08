import { useEffect, useId, useState, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  type Key,
} from 'react-aria-components';
import { Button } from '../button/button';
import '../shared.css';
import './settings.css';

// Settings: a full-size dialog for app-wide settings, like Claude's. Sections run down the left on
// tablet and desktop; on phones the section list comes first and each section opens with a Back button.
// Changes apply the moment they're made, so there's no Save button and closing never asks to discard.
// Built on React Aria's Modal and Dialog: focus stays inside, Escape closes it, and focus goes back to
// the button that opened it. Sections are React Aria Tabs (vertical), so arrow keys move between them.

export interface SettingsSectionDef {
  id: Key;
  label: string;
  /** The section's content: SettingsGroup and SettingRow. */
  content: ReactNode;
}

export interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sections: SettingsSectionDef[];
  /** Open on this section, for deep links like /settings/notifications. */
  section?: Key;
  onSectionChange?: (id: Key) => void;
  title?: string;
}

const PHONE = '(max-width: 37.4375rem)'; // phones (compact), as in settings.css
function usePhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(PHONE).matches);
  useEffect(() => {
    const m = window.matchMedia(PHONE);
    const on = () => setPhone(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return phone;
}

export function SettingsDialog({ isOpen, onOpenChange, sections, section, onSectionChange, title = 'Settings' }: SettingsDialogProps) {
  const phone = usePhone();
  const [selected, setSelected] = useState<Key>(section ?? sections[0]?.id);
  const [showList, setShowList] = useState(true);
  useEffect(() => {
    if (section !== undefined) setSelected(section);
  }, [section]);
  const current = sections.find((s) => s.id === selected) ?? sections[0];
  const panelId = useId();
  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className="ds-settings-overlay">
      <Modal className="ds-settings-modal">
        <Dialog className="ds-settings" aria-label={phone && !showList ? `${title}: ${current?.label}` : undefined}>
          {({ close }) => (
            <>
              <header className="ds-settings__bar">
                {phone && !showList ? (
                  <AriaButton className="ds-settings__back" onPress={() => setShowList(true)}>
                    <span className="ds-settings__back-arrow" aria-hidden="true" />
                    {title}
                  </AriaButton>
                ) : (
                  <Heading slot="title" className="ds-settings__title">
                    {title}
                  </Heading>
                )}
                <Button variant="tertiary" size="small" onPress={close}>
                  Close
                </Button>
              </header>
              {phone ? (
                showList ? (
                  // Phones: the section list first. Each opens its section with a Back button.
                  <nav aria-label={`${title} sections`} className="ds-settings__body ds-settings__body--list">
                    <ul className="ds-settings__nav" role="list">
                      {sections.map((s) => (
                        <li key={String(s.id)}>
                          <AriaButton
                            className="ds-settings__nav-item"
                            onPress={() => {
                              setSelected(s.id);
                              onSectionChange?.(s.id);
                              setShowList(false);
                            }}
                          >
                            {s.label}
                            <span className="ds-settings__nav-arrow" aria-hidden="true" />
                          </AriaButton>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : (
                  <div className="ds-settings__body ds-settings__body--section">
                    <section className="ds-settings__panel" aria-labelledby={`${panelId}-title`}>
                      <h3 id={`${panelId}-title`} className="ds-settings__section-title">
                        {current?.label}
                      </h3>
                      {current?.content}
                    </section>
                  </div>
                )
              ) : (
                // Tablet and desktop: sections down the left, as vertical tabs.
                <Tabs
                  orientation="vertical"
                  selectedKey={selected}
                  onSelectionChange={(k) => {
                    setSelected(k);
                    onSectionChange?.(k);
                  }}
                  className="ds-settings__body"
                >
                  <TabList aria-label={`${title} sections`} className="ds-settings__nav">
                    {sections.map((s) => (
                      <Tab key={String(s.id)} id={s.id} className="ds-settings__nav-item">
                        {s.label}
                      </Tab>
                    ))}
                  </TabList>
                  {sections.map((s) => (
                    <TabPanel key={String(s.id)} id={s.id} className="ds-settings__panel">
                      <h3 className="ds-settings__section-title">{s.label}</h3>
                      {s.content}
                    </TabPanel>
                  ))}
                </Tabs>
              )}
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

export interface SettingsGroupProps {
  /** Optional small heading over a group of rows. */
  title?: string;
  children: ReactNode;
}
/** A group of setting rows inside one section, with an optional heading. */
export function SettingsGroup({ title, children }: SettingsGroupProps) {
  const id = useId();
  return (
    <section className="ds-settings-group" aria-labelledby={title ? id : undefined}>
      {title && (
        <h4 id={id} className="ds-settings-group__title">
          {title}
        </h4>
      )}
      <div className="ds-settings-group__rows">{children}</div>
    </section>
  );
}

export interface SettingRowProps {
  /** Short label, naming the on state ("Underline links"). */
  label: string;
  /** One line on what it does, if the label isn't enough. */
  description?: ReactNode;
  /** The control: pass a render function to wire up the label and description ids. */
  children: ReactNode | ((ids: { labelId: string; descriptionId?: string }) => ReactNode);
  /** Put the control under the label instead of beside it, for wide controls. */
  stacked?: boolean;
}
/** One setting: its label and description on the left, its control on the right (stacked on phones). */
export function SettingRow({ label, description, children, stacked = false }: SettingRowProps) {
  const labelId = useId();
  const descriptionId = useId();
  return (
    <div className={`ds-setting${stacked ? ' ds-setting--stacked' : ''}`}>
      <div className="ds-setting__text">
        <span id={labelId} className="ds-setting__label">
          {label}
        </span>
        {description && (
          <span id={descriptionId} className="ds-setting__description">
            {description}
          </span>
        )}
      </div>
      <div className="ds-setting__control">
        {typeof children === 'function' ? children({ labelId, descriptionId: description ? descriptionId : undefined }) : children}
      </div>
    </div>
  );
}
