import { StudentsService } from 'app/services/students.service';
import { StatusUpdateDialogComponent } from './components/settings/settingSteps/status-update/status-update.component';
import { Component, Inject, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { DOCUMENT } from '@angular/platform-browser';
import { UserService } from '../app/services/users.service';
import { CreateTestComponent } from '../app/components/test/create-test/create-test.component';
import { RNCPTitlesService } from '../app/services/rncp-titles.service';
import { environment } from 'environments/environment';
import { GlobalConstants } from './shared/settings'
import { AddUrgentMessageComponent } from '../app/dialogs/add-urgent-message-dialog/add-urgent-message-dialog.component';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { ComposeMailComponent } from '../app/components/Mail/compose-mail/compose-mail.component';
import { MailService } from 'app/services/mail.service';
import { ApplicationUrls } from 'app/shared/settings/application-urls';
import { WindowRef } from './shared/windowRef';
import { AppSettings } from './app-settings';
import { ResizeSvc } from './shared/resize_svc';
import 'rxjs/add/operator/filter';
import { SchoolTitleListComponent } from './components/school-group/school-title-list/school-title-list.component';
import { CustomerService } from './components/customer/customer.service';
import { LoginService } from './services/login.service';
import { CrossCorrectionDialogComponent } from 'app/components/cross-correction/cross-correction-dialog/cross-correction-dialog.component';
import { FinalTranscriptDialogComponent } from 'app/components/settings/settingSteps/final-transcript-dialog/final-transcript-dialog.component';
import { UserIdleService } from 'angular-user-idle';
import { TransferResponsibilityDialogComponent } from './components/settings/settingSteps/transfer-responsibility-dialog/transfer-responsibility-dialog.component';
import { SchoolGroupListComponent } from './components/school-group/school-group-list/school-group-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login-component';
import { Ng2DeviceService } from 'ng2-device-detector';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import { ExportGroupsComponent } from './components/settings/settingSteps/export-groups/export-groups.component';
import { ConfigService } from './services/config.service';
import { EmployabilityDialogComponent } from './components/employability-survey/employability-dialog/employability-dialog.component';
import { FinalCertificateDialogComponent } from './components/student/student-dialogs/final-certificate-dialog/final-certificate-dialog.component';
import { TableFilterStateService } from './services/table-fliter-state.service';
import { UtilityService } from './services/utility.service';
import _ from 'lodash';
import { TutorialService } from './services/tutorial.service';


// Required for Logging on console
import { Log } from 'ng2-logger';
import { LinkedInService } from 'angular-linkedin-sdk';
import { TransferStudentSchoolDialogComponent } from './components/settings/settingSteps/transfer-student-school-dialog/transfer-student-school-dialog.component';
import { QualityControlDialogComponent } from './components/quality-control/quality-control-dialog/quality-control-dialog.component';
import { DisplayMailPopupComponent } from './components/Mail/display-mail-popup/display-mail-popup.component';
import { AlertService } from './services/alert.service';
const log = Log.create('AppComponent');
log.color = 'orange';

declare var swal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [WindowRef, ResizeSvc]
})
export class AppComponent implements OnInit, OnChanges {

  /*************************************************************************
   *   VARIABLES
  *************************************************************************/
  // Logo Image paths
  logoEN = ApplicationUrls.imageBasePath + "assets/images/ENGLISH.png";
  logoFR = ApplicationUrls.imageBasePath + "assets/images/FRENCH.png";

  // Menu Visibility
  showRncpTitleMenu: boolean;
  showSchoolMenu: boolean;
  showUsersMgmtAdmtcMenu: boolean;
  showUsersMgmtAcademicMenu: boolean;
  showToolsMenu: boolean;
  showSchoolStudentsMenu: boolean;
  showAllStudentsMenu: boolean;
  showHistoryMenu: boolean;
  showCertificationTestsMenu: boolean;
  showPreviousCourseTab: boolean;
  showTutorialList: boolean;
  showTutorialListADMTC: boolean;
  showTutorialListACAD: boolean;
  showQualityControlMenu: boolean;

  // Group of Schools && Chief Group Academic
  showSchoolGroupRncpMenu: boolean;
  showSchoolGroupStudentMenu: boolean;

  // Common Menus
  showTaskMenu: boolean;
  showMailBoxMenu: boolean;
  showIdeasMenu: boolean;

  // Student Menus
  showStudentMenu: boolean;
  showStudentFileMenu: boolean;
  showStudentDiplomaMenu: boolean;

  // UnreadMail
  inboxCounter = 0;
  importantCounter = 0;

  // UserType
  isAdmtcUserEntity: boolean;
  isAcademicUserEntity: boolean;
  isCompanyUserEntity: boolean;
  isGroupOfSchoolEntity: boolean;

  // School & Company Info
  entityName = '';
  schoolId = '';

  // Social Login
  allowLinkedInLogin = false;


  // Keep track of LoggedUser
  public isUserAuthenticated = false;

  // TO Refactor


  RNCPTitleName = '';
  schoolShortName = '';
  UserType: any;


  dark = true;
  boxed = false;
  collapseSidebar = true;
  compactSidebar = true;
  selectedLanguage;

  duplicateCondition = false; // This flag is used for enabling/disabling duplicate condition functionality
  transferStudentSchool = false;

  user: any = {};
  isBrowserCompatible = true;

  public isRegistrationPage = false;
  addUrgentMessageDialogComponent: MdDialogRef<AddUrgentMessageComponent>;

  configCat: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'crossCorrectionDialog-Class'
  };

  exportGroupsDialog: MdDialogRef<ExportGroupsComponent>
  crossCorrectionDialog: MdDialogRef<CrossCorrectionDialogComponent>;
  finalTranscriptDialogComponentDialog: MdDialogRef<FinalTranscriptDialogComponent>;
  finalCertificateDialog: MdDialogRef<FinalCertificateDialogComponent>;
  transferResponsibilityDialog: MdDialogRef<TransferResponsibilityDialogComponent>;
  transferStudentSchoolDialogComponent: MdDialogRef<TransferStudentSchoolDialogComponent>;
  statusUpdateDialog: MdDialogRef<StatusUpdateDialogComponent>;
  employabilityDialog: MdDialogRef<EmployabilityDialogComponent>;
  qualityControlDialog: MdDialogRef<QualityControlDialogComponent>
  configcrossCorrectionDialog: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'urgentMsg-backdrop'
  };
  qualityControlDialogConfig: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'urgentMsg-backdrop'
  };

  public dialogRefDisplayMail: MdDialogRef<DisplayMailPopupComponent>;
  DisplayMailPopupConfig: MdDialogConfig = {
    disableClose: true,
    width: '850px',
    height: '65%'
  };
  configfinalTranscriptDialogComponent: MdDialogConfig = {
    disableClose: true,
    width: '650px',
    backdropClass: 'urgentMsg-backdrop'
  };
  composeMailDialogRef: MdDialogRef<ComposeMailComponent>;

  composeMailDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '720px',
    height: '530px'
  };
  configEmployabilityDialog: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'urgentMsg-backdrop'
  };
  displayFINAL_TRANSCRIPTIcon: boolean = false;
  displayCERTIDEGREEIcon: boolean = false;
  display_GROUP_EMAIL: boolean = false;
  display_INTERNAL_NOTES: boolean = false;
  display_tutorialMenu: boolean = false;
  questionnairreTools: boolean = false;

  tutoriaslArray: any[];
  listOfStudentPreviousCourses: any[] = [];
  previousCoursesSub: Subscription;


  private resizeSvc: ResizeSvc;

  showAlertUserFunctionality: false;
  newAlert: boolean;
  getAlertUserList: any;

  /*************************************************************************
   *   CONSTRUCTOR
  *************************************************************************/
  constructor(private router: Router,
    private route: ActivatedRoute,
    private mailService: MailService,
    public translate: TranslateService,
    private rncpservice: RNCPTitlesService,
    @Inject(DOCUMENT) private document: any,
    private service: UserService,
    public dialog: MdDialog,
    public customerService: CustomerService,
    public loginService: LoginService,
    private _window: WindowRef,
    pResizeSvc: ResizeSvc,
    private userIdle: UserIdleService,
    private deviceService: Ng2DeviceService,
    private configService: ConfigService,
    private utilityService: UtilityService,
    private tutorialService: TutorialService,
    private tableFilterStateService: TableFilterStateService,
    private _linkedInService: LinkedInService,
    private studentsService: StudentsService,
    private alertService: AlertService
  ) {


    // Check if the time stamp is set or not, if not => set it
    if (!localStorage.getItem(GlobalConstants.localStorageKeys.timeStamp)) {
      localStorage.setItem(GlobalConstants.localStorageKeys.timeStamp, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    }

    this.resizeSvc = pResizeSvc;

    this.setTimeStampEveryMinute();

    this.isUserBackWithinSixtyMinutes();

    log.info('Constructor Invoked');
    this.resetMenus();
    this.setUser();
    this.userIdleCheck();

    this.service.getLoginStatus().subscribe(res => {
      this.isUserAuthenticated = res;
      this.resetMenus();
      this.setUser();
    });


    // Fetch Language Set in LocalStorage
    const lang = localStorage.getItem(GlobalConstants.lang);

    if (lang !== null && lang !== '') {
      this.setLanguage(lang);
    } else {
      // Set Application Language to default app language
      this.setLanguage(environment.defaultApplicationLanguageCode);
    }
  }

  ngOnInit() {

    this.checkIfNewAlert();
    this.userIdleCheck();
    this.getConfigDetails();

    let lang = localStorage.getItem(GlobalConstants.lang);

    // Check Browser size small
    let self = this;
    let ignoreRoutesList = ['setPassword', 'forgotpassword', 'password', 'login', 'browser-not-supported', 'photoDiploma', 'myfile'];
    let urlArr = [];

    this.resizeSvc.layout.subscribe((val) => {
      if (val === 'xs' || val === 'sm') {
        let currnetRoute = window.location.href;
        let showMessage = false;
        for (let i = 0; i < ignoreRoutesList.length; i++) {
          if (currnetRoute && currnetRoute.includes(ignoreRoutesList[i])) {
            showMessage = true;
            break;
          }
        }
        if (!showMessage) {
          this.checkBrowser();
        }
      } else {
        this.checkBrowser();
      }
    });

  }

  ngOnChanges() {
    this.userIdleCheck();
  }

  /*************************************************************************
   *   METHODS
  *************************************************************************/
 checkIfNewAlert(){

  console.log(" from app");
  const currentLogin = this.loginService.getLoggedInUser();
  console.log(currentLogin);
  this.alertService.getListOfAlertUsertype().subscribe((res: any) => {
    this.getAlertUserList = res.data;
    console.log('inside 1', this.getAlertUserList);

   if(this.getAlertUserList && this.getAlertUserList.published === true){
    console.log('inside 1', this.getAlertUserList.published);
      this.newAlert = true;
   }


   if(this.newAlert === true ){
     this.OpnDisplayAlertPopup();
   }
  });





}


OpnDisplayAlertPopup(){
  this.dialogRefDisplayMail = this.dialog.open(DisplayMailPopupComponent, this.DisplayMailPopupConfig);
  if(this.newAlert === true){
    this.dialogRefDisplayMail.componentInstance.newAlert = true;
    this.dialogRefDisplayMail.componentInstance.alertData = this.getAlertUserList;
  }
}

  getPreviousCourses() {
    if (!this.previousCoursesSub) {
      this.previousCoursesSub = this.studentsService.returnPreviosCourse()
        .subscribe(
          (listOfPrevious) => {
            console.log('getPreviousCourses listOfPrevious', listOfPrevious);
            if (listOfPrevious.length) {
              this.listOfStudentPreviousCourses = listOfPrevious;
            } else {
              this.listOfStudentPreviousCourses = [];
            }
          }
        );
    }
  }

  setUser() {
    // log.info('Setuser Function Invoked!');
    this.user = this.loginService.getLoggedInUser();

    // log.data('user', this.user);
    if (this.user !== undefined && this.user) {
      log.data('User', this.user);
      if (this.user.email !== '') {
        this.isUserAuthenticated = true;
        // Set Entity Info
        this.setEntityInfo();
        this.getTutorialListBasedOnUser();
      }
      if (this.user.types != null) {
        log.data('User Types', this.user.types);
        this.user.types.forEach(name => {
          this.setUserMenuPermission(name);
        });
      }
    }
  }

  setEntityInfo() {
    // Reset Entity Name
    this.entityName = '';
    this.isAdmtcUserEntity = false;
    this.isAcademicUserEntity = false;
    this.isCompanyUserEntity = false;
    this.isGroupOfSchoolEntity = false;

    switch (this.user.entity.type) {
      case 'admtc':
        this.isAdmtcUserEntity = true;
        break;
      case 'academic':
        this.isAcademicUserEntity = true;
        this.setSchoolName();
        break;
      case 'company':
        this.setCompanyName();
        this.isCompanyUserEntity = true;
        break;
      case 'group-of-schools':
        this.isGroupOfSchoolEntity = true;
        break;
    }
  }

  setSchoolName() {
    if (this.user.entity.type === 'academic') {
      if (this.user.entity.school.hasOwnProperty('_id')) {
        this.schoolId = this.user.entity.school._id;
      }
      if (this.user.entity.school.hasOwnProperty('shortName')) {
        this.entityName = this.user.entity.school.shortName !== '' ?
          this.user.entity.school.shortName : this.user.entity.school.longName;
      } else if (this.user.entity.school.hasOwnProperty('longName')) {
        this.entityName = this.user.entity.school.longName !== '' ?
          this.user.entity.school.longName : '';
      }
    }
  }
  setCompanyName() {
    // For Mentor dont show any Company Name
    this.entityName = '';
  }
  logout() {
    this.customerService.setSelectedSchoolId('', ''); // Clearing Selected School Name and Id
    localStorage.removeItem(AppSettings.global.localStorageKeys.tokenName);
    localStorage.removeItem(AppSettings.global.localStorageKeys.loggedUser);
    localStorage.removeItem(GlobalConstants.jobDescToken);
    localStorage.removeItem(GlobalConstants.localStorageKeys.timeStamp);
    localStorage.removeItem('showUnregisteredStudentAlert');
    this.isUserAuthenticated = false;
    this.service.setIsLogoutFlag();
    this.entityName = '';
    this.tableFilterStateService.resetFiltersStates();
    this.router.navigate(['/login']);
  }

  resetMenus() {
    // Menu Visibility
    this.showRncpTitleMenu = false;
    this.showSchoolMenu = false;
    this.showUsersMgmtAdmtcMenu = false;
    this.showUsersMgmtAcademicMenu = false;
    this.showToolsMenu = false;
    this.showHistoryMenu = false;
    this.showCertificationTestsMenu = false;
    this.showTutorialListACAD = false;
    this.showTutorialListADMTC = false;
    this.showQualityControlMenu = false;

    // Common Menus
    this.showTaskMenu = false;
    this.showMailBoxMenu = false;
    this.showIdeasMenu = false;

    // Student Menus
    this.showStudentMenu = false;
    this.showStudentFileMenu = false;
    this.showPreviousCourseTab = false;
    this.listOfStudentPreviousCourses = [];

    this.showStudentDiplomaMenu = false;
    this.showSchoolStudentsMenu = false;
    this.showAllStudentsMenu = false;

    this.showSchoolGroupRncpMenu = false;
    this.showSchoolGroupStudentMenu = false;
  }


  enableMenuForStudent() {
    // Student Specific Menus
    this.showStudentFileMenu = true;
    this.showStudentDiplomaMenu = true;
    this.showTaskMenu = true;
    this.showPreviousCourseTab = true;
    this.getPreviousCourses();
    // Common Menus
    this.showMailBoxMenu = true;
    this.showIdeasMenu = true;
  }

  enableMenusForAdmtcAdminUsers() {
    this.showRncpTitleMenu = true || this.showRncpTitleMenu;
    this.showSchoolMenu = true || this.showSchoolMenu;
    this.showAllStudentsMenu = true;
    this.showUsersMgmtAdmtcMenu = true || this.showUsersMgmtAdmtcMenu;
    this.showToolsMenu = true || this.showToolsMenu;
    this.showHistoryMenu = true || this.showHistoryMenu;
    this.showCertificationTestsMenu = true;
    // Common Menus
    this.showTaskMenu = true || this.showTaskMenu;
    this.showMailBoxMenu = true || this.showMailBoxMenu;
    this.showIdeasMenu = true || this.showIdeasMenu;

    // Tutorial Tools menu
    this.showTutorialListADMTC = true;
  }
  enableMenusForCertifierAdminUsers() {
    this.showRncpTitleMenu = true || this.showRncpTitleMenu;
    this.showSchoolMenu = true || this.showSchoolMenu;
    // this.showAllStudentsMenu = true;
    this.showCertificationTestsMenu = true;
    this.showUsersMgmtAcademicMenu = true;
    this.showQualityControlMenu = true;

    // Common Menus
    this.showTaskMenu = true || this.showTaskMenu;
    this.showMailBoxMenu = true || this.showMailBoxMenu;
    this.showIdeasMenu = true || this.showIdeasMenu;
  }

  enableMenusForCertifierDirectorUsers() {
    this.showRncpTitleMenu = true || this.showRncpTitleMenu;
    this.showSchoolMenu = true || this.showSchoolMenu;
    this.showAllStudentsMenu = true;
    this.showCertificationTestsMenu = true;

    // Common Menus
    this.showTaskMenu = true || this.showTaskMenu;
    this.showMailBoxMenu = true || this.showMailBoxMenu;
    this.showIdeasMenu = true || this.showIdeasMenu;
  }
  enableMenusForAdmtcVisitor() {
    // Common Menus
    this.showTaskMenu = true || this.showTaskMenu;
    this.showMailBoxMenu = true || this.showMailBoxMenu;
    this.showIdeasMenu = true || this.showIdeasMenu;
  }
  enableMenusForAcademicDirector() {
    this.showRncpTitleMenu = true || this.showRncpTitleMenu;
    this.showUsersMgmtAcademicMenu = true || this.showUsersMgmtAcademicMenu;
    this.showSchoolStudentsMenu = true || this.showSchoolStudentsMenu;
    this.showCertificationTestsMenu = true;

    // Tutorial Tools menu
    this.showTutorialListACAD = true;

    // Common Menus
    this.showTaskMenu = true || this.showTaskMenu;
    this.showMailBoxMenu = true || this.showMailBoxMenu;
    this.showIdeasMenu = true;
  }

  enableMenusForAcademicAdmin() {
    this.showRncpTitleMenu = true || this.showRncpTitleMenu;
    this.showSchoolStudentsMenu = true || this.showSchoolStudentsMenu;
    this.showCertificationTestsMenu = true;

    // Common Menus
    this.showTaskMenu = true || this.showTaskMenu;
    this.showMailBoxMenu = true || this.showMailBoxMenu;
    this.showIdeasMenu = true;
  }
  enableMenusForAcademicGroupChief() {
    this.showSchoolStudentsMenu = true || this.showSchoolStudentsMenu;
    this.showRncpTitleMenu = true || this.showRncpTitleMenu;
    this.showMailBoxMenu = true || this.showMailBoxMenu;
  }
  enableMenusForSchoolGroupEntity() {
    this.showSchoolGroupRncpMenu = true || this.showSchoolGroupRncpMenu;
    this.showTaskMenu = true || this.showTaskMenu;
    this.showIdeasMenu = true || this.showIdeasMenu;
    this.showMailBoxMenu = true || this.showMailBoxMenu;
    this.showCertificationTestsMenu = true;
  }
  enableMenusForDirector() {
    this.showSchoolStudentsMenu = true || this.showSchoolStudentsMenu;
    this.showRncpTitleMenu = true || this.showRncpTitleMenu;
    this.showMailBoxMenu = true || this.showMailBoxMenu;
    this.showCertificationTestsMenu = true;
  }

  enableMenusForCorrector() {
    this.showRncpTitleMenu = true || this.showRncpTitleMenu;
    this.showTaskMenu = true || this.showTaskMenu;
    this.showMailBoxMenu = true || this.showMailBoxMenu;
    this.showIdeasMenu = true || this.showIdeasMenu;
  }

  setUserMenuPermission(UserType) {
    switch (UserType.name.toLowerCase()) {
      case 'mentor':
        // Mentor Type is a single Type. It cannot hold Multiple UserTypes
        this.showStudentMenu = true;

        // Common Menus
        this.showTaskMenu = true;
        this.showMailBoxMenu = true;
        //  this.showIdeasMenu = true;
        break;
      case 'student':
        // Student Type is a single Type. It cannot hold Multiple UserTypes
        this.enableMenuForStudent();
        break;
      // ADMTC Entity Users
      case 'sales':
        if (this.isAdmtcUserEntity) {
          this.enableMenusForAdmtcAdminUsers();
        }
        break;
      case 'admin':
        if (this.user.operationRoleType === 'certifier' && this.isAcademicUserEntity) {
          this.enableMenusForCertifierAdminUsers();
        } else if (this.isAdmtcUserEntity) {
          this.enableMenusForAdmtcAdminUsers();
        }
        break;
      case 'director':
        if (this.user.operationRoleType === 'certifier' && this.isAcademicUserEntity) {
          this.enableMenusForCertifierDirectorUsers();
        } else if (this.isAdmtcUserEntity) {
          this.enableMenusForAdmtcAdminUsers();
        } else if (this.isAcademicUserEntity) {
          this.enableMenusForDirector();
        }
        break;
      case 'visitor':
        this.enableMenusForAdmtcVisitor();
        break;
      // END ADMTC Entity Users
      case 'academic-director':
        this.enableMenusForAcademicDirector();
        break;
      case 'group-chief-of-academic-directors-and-admin':
        this.enableMenusForAcademicGroupChief();
        break;
      case 'academic-admin':
        this.enableMenusForAcademicAdmin();
        break;
      case 'chief-group-academic':
        this.enableMenusForSchoolGroupEntity();
        break;
      case 'corrector':
      case 'cross-corrector':
      case 'animator-business-game':
      case 'corrector-certifier':
        // Cross-corrector, Animator-Business-Game and Corrector Certifier users have similar Main Menu Permissions as Corrector
        this.enableMenusForCorrector();
        break;
      default:
        // Common Menus
        this.showTaskMenu = true;
        this.showMailBoxMenu = true;
        this.showIdeasMenu = true;
        break;
    }
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    if (lang === 'fr') {
      this.translate.get('FRENCH').subscribe((val) => {
        this.selectedLanguage = val;
      });
    } else {
      this.translate.get('ENGLISH').subscribe((val) => {
        this.selectedLanguage = val;
      });
    }
    this.storeCurrentLangInStorage(lang.toLowerCase());
  }

  eventChange(event) {
    if (event instanceof CreateTestComponent) {
      const RNCP = this.rncpservice.getSelectedRncpTitle().getValue();
      this.RNCPTitleName = RNCP.shortName;
    } else if ((event instanceof SchoolTitleListComponent) ||
      (event instanceof DashboardComponent)) {
      if (this.user.entity.type.toLowerCase() === 'group-of-schools') {
        this.showSchoolGroupStudentMenu = true;
        this.schoolShortName = this.customerService.getSelectedSchoolId().schoolName;
      }
    } else if (event instanceof SchoolGroupListComponent || event instanceof LoginComponent) {
      this.showSchoolGroupStudentMenu = false;
      this.RNCPTitleName = '';
      this.schoolShortName = '';
    } else {
      // this.showSchoolGroupStudentMenu = false;
      this.RNCPTitleName = '';
      // this.schoolShortName = '';
    }
  }


  /*
  CODE TO BE Refactored
  */

  isStudent() {
    if (this.user !== undefined && this.user) {
      if (this.user.isUserStudent === true) {
        return true;
      }
    }
    return false;
  }
  isMentor() {
    if (this.user !== undefined && this.user) {
      if (this.user.types && this.user.types[0] && this.user.types[0].name === 'mentor') {
        return true;
      }
    }
    return false;
  }
  isCorrector() {
    if (this.user !== undefined && this.user) {
      if (this.user.types && this.user.types[0] && this.user.types[0].name === 'corrector') {
        return true;
      }
    }
    return false;
  }
  isDirectorAcademic() {

    if (this.user !== undefined && this.user) {
      if (this.user.types && this.user.types[0] && this.user.types[0].name === 'Director') {
        return true;
      }
    }
    return false;

  }
  isSales() {

    if (this.user !== undefined && this.user) {
      if (this.user.types && this.user.types[0] && this.user.types[0].name === 'Sales') {
        return true;

      }
    }
    return false;
  }
  isParent() {
    if (this.user !== undefined && this.user) {
      if (this.user.types && this.user.types[0] && this.user.types[0].name === 'Parent') {
        return true;
      }
    }
    return false;
  }


  goHome() {
    if (this.isUserAuthenticated) {
      this.router.navigate(['/rncp-titles']);
    } else {
      this.router.navigate(['/login']);
    }

  }
  openUrgentMailDialog() {
    this.addUrgentMessageDialogComponent = this.dialog.open(AddUrgentMessageComponent, this.configCat);
    this.addUrgentMessageDialogComponent.afterClosed().subscribe((status) => {

    });
  }

  openGrouptMailDialog() {
    this.composeMailDialogConfig.data = {};
    this.composeMailDialogRef = this.dialog.open(ComposeMailComponent, this.composeMailDialogConfig);
    this.composeMailDialogRef.componentInstance.tags = ['compose-new'];
    this.composeMailDialogRef.componentInstance.setGroupEmailCondition();
  }

  openComposeMailDialog() {
    this.composeMailDialogConfig.data = {};
    this.composeMailDialogRef = this.dialog.open(ComposeMailComponent, this.composeMailDialogConfig);
    this.composeMailDialogRef.componentInstance.disableAddEditing = true;
    this.composeMailDialogRef.componentInstance.displayBCC = true;
    this.composeMailDialogRef.componentInstance.displayCC = true;
    this.composeMailDialogRef.componentInstance.showSubject = false;
    const isAcadType = this.user.operationRoleType === 'preparation-center' && this.isAcademicUserEntity &&
      !this.utilityService.checkUserIsAcademicDirector();
    this.helpMailSetToBcc(isAcadType);
    if (isAcadType) {
      this.helpMailGetCc();
    }
  }

  helpMailSetToBcc(isAcadType) {
    const constEmailList = ['aide@admtc.pro', 'sandrine.forestier@admtc.pro', 'corinne.crespin@admtc.pro', 'dominique.hunin@admtc.pro'];
    this.mailService.findMailCivility(constEmailList).subscribe((response) => {
      if (response.data) {
        const users = response.data;
        const toUserList = _.remove(users, (user) => { return user.email === 'aide@admtc.pro'; });
        this.composeMailDialogRef.componentInstance.selectedRecepientsList = toUserList.map(
          (user) => {
            return {
              email: user.email,
              display: user.firstName + ' ' + user.lastName + ' <' + user.email + '>',
              civility: '',
              sex: user.sex
            };
          });

        const listUsers = users.map(
          (user) => {
            return {
              email: user.email,
              display: user.firstName + ' ' + user.lastName + ' <' + user.email + '>',
              civility: '',
              sex: user.sex
            };
          });

        if (isAcadType) {
          this.composeMailDialogRef.componentInstance.bccselectedRecepientsList = listUsers;
          this.composeMailDialogRef.componentInstance.showBCCInput = true;
        } else {
          this.composeMailDialogRef.componentInstance.ccselectedRecepientsList = listUsers;
          this.composeMailDialogRef.componentInstance.showCCInput = true;
        }
      }
    });
  }

  helpMailGetCc() {
    this.composeMailDialogRef.componentInstance.showCCInput = true;
    this.service.getCreatedByEmailDetails(this.user._id).subscribe((response) => {
      if (response.data) {
        const ccUsers = response.data;
        this.composeMailDialogRef.componentInstance.ccselectedRecepientsList = ccUsers.map(
          (user) => {
            return {
              email: user.email,
              display: user.firstName + ' ' + user.lastName + ' <' + user.email + '>',
              civility: user.civility,
              sex: user.sex
            };
          });
      }
    });
  }

  updateUnreadCount() {
    this.mailService.countUnreadMailbyMailType('unread', 'inbox').subscribe((response) => {
      if (response.hasOwnProperty('count')) {
        this.inboxCounter = response.count;
      }
    });
    this.mailService.countUnreadMailbyMailType('unread', 'important').subscribe((response) => {
      if (response.hasOwnProperty('count')) {
        this.importantCounter = response.count;
      }
    });
  }

  redirectToSchool() {
    const schoolId = this.customerService.getSelectedSchoolId().schoolId;
    this.schoolShortName = this.customerService.getSelectedSchoolId().schoolName;
    this.router.navigate(['school', schoolId, 'edit', 0]);
  }

  storeCurrentLangInStorage(currentLang: string) {
    if (currentLang !== '') {
      localStorage.setItem(GlobalConstants.lang, currentLang);
    }
  }

  gotoCrossCorrection() {
    let self = this;
    this.crossCorrectionDialog = this.dialog.open(CrossCorrectionDialogComponent, this.configcrossCorrectionDialog);
    this.crossCorrectionDialog.afterClosed().subscribe((data) => {
      console.log(data);
      if (data.status) {
        self.router.navigate(['tools/cross-correction', data.TitleId, data.ClassId, data.TestId]);
      }
    });
  }

  gotoFinalTranscript() {
    this.finalTranscriptDialogComponentDialog = this.dialog.open(FinalTranscriptDialogComponent, this.configfinalTranscriptDialogComponent);
  }

  openFinalCertificateDialog() {
    const configFinalCertificateDialog = {
      disableClose: true,
      width: '650px',
      backdropClass: 'urgentMsg-backdrop'
    };
    this.finalCertificateDialog = this.dialog.open(FinalCertificateDialogComponent, configFinalCertificateDialog);
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  checkBrowser() {
    // Getting Browser Info
    const deviceInfo = this.deviceService.getDeviceInfo();
    log.data(`checkBrowser() says broswer is ${deviceInfo.browser}`);

    // Array of support Browsers
    const supportedBrowsers = ['chrome', 'firefox', 'opera', 'ms-edge'];

    const supportindex = supportedBrowsers.findIndex((browserName) => browserName === deviceInfo.browser);
    // Checking if Browser is Supported
    if (supportindex < 0) {
      // Routing To Browser-not-supported Page
      this.isBrowserCompatible = false;
      this.router.navigate(['/browser-not-supported']);
    }
  }

  openTransferResponsibilityDialog() {
    this.transferResponsibilityDialog = this.dialog.open(TransferResponsibilityDialogComponent, this.configcrossCorrectionDialog);
  }

  openStatusUpdateDialog() {
    this.statusUpdateDialog = this.dialog.open(StatusUpdateDialogComponent, {
      disableClose: true,
      width: '600px',
      backdropClass: 'urgentMsg-backdrop'
    });
  }

  userIdleCheck() {
    // console.log('idle start watching');
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      var activeDialogs = [].slice.call(document.getElementsByTagName('md-dialog-container')); // [].slice.call('data') converts data into array
      // console.log(activeDialogs);
      for (const d of activeDialogs) {
        d.hidden = true;
        d.style.display = 'none';
      }
      this.logout();
    });
  }

  setTimeStampEveryMinute() {
    Observable.interval(GlobalConstants.timeInterval).subscribe(x => {
      localStorage.setItem(GlobalConstants.localStorageKeys.timeStamp, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    });
  }

  isUserBackWithinSixtyMinutes() {
    if (localStorage.getItem(GlobalConstants.localStorageKeys.timeStamp)) {
      const prevTime = moment(localStorage.getItem(GlobalConstants.localStorageKeys.timeStamp));
      const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const duration = moment.duration(prevTime.diff(now));
      const seconds = duration.asSeconds();
      console.log(seconds);
      if (Math.abs(seconds) > GlobalConstants.timeStampLimit) {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  openExportGroupsDialog() {
    this.exportGroupsDialog = this.dialog.open(ExportGroupsComponent, this.configcrossCorrectionDialog);
  }

  getConfigDetails() {
    this.configService.getConfigDetails().subscribe(
      (data) => {
        console.log("sadfsa",data);
        if (data.notifications) {
          this.displayFINAL_TRANSCRIPTIcon = data.notifications.FINAL_TRANSCRIPT;
          this.questionnairreTools = data.QUESTIONNAIRRE_TOOLS;
          this.displayCERTIDEGREEIcon = data.menu ? data.menu.CERTIDEGREE : false;
          this.display_tutorialMenu = data.menu ? data.menu.tutorialMenu : false;
          this.display_GROUP_EMAIL = data.menu ? data.menu.GROUP_EMAIL : false;
          this.display_INTERNAL_NOTES = data.menu ? data.menu.INTERNAL_NOTES : false;
        }

        if (data.login && data.login.allowSocialLogin) {
          this.allowLinkedInLogin = data.login.allowLinkedInLogin ? data.login.allowLinkedInLogin : false;
        }

        if (data && data.DUPLICATE_CONDITION) {
          this.duplicateCondition = data.DUPLICATE_CONDITION;
        }

        if (data && data.menu.transferStudentSchool) {
          this.transferStudentSchool = data.menu.transferStudentSchool;
        }

        if (data && data.menu.showAlertUserFunctionality) {
          this.showAlertUserFunctionality = data.menu.showAlertUserFunctionality;
        }

        log.data('getConfigDetails displayFINAL_TRANSCRIPTIcon', this.displayFINAL_TRANSCRIPTIcon);
        log.data('getConfigDetails questionnairreTools', this.questionnairreTools);
        log.data('getConfigDetails displayCERTIDEGREEIcon', this.displayCERTIDEGREEIcon);
      },
      (error) => {
        log.data('getConfigDetails data', error);
      }
    );
  }

  gotoPrivacyPolicy() {
    const privacyPolicylink = document.createElement('a');
    privacyPolicylink.target = '_blank';

    if (this.translate.currentLang.toLowerCase() === 'en') {
      privacyPolicylink.href = ApplicationUrls.baseApi + GlobalConstants.privacyPolicy.ENLink;
    } else {
      privacyPolicylink.href = ApplicationUrls.baseApi + GlobalConstants.privacyPolicy.FRLink;
    }

    privacyPolicylink.setAttribute('visibility', 'hidden');
    document.body.appendChild(privacyPolicylink);
    privacyPolicylink.click();
    document.body.removeChild(privacyPolicylink);
  }
  gotoEmployabilitySurvey() {
    this.employabilityDialog = this.dialog.open(EmployabilityDialogComponent, this.configEmployabilityDialog);
    this.employabilityDialog.afterClosed().subscribe((data) => {
      if (data.status) {
        this.router.navigate(['']);
      }
    });
  }

  openTutorialLink(link) {
    if (link) {
      const tutorialLink = document.createElement('a');
      tutorialLink.target = '_blank';
      tutorialLink.href = link; tutorialLink.setAttribute('visibility', 'hidden');
      document.body.appendChild(tutorialLink);
      tutorialLink.click();
      document.body.removeChild(tutorialLink);
    }
  }

  getTranslateUserType(name) {
    if (name === '') {
      return this.translate.instant('ADMTCSTAFFKEY.ALL USER');
    } else {
      const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
      return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
    }
  }


  getTutorialTitle(title) {
    const value = this.translate.instant('TUTORIALS_List.' + title.toUpperCase());
    return value !== 'TUTORIALS_List.' + title.toUpperCase() ? value : title;
  }

  getTutorialListBasedOnUser() {
    const params: any = {};
    let userList = [];
    if (!this.utilityService.checkUserIsAcademicDirector() && !this.utilityService.checkUserIsDirectorSalesAdmin()) {
      const typesArray = [];
      this.user.types.forEach(
        (type) => {
          typesArray.push(type._id);
          userList.push(type.name.toUpperCase());
        }
      );
      userList.push('');
      params['userTypeId'] = typesArray;
    }
    this.tutorialService.getTutorialListBasedOnUser(params)
      .subscribe(
        (listofTutorials) => {
          log.data('getTutorialListBasedOnUser listofTutorials', listofTutorials);
          if (listofTutorials.data) {
            const tutorialStructure: any = [];
            userList.forEach(
              (user, index) => {
                tutorialStructure.push({
                  linkList: []
                });
                listofTutorials.data.forEach(
                  (tutorial) => {
                    if (tutorial.userType.length && this.filterUserType(user, tutorial)) {
                      tutorialStructure[index]['name'] = user;
                      tutorialStructure[index]['linkList'].push(tutorial);
                    } else if (user === '' && tutorial.userType.length === 0) {
                      tutorialStructure[index]['name'] = '';
                      tutorialStructure[index]['linkList'].push(tutorial);
                    }
                  }
                )
              });
            log.data('getTutorialListBasedOnUser tutorialStructure', tutorialStructure);
            this.tutoriaslArray = tutorialStructure;
          }
        }
      );
  }

  // Social Login Logic
  public subscribeToLogin() {
    this._linkedInService.login().subscribe({
      next: (state) => {
        // state will always return true when login completed
        if (state) {
          this.rawApiCall();
        }
      },
      complete: () => {
        // this.getProfileData(this._linkedInService.getSdkIN().ENV.auth.oauth_token);
        // this.rawApiCall();
      }
    });
  }

  public rawApiCall() {
    const url = '/people/~:(id,email-address)?format=json';
    this._linkedInService.raw(url)
      .asObservable()
      .subscribe({
        next: (data: any) => {
          console.log(data);
          const loginData = {
            email: data.emailAddress,
            registerFrom: 'linkedin',
            lang: this.translate.currentLang.toLowerCase()
          };
          this.socialRegister(loginData);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('RAW API call completed');
        }
      });
  }

  socialRegister(loginData) {
    this.loginService.socialRegister(loginData, this.user._id, this.loginService.getToken()).subscribe(data => {
      console.log(data);
      if (data.data) {
        this.user = data.data.user;
        swal({
          type: 'success',
          title: this.translate.instant('SOCIAL_LOGIN.SOCIAL_S2.TITLE'),
          text: this.translate.instant('SOCIAL_LOGIN.SOCIAL_S2.TEXT'),
          confirmButtonText: this.translate.instant('SOCIAL_LOGIN.SOCIAL_S2.BUTTON')
        });
      } else {
        swal({
          type: 'warning',
          title: this.translate.instant('SOCIAL_LOGIN.SOCIAL_LOGIN_USER_NOT_REGISTERED.TITLE'),
          text: this.translate.instant('SOCIAL_LOGIN.SOCIAL_LOGIN_USER_NOT_REGISTERED.TEXT')
        });
      }
    });
  }

  checkIfStudentorMentor() {
    if (this.user && this.user.types && this.user.types.length > 0) {
      const isUserStudentOrMentor = _.find(this.user.types, function (uT) {
        return uT.name === 'student' || uT.name === 'mentor';
      });
      return isUserStudentOrMentor;
    }
  }

  // Trasnfer Student From one school to another
  openTransferStudentFromSchool() {
    this.transferStudentSchoolDialogComponent = this.dialog.open(TransferStudentSchoolDialogComponent, this.configcrossCorrectionDialog);
  }

  openQualityControlDialog() {
    this.qualityControlDialog = this.dialog.open(QualityControlDialogComponent, this.qualityControlDialogConfig);
  }

  onTutorials() {
    this.router.navigate(['tutorial/list']);
  }
  filterUserType(user, tutorial) {
    const usr = user.toUpperCase();
    const tutorials = tutorial.userType;
    const tuts = _.filter(tutorials, (tutorial) => {
      console.log(tutorial);
      if (usr === tutorial.name.toUpperCase()) {
          return usr;
        }
    });
    if (tuts.length) {
      return true;
    }
    return false;
  }
}
