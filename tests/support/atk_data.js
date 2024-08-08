import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import { parse } from 'csv';
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
 * Get a list of the locations from a .csv file located in 'data' directory.
 * Format
 * <pre>
 *   *,"r1,r2"
 *   /path,"r3,r4"
 *   /path2
 *   /path3
 *   @settings.xml
 *   </pre>
 * Each line of this file maybe
 * - site location;
 * - site location <comma> any additional info, such as rules to ignore etc...
 * - "@<sitemap>" where <sitemap> is a location of the XML sitemap file.
 * In this case all URLs from this sitemap will be included.
 *
 * @param fileName File name.
 * @return {Promise<string[][]>} A list of the locations + additional info for each location.
 */
async function getLocationsFromFile(fileName) {
  const filePath = `${atkConfig.dataDir}/${fileName}`;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const result = [];
  return new Promise((resolve, reject) => {
    const parser = parse({ delimiter: ',', encoding: 'utf-8' });
    const sitemapPromises = [];
    let globalRecord = [];

    function getResultRecord(...record) {
      const rr = [];
      rr.push(record[0] || '');
      for (let i = 1; i < Math.max(record.length, globalRecord.length); i++) {
        let r = '';
        if (record[i]) r += record[i];
        if (globalRecord[i] && r) r += ',';
        if (globalRecord[i]) r += globalRecord[i];
        rr.push(r);
      }
      return rr;
    }

    parser.on('readable', () => {
      let record;
      while (record = parser.read()) {
        if (!record || !record[0]) {
          continue;
        } else if (record[0] === '*') {
          globalRecord = record;
        } else if (!(record[0][0] === '@')) {
          result.push(getResultRecord(...record));
        } else {
          let sitemapPromise = parseXmlSitemap(record[0].substring(1)).then((locationList) => {
            locationList.forEach((location) => {
              result.push(getResultRecord(location, ...record.slice(1)));
            });
          });
          sitemapPromises.push(sitemapPromise);
        }
      }
    });
    parser.on('error', (err) => {
      reject(err);
    });
    parser.on('end', () => {
      Promise.all(sitemapPromises).then(() => {
        resolve(result);
      });
    });
    parser.write(fileContent);
    parser.end();
  });
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
