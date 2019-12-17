import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Student } from '../../../models/student.model';
import { AcadStudentDetails } from '../../../models/user_academicstudent.model';
import { StudentsService } from '../../../services/students.service';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from '../../../shared/global-urls';
import { emailValidator, matchingPasswords } from '../../../custome-validation/custom-validator';

declare var swal: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public studentRegistrationForm: FormGroup;
  public studInformation: Student;
  public modify: boolean;
  public token: any;
  public guardianNumber: number= 0;
  public filePreviewPath:any='';

  public studiescategories: any = [{ value: 'suggestion-school', viewValue: 'Self Financed' },
    { value: 'suggestion-company', viewValue: 'Sponsered' },
    { value: 'suggestion-content', viewValue: 'School Sponsored' },
    { value: 'suggestion-class-organization', viewValue: 'Compnay Sponsored' }
  ];

  public relations: any = [{ value: 'mother', viewValue: 'Mother' },
    { value: 'father', viewValue: 'Father' },
    { value: 'guardian', viewValue: 'Guardian' },
    { value: 'brother', viewValue: 'brother' },
    { value: 'sister', viewValue: 'sister' }
  ];

  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });

  @ViewChild('userphoto') uploadInput: any;


  constructor(private _fb: FormBuilder, private studentsService: StudentsService, public translate: TranslateService, public sanitizer: DomSanitizer, private router: Router) {
    this.studInformation = new Student();
  }

  ngOnInit() {

    let url = location.href,
      arrayUrl = url.split('/');
    this.token = arrayUrl[arrayUrl.length - 1];

   this.studentsService.getStudentInformation(this.token).subscribe((response) => {
      console.log(response);
      if (response.code === 200) {
        this.studInformation = response.data;
      }
    });

    this.studentRegistrationForm = this._fb.group({
      'handicapped': [this.modify ? this.studInformation.handicapped : false, Validators.required],
      'studiesFinancedBy': [this.modify ? this.studInformation.studiesFinancedBy : '', Validators.required],
      'photo': [this.modify ? this.studInformation.photo : ''],
      'telePhone': [this.modify ? this.studInformation.telePhone : '', Validators.required],
      'cellPhone': [this.modify ? this.studInformation.cellPhone : '', Validators.required],
      'address': this._fb.group({
        'line1': [this.modify ? this.studInformation.address.line1 : '', Validators.required],
        'line2': [this.modify ? this.studInformation.address.line2 : '', Validators.required],
        'postalCode': [this.modify ? this.studInformation.address.postalCode : '', Validators.required],
        'city': [this.modify ? this.studInformation.address.city : '', Validators.required],
        'country': [this.modify ? this.studInformation.address.country : '', Validators.required]
      }),
      'parents': this._fb.array([]),
      'password': [this.modify ? this.studInformation.password : '', [Validators.required, Validators.minLength(6)]],
      'confirmPassword': [this.modify ? this.studInformation.password : '', [Validators.required]]
    }, {
                validator: matchingPasswords('password', 'confirmPassword')
            });

    this.addGuardian(this.guardianNumber);


    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.uploader.queue[0].upload();
      this.filePreviewPath  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
    };


    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log(item, response, status, headers);
      swal({
        title:'Attention',
        text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey:true,
        type: 'warning'
      });
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      if (res.status === 'OK') {
         console.log('res.data.filepath', res.data.filepath);
         this.studentRegistrationForm.controls['photo'].setValue(res.data.filepath);
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

  initGuardianAddress(i) {
      return this._fb.group({
        'relation': [this.modify ? this.studInformation.parents[i].relation : '', Validators.required],
        'name': [this.modify ? this.studInformation.parents[i].name : '', Validators.required],
        'sex': [this.modify ? this.studInformation.parents[i].sex : '', Validators.required],
        'profession': [this.modify ? this.studInformation.parents[i].profession : '', Validators.required],
        'familyName': [this.modify ? this.studInformation.parents[i].familyName : '', Validators.required],
        'address': this._fb.group({
            'line1': [this.modify ? this.studInformation.parents[i].address.line1 : '', Validators.required],
            'line2': [this.modify ? this.studInformation.parents[i].address.line2 : '', Validators.required],
            'postalCode': [this.modify ? this.studInformation.parents[i].address.postalCode : '', Validators.required],
            'city': [this.modify ? this.studInformation.parents[i].address.city : '', Validators.required],
            'country': [this.modify ? this.studInformation.parents[i].address.country : '', Validators.required]
        }),
        'telePhone': [this.modify ? this.studInformation.parents[i].telePhone : '', Validators.required],
        'email': [this.modify ? this.studInformation.parents[i].email : '', [Validators.required,Validators.email]]
      });
  }

  addGuardian(i: number) {
        const control = <FormArray>this.studentRegistrationForm.controls['parents'];
        this.guardianNumber= this.guardianNumber +1;
        const addrCtrl = this.initGuardianAddress(this.guardianNumber);
        control.push(addrCtrl);
  }

  removeGuardian(i: number) {
        this.guardianNumber= this.guardianNumber-1;
        const control = <FormArray>this.studentRegistrationForm.controls['parents'];
        control.removeAt(i);
  }

  registerStudent(value: any) {
    console.log('form', this.studentRegistrationForm);

    if(this.studentRegistrationForm.valid){

        console.log('form', this.studentRegistrationForm);

        this.studentsService.registerStudent(value, this.token).subscribe((response)=>{
        if (response.code == 200) {
               swal({
                    title: "Success",
                    html: this.translate.instant('STUDENT_INFORMATION.SUCCESSMESSAGE', {value : response.data.firstName}),
                    type: "success",
                    allowEscapeKey:true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: this.translate.instant('SUGGESTION.OK'),
                    closeOnConfirm: false,
                }).then(function(isConfirm) {
                  if (isConfirm) {
                      localStorage.removeItem("loginuser");
                      localStorage.removeItem("token");
                      localStorage.removeItem("currentUser");
                      this.router.navigate(['/login']);
                  }
                }.bind(this));

            }else{
               swal({
                title:'Attention',
                text:this.translate.instant('STUDENT_INFORMATION.FAILEDMESSAGE'),
                allowEscapeKey:true,
                type:'warning'
               });
            }
      });
    }
  }

  openUploadWindow() {
    this.uploadInput.nativeElement.click();
  }

  imageUploaded(e) {
    console.log(this.studentRegistrationForm);
  }

}
