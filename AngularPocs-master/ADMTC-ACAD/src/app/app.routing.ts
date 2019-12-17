// Import Core
import { Routes } from '@angular/router';

// Import Gaurds
import { AuthGuard } from './route-guards/auth.guard';
import { DashboardGuard } from './route-guards/dashboard.guard';
import { FirstStepGuard } from './route-guards/first-step.guard';
import { FourthStepGuard } from './route-guards/fourth-step.guard';
import { MentorJobDescGaurd } from 'app/route-guards/mentor-jobDesc.gaurd';
import { RncpTitleGuard } from './route-guards/rncptitle.gaurd';
import { SecondStepGuard } from './route-guards/second-step.guard';
import { TasksGuard } from 'app/route-guards/tasks.guard';
import { ThirdStepGuard } from './route-guards/third-step.guard';


// Components not used.
import { AdmtcPapearFooter } from './components/settings/settingSteps/admtc-papear-footer/admtcPapearFooter.component';
import { AdmtcPapearHeader } from './components/settings/settingSteps/admtc-papear-header/admtcPapearHeader.component';
import { CNCPInformation } from './components/settings/settingSteps/cncp-Information/cncpInformation.component';

// Import Components
import { ActivationComponent } from './components/parameter-rncp/activation/activation.component';
import { ADMTCStaffComponent } from './components/admtc-staff/admtc-staff-component';
import { AppComponent } from './app.component';
import { CalenderStepsComponent } from './components/settings/settingSteps/calender-steps/calender-steps.component';
import { CompleteRegistrationComponent } from './components/customer/customer-edit/customer-edit-student/completeregistration/completeregistration.component';
import { ContractDefault } from './components/settings/settingSteps/contract-default/contactDefault.component';
import { CreateGroupsComponent } from './components/test/create-groups/create-groups.component';
import { CreateStudentComponent } from './components/customer/customer-edit/customer-edit-student/create-student/create-student.component';
import { CreateTestComponent } from './components/test/create-test/create-test.component';
import { CustomerEditComponent } from './components/customer/customer-edit/customer-edit.component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomersComponent } from './components/customer/customers.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DetailsComponent } from './components/test/test-correction/details/details.component';
import { EvaluationGridComponent } from './components/student/evaluation-grid/evaluation-grid.component';
import { FirstStepComponent } from './components/test/steps/first-step/first-step.component';
import { ForgotPasswordComponent } from './components/users/forgot-password/forgot-password.component';
import { FourthStepComponent } from './components/test/steps/fourth-step/fourth-step.component';
import { General } from './components/settings/settingSteps/general/general.component';
import { IdeaCategories } from './components/settings/settingSteps/1001-ideas-categories/1001IdeaCategories.component';
import { Invoice } from './components/settings/settingSteps/invoice/invoice.component';
import { JobDescriptionFormComponent } from './components/users/job-description-form/job-description-form.component';
import { ListMailComponent } from './components/Mail/list-mail/list-mail.component';
import { LoginComponent } from './components/login/login-component'
import { MentorEvaluationFormComponent } from './components/student/mentor-eval-form/mentor-eval-form.component';
import { MentorStudentsComponent } from './components/mentor-students/mentor-students-component';
import { MyFileComponent } from './components/student/my-file/my-file.component';
import { ParameterRncpComponent } from './components/parameter-rncp/parameter-rncp.component';
import { PendingTasksComponent } from './components/dashboard/pendingtasks/pendingtasks.component';
import { PreparationCenterComponent } from './components/preparation-center/perparation-center-component';
import { QuestionnaireAnswerCorrectionsComponent } from './dialogs/student-details/questionnaire-answer-corrections/questionnaire-answer-corrections.component';
import { RecoverPasswordComponent } from './components/users/recover-password/recover-password.component';
import { RegistrationComponent } from './components/users/registration/registration.component';
import { RncpClassComponent } from './components/parameter-rncp/rncp-class/rncp-class.component';
import { RncpTestComponent } from './components/parameter-rncp/rncp-test/rncp-test.component';
import { RncpTitlesComponent } from './components/rncp-titles/rncp-titles.component';
import { RncpTitlesOldComponent } from './components/rncp-titles-old/rncp-titles.component';
import { ScholerSeasonComponent } from './components/settings/settingSteps/scholer-season/scholer-season.component';
import { SchoolBoardResult } from './components/settings/settingSteps/schoolboard/schoolBoard.component';
import { SchoolGroupListComponent } from './components/school-group/school-group-list/school-group-list.component';
import { SecondStepComponent } from './components/test/steps/second-step/second-step.component';
import { SetPasswordComponent } from './components/users/setpassword/setpassword.component';
import { SettingComponent } from './components/settings/settings-component';
import { StudentDetailListComponent } from './components/student/student-details/student-details-list.component';
import { StudentInfoComponent } from './components/student/student-info/student-info.component';
import { StudentJobDescriptionComponent } from './components/student/student-details/student-job-description/student-job-description.component'
import { StudentListComponent } from './components/student/student-list/student-list.component';
import { StudentMentorEvalComponent } from './components/student/student-details/student-mentor-eval/student-mentor-eval.component';
import { StudentProblematicComponent } from './components/student/student-details/student-problematic/student-problematic.component';
import { StudentStatus } from './components/settings/settingSteps/student-stauts/studentStatus.component';
import { TasksComponent } from './components/tasks/tasks-component';
import { TestCorrectionComponent } from './components/test/test-correction/test-correction.component';
import { ThirdStepComponent } from './components/test/steps/third-step/third-step.component';
import { UserTypes } from './components/settings/settingSteps/usertypes/usertypes.component';
import { VersionComponent } from './components/version/version.component';
import { StudentImportComponent } from './components/student/student-import/student-import.component';
import { BrowserNotSupportedComponent } from 'app/shared/browser-not-supported/browser-not-supported-component';
import { AdmtcStudentTableComponent } from './components/student/admtc-student-table/admtc-student-table.component';
import { StudentEmployabilitySurveyComponent } from './components/student/student-details/student-employability-survey/student-employability-survey.component';
import { CertificationStudentListComponent } from './components/student/certification-student--list/certification-student--list.component';
import { FifthStepComponent } from './components/test/steps/fifth-step/fifth-step.component';
import { AlertFunctionalityComponent } from './components/alert-functionality/alert-functionality.component';
import { RncpDocumentsComponent } from './components/parameter-rncp/rncp-documents/rncp-documents.component';
import { QualityControlComponent } from './components/quality-control/quality-control.component';
import { InternalNotesComponent } from './components/settings/settingSteps/internal-notes/internal-notes.component';



export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'rncp-titles',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'rncp-titles',
    component: RncpTitlesComponent,
    canActivate: [AuthGuard, RncpTitleGuard]
  },

  {
    path: 'rncp-titles-old',
    component: RncpTitlesOldComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student/registration/:id',
    component: RegistrationComponent
  },
  {
    path: 'academic/jobDescription/:jobDescId',
    component: JobDescriptionFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mentor/:userId/jobDescription/:jobDescId',
    component: JobDescriptionFormComponent,
    canActivate: [MentorJobDescGaurd]
  },
  {
    path: 'student/jobDescription',
    component: StudentJobDescriptionComponent
  },
  {
    path: 'student/mentorEval',
    component: StudentMentorEvalComponent
  },
  {
    path: 'student/completeregistration/:id',
    component: CompleteRegistrationComponent
  },
  {
    path: 'student/previousCourse/:rncpId/:schoolId',
    component: StudentInfoComponent,
    canActivate: [AuthGuard]
  },
  //{
  //    path: 'users',
  //    component: UsersComponent,
  //},
  {
    path: 'academic/problematic/:problematicId',
    component: StudentProblematicComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'academic/employibility-survey/:employibilitySurveyId',
    component: StudentEmployabilitySurveyComponent,
    canActivate: [AuthGuard]
  },
  {
    //path: 'pc-acad',
    path: 'academic-users',
    component: PreparationCenterComponent,
    canActivate: [AuthGuard]
  },
  {
    //path: 'admtc-acad',
    path: 'admtc-users',
    component: ADMTCStaffComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [DashboardGuard],

  },

  // Route For Automatic Tasks Link
  {
    path: 'dashboard/:id/:taskId',
    component: DashboardComponent,
    canActivate: [TasksGuard]
  },

  // Route for Upcoming Events Link
  {
    path: 'dashboard/:rncpId',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'test-correction',
    component: TestCorrectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'test-correction/:titleId/:testId',
    component: TestCorrectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'test-correction/:titleId/:testId/:taskId',
    component: TestCorrectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'evaluation-grid/:evalId',
    component: EvaluationGridComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create-group-test/:titleId/:testId/:taskId',
    component: CreateGroupsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'test-correction-details/:id',
    component: DetailsComponent
  },
  // {
  //   path: 'tools/mentor',
  //   component: MentorevaluationComponent
  // },
  {
    path: 'tools/parameter-rncp',
    component: ParameterRncpComponent,
    children: [{
      path: '',
      redirectTo: 'activation',
      pathMatch: 'full',
    }, {
      path: 'rncp-class',
      component: RncpClassComponent
    },
    {
      path: 'rncp-test',
      component: RncpTestComponent
    },
    {
      path: 'activation',
      component: ActivationComponent
    },
    {
      path: 'rncp-documents',
      component: RncpDocumentsComponent
    }]
  },
  // {
  //   path: 'mentorevaluation/:Id/:studentId',
  //   component: QuestionnaireAnswerComponent
  // },
  {
    path: 'tools/alertFunction',
    component: AlertFunctionalityComponent
  }
  ,
  {
    path: 'questionnaire-answer-corrections',
    component: QuestionnaireAnswerCorrectionsComponent
  },
  {
    path: 'test-correction-details/:id/:testId',
    component: DetailsComponent
  },



  {
    path: 'admtc-acad/tasks/:id/:taskId',
    component: TasksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admtc-acad/tasks',
    component: TasksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tools/settings',
    component: SettingComponent,
    children: [{
      path: '',
      redirectTo: 'scholer-season',
      pathMatch: 'full',
    }, {
      path: 'general',
      component: General
    },
    {
      path: 'admtc-papaer-header',
      component: AdmtcPapearHeader
    },
    {
      path: 'admtc-papaer-footer',
      component: AdmtcPapearFooter
    }, {
      path: 'ideas-categories',
      component: IdeaCategories
    }, {
      path: 'school-board',
      component: SchoolBoardResult
    },
    {
      path: 'invoice',
      component: Invoice
    },
    {
      path: 'student-status',
      component: StudentStatus
    },
    {
      path: 'contract-default',
      component: ContractDefault
    },
    {
      path: 'cncp-information',
      component: CNCPInformation
    },
    {
      path: 'scholer-season',
      component: ScholerSeasonComponent
    },
    {
      path: 'calender-steps',
      component: CalenderStepsComponent
    },
    {
      path: 'usertypes',
      component: UserTypes
    }]
  },
  {
    path: 'internal-note',
    component: InternalNotesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-student/:customerId',
    component: CreateStudentComponent
  },
  {
    path: 'import-student/:schoolId',
    component: StudentImportComponent
  },
  {
    path: 'add-student/:customerId/:selectedIndexForStudentsTab',
    component: CreateStudentComponent
  },
  {
    path: 'school',
    children:
      [{
        path: '', component: CustomersComponent, canActivate: [AuthGuard], children: [
          { path: '', component: CustomerListComponent },
          { path: ':customerId/edit', component: CustomerEditComponent },
          { path: ':customerId/edit/:selectedTabIndex', component: CustomerEditComponent },
          { path: ':customerId/edit/:selectedTabIndex/:studentId', component: CustomerEditComponent }
        ]
      }],

    // loadChildren: 'app/components/customer/customers.module#CustomersModule',
  },
  {
    path: 'school-group',
    component: SchoolGroupListComponent,
  },
  {
    path: 'mailbox',
    component: ListMailComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'setPassword/:id',
    component: SetPasswordComponent
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'password/recovery/:token',
    component: RecoverPasswordComponent
  },
  {
    path: 'create-test',
    component: CreateTestComponent,
    canActivate: [FirstStepGuard],
    children: [{
      path: '',
      redirectTo: 'first',
      pathMatch: 'full',
    }, {
      path: 'first',
      component: FirstStepComponent
    }, {
      path: 'second',
      component: SecondStepComponent,
      canActivate: [SecondStepGuard]
    }, {
      path: 'third',
      component: ThirdStepComponent,
      canActivate: [ThirdStepGuard]
    }, {
      path: 'fourth',
      component: FourthStepComponent,
      canActivate: [FourthStepGuard]
    }, {
      path: 'fifth',
      component: FifthStepComponent,
    }
    ]
  },
  {
    path: 'studentcard',
    component: StudentListComponent
  },
  {
    path: 'final-certification-students',
    component: CertificationStudentListComponent
  },
  {
    path: 'about',
    component: VersionComponent
  },
  {
    path: 'myfile',
    component: StudentInfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'photoDiploma',
    component: MyFileComponent
  },
  {
    path: 'students',
    component: MentorStudentsComponent
  },
  {
    path: 'allStudentsTable',
    component: AdmtcStudentTableComponent
  },
  {
    path: 'allStudents',
    component: StudentDetailListComponent
  },
  {
    path: 'academic/mentor-evaluation-response/:id/:userId',
    component: MentorEvaluationFormComponent,
    canActivate: [MentorJobDescGaurd]
  },
  {
    path: 'academic/mentor-evaluation-response/:id',
    component: MentorEvaluationFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tutorial',
    loadChildren: './components/tutorial/tutorial.module#TutorialModule'
  },
  {
    path: 'browser-not-supported',
    component: BrowserNotSupportedComponent
  },
  {
    path: 'quality-control/:rncpId/:classId/:testId',
    component: QualityControlComponent
  },
  // {
  //   path: 'doctesttable',
  //   loadChildren: '/src/app/components/doctesttable/doctesttable.module#DoctesttableModule'
  // },
  {
    path: '**',
    redirectTo: 'rncp-titles'
  },
];
