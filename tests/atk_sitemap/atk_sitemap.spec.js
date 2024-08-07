/**
 * atk_sitemap.spec.js
 *
 * Validate sitemap.xml.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';
import * as atkUtilities from '../support/atk_utilities'; // eslint-disable-line no-unused-vars
import * as atkCommands from '../support/atk_commands';

import playwrightConfig from '../../playwright.config';

const baseUrl = playwrightConfig.use.baseURL;

// Import ATK data.
import * as atkData from '../support/atk_data.js';


// Set up Playwright.
import { expect, test } from '@playwright/test';

test.skip('Sitemap tests.', () => {
  //
  // 1070 to 1079 reserved for XML Sitemap (https://www.drupal.org/project/xmlsitemap) tests.
  //

  //
  // Return # of sitemap files; fail if zero.
  //
  test('(ATK-PW-1070) Return # of sitemap files; fail if zero. @ATK-PW-1070 @xml-sitemap @smoke', async ({ page }) => {
    const testId = 'ATK-PW-1070'; // eslint-disable-line no-unused-vars
    const fileName = 'sitemap.xml';

    // Fetch file.
    await page.goto(baseUrl);
    const targetUrl = new URL(fileName, baseUrl).toString();

    // If there isn't at least one sitemap, this will fail.
    const response = await axios.get(targetUrl);

    // Uncomment and use with parse() below to test multi-part sitemaps.
    // let tempVal = '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>http://example.com/sitemap1.xml</loc><lastmod>2023-01-01T00:00:00+00:00</lastmod></sitemap><sitemap><loc>http://example.com/sitemap2.xml</loc><lastmod>2023-01-01T00:00:00+00:00</lastmod></sitemap></sitemapindex>'

    const parser = new XMLParser();
    const jsonObj = parser.parse(response.data);

    let sitemapCount = 1;
    try {
      // If there is just one sitemap file, this will fail.
      sitemapCount = jsonObj.sitemapindex.sitemap.length;
    } catch (error) {}

    console.log(`Total sitemap files: ${sitemapCount}`); // eslint-disable-line no-console
  });

  //
  // Regenerate sitemap files.
  // 1. Find Site ID of default sitemap (change for your installation).
  // 2. Fetch the 1.xml timestamp.
  // 3. Use drush xmlsitemap:regenerate to create new files.
  // 4. Validate new files.
  //
  test('(ATK-PW-1071) Regenerate sitemap files. @ATK-PW-1071 @xml-sitemap @smoke', async ({ page, context }) => {
    const testId = 'ATK-PW-1071'; // eslint-disable-line no-unused-vars
    const fileName = 'sitemap.xml'; // eslint-disable-line no-unused-vars

    //
    // Step 1.
    //
    await atkCommands.logInViaForm(page, context, atkData.qaUsers.admin);
    await page.goto(`admin/config/search/xmlsitemap`);

    // Find the row where the first column contains 'http://default'.
    const row = await page.$('table tr:has(td:first-child:has-text("http://default"))');

    // Get the text content of the second column in that row
    const siteId = await row.$eval('td:nth-child(2)', (el) => el.textContent);

    //
    // Step 2.
    //
    const firstSitemap = `sites/default/files/xmlsitemap/${siteId}/1.xml`;
    const drushFull = `fprop --format=json ${firstSitemap}`;

    // Capture the timestamp to ensure it changes.
    const firstFileProps = JSON.parse(atkCommands.execDrush(drushFull));

    //
    // Step 3.
    //
    atkCommands.execDrush('xmlsitemap:rebuild');

    //
    // Step 4.
    //
    const secondFileProps = JSON.parse(atkCommands.execDrush(`fprop --format=json ${firstSitemap}`));
    const firstTime = firstFileProps[0].filemtime;
    const secondTime = secondFileProps[0].filemtime;
    expect(firstTime).not.toBe(secondTime);
  });

  //
  // Regenerate sitemap files for SimpleSiteMap.
  // 1080 to 1089 reserved for Simple XML Sitemap (https://www.drupal.org/project/simple_sitemap) tests.
  //
});
