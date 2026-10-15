import type { ReactNode } from 'react';
import { IconTile, type IconTileSize } from './icon-tile/icon-tile';

// The header Card, Tile and Action tile share (Oct 15): an optional icon tile, a label and a title.
// Inside a pressable tile the title is plain text (a button or link can't hold a heading); on a card
// it's a real heading at the level the page needs.

export type IconPosition = 'top' | 'start';

export interface TileHeaderOptions {
  /** An icon in an icon tile. Draw it in currentColor. */
  icon?: ReactNode;
  /** top (the default): the icon sits above the label. start: it sits before the label and title, centered on them. */
  iconPosition?: IconPosition;
  /** filled (the default): a soft background behind the icon. plain: the icon alone. */
  iconVariant?: 'filled' | 'plain';
  /** The icon tile's size: small, medium (the default), large or xlarge. */
  iconSize?: IconTileSize;
  /** Optional. Small line above the title. */
  label?: ReactNode;
}

export function TileHeader({ icon, iconPosition = 'top', iconVariant, iconSize, label, title, level }: TileHeaderOptions & { title?: ReactNode; level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const Title = level ? (`h${level}` as const) : 'span';
  const text = (
    <>
      {label && <span className="ds-tile__label">{label}</span>}
      {title && <Title className="ds-tile__title">{title}</Title>}
    </>
  );
  if (!icon) return text;
  const tile = <IconTile icon={icon} variant={iconVariant} size={iconSize} className="ds-tile__icon" />;
  if (iconPosition === 'start') {
    return (
      <span className="ds-tile__head ds-tile__head--start">
        {tile}
        <span className="ds-tile__head-text">{text}</span>
      </span>
    );
  }
  return (
    <>
      {tile}
      {text}
    </>
  );
}
