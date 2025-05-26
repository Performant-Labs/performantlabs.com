// This file was restored based on a similar file: packages/cypress-tasks/cypress/e2e/performantlabs.com/atk_contact_us/atk_contact_us.cy.js
// Original commit: 33427ada2a55405d356c6e4139d2a01a9bc80679
/**
 * atk_contact_us.cy.js
 *
 * Contact Us tests.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

/// <reference types='Cypress' />

// Set up ATK.
import * as atkCommands from '../../support/atk_commands' // eslint-disable-line no-unused-vars
import * as atkUtilities from '../../support/atk_utilities'
import atkConfig from '../../../cypress.atk.config'

// Standard accounts that use user accounts created
// by QA Accounts. QA Accounts are created when the QA
// Accounts module is enabled.
import qaUserAccounts from '../../data/qaUsers.json'

describe('Contact Us tests.', () => {
  const ctx = {}

  before(() => {
    if (!atkConfig.email?.reroute) {
      return
    }

    // initial_state  = drush cget reroute_email.settings enable
    cy.getDrupalConfiguration('reroute_email.settings', 'enable')
        .then((enable) => {
          ctx.enable = enable
        })
    cy.getDrupalConfiguration('reroute_email.settings', 'address')
        .then((address) => {
          ctx.address = address
        })
    cy.getDrupalConfiguration('reroute_email.settings', 'allowed')
        .then((allowed) => {
          ctx.allowed = allowed
        })
    cy.getDrupalConfiguration('reroute_email.settings', 'mailkeys')
        .then((mailkeys) => {
          ctx.mailkeys = mailkeys
        })
    cy.getDrupalConfiguration('reroute_email.settings', 'mailkeys_skip')
        .then((mailkeysSkip) => {
          ctx.mailkeysSkip = mailkeysSkip
        })

    // Remote:drush cset reroute_email.settings enable 1
    cy.setDrupalConfiguration('reroute_email.settings', 'enable', true)
    cy.setDrupalConfiguration('reroute_email.settings', 'address', atkConfig.email.reroute.address)
    cy.setDrupalConfiguration('reroute_email.settings', 'allowed', atkConfig.email.reroute.allowed)
    cy.setDrupalConfiguration('reroute_email.settings', 'mailkeys', '')
    cy.setDrupalConfiguration('reroute_email.settings', 'mailkeys_skip', '')
  })

  after(() => {
    if (!atkConfig.email?.reroute) {
      return
    }

    // Remote:drush cset reroute_email.settings enable $INITIAL_STATE
    if (ctx.enable !== undefined) {
      cy.setDrupalConfiguration('reroute_email.settings', 'enable', ctx.enable)
    }
    if (ctx.address !== undefined) {
      cy.setDrupalConfiguration('reroute_email.settings', 'address', ctx.address)
    }
    if (ctx.allowed !== undefined) {
      cy.setDrupalConfiguration('reroute_email.settings', 'allowed', ctx.allowed)
    }
    if (ctx.mailkeys !== undefined) {
      cy.setDrupalConfiguration('reroute_email.settings', 'mailkeys', ctx.mailkeys)
    }
    if (ctx.mailkeysSkip !== undefined) {
      cy.setDrupalConfiguration('reroute_email.settings', 'mailkeys_skip', ctx.mailkeysSkip)
    }
  })

  //
  // Validate Contact us.
  //
  it('(ATK-CY-1050) Contact Us form accepts input, sends email.', { tags: ['@ATK-CY-1050', '@atk_contact_us', '@smoke', '@alters-db'] }, () => {
    const testId = 'ATK-CY-1050'
    const uniqueToken = atkUtilities.createRandomString(6)
    const subjectLine = `${testId} ${uniqueToken}`
    const user = atkUtilities.createRandomUser()

    cy.log("**Fill out contact form.**")
    cy.visit('contact-us').then(() => {
      cy.get('#edit-name').type(user.userName)
      cy.get('#edit-email').type(user.userEmail)
      cy.get('#edit-company-name').type('Performant Labs Inc.')

      // We will check for this later.
      cy.get('#edit-message').type(subjectLine)
      cy.contains('Send message').click()
    })

    cy.log("**Should see the thank-you page.**")
    cy.contains('Thank you')
    cy.visit('/')

    cy.logInViaForm(qaUserAccounts.admin)

    cy.visit('admin/structure/webform/manage/contact/results/submissions')

    // Check for presence of random string.
    // Part A passes: the submission appears.
    cy.contains(subjectLine).should('be.visible')

    // Check for an email sent to site admin.
    // We don't know the address here (unless use Reroute),
    // so just check the subject.
    cy.expectEmail(atkConfig.email?.reroute?.address ?? /.*/, subjectLine)
  })
})
