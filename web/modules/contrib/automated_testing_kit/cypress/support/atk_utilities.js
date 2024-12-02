/// <reference types='Cypress' />

import fs from 'fs';
import YAML from 'yaml';

/**
 * Return a string of random characters of specified length.
 *
 * @param {length}        int   Length of string to return.
 */
function createRandomString (length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
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
  const name1 = createRandomString(6);
  const name2 = createRandomString(6);
  return {
    userName: `${name1} ${name2}`,
    userEmail: `${name1.toLowerCase()}.${name2.toLowerCase()}@ethereal.email`,
    userPassword: createRandomString(18),
    userRoles: [],
  }
}

/**
 * Read data from a YAML file located in cypress/data.
 *
 * @param filename {string}
 * @return {object}
 */
function readYAML(filename) {
  return cy.readFile(`cypress/data/${filename}`).then((text) => YAML.parse(text));
}


export { createRandomString, createRandomUser, readYAML }
