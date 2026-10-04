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
  }
});
