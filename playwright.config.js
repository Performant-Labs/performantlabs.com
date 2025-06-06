// @ts-check
import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

import rpconfig from './reportportal.config.js'

/**
 * Check if ReportPortal is available
 * @return {Promise<boolean>} true if it is, false if it's not
 */
async function checkReportPortal() {
  return new Promise((resolve) => {
    const rpURL = new URL(rpconfig.endpoint)
    fetch(`${rpURL.protocol}//${rpURL.host}/health`)
      .then(() => resolve(true))
      .catch(() => resolve(false))
  })
}

// ReportPortal & Allure config
const reporterMap = {
  allure: ['allure-playwright'],
  reportportal: ['@reportportal/agent-js-playwright', rpconfig],
  testiny: ['json', { outputFile: 'playwright-report.json' }],
}

// Define reporters depending on sharding and Portal's availability
const reporter = [['list']]
// const reporter = [];
const isShard = process.argv.find((arg) => arg.startsWith('--shard'))
if (isShard) {
  reporter.push(['blob'])
} else {
  reporter.push(['html'])
  reporter.push(['playwright-ctrf-json-reporter', {
    buildName: process.env.BUILD_NAME || 'BUILD_NAME is not set',
    buildNumber: process.env.BUILD_NUMBER || 'BUILD_NUMBER is not set',
    buildUrl: process.env.BUILD_URL || 'BUILD_URL is not set',
  }])
  const alltarget = process.env.ATK_REPORT_TARGET
  if (alltarget) {
    for (const target of alltarget.split(',')) {
      if (target in reporterMap) {
        reporter.push(reporterMap[target])
      } else {
        console.warn(`Bad report target: ${target}`)
      }
    }
  }
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? parseInt(process.env.CI_THREADS) || 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter,
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}/{projectName}.png',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://dev-performant-labs.pantheonsite.io/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Record video for all tests, but remove all videos from successful test runs */
    video: 'retain-on-failure',
  },

  timeout: 60000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    //
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    // {
    //   name: 'Tablet Safari',
    //   use: { ...devices['iPad Pro 11 landscape'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
