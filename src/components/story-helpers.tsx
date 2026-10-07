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

// Life Hub pages sit on a marbled texture (Figma: Background Texture, sage-cream for the Dashboard).
// A small preview image, stretched; the real files are 6000 x 4000. In dark mode the Dashboard's
// night layer covers it (transparent in light mode).
const backgrounds: Record<string, string> = {
  'life-hub':
    "linear-gradient(var(--color-area-dashboard-night), var(--color-area-dashboard-night)), url('texture-sage-cream.jpg') center / cover, var(--color-surface-page)",
  'after-graduation': 'var(--color-surface-page)',
};

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
        <section key={theme} data-theme={theme} style={{ ...panel, background: backgrounds[theme] }} aria-label={themeNames[theme]}>
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
