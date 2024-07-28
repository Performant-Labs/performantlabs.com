import getPort from 'get-port';
import { playAudit } from 'playwright-lighthouse';
import { chromium, test } from '@playwright/test';
import { getLocationsFromFile } from '../support/atk_data.js';

const lighthouseTest = test.extend({
  port: [
    async ({}, use) => {

      // const getPort = await import('get-port');

      const port = await getPort();
      await use(port);
    },
    { scope: 'worker' },
  ],

  browser: [
    async ({ port }, use) => {
      const browser = await chromium.launch({
        args: [`--remote-debugging-port=${port}`]
      });
      await use(browser);
    },
    { scope: 'worker' },
  ],
});

let title = '(ATK-PW-1700) Audit of the pages with Google Lighthouse @atk-pw-1700 @lighthouse @audit';
const locations = await getLocationsFromFile('atk_audit-locations.csv');

lighthouseTest.afterEach(async ({}, testInfo) => {
  await testInfo.attach('lighthouse-report', {
    path: `lighthouse-report-${testInfo.parallelIndex}.html`
  });
});

for (let [location,] of locations) {
  lighthouseTest(`${title}: ${location}`, async ({ page, port }, testInfo) => {
    await page.goto(location);

    await playAudit({
      page,
      port,
      thresholds: {
        performance: 70,
        accessibility: 90,
        seo: 70,
        pwa: 70,
        'best-practices': 70
      },
      reports: {
        formats: {
          html: true
        },
        name: `lighthouse-report-${testInfo.parallelIndex}`,
        directory: '.'
      }
    });
  });
}
