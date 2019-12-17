import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Student } from '../../../../../models/student.model';
import { AcadStudentDetails } from '../../../../../models/user_academicstudent.model';
import { StudentsService } from '../../../../../services/students.service';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from '../../../../../shared/global-urls';

declare var swal: any;

@Component({
  selector: 'app-completeregistration',
  templateUrl: './completeregistration.component.html',
  styleUrls: ['./completeregistration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {
  public studentRegistrationForm: FormGroup;
  public studInformation: Student;
  public studId;
  public modify: boolean;
  public token: any;
  public guardianNumber: number= 0;
  public filePreviewPath:any='';
  public filePreviewPathDeploma:any= '';


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
  uploaderDeploma: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });

  @ViewChild('userphoto') uploadInput: any;
  @ViewChild('deplomaphoto') uploadInputDeploma: any;


  constructor(private _fb: FormBuilder, private studentsService: StudentsService, public translate: TranslateService, public sanitizer: DomSanitizer, private router: Router) {
    this.studInformation = new Student();
  }

  ngOnInit() {

    const url = location.href,
      arrayUrl = url.split('/');
    this.token = arrayUrl[arrayUrl.length - 1];

   this.studentsService.getStudentInformation(this.token).subscribe((response) => {
      console.log(response);
      if (response.code === 200) {
        this.studInformation = response.data;
        this.studId = response.data._id;
      }
    });

    this.studentRegistrationForm = this._fb.group({
      'photo': [''],
      'photoS3Path': [true],
      'diploma': [''],
      'diplomaS3Path': [''],
      'isDiplomaInS3': [''],
      'isPhotoInS3': [true]
   });




    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.uploader.queue[0].upload();
      this.filePreviewPath  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
    };
    this.uploaderDeploma.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.uploaderDeploma.queue[0].upload();
      this.filePreviewPathDeploma  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
    };


    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log(item, response, status, headers);
      swal({
        title: 'Attention',
        text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey: true,
        type: 'warning'
      });
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      if (res.status === 'OK') {
         console.log('res.data.filepath', res.data.filepath);
         this.studentRegistrationForm.controls['photo'].setValue(res.data.filepath);
         this.studentRegistrationForm.controls['photoS3Path'].setValue(res.data.s3FileName);
      } else {
        console.log(item, response, status, headers);
        swal({
          title: 'Attention',
          text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    };

    this.uploaderDeploma.onErrorItem = (item, response, status, headers) => {
      console.log(item, response, status, headers);
      swal({
        title: 'Attention',
        text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey: true,
        type: 'warning'
      });
    };

    this.uploaderDeploma.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      if (res.status === 'OK') {
        console.log('res.data.filepath', res.data.filepath);
        this.studentRegistrationForm.controls['diploma'].setValue(res.data.filepath);
        this.studentRegistrationForm.controls['diplomaS3Path'].setValue(res.data.s3FileName);
      } else {
        console.log(item, response, status, headers);
        swal({
          title: 'Attention',
          text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    };

  }


  registerStudent(value: any) {
    console.log('form', this.studentRegistrationForm);

    if (this.studentRegistrationForm.valid) {

        console.log('form', this.studentRegistrationForm.value);

        this.studentsService.updateStudent(this.studId, value).subscribe((response) => {
        if (response.code === 200) {
               swal({
                    title: 'Success',
                    html: this.translate.instant('STUDENT_INFORMATION.SUCCESSMESSAGE', {value : response.data.firstName}),
                    type: 'success',
                    allowEscapeKey: true,
                    confirmButtonClass: 'btn-danger',
                    confirmButtonText: this.translate.instant('SUGGESTION.OK'),
                    closeOnConfirm: false,
                }).then(function(isConfirm) {
                  if (isConfirm) {
                      localStorage.removeItem('loginuser');
                      localStorage.removeItem('token');
                      localStorage.removeItem('currentUser');
                      this.router.navigate(['/login']);
                  }
                }.bind(this));

            }else {
               swal({
                title: 'Attention',
                text: this.translate.instant('STUDENT_INFORMATION.FAILEDMESSAGE'),
                allowEscapeKey: true,
                type: 'warning'
            });
            }
      });
    }
  }

  openUploadWindow() {
    this.uploadInput.nativeElement.click();
  }
  openUploadWindowDeploma() {
    this.uploadInputDeploma.nativeElement.click();
  }

  imageUploaded(e) {
    console.log(this.studentRegistrationForm);
  }

}
