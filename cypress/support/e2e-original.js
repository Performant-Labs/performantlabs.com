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

// Import fiddle
import '@cypress/fiddle'

// Use the lodash library to provide various utility functions for arrays,
// collections, strings, deep cloning and more (see https://lodash.com).
const _ = require('lodash')

// Provide debug channel capability.
const debug = require('debug')

// By default, assume the site is not localized; a tag changes this.
const isLocalized = false

const localizedPrefix = 'us/en/'

require('@cypress/grep')()

// Create pointer to function.
const _it = it

// Override the default Cypress it() handler.
it = function itLocalized(name, options, callback) {
  if (typeof options === 'function') {
    // The test has the format it('...', combination of tags).
    callback = options
    options = {}
  }

  if (!callback) {
    // Call the existing test with no modifications.
    return _it(name, options)
  }

  options = options || {}
  options.tags = options.tags || []

  let tags = options.tags
  if (typeof tags === 'string') {
    tags = [tags]
  }

  // Presence of this tag tells us this is a localized test. Otherwise,
  // continue with no modifications.
  if (!tags.includes('localized')) {
    return _it(name, options, callback)
  }

  /*
   * Change these according to the needs of the project.
   * If the project does not use localization, do not include the
   * "localized" tag when calling it().
   */

  // Define default Drupal roles (can be overridden by tags).
  let defaultRolesArray = ['an']

  // Define default Drupal regions (can be overridden by tags).
  let defaultRegionsArray = ['us', 'mx']

  // Define default Drupal languages (can be overridden by tags).
  let defaultLanguagesArray= ['en', 'es']

  // Define default role:region:language sets (can be overridden by tags).
  let defaultLocalizedSets = ['an:us:en', 'an:mx:es']

  let rolesArray
  let regionsArray
  let languagesArray
  let localizedSetsArray
  let fixtureData

  // Return doing nothing if "skip" is present; skip is a Cypress property.
  if (options.hasOwnProperty('skip') && options.skip) {
    return
  }

  // For each possible property/tag, set up working arrays according
  // to defaults or what is passed through the function call.
  if (options.hasOwnProperty('localizedSets')) {
    localizedSetsArray = options.localizedSets

  } else if (!options.hasOwnProperty('roles') && !options.hasOwnProperty('regions') && !options.hasOwnProperty('languages')) {
    // If all tags are missing, use the defaultLocalizedSets.
    localizedSetsArray = defaultLocalizedSets

  } else {
    // Were roles passed?
    if (options.hasOwnProperty('roles')) {
      rolesArray = options.roles
    } else {
      rolesArray = defaultRolesArray
    }

    // Were regions passed?
    if (options.hasOwnProperty('regions')) {
      regionsArray = options.regions
    } else {
      regionsArray = defaultRegionsArray
    }

    // Were languages passed?
    if (options.hasOwnProperty('languages')) {
      languagesArray = options.languages
    } else {
      languagesArray = defaultLanguagesArray
    }
  }

  // TODO: Put this back in.
  // //
  // if (options.hasOwnProperty('fixtureData')) {
  //   fixtureData = options.data
  // }
  //
  // // Use default localized set(s) or generate new sets
  // // (matrix of roles x regions x languages).
  // let combinations = localizedSetsArray || generate_combinations(rolesArray, regionsArray, languagesArray)
  //
  // for (const aCombination of combinations) {
  //   let testOptions = _.cloneDeep(options)
  //
  //   testOptions.role = aCombination.substring(0, 1)
  //   testOptions.region = aCombination.substring(3, 4)
  //   testOptions.language = aCombination.substring(6, 7)
  //   testOptions.originalTags = options.tags
  //
  //   let t = []
  //   for (const tag of testOptions.tags) {
  //     t.push(tag)
  //     t.push(`${tag}::${aCombination}`)
  //   }
  //   testOptions.tags = t
  //
  //   /*
  //    * Run the test for this combination. If a fixture is present,
  //    * run the test for each element in the fixture array.
  //    */
  //   // Pass the data to test
  //   if (data === undefined || !Array.isArray(data)) {
  //     testOptions.data = data
  //     debug("Running %s", `[${aCombination}] :: ${name}`)
  //     _it(`[${aCombination}] :: ${name}`, testOptions, callback)
  //
  //   } else {
  //     let idx = 0
  //     for (const datum of data) {
  //       testOptions.data = datum
  //       debug("Running %s", `[${aCombination}][${idx}] :: ${name}`)
  //       _it(`[${aCombination}][${idx}] :: ${name}`, testOptions, callback)
  //       idx++
  //     }
  //   }
  // }
}

Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test.
  return false
})

/*
 * Create matrix of roles, regions and languages.
 */
function generateSets(rolesArray, regionsArray, languagesArray) {
  let localizationMatrix = []

  for (const role of rolesArray) {
    for (const region of regionsArray) {
      for (const language of languagesArray) {
        localizationMatrix.push(`${role}:${region}:${language}`)
      }
    }
  }

  return localizationMatrix
}

/*
 * Log into Drupal with the proper account or ensure anonymous session.
 */
cy.localizationSetup = () => {
  const role = cy.config('role')

  switch(role) {
    case 'an':
      cy.clearCookies()
      cy.visit('', {failOnStatusCode: false})
      cy.get('body').should('not.have.class', 'is-logged-in-user').should('have.attr', 'data-user', '0')
      break

    case 'au':
      cy.clearCookies()
      cy.login(Cypress.env('account').authenticated)
      break

    case 'ad':
      cy.clearCookies()
      cy.login(Cypress.env('account').admin)
      break
  }
}

/**
 * cy.t()
 *
 * This is a minimal duplication of the Drupal.t() function available to translate
 * strings in Javascript, from the file core/misc/drupal.js
 *
 * Does not have support for formatPlural; plain translations only.
 *
 * On the flip side, all string translations are available from the backend
 * and for all available languages, which is not the case with Drupal.t().
 *
 * It does not need the Drupal object to be copied.
 *
 * @param str
 * @param args
 * @param options
 * @returns {*}
 */
cy.t = (str, args, options) => {
  const language = cy.config('language')

  if (language == 'en') {
    return str
  }

  options = options || {};
  options.context = options.context || '';

  const translations = Cypress.config('translations')
  if (translations == undefined || translations[language] == undefined) {
    return str
  }

  const translation = translations[language].translation
  if (translation.strings && translation.strings[options.context] && translation.strings[options.context][str]) {
    str = translation.strings[options.context][str]
  }

  return str;
}

/**
 * Removes blockHost entries from appearing in test runner logs.
 */
Cypress.Server.defaults({
  ignore: xhr => {
    return Cypress.config().blockHosts.some(blockedHost =>  // get blockHosts from cypress.config.json using Cypress.config()
      Cypress.minimatch(new URL(xhr.url).host, blockedHost)  // if current url matches any blockedHost item, return true
    )
  }
})
