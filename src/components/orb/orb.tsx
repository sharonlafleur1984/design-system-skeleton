import { useEffect, useRef, useState, type ButtonHTMLAttributes, type KeyboardEvent, type PointerEvent } from 'react';
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
   * A color family from the theme's palette, like 'seagull', so the orb glows in an area's own color.
   * Leave it out to use the theme's orb color.
   */
  palette?: string;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function Orb({ position: controlled, defaultPosition = ORB_START, onPositionChange, size = 'medium', look = 'glow', palette, className, style, 'aria-label': ariaLabel = 'Light. Drag it, or use the arrow keys to move it.', ...rest }: OrbProps) {
  const [own, setOwn] = useState(defaultPosition);
  const glassRef = useRef<HTMLSpanElement>(null);
  const [picture, setPicture] = useState<string>();
  // Draw the glass in this orb's colors, at its size on screen (sharp on high-density screens). It
  // redraws when the theme or mode around it changes.
  const [colorKey, setColorKey] = useState(0);
  useEffect(() => {
    const mo = new MutationObserver(() => setColorKey((k) => k + 1));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-mode'] });
    return () => mo.disconnect();
  }, []);
  useEffect(() => {
    const el = glassRef.current;
    const px = Math.round((el?.getBoundingClientRect().width ?? 0) * Math.min(window.devicePixelRatio || 1, 3));
    if (!el || !px) return;
    const cs = getComputedStyle(el);
    const c = (part: string) => cs.getPropertyValue(`--orb-color-${part}`).trim();
    let live = true;
    renderOrb(px, look, { light: c('light'), glow: c('glow'), halo: c('halo'), body: c('body'), page: cs.getPropertyValue('--color-surface-page').trim() })
      .then((url) => live && setPicture(url))
      .catch(() => live && setPicture(undefined));
    return () => {
      live = false;
    };
  }, [size, look, palette, colorKey]);
  const position = controlled ?? own;
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
      style={{ ...tint, ...style, left: `${position.x * 100}%`, top: `${position.y * 100}%` }}
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
