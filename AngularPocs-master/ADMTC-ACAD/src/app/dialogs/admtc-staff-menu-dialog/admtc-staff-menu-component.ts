import { UtilityService } from './../../services/utility.service';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/users.service';
import { CompanyService } from '../../services/company.service';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { AcademicStaffUser } from '../../models/user_academicstaff.model';
import { AcademicAdministratorUser } from '../../models/user_academic_administrator.model';
import { CorrectorUser } from '../../models/user_corrector.model';
import { Student } from '../../models/student.model';
import { Company } from '../../models/company.model';
import { User } from '../../models/user.model';
import { UserTypesModel } from '../../models/userTypes.model';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from '../../shared/global-urls';
import { Files } from '../../shared/global-urls';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { emailValidator, matchingPasswords } from '../../custome-validation/custom-validator';
import { AddCompanyDialogComponent } from '../add-company-dialog/add-company-dialog.component';
import { CustomerService } from '../../components/customer/customer.service';
declare var swal: any;
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../../services/login.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import { Certificate } from 'crypto';
import { resetFakeAsyncZone } from '@angular/core/testing';

import { Log } from 'ng2-logger';
const log = Log.create('ADMTCStaffDialogComponent');
log.color = 'purple';

@Component({
  selector: 'app-admtc-staff-menu-dialog',
  templateUrl: './admtc-staff-menu-component.html',
  styleUrls: ['./admtc-staff-menu-component.scss'],
})
export class ADMTCStaffDialogComponent implements OnInit {
  @ViewChild('uploadFileControl') uploadInput: any;
  form: FormGroup;
  public modify: boolean;
  public schoolID = '';
  selectedUserTypes = [];
  selectedRNCP = [];
  loginUser: number;
  allUser: any[];
  selectedSchoolForGOS = [];
  isGroupOfSchool = false;
  userTypes: any = [];
  RNCPTitles: any = [];
  RNCPTitleList = [];
  disableSubmit = false;
  userAssignedRNCPTitles = [];
  userAssignedSchools = [];
  CertifierSelection = [{
    view: 'PREPARATIONCENTER',
    value: 'preparation-center',
    selected: false
  }, {
    view: 'CERTIFIER',
    value: 'certifier',
    selected: false
  }];
  userType: any;
  schoolEntity: any = '';
  //preparationCenter1: any = [];
  preparationCenter = [];
  academicStaffUser: AcademicStaffUser;
  academicAdministratorUser: AcademicAdministratorUser;
  filteredOptions: Observable<string[]>;
  student: Student;
  schoolListforSelect = [];
  correctorUser: CorrectorUser;
  userRoles: any = [];
  reportToUsers: any = [];
  public user: User;
  public userid: string;
  schoolList = [];
  selectedUserType: any;
  currentLoginUser: any = '';
 // classType: any = [];
  resumeErrorMessage: any = false;
  types: UserTypesModel[] = [];
  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });
  loading = false;

  page = new Page();
  sort = new Sort();
  listUt = [{ 'id': '1', 'text': 'aaa' }];

  sexType = [
    { value: 'M', view: 'USERS.ADDEDITUSER.CIVILITY.MR' },
    { value: 'F', view: 'USERS.ADDEDITUSER.CIVILITY.MRS' }
  ];
  selectedMultipleUserTypes: any = [];
  public isADMTC = false;
  public isACADEMIC = false;
  companylist: Company[] = [];
  currentUser;
  school;
  currnetSchool;
  isSalesManagmentOrAdmin = false;
  isCertifier = false;
  existingEmail = '';
  companies: Observable<string[]>;
  configCat: MdDialogConfig = {
    disableClose: false,
    width: '900px'
    // height: '635px'
  };

  item;
  // New Things
  tempType: UserTypesModel[] = [];
  userModel: User;
  invalidFormSubmitted  = false;
  findCertifierAdmin = null;
  selectedCompnay: any;
  // userModel: any;
  addCompanyDialog: MdDialogRef<AddCompanyDialogComponent>;
  userEntities = [
    { value: 'academic', view: this.translate.instant('ENTITY.ACADEMIC') },
    { value: 'company', view: this.translate.instant('ENTITY.COMPANY') },
    { value: 'admtc', view: this.translate.instant('ENTITY.ADMTC') },
    { value: 'group-of-schools', view: this.translate.instant('ENTITY.GROUPOFSCHOOLS') }
  ];
  public requestAutocompleteItemsFake = (text: string): Observable<string[]> => {
    return Observable.of([
      'item1', 'item2', 'item3'
    ]);
  }




  constructor(private dialogRef: MdDialogRef<ADMTCStaffDialogComponent>,
    private service: UserService,
    private schoolService: CustomerService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private dialog: MdDialog,
    private _login: LoginService,
    private utilityService: UtilityService) {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    console.log('!!!!!!!!', this.userModel);
    console.log('@@!!!!!', this.dialogRef);

  }
  filterRNCPTitle(name: string) {
    return this.schoolList.filter(list =>
      list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  filterCompanies(name: string) {
    return this.companylist.filter(list =>
      list.companyName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }



  handleKeyboardEvents(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.cancel(false);
    }
  }

  ngOnInit() {
    this.currentUser = this._login.getLoggedInUser();
    // this.service.getAllPreparationCenter().subscribe((response) => {
    //   this.preparationCenter1 = response.data;
    // });



    // New Things

    if (this.userid !== undefined) {
      this.modify = true;
      this.service.getRegisterUserById(this.userid).subscribe(response => {
        this.userModel = new User();
        this.modify = true;
        this.userModel = response;
        this.existingEmail = this.userModel && this.userModel.email ? this.userModel.email : '';
        if (this.userModel.entity.school) {
          this.schoolEntity = this.userModel.entity.school;
        }
        if (this.userModel.operationRoleType && this.userModel.operationRoleType === 'certifier') {
          this.isCertifier = true;
        }
        this.initializeFormGroup();
        this.setUserType(this.userModel.entity.type);
        // this.enableAndDisableControls();
        this.fillControls(true);
        this.school = this.form.controls['school'];
        this.filteredOptions = this.school.valueChanges.startWith(null)
          .map(list => list ? this.filterRNCPTitle(list) :
            this.schoolList.slice());
        if (this.userModel.assignedRncpTitles) {
          this.userModel.assignedRncpTitles.forEach((item) => {
            this.userAssignedRNCPTitles.push({
              text: (<any>item).shortName,
              id: (<any>item)._id
            });
          });
        }

        // This logic is to restrict user to remove usertypes and assignedRncpTItles as certifier admin
        if (this.isCertifier) {
          const uTypes = this.userModel.types as UserTypesModel[];
          this.findCertifierAdmin = uTypes.find(u => u.name.toLowerCase() === 'admin');
          this.checkIfCertifierAdmin();
        }
      });
    } else {
      this.modify = false;
      this.initializeFormGroup();
      this.school = this.form.controls['school'];
      this.filteredOptions = this.school.valueChanges.startWith(null)
        .map(list => list ? this.filterRNCPTitle(list) :
          this.schoolList.slice());
    }
  }

  fillRNCP() {
    log.info('fill RNCP invoked!')
    this.disableSubmit = true;
    this.service.getAllRNCPTitlesShortName().subscribe((response) => {
      const RNCP = response.data;
      // this.RNCPTitleList = [];
      const RNCPTitleListTemp = [];
      RNCP.forEach((item) => {
        RNCPTitleListTemp.push({
          text: item.shortName,
          id: item._id
        });
      });
      this.RNCPTitleList = RNCPTitleListTemp.sort(this.keysrt('text'));
      this.disableSubmit = false;
    });
  }

  // getAllClass() {
  //   this.service.getAllClass().subscribe((response) => {
  //     this.classType = response.data;
  //   });
  // }

  getCertifier(initiated = false) {
    const self = this;
    this.schoolService.getAllCertifier(this.page, this.sort).then((res) => {
      const data = res.data;
      this.schoolList = [];
      if (data) {
        data.forEach((item) => {
          if (item.certifier) {
            this.schoolList.push(item.certifier);
          }
        });
        this.schoolList = this.schoolList.sort(self.keysrt('shortName'));
        if (!initiated) {
          this.form.controls['school'].setValue('');
        }
      }
    });
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) { return 1; }
      else if (a[key] < b[key]) { return -1; };
      return 0;
    };
  }
  getPerparationCenter(initiated = false) {
    const self = this;
    const schoollist = [];
    const schoolListAssigned = [];
    self.schoolService.getCustomersList(self.page, self.sort).then((res) => {
      self.schoolList = res.data.sort(self.keysrt('shortName'));

      self.schoolList.forEach((item) => {
        schoollist.push({ text: item.shortName, id: item._id });
      });
      self.schoolListforSelect = schoollist;


      if (self.modify && (self.userModel.entity.type === 'group-of-schools')) {
        self.selectedSchoolForGOS = [];
        this.userModel.entity.groupOfSchools.forEach((school) => {
          self.selectedSchoolForGOS.push(school._id);
          schoolListAssigned.push({ text: school.shortName, id: school._id });
        });
        this.form.get('school').setValue(schoolListAssigned);
      } else if (!initiated) {
        self.form.controls['school'].setValue('');
      }
    });
  }

  changeSchool(list, clearRNCP = true) {
    if (list['_id']) {
      this.schoolID = list._id;
      this.schoolEntity = list._id;
      this.currnetSchool = list;
      this.disableSubmit = true;
      let RNCPTitleListTemp = [];
      if( this.isCertifier ){
        this.schoolService.getCertifierRNCPTitles(list['_id']).subscribe( (response) => {
          if (response.data && response.data.length > 0) {
            response.data.forEach(RNCP => {
              RNCPTitleListTemp.push({
                id: RNCP._id,
                text: RNCP.shortName,
              });
            });
            if (clearRNCP) { this.form.controls['assignedRncpTitles'].setValue([]); }
            this.RNCPTitleList = RNCPTitleListTemp.sort(this.keysrt('text'));
            this.disableSubmit = false;
          }
        });
      } else {
        this.schoolService.getCustomerById(list['_id']).subscribe((response) => {
          // this.RNCPTitleList = [];
          const responseData = response.data;
          responseData.forEach((item) => {
            if (item.rncpTitles) {
              const TitleList = item.rncpTitles;
              TitleList.forEach((RNCP) => {
                RNCPTitleListTemp.push({
                  id: RNCP._id,
                  text: RNCP.shortName,
                });
              });
            }
          });
          if (clearRNCP) { this.form.controls['assignedRncpTitles'].setValue([]); }
          this.RNCPTitleList = RNCPTitleListTemp.sort(this.keysrt('text'));
          this.disableSubmit = false;
        });
      }
    }
  }

  cancel(status) {
    this.dialogRef.close(status);
  }

  changeItem(event) {
    console.log(event);
    console.log(this.form.controls['types'].value);
  }

  changeSelection(event) {
    if (event.value) {
      switch (event.value) {
        case 'certifier':
          this.getCertifier();
          this.isCertifier = true;
          this.changeUserEntities();
          this.form.controls['assignedRncpTitles'].setValue([]);
          break;
        case 'preparation-center':
          this.getPerparationCenter();
          this.isCertifier = false;
          this.changeUserEntities();
          this.form.controls['assignedRncpTitles'].setValue([]);
          break;
      }
    }
  }

  // GetAllUser() {
  //   this.service.getAllUser().subscribe((response) => {
  //     this.reportToUsers = response.data;
  //   });
  // }

  // clearUploadQueue() {
  //   this.uploader.clearQueue();
  //   this.uploadInput.nativeElement.value = '';
  //   // this.user.resume = null;
  //   this.form.value.resume = null;
  // }

  // openUploadWindow() {
  //   this.uploadInput.nativeElement.click();
  // }
  // downloadDocument() {
  //   const a = document.createElement('a');
  //   a.target = 'blank';
  //   a.click();
  // }

  initializeFormGroup() {
    this.form = this.fb.group({
      assignedRncpTitles: [this.modify ? this.userAssignedRNCPTitles : ''],
      operationRoleType: [this.modify ? this.userModel.operationRoleType : '', [Validators.required]],
      entityValue: [this.modify ? this.userModel.entity.type : '', [Validators.required]],
      firstName: [this.modify ? this.userModel.firstName : '', [Validators.required, Validators.maxLength(40)]],
      lastName: [this.modify ? this.userModel.lastName : '', [Validators.required, Validators.maxLength(40)]],
      email: [this.modify ? this.userModel.email : '', [Validators.required, Validators.email]],
      types: [this.modify ? this.userModel.types : '', Validators.required],
      company: [this.modify ? (this.userModel.entity.company ? this.userModel.entity.company['companyName'] : '') : '', Validators.required],
      sex: [this.modify ? this.userModel.sex : 'M', Validators.required],
      officePhone: [this.modify ? this.userModel.officePhone : ''],
      directLine: [this.modify ? this.userModel.directLine : '', []],
      position: [this.modify ? this.userModel.position : ''],
      portablePhone: [this.modify ? this.userModel.portablePhone : '', []],
      school: [this.modify ? (this.userModel.entity.school ? this.userModel.entity.school['shortName'] : '') : '', [Validators.required]],
      lang: [this.translate.currentLang.toUpperCase()],
      createdBy: [this.currentUser._id, [Validators.required]],
      civility: []
    });

    // if (this.modify) {
    //     // this.changeUserType(this.user.userType.name);
    //     this.changeUserEntities();
    //     // this.changeUserTypes(this.userModel.types);

    // }
    this.companySort();
  }


  fillControls(initiated = false) {
    if (this.modify) {
      this.changeUserEntities();
      if (this.userModel.types.length) {
        const userTypearr = [];
        const typeModel = this.userModel.types;
        for (const s of typeModel) {
          userTypearr.push({
            id: s['_id'],
            text: this.getTranslateADMTCSTAFFKEY(s['name'])
          });
        }
        this.form.controls['types'].setValue(userTypearr);
      }
      if (this.userModel.entity.school) {
        this.schoolEntity = this.userModel.entity.school['_id'];
        if (this.schoolEntity) { this.changeSchool({ _id: this.schoolEntity }, false); }
      } else {
        log.info('Calling from fillControls')
        this.fillRNCP();
      }
      if (this.userModel.operationRoleType === 'preparation-center') {
        this.getPerparationCenter(initiated);
        this.form.controls['school'].setValue(this.userModel.entity.school ? this.userModel.entity.school['shortName'] : '');
      } else if (this.userModel.operationRoleType === 'certifier') {
        this.getCertifier(initiated);
        this.form.controls['school'].setValue(this.userModel.entity.school ? this.userModel.entity.school['shortName'] : '');
      }
    }

  }

  getTranslateADMTCSTAFFKEY(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  changeUserEntities() {
    const entity = this.form.get('entityValue');
    let entityValue = '';
    if (this.isCertifier && entity.value.toLowerCase() === 'academic') {
      entityValue = 'certifier';
    } else {
      entityValue = entity.value;
    }
    this.service.getUserTypesWithIsUserCollection(entityValue, true).subscribe((response) => {
      this.userTypes = [];
      const items = response.data;
      // response.data = response.data.sort(this.keysrt('name'));
      //    response.data = this.translate.instant('ADMTCSTAFFKEY.' + response.data.toUpperCase());
      items.forEach((item) => {
        this.userTypes.push({ 'id': item._id, 'text': this.getTranslateADMTCSTAFFKEY(item.name) });
      });
      this.userTypes = this.userTypes.sort(this.keysrt('text'));
      if (entityValue === 'group-of-schools') {
        this.isGroupOfSchool = true;
        this.groupOfSchoolCondition(this.userTypes);
      }
    });
    this.form.controls['types'].setValue([]);

    if (this.isCertifier && entity.value.toLowerCase() === 'academic') {
      this.setUserType('academic');
    } else {
      this.setUserType(entityValue);
    }
    this.enableAndDisableControls();
  }

  setUserType(entityValue) {
    this.isACADEMIC = false;
    this.isADMTC = false;
    this.isGroupOfSchool = false;
    if (entityValue) {
      switch (entityValue) {
        case 'admtc':
          this.isADMTC = true;
          this.isACADEMIC = false;
          this.fillRNCP();
          this.isGroupOfSchool = false;
          break;
        case 'academic':
          this.isACADEMIC = true;
          this.isADMTC = false;
          this.isGroupOfSchool = false;
          break;
        case 'group-of-schools':
          this.isACADEMIC = true;
          this.isADMTC = false;
          break;
        case 'company':
          this.getCompany();
          break;
        default:
          this.isACADEMIC = false;
          this.isADMTC = false;
          this.isGroupOfSchool = false;
         this.fillRNCP();
      }
    }
  }

  changeRNCP(event) {
    this.RNCPTitles = [];
    if (event.length) {
      const RNCPTitles = event;
      RNCPTitles.forEach((item) => {
        this.RNCPTitles.push(item.id);
      });
    }
  }

  groupOfSchoolCondition(userTypeID) {
    this.getPerparationCenter();
    this.enableAndDisableControls();
    this.form.get('operationRoleType').setValue('preparation-center');
    this.form.get('types').setValue(userTypeID);
  }

  changeTypes(event) {
    if ((this.userModel && this.userModel.entity.type === 'admtc')
      || (this.form.get('entityValue').value === 'admtc')) {
      console.log(event);
      let status = false;
      const typeArr = ['sales', 'management', 'admin', 'commercial', 'director', 'direction générale'];
      for (let index = 0; index < event.length; index++) {
        const element = event[index];
        if (typeArr.indexOf(element['text'].toLowerCase()) > -1) {
          status = true;
        }
      }
      this.isSalesManagmentOrAdmin = status;
      log.data('isSalesManagmentOrAdmin', this.isSalesManagmentOrAdmin);
    }

    this.selectedMultipleUserTypes = [];
    if (event.length) {
      const userTypes = event;
      userTypes.forEach((item) => {
        console.log(item.id);
        this.selectedMultipleUserTypes.push(item.id);
      });
    }
  }

  addRegisterdUser() {
    this.userModel = new User();
    if (this.form.valid) {
      this.invalidFormSubmitted = false;
      this.loading = true;
      Object.assign(this.userModel, this.form.value);
      this.userModel.types = this.selectedMultipleUserTypes;
      this.userModel.entity.type = this.form.controls['entityValue'].value;

      if (this.userModel.entity.type === 'company') {
        const company = this.selectedCompnay;
        this.userModel.entity.company = company;
      }

      if (this.form.controls['assignedRncpTitles'].value.length) {
        this.userModel.assignedRncpTitles = this.RNCPTitles;
      }
      if (this.isSalesManagmentOrAdmin && !this.disableSubmit) {
        this.userModel.assignedRncpTitles = [];
        const allRncpTitles = [];
        this.RNCPTitleList.forEach((item) => {
          if (item.id) {
            allRncpTitles.push(item.id);
          }
        });
        this.userModel.assignedRncpTitles = allRncpTitles;
      } else if (this.userModel.assignedRncpTitles[0] === '') {
        delete this.userModel.assignedRncpTitles;
      }
      console.log(this.userModel);
      const Civility = this.translate.instant(this.form.controls['sex'].value === 'M' ?
        'USERS.ADDEDITUSER.CIVILITY.MR' : 'USERS.ADDEDITUSER.CIVILITY.MRS');
      const FName = this.form.controls['firstName'].value;
      const LName = this.form.controls['lastName'].value;

      this.userModel.civility = this.form.controls['sex'].value === 'M' ? 'MR' : 'MRS';
      console.log(this.userModel);
      if (this.schoolEntity !== '' && !this.isGroupOfSchool) {
        this.userModel.entity.school = this.schoolEntity;
        this.userModel.school = this.schoolEntity;
      } else if (this.isGroupOfSchool) {
        this.userModel.entity.groupOfSchools = this.selectedSchoolForGOS;
        this.userModel.school = '';
      }
      if (this.modify) {
        this.userModel._id = this.userid;
        this.service.editRegisteredUser(this.userModel).subscribe((res) => {
          this.loading = false;
          if (res !== null) {
            if ( res.data && this.existingEmail !== res.data.email) {
              swal({
                title: this.translate.instant('EMAIL_S6.TITLE'),
                text: this.translate.instant('EMAIL_S6.TEXT'),
                type: 'info',
                confirmButtonClass: 'btn-danger',
                allowEscapeKey: true,
                confirmButtonText: this.translate.instant('BACKEND.STUDENT.THANKYOU'),
                closeOnConfirm: false
              }).then(function () {
                this.cancel(true);
              }.bind(this));
            } else if (res === 'CLASH_EMAIL') {
              swal({
                  type: 'warning',
                  title: 'Attention',
                  text: this.translate.instant('CLASH_EMAIL_S1.TEXT'),
                  confirmButtonClass: 'btn-danger',
                  allowEscapeKey: true,
                  confirmButtonText: this.translate.instant('CLASH_EMAIL_S1.UNDERSTOOD')
              });
          } else {
              swal({
                title: this.translate.instant('USERS.MESSAGE.ADDTITLE'),
                text: this.translate.instant('USERS.MESSAGE.USERUPDATESUCCESS'),
                type: 'success',
                allowEscapeKey: true,
                confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S6.OK'),
              }).then(() => {
                this.cancel(true);
              });
            }
          } else {
            swal({
              title: 'Attention',
              text: this.translate.instant('USERS.MESSAGE.USERUPDATEFAILED'),
              allowEscapeKey: true,
              type: 'warning'
            });
          }
        }, (error) => {
          this.loading = false;
          swal({
            title: 'Attention',
            text: this.translate.instant('USERS.MESSAGE.USERSAVEFAILED'),
            allowEscapeKey: true,
            type: 'warning'
          });
        });
      } else {
        // this.userModel.entity.company = null;
        this.service.addUserRegistration(this.userModel).subscribe((res) => {
          this.loading = false;
          if (res) {
            if (res.code === 200) {
              swal({
                title: this.translate.instant('USERS.MESSAGE.ADDTITLE'),
                text: this.translate.instant('USERS.MESSAGE.USERSAVESUCCESS', {
                  Civility: Civility,
                  FName: FName,
                  LName: LName
                }),
                type: 'success',
                allowEscapeKey: true,
                confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S6.OK'),
              }).then(function () {
                this.cancel(true);
              }.bind(this));
            } else {
              swal({
                title: 'Attention',
                text: this.translate.instant(res.message),
                allowEscapeKey: true,
                type: 'warning'
              });
            }
          }
        }, (error) => {
          this.loading = false;
          swal({
            title: 'Attention',
            text: this.translate.instant('USERS.MESSAGE.USERSAVEFAILED'),
            allowEscapeKey: true,
            type: 'warning'
          });
        });

      }
    } else {
      if (!this.isACADEMIC && !this.isADMTC && !this.isGroupOfSchool) {
        this.form.get('company').markAsTouched();
        this.form.get('company').markAsDirty();
      }
      this.invalidFormSubmitted = true;
    }
  }

  checkUserType(usertype) {
    return this.selectedMultipleUserTypes.some(x => x === usertype);
  }

  enableAndDisableControls() {
    const company = this.form.get('company');
    const position = this.form.get('position');
    const rncpTitle = this.form.get('assignedRncpTitles');
    const operationRoleType = this.form.get('operationRoleType');
    const school = this.form.get('school');

    company.enable();
    position.enable();
    rncpTitle.enable();
    operationRoleType.enable();
    school.enable();
    school.reset();

    if (this.isADMTC) {
      log.info('isADMTC');
      school.clearValidators();
      school.disable();
      operationRoleType.clearValidators();
      operationRoleType.disable();
      rncpTitle.clearValidators();
      rncpTitle.disable();
      company.clearValidators();
      company.disable();
    } else if ( this.isGroupOfSchool) {
      log.info('isGroupOfSchool');
      rncpTitle.clearValidators();
      operationRoleType.clearValidators();
      operationRoleType.disable();
      rncpTitle.disable();
      company.clearValidators();
      company.disable();
    } else if (this.isACADEMIC) {
      log.info('isACADEMIC');
      school.setValidators([Validators.required]);
      rncpTitle.setValidators([Validators.required]);
      company.clearValidators();
      company.disable();
    } else {
      log.info('else');
      school.disable();
      operationRoleType.disable();
      school.clearValidators();
      operationRoleType.clearValidators();
      operationRoleType.disable();
      rncpTitle.clearValidators();
      rncpTitle.disable();
    }
  }

  getCompany() {
    this.companyService.getCompanieList().subscribe((response) => {
      if (response.code === 200) {
        this.companylist = response.data;
      }
    });
  }
  addNewCompany() {
    this.addCompanyDialog = this.dialog.open(AddCompanyDialogComponent, this.configCat);
    this.addCompanyDialog.afterClosed().subscribe((companyValues) => {
      if (companyValues !== undefined) {
        this.companylist = this.companyService.addCompany(companyValues);
        const company = this.form.get('company');
        if (company != null && company !== undefined) {
          company.setValue(companyValues.companyName);
        }
      }
      this.getCompany();
    });
  }

  changeSchoolList(event) {
    this.selectedSchoolForGOS = [];
    const schools = [];
    event.forEach((school) => {
      schools.push(school.id);
    });
    this.selectedSchoolForGOS = schools;
  }

  changeControlValue(control: AbstractControl, isFirstName = true) {
    control.setValue(this.utilityService.convertNameCasing(control.value, isFirstName));
  }
  companySort() {
    this.companies = this.form.controls['company'].valueChanges.startWith(null)
      .map(list => list ? this.filterCompanies(list) :
        this.schoolList.slice());
  }

  checkIfCertifierAdmin() {
    if (this.findCertifierAdmin) {
      const closeButtonElements = [].slice.call(document.getElementsByClassName('close'));
      for (const d of closeButtonElements) {
        d.hidden = true;
        d.style.display = 'none';
      }
    }
  }
  onCompanyClick(company) {
    this.selectedCompnay = company;
  }
}


