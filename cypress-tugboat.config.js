const { defineConfig } = require("cypress");
const {unlinkSync} = require("fs");
const fs = require("fs");

module.exports = defineConfig({
  // Used by Cypress.io
  projectId: 'projectID',
  pageLoadTimeout: 5000,
  requestTimeout : 5000,
  responseTimeout : 5000,
  defaultCommandTimeout: 5000,
  numTestsKeptInMemory: 0,
  screenshotOnRunFailure: true,
  video: true,
  videoCompression: 16,
  chromeWebSecurity: false,
  retries: {
    // Configure retry attempts for 'cypress run'.
    // Default is 0.
    runMode: 0,
    // Configure retry attempts for 'cypress open'.
    // Default is 0
    openMode: 0
  },
  // Speed up tests by blocking unneeded calls.
  blockHosts: [
    "www.google-analytics.com",
    "stats.g.doubleclick.net",
    "www.google.com",
    "connect.facebook.net",
    "www.facebook.com",
    "px.ads.linkedin.com",
    "www.linkedin.com",
    "www.googletagmanager.com",
  ],
  env: {
    grepFilterSpecs: true,
  },
  e2e: {
    baseUrl: 'https://www.performantlabs.com',
    useRegions: false,
    specPattern: 'cypress/e2e/*/.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // register the "cypress-log-to-term" plugin
      // https://github.com/bahmutov/cypress-log-to-term
      // IMPORTANT: pass the "on" callback argument
      require('cypress-log-to-term')(on)

      // Delete videos if test passes.
      on('after:spec', (spec, results) => {
        if (config.video) {
          if (results.stats.failures || results.stats.skipped) {
            console.log('Keeping video of failure.')
          }
          else {
            console.log('Deleting video', results.video)
            unlinkSync(results.video)
          }
        }
      })

      // Increase the browser window size when running headlessly
      // to produce higher resolution images and videos.
      // https://on.cypress.io/browser-launch-api
      // https://www.cypress.io/blog/2021/03/01/generate-high-resolution-videos-and-screenshots/
      on('before:browser:launch', (browser = {}, launchOptions) => {
        console.log(
          '**Launching browser: %s Is headless? %s',
          browser.name,
          browser.isHeadless,
        )

        // Target browser width and height.
        const width = 1920
        const height = 1080

        console.log('**Setting the browser window size to %d x %d**', width, height)

        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push(`--window-size=${width},${height}`)

          // Force screen to be non-retina and just use our given resolution.
          launchOptions.args.push('--force-device-scale-factor=1')
        }

        if (browser.name === 'electron' && browser.isHeadless) {
          // Might not work on CI for some reason
          launchOptions.preferences.width = width
          launchOptions.preferences.height = height
        }

        if (browser.name === 'firefox' && browser.isHeadless) {
          launchOptions.args.push(`--width=${width}`)
          launchOptions.args.push(`--height=${height}`)
        }

        // IMPORTANT: return the updated browser launch options
        return launchOptions
      })
    },
  },
});
