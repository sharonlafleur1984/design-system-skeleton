// Two promises every theme has to keep:
// 1. The contract: every theme defines every shared token name, so components work in any theme.
// 2. Readability: text colors meet WCAG 2.2 AA contrast (4.5:1) on the surfaces they sit on.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-expect-error: the package ships no types
import { hex } from 'wcag-contrast';

const themes = readdirSync('build/json')
  .filter((f) => !f.endsWith('.screen-classes.json'))
  .map((f) => f.replace('.json', ''));
const load = (t: string): Record<string, string> =>
  JSON.parse(readFileSync(`build/json/${t}.json`, 'utf8'));

// Theme-only extras (a product's own palette, Life Hub areas, After Graduation categories)
// are allowed to differ. Everything else is the shared contract.
const themeOnly = /^(palette|color-area|color-category|shell)-/;
const contract = (t: string) => Object.keys(load(t)).filter((k) => !themeOnly.test(k)).sort();

describe('contract', () => {
  it('finds at least two themes', () => expect(themes.length).toBeGreaterThanOrEqual(2));
  for (const t of themes) {
    it(`${t} defines every shared token`, () => {
      expect(contract(t)).toEqual(contract(themes[0]));
    });
  }
});

// Pairs that must be readable. Muted and disabled ink are decorative, so they aren't checked.
const pairs: [string, string][] = [
  ['color-ink-primary', 'color-surface-page'],
  ['color-ink-primary', 'color-surface-card'],
  ['color-ink-secondary', 'color-surface-page'],
  ['color-ink-secondary', 'color-surface-card'],
  ['color-ink-tertiary', 'color-surface-card'],
  ['color-ink-inverse', 'color-surface-inverse'],
  ['color-accent-text', 'color-surface-page'],
  ['color-accent-text', 'color-surface-card'],
  ['color-accent-ink', 'color-accent-base'],
  ['color-accent-ink', 'color-accent-hover'],
  ['link-inline-color', 'color-surface-page'],
  ['link-inline-color', 'color-surface-card'],
  ['link-inline-color-hover', 'color-surface-page'],
  ['link-inline-color-hover', 'color-surface-card'],
  ['link-quiet-color', 'color-surface-page'],
  ['link-quiet-color', 'color-surface-card'],
  ['link-quiet-color-hover', 'color-surface-page'],
  ['link-quiet-color-hover', 'color-surface-card'],
  ...['error', 'warning', 'success', 'info', 'neutral'].map(
    (s) => [`color-status-${s}-ink`, `color-status-${s}-surface`] as [string, string],
  ),
];

describe('contrast (WCAG 2.2 AA, 4.5:1)', () => {
  for (const t of themes) {
    const tokens = load(t);
    for (const [fg, bg] of pairs) {
      it(`${t}: ${fg} on ${bg}`, () => {
        const ratio = hex(tokens[fg], tokens[bg]);
        expect(ratio, `${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});

// Screen classes: phone (compact), tablet (medium) and desktop (expanded) sizes.
// Every theme changes the same tokens, and sizes never get bigger on a smaller screen.
const screenClasses = (t: string): Record<string, { compact: string; medium: string; expanded: string }> =>
  JSON.parse(readFileSync(`build/json/${t}.screen-classes.json`, 'utf8'));
const px = (v: string) => Number.parseFloat(v);

describe('screen classes', () => {
  for (const t of themes) {
    // Sizes and layout must change in every theme alike. Line-height ratios by screen class are each theme's choice.
    const shared = (x: string) => Object.keys(screenClasses(x)).filter((k) => !k.endsWith('-line-height') && !themeOnly.test(k)).sort();
    it(`${t} changes the same tokens as ${themes[0]}`, () => {
      expect(shared(t)).toEqual(shared(themes[0]));
    });
    for (const [name, s] of Object.entries(screenClasses(t)).filter(([n]) => !n.endsWith('-line-height'))) {
      it(`${t}: ${name} goes phone ≤ tablet ≤ desktop`, () => {
        expect(px(s.compact)).toBeLessThanOrEqual(px(s.medium));
        expect(px(s.medium)).toBeLessThanOrEqual(px(s.expanded));
      });
    }
  }
});

// Every theme's type sits on the 4-point grid: every size is a multiple of 4 (except 14px for
// small UI text), and every line height (size times its ratio) is a multiple of 4.
describe.each(themes)('%s type on the 4-point grid', (t) => {
  const tk = load(t);
  const sc = screenClasses(t);
  const vals = (name: string) => (sc[name] ? [sc[name].compact, sc[name].medium, sc[name].expanded] : [tk[name]]).map((v) => Number.parseFloat(String(v)));
  const roles = Object.keys(tk).filter((k) => /^type-.*-size$/.test(k)).map((k) => k.replace(/-size$/, ''));
  for (const role of roles) {
    it(`${role}: size on the grid`, () => {
      for (const v of vals(`${role}-size`)) expect(v % 4 === 0 || v === 14, `${v}px`).toBe(true);
    });
    it(`${role}: line height (size x ratio) on the grid`, () => {
      const sizes = vals(`${role}-size`);
      const ratios = vals(`${role}-line-height`);
      sizes.forEach((size, i) => {
        const lh = size * (ratios[i] ?? ratios[0]);
        const off = Math.abs(lh - Math.round(lh / 4) * 4);
        expect(off, `${size}px x ${ratios[i] ?? ratios[0]} = ${lh.toFixed(2)}px`).toBeLessThan(0.01);
      });
    });
  }
});

// Layout spacing: every value is a step on the shared space scale, so spacing never drifts off the grid.
const spaceSteps = (t: string) => new Set(Object.entries(load(t)).filter(([k]) => /^space-\d+$/.test(k)).map(([, v]) => px(v)));

describe('layout uses the space scale', () => {
  for (const t of themes) {
    for (const [name, s] of Object.entries(screenClasses(t)).filter(([n]) => n.startsWith('layout-') || /^shell-sheet-(inset|overlap)$/.test(n))) {
      it(`${t}: ${name} is on the space scale at every screen size`, () => {
        const steps = spaceSteps(t);
        for (const v of [s.compact, s.medium, s.expanded]) expect(steps.has(px(v)), `${v} is not a space step`).toBe(true);
      });
    }
  }
});
