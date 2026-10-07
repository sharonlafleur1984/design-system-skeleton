import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { greetingAt, makeStars, skyAt } from './sky';
import './sky-header.css';

// Exploration only, not exported from the library. Life Hub's header as a sky that follows the time of
// day: sunlight by day, a sunset that sinks and warms in the top right, then stars and a moon glow.
// The light stays in the top right all day, so the header's light still lights every glass card below it.

export interface SkyHeaderProps {
  /** Hour from 0 to 24 (18.5 is 6:30 pm). Leave out to follow the real clock. */
  hour?: number;
  /** First name for the greeting. */
  name?: string;
  /** Small line above the greeting, for example when things were last updated. */
  meta?: string;
  /** Line under the greeting. */
  prompt?: string;
  /** Storybook only: changes are instant, for scrubbing through the day. */
  instant?: boolean;
  onStartChat?: () => void;
}

const STARS = makeStars(110);

function nowHour() {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

export function SkyHeader({ hour, name, meta, prompt, instant = false, onStartChat }: SkyHeaderProps) {
  const [clock, setClock] = useState(nowHour);
  useEffect(() => {
    if (hour !== undefined) return;
    const id = window.setInterval(() => setClock(nowHour()), 60_000);
    return () => window.clearInterval(id);
  }, [hour]);
  const h = hour ?? clock;
  const sky = useMemo(() => skyAt(h), [h]);
  const style = {
    '--sky-top': sky.top,
    '--sky-bottom': sky.bottom,
    '--sky-glow': sky.glow,
    '--sky-glow-a': sky.glowAlpha.toFixed(3),
    '--sky-glow-x': `${sky.glowX.toFixed(1)}%`,
    '--sky-glow-y': `${sky.glowY.toFixed(1)}%`,
    '--sky-horizon': sky.horizon.toFixed(3),
    '--sky-stars': sky.stars.toFixed(3),
  } as CSSProperties;
  const greeting = greetingAt(h);
  return (
    <header
      className={`lh-sky${instant ? ' lh-sky--instant' : ''}`}
      data-theme="life-hub"
      data-mode={sky.mode}
      style={style}
    >
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
      <Card className="lh-sky__card">
        {meta && <p className="lh-sky__meta">{meta}</p>}
        <h1 className="lh-sky__title">{name ? `${greeting}, ${name}` : greeting}</h1>
        {prompt && <p className="lh-sky__prompt">{prompt}</p>}
      </Card>
      <Button variant="secondary" size="small" className="lh-sky__chat" onPress={onStartChat}>
        Start chat
      </Button>
    </header>
  );
}
