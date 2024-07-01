const { test, expect } = require('@playwright/test');

import * as atk_commands from '../support/atk_commands';

/**
 * Test all pages of the website by comparing them with the
 * target screenshots.
 *
 * How to use the first time:
 *  - update file atk_visual.spec.js-locations (specify literal locations,
 *  or reference to sitemap for example @sitemap.xml);
 *  - run the test first time;
 *  - commit generated screenshots from the folder atk_visual.spec.js-snapshots
 *  to the repo.
 */
test('(ATK-1500) Visually compare screenshots. @visual @ATK-1500', async ({ page }, testInfo) => {
  const locations = await atk_commands.getLocationsFromFile(testInfo);

  for (let location of locations) {
    await page.goto(location);
    await expect(page).toHaveScreenshot(
      location.split('/'),
      { maxDiffPixels: 10 }
    );
  }

});
