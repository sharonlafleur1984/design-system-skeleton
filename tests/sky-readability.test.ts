import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { readability, skyAt, TEXT, mixColor } from '../src/explorations/sky-header/sky';
import { areas } from '../src/explorations/glass-cards/areas';

// The sky header's text must stay readable at every minute of the day, on every marble, in both versions.
// This checks the math the header itself uses (layer by layer, worst-case marble behind the glass), so it
// runs in a moment instead of screenshotting every frame. A few screenshots confirm the math matches.

const nights = [...areas.map((a) => a.layer), mixColor('#dd816c', '#2a2625', 0.65)];
const minutes = Array.from({ length: 24 * 60 }, (_, m) => m / 60);

describe('Sky header readability', () => {
  for (const material of ['glass', 'sky'] as const) {
    it(`passes every minute on every marble (${material})`, () => {
      const failures: string[] = [];
      for (const areaNight of nights) {
        for (const hour of minutes) {
          const sky = skyAt(hour, { material, areaNight });
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
});
