import { createContext, useContext, useLayoutEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import { useGlassLight } from './glass-light/glass-light';
import { imageArt } from './glass-lens/lens-art';

// Storybook-only helpers. Not exported from the component library.

/** Every product theme, in the order the toolbar and the side-by-side view show them. */
export const themeList = ['after-graduation', 'life-hub', 'designer-toolkit'] as const;
export type Theme = (typeof themeList)[number];
/** The toolbar's Theme picker: one product, or 'both' to compare them all side by side. */
export type ThemeChoice = Theme | 'both';
export const ThemeContext = createContext<ThemeChoice>('after-graduation');

/** The theme to use when a story can only show one. 'Both' falls back to After Graduation. */
export function singleTheme(choice: unknown): Theme {
  return themeList.includes(choice as Theme) ? (choice as Theme) : 'after-graduation';
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

export const themeNames: Record<Theme, string> = { 'after-graduation': 'Spotlight', 'life-hub': 'Sunrise', 'designer-toolkit': 'Fireside' };

/**
 * Shows the content in the theme picked in the toolbar. Pick "All" to see
 * every product side by side; otherwise only one product shows at a time.
 */
export function BothThemes({ children }: { children: ReactNode }) {
  const choice = useContext(ThemeContext);
  const shown = choice === 'both' ? themeList : [singleTheme(choice)];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
      {shown.map((theme) => (
        <section key={theme} data-theme={theme} style={{ ...panel, background: 'var(--story-bg-page)' }} aria-label={themeNames[theme]}>
          {shown.length > 1 && <p style={caption}>{themeNames[theme]}</p>}
          {children}
        </section>
      ))}
    </div>
  );
}

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
 * exactly what's behind it. lens={false} shows the classic glass (the fallback).
 */
export function OnMarble({ marble = marbles[0], lens = true, children, label }: { marble?: Marble; lens?: boolean; children: ReactNode; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const night = marble.area ? `var(--color-area-${marble.area}-night)` : 'var(--color-area-dashboard-night)';
  const art = useMemo(() => (lens ? { art: imageArt({ src: marble.texture, overlay: night }) } : false), [lens, marble.texture, night]);
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
      {children}
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
