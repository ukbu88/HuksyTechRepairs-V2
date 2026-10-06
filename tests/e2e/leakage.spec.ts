import { test, expect } from '@playwright/test';
import { enabledRoutes, features, DIVISION_MARKERS, testProfile } from './helpers';

/**
 * Profile leakage: under the profile this server was built with, no disabled
 * division may be discoverable in rendered HTML — nav, footer, homepage copy,
 * CTAs, enquiry options — on any enabled route.
 */
test.describe(`profile ${testProfile()}`, () => {
  for (const route of enabledRoutes) {
    test(`${route} has no trace of a disabled division`, async ({ request }) => {
      const html = await (await request.get(route)).text();
      for (const marker of DIVISION_MARKERS) {
        if (features.isEnabled(marker.feature)) continue;
        for (const pattern of marker.patterns) {
          expect(html, `${route} leaks ${marker.feature}: ${pattern}`).not.toMatch(pattern);
        }
      }
    });
  }

  test('enquiry step 1 offers only options for enabled divisions', async ({ request }) => {
    const html = await (await request.get('/book')).text();
    expect(html.includes('id="help-fleet"')).toBe(features.isEnabled('business'));
    expect(html.includes('id="help-recycle"')).toBe(features.isEnabled('recycling'));
    expect(html.includes('id="help-motherboard"')).toBe(features.isEnabled('motherboardRepair'));
  });

  test('enquiry logistics step offers only enabled options', async ({ request }) => {
    const html = await (
      await request.get(
        '/book?help=phones&brand=Apple&symptom=no-power&description=Dead+after+a+drop+last+week&prior=none&step=logistics',
      )
    ).text();
    expect(html.includes('id="logistics-mailin"')).toBe(features.isEnabled('mailIn'));
    expect(html.includes('id="logistics-pickup"')).toBe(features.isEnabled('pickup'));
    expect(html).toContain('id="logistics-arrange"');
  });

  test('homepage is coherent: a hero, a primary action, no empty sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main a[href^="/book"]').first()).toBeVisible();
    const emptySections = await page
      .locator('main section')
      .evaluateAll((els) => els.filter((e) => e.textContent!.trim().length < 20).length);
    expect(emptySections).toBe(0);
  });
});
