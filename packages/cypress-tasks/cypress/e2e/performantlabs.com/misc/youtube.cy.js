/// <reference types="Cypress" />


describe('Play YouTube', () => {
  // Keep for playing with.
  // npx cypress open --config baseUrl=https://youtube.com
  it.skip("(PER-0000) Play YouTube", () => {

    // Peaceful piano music
    // cy.visit('watch?v=vxu2IAG1mLk')

    // Watch this:
    cy.visit('watch?v=mbE-IXDA1sU')
    cy.wait(2000)

    for (let i = 0; i < 500; i++) {
      // Hide the login form.
      cy.get('#dismiss-button > .style-scope > yt-button-shape > .yt-spec-button-shape-next > yt-touch-feedback-shape > .yt-spec-touch-feedback-shape > .yt-spec-touch-feedback-shape__fill', {timeout: 500})
      .if()
      .click()

      cy.scrollTo('top')

      // The YouTube subscription offer.
      cy.get("button[aria-label='Skip trial']", {timeout: 500})
      .if()
      .click()

      // The Skip Ads button.
      cy.get('.ytp-ad-skip-button.ytp-button', {timeout: 500})
      .if()
      .click()

      // // Subtitles might be on.
      // cy.get('.ytp-subtitles-button', {timeout: 500})
      // .if()
      // .click()
    }
  })

})
