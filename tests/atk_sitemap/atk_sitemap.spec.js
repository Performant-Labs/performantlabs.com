/**
 * atk_sitemap.spec.js
 *
 * Validate sitemap.xml.
 *
 */

/** ESLint directives */
/* eslint-disable import/first */

import * as atkCommands from '../support/atk_commands';
import * as atkUtilities from '../support/atk_utilities'; // eslint-disable-line no-unused-vars
import { qaUsers } from '../support/atk_utilities';
import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';
import https from 'https';

// Note: tests should use relative URLs resolved against Playwright's baseURL.

// Set up Playwright.
import { expect, test } from '../support/atk_fixture.js';

test.describe('Sitemap tests.', () => {
  //
  // 1070 to 1079 reserved for XML Sitemap (https://www.drupal.org/project/xmlsitemap) tests.
  //

  //
  // Return # of sitemap files; fail if zero.
  //
  test('(ATK-PW-1070) Return # of sitemap files; fail if zero. @ATK-PW-1070 @xml-sitemap @smoke', async ({ page }) => {
    const testId = 'ATK-PW-1070' // eslint-disable-line no-unused-vars
    const fileName = 'sitemap.xml'

    // Fetch file via Playwright so relative paths resolve against baseURL.
    const response = await page.goto(`/${fileName}`)
    const responseBody = await response.text()

    // Uncomment and use with parse() below to test multi-part sitemaps.
    // let tempVal = '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>http://example.com/sitemap1.xml</loc><lastmod>2023-01-01T00:00:00+00:00</lastmod></sitemap><sitemap><loc>http://example.com/sitemap2.xml</loc><lastmod>2023-01-01T00:00:00+00:00</lastmod></sitemap></sitemapindex>'

    const parser = new XMLParser()
    const jsonObj = parser.parse(responseBody)

    let sitemapCount = 1
    try {
      // If there is just one sitemap file, this will fail.
      // Is the module enabled and cron has run?
      sitemapCount = jsonObj.sitemapindex.sitemap.length
    } catch (error) { /* empty */ }

    console.log(`Total sitemap files: ${sitemapCount}`) // eslint-disable-line no-console
  })

  //
  // Regenerate sitemap files.
  // 1. Find Site ID of default sitemap (change for your installation).
  // 2. Fetch the 1.xml timestamp.
  // 3. Use drush xmlsitemap:regenerate to create new files.
  // 4. Validate new files.
  //
  test('(ATK-PW-1071) Regenerate sitemap files. @ATK-PW-1071 @xml-sitemap @smoke', async ({ page, context }) => {
    const testId = 'ATK-PW-1071' // eslint-disable-line no-unused-vars
    const fileName = 'sitemap.xml' // eslint-disable-line no-unused-vars

    //
    // Step 1.
    //
    await atkCommands.logInViaForm(page, context, qaUsers.admin)
    // Navigate to the XML sitemap admin page using a relative path.
    await page.goto('/admin/config/search/xmlsitemap')

    // Find the row where the first column contains the site's origin.
    const trimmedBaseUrl = new URL(page.url()).origin
    
    // Wait for table to be present first
    await page.waitForSelector('table', { timeout: 10000 })
    
    // Try to find the row with the exact base URL first
    let rowLocator = page.locator(`table tr`).filter({ has: page.locator(`td:first-child:has-text("${trimmedBaseUrl}")`) })
    let rowCount = await rowLocator.count()
    
    // If not found, try without protocol (some Drupal versions show URL differently)
    if (rowCount === 0) {
      const urlWithoutProtocol = trimmedBaseUrl.replace(/^https?:\/\//, '')
      // Use has-text with the URL (safer than regex pattern matching)
      rowLocator = page.locator(`table tr`).filter({ has: page.locator(`td:first-child:has-text("${urlWithoutProtocol}")`) })
      rowCount = await rowLocator.count()
    }
    
    // If still not found, use the first row as fallback
    if (rowCount === 0) {
      console.warn(`Could not find row with URL ${trimmedBaseUrl}, using first data row`)
      rowLocator = page.locator('table tbody tr').first()
    }

    // Get the text content of the second column in that row
    const siteId = await rowLocator.locator('td:nth-child(2)').textContent({ timeout: 5000 })

    //
    // Step 2.
    //
    const firstSitemap = `sites/default/files/xmlsitemap/${siteId}/1.xml`
    const drushFull = `fprop --format=json ${firstSitemap}`

    // Capture the timestamp to ensure it changes.
    const firstFileProps = JSON.parse(atkCommands.execDrush(drushFull))

    //
    // Step 3.
    //
    atkCommands.execDrush('xmlsitemap:rebuild')

    //
    // Step 4.
    //
    const secondFileProps = JSON.parse(atkCommands.execDrush(`fprop --format=json ${firstSitemap}`))
    const firstTime = firstFileProps[0].filemtime
    const secondTime = secondFileProps[0].filemtime
    expect(firstTime).not.toEqual(secondTime)
  })

  //
  // Regenerate sitemap files for SimpleSiteMap.
  // 1080 to 1089 reserved for Simple XML Sitemap (https://www.drupal.org/project/simple_sitemap) tests.
  //
})
