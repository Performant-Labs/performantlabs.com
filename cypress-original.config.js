// This file was restored based on a similar file: packages/cypress-tasks/atk.config.js
// Original commit: 33427ada2a55405d356c6e4139d2a01a9bc80679
/*
* Automated Testing Kit configuration.
*/
module.exports = {
  operatingMode: "native",
  drushCmd: "drush",
  registerUrl: "user/register",
  logInUrl: "user/login",
  logOutUrl: "user/logout",
  resetPasswordUrl: "user/password",
  authDir: "cypress/support",
  dataDir: "cypress/data",
  supportDir: "cypress/support",
  testDir: "cypress/e2e/performantlabs.com",
  pantheon: {
    isTarget: true,
    site: "performant-labs",
    environment: "dev"
  }
}
