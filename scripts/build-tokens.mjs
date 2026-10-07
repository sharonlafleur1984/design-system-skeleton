// Builds one CSS file and one JSON file per theme.
// Each theme = the shared base (tokens/base) + that theme's own files (tokens/themes/<name>).
//
// Two extras on top of plain variables:
// 1. Text sizes, spacing and layout are written in rem in the CSS, so they grow with the
//    reader's own text-size setting. The JSON keeps px.
// 2. Screen classes (Material 3): a token can carry phone and tablet sizes in
//    $extensions["com.sharon.screen-class"]. Its $value is the desktop (expanded) size.
//    The CSS adds media queries: medium under 840px, compact under 600px.
import StyleDictionary from 'style-dictionary';
import { formattedVariables } from 'style-dictionary/utils';
import { appendFileSync, existsSync, readFileSync, readdirSync } from 'node:fs';

const EXT = 'com.sharon.screen-class';
const BASE_PX = 16;
const BREAKPOINTS = { medium: 839, compact: 599 }; // max-width in px; order matters (compact wins)

// Tokens that follow the reader's text size: type and link sizes, the spacing scale and layout spacing.
// Borders, outlines and radius stay in px on purpose.
const scales = (token) =>
  ((token.path[0] === 'type' || token.path[0] === 'link') && token.path.at(-1) === 'size') || token.path[0] === 'space' || token.path[0] === 'layout' ||
  (token.path[0] === 'shell' && token.$type === 'dimension' && token.path[1] !== 'sheet-radius');

const toRem = (v) => {
  const m = /^(-?\d*\.?\d+)px$/.exec(String(v));
  if (!m) return v;
  const n = Number(m[1]);
  return n === 0 ? '0rem' : `${+(n / BASE_PX).toFixed(4)}rem`; // a unit on zero, so it still works inside calc()
};

StyleDictionary.registerTransform({
  name: 'size/px-to-rem-scaling',
  type: 'value',
  filter: scales,
  transform: (token) => toRem(token.$value ?? token.value),
});

StyleDictionary.registerFormat({
  name: 'css/variables-screen-classes',
  format: ({ dictionary, options }) => {
    const sel = options.selector;
    const vars = formattedVariables({ format: 'css', dictionary, outputReferences: false, usesDtcg: true });
    let out = `/**\n * Do not edit directly, this file was generated from tokens.\n */\n\n${sel} {\n${vars}\n}\n`;
    for (const [cls, max] of Object.entries(BREAKPOINTS)) {
      const rows = dictionary.allTokens
        .filter((t) => t.$extensions?.[EXT]?.[cls])
        .map((t) => {
          const raw = t.$extensions[EXT][cls];
          return `    --${t.name}: ${scales(t) ? toRem(raw) : raw};`;
        });
      if (rows.length) out += `\n/* ${cls} screens */\n@media (max-width: ${max}px) {\n  ${sel} {\n${rows.join('\n')}\n  }\n}\n`;
    }
    return out;
  },
});

// Every token that changes by screen class, with all three sizes, for docs and tests.
StyleDictionary.registerFormat({
  name: 'json/screen-classes',
  format: ({ dictionary }) => {
    const out = {};
    for (const t of dictionary.allTokens) {
      const e = t.$extensions?.[EXT];
      if (e) out[t.name] = { compact: e.compact, medium: e.medium, expanded: t.original.$value };
    }
    return JSON.stringify(out, null, 2) + '\n';
  },
});

const themes = readdirSync('tokens/themes');

for (const theme of themes) {
  const sd = new StyleDictionary({
    usesDtcg: true,
    // A theme's dark folder holds dark mode overrides; it is built separately below.
    source: ['tokens/base/**/*.json', `tokens/themes/${theme}/!(dark)/**/*.json`, `tokens/themes/${theme}/*.json`],
    log: { verbosity: 'default' },
    platforms: {
      css: {
        transformGroup: 'css',
        transforms: ['size/px-to-rem-scaling'],
        buildPath: 'build/css/',
        files: [{
          destination: `${theme}.css`,
          format: 'css/variables-screen-classes',
          options: { selector: `[data-theme="${theme}"]` },
        }],
      },
      json: {
        transformGroup: 'css',
        buildPath: 'build/json/',
        files: [
          { destination: `${theme}.json`, format: 'json/flat' },
          { destination: `${theme}.screen-classes.json`, format: 'json/screen-classes' },
        ],
      },
    },
  });
  await sd.buildAllPlatforms();

  // Dark mode: tokens/themes/<theme>/dark only overrides values of names the theme already has.
  // Every value that differs from light is written after the light variables, under two selectors:
  // the device setting (unless a page or Storybook forces light) and data-mode="dark" (Storybook's switch).
  const darkDir = `tokens/themes/${theme}/dark`;
  if (existsSync(darkDir)) {
    const dark = new StyleDictionary({
      usesDtcg: true,
      source: ['tokens/base/**/*.json', `tokens/themes/${theme}/*.json`, `${darkDir}/**/*.json`],
      log: { verbosity: 'silent', warnings: 'disabled' },
      platforms: {
        json: { transformGroup: 'css', buildPath: 'build/json-dark/', files: [{ destination: `${theme}.json`, format: 'json/flat' }] },
      },
    });
    await dark.buildAllPlatforms();
    const light = JSON.parse(readFileSync(`build/json/${theme}.json`, 'utf8'));
    const darkTokens = JSON.parse(readFileSync(`build/json-dark/${theme}.json`, 'utf8'));
    const rows = Object.entries(darkTokens)
      .filter(([name, value]) => light[name] !== value)
      .map(([name, value]) => `  --${name}: ${value};`);
    const t = `[data-theme="${theme}"]`;
    const css =
      `\n/* Dark mode: the device setting, unless something forces light. */\n` +
      `@media (prefers-color-scheme: dark) {\n  :root:not([data-mode="light"])${t},\n  :root:not([data-mode="light"]) ${t}:not([data-mode="light"]) {\n${rows.map((r) => '  ' + r).join('\n')}\n  }\n}\n` +
      `\n/* Dark mode, forced (Storybook's switch). */\n[data-mode="dark"]${t},\n[data-mode="dark"] ${t}:not([data-mode="light"]),\n${t}[data-mode="dark"] {\n${rows.join('\n')}\n}\n`;
    appendFileSync(`build/css/${theme}.css`, css);
  }
}
console.log(`Built themes: ${themes.join(', ')}`);
