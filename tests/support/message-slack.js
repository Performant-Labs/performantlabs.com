// Check that environment is set
const missingVars =
  ['SLACK_WEBHOOK_URL'].filter((key) => !process.env[key]);
if (missingVars.length) {
  console.error("Environment variables are missing: " + missingVars.join(', '));
  process.exit(1);
}

// Import message formatter
const messageFormat = require('./message-format');

fetch(process.env.SLACK_WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(messageFormat({ type: 'slack' }))
}).then(
  (result) => {
    console.log("Message has been sent.")
    return result.text();
  },
  (error) => {
    console.error("Error sending message to Slack");
    console.error(error);
    process.exit(1);
  }
).then((payload) => {
  console.log(payload);
});
