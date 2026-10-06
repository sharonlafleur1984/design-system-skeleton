import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// After Graduation type: Cinzel for the main title only, Atkinson Hyperlegible Next for everything else.
const tokens = JSON.parse(readFileSync('build/json/after-graduation.json', 'utf8')) as Record<string, string | number>;
const sc = JSON.parse(readFileSync('build/json/after-graduation.screen-classes.json', 'utf8')) as Record<
  string,
  { compact: string; medium: string; expanded: string }
>;
const px = (v: string | number) => Number.parseFloat(String(v));
const sizes = (name: string) => (sc[name] ? [sc[name].compact, sc[name].medium, sc[name].expanded] : [tokens[name]]).map(px);

// Weights that have a real font file (see src/fonts/after-graduation.css). Any other weight makes the browser fake it.
const loaded: Record<string, number[]> = {
  Cinzel: [800],
  'Atkinson Hyperlegible Next': [300, 400, 500, 600, 700],
};

const roles = [
  ...new Set(Object.keys(tokens).filter((k) => /^type-.*-weight$/.test(k)).map((k) => k.replace(/^type-|-weight$/g, ''))),
];

describe('After Graduation type', () => {
  for (const role of roles) {
    const family = String(tokens[`type-${role}-family`] ?? '');
    const font = Object.keys(loaded).find((f) => family.includes(f));
    it(`${role}: uses a weight its font really has, so the browser never fakes bold`, () => {
      expect(font, family).toBeTruthy();
      expect(loaded[font!]).toContain(Number(tokens[`type-${role}-weight`]));
    });
    it(`${role}: lines never collide at any screen size`, () => {
      const s = sizes(`type-${role}-size`);
      const ratio = sizes(`type-${role}-line-height`);
      const min = /^(body|data)-/.test(role) ? 1.3 : 1.1;
      s.forEach((_, i) => expect(ratio[i] ?? ratio[0]).toBeGreaterThanOrEqual(min));
    });
    it(`${role}: no negative letter spacing`, () => {
      expect(String(tokens[`type-${role}-letter-spacing`] ?? '0')).not.toMatch(/^-/);
    });
  }
  it('Cinzel is only used for the main title', () => {
    const cinzel = roles.filter((r) => String(tokens[`type-${r}-family`]).includes('Cinzel'));
    expect(cinzel).toEqual(['display-cover']);
  });
});
