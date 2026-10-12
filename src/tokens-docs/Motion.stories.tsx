import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Button } from '../components/button/button';
import './motion-docs.css';

const meta: Meta = { title: 'Foundations/Motion' };
export default meta;

const code: CSSProperties = { fontFamily: 'var(--font-family-data)', fontSize: 'var(--type-body-small-size)', color: 'var(--color-ink-secondary)' };
const note: CSSProperties = { margin: 0, color: 'var(--color-ink-secondary)', maxWidth: '60ch' };
const h: CSSProperties = { margin: 0, fontFamily: 'var(--font-family-heading, inherit)', fontSize: 'var(--type-heading-small-size, 1.25rem)' };

const steps: [string, string, string, string][] = [
  ['instant', '80ms', 'Press', 'var(--motion-easing-out)'],
  ['fast', '140ms', 'Hover, color changes, a switch', 'var(--motion-easing-out)'],
  ['base', '220ms', 'A tab or panel moving into place', 'var(--motion-easing-in-out)'],
  ['slow', '380ms', 'Fading in, a progress bar filling', 'var(--motion-easing-out)'],
];

/** Controls use these steps on every page, in every theme, so a button always feels like a button. Press Play to compare them. */
export const Timing: StoryObj = {
  render: function Timing() {
    const [go, setGo] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
        <div><Button variant="secondary" size="small" onPress={() => setGo((g) => !g)}>{go ? 'Reset' : 'Play'}</Button></div>
        {steps.map(([name, ms, use, ease]) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) 2fr', gap: 'var(--space-4)', alignItems: 'center' }}>
            <div>
              <code style={code}>--motion-duration-{name}</code>
              <div style={note}>{ms}: {use}</div>
            </div>
            <div className={`motion-demo__track${go ? ' motion-demo__track--go' : ''}`} style={{ '--d': `var(--motion-duration-${name})`, '--e': ease } as CSSProperties}>
              <div className="motion-demo__dot" />
            </div>
          </div>
        ))}
        <p style={note}>
          <code style={code}>--motion-easing-out</code> for things entering and hovering. <code style={code}>--motion-easing-in-out</code> for changes that go both ways.{' '}
          <code style={code}>--motion-stagger</code> (60ms) is the step between items in a list.
        </p>
      </div>
    );
  },
};

function MoodPanel({ mood, title, about }: { mood: 'calm' | 'energetic'; title: string; about: string }) {
  const [run, setRun] = useState(0);
  const [won, setWon] = useState(0);
  return (
    <section data-motion={mood} style={{ flex: '1 1 280px', display: 'grid', gap: 'var(--space-4)', alignContent: 'start' }}>
      <h3 style={h}>{title}</h3>
      <p style={note}>{about}</p>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Button variant="secondary" size="small" onPress={() => setRun((r) => r + 1)}>Play arrival</Button>
        <Button variant="secondary" size="small" onPress={() => setWon((w) => w + 1)}>Finish a step</Button>
      </div>
      <div key={run} className={run ? 'motion-demo__play' : undefined} style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {['Junior year', 'Senior year', 'After graduation'].map((s, i) => (
          <div key={s} className="motion-demo__card" style={{ '--i': i } as CSSProperties}>{s}</div>
        ))}
      </div>
      <div style={{ minHeight: 40 }}>
        <span key={won} className={`motion-demo__badge${won ? ' motion-demo__badge--won' : ''}`}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Step done
        </span>
      </div>
    </section>
  );
}

/**
 * Arrivals and celebrations use a mood. Each theme picks its default (After Graduation: energetic, Life Hub: calm),
 * and any page can switch with data-motion="calm" or data-motion="energetic". Controls never change with the mood.
 * With reduced motion turned on, both moods only fade.
 */
export const Moods: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-7)' }}>
      <MoodPanel mood="calm" title="Calm" about="Things settle into place and never bounce. For everyday pages: settings, lists, reading." />
      <MoodPanel mood="energetic" title="Energetic" about="Things snap in, overshoot and settle. Save it for earned moments: a step done, a win, a season unlocking." />
    </div>
  ),
};
