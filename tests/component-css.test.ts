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

    // Typography comes from tokens too: type styles, font tokens or a component's own tokens.
    for (const prop of ['font-weight', 'font-size', 'font-family', 'line-height', 'letter-spacing']) {
      it(`${file}: no raw ${prop} (typography comes from tokens)`, () => {
        const raw = [...css.matchAll(new RegExp(`(?<![\\w-])${prop}\\s*:\\s*([^;}]+)`, 'g'))]
          .map((m) => m[1].trim())
          .filter((v) => !v.startsWith('var(') && v !== 'inherit');
        expect(raw).toEqual([]);
      });
    }

    it(`${file}: no raw sizes except 1px and 2px hairlines`, () => {
      const sizes = (css.match(/\b\d+(?:\.\d+)?px\b/g) ?? []).filter((v) => v !== '1px' && v !== '2px');
      expect(sizes).toEqual([]);
    });
  }
});

// Every var(--name) must be a real token, or a custom property something in src sets itself
// (like the glass recipe's --g-* or a component's private --_x). A missing token quietly falls back,
// so the intended look never shows; this catches it.
describe('component CSS only uses tokens that exist', () => {
  const srcFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return srcFiles(path);
      return /\.(css|tsx?)$/.test(name) ? [path] : [];
    });
  const all = srcFiles('src');
  const tokens = new Set(
    readdirSync('build/json')
      .filter((f) => f.endsWith('.json') && !f.endsWith('.screen-classes.json'))
      .flatMap((f) => Object.keys(JSON.parse(readFileSync(`build/json/${f}`, 'utf8')))),
  );
  // Set in CSS (--x: ...), in a style object ('--x': ...) or from code (setProperty('--x', ...)).
  const setInSrc = new Set(
    all.flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/(?:^|[\s{;'"`(])(--[a-zA-Z0-9_-]+)['"`]?\s*:|setProperty\(\s*['"`](--[a-zA-Z0-9_-]+)/g)].map((m) => (m[1] ?? m[2]).slice(2)),
    ),
  );
  // Set by React Aria itself: the Select popover's width, matched to its button.
  setInSrc.add('trigger-width');
  for (const file of [...cssFiles('src/components'), ...cssFiles('src/explorations')]) {
    it(`${file}: every var() is a token or set in src`, () => {
      const used = [...withoutComments(readFileSync(file, 'utf8')).matchAll(/var\(\s*--([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
      expect([...new Set(used.filter((n) => !tokens.has(n) && !setInSrc.has(n)))]).toEqual([]);
    });
  }
});

// Screen sizes come from one place (src/components/breakpoints.ts, matching the token build), so a
// phone layout never starts at 599px in one component and 600px in another.
describe('screen-size media queries use the shared breakpoints', () => {
  const build = readFileSync('scripts/build-tokens.mjs', 'utf8');
  const shared = readFileSync('src/components/breakpoints.ts', 'utf8');
  it('breakpoints.ts matches the token build (phone under 600px, tablet under 840px)', () => {
    expect(build).toMatch(/BREAKPOINTS = \{ medium: 839, compact: 599 \}/);
    expect(shared).toContain("PHONE = '(width < 37.5rem)'");
    expect(shared).toContain("TABLET = '(width < 52.5rem)'");
  });
  for (const file of [...cssFiles('src/components'), ...cssFiles('src/explorations')]) {
    it(`${file}: width media queries are (width < 37.5rem) or (width < 52.5rem)`, () => {
      const queries = [...withoutComments(readFileSync(file, 'utf8')).matchAll(/@media[^{]*\b(?:width|min-width|max-width)\b[^{]*/g)].map((m) => m[0].trim());
      expect(queries.filter((q) => q !== '@media (width < 37.5rem)' && q !== '@media (width < 52.5rem)')).toEqual([]);
    });
  }
});
