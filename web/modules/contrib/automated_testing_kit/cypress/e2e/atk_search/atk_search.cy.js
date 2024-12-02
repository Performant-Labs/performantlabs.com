/**
 * atk_search.cy.js
 *
 * Validate search.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

/// <reference types='Cypress' />

// Set up ATK.
import * as atkCommands from '../../support/atk_commands'; // eslint-disable-line no-unused-vars
import * as atkUtilities from '../../support/atk_utilities'; // eslint-disable-line no-unused-vars
import atkConfig from '../../../cypress.atk.config';

// Standard accounts that use user accounts created
// by QA Accounts. QA Accounts are created when the QA
// Accounts module is enabled.
import qaUserAccounts from '../../data/qaUsers.json';

describe('Search tests.', () => {
  const ctx = {};
  before(() => {
    // Search keywords and expected results.
    // Adjust for your site.
    atkUtilities.readYAML('search.yml').then((data) => {
      ctx.data = data;
    });
  });

  //
  // Simple search with a search box.
  //
  it('(ATK-CY-1160) Search content by a keyword.', { tags: ['@ATK-CY-1160', '@search', '@content'] }, () => {
    cy.visit('/');
    for (const item of ctx.data.simple) {
      // Handle "responsive design". If "Search form" isn't visible,
      // have to click main menu button first.
      cy.get('[aria-label="Search Form"]').then((element) => {
        if (!element.is(':visible')) {
          cy.get('[aria-label="Main Menu"]').click();
        }
        element.click();
      });
      cy.get('input[type="search"]:visible').type(item.keyword + '{enter}');

      // Check results.
      for (const result of item.results) {
        cy.contains(result).should("be.visible");
      }
    }
  });

  //
  // Advanced search in /node/search.
  //
  it('(ATK-CY-1161) Advanced search.', { tags: ['@ATK-PW-1161', '@search', '@content'] }, () => {
    for (const item of ctx.data.advanced) {
      // In the default installation, only admin can do advanced search.
      // Change if it's configured different way on your site.
      cy.logInViaForm(qaUserAccounts.admin);

      cy.visit('/search/node');
      cy.contains('Advanced search').click();
      if (item.any) {
        cy.getByLabel('Containing any of the words').type(item.any);
      }
      if (item.phrase) {
        cy.getByLabel('Containing the phrase').type(item.phrase);
      }
      if (item.none) {
        cy.getByLabel('Containing none of the words').type(item.none);
      }
      for (const type of item.types) {
        cy.getByLabel(type).check();
      }
      for (const lang of item.languages) {
        cy.getByLabel(lang).check();
      }
      cy.get('input[value="Advanced search"]').click();

      // Check results.
      for (const result of item.results) {
        cy.contains(result).should('be.visible');
      }
    }
  });

  it('(ATK-CY-1162) Search by a keyword: empty input', { tags: ['@ATK-CY-1162', '@search', '@content', '@empty'] }, () => {
    cy.visit('/');
    // Handle "responsive design". If "Search form" isn't visible,
    // have to click main menu button first.
    cy.get('[aria-label="Search Form"]').then((element) => {
      if (!element.is(':visible')) {
        cy.get('[aria-label="Main Menu"]').click();
      }
      element.click();
    });
    cy.get('button[value="Search"]:visible').click();
    cy.contains('Enter some keywords').should('be.visible');
  });

  it('(ATK-CY-1163) Advanced search: empty input', { tags: ['@ATK-CY-1163', '@search', '@content', '@empty'] }, () => {
    // In the default installation, only admin can do advanced search.
    // Change if it's configured different way on your site.
    cy.logInViaForm(qaUserAccounts.admin);

    cy.visit('/search/node');
    cy.contains('Advanced search').click();
    cy.get('input[value="Advanced search"]').click();
    cy.contains('Enter some keywords').should('be.visible');
  });
});
