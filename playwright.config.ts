// Visual tests: every Storybook story, screenshotted at phone, tablet and desktop,
// compared with the approved screenshots in tests/visual/__screenshots__.
// Run after `npm run build-storybook`. Approve changes with `npm run test:visual:update`.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : [['list']],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: 'disabled', caret: 'hide' } },
  use: { baseURL: 'http://localhost:6007' },
  webServer: {
    command: 'npx http-server storybook-static -p 6007 -s',
    url: 'http://localhost:6007/index.json',
    reuseExistingServer: !process.env.CI,
  },
});
