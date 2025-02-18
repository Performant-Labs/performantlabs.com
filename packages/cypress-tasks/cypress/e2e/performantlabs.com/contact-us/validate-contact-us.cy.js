/// <reference types="Cypress" />
/// <reference types="cypress-data-session" />

// import { createRandomString } from '../../../support/utils.js'
const createRandomString = require('../../../support/atk_utilities.js').createRandomString;

describe('Validate Contact Us', { tags: ['contact-us', 'anonymous', 'smoke'] }, () => {
  // before(function () {
  //   cy.prepareForTestRun()
  // })

  it("(PER-1100) Contact Us form accepts correct input", {
    defaultCommandTimeout: 5000,
    languages: ['en'],
    regions: ['us'],
    tags: ['contact-us', 'anonymous', 'smoke']
  }, () => {
    const randomString = createRandomString(10)
    cy.log("**Fill out contact form.**")
    cy.visit('contact-us').then(() => {
      cy.get('#edit-name').type('André Angelantoni')
      cy.get('#edit-email').type('aangel100+001@gmail.com')
      cy.get('#edit-company-name').type('Performant Labs Inc.')

      // We will check for this later.
      cy.get('#edit-message').type(randomString)
      cy.contains('Send message').click()
    })

    cy.log("**Should see the thank-you page.**")
    cy.contains('Thank you')
    cy.visit('/')
    // cy.wrap(Cypress.env()).log('Environment variables %o')

    // But there shouldn't be an error on it.
    // cy.get('.alert').should('not.exist')

    // Now check for the entry in the database.
    // Note that experiencing this problem and clearing isn't working:
    // https://github.com/cypress-io/cypress/issues/14590
    Cypress.session.clearSessionStorage

    cy.logInViaForm(Cypress.env('account').admin)
    cy.visit('admin/structure/webform/submissions/manage')

    // TODO: Catching the error is failing.
    // cy.on('fail', (e) => {
    //   Absorb the error.
    //   return false
    // })

    cy.log("**Look through table for entry.**")
    cy.get('.webform-results-table > tbody > tr').then((row) => {
      function findMessage(submissionIndex) {
        if (!(submissionIndex < row.length)) {
          return false
        }
        cy.visit(row[submissionIndex].dataset.webformHref)
        cy.get('#contact--message').then((element) => {
          if (element.text().includes(randomString)) {
            return true
          } else if (submissionIndex >= 10) {
            return false
          } else {
            return findMessage(submissionIndex + 1)
          }
        })
      }

      return findMessage(0)
    }).then((found) => {
      if (found) {
        return cy.log(`Message **${randomString}** has been found`)
      } else {
        throw new Error(`Message **${randomString}** has not been found`)
      }
    })
  })
})
