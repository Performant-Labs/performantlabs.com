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

// Import file and parse XML.

// Import email settings for Ethereal fake SMTP service.
import userEtherealAccount from '../../data/etherealUser.json'; // eslint-disable-line no-unused-vars

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
  // 4. Validate new files.
  //
  it('(ATK-CY-1071) Regenerate sitemap files.', { tags: ['@ATK-CY-1071', '@xml-sitemap', '@smoke'] }, () => {
    const testId = 'ATK-CY-1071'; // eslint-disable-line no-unused-vars
    let siteId = null;

    //
    // Step 1.
    //
    cy.logInViaForm(qaUserAccounts.admin);
    cy.visit('admin/config/search/xmlsitemap');

    // Examine each row.
    cy.get('table > tbody > tr').each(($row) => {
      // Check if the first column contains 'http://default'.
      if ($row.find('td:nth-child(1)').text() === 'http://default') {
        // Get the text content of the second column in that row
        siteId = $row.find('td:nth-child(2)').text();
        return false; // This stops the .each() loop.
      }

      //
      // Step 2.
      //
      const firstSitemap = `sites/default/files/xmlsitemap/${siteId}/1.xml`; // eslint-disable-line no-unused-vars

      // Capture the timestamp to ensure it changes.
      const firstFileProps = JSON.parse(cy.execDrush(`fprop --format=json ${firstSitemap}`));

      //
      // Step 3.
      //
      cy.execDrush('xmlsitemap:rebuild');

      //
      // Step 4.
      //
      const secondFileProps = JSON.parse(atkCommands.execDrush(`fprop --format=json ${firstSitemap}`));
      const firstTime = firstFileProps[0].filemtime;
      const secondTime = secondFileProps[0].filemtime;
      expect(firstTime).not.toBe(secondTime);
    });
  });

  //
  // Regenerate sitemap files for SimpleSiteMap.
  // 1080 to 1089 reserved for Simple XML Sitemap (https://www.drupal.org/project/simple_sitemap) tests.
  //
  it('(ATK-CY-1080)  Return # of sitemap files; fail if zero.', { tags: ['@ATK-CY-1080', '@xml-sitemap', '@smoke'] }, () => {
    const testId = 'ATK-CY-1080'; // eslint-disable-line no-unused-vars
  });
});
