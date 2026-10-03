import type { Meta, StoryObj } from '@storybook/react-vite';
import { screenClasses, themes } from './tokens';

const meta: Meta = { title: 'Foundations/Type' };
export default meta;

const roles = ['display-cover', 'display-xl', 'display-l', 'display-m', 'heading-title', 'heading-heading', 'heading-subheading', 'body-large', 'body-default', 'body-small', 'body-micro', 'label-caps', 'label-banner', 'data-default', 'data-small', 'data-micro'];

const code = { fontFamily: 'var(--font-family-data)', fontSize: 'var(--type-body-small-size)', color: 'var(--color-ink-tertiary)' };
const sample = (r: string, size = `var(--type-${r}-size)`): React.CSSProperties => ({
  margin: 0,
  fontFamily: `var(--type-${r}-family)`,
  fontSize: size,
  lineHeight: `var(--type-${r}-line-height)`,
  letterSpacing: `var(--type-${r}-letter-spacing)`,
  fontWeight: `var(--type-${r}-weight)` as never,
  textTransform: r.startsWith('label') ? 'uppercase' : undefined,
});

/**
 * Each theme sets its own sizes and fonts. Headings get smaller on phones and tablets:
 * switch the viewport in the toolbar to see the sizes change.
 */
export const Scale: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      {roles.map((r) => (
        <div key={r} style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 170px) 1fr', gap: 'var(--space-4)', alignItems: 'baseline' }}>
          <code style={code}>{r}</code>
          <p style={sample(r)}>Every journey starts with a direction</p>
        </div>
      ))}
    </div>
  ),
};

const rem = (px: string) => `${Number.parseFloat(px) / 16}rem`;

/** Every size at once: phone (under 600px), tablet (600 to 839px) and desktop (840px and up). */
export const ScreenClasses: StoryObj = {
  render: (_args, { globals }) => {
    const theme = (globals.theme as string) ?? 'after-graduation';
    const sizes = screenClasses[theme];
    const flat = themes[theme];
    const th: React.CSSProperties = { ...code, textAlign: 'left', padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--color-border-default)' };
    const td: React.CSSProperties = { padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border-subtle, var(--color-border-default))', verticalAlign: 'baseline' };
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr><th style={th}>Role</th><th style={th}>Phone</th><th style={th}>Tablet</th><th style={th}>Desktop</th></tr>
          </thead>
          <tbody>
            {roles.map((r) => {
              const s = sizes[`type-${r}-size`];
              const one = String(flat[`type-${r}-size`]);
              const cells = s ? [s.compact, s.medium, s.expanded] : [one, one, one];
              return (
                <tr key={r}>
                  <td style={td}><code style={code}>{r}</code></td>
                  {cells.map((px, i) => (
                    <td key={i} style={td}>
                      <p style={{ ...sample(r, rem(px)), whiteSpace: 'nowrap' }}>Aa</p>
                      <code style={code}>{px}{s ? '' : ' (all)'}</code>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  },
};
