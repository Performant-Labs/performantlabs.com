const { defineConfig } = require("cypress");
const registerDataSession = require('cypress-data-session/src/plugin')

module.exports = defineConfig({
  // Used by Cypress.io
  projectId: 'projectID',
  pageLoadTimeout: 30000,
  requestTimeout : 5000,
  responseTimeout : 5000,
  execTimeout: 20000,
  defaultCommandTimeout: 5000,
  numTestsKeptInMemory: 0,
  screenshotOnRunFailure: false,
  video: false,
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
    drupalDrushCmdLine: "./vendor/bin/drush %command"
  },
  e2e: {
    baseUrl: 'https://www.performantlabs.com',
    isPantheon: true,
    pantheonSite: 'performant-labs',
    pantheonEnvironment: 'live',
    pantheonTerminus: 'terminus',
    useRegions: false,
    setupNodeEvents(on, config) {
      // register the "cypress-log-to-term" plugin
      // https://github.com/bahmutov/cypress-log-to-term
      // IMPORTANT: pass the "on" callback argument

      require('cypress-log-to-term')(on)
      registerDataSession(on, config)
      return config
    },
  },
});
