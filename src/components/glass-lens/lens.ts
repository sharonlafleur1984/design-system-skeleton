// Lens glass: one WebGL canvas behind a group of glass on artwork (a row of action tiles, a few glass
// buttons). useGlassLight starts it when a container passes its art. The canvas draws the art bent at
// each glass shape's curved edge, with the glass's rim, highlight and shadow lit from the page's light.
// The glass's own HTML stays on top, so text and icons never bend or blur.
//
// It draws only when something changes (the light, scroll, a resize, a press, the phone tilting, a
// hover transition or the art's entrance) and pauses off screen. Motion (press swell and phone tilt)
// is off with reduced motion, from the device or from Settings. With no WebGL, a lost context, Reduce
// transparency or Increase contrast, nothing is drawn and every glass keeps the classic recipe.
import { clampRadius, capDpr, pressSwell, swellRect, tiltMoving, tiltRest, tiltStep, type TiltState } from './lens-math';
import { createLensRenderer, MAX_LENS_RECTS, type LensLook, type LensRenderer, type Rgba } from './lens-shader';
import { resolveColor, type GlassArt } from './lens-art';
import './glass-lens.css';

export interface LensOptions {
  /** The art behind the glass. */
  art: GlassArt;
  /** Which glass gets the lens. Defaults to every .ds-lens (action tiles and glass buttons). */
  selector?: string;
}

export interface LensControllerOptions extends LensOptions {
  /** Where the light is, in viewport px (from useGlassLight). */
  light: () => { x: number; y: number };
}

/** For tests: swap the WebGL renderer for a stand-in. */
export interface LensDeps {
  createRenderer?: (canvas: HTMLCanvasElement) => LensRenderer | null;
}

const html = () => document.documentElement;
const media = (q: string) => (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(q) : null);

/** Reduce transparency or Increase contrast, from the device or from Settings: glass turns solid, so no lens. */
export function lensBlocked() {
  const root = html();
  const transparency = root.getAttribute('data-transparency');
  const contrast = root.getAttribute('data-contrast');
  if (transparency === 'reduce' || contrast === 'more') return true;
  if (transparency !== 'standard' && media('(prefers-reduced-transparency: reduce)')?.matches) return true;
  if (contrast !== 'standard' && media('(prefers-contrast: more)')?.matches) return true;
  return false;
}

/** Reduced motion, from the device or from Settings (usePreferences sets data-reduce-motion). Device "reduce" always wins. */
export function motionReduced() {
  return html().hasAttribute('data-reduce-motion') || !!media('(prefers-reduced-motion: reduce)')?.matches;
}

// iOS asks once per page, and only from a tap. Remembered across every lens on the page.
let tiltPermission: 'unasked' | 'asking' | 'granted' | 'denied' = 'unasked';
/** For tests. */
export function resetTiltPermission() {
  tiltPermission = 'unasked';
}
type OrientationCtor = { requestPermission?: () => Promise<'granted' | 'denied' | 'default'> };
const orientationCtor = (): OrientationCtor | null =>
  typeof window !== 'undefined' && 'DeviceOrientationEvent' in window ? (window.DeviceOrientationEvent as unknown as OrientationCtor) : null;

const num = (v: string, fallback: number) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

/** Starts lens glass on a container. Returns a cleanup. */
export function attachLens(root: HTMLElement, options: LensControllerOptions, deps: LensDeps = {}): () => void {
  const { art, selector = '.ds-lens', light } = options;
  const makeRenderer = deps.createRenderer ?? createLensRenderer;

  let canvas: HTMLCanvasElement | null = null;
  let renderer: LensRenderer | null = null;
  let artCanvas: HTMLCanvasElement | null = null;
  let artKey = '';
  let look: LensLook | null = null;
  let lookKey = '';
  let raf = 0;
  let visible = true;
  let disposed = false;
  let lost = false;
  let lit = new Set<HTMLElement>();
  const presses = new Map<HTMLElement, number>();
  let tilt: TiltState = { ...tiltRest };
  let tiltReading: { beta: number | null; gamma: number | null } | null = null;
  let tiltListening = false;
  let lastFrame = 0;
  let transitions = 0;
  let transitionUntil = 0;
  const restore: (() => void)[] = [];

  const lensElements = () =>
    Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((el) => {
      if (getComputedStyle(el).getPropertyValue('--glass-lens').trim() === 'off') return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });

  const unlight = (el: HTMLElement) => el.removeAttribute('data-lens');
  const unlightAll = () => {
    lit.forEach(unlight);
    lit = new Set();
  };

  // ---- Look: the theme's glass.lens tokens, read again when the theme or mode changes.
  const readLook = (dpr: number): LensLook => {
    const cs = getComputedStyle(root);
    const v = (n: string) => cs.getPropertyValue(n).trim();
    const key = [dpr, ...['body', 'tint', 'rim-lit', 'rim-faint', 'highlight', 'shadow-color', 'rim-width', 'shadow-distance', 'shadow-blur', 'bend', 'edge-depth', 'color-split'].map((n) => v(`--glass-lens-${n}`))].join('|');
    if (look && key === lookKey) return look;
    const color = (n: string, fallback: Rgba): Rgba => {
      const c = resolveColor(v(`--glass-lens-${n}`), root);
      return c ? [c[0] / 255, c[1] / 255, c[2] / 255, c[3]] : fallback;
    };
    look = {
      body: color('body', [1, 1, 1, 0.05]),
      tint: color('tint', [1, 1, 1, 0]),
      rimLit: color('rim-lit', [1, 1, 1, 0.55]),
      rimFaint: color('rim-faint', [1, 1, 1, 0.1]),
      highlight: color('highlight', [1, 1, 1, 0.1]),
      shadow: color('shadow-color', [0, 0, 0, 0.2]),
      rimWidth: num(v('--glass-lens-rim-width'), 1) * dpr,
      shadowDistance: num(v('--glass-lens-shadow-distance'), 2) * dpr,
      shadowBlur: num(v('--glass-lens-shadow-blur'), 24) * dpr,
      bend: num(v('--glass-lens-bend'), 1),
      edgeDepth: num(v('--glass-lens-edge-depth'), 22) * dpr,
      split: num(v('--glass-lens-color-split'), 0.02),
    };
    lookKey = key;
    return look;
  };

  // ---- Motion: press swell and phone tilt, both off with reduced motion.
  const swelled = new Map<HTMLElement, number>();
  const setSwell = (el: HTMLElement, scale: number) => {
    if (scale === 1) {
      if (swelled.delete(el)) el.style.removeProperty('scale');
    } else {
      swelled.set(el, scale);
      el.style.setProperty('scale', String(scale));
    }
  };
  const clearSwells = () => {
    for (const el of swelled.keys()) el.style.removeProperty('scale');
    swelled.clear();
  };
  const swellNow = (el: HTMLElement, now: number) => {
    const start = presses.get(el);
    if (start == null) return 0;
    const duration = num(getComputedStyle(root).getPropertyValue('--glass-lens-press-duration'), 300);
    const s = pressSwell(now - start, duration);
    if (s === 0 && now - start >= duration) presses.delete(el);
    return s;
  };

  const onOrientation = (e: DeviceOrientationEvent) => {
    tiltReading = { beta: e.beta, gamma: e.gamma };
    invalidate();
  };
  const startTilt = () => {
    if (tiltListening || motionReduced() || disposed) return;
    tiltListening = true;
    window.addEventListener('deviceorientation', onOrientation);
  };
  const stopTilt = () => {
    if (tiltListening) window.removeEventListener('deviceorientation', onOrientation);
    tiltListening = false;
    tilt = { ...tiltRest };
    tiltReading = null;
  };
  // Phones without a permission prompt (Android) send orientation right away. iOS needs a tap first.
  const ctor = orientationCtor();
  const needsPermission = !!ctor && typeof ctor.requestPermission === 'function';

  /** The first tap on lens glass: on iOS, ask for motion access (never on load, never without a tap). */
  const onTap = (e: Event) => {
    if (!active() || motionReduced()) return;
    const target = e.target instanceof Element ? e.target.closest<HTMLElement>(selector) : null;
    if (!target || !root.contains(target)) return;
    if (!needsPermission) return;
    if (tiltPermission === 'granted') {
      startTilt();
      return;
    }
    if (tiltPermission !== 'unasked') return;
    tiltPermission = 'asking';
    try {
      ctor!.requestPermission!().then(
        (answer) => {
          tiltPermission = answer === 'granted' ? 'granted' : 'denied';
          if (tiltPermission === 'granted') startTilt();
        },
        () => {
          tiltPermission = 'denied';
        },
      );
    } catch {
      tiltPermission = 'denied';
    }
  };

  const active = () => !!renderer && !lost && !disposed && !lensBlocked();

  // ---- Drawing.
  const animating = (now: number) =>
    presses.size > 0 || (tiltListening && tiltMoving(tilt)) || (transitions > 0 && now < transitionUntil) || !!art.isAnimating?.(root);

  const invalidate = () => {
    if (disposed || raf) return;
    raf = window.requestAnimationFrame(frame);
  };

  const frame = (now: number) => {
    raf = 0;
    if (disposed) return;
    const dt = lastFrame ? Math.min(100, now - lastFrame) : 16;
    lastFrame = now;
    if (tiltListening) {
      tilt = tiltStep(tilt, tiltReading, dt);
      tiltReading = null;
    }
    draw(now);
    if (visible && active() && animating(now)) invalidate();
    else lastFrame = 0;
  };

  const draw = (now: number) => {
    if (!canvas || !renderer) return;
    if (!active() || !renderer.ok) {
      canvas.style.visibility = 'hidden';
      unlightAll();
      return;
    }
    if (!visible) return;
    const els = lensElements().slice(0, MAX_LENS_RECTS);
    const keep = new Set(els);
    lit.forEach((el) => {
      if (!keep.has(el)) unlight(el);
    });
    if (!els.length) {
      canvas.style.visibility = 'hidden';
      lit = new Set();
      return;
    }
    const rb = root.getBoundingClientRect();
    const ox = rb.left + root.clientLeft;
    const oy = rb.top + root.clientTop;
    const dpr0 = capDpr(window.devicePixelRatio);
    const rootCs = getComputedStyle(root);
    const margin = Math.ceil(num(rootCs.getPropertyValue('--glass-lens-shadow-distance'), 2) + num(rootCs.getPropertyValue('--glass-lens-shadow-blur'), 24) + 8);
    const swell = num(rootCs.getPropertyValue('--glass-lens-press-swell'), 1.02);

    // Where each glass is, relative to the container (CSS px).
    const boxes = els.map((el) => {
      // The press swell scales the whole element (its fill, text and focus ring), so the drawn glass
      // and anything the element paints itself, like a chosen tile's frosted fill, move as one.
      // Measured at rest: the swell is taken off for the measurement (no paint happens in between).
      if (swelled.has(el)) el.style.removeProperty('scale');
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const s = motionReduced() ? 0 : swellNow(el, now);
      const scale = 1 + (swell - 1) * s;
      setSwell(el, scale);
      const g = swellRect(b.left - ox, b.top - oy, b.width, b.height, clampRadius(num(cs.borderTopLeftRadius, 0), b.width, b.height), scale);
      return {
        ...g,
        k: Math.min(1, Math.max(0, num(cs.getPropertyValue('--light-k'), 1))),
        alpha: Math.min(1, Math.max(0, num(cs.opacity, 1))),
        lift: Math.max(0, num(cs.getPropertyValue('--glass-lift'), 1)),
      };
    });
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    for (const b of boxes) {
      left = Math.min(left, b.x);
      top = Math.min(top, b.y);
      right = Math.max(right, b.x + b.w);
      bottom = Math.max(bottom, b.y + b.h);
    }
    left = Math.floor(left - margin);
    top = Math.floor(top - margin);
    const cw = Math.ceil(right + margin) - left;
    const ch = Math.ceil(bottom + margin) - top;
    let dpr = dpr0;
    const maxSide = 4096;
    if (Math.max(cw, ch) * dpr > maxSide) dpr = Math.max(0.5, maxSide / Math.max(cw, ch));
    const pw = Math.max(1, Math.round(cw * dpr));
    const ph = Math.max(1, Math.round(ch * dpr));

    const pos = `${left}px|${top}px|${cw}px|${ch}px`;
    if (canvas.dataset.pos !== pos) {
      canvas.dataset.pos = pos;
      Object.assign(canvas.style, { left: `${left}px`, top: `${top}px`, width: `${cw}px`, height: `${ch}px` });
    }
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }

    // The art for this part of the page: repainted only when the region, theme or art changes.
    const fixed = art.attachment === 'fixed';
    const frameW = fixed ? window.innerWidth : root.clientWidth;
    const frameH = fixed ? window.innerHeight : root.clientHeight;
    const ax = fixed ? left + ox : left;
    const ay = fixed ? top + oy : top;
    const moving = !!art.isAnimating?.(root);
    const key = [ax, ay, pw, ph, dpr, frameW, frameH, html().getAttribute('data-theme'), html().getAttribute('data-mode'), root.closest('[data-theme]')?.getAttribute('data-theme'), media('(prefers-color-scheme: dark)')?.matches].join('|');
    if (moving || key !== artKey) {
      artCanvas ??= document.createElement('canvas');
      if (artCanvas.width !== pw || artCanvas.height !== ph) {
        artCanvas.width = pw;
        artCanvas.height = ph;
      }
      const ctx = artCanvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, pw, ph);
      ctx.setTransform(dpr, 0, 0, dpr, -ax * dpr, -ay * dpr);
      let ready = false;
      try {
        ready = art.paint(ctx, { width: frameW, height: frameH }, root);
        if (ready) renderer.setArt(artCanvas);
      } catch {
        // A tainted image or a painting error: keep the classic glass.
        ready = false;
      }
      if (!ready) {
        artKey = '';
        canvas.style.visibility = 'hidden';
        unlightAll();
        return;
      }
      artKey = key;
    }

    // The light, nudged a little by the phone's tilt.
    const L = light();
    const reach = num(rootCs.getPropertyValue('--glass-lens-tilt-reach'), 40);
    const lx = (L.x - ox - left + tilt.x * reach) * dpr;
    const ly = (L.y - oy - top + tilt.y * reach) * dpr;

    renderer.draw({
      light: [lx, ly],
      dpr,
      look: readLook(dpr),
      rects: boxes.map((b) => ({ x: (b.x - left) * dpr, y: (b.y - top) * dpr, w: b.w * dpr, h: b.h * dpr, r: clampRadius(b.r * dpr, b.w * dpr, b.h * dpr), k: b.k, alpha: b.alpha, lift: b.lift })),
    });
    canvas.style.visibility = 'visible';
    els.forEach((el) => {
      if (el.getAttribute('data-lens') !== 'on') el.setAttribute('data-lens', 'on');
    });
    lit = keep;
  };

  // ---- Setting up, and falling back.
  const start = () => {
    if (renderer || disposed || lensBlocked()) return;
    const c = document.createElement('canvas');
    c.className = 'ds-lens-canvas';
    c.setAttribute('aria-hidden', 'true');
    c.style.visibility = 'hidden';
    const r = makeRenderer(c);
    if (!r) return; // No WebGL: the classic glass stays.
    const cs = getComputedStyle(root);
    if (cs.position === 'static') {
      const was = root.style.position;
      root.style.position = 'relative';
      restore.push(() => (root.style.position = was));
    }
    // The canvas sits behind the container's content; the container has to be its own layer for that.
    if (cs.isolation !== 'isolate' && (cs.zIndex === 'auto' || cs.position === 'static')) {
      const was = root.style.isolation;
      root.style.isolation = 'isolate';
      restore.push(() => (root.style.isolation = was));
    }
    c.addEventListener('webglcontextlost', onLost);
    c.addEventListener('webglcontextrestored', onRestored);
    root.append(c);
    canvas = c;
    renderer = r;
    lost = false;
    artKey = '';
    if (!needsPermission && !motionReduced()) startTilt();
    invalidate();
  };
  const stop = () => {
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    stopTilt();
    presses.clear();
    clearSwells();
    unlightAll();
    renderer?.dispose();
    renderer = null;
    canvas?.removeEventListener('webglcontextlost', onLost);
    canvas?.removeEventListener('webglcontextrestored', onRestored);
    canvas?.remove();
    canvas = null;
    artKey = '';
    restore.splice(0).forEach((f) => f());
  };
  function onLost(e: Event) {
    e.preventDefault(); // lets the browser give it back
    lost = true;
    if (canvas) canvas.style.visibility = 'hidden';
    unlightAll();
  }
  function onRestored() {
    lost = false;
    artKey = '';
    invalidate();
  }

  // Settings and device changes: turn the lens on or off, and stop motion when it's reduced.
  const onPrefs = () => {
    if (lensBlocked()) stop();
    else start();
    if (motionReduced()) {
      stopTilt();
      presses.clear();
      clearSwells();
    } else if (renderer && !needsPermission) startTilt();
    else if (renderer && tiltPermission === 'granted') startTilt();
    look = null;
    artKey = '';
    invalidate();
  };
  const queries = ['(prefers-reduced-transparency: reduce)', '(prefers-contrast: more)', '(prefers-reduced-motion: reduce)', '(prefers-color-scheme: dark)']
    .map(media)
    .filter((q): q is MediaQueryList => !!q);
  queries.forEach((q) => q.addEventListener?.('change', onPrefs));
  const htmlObserver = new MutationObserver(onPrefs);
  htmlObserver.observe(html(), { attributes: true, attributeFilter: ['data-transparency', 'data-contrast', 'data-reduce-motion', 'data-theme', 'data-mode'] });

  // Anything that moves or reshapes the glass: redraw. A press starts the swell.
  const observer = new MutationObserver((records) => {
    let changed = false;
    for (const m of records) {
      if (m.target === canvas) continue;
      changed = true;
      const el = m.target as HTMLElement;
      if (m.attributeName === 'data-pressed' && el.hasAttribute('data-pressed') && el.matches?.(selector) && !motionReduced() && active()) presses.set(el, performance.now());
    }
    if (changed) invalidate();
  });
  observer.observe(root, { attributes: true, subtree: true, childList: true, attributeFilter: ['data-pressed', 'data-hovered', 'data-selected', 'data-disabled', 'data-state', 'class', 'style'] });
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => invalidate()) : null;
  ro?.observe(root);
  const io =
    typeof IntersectionObserver === 'function'
      ? new IntersectionObserver((entries) => {
          visible = entries.some((e) => e.isIntersecting);
          if (visible) invalidate();
        })
      : null;
  io?.observe(root);
  const onScroll = () => invalidate();
  window.addEventListener('scroll', onScroll, { passive: true, capture: true });
  window.addEventListener('resize', onScroll);
  const onTransitionStart = () => {
    transitions++;
    transitionUntil = performance.now() + 1000;
    invalidate();
  };
  const onTransitionEnd = () => {
    transitions = Math.max(0, transitions - 1);
    invalidate();
  };
  root.addEventListener('transitionrun', onTransitionStart);
  root.addEventListener('transitionend', onTransitionEnd);
  root.addEventListener('transitioncancel', onTransitionEnd);
  root.addEventListener('animationstart', onScroll);
  root.addEventListener('click', onTap, true);
  const unsubscribe = art.subscribe?.(() => {
    artKey = '';
    invalidate();
  });

  start();

  return () => {
    disposed = true;
    stop();
    queries.forEach((q) => q.removeEventListener?.('change', onPrefs));
    htmlObserver.disconnect();
    observer.disconnect();
    ro?.disconnect();
    io?.disconnect();
    window.removeEventListener('scroll', onScroll, { capture: true });
    window.removeEventListener('resize', onScroll);
    root.removeEventListener('transitionrun', onTransitionStart);
    root.removeEventListener('transitionend', onTransitionEnd);
    root.removeEventListener('transitioncancel', onTransitionEnd);
    root.removeEventListener('animationstart', onScroll);
    root.removeEventListener('click', onTap, true);
    unsubscribe?.();
  };
}
