import { createContext, useContext, useMemo, useRef, type ReactNode } from 'react';
import { useGlassLight } from '../glass-light/glass-light';
import { clearArt } from '../glass-lens/lens-art';
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
import '../glass.css';
import '../glass-lens/glass-lens.css';
import { AppearanceContext, LitContext, lensClass, resolveAppearance, type Appearance, type Material } from '../material';
import './action-tile.css';

// Action tile: navigation (Oct 15). In an ActionTileGroup with behavior="switch", tiles switch the
// page's content, like tabs (React Aria Tabs underneath: one Tab stop, arrow keys between tiles).
// After Graduation's episodes. For anything else, a link or a button that looks like a tile, use Card:
// it has the same look. Tiles with href or onPress still work, but are deprecated.
// Each tile is one click target: never put a button inside a tile.
//
// On artwork the design system controls (the page shell's header), tiles are lens glass (Oct 12): the
// container's useGlassLight draws them on one WebGL canvas that bends the art at their edges. The
// tile's text stays HTML on top. Elsewhere, and as the fallback, tiles keep the classic glass.
//
// Tiles never stack. Tablet and up: three across. Phones (under 600px): the same tiles become the
// bottom bar, each an icon and a short name, so it's one set of tabs with one selection on every screen.
// Action tiles (links and buttons) aren't navigation, so on phones they stack instead.

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
  /** switch: tiles switch the content shown elsewhere (inside an ActionTileSwitch). actions (deprecated): each tile is its own link or button; use Card instead. */
  behavior?: 'switch' | 'actions';
  children: ReactNode;
}
/** Three across on tablet and up. On phones, switch tiles become the bottom bar and action tiles stack. */
export function ActionTileGroup({ behavior = 'actions', children, ...rest }: ActionTileGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  // The page shell lights its own tiles (with its art). Anywhere else, the group lights its Glass tiles
  // itself, on whatever plain color is behind it.
  // Anywhere else the glass is fully clear (nothing to bend), and the lens draws only its light: the edge,
  // highlight and shadow, which follow the page's light (the light tokens).
  const lit = useContext(LitContext);
  const inLitContainer = useContext(AppearanceContext) !== null || lit;
  const lens = useMemo(() => (inLitContainer ? false : { art: clearArt(), selector: '.ds-tile--glass' }), [inLitContainer]);
  // Sunlight's long reach, as in the Glass playground: every tile in the group catches it evenly.
  useGlassLight(ref, { selector: inLitContainer ? ':not(*)' : '.ds-tile--glass', lens, reach: 6 });
  return (
    <div ref={ref} className={`ds-tiles ds-tiles--${behavior}`}>
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

/** @deprecated Fills are gone (Oct 15): every Solid tile uses the card surface. */
export type ActionTileFill = 'card' | 'raised' | 'sunken' | 'accent' | 'inverse';

export interface ActionTileProps {
  /** Optional. Small line above the title, like "Episode 1". */
  label?: ReactNode;
  /** Required. What the tile is, like "Explore Schools". */
  title: ReactNode;
  /** Optional. One short line about what happens there. */
  description?: ReactNode;
  /** Shown when the tile is chosen, in place of the theme's mark (Spotlight's star, a check elsewhere). Any icon works. Decorative: screen readers hear "selected". */
  chosenIcon?: ReactNode;
  /** The tile's icon in the phone bottom bar. Decorative: the name next to it is what's read out. */
  icon?: ReactNode;
  /** One or two words for the phone bottom bar, like "Schools". Falls back to the title. */
  shortTitle?: ReactNode;
  /** In a switch group: matches the ActionTilePanel it shows. */
  id?: Key;
  /** @deprecated Tiles are for navigation. For a link that looks like a tile, use Card with href. */
  href?: string;
  /** @deprecated Tiles are for navigation. For a button that looks like a tile, use Card with onPress. */
  onPress?: () => void;
  isDisabled?: boolean;
  /** Solid (the starting look, except on the page shell header, where tiles are Glass) or Glass: fully clear, only its edge light and shadow show, and on artwork it bends the art at its edges. */
  appearance?: Appearance;
  /** @deprecated Use appearance: "default" is now "solid". */
  material?: Material;
  /** @deprecated Ignored: every Solid tile uses the card surface. */
  fill?: ActionTileFill;
  /** Storybook only: forces a look for the state gallery. */
  'data-state'?: 'hover' | 'focus' | 'chosen';
}

export function ActionTile({ label, title, description, icon, chosenIcon, shortTitle, id, href, onPress, isDisabled, appearance: own, material, fill: _fill, ...rest }: ActionTileProps) {
  // On the page shell header, tiles are Glass unless they ask for Solid.
  const container = useContext(AppearanceContext);
  const appearance = resolveAppearance(own, material) ?? container ?? 'solid';
  const className = ['ds-tile', 'ds-glass', appearance === 'glass' ? 'ds-tile--glass' : null, lensClass(appearance)]
    .filter(Boolean)
    .join(' ');
  const inSwitch = useContext(SwitchContext);
  const body = (
    <>
      <span className="ds-tile__glass" aria-hidden="true" />
      {label && <span className="ds-tile__label">{label}</span>}
      <span className="ds-tile__title">{title}</span>
      {description && <span className="ds-tile__description">{description}</span>}
      <span className="ds-tile__star" aria-hidden="true">
        {chosenIcon}
      </span>
      <span className="ds-tile__bar">
        {icon && (
          <span className="ds-tile__bar-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="ds-tile__bar-name">{shortTitle ?? title}</span>
      </span>
    </>
  );
  const state = rest['data-state'];
  if (inSwitch) {
    return (
      <AriaTab id={id} isDisabled={isDisabled} className={className} data-state={state}>
        {body}
      </AriaTab>
    );
  }
  if (href) {
    return (
      <AriaLink href={href} isDisabled={isDisabled} className={className} data-state={state}>
        {body}
      </AriaLink>
    );
  }
  return (
    <AriaButton onPress={onPress} isDisabled={isDisabled} className={className} data-state={state}>
      {body}
    </AriaButton>
  );
}
