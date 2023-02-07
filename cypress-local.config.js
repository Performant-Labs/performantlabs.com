const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Used by Cypress.io
  projectId: 'projectID',
  pageLoadTimeout: 5000,
  requestTimeout : 5000,
  responseTimeout : 5000,
  defaultCommandTimeout: 5000,
  numTestsKeptInMemory: 0,
  screenshotOnRunFailure: false,
  video: false,
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
    baseUrl: 'http://performantlabs:8888',
    useRegions: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
