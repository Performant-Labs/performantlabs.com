import atkPlaywrightConfig from '../../playwright.atk.config';

const { test, expect } = require('@playwright/test');

const atk_commands = require('../support/atk_commands');
const AxeBuilder = require('@axe-core/playwright');
const { createHtmlReport } = require('axe-html-reporter');
const fs = require('fs');

let title = '(ATK-PW-1600) Automatic detection of accessibility problems. @accessibility @ATK-PW-1600';
test.describe(title, async () => {
  const locations = await atk_commands.getLocationsFromFile('atk_accessibility-locations');

  for (let location of locations) {
    test(`${title}: ${location}`, async ({ page }, testInfo) => {
      await page.goto(location);

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      const htmlReport = createHtmlReport({
        results: accessibilityScanResults,
        options: {
          doNotCreateReportFile: true
        }
      });

      let htmlReportFile = `./axereport.html`;
      fs.writeFileSync(htmlReportFile, htmlReport);

      await testInfo.attach('accessibility-scan-results', {
        path: htmlReportFile
      });

      expect(accessibilityScanResults.violations.length, 'number of problems').toEqual(0);
    });
  }
});
