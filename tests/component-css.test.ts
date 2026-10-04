import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Components may only use tokens, so every product theme restyles them.
// Allowed raw values: 1px and 2px hairlines (borders, focus outlines) and 0.

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return cssFiles(path);
    return name.endsWith('.css') ? [path] : [];
  });
}

const files = cssFiles('src/components');
const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

describe('component CSS uses tokens only', () => {
  it('finds component styles to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const css = withoutComments(readFileSync(file, 'utf8'));

    it(`${file}: no raw colors`, () => {
      const colors = css.match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(/g) ?? [];
      expect(colors).toEqual([]);
    });

    it(`${file}: no raw font weights (weights come from type styles and font-weight tokens)`, () => {
      const weights = [...css.matchAll(/font-weight\s*:\s*([^;}]+)/g)]
        .map((m) => m[1].trim())
        .filter((v) => !v.startsWith('var(') && v !== 'inherit');
      expect(weights).toEqual([]);
    });

    it(`${file}: no raw sizes except 1px and 2px hairlines`, () => {
      const sizes = (css.match(/\b\d+(?:\.\d+)?px\b/g) ?? []).filter((v) => v !== '1px' && v !== '2px');
      expect(sizes).toEqual([]);
    });
  }
});
