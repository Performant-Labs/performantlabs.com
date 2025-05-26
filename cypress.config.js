const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Used by Cypress.io
  projectId: 'fczbqz',
  pageLoadTimeout: 30000,
  requestTimeout : 5000,
  responseTimeout : 5000,
  execTimeout: 20000,
  defaultCommandTimeout: 5000,
  numTestsKeptInMemory: 0,
  screenshotOnRunFailure: false,
  video: true,
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
  e2e: {
    baseUrl: 'https://performant-labs.ddev.site:8493/',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Register the "cypress-log-to-term" plugin.
      // https://github.com/bahmutov/cypress-log-to-term
      // IMPORTANT: pass the "on" callback argument
      require('cypress-log-to-term')(on)

      // Register the "cypress/grep" plugin.
      require('@cypress/grep/src/plugin')(config)
      return config
    },
  },
});
