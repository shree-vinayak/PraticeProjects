import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { AddCompanyDialogComponent } from '../../dialogs/add-company-dialog/add-company-dialog.component';
import _ from "lodash";
import { User } from '../../models/user.model';
import { UserService } from '../../services/users.service';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';
import { TranslateService } from 'ng2-translate';
import { UtilityService } from '../../services/utility.service';

declare var swal: any;

// Required for Logging on console
import { Log } from "ng2-logger";
const log = Log.create("PCUserDialogComponent");
log.color = 'blue';


@Component({
    selector: 'pc-user-menu-component-dialog',
    templateUrl: './pc-user-menu-component.html',
    styleUrls: ['./pc-user-menu-component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvents($event)'
    }
})
export class PCUserDialogComponent implements OnInit {
    // rncpTitleID: any;
    form: FormGroup;
    public modify: boolean;
    preparationCenter1: any = [];
    userTypes: any = [];
    userRoles: any = [];
    existingEmail: string = '';
    currentUserType = [];
    reportToUsers: any = [];
    userid: string;
    user: User;
    userType: any;
    selectedUserType: any;
    RNCPTitles: any = [];
    companylist: Company[] = [];
    currentLoginUser: any = '';
    disabled: boolean = false;
    loggedInUserId: string;
    formSubmitted = false;
    // New Things
    userModel: User;
    selectedMultipleUserTypes: any = [];
    userEntities = [
        { value: 'academic', view: this.translate.instant('ENTITY.ACADEMIC') },
        { value: 'company', view: this.translate.instant('ENTITY.COMPANY') }
    ];

    sexType = [
        { value: 'M', view: 'MR' },
        { value: 'F', view: 'MRS' }
    ];

    classType: any = [];

    configCat: MdDialogConfig = {
        width: '900px',
        disableClose: false
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

    isUserCertifierAdmin: boolean = false;

    addCompanyDialog: MdDialogRef<AddCompanyDialogComponent>;

    constructor(private dialogPC: MdDialogRef<PCUserDialogComponent>,
        private dialog: MdDialog,
        private fb: FormBuilder,
        private service: UserService,
        private translate: TranslateService,
        private companyService: CompanyService,
        private utilityService: UtilityService) {
        log.info('Constructor Invoked!');
    }

    handleKeyboardEvents(event: KeyboardEvent) {
        if (event.keyCode === 27) {
            this.cancel();
        }
    }

    ngOnInit() {
        log.info('ngOnInit Invoked!');
        this.currentLoginUser = this.service.getCurrentUserInfo();
        log.data('Logged User', this.currentLoginUser);
        this.isUserCertifierAdmin = this.utilityService.checkUserIsAdminOfCertifier();
        // end File upload
        if ( this.isUserCertifierAdmin ) {
            this.userEntities = [
                { value: 'academic', view: this.translate.instant('ENTITY.ACADEMIC') }
            ];
        }
        // New Things
        if (this.userid !== undefined) {
            this.initializeFormGroup();
            this.modify = true;
            this.service.getRegisterUserById(this.userid).subscribe(response => {
                this.userModel = new User();
                this.modify = true;
                this.userModel = response;
                this.loggedInUserId = this.currentLoginUser._id;
                this.existingEmail = this.userModel && this.userModel.email ? this.userModel.email : '';
                log.data('UserModel', this.userModel);
                if (this.userModel !== null && this.userModel.types !== null) {
                    (<Array<any>>this.userModel.types).forEach((item) => {
                        if (this.modify && (item.name === 'Academic-Director' ||
                            item.name === 'Director' || item.name === 'Group-Chief-of-Academic-Directors-and-Admin')) {
                            this.disabled = true;
                        }
                        this.currentUserType.push({ 'id': item._id, 'text': this.getTranslateADMTCSTAFFKEY(item.name) });
                    });
                }
                this.initializeFormGroup();
                this.changeUserEntities(true);
            });
        } else {
            this.modify = false;
            this.initializeFormGroup();
            this.changeUserEntities();
        }
    }


    initializeFormGroup() {
        this.form = this.fb.group({
            entityValue: [this.modify ? this.userModel.entity.type : '' , [Validators.required]],
            firstName: [this.modify ? this.userModel.firstName : '', [Validators.required, Validators.maxLength(40)]],
            lastName: [this.modify ? this.userModel.lastName : '', [Validators.required, Validators.maxLength(40)]],
            email: [this.modify ? this.userModel.email : '', [Validators.required, Validators.email]],
            types: [this.modify ? this.currentUserType : '', Validators.required],
            company: [this.modify && this.userModel.entity.company ? (<any>this.userModel.entity.company)._id : ''],
            sex: [this.modify ? this.userModel.sex : 'M', Validators.required],
            officePhone: [this.modify ? this.userModel.officePhone : ''],
            directLine: [this.modify ? this.userModel.directLine : ''],
            position: [this.modify ? this.userModel.position : ''],
            portablePhone: [this.modify ? this.userModel.portablePhone : '']
        });
    }

    handlerError(error) {
        swal({
            title: 'Attention',
            text: this.translate.instant(error),
            allowEscapeKey: true,
            type: 'warning'
        });
    }

    addNewCompany() {
        this.addCompanyDialog = this.dialog.open(AddCompanyDialogComponent, this.configCat);
        this.addCompanyDialog.componentInstance.schoolId = this.currentLoginUser.entity.school._id;
        this.addCompanyDialog.afterClosed().subscribe((companyValues) => {
            if (companyValues !== undefined) {
                // this.companylist = this.companyService.addCompany(companyValues);
                this.getCompany();
                const company = this.form.get('company');
                if (company != null && company !== undefined) {
                    company.setValue(companyValues._id);
                }
            }
        });
    }


    cancel() {
        this.dialogPC.close();
    }

    getTranslateADMTCSTAFFKEY(name) {
        const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
        return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
    }

    // New Things
    changeUserEntities(resetTypes ?: boolean) {
        const entityValue = this.isUserCertifierAdmin ? 'certifier' : this.form.get('entityValue').value;
        if (entityValue !== '') {
            this.service.getUserTypesWithIsUserCollection(entityValue, true).subscribe((response) => {
                const data = response.data;
                this.userTypes = [];
                if (data) {
                    data.forEach((item, i) => {
                        if ((item.name !== 'Academic-Director' && item.name !== 'Director'
                            && item.name !== 'Group-Chief-of-Academic-Directors-and-Admin')) {
                            this.userTypes.push({ 'id': item._id, 'text': this.getTranslateADMTCSTAFFKEY(item.name) });
                        }
                    });
                }
            });
        }

        if ( !resetTypes ) {
            this.form.get('types').reset();
        }

        const companyControl = this.form.get('company');
        if ( entityValue === 'company' ) {
            this.getCompany();
            companyControl.enable();
            companyControl.setValidators([Validators.required]);
            companyControl.updateValueAndValidity();
        } else {
            companyControl.disable();
        }
    }

    changeUserTypes(event) {
        let status = false;
        const typeArr = ['sales', 'management', 'admin', 'commercial'];
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            if (typeArr.indexOf(element['text'].toLowerCase()) > -1) {
                status = true;
            }
        }

        this.selectedMultipleUserTypes = [];
        if (event.length) {
            const userTypes = event;
            userTypes.forEach((item) => {
                this.selectedMultipleUserTypes.push(item.id);
            });
        }
    }

    addRegisterdUser() {
        this.userModel = new User();
        if (this.form.valid) {
            Object.assign(this.userModel, this.form.value);
            this.userModel.types = this.selectedMultipleUserTypes;
            this.userModel.lang = this.translate.currentLang.toUpperCase();
            this.userModel.assignedRncpTitles = this.currentLoginUser.assignedRncpTitles;
            this.userModel.civility = this.userModel.sex === 'M' ? 'MR' : 'MRS';
            const civility = this.translate.instant('USERS.ADDEDITUSER.CIVILITY.' + this.userModel.civility);
            const self = this;
            // const
            if (this.modify) {
                const entityValue = this.form.get('entityValue');
                this.userModel.entity.type = entityValue.value;
                this.userModel.operationRoleType =  this.isUserCertifierAdmin ? 'certifier' : 'preparation-center';
                if ( this.userModel.entity.type === 'company') {
                    const company = this.form.get('company');
                    this.userModel.entity.company = company.value;
                }
                this.userModel.entity.school = this.currentLoginUser.entity.school._id;
                this.userModel._id = this.userid;
                log.data('On Edit this.userModel', this.userModel);
                this.service.editRegisteredUser(this.userModel).subscribe(
                    (res) => {
                        if (res) {
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
                                    this.cancel();
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
                                }).then(function () {
                                    this.cancel();
                                }.bind(this));
                            }
                        } else {
                            swal({
                                title: 'Attention',
                                allowEscapeKey: true,
                                text: this.translate.instant('USERS.MESSAGE.USERUPDATEFAILED'),
                                type: 'warning'
                            });
                        }
                    });
            } else {
                this.userModel.createdBy = this.currentLoginUser._id;
                const entityValue = this.form.get('entityValue');
                this.userModel.entity.type = entityValue.value;
                this.userModel.operationRoleType =  this.isUserCertifierAdmin ? 'certifier' : 'preparation-center';
                if ( this.userModel.entity.type === 'company') {
                    const company = this.form.get('company');
                    this.userModel.entity.company = company.value;
                }
                this.userModel.entity.school = this.currentLoginUser.entity.school._id;
                log.data('On Add this.userModel', this.userModel);
                this.service.addUserRegistration(this.userModel).subscribe(res => {
                    if (res) {
                        if (res.code === 200) {
                            swal({
                                title: this.translate.instant('USERS.MESSAGE.ADDTITLE'),
                                text: this.translate.instant('USERS.MESSAGE.USERSAVESUCCESS',
                                    { Civility: civility, FName: self.userModel.firstName, LName: self.userModel.lastName }),
                                type: 'success',
                                allowEscapeKey: true,
                                confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S6.OK'),
                            }).then(function () {
                                this.cancel();
                            }.bind(this));
                        } else {
                            swal({
                                title: this.translate.instant('PARAMETERS-RNCP.CLASSES.MESSAGE.ATTENTION'),
                                text: this.translate.instant(res.message),
                                allowEscapeKey: true,
                                type: 'warning'
                            });
                        }
                    }
                }, (error) => {
                    swal({
                        title: 'Attention',
                        text: this.translate.instant('USERS.MESSAGE.USERSAVEFAILED'),
                        allowEscapeKey: true,
                        type: 'warning'
                    });
                });
            }

        } else {
            if ( this.form.get('entityValue').value === 'company') {
                const company = this.form.get('company');
                company.markAsDirty();
                company.markAsTouched();
            }
            this.formSubmitted = true;
        }

    }

    checkUserType(usertype) {
        const data = this.form.controls['types'].value;
        if (data) {
            return data.some(x => x.text === usertype);
        }
        return false;
    }

    getCompany() {
        const currentUserSchoolId = this.currentLoginUser.entity.school._id;
        this.companyService
          .getCompaniesLinkedToSchool(currentUserSchoolId)
          .subscribe(response => {
            this.companylist  = _.orderBy(
              response.data,
              ['companyName'],
              ['asc']
            );
          });
      }

  changeControlValue(control: AbstractControl, isFirstName = true) {
    control.setValue(this.utilityService.convertNameCasing(control.value, isFirstName));
  }
}
