import type { Meta, StoryObj } from '@storybook/react-vite';
import { namesWith } from './tokens';

const meta: Meta = { title: 'Foundations/Space, radius and shadow' };
export default meta;

const label = { fontFamily: 'var(--font-family-data)', fontSize: 'var(--type-body-small-size)', color: 'var(--color-ink-secondary)' };

/** A 4-point spacing scale, shared by every theme. */
export const Space: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      {namesWith('space-').map((n) => (
        <div key={n} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: 'var(--space-4)' }}>
          <code style={label}>--{n}</code>
          <div style={{ height: 12, width: `var(--${n})`, background: 'var(--color-accent-base)', borderRadius: 'var(--radius-xs)' }} />
        </div>
      ))}
    </div>
  ),
};

/** Page spacing that changes by screen class. Switch the viewport to see it change. */
export const Layout: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      {namesWith('layout-').map((n) => (
        <div key={n} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', gap: 'var(--space-4)' }}>
          <code style={label}>--{n}</code>
          <div style={{ height: 12, width: `var(--${n})`, background: 'var(--color-accent-base)', borderRadius: 'var(--radius-xs)' }} />
        </div>
      ))}
    </div>
  ),
};

const Box = ({ style, name }: { style: React.CSSProperties; name: string }) => (
  <figure style={{ margin: 0, display: 'grid', gap: 'var(--space-2)' }}>
    <div style={{ height: 88, background: 'var(--color-surface-card)', border: '1px solid var(--color-border-default)', ...style }} />
    <figcaption><code style={label}>--{name}</code></figcaption>
  </figure>
);

const shapeRow: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 'var(--space-4)' };
const Shape = ({ name, size, corner }: { name: string; size: string; corner: string }) => (
  <figure style={{ margin: 0, display: 'grid', gap: 'var(--space-2)', justifyItems: 'start' }}>
    <div style={{ blockSize: size, minInlineSize: size, paddingInline: name === 'corner-box' ? 0 : 'var(--space-4)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-default)', borderRadius: corner }} />
    <figcaption><code style={label}>{name}</code></figcaption>
  </figure>
);

/**
 * Corners: each theme sets one roundness (Square, Standard or Round, in `shape-roundness`), and every
 * corner is worked out from it and the part's own size, so a part keeps the same shape at every size.
 * Controls take height x roundness / 2; surfaces take padding x roundness x 1.6. Pick a theme in the toolbar.
 */
export const Radius: StoryObj = {
  name: 'Corners',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <div style={shapeRow}>
        <Shape name="corner-box" size="var(--control-box)" corner="var(--corner-box)" />
        <Shape name="corner-small" size="var(--control-height-small)" corner="var(--corner-small)" />
        <Shape name="corner-medium" size="var(--control-height-medium)" corner="var(--corner-medium)" />
        <Shape name="corner-large" size="var(--control-height-large)" corner="var(--corner-large)" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-5)' }}>
        <Box name="corner-card" style={{ borderRadius: 'var(--corner-card)' }} />
        <Box name="corner-panel" style={{ borderRadius: 'var(--corner-panel)' }} />
      </div>
    </div>
  ),
};

/** Shadow names are shared; each theme sets how deep they look. */
export const Shadow: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-7)', padding: 'var(--space-4)' }}>
      {['rest', 'hover', 'float', 'edge'].map((s) => (
        <Box key={s} name={`shadow-${s}`} style={{ borderRadius: 'var(--corner-card)', border: 'none', boxShadow: `var(--shadow-${s})` }} />
      ))}
    </div>
  ),
};
