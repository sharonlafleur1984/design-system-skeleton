import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useGlassLight } from '../../components/glass-light/glass-light';
import '../../components/glass.css';
import { Button } from '../../components/button/button';
import { Callout } from '../../components/callout/callout';
import type { Area } from './areas';
import './glass-cards.css';

// Exploration only, not exported from the library. Shows Life Hub's glass cards on each area's marble,
// lit by one sun at the shared light position (where After Graduation's wheel sits), using the shared
// glass recipe (glass.css) and light helper (useGlassLight). Controls are the real React Aria components.

export type Mode = 'light' | 'dark';

function Glass({ small = false, children }: { small?: boolean; children: ReactNode }) {
  return (
    <div className={`lh-glass${small ? ' lh-glass--small' : ''}`}>
      <span className="lh-glass__frost" aria-hidden="true" />
      <div className="lh-glass__content ds-glass">{children}</div>
    </div>
  );
}

/** One area's screen: its marble, two glass cards and the real controls. */
export function AreaScreen({ area, mode }: { area: Area; mode: Mode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Lit from the shared light position (light-from-right, light-top), where After Graduation's wheel sits.
  useGlassLight(ref, { selector: '.lh-glass__content', band: 32, bend: 15, peak: mode === 'dark' ? 0.88 * area.highlight : 1 });
  const marble = `url('${area.texture}')`;
  const layer = `color-mix(in srgb, ${area.layer} ${Math.round(area.layerAlpha * 100)}%, transparent)`;
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
