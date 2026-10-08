// Starts Storybook and keeps the tokens fresh: builds them once, then rebuilds whenever a file in
// tokens/ changes, so new or changed tokens show up without restarting Storybook.
import { spawn, spawnSync } from 'node:child_process';
import { watch } from 'node:fs';

const build = () => spawnSync(process.execPath, ['scripts/build-tokens.mjs'], { stdio: ['ignore', 'ignore', 'inherit'] });

build();
console.log('Tokens built. Watching tokens/ for changes.');

let timer;
watch('tokens', { recursive: true }, (_event, file) => {
  if (!file || !file.endsWith('.json')) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    const r = build();
    console.log(r.status === 0 ? `Tokens rebuilt (${file} changed).` : `Tokens failed to build after ${file} changed; see the error above.`);
  }, 150);
});

const sb = spawn('npx', ['storybook', 'dev', '-p', '6006'], { stdio: 'inherit', shell: process.platform === 'win32' });
sb.on('exit', (code) => process.exit(code ?? 0));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => sb.kill(sig));
