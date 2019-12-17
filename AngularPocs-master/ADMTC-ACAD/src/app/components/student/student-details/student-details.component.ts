import { rcnpTitle } from './../../../models/rncpTitle.model';
import { OldUser } from 'app/models/user-old.model';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  NgZone,
  Inject,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import {
  MdDialog,
  MdDialogConfig,
  MdDialogRef,
  MD_DIALOG_DATA
} from '@angular/material';
import { CustomValidators } from 'ng2-validation';
import { ViewEncapsulation } from '@angular/core';
import { AddClassDialogComponent } from 'app/dialogs/add-class-dialog/add-class-dialog.component';
import { AddCompanyDialogComponent } from 'app/dialogs/add-company-dialog/add-company-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { User } from 'app/models/user.model';
import { RNCPTitlesService } from 'app/services/rncp-titles.service';
import { UserService } from 'app/services/users.service';
import { StudentsService } from 'app/services/students.service';
import { Student } from 'app/models/student.model';
import { Company } from 'app/models/company.model';
import { TranslateService } from 'ng2-translate';
import { UtilityService } from 'app/services/utility.service';
import {
  emailValidator,
  matchingPasswords
} from '../../../custome-validation/custom-validator';
import { AddMentorComponent } from 'app/dialogs/add-mentor/add-mentor.component';
import { DatePipe } from '@angular/common';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload, Companies, DownloadAnyFileOrDocFromS3 } from 'app/shared/global-urls';
import { DomSanitizer } from '@angular/platform-browser';
import { ScholarSeasonService } from 'app/services/scholar-season.service';
import { CompanyService } from 'app/services/company.service';
import { CustomerService } from '../../customer/customer.service';
import { CountryData } from '../country';
import { StudentConstants } from '../student-constants';
import { JobDescriptionNotificationDialogComponent } from '../../customer/customer-edit/customer-edit-student/job-description-notification-dialog/job-description-notification-dialog.component';
import _ from 'lodash';
import { Page } from '../../../models/page.model';
import { MdSlideToggleChange } from '@angular/material';
import { ApplicationUrls } from 'app/shared/settings';
import { StudentJobDescription } from './student-job-description/studen-job-description.model';
import { JobDescription } from '../../../models/jobdescription.model';
import { MentorEvaluationService } from 'app/services/mentor-evaluation.service';
import * as moment from 'moment';
import { MentorEvalNotifComponent } from './student-mentor-eval/email-template/mentor-eval-notif.component';
import { ResizeSvc } from 'app/shared/resize_svc';
import { AppSettings } from '../../../app-settings';
import { ConfigService } from '../../../services/config.service';
// Required for Logging on console
import { Log } from 'ng2-logger';
import { StudentCertDetailEditDialogComponent } from '../student-dialogs/student-cert-detail-edit-dialog/student-cert-detail-edit-dialog.component';
import { AlertService } from 'app/services/alert.service';
import { DisplayMailPopupComponent } from 'app/components/Mail/display-mail-popup/display-mail-popup.component';
import { LoginService } from 'app/services';
const log = Log.create('StudentDetailsComponent2');
log.color = 'blue';

declare var swal: any;
@Component({
  selector: 'app-student-details2',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService, DatePipe,ResizeSvc]
})
export class StudentDetailsComponent2 implements OnInit, OnChanges {
  @Input() studentEmitted: any;
  @Input() studentWithIndex;
  @Input() customerId: any;
  @Input() indexOfStudent: number;
  @Input() isMentor: boolean;
  @Output() updateStudent: EventEmitter<object> = new EventEmitter();
  @ViewChild('studentTabGroup') tabGroup;

  // rncpTitleID: any;
  form: FormGroup;
  formCourse: FormGroup;
  formIdentity: FormGroup;
  formParents: FormArray;
  formCompany: FormGroup;
  public modify: boolean;
  selectedSchoolRNCPTitle = false;
  nonAcademic = true;
  student;
  selectedCompany: any;
  isPreviousCourse = false;

  previousRNCPId: string = '';
  displayParents = false;
  studentDetailNeedRevision = false;
  selectedCompanyChange: any;
  selectedMentor: any;
  selectedMentorChange: any;
  userid: string;
  user: OldUser;
  companylist = [];
  allCompanylist = [];
  currentLoginUser: any = '';
  companySearchString = '';
  mentorSearchString = '';
  errorMessage: any;
  studentInformation: any = [];
  maxDate: any;
  isJobdesProbReset = false;
  isMentorEvalReset = false;
  private subscription: Subscription;
  public jobDescriptionDialog: MdDialogRef<
    JobDescriptionNotificationDialogComponent
  >;
  popupConfig: MdDialogConfig;
  selectedStudent = [];
  problematicData;
  formSubmit;

  page = new Page();
  customer = [this.student];
  studentChanged = false;
  selectedIndex = 0;
  companyStatus = false;
  formCourseSubmit = false;
  formIdentitySubmit = false;
  formParentsSubmit = false;
  formCompanySubmit = false;
  CompanyLists = [];
  serverimgPath = ApplicationUrls.baseApi;
  s3FilePath = DownloadAnyFileOrDocFromS3.download;
  imgUrl = ApplicationUrls.imageBasePath + 'assets/images/default_img.png';
  imgUrlFemale = ApplicationUrls.imageBasePath +
    'assets/images/default_female_img.png';
  jobDescription: StudentJobDescription;
  enableJobDescription = false;
  enableJobDescriptionAsStatus = false;
  enableProblematic = false;
  enableMentorEvaluation = false;
  mdDate = new Date().toLocaleString('en-GB');
  newCustomerId: any;
  oldCustomerId: any;
  isFirstChange = false;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  studentWithDiploma: {
    studentId: string;
    firstName: string;
    lastName: string;
    rncpShortName: string;
    diploma: string;
    lastObtainedDiploma: string;
    status: string;
    diplomaS3Path: string;
    isDiplomaInS3: boolean;
  };

  today = Date.now();

  sexType: Array<object> = StudentConstants.sexType;
  relations: Array<object> = StudentConstants.studentRelations;

  classType: any = [];
  studId: any = [];

  configCat: MdDialogConfig = {
    disableClose: false,
    width: '900px'
  };
  // ADMTC staff dialog property
  configUser: MdDialogConfig = {
    disableClose: false,
    width: '500px',
    height: '510px'
  };

  configDoc: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };

  addClassDialog: MdDialogRef<AddClassDialogComponent>;
  addMentorComponent: MdDialogRef<AddMentorComponent>;
  public addCompanyDialog: MdDialogRef<AddCompanyDialogComponent>;
  sendMentorEvaluationDialog: MdDialogRef<MentorEvalNotifComponent>;

  public dialogRefDisplayMail: MdDialogRef<DisplayMailPopupComponent>;
  DisplayMailPopupConfig: MdDialogConfig = {
    disableClose: true,
    width: '850px',
    height: '65%'
  };

  @Inject(MD_DIALOG_DATA) public data: any;
  userList = [];

  ActivityText;

  countryList: any[] = [...CountryData.CountryList];
  nationalitiesList = [...CountryData.nationalitiesList];
  sortedCountryList = [];
  sortedNationalitiesList = [];

  public guardianNumber = 0;

  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });
  public filePreviewPath: any = '';
  showTranscriptTab: boolean = false;
  transcriptTabConfig: boolean = false;
  certificateDetailTabConfig: boolean = false;
  @ViewChild('userphoto') uploadInput: any;
  public scholerSeasonData = [];
  public RNCPfilterTitles = [];
  loading = false;
  loadTabMarks = false;
  loadTabJobDes = false;
  loadTabMentorEval = false;
  loadTabProblematic = false;
  loadTabCertification = false;
  loadTabFinalTranscript = false;
  loadTabFCertificateDetails = false;
  loadTabStudentDoc = false;
  loadTabCompany = false;
  position = 'before';
  StudentMentorEvalId;
  studentId = [];
  specializationsArray = [];

  isActiveInstance: boolean = true;

  // Flag to check if All Scholar Seasons Are Fetch
  allScolarSeasonsFetched: boolean = false;

  private resizeSvc: ResizeSvc;
  isMobileView = false;
  newAlert: boolean;
  getAlertUserList: any;

  constructor(
    private scholarservice: ScholarSeasonService,
    public utility: UtilityService,
    private route: ActivatedRoute,
    private zone: NgZone,
    private dialog: MdDialog,
    public dialog1: MdDialog,
    public mentordialog: MdDialog,
    private fb: FormBuilder,
    private appService: RNCPTitlesService,
    private studentService: StudentsService,
    private service: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    public datepipe: DatePipe,
    public sanitizer: DomSanitizer,
    private companyService: CompanyService,
    private customerService: CustomerService,
    private mentorEvaluationService: MentorEvaluationService,
    pResizeSvc:ResizeSvc,
    private configService: ConfigService,
    private alertService: AlertService,
    private loginService: LoginService
  ) {
    this.resizeSvc = pResizeSvc;
    this.maxDate = new Date();
    log.info('Constructor Invoked');
  }

  handleKeyboardEvents(event: KeyboardEvent) {
  }

  minDate() {
    const now = new Date();
    return new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  }


  selectScholerSeason(id) {
    if ( this.formCourse && this.formCourse.value ) {
      this.formCourse.get('rncpTitle').setValue('');
      this.formCourse.get('currentClass').setValue('');
      this.formCourse.get('specializations').setValue('');
      this.specializationsArray = [];
    }
    this.RNCPfilterTitles = [];
    if(this.scholerSeasonData && this.scholerSeasonData.length === 1) {
      const currentSeason = _.cloneDeep(this.student.scholarSeason);
      currentSeason.rncptitles = [
        this.student.rncpTitle
      ];
      this.scholerSeasonData = [
        currentSeason
      ];
      this.RNCPfilterTitles.push(
        this.student.rncpTitle
      );
      console.log(this.student)
    } else {
      for (const scholarseasondata of this.scholerSeasonData) {
        if (scholarseasondata._id === id) {
          this.RNCPfilterTitles = scholarseasondata.rncptitles;
        }
      }
    }
  }

  getCompany() {
    this.companyService
      .getCompaniesLinkedToSchool(this.customerId)
      .subscribe(response => {
        this.allCompanylist = _.orderBy(
          response.data,
          ['companyName'],
          ['asc']
        );
        this.companylist = this.allCompanylist;
      });
  }

  ngOnInit() {

    this.checkIfNewAlert();
    this.sortedCountryList = this.sortCountry(this.countryList);
    this.sortedNationalitiesList = this.sortNationality(this.nationalitiesList);
    this.translate.onLangChange.subscribe(() => {
      this.sortedCountryList = this.sortCountry(this.countryList);
      this.sortedNationalitiesList = this.sortNationality(this.nationalitiesList);
    });



    this.resizeSvc.layout.subscribe((val) => {
        if (val === 'xs' || val === 'sm'){
          this.isMobileView = true;
        }else{
          this.isMobileView = false;
        }
    });
    /*Loader */
    //this.startLoader();

    this.subscription = this.route.params.subscribe(params => {
      if (params.hasOwnProperty('customerId')) {
        this.customerId = params['customerId'];
        this.oldCustomerId = this.customerId;
      } else {
        if ((this.customerId = this.studentWithIndex.student.school._id)) {
          this.customerId = this.studentWithIndex.student.school._id;
        } else {
          this.customerId = this.studentWithIndex.student.school;
        }
        this.oldCustomerId = this.customerId;
      }
      // For Problemtic or Mentor Eval Link to Direct to Respected Tab
      // Change selectedIndex of Problemtic or Mentor Eval Tab in case new Tabs are added or removed
      if (params.hasOwnProperty('goto')) {
        if (params['goto'].toLowerCase() === 'problematic') {
          if (this.utility.checkUserIsAdminOfCertifier()) {
            this.tabGroup.selectedIndex = 2;
          } else {
            this.tabGroup.selectedIndex = 6;
          }
          this.loadTabProblematic = true;
        } else if (params['goto'].toLowerCase() === 'mentoreval') {
          this.tabGroup.selectedIndex = 5;
          this.loadTabMentorEval = true;
        } else if (params['goto'].toLowerCase() === 'finalcertification') {
          // this.tabGroup.selectedIndex = this.tabGroup._tabs.length - 1;
          this.loadTabFinalTranscript = true;
        } else if (params['goto'].toLowerCase() === 'detailofcertification') {
          this.loadTabFCertificateDetails = true;
        }
      }
    });
    this.getStudentMentorEvalID();
    this.student = this.studentWithIndex.student;
    this.studentId = this.student._id;
    if (this.student.jobDescriptionId) {
      this.jobDescription = new StudentJobDescription(
        this.student._id,
        this.student.jobDescriptionId.status,
        this.student.jobDescriptionId._id,
        this.student.jobDescriptionId.sendNotification
      );
    } else {
      this.jobDescription = new StudentJobDescription(
        this.student._id,
        '',
        '',
        false
      );
    }

    // this.getCompany();
    /*Get Company list */
    this.scholerSeasonData = [];
    this.RNCPfilterTitles = [];
    const currentSeason = _.cloneDeep(this.student.scholarSeason);
    currentSeason.rncptitles = [
      this.student.rncpTitle
    ];
    this.scholerSeasonData.push(
      currentSeason
    );
    this.RNCPfilterTitles.push(
      this.student.rncpTitle
    );
    this.setSpecializationArray(this.student.rncpTitle._id);
    this.prepopulateCompanyDetails(false);

    /*Get Current Loggedin User Details */
    this.currentLoginUser = this.service.getRole();
    const user = JSON.parse(localStorage.getItem('loginuser'));
    if (user.entity.type === 'academic') {
      this.nonAcademic = false;
    }

    /*Upload Student Photo*/
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.uploader.queue[0].upload();
      this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file._file)
      );
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      swal({
        title: 'Attention',
        text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey: true,
        type: 'warning'
      });
      this.uploader.clearQueue();
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      if (res.status === 'OK') {
        this.formIdentity.controls['photo'].setValue(res.data.filepath);
        this.formIdentity.controls['photoS3Path'].setValue(res.data.s3FileName);
        if (res.data && res.data.s3FileName) {
          this.formIdentity.controls['isPhotoInS3'].setValue(true);
        } else {
          this.formIdentity.controls['isPhotoInS3'].setValue(false);
        }
        this.uploader.clearQueue();
      } else {
        swal({
          title: 'Attention',
          text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    };
    this.customer = this.student.school;

    this.getDisplayTranscriptConfig();
    this.isPreviousCourse = this.studentService.isPreviousCourseState;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.isJobdesProbReset = false;
    this.isMentorEvalReset = false;
    this.enableJobDescriptionAsStatus = false;
    this.isFirstChange = changes.studentWithIndex.firstChange;
    this.formIdentitySubmit = true;
    this.formParentsSubmit = true;
    this.formCompanySubmit = true;

    this.CompanyLists = [];
    this.selectedCompany = {};
    this.selectedCompanyChange = {};
    this.selectedMentor = '';
    this.selectedMentorChange = '';

    this.getStudentMentorEvalID();

    if (this.isMentor || this.studentWithIndex.index === 'studentInfo') {
      this.subscription = this.route.params.subscribe(params => {
        if (!params.hasOwnProperty('customerId')) {
          this.customerId = this.studentWithIndex.student.school._id;
          this.newCustomerId = this.customerId;
        }
      });
      if (this.oldCustomerId !== this.newCustomerId) {
        /*Get Associated ScholerSeason */
        this.scholarservice
          .getAssociatedscholerSeason(this.newCustomerId)
          .subscribe(
            (data: any) => {
              this.scholerSeasonData = [];
              this.RNCPfilterTitles = [];
              for (const element of data) {
                if (element.scholarseason) {
                  this.scholerSeasonData.push(element);
                  if (element._id === this.student.scholarSeason._id) {
                    this.RNCPfilterTitles = element.rncptitles;
                  }
                }
              }
            },
            (error: Response) => log.data('getAssociatedscholerSeason error', error)
          );
        this.oldCustomerId = this.newCustomerId;
      }
    }

    if ( !_.isEqual(this.studentWithIndex.student, this.student)) {
      this.student = {...this.studentWithIndex.student};

      this.initializeFormGroup(false);
      log.data('ngOnChanges this.studentWithIndex this.student', this.student);
      this.studentWithDiploma = {
        studentId: this.student._id,
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        rncpShortName: this.student.rncpTitle.shortName,
        diploma: this.student.diploma,
        lastObtainedDiploma: this.student.lastObtainedDiploma,
        status: this.student.status,
        diplomaS3Path: this.student.diplomaS3Path ? this.student.diplomaS3Path : '',
        isDiplomaInS3: this.student.isDiplomaInS3 ? this.student.isDiplomaInS3 : false
      };
      if ( !this.allScolarSeasonsFetched ) {
        this.selectScholerSeason(this.student.scholarSeason._id);
      }
      if ( this.formCourse ) {
        this.reinitializeParallelControl();
      }
      if ( this.formCompany ) {
        this.reinitializeFormControl();
      }
      this.isActiveInstance = this.student.companies[0] && this.student.companies[0].isActive
      ? this.student.companies[0].isActive : false;

      if ( this.formCompany ) {
        this.reinitializeFormControl(this.isActiveInstance);
      }
      this.prepopulateCompanyDetails(true);


      if (this.student.photo === '') {
        this.formIdentity.get('photo').setValue('');
      }
      if (this.student.isPhotoInS3) {
        this.formIdentity.get('photoS3Path').setValue(this.student.photoS3Path);
        this.formIdentity.get('isPhotoInS3').setValue(this.student.isPhotoInS3);
      }
      this.uploader.clearQueue();
      this.studentChanged = true;
      this.customer = this.student.school;
      if (this.transcriptTabConfig) {
        this.checkForTranscriptTabDisp();
      }
    }

    this.filePreviewPath = '';
    if (this.selectedIndex === 3 || (this.selectedIndex === 4 && this.student.employabilitySurveyId)) {
      if (this.studentChanged) {
        this.formCompany.markAsDirty();
        this.onCompanyTabSelected();
      }
    }

    if (
      this.selectedIndex === 0 ||
      this.selectedIndex === 1 ||
      this.selectedIndex === 2
    ) {
      this.stopLoader();
    }

    if (
      this.utility.checkUserIsAdminOfCertifier() &&
      this.tabGroup.selectedIndex === 2
    ) {
      this.loadTabProblematic = true;
    } else if (this.tabGroup.selectedIndex === 6) {
      this.loadTabProblematic = true;
    }
  }

  getScholarSeason() {
    /*Get Associated ScholerSeason */
    if( !this.allScolarSeasonsFetched ) {
      this.scholarservice.getAssociatedscholerSeason(this.customerId).subscribe(
        (data: any) => {
          this.scholerSeasonData = [];
          this.RNCPfilterTitles = [];
          for (const element of data) {
            if (element.scholarseason) {
              this.scholerSeasonData.push(element);
              if (element._id === this.student.scholarSeason._id) {
                this.RNCPfilterTitles = element.rncptitles;
              }
            }
          }
          this.stopLoader();
          this.allScolarSeasonsFetched = true;
        },
        (error: Response) => this.handleErrors(error)
      )
    }
  }

  getSpecializations() {
    if (this.student.specializations){
      return _.find(this.specializationsArray, {'_id': this.student.specializations._id});
    }
    return null;
  }

  initializeFormGroup(updateFrom) {
    if (updateFrom) {
      this.changeRNCPTitles({
        value: this.student.rncpTitle ? this.student.rncpTitle['_id'] : ''
      });
    }
    // log.data('this.student.specializationsthis.student.specializations this.specializationsArray',this.student.specializations , this.specializationsArray);
    this.formCourse = this.fb.group({
      parallelIntake: [this.student && this.student.parallelIntake ? this.student.parallelIntake  : false],
      scholerSeason: [
        this.student['scholarSeason'] ? this.student['scholarSeason']._id : '',
        Validators.required
      ],
      rncpTitle: [
        this.student.rncpTitle ? this.student.rncpTitle['_id'] : '',
        Validators.required
      ],
      currentClass: [
        this.student.currentClass ? this.student.currentClass['_id'] : '',
        Validators.required
      ],
      specializations: [this.student.specializations ? this.getSpecializations() : {}, []],
      previousClasses: [[]]
    });

    const birthDate = new Date(this.student.dateOfBirth);
    const bd =
      birthDate.getDate() +
      '-' +
      (birthDate.getMonth() + 1) +
      '-' +
      birthDate.getFullYear();
    this.mdDate = bd;
    this.formIdentity = this.fb.group({
      sex: [this.student.sex ? this.student.sex : '', [Validators.required]],
      firstName: [
        this.student.firstName ? this.student.firstName : '',
        [Validators.required, Validators.maxLength(40)]
      ],
      lastName: [
        this.student.lastName ? this.student.lastName : '',
        [Validators.required, Validators.maxLength(40)]
      ],
      telePhone: [
        this.student.telePhone ? this.student.telePhone : '',
        [Validators.required, Validators.maxLength(10)]
      ],
      dateOfBirth: [
        this.student.dateOfBirth ? this.mdDate : '',
        [Validators.required]
      ],

      placeOfBirth: [
        this.student.placeOfBirth ? this.student.placeOfBirth : '',
        [Validators.required]
      ],
      // country: [this.student.country ? this.student.country : '1', [Validators.required, Validators.maxLength(40)]],
      nationality: [
        this.student.nationality ? this.student.nationality : '1',
        [Validators.required, Validators.maxLength(40)]
      ],
      photo: [this.student.photo ? this.student.photo : ''],
      photoS3Path: [this.student.photoS3Path],
      isPhotoInS3: [this.student.isPhotoInS3],
      address: this.fb.group({
        line1: [
          this.student.address ? this.student.address.line1 : '',
          [Validators.required]
        ],
        line2: [this.student.address ? this.student.address.line2 : ''],
        postalCode: [
          this.student.address ? this.student.address.postalCode : '',
          [
            Validators.maxLength(9),
            Validators.required
          ]
        ],
        city: [
          this.student.address ? this.student.address.city : '',
          Validators.required
        ],
        country: [this.student.address ? this.student.address.country : '1']
      }),
      // 'companyStatusGroup': [this.modify ? (this.student. === '' ? false : true) : false],
      email: [
        this.student.email ? this.student.email : '',
        [Validators.required, Validators.email]
      ]
    });
    this.formParents = this.fb.array([]);

    this.formCompany = this.fb.group({
      companies: [
        this.student.companies[0] && this.student.companies[0].isActive
          ? this.selectedCompany
          : ''
      ],
      mentors: [this.selectedMentor ? this.selectedMentor : ''],
      isActive: [
        this.student.companies[0] && this.student.companies[0].isActive
          ? this.student.companies[0].isActive
          : false
      ],
      startDate: [
        this.student.companies[0] && this.student.companies[0].startDate
          ? this.student.companies[0].startDate
          : new Date(),
        [Validators.required]
      ],
      endDate: [
        this.student.companies[0] && this.student.companies[0].endDate
          ? this.student.companies[0].endDate
          : new Date(),
        [Validators.required]
      ]
    });
    if (this.student.parents.length) {
      for (let i = 0; i < this.student.parents.length; i++) {
        this.guardianNumber = i;
        this.addGuardian(this.guardianNumber);
      }
    } else {
      this.addGuardian(this.guardianNumber);
    }

    if (this.isMentor) {
      this.formCourse.disable();
      this.formIdentity.disable();
      this.formCompany.disable();
    } else if (this.studentWithIndex.index === 'studentInfo') {
      this.formCourse.disable();
      this.formIdentity.disable();
      this.formCompany.disable();
      if(this.utility.checkUserIsStudent()) {
        this.formParents.enable();
      }
      this.displayParents = true;
    } else if ( this.student.certificateIssuanceStatus && this.student.certificateIssuanceStatus === 'details_need_revision') {
      this.formIdentity.disable();
      this.studentDetailNeedRevision = true;
    } else {
      this.formCourse.enable();
      this.formIdentity.enable();
      this.formParents.enable();
      this.formCompany.enable();
      this.studentDetailNeedRevision = false;
    }

    if (this.selectedIndex === 1 || this.selectedIndex === 2) {
      this.stopLoader();
    }
  }

  getAllClass() {
    this.service.getAllClass().subscribe(response => {
      this.classType = response.data;
    });
  }

  getMentorList(companyId) {
    this.service.getMentorsForCompany(companyId).subscribe(response => {
      this.userList = [];
      const userListArray = response;
      this.userList = _.orderBy(userListArray, ['lastName'], ['asc']);
    });
  }

  getRandomNumberForStudentRef() {
    return 'RNCP' + Math.floor(100000 + Math.random() * 900000);
  }

  addCourse(value: any): void {
    this.formCourseSubmit = true;
    if (this.formCourse.valid) {
      this.tabGroup.selectedIndex = 1;
      this.selectedIndex = 1;
    }
  }
  addIdentity(value: any): void {
    this.formIdentitySubmit = true;
    if (this.formIdentity.valid) {
      this.tabGroup.selectedIndex = 2;
      this.selectedIndex = 2;
    }
  }
  addParents(value: any): void {
    this.formParentsSubmit = true;
    if (this.formParents.valid) {
      this.tabGroup.selectedIndex = 3;
      this.selectedIndex = 3;
    }
  }

  goToMarks() {
    this.tabGroup.selectedIndex = 4;
    this.selectedIndex = 4;
  }

  saveUserDetails() {
    if ((this.formCourse.valid && this.formIdentity.valid) || (this.formParents.valid && this.utility.checkUserIsStudent())) {
      this.addCompany();
    }
  }

  addCompany(): void {

    this.formCompanySubmit = true;
    if (this.formCompany || this.formParents.valid) {
      let NewCompany;
      if (this.formCompany.value.companies && this.formCompany.value.isActive) {
        NewCompany = {
          company: this.formCompany.value.companies._id,
          endDate: new Date().toDateString(),
          isActive: this.formCompany.value.isActive,
          startDate: new Date(this.formCompany.value.startDate).toDateString()
        };
        if (this.formCompany.value.mentors) {
          NewCompany.mentors = this.formCompany.value.mentors;
        } else if (this.selectedMentorChange) {
          NewCompany.mentors = this.selectedMentorChange;
        }
      }
      const courseValues = this.formCourse.value;
      const IdentityValues = this.formIdentity.value;
      IdentityValues.address.postalCode = IdentityValues.address.postalCode.toString();
      const ParentsValues = { parents: [this.formParents.value] };
      ParentsValues.parents[0].forEach((postal, i) => {
        if ( postal.address && postal.address.postalCode ) {
          ParentsValues.parents[0][
            i
          ].address.postalCode = postal.address.postalCode.toString();
        }
      });
      const CompanyValues = this.formCompany.value;
      const merged = {
        ...courseValues,
        ...IdentityValues,
        ...ParentsValues
      };
      merged.parents = [];
      this.formParents.value.forEach(element => {
        merged.parents.push(element);
      });

      // merged.parents = this.formParents.value;
      if ( this.formCompany.dirty ) {
        merged.companies = [];
        if (NewCompany && NewCompany.company) {
          merged.companies.push(NewCompany);
        }
        let company;
        this.CompanyLists.forEach(element => {
          if (element.company) {
            company = {
              company: element.company._id,
              startDate: new Date(element.startDate).toDateString(),
              endDate: new Date(element.endDate).toDateString(),
              isActive: false
            };
            if (element.mentors) {
              company.mentors = element.mentors;
            }
            merged.companies.push(company);
          }
        });
      }
      merged.school = this.customerId;
      merged.dateOfBirth = moment(this.mdDate, 'DD-MM-YYYY').format(
        'MM-DD-YYYY'
      );
      this.studentInformation = merged;
      if (this.isJobdesProbReset) {
        merged.jobDescriptionId = null;
        merged.problematicId = null;
      }
      if ( this.isMentorEvalReset ) {
        merged.mentorEvaluationId = null;
      }
      this.addUserFunction(merged);
    }
  }
  sameAddressChange(event, index) {
    if (event.checked) {
      const formIdentityValue = this.formIdentity.value;
      const element = this.formParents.controls[index];
      element['controls'].address['controls'].city.setValue(
        formIdentityValue.address.city
      );
      element['controls'].address['controls'].country.setValue(
        formIdentityValue.address.country
      );
      element['controls'].address['controls'].line1.setValue(
        formIdentityValue.address.line1
      );
      element['controls'].address['controls'].line2.setValue(
        formIdentityValue.address.line2
      );
      element['controls'].address['controls'].postalCode.setValue(
        formIdentityValue.address.postalCode
      );
    } else {
      const element = this.formParents.controls[index];
      element['controls'].address['controls'].city.setValue('');
      element['controls'].address['controls'].country.setValue('1');
      element['controls'].address['controls'].line1.setValue('');
      element['controls'].address['controls'].line2.setValue('');
      element['controls'].address['controls'].postalCode.setValue('');
    }
  }
  addNewCompany() {
    this.addCompanyDialog = this.dialog.open(
      AddCompanyDialogComponent,
      this.configCat
    );
    this.addCompanyDialog.componentInstance.schoolId = this.customerId;
    this.addCompanyDialog.afterClosed().subscribe(companyValues => {
      if (companyValues !== undefined) {
        this.isMentorEvalReset = true;
        this.companylist = this.companyService.addCompany(companyValues);

        this.companyService
          .getCompaniesLinkedToSchool(this.customerId)
          .subscribe(response => {
            this.allCompanylist = _.orderBy(
              response.data,
              ['companyName'],
              ['asc']
            );
            this.companylist = this.allCompanylist;
            this.companylist.forEach(company => {
              if (company.companyName === companyValues.companyName) {
                this.filterSelectedCompany(company);
                this.companySearchString = company.companyName;
              }
            });
          });
      }
    });
  }

  addCompanyinList(data) {
    // if (this.formCompany.valid) {
    const self = this;
    const startTime = moment(this.formCompany.value.startDate);
    const endTime = moment(this.formCompany.value.endDate);
    if (!moment(startTime).isSameOrBefore(endTime)) {
      swal({
        title: this.translate.instant(
          'SETTINGS.SCHOLERSEASON.INVALIDDATETITLE'
        ),
        text: this.translate.instant('SETTINGS.SCHOLERSEASON.INVALIDDATETEXT'),
        type: 'warning',
        allowEscapeKey: true,
        confirmButtonText: 'OK'
      }).then(
        function() {
          // this.cancel();
        }.bind(this)
      );
    } else {
      if (data) {
        let mentor;
        if (data.mentors) {
          mentor = _.filter(this.userList, function(s) {
            return s._id === data.mentors;
          });
        } else {
          mentor = _.filter(this.userList, function(s) {
            return s._id === self.selectedMentorChange;
          });
        }
        this.CompanyLists.push({
          mentors: mentor[0],
          company: data.companies,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          isActive: false
        });
        this.companySearchString = '';
        this.formCompany.controls['mentors'].setValue('');
        this.formCompany.controls['companies'].setValue('');
        this.formCompany.controls['startDate'].setValue(new Date());
        this.formCompany.controls['endDate'].setValue(new Date());
        this.formCompany.controls['isActive'].setValue(true);
        this.enableJobDescription = false;
        this.enableProblematic = false;
        this.enableMentorEvaluation = false;
      }
    }
  }

  addUser(value: any): void {
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {});
      }
    });

    if (this.form.valid) {
      this.addUserFunction(value);
    }
  }

  addUserFunction(value: any) {
    /*Loader */
    this.startLoader();
    this.studentService.updateStudent(this.student._id, value).subscribe(
      student => {
        if (student) {
          if (this.student.email !== student.email) {
            swal({
              title: this.translate.instant('EMAIL_S6.TITLE'),
              text: this.translate.instant('EMAIL_S6.TEXT'),
              type: 'info',
              confirmButtonClass: 'btn-danger',
              allowEscapeKey: true,
              confirmButtonText: this.translate.instant(
                'BACKEND.STUDENT.THANKYOU'
              ),
              closeOnConfirm: false
            });
          } else {
            swal({
              title: this.translate.instant('STUDENT.MESSAGE.SUCCESS'),
              text: this.translate.instant('STUDENT.MESSAGE.UPDATESUCCESS', {
                Civility: this.utility.computeCivility(
                  student.sex,
                  this.translate.currentLang.toLowerCase()
                ),
                LName: student.lastName,
                FName: student.firstName
              }),
              type: 'success',
              confirmButtonClass: 'btn-danger',
              allowEscapeKey: true,
              confirmButtonText: this.translate.instant('STUDENT.MESSAGE.OK'),
              closeOnConfirm: false
            }).then(function(isConfirm) {}.bind(this));
          }
          this.student = student;
          if (this.student.jobDescriptionId) {
            if ( this.isMentorEvalReset ) {
              this.jobDescription.jobDescriptionId = '';
            }
            this.jobDescription = new StudentJobDescription(
              this.student._id,
              this.student.jobDescriptionId.status,
              this.student.jobDescriptionId._id,
              this.student.jobDescriptionId.sendNotification
            );
          } else {
            this.jobDescription = new StudentJobDescription(
              this.student._id,
              '',
              '',
              false
            );
          }
          if (
            !this.student.jobDescriptionId ||
            (this.jobDescription.notification_status === 'sent_to_student' &&
              this.jobDescription.sendNotification)
          ) {
            this.enableJobDescriptionAsStatus = true;
          }
          student.companies.forEach(company => {
            if (company.isActive) {
              this.enableJobDescription = true;
              if (student.rncpTitle) {
                if (student.rncpTitle.hasOwnProperty('hasProblematic')) {
                  this.enableProblematic = student.rncpTitle.hasProblematic;
                }
              }
              this.enableMentorEvaluation = true;
            }
          });

          this.updateStudentDetails();
          this.stopLoader();
          this.uploader.clearQueue();
        } else {
          this.stopLoader();
          swal({
            title: 'Attention',
            text: this.translate.instant('STUDENT.MESSAGE.FAILEDMESSAGE'),
            allowEscapeKey: true,
            type: 'warning'
          });
        }
      },
      error => {
        this.handleErrors(<any>error);
      }
    );
  }

  checkIfNewAlert(){
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

  setSpecializationArray(rncp_title_id) {
    if ( this.formCourse ) {
      this.formCourse.get('specializations').setValue('');
    }

    if (this.RNCPfilterTitles && this.student.rncpTitle && this.student.rncpTitle.specializations) {
      const rncpSps = _.find(this.RNCPfilterTitles, {'_id': rncp_title_id});
      const rncpSpcializations = rncpSps && rncpSps.specializations ? rncpSps.specializations : [];

      const interSectSpecialization = [..._.intersectionWith(this.student.school.specializations, rncpSpcializations,
        (schoolSpecializations, rncpSpecializations) => {
          return (schoolSpecializations._id === rncpSpecializations._id);
        })];
      this.specializationsArray = interSectSpecialization;
    } else {
      this.specializationsArray = [];
    }
  }

  changeRNCPTitles(rncp) {
    const rncp_title_id = rncp.value;
    this.setSpecializationArray(rncp_title_id);
    if (this.previousRNCPId !== rncp_title_id) {
      this.studentService.getAllClassesRNCPTitle(rncp_title_id).subscribe(
        response => {
          this.selectedSchoolRNCPTitle = true;
          this.classType = response.data;
        },
        error => {
          this.handleErrors(error);
        }
      );
      this.previousRNCPId = rncp_title_id;
    }
  }

  onLinkClick(event) {
    const courseTabCompany = this.translate.instant('STUDENT.COMPANY');
    const courseTabMarks = this.translate.instant('STUDENT.MARKS');
    const courseTabJobDesc = this.translate.instant('STUDENT.JOBDESCRIPTION');
    const courseTabCertification = this.translate.instant(
      'STUDENT.SUBJECTFORCERTIFICATION'
    );
    const courseTabMentorEval = this.translate.instant('STUDENT.MENTOR_EVAL');
    const courseTabProblematic = this.translate.instant(
      'STUDENT.SENDINTERNSHIPTHEME'
    );
    const courseTabFinalTranscript = this.translate.instant('FINAL_TRANSCRIPT.TAB_TITLE');
    const courseTabCERTIFICATE_ISSUANCE = this.translate.instant('CERTIFICATE_ISSUANCE.TAB_TITLE');
    const courseTabStudentDocuments = this.translate.instant('PARAMETERS-RNCP.Documents');

    this.selectedIndex = event.index;
    switch (event.tab.textLabel) {
      case courseTabMarks:
        this.loadTabMarks = true;
        break;

      case courseTabJobDesc:
        this.loadTabJobDes = true;
        break;

      case courseTabCompany:
        this.loadTabCompany = true;
        if (this.studentChanged) {
          this.formCompany.markAsDirty();
          this.onCompanyTabSelected();
        }
        break;

      case courseTabMentorEval:
        this.loadTabMentorEval = true;
        break;
      case courseTabProblematic:
        this.loadTabProblematic = true;
        break;
      case courseTabCertification:
        this.loadTabCertification = true;
        break;
      case courseTabFinalTranscript:
        this.loadTabFinalTranscript = true;
        break;
      case courseTabCERTIFICATE_ISSUANCE:
        this.loadTabFCertificateDetails = true;
        break;
      case courseTabStudentDocuments:
        this.loadTabStudentDoc = true;
        break;
      default:
        break;
    }
  }

  initGuardianAddress(i: number) {
    const parentFormGroup: FormGroup = this.fb.group({
      relation: [
        this.student.parents[i] ? this.student.parents[i].relation : ''
      ],
      sex: [this.student.parents[i] ? this.student.parents[i].sex : ''],
      familyName: [
        this.student.parents[i] ? this.student.parents[i].familyName : ''
      ],
      name: [this.student.parents[i] ? this.student.parents[i].name : ''],
      sameAddress: [''],
      email: [this.student.parents[i] ? this.student.parents[i].email : ''],
      telePhone: [
        this.student.parents[i] ? this.student.parents[i].telePhone : ''
      ],
      address: this.fb.group({
        line1: [
          this.student.parents[i] ? this.student.parents[i].address.line1 : ''
        ],
        line2: [
          this.student.parents[i] ? this.student.parents[i].address.line2 : ''
        ],
        postalCode: [
          this.student.parents[i]
            ? this.student.parents[i].address.postalCode
            : ''
        ],
        city: [
          this.student.parents[i] ? this.student.parents[i].address.city : ''
        ],
        country: [
          this.student.parents[i]
            ? this.student.parents[i].address.country
            : '1'
        ]
      })
    });

    if (this.utility.checkUserIsStudent()) {
      parentFormGroup.controls['relation'].setValidators(Validators.required);
      parentFormGroup.controls['sex'].setValidators(Validators.required);
      parentFormGroup.controls['familyName'].setValidators(Validators.required);
      parentFormGroup.controls['name'].setValidators(Validators.required);
      parentFormGroup.controls['email'].setValidators(Validators.required);
      parentFormGroup.controls['telePhone'].setValidators([Validators.required, Validators.maxLength(10)]);
      parentFormGroup.get('address.line1').setValidators(Validators.required);
      parentFormGroup.get('address.city').setValidators(Validators.required);
    }

    return parentFormGroup;
  }

  addGuardian(i: number) {
    const control = this.formParents;
    this.guardianNumber = this.guardianNumber + 1;
    const addrCtrl = this.initGuardianAddress(i);
    control.push(addrCtrl);
  }

  removeGuardian(i: number) {
    this.guardianNumber = this.guardianNumber - 1;
    const control = this.formParents;
    control.removeAt(i);
  }

  changeCompanySelect(event) {
    if (event._id) {
      this.formCompany.get('mentors').setValue('');
      this.ActivityText = event.activity;
      const companyId = event._id;
      this.getMentorList(companyId);
      this.service.getMentorsForCompany(companyId).subscribe(response => {
        this.userList = [];
        const userListArray = response;
        this.userList = _.orderBy(userListArray, ['lastName'], ['asc']);
      });
    }
    if (
      this.selectedCompany === this.selectedCompanyChange &&
      this.selectedMentor === this.selectedMentorChange
    ) {
      this.enableJobDescription = true;
      if (this.student.rncpTitle) {
        if (this.student.rncpTitle.hasOwnProperty('hasProblematic')) {
          this.enableProblematic = this.student.rncpTitle.hasProblematic;
        }
      }
      this.enableMentorEvaluation = true;
      this.isJobdesProbReset = false;
      this.isMentorEvalReset = false;
      this.selectedMentor = '';
    } else {
      this.enableJobDescription = false;
      this.enableProblematic = false;
      this.enableMentorEvaluation = false;
      this.isMentorEvalReset = true;
      this.isJobdesProbReset = true;
    }
  }
  changeMentorSelect(event) {
    if (
      this.selectedCompany === this.selectedCompanyChange &&
      this.selectedMentor === this.selectedMentorChange
    ) {
      this.enableJobDescription = true;
      if (this.student.rncpTitle) {
        if (this.student.rncpTitle.hasOwnProperty('hasProblematic')) {
          this.enableProblematic = this.student.rncpTitle.hasProblematic;
        }
      }
      this.enableMentorEvaluation = true;
      this.isJobdesProbReset = false;
      this.isMentorEvalReset = false;
    } else {
      this.enableMentorEvaluation = false;
      this.isMentorEvalReset = true;
    }
  }

  addNewMentor() {
    this.service.loginUser = 1;
    this.addMentorComponent = this.dialog.open(
      AddMentorComponent,
      this.configUser
    );
    this.addMentorComponent.componentInstance.customerId = this.customerId;
    this.addMentorComponent.componentInstance.companylist = this.companylist;
    this.addMentorComponent.componentInstance.selectedCompany = this.formCompany.get(
      'companies'
    ).value.companyName;
    this.addMentorComponent.afterClosed().subscribe(value => {
      this.getMentorList(this.formCompany.get('companies').value._id);
      this.isMentorEvalReset = true;

      if (value) {
        this.selectedMentor = value.data._id;
      }
    });
  }

  openJobDescriptionNotification() {
    if (this.student.status === 'pending') {
      this.studentRegistrationPendingAlert();
    } else if (
      this.jobDescription.notification_status === 'sent_to_student' &&
      this.jobDescription.sendNotification
    ) {
      this.sendRemainderToStudent();
    } else if (!this.student.jobDescriptionId) {
      this.jobDescriptionDialog = this.dialog1.open(
        JobDescriptionNotificationDialogComponent,
        this.popupConfig
      );

      this.jobDescriptionDialog.componentInstance.selectedStudent = [
        this.student
      ];
      this.jobDescriptionDialog.componentInstance.selectedCompany = this.selectedCompany;
      this.jobDescriptionDialog.componentInstance.selectedMentor = this.selectedMentor;
      this.jobDescriptionDialog.componentInstance.customer = this.customer;
      this.jobDescriptionDialog.afterClosed().subscribe(result => {
        this.jobDescriptionDialog = null;        this.studentService
        .getStudentDetails(this.student._id)
        .subscribe(student => {
          this.student = student.data.result[0];
          this.updateStudent.emit({
            student: this.student,
            index: this.studentWithIndex.index
          });
          if (this.student.jobDescriptionId) {
            this.jobDescription = new StudentJobDescription(
              this.student._id,
              this.student.jobDescriptionId.status,
              this.student.jobDescriptionId._id,
              this.student.jobDescriptionId.sendNotification
            );
            console.log(this.student)
          } else {
            this.jobDescription = new StudentJobDescription(
              this.student._id,
              '',
              '',
              false
            );
          }
        });
      });
    }
  }

  toggleStatus(event: MdSlideToggleChange) {
    this.companyStatus = event.checked;
    if (this.companyStatus) {
      this.formCompany.controls['isActive'].setValue(true);
      if (
        this.selectedCompany === this.selectedCompanyChange
      ) {
        this.enableJobDescription = true;
        if (this.student.rncpTitle) {
          if (this.student.rncpTitle.hasOwnProperty('hasProblematic')) {
            this.enableProblematic = this.student.rncpTitle.hasProblematic;
          }
        }
        this.enableMentorEvaluation = true;
        this.isJobdesProbReset = false;
        this.isMentorEvalReset = false;
      }
    } else {

      // Actions to Perform when company is Marked as inactive
      const actionAfterConfirmation = (isConfirm) => {
        this.formCompany.controls['isActive'].setValue(false);
        this.enableJobDescription = false;
        this.enableProblematic = false;
        this.enableMentorEvaluation = false;
        this.isJobdesProbReset = true;
        this.isMentorEvalReset = true;
        this.companySearchString = '';
        this.selectedMentorChange = this.selectedMentor;
        this.selectedMentor = '';
        this.jobDescription = new StudentJobDescription(
          this.student._id,
          '',
          '',
          false
        );
      };

      const onDismissalOfConfirmation = (dismiss) => {
        this.formCompany.controls['isActive'].setValue(true);
      };

      // Setting the Confirm Button Disable time to 6
      let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
      swal({
        type: 'warning',
        title: this.translate.instant('STUD_S9.TITLE'),
        html: this.translate.instant('STUD_S9.TEXT', {
          companyName: this.selectedCompany.companyName,
          studentCivility: this.utility.computeCivility( this.student.sex, this.translate.currentLang.toLowerCase()),
          studentFirstName: this.student.firstName,
          studentLastName: this.student.lastName
        }),
        allowEscapeKey: true,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('STUD_S9.CONFIRM_IN', { timer: timeDisabledinSec }),
        cancelButtonText: this.translate.instant('CANCEL'),
        onOpen: () => {
          swal.disableConfirmButton()
          const confirmButtonRef = swal.getConfirmButton();

          // TimerLoop for derementing timeDisabledinSec
          const timerLoop = setInterval(() => {
            timeDisabledinSec -= 1;
            confirmButtonRef.innerText = this.translate.instant('STUD_S9.CONFIRM_IN', { timer: timeDisabledinSec });
          }, 1000
          );

          // Resetting timerLoop to stop after required time of execution
          setTimeout(() => {
            confirmButtonRef.innerText = this.translate.instant('STUD_S9.CONFIRM');
            swal.enableConfirmButton();
            clearTimeout(timerLoop);
          }, (timeDisabledinSec * 1000));
        }
      }).then(actionAfterConfirmation, onDismissalOfConfirmation);
    }
  }

  cancel() {}

  openUploadWindow() {
    this.uploader.clearQueue();
    this.uploadInput.nativeElement.click();
  }

  prepopulateCompanyDetails(updateFrom) {
    if (updateFrom) {
      if (this.student.jobDescriptionId) {
        this.jobDescription = new StudentJobDescription(
          this.student._id,
          this.student.jobDescriptionId.status,
          this.student.jobDescriptionId._id,
          this.student.jobDescriptionId.sendNotification
        );
      } else {
        this.jobDescription = new StudentJobDescription(
          this.student._id,
          '',
          '',
          false
        );
      }

      if (
        !this.student.jobDescriptionId ||
        (this.jobDescription.notification_status === 'sent_to_student' &&
          this.jobDescription.sendNotification)
      ) {
        this.enableJobDescriptionAsStatus = true;
      }

      if (
        this.student.companies[0] &&
        this.student.companies[0].isActive &&
        this.student.companies[0].mentors
      ) {
        this.enableJobDescription = true;
        if (this.student.rncpTitle) {
          if (this.student.rncpTitle.hasOwnProperty('hasProblematic')) {
            this.enableProblematic = this.student.rncpTitle.hasProblematic;
          }
        }
        this.enableMentorEvaluation = true;
        this.isJobdesProbReset = false;
        this.isMentorEvalReset = false;
      } else {
        this.enableJobDescription = false;
        this.enableProblematic = false;
        this.enableMentorEvaluation = false;
        this.companySearchString = '';
        this.mentorSearchString = '';
      }
    }
    this.initializeFormGroup(updateFrom);
  }

  onCompanyTabSelected() {
    this.studentChanged = false;

    if (this.companylist.length === 0 && this.onCompanyTabSelected) {
      this.startLoader();
      this.companyService
        .getCompaniesLinkedToSchool(this.customerId)
        .subscribe(response => {
          this.allCompanylist = _.orderBy(
            response.data,
            ['companyName'],
            ['asc']
          );
          this.companylist = this.allCompanylist;
          if (this.companylist) {
            this.checkStudentIsActive();
          } else {
            this.stopLoader();
          }
        });
    } else {
      this.stopLoader();
      this.checkStudentIsActive();
    }
  }

  checkStudentWithActiveCompany(studentCompany) {
    for (const company of this.companylist) {
      if (company.companyName === studentCompany.company.companyName) {
        this.selectedCompany = company;
        this.companySearchString = company.companyName;
        this.selectedCompanyChange = company;
        this.formCompany.controls['companies'].setValue(company);
        if (studentCompany.mentors) {
          this.startLoader();
          this.service.getMentorsForCompany(company._id).subscribe(response => {
            this.userList = [];
            this.stopLoader();
            const userListArray = response;
            this.userList = _.orderBy(userListArray, ['lastName'], ['asc']);
            this.userList.forEach(mentor => {
              if (mentor._id === studentCompany.mentors._id) {
                this.selectedMentor = mentor._id;
                this.selectedMentorChange = mentor._id;
              }
            });
          });
        } else {
          this.stopLoader();
        }
      }
    }
  }

  checkStudentIsActive() {
    if ( this.student.companies && this.student.companies.length ) {
      this.student.companies.forEach(element => {
        if (element.isActive) {
          this.checkStudentWithActiveCompany(element);
        } else {
          this.CompanyLists.push({
            company: element.company,
            mentors: element.mentors,
            startDate: new Date(element.startDate),
            endDate: new Date(element.endDate),
            isActive: element.isActive
          });
        }
      });
    } else {
      this.stopLoader();
    }
  }

  sendMentorEvaluation() {
    const self = this;
    if (this.student.status === 'pending') {
      this.studentRegistrationPendingAlert();
    } else if (this.student &&
      (!this.student.mentorEvaluationId ||
        (this.student.mentorEvaluationId.mentorEvaluationStatus === 'sentToMentor'))) {

      const titleText = !this.student.mentorEvaluationId ? this.translate.instant('MENTOR_EVAL_NOTIFICATIONS.CONFIRM_SEND.TITLE') :
        this.translate.instant('MENTOR_EVAL_NOTIFICATIONS.CONFIRM_SEND.REMIND');

          const reminderText = !this.student.mentorEvaluationId ? '' :
        this.translate.instant('MENTOR_EVAL_NOTIFICATIONS.CONFIRM_SEND.REMIND_TEXT',
        { dateOfSending: this.getTranslatedDate(this.student.mentorEvaluationId.createdDate) });

      swal({
        title: titleText,
        text: reminderText,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant('MENTOR_EVAL_NOTIFICATIONS.CONFIRM_SEND.BTN1'),
        cancelButtonText: this.translate.instant('MENTOR_EVAL_NOTIFICATIONS.CONFIRM_SEND.BTN2'),
      }).then((result) => {
        if (result) {
          this.openSendMentorEvalDialog();
        }
      });
    } else if (this.student && this.student.mentorEvaluationId) {
      swal({
        title: this.translate.instant(
          'MENTOREVALUATION.MENTOREVAL_SENT.TITLE'
        ),
        text: this.translate.instant(
          'MENTOREVALUATION.MENTOREVAL_SENT.TEXT'
        ),
        allowEscapeKey: true,
        type: 'error',
        confirmButtonText: this.translate.instant(
          'BACKEND.STUDENT.UNDERSTOOD'
        )
      });
    }
  }

  openSendMentorEvalDialog() {
    this.sendMentorEvaluationDialog = this.mentordialog.open( MentorEvalNotifComponent, { disableClose: true } );
    this.sendMentorEvaluationDialog.componentInstance.student = this.student;
    this.sendMentorEvaluationDialog.afterClosed().subscribe( (state) => {
      if ( state ) {
        this.updateStudentDetails('');
      }
    });
  }

  updateStudentList(event) {
    this.updateStudentDetails('');
  }

  getStudentMentorEvalID() {
    if (
      this.studentWithIndex &&
      this.studentWithIndex.student &&
      typeof this.studentWithIndex.student.mentorEvaluationId !== 'undefined' &&
      this.studentWithIndex.student.mentorEvaluationId
    ) {
      this.StudentMentorEvalId = this.studentWithIndex.student.mentorEvaluationId._id;
    } else {
      this.StudentMentorEvalId = 'undefined';
    }
  }

  searchCompanyList(event) {
    if (this.companySearchString !== '') {
      const val = event.target.value.toLowerCase();
      this.companylist = this.allCompanylist;
      const temp = this.companylist.filter(function(d) {
        return (
          d.companyName !== '' &&
          d.companyName.toLowerCase().indexOf(val) !== -1
        );
      });
      this.companylist = temp;
    } else {
      this.companylist = this.allCompanylist;
    }
  }

  filterSelectedCompany(company) {
    if (company !== 'add') {
      const isActiveControl = this.formCompany.get('isActive');
      if (!isActiveControl.value) {
        isActiveControl.setValue(true);
      }
      this.formCompany.get('companies').setValue(company);
      this.selectedCompany = company;
    } else {
      this.addNewCompany();
    }
    this.changeCompanySelect(company);
  }

  onProblematic() {
    if (this.student.status === 'pending') {
      this.studentRegistrationPendingAlert();
    } else {
      const self = this;
      const fullName =
        this.utility.computeCivility(
          this.student.sex,
          this.translate.currentLang.toLowerCase()
        ) +
        ' ' +
        this.student.firstName +
        ' ' +
        this.student.lastName;
      swal({
        title: this.translate.instant(
          'STUDENT.PROBLEMATIC.SENDNOTIFICATION.TITLE'
        ),
        text: this.translate.instant(
          'STUDENT.PROBLEMATIC.SENDNOTIFICATION.TEXT',
          { FullName: fullName }
        ),
        type: 'question',
        confirmButtonClass: 'btn-danger',
        allowEscapeKey: true,
        showCancelButton: true,
        confirmButtonText: this.translate.instant(
          'STUDENT.PROBLEMATIC.SENDNOTIFICATION.BUTTON1'
        ),
        cancelButtonText: this.translate.instant(
          'STUDENT.PROBLEMATIC.SENDNOTIFICATION.BUTTON2'
        )
      }).then(
        function(isConfirm) {
          if (isConfirm) {
            const studArry = [];
            studArry.push(self.student._id);
            self.studentService
              .sendProblematicToStudent(studArry)
              .subscribe(response => {
                if (response.data) {
                  self.problematicData = response.data;
                  if (
                    response.data.problematicSentTo[0] &&
                    response.data.problematicSentTo[0].problematicId
                  ) {
                    self.student.problematicId = {
                      _id: response.data.problematicSentTo[0].problematicId
                    };
                  }
                  swal({
                    title: self.translate.instant(
                      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_TIT'
                    ),
                    text: self.translate.instant(
                      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_TEXT',
                      { FullName: fullName }
                    ),
                    type: 'success',
                    allowEscapeKey: true,
                    confirmButtonText: self.translate.instant(
                      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_BTN'
                    )
                  });
                } else {
                  swal('Oops...', 'Something went wrong!', 'error');
                }
              });
          }
        },
        function(dismiss) {
          if (dismiss === 'cancel') {
          }
        }.bind(this)
      );
    }
  }
  sendRemainderToStudent() {
    const self = this;
    const lang = self.translate.currentLang.toUpperCase();
    swal({
      title: self.translate.instant(
        'STUDENT.MESSAGE.REMINDER.CONFIRMATION_TITLE'
      ),
      html: self.translate.instant(
        'STUDENT.MESSAGE.REMINDER.CONFIRMATION_TEXT'
      ),
      type: 'question',
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: self.translate.instant(
        'JOBDESCRIPTIONFORM.S5.REMINDYES'
      ),
      cancelButtonClass: 'btn-danger',
      cancelButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S5.CANCEL')
    }).then(function(isConfirm) {
      if (isConfirm) {
        self.studentService
          .sendJobDescReminderToStudent(
            self.jobDescription.jobDescriptionId,
            lang
          )
          .subscribe(response => {
            if (response.code === 200) {
              swal({
                title: self.translate.instant(
                  'STUDENT.MESSAGE.REMINDER.SUCCESS'
                ),
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
  diableJobDescAsperStatus(event) {
    if (event !== 'sent_to_student') {
      this.enableJobDescriptionAsStatus = false;
    }
  }
  updateStudentDetails(event ?: any) {
    this.studentService
      .getStudentDetails(this.student._id)
      .subscribe(student => {
        if( student.data.result ) {
          this.student = {...student.data.result[0] };
          this.initializeFormGroup(false);
          this.updateStudent.emit({
            student: this.student,
            index: this.studentWithIndex.index
          });
        }
      });
  }

  checkEmailAlreadyExists(email) {
    if (this.student.email !== email && this.formIdentity.get('email').valid) {
      const emailObject = {
        email: email
      };

      this.service.userNewEmailCheck(emailObject).subscribe(response => {
        if (!response.isEmailAvailable) {
          swal({
            title: this.translate.instant('ERROR'),
            text: this.translate.instant('USERS.MESSAGE.USERSEMAILFAILED'),
            allowEscapeKey: true,
            type: 'error'
          });
        }
      });
    }
  }

  studentRegistrationPendingAlert() {
    swal({
      type: 'error',
      title: this.translate.instant('STUDENT.MESSAGE.STUDENT_PENDING.SORRY'),
      html: this.translate.instant('STUDENT.MESSAGE.STUDENT_PENDING.TEXT'),
      confirmButtonClass: 'btn-danger',
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('BACKEND.STUDENT.UNDERSTOOD')
    });
  }
  startLoader() {
    log.info('Loader started');
    this.loading = true;
  }
  /*
  * Stops the Loader from displaying
  */
  stopLoader() {
    log.info('Loader Stopped');
    this.loading = false;
  }

  private handleErrors(error) {
    log.error(error);
    this.stopLoader();
  }

  getTranslatedDate(date) {
    this.datepipe = new DatePipe(this.translate.currentLang);
    return this.datepipe.transform(date, 'd MMM y');
  }

  getDisplayTranscriptConfig() {
    this.configService.getConfigDetails().subscribe(
      (data) => {
        if (data.notifications) {
          this.transcriptTabConfig = data.notifications.FINAL_TRANSCRIPT;
          this.certificateDetailTabConfig =  data.menu ? data.menu.CERTIDEGREE : false;
          if (this.transcriptTabConfig) {
            this.checkForTranscriptTabDisp();
            if (this.loadTabFinalTranscript) {
              this.tabGroup.selectedIndex = this.tabGroup._tabs.length;
            }
          }
          if (this.certificateDetailTabConfig && this.loadTabFCertificateDetails ) {
              this.tabGroup.selectedIndex = this.tabGroup._tabs.length + 1;
          }
        }
      },
      (error) => {
        log.data('getConfigDetails data', error);
      }
    );
  }

  checkForTranscriptTabDisp() {
    if (this.utility.checkUserIsDirectorSalesAdmin() || this.utility.checkUserIsAdminOfCertifier()) {
      this.showTranscriptTab = true;
    } else if ( this.student.finalTranscriptId && this.student.finalTranscriptId.isValidated ) {
      this.showTranscriptTab = true;
    } else {
      this.showTranscriptTab = false;
    }
  }
  encodeURL(x) {
    return encodeURI(x);
  }

  changeParallelIntake(event) {
    if (event.checked) {
      swal({
        title: this.translate.instant('STUDENT.PARALLEL_S1.TITLE'),
        html: this.translate.instant('STUDENT.PARALLEL_S1.TEXT', { testNames: '' }),
        allowEscapeKey: true,
        type: 'warning',
        confirmButtonClass: 'btn-danger',
        confirmButtonText: this.translate.instant('STUDENT.PARALLEL_S1.I_CONFIRM'),
        showCancelButton: true,
        cancelButtonText: this.translate.instant('CANCEL')
      }).then((isconfirm) => {},
        (dismiss) => {
          this.formCourse.get('parallelIntake').setValue(false);
        });
    }
  }

  changeControlValue(control: AbstractControl, isFirstName = true) {
    control.setValue(this.utility.convertNameCasing(control.value, isFirstName));
  }

  reinitializeFormControl(controlValue = true) {
    if (!!this.formCompany.get('isActive')) {
      this.formCompany.setControl('isActive', new FormControl([controlValue]));
    } else {
      this.formCompany.addControl('isActive', new FormControl([controlValue]));
    }
  }

  reinitializeParallelControl(controlValue = true) {
    if (!!this.formCourse.get('parallelIntake')) {
      this.formCourse.setControl('parallelIntake', new FormControl([controlValue]));
    } else {
      this.formCourse.addControl('parallelIntake', new FormControl([controlValue]));
    }
  }

  openFinalCertificationTask() {
    const studentTaskDetails = null;
    this.studentService.getIssueCertiTaskOfAcadDir(this.student._id).subscribe(
      (response) => {
        if(response.data) {
          log.data('openFinalCertificationTask response.data', response.data);
        this.openDialogForStudentDetailModification(response.data);
        }
    });
  }

  openDialogForStudentDetailModification(taskDetails) {
    const studentEditDialog = this.dialog.open(StudentCertDetailEditDialogComponent, {
      disableClose: true,
      width: '650px'
    });
    studentEditDialog.componentInstance.taskDetails = taskDetails;
    studentEditDialog.afterClosed().subscribe(
      (taskDetail) => {
        if (taskDetail._id) {
          this.updateStudentDetails();
        }
    });
  }
  getTranslateCountry(name) {
    const value = this.translate.instant('COUNTRY.' + name);
    return value !== 'COUNTRY.' + name ? value : name;
  }

  getTranslateNationality(name) {
    const value = this.translate.instant('NATIONALITY.' + name);
    return value !== 'NATIONALITY.' + name ? value : name;
  }

  sortCountry(list) {
    return [..._.orderBy(list, (country) => this.getTranslateCountry(country.countryName), ['asc'])];
  }

  sortNationality(list) {
    return [..._.orderBy(list, (country) => this.getTranslateNationality(country.countryName), ['asc'])];
  }

  problemetaicDisabledCondition () {
    if (this.student.rncpTitle && this.student.rncpTitle.isMPI) {
      return false;
    } else {
      return !this.enableProblematic || !this.formCompany.controls['isActive'].value;
    }
  }
}
