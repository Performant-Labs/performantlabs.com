import atkConfig from './playwright.atk.config.js';

const rpconfig = {
  endpoint: "https://reportportal.performantlabs.com/api/v1",
  apiKey: process.env.REPORT_PORTAL_API_TOKEN,
  project: "performantlabs",
  launch: "Playwright tests",
  description: "My awesome launch",
  attributes: [
    {
      key: "env",
      value: atkConfig.pantheon.isTarget ? atkConfig.pantheon.environment :
        (atkConfig.tugboat.isTarget ? 'tugboat' : 'local'),
    },
    // {
    //   value: atkConfig.baseURL,
    // },
  ],
  mode: 'DEFAULT',

  includeTestSteps: true,
  uploadVideo: true,
}

export default rpconfig;
