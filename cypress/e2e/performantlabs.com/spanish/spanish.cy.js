/// <reference types="Cypress" />
/// <reference types="cypress-data-session" />

const userAccount = require("../../../fixtures/createUserUsingDrush.json")

describe('Spanish', () => {
  //
  // Test will run once for English and once for Spanish because of the
  // languages tags and the presence of the 'localized' tag.
  //
  it("(PER-5000) English and Spanish", {personas: ['an'], languages: ['en', 'es'],   tags: ['spanish', 'localized', 'anonymous', 'smoke']}, () => {
    cy.visit('multilingual-test')
  })
})
