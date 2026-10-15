import type { Meta, StoryObj } from '@storybook/react-vite';
import { useContext, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { ThemeContext, singleTheme, themeList, themeNames } from '../components/story-helpers';
import { Button } from '../components/button/button';
import { Body, Heading, Label } from '../components/text/text';
import { Select } from '../components/select/select';
import { Tab, TabList, TabPanel, Tabs } from '../components/tabs/tabs';
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

const steps: [string, string, string, string, string][] = [
  ['instant', 'Instant', '80ms', 'A press', 'var(--motion-easing-out)'],
  ['fast', 'Fast', '140ms', 'Hover, a color change, a switch', 'var(--motion-easing-out)'],
  ['base', 'Base', '220ms', 'A tab or panel moving into place', 'var(--motion-easing-in-out)'],
  ['slow', 'Slow', '380ms', 'Fading in, a progress bar filling', 'var(--motion-easing-out)'],
];

const curves: [string, string, string][] = [
  ['out', 'Arriving', 'Starts fast and lands softly. Things entering, and hover.'],
  ['in', 'Leaving', 'Starts slowly and speeds away. Things closing or being removed.'],
  ['in-out', 'Back and forth', 'Speeds up, then slows down. Changes that can go either way, like a switch or a tab.'],
];

const moods = {
  calm: { title: 'Calm', about: 'Things settle into place and never bounce. For everyday pages: settings, lists, reading.' },
  energetic: { title: 'Energetic', about: 'Things snap in, overshoot a little and settle. For earned moments, like finishing something.' },
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

const useThemeName = () => themeNames[singleTheme(useContext(ThemeContext))];

/** A label, a heading and a line of text, each in the theme's own type styles. */
function Intro({ label, title, about }: { label: string; title: string; about: string }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
      <Label>{label}</Label>
      <Heading level={3} variant="heading">
        {title}
      </Heading>
      <Body>{about}</Body>
    </div>
  );
}

/**
 * One set of buttons for the demos beside it, so both play at the same moment: two motions are only
 * comparable side by side, while the first is still fresh. The labels say what you'll see.
 */
function useDemoControls() {
  const [arrive, setArrive] = useState(0);
  const [celebrate, setCelebrate] = useState(0);
  const controls = (
    <div role="group" aria-label="Show the motion" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <Button icon={playIcon} onPress={() => setArrive((n) => n + 1)}>
        Show arrival
      </Button>
      <Button variant="secondary" icon={checkIcon} onPress={() => setCelebrate((n) => n + 1)}>
        Show celebration
      </Button>
    </div>
  );
  return { controls, arrive, celebrate };
}

/** The demo: three items that arrive, and a badge that celebrates. */
function Demo({ mood, arrive, celebrate, reduced = false }: { mood: Mood; arrive: number; celebrate: number; reduced?: boolean }) {
  return (
    <div data-motion={mood} className={reduced ? 'motion-demo--reduced' : undefined} style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <div key={arrive} className={arrive ? 'motion-demo__play' : undefined} style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {['Item 1', 'Item 2', 'Item 3'].map((s, i) => (
          <div key={s} className="motion-demo__card" style={{ '--i': i } as CSSProperties}>
            {s}
          </div>
        ))}
      </div>
      <div style={{ minHeight: 40 }}>
        <span key={celebrate} className={`motion-demo__badge${celebrate ? ' motion-demo__badge--won' : ''}`}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
            <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Done
        </span>
      </div>
    </div>
  );
}

// Two columns whose demos start on the same line, whatever the length of the text above them, so the
// motions line up for comparing. Narrow screens stack them.
const pair: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', columnGap: 'var(--space-6)', rowGap: 'var(--space-4)' };
const half: CSSProperties = { display: 'grid', gridTemplateRows: 'subgrid', gridRow: 'span 2', rowGap: 'var(--space-4)', alignContent: 'start' };

/** How long controls take to move, and how their speed changes along the way. The same in every theme, so it's shown once. Press Play to run every row at once and compare them. */
export const Timing: StoryObj = {
  parameters: { compareAll: false },
  render: function Timing() {
    const [go, setGo] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
        <div>
          <Button variant="secondary" icon={playIcon} onPress={() => setGo((g) => !g)}>
            {go ? 'Reset' : 'Play'}
          </Button>
        </div>
        {steps.map(([token, name, ms, use, ease]) => (
          <div key={token} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: 'var(--space-4)', alignItems: 'center' }}>
            <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
              <Body>
                <strong>{name}, {ms}:</strong> {use}
              </Body>
              <code style={code}>--motion-duration-{token}</code>
            </div>
            <div className={`motion-demo__track${go ? ' motion-demo__track--go' : ''}`} style={{ '--d': `var(--motion-duration-${token})`, '--e': ease } as CSSProperties}>
              <div className="motion-demo__dot" />
            </div>
          </div>
        ))}
        <Label>Curves: how speed changes along the way</Label>
        {curves.map(([token, name, use]) => (
          <div key={token} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: 'var(--space-4)', alignItems: 'center' }}>
            <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
              <Body>
                <strong>{name}:</strong> {use}
              </Body>
              <code style={code}>--motion-easing-{token}</code>
            </div>
            <div className={`motion-demo__track${go ? ' motion-demo__track--go' : ''}`} style={{ '--d': 'var(--motion-duration-slow)', '--e': `var(--motion-easing-${token})` } as CSSProperties}>
              <div className="motion-demo__dot" />
            </div>
          </div>
        ))}
        <p style={note}>
          Items in a list arrive <code style={code}>--motion-stagger</code> (60ms) apart.
        </p>
      </div>
    );
  },
};

/** One theme's card: its name, its mood and what that means, then the demo, all in the theme's own look. */
function MoodCard({ theme, arrive, celebrate }: { theme: string; arrive: number; celebrate: number }) {
  const name = themeNames[theme];
  const [ref, mood] = useThemeMood(theme);
  const other: Mood = mood === 'calm' ? 'energetic' : 'calm';
  return (
    <section
      ref={ref}
      data-theme={theme}
      aria-label={name}
      style={{
        display: 'grid',
        gridTemplateRows: 'subgrid',
        gridRow: 'span 4',
        rowGap: 'var(--space-4)',
        padding: 'var(--space-5)',
        borderRadius: 'var(--corner-panel)',
        background: 'var(--story-bg-page, var(--color-surface-page))',
        color: 'var(--color-ink-primary)',
        boxShadow: '0 0 0 1px #d9d9d9',
      }}
    >
      <h3 style={{ margin: 0, font: '700 22px/1.2 system-ui, sans-serif', color: 'inherit' }}>{name}</h3>
      <Intro label="Default mood" title={moods[mood].title} about={moods[mood].about} />
      <Demo mood={mood} arrive={arrive} celebrate={celebrate} />
      {/* The other mood is there when someone wants it, without making every card twice as long. */}
      <details className="motion-demo__more">
        <summary>
          <Label>Show the other mood</Label>
        </summary>
        <div style={{ display: 'grid', gap: 'var(--space-4)', marginBlockStart: 'var(--space-3)' }}>
          <Intro label="When a page asks for it" title={moods[other].title} about={`${moods[other].about} Turned on with data-motion="${other}".`} />
          <Demo mood={other} arrive={arrive} celebrate={celebrate} />
        </div>
      </details>
    </section>
  );
}

/**
 * How things arrive and celebrate: each theme has a default mood, calm or energetic. Pick Compare all to see
 * every theme side by side; one set of buttons plays every card at once. Any page can ask for the other mood
 * with data-motion. Controls never change with the mood.
 */
export const Moods: StoryObj = {
  // Shows only the theme picked above, and every theme as cards side by side with Compare all.
  parameters: { compareAll: false },
  render: function Moods() {
    const choice = useContext(ThemeContext);
    const { controls, arrive, celebrate } = useDemoControls();
    return (
      <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
        {controls}
        {/* One theme keeps the card's compare-view width, so it reads the same either way. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', maxInlineSize: choice === 'both' ? undefined : '400px' }}>
          {(choice === 'both' ? themeList : [singleTheme(choice)]).map((theme) => (
            <ThemeContext.Provider key={theme} value={theme}>
              <MoodCard theme={theme} arrive={arrive} celebrate={celebrate} />
            </ThemeContext.Provider>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Menus, popovers, dialogs and tooltips fade in and grow a little from where they were opened, then close
 * quicker on the leaving curve. They use React Aria's own opening and closing moments
 * ([React Aria: animation](https://react-spectrum.adobe.com/react-aria/styling.html#animation)). The same in every theme.
 */
export const OpenAndClose: StoryObj = {
  name: 'Open and close',
  parameters: { compareAll: false },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)', maxInlineSize: '420px' }}>
      <Intro
        label="Opening, then closing"
        title="220ms in, 140ms out"
        about="Open the menu and pick an option to see both. Closing is quicker, because the person is already done with it."
      />
      <Select
        label="Option"
        placeholder="Open the menu"
        options={[
          { id: 'one', label: 'Option 1' },
          { id: 'two', label: 'Option 2' },
          { id: 'three', label: 'Option 3' },
        ]}
      />
      <code style={code}>--motion-open-duration, --motion-open-scale, --motion-close-duration</code>
    </div>
  ),
};

/** When tabs or action tiles change what's shown, the new content fades in, so the change isn't abrupt. The same in every theme. */
export const SwitchingViews: StoryObj = {
  name: 'Switching views',
  parameters: { compareAll: false },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)', maxInlineSize: '560px' }}>
      <Intro label="Switching" title="A 140ms fade" about="Pick a tab to see the new content fade in. Nothing slides, so it's kept with Reduce motion." />
      <Tabs>
        <TabList aria-label="Views">
          <Tab id="one">Tab 1</Tab>
          <Tab id="two">Tab 2</Tab>
          <Tab id="three">Tab 3</Tab>
        </TabList>
        {['one', 'two', 'three'].map((id, i) => (
          <TabPanel key={id} id={id}>
            <Body>Content for tab {i + 1}.</Body>
          </TabPanel>
        ))}
      </Tabs>
      <code style={code}>--motion-switch-duration</code>
    </div>
  ),
};

/** A button that's busy shows a spinner, one turn every 800ms, and can't be pressed twice. The same in every theme. */
export const Loading: StoryObj = {
  parameters: { compareAll: false },
  render: function Loading() {
    const [busy, setBusy] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 'var(--space-5)', maxInlineSize: '420px' }}>
        <Intro label="Waiting" title="One turn every 800ms" about="Press the button to see it load for two seconds." />
        <div>
          <Button
            isPending={busy}
            onPress={() => {
              setBusy(true);
              setTimeout(() => setBusy(false), 2000);
            }}
          >
            Save
          </Button>
        </div>
        <code style={code}>--motion-spin-duration</code>
      </div>
    );
  },
};

/**
 * What changes when someone turns on Reduce motion in their device settings
 * ([where to find it on each device, MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)).
 * Beside the theme's default, one set of buttons plays both. Controls keep their short fades, so a change is never silent.
 */
export const ReducedMotion: StoryObj = {
  name: 'Reduced motion',
  // The same in every theme, so it's shown once, in the theme picked above.
  parameters: { compareAll: false },
  render: function ReducedMotion() {
    const theme = useThemeName();
    const [ref, own] = useThemeMood(theme);
    const { controls, arrive, celebrate } = useDemoControls();
    return (
      <div ref={ref} style={{ display: 'grid', gap: 'var(--space-5)' }}>
        {controls}
        <div style={pair}>
          <section style={half}>
            <Intro label="Default" title={moods[own].title} about={`How ${theme} moves for most people.`} />
            <Demo mood={own} arrive={arrive} celebrate={celebrate} />
          </section>
          <section style={half}>
            <Intro
              label="When someone turns on Reduce motion"
              title="Fade only"
              about="Nothing slides, bounces or grows. The setting is under Accessibility: Motion on iPhone and iPad, Display on a Mac, Visual effects on Windows."
            />
            <Demo mood={own} arrive={arrive} celebrate={celebrate} reduced />
          </section>
        </div>
      </div>
    );
  },
};
