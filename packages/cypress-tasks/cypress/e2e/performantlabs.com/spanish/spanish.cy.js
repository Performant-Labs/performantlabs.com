/// <reference types="Cypress" />
/// <reference types="cypress-data-session" />

import userEtherealAccount from '../../../data/etherealUser.json'

describe('Spanish', () => {
  //
  // Test will run once for English and once for Spanish because of the
  // languages tags and the presence of the 'localized' tag.
  //
  it.skip("(PER-5000) English and Spanish", {personas: ['an'], languages: ['en', 'es'],   tags: ['spanish', 'localized', 'anonymous', 'smoke']}, () => {
    cy.visit('multilingual-test')
  })
})
