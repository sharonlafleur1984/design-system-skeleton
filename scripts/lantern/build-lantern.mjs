// Builds Lantern, the design system's Claude artifact, from this repo: npm run lantern.
// Writes lantern/project/ (git-ignored): tokens.json from the token build, the font files, the
// component library as one script (components/bundle.js and bundle.css), a README per part with its
// status, the brand book (README.md) and the cover. Claude publishes that folder to the artifact.
// Code and Storybook stay the source of truth: Lantern is rebuilt from here, never edited only there.
import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = join(root, 'lantern/project');
const require = createRequire(join(root, 'package.json'));
const read = (p) => readFileSync(join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const write = (p, text) => {
  mkdirSync(dirname(join(out, p)), { recursive: true });
  writeFileSync(join(out, p), text);
};

execSync('node scripts/build-tokens.mjs', { cwd: root, stdio: 'inherit' });
rmSync(join(root, 'lantern'), { recursive: true, force: true });

const sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: root }).toString().trim();
const now = new Date().toISOString();

// ---- Themes: each product's light and dark look is one Lantern theme. A theme marked alwaysDark has only its dark look.
const repoThemes = json('build/themes.json');
const lanternThemes = [];
for (const t of repoThemes) {
  const slug = t.name.toLowerCase();
  if (t.alwaysDark) lanternThemes.push({ id: slug, name: t.name, repo: t.id, file: `build/json/${t.id}.json` });
  else {
    lanternThemes.push({ id: slug, name: t.name, repo: t.id, file: `build/json/${t.id}.json` });
    lanternThemes.push({ id: `${slug}-dark`, name: `${t.name} dark`, repo: t.id, file: `build/json-dark/${t.id}.json` });
  }
}
// Light looks and Fireside first, so Lantern never opens on Spotlight dark; that look waits for the glass parts.
const order = ['spotlight', 'sunrise', 'fireside', 'sunrise-dark', 'spotlight-dark'];
lanternThemes.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
const values = Object.fromEntries(lanternThemes.map((t) => [t.id, json(t.file)]));

// The comment after each variable in the theme CSS says what it's for.
const usage = {};
for (const t of repoThemes) {
  for (const m of read(`build/css/${t.id}.css`).matchAll(/--([a-z0-9-]+):[^;]*;\s*\/\*\*\s*([\s\S]*?)\s*\*\//g)) usage[m[1]] ??= m[2].replace(/\s+/g, ' ');
}

const isColor = (v) => typeof v === 'string' && /^(#[0-9a-f]{3,8}|(rgba?|hsla?|oklch|oklab)\([0-9.,%\s/-]+\))$/i.test(v.trim());
const isLength = (v) => typeof v === 'string' && /^-?[0-9.]+(px|rem|em|%)?$/.test(v.trim());
const skipped = [];

// ---- Colors: the shared color names, one value per theme. Each theme's raw palette has its own
// names, so Lantern leaves palettes out; a palette listed by name would show Spotlight's in every theme.
const first = values[lanternThemes[0].id];
const colorNames = Object.keys(first).filter((k) => k.startsWith('color-'));
const colorTokens = [];
for (const name of colorNames) {
  const value = {};
  for (const t of lanternThemes) {
    const v = values[t.id][name];
    if (isColor(v)) value[t.id] = v.trim().toLowerCase();
  }
  if (!Object.keys(value).length) {
    skipped.push(name);
    continue;
  }
  // Shown without the color- prefix so Lantern's narrow name column fits the whole name; the note keeps the code name.
  colorTokens.push({ name: name.replace(/^color-/, ''), value, usage: `${usage[name] ?? 'From the theme CSS.'} In code: --${name}.` });
}

// ---- Spacing, radius and shadow come from the shared base (the same in every theme), except where noted.
const family = (prefix, test, note) =>
  Object.keys(first)
    .filter((k) => k.startsWith(prefix) && test(first[k]))
    .map((name) => ({ name, value: String(first[name]).trim(), usage: usage[name] ?? note }));
const spacing = [...family('space-', isLength, 'Spacing step.'), ...family('layout-', isLength, 'Page layout.')];
const radius = family('radius-', isLength, "Spotlight's corners; each theme picks its own roundness.");
const shadow = Object.keys(first)
  .filter((k) => k.startsWith('shadow-'))
  .map((name) => {
    const value = {};
    for (const t of lanternThemes) {
      const v = String(values[t.id][name] ?? '');
      if (v && !/var\(|url\(|color-mix/.test(v)) value[t.id] = v;
    }
    return { name, value, usage: usage[name] ?? 'Shadow.' };
  })
  .filter((s) => Object.keys(s.value).length);

// ---- Type: one group per theme, since each theme has its own faces.
const styleNames = Object.keys(first)
  .filter((k) => /^type-.+-size$/.test(k))
  .map((k) => k.slice(5, -5));
const families = {};
const familyKey = (theme, stack) => {
  const role = /mono/i.test(stack) ? 'code' : /serif/.test(stack) && !/sans-serif/.test(stack) ? 'display' : 'body';
  const key = `${theme}-${role}`;
  families[key] = stack.replace(/[;{}<>\\()]/g, '');
  return key;
};
const groups = repoThemes.map((t) => {
  const v = json(`build/json/${t.id}.json`);
  const slug = t.name.toLowerCase();
  return {
    name: t.name,
    family: familyKey(slug, v['font-family-body']),
    styles: styleNames.map((s) => ({
      name: `${slug}-${s}`,
      family: familyKey(slug, v[`type-${s}-family`] ?? v['font-family-body']),
      fontSize: String(v[`type-${s}-size`]),
      lineHeight: v[`type-${s}-line-height`],
      fontWeight: Number(v[`type-${s}-weight`]) || 400,
      ...(v[`type-${s}-letter-spacing`] ? { letterSpacing: String(v[`type-${s}-letter-spacing`]) } : {}),
      usage: usage[`type-${s}-size`] ?? `${t.name}'s ${s.replace(/-/g, ' ')} style.`,
    })),
  };
});

// ---- Fonts: every face the themes load, copied as files.
const fonts = [];
const addFaces = (css, from) => {
  for (const m of css.matchAll(/@font-face\s*{([^}]*)}/g)) {
    const body = m[1];
    const name = /font-family:\s*'?([^';]+)'?/.exec(body)?.[1];
    const weight = /font-weight:\s*([^;]+)/.exec(body)?.[1].trim() ?? '400';
    const style = /font-style:\s*([^;]+)/.exec(body)?.[1].trim() ?? 'normal';
    const url = /url\(['"]?([^'")]+\.woff2)['"]?\)/.exec(body)?.[1];
    if (!name || !url) continue;
    const src = resolve(from, url);
    if (!existsSync(src)) continue;
    const file = `fonts/${basename(src)}`;
    mkdirSync(join(out, 'fonts'), { recursive: true });
    copyFileSync(src, join(out, file));
    fonts.push({ family: name, file, weight, style });
  }
};
for (const f of readdirSync(join(root, 'src/fonts'))) {
  const css = read(`src/fonts/${f}`);
  addFaces(css, join(root, 'src/fonts'));
  for (const m of css.matchAll(/@import\s+'([^']+)'/g)) {
    const path = require.resolve(m[1]);
    addFaces(readFileSync(path, 'utf8'), dirname(path));
  }
}

const tokens = {
  name: 'Lantern',
  version: 1,
  meta: { source: 'github', repo: 'sharonlafleur1984/lantern-design-system', ref: `${branch}@${sha}`, paths: { tokens: ['build/json', 'build/json-dark', 'build/css'], fonts: ['src/fonts'] }, synced: now.slice(0, 10) },
  color: { themes: lanternThemes.map(({ id, name }) => ({ id, name })), tokens: colorTokens },
  type: { fonts, families, groups },
  spacing: { tokens: spacing },
  radius: { tokens: radius },
  shadow: { tokens: shadow },
};
write('tokens.json', JSON.stringify(tokens, null, 2));

// ---- The component library, bundled with React, plus every part's page words.
const pageFiles = readdirSync(join(root, 'src/components'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(root, 'src/components', d.name, `${d.name}.page.tsx`)))
  .map((d) => d.name);
const titleOf = (dir) => /title:\s*'([^']+)'/.exec(read(`src/components/${dir}/${dir}.stories.tsx`))[1];
const pagesModule = [
  "import { planned, plannedPage } from './src/planned/planned';",
  ...pageFiles.map((d, i) => `import * as p${i} from './src/components/${d}/${d}.page';`),
  'const info = (m) => Object.values(m).find((v) => v && typeof v === "object" && "summary" in v);',
  'export const pages = {',
  ...pageFiles.map((d, i) => `  ${JSON.stringify(titleOf(d).split('/').at(-1))}: { ...info(p${i}), title: ${JSON.stringify(titleOf(d))} },`),
  '};',
  'for (const title of Object.keys(planned)) pages[title.split("/").at(-1)] = { ...plannedPage(title), title };',
].join('\n');

// The page words link with DocLink from the Storybook page; in Lantern a plain link is enough.
const stubPage = `import { createElement } from 'react';
export const pagePath = (t) => t;
export const docsPath = pagePath;
export const DocLink = ({ href, children }) => createElement('a', { href }, children);`;

const common = {
  bundle: true,
  minify: true,
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: { '.woff2': 'empty', '.woff': 'empty', '.jpg': 'empty', '.png': 'dataurl', '.svg': 'dataurl' },
  plugins: [
    {
      name: 'lantern',
      setup(b) {
        b.onResolve({ filter: /^lantern:pages$/ }, () => ({ path: 'pages', namespace: 'lantern' }));
        b.onLoad({ filter: /^pages$/, namespace: 'lantern' }, () => ({ contents: pagesModule, resolveDir: root, loader: 'tsx' }));
        b.onResolve({ filter: /\.storybook\/component-page$/ }, () => ({ path: 'stub', namespace: 'lantern-stub' }));
        b.onLoad({ filter: /.*/, namespace: 'lantern-stub' }, () => ({ contents: stubPage, resolveDir: root, loader: 'jsx' }));
      },
    },
  ],
};

// The bundle for the previews.
await build({ ...common, entryPoints: [join(root, 'scripts/lantern/entry.tsx')], format: 'iife', globalName: '__lantern', footer: { js: 'window.Lantern=__lantern.default;' }, outfile: join(out, 'components/bundle.js'), platform: 'browser' });
// The same words in Node, so each part gets a README.
const wordsFile = join(root, 'lantern/words.cjs');
await build({ ...common, stdin: { contents: `${pagesModule}\nimport { renderToStaticMarkup } from 'react-dom/server';\nexport { renderToStaticMarkup };`, resolveDir: root, loader: 'tsx' }, format: 'cjs', platform: 'node', outfile: wordsFile, external: ['react', 'react-dom'] });
const { pages, renderToStaticMarkup } = require(wordsFile);

// Bundle css: the parts' styles, then every theme's variables (light, dark, screen sizes), the text
// styles and the base, exactly as the repo ships them. Lantern's own token edits don't reach the
// previews: the code is the source of truth, so a token change goes back to the repo as a pull request.
const themeCss = repoThemes.map((t) => read(`build/css/${t.id}.css`)).join('\n');
let css = [readFileSync(join(out, 'components/bundle.css'), 'utf8'), themeCss, read('build/text-styles.css'), read('src/base.css'), '.lantern-preview{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:16px;color:var(--color-ink-primary);font-family:var(--font-family-body)}'].join('\n');
css = css.replace(/@import[^;]+;/g, '');
write('components/bundle.css', css);

const pascal = (name) => name.replace(/(^|\s)(\w)/g, (_, __, c) => c.toUpperCase()).replace(/\W/g, '');
const built = Object.entries(pages).filter(([, p]) => (p.status === 'ready' || p.status === 'pending') && p.do);
let js = readFileSync(join(out, 'components/bundle.js'), 'utf8').replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const header = { format: 4, namespace: 'Lantern', components: built.map(([n]) => ({ name: pascal(n) })) };
write('components/bundle.js', `/* @ds-bundle: ${JSON.stringify(header)} */\n${js}`);

// ---- A README per part (what it's for, its status, how to use it), and a live preview for each built one.
const text = (node) =>
  typeof node === 'string' ? node : renderToStaticMarkup(node).replace(/<a href="([^"]*)"[^>]*>(.*?)<\/a>/g, '$2').replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const statusWord = { ready: 'Ready', pending: 'Pending', 'on-hold': 'On hold', 'not-started': 'Not started' };
const storybook = 'https://designsystemskeleton.netlify.app/?path=/story/';
const storyId = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const list = (items) => items.map((i) => `- ${text(i)}`).join('\n');
for (const [name, p] of Object.entries(pages)) {
  const comp = pascal(name);
  const group = p.title.split('/')[0];
  const ra = p.builtWith?.reactAria;
  const lines = [
    `# ${name}`,
    '',
    `${p.summary}`,
    '',
    `**Status:** ${statusWord[p.status]}. **Built with:** ${ra ? `React Aria's [${ra}](https://react-aria.adobe.com/${ra})` : 'our design system'}. **In Storybook:** [${name}](${storybook}${storyId(p.title)}--overview).`,
    '',
    '## When to use it',
    '',
    list(p.useFor),
  ];
  if (p.useElse?.length) lines.push('', "## When not to use it", '', p.useElse.map((u) => `- ${text(u.job)}${u.instead ? `: use ${u.instead.name} instead` : ''}`).join('\n'));
  if (p.do) lines.push('', '## Do', '', list(p.do.rules));
  if (p.dont) lines.push('', "## Don't", '', list(p.dont.rules));
  if (p.keys?.length || p.screenReader) {
    lines.push('', '## Accessibility', '');
    for (const k of p.keys ?? []) lines.push(`- Press ${k.keys.join(' or ')}: ${text(k.result)}`);
    if (p.screenReader) lines.push(`- A screen reader says "${p.screenReader.pattern}", like "${p.screenReader.example}".`);
    for (const a of p.accessibility ?? []) lines.push(`- ${text(a)}`);
  }
  if (p.imports) lines.push('', '## Use it in code', '', '```tsx', `import { ${p.imports.join(', ')} } from 'design-system-skeleton';`, '```');
  if (p.tokens) lines.push('', `Tokens it uses: ${p.tokens.map((t) => `\`${t}\``).join(', ')}.`);
  if (p.onlyIn) lines.push('', `Made for Spotlight only so far.`);
  if (p.status !== 'ready' && p.status !== 'pending') lines.push('', 'Nothing is built yet, so there is no preview.');
  write(`components/${comp}/README.md`, lines.join('\n') + '\n');
  if (built.some(([n]) => n === name)) {
    write(`components/${comp}/preview.html`, `<!-- @dsCard group="${group}" height=160 subtitle="${statusWord[p.status]}" -->\n<div id="root"></div>\n<script>window.Lantern.mount(document.getElementById('root'), ${JSON.stringify(name)});</script>\n`);
  }
}

// ---- The brand book, the cover and the index.
const statusRows = Object.entries(pages)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([n, p]) => `| [${n}](${storybook}${storyId(p.title)}--overview) | ${p.title.split('/')[0].replace(/s$/, '')} | \`${statusWord[p.status]}\` | ${p.summary} |`);
write('README.md', read('scripts/lantern/README.template.md').replace('{{STATUS_TABLE}}', ['| Component | Group | Status | Description |', '| --- | --- | --- | --- |', ...statusRows].join('\n')).replace('{{REF}}', `${branch}@${sha}`).replace('{{UPDATED}}', new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })));
write('components/Cover/preview.html', read('scripts/lantern/cover.html'));
// Lantern's mark. In the artifact it's an uploaded asset (assets/Logos), so publishing uploads it and records
// its id in design-system.json's assetGroups; the folder keeps a copy and the group's note.
write('assets/Logos/lantern-mark.svg', read('scripts/lantern/lantern-mark.svg'));
write('assets/Logos/README.md', "# Logos\n\nLantern's mark: a copper camp lantern with one amber orb inside. It's drawn for a dark ground (night iron, `#2a1a12`); don't set it on a light page. Keep its colors as they are: night iron, copper, amber flame and peach glow are Lantern's own, not any theme's.\n");
write(
  'design-system.json',
  JSON.stringify(
    {
      v: 3,
      layout: 'files',
      createdOnFiles: { v: 1, at: now },
      title: 'Lantern',
      namespace: 'Lantern',
      libraries: [],
      sections: {},
      groups: [],
      assetGroups: {},
      blobs: {},
      docs: { sections: [] },
      lastChange: { by: 'Sharon', at: now, via: `GitHub · sharonlafleur1984/lantern-design-system@${sha}`, note: `Built from ${branch}@${sha}` },
    },
    null,
    2,
  ),
);
rmSync(wordsFile);

const size = (p) => readFileSync(join(out, p)).length;
console.log(`Lantern built in ${relative(root, out)} from ${branch}@${sha}:`);
console.log(`  ${colorTokens.length} colors x ${lanternThemes.length} themes, ${groups.reduce((n, g) => n + g.styles.length, 0)} text styles, ${spacing.length} spacing, ${radius.length} radii, ${shadow.length} shadows, ${fonts.length} font files`);
console.log(`  ${Object.keys(pages).length} parts (${built.length} with live previews); bundle.js ${Math.round(size('components/bundle.js') / 1024)} KB, bundle.css ${Math.round(size('components/bundle.css') / 1024)} KB`);
if (skipped.length) console.log(`  Not carried over (not a plain color in any theme): ${skipped.join(', ')}`);
