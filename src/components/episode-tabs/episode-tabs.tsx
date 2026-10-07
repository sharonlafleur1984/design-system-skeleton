import type { ReactNode } from 'react';
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  Tabs as AriaTabs,
  type TabListProps as AriaTabListProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components';
import '../material.css';
import './episode-tabs.css';

// Episode tabs: the big switch between After Graduation's episodes, sitting on the header art.
// Built on React Aria's Tabs, so arrow keys, Home and End work and each tab is linked to its panel.
// The tab list lives in the header and the panels on the sheet, so EpisodeTabs wraps the whole
// PageShell; use the Tabs component's TabPanel for each episode's page.
// Simple version: clear glass with a rim, and frosted white with a star for the chosen episode.
// The bending light and star glow from the Oct 4 glass decision come later.

export interface EpisodeTabsProps extends Omit<AriaTabsProps, 'className' | 'style'> {
  children: ReactNode;
}
export function EpisodeTabs({ children, ...rest }: EpisodeTabsProps) {
  return (
    <AriaTabs {...rest} className="ds-episodes">
      {children}
    </AriaTabs>
  );
}

export interface EpisodeTabListProps<T extends object> extends Omit<AriaTabListProps<T>, 'className' | 'style'> {
  /** Names the list for screen readers, like "Episodes". */
  'aria-label': string;
}
export function EpisodeTabList<T extends object>(props: EpisodeTabListProps<T>) {
  return (
    <div className="ds-episodes__frame">
      <AriaTabList {...props} className="ds-episodes__list" />
    </div>
  );
}

export interface EpisodeTabProps extends Omit<AriaTabProps, 'className' | 'style' | 'children'> {
  /** Small line above the title, like "Episode 1". */
  label: ReactNode;
  /** The episode's name, like "Explore Schools". */
  title: ReactNode;
  /** One short line about what happens there. */
  description?: ReactNode;
  /** Storybook only: forces a look ("hover" or "focus") for the state gallery. */
  'data-state'?: 'hover' | 'focus';
}
export function EpisodeTab({ label, title, description, ...rest }: EpisodeTabProps) {
  return (
    <AriaTab {...rest} className="ds-episode">
      <span className="ds-episode__label">{label}</span>
      <span className="ds-episode__title">{title}</span>
      {description && <span className="ds-episode__description">{description}</span>}
      <span className="ds-episode__star" aria-hidden="true">
        ✦
      </span>
    </AriaTab>
  );
}
