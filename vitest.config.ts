import { configDefaults, defineConfig } from 'vitest/config';

// Visual tests run in Playwright (npm run test:visual), not Vitest.
export default defineConfig({
  test: { exclude: [...configDefaults.exclude, 'tests/visual/**'] },
});
