import { UtilityService } from 'app/services/utility.service';
import { OldUser } from './../../../../../models/user-old.model';
import { Component, OnInit, Input, ViewChild, NgZone, Inject, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef, MD_DIALOG_DATA, DateAdapter } from '@angular/material';
import { CustomValidators } from 'ng2-validation';
import { AddClassDialogComponent } from '../../../../../dialogs/add-class-dialog/add-class-dialog.component';
import { AddCompanyDialogComponent } from '../../../../../dialogs/add-company-dialog/add-company-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../../../../models/user.model';
import { RNCPTitlesService } from '../../../../../services/rncp-titles.service';
import { UserService } from '../../../../../services/users.service';
import { CompanyService } from '../../../../../services/company.service';
import { StudentsService } from '../../../../../services/students.service';
import { Student } from '../../../../../models/student.model';
import { Company } from '../../../../../models/company.model';
import { TranslateService } from 'ng2-translate';
import { emailValidator, matchingPasswords } from '../../../../../custome-validation/custom-validator';
import { AddMentorComponent } from '../../../../../dialogs/add-mentor/add-mentor.component';
import { ScholarSeasonService } from '../../../../../services/scholar-season.service';
import { element } from 'protractor';
import { Response } from '@angular/http';
import { NewStudentUser } from '../../../../../models/studentUser.model';
import { LoginService } from '../../../../../services/login.service';
import { CountryData } from '../../../../student/country';
import { StudentConstants } from '../../../../student/student-constants';
import { CustomerService } from '../../../customer.service';
import _ from "lodash";
import * as moment from 'moment';

// required for logging
import { Log } from 'ng2-logger';
const log = Log.create('CreateStudentComponent');
log.color = 'blue';

declare var swal: any;
@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss'],
})

export class CreateStudentComponent implements OnInit {
  @ViewChild('line1') el: ElementRef;
  // rncpTitleID: any;
  mdDate='';
  form: FormGroup;
  formCourse: FormGroup;
  formIdentity: FormGroup;
  formParents: FormArray;
  formCompany: FormGroup;
  public modify: boolean;
  selectedCompany: any;
  selectedSchoolRNCPTitle = false;
  nonAcademic = true;
  student: Student;
  preparationCenter1: any = [];
  userid: string;
  user: OldUser;
  RNCPTitles: any = [];
  companylist: Company[] = [];
  allCompanylist = [];
  companySearchString: string = '';
  studentInformation: any = [];
  maxDate: any;
  private subscription: Subscription;
  customerId: any;
  selectedIndex = 0;
  formCourseSubmit = false;
  formIdentitySubmit = false;
  formParentsSubmit = false;
  formCompanySubmit = false;
  ActivityText;
  emailCheck: string = '';
  newStudentUser = new NewStudentUser();
  currentUser: any;
  selectedIndexForStudentsTab: Number = 0;
  public companyDetail;
  formSubmit;

  sexType: Array<object> = StudentConstants.sexType;
  relations: Array<object> = StudentConstants.studentRelations;
  classType: any = [];
  selectedMentor:any;
  configCat: MdDialogConfig = {
    disableClose: false,
    width: '900px'
  };
  // ADMTC staff dialog property
  configUser: MdDialogConfig = {
    disableClose: false,
    width: '500px',
    height: '510px',
    data: undefined
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
  private dialogPC: MdDialogRef<CreateStudentComponent>;
  @Inject(MD_DIALOG_DATA) public data: any;
  userList = [];

  countryList: any[] =  CountryData.CountryList;
  nationalitiesList = CountryData.nationalitiesList;
  sortedCountryList = [];
  sortedNationalitiesList = [];
  schoolSpecialization: any[] = [];
  selectedRNCPTitle = null;


  public guardianNumber = 0;
  public scholarSeasonData = [];
  public RNCPfilterTitles = [];
  specializations = [];
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
    private companyService: CompanyService,
    private customerService: CustomerService,
    private _login: LoginService,
    private utilityService: UtilityService) {
    this.maxDate = new Date();
  }


  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      params => {
        if (params.hasOwnProperty('selectedIndexForStudentsTab')) {
         this.selectedIndexForStudentsTab = params['selectedIndexForStudentsTab'];
          console.log("selectedIndexForStudentsTab", this.selectedIndexForStudentsTab)
        }
        if (params.hasOwnProperty('customerId')) {
          this.customerId = params['customerId'];
          this.getSchoolSpecializations(this.customerId);
        } else {

        }
      });

      this.scholarservice.getAssociatedscholerSeason(this.customerId)
        .subscribe(
        (data: any) => {
          console.log(data);
          this.scholarSeasonData = [];
          for (const element of data) {
            if (element.scholarseason) {
              this.scholarSeasonData.push(element);
            }
          }
          console.log('data', this.scholarSeasonData);
        },
        (error: Response) => console.log(error)
        );

    this.getCompany();

    this.currentUser = this._login.getLoggedInUser();
    if (this.currentUser.entity.type === 'academic') {
      this.nonAcademic = false;
    }
    this.initializeFormGroup();

    log.data('ngOnInit customerService.currentSchool) ', this.customerService.currentSchool);

    this.sortedCountryList = this.sortCountry(this.countryList);
    this.sortedNationalitiesList = this.sortNationality(this.nationalitiesList);
    this.translate.onLangChange.subscribe(() => {
      this.sortedCountryList = this.sortCountry(this.countryList);
      this.sortedNationalitiesList = this.sortNationality(this.nationalitiesList);
    });
  }

  initializeFormGroup() {


    this.formCourse = this.fb.group({
      scholarSeason: ['', Validators.required],
      rncpTitle: [this.modify ? this.student.rncpTitle : '', Validators.required],
      currentClass: [this.modify ? this.student.currentClass : '', Validators.required],
      previousClasses: [[]],
      parallelIntake: [this.modify && this.student.parallelIntake ? this.student.parallelIntake  : false],
      specializations: [this.modify && this.student.specializations ? this.student.specializations  : '']
    });
    // const birthDate = new Date(this.student.dateOfBirth);
    // const bd = birthDate.getDate() + '-' + (birthDate.getMonth() + 1) + '-' + birthDate.getFullYear();
    this.formIdentity = this.fb.group({
      sex: [this.modify ? this.student.sex : '', Validators.required],
      firstName: [this.modify ? this.student.firstName : '', [Validators.required, Validators.maxLength(40)]],
      lastName: [this.modify ? this.student.lastName : '', [Validators.required, Validators.maxLength(40)]],
      dateOfBirth: ['', [Validators.required]],
      placeOfBirth: [this.modify ? this.student.placeOfBirth : '', Validators.required],
//      country: [this.modify ? this.student.nationality : '1', [Validators.required, Validators.maxLength(40)]],
      telePhone: [this.modify ? this.student.telePhone : '', Validators.compose([Validators.required, Validators.maxLength(10)])],
      nationality: [this.modify ? this.student.nationality : '1', [Validators.required, Validators.maxLength(40)]],
      address: this.fb.group({
        'line1': [this.modify ? this.student.address.line1 : '', [ Validators.required ]],
        'line2': [this.modify ? this.student.address.line2 : ''],
        // tslint:disable-next-line:max-line-length
        'postalCode': [this.modify ? this.student.address.postalCode : '', [Validators.required,Validators.maxLength(9)]],
        'city': [this.modify ? this.student.address.city : '', Validators.required],
        'country': [this.modify ? this.student.address.country : '1']
      }),
      // tslint:disable-next-line:max-line-length Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
      email: [this.modify ? this.student.email : '', Validators.compose([Validators.required, Validators.email])],
    });
    this.formParents = this.fb.array([]);
    console.log('form parent arrays',this.formParents);
    this.formCompany = this.fb.group({
      'companies': [''],
      'mentors': ['']
    });
    console.log("@@@@",this.guardianNumber);
    this.addGuardian(this.guardianNumber);
  }

  getcompanyName(companyName) {
      this.configUser.data = companyName;
  }

  getMentorList(companyId) {
    this.service.getMentorsForCompany(companyId).subscribe((response) => {
      console.log('mentorlist');
      console.log(response);
      // this.userList = null;
      this.userList = response;
    });
  }

  saveUserDetails() {
    this.formIdentitySubmit = true;
    if( this.formCourse.valid && this.formIdentity.valid) {
      this.addCompany();
    }
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
    //this.selectedIndex = 1;
    if (this.formIdentity.valid) {
       console.log('Form Validated Identity move to next',this.selectedIndex );
      this.selectedIndex = 2;
      log.info(" Student Details this.formIdentity.valid : ", this.selectedIndex  );
    }
  }
  addParents(value: any): void {
    console.log('addParents');
    console.log(this.formParents);
    this.formParentsSubmit = true;
      console.log('Form Validated Parents move to next');
      this.selectedIndex = 3;

      log.info(" Student Details this.formParents.valid : ", this.selectedIndex  );

  }
  addCompany(): void {
    this.formCompanySubmit = true;
    if (this.formCompany.valid) {
      console.log('Form Validated addCompany move to next');
      // this.selectedIndex = 3;

      const courseValues = this.formCourse.value;
      const IdentityValues = this.formIdentity.value;
      IdentityValues.address.postalCode = IdentityValues.address.postalCode.toString();
      const ParentsValues = { parents: [this.formParents.value] };
      log.info('ParentsValues',ParentsValues.parents)
      ParentsValues.parents[0].forEach((postal,i) => {
        log.info('ParentsValues Postal',postal.address.postalCode,postal.address.postalCode.toString());
        ParentsValues.parents[0][i].address.postalCode =  postal.address.postalCode.toString();
      });
      log.info('ParentsValues',ParentsValues.parents);
      const CompanyValues = this.formCompany.value;
      const merged = { ...courseValues, ...IdentityValues, ...ParentsValues, ...CompanyValues };
      merged.parents = [];
      this.formParents.value.forEach(element => {
        merged.parents.push(element);
      });
      merged.companies = [];
      if(CompanyValues.companies){
          if(CompanyValues.mentors){
              merged.companies.push({
                company: CompanyValues.companies._id,
                mentors: CompanyValues.mentors,
                startDate: new Date(),
                isActive: true
              });
          } else {
            merged.companies.push({
              company: CompanyValues.companies._id,
              startDate: new Date(),
              isActive: true
          })
         }
      }
    const parents = merged.parents;
    parents.forEach((element,i) => {
      if(element.name === "" ){
        log.data('Inside Splice Parents');
        // merged.parents.removeAt(i);
        merged.parents.splice(i, 1);
      }
    });

      merged.school = this.customerId;
      if(merged.dateOfBirth.length === 10 ){
        log.data('moment(merged.dateOfBirth,"YYYY-MM-DD").format("DD-MM-YYYY")', moment(merged.dateOfBirth,"DD-MM-YYYY").format("MM-DD-YYYY"));
        merged.dateOfBirth = moment(merged.dateOfBirth,"DD-MM-YYYY").format("MM-DD-YYYY");
      }
      this.studentInformation = merged;
      delete merged.mentors;
      merged.lang = this.translate.currentLang.toUpperCase();
      log.info('Merged', merged)
      this.addUserFunction(merged);
      console.log(this.studentInformation);
    }
  }

  sameAddressChange(event, index) {
    log.info(event, index);
    if (event.checked) {

      const formIdentityValue = this.formIdentity.value;
      const  element  =    this.formParents.controls[index];
        element['controls'].address['controls'].city.setValue(formIdentityValue.address.city);
        element['controls'].address['controls'].country.setValue(formIdentityValue.address.country);
        element['controls'].address['controls'].line1.setValue(formIdentityValue.address.line1);
        element['controls'].address['controls'].line2.setValue(formIdentityValue.address.line2);
        element['controls'].address['controls'].postalCode.setValue(formIdentityValue.address.postalCode);

    } else {
        const element = this.formParents.controls[index]
        element['controls'].address['controls'].city.setValue('');
        element['controls'].address['controls'].country.setValue('1');
        element['controls'].address['controls'].line1.setValue('');
        element['controls'].address['controls'].line2.setValue('');
        element['controls'].address['controls'].postalCode.setValue('');

    }
  }
  addNewCompany() {
    this.addCompanyDialog = this.dialog.open(AddCompanyDialogComponent, this.configCat);
    this.addCompanyDialog.componentInstance.schoolId = this.customerId;
    this.addCompanyDialog.afterClosed().subscribe((companyValues) => {
      if (companyValues !== undefined) {
          this.companylist = this.companyService.addCompany(companyValues);


      this.companyService.getCompanies().subscribe((response) => {
        this.companylist = response.data;
        this.companylist.forEach(company => {
          console.log("company",company);
          if(company.companyName === companyValues.companyName)
          {
            this.filterSelectedCompany(company);
            this.companySearchString = company.companyName;
          }
        });
      });
    }
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
    const civilitybysex = value.sex === "Male" ? "MR" : "MRS";
    const civility = this.translate.instant('USERS.ADDEDITUSER.CIVILITY.' + civilitybysex);
    this.studentService.addStudent(value).subscribe(res => {
      console.log(res);
      if (res.code === 200) {
        const regUrl = location.origin + '/student/completeregistration/' + res.data.token;
        swal({
          title: this.translate.instant('USERS.MESSAGE.SUCCESS'),
          // html: `<p>`
          // + this.translate.instant('STUDENT_INFORMATION.SUCCESSMESSAGE', { value: value.firstName })
          // + `</p>`,
          text: this.translate.instant('STUDENT_INFORMATION.SUCCESSMESSAGE', {
            Civility: civility,
            LName: value.lastName,
            FName: value.firstName
          }),
          type: 'success',
          confirmButtonClass: 'btn-danger',
          allowEscapeKey:true,
          confirmButtonText: this.translate.instant('SUGGESTION.OK'),
          closeOnConfirm: false,
        }).then(() => {
            this.cancel();
        });
      }  else if(res.code === 400 && res.message === "Email already registered"){
        swal({
          title: 'Attention',
          text: this.translate.instant('USERS.MESSAGE.USERSEMAILFAILED'),
          allowEscapeKey:true,
          type: 'warning'
        });
      }else {
        swal({
          title: 'Attention',
          text: this.translate.instant('USERS.MESSAGE.USERSAVEFAILED'),
          allowEscapeKey:true,
          type:'warning'
        });
      }
    }, (error) => {
      if (error.status === 450 ) {
        const errorData = error.json();
       if ( errorData.studentDetails && errorData.studentDetails._id ) {
        // !this.utilityService.checkUserIsDirectorSalesAdmin() &&
        this.checkChangeStudentRncpSchol(errorData);
        }
      } else {
        swal({
          title: 'Attention',
          text: this.translate.instant('USERS.MESSAGE.USERSAVEFAILED'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    });
  }

  cancel() {
    this.router.navigateByUrl('/school/' + this.customerId + '/edit/' + this.selectedIndexForStudentsTab);
  }


  changeRNCPTitles(e) {
    const school_id = this.customerId;
    const rncpTitleId = e.value;

    console.log('form', this.form);
    const rncpObject = _.find(this.RNCPfilterTitles, {'_id': rncpTitleId});

    if ( rncpObject && rncpObject._id ) {
      this.selectedRNCPTitle = rncpObject;
    }

    const rncpSpecializations = rncpObject && rncpObject.specializations ? rncpObject.specializations : [];
    this.setSpecializationArray(rncpSpecializations);
    // Production
    this.studentService.getAllClassesRNCPTitle(rncpTitleId).subscribe((response) => {
      this.selectedSchoolRNCPTitle = true;
      this.classType = response.data;
      console.log(this.classType);
    });

  }

  setSpecializationArray(rncpSpecializations) {
    if ( this.formCourse ) {
      this.formCourse.get('specializations').setValue('');
    }
    if (rncpSpecializations && this.schoolSpecialization) {
      const interSectSpecialization = [..._.intersectionWith(this.schoolSpecialization, rncpSpecializations,
        (schoolSpecialization, rncpSpecialization) => {
          return (schoolSpecialization._id === rncpSpecialization._id);
        })];
      this.specializations = interSectSpecialization;
    } else {
      this.specializations = [];
    }
  }

  onLinkClick(event) {
    console.log(event.index);
    this.selectedIndex = event.index;
  }

  initGuardianAddress(i) {
    return this.fb.group({
      'relation': [''],
      'sex': [''],
      'familyName': [''],
      'name': [''],
      'sameAddress': [''],
      'email': [''],
      'telePhone': [''],
      address: this.fb.group({
        'line1': [''],
        'line2': [''],
        'postalCode': [''],
        'city': [''],
        'country': ['1', [ Validators.maxLength(40)]]
      }),
    });
  }

  addGuardian(i: number) {
    console.log("Form Parent",this.formParents.length);

    const control = this.formParents;
    this.guardianNumber = this.guardianNumber + 1;
    const addrCtrl = this.initGuardianAddress(i);
    control.push(addrCtrl);
    console.log(control);
    console.log("addGuardian : addGuardian",this.guardianNumber);
  }

  removeGuardian(i: number) {
    console.log("Form Parent",this.formParents.length);
    this.guardianNumber = this.guardianNumber - 1;
    const control = this.formParents;
    console.log("removeGuardian : guardianNumber",this.guardianNumber);
    control.removeAt(i);
    control.removeAt(this.guardianNumber);


  }

  changeCompanySelect(event) {
    if(event){
    this.ActivityText = event.activity;
    const companyId = event._id;

    console.log(companyId);
    // this.getMentorList(companyId);
    this.service.getMentorsForCompany(companyId).subscribe((response) => {
      console.log('mentorlist');
      console.log(response);
      // this.userList = null;
      this.userList = response;
    });
  }
  }


  addNewMentor() {
    log.data("this.formCompany.get('companies').value.companyName", this.formCompany.get('companies').value );
    this.service.loginUser = 1;
    this.addMentorComponent = this.dialog.open(AddMentorComponent, this.configUser);
    this.addMentorComponent.componentInstance.customerId = this.customerId;
    this.addMentorComponent.componentInstance.companylist = this.companylist;
      this.addMentorComponent.componentInstance.selectedCompany = this.formCompany.get('companies').value.companyName;
    this.addMentorComponent.afterClosed().subscribe((value) => {
      console.log("Inside addMentorComponent : subsscription",value);
    log.data("this.formCompany.get('companies').value.companyName", this.formCompany.get('companies').value );
    this.getMentorList(this.formCompany.get('companies').value._id);
    if(value){
      this.selectedMentor = value.data._id;
    }
    });
  }

  selectScholarSeason(id) {
    if ( this.formCourse ) {
      this.formCourse.get('rncpTitle').setValue('');
    }
    this.RNCPfilterTitles = [];
    console.log(this.scholarSeasonData);
    for (const scholarseasondata of this.scholarSeasonData) {
      if (scholarseasondata._id === id) {
        this.RNCPfilterTitles = scholarseasondata.rncptitles;
        this.specializations = [];
      }
    }
  }
  handleKeyboardEvents(event: KeyboardEvent) {
    // if (event.keyCode == 27)
    // {
    //   console.log('27 pressed');
    // }
    // console.log(event.which || event.keyCode);
  }
  onKey(event) {
    if (event.keyCode === 9) {
      this.el.nativeElement.focus();
    }
  }

  minDate() {
    const now = new Date();
    return new Date(
      now.getFullYear() - 2,
      now.getMonth(),
      now.getDate()
    );
  }


  getCompany() {
    this.companyService.getCompaniesLinkedToSchool(this.customerId).subscribe((response) => {
      this.allCompanylist = _.orderBy(response.data,['companyName'], ['asc'] );
      this.companylist = this.allCompanylist;
      if (this.companylist) {
        log.data('this.companylist in getCompany', this.companylist);
      }
    });
  }

  checkEmailAlreadyExists() {
    const emailObject = {
      email: this.emailCheck,
      rncpId: this.selectedRNCPTitle && this.selectedRNCPTitle._id ? this.selectedRNCPTitle._id : null

    }
    if ( this.selectedRNCPTitle && this.selectedRNCPTitle._id ) {  emailObject['rncpId'] = this.selectedRNCPTitle._id; }
    if ( this.customerService.currentSchool && this.customerService.currentSchool._id ) {
      emailObject['schoolId'] = this.customerId;
    }


    if(this.formIdentity.get('email').valid ) {
    log.data('checkEmailAlreadyExists', emailObject);

    this.service.userNewEmailCheck( emailObject)
            .subscribe(
              (response) => {
                log.data('userNewEmailCheck', response );
                if ( !response.isEmailAvailable) {
                  if ( response.studentDetails && response.studentDetails._id ) {
                    // !this.utilityService.checkUserIsDirectorSalesAdmin() &&
                    this.checkChangeStudentRncpSchol(response);
                  } else {
                    swal({
                      title: this.translate.instant('ERROR'),
                      text: this.translate.instant('USERS.MESSAGE.USERSEMAILFAILED'),
                      allowEscapeKey: true,
                      type: 'error'
                    });
                  }
                }
              }
             );
    }
  }

  searchCompanyList(event) {
    if (this.companySearchString !== "") {
      const val = event.target.value.toLowerCase();
      this.companylist = this.allCompanylist;
      const temp = this.companylist.filter(function (d) {
        return (
          (d.companyName !== '' && d.companyName.toLowerCase().indexOf(val) !== -1));
      });
      this.companylist = temp;
    } else {
      this.companylist = this.allCompanylist;
    }
  }

  filterSelectedCompany(company) {
    this.formCompany.get('companies').setValue(company);
    this.selectedCompany = company;
    this.changeCompanySelect(company);
  }

  changeParallelIntake(event) {
    if (event.checked) {
      swal({
        title: this.translate.instant('STUDENT.PARALLEL_S1.TITLE'),
        html: this.translate.instant('STUDENT.PARALLEL_S1.TEXT'),
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

  getSchoolSpecializations(schoolId) {
    this.customerService.getSchoolSpecializations(schoolId).subscribe(
      (response) => {
        if (response.data && response.data.length) {
          this.schoolSpecialization = response.data;
        }
      },
      err => console.log(err));
  }

  changeControlValue(control: AbstractControl, isFirstName = true) {
    control.setValue(this.utilityService.convertNameCasing(control.value, isFirstName));
  }

  checkChangeStudentRncpSchol(data) {
    if ( data.hasOwnProperty('finalTranscriptPending') && !data.finalTranscriptPending && data.changeSchool ) {
      this.displayCHANGESCHOOL_S5Swal(data.studentDetails);
    } else  if (data.finalTranscriptPending) {
      this.displayChangement_s3Swal(data.studentDetails);
    } else if (data.changeSchool) {
      this.askAdmtcToTransferStudent(data.studentDetails);
    } else {
      this.confirmChangementOfRncp(data.studentDetails);
    }
  }

  // payload, studentDetails, isEmailonly = true
  confirmChangementOfRncp(studentDetails) {

    const timeDisabledinSec = 10;
    swal({
      type: 'warning',
      title: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGEMENT_S1.TITLE', {
        studentName: `${this.utilityService.computeCivility(studentDetails.sex,
                      this.translate.currentLang.toLowerCase())} ${studentDetails.firstName} ${studentDetails.lastName}`,
        newRNCP: this.selectedRNCPTitle ? this.selectedRNCPTitle.shortName : ''
      }),
      html: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGEMENT_S1.TEXT', {
        studentName: `${this.utilityService.computeCivility(studentDetails.sex,
          this.translate.currentLang.toLowerCase())} ${studentDetails.firstName} ${studentDetails.lastName}`,
        oldTitle: studentDetails.rncpTitle.shortName,
        schoolName: studentDetails.school.shortName,
        newRNCP: this.selectedRNCPTitle ? this.selectedRNCPTitle.shortName : ''
      }),
      allowEscapeKey: true,
      allowOutsideClick: true,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGEMENT_S1.YES_IN', { timer: timeDisabledinSec }),
      cancelButtonText: this.translate.instant('CANCEL'),
      onOpen: () => {
        let timeDicrementSec = timeDisabledinSec;
        swal.disableConfirmButton()
        const confirmButtonRef = swal.getConfirmButton();

        // TimerLoop for derementing timeDisabledinSec
        const timerLoop = setInterval(() => {
          timeDicrementSec -= 1;
          confirmButtonRef.innerText = this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGEMENT_S1.YES_IN', { timer: timeDicrementSec });
        }, 1000
        );

        // Resetting timerLoop to stop after required time of execution
        setTimeout(() => {
          confirmButtonRef.innerText = this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGEMENT_S1.YES');
          swal.enableConfirmButton();
          clearTimeout(timerLoop);
        }, (timeDisabledinSec * 1000));
      }
    }).then((isConfirm) => {
      this.changementOfRncp(studentDetails);
    }, (dismiss) => {
    });

  }

  askAdmtcToTransferStudent(studentDetails) {
    swal({
      title: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGE_SCHOOL_S4.TITLE'),
      html: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGE_SCHOOL_S4.TEXT', {
        oldTitle: studentDetails.rncpTitle.shortName,
        schoolName: studentDetails.school.shortName,
      }),
      allowEscapeKey: true,
      allowOutsideClick: true,
      type: 'warning',
      confirmButtonClass: 'btn-danger',
      confirmButtonText: this.translate.instant('YES'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('CANCEL')
    }).then((isconfirm) => {
      this.changementOfRncp(studentDetails, false);
    });
  }

  changementOfRncp(studentDetails, sendChangeSchool_N3 = true) {
    if (this.formCourse.valid) {

      // For Saving Company If required
      const CompanyValues = this.formCompany.value;
      const merged = {
        companies: []
      }
      if (CompanyValues.companies) {
          if (CompanyValues.mentors) {
              merged.companies.push({
                company: CompanyValues.companies._id,
                mentors: CompanyValues.mentors,
                startDate: new Date(),
                isActive: true
              });
          } else {
            merged.companies.push({
              company: CompanyValues.companies._id,
              startDate: new Date(),
              isActive: true
          })
         }
      }
      const courseValues = this.formCourse.value;
      courseValues['email'] = studentDetails.email;
      courseValues['schoolId'] = this.customerId;
      const payload = {
        ...courseValues,
        ...merged,
        lang: this.translate.currentLang.toLowerCase()
      };

      this.studentService.changementOfRncp(payload).subscribe(
        (response) => {
          if ( response.data ) {
            if ( sendChangeSchool_N3 ) {
              this.displayChangementSuccessfullSwal(studentDetails);
            } else {
              this.successSwal();
            }
          }
        }
      )
    } else {
      this.formCourseSubmit = true;
    }
  }

  displayChangementSuccessfullSwal(studentDetails) {
    swal({
      title: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGEMENT_S2.TITLE', {
        studentName: `${this.utilityService.computeCivility(studentDetails.sex,
          this.translate.currentLang.toLowerCase())} ${studentDetails.firstName} ${studentDetails.lastName}`,
        newRNCP: this.selectedRNCPTitle ? this.selectedRNCPTitle.shortName : ''
      }),
      html: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGEMENT_S2.TEXT', {
        oldTitle: studentDetails.rncpTitle.shortName
      }),
      allowEscapeKey: true,
      allowOutsideClick: true,
      type: 'success',
      confirmButtonClass: 'btn-danger',
      confirmButtonText: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGEMENT_S2.BTN')
    }).then(
      () =>
      this.cancel()
    );;
  }

  displayChangement_s3Swal(studentDetails) {
    swal({
      title: this.translate.instant('BACKEND.STUDENT.SORRY'),
      html: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGEMENT_S3.TEXT', {
        studentName: `${this.utilityService.computeCivility(studentDetails.sex,
          this.translate.currentLang.toLowerCase())} ${studentDetails.firstName} ${studentDetails.lastName}`,
        oldTitle: studentDetails.rncpTitle.shortName,
        schoolName: studentDetails.school.shortName,
      }),
      allowEscapeKey: true,
      allowOutsideClick: true,
      type: 'warning',
      confirmButtonClass: 'btn-danger',
      confirmButtonText: this.translate.instant('OKAY')
    });
  }

  displayCHANGESCHOOL_S5Swal(studentDetails) {
    swal({
      title: this.translate.instant('BACKEND.STUDENT.SORRY'),
      html: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGESCHOOL_S5.TEXT', {
        studentName: `${this.utilityService.computeCivility(studentDetails.sex,
          this.translate.currentLang.toLowerCase())} ${studentDetails.firstName} ${studentDetails.lastName}`,
        oldTitle: studentDetails.rncpTitle.shortName,
        schoolName: studentDetails.school.shortName,
      }),
      allowEscapeKey: true,
      allowOutsideClick: true,
      type: 'warning',
      confirmButtonClass: 'btn-danger',
      confirmButtonText: this.translate.instant('OKAY')
    });
  }

  successSwal() {
    swal({
      type: 'success',
      title: this.translate.instant('SUCCESS'),
      allowEscapeKey: true,
      confirmButtonText: 'OK'
    }).then(
      () =>
      this.cancel()
    );
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
}
