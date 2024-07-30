import atkConfig from './playwright.atk.config.js';

const rpconfig = {
  endpoint: "http://127.0.0.1:8080/api/v1",
  apiKey: "local_FfldjGJhTaemxy3XaFuFle2htVGApdPr3EmX1e0KFaRToKPbKKHnAqQbVdKICbCR",
  project: "default_personal",
  launch: "Launch name",
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
