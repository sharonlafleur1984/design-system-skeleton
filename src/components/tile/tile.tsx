import { useContext, type ReactNode } from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import '../material.css';
import '../glass.css';
import '../glass-lens/glass-lens.css';
import '../action-tile/action-tile.css';
import { AppearanceContext, lensClass, type Appearance } from '../material';
import { GlassFrame } from '../card/card';
import { TileHeader, type TileHeaderOptions } from '../tile-header';

// Tile (Oct 15): a whole tile that's one link or one button, like Carbon's clickable tile. The same look
// as Card and Action tile (action-tile.css), with hover, pressed and keyboard focus. Never put a button
// or link inside: the tile is the one click target. For a surface that holds buttons, use Card; for
// tiles that switch the page's content, use Action tile.

export interface TileProps extends TileHeaderOptions {
  /** Solid (the default) or Glass. */
  appearance?: Appearance;
  /** What the tile is, in the theme's title style. */
  title: ReactNode;
  /** Optional. One short line about where it goes or what it does. */
  description?: ReactNode;
  /** Goes to this page (React Aria Link). */
  href?: string;
  /** Does this when pressed (React Aria Button). */
  onPress?: () => void;
  isDisabled?: boolean;
  className?: string;
  /** Storybook only: forces a look for the state gallery. */
  'data-state'?: 'hover' | 'focus' | 'pressed';
}

export function Tile({ appearance: own, title, description, href, onPress, isDisabled, className, 'data-state': state, ...header }: TileProps) {
  const container = useContext(AppearanceContext);
  const appearance = own ?? container ?? 'solid';
  const glass = appearance === 'glass';
  const classes = ['ds-tile', 'ds-glass', 'ds-tile--plain', glass ? 'ds-tile--glass' : null, lensClass(appearance), className].filter(Boolean).join(' ');
  const body = (
    <>
      <span className="ds-tile__glass" aria-hidden="true" />
      <TileHeader title={title} {...header} />
      {description && <span className="ds-tile__description">{description}</span>}
    </>
  );
  const tile =
    href !== undefined ? (
      <AriaLink href={href} isDisabled={isDisabled} className={classes} data-state={state}>
        {body}
      </AriaLink>
    ) : (
      <AriaButton onPress={onPress} isDisabled={isDisabled} className={classes} data-state={state}>
        {body}
      </AriaButton>
    );
  return glass ? <GlassFrame selector=".ds-tile">{tile}</GlassFrame> : tile;
}
