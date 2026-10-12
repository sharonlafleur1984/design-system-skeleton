import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { readability, skyAt, TEXT, mixColor, CARD_GLASS } from '../src/explorations/sky-header/sky';
import { areas } from '../src/explorations/glass-cards/areas';

// The sky header's text must stay readable at every minute of the day, on every marble, in both versions.
// This checks the math the header itself uses (layer by layer, worst-case marble behind the glass), so it
// runs in a moment instead of screenshotting every frame. A few screenshots confirm the math matches.

const rgbHex = (r: number, g: number, b: number) => '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');

const nights = [...areas.map((a) => a.layer), mixColor('#dd816c', '#2a2625', 0.65)];
const minutes = Array.from({ length: 24 * 60 }, (_, m) => m / 60);

describe('Sky header readability', () => {
  for (const material of ['glass', 'sky'] as const) for (const light of ['warm', 'white'] as const) {
    it(`passes every minute on every marble (${material}, ${light} light)`, () => {
      const failures: string[] = [];
      for (const areaNight of nights) {
        for (const hour of minutes) {
          const sky = skyAt(hour, { material, areaNight, light });
          const score = readability(sky, sky.mode, sky.veilAlpha);
          if (score < 1) failures.push(`${hour.toFixed(2)} ${areaNight} ${sky.mode} ${score.toFixed(2)}`);
        }
      }
      expect(failures.slice(0, 10)).toEqual([]);
    }, 30_000);
  }

  it('uses the same text colors as the Life Hub tokens', () => {
    const light = JSON.parse(readFileSync('build/json/life-hub.json', 'utf8'));
    const dark = JSON.parse(readFileSync('build/json-dark/life-hub.json', 'utf8'));
    for (const [mode, tokens] of [['light', light], ['dark', dark]] as const) {
      expect(TEXT[mode].primary).toBe(tokens['color-ink-primary']);
      expect(TEXT[mode].secondary).toBe(tokens['color-ink-secondary']);
      expect(TEXT[mode].tertiary).toBe(tokens['color-ink-tertiary']);
    }
  });

  it('uses clear glass, the same as the header styles and After Graduation\'s glass on art', () => {
    const css = readFileSync('src/explorations/sky-header/sky-header.css', 'utf8');
    const ag = JSON.parse(readFileSync('build/json/after-graduation.json', 'utf8'));
    const parse = (v: string) => v.match(/[\d.]+/g)!.map(Number);
    expect(parse(ag['color-surface-glass-on-art'])[3]).toBe(0);
    expect(css).toContain('--lh-sky-glass: transparent;');
    for (const mode of ['light', 'dark'] as const) expect(CARD_GLASS[mode].alpha).toBe(0);
  });
});

describe('Sky header on the real clock', () => {
  it('needs the readability tint only inside the few minutes of sunrise and sunset', async () => {
    const { skyHourFor, TWILIGHT_MINUTES } = await import('../src/explorations/sky-header/sun');
    const sun = { sunrise: 7.25, sunset: 18.5 };
    const spans: number[] = [];
    let run = 0;
    for (let s = 0; s < 24 * 3600; s += 10) {
      const sky = skyAt(skyHourFor(s / 3600, sun), { material: 'glass', areaNight: nights[0] });
      if (sky.veilAlpha > 0.02) run += 10;
      else if (run) {
        spans.push(run / 60);
        run = 0;
      }
    }
    expect(spans.length).toBe(2);
    for (const minutes of spans) expect(minutes).toBeLessThanOrEqual(TWILIGHT_MINUTES);
  });
});
