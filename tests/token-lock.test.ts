// The token lock. Every token value for every theme is saved in tests/token-lock/.
// If a value changes, this test fails and the pull request shows the before and after.
// To approve a change on purpose, run: npm run test:update
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const files = readdirSync('build/json').filter((f) => f.endsWith('.json')).sort();

describe('token lock', () => {
  for (const f of files) {
    it(`${f} matches the approved values`, async () => {
      const json = JSON.stringify(JSON.parse(readFileSync(`build/json/${f}`, 'utf8')), null, 2) + '\n';
      await expect(json).toMatchFileSnapshot(`./token-lock/${f}`);
    });
  }
});
