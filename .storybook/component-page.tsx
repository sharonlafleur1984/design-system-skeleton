import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentType, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-aria-components';
import { addons } from 'storybook/preview-api';
import { UPDATE_GLOBALS } from 'storybook/internal/core-events';
import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import themes from '../build/themes.json';
import { useGlassLight } from '../src/components/glass-light/glass-light';
import { LIGHT_CHANGE } from '../src/components/glass-lens/lens';
import { clearArt, imageArt, resolveColor, type GlassArt } from '../src/components/glass-lens/lens-art';
import { LitContext } from '../src/components/material';
import { marbles, themeNames } from '../src/components/story-helpers';
import './component-page.css';

// Storybook only: the one page every component gets (Sharon's template, Oct 15). It's a story, not a
// Docs page, so Storybook's bottom panel (Controls, Actions, Interactions, Accessibility) works on it.
// A stories file fills it with an object of words (its <name>.page.tsx) and exports:
//   Overview (the page), then one sidebar entry per section that opens the same page scrolled there
//   (sectionStory), then its test stories, hidden from the sidebar with the '!dev' tag (testOnly).
// The page never changes per component, so no page can drift from the others.

/** Ready: in the code on main. Pending: built, waiting in an open pull request. On hold: waits until a product needs it. */
export type Status = 'ready' | 'pending' | 'on-hold' | 'not-started';

export const statusInfo: Record<Status, { label: string; empty?: { title: string } }> = {
  ready: { label: 'Ready' },
  pending: { label: 'Pending', empty: { title: 'Being built right now' } },
  'on-hold': { label: 'On hold', empty: { title: 'Taking a breather' } },
  'not-started': { label: 'Not started', empty: { title: 'Still on the drawing board' } },
};

const repo = 'https://github.com/sharonlafleur1984/design-system-skeleton/blob/main/';

export interface ComponentPageInfo {
  /** The day the page was last checked, as YYYY-MM-DD. */
  updated: string;
  /** What it does, in one line that starts with a verb. */
  summary: string;
  status: Status;
  /** Its design file, if one exists (Figma or a Claude design), with a label that names where it is, like "See the design in Figma". Shown in the status row's Notes. */
  design?: { href: string; label: string };
  /** React Aria's component it's built on, or the file of ours it lives in (none yet for an unbuilt one of ours). */
  builtWith: { reactAria: string } | { source?: string };
  /** When do I use it: the job it does best, then a second one if there is one. Notes are optional. */
  useFor: ReactNode[];
  useForNotes?: ReactNode[];
  /** When don't I use it: a job that looks similar, and what to use instead. */
  useElse?: { job: ReactNode; instead?: { name: string; title: string } }[];
  /** Usage rules: an example and what to do, then an example and what to avoid. */
  do?: { example: ReactNode; rules: ReactNode[] };
  dont?: { example: ReactNode; rules: ReactNode[] };
  /** Keys that work on it, and what happens. */
  keys?: { keys: string[]; result: ReactNode }[];
  /** What a screen reader says, as a pattern and an example. */
  screenReader?: { pattern: string; example: string };
  /** Anything about accessibility that's different for this component. */
  accessibility?: ReactNode[];
  /** The names to import. */
  imports?: string[];
  /** The tokens it uses, with [part] or [state] where there's one per part or state. */
  tokens?: string[];
  /** Other pages. title is a Storybook title; story picks one story on a page without its own (like 'playground'). */
  related?: { name: string; title: string; story?: string }[];
  /** The props each state in Controls' State row sets. Leave out for a component without states. */
  states?: Partial<Record<StateName, Record<string, unknown>>>;
  /** The name to write in Show code. Defaults to the component's own name. */
  codeName?: string;
  /** The themes it's made for, when not all of them. Try it out says so in the others. */
  onlyIn?: string[];
}

/** A page in this Storybook, from its title ("Components/Icon tile"). Components open on their page. */
export const pagePath = (title: string) => {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return title.startsWith('Foundations/') ? `/?path=/docs/${id}--docs` : `/?path=/story/${id}--overview`;
};
/** Older name for pagePath, kept so page files read the same. */
export const docsPath = pagePath;

/** A link to another page in this Storybook. Stories sit in a frame, so the link opens in the whole window. */
export function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_top">
      {children}
    </a>
  );
}

const formatDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// ---------------------------------------------------------------------------------------------------
// Controls rows every page can add. Style is the component's own; these are the page's (keys start
// with sb, so they never reach the component). Each says its code name under what it does.

export type StateName = 'rest' | 'hover' | 'pressed' | 'focus' | 'disabled' | 'loading';
const stateLabels: Record<StateName, string> = { rest: 'Rest', hover: 'Hover', pressed: 'Pressed', focus: 'Focus', disabled: 'Disabled', loading: 'Loading' };

const radio = (name: string, code: string, does: string, labels: Record<string, string>, extra: Record<string, unknown> = {}) => ({
  name,
  description: `${does}\n\n\`${code}\``,
  control: { type: 'inline-radio', labels: { ...labels, all: 'All' } },
  options: [...Object.keys(labels), 'all'],
  // Grouped under Page settings, after the component's own rows.
  table: { category: 'Page settings', type: { summary: 'string' } },
  ...extra,
});
const radioNoAll = (name: string, code: string, does: string, labels: Record<string, string>, extra: Record<string, unknown> = {}) => ({
  ...radio(name, code, does, labels, extra),
  control: { type: 'inline-radio', labels },
  options: Object.keys(labels),
});

/**
 * The page's own Controls rows. Device settings (Motion, Contrast, Transparency) apply to the whole
 * page, as they would in the app, so they have System but no All.
 */
/** Themes with only a dark look in the system so far (theme.json alwaysDark). */
const darkOnly = (themes as { id: string; alwaysDark?: boolean }[]).filter((t) => t.alwaysDark).map((t) => t.id);

export function pageArgTypes({ states, glass }: { states?: StateName[]; glass?: boolean } = {}) {
  const rows: Record<string, unknown> = {
    // Hidden when the one theme picked has no light look in the system yet (Fireside, for now), since it would change nothing.
    sbMode: radio('Mode', 'data-mode', 'Shows the examples in light or dark mode. Auto is dark from 7 PM to 7 AM. System follows your device.', { light: 'Light', dark: 'Dark', auto: 'Auto', system: 'System' }, darkOnly.length === 1 ? { if: { global: 'theme', neq: darkOnly[0] } } : {}),
    sbBackground: radioNoAll(
      'Background',
      'background',
      "Shows it on the theme's art, to check text and glass on images. Header art and Landscape lanes are Spotlight's; Marble is Sunrise's.",
      { plain: 'Plain page', header: 'Header art', landscape: 'Landscape lanes', marble: 'Marble' },
      { if: { global: 'theme', neq: 'designer-toolkit' } },
    ),
    sbMarble: radioNoAll('Marble color', 'marble', 'Matches the color picked in Sunrise', Object.fromEntries(marbles.map((m) => [m.texture, m.name])), { if: { arg: 'sbBackground', eq: 'marble' } }),
    sbMotion: radioNoAll('Motion', 'data-reduce-motion', 'Full plays every animation. Reduced keeps only color fades. System follows your device.', { full: 'Full', reduced: 'Reduced', system: 'System' }),
    sbContrast: radioNoAll('Contrast', 'data-contrast', 'More makes borders and text stronger. System follows your device.', { standard: 'Standard', more: 'More', system: 'System' }),
  };
  if (glass) rows.sbTransparency = radioNoAll('Transparency', 'data-transparency', 'Reduced turns glass solid. System follows your device.', { full: 'Full', reduced: 'Reduced', system: 'System' });
  if (states?.length) rows.sbState = radio('State', 'data-state', 'Shows it at rest, or as it looks hovered, pressed, focused, disabled or loading', Object.fromEntries(states.map((s) => [s, stateLabels[s]])));
  return rows;
}
export const pageArgs = { sbMode: 'light', sbBackground: 'plain', sbMarble: marbles[0].texture, sbMotion: 'system', sbContrast: 'system', sbTransparency: 'system', sbState: 'rest' };

const isPageArg = (key: string) => key.startsWith('sb');

// ---------------------------------------------------------------------------------------------------
// Show code: the JSX for the props picked, leaving out the defaults.

function jsx(name: string, props: Record<string, unknown>, defaults: Record<string, unknown>) {
  const parts: string[] = [];
  let children = '';
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || typeof value === 'function' || isPageArg(key)) continue;
    if (key === 'children') {
      children = typeof value === 'string' ? value : '…';
      continue;
    }
    if (defaults[key] === value || (defaults[key] === undefined && value === false)) continue;
    if (value === true) parts.push(key);
    else if (typeof value === 'string') parts.push(`${key}="${value}"`);
    else if (typeof value === 'number') parts.push(`${key}={${value}}`);
    else parts.push(`${key}={…}`);
  }
  const open = [name, ...parts].join(' ');
  return children ? `<${open}>${children}</${name}>` : `<${open} />`;
}

// ---------------------------------------------------------------------------------------------------
// The page's own bar: Theme and Mode. Mode here is the page's; Mode in Controls is the examples'.

const themeList = themes as { id: string; name: string; alwaysDark?: boolean }[];
const alwaysDark = (id: string) => !!themeList.find((t) => t.id === id)?.alwaysDark;
const update = (globals: Record<string, string>) => addons.getChannel().emit(UPDATE_GLOBALS, { globals });

/** Re-renders every minute and when the device's light or dark setting changes, so Auto and System stay true. */
function useClock() {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60_000);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => tick((n) => n + 1);
    mq.addEventListener('change', on);
    return () => {
      clearInterval(t);
      mq.removeEventListener('change', on);
    };
  }, []);
}

/** Light or dark for Light, Dark, Auto (dark from 7 PM to 7 AM) and System (the device). */
export function resolveMode(mode: unknown): 'light' | 'dark' {
  if (mode === 'dark' || mode === 'light') return mode;
  if (mode === 'auto') {
    const h = new Date().getHours();
    return h >= 19 || h < 7 ? 'dark' : 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function PageBar({ theme, pageMode }: { theme: string; pageMode: string }) {
  const field = (id: string, label: string, value: string, choices: { id: string; name: string; hint?: string }[], onPick: (v: string) => void) => (
    <div className="sb-page__field">
      <span className="sb-page__field-label" id={id}>
        {label}
      </span>
      <ToggleButtonGroup
        aria-labelledby={id}
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          const [next] = [...keys];
          if (next) onPick(String(next));
        }}
        className="sb-page__choices"
      >
        {choices.map((c) => (
          <ToggleButton key={c.id} id={c.id} className="sb-page__choice">
            {c.name}
            {c.hint && <span className="sb-page__vh">, {c.hint}</span>}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
  return (
    <div className="sb-page__bar">
      {field('sb-page-theme', 'Theme', theme, [...themeList.map((t) => ({ id: t.id, name: t.name })), { id: 'both', name: 'All', hint: 'every theme side by side' }], (v) => update({ theme: v }))}
      {field(
        'sb-page-mode',
        'Mode',
        pageMode,
        [
          { id: 'light', name: 'Light' },
          { id: 'dark', name: 'Dark' },
          { id: 'auto', name: 'Auto', hint: 'dark from 7 PM to 7 AM' },
          { id: 'system', name: 'System', hint: 'follows your device' },
        ],
        (v) => update({ pageMode: v }),
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------
// Try it out: the component in its window, Controls driving it.

type PageArgTypes = Record<string, { options?: unknown[]; control?: { labels?: Record<string, string> } | string; name?: string; description?: string; table?: ArgType['table'] }>;
type Expand = { key: string; values: { value: unknown; label: string }[] };

/** Every Controls row set to All, with the choices it stands for. Mode's All is drawn as windows instead. */
function allRows(args: Record<string, unknown>, argTypes: PageArgTypes): Expand[] {
  return Object.keys(args)
    .filter((k) => args[k] === 'all' && k !== 'sbMode')
    .map((key) => {
      const t = argTypes[key] ?? {};
      const labels = (typeof t.control === 'object' ? t.control.labels : undefined) ?? {};
      const values = (t.options ?? []).filter((o) => o !== 'all').map((o) => ({ value: o, label: labels[String(o)] ?? String(o) }));
      return { key, values };
    })
    .filter((e) => e.values.length > 0);
}

/** The component's props for one set of choices: page rows removed, the State row turned into props. */
function propsFor(args: Record<string, unknown>, info: ComponentPageInfo) {
  const props: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(args)) if (!isPageArg(k)) props[k] = v;
  const state = args.sbState as StateName | undefined;
  if (state && state !== 'rest') Object.assign(props, info.states?.[state]);
  return props;
}

function Demo({ component: C, args, info }: { component: ComponentType<Record<string, unknown>>; args: Record<string, unknown>; info: ComponentPageInfo }) {
  // A state picture is pinned to its look, so pointing at it never stacks a real hover on top.
  if (args.sbState && args.sbState !== 'rest') {
    return (
      <div inert className="sb-try__still">
        <C {...propsFor(args, info)} />
      </div>
    );
  }
  return <C {...propsFor(args, info)} />;
}

/** Every set of choices the rows set to All stand for. */
function combos(rows: Expand[], args: Record<string, unknown>): Record<string, unknown>[] {
  return rows.reduce<Record<string, unknown>[]>((list, row) => list.flatMap((a) => row.values.map((v) => ({ ...a, [row.key]: v.value }))), [args]);
}

/** One All: a labeled row. Two: a labeled grid. More: one grid per choice of the rest, each with a heading. */
function Matrix({ rows, args, render }: { rows: Expand[]; args: Record<string, unknown>; render: (a: Record<string, unknown>) => ReactNode }) {
  if (rows.length === 0) return <>{render(args)}</>;
  const [cols, byRow, ...rest] = rows;
  if (rest.length) {
    const [first, ...others] = rest;
    return (
      <div className="sb-try__groups">
        {first.values.map((v) => (
          <section key={String(v.value)} className="sb-try__group" aria-label={v.label}>
            <p className="sb-try__label">{v.label}</p>
            <Matrix rows={[cols, byRow, ...others]} args={{ ...args, [first.key]: v.value }} render={render} />
          </section>
        ))}
      </div>
    );
  }
  if (!byRow) {
    return (
      <div className="sb-try__row">
        {cols.values.map((v) => (
          <figure key={String(v.value)} className="sb-try__cell">
            <figcaption className="sb-try__label">{v.label}</figcaption>
            {render({ ...args, [cols.key]: v.value })}
          </figure>
        ))}
      </div>
    );
  }
  return (
    <table className="sb-try__grid">
      <thead>
        <tr>
          <td />
          {cols.values.map((c) => (
            <th key={String(c.value)} scope="col" className="sb-try__label">
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {byRow.values.map((r) => (
          <tr key={String(r.value)}>
            <th scope="row" className="sb-try__label">
              {r.label}
            </th>
            {cols.values.map((c) => (
              <td key={String(c.value)}>{render({ ...args, [cols.key]: c.value, [byRow.key]: r.value })}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Spotlight's header art as a window: its red, lightest at the light and deepening away from it, with
 * the light shown only as an orb. No rays: they belong to After Graduation's own header, not the system.
 * The same paint goes to the glass, so it bends exactly what's behind it.
 */
function headerArt(sun: { x: number; y: number }): GlassArt {
  return {
    paint(ctx, { width, height }, container) {
      const color = (css: string) => {
        const c = resolveColor(css, container) ?? [0, 0, 0, 0];
        return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
      };
      const lx = width * sun.x;
      const ly = height * sun.y;
      const r = Math.max(Math.hypot(lx, ly), Math.hypot(width - lx, ly), Math.hypot(lx, height - ly), Math.hypot(width - lx, height - ly));
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
      g.addColorStop(0, color('var(--color-accent-base)'));
      g.addColorStop(0.3, color('var(--color-accent-hover)'));
      g.addColorStop(0.9, color('var(--shell-frame)'));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      return true;
    },
  };
}

/** One example window: the theme, the mode and the background picked, with its glass lit. */
function TryWindow({ theme, mode, args, children }: { theme: string; mode: 'light' | 'dark'; args: Record<string, unknown>; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const picked = String(args.sbBackground ?? 'plain');
  // A background only shows in the theme it belongs to; any other theme shows its plain page.
  const bg = theme === 'after-graduation' && (picked === 'header' || picked === 'landscape') ? picked : theme === 'life-hub' && picked === 'marble' ? 'marble' : 'plain';
  const marble = marbles.find((m) => m.texture === args.sbMarble) ?? marbles[0];
  const night = marble.area ? `var(--color-area-${marble.area}-night)` : 'var(--color-area-dashboard-night)';
  // The light starts near the bottom right, where it usually sits.
  const [sun, setSun] = useState({ x: 0.9, y: 0.75 });
  const lens = useMemo(() => ({ art: bg === 'header' ? headerArt(sun) : bg === 'marble' ? imageArt({ src: marble.texture, overlay: night }) : clearArt() }), [bg, marble.texture, night, sun]);
  useGlassLight(ref, { selector: '.ds-glass', lens, reach: 6, source: bg === 'header' ? '[data-sb-sun]' : undefined });
  useLayoutEffect(() => {
    window.dispatchEvent(new Event(LIGHT_CHANGE));
  }, [sun, bg, mode]);

  const clamp = (v: number) => Math.min(0.96, Math.max(0.04, v));
  const moveTo = (e: PointerEvent<HTMLElement>) => {
    const r = ref.current!.getBoundingClientRect();
    setSun({ x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) });
  };
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    const step = e.shiftKey ? 0.1 : 0.04;
    const d = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, number[]>)[e.key];
    if (!d) return;
    e.preventDefault();
    setSun((s) => ({ x: clamp(s.x + d[0]), y: clamp(s.y + d[1]) }));
  };
  const style = {
    // The header art's bright spot sits at the sun.
    '--sb-sun-x': `${sun.x * 100}%`,
    '--sb-sun-y': `${sun.y * 100}%`,
    ...(bg === 'marble' ? { background: `linear-gradient(${night}, ${night}), url('${marble.texture}') center / cover` } : {}),
  } as CSSProperties;
  return (
    <div ref={ref} className={`sb-try__window sb-try__window--${bg}`} data-theme={theme} data-mode={mode} style={style}>
      {bg === 'header' && (
        <>
          <button
            type="button"
            data-sb-sun=""
            className="sb-try__sun"
            style={{ left: `${sun.x * 100}%`, top: `${sun.y * 100}%` }}
            aria-label="Light. Drag it, or use the arrow keys to move it."
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              moveTo(e);
            }}
            onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && moveTo(e)}
            onKeyDown={onKey}
          >
            <span className="sb-try__sun-core" aria-hidden="true" />
          </button>
          <span className="sb-try__hint">Drag the sun to move the light</span>
        </>
      )}
      {bg === 'landscape' && <span className="sb-try__standin">Stand-in for the landscape lanes</span>}
      <LitContext.Provider value={bg !== 'plain'}>
        <div className="sb-try__content">{children}</div>
      </LitContext.Provider>
    </div>
  );
}

function CodeBar({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <>
      <div className="sb-try__codebar">
        <button type="button" className="sb-try__codebtn" aria-expanded={open} aria-controls="sb-try-code" onClick={() => setOpen(!open)}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4" />
          </svg>
          {open ? 'Hide code' : 'Show code'}
        </button>
        <button
          type="button"
          className="sb-try__codebtn"
          onClick={() => {
            navigator.clipboard?.writeText(code).then(
              () => setCopied(true),
              () => setCopied(false),
            );
          }}
        >
          {copied ? 'Copied' : 'Copy code'}
        </button>
        <span className="sb-page__vh" role="status">
          {copied ? 'Code copied' : ''}
        </span>
      </div>
      {open && (
        <pre id="sb-try-code" className="sb-try__code">
          <code>{code}</code>
        </pre>
      )}
    </>
  );
}

function EmptyState({ status }: { status: Status }) {
  const empty = statusInfo[status].empty ?? statusInfo['not-started'].empty!;
  // The words sit inside the dashed outline of a part still being drawn, with the pencil beside it.
  return (
    <div className="sb-try__empty">
      <p className="sb-try__empty-title">{empty.title}</p>
      <svg className="sb-try__pencil" width="20" height="20" viewBox="110 24 22 22" fill="none" aria-hidden="true">
        <path d="M112 40 126 26l4 4-14 14-6 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M122 30l4 4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------
// The page.

export type Section = 'overview' | 'try' | 'usage' | 'a11y' | 'related';

function StatusPill({ status }: { status: Status }) {
  return (
    <span className={`sb-page__status sb-page__status--${status}`}>
      <span aria-hidden="true" className="sb-page__dot" />
      {statusInfo[status].label}
    </span>
  );
}

/** A check's result: plain words with a dot, never a button, never color alone. */
function Result() {
  return (
    <span className="sb-page__status sb-page__status--ready">
      <span aria-hidden="true" className="sb-page__dot" />
      Pass
    </span>
  );
}

// The checks every built component passes. Storybook's Accessibility tab and the tests check them on every story.
const standardChecks: { trigger: string; note: string }[] = [
  { trigger: 'Text contrast at least 4.5:1', note: 'In every style, theme and mode.' },
  { trigger: 'Touch target at least 24 by 24px', note: 'Counting the space around it.' },
  { trigger: 'Focus ring always visible', note: 'On every background, glass included.' },
  { trigger: 'Works with Reduce motion', note: 'Only color fades are left.' },
];

function List({ items, className = 'sb-page__list' }: { items: ReactNode[]; className?: string }) {
  const shown = items.filter((i) => i !== '' && i != null);
  if (!shown.length) return null;
  return (
    <ul className={className}>
      {shown.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

interface PageProps {
  info: ComponentPageInfo;
  name: string;
  component?: ComponentType<Record<string, unknown>>;
  args: Record<string, unknown>;
  argTypes: PageArgTypes;
  initialArgs: Record<string, unknown>;
  theme: string;
  pageMode: string;
  section?: Section;
  /** False for a component with nothing to change: no Try it out heading, but the component stays. */
  tryIt: boolean;
}

export function ComponentPage({ info, name, component, args, argTypes, initialArgs, theme, pageMode, section, tryIt }: PageProps) {
  useClock();
  const built = !!component && (info.status === 'ready' || info.status === 'pending');
  const shownThemes = theme === 'both' ? themeList.map((t) => t.id) : [theme];
  const modes: ('light' | 'dark')[] = args.sbMode === 'all' ? ['light', 'dark'] : [resolveMode(args.sbMode ?? 'light')];
  const rows = allRows(args, argTypes);
  const codeName = info.codeName ?? (component as { displayName?: string } | undefined)?.displayName ?? component?.name ?? name.replace(/\s/g, '');

  // Device settings in Controls apply to the whole page, as they would in the app.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const set = (attr: string, value: string | null) => (value === null ? root.removeAttribute(attr) : root.setAttribute(attr, value));
    set('data-reduce-motion', args.sbMotion === 'reduced' ? '' : null);
    set('data-contrast', args.sbContrast === 'more' ? 'more' : args.sbContrast === 'standard' ? 'standard' : null);
    set('data-transparency', args.sbTransparency === 'reduced' ? 'reduce' : args.sbTransparency === 'full' ? 'standard' : null);
    return () => ['data-reduce-motion', 'data-contrast', 'data-transparency'].forEach((a) => root.removeAttribute(a));
  }, [args.sbMotion, args.sbContrast, args.sbTransparency]);

  useEffect(() => {
    if (!section || section === 'overview') return;
    document.getElementById(`sb-section-${section}`)?.scrollIntoView({ block: 'start' });
  }, [section]);

  const render = (a: Record<string, unknown>) => <Demo component={component!} args={a} info={info} />;
  // Show code lists every example on show, once each.
  const code = [...new Set(combos(rows, args).map((a) => jsx(codeName, propsFor(a, info), initialArgs)))].join('\n');
  const many = shownThemes.length * modes.length > 1;
  const stage = built ? (
    <div className={`sb-try__windows${many ? ' sb-try__windows--many' : ''}`}>
      {shownThemes.flatMap((t) =>
        // A theme with only a dark look in the system so far (Fireside) gets one window, whatever Mode says.
        (alwaysDark(t) ? (['dark'] as const) : modes).map((m) => (
          <div key={`${t}-${m}`} className="sb-try__slot">
            {many && (
              // The theme's name as plain text, the mode as a light or dark pill, so each window says what it shows at a glance.
              <p className="sb-try__window-label">
                {shownThemes.length > 1 && <span>{themeNames[t]}</span>}
                <span className={`sb-try__mode-pill sb-try__mode-pill--${m}`}>{m === 'dark' ? 'Dark' : 'Light'}</span>
              </p>
            )}
            <TryWindow theme={t} mode={m} args={args}>
              {info.onlyIn && !info.onlyIn.includes(t) ? (
                <p className="sb-try__not-here">This component hasn&apos;t been made for the {themeNames[t]} theme yet.</p>
              ) : (
                <Matrix rows={rows} args={args} render={render} />
              )}
            </TryWindow>
          </div>
        )),
      )}
    </div>
  ) : (
    <div className="sb-try__window sb-try__window--plain" data-theme={shownThemes[0]} data-mode={modes[0]}>
      <EmptyState status={info.status} />
    </div>
  );
  const reactAria = 'reactAria' in info.builtWith ? info.builtWith.reactAria : null;
  const source = 'source' in info.builtWith ? info.builtWith.source : null;

  return (
    <div className="sb-page" data-page={resolveMode(pageMode)}>
      <PageBar theme={theme} pageMode={pageMode} />

      {/* A div, not a header: Page shell's example has its own header, and a page can have only one. */}
      <div id="sb-section-overview" className="sb-page__header">
        <h1 className="sb-page__h1">{name}</h1>
        <p className="sb-page__summary">{info.summary}</p>
      </div>

      {/* A div, not a section: a part with its own main landmark (Page shell) mustn't sit inside a region. */}
      <div id="sb-section-try" className="sb-page__section">
        {tryIt && (
          <div className="sb-page__section-head">
            <h2 id="sb-try-heading" className="sb-page__h2">
              Try it out
            </h2>
            {built && <p className="sb-page__lead">Change the settings in the Controls tab at the bottom of the page. Pick All to see every choice at once.</p>}
          </div>
        )}
        <div className="sb-page__frame">
          {stage}
          {built && <CodeBar code={code} />}
          <div className="sb-page__tablewrap">
            <table className="sb-page__table">
              <caption className="sb-page__vh">About {name}</caption>
              <thead>
                <tr>
                  <th scope="col">Question</th>
                  <th scope="col">Answer</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Is it ready to use?</th>
                  <td>
                    <StatusPill status={info.status} />
                  </td>
                  <td>
                    <p className="sb-page__note-line">Updated {formatDate(info.updated)}</p>
                    {info.design ? (
                      <a href={info.design.href} target="_blank" rel="noreferrer">
                        {info.design.label}
                        <span className="sb-page__vh"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      // A built part's code is its design; only a planned one says it has no design file yet.
                      !built && <p className="sb-page__note-line">No design file yet (Figma or Claude).</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <th scope="row">When do I use it?</th>
                  <td>
                    <List items={info.useFor} />
                  </td>
                  <td>{info.useForNotes && <List items={info.useForNotes} />}</td>
                </tr>
                {info.useElse && info.useElse.length > 0 && (
                  <tr>
                    <th scope="row">When don&apos;t I use it?</th>
                    <td>
                      <List items={info.useElse.map((u) => u.job)} />
                    </td>
                    <td>
                      <List
                        items={info.useElse.map((u, i) =>
                          u.instead ? (
                            <Fragment key={i}>
                              Instead use <DocLink href={pagePath(u.instead.title)}>{u.instead.name}</DocLink>
                            </Fragment>
                          ) : (
                            ''
                          ),
                        )}
                      />
                    </td>
                  </tr>
                )}
                <tr>
                  <th scope="row">What codebase is it built with?</th>
                  <td>{reactAria ? 'React Aria' : 'Our design system'}</td>
                  <td>
                    {reactAria ? (
                      <a href={`https://react-aria.adobe.com/${reactAria}`} target="_blank" rel="noreferrer">
                        See React Aria&apos;s {reactAria}
                        <span className="sb-page__vh"> (opens in a new tab)</span>
                      </a>
                    ) : source ? (
                      <a href={`${repo}${source}`} target="_blank" rel="noreferrer">
                        See the source file
                        <span className="sb-page__vh"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <p className="sb-page__note-line">No source file yet.</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(info.do || info.dont) && (
        <section id="sb-section-usage" className="sb-page__section" aria-label="Usage rules">
          <div className="sb-page__pair">
            {(['do', 'dont'] as const).map((kind) => {
              const rule = info[kind];
              if (!rule) return null;
              return (
                <section key={kind} className={`sb-page__rule sb-page__rule--${kind}`} aria-labelledby={`sb-rule-${kind}`}>
                  <h2 id={`sb-rule-${kind}`} className="sb-page__verdict">
                    <svg width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {kind === 'do' ? <path d="m3 8.5 3 3 7-7" /> : <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />}
                    </svg>
                    {kind === 'do' ? 'Use it for this' : "Don't use it for this"}
                  </h2>
                  <div className="sb-page__rule-card">
                    <div className="sb-page__example" data-theme={shownThemes[0]} data-mode={modes[0]} inert>
                      {rule.example}
                    </div>
                    <List items={rule.rules} className="sb-page__rule-text" />
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      )}

      {built && (
        <section id="sb-section-a11y" className="sb-page__section" aria-labelledby="sb-a11y-heading">
          <div className="sb-page__section-head">
            <h2 id="sb-a11y-heading" className="sb-page__h2">
              Accessibility
            </h2>
            <p className="sb-page__lead">A component is accessibility-ready when it passes every check below. The Accessibility tab at the bottom runs them on the example you picked.</p>
          </div>
          <div className="sb-page__frame">
            <div className="sb-page__tablewrap">
              <table className="sb-page__table">
                <caption className="sb-page__vh">Accessibility checks for {name}</caption>
                <thead>
                  <tr>
                    <th scope="col">Trigger</th>
                    <th scope="col">Result</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {standardChecks.map((c) => (
                    <tr key={c.trigger}>
                      <th scope="row">{c.trigger}</th>
                      <td>
                        <Result />
                      </td>
                      <td>{c.note}</td>
                    </tr>
                  ))}
                  {info.keys?.map((k) => (
                    <tr key={k.keys.join()}>
                      <th scope="row">
                        Press{' '}
                        {k.keys.map((key, i) => (
                          <Fragment key={key}>
                            {i > 0 && ' or '}
                            <kbd className="sb-page__kbd">{key}</kbd>
                          </Fragment>
                        ))}
                      </th>
                      <td>
                        <Result />
                      </td>
                      <td>{k.result}</td>
                    </tr>
                  ))}
                  {info.screenReader && (
                    <tr>
                      <th scope="row">A screen reader says &quot;{info.screenReader.pattern}&quot;</th>
                      <td>
                        <Result />
                      </td>
                      <td>Example: &quot;{info.screenReader.example}&quot;</td>
                    </tr>
                  )}
                  {info.accessibility?.map((a, i) => (
                    <tr key={i}>
                      <th scope="row">{a}</th>
                      <td>
                        <Result />
                      </td>
                      <td />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {built && info.imports && (
        <details className="sb-page__engineers">
          <summary>For engineers: props, tokens and import</summary>
          <div className="sb-page__engineers-body">
            <pre className="sb-page__import">
              <code>{`import { ${info.imports.join(', ')} } from 'design-system-skeleton';`}</code>
            </pre>
            <PropTable argTypes={argTypes} />
            {info.tokens && (
              <p className="sb-page__tokens">
                <span>Tokens it uses</span>
                {info.tokens.map((t) => (
                  <code key={t}>{t}</code>
                ))}
              </p>
            )}
          </div>
        </details>
      )}

      {info.related && info.related.length > 0 && (
        <section id="sb-section-related" className="sb-page__section" aria-labelledby="sb-related-heading">
          <h2 id="sb-related-heading" className="sb-page__h2">
            Related
          </h2>
          <p className="sb-page__related">
            {info.related.map((r) => (
              <DocLink key={r.title} href={r.story ? `/?path=/story/${r.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}--${r.story}` : pagePath(r.title)}>
                {r.name}
              </DocLink>
            ))}
          </p>
        </section>
      )}
    </div>
  );
}

type ArgType = { name?: string; description?: string; options?: unknown[]; table?: { category?: string; type?: { summary?: string }; defaultValue?: { summary?: string }; disable?: boolean } };

/** The props, from the component's own types and comments. */
function PropTable({ argTypes }: { argTypes: PageArgTypes }) {
  const rows = Object.entries(argTypes).filter(([key, a]) => !isPageArg(key) && !a.table?.disable && a.description && !/@deprecated|^Deprecated/i.test(a.description));
  if (!rows.length) return null;
  return (
    <div className="sb-page__frame">
      <table className="sb-page__table">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">What it does</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, a]) => (
            <tr key={key}>
              <th scope="row">
                <code>{key}</code>
              </th>
              <td>
                <code>{a.options && a.table?.type?.summary === 'union' ? a.options.filter((o) => o !== 'all').map((o) => (typeof o === 'string' ? `'${o}'` : String(o))).join(' | ') : (a.table?.type?.summary ?? '')}</code>
              </td>
              <td>
                <code>{a.table?.defaultValue?.summary ?? 'none'}</code>
              </td>
              <td>{a.description!.split('\n\n')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------
// The stories a stories file exports.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStory = StoryObj<Meta<any>>;

function pageRender(section: Section | undefined, tryIt: boolean) {
  return function PageStory(args: Record<string, unknown>, context: StoryContext) {
    return (
      <ComponentPage
        info={context.parameters.componentPage as ComponentPageInfo}
        name={context.title.split('/').at(-1) ?? ''}
        component={context.component as ComponentType<Record<string, unknown>> | undefined}
        args={args}
        argTypes={context.argTypes as PageArgTypes}
        initialArgs={context.initialArgs}
        theme={String(context.globals.theme ?? themeList[0].id)}
        pageMode={String(context.globals.pageMode ?? 'light')}
        section={section}
        tryIt={tryIt}
      />
    );
  };
}

// Compare all is drawn inside Try it out, so the preview doesn't repeat the whole page per theme.
const pageParameters = { layout: 'fullscreen', compareAll: false };

/**
 * The component's page and its sidebar entries. Storybook reads names and tags without running the
 * code, so each stories file writes them out, the same every time:
 *   export const Overview: Story = { ...pageStory(), tags: ['page'] };
 *   export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
 *   ...UsageRules ('usage', 'Usage rules'), Accessibility ('a11y'), Related ('related').
 * Test stories get tags: ['!dev'], so screenshot and accessibility tests run on them but they stay out
 * of the sidebar. Pages are tagged page, so screenshot tests skip them; the test stories cover the looks.
 * Pass tryIt: false for a component with nothing to change in Controls, and leave out its TryItOut.
 */
export const pageStory = (section?: Exclude<Section, 'overview'>, { tryIt = true }: { tryIt?: boolean } = {}): AnyStory => ({
  parameters: pageParameters,
  render: pageRender(section, tryIt) as AnyStory['render'],
});
