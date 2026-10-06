/**
 * Milestone gate screenshots. Usage:
 *   node scripts/screenshot.mts M1 / /repair /does-not-exist
 * Expects the production server on PORT (default 3000). Writes to ops/screenshots/<milestone>/.
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const [milestone, ...routes] = process.argv.slice(2);
if (!milestone || routes.length === 0) {
  console.error('usage: node scripts/screenshot.mts <milestone> <route...>');
  process.exit(1);
}
const base = process.env.BASE_URL ?? `http://127.0.0.1:${process.env.PORT ?? 3000}`;
const dir = path.join('ops', 'screenshots', milestone);
mkdirSync(dir, { recursive: true });

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  for (const route of routes) {
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/[\/?=&]/g, '_');
    await page.goto(base + route, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    // Sticky header would repeat mid-capture in full-page shots; pin it for the screenshot only.
    await page.addStyleTag({ content: 'header{position:static!important}' });
    const file = path.join(dir, `${slug}--${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`[screenshot] ${file}`);
  }
  await context.close();
}
await browser.close();
