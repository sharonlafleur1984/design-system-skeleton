import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useRef } from 'react';
import { ActionTile, ActionTileGroup } from '../../components/action-tile/action-tile';
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { useGlassLight } from '../../components/glass-light/glass-light';
import { clearArt, imageArt } from '../../components/glass-lens/lens-art';
import { LitContext } from '../../components/material';
import './action-tile-surface.css';

// Review layout: neutral first, then Life Hub, then After Graduation, each in light mode, dark mode
// and on a busy pattern. Every panel is the same page frame at real size, with the light at the same
// spot (the shared light tokens), so the only difference between panels is the variant and theme.

const meta: Meta = {
  title: 'Explorations/Action tile variants',
  // Made for one theme, so the visual check screenshots it in that theme only.
  tags: ['only:after-graduation'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Action tile in two variants: **light** for light backgrounds and **dark** for dark ones, each with rest, chosen and disabled. Chosen tiles use a pale tint of the brand color, the color of where you are (Life Hub: the area’s color; After Graduation: its crimson; Neutral: gray), in both modes, so the primary button stays the strongest thing on the page. Locked replaces disabled: a lock, the word Locked, and why. Same page frame and light in every panel. Light mode is day: light fades with distance. Dark mode uses the glass of After Graduation’s header tiles in every product. Oct 14: each panel adds a row of Glass tiles drawn by the lens and lit by the page\'s sun (move it to see); on Life Hub\'s marble the lens bends the marble.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

type Mode = 'light' | 'dark' | 'pattern';
const products = [
  { name: 'Neutral', theme: 'life-hub', extra: 'ats-neutral' },
  { name: 'Life Hub (Finance area)', theme: 'life-hub', extra: 'ats-lifehub' },
  { name: 'After Graduation', theme: 'after-graduation', extra: 'ats-aftergrad' },
] as const;
const modes: { id: Mode; name: string }[] = [
  { id: 'light', name: 'Light mode' },
  { id: 'dark', name: 'Dark mode' },
  { id: 'pattern', name: 'Busy pattern' },
];

// Locked replaces disabled: the label says Locked with a lock icon, the description says why.
// Full contrast and full lighting; it stays reachable so the reason can be read.
function Locked() {
  return (
    <span className="ats-locked" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      Locked
    </span>
  );
}

function Frame({ theme, extra, mode, label }: { theme: string; extra: string; mode: Mode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const night = mode === 'dark';
  // Oct 14: a row of Glass tiles under the Default ones, drawn by the lens and lit by the page's sun. On
  // Life Hub's marble the lens bends the marble; elsewhere the glass is clear and only its light shows.
  const marble = extra === 'ats-lifehub' && mode !== 'pattern';
  const lens = useMemo(
    () => ({ art: marble ? imageArt({ src: 'texture-sage-cream.jpg', overlay: night ? 'var(--color-area-finance-night)' : undefined }) : clearArt() }),
    [marble, night],
  );
  useGlassLight(ref, { selector: '.ds-glass', lens, reach: 6 });
  const variant = night ? 'ats-dark' : 'ats-light';
  return (
    <div
      ref={ref}
      className={`ats-frame ${night ? 'ats-night' : 'ats-day'} ${mode === 'pattern' ? 'ats-pattern' : 'ats-page'} ${extra}`}
      data-theme={theme}
      data-mode={night ? 'dark' : 'light'}
    >
      <LitContext.Provider value>
        <div className={variant}>
          <ActionTileGroup aria-label={label}>
            <ActionTile data-state="chosen" label="Chosen" title="Explore Schools" description="Select your favorites" onPress={() => {}} />
            <ActionTile label="Rest" title="Financial Planning" description="How will you pay for it?" onPress={() => {}} />
            <ActionTile label={<Locked />} title="Important Dates" description="Opens after you pick your schools" onPress={() => {}} />
          </ActionTileGroup>
        </div>
        <ActionTileGroup aria-label={`${label}, glass`}>
          <ActionTile material="glass" data-state="chosen" label="Chosen" title="Explore Schools" description="Select your favorites" onPress={() => {}} />
          <ActionTile material="glass" label="Rest" title="Financial Planning" description="How will you pay for it?" onPress={() => {}} />
          <ActionTile material="glass" label={<Locked />} title="Important Dates" description="Opens after you pick your schools" onPress={() => {}} />
        </ActionTileGroup>
      </LitContext.Provider>
      <Card variant="translucent">
        <p style={{ margin: 0 }}>A card on the same page, lit by the same light.</p>
      </Card>
      <div className="ats-actions">
        <Button variant="primary">Continue</Button>
      </div>
    </div>
  );
}

function Review() {
  return (
    <div className="ats-stack">
      {products.map((p) => (
        <section key={p.name} aria-label={p.name} className="ats-stack">
          <h2 className="ats-group-title">{p.name}</h2>
          {modes.map((m) => (
            <div key={m.id}>
              <p className="ats-label">{m.name}</p>
              <Frame theme={p.theme} extra={p.extra} mode={m.id} label={`${p.name}, ${m.name}`} />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

/** Chosen is a pale tint of the brand color, in both modes, so the primary button stays the strongest thing on the page. */
export const BrandTint: Story = { name: 'Brand tint', render: () => <Review /> };

function DarkChoice() {
  return (
    <div className="ats-stack">
      {products.map((p) => (
        <section key={p.name} aria-label={p.name}>
          <h2 className="ats-group-title">{p.name}, dark mode</h2>
          <div className="ats-side">
            <div>
              <p className="ats-label">Pale tint (same as light mode)</p>
              <Frame theme={p.theme} extra={p.extra} mode="dark" label={`${p.name}, pale`} />
            </div>
            <div className="ats-deep">
              <p className="ats-label">Deep tint (mirror of light mode)</p>
              <Frame theme={p.theme} extra={p.extra} mode="dark" label={`${p.name}, deep`} />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

/** Dark mode only: chosen as a pale tint (left) or a deep tint from the same ramp (right), next to the primary button. */
export const DarkChoice_: Story = { name: 'Dark mode: pale or deep', render: () => <DarkChoice /> };
