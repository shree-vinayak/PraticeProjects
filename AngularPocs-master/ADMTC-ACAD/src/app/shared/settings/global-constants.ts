import { environment } from '../../../environments/environment';

export const GlobalConstants = {


  /*************************************************************************
   *  String Name Constants
  *************************************************************************/
  tokenName: 'access_token',
  jobDescToken: 'jobDescriptionTokenURL',
  lang: 'currentLanguage',
  localStorageKeys: {
    tokenName: 'token',
    loggedUser: 'loginuser',
    timeStamp: 'timeStamp'
  },


  /*************************************************************************
   *  Number Constants
  *************************************************************************/
  // No of Records to be shown Per Page
  NoOfRecordsPerPage: 20,

  // Max Digits Allowed in ZIP Code
  zipcodeMaxLength: 5,

  // Tagline Max Allowed Limit.
  taglineMaxAllowedLimit: 75,

  // Idle User(inactivity) timeout limit
  userInactiveLimit: (30 * 60),

  // timeStamp Limit (into seconds)
  timeStampLimit: (30 * 60),

  // timeInterval (into mili seconds)
  timeInterval: (60 * 1000),

  // Sec Swal confirm Disabled
  timeDisabledinSecForSwal: 6,

  //sec Swal confirm Disabled mini
  timeDisabledinSecForSwalMini: 3,

  /*************************************************************************
   *  Misc Constants
  *************************************************************************/
  admtcAdminEmail: 'corinne.crespin@admtc.pro',
  correctionTypes: [
    {
      value: 'pc',
      view: 'Cross Correction'
    },
    {
      value: 'cp',
      view: 'Certifier'
    },
    {
      value: 'free',
      view: 'Preparation Centre'
    },
    {
      value: 'ADMTC',
      view: 'ADMTC'
    }
  ],
  TestType: [
    { key: 'Oral', value: 'Oral' },
    { key: 'Written', value: 'Written' },
    { key: 'Memoire-ECRIT', value: 'Memoire-ECRIT' },
    { key: 'Memoire-ORAL', value: 'Memoire-ORAL' },
    { key: 'free-continuous-control', value: 'free-continuous-control' },
    { key: 'mentor-evaluation', value: 'mentor-evaluation' },
    { key: 'Jury', value: 'Jury' },
    { key: 'School-Mentor-Evaluation', value: 'School-Mentor-Evaluation' },
    //  { key: 'Business-Game', value: 'Business-Game' },
    // { key: 'CaseStudies', value: 'case-studies' },
    // { key: 'Memoire', value: 'Memoire' }
    // { key: 'SkillsAssessment', value: 'SkillsAssessment' },
    // { key: 'Competition', value: 'Competition' },
    // { key: 'ExamenExterne', value: 'External Test (TOEIC, etc.)' },
  ],

  // Privay Policy Links
  privacyPolicy: {
    ENLink: 'privacy/EN.html',
    FRLink: 'privacy/FR.html'
  },

  linkedInClientId: '81bwooljjj46c7',
  viadeoClientId: 'd4d94e40e29eded557443491e7301004',

  // Mentor Guide Google Doc Link
  mentorGuideLink: 'https://docs.google.com/presentation/d/1DfIMNElsozxqzdYDMqj13FlhQ2vLOT-zGRUIn1nApnM/edit#slide=id.g37dcc0e565_0_441',

  googleRecaptchaKey: environment.recaptchaKey,

};
