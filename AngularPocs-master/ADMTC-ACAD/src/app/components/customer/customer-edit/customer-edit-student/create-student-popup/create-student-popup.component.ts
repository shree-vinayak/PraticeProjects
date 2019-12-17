import { OldUser } from './../../../../../models/user-old.model';
import { Component, OnInit, Input, ViewChild, NgZone, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { CustomValidators } from 'ng2-validation';
import { AddClassDialogComponent } from '../../../../../dialogs/add-class-dialog/add-class-dialog.component';
import { AddCompanyDialogComponent } from '../../../../../dialogs/add-company-dialog/add-company-dialog.component';

import { User } from '../../../../../models/user.model';
import { RNCPTitlesService } from '../../../../../services/rncp-titles.service';
import { UserService } from '../../../../../services/users.service';
import { CompanyService } from '../../../../../services/company.service';
import { StudentsService } from '../../../../../services/students.service';
import { Student } from '../../../../../models/student.model';
import { Company } from '../../../../../models/company.model';
import { TranslateService } from 'ng2-translate';
import { emailValidator, matchingPasswords } from '../../../../../custome-validation/custom-validator';

declare var swal: any;
@Component({
  selector: 'app-create-student-popup',
  templateUrl: './create-student-popup.component.html',
  styleUrls: ['./create-student-popup.component.scss']
})

export class CreateStudentPopupComponent implements OnInit {
    //rncpTitleID: any;
    form: FormGroup;
    public modify: boolean;
    selectedSchoolRNCPTitle: boolean = false;
    nonAcademic: boolean = true;
    student: Student;
    preparationCenter1: any = [];
    userid: string;
    user: OldUser;
    RNCPTitles: any = [];
    companylist: Company[] = [];
    currentLoginUser: any = "";
    maxDate: any;

    sexType: any = [
        { value: 'Male', view:  'STUDENT_INFORMATION.GENDER.MALE'},
        { value: 'Female', view: 'STUDENT_INFORMATION.GENDER.FEMALE' }
    ];

    classType: any = [];

    configCat: MdDialogConfig = {
        disableClose: false,
        width: '900px'
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


    addCompanyDialog: MdDialogRef<AddCompanyDialogComponent>;

    constructor(private dialogPC: MdDialogRef<CreateStudentPopupComponent>,
         @Inject(MD_DIALOG_DATA) public data: any,
         private route: ActivatedRoute,
         private zone: NgZone,
         private dialog: MdDialog,
         private fb: FormBuilder,
         private appService: RNCPTitlesService,
         private studentService: StudentsService,
         private service: UserService,
         private router: Router,
         private formBuilder: FormBuilder,
         private translate: TranslateService, private companyService: CompanyService) {
            console.log('custom id', this.data.customerId);
            this.maxDate = new Date();

    }

    handleKeyboardEvents(event: KeyboardEvent) {
        //if (event.keyCode == 27)
        //{

        //}
        //console.log(event.which || event.keyCode);
    }

    minDate(){
          var now = new Date();
          return new Date(
            now.getFullYear() - 2,
            now.getMonth(),
            now.getDate()
          );
    }


    getCompany() {
        this.companylist = this.companyService.getCompany();
    }

    ngOnInit() {

        this.currentLoginUser = this.service.getRole();

        this.service.getAllRNCPTitles().subscribe((response)=>{
            this.RNCPTitles = response.data;
        });

        this.service.getAllPreparationCenter().subscribe((response) => {
            this.preparationCenter1 = response.data
        })

        this.getCompany();
        let user = JSON.parse(localStorage.getItem('loginuser'));
        if(user.entity.type === 'academic'){
            this.nonAcademic = false;
        }


        this.initializeFormGroup();
    }

    initializeFormGroup() {
        this.form = this.fb.group({
            firstName: [this.modify ? this.student.firstName : '', [Validators.required, Validators.maxLength(40)]],
            lastName: [this.modify ? this.student.lastName : '', [Validators.required, Validators.maxLength(40)]],
            email: [this.modify ? this.student.email : '', [Validators.required, Validators.email]],
            rncpTitle: [this.modify ? this.student.rncpTitle : '', Validators.required],
            school: this.data.customerId,
            currentClass: [this.modify ? this.student.currentClass : '', Validators.required],
            previousClasses : [this.modify ? this.student.previousClasses : []],
            sex: [this.modify ? this.student.sex : 'Male', Validators.required],
            dateOfBirth: [this.modify ? this.student.dateOfBirth : '', Validators.required],
            placeOfBirth: [this.modify ? this.student.placeOfBirth : '', [Validators.required, Validators.maxLength(40)]],
            nationality: [this.modify ? this.student.nationality : '', [Validators.required, Validators.maxLength(40)]],
            companies: [this.modify ? this.student.companies : []]
            });
    }

    getAllClass() {
        this.service.getAllClass().subscribe((response) => {
            this.classType = response.data;
        });
    }


    getRandomNumberForStudentRef() {
        return "RNCP" + Math.floor(100000 + Math.random() * 900000);
    }

    addUser(value:any): void {
        if (this.form.valid) {
            this.addUserFunction(value);
        }
    }

    addUserFunction(value:any) {
        console.log('student', value);
        this.studentService.addStudent(value).subscribe(res => {
            console.log(res);
            if (res.code == 200) {
                let regUrl = location.origin + '/student/registration/' + res.data.token;
                swal({
                    title: `Success`,
                    html: `<p>`
                    + this.translate.instant('STUDENT_INFORMATION.SUCCESSMESSAGE', {value : value.firstName})
                    + `</p><br><a href='` + regUrl + `'>` + regUrl + `</a>`,
                    type: "success",
                    allowEscapeKey:true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: this.translate.instant('SUGGESTION.OK'),
                    closeOnConfirm: false,
                }).then(function(isConfirm) {
                  if (isConfirm) {
                     this.dialogPC.close();
                     this.router.navigate(['/student/registration/'+ res.data.token]);
                     console.log('Go to registration url');
                  } else {
                    this.cancel();
                  }
                }.bind(this));
            }else{
               swal({
                title:'Attention',
                text:this.translate.instant('USERS.MESSAGE.USERSAVEFAILED'),
                allowEscapeKey:true,
                type:'warning'
               });
            }
        }, (error) => {
            swal({
                title:'Attention',
                text:this.translate.instant('USERS.MESSAGE.USERSAVEFAILED'),
                allowEscapeKey:true,
                type:'warning'
            });
        });
    }

    addNewClass() {
        this.addClassDialog = this.dialog.open(AddClassDialogComponent, {disableClose: true,
        width: '400px', data: this.form.controls.rncptitle.value});
        this.addClassDialog.afterClosed().subscribe((newClassName) => {
            if (newClassName != undefined) {
                let className = this.form.get("class");
                if (className != null && className != undefined) {
                    console.log("newclass");
                    console.log(newClassName);
                    this.getAllClass();
                    className.setValue(newClassName._id);
                }
            }
        });
    }

    addNewCompany() {
        this.addCompanyDialog = this.dialog.open(AddCompanyDialogComponent, this.configCat);
        this.addCompanyDialog.afterClosed().subscribe((companyValues) => {
            if (companyValues != undefined) {
                this.companylist = this.companyService.addCompany(companyValues);
                let company = this.form.get("company");
                if (company != null && company != undefined) {
                    company.setValue(companyValues.companyName);
                }
            }
        });
    }

    cancel() {
        this.dialogPC.close({});
    }

    changeRNCPTitles(e){
      let school_id = this.data.customerId;
      let rncp_title_id = e.value;

      console.log('form', this.form);

      // Production
       this.studentService.getAllClassesRNCPTitle(rncp_title_id).subscribe((response) => {
        this.selectedSchoolRNCPTitle= true;
        this.classType = response.data;
      });

    }
}
