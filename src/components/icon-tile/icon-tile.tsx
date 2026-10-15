import type { ReactNode } from 'react';
import './icon-tile.css';
import '../corners.css';

// Icon tile (Oct 15): an icon in a small square, with a soft background or without one. Atlassian's
// design system has the same component under the same name. Used in Card, Tile and Action tile
// headers, and on its own. The icon draws in the text color around it, so it reads on Solid, on Glass
// and in dark mode; the background is a faint wash of that same color.

export type IconTileSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface IconTileProps {
  /** The icon, drawn in the surrounding text color (use currentColor in the SVG). */
  icon: ReactNode;
  /** small 24px, medium 32px (the default), large 40px, xlarge 48px. */
  size?: IconTileSize;
  /** filled (the default): a soft background behind the icon. plain: the icon alone, at the same size. */
  variant?: 'filled' | 'plain';
  /** What the icon means, read out by screen readers. Leave out when the words next to it say it already (most of the time). */
  label?: string;
  className?: string;
}

export function IconTile({ icon, size = 'medium', variant = 'filled', label, className }: IconTileProps) {
  const classes = ['ds-icon-tile', `ds-icon-tile--${size}`, `ds-icon-tile--${variant}`];
  if (className) classes.push(className);
  return (
    <span className={classes.join(' ')} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {icon}
    </span>
  );
}
