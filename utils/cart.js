async function addItems(page, count = 3) {
  const buttons = page.locator('button.btn_inventory');

  for (let i = 0; i < count; i++) {
    await buttons.nth(i).click();
  }
}

module.exports = { addItems };