//import { DateTimePickerModule } from 'ng-pick-datetime/picker.module';
import { TagInputModule } from 'ngx-chips';
import { RncpTitlesModule } from './modules/rncp-titles/rncp-titles.module';
import { RncpTitlesComponent } from './components/rncp-titles/rncp-titles.component';
import { TestService } from './services/test.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { UserService } from './services/users.service';
import { TutorialService } from './services/tutorial.service';
import { CompanyService } from './services/company.service';
import { StudentsService } from './services/students.service';
import { countryService } from './services/country.service';
import { SubjectService } from './services/subject.service';
import { ExpertiseService } from './services/expertise.service';
import { SchoolService } from './services/school.service';
import { CKEditorModule } from 'ng2-ckeditor';
import { MdAutocompleteModule } from '@angular/material';
import { LimitToDirective } from 'app/shared/Limit-to-Directive/limit-to.directive';

import { DateAdapter, MaterialModule, MD_DATE_FORMATS, MdDateFormats, NativeDateAdapter } from '@angular/material';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { OneThousandIdeasModule } from './modules/one-thousand-ideas/one-thousand-ideas.module';
import { OneThousandIdeasRoutingModule } from './modules/one-thousand-ideas/one-thousand-ideas-routing.module';


import { CommonModule, DatePipe } from '@angular/common';
import { CustomFormsModule } from 'ng2-validation';
import { MdCheckboxModule } from '@angular/material';
// import { CustomersRouting } from './customers.routing';
import { CustomersComponent } from './components/customer/customers.component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerNewComponent } from './components/customer/customer-new/customer-new.component';
import { CustomerEditComponent } from './components/customer/customer-edit/customer-edit.component';
import { CustomerEditDetailComponent } from './components/customer/customer-edit/customer-edit-detail/customer-edit-detail.component';
import { CustomerEditCompanyComponent } from './components/customer/customer-edit/customer-edit-company/customer-edit-company.component';
import { CustomerEditContactComponent } from './components/customer/customer-edit/customer-edit-contact/customer-edit-contact.component';
import { CustomerEditTitleComponent } from './components/customer/customer-edit/customer-edit-title/customer-edit-title.component';
import { CustomerEditStudentComponent } from './components/customer/customer-edit/customer-edit-student/customer-edit-student.component';
import { ContactPopupComponent } from './components/customer/customer-edit/customer-edit-contact/contact-popup/contact-popup.component';
import { CustomerService } from './components/customer/customer.service';
import { ShortenPipe } from './components/customer/pipes/shorten.pipe';
import { NamePipe } from './components/customer/pipes/name.pipe';
import { CompanyPopupComponent } from './components/customer/customer-edit/customer-edit-company/company-popup/company-popup.component';
import { NguiDatetimePickerModule, NguiDatetime } from '@ngui/datetime-picker';
import { SelectModule } from 'ng2-select';
import { StudentDetailListComponent } from './components/student/student-details/student-details-list.component';
import { StudentDialogComponent } from './components/student/student-dialogs/student-dialogs.component';
import { StudentImportComponent } from './components/student/student-import/student-import.component';
import { ProblematicTaskDialogComponent } from './components/student/student-dialogs/problematic-task-dailog/problematic-dailog.component';

import {
  MdToolbarModule,
  MdInputModule,
  MdRadioModule,
  MdIconModule,
  MdCardModule,
  MdButtonModule,
  MdListModule,
  MdProgressBarModule,
  MdMenuModule,
  MdDialogModule,
  MdNativeDateModule,
  MdSelectModule,
  MdDatepickerModule
} from '@angular/material';


import { FlexLayoutModule } from '@angular/flex-layout';

import { CreateTestComponent } from './components/test/create-test/create-test.component';
import { FirstStepComponent } from './components/test/steps/first-step/first-step.component';
import { SecondStepComponent } from './components/test/steps/second-step/second-step.component';
import { ThirdStepComponent } from './components/test/steps/third-step/third-step.component';
import { FourthStepComponent } from './components/test/steps/fourth-step/fourth-step.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageUploadModule } from 'angular2-image-upload';
import { TextDialogComponent } from './components/test/steps/second-step/dialogs/text-dialog/text-dialog.component';
import { TestDocumentComponent } from './components/test/test-document/test-document.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate/ng2-translate';
import { CategoryComponent } from './components/dashboard/category/category.component';
import { RncpTitlesOldComponent } from './components/rncp-titles-old/rncp-titles.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RNCPTitlesService } from './services/rncp-titles.service';
import { DocumentDetailsDialogComponent } from './dialogs/document-details-dialog/document-details-dialog.component';
import { AddCategoryDialogComponent } from './dialogs/add-category-dialog/add-category-dialog.component';

import { AddDocumentDialogComponent } from './dialogs/add-document-dialog/add-document-dialog.component';
import { TestDetailsDialogComponent } from './dialogs/test-details-dialog/test-details-dialog.component';
import { ModifyCategoriesComponent } from './components/dashboard/modify-categories/modify-categories.component';
import { DashboardGuard } from './route-guards/dashboard.guard';
import { FirstStepGuard } from './route-guards/first-step.guard';
import { SecondStepGuard } from './route-guards/second-step.guard';
import { ThirdStepGuard } from './route-guards/third-step.guard';
import { FourthStepGuard } from './route-guards/fourth-step.guard';
import { MoveItemDialogComponent } from './dialogs/move-item-dialog/move-item-dialog.component';
import { MoveItemService } from './services/move-item.service';
import { AcademicKitService } from './services/academic-kit.service';
import { SearchService } from './services/search.service';
import { TestCorrectionService } from './services/test-correction.service';
import { DuplicateTestDialogComponent } from './dialogs/duplicate-test-dialog/duplicate-test-dialog.component';
import { PendingTasksComponent } from './components/dashboard/pendingtasks/pendingtasks.component';
import { ListOfEventsComponent } from './components/dashboard/listofevents/listofevents.component';
import { TestCorrectionComponent } from './components/test/test-correction/test-correction.component';
import { EvaluationGridComponent } from './components/student/evaluation-grid/evaluation-grid.component';
import { DetailsComponent } from './components/test/test-correction/details/details.component';
import { AddExpectedDocumentDialogComponent } from './components/test/test-correction/add-expected-document-dialog/add-expected-document-dialog.component';
import { AbsenceJustifiedDialogComponent } from './components/test/test-correction/absence-justified-dialog/absence-justified-dialog.component';

import { AddClassDialogComponent } from './dialogs/add-class-dialog/add-class-dialog.component';


import { AddSchoolComponent } from './components/customer/add-school/add-school.component';
import { AddCompanyDialogComponent } from './dialogs/add-company-dialog/add-company-dialog.component';
import { ADMTCStaffDialogComponent } from './dialogs/admtc-staff-menu-dialog/admtc-staff-menu-component';
import { ADMTCStaffComponent } from './components/admtc-staff/admtc-staff-component';
import { PCUserDialogComponent } from './dialogs/pc-user-menu-dialog/pc-user-menu-component';
import { PreparationCenterComponent } from './components/preparation-center/perparation-center-component';
import { TasksComponent } from './components/tasks/tasks-component';
import { AddTaskDialogComponent } from './dialogs/add-task-dialog/add-task-dialog.component';
import { SettingComponent } from './components/settings/settings-component';

import { IdeaCategories } from './components/settings/settingSteps/1001-ideas-categories/1001IdeaCategories.component';
import { AdmtcPapearFooter } from './components/settings/settingSteps/admtc-papear-footer/admtcPapearFooter.component';
import { AdmtcPapearHeader } from './components/settings/settingSteps/admtc-papear-header/admtcPapearHeader.component';
import { CNCPInformation } from './components/settings/settingSteps/cncp-Information/cncpInformation.component';
import { ContractDefault } from './components/settings/settingSteps/contract-default/contactDefault.component';
import { General } from './components/settings/settingSteps/general/general.component';
import { HistoryModule } from './components/settings/settingSteps/history/history.module';
import { Invoice } from './components/settings/settingSteps/invoice/invoice.component';
import { SchoolBoardResult } from './components/settings/settingSteps/schoolboard/schoolBoard.component';
import { StudentStatus } from './components/settings/settingSteps/student-stauts/studentStatus.component';


import { PDFService } from './services/pdf.service';
import { TasksService } from './services/tasks.service';
import { SettingService } from './services/settings.service';
import { ScholarSeasonService } from './services/scholar-season.service';
import { CalendarStepService } from './services/calendar-step.service';
import { LoginService } from './services/login.service';

import { LoginComponent } from './components/login/login-component';
import { AuthGuard } from './route-guards/auth.guard';
import { UserTypePipe } from './pipes/userType.pipe';
import { OrderByPipe } from './pipes/orderBy.pipe';
import { TestHeaderDialogComponent } from './dialogs/test-header-dialog/test-header-dialog.component';
import { TestFooterDialogComponent } from './dialogs/test-footer-dialog/test-footer-dialog.component';
import { TruncatePipe } from './pipes/truncate.pipe';

// import { ConfirmPasswordValidation } from './custome-validation/confirmpassword-validation'
import { AddAcademicSuggestionDialogComponent } from './dialogs/add-academic-suggestion-dialog/add-academic-suggestion-dialog.component';
import { AddAcademicSchoolDialogComponent } from './dialogs/add-academic-school-dialog/add-academic-school-dialog.component';
import { AddRncpDialogComponent } from './dialogs/add-rncp-dialog/add-rncp-dialog.component';
import { RegistrationComponent } from './components/users/registration/registration.component';
import { JobDescriptionFormComponent } from './components/users/job-description-form/job-description-form.component';
import { CreateStudentPopupComponent } from './components/customer/customer-edit/customer-edit-student/create-student-popup/create-student-popup.component';
import { TestCorrectionDetailDialogComponent } from './dialogs/test-correction-detail-dialog/test-correction-detail-dialog.component';
import { FormConfirmationComponent } from './dialogs/form-confimation-dialog/form-confimation-dialog.component';


import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TitleSelectedGuard } from './route-guards/title-selected.guard';
import { ViewTestDialogComponent } from './dialogs/view-test-dialog/view-test-dialog.component';
import { SendMentorEvaluationComponent } from './dialogs/send-mentor-evaluation/send-mentor-evaluation.component';

import { QuestionnaireAnswerCorrectionsComponent } from './dialogs/student-details/questionnaire-answer-corrections/questionnaire-answer-corrections.component'
import { StudentDetailsComponent } from './dialogs/student-details/student-details.component';
import { CreateStudentComponent } from './components/customer/customer-edit/customer-edit-student/create-student/create-student.component';
import { AddMentorComponent } from './dialogs/add-mentor/add-mentor.component';
import { CompleteRegistrationComponent } from './components/customer/customer-edit/customer-edit-student/completeregistration/completeregistration.component';
import { SendStudentMailComponent } from './dialogs/send-student-mail/send-student-mail.component';

import { NotificationEditorComponent } from './components/users/job-description-form/notification-editor/notification-editor.component';
import { JobDescriptionNotificationDialogComponent } from './components/customer/customer-edit/customer-edit-student/job-description-notification-dialog/job-description-notification-dialog.component';
import { ParameterRncpComponent } from './components/parameter-rncp/parameter-rncp.component';
import { RncpClassComponent } from './components/parameter-rncp/rncp-class/rncp-class.component';
import { RncpTestComponent } from './components/parameter-rncp/rncp-test/rncp-test.component';
import { ActivationComponent } from './components/parameter-rncp/activation/activation.component';

import { TooltipDirective } from 'ng2-tooltip-directive/components';
import { UserTypes } from './components/settings/settingSteps/usertypes/usertypes.component'
import { acadkitCreateHelperComponent } from './dialogs/acadkit-create-helper/acadkit-create-helper.component';
import { ScholerSeasonComponent } from './components/settings/settingSteps/scholer-season/scholer-season.component';
import { ScholarSeasonEditDialogComponent } from './dialogs/scholar-season-edit-dialog/scholar-season-edit-dialog.component'
import { AddSubjectDialogComponent } from './components/parameter-rncp/rncp-test/add-subject-dialog/add-subject-dialog.component'
import { AddExpertiseDialogComponent } from './components/parameter-rncp/rncp-test/add-expertise-dialog/add-expertise-dialog.component'
import { AddTestDialogComponent } from './components/parameter-rncp/rncp-test/add-test-dialog/add-test-dialog.component';
import { CalenderStepsComponent } from './components/settings/settingSteps/calender-steps/calender-steps.component';
import { EditCalenderStepDialogComponent } from './dialogs/edit-calender-step-dialog/edit-calender-step-dialog.component';

import { ListMailComponent } from './components/Mail/list-mail/list-mail.component';
import { ComposeMailComponent } from './components/Mail/compose-mail/compose-mail.component';
import { EmailDetailComponent } from './components/Mail/email-detail/email-detail.component';
import { ReplyMailComponent } from './components/Mail/reply-mail/reply-mail.component';
import { ReplyAllMailComponent } from './components/Mail/reply-all-mail/reply-all-mail.component';
import { ForwardMailComponent } from './components/Mail/forward-mail/forward-mail.component';
import { ConfirmDialog } from './components/Mail/confirm-dialog/confirm-dialog.component';
import { StudentDashboardComponent } from './components/student/student-dashboard/student-dashboard.component';
import { StudentListComponent } from './components/student/student-list/student-list.component';
import { StudentCardComponent } from './components/student/student-card/student-card.component';
import { StudentDetailsComponent2 } from './components/student/student-details/student-details.component';
import { StudentIdentityComponent } from './components/student/student-details/student-identity/student-identity.component';
import { StudentParentsComponent } from './components/student/student-details/student-parents/student-parents.component';
import { StudentCompanyComponent } from './components/student/student-details/student-company/student-company.component';
import { StudentMessagesComponent } from './components/student/student-details/student-messages/student-messages.component';
import { StudentMarksComponent } from './components/student/student-details/student-marks/student-marks.component';
import { SubjectForCertification } from './components/student/student-details/subject-for-certification/subject-for-certification.component';
import { MyFileComponent } from './components/student/my-file/my-file.component';
import { UtilityService } from './services/utility.service';


import { ForgotPasswordComponent } from './components/users/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './components/users/setpassword/setpassword.component';
import { RecoverPasswordComponent } from './components/users/recover-password/recover-password.component';
import { MentorStudentsComponent } from './components/mentor-students/mentor-students-component';
import {
  StudentJobDescriptionComponent
} from './components/student/student-details/student-job-description/student-job-description.component';
import { VersionComponent } from './components/version/version.component';
import { DashboardCalenderTaskComponent } from './dialogs/dashboard-calender-task/dashboard-calender-task.component';
import { ExpectedDocTaskComponent } from './dialogs/expected-doc-task/expected-doc-task.component';
import { AddEventDialogComponent } from './dialogs/add-event-dialog/add-event-dialog.component';
import { StudentDiplomaComponent } from './components/student/student-details/student-diploma/student-diploma.component';
import { AssignCorrectorDialogComponent } from './dialogs/assign-corrector-dialog/assign-corrector-dialog.component';
import { AssignCorrectorProblematicDialogComponent } from './dialogs/assign-corrector-problematic-dialog/assign-corrector-problematic-dialog.component';
import { RncpTitleGuard } from './route-guards/rncptitle.gaurd';
import { MentorEvaluationModule } from './components/mentor-evaluation/mentor-evaluation.module';
import { CrossCorrectionModule } from './components/cross-correction/cross-correction.module';
import { SchoolGroupModule } from './components/school-group/school-group.module';
import { StudentMentorEvalComponent } from './components/student/student-details/student-mentor-eval/student-mentor-eval.component';
import { AddUrgentMessageComponent } from './dialogs/add-urgent-message-dialog/add-urgent-message-dialog.component';
import { StudentInfoComponent } from './components/student/student-info/student-info.component';
import { MentorEvaluationFormComponent } from './components/student/mentor-eval-form/mentor-eval-form.component';
import { DisplayMailPopupComponent } from './components/Mail/display-mail-popup/display-mail-popup.component';
import { CreateGroupsComponent } from './components/test/create-groups/create-groups.component';
import { GroupCardComponent } from './components/test/create-groups/group-card/group-card.component';
import { TaskDetailsComponent } from './dialogs/task-details/task-details.component';
import { GroupTestNotificationDialogComponent } from './components/test/create-groups/group-test-notification-dialog/group-test-notification-dialog.component';
import { GroupTestNotificationEditorComponent } from './components/test/create-groups/group-test-notification-editor/group-test-notification-editor.component';
import { MailService } from 'app/services/mail.service';
import { StudentProblematicComponent } from './components/student/student-details/student-problematic/student-problematic.component';
import { MentorEvaluationService } from './services/mentor-evaluation.service';
import { TasksGuard } from 'app/route-guards/tasks.guard';
import { StudentInactiveTableComponent } from './components/student/student-inactive-table/student-inactive-table.component';
import { MentorJobDescGaurd } from './route-guards/mentor-jobDesc.gaurd';
import { ViewHistoryComponent } from './components/settings/settingSteps/history/view-history/view-history.component';
import { ForwardHistoryComponent } from './components/settings/settingSteps/history/forward-history/forward-history.component';
import { DoctesttableModule } from './components/doctesttable/doctesttable.module';
import { DoctestService } from './components/doctesttable/doctest.service';
import { CreateCrosscorrectorDialogComponent } from './dialogs/create-crosscorrector-dialog/create-crosscorrector-dialog.component';
import { BrowserNotSupportedComponent } from 'app/shared/browser-not-supported/browser-not-supported-component';
import { AdmtcStudentTableComponent } from './components/student/admtc-student-table/admtc-student-table.component';
import { UserTypeService } from './services/usertype.service';
import { HtmlPdfStudentsComponent } from './dialogs/view-test-dialog/html-pdf-students/html-pdf-students';
import { HtmlPdfGroupsComponent } from './dialogs/view-test-dialog/html-pdf-groups/html-pdf-groups';
import { UserIdleModule } from 'angular-user-idle';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { GlobalConstants } from './shared/settings/global-constants';
import { TransferResponsibilityDialogComponent } from './components/settings/settingSteps/transfer-responsibility-dialog/transfer-responsibility-dialog.component';
import { AssignAnimatorDialogComponent } from './components/business-game/dialogs/assign-animator/assign-animator.component';
import { AddTestTaskDialogComponent } from './components/tasks/add-test-task-dialog/add-test-task-dialog.component';
import { StudentReactivationDialogComponent } from './components/student/student-dialogs/student-reactivation-dialog/student-reactivation-dialog.component';
import { MentorEvalNotifComponent } from './components/student/student-details/student-mentor-eval/email-template/mentor-eval-notif.component';
import { ExportGroupsComponent } from './components/settings/settingSteps/export-groups/export-groups.component';
import { FinalTranscriptDialogComponent } from 'app/components/settings/settingSteps/final-transcript-dialog/final-transcript-dialog.component';
import { ConfigService } from './services/config.service';
import { StatusUpdateDialogComponent } from './components/settings/settingSteps/status-update/status-update.component';
import { TableFilterStateService } from './services/table-fliter-state.service';
import { DashboardService } from './services/dashboard.service';
import { SuperuserService } from './services/superuser.service';
import { EmployabilityDialogComponent } from './components/employability-survey/employability-dialog/employability-dialog.component';
import { EmployabilitySurveyService } from './services/employability-survey.service';
import { StudentEmployabilitySurveyComponent } from './components/student/student-details/student-employability-survey/student-employability-survey.component';
import { StudentStatusCardComponent } from './components/student/student-details/student-status-card/student-status-card.component';
import { StudentFinalTranscriptComponent } from './components/student/student-details/student-final-transcript/student-final-transcript.component';
import { FinalTranscriptService } from './components/settings/settingSteps/final-transcript-dialog/final-transcript.service';
import { SurveyRejectDialogComponent } from './components/student/student-details/student-employability-survey/survey-reject-dialog/survey-reject-dialog.component';
import { FinalTranscriptRetakeDialogComponent } from './dialogs/final-transcript-retake-dialog/final-transcript-retake-dialog.component';
import { FinalCertificateDialogComponent } from './components/student/student-dialogs/final-certificate-dialog/final-certificate-dialog.component';
import { CertificationStudentListComponent } from './components/student/certification-student--list/certification-student--list.component';
import { CertificateInssuanceDetailsComponent } from './components/student/student-details/certificate-inssuance-details/certificate-inssuance-details.component';
import { ReviseCertificationDetailsComponent } from './components/student/student-dialogs/revise-certification-details/revise-certification-details.component';
import { LinkedInSdkModule } from 'angular-linkedin-sdk';
import { DuplicateConditionDialogComponent } from './components/parameter-rncp/duplicate-condition-dialog/duplicate-condition-dialog.component';
import { CustomDateAdapter } from './shared/custom-dateadapter';
import { TransferStudentSchoolDialogComponent } from './components/settings/settingSteps/transfer-student-school-dialog/transfer-student-school-dialog.component';
import { StudentCertDetailEditDialogComponent } from './components/student/student-dialogs/student-cert-detail-edit-dialog/student-cert-detail-edit-dialog.component';
import { FifthStepComponent } from './components/test/steps/fifth-step/fifth-step.component';
import { RncpDocumentsComponent } from './components/parameter-rncp/rncp-documents/rncp-documents.component';
import { DocumentForStudentComponent } from './components/student/student-details/document-for-student/document-for-student.component';
import { RecaptchaModule, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import {ProblematicCorrectorService} from './services/problematic-corrector.service';

import { AlertFunctionalityComponent } from './components/alert-functionality/alert-functionality.component';
import { AddAlertDialogComponent } from './components/alert-functionality/add-alert-dialog/add-alert-dialog.component';
import { AlertService } from './services/alert.service';
import { AlertUserResponseDialogComponent } from './components/alert-functionality/alert-user-response-dialog/alert-user-response-dialog.component';
import { QualityControlComponent } from './components/quality-control/quality-control.component';
import { QualityControlDialogComponent } from './components/quality-control/quality-control-dialog/quality-control-dialog.component';
import { QualityControlService } from './services/quality-control.service';
import { InternalNotesComponent } from './components/settings/settingSteps/internal-notes/internal-notes.component';
import { AddAdditionalNoteDialogComponent } from './components/settings/settingSteps/internal-notes/add-additional-note-dialog/add-additional-note-dialog.component';
import { InternalNotesService } from './components/settings/settingSteps/internal-notes/internal-notes.service';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
NguiDatetime.weekends = [null, null];
const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'long', year: 'numeric', day: 'numeric' }
    // dateInput: 'DD/MM/YYYY'
  },
  display: {
    // dateInput: { month: 'long', year: 'numeric', day: 'numeric' },
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'long' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};

export class MyDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    } else {
      return date.toDateString();
    }
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}


@NgModule({
  declarations: [
    AppComponent,
    CreateTestComponent,
    FirstStepComponent,
    SecondStepComponent,
    ThirdStepComponent,
    FourthStepComponent,
    FifthStepComponent,
    TextDialogComponent,
    TestDocumentComponent,
    DashboardComponent,
    CategoryComponent,
    RncpTitlesOldComponent,
    RncpTitlesComponent,
    DocumentDetailsDialogComponent,
    PCUserDialogComponent,
    CustomersComponent,
    CustomerListComponent,
    CustomerEditComponent,
    CustomerEditDetailComponent,
    CustomerEditCompanyComponent,
    CustomerEditContactComponent,
    CustomerEditTitleComponent,
    CustomerEditStudentComponent,
    ContactPopupComponent,
    CustomerNewComponent,
    ShortenPipe,
    NamePipe,
    CompanyPopupComponent,
    AddCategoryDialogComponent,
    AddDocumentDialogComponent,
    TestDetailsDialogComponent,
    ModifyCategoriesComponent,
    MoveItemDialogComponent,
    DuplicateTestDialogComponent,
    DashboardCalenderTaskComponent,
    PendingTasksComponent,
    ListOfEventsComponent,
    TestCorrectionComponent,
    EvaluationGridComponent,
    DetailsComponent,
    AddClassDialogComponent,
    AddSchoolComponent,
    AddCompanyDialogComponent,
    ADMTCStaffDialogComponent,
    AddTaskDialogComponent,
    ADMTCStaffComponent,
    PreparationCenterComponent,
    LoginComponent,
    UserTypePipe,
    OrderByPipe,
    LimitToDirective,
    TestHeaderDialogComponent,
    TestFooterDialogComponent,
    RegistrationComponent,
    JobDescriptionFormComponent,
    PCUserDialogComponent,
    AddTaskDialogComponent,
    AddRncpDialogComponent,
    TasksComponent,
    TruncatePipe,
    SettingComponent,
    IdeaCategories,
    AdmtcPapearFooter,
    AdmtcPapearHeader,
    CNCPInformation,
    ContractDefault,
    General,
    SchoolBoardResult,
    StudentStatus,
    Invoice,
    AddAcademicSuggestionDialogComponent,
    AddAcademicSchoolDialogComponent,
    CreateStudentPopupComponent,
    TestCorrectionDetailDialogComponent,
    ViewTestDialogComponent,
    SendMentorEvaluationComponent,
    FormConfirmationComponent,
    QuestionnaireAnswerCorrectionsComponent,
    StudentDetailsComponent,
    CreateStudentComponent,
    AddMentorComponent,
    CompleteRegistrationComponent,
    SendStudentMailComponent,
    NotificationEditorComponent,
    MentorEvalNotifComponent,
    JobDescriptionNotificationDialogComponent,
    TooltipDirective,
    UserTypes,
    acadkitCreateHelperComponent,
    ScholerSeasonComponent,
    ScholarSeasonEditDialogComponent,
    FormConfirmationComponent,
    ParameterRncpComponent,
    RncpClassComponent,
    RncpTestComponent,
    ActivationComponent,
    AddSubjectDialogComponent,
    AddExpertiseDialogComponent,
    AddTestDialogComponent,
    CalenderStepsComponent,
    EditCalenderStepDialogComponent,
    ComposeMailComponent,
    EmailDetailComponent,
    ReplyMailComponent,
    ReplyAllMailComponent,
    ForwardMailComponent,
    ListMailComponent,
    StudentDashboardComponent,
    StudentListComponent,
    StudentCardComponent,
    StudentDetailsComponent2,
    StudentIdentityComponent,
    StudentIdentityComponent,
    StudentParentsComponent,
    StudentCompanyComponent,
    StudentMessagesComponent,
    StudentMarksComponent,
    SubjectForCertification,
    ConfirmDialog,
    SetPasswordComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent,
    StudentJobDescriptionComponent,
    VersionComponent,
    MyFileComponent,
    ExpectedDocTaskComponent,
    MentorStudentsComponent,
    AddEventDialogComponent,
    StudentDiplomaComponent,
    AssignCorrectorDialogComponent,
    AssignCorrectorProblematicDialogComponent,
    AddExpectedDocumentDialogComponent,
    AbsenceJustifiedDialogComponent,
    StudentMentorEvalComponent,
    StudentDetailListComponent,
    AddUrgentMessageComponent,
    StudentInfoComponent,
    MentorEvaluationFormComponent,
    DisplayMailPopupComponent,
    CreateGroupsComponent,
    GroupCardComponent,
    TaskDetailsComponent,
    GroupTestNotificationDialogComponent,
    GroupTestNotificationEditorComponent,
    StudentProblematicComponent,
    StudentDialogComponent,
    StudentImportComponent,
    ProblematicTaskDialogComponent,
    ViewHistoryComponent,
    ForwardHistoryComponent,
    StudentInactiveTableComponent,
    CreateCrosscorrectorDialogComponent,
    BrowserNotSupportedComponent,
    AdmtcStudentTableComponent,
    HtmlPdfStudentsComponent,
    HtmlPdfGroupsComponent,
    TransferResponsibilityDialogComponent,
    AssignAnimatorDialogComponent,
    AddTestTaskDialogComponent,
    StudentReactivationDialogComponent,
    ExportGroupsComponent,
    FinalTranscriptDialogComponent,
    StatusUpdateDialogComponent,
    EmployabilityDialogComponent,
    StudentEmployabilitySurveyComponent,
    StudentStatusCardComponent,
    StudentFinalTranscriptComponent,
    SurveyRejectDialogComponent,
    FinalTranscriptRetakeDialogComponent,
    FinalCertificateDialogComponent,
    CertificationStudentListComponent,
    CertificateInssuanceDetailsComponent,
    ReviseCertificationDetailsComponent,
    DuplicateConditionDialogComponent,
    TransferStudentSchoolDialogComponent,
    StudentCertDetailEditDialogComponent,
    AlertFunctionalityComponent,
    AddAlertDialogComponent,
    AlertUserResponseDialogComponent,
    RncpDocumentsComponent,
    DocumentForStudentComponent,
    InternalNotesComponent,
    AddAdditionalNoteDialogComponent,
    QualityControlComponent,
    QualityControlDialogComponent,
  ],
  imports: [
    // DateTimePickerModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MdToolbarModule,
    MdInputModule,
    MdRadioModule,
    MdIconModule,
    MdCardModule,
    MdButtonModule,
    MdListModule,
    MdProgressBarModule,
    MdMenuModule,
    MdDialogModule,
    MdNativeDateModule,
    NgxDatatableModule,
    FlexLayoutModule,
    FileUploadModule,
    ImageUploadModule.forRoot(),
    QuillModule,
    CKEditorModule,
    TagInputModule,
    MdAutocompleteModule,
    CommonModule,
    CustomFormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    Ng2DeviceDetectorModule.forRoot(),
    OneThousandIdeasModule,
    RncpTitlesModule,
    NguiDatetimePickerModule,
    SelectModule,
    MentorEvaluationModule,
    CrossCorrectionModule,
    SchoolGroupModule,
    HistoryModule,
    DoctesttableModule,
    UserIdleModule.forRoot({ idle: GlobalConstants.userInactiveLimit, timeout: 1, ping: 1 }),
    LinkedInSdkModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
  ],
  providers: [
    DatePipe,
    TestService,
    RNCPTitlesService,
    AcademicKitService,
    MoveItemService,
    SearchService,
    MentorEvaluationService,
    PDFService,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    // { provide: MD_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DashboardGuard,
    FirstStepGuard,
    SecondStepGuard,
    CustomerService,
    ThirdStepGuard,
    FourthStepGuard,
    UserService,
    CompanyService,
    StudentsService,
    SubjectService,
    ExpertiseService,
    SchoolService,
    TestCorrectionService,
    AuthGuard,
    RncpTitleGuard,
    TasksService,
    SettingService,
    ScholarSeasonService,
    CalendarStepService,
    LoginService,
    countryService,
    UtilityService,
    MailService,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    TitleSelectedGuard,
    TasksGuard,
    MentorJobDescGaurd,
    DoctestService,
    UserTypeService,
    ConfigService,
    TableFilterStateService,
    DashboardService,
    SuperuserService,
    EmployabilitySurveyService,
    FinalTranscriptService,
    InternalNotesService,
    { provide: 'apiKey', useValue: GlobalConstants.linkedInClientId },
    { provide: 'authorize', useValue: true },
    TutorialService,
    ProblematicCorrectorService,
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'fr', // use French language
    },
    AlertService,
    QualityControlService,
  ],
  entryComponents: [
    TaskDetailsComponent,
    ExpectedDocTaskComponent,
    EditCalenderStepDialogComponent,
    TextDialogComponent,
    DocumentDetailsDialogComponent,
    AddCategoryDialogComponent,
    TestHeaderDialogComponent,
    TestFooterDialogComponent,
    ContactPopupComponent,
    CreateStudentPopupComponent,
    CompanyPopupComponent,
    AddDocumentDialogComponent,
    TestDetailsDialogComponent,
    MoveItemDialogComponent,
    AddSchoolComponent,
    DuplicateTestDialogComponent,
    DashboardCalenderTaskComponent,
    AddClassDialogComponent,
    AddCompanyDialogComponent,
    AddRncpDialogComponent,
    ADMTCStaffDialogComponent,
    PCUserDialogComponent,
    AddTaskDialogComponent,
    ScholarSeasonEditDialogComponent,
    AddAcademicSuggestionDialogComponent,
    AddAcademicSchoolDialogComponent,
    TestCorrectionDetailDialogComponent,
    ViewTestDialogComponent,
    SendMentorEvaluationComponent,
    FormConfirmationComponent,
    StudentDetailsComponent,
    AddMentorComponent,
    SendStudentMailComponent,
    NotificationEditorComponent,
    MentorEvalNotifComponent,
    JobDescriptionNotificationDialogComponent,
    acadkitCreateHelperComponent,
    FormConfirmationComponent,
    AddSubjectDialogComponent,
    AddExpertiseDialogComponent,
    AddTestDialogComponent,
    ComposeMailComponent,
    EmailDetailComponent,
    ReplyMailComponent,
    ReplyAllMailComponent,
    ForwardMailComponent,
    AddEventDialogComponent,
    AssignCorrectorDialogComponent,
    AssignCorrectorProblematicDialogComponent,
    AddExpectedDocumentDialogComponent,
    AbsenceJustifiedDialogComponent,
    AddUrgentMessageComponent,
    DisplayMailPopupComponent,
    GroupTestNotificationDialogComponent,
    GroupTestNotificationEditorComponent,
    StudentDialogComponent,
    ProblematicTaskDialogComponent,
    ViewHistoryComponent,
    ForwardHistoryComponent,
    CreateCrosscorrectorDialogComponent,
    BrowserNotSupportedComponent,
    TransferResponsibilityDialogComponent,
    AssignAnimatorDialogComponent,
    AddTestTaskDialogComponent,
    StudentReactivationDialogComponent,
    ExportGroupsComponent,
    FinalTranscriptDialogComponent,
    StatusUpdateDialogComponent,
    EmployabilityDialogComponent,
    SurveyRejectDialogComponent,
    FinalTranscriptRetakeDialogComponent,
    FinalCertificateDialogComponent,
    ReviseCertificationDetailsComponent,
    DuplicateConditionDialogComponent,
    TransferStudentSchoolDialogComponent,
    StudentCertDetailEditDialogComponent,
    AddAlertDialogComponent,
    AlertUserResponseDialogComponent,
    QualityControlDialogComponent
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
  constructor(
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.translate.onLangChange.subscribe(() => {
      this.dateAdapter.setLocale(this.translate.currentLang === 'fr' ? 'fr' : 'en-GB');
    });
  }
}
