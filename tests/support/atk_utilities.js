import fs from 'fs'
import YAML from 'yaml'
import atkConfig from '../../playwright.atk.config.js';
import playwrightConfig from '../../playwright.config.js';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import deepmerge from 'deepmerge';

/**
 * Return a string of random characters of specified length.
 *
 * @param length        int   Length of string to return.
 * @returns
 */
function createRandomString(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

/**
 * Return a user object with random name, email, and password.
 *
 * @return {{userRoles: *[], userPassword: string, userEmail: string, userName: string}}
 */
function createRandomUser() {
  const name1 = createRandomString(6)
  const name2 = createRandomString(6)
  return {
    userName: `${name1}.${name2}`,
    userEmail: `${name1.toLowerCase()}.${name2.toLowerCase()}@ethereal.email`,
    userPassword: createRandomString(18),
    userRoles: [],
  }
}

/**
 * Read data from a YAML file located in tests/data.
 *
 * @param filename {string}
 * @return {object}
 */
function readYAML(filename) {
  const file = fs.readFileSync(`tests/data/${filename}`, 'utf8')
  return YAML.parse(file)
}

const baseUrl = playwrightConfig.use.baseURL;
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
 * Get a list of the URL from a .yml file located in 'data' directory.
 * Format
 * <pre>
 *   # List of URL with optional additional properties
 *   URL:
 *    - /path:
 *    - /path2:
 *      any:
 *      additional:
 *      props:
 *
 *   # Sitemap
 *   sitemap:
 *     - /sitemap.xml:
 *       any:
 *       additional:
 *       prop:
 *   </pre>
 * The file can contain list of URL with optional additional properties.
 * It also can contain a list of sitemap.xml URL which
 *
 * @param fileName File name.
 * @return {Promise<[string, *][]>} A list of pairs URL,
 * optional additional properties for this URL.
 */
async function getURLList(fileName) {
  const dataObj = readYAML(fileName);

  const gprops = Object.fromEntries(Object.entries(dataObj).filter(([key]) => key !== 'URL' && key !== 'sitemap'));

  function mergeProps(props) {
    // null is object in JavaScript.
    if (typeof props === 'object' && props) {
      return deepmerge(gprops, props);
    }
    return gprops;
  }

  const result = [];
  if (dataObj.hasOwnProperty('URL')) {
    for (const [URL, props] of Object.entries(dataObj.URL)) {
      result.push([URL, mergeProps(props)]);
    }
  }
  if (dataObj.hasOwnProperty('sitemap')) {
    for (const [URL, props] of Object.entries(dataObj.sitemap)) {
      const URLList = await parseXmlSitemap(URL);
      const props1 = mergeProps(props);
      for (const URL1 of URLList) {
        result.push([URL1, props1]);
      }
    }
  }
  return result;
}

// Pre-load some commonly used files.
const qaUsers = readYAML('qaUsers.json');
export {
  createRandomString,
  createRandomUser,
  readYAML,
  getURLList,
  baseUrl,
  qaUsers
}
