import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = { title: 'Foundations/Type' };
export default meta;

const roles = ['display-xl', 'display-l', 'display-m', 'title', 'heading', 'subheading', 'body-l', 'body', 'body-s', 'body-xs', 'label', 'label-s', 'data', 'data-s'];

/** The type scale is shared. Each theme sets its own fonts. */
export const Scale: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      {roles.map((r) => (
        <div key={r} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-4)', alignItems: 'baseline' }}>
          <code style={{ fontFamily: 'var(--font-family-data)', fontSize: 'var(--type-body-s-size)', color: 'var(--color-ink-tertiary)' }}>{r}</code>
          <p
            style={{
              margin: 0,
              fontFamily: `var(--type-${r}-family)`,
              fontSize: `var(--type-${r}-size)`,
              lineHeight: `var(--type-${r}-line-height)`,
              letterSpacing: `var(--type-${r}-letter-spacing)`,
              fontWeight: `var(--type-${r}-weight)` as never,
              textTransform: r.startsWith('label') ? 'uppercase' : undefined,
            }}
          >
            Every journey starts with a direction
          </p>
        </div>
      ))}
    </div>
  ),
};
