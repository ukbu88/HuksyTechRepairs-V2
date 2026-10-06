import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORT ?? 3000);
const baseURL = `http://127.0.0.1:${port}`;
const distDir = process.env.HUSKY_DIST_DIR ?? '.next';
/** The profile the server under test was built with; specs adapt their expectations. */
const profile = process.env.HUSKY_LAUNCH_PROFILE ?? 'launch';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run start -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      ...process.env,
      PORT: String(port),
      HUSKY_DIST_DIR: distDir,
      HUSKY_LAUNCH_PROFILE: profile,
      // The in-memory test adapter: e2e never touches a real database or sends email.
      HUSKY_ENQUIRY_STORE: 'memory',
    },
  },
});
