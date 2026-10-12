import type { Meta, StoryObj } from '@storybook/react-vite';
import { useContext, type CSSProperties, type ReactNode } from 'react';
import { ThemeContext } from '../../components/story-helpers';

// Exploration, not in the library yet: After Graduation's reds moved from cherry to crimson, and a
// status set tuned to it. Values are proposals for Sharon to approve; nothing here changes a token.
// Crimson keeps each step's lightness and chroma from the cherry ramp (OKLCH) at crimson's hue (24°),
// with the darker steps a little deeper for a richer red. Error moves from 25° to 40° (rust), because
// crimson and the old error red were the same hue.

const meta: Meta = {
  title: 'Explorations/After Graduation crimson',
  parameters: {
    docs: {
      description: {
        component:
          'Proposal: After Graduation\'s reds move from cherry to crimson, and its status colors are tuned to match. Today on the left, proposed on the right. After Graduation only.',
      },
    },
  },
};
export default meta;

const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const cherry = ['#fef2f2', '#ffdfe1', '#febdc2', '#ff8d9a', '#f25771', '#d03656', '#a92141', '#83162f', '#5f0d21'];
const crimson = ['#fef2f1', '#fee0dd', '#ffbeb9', '#fe908a', '#f25857', '#cb1b2c', '#a50c1f', '#810817', '#5a050d'];

type Status = { name: string; surface: string; accent: string; ink: string; icon: string };
const statusToday: Status[] = [
  { name: 'Error', surface: '#fce8e5', accent: '#cc584d', ink: '#963130', icon: '!' },
  { name: 'Warning', surface: '#fdf5e2', accent: '#dba034', ink: '#6b4815', icon: '▲' },
  { name: 'Success', surface: '#e8f4ec', accent: '#44a06d', ink: '#215838', icon: '✓' },
  { name: 'Info', surface: '#ebf0fa', accent: '#5173b8', ink: '#364c78', icon: 'i' },
];
const statusProposed: Status[] = [
  { name: 'Error', surface: '#fbe9e2', accent: '#ca5d34', ink: '#94360e', icon: '!' },
  { name: 'Warning', surface: '#fff4e7', accent: '#e19c3a', ink: '#6b4815', icon: '▲' },
  { name: 'Success', surface: '#e9f4eb', accent: '#4d9f67', ink: '#255835', icon: '✓' },
  { name: 'Info', surface: '#ebf0fa', accent: '#4f74b8', ink: '#354c78', icon: 'i' },
];

const h3: CSSProperties = { margin: 0, fontSize: 'var(--type-heading-title-size)', fontWeight: 'var(--font-weight-semibold)' as CSSProperties['fontWeight'] };
const small: CSSProperties = { fontFamily: 'var(--font-family-data)', fontSize: 'var(--type-body-small-size)', color: 'var(--color-ink-secondary)' };
const col: CSSProperties = { flex: '1 1 320px', display: 'grid', gap: 'var(--space-4)', alignContent: 'start' };

function Side({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={col}>
      <h3 style={h3}>{title}</h3>
      {children}
    </section>
  );
}
function Pair({ left, right }: { left: ReactNode; right: ReactNode }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-7)' }}>{left}{right}</div>;
}
function AfterGraduationOnly({ children }: { children: ReactNode }) {
  return useContext(ThemeContext) === 'life-hub' ? <p>After Graduation only. Switch the theme in the toolbar to see it.</p> : <>{children}</>;
}

function Ramp({ colors }: { colors: string[] }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
      {colors.map((c, i) => (
        <div key={c} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={small}>{steps[i]}</span>
          <div style={{ padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-xs)', background: c, color: i >= 5 ? '#ffffff' : '#1d1a18', fontFamily: 'var(--font-family-data)', fontSize: 'var(--type-body-small-size)' }}>
            {c}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The red ramp. Same steps and names, so components don't change. 600 is the button and header red. */
export const Reds: StoryObj = {
  render: () => (
    <AfterGraduationOnly>
      <Pair left={<Side title="Today: cherry"><Ramp colors={cherry} /></Side>} right={<Side title="Proposed: crimson"><Ramp colors={crimson} /></Side>} />
    </AfterGraduationOnly>
  ),
};

function Header({ reds }: { reds: string[] }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <div
        style={{
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-panel)',
          color: '#ffffff',
          background: `radial-gradient(120% 140% at 85% 100%, ${reds[5]}, ${reds[6]} 55%, ${reds[7]})`,
        }}
      >
        <div style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--type-display-m-size)', fontWeight: 700 }}>After Graduation</div>
        <div style={{ marginBlockStart: 'var(--space-2)', color: '#fcc687', fontWeight: 600 }}>Get ready for Season 2</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
        <span style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-button)', background: reds[5], color: '#ffffff', fontWeight: 600 }}>Main button</span>
        <span style={{ color: reds[6], textDecoration: 'underline', fontWeight: 600 }}>A link</span>
        <span style={{ padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-chip)', background: reds[1], color: reds[7], fontWeight: 600 }}>Chosen chip</span>
      </div>
    </div>
  );
}

/** The header, a main button, a link and a chip, in each red. The subtitle is gold-300, already in the library. */
export const InUse: StoryObj = {
  render: () => (
    <AfterGraduationOnly>
      <Pair left={<Side title="Today: cherry"><Header reds={cherry} /></Side>} right={<Side title="Proposed: crimson"><Header reds={crimson} /></Side>} />
    </AfterGraduationOnly>
  ),
};

function StatusList({ set, reds }: { set: Status[]; reds: string[] }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      {set.map((s) => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-card)', background: s.surface, color: s.ink }}>
          <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', inlineSize: 24, blockSize: 24, borderRadius: '50%', background: s.accent, color: '#ffffff', fontWeight: 700, fontSize: 13 }}>{s.icon}</span>
          <strong>{s.name}</strong>
          <span style={{ ...small, color: s.ink }}>{s.accent}</span>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBlockStart: 'var(--space-2)' }}>
        <span style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-button)', background: reds[5], color: '#ffffff', fontWeight: 600 }}>Main button</span>
        <span style={small}>next to the error color</span>
      </div>
    </div>
  );
}

/** Status colors. Error moves to rust so it never looks like the crimson button; the others shift slightly to sit with the gold. */
export const Status: StoryObj = {
  render: () => (
    <AfterGraduationOnly>
      <Pair
        left={<Side title="Today: shared set, cherry"><StatusList set={statusToday} reds={cherry} /></Side>}
        right={<Side title="Proposed: After Graduation set, crimson"><StatusList set={statusProposed} reds={crimson} /></Side>}
      />
    </AfterGraduationOnly>
  ),
};
