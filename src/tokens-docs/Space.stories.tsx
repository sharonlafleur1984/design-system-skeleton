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

/** Radius by purpose: controls, buttons, cards, panels and chips. */
export const Radius: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-5)' }}>
      {['control', 'button', 'card', 'panel', 'chip'].map((r) => <Box key={r} name={`radius-${r}`} style={{ borderRadius: `var(--radius-${r})` }} />)}
    </div>
  ),
};

/** Shadow names are shared; each theme sets how deep they look. */
export const Shadow: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-7)', padding: 'var(--space-4)' }}>
      {['rest', 'hover', 'float', 'edge'].map((s) => (
        <Box key={s} name={`shadow-${s}`} style={{ borderRadius: 'var(--radius-card)', border: 'none', boxShadow: `var(--shadow-${s})` }} />
      ))}
    </div>
  ),
};
