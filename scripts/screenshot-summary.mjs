// Sums up a pull request's screenshot changes in one comment, so a review starts from a short
// list instead of every picture. Run by the "Update screenshots" job after it commits.
//
//   node scripts/screenshot-summary.mjs <base-ref> [head-ref]
//
// Prints the summary as Markdown. With GITHUB_TOKEN, GITHUB_REPOSITORY and PR_NUMBER set, it
// also posts it on the pull request, replacing its own earlier comment.
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const DIR = 'tests/visual/__screenshots__';
const LOOK = 5; // percent of pixels changed that earns a "look at this"
const SHOW = 8; // most stories shown as pictures; the rest are listed
const MARKER = '<!-- screenshot-summary -->';
const [base, head = 'HEAD'] = process.argv.slice(2);
if (!base) throw new Error('Usage: node scripts/screenshot-summary.mjs <base-ref> [head-ref]');

const git = (args, opts = {}) => execFileSync('git', args, { maxBuffer: 1 << 28, ...opts });
const mergeBase = git(['merge-base', base, head]).toString().trim();
const headSha = git(['rev-parse', head]).toString().trim();
const png = (ref, path) => PNG.sync.read(git(['show', `${ref}:${path}`]));

// One story has a screenshot per theme and screen size: group them by story. Theme names come
// from the theme folders, so a new theme needs no change here.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const themes = readdirSync('tokens/themes', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => b.length - a.length)
  .map(escapeRegex);
if (!themes.length) throw new Error('No themes found in tokens/themes');
const themePattern = themes.join('|');
const story = (path) => path.split('/').pop().replace(new RegExp(`--(${themePattern})--(phone|tablet|desktop)(-linux)?\\.png$`), '');
const variant = (path) => (path.match(new RegExp(`--((?:${themePattern})--(?:phone|tablet|desktop))`)) || [])[1] || '';

const rows = git(['diff', '--name-status', '--find-renames', `${mergeBase}...${headSha}`, '--', DIR])
  .toString().trim().split('\n').filter(Boolean).map((l) => l.split('\t'));

const changed = new Map(); // story -> { pct, resized, worst, files }
const added = new Set();
const removed = new Set();
for (const [status, a, b] of rows) {
  if (status === 'A') added.add(story(a));
  else if (status === 'D') removed.add(story(a));
  else if (status === 'M' || status.startsWith('R')) {
    const path = b || a;
    const before = png(mergeBase, a);
    const after = png(headSha, path);
    let pct = 100;
    const resized = before.width !== after.width || before.height !== after.height;
    if (!resized) {
      const diff = pixelmatch(before.data, after.data, null, before.width, before.height, { threshold: 0.1 });
      pct = (diff / (before.width * before.height)) * 100;
    }
    const s = changed.get(story(path)) || { pct: 0, resized: false, worst: path, files: 0 };
    s.files += 1;
    s.resized ||= resized;
    if (pct >= s.pct) Object.assign(s, { pct, worst: path, worstFrom: a });
    changed.set(story(path), s);
  }
}
for (const s of changed.keys()) added.delete(s);

const repo = process.env.GITHUB_REPOSITORY;
const pr = process.env.PR_NUMBER;
const raw = (ref, path) => `https://github.com/${repo}/blob/${ref}/${path}?raw=1`;
const img = (ref, path, alt) => (repo ? `<img src="${raw(ref, path)}" alt="${alt}" width="320">` : alt);
// Netlify builds a Storybook preview for every pull request.
const preview = (name) => (pr ? `[${name}](https://deploy-preview-${pr}--designsystemskeleton.netlify.app/?path=/story/${name})` : name);
const sorted = [...changed.entries()].sort((x, y) => y[1].pct - x[1].pct);
const look = sorted.filter(([, s]) => s.resized || s.pct >= LOOK);
const total = rows.length;

let md = `${MARKER}\n### Screenshot summary\n\n`;
if (!total) md += 'No screenshots changed.\n';
else {
  md += `${total} screenshots: ${changed.size} stories changed, ${added.size} new, ${removed.size} removed.\n\n`;
  if (look.length) {
    md += `**Look at these first** (${LOOK}% or more changed, or a new size). Each shows the view that changed most:\n\n`;
    for (const [name, s] of look.slice(0, SHOW)) {
      md += `#### ${preview(name)}\n${s.resized ? 'New size' : `${s.pct.toFixed(1)}% changed`}, ${variant(s.worst)}\n\n`;
      md += `| Before | After |\n|---|---|\n| ${img(mergeBase, s.worstFrom, 'before')} | ${img(headSha, s.worst, 'after')} |\n\n`;
    }
    const rest = look.slice(SHOW);
    if (rest.length) md += `**Also changed a lot:** ${rest.map(([n, s]) => `${preview(n)} ${s.resized ? 'new size' : `${s.pct.toFixed(1)}%`}`).join(', ')}\n\n`;
  }
  const small = sorted.filter(([, s]) => !s.resized && s.pct < LOOK);
  if (small.length) md += `**Small changes** (under ${LOOK}%): ${small.map(([n, s]) => `${n} ${s.pct.toFixed(1)}%`).join(', ')}\n\n`;
  if (added.size) md += `**New:** ${[...added].sort().map(preview).join(', ')}\n\n`;
  if (removed.size) md += `**Removed:** ${[...removed].sort().join(', ')}\n\n`;
  md += 'For each one, ask: did I mean this?\n';
}
console.log(md);

const { GITHUB_TOKEN: token } = process.env;
if (token && repo && pr) {
  const api = (path, init = {}) =>
    fetch(`https://api.github.com/repos/${repo}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
    }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${path}`))));
  const comments = await api(`/issues/${pr}/comments?per_page=100`);
  const mine = comments.find((c) => c.body?.startsWith(MARKER));
  const body = JSON.stringify({ body: md });
  if (mine) await api(`/issues/comments/${mine.id}`, { method: 'PATCH', body });
  else await api(`/issues/${pr}/comments`, { method: 'POST', body });
}
