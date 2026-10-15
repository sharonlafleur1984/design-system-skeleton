import type { Meta, StoryObj } from '@storybook/react-vite';
import { useContext, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { namesWith } from './tokens';
import { BothThemes, ThemeContext } from '../components/story-helpers';
import { Card, CardBody, CardHeader } from '../components/card/card';

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
const Shape = ({ name, size, radius }: { name: string; size: string; radius: string }) => (
  <figure style={{ margin: 0, display: 'grid', gap: 'var(--space-2)', justifyItems: 'start' }}>
    <div style={{ blockSize: size, minInlineSize: size, paddingInline: name === 'radius-box' ? 0 : 'var(--space-4)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-default)', borderRadius: radius }} />
    <figcaption><code style={label}>--{name}</code></figcaption>
  </figure>
);

/**
 * Each theme sets one roundness (Square, Standard or Round, in `shape-roundness`), and every radius is
 * worked out from it and the part's own size, so a part keeps the same shape at every size.
 * Controls take height x roundness / 2; surfaces take padding x roundness x 1.6.
 */
export const Radius: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <div style={shapeRow}>
        <Shape name="radius-box" size="var(--control-box)" radius="var(--radius-box)" />
        <Shape name="radius-small" size="var(--control-height-small)" radius="var(--radius-small)" />
        <Shape name="radius-medium" size="var(--control-height-medium)" radius="var(--radius-medium)" />
        <Shape name="radius-large" size="var(--control-height-large)" radius="var(--radius-large)" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-5)' }}>
        <Box name="radius-card" style={{ borderRadius: 'var(--radius-card)' }} />
        <Box name="radius-panel" style={{ borderRadius: 'var(--radius-panel)' }} />
      </div>
    </div>
  ),
};

// Where each shadow is used, so the page shows what a token really does, not just its name.
const shadows: [string, string][] = [
  ['--card-glass-cast', 'Cards and tiles: the shadow cast away from the light'],
  ['--shadow-rest', 'Cards and tiles (under the cast shadow), callouts, the switch knob'],
  ['--shadow-hover', 'Buttons and tiles while the pointer is over them'],
  ['--shadow-float', 'Menus, the settings panel, the tile bar pinned to the bottom of a phone'],
  ['--shadow-glass', 'The soft inner light on checkboxes, switches and buttons'],
];

const cell: CSSProperties = { padding: 'var(--space-2) var(--space-3)', borderBlockEnd: '1px solid var(--color-border-subtle)', textAlign: 'start', verticalAlign: 'top' };

/** Every shadow token, what uses it, and whether this theme draws it. */
function ShadowTokens() {
  const ref = useRef<HTMLTableElement>(null);
  const [castNone, setCastNone] = useState(false);
  const theme = useContext(ThemeContext);
  useLayoutEffect(() => {
    if (!ref.current) return;
    // Some themes draw no cast shadow: its color is fully clear.
    const cast = getComputedStyle(ref.current).getPropertyValue('--card-glass-cast').trim();
    setCastNone(/rgba\([^)]*,\s*0\)$/.test(cast) || cast === 'transparent');
  }, [theme]);
  return (
    <table ref={ref} style={{ borderCollapse: 'collapse', inlineSize: '100%', color: 'var(--color-ink-primary)', fontFamily: 'var(--font-family-body)', fontSize: 'var(--type-body-small-size)' }}>
      <thead>
        <tr>
          <th style={cell}>Token</th>
          <th style={cell}>Used by</th>
        </tr>
      </thead>
      <tbody>
        {shadows.map(([t, use]) => (
          <tr key={t}>
            <td style={{ ...cell, fontFamily: 'var(--font-family-data)' }}>{t}</td>
            <td style={cell}>
              {use}
              {t === '--card-glass-cast' && castNone && <span style={{ color: 'var(--color-ink-secondary)' }}> (none in this theme)</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Cards cast their shadow away from the page's one light. Drag the sun, or focus it and use the arrow
 * keys. Each theme sets how deep its shadows are; the table says where each one is used.
 */
export const Shadow: StoryObj = {
  // The cards sit on the theme's real page, lit by the sun (Storybook's page light), as in Card's stories.
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <BothThemes>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-6)', flex: '1 1 auto' }}>
          <Card>
            <CardHeader label="Solid" title="Card" />
            <CardBody>Body text</CardBody>
          </Card>
          <Card appearance="glass">
            <CardHeader label="Glass" title="Card" />
            <CardBody>Body text</CardBody>
          </Card>
        </div>
      </BothThemes>
      <ShadowTokens />
    </div>
  ),
};
