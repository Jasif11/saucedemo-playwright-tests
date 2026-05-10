const { test, expect } = require('@playwright/test');
const { login } = require('../utils/login');

test('Q3 - performance glitch user checkout', async ({ page }) => {
  // 1. Login
  await login(page, 'performance_glitch_user', 'secret_sauce');
  await page.waitForTimeout(500);
  console.log('1. Logged in as performance_glitch_user');

  // 2. Reset App State
  await page.click('#react-burger-menu-btn');
  await page.waitForTimeout(500);
  await page.click('#reset_sidebar_link');
  await page.waitForTimeout(500);
  await page.click('#react-burger-cross-btn');
  await page.waitForTimeout(500);
  console.log('2. App state reset (first time)');

  // 3. Filter Z to A – visibly
  // (a) View first product name before sorting
  const beforeSortName = await page.locator('.inventory_item_name').first().textContent();
  console.log(`   Before sorting (A to Z): first product = "${beforeSortName}"`);

  // (b) Click dropdown and select option (like a human)
  await page.click('.product_sort_container');
  await page.waitForTimeout(300);
  await page.selectOption('.product_sort_container', 'za'); // za = Z to A
  await page.waitForTimeout(1000); // UI re-orders take time
  console.log('3. Sorted Z to A - UI should now show reverse order');
  
  // (c) View first product name after sorting
  const afterSortName = await page.locator('.inventory_item_name').first().textContent();

  console.log(`   After sorting (Z to A): first product = "${afterSortName}"`);
  if (beforeSortName !== afterSortName) {
    console.log('   ✅ Sorting visibly changed the product order');
  }

  // 4. First product (in Z to A which means first starts with Z) added to cart
  const firstProductName = afterSortName;
  await page.locator('button.btn_inventory').first().click();
  await page.waitForTimeout(500);
  console.log(`4. Added first product to cart: ${firstProductName}`);

  // 5. Go to cart page
  await page.click('.shopping_cart_link');
  await page.waitForTimeout(500);
  await expect(page.locator('.inventory_item_name')).toHaveText(firstProductName);
  console.log('5. Cart: product name verified');

  await page.click('#checkout');
  await page.waitForTimeout(500);

  await page.fill('#first-name', 'Test');
  await page.fill('#last-name', 'User');
  await page.fill('#postal-code', '4000');
  await page.waitForTimeout(500);
  await page.click('#continue');
  await page.waitForTimeout(500);
  console.log('6. Reached final checkout (overview) page');

  // 7. Verify product name and total price on final checkout page
  await expect(page.locator('.inventory_item_name')).toHaveText(firstProductName);
  console.log('   Product name verified in overview');

  // Total price calculation
  const itemPriceText = await page.locator('.inventory_item_price').textContent();
  const itemPrice = parseFloat(itemPriceText.replace('$', ''));
  const taxText = await page.locator('.summary_tax_label').textContent();
  const taxValue = parseFloat(taxText.replace('Tax: $', ''));
  const calculatedTotal = itemPrice + taxValue;
  const displayedTotalText = await page.locator('.summary_total_label').textContent();
  const displayedTotal = parseFloat(displayedTotalText.replace('Total: $', ''));

  expect(displayedTotal).toBeCloseTo(calculatedTotal, 2);
  console.log(`7. Total price verified: ${displayedTotalText} (calculated: ${calculatedTotal})`);

  await page.waitForTimeout(500);

  // 8. Finish purchase and verify success message
  await page.click('#finish');
  await page.waitForTimeout(500);
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  console.log('8. Order completed and success message verified');

  // 9. Reset App State
  await page.click('#react-burger-menu-btn');
  await page.waitForTimeout(500);
  await page.click('#reset_sidebar_link');
  await page.waitForTimeout(500);
  await page.click('#react-burger-cross-btn');
  await page.waitForTimeout(500);
  console.log('9. App state reset again');

  // 10. Logout
  await page.click('#react-burger-menu-btn');
  await page.waitForTimeout(500);
  await page.click('#logout_sidebar_link');
  await page.waitForTimeout(500);
  console.log('10. Logged out');

  console.log('Q3 completed - sorting was visibly shown!');
});