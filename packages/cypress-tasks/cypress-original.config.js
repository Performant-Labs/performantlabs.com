// Pull in Cypress.
const { defineConfig } = require('cypress')
// For working with the file system.
const fs = require('fs');
// For testing downloads.
const { isFileExist } = require('cy-verify-downloads');
// For testing downloaded Excel spreadsheets.
const xlsx = require('node-xlsx').default;
// For working with file and directory paths.
const path = require('path');
// Allow spawning a child process, such as for Drush.
const exec = require('child_process');

module.exports = defineConfig({
  // Used by Cypress.io
  projectId: '6dct42',
  pageLoadTimeout: 10000,
  requestTimeout : 10000,
  responseTimeout : 10000,
  defaultCommandTimeout: 10000,
  numTestsKeptInMemory: 0,
  screenshotOnRunFailure: false,
  video: false,
  chromeWebSecurity: false,
  retries: {
    // Configure retry attempts for 'cypress run'.
    // Default is 0.
    runMode: 3,
    // Configure retry attempts for 'cypress open'.
    // Default is 0
    openMode: 0
  },
  // Speed up tests by blocking unneeded calls.
  blockHosts: [
    "www.google-analytics.com",
    "stats.g.doubleclick.net",
    "www.google.com",
    "connect.facebook.net",
    "www.facebook.com",
    "px.ads.linkedin.com",
    "www.linkedin.com",
    "www.googletagmanager.com",
  ],
  env: {
    grepFilterSpecs: true,
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    // Enable experimental Cypress features.
    experimentalSessionAndOrigin: true,
    baseUrl: 'https://www.performantlabs.com',
    setupNodeEvents(on, config) {
      // register the "cypress-log-to-term" plugin
      // https://github.com/bahmutov/cypress-log-to-term
      // IMPORTANT: pass the "on" callback argument
      require('cypress-log-to-term')(on)

      // Test for presence of a file.
      on('task', {
        fileExists(filename) {
          if (fs.existsSync(filename)) {
            return true
          }
          return null
        },
      }),

      // Return size of a file.
      on('task', {
        getFileSize(filename) {
          if (fs.existsSync(filename)) {
            var stats = fs.statSync(filename)
            var fileSizeInBytes = stats.size;
            // Convert the file size to megabytes.
            return fileSizeInBytes / (1024 * 1024);
          }
          return null
        },
      }),

      // Return parsed XLS file.
      on('task', {
        parseXlsx({filePath}) {
          return new Promise((resolve, reject) => {
            try {
              const jsonData = xlsx.parse(fs.readFileSync(filePath));
              resolve(jsonData);
            }
            catch (e) {
              reject(e);
            }
          });
        },
      }),

      // Output a message to the console.log.
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })

      //
      // Check if translations exist and are current; regenerate them if not.
      //
      let translations = config.env.translations
      // How many hours old allowed.
      let youngerThan = 24

      // Set the languages here.
      // const languages = ["ja", "zh"]
      const languages = []

      // Load the translations.
      let loaded = true

      let translationsFolder = config.env.translationsFolder
      if (translationsFolder === undefined) {
        translationsFolder = `${config.fileServerFolder}/docroot/sites/default/files`
      }

      console.log("Check if translations are present and up to date.")

      let translation = translations['ja']
      let xf = `${translationsFolder}/${translation.file}`
      let regenerate = false
      let statObj
      try {
        if (!fs.existsSync(xf)) {
          regenerate = true
          console.log(`${xf} does not exist...need to generate translations.`)
        }
        else {
          statObj = fs.statSync(xf)

          // Determine if file is older than allowed.
          const diff = ((new Date()).getTime() - statObj.ctimeMs) / 1000
          if (diff > (youngerThan * 3600)) {
            regenerate = true;
            for (const language of languages) {
              translation = translations[language]
              fs.unlinkSync(`${translationsFolder}/${translation.file}`)
            }
            console.log(`Translations are ${diff} seconds old; need to re-generate them.`)
          }
        }
      }
      catch (e) {
        console.error(e.toString)
        regenerate = true
      }

      if (regenerate) {
        let drush = 'drush'
        let uname
        try {
          uname = exec.execSync('uname')
          // This was designed for teams using containers.
          // if (uname.toString().trim() === 'Darwin') {
          //   drush = 'fin drush'
          // }
          let cmd = `${drush} scr project/scripts/cypress/export-translations.php`
          console.log("Running ... " + cmd)
          exec.execSync(cmd)
          if (!fs.existsSync(xf)) {
            console.error('Failed to generate translations :(')
          }
        }
        catch (e) {
          console.log(e.toString())
          console.log('Cannot run regeneration scripts...run them manually.')
        }
      }

      for (const language of languages) {
        translation = translations[language]
        xf = `${translationsFolder}/${translation.file}`
        if (fs.existsSync(xf)) {
          console.log("Loading translations from %s", xf)
          let data = fs.readFileSync(xf)
          translation.translation = JSON.parse(data)
        }
        else {
          console.warn('Translation file: %s is missing.', xf)
          loaded = false
        }
      }

      if (!loaded) {
        console.warn('Generate translations by running "drush scr project/scripts/cypress/build-translations.php"')
      }

      config.translations = translations

      return config
    },
  }
})
