import atkConfig from './playwright.atk.config.js';

const rpconfig = {
  endpoint: "https://reportportal.performantlabs.com/api/v1",
  apiKey: "playwright-tests_amr-RR6oQG2FH0lilzVLS89XOFFef8T0zgr5r834vmTuAAOYEEFKvo1a0xH4GxzZ",
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
