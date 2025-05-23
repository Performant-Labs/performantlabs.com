/**
 * atk_lighthouse.spec.js
 *
 * Lighthouse tests.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

import * as atkCommands from '../support/atk_commands';
import * as atkUtilities from '../support/atk_utilities';

import getPort from 'get-port';
import { playAudit } from 'playwright-lighthouse';
import { chromium } from '@playwright/test';
import { test as base } from '../support/atk_fixture.js';
import { getURLList } from '../support/atk_utilities.js';

// Import configuration.
import playwrightConfig from '../../playwright.config';
import atkConfig from '../../playwright.atk.config';
const baseUrl = playwrightConfig.use.baseURL;

const test = base.extend({
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

const title = '(ATK-PW-1700) {url} @ATK-PW-1700 @lighthouse @audit @performance @accessibility @seo @best-practices';
const URLList = await getURLList('atk_audit.yml');

test.describe('Google Lighthouse Audit', () => {
  test.afterEach(async ({}, testInfo) => {
    await testInfo.attach('lighthouse-report', {
      path: `lighthouse-report-${testInfo.parallelIndex}.html`
    });
  });

  for (const [url, props] of URLList) {
    test(title.replace('{url}', url), async ({ page, port }, testInfo) => {
      await page.goto(baseUrl + url);

      await playAudit({
        page,
        port,
        thresholds: props.thresholds,
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
});
