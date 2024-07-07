import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import atkConfig from '../../playwright.atk.config.js';
import playwrightConfig from '../../playwright.config.js';

export const baseUrl = playwrightConfig.use.baseURL;

export { getLocationsFromFile, getJsonFile, qaUsers, etherealUser };

function makeRelativeURL(url) {
  return new URL(url).pathname;
}

/**
 * Parse an `urlset` block from the sitemap file.
 *
 * @param urlset
 * @return {string[]} Array of URLs.
 */
function parseUrlSet(urlset) {
  if (!(urlset.url instanceof Array)) {
    return [makeRelativeURL(urlset.url.loc)];
  }
  return urlset.url.map((url) => makeRelativeURL(url.loc));
}

/**
 * Parse a sitemap file.
 *
 * @param fileName URL (absolute or relative) of the file.
 * @return {Promise<string[]>} Array of URLs.
 */
async function parseXmlSitemap(fileName) {
  // Construct an absolute URL of the sitemap.
  const targetUrl = new URL(fileName, baseUrl).toString();

  // Get sitemap.xml.
  const response = await axios.get(targetUrl);

  const parser = new XMLParser();
  const jsonObj = parser.parse(response.data);

  if (jsonObj.urlset) {
    // sitemap.xml is itself a sitemap file.
    return parseUrlSet(jsonObj.urlset);
  } else {
    const sitemap = jsonObj.sitemapindex.sitemap;
    if (!(sitemap instanceof Array)) {
      return parseXmlSitemap(sitemap.loc);
    } else {
      return [].concat(sitemap.map((sitemap) => parseXmlSitemap(sitemap.loc)))
    }
  }
}

/**
 * Get a list of the locations from the file located in 'data' directory.
 * Each line of this file maybe
 * - site location;
 * - "@<sitemap>" where <sitemap> is a location of the XML sitemap file.
 * In this case all URLs from this sitemap will be included.
 *
 * @param fileName File name.
 * @return {Promise<string[]>} A list of the locations.
 */
async function getLocationsFromFile(fileName) {
  const filePath = `${atkConfig.dataDir}/${fileName}`;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const loc1 = fileContent.split('\n').filter(s => s !== '');
  const loc2 = [];
  for (let loc of loc1) {
    if (!(loc[0] === '@')) {
      loc2.push(loc);
    } else {
      const loc3 = await parseXmlSitemap(loc.substring(1));
      for (let loc of loc3) loc2.push(loc);
    }
  }

  return loc2;
}

/**
 * Get an object from .json file in 'data' directory */
function getJsonFile(fileName) {
  const filePath = `${atkConfig.dataDir}/${fileName}`;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Pre-load some commonly used files.
const qaUsers = getJsonFile('qaUsers.json');
const etherealUser = getJsonFile('etherealUser.json');
