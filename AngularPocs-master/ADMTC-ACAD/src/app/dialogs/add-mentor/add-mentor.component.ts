import { Component, OnInit, ViewChild, Inject, Optional } from '@angular/core';
import { UserService } from '../../services/users.service';
import { CompanyService } from '../../services/company.service';
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
import { MdDialog, MdDialogConfig, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { emailValidator, matchingPasswords } from '../../custome-validation/custom-validator';
import { AddCompanyDialogComponent } from '../add-company-dialog/add-company-dialog.component';
import { LoginService } from '../../services/login.service';
import { UtilityService } from '../../services/utility.service';
declare var swal: any;

// required for logging
import { Log } from "ng2-logger";
const log = Log.create("AddMentorComponent");
log.color = "pink";

@Component({
    selector: 'app-add-mentor',
    templateUrl: './add-mentor.component.html',
    styleUrls: ['./add-mentor.component.scss'],
    //host: {
    //    '(document:keydown)': 'handleKeyboardEvents($event)'
    //}
})
export class AddMentorComponent implements OnInit {
/*************************************************************************
 *   VARIABLES
*************************************************************************/
    @ViewChild('uploadFileControl') uploadInput: any;
    form: FormGroup;
    public modify: boolean;
    loginUser: number;
    allUser: any[];
    userTypes: any = [];
    RNCPTitles: any = [];
    mentorTypeId :string = "";
    userType: any;
    selectedCompany = '';
    preparationCenter1: any = [];
    academicStaffUser: AcademicStaffUser;
    academicAdministratorUser: AcademicAdministratorUser;
    student: Student;
    correctorUser: CorrectorUser;
    userRoles: any = [];
    reportToUsers: any = [];
    public user: User;
    //	public mentor : Mentor ;
    public userid: string;
    selectedUserType: any;
    currentLoginUser = '';
    classType: any = [];
    resumeErrorMessage: any = false;
    types: UserTypesModel[] = [];
    uploader: FileUploader = new FileUploader({
        url: FileUpload.uploadUrl,
        isHTML5: true,
        disableMultipart: false
    });
    customerId;
    formSubmit = false;



    sexType = [
        { value: 'M', view: 'Male' },
        { value: 'F', view: 'Female' }
    ];
    configCat: MdDialogConfig = {
        disableClose: false,
        width: '900px'
        //width: '400px',
        //height: '635px'
    };

    currentUser;
    // New Things
    tempType: UserTypesModel[] = [];
    userModel: User;
    //userModel: any;
    selectedMultipleUserTypes: any = [];
    public isADMTC: boolean = false;
    companylist = [];
    userEntities = [
        { value: 'academic', view: this.translate.instant('ENTITY.ACADEMIC') },
        { value: 'company', view: this.translate.instant('ENTITY.COMPANY') },
        { value: 'admtc', view: this.translate.instant('ENTITY.ADMTC') }
    ]

    addCompanyDialog: MdDialogRef<AddCompanyDialogComponent>;
    @Optional() @Inject(MD_DIALOG_DATA) public dialogData: any;

/*************************************************************************
 *   CONSTRUCTOR
*************************************************************************/
    constructor(
        private dialogRef: MdDialogRef<AddMentorComponent>,
        private service: UserService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private dialog: MdDialog,
        private companyService: CompanyService,
        private _login : LoginService,
        private utilityService: UtilityService) {
    }

 /*************************************************************************
   *   EVENTS
   *************************************************************************/
    ngOnInit() {
        //this.currentLoginUser = this.service.getRole();
        // New Things

        this.currentUser = this._login.getLoggedInUser();
        this.mentorTypeId = this.service.getMentorTypeId();

        // New Things
        if (this.userid !== undefined) {
            this.modify = true;
            this.service.getRegisterUserById(this.userid).subscribe(response => {
                this.userModel = new User();
                this.modify = true;
                this.userModel = response;
                if (this.userModel.entity.type !== 'admtc') {
                    this.isADMTC = false;
                }
                this.initializeFormGroup();
            });
        }
        else {
            this.modify = false;
            this.initializeFormGroup();
        }
        //end File upload
        if(this.companylist.length === 0){
            this.getCompany();
        }
    }

    cancel(data) {
        this.dialogRef.close(data);
    }

    cancelForm() {
        this.dialogRef.close();
    }

    handleKeyboardEvents(event: KeyboardEvent) {
        if (event.keyCode === 27) {
            this.cancelForm();
        }
    }

    initializeFormGroup() {
        this.form = this.fb.group({
            entityValue: ['company', [Validators.required]],
            firstName: [this.modify ? this.userModel.firstName : '', [Validators.required, Validators.maxLength(40)]],
            lastName: [this.modify ? this.userModel.lastName : '', [Validators.required, Validators.maxLength(40)]],
            email: [this.modify ? this.userModel.email : '', [Validators.required, Validators.email]],
            types: [[this.mentorTypeId], Validators.required],
            company: [this.modify ? this.userModel.entity.company : '', Validators.required],
            officePhone: [this.modify ? this.userModel.officePhone : ''],
            directLine: [this.modify ? this.userModel.directLine : ''],
            position: [this.modify ? this.userModel.position : ''],
            portablePhone: [this.modify ? this.userModel.portablePhone : ''],
            school: [this.customerId, [Validators.required]],
            sex: ['M', [Validators.required]],
            operationRoleType: [''],
            assignedRncpTitles: [[]]
        });

    }

    addRegisterdUser() {
        this.form.get('types').setValue([this.mentorTypeId]);
        this.userModel = new User();
        if (this.form.valid) {
            const companyId = this.companylist.find(element =>
                element.companyName === this.selectedCompany
            )._id;
            this.userModel.entity.company = companyId;
            this.userModel.entity.type = 'company';
            this.userModel.entity.school = this.form.get('school').value;
            this.userModel.civility = this.form.controls['sex'].value === 'M' ? "MR" : "MRS";
            const civility = this.translate.instant('USERS.ADDEDITUSER.CIVILITY.' + this.userModel.civility);
            Object.assign(this.userModel, this.form.value);
            this.userModel.createdBy = this.currentUser._id;
            this.userModel.lang = this.translate.currentLang.toUpperCase();
            this.mentorTypeId = this.service.getMentorTypeId();
            this.userModel.types = [this.mentorTypeId];
            log.data('addRegisterdUser this.userModel.types', this.userModel.types );
            this.service.addUserRegistration(this.userModel).subscribe(response => {
                if (response) {
                    if (response.code === 200) {
                        swal({
                            title: this.translate.instant('USERS.MESSAGE.SUCCESS'),
                            text: this.translate.instant('USERS.MESSAGE.USERSAVESUCCESS',{
                              Civility: civility,
                              LName: this.userModel.lastName,
                              FName: this.userModel.firstName
                            }),
                            type: 'success',
                            allowEscapeKey:true,
                            confirmButtonText: this.translate.instant('USERS.MESSAGE.OK')
                        }).then(function () {
                            this.cancel(response);
                        }.bind(this));
                    }
                    else {
                        // var response = res.message.toLowerCase();
                        if (response.message) {
                            let resp = this.translate.instant(response.message);
                            if (response.message.toLowerCase() 
                            === 'user already exists: user with same portable phone number already registered.' ) {
                                resp = this.translate.instant('USERS.MESSAGE.USERSPHONEPRESENT');
                            }
                            swal({
                                title: 'Attention',
                                text: resp,
                                type: 'warning',
                                allowEscapeKey:true,
                                confirmButtonText: this.translate.instant('USERS.MESSAGE.OK')
                            });
                        } else if( response === 'user already exists: user with same portable phone number already registered.') {
                            swal({
                                title: 'Attention',
                                text: this.translate.instant('USERS.MESSAGE.USERSPHONEPRESENT'),
                                type: 'warning',
                                allowEscapeKey:true,
                                confirmButtonText: this.translate.instant('USERS.MESSAGE.OK')
                            });
                        }
                    }
                }
            }, (error) => {
                swal({
                    title: 'Attention',
                    text: this.translate.instant('USERS.MESSAGE.USERSAVEFAILED'),
                    allowEscapeKey:true,
                    type: 'warning'
                });
            });


        }
    }

    getCompany() {
        this.companyService.getCompanies().subscribe((response) => {
            this.companylist = response.data;
        });
    }
    addNewCompany() {
        this.addCompanyDialog = this.dialog.open(AddCompanyDialogComponent, this.configCat);
        this.addCompanyDialog.afterClosed().subscribe((companyValues) => {
            if (companyValues != undefined) {
                this.companylist = this.companyService.addCompany(companyValues);
            }
        });
    }

    changeControlValue(control: AbstractControl, isFirstName = true) {
        control.setValue(this.utilityService.convertNameCasing(control.value, isFirstName));
      }
}


