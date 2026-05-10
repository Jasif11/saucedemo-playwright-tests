// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false, // For sequential execution
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1, // Ensures sequential execution
  reporter: [
    ['line'],
    ['allure-playwright'] // Add allure report
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});