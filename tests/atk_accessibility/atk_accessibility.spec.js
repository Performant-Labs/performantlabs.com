/**
 * atk_accessibility.spec.js
 *
 * Accessibility tests.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import fs from 'fs';
import { expect, test } from '../support/atk_fixture.js';
import { getURLList } from '../support/atk_utilities.js';

// Import configuration.
import playwrightConfig from '../../playwright.config';
import atkConfig from '../../playwright.atk.config';
const baseUrl = playwrightConfig.use.baseURL;

const title = '(ATK-PW-1600) {url} @accessibility @axe @ATK-PW-1600';
const URLs = await getURLList('atk_accessibility.yml');

test.describe('Accessibility', () => {
  for (const [url, props] of URLs) {
    test(title.replace('{url}', url), async ({ page }, testInfo) => {
      await page.goto(baseUrl + url);

      let axeBuilder = new AxeBuilder({ page });
      if (props.disable) {
        axeBuilder.disableRules(props.disable);
      }
      const accessibilityScanResults = await axeBuilder.analyze();

      const htmlReport = createHtmlReport({
        results: accessibilityScanResults,
        options: {
          doNotCreateReportFile: true
        }
      });

      let htmlReportFile = `./axereport-${testInfo.parallelIndex}.html`;
      fs.writeFileSync(htmlReportFile, htmlReport);

      await testInfo.attach('accessibility-scan-results', {
        path: htmlReportFile
      });

      expect(accessibilityScanResults.violations.length, 'number of problems').toEqual(0);
    });
  }
});
