import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import fs from 'fs';
import { getURLList } from '../support/atk_utilities.js';

const title = '(ATK-PW-1600) {url} Automatic detection of accessibility problems. @accessibility @axe @deque @ATK-PW-1600';
const URLs = await getURLList('atk_accessibility.yml');

for (const [url, props] of URLs) {
  test(title.replace('{url}', url), async ({ page }, testInfo) => {
    await page.goto(url);

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
