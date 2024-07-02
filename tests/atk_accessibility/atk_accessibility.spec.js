const { test, expect } = require('@playwright/test');

const atk_commands = require('../support/atk_commands');
const AxeBuilder = require('@axe-core/playwright');

let title = '(ATK-PW-1600) Automatic detection of accessibility problems. @accessibility @ATK-PW-1600';
test.describe(title, async () => {
  const locations = await atk_commands.getLocationsFromFile({ file: __filename });

  for (let location of locations) {
    test(`${title}: ${location}`, async ({ page }, testInfo) => {
      await page.goto(location);

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json'
      });

      expect(accessibilityScanResults.violations.length, 'number of problems').toEqual(0);
    });
  }
});
