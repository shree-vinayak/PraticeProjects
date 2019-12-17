// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  envName: 'dev',

  // Url Settings
  apiUrl: 'http://localhost:3000/',

  // Google Recaptcha
  recaptchaKey: '6LetISsUAAAAALd_YWfQi8A93dOWyFGoDpBfEyZt',

  // Image Assets Path
  imageBasePath: '../',

  // Default lang
  defaultApplicationLanguageCode: 'en',
  defaultApplicationLanguage: 'ENGLISH',
};
