/// <reference types="Cypress" />
/// <reference types="cypress-data-session" />

const createRandomString = require('../../../support/utils.js').createRandomString;
// import { createRandomString } from '../../../support/utils.js'
//  import 'cypress-recurse/commands'

describe('Validate Contact Us', {tags: ['contact-us', 'anonymous', 'smoke']}, () => {
  it("basics", () => {
    expect(true).to.equal(true)
  })
  
  before(function () {
    cy.prepareForTestRun()
  })

  it("(PER-1100) Contact Us form accepts correct input", {defaultCommandTimeout: 1000, languages: ['en'],  regions: ['us'], tags: ['contact-us', 'anonymous', 'smoke']}, () => {
    const randomString = createRandomString(10)

    cy.log("**Fill out contact form.**")
    cy.visit('contact-us').then(() => {
      cy.get('#edit-name').type('André Angelantoni')
      cy.get('#edit-email').type('aangel100+001@gmail.com')
      cy.get('#edit-company-name').type('Performant Labs Inc.')

      // We will check for this later.
      cy.get('#edit-message').type(randomString)
      cy.log("Looking for " + randomString)
      cy.contains('Send message').click()
    })

    cy.log("**Should see the thank-you page.**")
    cy.contains('Thank you')
    cy.visit(Cypress.env('url').login)

    // Now check for the entry in the database.
    // Note that experiencing this problem and clearing isn't working:
    // https://github.com/cypress-io/cypress/issues/14590
    Cypress.session.clearSessionStorage

    cy.logInAs(Cypress.env('account').admin)
    cy.visit('admin/structure/webform/submissions/manage')

    // Check only some of them.
    var submissionIndex = 0

    // cy.log("**Look through table for entry.**")

    // cy.get('.webform-results-table > tbody > tr').each((row) => {
    //   cy.visit(row[0].dataset.webformHref)

    //   cy.contains(randomString)

    //   submissionIndex++
    //   // If we checked all of them with no success, fail the test
    //   if (submissionIndex == 1 ) {
    //     return false  // Fail test.
    //   }
    //   return true
    // })
  })
})
