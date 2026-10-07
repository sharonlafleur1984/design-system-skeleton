import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkyHeader } from './sky-header';
import { mixColor } from './sky';
import { Button } from '../../components/button/button';
import { areas } from '../glass-cards/areas';

// Every marble in the system. The tenth, Future option B, has no area yet, so its night layer is an
// estimate: its darkest tone mixed with Life Hub ink.
const marbles = [
  ...areas.map((a) => ({ name: a.name, texture: a.texture, night: a.layer, nightAlpha: a.layerAlpha })),
  { name: 'Future option B', texture: 'texture-future-option-b.jpg', night: mixColor('#dd816c', '#2a2625', 0.65), nightAlpha: 0.86 },
];
const marbleNames = marbles.map((m) => m.name);
const findMarble = (name: string) => marbles.find((m) => m.name === name) ?? marbles[0];

type Version = 'glass' | 'sky';
const labels: Record<Version, string> = { glass: 'A: glass', sky: 'B: solid sky' };
type Args = { hour: number; background: string; version: Version };

const meta: Meta<Args> = {
  title: 'Explorations/Life Hub sky header',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Exploration, not in the library yet. The header is a sky that follows the time of day: sunlight by day, a sunset that sinks and warms in the top right, then stars and a moon glow. ' +
          'A is a tinted glass panel the marble shows through; B is a solid sky. At night both lean toward the area\'s own night layer, so they match the marble below. ' +
          'Use the Mode switch in the toolbar for light and dark pages. Colors are from the Life Hub palette; positions and strengths are estimates.',
      },
    },
  },
  args: { hour: 18.5, background: 'Dashboard', version: 'glass' },
  argTypes: {
    hour: { control: { type: 'range', min: 0, max: 24, step: 0.25 }, description: 'Hour of the day (18.5 is 6:30 pm)' },
    background: { control: 'select', options: marbleNames },
    version: { control: { type: 'inline-radio', labels: { glass: 'A: glass', sky: 'B: solid sky' } }, options: ['glass', 'sky'] },
  },
};
export default meta;
type Story = StoryObj<Args>;

const copy = {
  name: 'Alex',
  meta: 'Updated today at 4:12 pm',
  prompt: 'What can I help you knock of your plate today?',
};

/** A slice of an area page: its marble, with the night layer over it on dark pages. */
function MarblePage({ background, children }: { background: string; children: ReactNode }) {
  const m = findMarble(background);
  const layer = `color-mix(in srgb, ${m.night} ${Math.round(m.nightAlpha * 100)}%, transparent)`;
  const style: CSSProperties = {
    // The night layer only shows on dark pages; light pages get the marble as is.
    background: `linear-gradient(var(--page-night, transparent), var(--page-night, transparent)), url('${m.texture}') center / cover`,
    padding: 'var(--space-5) var(--space-5) var(--space-8)',
    borderRadius: 'var(--radius-panel)',
    ['--page-night' as string]: document.documentElement.dataset.mode === 'dark' ? layer : 'transparent',
  };
  return (
    <div data-theme="life-hub" style={style}>
      {children}
    </div>
  );
}

const header = (version: Version, hour: number, background: string) => (
  <SkyHeader {...copy} hour={hour} instant material={version} areaNight={findMarble(background).night} />
);

/** The clock: one hour every 1.5 seconds, the whole day in 36 seconds. Pause stops it. */
function useDay(start: number) {
  const [hour, setHour] = useState(start);
  const [playing, setPlaying] = useState(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let id = requestAnimationFrame(function tick(now) {
      setHour((h) => (h + (now - last) / 1500) % 24);
      last = now;
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [playing]);
  const label = new Date(2026, 0, 1, Math.floor(hour), Math.floor((hour % 1) * 60)).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const controls = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <Button variant="secondary" size="small" onPress={() => setPlaying((p) => !p)}>
        {playing ? 'Pause' : 'Play'}
      </Button>
      <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-ink-secondary)' }}>{label}</span>
    </div>
  );
  return { hour, controls };
}

/** A whole day sped up on one marble. Pick the background and version in Controls. */
export const PlayADay: Story = {
  argTypes: { hour: { table: { disable: true } } },
  render: function Render({ background, version }) {
    const { hour, controls } = useDay(4);
    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {controls}
        <MarblePage background={background}>{header(version, hour, background)}</MarblePage>
      </div>
    );
  },
};

/** A and B on the same marble, playing together. */
export const CompareAAndB: Story = {
  argTypes: { hour: { table: { disable: true } }, version: { table: { disable: true } } },
  render: function Render({ background }) {
    const { hour, controls } = useDay(4);
    return (
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {controls}
        {(['glass', 'sky'] as Version[]).map((v) => (
          <section key={v} aria-label={labels[v]} style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <p style={{ margin: 0, color: 'var(--color-ink-tertiary)', fontSize: 'var(--type-label-size)' }}>{labels[v]}</p>
            <MarblePage background={background}>{header(v, hour, background)}</MarblePage>
          </section>
        ))}
      </div>
    );
  },
};

/** Every marble, playing together. Pick the version in Controls. */
export const EveryBackground: Story = {
  argTypes: { hour: { table: { disable: true } }, background: { table: { disable: true } } },
  render: function Render({ version }) {
    const { hour, controls } = useDay(4);
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        {controls}
        {marbles.map((m) => (
          <section key={m.name} aria-label={m.name} style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <p style={{ margin: 0, color: 'var(--color-ink-tertiary)', fontSize: 'var(--type-label-size)' }}>{m.name}</p>
            <MarblePage background={m.name}>{header(version, hour, m.name)}</MarblePage>
          </section>
        ))}
      </div>
    );
  },
};

/** One moment, still. Use the hour slider in Controls. */
export const AtAnHour: Story = {
  render: ({ hour, background, version }) => <MarblePage background={background}>{header(version, hour, background)}</MarblePage>,
};

/** Follows your computer's clock. */
export const Live: Story = {
  argTypes: { hour: { table: { disable: true } } },
  render: ({ background, version }) => (
    <MarblePage background={background}>
      <SkyHeader {...copy} material={version} areaNight={findMarble(background).night} />
    </MarblePage>
  ),
};
