// One screenshot per story, per screen class (Material 3: phone, tablet, desktop).
// Stories show one product at a time (the toolbar's theme picker), so every story is
// captured once per theme, except stories tagged only:<theme> (Explorations made for one product),
// which are captured in that theme only.
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

type Entry = { id: string; type: string; title: string; tags?: string[] };
const index = JSON.parse(readFileSync('storybook-static/index.json', 'utf8')) as { entries: Record<string, Entry> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

const screens = { phone: 390, tablet: 768, desktop: 1280 } as const;
// Every theme, from the token build (each tokens/themes/<id>/theme.json).
const themes = (JSON.parse(readFileSync('build/themes.json', 'utf8')) as { id: string }[]).map((t) => t.id);
const themesFor = (story: Entry) => {
  const only = (story.tags ?? []).filter((t) => t.startsWith('only:')).map((t) => t.slice(5));
  return only.length ? only : themes;
};
const screenshotTime = new Date('2026-10-13T06:53:00Z');

// Waits until every image on the page has loaded and decoded, including CSS backgrounds like Life
// Hub's marbles, then for two frames so they're painted. Without this, a story with many images
// is screenshotted with some still loading, and the check fails at random.
async function imagesReady() {
  const urls = new Set<string>();
  for (const el of Array.from(document.querySelectorAll('*'))) {
    for (const m of getComputedStyle(el).backgroundImage.matchAll(/url\("?([^")]+)"?\)/g)) urls.add(m[1]);
  }
  const decode = (img: HTMLImageElement) => img.decode().catch(() => undefined);
  await Promise.all([
    ...Array.from(document.images).map(decode),
    ...[...urls].map((src) => Object.assign(new Image(), { src })).map(decode),
  ]);
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
}

for (const story of stories) {
  for (const theme of themesFor(story)) {
    for (const [screen, width] of Object.entries(screens)) {
      const name = `${story.id}--${theme}--${screen}`;
      test(name, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.clock.setFixedTime(screenshotTime);
        await page.goto(`/iframe.html?id=${story.id}&globals=theme:${theme}&viewMode=story`);
        await page.locator('#storybook-root').waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(imagesReady);
        // Tall stories full of images (the sky header on every marble) take over the default 5s.
        await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, timeout: 20_000 });
      });
    }
  }
}
