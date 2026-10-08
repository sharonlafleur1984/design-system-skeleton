// The Life Hub sky: what the header looks like at any hour. Exploration only.
// Every color comes from Life Hub's palette (tokens/themes/life-hub). The light always sits top right:
// the sun by day, sinking and warming at sunset, a cool moon glow at night in the sun's daytime spot. Positions and strengths are
// estimates until they become tokens.

export type SkyMode = 'light' | 'dark';

interface Key {
  hour: number;
  top: string; // sky at the top of the header
  bottom: string; // sky at the bottom
  glow: string; // the light's color
  glowAlpha: number;
  glowX: number; // light position, % across
  glowY: number; // light position, % down (it sinks at sunset)
  horizon: number; // 0 to 1: warm band along the bottom at sunrise and sunset
  stars: number; // 0 to 1
}

// Palette names are in the comments so the colors can be traced back to tokens.
const KEYS: Key[] = [
  { hour: 0, top: '#1f2d42', bottom: '#2a2625', glow: '#e6ecf2', glowAlpha: 0.14, glowX: 88, glowY: 0, horizon: 0, stars: 1 }, // navy 900, ink, navy 100 moon
  { hour: 5, top: '#1f2d42', bottom: '#2a2625', glow: '#e6ecf2', glowAlpha: 0.14, glowX: 88, glowY: 0, horizon: 0, stars: 1 },
  { hour: 6, top: '#374d70', bottom: '#946e8a', glow: '#fcf7c5', glowAlpha: 0.45, glowX: 94, glowY: 80, horizon: 0.6, stars: 0.4 }, // navy 600, lilacs 500, sunflower 100
  { hour: 7, top: '#e6dce4', bottom: '#f9ebec', glow: '#fdfbf1', glowAlpha: 0.75, glowX: 92, glowY: 35, horizon: 0.3, stars: 0 }, // lilacs 200, berry 100, sunlight
  { hour: 9, top: '#fdfbf9', bottom: '#f7f3ef', glow: '#fcf7c5', glowAlpha: 0.6, glowX: 88, glowY: 0, horizon: 0, stars: 0 }, // paper warm, paper cream, sunflower 100
  { hour: 16, top: '#fdfbf9', bottom: '#f7f3ef', glow: '#fcf7c5', glowAlpha: 0.6, glowX: 88, glowY: 0, horizon: 0, stars: 0 },
  { hour: 17.5, top: '#f7efdd', bottom: '#f9ebec', glow: '#efdcb9', glowAlpha: 0.9, glowX: 90, glowY: 25, horizon: 0.3, stars: 0 }, // gold sand 100, berry 100, gold sand 200
  { hour: 18.5, top: '#f4dcdf', bottom: '#efdcb9', glow: '#e1a3ac', glowAlpha: 0.8, glowX: 94, glowY: 80, horizon: 0.8, stars: 0 }, // berry 200, gold sand 200, berry 400
  { hour: 19.25, top: '#3f5880', bottom: '#d5818d', glow: '#ecc1c5', glowAlpha: 0.55, glowX: 96, glowY: 100, horizon: 0.7, stars: 0.35 }, // navy 500, berry 500, berry 300
  { hour: 20.25, top: '#273751', bottom: '#56414e', glow: '#e6ecf2', glowAlpha: 0.1, glowX: 88, glowY: 0, horizon: 0.15, stars: 0.8 }, // navy 800, lilacs 800
  { hour: 21, top: '#1f2d42', bottom: '#2a2625', glow: '#e6ecf2', glowAlpha: 0.14, glowX: 88, glowY: 0, horizon: 0, stars: 1 },
  { hour: 24, top: '#1f2d42', bottom: '#2a2625', glow: '#e6ecf2', glowAlpha: 0.14, glowX: 88, glowY: 0, horizon: 0, stars: 1 },
];

// Colors are blended in OKLab, so sunset passes through rose and violet instead of muddy gray.
type Lab = [number, number, number];
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexToLab(hex: string): Lab {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function labToHex([L, A, B]: Lab): string {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, toSrgb(c))) * 255).toString(16).padStart(2, '0')).join('');
}
export const mixColor = (a: string, b: string, t: number) => {
  const x = hexToLab(a);
  const y = hexToLab(b);
  return labToHex([0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * t) as Lab);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
// Gentle ease, so changes start and finish softly.
const ease = (t: number) => t * t * (3 - 2 * t);

/** Relative luminance (WCAG), used to decide whether text sits on a light or a dark sky. */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export interface Sky {
  /** 0 to 1: how much of the sky shows. 1 is solid; glass headers let the marble through. */
  alpha: number;
  top: string;
  bottom: string;
  glow: string;
  glowAlpha: number;
  glowX: number;
  glowY: number;
  horizon: number;
  stars: number;
  /** Light or dark glass and text, whichever needs less help to read. */
  mode: SkyMode;
  /** A veil behind the greeting and button: just enough ink (dark) or paper (light) to keep text readable. */
  veil: string;
  veilAlpha: number;
}

// Readability. Everything that sits behind the greeting and the chat button, layer by layer, copied from
// the Life Hub tokens (a test checks they still match). Colors are blended the way browsers blend them,
// channel by channel in sRGB.
const INK = '#2a2625';
const PAPER = '#faf7f1';
export const TEXT = {
  light: { primary: '#2a2625', secondary: '#524c4a', tertiary: '#716764' },
  dark: { primary: '#faf7f1', secondary: '#e8e2db', tertiary: '#d6cec7' },
} as const;
const LIGHT_CARD_FROST = { color: '#faf7f1', alpha: 0.83 }; // card-frost at its thinnest
const BUTTON_GLASS = { light: { color: '#ffffff', alpha: 0.35 }, dark: { color: '#fdfbf1', alpha: 0.08 } }; // surface-glass
// Glass headers show some marble. The model assumes the worst marble: pure white or near black.
const MARBLE_EXTREMES = ['#ffffff', '#1f1f1f'];

type Rgb = [number, number, number];
const rgb = (hex: string): Rgb => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;
const over = (top: Rgb, alpha: number, below: Rgb): Rgb => below.map((c, i) => c + (top[i] - c) * alpha) as Rgb;
const rgbLuminance = (c: Rgb) => {
  const [r, g, b] = c.map((v) => toLinear(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

interface Backdrop {
  top: string;
  bottom: string;
  glow: string;
  glowAlpha: number;
  horizon: number;
  alpha: number;
}

/**
 * The lowest contrast any text in the header reaches, as a share of what it needs (1 or more passes).
 * Body text needs 4.5:1; the greeting is large, so 3:1 (WCAG 1.4.3).
 */
const TEXT_L = {
  light: { primary: 0, secondary: 0, tertiary: 0 },
  dark: { primary: 0, secondary: 0, tertiary: 0 },
};
for (const m of ['light', 'dark'] as const)
  for (const k of ['primary', 'secondary', 'tertiary'] as const) TEXT_L[m][k] = rgbLuminance(rgb(TEXT[m][k]));
const MARBLES = MARBLE_EXTREMES.map(rgb);
const FROST = rgb(LIGHT_CARD_FROST.color);
const VEIL = { light: rgb(PAPER), dark: rgb(INK) };
const GLASS = { light: rgb(BUTTON_GLASS.light.color), dark: rgb(BUTTON_GLASS.dark.color) };

export function readability(sky: Backdrop, mode: SkyMode, veilAlpha: number) {
  const veil = VEIL[mode];
  const text = TEXT_L[mode];
  // The sky behind the card (top to bottom, with the warm band) and behind the button (top, under the light).
  const behindCard = [rgb(sky.top), rgb(sky.bottom), over(rgb(sky.glow), sky.horizon * 0.55, rgb(sky.bottom))];
  const behindButton = [rgb(sky.top), over(rgb(sky.glow), sky.glowAlpha, rgb(sky.top))];
  let worst = Infinity;
  // A solid sky hides the marble, so one pass is enough.
  for (const marble of sky.alpha >= 1 ? MARBLES.slice(0, 1) : MARBLES) {
    for (const s of behindCard) {
      let c = over(veil, veilAlpha, over(s, sky.alpha, marble));
      if (mode === 'light') c = over(FROST, LIGHT_CARD_FROST.alpha, c);
      const L = rgbLuminance(c);
      worst = Math.min(worst, contrast(L, text.primary) / 3, contrast(L, text.secondary) / 4.5, contrast(L, text.tertiary) / 4.5);
    }
    for (const s of behindButton) {
      // The button's own glass is underneath; the veil is painted over it.
      const c = over(veil, veilAlpha, over(GLASS[mode], BUTTON_GLASS[mode].alpha, over(s, sky.alpha, marble)));
      worst = Math.min(worst, contrast(rgbLuminance(c), text.primary) / 4.5);
    }
  }
  return worst;
}

/** The least veil that makes every text pass in this mode, or Infinity if even a strong veil can't. */
function veilNeeded(sky: Backdrop, mode: SkyMode) {
  if (readability(sky, mode, 0) >= 1) return 0;
  if (readability(sky, mode, 0.9) < 1) return Infinity;
  // More veil only ever helps, so halve the gap until it is under 1%.
  let lo = 0;
  let hi = 0.9;
  while (hi - lo > 0.005) {
    const mid = (lo + hi) / 2;
    if (readability(sky, mode, mid) >= 1) hi = mid;
    else lo = mid;
  }
  return hi;
}

export interface SkyOptions {
  /** The area's night layer (half its 900, half ink). Dark skies lean toward it, so night matches the marble below. */
  areaNight?: string;
  /** Glass lets the marble show through, so the header is part of the page. */
  material?: 'sky' | 'glass';
}

/** The sky at an hour from 0 to 24 (fractions allowed: 18.5 is 6:30 pm). */
export function skyAt(hour: number, { areaNight, material = 'sky' }: SkyOptions = {}): Sky {
  const h = ((hour % 24) + 24) % 24;
  const i = KEYS.findIndex((k) => k.hour > h);
  const a = KEYS[i - 1];
  const b = KEYS[i];
  const t = ease((h - a.hour) / (b.hour - a.hour));
  let top = mixColor(a.top, b.top, t);
  let bottom = mixColor(a.bottom, b.bottom, t);
  // How dark the sky is, 0 (day) to 1 (night).
  const dark = Math.min(1, Math.max(0, (0.6 - luminance(mixColor(top, bottom, 0.5))) / 0.5));
  if (areaNight) {
    // Night leans toward the area's own night layer, so the header belongs to the marble below.
    top = mixColor(top, areaNight, dark * 0.45);
    bottom = mixColor(bottom, areaNight, dark * 0.6);
  }
  const alpha = material === 'glass' ? 0.78 + dark * 0.17 : 1;
  const glow = mixColor(a.glow, b.glow, t);
  const glowAlpha = mix(a.glowAlpha, b.glowAlpha, t);
  const horizon = mix(a.horizon, b.horizon, t);
  // Light or dark text, whichever needs less veil to read. Then just that much veil.
  const backdrop = { top, bottom, glow, glowAlpha, horizon, alpha };
  const needDark = veilNeeded(backdrop, 'dark');
  const needLight = veilNeeded(backdrop, 'light');
  const mode: SkyMode = needDark < needLight ? 'dark' : 'light';
  return {
    // Glass: frosted enough by day to read on any marble, deeper at night.
    alpha,
    top,
    bottom,
    glow,
    glowAlpha,
    glowX: mix(a.glowX, b.glowX, t),
    glowY: mix(a.glowY, b.glowY, t),
    horizon,
    stars: mix(a.stars, b.stars, t),
    mode,
    veil: mode === 'dark' ? INK : PAPER,
    veilAlpha: Math.min(0.9, mode === 'dark' ? needDark : needLight),
  };
}

/** The greeting for an hour. */
export function greetingAt(hour: number) {
  const h = ((hour % 24) + 24) % 24;
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** The same stars every time (a seeded random), so screenshots don't change. */
export function makeStars(count: number) {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: count }, (_, i) => {
    const bright = i % 14 === 0;
    return {
      x: rand() * 100,
      y: rand() * 100,
      size: bright ? 1.6 + rand() * 0.6 : 0.5 + rand() * 0.8,
      base: bright ? 1 : 0.45 + rand() * 0.45,
      bright,
      delay: rand() * 8,
      duration: 4 + rand() * 5,
    };
  });
}
