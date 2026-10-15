import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useGlassLight } from './glass-light/glass-light';
import { imageArt } from './glass-lens/lens-art';
import { LIGHT_CHANGE } from './glass-lens/lens';
import { LitContext, type Appearance } from './material';
import { storyPageArt } from './glass-lens/story-art';
import { Orb, ORB_START } from './orb/orb';
import themes from '../../build/themes.json';

// Storybook-only helpers. Not exported from the component library.

/**
 * Every theme, in the order the toolbar and the side-by-side view show them. Read from the token build
 * (each tokens/themes/<id>/theme.json), so a new theme folder shows up here with no code change.
 */
export const themeList: string[] = themes.map((t) => t.id);
export type Theme = string;
/** The toolbar's Theme picker: one product, or 'both' to compare them all side by side. */
export type ThemeChoice = Theme | 'both';
export const ThemeContext = createContext<ThemeChoice>('after-graduation');

/** The theme to use when a story can only show one. 'Both' falls back to the first theme. */
export function singleTheme(choice: unknown): Theme {
  return themeList.includes(choice as Theme) ? (choice as Theme) : themeList[0];
}

// Normal page flow, not a stretching column: buttons and other inline controls keep their own size,
// and full-width things (tile groups, cards) still fill the panel. Space between items: .ds-story-panel.
const panel: CSSProperties = {
  flex: '1 1 320px',
  display: 'flow-root',
  padding: 'var(--space-6)',
  borderRadius: 'var(--radius-panel)',
  background: 'var(--color-surface-page)',
  color: 'var(--color-ink-primary)',
  fontFamily: 'var(--font-family-body)',
};

const caption: CSSProperties = {
  margin: 0,
  color: 'var(--color-ink-tertiary)',
  fontSize: 'var(--type-label-size)',
  fontWeight: 'var(--font-weight-semibold)' as CSSProperties['fontWeight'],
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

// What a product's pages sit on, per theme, for BothThemes' panels. Life Hub pages sit on a marbled
// texture (Figma: Background Texture, sage-cream for the Dashboard): a small preview image,
// stretched; the real files are 6000 x 4000. In dark mode the Dashboard's night layer covers it
// (transparent in light mode). In After Graduation's dark mode the header's red glows down from the
// top right (transparent in light mode). Written as a string, not a CSS file, so the texture's
// address stays relative to the page, as the build expects.
export const storyBackgroundsCss = `
/* A background picked in the bar above the story (a theme's backgrounds in its theme.json) fills the page. */
:root[data-sb-backdrop] body {
  background: var(--story-bg-page);
  background-attachment: fixed;
}
/* Space between the items in a theme panel, and a wider gap between groups of still pictures, so each group reads as one. The lens canvas sits behind them, so it is left out (a margin would draw the glass off its element). */
.ds-story-panel > :not(.ds-lens-canvas) ~ :not(.ds-lens-canvas) {
  margin-block-start: var(--space-4);
}
.ds-story-stack > * + * {
  margin-block-start: var(--space-7);
}
[data-theme="life-hub"] {
  --story-bg-page: linear-gradient(var(--color-area-dashboard-night), var(--color-area-dashboard-night)), var(--story-backdrop, url('texture-sage-cream.jpg')) center / cover, var(--color-surface-page);
}
[data-theme="after-graduation"],
[data-theme="designer-toolkit"] {
  --story-bg-page: radial-gradient(90% 70% at 100% 0%, var(--shell-glow), transparent 70%), var(--color-surface-page);
}`;

// Test surfaces for Storybook's Background button (toolbar): neutral on purpose, so a component
// is judged on its own, not on one product's colors. Storybook only; never use these in a component.
// Mid-tone is where contrast is hardest; the pattern and gradient are the worst cases for glass.
export const storyBackgrounds = {
  light: { name: 'Light', value: '#f7f7f5' },
  dark: { name: 'Dark', value: '#141414' },
  mid: { name: 'Mid-tone', value: '#808080' },
  pattern: { name: 'Busy pattern', value: 'repeating-linear-gradient(45deg, #111 0 12px, #f5f5f5 12px 24px)' },
  gradient: { name: 'Gradient', value: 'linear-gradient(135deg, #fafafa, #7a7a7a 50%, #0a0a0a)' },
};

/** Shows the content once on every test background, labeled, for glass and other see-through components. */
export function OnEveryBackground({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      {Object.values(storyBackgrounds).map((bg) => (
        <section key={bg.name} aria-label={bg.name} style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-panel)', background: bg.value }}>
          <p style={{ ...caption, display: 'inline-block', marginBlockEnd: 'var(--space-3)', padding: '2px 8px', borderRadius: '999px', background: '#fff', color: '#141414' }}>{bg.name}</p>
          {children}
        </section>
      ))}
    </div>
  );
}

/** Each theme's name as people see it, like Spotlight. */
export const themeNames: Record<Theme, string> = Object.fromEntries(themes.map((t) => [t.id, t.name]));

// Storybook's own chrome, not any theme: the same in every column.
// Small and on the right, in from the rounded corner, so the theme's name labels its column without competing with the part's name (Sharon, Oct 15).
const compareHeading: CSSProperties = { margin: 0, font: '600 12px/1.4 system-ui, sans-serif', color: '#525252', textAlign: 'end', paddingInlineEnd: '16px' };

/** True inside one theme's panel of the Compare all view, which Storybook's preview builds for every story. */
const InComparePanel = createContext(false);

/**
 * Shows the content in its theme's panel: the theme's real page background, with its glass lit.
 * In the Compare all view the preview already gives each theme a panel, so this adds nothing there.
 */
export function BothThemes({ children }: { children: ReactNode }) {
  const choice = useContext(ThemeContext);
  if (useContext(InComparePanel)) return <>{children}</>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
      <ThemePanel theme={singleTheme(choice)} heading={false}>
        {children}
      </ThemePanel>
    </div>
  );
}

/**
 * Compare all: the story once per theme, side by side, each in its own panel with its name. Used by
 * Storybook's preview for every story, so Compare all works on every page. `render` draws the story
 * in the theme it's given.
 */
export function CompareAll({ render }: { render: (theme: Theme) => ReactNode }) {
  return (
    <div className="ds-compare-all">
      <style>{compareAllCss}</style>
      <div className="ds-compare-all__grid">
        {themeList.map((theme) => (
          <ThemeContext.Provider key={theme} value={theme}>
            <InComparePanel.Provider value>
              {/* The theme's name above its column, in Storybook's own type, so it's clear which theme
                  everything under it belongs to. */}
              <section aria-labelledby={`compare-${theme}`} style={{ minWidth: 0, display: 'grid', gap: '8px', alignContent: 'start' }}>
                <h2 id={`compare-${theme}`} style={compareHeading}>
                  {themeNames[theme]}
                </h2>
                {/* A hairline around each column, so a theme whose page matches the background still reads as its own column. */}
                <div style={{ display: 'flow-root', borderRadius: 'var(--radius-panel)', boxShadow: '0 0 0 1px #d4d4d4' }}>
                  <ThemePanel theme={theme} heading={false}>
                    {render(theme)}
                  </ThemePanel>
                </div>
              </section>
            </InComparePanel.Provider>
          </ThemeContext.Provider>
        ))}
      </div>
    </div>
  );
}

// Every theme in equal columns when they all fit at 320px or wider, otherwise one theme per row.
// Never a row of two with one left over, which reads as if the last theme mattered less.
const compareColumn = 320;
const compareGap = 16;
const compareAllCss = `
.ds-compare-all { container-type: inline-size; }
.ds-compare-all__grid { display: grid; gap: ${compareGap}px; grid-template-columns: minmax(0, 1fr); }
@container (min-width: ${themeList.length * compareColumn + (themeList.length - 1) * compareGap}px) {
  .ds-compare-all__grid { grid-template-columns: repeat(${themeList.length}, minmax(0, 1fr)); }
}`;

/**
 * One theme's panel: its real page background, and the glass on it lit and bent from that background,
 * exactly as the Glass playground does it (the same art, the same light). Glass groups inside don't
 * light themselves, so every glass story shows the glass as designed.
 */
function ThemePanel({ theme, heading, children }: { theme: Theme; heading: boolean; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const lens = useMemo(() => ({ art: storyPageArt(theme) }), [theme]);
  // The same long reach as the Glass playground: sunlight is even across the page, so every piece of
  // glass catches it about as strongly wherever the sun is.
  useGlassLight(ref, { selector: '.ds-glass', lens, reach: 6 });
  return (
    <section ref={ref} className="ds-story-panel" data-theme={theme} style={{ ...panel, position: 'relative', isolation: 'isolate', background: 'var(--story-bg-page)' }} aria-label={themeNames[theme]}>
      {heading && <p style={caption}>{themeNames[theme]}</p>}
      <LitContext.Provider value>{children}</LitContext.Provider>
    </section>
  );
}

/**
 * Storybook only: a States story's examples as still pictures. Each example is pinned to one state
 * (data-state="hover" and so on), so they ignore the mouse and keyboard: hovering the "Hover" example
 * never stacks a real hover on top. The Playground story is where the states can be tried for real.
 */
export function StatePictures({ children }: { children: ReactNode }) {
  return (
    <>
      <p style={note}>Still pictures of each state. To try them, use Playground.</p>
      <div inert className="ds-story-stack">
        {children}
      </div>
    </>
  );
}

const note: CSSProperties = {
  margin: 0,
  color: 'var(--color-ink-secondary)',
  fontSize: 'var(--type-body-small-size)',
  lineHeight: 'var(--type-body-small-line-height)',
};

/** A labeled row, for galleries of variants and states. */
export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>
      <span style={{ ...caption, minInlineSize: '96px' }}>{label}</span>
      {children}
    </div>
  );
}

// Life Hub's marble backgrounds, one per area plus the spare (Figma: Background Texture). Small preview
// images in .storybook/public; the real files are 6000 x 4000. In dark mode each area's night layer
// covers its marble (transparent in light mode).
// Each marble's color family (its area's palette), which its orb glows in. The spare has no area yet;
// berry pie is the closest family to its coral, an estimate.
export const marbles = [
  { area: 'dashboard', name: 'Dashboard', texture: 'texture-sage-cream.jpg', palette: 'earth-moss' },
  { area: 'time', name: 'Time', texture: 'texture-seagull.jpg', palette: 'seagull' },
  { area: 'finance', name: 'Finance', texture: 'texture-sea-nymph.jpg', palette: 'sea-nymph' },
  { area: 'parenting', name: 'Parenting', texture: 'texture-lilacs-lavender.jpg', palette: 'lilacs-lavender' },
  { area: 'health', name: 'Health', texture: 'texture-berry-pie.jpg', palette: 'berry-pie' },
  { area: 'home', name: 'Home', texture: 'texture-morning-latte.jpg', palette: 'morning-latte' },
  { area: 'office', name: 'Office', texture: 'texture-gold-sand.jpg', palette: 'gold-sand' },
  { area: 'professional', name: 'Professional', texture: 'texture-nocturnal-navy.jpg', palette: 'nocturnal-navy' },
  { area: 'growth', name: 'Personal growth', texture: 'texture-sunflower-medley.jpg', palette: 'sunflower-medley' },
  { area: null, name: 'Spare (future option B)', texture: 'texture-future-option-b.jpg', palette: 'berry-pie' },
] as const;
export type Marble = (typeof marbles)[number];

/**
 * Storybook only: a piece of Life Hub's marble with glass on it, lit from the shared light (top right).
 * The marble is the container's background, and the same image is the lens's art, so the glass bends
 * exactly what's behind it. appearance="solid" shows it without the lens (the frosted look).
 */
export function OnMarble({ marble = marbles[0], appearance = 'glass', children, label }: { marble?: Marble; appearance?: Appearance; children: ReactNode; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const night = marble.area ? `var(--color-area-${marble.area}-night)` : 'var(--color-area-dashboard-night)';
  const art = useMemo(() => (appearance === 'glass' ? { art: imageArt({ src: marble.texture, overlay: night }) } : false), [appearance, marble.texture, night]);
  useGlassLight(ref, { selector: '.ds-glass', lens: art, reach: 6 });
  const style: CSSProperties = {
    position: 'relative',
    isolation: 'isolate',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 'var(--space-3)',
    minBlockSize: '160px',
    padding: 'var(--space-6)',
    borderRadius: 'var(--radius-panel)',
    background: `linear-gradient(${night}, ${night}), url('${marble.texture}') center / cover`,
  };
  return (
    <section ref={ref} data-theme="life-hub" style={style} aria-label={label ?? marble.name}>
      <LitContext.Provider value>{children}</LitContext.Provider>
    </section>
  );
}

/** Storybook only: turns on the app's own Reduce motion setting (as Settings does) while the story is open. */
export function WithReducedMotion({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const had = root.hasAttribute('data-reduce-motion');
    root.setAttribute('data-reduce-motion', '');
    return () => {
      if (!had) root.removeAttribute('data-reduce-motion');
    };
  }, []);
  return <>{children}</>;
}

/**
 * Where every movable light in Storybook starts, as a share of its section: the bottom right (Sharon's
 * rule, Oct 15). Every orb starts here, in any section, theme or mode. The same as the Orb's ORB_START.
 */
export const SUN_START = ORB_START;

/**
 * Storybook only: the page's one light, shown as the orb, on every story that shows glass (glass can't
 * be judged without seeing where its light comes from). Drag the orb, or focus it and use the arrow
 * keys, and every rim, highlight and shadow follows. It's the page light (data-glass-light), so all
 * glass in the story shares it. Stories with their own light (the Glass playground's orb, the page
 * shell's wheel) keep theirs, and no second orb is shown.
 */
export function LightScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  // Where the orb is, as a share of the scene. It starts at the bottom right.
  const [sun, setSun] = useState(SUN_START);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setShow(!!el.querySelector('.ds-glass, .ds-lens') && !el.querySelector('[data-sun], .ds-orb:not([data-glass-light]), .ds-shell'));
    check();
    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  useLayoutEffect(() => {
    window.dispatchEvent(new Event(LIGHT_CHANGE));
  }, [sun, show]);

  return (
    <div ref={ref} style={{ position: 'relative', paddingBlockStart: show ? 'var(--space-6)' : undefined }}>
      {show && <Orb data-glass-light="" position={sun} onPositionChange={setSun} />}
      {children}
    </div>
  );
}

// Storybook only: simple line icons for stories (24 x 24, drawn in the text color).
const lineIcon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
export const storyIcons = {
  calendar: lineIcon(
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </>,
  ),
  star: lineIcon(<path d="m12 4 2.5 5 5.5.8-4 3.9.9 5.5L12 16.6 7.1 19.2l.9-5.5-4-3.9 5.5-.8z" />),
  wallet: lineIcon(
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M16 14.5h2" />
    </>,
  ),
  book: lineIcon(
    <>
      <path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
      <path d="M5 17a3 3 0 0 1 3-3h10" />
    </>,
  ),
};

/**
 * Storybook only: friendly Controls. Each setting gets a plain name and one line saying what it does
 * (the template's Setting and What it does), and a yes-or-no setting is an Off | On button set.
 */
export const setting = (name: string, description: string, extra: Record<string, unknown> = {}) => ({ name, description, ...extra });
export const onOff = (name: string, description: string) =>
  setting(name, description, { control: { type: 'inline-radio', labels: { false: 'Off', true: 'On', all: 'All' } }, options: [false, true, 'all'] });
/** Every option list ends with All, which the component page shows as every choice at once. */
export const choice = (name: string, description: string, options: string[]) =>
  setting(name, description, { control: { type: 'inline-radio', labels: { ...Object.fromEntries(options.map((o) => [o, o[0].toUpperCase() + o.slice(1)])), all: 'All' } }, options: [...options, 'all'] });
/** A setting typed as words, like a label. */
export const words = (name: string, description: string) => setting(name, description, { control: 'text' });
/** Hides a prop from Controls and the props table: deprecated aliases and Storybook-only props. */
export const hidden = { table: { disable: true } };
