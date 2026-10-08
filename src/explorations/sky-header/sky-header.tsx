import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react';

/** Crossfades when the text changes (Good morning to Good afternoon), so words never pop. */
function FadeText({ text }: { text: string }) {
  const [items, setItems] = useState([{ text, id: 0, out: false }]);
  useEffect(() => {
    setItems((prev) => {
      const last = prev[prev.length - 1];
      if (last.text === text) return prev;
      return [{ ...last, out: true }, { text, id: last.id + 1, out: false }];
    });
  }, [text]);
  return (
    <span className="lh-fade">
      {items.map((it) => (
        <span
          key={it.id}
          className={it.out ? 'lh-fade__item lh-fade__item--out' : 'lh-fade__item'}
          aria-hidden={it.out || undefined}
          onAnimationEnd={it.out ? () => setItems((p) => p.filter((x) => x.id !== it.id)) : undefined}
        >
          {it.text}
        </span>
      ))}
    </span>
  );
}
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { greetingAt, makeStars, skyAt } from './sky';
import { skyHourFor, sunTimes } from './sun';
import './sky-header.css';

// Exploration only, not exported from the library. Life Hub's header as a sky that follows the time of
// day: sunlight by day, a sunset that sinks and warms in the top right, then stars and a moon glow.
// The light stays in the top right all day, so the header's light still lights every glass card below it.

export interface SkyHeaderProps {
  /** The sky's hour from 0 to 24 (18.5 is sunset). Leave out to follow the real clock and today's real sunset. */
  hour?: number;
  /** First name for the greeting. */
  name?: string;
  /** Small line above the greeting, for example when things were last updated. */
  meta?: string;
  /** Line under the greeting. */
  prompt?: string;
  /** The real clock hour for the greeting, when hour is a sky hour that differs from it. */
  greetingHour?: number;
  /** sky: a solid sky. glass: a tinted glass panel the marble shows through. */
  material?: 'sky' | 'glass';
  /** The area's night layer, so dark skies match the marble below. */
  areaNight?: string;
  /** Storybook only: changes are instant, for scrubbing through the day. */
  instant?: boolean;
  onStartChat?: () => void;
}

const STARS = makeStars(110);

// Drawn once; the sky's star strength arrives through a custom property, so they never re-render.
const Stars = memo(function Stars() {
  return (
    <div className="lh-sky__stars" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className={s.bright ? 'lh-sky__star lh-sky__star--bright' : 'lh-sky__star'}
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              '--b': s.base,
              animationDelay: `${-s.delay}s`,
              animationDuration: `${s.duration}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
});

/** The sky's hour right now: the real clock, lined up with today's real sunrise and sunset. */
function nowHour() {
  const d = new Date();
  return skyHourFor(d.getHours() + d.getMinutes() / 60, sunTimes(d));
}

export function SkyHeader({ hour, greetingHour, name, meta, prompt, material = 'sky', areaNight, instant = false, onStartChat }: SkyHeaderProps) {
  const [clock, setClock] = useState(nowHour);
  useEffect(() => {
    if (hour !== undefined) return;
    const id = window.setInterval(() => setClock(nowHour()), 60_000);
    return () => window.clearInterval(id);
  }, [hour]);
  const h = hour ?? clock;
  const sky = useMemo(() => skyAt(h, { material, areaNight }), [h, material, areaNight]);
  const style = {
    '--sky-a': sky.alpha.toFixed(3),
    '--sky-veil': `color-mix(in srgb, ${sky.veil} ${(sky.veilAlpha * 100).toFixed(1)}%, transparent)`,
    '--sky-top': sky.top,
    '--sky-bottom': sky.bottom,
    '--sky-glow': sky.glow,
    '--sky-glow-a': sky.glowAlpha.toFixed(3),
    '--sky-glow-x': `${sky.glowX.toFixed(1)}%`,
    '--sky-glow-y': `${sky.glowY.toFixed(1)}%`,
    '--sky-horizon': sky.horizon.toFixed(3),
    '--sky-stars': sky.stars.toFixed(3),
  } as CSSProperties;
  const greeting = greetingAt(greetingHour ?? h);
  return (
    <header
      className={`lh-sky lh-sky--${material}${instant ? ' lh-sky--instant' : ''}`}
      data-theme="life-hub"
      data-mode={sky.mode}
      style={style}
    >
      <Stars />
      <Card className="lh-sky__card">
        {meta && <p className="lh-sky__meta">{meta}</p>}
        <h1 className="lh-sky__title"><FadeText text={name ? `${greeting}, ${name}` : greeting} /></h1>
        {prompt && <p className="lh-sky__prompt">{prompt}</p>}
      </Card>
      <Button variant="secondary" size="small" className="lh-sky__chat" onPress={onStartChat}>
        Start chat
      </Button>
    </header>
  );
}
