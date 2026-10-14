// The artwork behind lens glass. Lens glass only goes on artwork the design system controls, so the
// art can be painted into the lens's texture instead of read back from the screen: After Graduation's
// header (shellArt) and Life Hub's marble backgrounds (imageArt). A container passes its art to
// useGlassLight's lens option; the lens repaints it whenever it needs a new texture.

/** The art's frame: the container's box (art that scrolls with it) or the viewport (art fixed on screen). */
export interface ArtFrame {
  width: number;
  height: number;
}

export interface GlassArt {
  /**
   * 'scroll' (default): the art is painted on the container and moves with it, like a background.
   * 'fixed': the art stays put on screen while the glass scrolls over it (background-attachment: fixed).
   */
  attachment?: 'scroll' | 'fixed';
  /**
   * Paints the art in CSS pixels of its frame: (0, 0) is the frame's top left. The lens has already
   * moved and scaled the context, so paint the whole art and the lens keeps the part it needs.
   * Return false when the art isn't ready yet (an image still loading); the glass stays as it is until then.
   */
  paint(ctx: CanvasRenderingContext2D, frame: ArtFrame, container: HTMLElement): boolean;
  /** True while the art is moving on its own (an entrance), so the lens keeps repainting it. */
  isAnimating?(container: HTMLElement): boolean;
  /** Lets the art ask for a repaint (for example when its image has loaded). Returns a cleanup. */
  subscribe?(repaint: () => void): () => void;
}

// Colors: CSS can hold any color syntax (color-mix, oklab, var()), so ask the browser for the computed
// color, then let a 1 x 1 canvas turn it into plain numbers.
let probeCtx: CanvasRenderingContext2D | null | undefined;
function probe2d() {
  if (probeCtx !== undefined) return probeCtx;
  try {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    probeCtx = c.getContext('2d', { willReadFrequently: true });
  } catch {
    probeCtx = null;
  }
  return probeCtx;
}

/** Any CSS color (var(), color-mix(), oklab()...) as 0 to 255 red, green, blue and 0 to 1 alpha, resolved inside an element. */
export function resolveColor(css: string, within: HTMLElement): [number, number, number, number] | null {
  if (!css.trim()) return null;
  const el = document.createElement('span');
  el.style.display = 'none';
  el.style.color = css;
  if (!el.style.color) {
    // Some engines won't take var() in a style property directly; set it as a custom property instead.
    el.style.setProperty('--_c', css);
    el.style.color = 'var(--_c)';
  }
  within.append(el);
  const computed = getComputedStyle(el).color;
  el.remove();
  return parseColor(computed);
}

/** A computed CSS color as numbers, through the canvas so every color syntax the browser knows works. */
function parseColor(css: string): [number, number, number, number] | null {
  const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(css.trim());
  if (m) {
    const a = m[4] == null ? 1 : m[4].endsWith('%') ? Number.parseFloat(m[4]) / 100 : Number(m[4]);
    return [Number(m[1]), Number(m[2]), Number(m[3]), a];
  }
  const ctx = probe2d();
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = '#010203';
  ctx.fillStyle = css;
  if (ctx.fillStyle === '#010203' && css !== '#010203') return null;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  const a = d[3] / 255;
  return a === 0 ? [0, 0, 0, 0] : [Math.round(d[0] / a), Math.round(d[1] / a), Math.round(d[2] / a), a];
}

/** Resolves a CSS color to a string a canvas always understands. */
function canvasColor(css: string, within: HTMLElement) {
  const c = resolveColor(css, within);
  return c ? `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})` : 'rgba(0,0,0,0)';
}

/** A CSS number or length as a number, or the fallback when it isn't one. */
export const num = (v: string, fallback = 0) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

export interface ImageArtOptions {
  /** The image's address, like Life Hub's marble (texture-sage-cream.jpg). Same origin, or served with CORS. */
  src: string;
  /** Laid over the image, like a Life Hub area's night layer in dark mode. Any CSS color, var() included. */
  overlay?: string;
  /** Where the image sits when it's cropped to cover, as fractions (0.5, 0.5 is centered, like background-position: center). */
  position?: { x: number; y: number };
  attachment?: 'scroll' | 'fixed';
}

/**
 * An image that covers its frame (background-size: cover), with an optional color laid over it.
 * Life Hub's marble backgrounds: the container shows the same image with the same CSS.
 *
 * @experimental Part of the glass build under review (issue #60). It may change in any version.
 */
export function imageArt({ src, overlay, position = { x: 0.5, y: 0.5 }, attachment = 'scroll' }: ImageArtOptions): GlassArt {
  let img: HTMLImageElement | null = null;
  let ready = false;
  const listeners = new Set<() => void>();
  const load = () => {
    if (img || typeof Image === 'undefined') return;
    img = new Image();
    img.decoding = 'async';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ready = true;
      listeners.forEach((l) => l());
    };
    img.src = src;
  };
  return {
    attachment,
    paint(ctx, { width, height }, container) {
      load();
      if (!img || !ready || !img.naturalWidth) return false;
      const s = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (width - w) * position.x, (height - h) * position.y, w, h);
      if (overlay) {
        ctx.fillStyle = canvasColor(overlay, container);
        ctx.fillRect(0, 0, width, height);
      }
      return true;
    },
    subscribe(repaint) {
      listeners.add(repaint);
      load();
      return () => listeners.delete(repaint);
    },
  };
}

/** The wheel, drawn the same way as the page shell's SVG (viewBox 0 0 200 200). */
function drawWheel(ctx: CanvasRenderingContext2D) {
  const circle = (r: number, w: number, dash?: number[]) => {
    ctx.beginPath();
    ctx.lineWidth = w;
    ctx.setLineDash(dash ?? []);
    ctx.arc(100, 100, r, 0, Math.PI * 2);
    ctx.stroke();
  };
  const poly = (pts: number[], w: number) => {
    ctx.beginPath();
    ctx.lineWidth = w;
    ctx.setLineDash([]);
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.closePath();
    ctx.stroke();
  };
  circle(96, 1.5);
  circle(84, 1, [3, 5]);
  circle(58, 1.5);
  poly([100, 16, 173, 142, 27, 142], 1);
  poly([100, 184, 27, 58, 173, 58], 1);
  circle(20, 1.5);
  ctx.beginPath();
  ctx.arc(100, 100, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);
  for (const [x1, y1, x2, y2] of [[100, 4, 100, 14], [100, 186, 100, 196], [4, 100, 14, 100], [186, 100, 196, 100], [32, 32, 39, 39], [161, 161, 168, 168], [168, 32, 161, 39], [39, 161, 32, 168]]) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
}

let scratch: HTMLCanvasElement | null = null;

/**
 * After Graduation's header art, painted the same way page-shell.css draws it: the red lightest at the
 * wheel and deepening with distance, 30 rays that fade as they travel (and fade further behind the row
 * of glass tiles), and the wheel at its current angle. Reads every value from the shell's tokens, so
 * dark mode and screen sizes follow. During the entrance (the rays burst, the wheel turns) it keeps
 * repainting so the art inside the glass moves with the art around it.
 *
 * @experimental Part of the glass build under review (issue #60). It may change in any version.
 */
export function shellArt(): GlassArt {
  return {
    attachment: 'scroll',
    paint(ctx, { width, height }, shell) {
      const cs = getComputedStyle(shell);
      const v = (name: string) => cs.getPropertyValue(name).trim();
      const fromRight = num(v('--light-from-right'));
      const lx = width - (width * fromRight) / 100;
      const ly = num(v('--light-top'));
      const R = Math.max(Math.hypot(lx, ly), Math.hypot(width - lx, ly), Math.hypot(lx, height - ly), Math.hypot(width - lx, height - ly));

      // The red: lightest at the wheel, deepening to the frame color.
      const bg = ctx.createRadialGradient(lx, ly, 0, lx, ly, R);
      bg.addColorStop(0, canvasColor('color-mix(in oklab, var(--color-accent-base) 55%, var(--color-accent-hover))', shell));
      bg.addColorStop(0.3, canvasColor('var(--color-accent-hover)', shell));
      bg.addColorStop(0.58, canvasColor('color-mix(in oklab, var(--color-accent-hover) 45%, var(--shell-frame))', shell));
      bg.addColorStop(0.9, canvasColor('var(--shell-frame)', shell));
      bg.addColorStop(1, canvasColor('var(--shell-frame)', shell));
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // The rays, on a scratch canvas so they can be faded with the same two masks as the CSS.
      const t = ctx.getTransform();
      const sw = ctx.canvas.width;
      const sh = ctx.canvas.height;
      scratch ??= document.createElement('canvas');
      if (scratch.width !== sw || scratch.height !== sh) {
        scratch.width = sw;
        scratch.height = sh;
      }
      const r = scratch.getContext('2d');
      const before = getComputedStyle(shell, '::before');
      if (r && typeof r.createConicGradient === 'function' && before.display !== 'none') {
        r.setTransform(1, 0, 0, 1, 0, 0);
        r.globalCompositeOperation = 'source-over';
        r.clearRect(0, 0, sw, sh);
        r.setTransform(t);
        // The entrance burst scales the rays from the wheel and fades them in.
        if (before.transform && before.transform !== 'none') {
          const m = new DOMMatrix(before.transform);
          r.translate(lx, ly);
          r.transform(m.a, m.b, m.c, m.d, m.e, m.f);
          r.translate(-lx, -ly);
        }
        const ray = canvasColor('var(--shell-art-ray)', shell);
        const clear = 'rgba(0,0,0,0)';
        // CSS conic gradients start straight up; canvas ones start at 3 o'clock.
        const cg = r.createConicGradient(-Math.PI / 2, lx, ly);
        for (let k = 0; k < 30; k++) {
          const a = (k * 12) / 360;
          const b = (k * 12 + 3) / 360;
          cg.addColorStop(a, ray);
          cg.addColorStop(b, ray);
          cg.addColorStop(Math.min(1, b + 1e-6), clear);
          cg.addColorStop(Math.min(1, (k * 12 + 12) / 360 - 1e-6), clear);
        }
        r.fillStyle = cg;
        r.fillRect(-width, -height, width * 3, height * 3);
        r.setTransform(t);
        r.globalCompositeOperation = 'destination-in';
        const fade = r.createRadialGradient(lx, ly, 0, lx, ly, R);
        fade.addColorStop(0, 'rgba(0,0,0,0)');
        fade.addColorStop(0.06, 'rgba(0,0,0,1)');
        fade.addColorStop(0.3, 'rgba(0,0,0,0.55)');
        fade.addColorStop(0.7, 'rgba(0,0,0,0)');
        fade.addColorStop(1, 'rgba(0,0,0,0)');
        r.fillStyle = fade;
        r.fillRect(0, 0, width, height);
        // Behind the row of glass tiles the rays fade further (shell-art-ray-behind-glass).
        const top = num(v('--shell-glass-top'), -1e5);
        const bottom = num(v('--shell-glass-bottom'), -1e5);
        if (top > -1e4 && bottom > top) {
          const behind = num(v('--shell-art-ray-behind-glass'), 1);
          const pad = num(v('--space-3'), 0) * (num(getComputedStyle(document.documentElement).fontSize, 16) || 16);
          const padPx = pad > 0 ? pad : 12;
          const lin = r.createLinearGradient(0, 0, 0, height);
          const at = (y: number) => Math.min(1, Math.max(0, y / height));
          lin.addColorStop(0, 'rgba(0,0,0,1)');
          lin.addColorStop(at(top - padPx), 'rgba(0,0,0,1)');
          lin.addColorStop(at(top), `rgba(0,0,0,${behind})`);
          lin.addColorStop(at(bottom), `rgba(0,0,0,${behind})`);
          lin.addColorStop(at(bottom + padPx), 'rgba(0,0,0,1)');
          lin.addColorStop(1, 'rgba(0,0,0,1)');
          r.fillStyle = lin;
          r.fillRect(0, 0, width, height);
        }
        r.globalCompositeOperation = 'source-over';
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = Math.min(1, Math.max(0, num(before.opacity, 1)));
        ctx.drawImage(scratch, 0, 0);
        ctx.restore();
      }

      // The wheel, where the page shell shows it, at its current angle.
      const wheel = shell.querySelector<SVGSVGElement>('.ds-shell__wheel');
      if (wheel) {
        const ws = getComputedStyle(wheel);
        const size = num(ws.width);
        const box = wheel.getBoundingClientRect();
        const sb = shell.getBoundingClientRect();
        const cx = box.left + box.width / 2 - sb.left - shell.clientLeft;
        const cy = box.top + box.height / 2 - sb.top - shell.clientTop;
        const angle = ws.rotate && ws.rotate !== 'none' ? num(ws.rotate) : 0;
        if (size > 0) {
          const color = canvasColor(ws.color, shell);
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((angle * Math.PI) / 180);
          ctx.scale(size / 200, size / 200);
          ctx.translate(-100, -100);
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.globalAlpha = Math.min(1, Math.max(0, num(ws.opacity, 1)));
          drawWheel(ctx);
          ctx.restore();
        }
      }
      return true;
    },
    isAnimating(shell) {
      if (typeof shell.getAnimations !== 'function') return false;
      return shell.getAnimations({ subtree: true }).some((a) => {
        if (a.playState !== 'running') return false;
        const e = a.effect as KeyframeEffect | null;
        if (!e) return false;
        return (e.target === shell && e.pseudoElement === '::before') || (e.target instanceof Element && e.target.classList.contains('ds-shell__wheel'));
      });
    },
  };
}

/**
 * Nothing to bend: the glass is fully clear, and the lens draws only its light (the edge, highlight and
 * shadow), which follow the light when it moves. Glass on any background the design system doesn't paint.
 * @experimental Part of the glass build under review (issue #60). It may change in any version.
 */
export function clearArt(): GlassArt {
  return { paint: () => true };
}
