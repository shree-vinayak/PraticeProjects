import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit, AfterViewChecked,
} from '@angular/core';
import { Router, ActivatedRoute, } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import _ from 'lodash';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { TestCorrection } from '../../../models/correction.model';
import { TestCorrectionService } from '../../../services/test-correction.service';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { UserService } from '../../../services/users.service';
import { FormConfirmationComponent } from '../../../dialogs/form-confimation-dialog/form-confimation-dialog.component';
import { MdDialogConfig, MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { PDFService } from '../../../services/pdf.service';
import { Print, DownloadAnyFileOrDocFromS3, FileUpload } from '../../../shared/global-urls';
import { TestService } from '../../../services/test.service';
import { TestDetailsDialogComponent } from '../../../dialogs/test-details-dialog/test-details-dialog.component';
import { PRINTSTYLES, STYLES } from '../test-document/styles';
declare var swal: any;
import { FileUploader } from 'ng2-file-upload';
import { AddExpectedDocumentDialogComponent } from './add-expected-document-dialog/add-expected-document-dialog.component';
import { AbsenceJustifiedDialogComponent } from './absence-justified-dialog/absence-justified-dialog.component';
import { AcademicKitService } from '../../../services/academic-kit.service';
import { Subscription } from 'rxjs/Subscription';
import { TasksService } from '../../../services/tasks.service';
import { UtilityService } from '../../../services/utility.service';
import { CrossCorrectionService } from '../../../components/cross-correction/cross-correction.service';
import { DatePipe, Location } from '@angular/common';
import { ApplicationUrls } from 'app/shared/settings';
import { CustomerService } from 'app/components/customer/customer.service';
import { LoginService, MentorEvaluationService } from 'app/services';
import { Tasks } from '../../../models/tasks.model';
// Required for Logging on console
import { Log } from 'ng2-logger';
import { evalPDFModal } from '../../student/evaluation-grid/evaluation-pdf.modal';
import { AppSettings } from 'app/app-settings';
const log = Log.create('TestCorrectionComponent');
log.color = 'green';

@Component({
  selector: 'test-correction',
  templateUrl: './test-correction.component.html',
  styleUrls: ['./test-correction.component.scss']
})


export class TestCorrectionComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('pagesElement') documentPagesRef: ElementRef;
  correction;
  page = new Page();
  sort = new Sort();
  students: any[] = [];
  groups: any[] = [];
  searchedStudents: any[] = [];
  searchedGroup: any[] = [];
  selectedIndex: number;
  StudentList;
  studentSelectDetails;
  filterStudentList;
  SearchStudent;
  SearchGroup;
  positionStack = [];
  currentLoginUser: any = '';
  selectedRncpTitle: any;
  formConfirmValue: string = '';
  oldStudentValue: string = '';
  oldStudentName: string = '';
  isMissingCopy: boolean = false
  configDoc: MdDialogConfig = {disableClose: true,width: '600px',height: '80%',position: {top: '',bottom: '',left: '',right: ''}};
  configExpectedDoc: MdDialogConfig = {disableClose: true,width: '600px',height: 'auto',position: {top: '',bottom: '',left: '',right: ''}};
  formConfigmDoc: MdDialogConfig = {disableClose: true,width: '500px',height: '',position: {top: '',bottom: '',left: '',right: ''}};
  selectedStudentArray = [];
  selectedGroupArray = [];
  selectedGroup : any;
  public testCorrection = new TestCorrection();
  reorderable = true;
  ngxDtCssClasses = {sortAscending: 'fa fa-caret-up',sortDescending: 'fa fa-caret-down',pagerLeftArrow: 'icon-left',pagerRightArrow: 'icon-right',pagerPrevious: 'icon-prev',pagerNext: 'icon-skip'};
  testDetails;
  public form: FormGroup;
  listServiceFeature = [];
  listJury = [];
  testCorrect;
  rncpTitle;
  testDetailsDialog: MdDialogRef<TestDetailsDialogComponent>;
  formConfirmationComponent: MdDialogRef<FormConfirmationComponent>;
  private today;
  private currentSchoolYear;
  private totalMarks = [];
  selectedStudent = null;
  selectedTestId = null;
  updatingCorrection = false;
  studentSelect: any;
  groupSelect:any;
  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });
  @ViewChild('userphoto') uploadInput: any;
  addExpectedDocumentDialog: MdDialogRef<AddExpectedDocumentDialogComponent>;
  absenceJustifiedDialog: MdDialogRef<AbsenceJustifiedDialogComponent>;
  document;
  student;
  selectedStudentDetails;
  selectedGroupDetails;
  taskId;
  user;
  datePipe;
  readOnly = false;
  schoolID: string = '';
  schoolDetails;
  isUserCorrector = false;
  isUserCertifierCorrector = false;
  isCrossCorrector: boolean = false;
  isTestReTask: boolean = false;
  isRedoMarksEntry: boolean = false;
  isTestMentorEvaluation: boolean = false;
  task: Tasks;
  numberOfJuryRemoved = 0;
  isCrossCorrectionAcadKit: boolean = false;
  scholarSubscription: Subscription;
  // This variable used for decide when acadir also a corrector when validate test
  showValidateButton = false;
  @ViewChild('TopLeftHeader') elementView: ElementRef;
  @ViewChild('SectionDBTabe') SectionDBTabe: ElementRef;
  juryEnabledList: { position: number; state: boolean}[] = [];
  juryDisabled = 0;



  pages: number;
  pageSectionsArray: any[] = [];
  visiblePage = 1;
  docFooterText = '';
  scholarSeason = '';
  dt = new Date();
  currentYear = this.dt.getFullYear();
  nextYear = this.dt.getFullYear() + 1;
  modificationPeriodDate;
  showSubmitValidateBtn=false;
  checkIsMorethen14days=false;
  evalPdf = new evalPDFModal();
  studentForQualityControl: any[] = [];
  theTestId = '';
  ifEntryForQc = false;

  private subscription: Subscription;
  constructor(private testCorrectionService: TestCorrectionService,
    private testService: TestService,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private routes: Router,
    private dialog: MdDialog,
    private translate: TranslateService,
    private appService: RNCPTitlesService,
    private service: UserService,
    private pdfService: PDFService,
    private acadService: AcademicKitService,
    private taskService: TasksService,
    public utilityService: UtilityService,
    public crossCorrectionService: CrossCorrectionService,
    private schoolService: CustomerService,
    public loginService: LoginService,
    private location: Location,
    private mentorEvalService: MentorEvaluationService, private cdr: ChangeDetectorRef
  ) {
    let student;
    const test = {};
    this.router.params.subscribe(params => {
      student = params['id'];
    });

    test['student'] = [null, Validators.required];
    this.form = this.fb.group(test);
    this.testCorrect = new TestCorrection();
  }

  filteredStudents: Observable<any[]>;
  filteredGroup: any[] = [];
  filter(val: any): any[] {
    const students = this.students.filter(std => {
      //return std.correctedTests && !std.correctedTests[0].correction.missingCopy ? false : true;
      return true;
    });
    return val.length >= 3 ? students.filter(option =>
      (option.lastName + ' ' + option.firstName).toLocaleLowerCase().includes(val.trim().toLowerCase())) : students;
  }

  ngOnDestroy() {
    if (this.scholarSubscription) {
      this.scholarSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    log.info('ngOnInit Invoked!');
    let self = this;
    this.subscription = this.router.queryParams.subscribe(qParams => {
      if (qParams.hasOwnProperty('school')) {
        self.schoolID = qParams['school'];

        self.schoolService.getCustomerById(this.schoolID).subscribe((response) => {
          // this.RNCPTitleList = [];
          self.schoolDetails = response.data && response.data.length ? response.data[0] : {};
        });
      }

      if (qParams.hasOwnProperty('crossCorrection')) {
        self.isCrossCorrectionAcadKit = qParams['crossCorrection'] === 'true' ? true : false;
      }
      self.subscription = self.router.params.subscribe(params => {
        if (params['titleId'] && params['testId']) {
          this.theTestId =  params['testId'];
          self.appService.getOptimizedRNCPById(params['titleId']).subscribe((data) => {
            this.selectedRncpTitle = data;
             self.testCorrectionService.selectTest(params['testId']);
             self.InitTestCorrectionData();
          });

          if (params.hasOwnProperty('taskId') && params['taskId']) {
            self.taskId = params['taskId'];
            self.readOnly = false;
          }else{
            self.readOnly = true;
          }

        }else{
           this.taskId = this.testCorrectionService.getSelectedTask();
           self.InitTestCorrectionData();
         }
       });
     });

      this.user = this.loginService.getLoggedInUser();
      //TODO: Refactor Entire code. All permissions should be checked when user logs in.
      // Code should be in a model and saved in localstorage.
      if (this.user !== undefined && this.user) {
        // Handle case for entity type certifier [Database Entity]
        if (this.user.entity.type === 'academic' && this.user.operationRoleType === 'certifier')
        {
          self.showSubmitValidateBtn = this.utilityService.checkUserIsAdminOfCertifier() ||
                                       this.utilityService.checkUserIsCertifierCorrector() ||
                                       this.utilityService.checkUserIsQualityControlCorrector();
          this.isUserCertifierCorrector = this.utilityService.checkUserIsCertifierCorrector();
        }
        else
        {
          // Handle case for entity type academic [Database Entity]
          if (this.user.types != null) {
            this.user.types.forEach(UserType => {
              if(UserType.name.toLowerCase() === 'sales' && this.user.entity.type === 'admtc'){
                self.showSubmitValidateBtn = true;
              }
              if(['admin','director'].indexOf(UserType.name.toLowerCase()) !== -1 && this.user.entity.type === 'admtc' && this.user.operationRoleType !== 'certifier'){
                self.showSubmitValidateBtn = true;
                this.showValidateButton = true;
              }
              if(UserType.name.toLowerCase() === 'academic-director') {
                self.showSubmitValidateBtn = true;
                this.showValidateButton = true;
              }
              if(UserType.name.toLowerCase() === 'academic-admin') {
                self.showSubmitValidateBtn = true;
                this.showValidateButton = true;
              }
              if(UserType.name.toLowerCase() === 'cross-corrector') {
                self.showSubmitValidateBtn = true;
              }
              if(UserType.name.toLowerCase() === 'corrector') {
                self.showSubmitValidateBtn = true;
                self.isUserCorrector = true;
              }
            });
          }
      }

      }

  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
  }


  InitTestCorrectionData() {
    log.info('InitTestCorrectionData invoked');

    let self = this;
    this.testCorrectionService.resetCorrectionData();
    this.appService.getSelectedRncpTitle().subscribe((value) => {
      if (value && value._id) {
        if (!self.selectedRncpTitle) {
          self.selectedRncpTitle = value;
        }
      self.scholarSubscription = self.appService.getSelectedScholarSeason(self.selectedRncpTitle._id).subscribe((season) => {
          if (season.length !== 0) {
            self.scholarSeason = season[0].scholarseason;
          }
        });
      }
    });//END  this.appService.getSelectedRncpTitle().subscribe

    this.currentLoginUser = this.service.getCurrentUserInfo();
    const selectedTestId = this.testCorrectionService.getSelectedTest();
    this.selectedTestId = selectedTestId;

    log.info('selectedTestId:'+selectedTestId+' taskId:'+this.taskId);
// boomba
    /*Get Task ID */
    if(this.taskId) {
      this.taskService.getTaskByTaskId(this.taskId).subscribe((result) => {
        if(result) {
          this.task = result['data'][0];
          const xx = this.utilityService.checkIsQualityControlCorrector();
          console.log(xx);
          if(result['data'][0] && result['data'][0]['userSelection']['userId'] &&
            ( !this.utilityService.checkUserIsDirectorSalesAdmin() &&
              !this.utilityService.checkUserIsAcademicDirector() &&
              !this.utilityService.checkUserIsAdminOfCertifier() &&
              !this.utilityService.checkUserIsCorrector() &&
              !this.utilityService.checkUserIsCrossCorrector() &&
              !this.utilityService.checkUserIsCertifierCorrector() &&
            !this.utilityService.checkIsQualityControlCorrector())
            ) {
            if(
              (this.currentLoginUser['_id'] !== result['data'][0]['userSelection']['userId']['_id'] &&
              this.currentLoginUser.entity.school._id !== result['data'][0]['userSelection']['userId']['entity']['school']['_id']) ||
              !this.utilityService.checkUserIsDirectorSalesAdmin()
            ){
              swal({
                  title:this.translate.instant('TESTCORRECTIONS.ACCESSDENIEDMARKSENTRYTTITLE'),
                  html: this.translate.instant('TESTCORRECTIONS.ACCESSDENIEDMARKSENTRYTEXT'),
                  allowEscapeKey:true,
                  type: 'error'
              });
              this.location.back();
            }
          }


          //Check Is cross correction type
          if(result['data'][0] && result['data'][0]['type'] === 'crossCorrection'){
            self.isCrossCorrector = true;
            self.testCorrectionService.getTest(this.selectedTestId).subscribe((value) => {
              self.testDetails = value;
              if (this.ifEntryForQc) {
                const taskAssignedTo = this.task.userSelection.userId._id;
                const studentsCorValue = value.correctorAssignedForQualityControl ? _.find(value.correctorAssignedForQualityControl,
                  { 'correctorId': taskAssignedTo}) : [];
                this.studentForQualityControl =  studentsCorValue.students;
                console.log(this.studentForQualityControl);
                for (let i = 0; i < this.studentForQualityControl.length; i++) {
                  const correctedTest = _.find(this.studentForQualityControl[i].correctedTests,
                    {'test': this.selectedTestId} );
                  this.studentForQualityControl[i].correctedTests = [];
                  this.studentForQualityControl[i].correctedTests.push(correctedTest);
                  let correctedTestForQC = _.find(this.studentForQualityControl[i].correctedTestsForQualityControl,
                    {'test': this.selectedTestId} );
                  if (correctedTestForQC === undefined) {
                    correctedTestForQC = {};
                  }
                  this.studentForQualityControl[i].correctedTestsForQualityControl = [];
                  this.studentForQualityControl[i].correctedTestsForQualityControl.push(correctedTestForQC);
                }
              }
              this.renderData();
              log.info('Call 3');
              self.loadStudentBasedOnUser();
            });
            return;
          }
          //Check Is submitStudentsForRetakeTest type
          else if(result['data'][0] && result['data'][0]['type'] === 'submitStudentsForRetakeTest'){
            self.isTestReTask = true;
            self.readOnly = true;
          }
          //Check Is redoMarksEntry type
          else if(result['data'][0] && result['data'][0]['type'] === 'redoMarksEntry'){
            self.isRedoMarksEntry = true;
          }
          // check if the marksEnry is for QC
          else if (result['data'][0] && result['data'][0]['type'] === 'marksEntryForQualityControl') {
            this.ifEntryForQc = true;
            this.theTestId = this.selectedTestId;
            this.getStudentOfQualityControl(this.selectedTestId);
          }
          else {
            log.info('Call 2');
            self.loadStudentBasedOnUser();
          }
        }
        this.checkIfTestId(selectedTestId);
       });
    } else {
      this.checkIfTestId(selectedTestId);
    }



    // END -  if(this.taskId)
    // if(!self.isCrossCorrector) {
    //   if (!selectedTestId) {
    //     this.routes.navigate(['rncp-titles']);
    //   } else if (typeof selectedTestId === 'function') {
    //     this.routes.navigate(['rncp-titles']);
    //   } else {
    //     this.testCorrectionService.getTest(this.selectedTestId).subscribe((value) => {
    //       this.testDetails = value;
    //       this.renderData();


    //       if(this.testDetails['type'] == "mentor-evaluation"){
    //         this.isTestMentorEvaluation = true;
    //       }

    //       if(this.testDetails.groupTest){
    //         this.getGroups();
    //       }else{
    //         let rncpTitle;
    //         this.rncpTitle = this.selectedRncpTitle.longName;
    //         rncpTitle = this.selectedRncpTitle.longName;
    //         log.info('Call 1');
    //         this.loadStudentBasedOnUser();

    //     }
    //     });
    //   }
    // }


    /*Upload Student Photo*/
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.uploader.queue[0].upload();
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      swal({
        title: 'Attention',
        html: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey:true,
        type: 'warning'
      });
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const today = new Date();
      const publicationDateObj = {
        year: today.getFullYear(),
        month: (today.getMonth() + 1),
        date: today.getDate(),
        hour: today.getHours(),
        minute: today.getMinutes(),
        timeZone: today.getTimezoneOffset().toString(),
      };
      let res = JSON.parse(response);
      let documentData = {
        'parentRNCPTitle': this.student.rncpTitle,
        'name': this.selectedRncpTitle.shortName + ' - '+ this.testDetails.subjectId.subjectName +
                ' - ' + this.testDetails.name + ' - ' + this.student.firstName + ' - ' + this.student.lastName + ' - ' + this.document.documentName,
        'type': item.file.type,
        'filePath': res.data.filepath,
        'documentType': 'documentExpected',
        'fileName': item.file.name,
        'publicationDate': {
          'type': 'fixed',
          'publicationDate': publicationDateObj
        },
        'testCorrection': this.student.correctedTests[0].correction._id,
        'storedInS3': true,
        'S3FileName': res.data.s3FileName
      };

      if (res.status === 'OK') {
        this.acadService.addStudentDocument(documentData).subscribe(d => {
          if (d) {
             this.document.isUploaded = true;
             this.document.document = d._id;

             this.updateTestCorrection(this.student.correctedTests[0].correction);
             swal({
              title: this.translate.instant('STUDENT.expectedDocUploadSuccess.Title'),
              html: this.translate.instant('STUDENT.expectedDocUploadSuccess.Text',{TestDocName:this.document.documentName,StudentCivility:this.utilityService.computeCivility(this.student.civility,this.translate.currentLang),StudentFirstName:this.student.firstName,StudentLastName:this.student.lastName}),
              allowEscapeKey:true,
              type:'success'
             });
          }else{
            swal({
              title: 'Attention',
              html: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
              allowEscapeKey:true,
              type: 'warning'
            });
          }
        });

      } else {
        swal({
          title: 'Attention',
          html: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
          allowEscapeKey:true,
          type: 'warning'
        });
      }
    };
  }

  checkIfTestId(selectedTestId) {
    if(!this.isCrossCorrector) {
      if (!selectedTestId) {
        this.routes.navigate(['rncp-titles']);
      } else if (typeof selectedTestId === 'function') {
        this.routes.navigate(['rncp-titles']);
      } else {
        this.testCorrectionService.getTest(this.selectedTestId).subscribe((value) => {
          this.testDetails = value;
          this.renderData();


          if(this.testDetails['type'] == "mentor-evaluation"){
            this.isTestMentorEvaluation = true;
          }

          if(this.testDetails.groupTest){
            this.getGroups();
          }else{
            let rncpTitle;
            this.rncpTitle = this.selectedRncpTitle.longName;
            rncpTitle = this.selectedRncpTitle.longName;
            log.info('Call 1');
            this.loadStudentBasedOnUser();

        }
        });
      }
    }
  }

  loadStudentBasedOnUser() {
    log.info('loadStudentBasedOnUser invoked!. isCrossCorrector:',this.isCrossCorrector);
    if (this.testDetails && this.testDetails.class !== undefined && this.testDetails.class != null) {

        if (this.currentLoginUser !== undefined && this.currentLoginUser) {

            // Cross Corrector students
            if (this.isCrossCorrector) {
              this.crossCorrectionService.getStudentsForCorrection(this.taskId).subscribe((data) => {
                if (data) {
                  this.students = _.orderBy(data, ['lastName'], ['asc']);
                  this.searchedStudents = _.orderBy(data, ['lastName'], ['asc']);

                  this.filteredStudents = Observable.create(observer => {
                    observer.next(this.students.filter(std => {
                      return std.correctedTests ? false : true;
                    }));
                  });

                  /*Goto Uncorrected student */
                  let isUncorrected = null;
                  for (var index = 0; index < this.students.length; index++) {
                    var element = this.students[index];
                    if (element.correctedTests == null) {
                      isUncorrected = element;
                      break;
                    }
                  }

                  if(isUncorrected){
                    this.studentSelectDetails = isUncorrected;
                    this.selectedStudent = isUncorrected._id;
                    this.selectedStudentArray = [isUncorrected];
                    this.ChangeStudent({ value: this.selectedStudent });
                  }else {
                    this.studentSelectDetails = this.students[0];
                    this.selectedStudent = this.students[0]._id;
                    this.selectedStudentArray = [this.students[0]];
                    this.ChangeStudent({ value: this.selectedStudent });
                  }



                }
              });

            } else if (this.task && this.task.type === 'finalRetakeMarksEntry') {
              // console.log('Aya Aya');
              const taskAssignedTo = this.task.userSelection.userId._id;
              const filteredCorrector = _.filter(this.testDetails.correctorAssignedForFinalRetake, {'correctorId': taskAssignedTo, 'schoolId': (<any>this.task).school._id});
              const studentWithAll = filteredCorrector[0].students.map(
                (student) => {
                  const filterTests = _.filter(student.correctedTests, (corTest) => {
                    return this.testDetails._id === corTest.test;
                  });
                  student.correctedTests = [...filterTests];
                  return student;
              });
              this.students = [...studentWithAll];
              this.searchedStudents = [...studentWithAll];
              // this.selectedStudent = this.searchedStudents[0];

              let isUncorrected = null;
              for (var index = 0; index < this.students.length; index++) {
                var element = this.students[index];
                if (element.correctedTests == null) {
                  isUncorrected = element;
                  break;
                }
              }

              if(isUncorrected) {
                this.studentSelectDetails = isUncorrected;
                this.selectedStudent = isUncorrected._id;
                this.selectedStudentArray = [isUncorrected];
                this.ChangeStudent({ value: this.selectedStudent });
              }else {
                this.studentSelectDetails = this.students[0];
                this.selectedStudent = this.students[0]._id;
                this.selectedStudentArray = [this.students[0]];
                this.ChangeStudent({ value: this.selectedStudent });
              }

            } else if (this.task && this.task.type === 'validateTestCorrectionForFinalRetake') {

              this.testCorrectionService.getStudentsForFinalRetake(this.task._id).subscribe( res => {
                console.log(res);
                this.students = res;
                this.searchedStudents = res;
                console.log("searched student", this.searchedStudents);
                this.selectedStudent = this.students[0]._id;
                this.selectedStudentDetails = this.students[0];
                this.ChangeStudent({ value: this.selectedStudent });
              });

            } else if (this.ifEntryForQc && (this.utilityService.checkUserIsAdminOfCertifier() ||
              this.utilityService.checkUserIsDirectorSalesAdmin() ||
              this.utilityService.checkUserIsAdminOfCertifier() || this.utilityService.checkUserIsQualityControlCorrector())) {
              const taskAssignedTo = this.task.userSelection.userId._id;
              const filteredCorrector = _.find(this.testDetails.correctorAssignedForQualityControl,
                { 'correctorId': taskAssignedTo});
              const studentWithAll = filteredCorrector.students.map(
                (student) => {
                  let filterTests = _.find(student.correctedTestsForQualityControl, (corTest) => {
                    return this.testDetails._id === corTest.test &&
                    corTest.correction && corTest.correction.qualityControl === true;
                  });
                  student.correctedTests = [filterTests];
                  if (typeof(filterTests) === 'object') {
                    student.correctedTestsForQualityControl = [filterTests];
                  }
                  filterTests = null;
                  return student;
                });
              this.students = [..._.orderBy(studentWithAll, ['aliasName'], ['asc'])];
              this.searchedStudents = [..._.orderBy(this.studentForQualityControl, ['aliasName'], ['asc'])];
              Object.assign(this.selectedStudent = this.students[0]._id);
              Object.assign(this.selectedStudentDetails = this.students[0]);
              this.ChangeStudent({ value: this.selectedStudent });
            } else if (
              (this.utilityService.checkUserIsCorrector() || this.utilityService.checkUserIsAcademicDirector() ||
              this.utilityService.checkUserIsDirectorSalesAdmin()
              || this.utilityService.checkUserIsCertifierCorrector() || this.utilityService.checkUserIsAdminOfCertifier()) &&
              this.testDetails.type !== 'free-continuous-control' && !this.appService.getFromAcadKit() && this.task &&
              this.task.description.toLowerCase() !== 'validate the test correction' &&
              this.task.description.toLowerCase() !== 'submit students for re-take test' &&
              !this.isRedoMarksEntry)  {
              // Student List For User Type COrrector
              const isCorrectionTypeCertifier = this.testDetails && this.testDetails.correctionType === 'cp';
              // this.isUserCorrector = true;
              if(this.testDetails && this.testDetails.correctorAssigned.length) {
                let NewStudent = [];
                for (var index = 0; index < this.testDetails.correctorAssigned.length; index++) {
                  var element = this.testDetails.correctorAssigned[index];
                  // if(this.currentLoginUser._id === element.correctorId){

                    if (this.task && this.task.userSelection && this.task.userSelection.userId._id === element.correctorId
                        && (!isCorrectionTypeCertifier || element.schoolId === this.schoolID )) {
                    for (var i = 0; i < element.students.length; i++) {
                      var student = element.students[i];
                      let mathchedarray = [];
                      if (student.correctedTests === undefined) {
                        student.correctedTests = [];
                      } else {
                        for (var j = 0; j < student.correctedTests.length; j++) {
                          var correctedTests = student.correctedTests[j];
                          if(correctedTests.test === this.testDetails._id) {
                            mathchedarray.push(correctedTests);
                            student.correctedTests = [];
                            break;
                          }
                        }
                      }
                      student.correctedTests = mathchedarray;
                      NewStudent.push(student);
                    }
                  }
                }

                 // FOR redoMarksEntry student filter
                 if(this.isRedoMarksEntry) {
                  let allData = NewStudent;
                  NewStudent = allData.filter(std => {
                    return std.correctedTests && std.correctedTests[0] && std.correctedTests[0].correction && std.correctedTests[0].correction.shouldRetakeTest ? true : false;
                  });
                }

                this.students = _.orderBy(NewStudent, ['lastName'], ['asc']);
                this.searchedStudents = _.orderBy(NewStudent, ['lastName'], ['asc']);

                if(this.students.length) {
                  this.filteredStudents = Observable.create(observer => {
                    observer.next(this.students.filter(std => {
                      return std.correctedTests ? false : true;
                    }));
                  });
                  /*Goto Uncorrected student */
                  let isUncorrected = null;
                  for (var index = 0; index < this.students.length; index++) {
                    var element = this.students[index];
                    if (element.correctedTests == null) {
                      isUncorrected = element;
                      break;
                    }
                  }
                  if(isUncorrected){
                    this.studentSelectDetails = isUncorrected;
                    this.selectedStudent = isUncorrected._id;
                    this.selectedStudentArray = [isUncorrected];
                    this.ChangeStudent({ value: this.selectedStudent });
                  }else{
                    this.studentSelectDetails =  this.students[0];
                    this.selectedStudent = this.students[0]._id;
                    this.selectedStudentArray = [this.students[0]];
                    this.ChangeStudent({ value: this.selectedStudent });
                  }

                }
              }

            }
             else {
              /// Comment all test related student fill the coorection.

              this.testCorrectionService.getStudentForTestCorrection(this.selectedTestId, this.schoolID).subscribe((data) => {
                  if (data) {

                    //FOR redoMarksEntry student filter
                    if(this.isRedoMarksEntry){
                      let allData = data;
                      data = allData.filter(std => {
                        return std.correctedTests && std.correctedTests && std.correctedTests[0] && std.correctedTests[0].correction && std.correctedTests[0].correction.shouldRetakeTest ? true : false;
                      });
                    }
                    this.students = _.orderBy(data, ['lastName'], ['asc']);
                    this.searchedStudents = _.orderBy(data, ['lastName'], ['asc']);

                    this.filteredStudents = Observable.create(observer => {
                      observer.next(this.students.filter(std => {
                        return std.correctedTests ? false : true;
                      }));
                    });
                    /*Goto Uncorrected student */
                    let isUncorrected = null;
                    for (var index = 0; index < this.students.length; index++) {
                      var element = this.students[index];
                      if (!element.correctedTests || !element.correctedTests || !element.correctedTests[0] || !element.correctedTests[0].correction || !element.correctedTests[0].correction.correctionGrid.correction.total) {
                        isUncorrected = element;
                        break;
                      }
                    }

                    if(isUncorrected){
                      this.studentSelectDetails = isUncorrected;
                      this.selectedStudent = isUncorrected._id;
                      this.selectedStudentArray = [isUncorrected];
                      this.ChangeStudent({ value: this.selectedStudent });
                    }else {
                      this.studentSelectDetails = this.students[0];
                      this.selectedStudent = this.students[0]._id;
                      this.selectedStudentArray = [this.students[0]];
                      this.ChangeStudent({ value: this.selectedStudent });
                    }

                  }
              });
            }
        }
    }
  }

  downloadPDFDetails() {
    const ele = document.getElementById('pdfdocFORDetails');
    let html = PRINTSTYLES + '<div >';
    html = html + ele.innerHTML;
    // ele.style.visibility = 'hidden';
    // ele.innerHTML = html;
    // ele.className = 'apple';
    const filename = 'Details-'+ this.selectedRncpTitle.shortName + ' - ' + this.testDetails.name;
    const landscape = false;

    const target = this.documentPagesRef.nativeElement.children;
    const outer = document.createElement('div');
    outer.innerHTML = '';
    let studentsHtml = '';
    for (const element of target) {
      const wrap = document.createElement('div');
      const el = element.cloneNode(true);
      el.style.display = 'block';
      wrap.appendChild(el);
      studentsHtml += wrap.innerHTML;
    }
    studentsHtml = studentsHtml.replace(/\$/g, ' ');
    html +=  ` <div style="page-break-before: always; position: relative;"></div><div class="ql-editor document-parent">` + studentsHtml + `</div></div>`;;
    this.pdfService.getPDF(html, filename, landscape, true).subscribe(res => {
      if (res.status === 'OK') {
        var link = document.createElement('a');
        link.setAttribute("type", "hidden"); // make it hidden if needed
        link.download = res.filename;
        link.target = '_blank';
        link.href = Print.url + res.filePath;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  }
  downloadPDFSummary() {
    const ele = document.getElementById('pdfdoc');
    let html = PRINTSTYLES;
    html = html + ele.innerHTML;
    ele.style.visibility = 'hidden';
    ele.innerHTML = html;
    ele.className = 'apple';
    const filename = 'Summary-'+ this.selectedRncpTitle.shortName + ' - ' + this.testDetails.name;
    const landscape = false;
    this.pdfService.getPDF(html, filename, landscape, true).subscribe(res => {
      if (res.status === 'OK') {
        var link = document.createElement('a');
        link.setAttribute("type", "hidden"); // make it hidden if needed
        link.download = res.filename;
        link.target = '_blank';
        link.href = Print.url + res.filePath;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  }

  getTotalPageCount() {
    const totalPage = this.testDetails.groupTest ?
      this.searchedGroup.length * this.pageSectionsArray.length + 1 :
      this.searchedStudents.length * this.pageSectionsArray.length + 1;
    return totalPage;
  }



  loadStudentCorrections(correction: any, studentId) {
    let self = this;
    self.listJury = [];
    const studentObject = _.find(this.searchedStudents, {'_id': studentId});
    log.data('loadStudentCorrections studentObject', studentObject);
    const pIState = studentObject && studentObject.parallelIntake ? true : false;

    if(['pending','corrected'].indexOf(self.getCorrectionStatus()) == -1){
      self.readOnly = true;
    }

    if(self.isTestMentorEvaluation && !this.utilityService.checkUserIsDirectorSalesAdmin()) {
      self.readOnly = true;
    } else {
      self.readOnly = false;
    }

    if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL' ) && self.testDetails.juryMax){
      for (var index = 0; index < self.testDetails.juryMax; index++) {
        self.listJury.push([]);
      }
      if ( !this.testCorrect.correctionGrid.correction.totalJuryAvgRating ) {
        this.testCorrect.correctionGrid.correction.totalJuryAvgRating = '';
      }
    }
    // if(self.testDetails.type == 'free-continuous-control'){
    //  this.testCorrect.correctionGrid.correction.total = '';
    // }


    if (correction != null) {
      this.updatingCorrection = true;

      this.today = new Date();
      const nextYear = Number(new Date().getFullYear()) + 1;
      this.currentSchoolYear = new Date().getFullYear() + '-' + nextYear;
      const test: any = {};
      const header = [];
      const footer = [];
      const sections = [];
      const testCorrect = correction;
      let rncpTitle;
      rncpTitle = this.rncpTitle;
      const hasCorrectionGrid =
        correction.correctionGrid.correction.sections &&
        correction.correctionGrid.correction.sections.length;

      if(correction.correctionGrid.header.fields.length){
        _.forEach(correction.correctionGrid.header.fields, function (val, key) {
          test['header' + key] = [val && val.value ? val.value : ''];
        });
      }else{
        const headerInfo = this.testCorrectionService.getHeader();
        _.forEach(this.testDetails.correctionGrid.header.fields, function (val, key) {
          const obj = {
            'type': val.type,
            'label': val.value,
            'value': headerInfo ? headerInfo.header.fields[key].value : null,
            'dataType': val.dataType,
            'align': val.align
          };
          switch (val.type) {
            case 'dateRange':
              obj.value = new Date();
              testCorrect.correctionGrid.header.fields.push(obj);
              break;
            case 'dateFixed':
              obj.value = new Date();
              testCorrect.correctionGrid.header.fields.push(obj);
              break;
            case 'currentSchoolYear':
              obj.value = new Date().getFullYear() + '-' + nextYear;
              testCorrect.correctionGrid.header.fields.push(obj);
              break;
            case 'titleName':
              obj.value = rncpTitle;
              testCorrect.correctionGrid.header.fields.push({
                'type': val.type,
                'label': val.value,
                'value': rncpTitle,
                'dataType': val.dataType,
                'align': val.align
              });
              break;
            case 'status':
              testCorrect.correctionGrid.header.fields.push(obj);
              break;
            default:
              testCorrect.correctionGrid.header.fields.push(obj);
          }
          test['header' + key] = [headerInfo ? headerInfo.header.fields[key].value : null];

        });
      }

      // footer
      if(correction.correctionGrid.footer.fields.length){
        _.forEach(correction.correctionGrid.footer.fields, function (val, key) {
          // test['footer' + key] = [val.value, Validators.required];
          test['footer' + key] = [val && val.value ? val.value : ''];
        });
      }else{
        const footerInfo = this.testCorrectionService.getFooter();
        _.forEach(this.testDetails.correctionGrid.footer.fields, function (val, key) {
          test['footer' + key] = [footerInfo && footerInfo.footer.fields[key] ? footerInfo.footer.fields[key].value : null, pIState ? [] : [Validators.required]];
          testCorrect.correctionGrid.footer.fields.push({
            'type': val.type,
            'label': val.value,
            'value': footerInfo && footerInfo.footer.fields[key] ? footerInfo.footer.fields[key].value : null,
            'dataType': val.dataType,
            'align': val.align
          });
        });
      }

      // total
      if(hasCorrectionGrid) {
        _.forEach(correction.correctionGrid.correction.sections, (val, key) => {
          test['total' + key] = [val && val.rating ? val.rating : 0, pIState ? [] : [Validators.required]];
          test['comment' + key] = [val && val.comments ? val.comments: ''];
          _.forEach(val.subSections, (v, k) => {
            test['subSection-' + key + '-' + k] = [v && v.rating ? v.rating: 0, pIState ? [] : [Validators.required]];
            this.listServiceFeature[key + '_' + k] = v.rating;
          });
        });
      } else {
        _.forEach(this.testDetails.correctionGrid.correction.sections, function (val, key) {
          test['total' + key] = [0, pIState ? [] : [Validators.required]];
          test['comment' + key] = [null];
          testCorrect.correctionGrid.correction.sections.push({
            title: val.title,
            rating: 0,
            comments: '',
            subSections: []
          });
          _.forEach(val.subSections, function (v, k) {
            test['subSection-' + key + '-' + k] = [null,pIState ? [] : [Validators.required]];
          });

        });
      }

      if(hasCorrectionGrid) {
      // Comment, directions, marksnumber, marksletters
        _.forEach(correction.correctionGrid.correction.sections, function (val, key) {
          _.forEach(val.subSections, function (v, k) {
            test['comment-' + key + '-' + k] = [v && v.comments ? v.comments: '' ];
            test['directions-' + key + '-' + k] = [v && v.directions ? v.directions: ''];
            test['marksnumber-' + key + '-' + k] = [v && v.marksnumber ? v.marksnumber: '' ];
            test['marksletters-' + key + '-' + k] = [v && v.marksletters ? v.marksletters: ''];

            if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
              if( v && v.jury.length ){
                for (var index = 0; index < v.jury.length; index++) {
                  test['jury-' + key + '-'+k+'-' +index+'-name'] = [v.jury ? v.jury[index].name : null];
                  test['jury-' + key + '-'+k+'-' +index+'-marks'] = [v.jury ? Number(v.jury[index].marks) : null];
                  self.listJury[index].push({name:v.jury ? v.jury[index].name : null,marks:v.jury ? Number(v.jury[index].marks) : null})
                }
              }else{
                for (var index = 0; index < self.testDetails.juryMax; index++) {
                  test['jury-' + key + '-'+k+'-' +index+'-name'] = [null];
                  test['jury-' + key + '-' + k +'-' +index+'-marks'] = [null];
                  self.listJury[index].push({name:'',marks:''})
                }
              }
            }
          });
        });
      } else {
        _.forEach(this.testDetails.correctionGrid.correction.sections, function (val, key) {
          _.forEach(val.subSections, function (v, k) {
            test['comment-' + key + '-' + k] = [null];
            test['directions-' + key + '-' + k] = [null];
            test['marksnumber-' + key + '-' + k] = [null];
            test['marksletters-' + key + '-' + k] = [null];


            let juryObject = [];
            if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
              for (var index = 0; index < self.testDetails.juryMax; index++) {
                test['jury-' + key + '-'+k+'-' +index+'-name'] = ['Jury - '+(index + 1)];
                test['jury-' + key + '-'+k+'-' +index+'-marks'] = [null];
                self.listJury[index].push({name:'Jury - '+(index + 1),marks:''})
                juryObject.push({name:'Jury - '+(index + 1),marks:''});
              }
            }

            testCorrect.correctionGrid.correction.sections[key].subSections.push({
              title: v.title,
              rating: '',
              comments: '',
              directions: '',
              marksnumber: '',
              marksletters: '',
              jury:juryObject
            });
          });
        });
      }



       // penalties
       if(hasCorrectionGrid) {
        _.forEach(correction.correctionGrid.correction.penalty, function (val, key) {
          test['penalties-' + key] = [val && val.hasOwnProperty('rating') ? val.rating : 0,pIState ? [] : [Validators.required]];
         });
       } else {
        _.forEach(this.testDetails.correctionGrid.correction.penalties, function (val, key) {
          test['penalties-' + key] = [val && val.hasOwnProperty('rating') ? val.rating: 0,pIState ? [] : [Validators.required]];
      });
       }

       // bonuses
       if(hasCorrectionGrid) {
        _.forEach(correction.correctionGrid.correction.bonus, function (val, key) {
          test['bonuses-' + key] = [val && val.hasOwnProperty('rating') ? val.rating: 0,pIState ? [] : [Validators.required] ];
        });
       } else {
        _.forEach(this.testDetails.correctionGrid.correction.bonuses, function (val, key) {
          test['bonuses-' + key] = [val && val.hasOwnProperty('rating') ? val.rating: 0,pIState ? [] : [Validators.required]];
        });
       }


      if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
        test['ttlJuryAvgRating'] = [testCorrect && testCorrect.correctionGrid.correction.totalJuryAvgRating ? +(testCorrect.correctionGrid.correction.totalJuryAvgRating) : 0];
        if ( test['ttlJuryAvgRating'][0] == 0 || test['ttlJuryAvgRating.0'] == '' ) {
          if (self.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal) {
            test['ttlJuryAvgRating'] = [testCorrect && testCorrect.correctionGrid.correction.additionalTotal ? +(testCorrect.correctionGrid.correction.additionalTotal) : 0];
          } else {
            test['ttlJuryAvgRating'] = [testCorrect && testCorrect.correctionGrid.correction.total ? +(testCorrect.correctionGrid.correction.total) : 0];
          }
        }
      }
      if(self.testDetails.type == 'free-continuous-control'){
        test['finalTtl'] = [testCorrect && testCorrect.correctionGrid.correction.hasOwnProperty('total') ?
                            testCorrect.correctionGrid.correction.total : '',pIState ? [] : [Validators.required]];
      }
      if(this.testDetails.correctionGrid.correction.showEliminations){
        test['elimination'] = [false];
        test['eliminationReason'] = [ ''];
      }

       // showFinalComments
       if(this.testDetails.correctionGrid.correction.showFinalComments) {
        test['finalComments'] = [testCorrect && testCorrect.correctionGrid.correction.finalComments ? testCorrect.correctionGrid.correction.finalComments : ''];
       }

      this.testCorrect = testCorrect;
      this.form = this.fb.group(test);
      this.subscribeFormChanges();

      if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
        //For Jury Toggle Enabling
        this.setJuryToggle();
      }
    } else {
      this.updatingCorrection = false;
      this.today = new Date();
      const nextYear = Number(new Date().getFullYear()) + 1;
      this.currentSchoolYear = new Date().getFullYear() + '-' + nextYear;
      let rncpTitle;
      this.rncpTitle = this.selectedRncpTitle ? this.selectedRncpTitle.longName : '' ;
      rncpTitle = this.selectedRncpTitle ? this.selectedRncpTitle.longName : '';
      const test = {};
      const header = [];
      const footer = [];
      const sections = [];
      this.testCorrect = new TestCorrection();
      this.testCorrect.test = this.testDetails._id;
      this.testCorrect.corrector = this.service.getCurrentUserInfo()._id;
      this.testCorrect.student = studentId;
      const testCorrect = this.testCorrect;
      rncpTitle = this.rncpTitle;
      const headerInfo = this.testCorrectionService.getHeader();

      _.forEach(this.testDetails.correctionGrid.header.fields, function (val, key) {

        const obj = {
          'type': val.type,
          'label': val.value,
          'value': headerInfo && headerInfo.header && headerInfo.header.fields[key]? headerInfo.header.fields[key].value : null,
          'dataType': val.dataType,
          'align': val.align
        };
        switch (val.type) {
          case 'dateRange':
            obj.value = new Date();
            testCorrect.correctionGrid.header.fields.push(obj);
            break;
          case 'dateFixed':
            obj.value = new Date();
            testCorrect.correctionGrid.header.fields.push(obj);
            break;
          case 'currentSchoolYear':
            obj.value = new Date().getFullYear() + '-' + nextYear;
            testCorrect.correctionGrid.header.fields.push(obj);
            break;
          case 'titleName':
            obj.value = rncpTitle;
            testCorrect.correctionGrid.header.fields.push({
              'type': val.type,
              'label': val.value,
              'value': rncpTitle,
              'dataType': val.dataType,
              'align': val.align
            });
            break;
          case 'status':
            testCorrect.correctionGrid.header.fields.push(obj);
            break;
          default:
            testCorrect.correctionGrid.header.fields.push(obj);
        }
        test['header' + key] = [headerInfo && headerInfo.header && headerInfo.header.fields[key] ? headerInfo.header.fields[key].value : null];

      });

      const footerInfo = this.testCorrectionService.getFooter();
      _.forEach(this.testDetails.correctionGrid.footer.fields, function (val, key) {
        test['footer' + key] = [footerInfo && footerInfo.footer.fields[key] ? footerInfo.footer.fields[key].value : null, pIState ? [] : [Validators.required]];
        testCorrect.correctionGrid.footer.fields.push({
          'type': val.type,
          'label': val.value,
          'value': footerInfo && footerInfo.footer.fields[key] ? footerInfo.footer.fields[key].value : null,
          'dataType': val.dataType,
          'align': val.align
        });
      });

      _.forEach(this.testDetails.correctionGrid.correction.sections, function (val, key) {
        test['total' + key] = [0, pIState ? [] : [Validators.required]];
        test['comment' + key] = [null];
        testCorrect.correctionGrid.correction.sections.push({
          title: val.title,
          rating: 0,
          comments: '',
          subSections: []
        });
        _.forEach(val.subSections, function (v, k) {
          test['subSection-' + key + '-' + k] = [null,pIState ? [] : [Validators.required]];
        });

      });
        this.listServiceFeature = [];

      _.forEach(this.testDetails.correctionGrid.correction.sections, function (val, key) {
        _.forEach(val.subSections, function (v, k) {
          test['comment-' + key + '-' + k] = [null];
          test['directions-' + key + '-' + k] = [null];
          test['marksnumber-' + key + '-' + k] = [null];
          test['marksletters-' + key + '-' + k] = [null];


          let juryObject = [];
          if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
            for (var index = 0; index < self.testDetails.juryMax; index++) {
              test['jury-' + key + '-'+k+'-' +index+'-name'] = ['Jury - '+(index + 1)];
              test['jury-' + key + '-'+k+'-' +index+'-marks'] = [null];
              self.listJury[index].push({name:'Jury - '+(index + 1),marks:''})
              juryObject.push({name:'Jury - '+(index + 1),marks:''});
            }
          }

          testCorrect.correctionGrid.correction.sections[key].subSections.push({
            title: v.title,
            rating: '',
            comments: '',
            directions: '',
            marksnumber: '',
            marksletters: '',
            jury:juryObject
          });
        });
      });

      // penalties
      _.forEach(this.testDetails.correctionGrid.correction.penalties, function (val, key) {
          test['penalties-' + key] = [val && val.hasOwnProperty('rating') ? val.rating: 0,pIState ? [] : [Validators.required]];
      });
      // bonuses
      _.forEach(this.testDetails.correctionGrid.correction.bonuses, function (val, key) {
        test['bonuses-' + key] = [val && val.hasOwnProperty('rating') ? val.rating: 0,pIState ? [] : [Validators.required]];
      });

      if(this.testDetails.correctionGrid.correction.showEliminations){
        test['elimination'] = [false];
        test['eliminationReason'] = [''];
      }

       // showFinalComments
       if(this.testDetails.correctionGrid.correction.showFinalComments) {
        test['finalComments'] = [this.testDetails && this.testDetails.correctionGrid.correction.finalComments ? this.testDetails.correctionGrid.correction.finalComments : ''];
       }

      if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
        test['ttlJuryAvgRating'] = [''];
      }
      if(self.testDetails.type == 'free-continuous-control'){
        test['finalTtl'] = ['',pIState ? [] : [Validators.required]];
      }
      this.form = this.fb.group(test);
      if(self.readOnly) {
        this.form.disable();
      }

      if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
        //For Jury Toggle Enabling
        this.setJuryToggle();
      }
      this.subscribeFormChanges();
    }
  }

  subscribeFormChanges() {
    this.form.valueChanges.subscribe((data) => {
      this.testCorrectionService.addHeader(this.testCorrect.correctionGrid);
      this.testCorrectionService.addFooter(this.testCorrect.correctionGrid);
    });
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
  }

  blurEventPenalties(event, value, i, formValue, rowIndex) {
    const re = /^[0-9]+$/;
    this.testCorrect.correctionGrid.correction.total = 0;
    if (event.target.value > value) {event.target.value = 0;}
    this.total(event, value, re, i, formValue, 0, rowIndex);
  }
  blurEventBonuses(event, value, i, formValue, rowIndex) {
    const re = /^[0-9]+$/;
    this.testCorrect.correctionGrid.correction.total = 0;
    if (!re.test(event.target.value)) {event.target.value = 0;}
    if (event.target.value > value) {event.target.value = 0;}
    this.total(event, value, re, i, formValue, 0, rowIndex);

  }

  blurEventJury(event, value, i, rowIndex, doNotPopZero?: boolean) {
    const formValue = this.form.value;
    const re = /^\d+\.\d\d$/;
    let total = 0;
    this.testCorrect.correctionGrid.correction.total = 0;
    this.testCorrect.correctionGrid.correction.totalJuryAvgRating = 0;
    this.testCorrect.correctionGrid.correction.additionalTotal = 0;
    let totalMarks = 0;
    if((this.testDetails.type == 'Jury' || this.testDetails.type == 'Memoire-ORAL')  && this.testDetails.juryMax){
      for (let index = 0; index < this.testDetails.juryMax; index++) {
        if(!formValue['jury-'+i+'-'+rowIndex+'-'+index+'-marks'] || formValue['jury-'+i+'-'+rowIndex+'-'+index+'-marks'] > value) {
          if ( this.juryEnabledList[index] && this.juryEnabledList[index].state && !doNotPopZero ) {
            this.form.controls['jury-'+i+'-'+rowIndex+'-'+index+'-marks'].setValue(0);
            formValue['jury-'+i+'-'+rowIndex+'-'+index+'-marks'] = 0;
          } else if ( typeof formValue['jury-'+i+'-'+rowIndex+'-'+index+'-marks'] !== 'number' ) {
            this.form.controls['jury-'+i+'-'+rowIndex+'-'+index+'-marks'].setValue(null);
            formValue['jury-'+i+'-'+rowIndex+'-'+index+'-marks'] = null;
          }
        }
        if ( this.juryEnabledList[index].state ) {
          totalMarks = totalMarks + formValue['jury-'+i+'-'+rowIndex+'-'+index+'-marks'];
        }
      }
      let avg = Number( totalMarks / (this.testDetails.juryMax - this.juryDisabled) ).toFixed(2);
      if (avg > value) {
        event.target.value = 0;
        this.listServiceFeature[i + '_' + rowIndex] = 0;
      } else {
        this.listServiceFeature[i + '_' + rowIndex] = Number(avg);
      }
      this.testCorrect.correctionGrid.correction.sections[i].subSections[rowIndex].rating = Number(avg);
      this.total(event, value, re, i, formValue, total, rowIndex);
    }
  }

  toggleJuryState(slideEvent, selectedJuryIndex, doNotLoadMarks?: boolean) {
    log.data('toggleJuryState juryEnabledList', this.juryEnabledList);
    const sections =  this.testDetails.correctionGrid.correction.sections;
    const selectedIndex = this.findJuryTogleIndex(selectedJuryIndex);
    if (slideEvent.checked === true) {
      this.juryEnabledList[selectedIndex].state = true;
      if (this.juryDisabled > 0) {
        --this.juryDisabled;
      }
      for( let sectionIndex =0; sectionIndex< sections.length; sectionIndex++ ) {
        const subSections = sections[sectionIndex].subSections;
        for( let subSectionIndex =0; subSectionIndex< subSections.length; subSectionIndex++ ) {
          const controlname = 'jury-' + sectionIndex + '-' + subSectionIndex + '-' + selectedJuryIndex;
          this.form.get(controlname + '-marks').enable();
          this.form.get(controlname + '-marks').setValidators([Validators.required]);
          this.form.get(controlname + '-name').enable();
          this.form.get(controlname + '-name').setValue('Jury - ' + (selectedJuryIndex + 1));
          this.setAllTotalMarks(sectionIndex, subSectionIndex, doNotLoadMarks);
        }
      }
      this.computeTotalUsingBlurJury(doNotLoadMarks);
    } else if (slideEvent.checked === false) {
      this.juryEnabledList[selectedIndex].state = false;
      ++this.juryDisabled;
      for( let sectionIndex =0; sectionIndex< sections.length; sectionIndex++ ) {
        const subSections = sections[sectionIndex].subSections;
        for( let subSectionIndex =0; subSectionIndex< subSections.length; subSectionIndex++ ) {
          const controlname = 'jury-' + sectionIndex + '-' + subSectionIndex + '-' + selectedJuryIndex;
          this.form.get(controlname + '-marks').clearValidators();
          this.form.get(controlname + '-marks').setValue('');
          this.form.get(controlname + '-name').clearValidators();
          this.setAllTotalMarks(sectionIndex, subSectionIndex, doNotLoadMarks);
        }
      }
      this.computeTotalUsingBlurJury(doNotLoadMarks);
    }
  }

  setAllTotalMarks(sectionIndex, subSectionIndex, doNotLoadMarks?:boolean) {
    if (!doNotLoadMarks) {
      const formValue = this.form.value;
      let totalMarks = 0;
      for (let index = 0; index < this.testDetails.juryMax; index++) {
        if ( (this.juryEnabledList.length === 0 || this.juryEnabledList[index].state) &&
              (typeof formValue['jury-'+sectionIndex+'-'+subSectionIndex+'-'+index+'-marks'] === 'number' ) ) {
          totalMarks = totalMarks + formValue['jury-'+sectionIndex+'-'+subSectionIndex+'-'+index+'-marks'];
        }
      }

      if ( totalMarks ) {
        const avg = Number( totalMarks / (this.testDetails.juryMax - this.juryDisabled) ).toFixed(2);
        const maxScore = this.testDetails.correctionGrid.correction.sections[0].subSections[0].maximumRating;
        this.testCorrect.correctionGrid.correction.sections[sectionIndex].subSections[subSectionIndex].rating = avg;
        this.form.get('subSection-' + sectionIndex + '-' + subSectionIndex).setValue(avg);
        this.listServiceFeature[sectionIndex + '_' + subSectionIndex] = avg;
      }

    }
  }

  computeTotalUsingBlurJury(doNotLoadMarks) {
    if (!doNotLoadMarks) {
      const maxScore = this.testDetails.correctionGrid.correction.sections[0].subSections[0].maximumRating;
      const eventVal = { target: { value:
        this.testCorrect.correctionGrid.correction.sections[0].subSections[0].rating ?
        +this.testCorrect.correctionGrid.correction.sections[0].subSections[0].rating : ''}};
        this.blurEventJury(eventVal, maxScore, 0, 0, true);
    }
  }

  setJuryToggle() {
    if ( this.testCorrect.juryEnabledList && this.testCorrect.juryEnabledList.length ) {
      this.juryDisabled = 0;
      this.juryEnabledList = _.sortBy(this.testCorrect.juryEnabledList, ['position']);
      const juryDisabledArray = _.filter(this.juryEnabledList, (turnedOf) => { return !turnedOf.state});
      juryDisabledArray.forEach( element => {
        if ( element.state === false ) {
          this.toggleJuryState( { checked: element.state }, element.position, true);
        }
      });
      this.juryEnabledList = _.sortBy(this.juryEnabledList, ['position']);
      log.data('setJuryToggle juryEnabledList if', this.juryEnabledList);
    } else {
      this.juryDisabled = 0;
      for ( let index = 0; index < this.testDetails.juryMax; index++ ) {
        this.juryEnabledList[index] = {position: index, state: true};
      }
      this.juryEnabledList = [..._.sortBy(this.juryEnabledList, ['position'])];
      log.data('setJuryToggle juryEnabledList else', this.juryEnabledList);
    }
  }

  returnJuryStateForPosition(position: number) {
    const juryStateObj = this.juryEnabledList.find(
      (stateObj) => { return stateObj.position === position; }
    )

    return juryStateObj ? juryStateObj.state : true;
  }

  findJuryTogleIndex(stateIndex: number) {
    const toggleIndex = this.juryEnabledList.findIndex(
      (stateObj) => { return stateObj.position === stateIndex; }
    )

    return ( toggleIndex > -1 ) ? toggleIndex : stateIndex;
  }

  blurEvent(event, value, i, formValue, rowIndex) {
    const re = /^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/;
    let total = 0;
    this.testCorrect.correctionGrid.correction.total = 0;
    this.testCorrect.correctionGrid.correction.totalJuryAvgRating = 0;
    this.testCorrect.correctionGrid.correction.additionalTotal = 0;
    if (!re.test(event.target.value)) {
      event.target.value = 0;
      this.listServiceFeature[i + '_' + rowIndex] = 0;
    }
    if (event.target.value > value) {
      event.target.value = 0;
      this.listServiceFeature[i + '_' + rowIndex] = 0;
    }
    this.testCorrect.correctionGrid.correction.sections[i].subSections[rowIndex].rating = event.target.value;
    this.total(event, value, re, i, formValue, total, rowIndex);
  }

  blurEventFreeControl(event, value) {
    const re = /^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/;
    if (!re.test(event.target.value)) {
      event.target.value = 0;
      this.form.controls['finalTtl'].setValue(0);
    }
    if (event.target.value > 20) {
      event.target.value = 0;
      this.form.controls['finalTtl'].setValue(0);
    }
  }

  blurtotalJuryAvgRating(event, total) {
    log.data('blurtotalJuryAvgRating event', event);
    log.data('blurtotalJuryAvgRating total', total);
    if ( +event > total ) {
      this.testCorrect.correctionGrid.correction.totalJuryAvgRating = 0;
    } else if ( event.toString().split('.').length > 1 && event.toString().split('.')[1].length > 2 ) {
      this.testCorrect.correctionGrid.correction.totalJuryAvgRating = (+event).toFixed(2);
    }
  }

  searchStudentsTable(event) {
    if (this.ifEntryForQc) {
      const val = event.target.value;
      this.searchedStudents = val.length >= 2 ? this.students.filter(option =>
        (option.aliasName).toLocaleLowerCase().includes(val.trim().toLowerCase())) : this.students;
        this.searchedStudents = [..._.orderBy(this.studentForQualityControl, ['aliasName'], ['asc'])];
    } else {
      const val = event.target.value;
      this.searchedStudents = val.length >= 2 ? this.students.filter(option =>
        (option.lastName + ' ' + option.firstName).toLocaleLowerCase().includes(val.trim().toLowerCase())) : this.students;
      this.searchedStudents = _.orderBy(this.searchedStudents, ['lastName'], ['asc']);
    }
  }
  searchGroupTable(event) {
    const val = event.target.value;
    this.searchedGroup = val.length >= 2 ? this.groups.filter(option =>
      (option.name).toLocaleLowerCase().includes(val.trim().toLowerCase())) : this.groups;
  }

  openTestDetails() {
    // this.acadService.getTest(this.testDetails._id).subscribe(response => {
    //   const test = response;
    //   const stack = [...this.positionStack, 0];
    //   this.testDetailsDialog = this.dialog.open(
    //     TestDetailsDialogComponent,
    //     this.configDoc
    //   );
    //   this.testDetailsDialog.componentInstance.test = test;
    //   this.testDetailsDialog.componentInstance.positionStack = stack;
    //   this.testDetailsDialog.afterClosed().subscribe(
    //     function (status) {
    //       if (status) {
    //         if (status.type === "move") {
    //           status.stack.pop();
    //           this.positionStack = status.stack;
    //         } else if (status.type === "edit") {
    //           status.stack.pop();
    //           this.positionStack = status.stack;
    //           this.routes.navigateByUrl("/create-test");
    //         }
    //       }
    //     }.bind(this)
    //   );
    // });
    const stack = [...this.positionStack, 0];
    this.testDetailsDialog = this.dialog.open(TestDetailsDialogComponent, this.configDoc);
    this.testDetailsDialog.componentInstance.test = this.testDetails;
    this.testDetailsDialog.componentInstance.positionStack = stack;
    this.testDetailsDialog.afterClosed().subscribe(
      function (status) {
        if (status) {
          if (status.type === 'move') {
            status.stack.pop();
            this.positionStack = status.stack;
          } else if (status.type === 'edit') {
            status.stack.pop();
            this.positionStack = status.stack;
            this.routes.navigateByUrl('/create-test');
          }
        }
      }.bind(this)
    );
  }

  closeDialog(object?: any) {
    this.testDetailsDialog.close(object);
  }

  openFormConfirmationDialog(id) {
    this.formConfirmationComponent = this.dialog.open(FormConfirmationComponent, this.formConfigmDoc);
    this.formConfirmationComponent.afterClosed().subscribe((value) => {
      if (value !== '') {
        if (value === 'SubmitAndGo') {
          if (!this.form.valid) {
            swal({
              title: 'Attention',
              html: this.translate.instant('TESTCORRECTIONS.MESSAGE.REQUIREDFIELDMESSAGE'),
              allowEscapeKey:true,
              type:'warning'
            });
          } else {
            this.submit(null, id);
          }
        } else if (value === 'CancleAndGo') {
          this.ChangeStudent({ value: id });
        } else if (value === 'Cancel') {
          const student = this.students.find((std) => {
            return std._id === this.oldStudentValue;
          });
          this.selectedStudentArray = [student];
          this.selectedStudent = this.oldStudentValue;
        }
      }
    });
  }


  total(event, value, re, i, formValue, total, rowIndex) {
    total = Number(total);
    for (let key in this.listServiceFeature) {
      const res = key.split('_');
      if (Number(res[0]) === i) {
        if (this.listServiceFeature[key]) {
          total = Number(total) + Number(this.listServiceFeature[key]);
        }
      }
    }
    const obj = {};
    for (const key in formValue) {
      if (key === 'total' + i) {

        //Check if number has decimals.If yes show only two decimals
        if(Number(total) % 1 != 0){
            total = total.toFixed(2);}

        formValue[key] = total;
        obj[key] = total;


        this.testCorrect.correctionGrid.correction.sections[i].rating = total;
        this.form.patchValue(obj);
      }
      if (key.substring(0, 5) === 'total') {
        let totalValue = Number(this.testCorrect.correctionGrid.correction.total) + Number(formValue[key]);

        //Check if number has decimals.If yes show only two decimals
        if(totalValue % 1 != 0)
          totalValue = Number(totalValue.toFixed(2));

        this.testCorrect.correctionGrid.correction.total = totalValue;
      }
    }

     //Calculate penalties & bonuses
     let penalties = 0;
     let bonuses = 0;
     for (var index = 0; index < this.testDetails.correctionGrid.correction.penalties.length; index++) {
       if(!formValue['penalties-'+index]){
         formValue['penalties-'+index] = 0;
       }
       penalties = penalties + Number(formValue['penalties-'+index]);
     }
     for (var index = 0; index < this.testDetails.correctionGrid.correction.bonuses.length; index++) {
       if(!formValue['bonuses-'+index]){
         formValue['bonuses-'+index] = 0;
       }
       bonuses = bonuses + Number(formValue['bonuses-'+index]);
     }
     const totalWithbonusespenalties = (this.testCorrect.correctionGrid.correction.total + Number(bonuses)) - penalties;

     let bonusAndPenalties = Number(bonuses) - Number(penalties);

    if (bonusAndPenalties > this.getMaxCustomScore()) {
      bonusAndPenalties = this.getMaxCustomScore();
     }
    //  this.testCorrect.correctionGrid.correction.total = totalWithbonusespenalties.toFixed(2);
     if(this.testCorrect.correctionGrid.correction.total > this.getMaxScore()) {
      this.testCorrect.correctionGrid.correction.total = this.getMaxScore();
     }

     if(Math.sign(this.testCorrect.correctionGrid.correction.total) === -1) {
      this.testCorrect.correctionGrid.correction.total = 0;
     }


    this.testCorrect.correctionGrid.correction.additionalTotal =
    (this.testDetails.correctionGrid.correction.totalZone.additionalMaxScore * this.testCorrect.correctionGrid.correction.total) /
     this.getMaxScore();

     /* this code is to count total/additional total considering penalties/bonuses, if displayAdditionalTotal = false,
       consider penalties/bonuses for final total otherwise only for additional total */

      if (this.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal) {
        if (this.testCorrect.correctionGrid.correction.additionalTotal + bonusAndPenalties < 0) {
          this.testCorrect.correctionGrid.correction.additionalTotal = 0;
         } else if (this.testCorrect.correctionGrid.correction.additionalTotal + bonusAndPenalties > this.getMaxCustomScore()) {
          this.testCorrect.correctionGrid.correction.additionalTotal = this.getMaxCustomScore();
         } else {
          this.testCorrect.correctionGrid.correction.additionalTotal += bonusAndPenalties;
         }
      } else {
        if (this.testCorrect.correctionGrid.correction.total + bonusAndPenalties < 0) {
          this.testCorrect.correctionGrid.correction.total = 0;
         } else if (this.testCorrect.correctionGrid.correction.total + bonusAndPenalties > this.getMaxScore()) {
          this.testCorrect.correctionGrid.correction.total = this.getMaxScore();
         } else {
          this.testCorrect.correctionGrid.correction.total += bonusAndPenalties;
         }
      }

    // Check for decimal place
    if (this.testCorrect.correctionGrid.correction.additionalTotal === Math.floor(this.testCorrect.correctionGrid.correction.additionalTotal)) {
      this.testCorrect.correctionGrid.correction.additionalTotal = this.testCorrect.correctionGrid.correction.additionalTotal.toFixed(0);
    } else {
        this.testCorrect.correctionGrid.correction.additionalTotal = this.testCorrect.correctionGrid.correction.additionalTotal.toFixed(2);
    }


    if(this.testDetails.type === 'Jury' || this.testDetails.type === 'Memoire-ORAL' ) {
      if ( this.testDetails && this.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal ) {
        this.testCorrect.correctionGrid.correction.totalJuryAvgRating =  +this.testCorrect.correctionGrid.correction.additionalTotal;
      } else {
        this.testCorrect.correctionGrid.correction.totalJuryAvgRating =  +this.testCorrect.correctionGrid.correction.total;
      }
      this.testCorrect.correctionGrid.correction.total = Number(this.testCorrect.correctionGrid.correction.total.toFixed(2));
    }

    if(this.testCorrect.correctionGrid.correction.elimination) {
      this.testCorrect.correctionGrid.correction.total = 0;
    }
  }

  getTotalForJury() {
    let FinalTotlal = 0;
    for (const key in this.form.value) {
      if (key.substring(0, 5) === 'total') {
        FinalTotlal = Number(FinalTotlal) + Number(this.form.value[key]);
      }
    }
    if(Number(FinalTotlal) % 1 != 0)
      FinalTotlal = Number(FinalTotlal.toFixed(2));

    return FinalTotlal;
  }

  addJustificationForMissingCopy(row){
    let self = this;

    // if student
    if(
      row &&
      row.correctedTests &&
      row.correctedTests[0] &&
      row.correctedTests[0].correction &&
      row.correctedTests[0].correction.missingCopy &&
      ( this.getCorrectionStatus() === 'corrected' || this.getCorrectionStatus() === 'validatedByAcadDir') &&
      this.currentLoginUser.types[0].name.toUpperCase() !== 'CORRECTOR'
    ){
      swal({
        title: this.translate.instant('TESTCORRECTIONS.MESSAGE.MISSINGCOPY-VALIDATE-TITLE'),
        html: this.translate.instant('TESTCORRECTIONS.MESSAGE.MISSINGCOPY-VALIDATE-TEXT'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.MISSINGCOPY-VALIDATE-YES'),
        cancelButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.MISSINGCOPY-VALIDATE-NO')
      }).then(function(isConfirm) {
        if (isConfirm) {

          self.absenceJustifiedDialog = self.dialog.open(AbsenceJustifiedDialogComponent, self.configExpectedDoc);
          self.absenceJustifiedDialog.componentInstance.expectedDocuments = row.correctedTests[0].correction.expectedDocuments;
          self.absenceJustifiedDialog.componentInstance.selectedRncpTitle = self.selectedRncpTitle;
          self.absenceJustifiedDialog.componentInstance.testDetails =self.testDetails;
          self.absenceJustifiedDialog.componentInstance.student = row;
          self.absenceJustifiedDialog.afterClosed().subscribe((value) => {
            if (value.status) {
              self.testCorrect = value.testCorrect;
            }
          });

        }
      }, function(dismiss) {
        if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those

          row.correctedTests[0].correction.isJustified = 'no';
          row.correctedTests[0].correction.reasonForMissingCopy = '';
          if (self.testDetails && self.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal === true) {
            row.correctedTests[0].correction['correctionGrid']['correction']['additionalTotal'] = 0;
          }
          row.correctedTests[0].correction['correctionGrid']['correction']['total'] = 0;
          self.testCorrect = row.correctedTests[0].correction;
        } else {
          throw dismiss;
        }
      })
    }

    // if group
    else if (row.testCorrectionId.missingCopy && 
        (this.getCorrectionStatus() === 'corrected' || this.getCorrectionStatus() === 'validatedByAcadDir') &&
        this.currentLoginUser.types[0].name.toUpperCase() !== 'CORRECTOR'
    ){
      swal({
        title: this.translate.instant('TESTCORRECTIONS.MESSAGE.MISSINGCOPY-VALIDATE-TITLE'),
        html: this.translate.instant('TESTCORRECTIONS.MESSAGE.MISSINGCOPY-VALIDATE-TEXT'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.MISSINGCOPY-VALIDATE-YES'),
        cancelButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.MISSINGCOPY-VALIDATE-NO')
      }).then(function(isConfirm) {
        if (isConfirm) {

          self.absenceJustifiedDialog = self.dialog.open(AbsenceJustifiedDialogComponent, self.configExpectedDoc);
          self.absenceJustifiedDialog.componentInstance.expectedDocuments = row.testCorrectionId.expectedDocuments;
          self.absenceJustifiedDialog.componentInstance.selectedRncpTitle = self.selectedRncpTitle;
          self.absenceJustifiedDialog.componentInstance.testDetails = self.testDetails;
          self.absenceJustifiedDialog.componentInstance.student = row;
          self.absenceJustifiedDialog.afterClosed().subscribe((value) => {
            if (value.status) {
              self.testCorrect = value.testCorrect;
            }
          });
        }
      }, function(dismiss) {
        if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those
          row.testCorrectionId.isJustified = 'no';
          row.testCorrectionId.reasonForMissingCopy = '';
          console.log("self.testDetails",self.testDetails)
          if (self.testDetails && self.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal === true) {
            row.testCorrectionId['correctionGrid']['correction']['additionalTotal'] = 0;
          }
          row.testCorrectionId['correctionGrid']['correction']['total'] = 0;
          self.testCorrect = row.testCorrectionId;
          console.log("self.testDetails",self.testCorrect)
        } else {
          throw dismiss;
        }
      })
    }
  }

  studentSelected(row) {
    this.ChangeStudent({ value: row._id });
    this.studentSelectDetails = row;

  }

  changeMissingCopy(e) {
    let self = this;
    if (e.checked) {
      this.isMissingCopy = true;
    } else {
      this.isMissingCopy = false;
      if (this.testCorrect != null) {
        this.updatingCorrection = true;
        this.today = new Date();
        const nextYear = Number(new Date().getFullYear()) + 1;
        this.currentSchoolYear = new Date().getFullYear() + '-' + nextYear;
        const test = {};
        const header = [];
        const footer = [];
        const sections = [];

        let rncpTitle;
        rncpTitle = this.rncpTitle;

        _.forEach(this.testCorrect.correctionGrid.header.fields, function (val, key) {
          // test['header' + key] = [val.value, Validators.required];
          test['header' + key] = [val && val.value ? val.value : ''];
        });

        // footer
        _.forEach(this.testCorrect.correctionGrid.footer.fields, function (val, key) {
          // test['footer' + key] = [val.value, Validators.required];
          test['footer' + key] = [val && val.value ? val.value : ''];
        });

        // total
        _.forEach(this.testCorrect.correctionGrid.correction.sections, (val, key) => {
          test['total' + key] = ['', Validators.required];
          test['comment' + key] = [''];
          _.forEach(val.subSections, (v, k) => {
            test['subSection-' + key + '-' + k] = ['', Validators.required];
            this.listServiceFeature[key + '_' + k] = '';
          });
        });

        // Comment, directions, marksnumber, marksletters
        _.forEach(this.testCorrect.correctionGrid.correction.sections, function (val, key) {
          _.forEach(val.subSections, function (v, k) {
            test['comment-' + key + '-' + k] = [''];
            test['directions-' + key + '-' + k] = [ ''];
            test['marksnumber-' + key + '-' + k] = [ '' ];
            test['marksletters-' + key + '-' + k] = [ ''];

            if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
              for (var index = 0; index < self.testDetails.juryMax; index++) {
                test['jury-' + key + '-'+k+'-' +index+'-name'] = [null];
                test['jury-' + key + '-'+k+'-' +index+'-marks'] = [null];
                self.listJury[index].push({name:'',marks:''})
              }
            }
          });
        });
         // penalties
        _.forEach(this.testDetails.correctionGrid.correction.penalties, function (val, key) {
            test['penalties-' + key] = [val && val.hasOwnProperty('rating') ? val.rating: 0 ];
        });
        // bonuses
        _.forEach(this.testDetails.correctionGrid.correction.bonuses, function (val, key) {
            test['bonuses-' + key] = [val && val.hasOwnProperty('rating') ? val.rating: 0 ];
        });

        if(self.testDetails.type == 'free-continuous-control'){
          test['finalTtl'] = [ '',Validators.required];
        }

        this.form = this.fb.group(test);
        this.subscribeFormChanges();
      }
    }
  }

  getCorrectionStatus(){
    let currentStatus = 'pending';
    if(this.testDetails && this.testDetails.correctionStatusForSchools && this.testDetails.correctionStatusForSchools.length){
      for(let i=0;i<this.testDetails.correctionStatusForSchools.length;i++) {
        if(this.testDetails.correctionStatusForSchools[i].school === this.schoolID) {
          currentStatus = this.testDetails.correctionStatusForSchools[i].correctionStatus;
          break;
        }
      }
    }

    return currentStatus;
  }

  checkAllowToModifyCorrection(){
    let self = this;
    if(this.testDetails && this.testDetails.correctionStatusForSchools && this.testDetails.correctionStatusForSchools.length){
      this.testDetails.correctionStatusForSchools.forEach( c => {
        if (c.school === this.schoolID) {
          this.modificationPeriodDate = c.modificationPeriodDate;
        }
      });
      // for(let i=0;i<this.testDetails.correctionStatusForSchools.length;i++){
      //   if(this.testDetails.correctionStatusForSchools[i].school === this.schoolID) {
      //     this.modificationPeriodDate = this.testDetails.correctionStatusForSchools[i].modificationPeriodDate;
      //     break;
      //   }
      // }
    }
    const one_day=1000*60*60*24;
    //var date1_ms = new Date(this.modificationPeriodDate).getTime() -  (15 * 24 * 60 * 60 * 1000); //Validate Date - 14day for Manual testing
    const date1_ms = new Date(this.modificationPeriodDate).getTime(); //Validate Date
    const date2_ms = new Date().getTime();
    const difference_ms = date2_ms - date1_ms;
    const diff = Math.round(difference_ms/one_day);
    if(this.getCorrectionStatus() === 'validatedByAcadDir' || this.getCorrectionStatus() == 'validatedByCertiAdmin') {
      if (diff > 14 && !this.utilityService.checkUserIsDirectorSalesAdmin()) {

        this.readOnly = true;
        if(this.isRedoMarksEntry){
          this.showSubmitValidateBtn = true;
        } else if(this.testDetails.qualityControl) {
          this.showSubmitValidateBtn = true;
          this.checkIsMorethen14days = false;
        } else{
            this.showSubmitValidateBtn = false;
            this.checkIsMorethen14days = true;
        }
        this.subscribeFormChanges();
      } else {
        this.readOnly = false;
        this.showSubmitValidateBtn = true;
        this.checkIsMorethen14days = false;
        this.form.enable();
      }
    }

    if (this.user !== undefined && this.user) {
      if (this.user.types != null) {
        if (
          (
            this.utilityService.checkUserIsDirectorSalesAdmin()) &&
            this.user.operationRoleType !== 'certifier'
          ) {
            self.readOnly = false;
            self.showSubmitValidateBtn = true;
            self.form.enable();
            self.subscribeFormChanges();
        }
        // this.user.types.forEach(UserType => {
        //   if(['admin','director'].indexOf(UserType.name.toLowerCase()) !== -1 && this.user.entity.type === 'admtc' && this.user.operationRoleType !== 'certifier'){
        //     self.readOnly = false;
        //     self.showSubmitValidateBtn = true;
        //     self.form.enable();
        //     self.subscribeFormChanges();
        //   }
        // });
      }
    }
  }

  checkIsValidToSaveScore(){

    if(this.isUserCorrector && this.getCorrectionStatus() !== 'pending'){
      this.readOnly = true;
    }else{
      this.checkAllowToModifyCorrection();
    }

    if(this.testCorrect.correctionGrid.correction.elimination){
      if(this.testCorrect.correctionGrid.correction.eliminationReason == ''){
        return false;
      }else{
        return true;
      }
    }

    if(this.form.valid){
      return true;
    }else{
      if(this.testCorrect.missingCopy){
        return true;
      }
      if(this.testDetails && this.testDetails.type == 'free-continuous-control' && this.testCorrect.correctionGrid.correction.total){
        return true;
      }
    }
    return false;
  }

  ChangeStudentFromDropdown(e) {
    // if (this.testCorrect.missingCopy) {
    //   this.ChangeStudent({ value: e._id });
    // } else {
      // if (!this.form.valid || this.form.dirty) {
      //   this.studentSelect = this.oldStudentName;
      //   swal({
      //     title: 'Attention',
      //     html: this.translate.instant('TESTCORRECTIONS.MESSAGE.REQUIREDFIELDMESSAGE'),
      //     allowEscapeKey:true,
      //     type: 'warning'
      //   });
      // } else {
        if (this.ifEntryForQc) {
          this.studentSelect = e.aliasName;
        } else {
          this.studentSelect = e.lastName + ' ' + e.firstName;
        }
        this.studentSelectDetails = e;

        this.ChangeStudent({ value: e._id });
      //}
    //}
  }

  testChange(e) {
    this.filteredStudents = Observable.create(function (observer) {
      const filterValue = this.filter(e.target.value);
      observer.next(filterValue);
    }.bind(this));
  }


  ChangeStudent(e) {
    const selectedStudentID = e.value;
    this.oldStudentValue = selectedStudentID;
    if (this.task && this.task.type !== 'validateTestCorrectionForFinalRetake') {
      this.testCorrect.student = selectedStudentID;
    }
    const student = this.students.find((std) => {
      return std._id === selectedStudentID;
    });
    this.selectedStudentDetails = student;
    this.oldStudentName = student.lastName + ' ' + student.firstName;
    if (this.ifEntryForQc) {
      this.studentSelect = `${this.translate.instant('STUDENT.TITLE')} ${student.aliasName}`;
    } else {
      this.studentSelect = student.lastName + ' ' + student.firstName;
    }

    this.selectedStudentArray = [student];
    this.selectedStudent = selectedStudentID;
    if (student != null) {

      if (this.task && (this.task.type === 'finalRetakeMarksEntry' || this.task.type === 'validateTestCorrectionForFinalRetake')) {
        const test: any = this.task.test;
        const corr = _.filter(student.correctedTests, (c) => {
          return c.correction && c.test === test._id;
        });
        corr[0].correction.student = e.value;
        this.loadStudentCorrections(corr[0].correction, selectedStudentID);
      } else if (this.ifEntryForQc && student.correctedTestsForQualityControl && student.correctedTestsForQualityControl.length) {
        const c = student.correctedTestsForQualityControl.length && student.correctedTestsForQualityControl[0].correction ? student.correctedTestsForQualityControl[0].correction : null;
        this.loadStudentCorrections(JSON.parse(JSON.stringify(c)), selectedStudentID);
      } else {
        if (student.correctedTests != null && student.correctedTests[0] && student.correctedTests[0].correction) {
          const c = student.correctedTests[0].correction;
          this.loadStudentCorrections(JSON.parse(JSON.stringify(c)), selectedStudentID);
        } else {
          this.loadStudentCorrections(null, selectedStudentID);
        }
      }

    }
  }

  cancleClick() {
    swal({
      title: 'Attention',
      html: this.translate.instant('TESTCORRECTIONS.MESSAGE.CANCELCORRECTION'),
      type: 'question',
      showCancelButton: true,
      allowEscapeKey:true,
      cancelButtonText: this.translate.instant('NO'),
      confirmButtonText: this.translate.instant('YES')}).then(() => {
      this.location.back();
    }, function (dismiss) {
      if (dismiss === 'cancel') {
      }
    });
  }

  getScore(row) {
    let correctedTests = row.correctedTests;
    if ( this.ifEntryForQc ) {
      correctedTests = row.correctedTestsForQualityControl;
    }
    if (this.task && (this.task.type === 'finalRetakeMarksEntry' || this.task.type === 'validateTestCorrectionForFinalRetake')) {
      const corr = _.filter(correctedTests, (c) => {
        const test: any = this.task.test;
        return c.correction && c.test === test._id;
      });
      correctedTests = corr;
    }
    if (correctedTests && correctedTests && correctedTests[0] && correctedTests[0].correction) {
      if (correctedTests[0].correction.missingCopy) {
        return this.translate.instant('TESTCORRECTIONS.MISSINGCOPY');
      }
    }



    if(this.testDetails.groupTest && row['testCorrectionId'] && row['testCorrectionId']['_id']) {
      if (row['testCorrectionId'].missingCopy) {
        return this.translate.instant('TESTCORRECTIONS.MISSINGCOPY');
      }
      if (this.testDetails && this.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal === true) {
        return  row['testCorrectionId'] && row['testCorrectionId']['_id'] ? row['testCorrectionId']['correctionGrid']['correction']['additionalTotal'] : '-';
      }else {
       return row['testCorrectionId'] && row['testCorrectionId']['_id'] ? row['testCorrectionId']['correctionGrid']['correction']['total']: '-';
     }

    }


     if (this.testDetails && this.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal === true) {
       const additionalTotal = correctedTests && correctedTests[0] && correctedTests[0].correction ? correctedTests[0].correction.correctionGrid.correction.additionalTotal : '-';
       //return additionalTotal !== null ? additionalTotal + ' / ' + this.testDetails.correctionGrid.correction.totalZone.additionalMaxScore : '-';
         return additionalTotal;
     }else {
      return correctedTests && correctedTests && correctedTests[0] && correctedTests[0].correction ? correctedTests[0].correction.correctionGrid.correction.total : '-';
    }

  }


  getAllStudentsCorrected() {
    if (this.form.dirty || this.form.invalid) {
      return false;
    } else {
      if(this.testDetails.groupTest){
        return this.groups.every(function (i) { return i.testCorrectionId && i.testCorrectionId._id ? true : false; });

      } else if (this.task && (this.task.type === 'finalRetakeMarksEntry' || this.task.type === 'validateTestCorrectionForFinalRetake')) {

        return this.students.every(s => {
          const correctedTests = s.correctedTests;
          const corr = _.filter(correctedTests, (c) => {
            const test: any = this.task.test;
            return c.correction && test._id === c.test;
          });
          return corr[0].correction.missingCopy ? true : corr[0].correction.correctionGrid.correction.total ||
          corr[0].correction.correctionGrid.correction.total === 0
          ? true : false;
        });
      } else if (this.testDetails.type === 'free-continuous-control') {
        return this.students.every(function (i) {
          return i.correctedTests && i.correctedTests.length === 1 ?
            i.correctedTests[0].correction ? i.correctedTests[0].correction.missingCopy ? true :
          i.correctedTests[0].correction.correctionGrid.correction.total ||
          i.correctedTests[0].correction.correctionGrid.correction.total === 0
          ? true : false : false : false;
        });

      } else {
        const pathName = this.ifEntryForQc ? 'correctedTestsForQualityControl' : 'correctedTests';
          if (this.ifEntryForQc) {
            return this.studentForQualityControl.every(function (i) {
              return (i.parallelIntake) || (i[pathName] && i[pathName].length === 1 && i[pathName][0].correction?
                i[pathName][0].correction.missingCopy ? true :
                  i[pathName][0].correction.correctionGrid.correction.sections.length ? true : false :
                false);
            });
          } else {
            return this.students.every(function (i) {
              return (i.parallelIntake) || (i[pathName] && i[pathName].length === 1 && i[pathName][0].correction?
                i[pathName][0].correction.missingCopy ? true :
                  i[pathName][0].correction.correctionGrid.correction.sections.length ? true : false :
                false);
            });
          }
      }
    }
  }
  getAllStudentsValidated() {

    let self = this;
    if (!this.form.valid || this.form.dirty || this.isUserCorrector) {
      return false;
    } else {
      if(this.testDetails.groupTest){
        return this.groups.every(function (i) { return i.testCorrectionId && i.testCorrectionId._id ? true : false; });
      }else if (this.task && this.task.type === 'validateTestCorrectionForFinalRetake') {

        return this.students.every(s => {
          const correctedTests = s.correctedTests;
          const corr = _.filter(correctedTests, (c) => {
            const test: any = this.task.test;
            return c.correction && c.test === test._id;
          });
          return corr[0].correction ? corr[0].correction.missingCopy ? corr[0].correction.isJustified !== '' : self.docUploaded(s) : false;
        });
      } else {
        return this.students.every(function (i) { return i.correctedTests && i.correctedTests.length === 1 ?  i.correctedTests[0].correction.missingCopy ? i.correctedTests[0].correction.isJustified !== '' : self.docUploaded(i) : false; });
      }
    }
  }
  getCorrectedStudentsCorrected() {
    let total = 0;
    for (var index = 0; index < this.students.length; index++) {
      var element = this.students[index];
      if( element.correctedTests && element.correctedTests.length >= 1) {
        total = total + 1;
      }

    }
    return total;
  }


  submit(type?: string, id?: string) {
    let self = this;
    const studentID = this.testCorrect.student;
    if (this.task && this.task.type === 'finalRetakeMarksEntry') {
      this.testCorrect['finalRetake'] = true;
    }

    let taskIdString = '';
    if (this.ifEntryForQc && this.task) {
      self.testCorrect.qualityControl = true;
      taskIdString = '&taskId=' + this.task._id;
    }

    if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
      _.forEach(self.testDetails.correctionGrid.correction.sections, function (val, key) {
        _.forEach(val.subSections, function (v, k) {
          let juryObject = [];
          if((self.testDetails.type === 'Jury' || self.testDetails.type === 'Memoire-ORAL')  && self.testDetails.juryMax){
            for (var index = 0; index < self.testDetails.juryMax; index++) {
              juryObject.push({name:self.form.value['jury-' + key + '-'+k+'-' +index+'-name'],marks:self.form.value['jury-' + key + '-'+k+'-' +index+'-marks']});
            }
          }
          self.testCorrect.correctionGrid.correction.sections[key].subSections[k].jury = juryObject;
        });
      });
      if ( this.testDetails && this.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal ) {
        this.testCorrect.correctionGrid.correction.additionalTotal = (+this.testCorrect.correctionGrid.correction.totalJuryAvgRating);
      } else {
        this.testCorrect.correctionGrid.correction.total = (+this.testCorrect.correctionGrid.correction.totalJuryAvgRating);
      }

      this.juryEnabledList = _.sortBy(this.juryEnabledList, ['position']);
      this.testCorrect.juryEnabledList = this.juryEnabledList;
    }

     // penalties
     self.testCorrect.correctionGrid.correction.penalty = [];
     self.testCorrect.correctionGrid.correction.bonus = [];
     _.forEach(this.testDetails.correctionGrid.correction.penalties, function (val, key) {
      self.testCorrect.correctionGrid.correction.penalty.push({title:val['title'],rating:self.form.value['penalties-'+key]});
     });
      // bonuses
      _.forEach(this.testDetails.correctionGrid.correction.bonuses, function (val, key) {
        self.testCorrect.correctionGrid.correction.bonus.push({title:val['title'],rating:self.form.value['bonuses-'+key]});
      });

    if(this.testDetails.groupTest){
      this.testCorrect.testGroupId = this.selectedGroupDetails._id;
      this.testCorrect.isGroupCorrection = true;
    }

    //Set params for cross correction type
    this.testCorrect.isCrossCorrection = this.isCrossCorrector;



    if (this.testCorrect.missingCopy) {

      if (!this.testCorrect._id) {
        this.testCorrectionService.addNewCorrection(this.testCorrect, taskIdString).subscribe(status => {
          self.updateTestCorrectionForm(self,type,studentID,id,status);
        });
      } else {
        this.testCorrectionService.updateCorrection(this.testCorrect).subscribe(status => {
          self.updateTestCorrectionForm(self,type,studentID,id,status);
        });
      }
    } else {
      // id is coming when user change student from grid and dropdown


      if (this.form.valid || this.testCorrect.correctionGrid.correction.elimination || this.testDetails.type == 'free-continuous-control') {
        if (!this.updatingCorrection) {
          for (var index = 0; index < this.testDetails.expectedDocuments.length; index++) {
            var element = this.testDetails.expectedDocuments[index];
            element.uploadStatus = false;
          }
          //this.testCorrect.expectedDocuments = this.testDetails.expectedDocuments;
          this.testCorrectionService.addNewCorrection(this.testCorrect, taskIdString).subscribe(status => {
            self.updateTestCorrectionForm(self,type,studentID,id,status);
          });
        } else {
          //cc
          this.testCorrectionService.updateCorrection(this.testCorrect,this.ifEntryForQc, this.taskId).subscribe(status => {
            self.updateTestCorrectionForm(self,type,studentID,id,status);
          });
        }
      } else {
        swal({title: 'Attention',allowEscapeKey:true, html: this.translate.instant('TESTCORRECTIONS.MESSAGE.REQUIREDFIELDMESSAGE'),type: 'warning'});
      }
    }

  }

  updateTestCorrectionForm(self,type,studentID,id,status) {

    if (status) {
      if (this.ifEntryForQc) {
        swal({
          title: this.translate.instant('SUCCESS'),
          type: 'success',
          text: this.translate.instant('QUALITY_CONTROL.QUALITY_S4.TEXT'),
          confirmButtonText: this.translate.instant('QUALITY_CONTROL.QUALITY_S4.OK')
        });
      }else {
        swal({
          title: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONSUCCESSTitle'),
          html: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONSUCCESS',
            {
              StudentCivility: !this.testDetails.groupTest ? (this.ifEntryForQc ? '' : this.utilityService.computeCivility(this.selectedStudentDetails['civility'], this.translate.currentLang)) : '',
              StudentFirstName: !this.testDetails.groupTest ? (this.ifEntryForQc ?
                this.selectedStudentDetails.aliasName : this.selectedStudentDetails.firstName) : '',
              StudentLastName: !this.testDetails.groupTest ? (this.ifEntryForQc ? '' : this.selectedStudentDetails.lastName) : ''
            }),
          allowEscapeKey: true,
          type: 'success',
          confirmButtonText: 'OK'
        });
      }



      if(this.ifEntryForQc) {
        this.getStudentOfQualityControl(this.theTestId);
      }
      /*Added below lines to Update Form Only for Current Student to improve performace */
      for (let index = 0; index < self.students.length; index++) {
        const element = self.students[index];
        if ( studentID._id ) {
          studentID = studentID._id;
        }
        if(element._id == studentID){
          const pathName = this.ifEntryForQc ? 'correctedTestsForQualityControl' : 'correctedTests'
          if(element[pathName] && element[pathName].length){
            self.students[index][pathName][0]['correction'] = status;
          }else{
            self.students[index][pathName] = [];
            self.students[index][pathName][0] = {'correction':status};
          }
        }
      }

      if (this.ifEntryForQc) {
        for (let index = 0; index < this.studentForQualityControl.length; index++) {
          const element = this.studentForQualityControl[index];
          if ( studentID._id ) {
            studentID = studentID._id;
          }
          if(element._id == studentID){
            const pathName = this.ifEntryForQc ? 'correctedTestsForQualityControl' : 'correctedTests'
            if(element[pathName] && element[pathName].length){
              this.studentForQualityControl[index][pathName][0]['correction'] = status;
            }else{
              this.studentForQualityControl[index][pathName] = [];
              this.studentForQualityControl[index][pathName][0] = {'correction':status};
            }
          }
        }
        this.getStudentOfQualityControl(this.theTestId);
        self.searchedStudents = [..._.orderBy(this.studentForQualityControl, ['aliasName'], ['asc'])];
      } else {
        self.searchedStudents = _.orderBy(self.students, ['lastName'], ['asc']);
      }





        if (this.testDetails.class !== undefined && this.testDetails.class != null && !this.testDetails.groupTest) {
          /* Comment below line to Reduce API CALL FOR IMPROVE PERFORMANCE */
            // const CurrentStudentIndex = self.students.findIndex((s, i) => {
            //   return studentID === s._id;
            // });
            // self.selectedStudent = self.students[
            //   (CurrentStudentIndex < self.students.length - 1) ? CurrentStudentIndex + 1 : self.students.length - 1
            // ]._id;
            // self.studentSelectDetails = self.students[
            //   (CurrentStudentIndex < self.students.length - 1) ? CurrentStudentIndex + 1 : self.students.length - 1
            // ];
            // self.ChangeStudent({ value: self.selectedStudent });

            //  /*Goto Uncorrected student */
          let isUncorrected = null;
          for (var index = 0; index < self.students.length; index++) {
            var element = self.students[index];
            if (element.correctedTests == null) {
              isUncorrected = element;
              break;
            }
          }
          if(isUncorrected){
            self.studentSelectDetails = isUncorrected;
            self.selectedStudent = isUncorrected._id;
            self.selectedStudentArray = [isUncorrected];
            self.ChangeStudent({ value: self.selectedStudent });
          }else{
            self.studentSelectDetails = self.students[0];
            self.selectedStudent = self.students[0]._id;
            self.selectedStudentArray = [self.students[0]];
            self.ChangeStudent({ value: self.selectedStudent });
          }
          /*END */

        }else{
          self.getGroups();
        }
      // });


    } else {
      swal({
        title: 'Attention',
        html: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONUPDATEERROR'),
        allowEscapeKey:true,
        type: 'warning'
      });
    }
  }


  submitAll() {
    if (this.getAllStudentsCorrected()) {
      if (this.ifEntryForQc) {
        let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
        swal({
          title: this.translate.instant('QUALITY_CONTROL.QUALITY_S5.TITLE'),
          type: 'warning',
          html: this.translate.instant('QUALITY_CONTROL.QUALITY_S5.TEXT'),
          cancelButtonText: this.translate.instant('QUALITY_CONTROL.QUALITY_S5.CANCEL'),
          confirmButtonText: this.translate.instant('QUALITY_CONTROL.QUALITY_S5.OK'),
          showCancelButton: true,
          onOpen: () => {
            swal.disableConfirmButton()
            const confirmButtonRef = swal.getConfirmButton();

            // TimerLoop for derementing timeDisabledinSec
            const timerLoop = setInterval(() => {
              timeDisabledinSec -= 1;
              confirmButtonRef.innerText = this.translate.instant('QUALITY_CONTROL.QUALITY_S1.SUCCESSIN', { timer: timeDisabledinSec });
            }, 1000
            );

            // Resetting timerLoop to stop after required time of execution
            setTimeout(() => {
              confirmButtonRef.innerText = this.translate.instant('QUALITY_CONTROL.QUALITY_S1.SUCCESS');
              swal.enableConfirmButton();
              clearTimeout(timerLoop);
            }, (timeDisabledinSec * 1000));
          }

        }).then((isConfirm) => {
          if(isConfirm) {
            swal({
              title: this.translate.instant('SUCCESS'),
              type: 'success',
              text: this.translate.instant('QUALITY_CONTROL.QUALITY_S6.TEXT'),
              confirmButtonText: this.translate.instant('QUALITY_CONTROL.QUALITY_S6.OK')
            }).then((isConfirm) => {
              if (!this.ifEntryForQc) {
                this.taskService.markAllMarksEntryAsDone(this.testDetails._id,this.schoolID).subscribe((result) => {
                  this.taskService.completeTask(this.taskId).subscribe(res => {

                  });
                  swalRedirect();
                });
              } else if (this.ifEntryForQc) {
                this.taskService.completeTask(this.taskId).subscribe(res => {

                });
                this.location.back();
              }
            });
          }
        }, (dismiss) => {
        });
      }
      const swalRedirect = () => {
        if ( this.testDetails && this.testDetails.correctionType === 'cp' ) {
          swal({
            title: this.translate.instant('SUCCESS'),
            allowEscapeKey: true,
            html: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORR_S8.TEXT'),
            type: 'success',
            confirmButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.Validate_S1.BTN_OK')
          });
        } else {
          swal({
            title: this.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTEDTitle'),
            allowEscapeKey: true,
            html: this.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTED'),
            type: 'success',
            confirmButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTEDBtn')
          })
        }
        this.location.back();
      };

      if(this.taskId && !this.ifEntryForQc) {
        this.taskService.completeTask(this.taskId).subscribe((result) => {
          swalRedirect();
        });
      } else if (this.isCrossCorrectionAcadKit) {
        this.submitCrossCorrection();
      } else if(!this.ifEntryForQc) {
        this.taskService.markAllMarksEntryAsDone(this.testDetails._id,this.schoolID).subscribe((result) => {
          swalRedirect();
        });
      }
    }
  }

  validateAll() {
    let self = this;
    if (this.getAllStudentsCorrected() && this.testDetails._id) {

      swal({
        title: this.translate.instant('TESTCORRECTIONS.MESSAGE.Validate_S1.TITLE'),
        html: this.translate.instant('TESTCORRECTIONS.MESSAGE.Validate_S1.TEXT',{
          TestName:this.testDetails.name,
          RNCPTitle:this.selectedRncpTitle.shortName
        }),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.Validate_S1.BTN_OK'),
        cancelButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.Validate_S1.BTN_CANCEL')
      }).then((isConfirm) => {
        if (isConfirm) {

          let data = self.generateHTMLForEachStudentMarkEntryPDFObject();
          data['schoolId'] = this.schoolID;
          data['testId'] = this.testDetails._id;
          if ( this.taskId ) {
            data['taskId'] = this.taskId;
          }
          self.taskService.markAllValidateTestAsDone(data).subscribe((result) => {
            swal({
              title: self.translate.instant('TESTCORRECTIONS.MESSAGE.VALIDATE-SUBMIT-TITLE'),
              allowEscapeKey: true,
              html: self.translate.instant('TESTCORRECTIONS.MESSAGE.VALIDATE-SUBMIT-TEXT'),
              type: 'success',
              confirmButtonText: self.translate.instant('TESTCORRECTIONS.MESSAGE.VALIDATE-SUBMIT-OK')
            });
            self.location.back();
          });
        }
      });
    } else {
      console.log('in else');
    }
  }

  submitCrossCorrection() {
    let self = this;

    let data = self.generateHTMLForEachStudentMarkEntryPDFObject();
    data['rncpId'] = this.selectedRncpTitle._id;
    data['classId'] = this.testDetails.class;
    data['testId'] = this.testDetails._id;

    if (this.getAllStudentsCorrected() && (this.taskId || this.isCrossCorrectionAcadKit)) {
      this.crossCorrectionService.completeTask(self.taskId ? self.taskId : '',data).subscribe((result) => {
        swal({ title: self.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTEDTitle'), allowEscapeKey: true, html: self.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTED'), type: 'success', confirmButtonText: self.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTEDBtn')}).then(() => {

        });
        self.location.back();
      });

    }
  }
  checkIfAnyStudentSelected(){
    for (let i = 0; i < this.searchedStudents.length; i++) {
      const element = this.searchedStudents[i];
      if(element.retake){
       return true;
      }
    }
    return false;
  }
  submitTestReTake() {

    let self = this;
    let flag = false;
    let postData = [];
    for (let i = 0; i < this.searchedStudents.length; i++) {
      const element = this.searchedStudents[i];
      if(typeof element.retake === "undefined"){
        element.retake = false;
      }
      if(element.retake){
        flag = element.retake;
      }

      postData.push({ "testCorrectionId": element.correctedTests[0]['correction']['_id'], "shouldRetakeTest" : element.retake} );
    }


    if( flag ){
      swal({
        title: this.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S1_TITLE'),
        html: this.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S1_TEXT'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S1_BTN_OK'),
        cancelButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S1_BTN_CANCEL')
      }).then(function(isConfirm) {
        if (isConfirm) {

          if (self.testDetails._id) {
            self.taskService.submitRetakeTask(self.testDetails._id,postData, self.taskId).subscribe((result) => {
                self.location.back();
                swal({
                      title: self.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S1B_TITLE'),
                      allowEscapeKey: true,
                      html: self.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S1B_TEXT'),
                      type: 'success',
                      confirmButtonText: self.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S1B_BTN')
                    }).then(() => {});
            });
          }

        }
      }, function(dismiss) {
        if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those



        } else {
          throw dismiss;
        }
      })
    }else{

      swal({
        title: this.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S2_TITLE'),
        html: this.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S2_TEXT'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S2_BTN_OK'),
        cancelButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.RETAKE_S2_BTN_CANCEL')
      }).then(function(isConfirm) {
        if (isConfirm) {

          let data = self.generateHTMLForEachStudentMarkEntryPDFObject();
          data['taskId'] = self.taskId;
            self.taskService.completeTask(self.taskId).subscribe((result) => {
              self.location.back();
              swal({
                      title: self.translate.instant('TESTCORRECTIONS.MESSAGE.VALIDATE-SUBMIT-TITLE'),
                      allowEscapeKey: true,
                      html: self.translate.instant('TESTCORRECTIONS.MESSAGE.VALIDATE-SUBMIT-TEXT'),
                      type: 'success',
                      confirmButtonText: self.translate.instant('TESTCORRECTIONS.MESSAGE.VALIDATE-SUBMIT-OK')
                    }).then(() => {
              });
            });
          // });
        }
      }, function(dismiss) {
        if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those



        } else {
          throw dismiss;
        }
      })

    }




  }


  checkIsExpectedDocument() {
    if (this.testDetails && this.testDetails.expectedDocuments && this.testDetails.expectedDocuments.length) {
      for (let i = 0; i < this.testDetails.expectedDocuments.length; i++) {
        const element = this.testDetails.expectedDocuments[i];
        if(element.isForAllStudents || (element.documentUserType && element.documentUserType.name == 'student')){
          return this.testDetails.expectedDocuments
        }

      }
      return false;
    }
    return false;
  }
  checkIsCorrectionID(row) {
    if (row && row.correctedTests && row.correctedTests[0] && row.correctedTests[0].correction && row.correctedTests[0].correction._id) {
      if(!row.correctedTests[0].correction.missingCopy){
        return true;
      }
    }
    return false;
  }

  docUploaded(row) {
    if (this.checkIsCorrectionID(row)) {
      if (this.checkIsExpectedDocument()) {
        if (row.parallelIntake) {
          return true;
        } else {
          for (var index = 0; index < row.correctedTests[0].correction.expectedDocuments.length; index++) {
            var element = row.correctedTests[0].correction.expectedDocuments[index];
            if (element.isUploaded) {
              return true;
            }
          }
        }
      } else {
        return true;
      }
    }
    return false;
  }
  docUploadedForGroup(row){
    if(this.checkIsExpectedDocument()){
        if(row.documents.length) {
          return true;
        }
    }else{
      return true;
    }
    return false;
  }

  openDocumentForGroup(row) {
    for (var index = 0; index < row.documents.length; index++) {
      var doc = row.documents[index];


      if(doc && doc.filePath) {
        var link = document.createElement('a');
        link.setAttribute("type", "hidden"); // make it hidden if needed
        if (doc.storedInS3) {
          link.download = DownloadAnyFileOrDocFromS3.download + doc.S3FileName;
          link.target = '_blank';
          link.href = DownloadAnyFileOrDocFromS3.download + doc.S3FileName;
        } else {
          link.download = ApplicationUrls.baseApi + doc.filePath;
          link.target = '_blank';
          link.href = ApplicationUrls.baseApi + doc.filePath;
        }
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        this.acadService.getDocumentById(doc).subscribe((value) => {
          const docFromAPI = value[0];
          const link = document.createElement('a');
          link.setAttribute("type", "hidden"); // make it hidden if needed
          if (docFromAPI.storedInS3) {
            link.download = DownloadAnyFileOrDocFromS3.download + docFromAPI.S3FileName;
            link.target = '_blank';
            link.href = DownloadAnyFileOrDocFromS3.download + docFromAPI.S3FileName;
          } else {
            link.download = ApplicationUrls.baseApi + docFromAPI.filePath;
            link.target = '_blank';
            link.href = ApplicationUrls.baseApi + docFromAPI.filePath;
          }
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
      }
    }
  }

  updateExpectedDocument(row){
    if(row && row.correctedTests[0] && row.correctedTests[0].correction && row.correctedTests[0].correction.expectedDocuments && row.correctedTests[0].correction.expectedDocuments.length){

       if(row.correctedTests[0].correction.expectedDocuments.length == 1){
        this.document = row.correctedTests[0].correction.expectedDocuments[0];
        this.student = row;
        this.uploadInput.nativeElement.click();
       }else{
        this.addExpectedDocumentDialog = this.dialog.open(AddExpectedDocumentDialogComponent, this.configExpectedDoc);
        this.addExpectedDocumentDialog.componentInstance.expectedDocuments = row.correctedTests[0].correction.expectedDocuments;
        this.addExpectedDocumentDialog.componentInstance.selectedRncpTitle = this.selectedRncpTitle;
        this.addExpectedDocumentDialog.componentInstance.testDetails =this.testDetails;
        this.addExpectedDocumentDialog.componentInstance.student = row;
        this.addExpectedDocumentDialog.afterClosed().subscribe((value) => {
            if (value.status) {
              this.updateTestCorrection(value.testCorrect);
            }
        });
       }


    } else {
      log.info('expectedDocuments Not found on correction object');
    }
  }

  updateTestCorrection(testCorrect){
    log.info('updateTestCorrection invoked!');
    this.testCorrectionService.updateCorrection(testCorrect).subscribe(status => {
      if (status) {
        this.testCorrectionService.getTest(this.selectedTestId).subscribe((value) => {
          this.testDetails = value;
          this.getStudentOfQualityControl(this.theTestId);
          log.info('Call 6');
          this.loadStudentBasedOnUser();
        });

      } else {
        swal({title: 'Attention',allowEscapeKey:true, html: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONUPDATEERROR'),type: 'warning'});
      }
    });
  }

  getMaxScore() {

    if(this.testDetails.type == 'free-continuous-control'){
      return 20;
    }

    let a = 0;
    this.testDetails.correctionGrid.correction.sections.forEach((section, index) => {
      a += section.maximumRating;
    });
    return a;
  }
  // the total score of test is 100 and extra total is 20. so, in the table of result, the total should be 100 + 20 = 120 only save 100 not 120
  getMaxCustomScore() {
    return this.testDetails.correctionGrid.correction.totalZone.additionalMaxScore;
    // let a = 0;
    // this.testDetails.correctionGrid.correction.sections.forEach((section, index) => {
    //   a += section.maximumRating;
    // });
    // let total = a + parseInt(this.testDetails.correctionGrid.correction.totalZone.additionalMaxScore);
    // return total > 100 ? 100 : total;
  }


  getGroups(){
    let self = this;
     // Get test Group for test if already there and assign to card.
     this.testService.getTestGroupFromTest(this.testDetails._id, this.schoolID).subscribe((data) => {
      if (data) {
        this.groups = data;
        this.searchedGroup = data;
        console.log('searched group', this.searchedGroup);
        console.log('getCorrectionStatus()', this.getCorrectionStatus());

        this.filteredGroup = this.groups.filter(option =>{
          return option.testCorrectionId && option.testCorrectionId._id ? false : true;
        });

         /*Goto Uncorrected student */
         let isUncorrected = null;
         for (var index = 0; index < this.groups.length; index++) {
           var element = this.groups[index];
           if (element && typeof element.testCorrectionId === 'undefined') {
             isUncorrected = element;
             break;
           }
         }

         if(isUncorrected){
           this.selectedGroup = isUncorrected._id;
           this.selectedGroupArray = [isUncorrected];
           this.groupSelected(isUncorrected);
         }else{
           this.selectedGroup = this.groups[0]._id;
           this.selectedGroupArray = [this.groups[0]];
           this.groupSelected(this.groups[0]);
         }



      }
    });
  }

  groupSelected(row) {
    if(row) {
      const selectedGroupID = row._id;
      const group = this.groups.find((std) => {
        return std._id === selectedGroupID;
      });
      this.filteredGroup = this.groups.filter(option =>{
        return option.testCorrectionId && option.testCorrectionId._id ? false : true;
      });

      this.selectedGroupDetails = group;
      this.groupSelect = group.name;
      this.selectedGroupArray = [group];
      this.selectedGroup = selectedGroupID;
      if (group != null) {
        if (group.testCorrectionId != null) {
          const c = group.testCorrectionId;
          this.loadStudentCorrections(c, selectedGroupID);
        } else {
          this.loadStudentCorrections(null, selectedGroupID);
        }
      }
      log.warn('groupSelected this.selectedGroupDetails', this.selectedGroupDetails);
    }

  }

  groupChange(e) {
    const val = e.target.value;
    this.filteredGroup = val.length >= 2 ? this.groups.filter(option =>(option.name).toLocaleLowerCase().includes(val.trim().toLowerCase())) : this.groups;
  }

  getCorrectedGroupCorrected() {
    let total = 0;
    for (var index = 0; index < this.groups.length; index++) {
      var element = this.groups[index];
      if( element.testCorrectionId && element.testCorrectionId._id){
        total = total + 1;
      }
    }
    return total;
  }


  getTopLeftHeaderHeight() {
    return this.elementView.nativeElement.offsetHeight;
  }

  eliminateStudent(event) {
    let self = this;
    if(!this.testCorrect.correctionGrid.correction.elimination){
      swal({
        title: this.translate.instant('TESTCORRECTIONS.MESSAGE.ELIMINATION-WARNING-TITLE'),
        html: this.translate.instant('TESTCORRECTIONS.MESSAGE.ELIMINATION-WARNING-TEXT'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.ELIMINATION-WARNING-CONFIRM'),
        cancelButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.ELIMINATION-WARNING-CANCLE')
      }).then(function(isConfirm) {
        if (isConfirm) {
          self.testCorrect.correctionGrid.correction.total = 0;
        }
      }, function(dismiss) {
        if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those
        self.testCorrect.correctionGrid.correction.elimination = false;
        } else {
          throw dismiss;
        }
      })
    }
  }

  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    return this.datePipe.transform(date,'d MMM y');
  }

  openDocument(row) {
    for (let index = 0; index < row.correctedTests[0].correction.expectedDocuments.length; index++) {
      const doc = row.correctedTests[0].correction.expectedDocuments[index];

      if(doc && doc.document && doc.document.filePath) {
        const link = document.createElement('a');
        link.setAttribute("type", "hidden"); // make it hidden if needed
        if (doc.document.storedInS3) {
          link.download = DownloadAnyFileOrDocFromS3.download + doc.document.S3FileName;
          link.target = '_blank';
          link.href = DownloadAnyFileOrDocFromS3.download + doc.document.S3FileName;
        } else {
          link.download = ApplicationUrls.baseApi + doc.document.filePath;
          link.target = '_blank';
          link.href = ApplicationUrls.baseApi + doc.document.filePath;
        }
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        this.acadService.getDocumentById(doc.document).subscribe((value) => {
          var link = document.createElement('a');
          link.setAttribute("type", "hidden"); // make it hidden if needed
          const docFromAPI = value[0];
          if (docFromAPI.storedInS3) {
            link.download = DownloadAnyFileOrDocFromS3.download + docFromAPI.S3FileName;
            link.target = '_blank';
            link.href = DownloadAnyFileOrDocFromS3.download + docFromAPI.S3FileName;
          } else {
            link.download = ApplicationUrls.baseApi + docFromAPI.filePath;
            link.target = '_blank';
            link.href = ApplicationUrls.baseApi + docFromAPI.filePath;
          }
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
      }
    }
  }

  openDocumentForQualityMark(row) {
    for (let index = 0; index < row.correctedTestsForQualityControl[0].correction.expectedDocuments.length; index++) {
      const doc = row.correctedTests[0].correction.expectedDocuments[index];

      if(doc && doc.document && doc.document.filePath) {
        const link = document.createElement('a');
        link.setAttribute("type", "hidden"); // make it hidden if needed
        if (doc.document.storedInS3) {
          link.download = DownloadAnyFileOrDocFromS3.download + doc.document.S3FileName;
          link.target = '_blank';
          link.href = DownloadAnyFileOrDocFromS3.download + doc.document.S3FileName;
        } else {
          link.download = ApplicationUrls.baseApi + doc.document.filePath;
          link.target = '_blank';
          link.href = ApplicationUrls.baseApi + doc.document.filePath;
        }
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        this.acadService.getDocumentById(doc.document).subscribe((value) => {
          var link = document.createElement('a');
          link.setAttribute("type", "hidden"); // make it hidden if needed
          const docFromAPI = value[0];
          if (docFromAPI.storedInS3) {
            link.download = DownloadAnyFileOrDocFromS3.download + docFromAPI.S3FileName;
            link.target = '_blank';
            link.href = DownloadAnyFileOrDocFromS3.download + docFromAPI.S3FileName;
          } else {
            link.download = ApplicationUrls.baseApi + docFromAPI.filePath;
            link.target = '_blank';
            link.href = ApplicationUrls.baseApi + docFromAPI.filePath;
          }
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
      }
    }
  }

  renderData() {

    const sections = this.testDetails.correctionGrid.correction.sections;
    this.pageSectionsArray = [[]];
    let pageArrayIndex = 0;
    for (let i = 0; i <= sections.length - 1; i++) {
      const section = sections[i];
      if (this.pageSectionsArray[pageArrayIndex]) {
        this.pageSectionsArray[pageArrayIndex].push(section);
      } else {
        this.pageSectionsArray.push([section]);
      }
      if (section.pageBreak && i !== sections.length - 1) {
        pageArrayIndex = pageArrayIndex + 1;
        this.pageSectionsArray.push([]);
      }
    }
    this.pages = this.pageSectionsArray.length;

  }

  getArrayExceptFirst() {
    return this.pageSectionsArray.slice(1);
  }

  getTitleWidth() {
    const correction = this.testDetails.correctionGrid.correction;
    if (correction.commentArea) {
      if (correction.showDirectionsColumn) {
        if (correction.showLetterMarksColumn && correction.showNumberMarksColumn) {
          return '30%';
        } else {
          return '35%';
        }
      } else {
        return '35%';
      }
    } else {
      if (correction.showDirectionsColumn) {
        if (correction.showLetterMarksColumn && correction.showNumberMarksColumn) {
          return '35%';
        } else {
          return '40%';
        }
      } else {
        return '70%';
      }
    }
  }

  generateHTMLForEachStudentMarkEntryPDFObject() {
    const target = this.documentPagesRef.nativeElement.children;
    const outer = document.createElement('div');
    outer.innerHTML = '';
    let html = '';
    for (const element of target) {
      const wrap = document.createElement('div');
      const el = element.cloneNode(true);
      el.style.display = 'block';
      wrap.appendChild(el);
      html += wrap.innerHTML;
    }
    let AllStudentHtml  = html.split('$$$$$$$$$$');
    let dataPost = {
      lang:this.translate.currentLang.toUpperCase(),
      correctorId: this.currentLoginUser._id,
      corrections: []
    };
    for (let index = 0; index < AllStudentHtml.length; index++) {
      const element = AllStudentHtml[index];
      if (this.testDetails.groupTest) {
        if(this.searchedGroup && this.searchedGroup[index]){
          html = PRINTSTYLES + `<div class="ql-editor document-parent"><div>` + element + `</div></div>`;
          dataPost.corrections.push({
              student: {
                  _id: this.searchedGroup[index]['_id'],
                  rncpTitle: this.selectedRncpTitle._id
              },
              testCorrectionId: this.searchedGroup[index]['testCorrectionId']['_id'],
              htmlForPdf: html,
              docName: 'Notes-'+ this.selectedRncpTitle.shortName + ' - ' + this.testDetails.name + ' - ' + this.searchedGroup[index].name,
          });
        }
      } else {
        if(this.searchedStudents && this.searchedStudents[index]){
          html = PRINTSTYLES + `<div class="ql-editor document-parent"><div>` + element + `</div></div>`;
          dataPost.corrections.push({
              student: {
                  _id: this.searchedStudents[index]['_id'],
                  rncpTitle: this.selectedRncpTitle._id
              },
              testCorrectionId: this.searchedStudents[index]['correctedTests'] && this.searchedStudents[index]['correctedTests'][0] ? this.findTestCorrection(this.searchedStudents[index]['correctedTests']) : '',
              htmlForPdf: html,
              docName: 'Notes-'+ this.selectedRncpTitle.shortName + ' - ' + this.testDetails.name + ' - ' + this.searchedStudents[index].firstName + ' - ' + this.searchedStudents[index].lastName,
          });
        }
      }

    }

    return dataPost;
  }

  findTestCorrection(correctedTests) {
    if (this.task && this.task.test) {
      const test: any = this.task.test;
      const corr = _.filter(correctedTests, (c) => {
        return c.correction && c.correction.test === test._id;
      });
      return corr[0].correction._id;
    } else {
      return correctedTests[0].correction._id;
    }
  }

  getWidthOfSectionColumn(name){

    let result = [];
    let countColumn = 0;
    result['title'] = 350;
    result['commentArea'] = 550;
    result['showDirectionsColumn'] = 150;
    result['showLetterMarksColumn'] = 200;
    result['Jury'] = 100;
    result['Note'] = 90;


    let Width = this.elementView.nativeElement.offsetWidth;
    Width = Width - 465; // minus fix width of title and note (350 + 115)

    if (this.testDetails.correctionGrid.correction.commentArea && !this.testDetails.correctionGrid.correction.showAsList){
      countColumn += 1;
    }
    if (this.testDetails.correctionGrid.correction.showDirectionsColumn && !this.testDetails.correctionGrid.correction.showAsList){
      countColumn += 1;
      Width = Width - 150; // minus fix width of showDirectionsColumn
    }
    if (this.testDetails.correctionGrid.correction.showLetterMarksColumn && !this.testDetails.correctionGrid.correction.showAsList){
      countColumn += 1;
      Width = Width - 200; // minus fix width of showLetterMarksColumn
    }
    if (this.listJury.length){
      countColumn += this.listJury.length;
      Width = Width - (this.listJury.length * 100); // minus fix width of listJury
    }
    if(countColumn === 0){
      result['title'] = Width + 350;
    }else if(countColumn === 1){
      result['commentArea'] = Width;
      result['showDirectionsColumn'] = Width + 150;
      result['showLetterMarksColumn'] = Width + 200;
    }else{
      result['commentArea'] = Width;
    }
    return result[name];
  }

  checkIsMissingCopyEnable(){
    if(this.studentSelectDetails && this.studentSelectDetails.correctedTests && this.studentSelectDetails.correctedTests[0] && this.studentSelectDetails.correctedTests[0].correction){
      if(this.studentSelectDetails.correctedTests[0].correction.expectedDocuments.length && this.studentSelectDetails.correctedTests[0].correction.expectedDocuments[0].validationStatus == 'validated'){
        return true;
      }
    }
    return false;
  }


  getGroupScoreForStudent(studentRow){
    if ( this.searchedGroup.length ) {
      const studentId = studentRow._id;
      let requiredGroupIndex;
      for (let index = 0; index < this.searchedGroup.length; index++) {
        const groupStudents = this.searchedGroup[index]['students'];
        if (groupStudents.length) {
          for (let studentIndex = 0; studentIndex < groupStudents.length; studentIndex++) {
            if ( groupStudents[studentIndex]._id && groupStudents[studentIndex]._id === studentId ) {
              requiredGroupIndex = index;
              break;
            }
          }
        }
      }
      const score = this.getScore(this.searchedGroup[requiredGroupIndex]);
      return score;
    }
    return '';
  }

  // get the section index for section page PDF.
  getSectionIndex(sectionIndex,indesPSA){
    if(indesPSA != 0 && this.pageSectionsArray){
      let preIndex = parseInt(indesPSA) - 1;
      return parseInt(sectionIndex) + parseInt(this.pageSectionsArray[preIndex] ? this.pageSectionsArray[preIndex].length : 0)
    }else{
      return parseInt(sectionIndex);
    }
  }

  // this method converts the result sections into the same format as pagearray sections and return appropriate section.
  getSections(rSections, pIndex, sectionIndex) {
    const resultSections = rSections ? [...rSections] : [];
    const pageSectionsArrayForResult = [];
    if (resultSections.length > 0) {
      this.pageSectionsArray.forEach((ps: any[], i) => {
        const a = [];
        if (resultSections && resultSections.length > 0) {
          ps.forEach( s => {
            a.push(resultSections.shift());
          })
          pageSectionsArrayForResult.push(a);
        }
      });
    }
    return pageSectionsArrayForResult.length ? pageSectionsArrayForResult[pIndex][sectionIndex] : '';
  }

  getRetakeStudentClass(row){

    if(this.testDetails['correctionStatusForSchools'].length && this.appService.getFromAcadKit()){
      for (let index = 0; index < this.testDetails['correctionStatusForSchools'].length; index++) {
        const element = this.testDetails['correctionStatusForSchools'][index];
        if(element.school === this.schoolID && element.isRetakeGoingOn && row.correctedTests && row.correctedTests[0] && row.correctedTests[0]['correction'] && row.correctedTests[0]['correction']['shouldRetakeTest']){
          return 'textYellow';
        }

      }
    }

    // if(row.correctedTests && row.correctedTests[0] && row.correctedTests[0]['correction'] && row.correctedTests[0]['correction']['shouldRetakeTest']){
    //   return "textYellow"
    // }
    return '';
  }

  showButtonToSaveScore() {
    if (this.isUserCertifierCorrector &&
      (this.getCorrectionStatus() === 'corrected' || this.getCorrectionStatus() === 'validatedByCertiAdmin' ) ) {
      return false;
    } else {
      return true;
    }
  }

  disableValidateButton() {
    // console.log(this.getAllStudentsValidated(), this.readOnly, this.getCorrectionStatus(), this.testDetails.type)
      return (
        (!this.getAllStudentsValidated() && !this.readOnly) || ( this.getCorrectionStatus() === 'validatedByAcadDir' || this.getCorrectionStatus() === 'validatedByCertiAdmin') &&
        (this.testDetails.type !== 'free-continuous-control' &&
        !this.utilityService.checkUserIsDirectorSalesAdmin()) );
  }

  downloadPDF(){
    let self = this;
    let corr = [];
    let correctionsData;
    for(let st of this.students){
      let html = this.genMentorEvalPDF(st);
      let data = {
        student: {
          _id: st._id,
          rncpTitle: this.selectedRncpTitle._id
        },
        testCorrectionId: st.correctedTests[0].correction._id,
        htmlForPdf: html,
        docName: this.selectedRncpTitle.shortName + ' - ' + this.testDetails.name + ' - ' + st.lastName +' '+ st.firstName,
      }
      corr.push(data);
    }

    correctionsData = { corrections: corr }

    this.mentorEvalService.generateMarksEntryPDF(correctionsData)
      .subscribe(()=>{
        swal({
          type:'success',
          title: this.translate.instant('MENTOR_EVAL_PDF.SWEET_ALERT.TITLE'),
          html: this.translate.instant('MENTOR_EVAL_PDF.SWEET_ALERT.TEXT'),
          confirmButtonText: this.translate.instant('MENTOR_EVAL_PDF.SWEET_ALERT.BTN')
        });
      });
  }

  genMentorEvalPDF(st) {
    console.log(this.studentSelectDetails)
    let detailsObj = {
      testDetails: this.testDetails,
      selectedRNCP: this.selectedRncpTitle,
      selectedStudent: st,
      form: this.form.value,
      sections: this.testDetails.correctionGrid.correction.sections,
      testCorrect: this.testCorrect,
      scholarSeason: this.studentSelectDetails.scholarSeason.scholarseason,
      school: this.studentSelectDetails.school.shortName,
      max: this.getMaxScore(),
      jury: this.getTotalForJury(),
      customMax: this.getMaxCustomScore()
    };

    let translateObj = {
      tablehead: this.translate.instant('TESTCORRECTIONS.Note'),
      finalMark: this.translate.instant('TESTCORRECTIONS.FinalMark'),
      name: this.translate.instant('MENTOR_EVAL_PDF.NAME'),
      school: this.translate.instant('MENTOR_EVAL_PDF.SCHOOL')
    };


    let bodyobj = this.evalPdf.pdfGen(detailsObj, translateObj);
    let css = this.evalPdf.CSSGenr();
    return css + bodyobj;
  }

  getMarksStudentArray(): any[] {
    if ( this.testDetails.groupTest ) {
      return [this.searchedGroup];
    } else if(this.searchedStudents.length > 30) {
      const newStudetArray = [...this.searchedStudents];
      const segragateStudArray = []
      do {
        segragateStudArray.push(newStudetArray.splice(0,45));
     } while (newStudetArray.length > 0);

      return segragateStudArray;
    } else {
      return [this.searchedStudents];
    }

  }

  getPIStatusofStudent(student): boolean {
    if (student.parallelIntake && this.testDetails.subjectTestId
        && this.testDetails.subjectTestId.parallelIntake) {
      return true;
    }
    return false;
  }

  // If you found stupidity logic on this, remember you cannot swim againts the flow
  getStudentOfQualityControl(testId: string) {
    if (this.ifEntryForQc) {
      // Get id for current test corrected
      const test = this.theTestId ? this.theTestId : this.selectedTestId;

      this.testCorrectionService.getTest(testId).subscribe(value => {
        const taskAssignedTo = this.task.userSelection.userId._id;
        const studentsCorValue = value.correctorAssignedForQualityControl ? _.find(value.correctorAssignedForQualityControl,
          { 'correctorId': taskAssignedTo}) : [];
        this.studentForQualityControl =  studentsCorValue.students;
        for (let i = 0; i < this.studentForQualityControl.length; i++) {
          const correctedTest = _.find(this.studentForQualityControl[i].correctedTests,
            {'test': test} );
          this.studentForQualityControl[i].correctedTests = [];
          this.studentForQualityControl[i].correctedTests.push(correctedTest);
          let correctedTestForQC = _.find(this.studentForQualityControl[i].correctedTestsForQualityControl,
            {'test': test} );
          if (correctedTestForQC === undefined) {
            correctedTestForQC = {};
          }
          this.studentForQualityControl[i].correctedTestsForQualityControl = [];
          this.studentForQualityControl[i].correctedTestsForQualityControl.push(correctedTestForQC);
        }
      });
    }
  }
}
