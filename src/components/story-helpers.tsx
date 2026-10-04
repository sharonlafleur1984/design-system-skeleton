import type { CSSProperties, ReactNode } from 'react';

// Storybook-only helpers. Not exported from the component library.

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
// A small preview image, stretched; the real files are 6000 x 4000.
const backgrounds: Record<string, string> = {
  'life-hub': "url('texture-sage-cream.jpg') center / cover, var(--color-surface-page)",
  'after-graduation': 'var(--color-surface-page)',
};

/** Shows the same content in every product theme, side by side. */
export function BothThemes({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
      {[
        ['life-hub', 'Life Hub'],
        ['after-graduation', 'After Graduation'],
      ].map(([theme, name]) => (
        <section key={theme} data-theme={theme} style={{ ...panel, background: backgrounds[theme] }} aria-label={name}>
          <p style={caption}>{name}</p>
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
