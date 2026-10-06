import { test, expect } from '@playwright/test';
import { enabledRoutes } from './helpers';

const keyRoutes = enabledRoutes.filter((r) =>
  ['/', '/repair', '/repair/phones', '/motherboard-repair', '/book', '/contact'].includes(r),
);

test.describe('320px reflow', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  for (const route of keyRoutes) {
    test(`${route} has no horizontal scroll at 320px`, async ({ page }) => {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

// 200% browser zoom on a 1440px window is a 720 CSS-px viewport at 2x; the layout must reflow.
test.describe('200% zoom (720 CSS px at 2x)', () => {
  test.use({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
  test('home and the contact step reflow without horizontal scroll', async ({ page }) => {
    for (const route of ['/', '/book']) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, route).toBeLessThanOrEqual(0);
    }
  });
});

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });
  test('the board explainer still works and nothing depends on animation', async ({ page }) => {
    await page.goto('/motherboard-repair');
    await page.click('label[for="area-data"]');
    const opacity = await page
      .locator('[data-area="power"]')
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeLessThan(1);
    const duration = await page
      .locator('[data-area="power"]')
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(duration)).toBeLessThan(0.01);
  });
});

test('touch targets on the mobile header and tiles are at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const sel of [
    'header a[href^="/book"]',
    'header summary',
    'main a[href="/repair/phones"]',
  ]) {
    const box = await page.locator(sel).first().boundingBox();
    expect(box?.height ?? 0, sel).toBeGreaterThanOrEqual(44);
  }
});

test('mobile menu opens, lists the nav, and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.click('header summary');
  await expect(page.locator('#mobile-menu')).toHaveAttribute('open', '');
  await page.click('#mobile-menu a[href="/motherboard-repair"]');
  await page.waitForURL(/motherboard-repair/);
  await expect(page.locator('#mobile-menu')).not.toHaveAttribute('open', '');
});

test('skip link is the first focusable element and moves focus to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});
