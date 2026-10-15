import type { Meta, StoryObj } from '@storybook/react-vite';
import { singleTheme } from '../components/story-helpers';
import { screenClasses, themes } from './tokens';

const meta: Meta = { title: 'Foundations/Type' };
export default meta;

const roles = ['display-cover', 'display-xl', 'display-l', 'display-m', 'heading-title', 'heading-heading', 'heading-subheading', 'body-large', 'body-default', 'body-small', 'body-micro', 'label', 'label-meta', 'data-default', 'data-small', 'data-micro'];

const code = { fontFamily: 'var(--font-family-data)', fontSize: 'var(--type-body-small-size)', color: 'var(--color-ink-tertiary)' };
const sample = (r: string, size = `var(--type-${r}-size)`): React.CSSProperties => ({
  margin: 0,
  fontFamily: `var(--type-${r}-family)`,
  fontSize: size,
  lineHeight: `var(--type-${r}-line-height)`,
  letterSpacing: `var(--type-${r}-letter-spacing)`,
  fontWeight: `var(--type-${r}-weight)` as never,
  textTransform: r.startsWith('label') ? 'uppercase' : undefined, // every label style is shown in capitals
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

/**
 * The measure (`type-measure`, 70ch): the longest a line of running text gets, in every product.
 * Paragraphs and list items wrap here however wide their container is (base.css). Readable lines
 * are 45 to 75 characters; WCAG 1.4.8 caps them at 80.
 */
export const Measure: StoryObj = {
  render: () => (
    <p style={{ margin: 0, outline: '1px dashed var(--color-ink-tertiary)', outlineOffset: 'var(--space-1)' }}>
      This paragraph stops at the measure, about 70 characters per line, so it stays easy to read on a
      wide screen. The page around it can be much wider: tiles, tables and cards still use the full
      content width, while sentences wrap at a length the eye can follow back to the start of the next line.
    </p>
  ),
};

const rem = (px: string) => `${Number.parseFloat(px) / 16}rem`;

/** Every size at once: phone (under 600px), tablet (600 to 839px) and desktop (840px and up). */
export const ScreenClasses: StoryObj = {
  render: (_args, { globals }) => {
    const theme = singleTheme(globals.theme);
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

// ─── Text styles ──────────────────────────────────────────────────────────────────────────
// Every style an app can use by name: the .ds-text-<style> classes (build/text-styles.css,
// exported as text-styles.css), each made of the type-<style>-* tokens.

type Style = { name: string; use: string; prefix: string; sample: string; uppercase?: boolean };
const styles: Style[] = [
  { name: 'display-cover', use: 'Cover title, once per page', prefix: 'type-display-cover', sample: 'Calm tools for careful work' },
  { name: 'display-xl', use: 'Big display title', prefix: 'type-display-xl', sample: 'Design notes' },
  { name: 'display-l', use: 'Page title, editor title', prefix: 'type-display-l', sample: 'Onboarding flow review' },
  { name: 'display-m', use: 'Dialog or welcome title', prefix: 'type-display-m', sample: 'Welcome back' },
  { name: 'heading-title', use: 'Document title in a panel or card', prefix: 'type-heading-title', sample: 'Checkout spec' },
  { name: 'heading-heading', use: 'Heading, first level', prefix: 'type-heading-heading', sample: 'What we learned' },
  { name: 'heading-subheading', use: 'Heading, second level', prefix: 'type-heading-subheading', sample: 'Open questions' },
  { name: 'body-large', use: 'Reading text in documents', prefix: 'type-body-large', sample: 'People finished faster when the next step was named.' },
  { name: 'body-default', use: 'Interface body text', prefix: 'type-body-default', sample: 'Three prototypes share this milestone.' },
  { name: 'body-small', use: 'Notes, captions, quiet meta', prefix: 'type-body-small', sample: 'Saved 2 minutes ago' },
  { name: 'body-micro', use: 'Smallest running text', prefix: 'type-body-micro', sample: 'Updated by Sharon' },
  { name: 'label', use: 'Section label', prefix: 'type-label', sample: 'Properties', uppercase: true },
  { name: 'label-meta', use: 'Dates and short metadata', prefix: 'type-label-meta', sample: 'Oct 14, 2026', uppercase: true },
  { name: 'data-default', use: 'Numbers and dates', prefix: 'type-data-default', sample: '1,284 views' },
  { name: 'data-small', use: 'Small numbers', prefix: 'type-data-small', sample: '12 of 40' },
  { name: 'data-micro', use: 'Tiny numbers, like counts', prefix: 'type-data-micro', sample: '98%' },
  { name: 'code', use: 'Code, IDs, file names, keys', prefix: 'type-code', sample: 'proto-1l0O.tsx' },
  { name: 'control-large', use: 'Large button or field text', prefix: 'control-type-large', sample: 'Share prototype' },
  { name: 'control-medium', use: 'Buttons, tabs, menus, fields', prefix: 'control-type-medium', sample: 'Add milestone' },
  { name: 'control-small', use: 'Small button text', prefix: 'control-type-small', sample: 'Rename' },
];

const muted: React.CSSProperties = { color: 'var(--color-ink-secondary)' };
const firstFont = (stack: unknown) => String(stack ?? '').split(',')[0].replace(/'/g, '').trim();
const spec = (flat: Record<string, string | number>, p: string) => {
  const size = Number.parseFloat(String(flat[`${p}-size`]));
  const lh = Math.round(size * Number(flat[`${p}-line-height`]));
  const family = firstFont(flat[`${p}-family`] ?? flat['font-family-body']);
  const tracking = flat[`${p}-letter-spacing`];
  return { text: `${size} / ${lh} · ${flat[`${p}-weight`]}`, family, tracking: tracking && tracking !== '0em' ? String(tracking) : '' };
};

/**
 * Every text style, in the theme's real fonts, with its class and token names. Use a style by
 * class (`.ds-text-body-default`) or by its tokens (`--type-body-default-size` and the rest).
 * Sizes are desktop sizes (size / line height · weight); titles shrink on tablets and phones (see Screen classes).
 *
 * In the designer toolkit (Fireside): Newsreader for titles and headings only, Instrument Sans for
 * everything else, JetBrains Mono for code. Fireside is always dark, so the Mode switch doesn't change it.
 */
export const TextStyles: StoryObj = {
  render: (_args, { globals }) => {
    const flat = themes[singleTheme(globals.theme)];
    return (
      <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
        {styles.map((s) => {
          const d = spec(flat, s.prefix);
          return (
            <div key={s.name} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-2) var(--space-6)', alignItems: 'baseline', paddingBlockEnd: 'var(--space-4)', borderBlockEnd: '1px solid var(--color-border-subtle)' }}>
              <p className={`ds-text-${s.name}`} style={{ margin: 0, overflowWrap: 'anywhere' }}>{s.sample}</p>
              <div className="ds-text-body-small" style={{ display: 'grid', gap: 'var(--space-1)' }}>
                <span><code className="ds-text-code">.ds-text-{s.name}</code></span>
                <span style={muted}>{s.use}</span>
                <span style={muted}>{d.family} · {d.text}{d.tracking ? ` · tracking ${d.tracking}` : ''}{s.uppercase ? ' · capitals' : ''}</span>
                <span style={muted}><code className="ds-text-code">--{s.prefix}-*</code></span>
              </div>
            </div>
          );
        })}
        <p className="ds-text-body-small" style={{ ...muted, margin: 0 }}>
          Buttons and tabs use <code className="ds-text-code">.ds-text-button</code> and <code className="ds-text-code">.ds-text-tab</code>, which match control-medium, like the Button and Tabs components.
        </p>
      </div>
    );
  },
};

/** One short specimen of the main styles, shown in light and in dark. */
function Specimen() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <p className="ds-text-label" style={{ ...muted, margin: 0 }}>Section label</p>
      <p className="ds-text-display-l" style={{ margin: 0 }}>Onboarding flow review</p>
      <p className="ds-text-heading-heading" style={{ margin: 0 }}>What we learned</p>
      <p className="ds-text-body-large" style={{ margin: 0 }}>People finished faster when the next step was named.</p>
      <p className="ds-text-body-small" style={{ ...muted, margin: 0 }}>Saved 2 minutes ago · <code className="ds-text-code">proto-1l0O</code></p>
    </div>
  );
}

/**
 * The same styles on the theme's light and dark pages, so contrast can be checked in both.
 * Fireside is always dark, so both panels look the same there.
 */
export const LightAndDark: StoryObj = {
  render: (_args, { globals }) => {
    const theme = singleTheme(globals.theme);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        {(['light', 'dark'] as const).map((mode) => (
          <section key={mode} aria-label={`${mode} mode`} data-theme={theme} data-mode={mode} style={{ flex: '1 1 300px', padding: 'var(--space-6)', borderRadius: 'var(--corner-panel)', background: 'var(--color-surface-page)', color: 'var(--color-ink-primary)', fontFamily: 'var(--font-family-body)' }}>
            <p className="ds-text-label-meta" style={{ ...muted, margin: '0 0 var(--space-4)' }}>{mode}</p>
            <Specimen />
          </section>
        ))}
      </div>
    );
  },
};

/**
 * Small-text legibility. Instrument Sans draws capital I, lowercase l and the number 1 almost
 * alike, and O and 0 too. That's fine in words, but not where one character matters: codes, IDs,
 * file names, version numbers and keyboard keys use the code style, whose monospace font keeps them apart.
 */
export const SmallTextLegibility: StoryObj = {
  render: (_args, { globals }) => {
    const flat = themes[singleTheme(globals.theme)];
    const rows = ['label', 'label-meta', 'body-small', 'body-default', 'control-medium', 'code'];
    const prefix = (r: string) => styles.find((s) => s.name === r)!.prefix;
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        {rows.map((r) => (
          <div key={r} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 180px) 1fr', gap: 'var(--space-4)', alignItems: 'baseline' }}>
            <span className="ds-text-body-small" style={muted}>
              {r}<br />{firstFont(flat[`${prefix(r)}-family`] ?? flat['font-family-body'])} {Number.parseFloat(String(flat[`${prefix(r)}-size`]))}px
            </span>
            <p className={`ds-text-${r}`} style={{ margin: 0, overflowWrap: 'anywhere' }}>Il1 O0 0123456789</p>
          </div>
        ))}
      </div>
    );
  },
};

const rule: React.CSSProperties = { margin: 0, padding: 'var(--space-4)', borderRadius: 'var(--corner-card)', background: 'var(--color-surface-card)', display: 'grid', alignContent: 'start', gap: 'var(--space-2)' };

/**
 * Which font goes where. In Fireside the serif (Newsreader) is for titles and headings only.
 * Everything you click, scan in a list or read in a panel uses Instrument Sans.
 */
export const DoAndDont: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
      <div style={rule}>
        <p className="ds-text-label" style={{ ...muted, margin: 0 }}>Do</p>
        <p className="ds-text-heading-title" style={{ margin: 0 }}>Checkout spec</p>
        <p className="ds-text-body-default" style={{ margin: 0 }}>Use the title font for page, document and section titles.</p>
        <p className="ds-text-body-default" style={{ margin: 0 }}>Use the code style for IDs, like <code className="ds-text-code">PR-1l0</code>.</p>
      </div>
      <div style={rule}>
        <p className="ds-text-label" style={{ ...muted, margin: 0 }}>Don't</p>
        <p className="ds-text-body-default" style={{ margin: 0 }}>Set tabs, buttons, labels or menus in the title font.</p>
        <p className="ds-text-body-default" style={{ margin: 0 }}>Set a weight or size by hand: pick a style.</p>
        <p className="ds-text-body-default" style={{ margin: 0 }}>Write a code or ID in body text, where I, l and 1 look alike.</p>
      </div>
    </div>
  ),
};

/** The styles together in a small document editor, like the toolkit's. */
export const InContext: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', maxInlineSize: '960px' }}>
      <nav aria-label="Documents" style={{ display: 'grid', alignContent: 'start', gap: 'var(--space-2)', padding: 'var(--space-4)', borderRadius: 'var(--corner-card)', background: 'var(--color-surface-card)' }}>
        <h2 className="ds-text-label" style={{ ...muted, margin: 0 }}>Documents</h2>
        <span className="ds-text-control-medium">Onboarding flow review</span>
        <span className="ds-text-control-medium" style={muted}>Checkout spec</span>
        <span className="ds-text-control-medium" style={muted}>Research notes</span>
        <h2 className="ds-text-label" style={{ ...muted, margin: 'var(--space-4) 0 0' }}>Milestone</h2>
        <span className="ds-text-body-small" style={muted}>None yet</span>
      </nav>
      <article style={{ gridColumn: 'span 2', display: 'grid', gap: 'var(--space-3)', padding: 'var(--space-6)', borderRadius: 'var(--corner-card)', background: 'var(--color-surface-card)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', borderBlockEnd: '1px solid var(--color-border-subtle)', paddingBlockEnd: 'var(--space-2)' }}>
          <span className="ds-text-tab">Write</span>
          <span className="ds-text-tab" style={muted}>Preview</span>
          <span className="ds-text-tab" style={muted}>History</span>
        </div>
        <p className="ds-text-label-meta" style={{ ...muted, margin: 'var(--space-2) 0 0' }}>Oct 14, 2026</p>
        <h1 className="ds-text-display-l" style={{ margin: 0 }}>Onboarding flow review</h1>
        <p className="ds-text-body-small" style={{ ...muted, margin: 0 }}>Saved 2 minutes ago</p>
        <p className="ds-text-body-large" style={{ margin: 0 }}>
          People finished faster when the next step was named. The longer form felt calmer once the
          fields were grouped, even though nothing was removed.
        </p>
        <h2 className="ds-text-heading-heading" style={{ margin: 'var(--space-2) 0 0' }}>What we learned</h2>
        <p className="ds-text-body-large" style={{ margin: 0 }}>
          Five of six people found the save button. The sixth looked for it in <code className="ds-text-code">proto-1l0O</code>, the old build.
        </p>
        <h3 className="ds-text-heading-subheading" style={{ margin: 'var(--space-2) 0 0' }}>Open questions</h3>
        <p className="ds-text-body-large" style={{ margin: 0 }}>Does the summary need its own page?</p>
      </article>
    </div>
  ),
};
