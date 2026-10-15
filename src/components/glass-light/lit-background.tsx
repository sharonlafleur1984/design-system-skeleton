import { useRef } from 'react';
import type { GlassArt } from '../glass-lens/lens-art';
import { useLitSurface } from './lit-surface';
import './lit-background.css';

// The page's light, drawn by the renderer onto the background of whatever holds it (D59): drop it in
// as the first child of a positioned container that's its own layer (isolation: isolate), next to
// the orb. The container's background becomes a surface lit by the light; an orb beside it keeps
// only a faint glare (lit-background.css). Without 3D, nothing is drawn.

export interface LitBackgroundProps {
  /** The art the container shows (the same art its glass lens uses). Leave out for a plain background. */
  art?: GlassArt;
  /** Where the light is, as a share of the container. */
  light: { x: number; y: number };
  /** The color family of the area, like 'seagull'. Leave out to use the theme's orb color. On a plain page the light is white. */
  palette?: string;
}

export function LitBackground({ art, light, palette }: LitBackgroundProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  // 75% white, 25% the lightest step of the page's color (D57).
  const color = `color-mix(in srgb, white 75%, ${palette ? `var(--palette-${palette}-100)` : 'var(--orb-color-light)'})`;
  useLitSurface(null, canvas, { art, light, color, height: 110, strength: 4 });
  return <canvas ref={canvas} className="ds-lit-background" aria-hidden="true" />;
}
