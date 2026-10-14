import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { useGlassLight } from './glass-light/glass-light';
import { imageArt } from './glass-lens/lens-art';
import { LIGHT_CHANGE } from './glass-lens/lens';
import { LitContext, type Material } from './material';
import { storyPageArt } from './glass-lens/story-art';
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
/** The theme of the side-by-side panel a story is drawn in, or null outside one. */
export const PanelThemeContext = createContext<Theme | null>(null);

/** The theme to use when a story can only show one. 'Both' falls back to the first theme. */
export function singleTheme(choice: unknown): Theme {
  return themeList.includes(choice as Theme) ? (choice as Theme) : themeList[0];
}

const panel: CSSProperties = {
  flex: '1 1 320px',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)',
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

// The theme's name above its panel in "All": that theme's own title style, with a
// line under it, so it reads as a heading and never as one of the gray row labels below it.
const themeHeading: CSSProperties = {
  margin: 0,
  paddingBlockEnd: 'var(--space-3)',
  borderBlockEnd: '1px solid var(--color-border-subtle)',
  color: 'var(--color-ink-primary)',
  fontFamily: 'var(--type-heading-title-family)',
  fontSize: 'var(--type-heading-title-size)',
  fontWeight: 'var(--type-heading-title-weight)' as CSSProperties['fontWeight'],
  lineHeight: 'var(--type-heading-title-line-height)',
  letterSpacing: 'var(--type-heading-title-letter-spacing)',
};

// What a product's pages sit on, per theme, for BothThemes' panels. Life Hub pages sit on a marbled
// texture (Figma: Background Texture, sage-cream for the Dashboard): a small preview image,
// stretched; the real files are 6000 x 4000. In dark mode the Dashboard's night layer covers it
// (transparent in light mode). In After Graduation's dark mode the header's red glows down from the
// top right (transparent in light mode). Written as a string, not a CSS file, so the texture's
// address stays relative to the page, as the build expects.
export const storyBackgroundsCss = `
[data-theme="life-hub"] {
  --story-bg-page: linear-gradient(var(--color-area-dashboard-night), var(--color-area-dashboard-night)), url('texture-sage-cream.jpg') center / cover, var(--color-surface-page);
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

/**
 * Shows the content in the theme picked in the toolbar. Pick "All" to see
 * every product side by side; otherwise only one product shows at a time.
 */
export function BothThemes({ children }: { children: ReactNode }) {
  const choice = useContext(ThemeContext);
  const inPanel = useContext(PanelThemeContext);
  // With "All" picked, Storybook already draws every component story once per theme (preview.tsx),
  // so a story that also asks for BothThemes just shows its content inside that theme's panel.
  if (inPanel) return <>{children}</>;
  const shown = choice === 'both' ? themeList : [singleTheme(choice)];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
      {shown.map((theme) => (
        <ThemePanel key={theme} theme={theme} heading={shown.length > 1}>
          {children}
        </ThemePanel>
      ))}
    </div>
  );
}

/**
 * One theme's panel: its real page background, and the glass on it lit and bent from that background,
 * exactly as the Glass playground does it (the same art, the same light). Glass groups inside don't
 * light themselves, so every glass story shows the glass as designed.
 */
function ThemePanel({ theme, heading, children }: { theme: Theme; heading: boolean; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const lens = useMemo(() => ({ art: storyPageArt(theme) }), [theme]);
  useGlassLight(ref, { selector: '.ds-glass', lens });
  return (
    <section ref={ref} data-theme={theme} style={{ ...panel, position: 'relative', isolation: 'isolate', background: 'var(--story-bg-page)' }} aria-label={themeNames[theme]}>
      {heading && <p style={themeHeading}>{themeNames[theme]}</p>}
      <PanelThemeContext.Provider value={theme}>
        <LitContext.Provider value>{children}</LitContext.Provider>
      </PanelThemeContext.Provider>
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
      <div inert style={{ display: 'contents' }}>
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
export const marbles = [
  { area: 'dashboard', name: 'Dashboard', texture: 'texture-sage-cream.jpg' },
  { area: 'time', name: 'Time', texture: 'texture-seagull.jpg' },
  { area: 'finance', name: 'Finance', texture: 'texture-sea-nymph.jpg' },
  { area: 'parenting', name: 'Parenting', texture: 'texture-lilacs-lavender.jpg' },
  { area: 'health', name: 'Health', texture: 'texture-berry-pie.jpg' },
  { area: 'home', name: 'Home', texture: 'texture-morning-latte.jpg' },
  { area: 'office', name: 'Office', texture: 'texture-gold-sand.jpg' },
  { area: 'professional', name: 'Professional', texture: 'texture-nocturnal-navy.jpg' },
  { area: 'growth', name: 'Personal growth', texture: 'texture-sunflower-medley.jpg' },
  { area: null, name: 'Spare (future option B)', texture: 'texture-future-option-b.jpg' },
] as const;
export type Marble = (typeof marbles)[number];

/**
 * Storybook only: a piece of Life Hub's marble with glass on it, lit from the shared light (top right).
 * The marble is the container's background, and the same image is the lens's art, so the glass bends
 * exactly what's behind it. material="default" shows the subtle frosted look.
 */
export function OnMarble({ marble = marbles[0], material = 'glass', children, label }: { marble?: Marble; material?: Material; children: ReactNode; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const night = marble.area ? `var(--color-area-${marble.area}-night)` : 'var(--color-area-dashboard-night)';
  const art = useMemo(() => (material === 'glass' ? { art: imageArt({ src: marble.texture, overlay: night }) } : false), [material, marble.texture, night]);
  useGlassLight(ref, { selector: '.ds-glass', lens: art });
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
 * Storybook only: the page's one light, shown as a sun, on every story that shows glass (glass can't
 * be judged without seeing where its light comes from). Drag the sun, or focus it and use the arrow
 * keys, and every rim, highlight and shadow follows. It's the page light (data-glass-light), so all
 * glass in the story shares it. Stories with their own light (the Glass playground's sun, the page
 * shell's wheel) keep theirs, and no sun is shown.
 */
export function LightScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  // Where the sun is, as a share of the scene: top right, above the content.
  const [sun, setSun] = useState({ x: 0.97, y: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setShow(!!el.querySelector('.ds-glass, .ds-lens') && !el.querySelector('[data-sun], .ds-shell'));
    check();
    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  useLayoutEffect(() => {
    window.dispatchEvent(new Event(LIGHT_CHANGE));
  }, [sun, show]);

  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const moveTo = (e: PointerEvent<HTMLElement>) => {
    const r = ref.current!.getBoundingClientRect();
    setSun({ x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) });
  };
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const d = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, number[]>)[e.key];
    if (!d) return;
    e.preventDefault();
    setSun((s) => ({ x: clamp(s.x + d[0]), y: clamp(s.y + d[1]) }));
  };
  const sunStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 5,
    left: `${sun.x * 100}%`,
    top: `${sun.y * 100}%`,
    inlineSize: 'var(--space-5)',
    blockSize: 'var(--space-5)',
    marginInlineStart: 'calc(var(--space-5) / -2)',
    marginBlockStart: 'calc(var(--space-5) / -2)',
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #fff7d6 0 30%, #f5c542 45%, rgba(245, 197, 66, 0) 72%)',
    boxShadow: '0 0 24px 8px rgba(245, 197, 66, 0.35)',
    cursor: 'grab',
    touchAction: 'none',
  };
  return (
    <div ref={ref} style={{ position: 'relative', paddingBlockStart: show ? 'var(--space-6)' : undefined }}>
      {show && (
        <button
          type="button"
          data-glass-light=""
          aria-label="Light. Drag it, or use the arrow keys to move it."
          style={sunStyle}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            moveTo(e);
          }}
          onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && moveTo(e)}
          onKeyDown={onKey}
        />
      )}
      {children}
    </div>
  );
}
