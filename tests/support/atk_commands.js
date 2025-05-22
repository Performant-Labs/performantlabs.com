/**
 * atk_commands.js
 *
 * Useful functions for Playwright.
 *
 */

/** ESLint directives */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */

// Set up Playwright.
import { expect } from '@playwright/test'
import { execSync } from 'child_process'
import playwrightConfig from '../../playwright.config'

// Fetch the Automated Testing Kit config, which is in the project root.
import atkConfig from '../../playwright.atk.config'
import { getProperty, readYAML } from './atk_utilities'

// Fetch test messages.
const atkMessages = readYAML('testMessages.json')

const baseUrl = playwrightConfig.use.baseURL

/**
 * Create a user via Drush using a JSON user object.
 * See qaUsers.json for the definition.
 *
 * TODO: cy.exec is failing to capture the result of user:create,
 * which should provide the UID.
 * See issue: https://github.com/drush-ops/drush/issues/5660
 *
 * @param {object} user JSON user object; see qaUsers.json for the structure.
 * @param {array} roles Array of string roles to pass to Drush (machine names).
 * @param {array} args Array of string arguments to pass to Drush.
 * @param {array} options Array of string options to pass to Drush.
 * @returns {number} uid
 */
function createUserWithUserObject(user, roles = [], args = [], options = []) {
  let cmd = 'user:create '

  if ((args === undefined) || !Array.isArray(args)) {
    console.log('createUserWithUserObject: Pass an array for args.')
    return 0
  }

  if ((options === undefined) || !Array.isArray(options)) {
    console.log('createUserWithUserObject: Pass an array for options.')
    return 0
  }

  args.unshift(`'${user.userName}'`)
  options.push(`--mail='${user.userEmail}'`, `--password='${user.userPassword}' --format=json`)

  // Uncomment for debugging.
  // console.log(`Attempting to create: ${user.userName}. `)

  const result = execDrush(cmd, args, options)

  // Attempt to add the roles.
  // Role(s) may come from the user object or the function arguments.
  if (user.hasOwnProperty('userRoles')) {
    user.userRoles.forEach((role) => {
      roles.push(role)
    })
  }

  roles.forEach((role) => {
    cmd = `user:role:add '${role}' '${user.userName}'`
    execDrush(cmd)

    // Uncomment for debugging.
    // console.log(`${role}: If role exists, role assigned to the user ${user.userName}`)
  })

  // Following workaround is for tugboat envs.
  // Tugboat has limited support of command line execution,
  // specifically, it mixes stdout and stderr.
  // Change output to filter out messages from   stderr.
  const cr = result.replace(/^[^{]*/, '')

  // Get the UID, if present.
  return getUidFromUserObject(cr)
}

/**
 * Extract the media id that was added by
 * automated_testing_kit_preprocess_image().
 *
 * @param imageLocator {import('@playwright/test').Locator}
 * @return {Promise<string>}
 */
async function getMid(imageLocator) {
  const mid = await imageLocator.getAttribute('data-media-id')
  if (!mid) {
    throw new Error(atkMessages.ATK_MID_MISSING)
  }

  return mid
}

/**
 * Extract the nid placed in the body class by this hook:
 * automated_testing_kit.module:automated_testing_kit_preprocess_html().
 * @param page {import('@playwright/test').Page}
 * @return {Promise<number>}
 */
async function getNid(page) {
  const bodyClass = await page.evaluate(() => document.body.className)
  const match = bodyClass.match(/node-nid-(\d+)/)
  if (!match) {
    throw new Error(atkMessages.ATK_NID_MISSING)
  }

  // Get the nid.
  return parseInt(match[1], 10)
}

/**
 * Delete currently opened node.
 * @param page {object} Page object.
 * @returns {Promise<void>}
 */
async function deleteCurrentNodeViaUi(page) {
  await page.getByRole('link', { name: 'Delete' }).click()
  await page.getByRole('button', { name: 'Delete' }).click()
}

/**
 * Delete node via UI given a nid.
 *
 * @param {object} page Page object.
 * @param {object} context Context object.
 * @param {int} nid Node ID of item to delete.
 */
async function deleteNodeViaUiWithNid(page, context, nid) {
  const nodeDeleteUrl = atkConfig.nodeDeleteUrl.replace('{nid}', nid)

  // Delete a node page.
  await page.goto(`${baseUrl}${nodeDeleteUrl}`)
  await page.getByRole('button', { name: 'Delete' }).click()

  // Adjust this confirmation to your needs.
  const statusLocator = await page.locator('.messages--status')
  const text = await statusLocator.textContent()
  await expect(text).toContain('has been deleted.')
}

/**
 * Delete node via drush with a given nid.
 *
 * @param nid {number} Node ID.
 * @return {string} Command output.
 */
function deleteNodeWithNid(nid) {
  return execDrush(`entity:delete node ${nid}`)
}

/**
 * Deletes a user account via Drush using the provided email address.
 *
 * @param {string} email - The email address of the account to be deleted.
 * @param {string[]} [options=[]] - An optional array of additional Drush command options.
 * @throws {Error} Throws an error if options is provided but is not an array.
 * @returns {void}
 *
 * @description
 * This function uses Drush to delete a user account based on the given email address.
 * It includes a workaround for a Drush issue where the --mail option requires an argument.
 *
 * @example
 * // Delete a user with email "user@example.com"
 * deleteUserWithEmail("user@example.com");
 *
 * // Delete a user with email "user@example.com" and additional options
 * deleteUserWithEmail("user@example.com", ["--delete-content"]);
 *
 * @todo Remove the "dummy" workaround when using Drush 12.x or later (expected 2025).
 * @see {@link https://github.com/drush-ops/drush/issues/5652|Drush Issue #5652}
 */
function deleteUserWithEmail(email, options = []) {
  if (options === undefined || !Array.isArray(options)) {
    throw new Error('deleteUserWithEmail: Pass an array for options.')
  }

  options.push(`--mail=${email}`)
  const cmd = 'user:cancel -y dummy '

  execDrush(cmd, [], options)
}

/**
 * Deletes a user account via Drush using the provided Drupal user ID.
 *
 * @param {number} uid - The Drupal user ID of the account to be deleted.
 * @param {string[]} [options=[]] - An optional array of additional Drush command options.
 * @throws {Error} Throws an error if options is provided but is not an array.
 * @returns {string} Command output if the command executed successfully.
 * Empty string otherwise.
 *
 * @description
 * This function uses Drush to delete a user account based on the given
 * Drupal user ID. It automatically includes the '--delete-content' option
 * to remove user content along with the account.
 * A workaround is implemented due to a Drush issue where the --uid option
 * requires a name argument.
 *
 * @example
 * // Delete a user with Drupal user ID 123
 * deleteUserWithUid(123);
 *
 * // Delete a user with Drupal user ID 123 and additional options
 * deleteUserWithUid(123, ["--disable-workflow"]);
 *
 * @todo Review and potentially remove the "dummy" workaround in future Drush versions.
 * @see Related to {@link https://github.com/drush-ops/drush/issues/5652|Drush Issue #5652}
 */
function deleteUserWithUid(uid, options = []) {
  if (options === undefined || !Array.isArray(options)) {
    throw new Error('deleteUserWithUid: Pass an array for options.')
  }

  options.push(`--uid=${uid}`)
  options.push('--delete-content')
  const cmd = 'user:cancel -y dummy '

  return execDrush(cmd, [], options)
}

/**
 * Deletes a Drupal user using Drush command.
 *
 * This function executes a Drush command to delete a user from a Drupal site.
 * It uses the `user:cancel` Drush command with the `-y` option for automatic confirmation.
 *
 * @param {string} userName - The Drupal username of the user to be deleted.
 * @param {string[]} [args=[]] - An array of additional string arguments to pass to Drush.
 * @param {string[]} [options=[]] - An array of additional string options to pass to Drush.
 * @throws {Error} Throws an error if args or options are not arrays.
 * @returns {string} Command output if the command executed successfully, empty string
 * otherwise.
 *
 * @example
 * deleteUserWithUserName('johndoe');
 * deleteUserWithUserName('janedoe', ['--delete-content'], ['--notify']);
 */
function deleteUserWithUserName(userName, args = [], options = []) {
  const cmd = `user:cancel -y '${userName}'`

  if (!Array.isArray(args)) {
    throw new Error('deleteUserWithUserName: args must be an array.')
  }

  if (!Array.isArray(options)) {
    throw new Error('deleteUserWithUserName: options must be an array.')
  }

  // Uncomment for debugging.
  // console.log(`Attempting to delete: ${userName}.`)

  return execDrush(cmd, args, options)
}

/**
 * Run drush command locally or remotely depending on the environment.
 * Generally you'll use this function and let it figure out
 * how to execute Drush (locally, remotely, native OS, inside container, etc.).
 *
 * @param {string} cmd The Drush command.
 * @param {array} args Array of string arguments to pass to Drush.
 * @param {array} options Array of string options to pass to Drush.
 * @returns {string} The output from executing the command in a shell.
 */
function execDrush(cmd, args = [], options = []) {
  let output = ''

  if (args === undefined || !Array.isArray(args)) {
    console.error('execDrush: Pass an array for arguments.')
  }

  if (options === undefined || !Array.isArray(options)) {
    console.error('execDrush: Pass an array for options.')
  }

  const drushAlias = getDrushAlias()
  const argsString = args.join(' ')
  const optionsString = options.join(' ')
  const command = `${drushAlias} ${cmd} ${argsString} ${optionsString}`
  // const command = 'echo $PATH'

  // Pantheon needs special handling.
  if (atkConfig.pantheon.isTarget) {
    // sshCmd comes from the test and is set in the before()
    return execPantheonDrush(command) // Returns stdout (not wrapped).
  } if (atkConfig.tugboat.isTarget) {
    return execTugboatDrush(command)
  }
  try {
    console.log(`execDrush cmd: ${command}`)
    // output = execSync(command, { shell: 'bin/bash'}).toString()
    output = execSync(command).toString()

    console.log(`execDrush result: ${output}`)
  } catch (error) {
    console.log(`execDrush error: ${error.message}`)
  }

  return output
}

/**
 * Run a Pantheon Drush command via Terminus.
 * Called by execDrush().
 *
 * @param {string} cmd Drush command; execDrush() constructs this with args and options.
 * @returns {string} The output from executing the command in a shell.
 */
function execPantheonDrush(cmd) {
  let result

  // Construct the Terminus command. Remove "drush" from argument.
  const remoteCmd = `terminus remote:drush ${atkConfig.pantheon.site}.${atkConfig.pantheon.environment} -- ${cmd.substring(5)}`

  console.log(`execPantheonDrush cmd: ${remoteCmd}`)
  result = ''
  try {
    result = execSync(remoteCmd).toString()
    console.log(`execPantheonDrush result: ${result}`)
  } catch (error) {
    console.error(`execPantheonDrush error: ${error}`)
  }

  return result
}

function execTugboatDrush(cmd) {
  const remoteCmd = `tugboat shell ${atkConfig.tugboat.service} command="${cmd}"`

  console.log(`execTugboatDrush cmd: ${remoteCmd}`)
  let result = ''
  try {
    result = execSync(remoteCmd).toString()
    console.log(`execTugboatDrush result: ${result}`)
  } catch (e) {
    console.log(`execTugboatDrush error: ${e}`)
  }

  return result
}

/**
 * Assert presence of a message with given text on the page.
 *
 * @param page Playwright Page object.
 * @param text Text, which the message box should partially match.
 * @return {Promise<void>}
 */
async function expectMessage(page, text) {
  // The status box needs a moment to appear.
  const message = await page.waitForSelector('[aria-label="Status message"]')

  // Should see the thank-you message.
  expect(await message.textContent()).toContain(text)
}

/**
 * Assert that email has been received to the given address and
 * subject.
 *
 * It is done with one of mail capture software which is configured
 * in {@link atkConfig}. If it's not configured, email verification
 * is skipped.
 *
 * @param mailto Recipient email address.
 * @param subject Expected email subject.
 * @return {Promise<void>}
 */
async function expectEmail(mailto, subject) {
  // Helper function to match message subject.
  function matchSubject(actualSubject) {
    if (typeof actualSubject !== 'string') {
      return false
    }
    if (typeof subject === 'string') {
      return actualSubject.includes(subject)
    }
    if (subject instanceof RegExp) {
      return actualSubject.match(subject)
    }
    return false
  }

  // Helper function to match mailto.
  function matchTo(actualTo) {
    if (typeof actualTo !== 'string') {
      return false
    }
    if (mailto instanceof RegExp) {
      return actualTo.match(mailto)
    }
    return actualTo === mailto
  }

  const prov = atkConfig.email?.provider
  if (prov === 'mailpit') {
    const baseURL = new URL(baseUrl).host
    const emailURL = atkConfig.email.url.replace('{baseURL}', baseURL)
    const apiURL = new URL('/api/v1/messages', emailURL)
    // Uncomment for debug.
    // console.log(`Checking emails via ${apiURL}`)

    // Check email via API.
    await fetch(apiURL).then((response) => response.json()).then((response) => {
      // List of objects in format:
      // /* cSpell:disable */
      //     {
      //       "ID": "8EuEhuoAVxZzxxiYrr3TVh",
      //       "MessageID": "UR2Rbn5wjvdxYxQ4n68tpk@mailpit",
      //       "Read": true,
      //       "From": {
      //         "Name": "Automated Testing Kit Demonstration",
      //         "Address": "admin@example.com"
      //       },
      //       "To": [
      //         {
      //           "Name": "",
      //           "Address": "admin@example.com"
      //         }
      //       ],
      //       "Cc": [],
      //       "Bcc": [],
      //       "ReplyTo": [],
      //       "Subject": "New release(s) available for Automated Testing ...",
      //       "Created": "2024-11-26T16:11:17.393Z",
      //       "Tags": [],
      //       "Size": 1236,
      //       "Attachments": 0,
      //       "Snippet": "There is a security update available for your ..."
      //     }
      // /* cSpell:enable */
      const { messages } = response
      expect(messages).toBeTruthy()

      // Find  a proper message:
      const message = messages
        .find((m) => matchTo(m.To[0].Address) && matchSubject(m.Subject))
      expect(message, `To: ${mailto}
Subject: ${subject}`).toBeTruthy()
    })
  } if (prov === 'testmail') {
    const { namespace, apiKey } = atkConfig.email
    const apiURL = `https://api.testmail.app/api/json?apikey=${apiKey}&namespace=${namespace}&pretty=true`
    await fetch(apiURL).then((response) => response.json()).then((response) => {
      if (response.result !== 'success') {
        throw response
      }

      // Find a proper message:
      const message = response.emails
        .find((email) => matchTo(email.to) && matchSubject(email.subject))
      expect(message, `To: ${mailto}
Subject: ${subject}`).toBeTruthy()
    })
  }
  console.warn('Email verification skipped. Configure "email" in playwright.atk.config.js to enable.')
}

/**
 * Returns Drush alias per environment.
 * Adapt this to the mechanism that communicates to the remote server.
 *
 * @returns {string} The Drush command i.e 'lando drush ', etc.
 */
function getDrushAlias() {
  let cmd = ''

  // Drush to Pantheon requires Terminus.
  if (atkConfig.pantheon.isTarget) {
    cmd = 'drush'
  } else if (atkConfig.tugboat.isTarget) {
    cmd = 'vendor/drush/drush/drush'
  } else {
    // Fetch the Drush command appropriate to the operating mode.
    cmd = atkConfig.drushCmd
  }
  return cmd
}

function getUidFromUserObject(result) {
  if (result) {
    // Fetch uid from json object, if present.
    const userJson = JSON.parse(result)

    for (const key in userJson) {
      if (userJson[key].hasOwnProperty('uid')) {
        const uidValue = userJson[key].uid
        return parseInt(uidValue) // Exit the loop once the mail property is found.
      }
    }
  }
}

/**
 * Return the UID of a user given an email.
 *
 * @param {string} email Email of the account.
 * @returns {number} UID of user.
 */
function getUidWithEmail(email) {
  const cmd = `user:info --mail=${email} --format=json`

  const result = execDrush(cmd)
  return getUidFromUserObject(result)
}

/**
 * Return the Username of a user given an email.
 *
 * @param {string} email Email of the account.
 * @returns {string|null} Username of user.
 */
function getUsernameWithEmail(email) {
  const cmd = `user:info --mail=${email} --format=json`
  const result = execDrush(cmd)

  // Fetch name from json object, if present.
  let nameValue = null
  if (result) {
    // Expecting a string in json form.
    nameValue = Object.values(JSON.parse(result))[0]?.name
  }
  return nameValue
}

/**
 * Inputs text into a specific CKEditor instance on a Playwright-controlled page.
 *
 * This function waits for CKEditor elements to be present on the page,
 * then attempts to input the provided text into the specified editor instance.
 * If no instance number is provided, it defaults to the first editor found.
 *
 * @async
 * @param {import('playwright').Page} page - The Playwright Page object representing the web page.
 * @param {string} text - The text to be input into the CKEditor.
 * @param {number} [instanceNumber=0] - The zero-based index of the CKEditor instance
 *                                      to target (default is 0, i.e., the first instance).
 * @throws {Error} Throws an error if the specified CKEditor instance is
 *                 not found or if unable to input text.
 * @returns {Promise<void>}
 *
 * @example
 * // Input text into the first CKEditor instance
 * await inputTextIntoCKEditor(page, 'Hello, world!');
 *
 * // Input text into the third CKEditor instance (index 2)
 * await inputTextIntoCKEditor(page, 'Hello, third editor!', 2);
 */
async function inputTextIntoCKEditor(page, text, instanceNumber = 0) {
  // Wait for the text areas to appear.
  await page.waitForSelector('.ck-editor__editable')

  // Type into the specified CKEditor instance found on the page.
  await page.evaluate(
    ({ inputText, editorIndex }) => {
      const editorElements = document.querySelectorAll('.ck-editor__editable')
      if (editorElements.length > editorIndex) {
        const targetEditorElement = editorElements[editorIndex]

        // Attempt to get the CKEditor instance.
        const editorInstance = targetEditorElement.ckeditorInstance
        // eslint-disable-next-line no-undef
              || Object.values(CKEDITOR.instances)[editorIndex]
        // eslint-disable-next-line no-undef
              || Object.values(ClassicEditor.instances)[editorIndex]

        if (editorInstance) {
          // Set the data in the editor.
          if (typeof editorInstance.setData === 'function') {
            editorInstance.setData(inputText)
          } else if (typeof editorInstance.getData === 'function' && typeof editorInstance.insertHtml === 'function') {
            // For older CKEditor versions.
            editorInstance.setData('')
            editorInstance.insertHtml(inputText)
          } else {
            throw new Error('Unable to set data: setData method not found')
          }
        } else {
          throw new Error(`CKEditor instance not found at index ${editorIndex}`)
        }
      } else {
        throw new Error(`No CKEditor element found at index ${editorIndex}`)
      }
    },
    {
      inputText: text,
      editorIndex: instanceNumber,
    },
  )
}

/**
 * Log in via the login form.
 *
 * @param {object} page Page object.
 * @param {object} context Context object.
 * @param {object} account JSON object see structure of qaUserAccounts.json.
 */
async function logInViaForm(page, context, account) {
  await context.clearCookies()
  await page.goto(`${baseUrl}${atkConfig.logInUrl}`)
  await page.getByLabel('Username').fill(account.userName)
  await page.getByLabel('Password').fill(account.userPassword)
  await page.getByRole('button', { name: 'Log in' }).click()

  await page.waitForLoadState('domcontentloaded')
  await expect(page.getByText('Member for')).toBeVisible()

  // Keep the stored state in the support directory.
  const authFile = `${atkConfig.supportDir}/loginAuth.json`
  await page.context().storageState({ path: authFile })
}

/**
 * Log in with user:login given a user id.
 *
 * @param {object} page Page object.
 * @param {object} context Context object.
 * @param {integer} uid Drupal user id.
 */
async function logInViaUli(page, context, uid) {
  let cmd = ''
  let url = ''

  await logOutViaUi(page, context)

  let newUid

  if (uid === undefined) {
    newUid = 1
  } else {
    newUid = uid
  }

  cmd = `user:login --uid=${newUid}`
  url = execDrush(cmd, [], [`--uri=${baseUrl}`])

  await page.goto(url) // Drush returns fully formed URL.
}

/**
 * Log out user via the UI.
 *
 * @param {import('@playwright/test').Page} page Page object.
 */
async function logOutViaUi(page) {
  const url = `${baseUrl}${atkConfig.logOutUrl}`

  await page.goto(url)
  if (page.url().includes('confirm')) {
    await page.locator('input[value="Log out"]').click()
  }
}

/**
 * Get Drupal configuration via drush.
 *
 * @param objectName {string} Name of configuration category.
 * @param key {string} Name of configuration setting.
 * @return {*} Value of configuration setting.
 */
function getDrupalConfiguration(objectName, key) {
  const cmd = `cget ${objectName} ${key} --format=json`

  const output = execDrush(cmd)
  const settingObj = JSON.parse(output)
  return settingObj[`${objectName}:${key}`]
}

/**
 * Set Drupal configuration via drush.
 *
 * @param {string} objectName Name of configuration category.
 * @param {string} key Name of configuration setting.
 * @param {*} value Value of configuration setting.
 */
function setDrupalConfiguration(objectName, key, value) {
  const cmd = `cset -y --input-format=yaml ${objectName} ${key} '${JSON.stringify(value)}'`

  execDrush(cmd)
}

// Check global prerequisites.
// (Once per test run.)
const prerequisites = readYAML('atk_prerequisites.yml')
const { prerequisitesOk } = globalThis
if (prerequisitesOk === undefined) {
  globalThis.prerequisitesOk = false
  const errorList = []
  // eslint-disable-next-line no-restricted-syntax
  for (const prerequisite of prerequisites) {
    console.debug('Pre-flight test is about to run: %s', prerequisite.message)
    if ('command' in prerequisite) {
      const output = execDrush(prerequisite.command)
      if (prerequisite.json) {
        const outputJson = JSON.parse(output)
        // Each property of prerequisite.json is a condition.
        // eslint-disable-next-line no-restricted-syntax,prefer-const
        for (let [key, condition] of Object.entries(prerequisite.json)) {
          const value = getProperty(outputJson, key)
          if (typeof condition !== 'object') {
            condition = { eq: condition }
          }
          // eslint-disable-next-line no-restricted-syntax
          for (const [conditionType, conditionValue] of Object.entries(condition)) {
            try {
              switch (conditionType) {
                case 'eq':
                  // expect() ignores message if raised outside a test.
                  expect(value).toEqual(conditionValue)
                  break
                  // ...
                default:
                  throw new Error(`Condition ${conditionType} is not implemented`)
              }
            } catch (e) {
              errorList.push(e)
            }
          }

          if (errorList.length) {
            throw new Error(`${prerequisite.message}\n${errorList}`)
          }
        }
      }
    }
  }
  globalThis.prerequisitesOk = true
}

/**
 * Open a Search Form regardless of desktop / mobile design.
 *
 * @param page {import('@playwright/test').Page} Page Object
 * @returns {Promise<void>}
 */
async function openSearchForm(page) {
  // Handle "responsive design". If "Search form" isn't visible,
  // have to click main menu button first.

  const searchForm = page.getByLabel('Search Form')
  await searchForm.waitFor()
  if (!(await searchForm.isVisible())) {
    await page.getByLabel('Main Menu').click()
  }
  await searchForm.click()
}

/**
 * Check search result, using expectation setup in data/search.yml.
 *
 * @param page {import('@playwright/test').Page} Page Object
 * @param item {{results: [string]}} Item of the data/search.yml
 * @returns {Promise<void>}
 */
async function checkSearchResult(page, item) {
  // Wait at least one result to be visible.
  await expect(page.locator('.search-result__title').last()).toBeVisible()

  const resultLocatorList = await page.locator('.search-result__title').all()
  const resultList = (await (Promise.all(resultLocatorList
    .map((resultLocator) => resultLocator.textContent()))))
    .map((s) => s.trim())

  // eslint-disable-next-line no-restricted-syntax
  for (const result of item.results) {
    expect(resultList).toContain(result)
  }
}

export {
  createUserWithUserObject,
  getMid,
  getNid,
  deleteCurrentNodeViaUi,
  deleteNodeViaUiWithNid,
  deleteNodeWithNid,
  deleteUserWithEmail,
  deleteUserWithUid,
  deleteUserWithUserName,
  execDrush,
  execPantheonDrush,
  expectEmail,
  expectMessage,
  getDrushAlias,
  getUidWithEmail,
  getUsernameWithEmail,
  inputTextIntoCKEditor,
  logInViaForm,
  logInViaUli,
  logOutViaUi,
  getDrupalConfiguration,
  setDrupalConfiguration,
  openSearchForm,
  checkSearchResult,
}
