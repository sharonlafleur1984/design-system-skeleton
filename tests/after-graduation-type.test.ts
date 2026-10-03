import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// Mochiy Pop One (After Graduation's display font) comes in one weight and has tall letters.
const tokens = JSON.parse(readFileSync('build/json/after-graduation.json', 'utf8')) as Record<string, string | number>;
const displays = ['display-cover', 'display-xl', 'display-l', 'display-m'];

describe('After Graduation display type fits Mochiy Pop One', () => {
  for (const role of displays) {
    it(`${role}: regular weight, so the browser never fakes bold`, () => {
      expect(Number(tokens[`type-${role}-weight`])).toBe(400);
    });
    it(`${role}: line height of at least 1.15, so lines never collide`, () => {
      expect(Number(tokens[`type-${role}-line-height`])).toBeGreaterThanOrEqual(1.15);
    });
    it(`${role}: no negative letter spacing`, () => {
      expect(String(tokens[`type-${role}-letter-spacing`])).not.toMatch(/^-/);
    });
    it(`${role}: size adapts to the screen and still grows with text zoom`, () => {
      expect(String(tokens[`type-${role}-size`])).toMatch(/^clamp\(.*rem.*vw.*rem\)$/);
    });
  }
});

// Evaluates clamp(min, base + Nvw, max) at a screen width, with 1rem = 16px.
function px(value: string, width: number): number {
  const m = value.match(/^clamp\(([\d.]+)rem,\s*([\d.]+)rem \+ ([\d.]+)vw,\s*([\d.]+)rem\)$/);
  if (!m) return parseFloat(value);
  const [min, base, vw, max] = m.slice(1).map(Number);
  return Math.min(Math.max(base * 16 + (vw / 100) * width, min * 16), max * 16);
}

describe('After Graduation headings keep their order at every screen size', () => {
  const order = ['display-cover', 'display-xl', 'display-l', 'display-m', 'heading-title', 'heading-heading'];
  for (const width of [320, 768, 1280, 1920]) {
    it(`each level is bigger than the next at ${width}px wide`, () => {
      const sizes = order.map((r) => px(String(tokens[`type-${r}-size`]), width));
      for (let i = 1; i < sizes.length; i++) expect(sizes[i - 1]).toBeGreaterThan(sizes[i]);
    });
  }
});
