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
    if (Math.abs(to - from) < 1) return;
    // While the width glides, the words stay on one line, so the greeting never wraps mid-change.
    el.classList.add('lh-fade--moving');
    el.style.width = `${from}px`;
    void el.offsetWidth;
    el.style.width = `${to}px`;
    const done = window.setTimeout(() => {
      el.classList.remove('lh-fade--moving');
      el.style.removeProperty('width');
    }, 1600);
    return () => window.clearTimeout(done);
  }, [items]);
  return (
    <span className="lh-fade" ref={box}>
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
import orbWebm from './assets/orb.webm';
import orbMp4 from './assets/orb.mp4';
import orbPoster from './assets/orb-poster.jpg';
import './sky-header.css';

/** The same swirl as the Life Hub page's orb: a 6 second loop slowed to about 24 seconds. */
const ORB_RATE = 0.25;

/** Life Hub's orb, the header's light. With reduced motion, it holds still on its first frame. */
function Orb() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => {
      v.defaultPlaybackRate = ORB_RATE;
      v.playbackRate = ORB_RATE;
      if (mq.matches) {
        v.pause();
        v.currentTime = 0;
      } else v.play().catch(() => {});
    };
    set();
    v.addEventListener('loadeddata', set);
    mq.addEventListener('change', set);
    return () => {
      v.removeEventListener('loadeddata', set);
      mq.removeEventListener('change', set);
    };
  }, []);
  return (
    <span className="lh-sky__orb" aria-hidden="true">
      <video ref={video} muted loop playsInline autoPlay preload="auto" poster={orbPoster}>
        <source src={orbWebm} type="video/webm" />
        <source src={orbMp4} type="video/mp4" />
      </video>
    </span>
  );
}

// Exploration only, not exported from the library. Life Hub's header as a sky that follows the time of
// day. The orb on the Let's chat button (the same animated orb as the Life Hub page) is where the light
// comes from: the sky's glow sits behind it, and every piece of glass in the header is lit from it with the
// same recipe as After Graduation's episode tabs (glass.css and useGlassLight).

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
  /** The page's marble image as a CSS url with a full address, so its swirl continues faintly through the sky. */
  swirl?: string;
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

export function SkyHeader({ hour, greetingHour, name, meta, prompt, material = 'sky', swirl, areaNight, instant = false, onChat, onOpenSettings, settingsCount = 0 }: SkyHeaderProps) {
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
  // The swirl lines up with the marble on the page below: it is sized to the page, not the header.
  useLayoutEffect(() => {
    const header = ref.current;
    const page = header?.parentElement;
    if (!header || !page) return;
    const place = () => header.style.setProperty('--sky-page-h', `${page.getBoundingClientRect().height}px`);
    place();
    const ro = new ResizeObserver(place);
    ro.observe(page);
    return () => ro.disconnect();
  }, []);
  // The buttons' bottom edge lines up with the bottom of the greeting line ("Good evening, Alex").
  // When they wrap below the card (narrow screens), they sit normally.
  useLayoutEffect(() => {
    const header = ref.current;
    const title = header?.querySelector<HTMLElement>('.lh-sky__title');
    const card = header?.querySelector<HTMLElement>('.lh-sky__card');
    const actions = header?.querySelector<HTMLElement>('.lh-sky__actions');
    if (!header || !title || !card || !actions) return;
    const place = () => {
      actions.style.removeProperty('margin-block-end');
      const c = card.getBoundingClientRect();
      const a = actions.getBoundingClientRect();
      if (a.top >= c.bottom) return; // wrapped onto its own row
      const t = title.getBoundingClientRect();
      actions.style.setProperty('margin-block-end', `${Math.max(0, a.bottom - t.bottom)}px`);
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
  // Every other piece of glass is lit from the orb, like After Graduation's tabs are lit from the wheel.
  // The Let's chat button holds the orb, so it is lit from within instead (see sky-header.css).
  useGlassLight(ref, { source: '.lh-sky__orb', selector: '.ds-glass:not(.lh-sky__action--lit-within)' });
  const h = hour ?? clock;
  const sky = useMemo(() => skyAt(h, { material, areaNight }), [h, material, areaNight]);
  const style = {
    '--sky-a': sky.alpha.toFixed(3),
    '--sky-veil': `color-mix(in srgb, ${sky.veil} ${(sky.veilAlpha * 100).toFixed(1)}%, transparent)`,
    '--sky-top': sky.top,
    '--sky-bottom': sky.bottom,
    '--sky-glow': sky.glow,
    '--sky-glow-a': sky.glowAlpha.toFixed(3),
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
      {swirl && <div className="lh-sky__swirl" aria-hidden="true" style={{ '--sky-swirl': swirl } as CSSProperties} />}
      <Stars />
      <Card className="lh-sky__card">
        {meta && <p className="lh-sky__meta">{meta}</p>}
        <h1 className="lh-sky__title"><FadeText text={name ? `${greeting}, ${name}` : greeting} /></h1>
        {prompt && <p className="lh-sky__prompt">{prompt}</p>}
      </Card>
      <div className="lh-sky__actions">
        <AriaButton className="ds-glass lh-sky__action lh-sky__action--lit-within" onPress={onChat}>
          <span className="lh-sky__action-glass" aria-hidden="true" />
          <Orb />
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
