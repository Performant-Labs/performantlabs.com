// @ts-check
import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

import rpconfig from './reportportal.config.js'

/**
 * Probe a remote results service before wiring up a reporter that talks to it.
 *
 * Returns false for anything that is not a usable service right now: DNS
 * failure, connection refused, TLS error, timeout, or a 5xx. It never throws
 * and never rejects — an unreachable results service must not be able to fail
 * a test run. A 4xx counts as reachable: something is listening, and auth is
 * the uploader's problem, not this probe's.
 *
 * @param {string} rawUrl  Any URL on the service.
 * @param {number} timeout Milliseconds before giving up. Short on purpose —
 *                         this runs before every non-sharded suite.
 * @return {Promise<boolean>}
 */
async function isReachable(rawUrl, timeout = 5000) {
  let url
  try {
    url = new URL(rawUrl)
  } catch {
    return false // not a URL — treat as "not configured"
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'follow' })
    return res.status < 500
  } catch {
    return false // DNS / refused / TLS / timeout
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Targets whose reporter talks to a REMOTE service DURING the run. These must
 * be probed first, because the agent starts POSTing as soon as tests begin.
 */
const remoteReporters = {
  reportportal: {
    probeUrl: () => {
      const u = new URL(rpconfig.endpoint)
      return `${u.protocol}//${u.host}/health`
    },
    reporter: ['@reportportal/agent-js-playwright', rpconfig],
  },
}

/**
 * Targets whose reporter only writes files locally. Always safe to enable:
 * the network hop happens in a later CI step (allure_send_results.sh for
 * Allure, `npx @testiny/cli` for Testiny), and each of those does its own
 * reachability check. Probing here would gate the wrong thing — the local
 * artefact is worth producing even when its upload target is gone.
 */
const localReporters = {
  allure: ['allure-playwright'],
  testiny: ['json', { outputFile: 'playwright-report.json' }],
}

/**
 * True when this module is being imported by a Playwright WORKER rather than
 * the main runner. Set in node_modules/playwright/lib/worker/workerProcessEntry.js.
 *
 * Playwright re-imports this config in every worker process, but reporters are
 * only ever instantiated in the main process. Probing from a worker therefore
 * achieves nothing except one redundant DNS lookup and one duplicate log line
 * per worker, per suite — which is exactly what the first version of this did.
 */
const isWorker = process.env.TEST_WORKER_INDEX !== undefined

// Base reporters: always on, never network-dependent.
const reporter = [['list']]
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

  // ATK_REPORT_TARGET is a wish list, not a guarantee. Remote targets are
  // probed and skipped with a reason when down. ZERO reachable targets is a
  // VALID, non-failing outcome — results still land in the list, HTML and
  // CTRF reporters, plus any local artefact reporters requested.
  const requested = (process.env.ATK_REPORT_TARGET || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  for (const target of requested) {
    if (target in remoteReporters) {
      // Main process only: see isWorker above. Nothing to decide in a worker,
      // because the worker never builds a reporter from this array.
      if (isWorker) continue
      const { probeUrl, reporter: rep } = remoteReporters[target]
      const url = probeUrl()
      if (await isReachable(url)) {
        reporter.push(rep)
        console.log(`[reporting] ${target}: reachable — enabled`)
      } else {
        console.warn(`[reporting] ${target}: SKIPPED — ${url} unreachable`)
      }
    } else if (target in localReporters) {
      reporter.push(localReporters[target])
      if (!isWorker) {
        console.log(`[reporting] ${target}: enabled (writes locally; upload is a later step)`)
      }
    } else if (!isWorker) {
      console.warn(`[reporting] unknown target "${target}" — ignored`)
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
    // Allow overriding the base URL via the BASE_URL environment variable
    // so tests can be targeted at production (https://performantlabs.com).
    baseURL: process.env.BASE_URL || 'https://dev-performant-labs.pantheonsite.io/',

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
