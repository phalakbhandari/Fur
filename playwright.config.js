import { defineConfig, devices } from '@playwright/test';

// Lets CI or a sandbox point at a Chromium already on the machine instead of
// downloading a second copy.
const LAUNCH = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], launchOptions: LAUNCH } },
    { name: 'mobile', use: { ...devices['Pixel 7'], launchOptions: LAUNCH } },
  ],

  // Tests run against the production build, not the dev server — that is what
  // real visitors get, and it catches anything that only breaks after bundling.
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
