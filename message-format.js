/**
 * Format a message, using environment variables (must be set in a job).
 * - JOB_URL        URL of the job in the CI/CD engine
 * - JOB_NUMBER     number of the run
 * - JOB_NAME       name of the job (workflow)
 * - JOB_STATUS     status of the job
 * - JOB_ENV        environment which a job runs against, if any
 * - JOB_DURATION   duration of the run, milliseconds
 * @param type Type of the message:
 * 'subject': email subject;
 * 'text': email plain text;
 * 'html': email HTML message;
 * 'slack': Slack message object;
 */
module.exports = function ({ type }) {

  let testMessage;
  let report;
  try {
    report = require('./ctrf/ctrf-report.json');
    const { tests, failed, passed, skipped } = report.results.summary;
    testMessage = `✅${passed} passed`;
    if (passed < tests) {
      testMessage = `❌${failed} failed | ${testMessage} | 🚫${skipped} skipped`;
    }
  } catch (_) {
    testMessage = "🔴CTRF Report missing. Check workflow steps."
  }

  let testDurationMs = parseInt(process.env.JOB_DURATION);
  if (!testDurationMs && report) {
    const { start, stop } = report.results.summary;
    testDurationMs = stop - start;
  }

  // human readable test duration
  let testDuration;
  let testDurationS, testDurationM, testDurationH;
  testDurationS = Math.floor(testDurationMs / 1000);
  if (!testDurationMs) {
    testDuration = undefined;
  } else if (testDurationS < 1) {
    testDuration = type === 'text' ? '< 1s' : '&lt; 1s';
  } else if (testDurationS < 60) {
    testDuration = `${testDurationS}s`;
  } else {
    testDurationM = Math.floor(testDurationS / 60);
    testDurationS = testDurationS - testDurationM * 60;
    if (testDurationM < 60) {
      testDuration = `${testDurationM}m ${testDurationS}s`;
    } else {
      testDurationH = Math.floor(testDurationM / 60);
      testDurationM = testDurationM - testDurationH * 60;
      testDuration = `${testDurationH}h ${testDurationM}m ${testDurationS}s`;
    }
  }

  // Job name is a workflow name in GitHub Actions.
  let jobName = process.env.JOB_NAME || '$JOB_NAME';

  // Job number is a sequential number of the given workflow run.
  let jobNumber = process.env.JOB_NUMBER;

  // URL of the job.
  let jobURL = process.env.JOB_URL || '#';

  // Git branch.
  let jobBranch = process.env.JOB_BRANCH || '$JOB_BRANCH';

  // Test environment
  let jobEnv = process.env.JOB_ENV || '$JOB_ENV';
  if (jobEnv.match(/^http[s]?:\/\//)) {
    // If env is URL, format it properly (for HTML and Slack)
    let url = new URL(jobEnv);
    if (type === 'html') {
      jobEnv = `<a href="${jobEnv}">${url.hostname}</a>`;
    } else if (type === 'slack') {
      jobEnv = `<${jobEnv}|${url.hostname}>`;
    }
  }

  switch (type) {
    case 'subject':
      let mailsubjectPattern = process.env.MAIL_SUBJECT || '$JOB_NAME #$JOB_NUMBER $JOB_STATUS';
      return mailsubjectPattern.replaceAll(/\$\w+/g, match => process.env[match.substring(1)]);

    case 'text':
      return `${testMessage}\n${jobURL}`;

    case 'html':
      return `
<p>${testMessage}</p>
<p>on branch <code>${jobBranch}</code> against ${jobEnv}</p>
${testDuration ? `<p>⏱${testDuration}</p>` : ''}
<p><a href="${jobURL}">View workflow run</a></p>`;

    case 'slack':
      return {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${jobName}${jobNumber ? ` #${jobNumber}` : ''}`
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: testMessage
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `on branch \`${jobBranch}\` against ${jobEnv} | ⏱${testDuration}`
            }
          },
          {
            type: 'actions',
            elements: [{
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View workflow run',
                emoji: true
              },
              url: jobURL
            }],
          }
        ]
      }
    default:
      return testMessage;
  }
}
