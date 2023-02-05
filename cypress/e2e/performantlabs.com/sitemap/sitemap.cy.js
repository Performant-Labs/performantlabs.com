/// <reference types="Cypress" />

const X2JS = require('x2js')

describe('Sitemap tasks', () => {
  before(function () {
    cy.prepareForTestRun()
  })

  it("(PER-0000) Check all URLs in the sitemap", () => {

    // Watch this:
    cy.request('sitemap.xml')
      .its('body')
      .then(body => {
        const x2js = new X2JS()
        const json = x2js.xml2js(body)
        console.log(json)
        // Get all the URLS
        expect(json.urlset.url).to.be.an('array').and.have.length.gt(1)

        json.urlset.url.forEach((url) => {
          const parsed = new URL(url.loc)
          cy.log(parsed.pathname)


          // Check if the resource exists just getting the header (fastest)
          cy.request('HEAD', url.loc).its('status').should('eq', 200)

          // Check if the resource exists AND download it
          cy.request(url.loc).its('status').should('eq', 200)

          // Visit the page to check if it loads in the browser; the
          // wait is to ensure the page loads completely for the video.
          cy.visit(url.loc).wait(1000, { log: false })
        })
    });
  })

})
