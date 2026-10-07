import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkyHeader } from './sky-header';
import { Button } from '../../components/button/button';

type Args = { hour: number };

const meta: Meta<Args> = {
  title: 'Explorations/Life Hub sky header',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Exploration, not in the library yet. The header is a sky that follows the time of day: sunlight by day, a sunset that sinks and warms in the top right, then stars and a moon glow. ' +
          'The light stays top right all day, so it still lights the glass cards below. The greeting card switches to dark glass once the sky is dark. ' +
          'Following the real clock, the change is as slow as a real sunset. Colors are from the Life Hub palette; positions and strengths are estimates.',
      },
    },
  },
  args: { hour: 18.5 },
  argTypes: { hour: { control: { type: 'range', min: 0, max: 24, step: 0.25 }, description: 'Hour of the day (18.5 is 6:30 pm)' } },
};
export default meta;
type Story = StoryObj<Args>;

const copy = {
  name: 'Alex',
  meta: 'Updated today at 4:12 pm',
  prompt: 'What can I help you knock of your plate today?',
};

/** Follows your computer's clock. */
export const Live: Story = {
  argTypes: { hour: { table: { disable: true } } },
  render: () => <SkyHeader {...copy} />,
};

/** Pick an hour with the slider in Controls. */
export const AtAnHour: Story = {
  render: ({ hour }) => <SkyHeader {...copy} hour={hour} instant />,
};

function PlayDay() {
  const [hour, setHour] = useState(16);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let last = performance.now();
    let id = requestAnimationFrame(function tick(now) {
      // One hour every 1.5 seconds: the whole day in 36 seconds.
      setHour((h) => (h + (now - last) / 1500) % 24);
      last = now;
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [playing]);
  const label = new Date(2026, 0, 1, Math.floor(hour), Math.floor((hour % 1) * 60)).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <SkyHeader {...copy} hour={hour} instant />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Button variant="secondary" size="small" onPress={() => setPlaying((p) => !p)}>
          {playing ? 'Pause' : 'Play'}
        </Button>
        <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-ink-secondary)' }}>{label}</span>
      </div>
    </div>
  );
}

/** A whole day sped up: one hour every 1.5 seconds, starting before sunset. */
export const PlayADay: Story = {
  argTypes: { hour: { table: { disable: true } } },
  render: () => <PlayDay />,
};

const moments: [string, number][] = [
  ['Morning, 7:00', 7],
  ['Midday, 12:00', 12],
  ['Golden hour, 5:30', 17.5],
  ['Sunset, 6:30', 18.5],
  ['Dusk, 7:15', 19.25],
  ['Nightfall, 8:15', 20.25],
  ['Night, 11:00', 23],
];

/** Key moments of the day, side by side. */
export const Moments: Story = {
  argTypes: { hour: { table: { disable: true } } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      {moments.map(([label, h]) => (
        <section key={label} aria-label={label} style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <p style={{ margin: 0, color: 'var(--color-ink-tertiary)', fontSize: 'var(--type-label-size)' }}>{label}</p>
          <SkyHeader {...copy} hour={h} instant />
        </section>
      ))}
    </div>
  ),
};
