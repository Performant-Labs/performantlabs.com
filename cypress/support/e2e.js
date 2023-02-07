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

// Override the default Cypress it() handler.
it = function itLocalized(name, options, callback) {
  // If options actually contains a function
  // i.e. {languages: ['en'],  regions: ['us'], tags: ['smoke']}
  // rearrange the parameters.
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  // If there are only two parameters, call the existing test
  // with no modifications.
  if (!callback) {
    return _it(name, options)
  }

  options = options || {}
  options.tags = options.tags || []

  let tags = options.tags
  if (typeof tags === 'string') {
    tags = [tags]
  }

  // Presence of the localized tag in the tags array indicates this
  // is a localized test.
  // Otherwise, continue with no modifications.
  if (!tags.includes('localized')) {
    return _it(name, options, callback)
  }

  /*
   * Change these according to the needs of the project.
   * If the project does not use localization, do not include the
   * "localized" tag when calling it() in the tags array.
   */

  // Define default Drupal personas, regions and languages (can be
  // overridden by tags).
  let defaultPersonasArray = ['an']
  let defaultRegionsArray = ['us', 'mx']
  let defaultLanguagesArray = ['en', 'es']

  // Define default persona:region:language sets (can be overridden by tags).
  // If not specified by the test, the test will be run for each
  // combination in the array.
  // let defaultLocalizedSets = ['an:us:en', 'an:mx:es']
  //
  // Sites that don't use regions simply omit it in their sets. Comment out
  // line above and comment line below.
  let defaultLocalizedSets = ['an:en', 'an:es']

  let personas
  let regions
  let languages
  let localizedSets
  let fixtureData

  // Return immediately if "skip" is present; skip is a Cypress property.
  if (options.hasOwnProperty('skip') && options.skip) {
    return
  }

  // For each possible property/tag, set up working arrays according
  // to defaults or what is passed through the function call.
  if (options.hasOwnProperty('localizedSets')) {
    localizedSets = options.localizedSets

  }
  else if (!options.hasOwnProperty('personas') && !options.hasOwnProperty('regions') && !options.hasOwnProperty('languages')) {
    // If all tags are missing, use the defaultLocalizedSets.
    localizedSets = defaultLocalizedSets

  }
  else {
    // Were personas passed?
    if (options.hasOwnProperty('personas')) {
      personas = options.personas
    }
    else {
      personas = defaultPersonasArray
    }

    // Were regions passed?
    if (options.hasOwnProperty('regions')) {
      regions = options.regions
    }
    else {
      regions = defaultRegionsArray
    }

    // Were languages passed?
    if (options.hasOwnProperty('languages')) {
      languages = options.languages
    }
    else {
      languages = defaultLanguagesArray
    }
  }

  if (options.hasOwnProperty('fixtureData')) {
    fixtureData = options.data
  }

  // Use default localized set(s) or generate new sets
  // (personas x regions x languages) or
  // (personas x languages).
  let combinations = localizedSets || generateSets(personas, regions, languages)
  debugger
  for (const aCombination of combinations) {
    let testOptions = _.cloneDeep(options)

    if (cy.config('useRegions')) {
      testOptions.persona = aCombination.substring(0, 2)
      testOptions.region = aCombination.substring(3, 5)
      testOptions.language = aCombination.substring(6)
    }
    else {
      testOptions.persona = aCombination.substring(0, 2)
      testOptions.language = aCombination.substring(3)
    }
    testOptions.originalTags = options.tags

    let t = []
    for (const tag of testOptions.tags) {
      t.push(tag)
      t.push(`${tag}::${aCombination}`)
    }
    testOptions.tags = t

    /*
     * Run the test for this combination. If a fixture is present,
     * run the test for each element in the fixture array.
     */
    // Pass the data to test
    if (fixtureData === undefined || !Array.isArray(fixtureData)) {
      testOptions.data = fixtureData
      debug("Running %s", `[${aCombination}] :: ${name}`)
      _it(`[${aCombination}] :: ${name}`, testOptions, callback)
    }
    else {
      let idx = 0
      for (const datum of data) {
        testOptions.data = datum
        debug("Running %s", `[${aCombination}][${idx}] :: ${name}`)
        _it(`[${aCombination}][${idx}] :: ${name}`, testOptions, callback)
        idx++
      }
    }
  }
}

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


