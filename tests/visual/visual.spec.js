const { test, expect } = require('@playwright/test');

test('Visually compare screenshots. @visual', async ({ page }) => {
  // Update list of locations you want to check.
  const locations = [
    '/',
    'services',
    'how-we-do-it',
    'contact-us'
  ];

  for (let location of locations) {
    await page.goto(location);
    await expect(page).toHaveScreenshot({ maxDiffPixels: 10 });
  }

});
