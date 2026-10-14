import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// Fireside (the designer toolkit) type: Newsreader for titles and headings only, Instrument Sans for
// all text and the interface, JetBrains Mono for code.
const tokens = JSON.parse(readFileSync('build/json/designer-toolkit.json', 'utf8')) as Record<string, string | number>;
const sc = JSON.parse(readFileSync('build/json/designer-toolkit.screen-classes.json', 'utf8')) as Record<
  string,
  { compact: string; medium: string; expanded: string }
>;
const px = (v: string | number) => Number.parseFloat(String(v));
const sizes = (name: string) => (sc[name] ? [sc[name].compact, sc[name].medium, sc[name].expanded] : [tokens[name]]).map(px);

// Weight ranges with a real font file (src/fonts/designer-toolkit.css). Outside them the browser fakes the weight.
const loaded: Record<string, [number, number]> = {
  Newsreader: [200, 800],
  'Instrument Sans': [400, 700],
  'JetBrains Mono': [400, 400],
};

const roles = [
  ...new Set(Object.keys(tokens).filter((k) => /^type-.*-weight$/.test(k)).map((k) => k.replace(/^type-|-weight$/g, ''))),
];
const family = (role: string) => String(tokens[`type-${role}-family`] ?? '');
const first = (stack: string) => stack.split(',')[0].trim().replace(/^['"]|['"]$/g, '');

describe('Fireside type', () => {
  for (const role of roles) {
    it(`${role}: uses a weight its font really has, so the browser never fakes it`, () => {
      const font = first(family(role));
      expect(loaded[font], family(role)).toBeTruthy();
      const w = Number(tokens[`type-${role}-weight`]);
      expect(w).toBeGreaterThanOrEqual(loaded[font][0]);
      expect(w).toBeLessThanOrEqual(loaded[font][1]);
    });
    it(`${role}: lines never collide at any screen size`, () => {
      const ratio = sizes(`type-${role}-line-height`);
      const min = /^(body|data|code)/.test(role) ? 1.3 : 1.05;
      ratio.forEach((r) => expect(r).toBeGreaterThanOrEqual(min));
    });
  }

  it('Newsreader is only for display, titles and headings', () => {
    const serif = roles.filter((r) => first(family(r)) === 'Newsreader');
    expect(serif.every((r) => /^(display|heading)-/.test(r)), serif.join(', ')).toBe(true);
    expect(serif.length).toBeGreaterThan(0);
  });

  it('controls, buttons and tabs use the interface font, never the serif', () => {
    expect(first(String(tokens['font-family-body']))).toBe('Instrument Sans');
    for (const size of ['small', 'medium', 'large']) expect(tokens[`control-type-${size}-family`]).toBeUndefined();
  });

  it('code uses the monospace font', () => {
    expect(first(family('code'))).toBe('JetBrains Mono');
  });

  it('every font has fallbacks of the same kind', () => {
    expect(String(tokens['font-family-display'])).toMatch(/serif$/);
    expect(String(tokens['font-family-body'])).toMatch(/sans-serif$/);
    expect(String(tokens['font-family-code'])).toMatch(/monospace$/);
  });

  it('nothing is smaller than 10px, and only the capital section label goes below 12px', () => {
    for (const role of roles) {
      for (const s of sizes(`type-${role}-size`)) {
        expect(s).toBeGreaterThanOrEqual(10);
        if (role !== 'label') expect(s, role).toBeGreaterThanOrEqual(12);
      }
    }
  });

  it('keeps the toolkit hierarchy: label < meta < body < headings < document title < page title', () => {
    const at = (r: string) => px(tokens[`type-${r}-size`]);
    expect(at('label')).toBeLessThan(at('label-meta'));
    expect(at('label-meta')).toBeLessThan(at('body-default'));
    expect(at('body-default')).toBeLessThanOrEqual(at('heading-subheading'));
    expect(at('heading-subheading')).toBeLessThan(at('heading-heading'));
    expect(at('heading-heading')).toBeLessThan(at('heading-title'));
    expect(at('heading-title')).toBeLessThan(at('display-l'));
  });
});

// The text style classes cover every type role, so an app can use any style by name.
describe('text style classes', () => {
  const css = readFileSync('build/text-styles.css', 'utf8');
  for (const role of roles) {
    it(`.ds-text-${role} exists and uses only its own tokens`, () => {
      const block = new RegExp(`\\.ds-text-${role} \\{([^}]*)\\}`).exec(css)?.[1] ?? '';
      expect(block).toContain(`var(--type-${role}-size)`);
      for (const name of block.match(/--type-[a-z-]+/g) ?? []) expect(tokens[name.slice(2)], name).toBeDefined();
    });
  }
  it('has control, button and tab classes', () => {
    for (const cls of ['control-small', 'control-medium', 'control-large', 'button', 'tab']) expect(css).toContain(`.ds-text-${cls}`);
  });
});
