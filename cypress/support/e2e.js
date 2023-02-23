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
import './commands'
import '@cypress/fiddle'
import '@cypress/grep'

// Use the lodash library to provide various utility functions for arrays,
// collections, strings, deep cloning and more (see https://lodash.com).
const _ = require('lodash')

// Provide debug channel capability.
const debug = require('debug')

// By default, assume the site is not localized; a tag changes this.
const isLocalized = false

// Region and language prefixes can take one of several forms.
// Some sites will use both a region and a language; others will use just the
// language.
// const localizedPrefix = 'us/en/'
const localizedPrefix = '/'

// Create pointer to function.
const _it = it

//
// Capture uncaught exceptions so test doesn't fail.
//
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

/*
 * Generate matrix of personas, regions and languages.
 */
function generateSets(personas, regions, languages) {
  let localizationSet = []

  // Regions being used.
  if (cy.config('useRegions')) {
    for (const persona of personas) {
      for (const region of regions) {
        for (const language of languages) {
          localizationSet.push(`${persona}:${region}:${language}`)
        }
      }
    }
  }
  // Regions not being used.
  else {
    for (const persona of personas) {
      for (const language of languages) {
        localizationSet.push(`${persona}:${language}`)
      }
    }
  }

  return localizationSet
}

/*
 * Log into Drupal with the proper account ("persona") or
 * ensure anonymous session.
 */
cy.setUpPersona = () => {
  const persona = cy.config('persona')

  switch(persona) {
    // Anonymous.
    case 'an':
      cy.clearCookies()
      cy.visit('', {failOnStatusCode: false})
      cy.get('body').should('not.have.class', 'is-logged-in-user').should('have.attr', 'data-user', '0')
      break

    // Authenticated.
    case 'au':
      cy.clearCookies()
      cy.logInAs(Cypress.env('account').authenticated)
      break

    // Administrator
    case 'ad':
      cy.clearCookies()
      cy.logInAs(Cypress.env('account').admin)
      break
  }
}


