import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkyHeader } from './sky-header';
import { mixColor, skyAt, type SkyMode } from './sky';
import { skyHourFor, sunTimes, TWILIGHT_MINUTES } from './sun';
import { appearanceFor, fadePageMode, modeLabels, type ModeSetting } from './mode';
import { ToggleButton, ToggleButtonGroup } from '../../components/toggle-button-group/toggle-button-group';
import { Button } from '../../components/button/button';
import { areas } from '../glass-cards/areas';

/** A palette's token name: 'Lilacs & Lavender' is lilacs-lavender. */
const slug = (name: string) => name.toLowerCase().replace(/&/g, ' ').trim().replace(/\s+/g, '-');

// Every marble in the system. The tenth, Future option B, has no area yet, so its night layer is an
// estimate: its darkest tone mixed with Life Hub ink.
const marbles = [
  ...areas.map((a) => ({ name: a.name, texture: a.texture, night: a.layer, nightAlpha: a.layerAlpha, palette: slug(a.palette) })),
  // No palette yet either: berry pie is the closest family to its coral, an estimate.
  { name: 'Future option B', texture: 'texture-future-option-b.jpg', night: mixColor('#dd816c', '#2a2625', 0.65), nightAlpha: 0.86, palette: 'berry-pie' },
];
const marbleNames = marbles.map((m) => m.name);
const findMarble = (name: string) => marbles.find((m) => m.name === name) ?? marbles[0];
/** The marble as a full URL: a relative one inside a custom property would resolve against the stylesheet, not the page. */
const swirlOf = (name: string) => `url('${new URL(findMarble(name).texture, document.baseURI).href}')`;

type Version = 'glass' | 'sky';
const labels: Record<Version, string> = { glass: 'A: glass', sky: 'B: solid sky' };
type Args = { hour: number; background: string; version: Version; edge: 'clean' | 'fade'; light: 'warm' | 'white' };

const meta: Meta<Args> = {
  title: 'Explorations/Life Hub sky header',
  // Made for one theme, so the visual check screenshots it in that theme only.
  tags: ['only:life-hub'],
  // Life Hub only: lock the toolbar's theme so the page around it is Life Hub too.
  globals: { theme: 'life-hub' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Exploration, not in the library yet. The header is a sky that follows the time of day. The orb on Let\'s chat is the light: a small sun by day, warm at sunset, a violet Milky Way glow at night. The greeting and both buttons are the same clear glass as After Graduation\'s episode tabs, lit from the orb. The greeting card hugs its words and glides to a new width when the greeting changes. ' +
          'Play a day moves fast through day and night and slows down for sunrise and sunset. ' +
          'A is a tinted glass panel the marble shows through; B is a solid sky. At night both lean toward the area\'s own night layer, so they match the marble below. ' +
          'Use the Mode switch in the toolbar for light and dark pages. Colors are from the Life Hub palette; positions and strengths are estimates.',
      },
    },
  },
  args: { hour: 18.5, background: 'Dashboard', version: 'glass', edge: 'clean', light: 'warm' },
  argTypes: {
    hour: { control: { type: 'range', min: 0, max: 24, step: 0.25 }, description: 'Hour of the day (18.5 is 6:30 pm)' },
    background: { control: 'select', options: marbleNames },
    edge: { control: { type: 'inline-radio', labels: { clean: 'Clean edge', fade: 'Fade' } }, options: ['clean', 'fade'], description: 'How the header meets the page' },
    light: { control: { type: 'inline-radio', labels: { warm: 'Warm (yellow)', white: 'White' } }, options: ['warm', 'white'], description: 'Daytime light color' },
    version: { control: { type: 'inline-radio', labels: { glass: 'A: glass', sky: 'B: solid sky' } }, options: ['glass', 'sky'] },
  },
};
export default meta;
type Story = StoryObj<Args>;

const copy = {
  name: 'Alexis',
  meta: 'Updated today at 4:12 pm',
  prompt: 'What can I help you knock off your plate today?',
  settingsCount: 2,
};

/** A slice of an area page: its marble, with the night layer over it on dark pages. */
function MarblePage({ background, mode, children }: { background: string; mode?: SkyMode; children: ReactNode }) {
  const m = findMarble(background);
  const layer = `color-mix(in srgb, ${m.night} ${Math.round(m.nightAlpha * 100)}%, transparent)`;
  const style: CSSProperties = {
    // The night layer only shows on dark pages; light pages get the marble as is.
    background: `linear-gradient(var(--page-night, transparent), var(--page-night, transparent)), url('${m.texture}') center / cover`,
    padding: '0 0 var(--space-8)',
    minHeight: 320,
    ['--page-night' as string]: (mode ?? document.documentElement.dataset.mode) === 'dark' ? layer : 'transparent',
  };
  return (
    <div data-theme="life-hub" data-mode={mode} style={style}>
      {children}
    </div>
  );
}

// Today's real sunrise and sunset where you are. The demos run on the real clock: the sky reaches dawn
// and dusk at these times and plays them out in TWILIGHT_MINUTES.
const SUN = sunTimes(new Date());

/** The header at a clock hour: the sky follows the real-clock mapping, the greeting follows the clock. */
const header = (version: Version, hour: number, background: string, edge: 'clean' | 'fade' = 'clean', light: 'warm' | 'white' = 'warm') => (
  <SkyHeader
    {...copy}
    hour={skyHourFor(hour, SUN)}
    greetingHour={hour}
    instant
    material={version}
    edge={edge}
        light={light}
    swirl={swirlOf(background)}
        palette={findMarble(background).palette}
    areaNight={findMarble(background).night}
  />
);

const clockLabel = (hour: number) =>
  new Date(2026, 0, 1, Math.floor(hour), Math.floor((hour % 1) * 60)).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

/**
 * How many seconds the demo spends on each clock hour. Most of the day moves quickly (1.5 seconds an
 * hour), but around the real sunrise and sunset it slows to real time divided by 12 (5 minutes an hour),
 * so the few minutes of sunrise take about 30 seconds to watch. The pace eases in and out over 10 minutes.
 */
function secondsPerHour(hour: number) {
  const h = ((hour % 24) + 24) % 24;
  const half = TWILIGHT_MINUTES / 60 / 2 + 2 / 60;
  let near = 0;
  for (const at of [SUN.sunrise, SUN.sunset]) {
    const d = Math.max(0, Math.abs(h - at) - half);
    const t = Math.max(0, 1 - d / (10 / 60));
    near = Math.max(near, t * t * (3 - 2 * t));
  }
  return 1.5 + (300 - 1.5) * near;
}

/** The clock: fast through the day and night, slow through sunrise and sunset. Pause stops it; drag the
 * scrubber to any minute of the day, like a video. */
function useDay(start: number) {
  const [hour, setHour] = useState(start);
  const [playing, setPlaying] = useState(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let id = requestAnimationFrame(function tick(now) {
      setHour((h) => (h + (now - last) / 1000 / secondsPerHour(h)) % 24);
      last = now;
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [playing]);
  const label = clockLabel(hour);
  // Dragging the scrubber pauses the day, like a video; letting go picks up where it was.
  const resume = useRef(false);
  const controls = (
    <div style={{ display: 'grid', gap: 'var(--space-1)', padding: 'var(--space-3) var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Button variant="secondary" size="small" onPress={() => setPlaying((p) => !p)}>
          {playing ? 'Pause' : 'Play'}
        </Button>
        <span style={{ minWidth: '5.5em', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--color-ink-primary)' }}>{label}</span>
        <input
          type="range"
          min={0}
          max={24}
          step={1 / 60}
          value={hour}
          aria-label="Time of day"
          aria-valuetext={label}
          onPointerDown={() => {
            resume.current = playing;
            setPlaying(false);
          }}
          onPointerUp={() => resume.current && setPlaying(true)}
          onChange={(e) => setHour(Number(e.currentTarget.value) % 24)}
          style={{ flex: 1, accentColor: 'var(--color-ink-primary)', cursor: 'pointer' }}
        />
      </div>
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginInlineStart: 'calc(5.5em + 2 * var(--space-3) + 64px)',
          color: 'var(--color-ink-tertiary)',
          fontSize: 'var(--type-label-meta-size)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span>12 am</span>
        <span>6 am</span>
        <span>12 pm</span>
        <span>6 pm</span>
        <span>12 am</span>
      </div>
      <p style={{ margin: 0, maxInlineSize: 'none', color: 'var(--color-ink-secondary)', fontSize: 'var(--type-label-meta-size)' }}>
        Today here: sunrise {clockLabel(SUN.sunrise)}, sunset {clockLabel(SUN.sunset)}. Each takes {TWILIGHT_MINUTES} minutes and
        plays slowly so you can watch it.
      </p>
    </div>
  );
  return { hour, controls, label };
}

/** A whole day sped up on one marble. Pick the background and version in Controls. */
/** The appearance setting (Device, Light, Dark, Follow the sun), the same buttons Life Hub's settings will have. */
function useAppearance() {
  const [setting, setSetting] = useState<ModeSetting>('device');
  const switcher = (
    <div style={{ padding: 'var(--space-3) var(--space-5) 0' }}>
      <ToggleButtonGroup aria-label="Appearance" selectedKeys={[setting]} onSelectionChange={(keys) => setSetting([...keys][0] as ModeSetting)}>
        {(Object.keys(modeLabels) as ModeSetting[]).map((k) => (
          <ToggleButton key={k} id={k}>
            {modeLabels[k]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
  return { setting, switcher };
}

/**
 * One marble page with the header, following the appearance setting: with Follow the sun, the page fades
 * to dark at dusk and back at dawn; with Dark, the header holds a still night sky.
 */
function Scene({ version, hour, background, setting, deviceDark, edge = 'clean', light = 'warm' }: { version: Version; hour: number; background: string; setting: ModeSetting; deviceDark: boolean; edge?: 'clean' | 'fade'; light?: 'warm' | 'white' }) {
  const night = findMarble(background).night;
  const skyHour = skyHourFor(hour, SUN);
  const skyMode = skyAt(skyHour, { material: version, areaNight: night, light }).mode;
  const look = appearanceFor(setting, { deviceDark, skyMode });
  const [page, setPage] = useState<SkyMode>(look.page);
  useEffect(() => {
    if (look.page !== page) fadePageMode(() => setPage(look.page));
  }, [look.page, page]);
  return (
    <MarblePage background={background} mode={page}>
      <SkyHeader
        {...copy}
        hour={look.header === 'night' ? 23 : skyHour}
        greetingHour={hour}
        instant
        material={version}
        edge={edge}
        light={light}
        swirl={swirlOf(background)}
        palette={findMarble(background).palette}
        areaNight={night}
      />
    </MarblePage>
  );
}

const deviceDarkOf = (context: { globals: Record<string, unknown> }) => context.globals.mode === 'dark';

/** A whole day sped up on one marble. Pick the background and version in Controls. */
export const PlayADay: Story = {
  argTypes: { hour: { table: { disable: true } } },
  render: function Render({ background, version, edge, light }, context) {
    const { hour, controls } = useDay(SUN.sunrise - 0.75);
    const { setting, switcher } = useAppearance();
    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {switcher}
        {controls}
        <Scene version={version} hour={hour} background={background} setting={setting} deviceDark={deviceDarkOf(context)} edge={edge}
        light={light} />
      </div>
    );
  },
};

/** A and B on the same marble, playing together. */
export const CompareAAndB: Story = {
  argTypes: { hour: { table: { disable: true } }, version: { table: { disable: true } } },
  render: function Render({ background, edge, light }, context) {
    const { hour, controls } = useDay(SUN.sunrise - 0.75);
    const { setting, switcher } = useAppearance();
    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {switcher}
        {controls}
        {(['glass', 'sky'] as Version[]).map((v) => (
          <section key={v} aria-label={labels[v]} style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <p style={{ margin: 0, padding: '0 var(--space-5)', color: 'var(--color-ink-tertiary)', fontSize: 'var(--type-label-size)' }}>{labels[v]}</p>
            <Scene version={v} hour={hour} background={background} setting={setting} deviceDark={deviceDarkOf(context)} edge={edge}
        light={light} />
          </section>
        ))}
      </div>
    );
  },
};

/** Every marble, playing together, or flip through them one at a time with the background dropdown in Controls. */
const ALL = 'All marbles';
export const EveryBackground: Story = {
  args: { background: ALL },
  argTypes: { hour: { table: { disable: true } }, background: { control: 'select', options: [ALL, ...marbleNames] } },
  render: function Render({ version, background, edge, light }, context) {
    const { hour, controls } = useDay(SUN.sunrise - 0.75);
    const { setting, switcher } = useAppearance();
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        {switcher}
        {controls}
        {marbles.filter((m) => background === ALL || m.name === background).map((m) => (
          <section key={m.name} aria-label={m.name} style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <p style={{ margin: 0, padding: '0 var(--space-5)', color: 'var(--color-ink-tertiary)', fontSize: 'var(--type-label-size)' }}>{m.name}</p>
            <Scene version={version} hour={hour} background={m.name} setting={setting} deviceDark={deviceDarkOf(context)} edge={edge}
        light={light} />
          </section>
        ))}
      </div>
    );
  },
};

/** One moment, still. Use the hour slider in Controls. */
export const AtAnHour: Story = {
  render: ({ hour, background, version, edge, light }) => <MarblePage background={background}>{header(version, hour, background, edge, light)}</MarblePage>,
};

/** Follows your computer's clock. */
export const Live: Story = {
  argTypes: { hour: { table: { disable: true } } },
  render: ({ background, version, edge, light }) => (
    <MarblePage background={background}>
      <SkyHeader
        {...copy}
        material={version}
        edge={edge}
        light={light}
        swirl={swirlOf(background)}
        palette={findMarble(background).palette}
        areaNight={findMarble(background).night}
      />
    </MarblePage>
  ),
};

function SettingsDemo({ background, deviceDark, edge, light }: { background: string; deviceDark: boolean; edge: 'clean' | 'fade'; light: 'warm' | 'white' }) {
  // A sped-up day on the real clock, starting mid-afternoon so sunset comes soon.
  const { hour, controls } = useDay(15.5);
  const { setting, switcher } = useAppearance();
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      {switcher}
      {controls}
      <Scene version="glass" hour={hour} background={background} setting={setting} deviceDark={deviceDark} edge={edge}
        light={light} />
    </div>
  );
}

/**
 * The appearance setting. Device follows the toolbar's Mode switch, standing in for the phone or computer.
 * Light: light page, the sky still follows the sun. Dark: dark page, a still night sky.
 * Follow the sun: the sky follows the sun and the page fades to dark at dusk and back at dawn.
 * The day uses today's real sunrise and sunset where you are.
 */
export const Settings: Story = {
  argTypes: { hour: { table: { disable: true } }, version: { table: { disable: true } } },
  render: ({ background, edge, light }, context) => <SettingsDemo background={background} deviceDark={context.globals.mode === 'dark'} edge={edge} light={light} />,
};
