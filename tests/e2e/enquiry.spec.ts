import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Submit the current step and wait for the next one in a single await, so a
 * full-page navigation (JS disabled) cannot race the action. Focus + Enter is
 * used rather than a pointer click: it is how a keyboard user submits and it is
 * immune to the mobile emulator's "element not stable" false positives.
 */
async function next(page: Page, pattern: RegExp) {
  await page.getByRole('button', { name: 'Continue' }).focus();
  await Promise.all([page.waitForURL(pattern), page.keyboard.press('Enter')]);
}

async function fillStepsToContact(page: Page) {
  await page.goto('/book?intent=second-diagnosis&device=phones');
  await next(page, /step=device/);
  await page.fill('#brand', 'Apple');
  await page.fill('#model', 'iPhone 13');
  await next(page, /step=symptoms/);
  await page.click('label[for="symptom-no-charge"]');
  await page.fill(
    '#description',
    'Still will not charge after another shop replaced the port last month.',
  );
  await next(page, /step=history/);
  await next(page, /step=logistics/);
  await next(page, /step=contact/);
}

test('each step is axe-clean and validation errors are announced', async ({ page }) => {
  await page.goto('/book');
  for (let i = 0; i < 2; i++) {
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(axe.violations).toEqual([]);
    await page.getByRole('button', { name: 'Continue' }).click();
  }
  await expect(page.getByRole('alert').first()).toContainText('Choose the option closest');
});

test('back never loses progress', async ({ page }) => {
  await fillStepsToContact(page);
  await page.getByRole('link', { name: '← Back' }).click();
  await page.waitForURL(/step=logistics/);
  await page.getByRole('link', { name: '← Back' }).click();
  await page.waitForURL(/step=history/);
  await page.getByRole('link', { name: '← Back' }).click();
  await page.waitForURL(/step=symptoms/);
  await expect(page.locator('#description')).toHaveValue(/replaced the port/);
  await expect(page.locator('#symptom-no-charge')).toBeChecked();
});

test('an enquiry can be completed using only the keyboard and yields a real reference', async ({
  page,
}) => {
  await page.goto('/book');
  // Step 1: Tab to the first radio, choose with Space, Tab to Continue, Enter.
  await page.keyboard.press('Tab'); // skip link
  await page.keyboard.press('Tab'); // logo
  // Walk until a help radio is focused.
  for (let i = 0; i < 12; i++) {
    const name = await page.evaluate(
      () => (document.activeElement as HTMLInputElement | null)?.name ?? '',
    );
    if (name === 'help') break;
    await page.keyboard.press('Tab');
  }
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown'); // tablet
  await page.keyboard.press('ArrowDown'); // laptop
  await expect(page.locator('#help-laptops')).toBeChecked();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.waitForURL(/step=device/);
  await page.locator('#brand').focus();
  await page.keyboard.type('Dell');
  await page.keyboard.press('Tab');
  await page.keyboard.type('XPS 13');
  await page.keyboard.press('Tab'); // model-unknown checkbox
  await page.keyboard.press('Tab'); // Continue
  await page.keyboard.press('Enter');
  await page.waitForURL(/step=symptoms/);
  await page.locator('#symptom-no-power').focus();
  await page.keyboard.press('Space');
  await page.locator('#description').focus();
  await page.keyboard.type('Dead after a coffee spill last week. Charger light stays off.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForURL(/step=history/);
  await page.locator('#prior-none').focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Continue' }).focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(/step=logistics/);
  await page.locator('#logistics-arrange').focus();
  await page.keyboard.press('Space');
  await page.locator('#suburb').focus();
  await page.keyboard.type('4000');
  await page.getByRole('button', { name: 'Continue' }).focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(/step=contact/);
  await page.locator('#name').focus();
  await page.keyboard.type('Keyboard Tester');
  await page.keyboard.press('Tab');
  await page.keyboard.type('keyboard@example.com');
  await page.keyboard.press('Tab'); // phone
  await page.keyboard.press('Tab'); // consent
  await page.keyboard.press('Space');
  await expect(page.locator('#consent')).toBeChecked();
  await page.waitForTimeout(2600); // minimum time-on-step
  await page.getByRole('button', { name: 'Open my case' }).focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(/\/book\/done/);
  await expect(page.locator('h1')).toContainText(/HUS-\d{6}/);
});

test('the enquiry works with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await fillStepsToContact(page);
  await page.fill('#name', 'No Script');
  await page.fill('#email', 'noscript@example.com');
  await page.click('#consent');
  await page.waitForTimeout(2600);
  await page.getByRole('button', { name: 'Open my case' }).click();
  await page.waitForURL(/\/book\/done/);
  await expect(page.locator('h1')).toContainText(/HUS-\d{6}/);
  await context.close();
});

test('a tampered logistics value is bounced back to the logistics step', async ({ page }) => {
  await page.goto(
    '/book?help=laptops&brand=Dell&symptom=no-power&description=Dead+after+a+coffee+spill+last+week&prior=none&logistics=pickup&step=contact&submitted=logistics',
  );
  await expect(page.locator('h1')).toContainText('How should it reach us');
});

test('the honeypot swallows bots without a reference', async ({ page }) => {
  await fillStepsToContact(page);
  await page.fill('#name', 'Bot');
  await page.fill('#email', 'bot@example.com');
  await page.click('#consent');
  await page.evaluate(
    () => ((document.querySelector('#website') as HTMLInputElement).value = 'http://spam'),
  );
  await page.waitForTimeout(2600);
  await page.getByRole('button', { name: 'Open my case' }).click();
  await page.waitForURL(/\/book\/done/);
  await expect(page.locator('h1')).toContainText('No recent enquiry');
});

test('/book/done without a result is honest', async ({ page }) => {
  await page.goto('/book/done');
  await expect(page.locator('h1')).toContainText('No recent enquiry');
});
