const { test, expect } = require('@playwright/test');
const { login } = require('../utils/login');

test('Q2 - standard user checkout flow', async ({ page }) => {
  // Waiting before login (for UI load)
  await page.waitForTimeout(500);

  // 1. Login
  await login(page, 'standard_user', 'secret_sauce');
  await page.waitForTimeout(500);

  // 2. Reset App State
  await page.click('#react-burger-menu-btn');
  await page.waitForTimeout(300);
  await page.click('#reset_sidebar_link');
  await page.waitForTimeout(300);
  await page.click('#react-burger-cross-btn');
  await page.waitForTimeout(500);

  // 3. Add three items to the cart (slowly)
  const buttons = page.locator('button.btn_inventory');
  for (let i = 0; i < 3; i++) {
    await buttons.nth(i).click();
    await page.waitForTimeout(1000);
  }

  // 4. Go to cart page
  await page.click('.shopping_cart_link');
  await page.waitForTimeout(500);
  await page.click('#checkout');
  await page.waitForTimeout(500);

  // Checkout info
  await page.fill('#first-name', 'Test');
  await page.fill('#last-name', 'User');
  await page.fill('#postal-code', '4000');
  await page.waitForTimeout(300);
  await page.click('#continue');
  await page.waitForTimeout(500);

  // 5. Final checkout page - verify products and total price
  const productNames = await page.locator('.inventory_item_name').allTextContents();
  await expect(page.locator('.inventory_item_name')).toHaveCount(3);
  console.log('✅ Products in overview page:', productNames);

  // Item prices and tax calculation
  const itemPrices = await page.locator('.inventory_item_price').allTextContents();
  let itemsTotal = 0;
  for (const priceText of itemPrices) {
    itemsTotal += parseFloat(priceText.replace('$', ''));
  }
  const taxText = await page.locator('.summary_tax_label').textContent();
  const taxValue = parseFloat(taxText.replace('Tax: $', ''));
  const calculatedTotal = itemsTotal + taxValue;
  const displayedTotalText = await page.locator('.summary_total_label').textContent();
  const displayedTotal = parseFloat(displayedTotalText.replace('Total: $', ''));
  expect(displayedTotal).toBeCloseTo(calculatedTotal, 2);
  console.log(`✅ Total price verified: ${displayedTotalText}`);
  await page.waitForTimeout(500);

  // 6. Finish purchase and success message
  await page.click('#finish');
  await page.waitForTimeout(500);
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  console.log('✅ Order success message verified');

  // 7. Reset App State
  await page.click('#react-burger-menu-btn');
  await page.waitForTimeout(300);
  await page.click('#reset_sidebar_link');
  await page.waitForTimeout(300);
  await page.click('#react-burger-cross-btn');
  await page.waitForTimeout(500);

  // 8. Logout
  await page.click('#react-burger-menu-btn');
  await page.waitForTimeout(300);
  await page.click('#logout_sidebar_link');

  // Waiting after logout (for UI completion)
  await page.waitForTimeout(800);

  console.log('🎉 All steps completed successfully!');
});