import { useLayoutEffect, type RefObject } from 'react';

// Lights glass from one light source in a container, the way light works in real life:
// each piece of glass gets a rim that is brightest on the side facing the light, and its edges
// bend whatever is behind it (Chromium only; other browsers keep clear glass).
// Used by After Graduation's header (the wheel is the light) and shared with Life Hub's cards.

/** A displacement map that bends what is behind the glass near its edges. */
function bendMap(w: number, h: number, band: number, r: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const x = c.getContext('2d');
  if (!x) return '';
  const im = x.createImageData(w, h);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const px = i + 0.5 - w / 2;
      const py = j + 0.5 - h / 2;
      const qx = Math.abs(px) - (w / 2 - r);
      const qy = Math.abs(py) - (h / 2 - r);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const d = -(Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r);
      let nx = 0;
      let ny = 0;
      let s = 0;
      if (d < band) {
        s = (1 - d / band) ** 2;
        if (qx > 0 && qy > 0) {
          const l = Math.hypot(ox, oy) || 1;
          nx = (ox / l) * Math.sign(px);
          ny = (oy / l) * Math.sign(py);
        } else if (qx > qy) nx = Math.sign(px);
        else ny = Math.sign(py);
      }
      const k = (j * w + i) * 4;
      im.data[k] = 128 - nx * s * 127;
      im.data[k + 1] = 128 - ny * s * 127;
      im.data[k + 2] = 128;
      im.data[k + 3] = 255;
    }
  }
  x.putImageData(im, 0, 0);
  return c.toDataURL();
}

export interface GlassLightOptions {
  /** Where the light is, as fractions of the container: 0 is left or top, 1 is right or bottom. */
  light: { x: number; y: number };
  /** Which glass pieces to light. */
  selector: string;
  /** How far in from the edge the glass bends, in px. Defaults to the theme's --material-refraction-band. */
  band?: number;
  /** How far a line behind the glass shifts at the edge, in px. Defaults to the theme's --material-refraction-max. */
  bend?: number;
  /** Corner radius of the glass, in px, so the bend follows the corners. */
  radius?: number;
}

/**
 * Sets, on every glass piece: --light-x and --light-y (where the light hits its rim, as percentages),
 * --light-k (0 to 1, weaker with distance) and --glass-bend (an SVG filter for backdrop-filter).
 */
export function useGlassLight(root: RefObject<HTMLElement | null>, { light, selector, band: bandOption, bend: bendOption, radius = 16 }: GlassLightOptions) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    el.append(svg);
    const prefix = `gl${Math.random().toString(36).slice(2, 8)}`;
    const update = () => {
      const cs = getComputedStyle(el);
      const band = bandOption ?? (Number.parseFloat(cs.getPropertyValue('--material-refraction-band')) || 16);
      const bend = bendOption ?? (Number.parseFloat(cs.getPropertyValue('--material-refraction-max')) || 4);
      const r = el.getBoundingClientRect();
      const lx = r.left + r.width * light.x;
      const ly = r.top + r.height * light.y;
      const reach = Math.max(r.width, r.height) * 0.9;
      svg.replaceChildren();
      el.querySelectorAll<HTMLElement>(selector).forEach((glass, i) => {
        const b = glass.getBoundingClientRect();
        if (!b.width || !b.height) return;
        const hx = Math.max(0, Math.min(100, ((lx - b.left) / b.width) * 100));
        const hy = Math.max(0, Math.min(100, ((ly - b.top) / b.height) * 100));
        const dist = Math.hypot(lx - (b.left + b.width / 2), ly - (b.top + b.height / 2));
        glass.style.setProperty('--light-x', `${hx.toFixed(1)}%`);
        glass.style.setProperty('--light-y', `${hy.toFixed(1)}%`);
        glass.style.setProperty('--light-k', (1 / (1 + (dist / reach) ** 2)).toFixed(3));
        const w = Math.round(glass.offsetWidth);
        const h = Math.round(glass.offsetHeight);
        const id = `${prefix}-${i}`;
        const f = document.createElementNS(NS, 'filter');
        for (const [k, v] of [['id', id], ['filterUnits', 'userSpaceOnUse'], ['primitiveUnits', 'userSpaceOnUse'], ['x', '0'], ['y', '0'], ['width', `${w}`], ['height', `${h}`], ['color-interpolation-filters', 'sRGB']])
          f.setAttribute(k, v);
        const img = document.createElementNS(NS, 'feImage');
        for (const [k, v] of [['href', bendMap(w, h, band, radius)], ['x', '0'], ['y', '0'], ['width', `${w}`], ['height', `${h}`], ['preserveAspectRatio', 'none'], ['result', 'map']])
          img.setAttribute(k, v);
        const dm = document.createElementNS(NS, 'feDisplacementMap');
        for (const [k, v] of [['in', 'SourceGraphic'], ['in2', 'map'], ['scale', `${bend * 2}`], ['xChannelSelector', 'R'], ['yChannelSelector', 'G']])
          dm.setAttribute(k, v);
        f.append(img, dm);
        svg.append(f);
        glass.style.setProperty('--glass-bend', `url(#${id})`);
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      svg.remove();
    };
  }, [root, light.x, light.y, selector, bandOption, bendOption, radius]);
}
