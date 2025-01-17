import { expect, test } from '../support/atk_fixture.js';
import { getURLList } from '../support/atk_utilities.js';

const title = '(ATK-PW-1500) {url} @visual @ATK-PW-1500';
/**
 * Test all pages of the website by comparing them with the
 * target screenshots.
 *
 * How to use the first time:
 *  - update file tests/data/atk_visual.yml (specify literal locations,
 *  or reference to sitemap for example @sitemap.xml);
 *  - run the test first time;
 *  - commit generated screenshots from the folder atk_visual.spec.js-snapshots
 *  to the repo.
 */
const URLs = await getURLList('atk_visual.yml');

for (const [url, props] of URLs) {
  test(title.replace('{url}', url), async ({ page }) => {
    await page.goto(url);
    await expect(page).toHaveScreenshot(
      url.replace(/^\//, '').split('/'),
      props.options
    );
  })
}
