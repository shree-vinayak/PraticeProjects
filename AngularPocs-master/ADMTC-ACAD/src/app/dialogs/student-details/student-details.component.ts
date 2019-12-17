
import { OldUser } from '../../models/user-old.model';
import { Component, OnInit, Input, ViewChild, NgZone, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { CustomValidators } from 'ng2-validation';
import { AddClassDialogComponent } from '../../dialogs/add-class-dialog/add-class-dialog.component';
import { AddCompanyDialogComponent } from '../../dialogs/add-company-dialog/add-company-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../models/user.model';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { UserService } from '../../services/users.service';
import { StudentsService } from '../../services/students.service';
import { Student } from '../../models/student.model';
import { Company } from '../../models/company.model';
import { TranslateService } from 'ng2-translate';
import { emailValidator, matchingPasswords } from '../../custome-validation/custom-validator';
import { AddMentorComponent } from '../../dialogs/add-mentor/add-mentor.component';
import { DatePipe } from '@angular/common';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from '../../shared/global-urls';
import { DomSanitizer } from '@angular/platform-browser';
import { ScholarSeasonService } from '../../services/scholar-season.service';
import { CompanyService } from '../../services/company.service';
import { ApplicationUrls } from '../../shared/settings/application-urls';


declare var swal: any;
@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
  providers: [UserService, StudentsService, DatePipe],

})

export class StudentDetailsComponent implements OnInit {
  //rncpTitleID: any;
  form: FormGroup;
  formCourse: FormGroup;
  formIdentity: FormGroup;
  formParents: FormArray;
  formCompany: FormGroup;
  public modify: boolean;
  selectedSchoolRNCPTitle: boolean = false;
  nonAcademic: boolean = true;
  student: Student;
  selectedCompany: any;
  preparationCenter1: any = [];
  userid: string;
  user: OldUser;
  RNCPTitles: any = [];
  companylist = [];
  currentLoginUser: any = '';
  studentInformation: any = [];
  maxDate: any;
  private subscription: Subscription;
  customerId: any;
  selectedIndex = 0;
  formCourseSubmit = false;
  formIdentitySubmit = false;
  formParentsSubmit = false;
  formCompanySubmit = false;
  serverimgPath = ApplicationUrls.baseApi;
  sexType: any = [
    { value: 'Male', view: 'STUDENT_INFORMATION.GENDER.MALE' },
    { value: 'Female', view: 'STUDENT_INFORMATION.GENDER.FEMALE' }
  ];
  public relations: any = [{ value: 'mother', viewValue: 'Mother' },
  { value: 'father', viewValue: 'Father' },
  { value: 'guardian', viewValue: 'Guardian' },
  { value: 'brother', viewValue: 'brother' },
  { value: 'sister', viewValue: 'sister' }
  ];

  classType: any = [];

  configCat: MdDialogConfig = {
    disableClose: false,
    width: '900px'
  };
  // ADMTC staff dialog property
  configUser: MdDialogConfig = {
    disableClose: false,
    width: '450px',
    height: '50%'
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


  addCompanyDialog: MdDialogRef<AddCompanyDialogComponent>;

  @Inject(MD_DIALOG_DATA) public data: any;
  userList = [];

  studentId;
  ActivityText;

  countryList: any[] = [

    { id: '1', countryName: 'France' },
    { id: '2', countryName: 'Afghanistan' },
    { id: '3', countryName: 'South Africa' },
    { id: '4', countryName: 'Albanie' },
    { id: '5', countryName: 'Algeria' },
    { id: '6', countryName: 'Germany' },
    { id: '7', countryName: 'Angola' },
    { id: '8', countryName: 'Anguilla' },
    { id: '9', countryName: 'Antarctique' },
    { id: '10', countryName: 'Antigua and Barbuda' },
    { id: '11', countryName: 'Netherlands Antilles' },
    { id: '12', countryName: 'Saudi Arabia' },
    { id: '13', countryName: 'Argentina' },
    { id: '14', countryName: 'Armenia' },
    { id: '15', countryName: 'Aruba' },
    { id: '16', countryName: 'Australia' },
    { id: '17', countryName: 'Austria' },
    { id: '18', countryName: 'Azerbaijan' },
    { id: '19', countryName: 'bahamas' },
    { id: '20', countryName: 'Bahrain' },
    { id: '21', countryName: 'Bangladesh' },
    { id: '22', countryName: 'Barbados' },
    { id: '23', countryName: 'Belarus' },
    { id: '24', countryName: 'Belgium ' },
    { id: '25', countryName: 'Belize' },
    { id: '26', countryName: 'Benin' },
    { id: '27', countryName: 'Bermuda' },
    { id: '28', countryName: 'Bhutan' },
    { id: '29', countryName: 'Bolivia ' },
    { id: '30', countryName: 'Bosnia and Herzegovina' },
    { id: '31', countryName: 'Botswana' },
    { id: '32', countryName: 'Brazil' },
    { id: '33', countryName: 'Brunei Darussalam ' },
    { id: '34', countryName: 'Bulgaria' },
    { id: '35', countryName: 'Burkina Faso' },
    { id: '36', countryName: 'Cambodia ' },
    { id: '37', countryName: 'Cape Verde  ' },
    { id: '38', countryName: 'Chile' },
    { id: '39', countryName: 'China ' },
    { id: '40', countryName: 'Cyprus ' },
    { id: '41', countryName: 'Colombia' },
    { id: '42', countryName: 'Costa Rica' },
    { id: '43', countryName: 'Ivory Coast' },
    { id: '44', countryName: 'Croatia' },
    { id: '45', countryName: 'Cuba' },
    { id: '46', countryName: 'Denmark ' },
    { id: '47', countryName: 'Djibouti ' },
    { id: '48', countryName: 'Dominique' },
    { id: '49', countryName: 'Egypt' },
    { id: '50', countryName: 'El Salvador' },
    { id: '51', countryName: 'United Arab Emirates' },
    { id: '52', countryName: 'Ecuador ' },
    { id: '53', countryName: 'Eritrea ' },
    { id: '54', countryName: 'Spain' },
    { id: '55', countryName: 'Estonia ' },
    { id: '56', countryName: 'Federated States of Micronesia' },
    { id: '57', countryName: 'United States ' },
    { id: '58', countryName: 'Ethiopia' },
    { id: '59', countryName: 'Russian Federation ' },
    { id: '60', countryName: 'Fiji' },
    { id: '61', countryName: 'Finland ' },
    { id: '62', countryName: 'Gabon' },
    { id: '63', countryName: 'Gambia' },
    { id: '64', countryName: 'Georgia' },
    { id: '65', countryName: 'Ghana' },
    { id: '66', countryName: 'Gibraltar' },
    { id: '67', countryName: 'Greece' },
    { id: '68', countryName: 'Granada' },
    { id: '69', countryName: 'Greenland' },
    { id: '70', countryName: 'Guadeloupe' },
    { id: '71', countryName: 'Guam ' },
    { id: '72', countryName: 'Guatemala ' },
    { id: '73', countryName: 'Guinea ' },
    { id: '74', countryName: 'Guinea-Bissau' },
    { id: '75', countryName: 'Equatorial Guinea' },
    { id: '76', countryName: 'Guyana' },
    { id: '77', countryName: 'French Guiana' },
    { id: '78', countryName: 'Haiti' },
    { id: '79', countryName: 'Honduras' },
    { id: '80', countryName: 'Hong Kong' },
    { id: '82', countryName: 'Hungary' },
    { id: '83', countryName: 'Bouvet Island ' },
    { id: '84', countryName: 'Christmas Island' },
    { id: '85', countryName: 'Isle of Man' },
    { id: '86', countryName: 'Norfolk Island' },
    { id: '87', countryName: 'Islands (malvinas) Falkland' },
    { id: '88', countryName: '�land Islands' },
    { id: '89', countryName: 'Cocos (Keeling) Islands ' },
    { id: '90', countryName: 'Cook Islands' },
    { id: '91', countryName: 'Faroe Islands' },
    { id: '92', countryName: 'Solomon Islands' },
    { id: '93', countryName: 'Turks and Caicos Islands' },
    { id: '94', countryName: 'British Virgin Islands' },
    { id: '95', countryName: 'United States Virgin Islands' },
    { id: '96', countryName: 'India' },
    { id: '97', countryName: 'Indonesia ' },
    { id: '98', countryName: 'Iraq ' },
    { id: '99', countryName: 'Ireland' },
    { id: '100', countryName: 'Iceland' },
    { id: '101', countryName: 'Israel' },
    { id: '102', countryName: 'Italy' },
    { id: '103', countryName: 'Libyan Arab Jamahiriya' },
    { id: '104', countryName: 'Jamaica' },
    { id: '105', countryName: 'Japan' },
    { id: '106', countryName: 'Jordan' },
    { id: '107', countryName: 'Kazakhstan' },
    { id: '108', countryName: 'Kenya' },
    { id: '109', countryName: 'Kyrgyzstan' },
    { id: '110', countryName: 'Kiribati' },
    { id: '111', countryName: 'Kuwait ' },
    { id: '112', countryName: 'Lesotho' },
    { id: '113', countryName: 'Latvia' },
    { id: '114', countryName: 'Lebanon' },
    { id: '115', countryName: 'Liberia' },
    { id: '116', countryName: 'Liechtenstein' },
    { id: '117', countryName: 'Lithuania' },
    { id: '118', countryName: 'Luxembourg' },
    { id: '119', countryName: 'Macau' },
    { id: '120', countryName: 'Macau' },
    { id: '121', countryName: 'Malaysia' },
    { id: '122', countryName: 'Malawi' },
    { id: '123', countryName: 'Maldives' },
    { id: '124', countryName: 'Mali' },
    { id: '125', countryName: 'Malta' },
    { id: '126', countryName: 'Morocco' },
    { id: '127', countryName: 'Martinique' },
    { id: '128', countryName: 'Mauritius' },
    { id: '129', countryName: 'Mauritania' },
    { id: '130', countryName: 'Mayotte' },
    { id: '131', countryName: 'Mexico' },
    { id: '132', countryName: 'Monaco' },
    { id: '133', countryName: 'Mongolia' },
    { id: '134', countryName: 'Montserrat' },
    { id: '135', countryName: 'Mozambique' },
    { id: '136', countryName: 'Myanmar' },
    { id: '137', countryName: 'Namibia' },
    { id: '138', countryName: 'Nauru' },
    { id: '139', countryName: 'Nepal' },
    { id: '140', countryName: 'Nicaragua' },
    { id: '141', countryName: 'Niger' },
    { id: '142', countryName: 'Nigeria' },
    { id: '143', countryName: 'Niue' },
    { id: '144', countryName: 'Norway' },
    { id: '145', countryName: 'New Caledonia' },
    { id: '146', countryName: 'New Zealand' },
    { id: '147', countryName: 'Oman' },
    { id: '148', countryName: 'Uganda' },
    { id: '149', countryName: 'Uzbekistan' },
    { id: '150', countryName: 'Pakistan ' },
    { id: '151', countryName: 'Palau' },
    { id: '152', countryName: 'Panama' },
    { id: '153', countryName: 'Papua New Guinea' },
    { id: '154', countryName: 'Netherlands' },
    { id: '155', countryName: 'Peru' },
    { id: '156', countryName: 'Philippines' },
    { id: '157', countryName: 'Pitcairn ' },
    { id: '158', countryName: 'Poland ' },
    { id: '159', countryName: 'French Polynesia' },
    { id: '160', countryName: 'Puerto Rico' },
    { id: '161', countryName: 'Portugal' },
    { id: '162', countryName: 'Qatar' },
    { id: '163', countryName: 'Syrian Arab Republic' },
    { id: '164', countryName: 'Central African Republic' },
    { id: '165', countryName: 'Republic of Korea' },
    { id: '166', countryName: 'Republic of Moldova' },
    { id: '167', countryName: 'Democratic Republic of Congo' },
    { id: '168', countryName: 'Lao Peoples Democratic Republic' },
    { id: '169', countryName: 'Dominican Republic' },
    { id: '170', countryName: 'Islamic Republic of Iran' },
    { id: '171', countryName: 'Democratic Peoples Republic of Korea' },
    { id: '172', countryName: 'Czech Republic' },
    { id: '173', countryName: 'United Republic of Tanzania' },
    { id: '174', countryName: 'Meeting' },
    { id: '175', countryName: 'United Kingdom' },
    { id: '176', countryName: 'Rwanda' },
    { id: '177', countryName: 'Western Sahara' },
    { id: '178', countryName: 'Saint Kitts and Nevis' },
    { id: '179', countryName: 'San Marino' },
    { id: '180', countryName: 'Holy See (state of Vatican City)' },
    { id: '181', countryName: 'Saint Vincent and the Grenadines' },
    { id: '182', countryName: 'Sainte-H�l�ne' },
    { id: '183', countryName: 'Saint Lucia' },
    { id: '184', countryName: 'Samoa' },
    { id: '185', countryName: 'American Samoa' },
    { id: '186', countryName: 'Sao Tome and Principe' },
    { id: '187', countryName: 'Senegal ' },
    { id: '188', countryName: 'Serbia and Montenegro' },
    { id: '189', countryName: 'Seychelles' },
    { id: '190', countryName: 'Sierra Leone' },
    { id: '191', countryName: 'Singapore' },
    { id: '192', countryName: 'Slovakia' },
    { id: '193', countryName: 'Slovenia' },
    { id: '194', countryName: 'Somalia' },
    { id: '195', countryName: 'Sudan' },
    { id: '196', countryName: 'Sri Lanka' },
    { id: '197', countryName: 'Sweden' },
    { id: '198', countryName: 'Suriname' },
    { id: '199', countryName: 'Swaziland' },
    { id: '200', countryName: 'Tajikistan' },
    { id: '201', countryName: 'Taiwan' },
    { id: '202', countryName: 'Chad' },
    { id: '203', countryName: 'Palestinian Territory Occupied' },
    { id: '204', countryName: 'Thailand' },
    { id: '205', countryName: 'Timor-Leste' },
    { id: '206', countryName: 'Togo' },
    { id: '207', countryName: 'Tokelau' },
    { id: '208', countryName: 'Tonga' },
    { id: '209', countryName: 'Trinidad and Tobago' },
    { id: '210', countryName: 'Tunisia' },
    { id: '211', countryName: 'Turkmenistan' },
    { id: '212', countryName: 'Turkey' },
    { id: '213', countryName: 'Tuvalu' },
    { id: '214', countryName: 'Ukraine' },
    { id: '215', countryName: 'Uruguay' },
    { id: '216', countryName: 'Vanuatu' },
    { id: '217', countryName: 'Venezuela' },
    { id: '218', countryName: 'Viet Nam' },
    { id: '219', countryName: 'Wallis and Futuna' },
    { id: '220', countryName: 'Yemen' },
    { id: '221', countryName: 'Zambia ' },
    { id: '222', countryName: 'Zimbabwe' }
  ];


  public guardianNumber: number = 0;

  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });
  public filePreviewPath: any = '';
  @ViewChild('userphoto') uploadInput: any;
  public scholerSeasonData = [];
  public RNCPfilterTitles = [];

  constructor(
    private scholarservice: ScholarSeasonService,
    private route: ActivatedRoute,
    private zone: NgZone,
    private dialog: MdDialog,
    private fb: FormBuilder,
    private appService: RNCPTitlesService,
    private studentService: StudentsService,
    private service: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    public datepipe: DatePipe,
    public dialogRef: MdDialogRef<StudentDetailsComponent>,
    public sanitizer: DomSanitizer, private companyService: CompanyService) {
    this.maxDate = new Date();
  //

  }

  ngOnInit() {

    this.getCompany();
    this.subscription = this.route.params.subscribe(
      params => {
        if (params.hasOwnProperty('customerId')) {
          this.customerId = params['customerId'];

        } else {

        }
      });

    this.scholarservice.getAssociatedscholerSeason(this.customerId)
      .subscribe(
      (data: any) => {
        console.log(data);
        this.scholerSeasonData = [];
        for (const d of data) {
          if (d.scholarseason) {
            this.scholerSeasonData.push(d);
            console.log(this.scholerSeasonData);
          }
        }
        console.log('data', this.scholerSeasonData);
        if (this.scholerSeasonData !== null) {
          for (const season of this.scholerSeasonData) {
            if (season._id === this.student.scholarSeason._id) {
              console.log(season);
              for (const title of season.rncptitles) {
                if (title.id === this.student.rncpTitle['_id']) {
                  this.student.rncpTitle = title;
                  this.formCourse.value.rncpTitle = this.student.rncpTitle['_id'];
                }
              }
              console.log(this.formCourse.value.rncpTitle);
            }
          }
          if (this.student.rncpTitle !== null) {
            this.selectScholerSeason(this.student.scholarSeason._id);
          }
        }
      },
      (error: Response) => console.log(error)
      );

    this.currentLoginUser = this.service.getRole();

    this.service.getAllRNCPTitles().subscribe((response) => {
      this.RNCPTitles = response.data;
    });

    this.service.getAllPreparationCenter().subscribe((response) => {
      this.preparationCenter1 = response.data;
    });

    const user = JSON.parse(localStorage.getItem('loginuser'));
    if (user.entity.type === 'academic') {
      this.nonAcademic = false;
    }

    this.initializeFormGroup();

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.uploader.queue[0].upload();
      this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
    };

    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log(item, response, status, headers);
      swal({
        title: 'Attention',
        text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey:true,
        type: 'warning'
      });
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      if (res.status === 'OK') {
        console.log('res.data.filepath', res.data.filepath);
        this.formIdentity.controls['photo'].setValue(res.data.filepath);
      } else {
        console.log(item, response, status, headers);
        swal({
          title: 'Attention',
          text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
          allowEscapeKey:true,
          type: 'warning'
        });
      }
    };

  }

  initializeFormGroup() {

    this.changeRNCPTitles({ value: this.student.rncpTitle ? this.student.rncpTitle['_id'] : '' });
    console.log(this.student.rncpTitle['_id']);
    this.formCourse = this.fb.group({
      scholerSeason: [this.student['scholarSeason'] ? this.student['scholarSeason']._id : '', Validators.required],
      rncpTitle: [this.student.rncpTitle ? this.student.rncpTitle['_id'] : '', Validators.required],
      currentClass: [this.student.currentClass ? this.student.currentClass['_id'] : '', Validators.required],
      previousClasses: [[]]
    });

    this.formIdentity = this.fb.group({
      sex: [this.student.sex ? this.student.sex : '', Validators.required],
      firstName: [this.student.firstName ? this.student.firstName : '', [Validators.required, Validators.maxLength(40)]],
      lastName: [this.student.lastName ? this.student.lastName : '', [Validators.required, Validators.maxLength(40)]],
      telePhone: [this.student.telePhone ? this.student.telePhone : '', Validators.required],
      dateOfBirth: [this.student.dateOfBirth ? this.student.dateOfBirth : '', [Validators.required, Validators.maxLength(10)]],
      placeOfBirth: [this.student.placeOfBirth ? this.student.placeOfBirth : ''],
      //      country: [this.student.country ? this.student.country : '1', [Validators.required, Validators.maxLength(40)]],
      nationality: [this.student.nationality ? this.student.nationality : '1', [Validators.required, Validators.maxLength(40)]],
      photo: [this.student.photo ? this.student.photo : ''],
      address: this.fb.group({
        'line1': [this.student.address ? this.student.address.line1 : ""],
        'line2': [this.student.address ? this.student.address.line2 : ""],
        'postalCode': [this.student.address ? this.student.address.postalCode : ""],
        'city': [this.student.address ? this.student.address.city : ""],
        'country': [this.student.address ? this.student.address.country : '1']
      }),
      email: [this.student.email ? this.student.email : '', [Validators.required, Validators.email]],
    });
    this.formParents = this.fb.array([]);
    this.formCompany = this.fb.group({
      'companies': [this.student.companies[0].company ? this.getStuCompany(this.student.companies[0].company) : [], Validators.required],
      'mentors': [this.student.companies[0].mentors ? this.student.companies[0].mentors : '', Validators.required]
    });

    if (this.student.parents.length) {
      for (let i = 0; i < this.student.parents.length; i++) {
        this.guardianNumber = i;
        this.addGuardian(this.guardianNumber);
      }

    } else {
      this.addGuardian(this.guardianNumber);
    }


  }

  getAllClass() {
    this.service.getAllClass().subscribe((response) => {
      this.classType = response.data;
    });
  }

  getStuCompany(stuCompany) {
    if (stuCompany) {
      for (const comp of stuCompany) {
        for (const s of this.companylist) {
          if (s._id === comp._id) {
            if (this.formCompany.controls['companies']) {
              this.formCompany.controls['companies'].setValue(s);
            }
          }
        }
      }
    }
  }

  getMentorList(companyId) {
    this.service.getMentorsForCompany(companyId).subscribe((response) => {
      console.log('mentorlist');
      console.log(response);
      // this.userList = null;
      this.userList = response;
    });
  }


  getRandomNumberForStudentRef() {
    return 'RNCP' + Math.floor(100000 + Math.random() * 900000);
  }


  addCourse(value: any): void {
    this.formCourseSubmit = true;
    if (this.formCourse.valid) {
      console.log('Form Validated Course move to next');
      this.selectedIndex = 1;
    }
  }
  addIdentity(value: any): void {
    this.formIdentitySubmit = true;
    if (this.formIdentity.valid) {
      console.log('Form Validated Identity move to next');
      this.selectedIndex = 2;
    }
  }
  addParents(value: any): void {
    console.log('addParents');
    console.log(this.formParents);
    this.formParentsSubmit = true;
    if (this.formParents.valid) {
      console.log('Form Validated Parents move to next');
      this.selectedIndex = 3;
    }
  }
  addCompany(value: any): void {
    this.formCompanySubmit = true;
    if (this.formCompany.valid) {
      console.log('Form Validated addCompany move to next');
      this.selectedIndex = 3;

      const courseValues = this.formCourse.value;
      const IdentityValues = this.formIdentity.value;
      IdentityValues.address.postalCode = IdentityValues.address.postalCode.toString();
      const ParentsValues = { parents: [this.formParents.value] };
      const CompanyValues = this.formCompany.value;
      const merged = { ...courseValues, ...IdentityValues, ...ParentsValues, ...CompanyValues }
      merged.parents = [];
      console.log(typeof this.formParents.value);
      console.log(this.formParents.value.length);
      this.formParents.value.forEach(element => {
        merged.parents.push(element);
      });
      // merged.parents = this.formParents.value;
      merged.companies = [];
      merged.companies.push(CompanyValues.companies);
      merged.school = this.customerId;


      this.studentInformation = merged;
      this.addUserFunction(merged);
      console.log(this.studentInformation);

    }
  }

  sameAddressChange(event) {
    console.log(event);
    if (event.checked) {
      const formIdentityValue = this.formIdentity.value;
      this.formParents['controls'].forEach(element => {
        element['controls'].address['controls'].city.setValue(formIdentityValue.address.city);
        element['controls'].address['controls'].country.setValue(formIdentityValue.address.country);
        element['controls'].address['controls'].line1.setValue(formIdentityValue.address.line1);
        element['controls'].address['controls'].line2.setValue(formIdentityValue.address.line2);
        element['controls'].address['controls'].postalCode.setValue(formIdentityValue.address.postalCode);
      });
    } else {
      this.formParents['controls'].forEach(element => {
        element['controls'].address['controls'].city.setValue('');
        element['controls'].address['controls'].country.setValue('1');
        element['controls'].address['controls'].line1.setValue('');
        element['controls'].address['controls'].line2.setValue('');
        element['controls'].address['controls'].postalCode.setValue('');
      });
    }
  }
  addNewCompany() {
    this.addCompanyDialog = this.dialog.open(AddCompanyDialogComponent, this.configCat);
    this.addCompanyDialog.afterClosed().subscribe((companyValues) => {
      if (companyValues !== undefined) {
        this.companylist = this.companyService.addCompany(companyValues);
      }
      this.getCompany();
    });
  }

  addUser(value: any): void {

    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });


    if (this.form.valid) {
      this.addUserFunction(value);
    }
  }

  addUserFunction(value: any) {
    console.log('student', value);

    this.studentService.updateStudent(this.studentId, value).subscribe(d => {
      if (d) {
        swal({
          title: 'Success',
          html: this.translate.instant('STUDENT.UPDATESUCCESS'),
          type: 'success',
          confirmButtonClass: 'btn-danger',
          allowEscapeKey:true,
          confirmButtonText: this.translate.instant('SUGGESTION.OK'),
          closeOnConfirm: false,
        }).then(function (isConfirm) {

        }.bind(this));
        this.dialogRef.close(true);
      } else {
        swal({
          title: 'Attention',
          text: this.translate.instant('STUDENT.FAILEDMESSAGE'),
          allowEscapeKey:true,
          type: 'warning'
        });
      }
    });



  }



  cancel() {
    this.dialogRef.close(false);
  }


  changeRNCPTitles(e) {
    const school_id = this.customerId;
    const rncp_title_id = e.value;

    console.log('form', this.form);

    // Production
    this.studentService.getAllClassesRNCPTitle(rncp_title_id).subscribe((response) => {
      this.selectedSchoolRNCPTitle = true;
      this.classType = response.data;
    });

  }

  onLinkClick(event) {
    console.log(event.index);
  }

  initGuardianAddress(i) {
    return this.fb.group({
      'relation': [this.student.parents[i] ? this.student.parents[i].relation : '', Validators.required],
      'sex': [this.student.parents[i] ? this.student.parents[i].sex : '', Validators.required],
      'familyName': [this.student.parents[i] ? this.student.parents[i].familyName : '', Validators.required],
      'name': [this.student.parents[i] ? this.student.parents[i].name : '', Validators.required],
      'sameAddress': [''],
      'email': [this.student.parents[i] ? this.student.parents[i].email : ''],
      'telePhone': [this.student.parents[i] ? this.student.parents[i].telePhone : ''],
      address: this.fb.group({
        'line1': [this.student.parents[i] ? this.student.parents[i].address.line1 : ''],
        'line2': [this.student.parents[i] ? this.student.parents[i].address.line2 : ''],
        'postalCode': [this.student.parents[i] ? this.student.parents[i].address.postalCode : ''],
        'city': [this.student.parents[i] ? this.student.parents[i].address.city : ''],
        'country': [this.student.parents[i] ? this.student.parents[i].address.country : '1']
      }),
    });
  }

  addGuardian(i: number) {
    const control = this.formParents;
    this.guardianNumber = this.guardianNumber + 1;
    const addrCtrl = this.initGuardianAddress(i);
    control.push(addrCtrl);
    console.log(control);
  }

  removeGuardian(i: number) {
    this.guardianNumber = this.guardianNumber - 1;
    const control = this.formParents;
    control.removeAt(i);
  }
  changeCompanySelect(event) {
    this.ActivityText = event.value.activity;
    const companyId = event.value._id;

    console.log(companyId);
    // this.getMentorList(companyId);
    this.service.getMentorsForCompany(companyId).subscribe((response) => {
      console.log('mentorlist');
      console.log(response);
      // this.userList = null;
      this.userList = response;
    });
  }





  addNewMentor() {
    this.service.loginUser = 1;
    this.addMentorComponent = this.dialog.open(AddMentorComponent, this.configUser);
    this.addMentorComponent.componentInstance.customerId = this.customerId;
    this.addMentorComponent.componentInstance.selectedCompany = this.formCompany.get('companies').value.companyName;
    console.log(this.addMentorComponent.componentInstance.selectedCompany);
    this.addMentorComponent.afterClosed().subscribe((value) => {
      //// Added
      //this.getMentorList();
    });

  }
  handleKeyboardEvents(event: KeyboardEvent) {
    // if (event.keyCode == 27)
    // {

    // }
    // console.log(event.which || event.keyCode);
  }

  minDate() {
    const now = new Date();
    return new Date(
      now.getFullYear() - 2,
      now.getMonth(),
      now.getDate()
    );
  }

  selectScholerSeason(id) {
    this.RNCPfilterTitles = [];
    console.log(this.scholerSeasonData);
    for (const scholarseasondata of this.scholerSeasonData) {
      if (scholarseasondata._id === id) {
        this.RNCPfilterTitles = scholarseasondata.rncptitles;
      }
    }
    console.log(this.RNCPfilterTitles);
  }

  getCompany() {
    this.companyService.getCompanies().subscribe((response) => {
      this.companylist = response.data;
      if (this.companylist) {
        this.getStuCompany(this.student.companies);
      }
    });
  }

}
