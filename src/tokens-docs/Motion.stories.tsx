import type { Meta, StoryObj } from '@storybook/react-vite';
import { useContext, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Description, Stories, Title } from '@storybook/addon-docs/blocks';
import { DocsThemePicker } from '../../.storybook/theme-picker';
import { ThemeContext, singleTheme, themeNames } from '../components/story-helpers';
import { Button } from '../components/button/button';
import { Card, CardBody, CardHeader } from '../components/card/card';
import { Select } from '../components/select/select';
import { Switch } from '../components/switch/switch';
import { Tab, TabList, TabPanel, Tabs } from '../components/tabs/tabs';
import { Label } from '../components/text/text';
import { ToggleButton, ToggleButtonGroup } from '../components/toggle-button-group/toggle-button-group';
import './motion-docs.css';

// The Motion page, laid out the way Atlassian and Carbon show motion: real moments to try, each with its
// timing, behind two switches (the mood, and Reduce motion), then the tokens for engineers.
// https://atlassian.design/foundations/motion, https://carbondesignsystem.com/elements/motion/overview

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
      description: { component: 'How things move in each theme. Try each motion, then find its token below.' },
      page: MotionPage,
    },
  },
};
export default meta;

type Mood = 'calm' | 'energetic';
const moodName: Record<Mood, string> = { calm: 'Calm', energetic: 'Energetic' };

/** The theme's default mood, read from its tokens: its arrival curve is one mood's curve. */
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

/** Turns Reduce motion on for the page while `on`, exactly as the device setting would. */
function useReduceMotion(on: boolean) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (on) root.setAttribute('data-reduce-motion', '');
    return () => root.removeAttribute('data-reduce-motion');
  }, [on]);
}

const playIcon = (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 3.5v9l7.5-4.5z" />
  </svg>
);

/** One moment: a card with its name, its timing and the real thing to try. */
function Moment({ title, timing, children }: { title: string; timing: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader label={timing} title={title} level={3} />
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function PlayButton({ onPress }: { onPress: () => void }) {
  return (
    <Button size="small" variant="secondary" icon={playIcon} onPress={onPress}>
      Play
    </Button>
  );
}

function Arrival() {
  const [run, setRun] = useState(0);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', justifyItems: 'start' }}>
      <PlayButton onPress={() => setRun((n) => n + 1)} />
      <div key={run} className={run ? 'motion-demo__play' : undefined} style={{ display: 'grid', gap: 'var(--space-2)', justifySelf: 'stretch' }}>
        {['Item 1', 'Item 2', 'Item 3'].map((s, i) => (
          <div key={s} className="motion-demo__card" style={{ '--i': i } as CSSProperties}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function Celebration() {
  const [run, setRun] = useState(0);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', justifyItems: 'start' }}>
      <PlayButton onPress={() => setRun((n) => n + 1)} />
      <span key={run} className={`motion-demo__badge${run ? ' motion-demo__badge--won' : ''}`}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
          <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Done
      </span>
    </div>
  );
}

function Loading() {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      isPending={busy}
      onPress={() => {
        setBusy(true);
        setTimeout(() => setBusy(false), 2000);
      }}
    >
      Save
    </Button>
  );
}

const moodTiming: Record<Mood, { arrive: string; celebrate: string }> = {
  calm: { arrive: '380ms · Settles in', celebrate: '380ms · Grows a little' },
  energetic: { arrive: '480ms · Overshoots, then settles', celebrate: '560ms · Pops' },
};

const controlRow: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3) var(--space-6)' };
const control: CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' };

/** In the theme's own mood. Reduced shows what people see with Reduce motion on: everything fades, nothing moves. */
export const Moments: StoryObj = {
  name: 'Try each motion',
  render: function Moments() {
    const theme = themeNames[singleTheme(useContext(ThemeContext))];
    const [ref, mood] = useThemeMood(theme);
    const [reduced, setReduced] = useState(false);
    useReduceMotion(reduced);
    return (
      <div ref={ref} style={{ display: 'grid', gap: 'var(--space-5)' }}>
        <div style={controlRow}>
          <div style={control}>
            <Label>Motion</Label>
            <ToggleButtonGroup aria-label="Motion" selectedKeys={[reduced ? 'reduced' : 'default']} onSelectionChange={(keys) => setReduced([...keys][0] === 'reduced')}>
              <ToggleButton id="default">Default</ToggleButton>
              <ToggleButton id="reduced">Reduced</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
        <div data-motion={mood} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}>
          <Moment title="Items arriving" timing={reduced ? 'Fade only' : `${moodName[mood]} · ${moodTiming[mood].arrive}`}>
            <Arrival />
          </Moment>
          <Moment title="Celebrating" timing={reduced ? 'Fade only' : `${moodName[mood]} · ${moodTiming[mood].celebrate}`}>
            <Celebration />
          </Moment>
          <Moment title="Menu" timing={reduced ? '220ms in · 140ms out · Fade only' : '220ms in · 140ms out'}>
            <Select
              aria-label="Option"
              placeholder="Open the menu"
              options={[
                { id: 'one', label: 'Option 1' },
                { id: 'two', label: 'Option 2' },
                { id: 'three', label: 'Option 3' },
              ]}
            />
          </Moment>
          <Moment title="Tabs" timing="140ms · Fades in">
            <Tabs>
              <TabList aria-label="Views">
                <Tab id="one">Tab 1</Tab>
                <Tab id="two">Tab 2</Tab>
              </TabList>
              <TabPanel id="one">Content 1</TabPanel>
              <TabPanel id="two">Content 2</TabPanel>
            </Tabs>
          </Moment>
          <Moment title="Switch" timing="140ms · Slides">
            <Switch label="Label" />
          </Moment>
          <Moment title="Loading" timing="800ms a turn">
            <Loading />
          </Moment>
        </div>
      </div>
    );
  },
};

const tokens: [string, string][] = [
  ['--motion-duration-instant', 'A press'],
  ['--motion-duration-fast', 'Hover, a switch, new tab content fading in'],
  ['--motion-duration-base', 'Something moving into place'],
  ['--motion-duration-slow', 'Fading in, a progress bar filling'],
  ['--motion-easing-out', 'Arriving: starts fast, lands softly'],
  ['--motion-easing-in', 'Leaving: starts slowly, speeds away'],
  ['--motion-easing-in-out', 'Back and forth: a switch, a tab'],
  ['--motion-stagger', 'The gap between items arriving in a list'],
  ['--motion-open-duration', 'A menu, dialog or tooltip opening'],
  ['--motion-close-duration', 'A menu, dialog or tooltip closing'],
  ['--motion-switch-duration', 'New content fading in when tabs change'],
  ['--motion-spin-duration', 'One turn of a spinner'],
  ['--motion-arrive-duration', "Items arriving, in the theme's mood"],
  ['--motion-celebrate-duration', "Celebrating, in the theme's mood"],
];

const cell: CSSProperties = { padding: 'var(--space-2) var(--space-3)', borderBlockEnd: '1px solid var(--color-border-subtle)', textAlign: 'start', verticalAlign: 'top' };
const mono: CSSProperties = { fontFamily: 'var(--font-family-data)', fontSize: 'var(--type-body-small-size)' };

/** Every motion token, with its value in the theme picked above. */
export const Tokens: StoryObj = {
  render: function Tokens() {
    const ref = useRef<HTMLTableElement>(null);
    const [values, setValues] = useState<Record<string, string>>({});
    const theme = useContext(ThemeContext);
    useLayoutEffect(() => {
      if (!ref.current) return;
      const style = getComputedStyle(ref.current);
      setValues(Object.fromEntries(tokens.map(([t]) => [t, style.getPropertyValue(t).trim()])));
    }, [theme]);
    return (
      <table ref={ref} style={{ borderCollapse: 'collapse', inlineSize: '100%', color: 'var(--color-ink-primary)', fontFamily: 'var(--font-family-body)', fontSize: 'var(--type-body-small-size)' }}>
        <thead>
          <tr>
            <th style={cell}>Token</th>
            <th style={cell}>Value</th>
            <th style={cell}>Used for</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map(([t, use]) => (
            <tr key={t}>
              <td style={{ ...cell, ...mono }}>{t}</td>
              <td style={{ ...cell, ...mono }}>{values[t]}</td>
              <td style={cell}>{use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
