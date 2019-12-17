import { environment } from '../../../environments/environment';

const envUrlAppends = {
    academic: environment.apiUrl + 'academic/',
    student: environment.apiUrl + 'student/',
    acadStudents: environment.apiUrl + 'academic/students/',
    users: environment.apiUrl + 'users/',
    user: environment.apiUrl + 'user/',
    mentorEvaluation: environment.apiUrl + 'mentorEvaluation/',
    jobDescription: environment.apiUrl + 'academic/jobDescription/',
    questionnaire: environment.apiUrl
}

export const ApplicationUrls = {
    baseApi: environment.apiUrl,
    imageBasePath: environment.imageBasePath,
    student: {
      getStudentIdByEmail:envUrlAppends.student + 'getIdByEmail/',
      studentBase :  envUrlAppends.student,
      studentsRegistrationEmail: envUrlAppends.student + 'trigger/registerMail/',
      getStudentsForAdmtcTable : envUrlAppends.acadStudents + 'getStudentsForAdmtcTable'
    },
    jobDescription: {
      reminderMailStudent:  envUrlAppends.jobDescription +'remindStudent/',
      reminderMailMentor: envUrlAppends.jobDescription +'remindMentor/'
    },
    users: {
      userByFilter: envUrlAppends.users + 'filter',
      createdByDetails: envUrlAppends.users  + 'createdByDetails/'
    },
    user: {
      userTypeCollection: envUrlAppends.user + 'types?isUserCollection=',
      emailCheck: envUrlAppends.user + 'check/email'
    },
    mentorEvaluation:{
      searchQuestionnaireTemplate:envUrlAppends.mentorEvaluation + 'questionnaireTemplate/Search',
      generateMarksEntryPDF: envUrlAppends.academic + `pdf/marksEntry/generate`
    },
    academic: {
        academicUsers: envUrlAppends.academic + 'users',
        calanderSteps: envUrlAppends.academic + 'calanderSteps',
        categories: envUrlAppends.academic + 'categories',
        classes: envUrlAppends.academic + 'classes',
        documents: envUrlAppends.academic + 'documents',
        expertise: envUrlAppends.academic + 'expertise',
        fileUpload: envUrlAppends.academic + 'file-upload',
        getmentor: envUrlAppends.academic + 'registeredmentors',
        globalRncpTitle: envUrlAppends.academic + 'rncp-title',
        ideaCategory: envUrlAppends.academic + 'idea/category', //
        ideas: envUrlAppends.academic + 'ideas/',
        jobDescription: envUrlAppends.academic + 'jobDescription/', //
        pendingTasks: envUrlAppends + 'tasks/pending',
        rncpTitle: envUrlAppends.academic + 'rncp-titles',
        rncpTitleListView: envUrlAppends.academic + 'rncp/dashboard',
        rncpTitlesWithClasses: envUrlAppends.academic + 'rncp/condition',
        rncpTitlesNotInScholarSeason: envUrlAppends.academic + 'rncptitlesnotinscholarseason', //
        rncpTitlesSchool: envUrlAppends.academic + 'school/',
        scholarSeason: envUrlAppends.academic + 'scholarseason',
        schools: envUrlAppends.academic + 'schools/',
        SearchTests: envUrlAppends.academic + 'kit/search/',
        studentDetails: envUrlAppends.academic + 'student/details/', //
        subject: envUrlAppends.academic + 'subject',
        testCorrections: envUrlAppends.academic + 'test/',
        tests: envUrlAppends.academic + 'tests/',
        upcomingEvents: envUrlAppends.academic + 'tasks/upcoming',
        userTypes: envUrlAppends.academic + 'user/types',
        linkedTestsv: envUrlAppends.academic + 'linkedTests/', //
        mailTemplate: envUrlAppends.academic + 'mailTemplates',
        mailTemplates: envUrlAppends.academic + 'mailTemplates',
        questionnaireTemplates: envUrlAppends.academic + 'questionnaireTemplates',
        questionnaireTemplate: envUrlAppends.academic + 'questionnaireTemplate',
        companies: envUrlAppends.academic + 'companies',
        cloneKit: envUrlAppends.academic + 'cloneKit',
        addBasicKit: envUrlAppends.academic + 'addBasicKit',
        tasks: envUrlAppends.academic + 'tasks',
        companinesLinkedToSchool: envUrlAppends.academic + 'companies/linkedToSchool/',
        prepCenters: envUrlAppends.academic + 'companies/preparationCenters',
        groupOfSchools: envUrlAppends.academic + 'school/schoolGroups',
        getProblemetic: envUrlAppends.academic + 'problematic/',
        getCertifierRNCPTitles: envUrlAppends.academic + 'rncpTitles/getAllByCertifier/',
        importStudentUpload: envUrlAppends.academic + 'import/upload/',
        importStudentForSchool: envUrlAppends.academic + 'import/students',
        crossCorrector: envUrlAppends.academic + 'cross-corrector',
        importStudentTemplateDownload: envUrlAppends.academic + 'import/downloadTemplate?fileName=_student_',
        sendCertiDegree: envUrlAppends.academic + 'student/sendCertiDegree/',
        getSchoolsBasedOnLoggedInUserType: envUrlAppends.academic + 'getSchoolsShortName',
        getCorrectorsAndStudents: envUrlAppends.academic + 'cross-corrector/getCorrectorsAndStudents',
        validateSendCopiesByCertifier: envUrlAppends.academic + 'cross-corrector/validateSendCopies/',
        createMarkEntryForCorrectors: envUrlAppends.academic + 'cross-corrector/createMarkEntryForCorrectors',
        testCorrection: envUrlAppends.academic + 'test-correction/',
        requestEmailChange: envUrlAppends.academic + 'requestEmailChange/',
        requestStudentEmailChange: envUrlAppends.academic + 'requestStudentEmailChange',
        newFeatureConfig: envUrlAppends.academic + 'get/config',
        statusUpdateForTest: envUrlAppends.academic + 'export/csv/statusUpdate/students',
        studentsForFinalTranscript: envUrlAppends.academic + 'export/csv/finalTranscript/students',
        superUser: envUrlAppends.academic + 'user/superseupar/',
        inputFinalDecision: envUrlAppends.academic + 'inputFinalDecision',
        finalTranscript: envUrlAppends.academic + 'finalTranscript/',
        updateFinalTranscriptForStudent: envUrlAppends.academic + 'updateFinalTranscriptForStudent/',
        finalTranscriptStudentsDecision: envUrlAppends.academic + 'finalTranscriptStudentsDecision/',
        finalTranscriptAcadBlock: envUrlAppends.academic + 'finalTranscriptAcadBlock/',
        finalTranscriptStatusForAcadKit: envUrlAppends.academic + 'finalTranscriptStatusForAcadKit/',
        finalTranscriptJuryDecisionAcadBlock: envUrlAppends.academic + 'finalTranscriptJuryDecisionAcadBlock/',
        generateFinalTranscriptPdf: envUrlAppends.academic + 'generateFinalTranscriptPdf/',
        studentFinalTranscriptRetake: envUrlAppends.academic + 'studentFinalTranscriptRetake/',
        finalTranscriptStatus: envUrlAppends.academic + 'finalTranscriptStatus/',
        studentsForCertiDegree: envUrlAppends.academic + 'studentsForCertiDegree',
        schoolForFinalCertificate: envUrlAppends.academic + 'schoolForFinalCertificate',
        issueCertificate: envUrlAppends.academic + 'issueCertificate',
        finalTranscriptGetTestsForFinalRetake: envUrlAppends.academic + 'finalTranscript/getTestsForFinalRetake',
        finalTranscriptgetCorrectionsPDF: envUrlAppends.academic + 'finalTranscript/getCorrectionsForFinalRetake',
        studentFinalCertificateRevision: envUrlAppends.academic + 'studentFinalCertificateRevision',
        generateCertificatePdf: envUrlAppends.academic + 'generateCertificatePdf',
        schoolSpecializations: envUrlAppends.academic + 'schoolSpecializations/',
        rncpAdmtcDir: envUrlAppends.academic + 'rncpAdmtcDir',
        finalTranscriptJuryFinalDecision: envUrlAppends.academic + 'finalTranscript/juryFinalDecision',
        finalTranscriptStatisticPassFail: envUrlAppends.academic + 'finalTranscript/statisticPassFail',
        finalTranscriptStudentStatistic: envUrlAppends.academic + 'finalTranscript/studentStatistic',
        duplicateExpertise: envUrlAppends.academic + 'cloneTitleConditions',
        downloadPDFCertificate: envUrlAppends.academic + 'downloadPDFCertificate',
        changementOfRncp: envUrlAppends.academic + 'student/changementOfRncp',
        getPreviousCoursesDetails: envUrlAppends.academic + 'student/getPreviousCoursesDetails',
        transferStudentToAnotherSchool: envUrlAppends.academic + 'transferStudentToDiffSchool',
        getStudentDetailsForCertiIssue: envUrlAppends.academic + 'getStudentDetailsForCertiIssue/',
        getPreviewOfTasks: envUrlAppends.academic + 'tasks/getPreviewOfTasks',
        schoolBasedOnRNCP: envUrlAppends.academic + 'schoolBasedOnRNCP',
        getUserForInternalTask: envUrlAppends.academic + 'user/getUserForInternalTask',
        exportEmployabilitySurveyCSV: envUrlAppends.academic + 'employabilitySurvey/csv',
        studentsForQualityControlTable: envUrlAppends.academic + 'studentsForQualityControlTable',
        acaddocumentsRncp: envUrlAppends.academic + 'acaddocuments/rncp/',
        getPublishedForStudentsDocument: envUrlAppends.academic + 'getPublishedForStudentsDocument/',
        getIssueCertiTaskOfAcadDir: envUrlAppends.academic + 'getIssueCertiTaskOfAcadDir/',
        checkPublishTestConditions: envUrlAppends.academic + 'test/checkForPublishTest/',
        generatePdfForOrganizationsFolder: envUrlAppends.academic + 'rncpTitles/generateConditionsPdf/',

        // Tutorials
        tutorials: envUrlAppends.academic + 'tutorials',
        allTutorials: envUrlAppends.academic + 'allTutorials',
        deleteTutorial: envUrlAppends.academic + 'deleteTutorial/',
        filterTutorial: envUrlAppends.academic + 'filterTutorial',
        saveTutorial: envUrlAppends.academic + 'saveTutorial',
        updateTutorial: envUrlAppends.academic + 'updateTutorial/',
        usersForSendTutorial: envUrlAppends.academic + 'usersForSendTutorial',
        sendTutorial: envUrlAppends.academic + 'sendTutorial',

        // qc
        testForQc: envUrlAppends.academic + 'test/allTestsForQC',
        checkIfTestIsDoneOrNot: envUrlAppends.academic + 'checkIfTestIsDoneOrNot/',
        // Groups
        saveManualGroupsAsDraft: envUrlAppends.academic + 'testGroup/saveManualGroupsAsDraft/',
        
        // Internal Notes
         getInternalNotes: envUrlAppends.academic + 'internalNote',
    },
    questionnaire : {
      questionnaireTable: envUrlAppends.questionnaire + `getIssuedQuestionnaireListView`,
      allQuestionnaire: envUrlAppends.questionnaire + `getAllQuestionnaireResponseView`,
      saveIssueQuestionnaire: envUrlAppends.questionnaire + `saveIssueQuestionnaire`,
      creatorList: envUrlAppends.questionnaire + `getCreatedByTemplate`,
      questionnaireRecipient: envUrlAppends.questionnaire + `getAllQuestionnaireResponseView`
    },
};
