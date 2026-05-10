const { test, expect } = require('@playwright/test');

test('locked out user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.waitForTimeout(500); // Waiting for the page to load

  await page.fill('#user-name', 'locked_out_user');
  await page.fill('#password', 'secret_sauce');
  await page.waitForTimeout(300); // Waiting for the input to be filled

  await page.click('#login-button');
  await page.waitForTimeout(500); // Waiting for the error message to appear

  await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  await page.waitForTimeout(800); // Waiting for the error message to be visible

  console.log('✅ Locked out user error message verified');
});