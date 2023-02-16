/// <reference types="Cypress" />

describe('User registration and login tasks', () => {
  before(function () {
    cy.prepareForTestRun()
  })

  // Keep for playing with.
  // npx cypress open --config baseUrl=https://youtube.com
  it.skip("(PER-0000) Play YouTube", () => {

    // Peaceful piano music
    // cy.visit('watch?v=vxu2IAG1mLk')

    // Watch this:
    cy.visit('watch?v=A2UAqWB59AU')

    for (let i = 0; i < 5; i++) {
      cy.contains('Omitir anuncios', {timeout: 500, failOnStatusCode: false}).click();
      cy.contains('Skip Ads', {timeout: 500, failOnStatusCode: false}).click();
      cy.scrollTo('top')

      cy.contains('Subtítulos', {timeout: 500, failOnStatusCode: false}).click();
      cy.get('.ytp-subtitles-button', {timeout: 500, failOnStatusCode: false}).click();
    }
  })

})
