# SauceDemo Playwright Automation Tests

This repository contains automated tests for the [SauceDemo](https://www.saucedemo.com/) website using **Playwright** with **Allure reporting**.

---

## Test Scenarios

### Q1 | Login Error Verification (20 Marks)
- Log in with `locked_out_user` and verify the error message.

### Q2 | Standard User Checkout (50 Marks)
- Log in with `standard_user`.
- Reset App State.
- Add any **three** items to the cart.
- Complete the checkout process and verify product names and the total price.
- Verify the order success message.
- Reset App State again and log out.

### Q3 | Performance User Checkout (30 Marks)
- Log in with `performance_glitch_user`.
- Reset App State.
- Sort products by Name (Z to A).
- Add the first product to the cart.
- Complete the checkout process and verify the product name(s) and total price.
- Verify the order success message.
- Reset App State again and log out.

---

## How to Run the Tests

### 1. Install Dependencies
```bash
npm install
npx playwright install