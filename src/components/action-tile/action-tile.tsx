import { createContext, useContext, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Link as AriaLink,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabPanelProps as AriaTabPanelProps,
  type TabsProps as AriaTabsProps,
  type Key,
} from 'react-aria-components';
import '../material.css';
import './action-tile.css';

// Action tile: a glass tile you click to make something happen. One look, three behaviors,
// each on the React Aria piece that keeps it accessible:
// - In an ActionTileGroup with behavior="switch", tiles swap the content shown elsewhere on the page
//   (React Aria Tabs underneath: one Tab stop, arrow keys between tiles). After Graduation's episodes.
// - With href, a tile goes to a page (Link).
// - With onPress, a tile does an action (Button).
// Each tile is one click target: never put a button inside a tile.

const SwitchContext = createContext(false);

/** Wraps the tiles and the panels they switch, which can sit anywhere inside it. */
export interface ActionTileSwitchProps extends Omit<AriaTabsProps, 'className' | 'style'> {
  children: ReactNode;
}
export function ActionTileSwitch({ children, ...rest }: ActionTileSwitchProps) {
  return (
    <AriaTabs {...rest} className="ds-tile-switch">
      {children}
    </AriaTabs>
  );
}

/** The content one switch tile shows. Its id matches the tile's id. */
export interface ActionTilePanelProps extends Omit<AriaTabPanelProps, 'className'> {
  className?: string;
}
export function ActionTilePanel({ className, ...rest }: ActionTilePanelProps) {
  return <AriaTabPanel {...rest} className={className ? `ds-tile-panel ${className}` : 'ds-tile-panel'} />;
}

export interface ActionTileGroupProps {
  /** Names the group for screen readers, like "Episodes". */
  'aria-label': string;
  /** switch: tiles swap content shown elsewhere (inside an ActionTileSwitch). actions: each tile is its own link or button. */
  behavior?: 'switch' | 'actions';
  children: ReactNode;
}
/** Lays tiles out three across when there's room, stacked when there isn't. */
export function ActionTileGroup({ behavior = 'actions', children, ...rest }: ActionTileGroupProps) {
  return (
    <div className="ds-tiles">
      {behavior === 'switch' ? (
        <SwitchContext.Provider value>
          <AriaTabList aria-label={rest['aria-label']} className="ds-tiles__list">
            {children}
          </AriaTabList>
        </SwitchContext.Provider>
      ) : (
        <div role="group" aria-label={rest['aria-label']} className="ds-tiles__list">
          {children}
        </div>
      )}
    </div>
  );
}

export interface ActionTileProps {
  /** Optional. Small line above the title, like "Episode 1". */
  label?: ReactNode;
  /** Required. What the tile is, like "Explore Schools". */
  title: ReactNode;
  /** Optional. One short line about what happens there. */
  description?: ReactNode;
  /** In a switch group: matches the ActionTilePanel it shows. */
  id?: Key;
  /** Goes to this page. */
  href?: string;
  /** Does this when clicked. */
  onPress?: () => void;
  isDisabled?: boolean;
  /** Storybook only: forces a look for the state gallery. */
  'data-state'?: 'hover' | 'focus' | 'chosen';
}

export function ActionTile({ label, title, description, id, href, onPress, isDisabled, ...rest }: ActionTileProps) {
  const inSwitch = useContext(SwitchContext);
  const body = (
    <>
      <span className="ds-tile__glass" aria-hidden="true" />
      {label && <span className="ds-tile__label">{label}</span>}
      <span className="ds-tile__title">{title}</span>
      {description && <span className="ds-tile__description">{description}</span>}
      <span className="ds-tile__star" aria-hidden="true">
        ✦
      </span>
    </>
  );
  const state = rest['data-state'];
  if (inSwitch) {
    return (
      <AriaTab id={id} isDisabled={isDisabled} className="ds-tile" data-state={state}>
        {body}
      </AriaTab>
    );
  }
  if (href) {
    return (
      <AriaLink href={href} isDisabled={isDisabled} className="ds-tile" data-state={state}>
        {body}
      </AriaLink>
    );
  }
  return (
    <AriaButton onPress={onPress} isDisabled={isDisabled} className="ds-tile" data-state={state}>
      {body}
    </AriaButton>
  );
}
