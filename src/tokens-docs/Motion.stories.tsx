import type { Meta, StoryObj } from '@storybook/react-vite';
import { useContext, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { CompareAll, ThemeContext, singleTheme, themeNames } from '../components/story-helpers';
import { Button } from '../components/button/button';
import { Body, Heading, Label } from '../components/text/text';
import { Description, Stories, Title } from '@storybook/addon-docs/blocks';
import { DocsThemePicker } from '../../.storybook/theme-picker';
import './motion-docs.css';

function MotionPage() {
  return (
    <>
      <Title />
      <Description />
      <DocsThemePicker />
      <Stories title="" />
    </>
  );
}

const meta: Meta = {
  title: 'Foundations/Motion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: 'How fast things move, and the mood each theme moves in.' },
      // Every section with its heading and note, Timing included: a Foundations page has no Playground to lead with.
      page: MotionPage,
    },
  },
};
export default meta;

const code: CSSProperties = { fontFamily: 'var(--font-family-data)', fontSize: 'var(--type-body-small-size)', color: 'var(--color-ink-secondary)' };
const note: CSSProperties = { margin: 0, color: 'var(--color-ink-secondary)', maxWidth: '60ch' };

const playIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 3.5v9l7.5-4.5z" />
  </svg>
);
const checkIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8.5 6.5 12 13 4.5" />
  </svg>
);

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
        <div><Button variant="secondary" icon={playIcon} onPress={() => setGo((g) => !g)}>{go ? 'Reset' : 'Play'}</Button></div>
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

/**
 * One case: a label saying when it applies, its name, and what happens, each in the theme's own type
 * styles, then a demo. `reduced` shows the demo as it plays with Reduce motion on.
 */
function MoodPanel({ mood, label, title, about, reduced = false }: { mood: 'calm' | 'energetic'; label: string; title: string; about: string; reduced?: boolean }) {
  const [run, setRun] = useState(0);
  const [won, setWon] = useState(0);
  return (
    <section data-motion={mood} className={reduced ? 'motion-demo--reduced' : undefined} style={{ flex: '1 1 280px', display: 'grid', gap: 'var(--space-4)', alignContent: 'start' }}>
      <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
        <Label>{label}</Label>
        <Heading level={3} variant="heading">
          {title}
        </Heading>
        <Body>{about}</Body>
      </div>
      {/* A button set: the label says these are things to try, and real buttons with icons read as actions, not tags. */}
      <div role="group" aria-label="Try it" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Label>Try it</Label>
        <Button icon={playIcon} onPress={() => setRun((r) => r + 1)}>
          Play arrival
        </Button>
        <Button variant="secondary" icon={checkIcon} onPress={() => setWon((w) => w + 1)}>
          Finish something
        </Button>
      </div>
      <div key={run} className={run ? 'motion-demo__play' : undefined} style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {['Item 1', 'Item 2', 'Item 3'].map((s, i) => (
          <div key={s} className="motion-demo__card" style={{ '--i': i } as CSSProperties}>{s}</div>
        ))}
      </div>
      <div style={{ minHeight: 40 }}>
        <span key={won} className={`motion-demo__badge${won ? ' motion-demo__badge--won' : ''}`}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Done
        </span>
      </div>
    </section>
  );
}

const moods = {
  calm: { title: 'Calm', about: 'Things settle into place and never bounce. For everyday pages: settings, lists, reading.' },
  energetic: { title: 'Energetic', about: 'Things snap in, overshoot and settle. For earned moments, like finishing something.' },
} as const;
type Mood = keyof typeof moods;

/** The theme's own mood, read from its tokens: its arrival easing is one mood's easing. */
function useThemeMood(theme: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>('calm');
  useLayoutEffect(() => {
    if (!ref.current) return;
    const style = getComputedStyle(ref.current);
    const arrive = style.getPropertyValue('--motion-arrive-easing').trim();
    setMood(arrive === style.getPropertyValue('--motion-mood-energetic-arrive-easing').trim() ? 'energetic' : 'calm');
  }, [theme]);
  return [ref, mood] as const;
}

function MoodsView() {
  const theme = themeNames[singleTheme(useContext(ThemeContext))];
  const [ref, own] = useThemeMood(theme);
  const other: Mood = own === 'calm' ? 'energetic' : 'calm';
  return (
    <div ref={ref} style={{ display: 'grid', gap: 'var(--space-7)' }}>
      <MoodPanel mood={own} label="Default" title={moods[own].title} about={`${moods[own].about} Every page in ${theme} moves this way unless it asks for the other mood.`} />
      <MoodPanel mood={other} label="When a page asks for it" title={moods[other].title} about={`${moods[other].about} A page turns it on with data-motion="${other}".`} />
    </div>
  );
}

/**
 * Arrivals and celebrations use a mood, calm or energetic. Each theme has a default (Spotlight: energetic,
 * Sunrise: calm, Fireside: energetic for now, borrowed from Spotlight), shown side by side. Under it, the
 * other mood, which any page can ask for with data-motion. Controls never change with the mood.
 */
export const Moods: StoryObj = {
  // Always every theme side by side: comparing them is the point, so the theme picker doesn't change it.
  parameters: { compareAll: false },
  render: () => <CompareAll render={() => <MoodsView />} />,
};

/**
 * When someone turns on Reduce motion in their device settings
 * ([where to find it on each device, MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)),
 * both moods only fade, in every theme. Controls keep their short fades, so a change is never silent.
 */
export const ReducedMotion: StoryObj = {
  name: 'Reduced motion',
  render: () => (
    <MoodPanel
      mood="energetic"
      reduced
      label="When someone turns on Reduce motion"
      title="Fade only"
      about="Both moods only fade: nothing slides, bounces or grows. People turn it on in their device settings, under Accessibility: Motion on iPhone and iPad, Display on a Mac, Visual effects on Windows."
    />
  ),
};
