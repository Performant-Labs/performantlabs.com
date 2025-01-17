import { test as base, expect } from '@playwright/test';
import { PlaywrightBlocker } from '@ghostery/adblocker-playwright';

const test = base.extend({
  page: async ({ page }, use) => {
    const blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch);
    await blocker.enableBlockingInPage(page);

    await use(page);
  }
});

export { test, expect };
