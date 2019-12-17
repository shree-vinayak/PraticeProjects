'use strict';

import { environment } from '../../environments/environment';

//Base Url
export class Base {
  static url: string = environment.apiUrl;
  // static url: string = 'http://192.168.31.218:3000/version';
  // static url: string = 'http://192.168.31.232:3000/';
}

//Test Url
// export class Test {
//   static url: string = 'http://192.168.1.53:3000/';
// }

//Production Url
// export class Production {
//   static url: string = 'http://54.255.253.193/api/';
// }

// export class Local {
//   static url: string = 'http://192.168.1.5:3000/';
// }

export class Print {
  static url: string = 'https://zetta-pdf.net/';
}

export class AlertUrl {
  static autocomplete: string = Base.url + 'admtc/alert-functionality/user-type';
  static url: string = Base.url + 'admtc/alert-functionality/';
  static alertUserUrl: string = Base.url + 'alert-functionality';
}

export class Server {
  static url: string = Base.url;
}

export class ProposalToCR {
  // static postUrl: string = Base.url + "";
  static postUrl: string = Base.url + 'sales/proposal/';
}

export class ProposalToPC {
  // static postUrl: string = Base.url + "";
  static postUrl: string = Base.url + 'sales/proposal/';
}

export class ContractToCR {
  static postUrl: string = Base.url + 'sales/contract/';
}

export class Certifiers {
  static getUrl: string = Base.url + 'sales/schools';
}

export class Recipients {
  static getUrl: string = Base.url + 'sales/contacts';
}

export class RncpTitle {
  static getUrl: string = Base.url + 'academic/rncp-titles';
  static getUrlShortName: string = Base.url + 'academic/rncpShortName';
  static getRNCPDetails: string = Base.url + 'academic/getRncpSpecializationToEdit/';
  static rncpSpecializationsEdit: string = Base.url + 'academic/saveUpdatedRNCPSpecialization/';
  // static getUrl: string = Test.url + "sales/rncp-titles";
  //   static getUrl: string = Production.url + "sales/rncp-titles";
  // static getUrl: string = Local.url + "sales/rncp-titles";
}

export class Subject {
  static url: string = Base.url + 'academic/subject';
}
export class Expertise {
  static url: string = Base.url + 'academic/expertise';
  static multipleUpdate: string = Base.url + 'academic/multiple/expertise';
}

export class RncpTitlesSchool {
  static getUrl: string = Base.url + 'academic/school/';
}

export class ScholerSeason {
  static getUrl: string = Base.url + 'academic/scholarseason';
  static notinSeasonUrl: string = Base.url + 'academic/rncptitlesnotinscholarseason';
  static associatedScholarSeason: string = Base.url + 'academic/rncp-titles/';
  static getSeasonsbyRncpUrl: string = Base.url + 'academic/scholarSeason/rncpTitle/';
}

export class Deal {
  static getById: string = Base.url + 'sales/deals';
}

export class RefernceGeneration {
  static getByTitleId: string = Base.url + 'sales/reference-gen';
}

export class Auth {
  static signin: string = Base.url + 'login';
}

export class Archive {
  static archive: string = Base.url + 'sales/tasks';
}

export class FileUpload {
  // static uploadUrl: string = Local.url + "file";
  static uploadUrl: string = Base.url + 'academic/file-upload/';
  // static uploadUrl: string = Test.url + "academic/document/";
}

export class Files {
  static url: string = Base.url;
}

export class Categories {
  static url: string = Base.url + 'academic/categories';
  // static url: string = Production.url + "academic/categories";
}

export class Documents {
  static url: string = Base.url + 'academic/documents';
  static addDocToTest: string = Base.url + 'academic/test/';
  static getallDocTest: string = Base.url + 'academic/documents?view=studentTestDocuments';
  static studentDocuments: string = Base.url + 'academic/acaddocuments/student';
  static documentSearchFilter: string = Base.url + 'academic/acadDocumentSearch';
  static validateDocument: string = Base.url + 'testCorrection/';
  static downloadAllDocs: string = Base.url + 'academic/acadDocuments/download';
  // static url: string = Production.url + "academic/documents";
}

export class Tests {
  static url: string = Base.url + 'academic/tests';
  static getTestsBasedOnClass = Base.url + 'academic/getTestBaseOnClass/';
  static getGroupTests = Base.url + 'academic/group-test/';
  // static url: string = Production.url + "academic/tests";
}

export class SearchTests {
  static url: string = Base.url + 'academic/kit/search';
  // static url: string =  Production.url + "academic/kit/search"; //Local.url + "tests";
}

export class TestCorrections {
  static url: string = Base.url + 'academic/test';
  static finalRetakeStudents: string = Base.url + 'academic/tests/validateStudentsForFinalRetake/';
}

export class PendingTasks {
  static url: string = Base.url + 'academic/tasks/pending';
}

export class Calenderstep {
  static getUrl: string = Base.url + 'academic/calanderSteps/';
}

export class Students {
  static url: string = Base.url + 'students';
  static studentTable: string = Base.url + 'academic/student/getStudentFromSchool'; // Student With Data for Student Table
  static getStudentsToExport: string = Base.url + 'academic/export/csv/grouptest/';
}

export class StudentURL {
  static url: string = Base.url + 'student';
  static unRegisteredStudents: string = StudentURL.url + '/getUnRegisteredCount';
}

export class UpcomingEvents {
  static url: string = Base.url + 'academic/events/rncp/';
  static setUrl: string = Base.url + 'academic/events';
}

export class Users {
  static commonUser: string = Base.url + 'user';
  static url: string = Base.url + 'academic/users'; // ToDo: This is to be removed, as we are using above API
  static registerUser: string = Base.url + 'register';
  static getUser: string = Base.url + 'user';
  static getUserListView: string = Base.url + 'academic/user/dashboard';
  static getUserByFilter: string = Base.url + 'users/filter';
  static getmentor: string = Base.url + 'academic/registeredmentors';
  static transferUserResponsibility: string = Base.url + 'academic/user/transferResponsibility';
  static getUsersToAssignTask: string = Base.url + 'academic/user/getBasicDetails';

  //Users that have User Type Corrector and linked to this School + Title + All Acad Staff linked to School + this Title
  static getAcadStaffAndCorrectorUsers: string = Base.url + 'users/getUserForAssignCorrector';
}

export class Entity {
  static getUserTypeUrl: string = Base.url + 'user/types';
  //user/ types?entity=admtc
}

export class Login {
  static url: string = Base.url + 'login';
}

export class Sales {
  static schoolUrl: string = Base.url + 'academic/schools/';
}

export class UserTypes {
  static userTypesUrl: string = Base.url + 'academic/user/types';
  static userTypesUrlByEntity: string = Base.url + 'academic/user/types';
  static userTypesUrlADMTC: string = Base.url + 'admtc/user/types';
}

export class Classes {
  static classUrl: string = Base.url + 'academic/classes';
}


export class IdeasURL {
  static url: string = Base.url + 'academic/ideas/';
}

export class IdeasCategoryURL {
  static url: string = Base.url + '/academic/idea/category';
}

export class GlobalRncpTitle {
  static url: string = Base.url + 'academic/rncp-title/';
}

export class StudentRegistration {
  static url: string = Base.url + '/academic/student/details/';
}

export class JobDescriptionURL {
  static url: string = Base.url + 'academic/jobDescription/';
  static urlStep4: string = Base.url + 'jobDescription/validatedByAcadStaff/';
}

export class UserTypeJobdescriptionURL {
  static url: string = Base.url + 'academic/jobDescription/';
}

export class LinkedTests {
  static url: string = Base.url + '/academic/linkedTests/';
}
export class EmailTemplate {
  static url: string = Base.url + 'academic/mailTemplates';
  static url2: string = Base.url + 'academic/mailTemplate';
}
export class Questionnaire {
  static url: string = Base.url + 'academic/questionnaireTemplates';
  static url2: string = Base.url + 'academic/questionnaireTemplate';
}
export class MentorEvaluation {
  static url: string = Base.url + 'academic/mentorEvaluation';
  static urlResponse: string = Base.url + 'academic/mentorEvaluationResponse';
}
export class Companies {
  static url: string = Base.url + 'academic/companies';
}

export class CloneKit {
  static url: string = Base.url + 'academic/cloneKit';
}

export class BasicKit {
  static url: string = Base.url + 'academic/addBasicKit';
}

export class ACADEMICTASKS {
  static url: string = Base.url + 'academic/tasks';
  static completeTask: string = Base.url + 'academic/tasks/taskCompletion/';
  static markAllMarksEntryAsDone: string = Base.url + 'academic/test-correction/markAllMarksEntryAsDone/';
  static taskIdFromTestId: string = Base.url + 'academic/tasks/getMarksEntryTask/';
  static expectedDocTaskUrl: string = Base.url + 'academic/test/';
  static getTaskIdForCreateGroups: string = Base.url + 'academic/getCreateGroupTask';
  static getTasksBasedOnTest: string = Base.url + 'academic/tasks/getParentTaskFromTest/';
  static generateManualTestTaskForUser: string = Base.url + 'academic/task/generateAutoTask';
}
export class MailBox {
  static url: string = Base.url + 'academic/mails';
  static unreadUrl: string = Base.url + 'academic/mail/getMailCount';
  static InfoByMailId: string = Base.url + 'users/getBasicInfoByEmail';
  static urgntMails: string = Base.url + 'academic/mail';
  static mailUrl: string = Base.url + 'academic/mail/sendContactUs';
}
export class StudentSearch {
  static url: string = Base.url + 'studentSearch';
  static getNumberOfStudents: string = Base.url + 'academic/student/getNumberOfStudents';
}

export class AssignCorrector {
  static assignCorrectorUrl: string = Base.url + 'academic/test/';
  static finalRetakeAssignCorrector: string = Base.url + 'academic/test/';
}

export class NotificationHistory {
  static getAllHistories: string = Base.url + 'academic/notificationHistory';
}

export class DownloadAnyFileOrDocFromS3 {
  static download: string = Base.url + 'academic/s3/getS3Object/';
}

export class QuestionnaireTools {
  static cloneQuestUrl: string = Base.url + 'cloneQuestionnarieTemplate';
  static deleteQuestionnaire: string = Base.url + 'deleteQuestionnaire/';
}
export class EmployabilitySurvey {
  static sendUrl: string = Base.url + 'academic/employabilitySurvey/send';
  static updateSurvey: string = Base.url + 'academic/employabilitySurvey/update/';
  static getSurvey: string = Base.url + 'academic/employabilitySurvey/';
  static remindUrl: string = Base.url + 'academic/employabilitySurvey/remind';
}
export class optimizedRNCPtitles {
  static getUrl: string = Base.url + 'academic/rncp/dashboard';
}

export class thumbsUp {
  static sendUrl: string = Base.url + 'academic/thumbsup';
}

export class SocialLogin {
  static socialLogin: string = Base.url + 'academic/auth/socialLogin';
  static socialRegister: string = Base.url + 'academic/auth/socialRegister/';
  static viadeoLogin: string = 'https://partners.viadeo.com/oauth/authorize';
}
