// Check that environment is set
const missingVars =
  ['MAIL_TLS_ENABLE', 'MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASSWORD',
  'MAIL_FROM', 'MAIL_TO', 'MAIL_SUBJECT'].filter((key) => !process.env[key]);
if (missingVars.length) {
  console.error("Environment variables are missing: " + missingVars.join(', '));
  process.exit(1);
}

// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

// Import message formatter
const messageFormat = require('./message-format');

// Create a SMTP transporter object
let tlsEnable = process.env.MAIL_TLS_ENABLE === 'true';
let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secureConnection: !tlsEnable,  // TLS requires secureConnection to be false
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
  tls: !tlsEnable ? undefined : {
    ciphers: 'SSLv3'
  }
});

// Message object
let subject = messageFormat({ type: 'subject' });
let message = {
  from: process.env.MAIL_FROM,
  to: process.env.MAIL_TO,
  subject: subject,
  text: messageFormat({ type: 'text' }),
  html: messageFormat({ type: 'html' })
};

transporter.sendMail(message, (err, info) => {
  if (err) {
    console.log('Error occurred. ' + err.message);
    return process.exit(1);
  }

  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});
