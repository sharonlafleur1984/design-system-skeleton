import { useMemo, useRef, type CSSProperties } from 'react';
import { useGlassLight } from '../../components/glass-light/glass-light';
import { imageArt } from '../../components/glass-lens/lens-art';
import { Button } from '../../components/button/button';
import { Callout } from '../../components/callout/callout';
import { Card } from '../../components/card/card';
import type { Area } from './areas';
import './glass-cards.css';

// Exploration only, not exported from the library. Shows Life Hub's glass cards on each area's marble,
// lit by the page's one light (the sun at the top right in Storybook). Oct 14: the cards are the real
// Card with material="glass", drawn by the lens, which bends the area's marble at their edges. In the
// library, lens glass is for empty cards only (D42); here it's on full cards to see how it looks.
// Controls are the real React Aria components.

export type Mode = 'light' | 'dark';

/** One area's screen: its marble, two glass cards and the real controls. */
export function AreaScreen({ area, mode }: { area: Area; mode: Mode }) {
  const ref = useRef<HTMLDivElement>(null);
  const marble = `url('${area.texture}')`;
  const layer = `color-mix(in srgb, ${area.layer} ${Math.round(area.layerAlpha * 100)}%, transparent)`;
  // The lens paints the same marble (and, at night, the same layer) and bends it at each card's edge.
  const lens = useMemo(() => ({ art: imageArt({ src: area.texture, overlay: mode === 'dark' ? layer : undefined }) }), [area.texture, mode, layer]);
  useGlassLight(ref, { selector: '.ds-glass', lens, reach: 6, peak: mode === 'dark' ? 0.88 * area.highlight : 1 });
  const style = {
    backgroundImage:
      mode === 'dark'
        ? `linear-gradient(${layer}, ${layer}), ${marble}`
        : `radial-gradient(70% 60% at calc(100% - var(--light-from-right)) var(--light-top), rgb(253 251 241 / 0.42), rgb(253 251 241 / 0) 70%), radial-gradient(140% 120% at calc(100% - var(--light-from-right)) var(--light-top), rgb(42 38 37 / 0) 35%, rgb(42 38 37 / 0.12) 100%), ${marble}`,
    '--lh-frost': area.frost,
    '--lh-shadow': mode === 'dark' ? area.shadowDark : area.shadowLight,
  } as CSSProperties;
  const title = area.name === 'Dashboard' ? 'Good evening' : area.name;
  return (
    <div ref={ref} className="lh-screen" data-theme="life-hub" data-mode={mode} style={style} aria-label={`${area.name}, ${mode} mode`} role="region">
      <Card material="glass" className="lh-card">
        <h3 className="lh-title">{title}</h3>
        <p className="lh-body">Three things due this week.</p>
        <p className="lh-meta">Updated 2 hours ago</p>
        <Callout tone="warning" className="lh-callout">
          Water bill due in 3 days
        </Callout>
        <div className="lh-actions">
          <Button variant="primary">Add task</Button>
          <Button variant="secondary">Compare</Button>
          <Button variant="tertiary">See all</Button>
        </div>
      </Card>
      <Card material="glass" className="lh-card lh-card--small">
        <p className="lh-meta">Next up</p>
        <h3 className="lh-title lh-title--small">Water bill due Friday</h3>
        <p className="lh-data">$84.20 · Oct 10 · 3 of 12 paid</p>
      </Card>
    </div>
  );
}
