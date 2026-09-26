// The Life Hub theme must match Sharon's Figma library exactly: every color, every
// semantic mapping, spacing, radius and text style. If this fails, the code drifted.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const figma = JSON.parse(readFileSync('tests/life-hub-figma.json', 'utf8'));
const lh: Record<string, string | number> = JSON.parse(readFileSync('build/json/life-hub.json', 'utf8'));
const slug = (s: string) => s.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const allColors = new Set(Object.values(lh).filter((v) => typeof v === 'string' && v.startsWith('#')).map((v) => String(v).toLowerCase()));

describe('Life Hub matches the Figma library', () => {
  it('has every Figma color', () => {
    const missing = Object.entries(figma.colors).filter(([, hex]) => !allColors.has(String(hex)));
    expect(missing).toEqual([]);
  });
  it('keeps every palette color under its Figma name', () => {
    for (const [name, hex] of Object.entries(figma.colors)) {
      if (name.startsWith('Status ')) continue; // status primitives live in the shared base
      const [family, shade] = name.split('/');
      expect(lh[`palette-${slug(family)}-${slug(shade)}`], name).toBe(hex);
    }
  });
  it('maps every semantic variable to the same color as Figma', () => {
    for (const [name, target] of Object.entries(figma.semantic)) {
      expect(lh[`color-${name.replace(/\//g, '-')}`], name).toBe(figma.colors[target as string]);
    }
  });
  it('has the same spacing and radius', () => {
    for (const [k, v] of Object.entries(figma.spacing)) expect(lh[`space-${k}`]).toBe(`${v}px`);
    for (const [k, v] of Object.entries(figma.radius)) {
      const px = typeof v === 'number' ? v : figma.radius[v as string];
      expect(lh[`radius-${k.toLowerCase()}`], k).toBe(`${px}px`);
    }
  });
  it('has every text style with the same font, weight and size', () => {
    for (const [name, [font, weight, size]] of Object.entries(figma.textStyles) as [string, [string, number, number]][]) {
      const role = slug(name);
      expect(String(lh[`type-${role}-family`]), name).toContain(font);
      expect(lh[`type-${role}-weight`], name).toBe(weight);
      expect(lh[`type-${role}-size`], name).toBe(`${size}px`);
    }
  });
});
