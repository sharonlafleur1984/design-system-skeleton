import type { ReactNode } from 'react';
import {
  SelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components';
import './tabs.css';

// Tabs: switch between views of the same thing ("Upcoming", "Paid"). Built on React Aria's Tabs, which
// handles arrow keys, Home and End, and links each tab to its panel. This file only adds the look.
// Tabs sit on the page, not on glass: a line under the chosen tab slides to it, and the chosen tab's
// text turns primary and medium weight, so color is never the only signal.

function cx(base: string, extra?: string) {
  return extra ? `${base} ${extra}` : base;
}

export interface TabsProps extends Omit<AriaTabsProps, 'className' | 'style'> {
  className?: string;
}
export function Tabs({ className, ...rest }: TabsProps) {
  return <AriaTabs {...rest} className={cx('ds-tabs', className)} />;
}

export interface TabListProps<T extends object> extends Omit<AriaTabListProps<T>, 'className' | 'style'> {
  className?: string;
}
export function TabList<T extends object>({ className, ...rest }: TabListProps<T>) {
  return <AriaTabList {...rest} className={cx('ds-tabs__list', className)} />;
}

export interface TabProps extends Omit<AriaTabProps, 'className' | 'style' | 'children'> {
  /** Storybook only: forces a look ("hover" or "focus") for the state gallery. */
  'data-state'?: 'hover' | 'focus';
  className?: string;
  children: ReactNode;
}
export function Tab({ className, children, ...rest }: TabProps) {
  return (
    <AriaTab {...rest} className={cx('ds-tabs__tab', className)}>
      {children}
      <SelectionIndicator className="ds-tabs__indicator" />
    </AriaTab>
  );
}

export interface TabPanelProps extends Omit<AriaTabPanelProps, 'className' | 'style'> {
  className?: string;
}
export function TabPanel({ className, ...rest }: TabPanelProps) {
  return <AriaTabPanel {...rest} className={cx('ds-tabs__panel', className)} />;
}
