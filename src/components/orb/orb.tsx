import { useEffect, useRef, useState, type ButtonHTMLAttributes, type KeyboardEvent, type PointerEvent } from 'react';
import type { GlassArt } from '../glass-lens/lens-art';
import { renderOrb, type OrbLook } from './orb-render';
import './orb.css';

// The orb: the light you drag when exploring glass, one component at a time. It sits inside a
// positioned section and moves within it; whatever lights glass from it (useGlassLight's source)
// follows. Full pages never show an orb: their light stays still at the light tokens.
// The glass is drawn by a real renderer (orb-render.ts). Until that picture is ready, or where a
// browser can't draw 3D, the CSS glass shows instead.

/** Where the orb is, as a share of its section: 0 is the left or top edge, 1 the right or bottom. */
export interface OrbPosition {
  x: number;
  y: number;
}

/** Where every orb starts: on the right of its section, two thirds of the way down (Sharon's rule, Oct 15). */
export const ORB_START: OrbPosition = { x: 0.92, y: 0.67 };

export type OrbSize = 'small' | 'medium' | 'large';

export interface OrbProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children' | 'onKeyDown' | 'onPointerDown' | 'onPointerMove'> {
  /** Where the orb is in its section. Leave out to let the orb keep its own place, starting at ORB_START. */
  position?: OrbPosition;
  /** Where it starts when it keeps its own place. Defaults to ORB_START; its own Storybook page centers it. */
  defaultPosition?: OrbPosition;
  /** Called while it's dragged, or moved with the arrow keys. */
  onPositionChange?: (position: OrbPosition) => void;
  /** How big it is: small 16px, the height of body text (Try it out windows use it); medium 32px, the usual; large 48px. */
  size?: OrbSize;
  /** Glow (the default): lit from inside, its light spreading over the whole section. Tinted: glass in the page's color, no glow. Clear: completely see-through glass, no glow. */
  look?: OrbLook;
  /**
   * The art behind the orb (the same art its section gives the glass lens), so clear glass can bend
   * the real background. Leave out on a plain background: the section's own color is used.
   */
  backdrop?: GlassArt;
  /**
   * A color family from the theme's palette, like 'seagull', so the orb glows in an area's own color.
   * Leave it out to use the theme's orb color.
   */
  palette?: string;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** The first color painted behind an element: its own background, or the nearest one around it. */
function colorBehind(el: HTMLElement | null) {
  for (let node = el; node; node = node.parentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && bg !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(bg)) return bg;
  }
  return getComputedStyle(document.documentElement).getPropertyValue('--color-surface-page').trim() || 'white';
}

/**
 * Paints the patch of the real background behind the orb's glass, `px` pixels across: the section's
 * color, then its art. Returns false when the art isn't ready yet (an image still loading).
 */
function paintBehind(glass: HTMLElement, art: GlassArt | undefined, px: number): HTMLCanvasElement | false {
  const section = (glass.closest('.ds-orb') as HTMLElement | null)?.offsetParent as HTMLElement | null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = px;
  const ctx = canvas.getContext('2d');
  if (!ctx || !section) return false;
  const s = section.getBoundingClientRect();
  const g = glass.getBoundingClientRect();
  const k = px / g.width;
  ctx.setTransform(k, 0, 0, k, -(g.left - s.left) * k, -(g.top - s.top) * k);
  ctx.fillStyle = colorBehind(section);
  ctx.fillRect(0, 0, s.width, s.height);
  if (art && !art.paint(ctx, { width: s.width, height: s.height }, section)) return false;
  return canvas;
}

export function Orb({ position: controlled, defaultPosition = ORB_START, onPositionChange, size = 'medium', look = 'glow', backdrop, palette, className, style, 'aria-label': ariaLabel = 'Light. Drag it, or use the arrow keys to move it.', ...rest }: OrbProps) {
  const [own, setOwn] = useState(defaultPosition);
  const glassRef = useRef<HTMLSpanElement>(null);
  const [picture, setPicture] = useState<string>();
  // How light the background behind a glowing orb is (0 dark, 1 light), so its light can look equally
  // bright on every background (orb.css).
  const [lum, setLum] = useState(0);
  // Draw the glass in this orb's colors, at its size on screen (sharp on high-density screens). It
  // redraws when the theme or mode around it changes.
  const [colorKey, setColorKey] = useState(0);
  useEffect(() => {
    const mo = new MutationObserver(() => setColorKey((k) => k + 1));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-mode'] });
    return () => mo.disconnect();
  }, []);
  const position = controlled ?? own;
  // Clear glass shows what's behind it, so it redraws as it moves.
  const where = look === 'tinted' ? '' : `${position.x.toFixed(3)},${position.y.toFixed(3)}`;
  useEffect(() => {
    const el = glassRef.current;
    const px = Math.round((el?.getBoundingClientRect().width ?? 0) * Math.min(window.devicePixelRatio || 1, 3));
    if (!el || !px) return;
    const cs = getComputedStyle(el);
    const c = (part: string) => cs.getPropertyValue(`--orb-color-${part}`).trim();
    let live = true;
    // Glow and clear are see-through, so they're drawn over the patch of real background behind them.
    let behind: HTMLCanvasElement | undefined;
    if (look !== 'tinted') {
      const painted = paintBehind(el, backdrop, px);
      if (!painted) {
        // The art isn't ready (an image loading): try again shortly.
        const t = setTimeout(() => setColorKey((k) => k + 1), 250);
        return () => clearTimeout(t);
      }
      behind = painted;
      if (look === 'glow') {
        // How light that background is, so the glow can look equally bright on it (orb.css).
        const data = painted.getContext('2d')?.getImageData(0, 0, px, px).data;
        if (data) {
          let sum = 0;
          for (let i = 0; i < data.length; i += 4) sum += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          setLum(sum / (data.length / 4));
        }
      }
    }
    renderOrb(px, look, { light: c('light'), glow: c('glow'), halo: c('halo'), body: c('body') }, behind)
      .then((url) => live && setPicture(url))
      .catch(() => live && setPicture(undefined));
    return () => {
      live = false;
    };
  }, [size, look, palette, colorKey, where, backdrop]);
  const move = (p: OrbPosition) => {
    if (!controlled) setOwn(p);
    onPositionChange?.(p);
  };
  const moveTo = (e: PointerEvent<HTMLButtonElement>) => {
    const section = e.currentTarget.offsetParent ?? e.currentTarget.parentElement;
    if (!section) return;
    const r = section.getBoundingClientRect();
    move({ x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) });
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const d = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, number[]>)[e.key];
    if (!d) return;
    e.preventDefault();
    move({ x: clamp(position.x + d[0]), y: clamp(position.y + d[1]) });
  };
  const tint = palette
    ? Object.fromEntries(Object.entries({ light: 100, glow: 200, halo: 300, body: 400, shade: 600 }).map(([part, shade]) => [`--orb-color-${part}`, `var(--palette-${palette}-${shade})`]))
    : undefined;
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={['ds-orb', size !== 'medium' && `ds-orb--${size}`, look === 'glow' && 'ds-orb--glow', picture && 'ds-orb--rendered', className].filter(Boolean).join(' ')}
      style={{ ...tint, ...(look === 'glow' ? { '--_lum': lum.toFixed(2) } : {}), ...style, left: `${position.x * 100}%`, top: `${position.y * 100}%` }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e);
      }}
      onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && moveTo(e)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <span ref={glassRef} className="ds-orb__glass" aria-hidden="true">
        {picture && <img className="ds-orb__render" src={picture} alt="" draggable={false} />}
      </span>
    </button>
  );
}
