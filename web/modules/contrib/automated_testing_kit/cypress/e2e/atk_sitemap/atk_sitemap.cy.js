/**
 * atk_sitemap.cy.js
 *
 * Validate sitemap.xml.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

/// <reference types='Cypress' />

// Set up ATK.
import { XMLParser } from 'fast-xml-parser';
import * as atkCommands from '../../support/atk_commands';
import * as atkUtilities from '../../support/atk_utilities'; // eslint-disable-line no-unused-vars
import atkConfig from '../../../cypress.atk.config'; // eslint-disable-line no-unused-vars

// Standard accounts that use user accounts created
// by QA Accounts. QA Accounts are created when the QA
// Accounts module is enabled.
import qaUserAccounts from '../../data/qaUsers.json';

describe('Sitemap tests.', () => {
  //
  // Confirm at least one sitemap exists; report total number of sitemaps.
  // TODO: Expand by using https://glebbahmutov.com/blog/test-sitemap/.
  //
  it('(ATK-CY-1070) Return # of sitemap files; fail if zero.', { tags: ['@ATK-CY-1070', '@xml-sitemap', '@smoke'] }, () => {
    const testId = 'ATK-CY-1070'; // eslint-disable-line no-unused-vars
    const fileName = 'sitemap.xml';

    // If there isn't at least one sitemap, this will fail.
    cy.request(fileName).its('body').then((body) => {
      const parser = new XMLParser();
      const jsonObj = parser.parse(body);

      let sitemapCount = 1;
      try {
        // If there is just one sitemap file, this will fail.
        sitemapCount = jsonObj.sitemapindex.sitemap.length;
      } catch (error) {}

      console.log(`Total sitemap files: ${sitemapCount}`); // eslint-disable-line no-console
    });
  });

  //
  // Regenerate sitemap files.
  // 1. Find Site ID of default sitemap (change for your installation).
  // 2. Fetch the 1.xml timestamp.
  // 3. Use drush xmlsitemap:regenerate to create new files.
  // 4. Compare timestamps.
  //
  it('(ATK-CY-1071) Regenerate sitemap files.', { tags: ['@ATK-CY-1071', '@xml-sitemap', '@smoke'] }, () => {
    const testId = 'ATK-CY-1071'; // eslint-disable-line no-unused-vars
    let siteId = null;
    let filename = null;
    let firstFileProps;

    //
    // Step 1. Identify the site ID.
    //
    cy.logInViaForm(qaUserAccounts.admin);
    cy.visit(atkConfig.xmlSitemapUrl);

    // Get and parse the base URL.
    cy.url().then((baseUrl) => {
      const match = baseUrl.match(/^(?:https?:\/\/)(?:[^@\/\n]+@)?(?:[^:\/\n]+)/);
      if (!match) {
        throw new Error(`Url is not parsed: ${baseUrl}`);
      }
      return match[0];
    }).as('trimmedBaseUrl');

    // Find the site ID from the table.
    cy.get('@trimmedBaseUrl').then((trimmedBaseUrl) => {
      let foundSiteId = null;

      cy.get('table tr').each((tr) => {
        if (tr.find('td:nth-child(1)').text().includes(trimmedBaseUrl)) {
          foundSiteId = tr.find('td:nth-child(2)').text();
          return false;
        }
      }).then(() => {
        cy.wrap(foundSiteId).as('siteId');
      });
    });

    // Generate filename.
    cy.get('@siteId').then((siteId) => {
      const filename = `sites/default/files/xmlsitemap/${siteId}/1.xml`;
      cy.wrap(filename).as('filename');
    });

    //
    // Step 2. Fetch the file properties for the sitemap xml file.
    //
    cy.get('@filename').then((filename) => {
      cy.execDrush(`fprop --format=json ${filename}`).as('initialFileProps');
    });

    // Parse initial file properties.
    cy.get('@initialFileProps').then((result) => {
      cy.get('@filename').then((filename) => {
        console.log(`**About to parse: ${filename}**`);
        console.log(`**Text is: ${result}**`);
        cy.wrap(JSON.parse(result)).as('firstFileProps');
      });
    });

    //
    // Step 3. Regenerate the sitemap files, which will change the timestamp.
    //
    cy.execDrush('xmlsitemap:rebuild');

    //
    // Step 4. Compare the timestamps. They should be different.
    //
    cy.get('@filename').then((filename) => {
      cy.execDrush(`fprop --format=json ${filename}`).as('finalFileProps');
    });

    // Verify timestamps changed.
    cy.get('@firstFileProps').then((firstFileProps) => {
      cy.get('@finalFileProps').then((text) => {
        const secondFileProps = JSON.parse(text);
        const firstTime = firstFileProps[0].filemtime;
        const secondTime = secondFileProps[0].filemtime;

        expect(firstTime).not.to.be.undefined;
        expect(secondTime).not.to.be.undefined;
        expect(firstTime).not.to.eq(secondTime);
      });
    });
  });

  //
  // Regenerate sitemap files for SimpleSiteMap.
  // 1080 to 1089 reserved for Simple XML Sitemap (https://www.drupal.org/project/simple_sitemap) tests.
  //

});
