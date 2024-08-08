import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import fs from 'fs';
import { getLocationsFromFile } from '../support/atk_data.js';

const title = '(ATK-PW-1600) Automatic detection of accessibility problems. @accessibility @ATK-PW-1600';
const locations = await getLocationsFromFile('atk_accessibility-locations.csv');

for (let [location, rules] of locations) {
  test(`${title}: ${location}`, async ({ page }, testInfo) => {
    await page.goto(location);

    let axeBuilder = new AxeBuilder({ page });
    if (rules) {
      axeBuilder.disableRules(rules.split(','));
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
