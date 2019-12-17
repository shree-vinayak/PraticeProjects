import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, EmailValidator, FormControl } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { Student } from '../../../models/student.model';
import { JobDescription } from '../../../models/jobdescription.model';
import { StudentsService } from '../../../services/students.service';
import { NotificationEditorComponent } from './notification-editor/notification-editor.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from '../../../services/login.service';
import { DatePipe } from '@angular/common';
import { CompanyService } from "../../../services/company.service";
import { GlobalConstants } from '../../../shared/settings';
import { UtilityService } from '../../../services/utility.service';
import { PDFService } from '../../../services/pdf.service';
import { PRINTSTYLES, STYLES } from './styles';
import { Print } from 'app/shared/global-urls';

declare var swal: any;

// required for logging
import { Log } from "ng2-logger";
import { ResizeSvc } from 'app/shared/resize_svc';
const log = Log.create("JobDescriptionFormComponent");
log.color = "blue";

@Component({
  selector: 'app-job-description-form',
  templateUrl: './job-description-form.component.html',
  styleUrls: ['./job-description-form.component.scss'],
  providers: [ResizeSvc],
})
export class JobDescriptionFormComponent implements OnInit, OnChanges {

  @Input() jobDescriptionDetail;
  @Output() jobDescriptionStatusChangeEvent: EventEmitter<{ status: string; sendNotification: boolean }> = new EventEmitter();
  @ViewChild('pagesElement') documentPagesRef: ElementRef;
  public jobDescriptionForm: FormGroup;
  public jobDescription: JobDescription;
  public token: any;
  public maxDate: any;
  public expectedFromStudentNumber = 0;
  public missionsActivitiesAutonomyNumber = 0;
  public knowledgeNumber = 0;
  public knowledgeHowNumber = 0;
  public compnayObjectiveNumber = 0;
  public step = 2;
  public userTypes: any;
  public studentId: any;
  public student: any;
  public isReadOnly = false;
  public autonomyLevels: any = [
    { value: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT1', viewValue: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT1' },
    { value: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT2', viewValue: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT2' },
    { value: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT3', viewValue: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT3' },
    { value: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT4', viewValue: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT4' }
  ];
  private subscription: Subscription;
  public notificationEditorComponentDialog: MdDialogRef<NotificationEditorComponent>;
  public config: MdDialogConfig = {
    disableClose: true
  };

  companylist = [];
  selectedCompany: any;
  ExpeditetheValidationStatus = false;
  currentUser;
  currentLoginUserType;
  IsToken = false;
  currentUserEntityType: string;
  queryToken = '';
  isMentor = false;
  signatureOfTheStudentForJob = false;
  // Job Description Buttons
  sentToMentor = false;
  sentToStudent = false;
  validateByMentor = false;
  validateByAcademic = false;
  showSendToMentorButton = false;
  showSendToSchoolButton = false;
  showExpediteValidationButton = false;
  showSendToStudentButton = false;
  showSaveJobDescButton = false;
  showReminderForStudent = false;
  showReminderForMentor = false;
  showPDFButton = false;
  private resizeSvc: ResizeSvc;
  isMobileView = false;
  isPreviousCourse = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private studentsService: StudentsService,
    public translate: TranslateService,
    public dialog: MdDialog,
    private loginService: LoginService,
    public datepipe: DatePipe,
    private companyService: CompanyService,
    public utilityService: UtilityService,
    private pdfService: PDFService,
    pResizeSvc:ResizeSvc,) {
      this.resizeSvc = pResizeSvc;
    log.info('Constructor Invoked!');
  }

  enableButtons(jobDescriptionStatus) {
    //Disable all buttons
    this.showSendToMentorButton = false;
    this.showSendToSchoolButton = false;
    this.showExpediteValidationButton = false;
    this.showSendToStudentButton = false;
    this.showSaveJobDescButton = false;
    this.showReminderForStudent = false;
    this.showReminderForMentor = false;
    this.showPDFButton = false;

    switch (jobDescriptionStatus) {
      case 'initial':
        //all buttons not shown
        break;
      case 'sent_to_student':
        //Show SendToMentor button only to Student User or Student User With Token Link
        if ((this.currentUser !== null && this.currentUser.isUserStudent) || this.IsToken) {
          this.showSendToMentorButton = true;
          this.showSaveJobDescButton = true;
        }
        //Show buttons for academic Users
        else if (this.currentUser !== null && (this.currentUserEntityType === 'academic' || this.currentUserEntityType === 'admtc')) {
          this.showReminderForStudent = true;
          this.showExpediteValidationButton = true;
        }
        break;
      case 'sent_to_mentor':
        // Mentor Enter Form  via token
        if (this.currentUser === null && this.IsToken) {
          this.showSendToSchoolButton = true;
          this.showSaveJobDescButton = true;
        }
        // condition for logged in User View if he is mentor
        else if (this.currentUser !== null && this.currentLoginUserType === 'mentor') {
          this.showSendToSchoolButton = true;
          this.showSaveJobDescButton = true;
          this.isMentor = true;
          this.jobDescriptionForm.get('signatureOfTheStudent').disable();
        }
        // For Academic Users
        else if (this.currentUser !== null && !this.currentUser.isUserStudent && (this.currentUserEntityType === 'academic' || this.currentUserEntityType === 'admtc')) {
          this.showExpediteValidationButton = true;
          this.showReminderForMentor = true;
        }
        break;
      case 'validated_by_mentor':
        // Academic staff Enter Form  via token
        if (this.currentUser === null && this.IsToken) {
          this.showSendToStudentButton = true;
          // ACAD STAFF Can only Edit and Send Confirmation to School and Cant keep the edited Job Description
          this.showSaveJobDescButton = false;
        }
        else if (this.currentUser !== null && !this.currentUser.isUserStudent && (this.currentUserEntityType === 'academic' || this.currentUserEntityType === 'admtc')) {
          this.showSendToStudentButton = true;
          this.showSaveJobDescButton = false;
        }
        break;
      case 'validated_by_acad_staff':
        if (this.currentUser !== null && this.currentUser.isUserStudent) {
          this.showPDFButton = true;
        }
        break;
      case 'expedite_by_acad_staff':
        if (this.currentUser !== null && this.currentUser.isUserStudent) {
          this.showPDFButton = true;
        }
        break;
      case 'expedite_by_acad_staff_student':
        if (this.currentUser !== null && this.currentUser.isUserStudent) {
          this.showPDFButton = true;
        }
        //all buttons not shown
        break;
      default:
        //all buttons not shown
        break;

    }
  }
  ngOnInit() {
    this.isPreviousCourse = this.studentsService.isPreviousCourseState;

    this.resizeSvc.layout.subscribe((val) => {
      console.log('resizeSvc layout ' + val);
        if (val === 'xs' || val === 'sm'){
          this.isMobileView = true;
        }else{
          this.isMobileView = false;
        }
    });


    // if (this.utilityService.checkUserIsAdminOfCertifier()) {
    //   this.jobDescriptionForm.disable();
    // }
    let self = this;
    this.currentUser = this.loginService.getLoggedInUser();
    this.currentLoginUserType = this.currentUser && this.currentUser.types && this.currentUser.types[0] ? this.currentUser.types[0].name : "";
    this.currentUserEntityType = this.currentUser && this.currentUser.entity && this.currentUser.entity.type ? this.currentUser.entity.type : "";
    //Acad-Staff
    //mentor
    log.info('this.currentUser', this.currentUser);
    log.info('this.currentLoginUserType', this.currentLoginUserType);
    log.info('this.currentUserEntityType', this.currentUserEntityType);
    // this.getCompany();

    this.subscription = this.route.queryParams.subscribe(qParams => {
      console.log(qParams['token']);
      this.queryToken = qParams['token'];
      self.subscription = self.route.params.subscribe(params => {
        if (params.hasOwnProperty('jobDescId')) {
          self.IsToken = true;
          log.data('this.route.queryParams this.queryToken', this.queryToken);
          log.data('this.route.params params[jobDescId]', params['jobDescId']);
          log.data('Token', self.IsToken);

          self.studentsService.getValidateJobDescriptionForm(params['jobDescId'], this.queryToken).subscribe(result => {
            console.log(result);
            if (result.code == 200) {
              self.jobDescription = result.data;

              /* Enable Buttons */
              this.signatureOfTheStudentForJob = self.jobDescription.signatureOfTheStudent;
              this.updateFormAndCardStatus(self.jobDescription.status, self.jobDescription.sendNotification);

              /* missionsActivitiesAutonomy */
              if (self.jobDescription.missionsActivitiesAutonomy.length) {
                for (var index = 0; index < self.jobDescription.missionsActivitiesAutonomy.length; index++) {
                  this.addMissionsActivitiesAutonomy(this.missionsActivitiesAutonomyNumber);
                }
              }
              /* knowHow */
              if (self.jobDescription.knowHow.length) {
                for (var index = 0; index < self.jobDescription.knowHow.length; index++) {
                  this.addKnowledgeHow(this.knowledgeHowNumber);
                }
              }
              /* knowledge */
              if (self.jobDescription.knowledge.length) {
                for (var index = 0; index < self.jobDescription.knowledge.length; index++) {
                  this.addKnowledge(this.knowledgeNumber);
                }
              }
              /* expectedFromTheStudent */
              if (self.jobDescription.expectedFromTheStudent.length) {
                for (var index = 0; index < self.jobDescription.expectedFromTheStudent.length; index++) {
                  this.addExpectedFromStudent(this.expectedFromStudentNumber);
                }
              }
              /* objectivesOfTheDepartment */
              if (self.jobDescription.objectivesOfTheDepartment.length) {
                for (var index = 0; index < self.jobDescription.objectivesOfTheDepartment.length; index++) {
                  this.addCompanyObjective(this.compnayObjectiveNumber);
                }
              }
              if (self.jobDescription.datesOfTheMission && self.jobDescription.datesOfTheMission.from) {
                self.jobDescription.datesOfTheMission.from = new Date(self.jobDescription.datesOfTheMission.from);
              }
              if (self.jobDescription.datesOfTheMission && self.jobDescription.datesOfTheMission.to) {
                self.jobDescription.datesOfTheMission.to = new Date(self.jobDescription.datesOfTheMission.to);
              }
              self.jobDescriptionForm.patchValue(self.jobDescription);


              if (self.jobDescriptionForm['studentId'] && typeof self.jobDescriptionForm['studentId'].companies != undefined) {
                self.jobDescriptionForm['studentId'].companies.forEach(element => {
                  console.log(element);
                  if (element.isActive) {
                    self.selectedCompany = element._id;
                  }
                });

              }

              if (self.currentUser && self.currentUser.isUserStudent) {
                if (self.jobDescription['status'] !== "sent_to_student") {
                  self.jobDescriptionForm.disable();
                  self.isReadOnly = true;
                  log.info("Condition 1");
                } else {
                  this.jobDescriptionForm.enable();
                  this.isReadOnly = false;
                  log.info("Condition 2");
                }
              } else if (self.currentUser && self.currentLoginUserType === 'mentor') {
                if (self.jobDescription['status'] !== "sent_to_mentor") {
                  self.jobDescriptionForm.disable();
                  self.isReadOnly = true;
                } else {
                  this.jobDescriptionForm.enable();
                  this.isReadOnly = false;
                  this.isMentor = true;
                  this.jobDescriptionForm.get('signatureOfTheStudent').disable();
                }
              } else {
                this.jobDescriptionForm.enable();
                this.isReadOnly = false;
              }


            } else {

              this.translate.reloadLang(this.translate.currentLang).subscribe(sub => {
                swal({
                  type: 'error',
                  title: self.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.ERROR'),
                  text: self.translate.instant('USERS.USER_S3.TEXT'),
                  allowEscapeKey: true,
                  showCancelButton: false,
                  confirmButtonText: self.translate.instant('RESET_PASSWORD.BUTTON')
                });
                self.router.navigate(['/mailbox']);
              });
            }
          });
        } else {
          console.log(this.jobDescriptionDetail);
          let user = this.loginService.getLoggedInUser();
          console.log("In jobdescritpion Form user", user);
          self.studentsService.getValidateJobDescriptionForm(this.jobDescriptionDetail.jobDescriptionId,
            this.loginService.getToken())
            .subscribe(result => {
              console.log(result);
              if (result.code === 200) {
                self.jobDescription = result.data;

                /* Enable Buttons */
                this.signatureOfTheStudentForJob = self.jobDescription.signatureOfTheStudent;
                this.updateFormAndCardStatus(self.jobDescription.status, self.jobDescription.sendNotification);

                if (self.jobDescription.datesOfTheMission) {
                  self.jobDescription.datesOfTheMission.from = new Date(self.jobDescription.datesOfTheMission.from);
                  self.jobDescription.datesOfTheMission.to = new Date(self.jobDescription.datesOfTheMission.to);
                }
                self.jobDescriptionForm.patchValue(self.jobDescription);
                this.setFormPermission();
                console.log('this.isAcadStaff()');
                console.log(this.isAcadStaff());

              } else {
                swal({
                  title: 'Attention',
                  text: result.message,
                  allowEscapeKey: true,
                  type: 'warning'
                });
                this.router.navigate(['/']);
              }
            });
        }
      });
    });



    console.log(this.jobDescription);
    this.jobDescriptionForm = this._fb.group({
      'jobName': [this.jobDescription ? this.jobDescription.jobName : '', Validators.required],
      'company': [''],
      'mentor': [''],
      'studentIdentity': this._fb.group({
        'firstName': [this.jobDescription ? this.jobDescription.studentId.firstName : ''],
        'lastName': [this.jobDescription ? this.jobDescription.studentId.lastName : ''],
        'email': [this.jobDescription ? this.jobDescription.studentId.email : '']
      }),
      'datesOfTheMission': this._fb.group({
        'from': [this.jobDescription ? this.jobDescription.datesOfTheMission.from : '', Validators.required],
        'to': [this.jobDescription ? this.jobDescription.datesOfTheMission.to : '', Validators.required]
      }),
      'mainMissionOfTheDepartment': [this.jobDescription ? this.jobDescription.mainMissionOfTheDepartment : '', Validators.required],
      'organizationOfTheDepartment': [this.jobDescription ? this.jobDescription.organizationOfTheDepartment : '', Validators.required],
      'mainMission': [this.jobDescription ? this.jobDescription.mainMission : '', Validators.required],
      'missionsActivitiesAutonomy': this._fb.array([]),
      'knowledge': this._fb.array([]),
      'knowHow': this._fb.array([]),
      'objectivesOfTheDepartment': this._fb.array([]),
      'expectedFromTheStudent': this._fb.array([]),
      'signatureOfTheStudent': [this.jobDescription ? this.jobDescription.signatureOfTheStudent : '', Validators.required],
      'signatureOfTheCompanyMentor': [this.jobDescription ? this.jobDescription.signatureOfTheCompanyMentor : ''],
    });

    this.maxDate = new Date();
    if (this.jobDescription && this.jobDescription['status'] === 'sent_to_student') {
      this.addMissionsActivitiesAutonomy(this.missionsActivitiesAutonomyNumber);
      this.addExpectedFromStudent(this.expectedFromStudentNumber);
      this.addKnowledge(this.knowledgeNumber);
      this.addKnowledgeHow(this.knowledgeHowNumber);
      this.addCompanyObjective(this.compnayObjectiveNumber);
    }

  }

  isAcadStaff() {
    if (this.currentUser && this.currentUser.entity && !this.currentUser.isUserStudent &&
      (this.currentUser.entity.type === 'academic' || this.currentUser.entity.type === 'admtc')) {
      return true;
    }
    return false;
  }


  setFormPermission() {
    if (this.isPreviousCourse) {
      this.jobDescriptionForm.disable();
      this.isReadOnly = true;
    } else if (this.currentUser.isUserStudent) {
      if (this.jobDescriptionDetail.notification_status !== "sent_to_student") {
        this.jobDescriptionForm.disable();
        this.isReadOnly = true;
      } else {
        this.jobDescriptionForm.enable();
        this.isReadOnly = false;
      }
    } else if (this.currentLoginUserType === 'mentor') {
      if (this.jobDescriptionDetail.notification_status !== "sent_to_mentor") {
        this.jobDescriptionForm.disable();
        this.isReadOnly = true;
      } else {
        this.jobDescriptionForm.enable();
        this.isReadOnly = false;
        this.isMentor = true;
        this.jobDescriptionForm.get('signatureOfTheStudent').disable();
      }
    } else if (this.utilityService.checkUserIsAdminOfCertifier()) {
      this.jobDescriptionForm.disable();
      this.isReadOnly = true;
    } else if (this.isAcadStaff() &&
      (this.jobDescriptionDetail.notification_status !== "validated_by_acad_staff" &&
        this.jobDescriptionDetail.notification_status !== "expedite_by_acad_staff" &&
        this.jobDescriptionDetail.notification_status !== "expedite_by_acad_staff_student")) {
      this.jobDescriptionForm.enable();
      this.isReadOnly = false;
    } else {
      this.jobDescriptionForm.disable();
      this.isReadOnly = true;
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    let self = this
    console.log(changes);
    self.studentsService.getValidateJobDescriptionForm(this.jobDescriptionDetail.jobDescriptionId, this.loginService.getToken()).subscribe(result => {
      console.log(result);
      console.log('!changes.jobDescriptionDetail.firstChange', !changes.jobDescriptionDetail.firstChange);
      if (!changes.jobDescriptionDetail.firstChange) {
        this.jobDescriptionForm.reset();

        this.jobDescriptionForm.controls['missionsActivitiesAutonomy'] = this._fb.array([]);
        this.jobDescriptionForm.controls['knowledge'] = this._fb.array([]);
        this.jobDescriptionForm.controls['knowHow'] = this._fb.array([]);
        this.jobDescriptionForm.controls['objectivesOfTheDepartment'] = this._fb.array([]);
        this.jobDescriptionForm.controls['expectedFromTheStudent'] = this._fb.array([]);
        console.log('!changes.jobDescriptionDetail.firstChange Inside', !changes.jobDescriptionDetail.firstChange);
      }
      if (result.code == 200) {
        self.jobDescription = result.data;
        /* Enable Buttons */
        this.signatureOfTheStudentForJob = self.jobDescription.signatureOfTheStudent;
        this.updateFormAndCardStatus(result.data.status, result.data.sendNotification);

        if (self.jobDescription.datesOfTheMission) {
          self.jobDescription.datesOfTheMission.from = new Date(self.jobDescription.datesOfTheMission.from);
          self.jobDescription.datesOfTheMission.to = new Date(self.jobDescription.datesOfTheMission.to);
        }
        self.jobDescriptionForm.patchValue(self.jobDescription);

        console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
        console.log(self.jobDescription);
        console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');

        /* missionsActivitiesAutonomy */
        if (self.jobDescription.missionsActivitiesAutonomy.length) {
          for (var index = 0; index < self.jobDescription.missionsActivitiesAutonomy.length; index++) {
            this.addMissionsActivitiesAutonomy(this.missionsActivitiesAutonomyNumber);
          }
        }
        /* knowHow */
        if (self.jobDescription.knowHow.length) {
          for (var index = 0; index < self.jobDescription.knowHow.length; index++) {
            this.addKnowledgeHow(this.knowledgeHowNumber);
          }
        }
        /* knowledge */
        if (self.jobDescription.knowledge.length) {
          for (var index = 0; index < self.jobDescription.knowledge.length; index++) {
            this.addKnowledge(this.knowledgeNumber);
          }
        }
        /* expectedFromTheStudent */
        if (self.jobDescription.expectedFromTheStudent.length) {
          for (var index = 0; index < self.jobDescription.expectedFromTheStudent.length; index++) {
            this.addExpectedFromStudent(this.expectedFromStudentNumber);
          }
        }
        /* objectivesOfTheDepartment */
        if (self.jobDescription.objectivesOfTheDepartment.length) {
          for (var index = 0; index < self.jobDescription.objectivesOfTheDepartment.length; index++) {
            this.addCompanyObjective(this.compnayObjectiveNumber);
          }
        }

        self.jobDescriptionForm.patchValue(self.jobDescription);
        this.setFormPermission();
      } else {
        swal({
          title: 'Attention',
          text: result.message,
          allowEscapeKey: true,
          type: 'warning'
        });
        //this.router.navigate(['/']); 5a1415d4e15025718229b24f
      }
    });
  }

  getCompany() {
    this.companyService.getCompanies().subscribe(response => {
      this.companylist = response.data;
      console.log('this.companylist');
      console.log(this.companylist);
    });
  }

  addKnowledge(i: number) {
    const control = <FormArray>this.jobDescriptionForm.controls['knowledge'];
    this.knowledgeNumber = this.knowledgeNumber + 1;
    const addrCtrl = new FormControl();
    control.push(addrCtrl);
  }
  removeKnowledge(i: number, item) {
    let self = this;
    this.knowledgeNumber = this.knowledgeNumber - 1;
    const control = <FormArray>this.jobDescriptionForm.controls['knowledge'];
    this.removeFormArrayElement(i, control, item)
  }
  addKnowledgeHow(i: number) {
    const control = <FormArray>this.jobDescriptionForm.controls['knowHow'];
    this.knowledgeHowNumber = this.knowledgeHowNumber + 1;
    const addrCtrl = new FormControl();
    control.push(addrCtrl);
  }
  removeKnowledgeHow(i: number, item) {
    this.knowledgeHowNumber = this.knowledgeHowNumber - 1;
    const control = <FormArray>this.jobDescriptionForm.controls['knowHow'];
    this.removeFormArrayElement(i, control, item);
  }
  addCompanyObjective(i: number) {
    const control = <FormArray>this.jobDescriptionForm.controls['objectivesOfTheDepartment'];
    this.compnayObjectiveNumber = this.compnayObjectiveNumber + 1;
    const addrCtrl = new FormControl();
    control.push(addrCtrl);
  }
  removeCompanyObjective(i: number, item) {
    this.compnayObjectiveNumber = this.compnayObjectiveNumber - 1;
    const control = <FormArray>this.jobDescriptionForm.controls['objectivesOfTheDepartment'];
    this.removeFormArrayElement(i, control, item);
  }

  removeFormArrayElement(i, control, item) {
    let self = this;
    const formValue = item.value
    if (formValue && formValue !== "") {
      swal({
        title: self.translate.instant('JOBDESCRIPTIONFORM.S5.JOBDESC_S6'),
        type: "warning",
        allowEscapeKey: true,
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S5.REMINDYES'),
        cancelButtonClass: "btn-danger",
        cancelButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S5.CANCEL')
      }).then(function (isConfirm) {
        if (isConfirm) {
          control.removeAt(i);
        }
      });
    } else {
      control.removeAt(i);
    }
  }
  addMissionsActivitiesAutonomy(i: number) {
    const control = <FormArray>this.jobDescriptionForm.controls['missionsActivitiesAutonomy'];
    this.missionsActivitiesAutonomyNumber = this.missionsActivitiesAutonomyNumber + 1;
    const addrCtrl = this._fb.group({
      'missions': ['', Validators.required],
      'activities': ['', Validators.required],
      'autonomyLevel': ['', Validators.required]
    });
    control.push(addrCtrl);
  }
  removeMissionsActivitiesAutonomy(i: number, item) {
    let self = this;
    const formValue = item.value
    if (formValue.activities !== '' || formValue.autonomyLevel !== '' || formValue.missions !== '') {
      swal({
        title: self.translate.instant('JOBDESCRIPTIONFORM.S5.JOBDESC_S6'),
        type: "warning",
        allowEscapeKey: true,
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S5.REMINDYES'),
        cancelButtonClass: 'btn-danger',
        cancelButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S5.CANCEL')
      }).then(function (isConfirm) {
        if (isConfirm) {
          self.removeFromArray(i);
        }
      });
    } else {
      self.removeFromArray(i);
    }
  }

  removeFromArray(i) {
    this.missionsActivitiesAutonomyNumber = this.missionsActivitiesAutonomyNumber - 1;
    const control = <FormArray>this.jobDescriptionForm.controls['missionsActivitiesAutonomy'];
    control.removeAt(i);
  }
  addExpectedFromStudent(i: number) {
    const control = <FormArray>this.jobDescriptionForm.controls['expectedFromTheStudent'];
    this.expectedFromStudentNumber = this.expectedFromStudentNumber + 1;
    const addrCtrl = this._fb.group({
      'contribution': ['', Validators.required],
      'objectives': ['', Validators.required]
    });
    control.push(addrCtrl);
  }
  removeExpectedFromStudent(i: number, item) {
    this.expectedFromStudentNumber = this.expectedFromStudentNumber - 1;
    const control = <FormArray>this.jobDescriptionForm.controls['expectedFromTheStudent'];
    const self = this;
    const formValue = item.value
    if (formValue.contribution !== '' || formValue.objectives !== '') {
      swal({
        title: self.translate.instant('JOBDESCRIPTIONFORM.S5.JOBDESC_S6'),
        type: "warning",
        allowEscapeKey: true,
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S5.REMINDYES'),
        cancelButtonClass: "btn-danger",
        cancelButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S5.CANCEL')
      }).then(function (isConfirm) {
        if (isConfirm) {
          control.removeAt(i);
        }
      });
    } else {
      control.removeAt(i);
    }
  }

  minDate() {
    let beforeDate = null;
    if ( this.jobDescriptionForm.get('datesOfTheMission.from').value ) {
      const fromDate = this.jobDescriptionForm.get('datesOfTheMission.from').value;
      beforeDate = new Date(fromDate);
    }
    return beforeDate;
  }

  saveJobDescriptionForm(value: any) {
    console.log(value);
    if (this.jobDescription['status'] == 'sent_to_student' && !value.signatureOfTheStudent) {
      this.jobDescriptionForm.controls['signatureOfTheStudent'].setErrors({
        'required': true
      });
    }
    if (this.jobDescription['status'] == 'sent_to_mentor' && !value.signatureOfTheCompanyMentor) {
      this.jobDescriptionForm.controls['signatureOfTheCompanyMentor'].setErrors({
        'required': true
      });
    }

    console.log('Is valid : ', this.jobDescriptionForm.valid);
    if (this.jobDescriptionForm.valid) {
      if (this.jobDescription['status'] == 'sent_to_student') {
        const date = this.datepipe.transform(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), 'dd/M/yyyy');
        value.sendToMentor = true;
        value.message = this.translate.instant('JOBDESCRIPTIONFORM.N2', { date: date });
        value.senderProperty = {
          'sender': 'notification@admtc.pro',
          'mailType': 'sent'
        };
        value.subject = this.translate.instant('JOBDESCRIPTIONFORM.N2Subject', { date: date });

        this.setp2(value, false);
      }
      if (this.jobDescription['status'] == 'sent_to_mentor') {
        const date = this.datepipe.transform(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), 'dd/M/yyyy');
        value.sendToAcademicStaff = true;
        value.message = this.translate.instant('JOBDESCRIPTIONFORM.N3', { date: date });
        value.senderProperty = {
          'sender': 'notification@admtc.pro',
          'mailType': 'sent'
        };
        value.subject = this.translate.instant('JOBDESCRIPTIONFORM.N3Subject', { date: date });
        this.step = 3;
        this.setp3(value);

      }
      if (this.jobDescription['status'] === 'validated_by_mentor') {
        const date = this.datepipe.transform(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), 'dd/M/yyyy');
        // value.sendToAcademicStaff = true;
        value.message = this.translate.instant('JOBDESCRIPTIONFORM.N4', { date: date });
        value.senderProperty = {
          'sender': 'notification@admtc.pro',
          'mailType': 'sent'
        };
        value.subject = this.translate.instant('JOBDESCRIPTIONFORM.N4Subject', { date: date });
        this.step = 4;
        this.setp4(value);
      }
      if (this.jobDescription['status'] === 'validated_by_acad_staff') {
        this.setp4(value);
      }
    }
  }

  setp2(value, saveStatus) {
    log.data('STEP 2 value', value);
    log.data('STEP 2 saveStatus', saveStatus);
    const self = this;
    value.lang = this.translate.currentLang.toUpperCase();
    this.studentsService.saveJobDescriptionForm(this.jobDescription._id, value, this.queryToken).subscribe((response) => {
      if (response.code === 200) {
        log.data('setp2(value) response.data', response.data);
        if (response.data.status === 'sent_to_mentor') {
          this.updateFormAndCardStatus(response.data.status, response.data.sendNotification, true);
        }
        if (!saveStatus) {
          // this.enableButtons()
          swal({
            title: self.translate.instant('JOBDESCRIPTIONFORM.ConfirmSentToMentor.Title'),
            text: this.translate.instant('JOBDESCRIPTIONFORM.M5'),
            confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S6.OK'),
            allowEscapeKey: true,
            type: 'success'
          });
          // TODO: Need to Check Local Storage and Redirect to Mail box
          if (this.currentUser !== null) {
            self.router.navigate(['/mailbox']);
          }
        } else {
          console.log('INSIDE S3');
          swal({
            title: this.translate.instant('CONGRATULATIONS'),
            html: this.translate.instant('JOBDESCRIPTIONFORM.S' + this.step + '.TEXT'),
            type: 'success',
            showCancelButton: true,
            allowEscapeKey: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S' + this.step + '.KEEP'),
            cancelButtonClass: 'btn-danger',
            cancelButtonColor: 'green',
            cancelButtonText: '<span style="padding: 0 3.9rem 0 3.5rem;">' + this.translate.instant('JOBDESCRIPTIONFORM.S' + this.step + '.SEND') + '<span>'
          }).then(function (isConfirm) {

            swal({
              title: self.translate.instant('JOBDESCRIPTIONFORM.ConfirmSentToStudent.Title'),
              html: self.translate.instant('JOBDESCRIPTIONFORM.M2'),
              confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S6.OK'),
              allowEscapeKey: true,
              type: 'success'
            });
            self.router.navigate(['/']);
          }, function (dismiss) {
            if (dismiss === 'cancel') {
              this.saveJobDescriptionForm(this.jobDescriptionForm.value);
              if (this.currentUser !== null) {
                self.router.navigate(['/mailbox']);
              }
            }
          }.bind(this));
        }
      } else {
        swal({
          title: 'Attention',
          text: this.translate.instant('JOBDESCRIPTIONFORM.FAILEDMESSAGE'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    });
  }

  setp3(value) {
    log.data('STEP 3', value);
    const self = this;
    value.lang = this.translate.currentLang.toUpperCase();
    value.signatureOfTheStudent = this.signatureOfTheStudentForJob;
    this.studentsService.saveJobDescriptionForm(this.jobDescription._id, value, this.queryToken).subscribe((response) => {
      if (response.code === 200) {
        log.data('setp3(value) response.data', response.data);
        if (response.data.status === 'validated_by_mentor') {
          this.updateFormAndCardStatus(response.data.status, response.data.sendNotification, true);
        }
        if (response.data.status) {
          swal({
            title: this.translate.instant('JOBDESCRIPTIONFORM.ConfirmSentToMentor.SENDTOSCHOOLCONFIRMTITLE'),
            text: this.translate.instant('JOBDESCRIPTIONFORM.M5'),
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S6.OK'),
            type: 'success'
          });
          self.router.navigate(['/students']);
        } else {
          swal({
            title: this.translate.instant('CONGRATULATIONS'),
            html: this.translate.instant('JOBDESCRIPTIONFORM.S' + this.step + '.TEXT'),
            type: 'success',
            allowEscapeKey: true,
            showCancelButton: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S' + this.step + '.KEEP'),
            cancelButtonClass: 'btn-danger',
            cancelButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S' + this.step + '.SEND')
          }).then(function (isConfirm) {
            if (isConfirm) {
              // this.saveJobDescriptionForm(this.jobDescriptionForm.value);
              // Keep
              swal({
                html: self.translate.instant('JOBDESCRIPTIONFORM.M4'),
                allowEscapeKey: true,
                confirmButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S6.OK')
              });
              // self.router.navigate(['/mailbox']);
            }
          }, function (dismiss) {
            if (dismiss === 'cancel') {
              this.saveJobDescriptionForm(this.jobDescriptionForm.value);
              // if (this.currentUser !== null) {
              //   self.router.navigate(['/mailbox']);
              // }
            }
          }.bind(this));
        }
      } else {
        swal({
          title: 'Attention',
          text: this.translate.instant('JOBDESCRIPTIONFORM.FAILEDMESSAGE'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    });
  }

  setp4(value) {
    log.data('STEP 4', value);
    const self = this;
    if (self.ExpeditetheValidationStatus && this.jobDescription.status === 'sent_to_mentor') {
      value['status'] = 'expedite_by_acad_staff';
    } else if (self.ExpeditetheValidationStatus && this.jobDescription.status === 'sent_to_student') {
      value['status'] = 'expedite_by_acad_staff_student';
    } else {
      value['status'] = 'validated_by_acad_staff';
    }

    value.lang = this.translate.currentLang.toUpperCase();
    this.studentsService.saveJobDescriptionFormStep4(this.jobDescription._id, value, this.queryToken).subscribe((response) => {
      if (response.code === 200) {
        log.data('setp4(value) response.data', response.data);
        if (response.data.status === 'expedite_by_acad_staff' ||
          response.data.status === 'validated_by_acad_staff' ||
          response.data.status === 'expedite_by_acad_staff_student') {
          this.updateFormAndCardStatus(response.data.status, response.data.sendNotification, true);
        }
        swal({
          title: this.translate.instant('CONGRATULATIONS'),
          html: this.translate.instant('JOBDESCRIPTIONFORM.S4.TEXT'),
          type: 'success',
          allowEscapeKey: true,
          showCancelButton: false,
          confirmButtonClass: 'btn-danger',
          confirmButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S6.OK')
        }).then(function (isConfirm) {
          if (isConfirm) {

            // if (self.ExpeditetheValidationStatus) {
            //   swal({
            //     title: self.translate.instant('JOBDESCRIPTIONFORM.S6.Title'),
            //     html: self.translate.instant('JOBDESCRIPTIONFORM.S6.TEXT'),
            //     type: "success",
            //     allowEscapeKey: true,
            //     showCancelButton: false,
            //     confirmButtonClass: "btn-danger",
            //     confirmButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S6.OK')
            //   })
            // } else {
            //   swal({ html: self.translate.instant('JOBDESCRIPTIONFORM.M4'), allowEscapeKey: true, confirmButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S6.OK') });
            // }


            // self.router.navigate(['/']);
          }
        }, function (dismiss) {
          if (dismiss === 'cancel') {
            if (this.currentUser !== null) {
              self.router.navigate(['/mailbox']);
            }
          }
        }.bind(this));
      } else {
        swal({
          title: 'Attention',
          text: this.translate.instant('JOBDESCRIPTIONFORM.FAILEDMESSAGE'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    });
  }

  keepJobDescription(value: any) {
    console.log('keepJobDescription');
    console.log(value);
    console.log('Is valid : ', this.jobDescriptionForm.valid);

    if (this.jobDescriptionForm.valid) {
      if (this.jobDescription['status'] === 'sent_to_student') {
        const date = this.datepipe.transform(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), 'dd/M/yyyy');
        value.sendToMentor = false;
        value.message = this.translate.instant('JOBDESCRIPTIONFORM.N2', { date: date });
        value.senderProperty = {
          'sender': 'ADMTC <no-reply@apbprive.fr>',
          'mailType': 'sent'
        };
        value.subject = this.translate.instant('JOBDESCRIPTIONFORM.N2Subject', { date: date });

        this.step = 3;
        this.setp2(value, true);
      }
      if (this.jobDescription['status'] === 'sent_to_mentor') {
        const date = this.datepipe.transform(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), 'dd/M/yyyy');
        value.sendToAcademicStaff = false;
        value.message = this.translate.instant('JOBDESCRIPTIONFORM.N3', { date: date });
        value.senderProperty = {
          'sender': 'ADMTC <no-reply@apbprive.fr>',
          'mailType': 'sent'
        };
        value.subject = this.translate.instant('JOBDESCRIPTIONFORM.N3Subject', { date: date });
        this.step = 3;
        this.setp3(value);

      }
      if (this.jobDescription['status'] === 'validated_by_mentor') {
        const date = this.datepipe.transform(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), 'dd/M/yyyy');
        // value.sendToAcademicStaff = true;
        value.message = this.translate.instant('JOBDESCRIPTIONFORM.N4', { date: date });
        value.senderProperty = {
          'sender': 'ADMTC <no-reply@apbprive.fr>',
          'mailType': 'sent'
        };
        value.subject = this.translate.instant('JOBDESCRIPTIONFORM.N4Subject', { date: date });
        value.lang = this.translate.getBrowserLang();
        this.step = 4;
        this.ExpeditetheValidationStatus = false;
        this.setp4(value);
      }
      if (this.jobDescription['status'] === 'validated_by_acad_staff') {
        this.ExpeditetheValidationStatus = false;
        this.setp4(value);
      }
    }
    else {
      swal({
        title: this.translate.instant('PARAMETERRNCP.CLASSES.MESSAGE.ATTENTION'),
        text: this.translate.instant('JOBDESCRIPTIONFORM.REQUIRED_FIELD_MESSAGE'),
        allowEscapeKey: true,
        type: 'warning'
      });
    }
  }

  ExpeditetheValidation(value: any) {
    console.log('ExpeditetheValidation');
    console.log(value);
    console.log('Is valid : ', this.jobDescriptionForm.valid);
    const self = this;

    if (this.jobDescriptionForm.valid) {

      swal({
        title: self.translate.instant('JOBDESCRIPTIONFORM.S5.Title'),
        html: self.translate.instant('JOBDESCRIPTIONFORM.S5.TEXT'),
        type: 'warning',
        allowEscapeKey: true,
        showCancelButton: true,
        confirmButtonClass: 'btn-danger',
        confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S5.YES'),
        cancelButtonClass: 'btn-danger',
        cancelButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S5.NO')
      }).then(function (isConfirm) {
        if (isConfirm) {
          const date = self.datepipe.transform(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), 'dd/M/yyyy');
          // value.sendToAcademicStaff = true;
          value.message = self.translate.instant('JOBDESCRIPTIONFORM.N4', { date: date });
          value.senderProperty = {
            'sender': 'ADMTC <no-reply@apbprive.fr>',
            'mailType': 'sent'
          };
          value.subject = self.translate.instant('JOBDESCRIPTIONFORM.N4Subject', { date: date });
          value.lang = self.translate.getBrowserLang();
          self.ExpeditetheValidationStatus = true;
          self.step = 4;
          self.setp4(value);
        }
      }, function (dismiss) {
        if (dismiss === 'cancel') {
        }
      }.bind(this));
    } else {
      swal({
        title: this.translate.instant('PARAMETERRNCP.CLASSES.MESSAGE.ATTENTION'),
        text: this.translate.instant('JOBDESCRIPTIONFORM.REQUIRED_FIELD_MESSAGE'),
        allowEscapeKey: true,
        type: 'warning'
      });
    }
  }

  checkStatus(data, text) {
    // return data && typeof data.status !== undefined ? data.status === text : false;
    return  false;
  }

  sendRemainderToStudent() {
    const self = this;
    const lang = self.translate.currentLang.toUpperCase();
    swal({
      title: self.translate.instant('STUDENT.MESSAGE.REMINDER.CONFIRMATION_TITLE'),
      html: self.translate.instant('STUDENT.MESSAGE.REMINDER.CONFIRMATION_TEXT'),
      type: 'question',
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S5.REMINDYES'),
      cancelButtonClass: 'btn-danger',
      cancelButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S5.CANCEL')
    }).then(function (isConfirm) {
      if (isConfirm) {
        self.studentsService.sendJobDescReminderToStudent(self.jobDescription._id, lang)
          .subscribe(response => {
            log.data('sendRemainderToStudent', response);
            if (response.code === 200) {
              swal({
                title: self.translate.instant('STUDENT.MESSAGE.REMINDER.SUCCESS'),
                html: self.translate.instant(response.data),
                type: 'success',
                confirmButtonClass: 'btn-danger',
                allowEscapeKey: true,
                confirmButtonText: self.translate.instant('STUDENT.MESSAGE.OK'),
                closeOnConfirm: false
              });
            } else {
              swal({
                title: 'Attention',
                text: this.translate.instant(response.data),
                allowEscapeKey: true,
                type: 'warning'
              });
            }
          });
      }
    });
  }

  sendRemainderToMentor() {
    const lang = this.translate.currentLang.toUpperCase();
    log.data('sendRemainderToMentor lang', lang);
    this.studentsService.sendJobDescReminderToMentor(this.jobDescription._id, lang)
      .subscribe(response => {
        log.data('sendRemainderToStudent', response);
        if (response.code === 200) {
          swal({
            title: this.translate.instant('STUDENT.MESSAGE.REMINDER.SUCCESS'),
            text: this.translate.instant(response.data),
            type: 'success',
            confirmButtonClass: 'btn-danger',
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('STUDENT.MESSAGE.OK'),
            closeOnConfirm: false
          }).then(function (isConfirm) { }.bind(this));
        } else {
          swal({
            title: 'Attention',
            text: this.translate.instant(response.data),
            allowEscapeKey: true,
            type: 'warning'
          });
        }
      });
  }

  updateFormAndCardStatus(status, sendNotification, formUpdated ?: boolean ) {
      this.enableButtons(status);
    const event = {
      status: status,
      sendNotification: sendNotification
    }
    this.jobDescriptionStatusChangeEvent.emit(event);
    this.checkStatusOfJobDesc(event);
    if ( formUpdated ) {
      this.jobDescriptionForm.disable();
      this.isReadOnly = true;
    }
  }

  downloadPDF() {
    const target = this.documentPagesRef.nativeElement.children;
    const outer = document.createElement('div');
    outer.innerHTML = '';
    let html = PRINTSTYLES;
    html += `<div class="ql-editor document-parent" style="background-color: #474747" ><div>`;
    for (const element of target) {
      const wrap = document.createElement('div');
      const el = element.cloneNode(true);
      el.style.display = 'block';
      el.style.backgroundColor = '#424242';
      wrap.appendChild(el);
      html += wrap.innerHTML;
    }
    html += `</div></div>
    `;

    const filename = 'Student Job Description PDf';
    const landscape = false;
    this.pdfService.getPDF(html, filename, landscape).subscribe(res => {
      if (res.status === 'OK') {
        const element = document.createElement('a');
        element.href = Print.url + res.filePath;
        element.target = '_blank';
        element.setAttribute('download', res.filename);
        element.click();
      }
    });
  }

  checkStatusOfJobDesc(notify) {
    this.sentToStudent = false;
    this.sentToMentor = false;
    this.validateByMentor = false;
    this.validateByAcademic = false;
    switch (notify.status) {
      case 'sent_to_student':
        this.sentToStudent = notify.sendNotification;
        log.info('sent_to_student', this.sentToStudent);
        break;

      case 'sent_to_mentor':
        log.info('sent_to_mentor');
        this.sentToStudent = notify.sendNotification;
        this.sentToMentor = true;
        break;

      case 'validated_by_mentor':
        log.info('validated_by_mentor');
        this.sentToStudent = notify.sendNotification;
        this.sentToMentor = true;
        this.validateByMentor = true;
        break;

      case 'validated_by_acad_staff':
        log.info('validated_by_acad_staff ');
        this.sentToStudent = notify.sendNotification;
        this.sentToMentor = true;
        this.validateByMentor = true;
        this.validateByAcademic = true;
        break;
      case 'expedite_by_acad_staff':
        log.info('expedite_by_acad_staff ');
        this.sentToStudent = notify.sendNotification;
        this.sentToMentor = true;
        this.validateByMentor = false;
        this.validateByAcademic = true;
        break;
        case 'expedite_by_acad_staff_student':
        log.info('expedite_by_acad_staff_student');
        this.sentToStudent = notify.sendNotification;
        this.sentToMentor = false;
        this.validateByMentor = false;
        this.validateByAcademic = true;
        break;
      default:
        log.info('Notification Status must me Intiial', notify);
        this.sentToStudent = false;
        this.sentToMentor = false;
        this.validateByMentor = false;
        this.validateByAcademic = false;
    }
  }
}
