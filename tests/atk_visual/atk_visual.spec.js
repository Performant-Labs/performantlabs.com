import { expect, test } from '@playwright/test';
import { getLocationsFromFile } from '../support/atk_data.js';

const title = '(ATK-PW-1500) Visually compare screenshots. @visual @ATK-PW-1500';
/**
 * Test all pages of the website by comparing them with the
 * target screenshots.
 *
 * How to use the first time:
 *  - update file tests/data/atk_visual-locations.csv (specify literal locations,
 *  or reference to sitemap for example @sitemap.xml);
 *  - run the test first time;
 *  - commit generated screenshots from the folder atk_visual.spec.js-snapshots
 *  to the repo.
 */
const locations = await getLocationsFromFile('atk_visual-locations.csv');

for (let [location,] of locations) {
  test(`${title}: ${location}`, async ({ page }) => {
    await page.goto(location);
    await expect(page).toHaveScreenshot(
      location.split('/'),
      { maxDiffPixels: 10 }
    );
  })
}
