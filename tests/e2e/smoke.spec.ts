import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { enabledRoutes, disabledRoutes, nav } from './helpers';

const routes = enabledRoutes.filter((r) => r !== '/book'); // /book has its own spec

for (const route of routes) {
  test(`${route} renders, has one h1, no console errors, and is axe-clean`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(e.message));
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toBeVisible();
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(
      axe.violations,
      JSON.stringify(
        axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        null,
        2,
      ),
    ).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('header shows exactly the nav for this profile', async ({ page }) => {
  await page.goto('/');
  const labels = await page.locator('nav[aria-label="Primary"] a').allInnerTexts();
  expect(labels).toEqual(nav.primary.map((l) => l.label));
});

for (const route of disabledRoutes) {
  test(`${route} is a real 404 under this profile`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('drop test');
  });
}

test('an unknown repair category is a 404', async ({ page }) => {
  const res = await page.goto('/repair/watches');
  expect(res?.status()).toBe(404);
});

test('sitemap lists only enabled, indexable routes and robots points at it', async ({
  request,
}) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
  for (const r of disabledRoutes) expect(locs).not.toContain(r);
  expect(locs).not.toContain('/policies/privacy');
  expect(locs).not.toContain('/book/done');
  expect(locs).toContain('/');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
  expect(robots).toMatch(/Disallow: \/book\/done/);
});

test('JSON-LD never carries unconfirmed facts', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allInnerTexts();
  const org = blocks
    .map((b) => JSON.parse(b))
    .find((j) => j['@type'] === 'Organization' || j['@type'] === 'LocalBusiness');
  expect(org).toBeTruthy();
  expect(org).not.toHaveProperty('telephone');
  expect(org).not.toHaveProperty('aggregateRating');
});
