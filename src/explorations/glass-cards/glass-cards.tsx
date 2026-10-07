import { useId, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Button } from '../../components/button/button';
import { Callout } from '../../components/callout/callout';
import type { Area } from './areas';
import './glass-cards.css';

// Exploration only, not exported from the library. Shows Life Hub's glass cards on each area's marble,
// lit by one sun in the header (top right). Controls are the real React Aria components.

export type Mode = 'light' | 'dark';

/** A displacement map that bends what is behind the glass near its edges (Chromium only; others skip it). */
function bendMap(w: number, h: number, band: number) {
  const r = 16;
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

/**
 * Lights every glass element in the screen. The sun is far away in the header, so its rays are parallel:
 * direction is the same for every card (CSS). Distance only sets strength (--k), and each card gets an edge
 * bend sized to it.
 */
function useSunlight(screen: React.RefObject<HTMLDivElement | null>, mode: Mode, highlight: number, filterPrefix: string) {
  useLayoutEffect(() => {
    const root = screen.current;
    if (!root) return;
    const svg = root.querySelector<SVGSVGElement>('.lh-filters');
    const NS = 'http://www.w3.org/2000/svg';
    const update = () => {
      const s = root.getBoundingClientRect();
      const sunX = s.right;
      const sunY = s.top;
      const d0 = s.width * 0.55;
      const peak = mode === 'dark' ? 0.88 * highlight : 1;
      if (svg) svg.replaceChildren();
      root.querySelectorAll<HTMLElement>('.lh-glass').forEach((card, i) => {
        const b = card.getBoundingClientRect();
        const px = Math.max(b.left, Math.min(sunX, b.right));
        const py = Math.max(b.top, Math.min(sunY, b.bottom));
        const dist = Math.hypot(sunX - px, sunY - py);
        card.style.setProperty('--k', (peak / (1 + (dist / d0) ** 2)).toFixed(3));
        const small = card.classList.contains('lh-glass--small');
        if (!svg || small) return;
        const w = Math.round(card.offsetWidth);
        const h = Math.round(card.offsetHeight);
        const id = `${filterPrefix}-bend-${i}`;
        const f = document.createElementNS(NS, 'filter');
        for (const [k, v] of [['id', id], ['filterUnits', 'userSpaceOnUse'], ['primitiveUnits', 'userSpaceOnUse'], ['x', '0'], ['y', '0'], ['width', `${w}`], ['height', `${h}`], ['color-interpolation-filters', 'sRGB']])
          f.setAttribute(k, v);
        const img = document.createElementNS(NS, 'feImage');
        for (const [k, v] of [['href', bendMap(w, h, 32)], ['x', '0'], ['y', '0'], ['width', `${w}`], ['height', `${h}`], ['preserveAspectRatio', 'none'], ['result', 'map']])
          img.setAttribute(k, v);
        const dm = document.createElementNS(NS, 'feDisplacementMap');
        for (const [k, v] of [['in', 'SourceGraphic'], ['in2', 'map'], ['scale', '30'], ['xChannelSelector', 'R'], ['yChannelSelector', 'G']])
          dm.setAttribute(k, v);
        f.append(img, dm);
        svg.append(f);
        card.style.setProperty('--lh-bend', `url(#${id})`);
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(root);
    return () => ro.disconnect();
  }, [screen, mode, highlight, filterPrefix]);
}

function Glass({ small = false, children }: { small?: boolean; children: ReactNode }) {
  return (
    <div className={`lh-glass${small ? ' lh-glass--small' : ''}`}>
      <span className="lh-glass__frost" aria-hidden="true" />
      <div className="lh-glass__content">{children}</div>
    </div>
  );
}

/** One area's screen: its marble, two glass cards and the real controls. */
export function AreaScreen({ area, mode }: { area: Area; mode: Mode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefix = useId().replace(/:/g, '');
  useSunlight(ref, mode, area.highlight, prefix);
  const marble = `url('${area.texture}')`;
  const layer = `color-mix(in srgb, ${area.layer} ${Math.round(area.layerAlpha * 100)}%, transparent)`;
  const style = {
    backgroundImage:
      mode === 'dark'
        ? `linear-gradient(${layer}, ${layer}), ${marble}`
        : `radial-gradient(70% 60% at 100% 0%, rgb(253 251 241 / 0.42), rgb(253 251 241 / 0) 70%), radial-gradient(140% 120% at 100% 0%, rgb(42 38 37 / 0) 35%, rgb(42 38 37 / 0.12) 100%), ${marble}`,
    '--lh-frost': area.frost,
    '--lh-shadow': mode === 'dark' ? area.shadowDark : area.shadowLight,
  } as CSSProperties;
  const title = area.name === 'Dashboard' ? 'Good evening' : area.name;
  return (
    <div ref={ref} className="lh-screen" data-theme="life-hub" data-mode={mode} style={style} aria-label={`${area.name}, ${mode} mode`} role="region">
      <svg className="lh-filters" width="0" height="0" aria-hidden="true" focusable="false" />
      <Glass>
        <h3 className="lh-title">{title}</h3>
        <p className="lh-body">Three things due this week.</p>
        <p className="lh-meta">Updated 2 hours ago</p>
        <Callout tone="due" className="lh-callout">
          Water bill due in 3 days
        </Callout>
        <div className="lh-actions">
          <Button variant="primary">Add task</Button>
          <Button variant="secondary">Compare</Button>
          <Button variant="tertiary">See all</Button>
        </div>
      </Glass>
      <Glass small>
        <p className="lh-meta">Next up</p>
        <h3 className="lh-title lh-title--small">Water bill due Friday</h3>
        <p className="lh-data">$84.20 · Oct 10 · 3 of 12 paid</p>
      </Glass>
    </div>
  );
}
