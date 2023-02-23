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
  chromeWebSecurity: false,
  retries: {
    // Configure retry attempts for 'cypress run'.
    // Default is 0.
    runMode: 3,
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
    baseUrl: 'http://127.0.0.1:8080',
    useRegions: false,
    setupNodeEvents(on, config) {
      // register the "cypress-log-to-term" plugin
      // https://github.com/bahmutov/cypress-log-to-term
      // IMPORTANT: pass the "on" callback argument
      require('cypress-log-to-term')(on)
      on('after:spec', (spec, results) => {
        if (config.video) {
          if (results.stats.failures || results.stats.skipped) {
            console.log('Keeping video of failure.')
          }
          else {
            const fs = require("fs");
            if (fs.existsSync(results.video)) {
              //console.log(`**Deleting video ${results.video}**`)
              //unlinkSync(results.video)
            }
          }
        }
      })
    },
  },
});
