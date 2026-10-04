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
const themeOnly = /^(palette|color-area|color-category)-/;
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
    it(`${t} changes the same tokens as ${themes[0]}`, () => {
      expect(Object.keys(screenClasses(t)).sort()).toEqual(Object.keys(screenClasses(themes[0])).sort());
    });
    for (const [name, s] of Object.entries(screenClasses(t))) {
      it(`${t}: ${name} goes phone ≤ tablet ≤ desktop`, () => {
        expect(px(s.compact)).toBeLessThanOrEqual(px(s.medium));
        expect(px(s.medium)).toBeLessThanOrEqual(px(s.expanded));
      });
    }
  }
});
