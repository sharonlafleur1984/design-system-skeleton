import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Button as AriaButton } from 'react-aria-components';

/**
 * Crossfades when the text changes (Good morning to Good afternoon), so words never pop. The width
 * glides from the old text's to the new one's at the same pace, so the card around it grows or shrinks
 * smoothly instead of jumping.
 */
function FadeText({ text }: { text: string }) {
  const [items, setItems] = useState([{ text, id: 0, out: false }]);
  const box = useRef<HTMLSpanElement>(null);
  const last = useRef<number | null>(null);
  useEffect(() => {
    setItems((prev) => {
      const latest = prev[prev.length - 1];
      if (latest.text === text) return prev;
      // Remember the width before the new words arrive.
      if (box.current) last.current = box.current.getBoundingClientRect().width;
      return [{ ...latest, out: true }, { text, id: latest.id + 1, out: false }];
    });
  }, [text]);
  useLayoutEffect(() => {
    const el = box.current;
    const from = last.current;
    if (!el || from === null) return;
    last.current = null;
    // The new words' natural width (outgoing words don't count toward it), then glide there.
    el.style.width = '';
    const to = el.querySelector<HTMLElement>('.lh-fade__item:not(.lh-fade__item--out)')?.getBoundingClientRect().width ?? from;
    el.style.width = `${from}px`;
    void el.offsetWidth;
    el.style.width = `${to}px`;
  }, [items]);
  return (
    <span className="lh-fade" ref={box} onTransitionEnd={(e) => e.propertyName === 'width' && box.current?.style.removeProperty('width')}>
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
import { Card } from '../../components/card/card';
import { useGlassLight } from '../../components/glass-light/glass-light';
import { greetingAt, makeStars, skyAt } from './sky';
import { skyHourFor, sunTimes } from './sun';
import './sky-header.css';

// Exploration only, not exported from the library. Life Hub's header as a sky that follows the time of
// day. The orb on the Let's chat button is the light: a small sun by day, warm at sunset, a violet Milky
// Way glow at night. The sky's glow sits behind it, and every piece of glass in the header is lit from it
// with the same recipe as After Graduation's episode tabs (glass.css and useGlassLight).

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
  onChat?: () => void;
  onOpenSettings?: () => void;
  /** Updates waiting in System Settings. Shown as a count in the dot; 0 or left out hides the dot. */
  settingsCount?: number;
}

const GearIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.25.4-1.51 1z" />
  </svg>
);

// Enough stars to fill an edge-to-edge header, left side included.
const STARS = makeStars(220);

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

export function SkyHeader({ hour, greetingHour, name, meta, prompt, material = 'sky', areaNight, instant = false, onChat, onOpenSettings, settingsCount = 0 }: SkyHeaderProps) {
  const [clock, setClock] = useState(nowHour);
  useEffect(() => {
    if (hour !== undefined) return;
    const id = window.setInterval(() => setClock(nowHour()), 60_000);
    return () => window.clearInterval(id);
  }, [hour]);
  // Stars fill the whole sky except the greeting card: measure the card and cut a hole that size.
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const header = ref.current;
    const card = header?.querySelector<HTMLElement>('.lh-sky__card');
    if (!header || !card) return;
    const place = () => {
      const h = header.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const gap = 16; // breathing room so no star touches the card's edge
      header.style.setProperty('--sky-hole-x', `${c.left - h.left - gap}px`);
      header.style.setProperty('--sky-hole-y', `${c.top - h.top - gap}px`);
      header.style.setProperty('--sky-hole-w', `${c.width + gap * 2}px`);
      header.style.setProperty('--sky-hole-h', `${c.height + gap * 2}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(header);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);
  // The sky's glow sits on the orb, wherever the layout puts it.
  useLayoutEffect(() => {
    const header = ref.current;
    const orb = header?.querySelector<HTMLElement>('.lh-sky__orb');
    if (!header || !orb) return;
    const place = () => {
      const h = header.getBoundingClientRect();
      const o = orb.getBoundingClientRect();
      if (!h.width || !h.height) return;
      header.style.setProperty('--sky-glow-x', `${(((o.left + o.width / 2 - h.left) / h.width) * 100).toFixed(1)}%`);
      header.style.setProperty('--sky-glow-y', `${(((o.top + o.height / 2 - h.top) / h.height) * 100).toFixed(1)}%`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);
  // Every piece of glass is lit from the orb, like After Graduation's tabs are lit from the wheel.
  useGlassLight(ref, { source: '.lh-sky__orb', selector: '.ds-glass' });
  const h = hour ?? clock;
  const sky = useMemo(() => skyAt(h, { material, areaNight }), [h, material, areaNight]);
  const style = {
    '--sky-a': sky.alpha.toFixed(3),
    '--sky-veil': `color-mix(in srgb, ${sky.veil} ${(sky.veilAlpha * 100).toFixed(1)}%, transparent)`,
    '--sky-top': sky.top,
    '--sky-bottom': sky.bottom,
    '--sky-glow': sky.glow,
    '--sky-glow-a': sky.glowAlpha.toFixed(3),
    '--sky-orb-core': sky.orbCore,
    '--sky-orb-edge': sky.orbEdge,
    '--sky-horizon': sky.horizon.toFixed(3),
    '--sky-stars': sky.stars.toFixed(3),
  } as CSSProperties;
  const greeting = greetingAt(greetingHour ?? h);
  return (
    <header
      ref={ref}
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
      <div className="lh-sky__actions">
        <AriaButton className="ds-glass lh-sky__action" onPress={onChat}>
          <span className="lh-sky__action-glass" aria-hidden="true" />
          <span className="lh-sky__orb" aria-hidden="true" />
          Let&rsquo;s chat
        </AriaButton>
        <AriaButton className="ds-glass lh-sky__action" onPress={onOpenSettings}>
          <span className="lh-sky__action-glass" aria-hidden="true" />
          <span className="lh-sky__icon" aria-hidden="true">
            <GearIcon />
            {settingsCount > 0 && <span className="lh-sky__count">{settingsCount > 9 ? '9+' : settingsCount}</span>}
          </span>
          System Settings
          {settingsCount > 0 && (
            <span className="lh-sky__sr">
              , {settingsCount} {settingsCount === 1 ? 'update' : 'updates'}
            </span>
          )}
        </AriaButton>
      </div>
    </header>
  );
}
