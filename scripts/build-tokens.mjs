// Builds one CSS file and one JSON file per theme.
// Each theme = the shared base (tokens/base) + that theme's own files (tokens/themes/<name>).
import StyleDictionary from 'style-dictionary';
import { readdirSync } from 'node:fs';

const themes = readdirSync('tokens/themes');

for (const theme of themes) {
  const sd = new StyleDictionary({
    usesDtcg: true,
    source: ['tokens/base/**/*.json', `tokens/themes/${theme}/**/*.json`],
    log: { verbosity: 'default' },
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'build/css/',
        files: [{
          destination: `${theme}.css`,
          format: 'css/variables',
          options: { selector: `[data-theme="${theme}"]`, outputReferences: false },
        }],
      },
      json: {
        transformGroup: 'css',
        buildPath: 'build/json/',
        files: [{ destination: `${theme}.json`, format: 'json/flat' }],
      },
    },
  });
  await sd.buildAllPlatforms();
}
console.log(`Built themes: ${themes.join(', ')}`);
