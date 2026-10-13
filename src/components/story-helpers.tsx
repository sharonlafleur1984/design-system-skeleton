import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';

// Storybook-only helpers. Not exported from the component library.

/** The toolbar's Theme picker: one product, or 'both' to compare them side by side. */
export type ThemeChoice = 'after-graduation' | 'life-hub' | 'both';
export const ThemeContext = createContext<ThemeChoice>('after-graduation');

/** The theme to use when a story can only show one. 'Both' falls back to After Graduation. */
export function singleTheme(choice: unknown): 'after-graduation' | 'life-hub' {
  return choice === 'life-hub' ? 'life-hub' : 'after-graduation';
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
[data-theme="after-graduation"] {
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

const themeNames = { 'after-graduation': 'After Graduation', 'life-hub': 'Life Hub' } as const;

/**
 * Shows the content in the theme picked in the toolbar. Pick "Both" to see
 * every product side by side; otherwise only one product shows at a time.
 */
export function BothThemes({ children }: { children: ReactNode }) {
  const choice = useContext(ThemeContext);
  const shown = choice === 'both' ? (['life-hub', 'after-graduation'] as const) : [singleTheme(choice)];
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
