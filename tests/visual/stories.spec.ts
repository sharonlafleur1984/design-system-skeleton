// One screenshot per story, per screen class (Material 3: phone, tablet, desktop).
// Stories show one product at a time (the toolbar's theme picker), so every story is
// captured once per theme.
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

type Entry = { id: string; type: string; title: string };
const index = JSON.parse(readFileSync('storybook-static/index.json', 'utf8')) as { entries: Record<string, Entry> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

const screens = { phone: 390, tablet: 768, desktop: 1280 } as const;
const themes = ['after-graduation', 'life-hub'];

for (const story of stories) {
  for (const theme of themes) {
    for (const [screen, width] of Object.entries(screens)) {
      const name = `${story.id}--${theme}--${screen}`;
      test(name, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(`/iframe.html?id=${story.id}&globals=theme:${theme}&viewMode=story`);
        await page.locator('#storybook-root').waitFor();
        await page.evaluate(() => document.fonts.ready);
        await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
      });
    }
  }
}
