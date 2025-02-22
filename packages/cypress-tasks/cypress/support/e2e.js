/// <reference types="Cypress" />
// ***********************************************************
// This support/e2e.js file is processed and
// loaded automatically before the test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './atk_commands'
import '@cypress/grep'

//
// Capture uncaught exceptions so test doesn't fail.
//
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})
