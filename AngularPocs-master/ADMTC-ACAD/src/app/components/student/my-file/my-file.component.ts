  import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
  import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
  import { Router } from '@angular/router';
  import { FormGroup, FormArray, FormBuilder, Validators, EmailValidator } from '@angular/forms';
  import { TranslateService } from 'ng2-translate';
  import { Student } from '../../../models/student.model';
  import { AcadStudentDetails } from '../../../models/user_academicstudent.model';
  import { StudentsService } from '../../../services/students.service';
  import { FileUploader } from 'ng2-file-upload';
  import { FileUpload, Files, DownloadAnyFileOrDocFromS3 } from '../../../shared/global-urls';
  import { ApplicationUrls } from '../../../shared/settings';
  import { emailValidator, matchingPasswords } from '../../../custome-validation/custom-validator';

  declare var swal: any;

  @Component({
    selector: 'app-my-file',
    templateUrl: './my-file.component.html',
    styleUrls: ['./my-file.component.css'],
  })
  export class MyFileComponent implements OnInit {
    public studentRegistrationForm: FormGroup;
    public studInformation: Student;
    public studId;
    public modify: boolean;
    public token: any;
    public guardianNumber = 0;
    public filePreviewPath: SafeUrl = '';
    public filePreviewPathDeploma: SafeUrl = '';
    public student;
    userId: string;
    lastDiplomaObtainedTitle = '';
    lastDiplomaObtainedFile = '';
    isImage = false;
    serverimgPath = ApplicationUrls.baseApi;
    viewFilePath = '';
    s3FilePath = DownloadAnyFileOrDocFromS3.download;

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
    user;

    constructor(private _fb: FormBuilder,
                private studentsService: StudentsService,
                public translate: TranslateService,
                public sanitizer: DomSanitizer,
                private router: Router) {
      this.studInformation = new Student();
    }

    ngOnInit() {

      this.studentRegistrationForm = this._fb.group({
        'photo': [''],
        'diploma': [''],
        'lastObtainedDiploma': [''],
        'photoS3Path': [''],
        'diplomaS3Path': [''],
        'isDiplomaInS3': [false],
        'isPhotoInS3': [false]
       });

      this.user = localStorage.getItem('loginuser');
      if (this.user !== undefined && this.user) {
          this.user = JSON.parse(this.user);
          this.studInformation = this.user;
          this.userId = this.user._id;
          const emailId = this.studInformation.email;
          // this.studId = '5a2b8445b9b8b11f77496797'; //this.s
          this.studentsService.getStudentIdByEmail(emailId)
            .subscribe( student => {
              console.log( 'email res', student);
              this.student = student.data;
              this.filePreviewPath = this.student.isPhotoInS3 ? this.s3FilePath + encodeURI(this.student.photoS3Path) : this.serverimgPath + student.data.photo;
              if (student.data.photo == '') {
              this.studentRegistrationForm.get('photo').setValue(student.data.photo);
              }
              if (this.student.isPhotoInS3) {
                this.studentRegistrationForm.get('photoS3Path').setValue(this.student.photoS3Path);
                this.studentRegistrationForm.get('isPhotoInS3').setValue(this.student.isPhotoInS3);
              }
              if (student.data.diploma !== '' ) {
                this.lastDiplomaObtainedFile = this.trimFileName(student.data.diploma);
                this.lastDiplomaObtainedTitle = student.data.lastObtainedDiploma;
                this.studentRegistrationForm.get('diploma').setValue(student.data.diploma);
                if (this.student.isPhotoInS3) {
                  this.studentRegistrationForm.controls['diplomaS3Path'].setValue(this.student.diplomaS3Path);
                  this.studentRegistrationForm.controls['isDiplomaInS3'].setValue(this.student.isDiplomaInS3);
                }
                if (this.student.isDiplomaInS3) {
                  this.viewFilePath = this.student.diplomaS3Path;
                  this.lastDiplomaObtainedFile = this.trimFileName(student.data.photoS3Path);

                } else {
                  this.viewFilePath = student.data.diploma;
                }
                let fileName = '';
                if (student.data.diplomaS3Path){
                   fileName = student.data.diplomaS3Path.split('.').pop();
                }else{
                  fileName = student.data.diploma.split('.').pop();
                }
                
                if (fileName !== 'jpg' && fileName !== 'jpeg' && fileName !== 'gif' && fileName !== 'svg' && fileName !== 'png') {
                  console.log('inside Not image');
                  this.filePreviewPathDeploma = 'assets/images/noimage.png';
                } else {
                  console.log('Inside Image');
                  if (this.student.isDiplomaInS3) {
                    this.filePreviewPathDeploma = this.s3FilePath + encodeURI(this.student.diplomaS3Path);
                  } else {
                    this.filePreviewPathDeploma = this.serverimgPath + student.data.diploma;
                  }
                }
              }
            });
      }else {
        this.router.navigate(['/login']);
      }

      this.uploader.onAfterAddingFile = (file) => {
        file.withCredentials = false;
        this.uploader.queue[0].upload();
        this.filePreviewPath  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      };

      this.uploaderDeploma.onAfterAddingFile = (file) => {
        let fileName = file._file.name.split('.').pop();
        console.log('fileName',fileName);
        file.withCredentials = false;
        this.uploaderDeploma.queue[0].upload();

        if (fileName !== 'jpg' && fileName !== 'jpeg' && fileName !== 'gif' && fileName !== 'svg' && fileName !== 'png'){
          console.log('inside Not image');
          this.filePreviewPathDeploma = 'assets/images/noimage.png';
        }else {
          console.log('Inside Image');
          this.filePreviewPathDeploma  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
        }

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
           this.studentRegistrationForm.controls['isPhotoInS3'].setValue(true);
           this.uploader.clearQueue();
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
           this.studentRegistrationForm.controls['isDiplomaInS3'].setValue(res.data && !!res.data.s3FileName);
           this.student.isDiplomaInS3 = res.data && !!res.data.s3FileName;
           this.uploaderDeploma.clearQueue();
           // this.studentRegistrationForm.controls['lastDeploma'].setValue(res.data.filepath);
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

          console.log('form', this.studentRegistrationForm);

          this.studentsService.updateStudent(this.student._id, this.studentRegistrationForm.value).subscribe((response) => {
          if (response) {
                  this.viewFilePath = response.diploma;
                  this.lastDiplomaObtainedFile = this.trimFileName(response.diploma);
                  this.lastDiplomaObtainedTitle = response.lastObtainedDiploma;
                  this.uploader.clearQueue();
                  this.uploaderDeploma.clearQueue();
                 swal({
                      title: this.translate.instant('STUDENT.MESSAGE.SUCCESS'),
                      html: this.translate.instant('STUDENT_INFORMATION.COMPLETEREGISTRATION'),
                      type: 'success',
                      confirmButtonClass: 'btn-danger',
                      allowEscapeKey: true,
                      confirmButtonText: this.translate.instant('SUGGESTION.OK'),
                      closeOnConfirm: false,
                  }).then(function(isConfirm) {
                         this.router.navigate(['/mailbox']);
                  }.bind(this));

              }else{
                 swal({
                  title: 'Attention',
                  text: this.translate.instant('STUDENT.MESSAGE.FAILEDMESSAGE'),
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

    trimFileName( toTrim: string ){
      const trimArray = toTrim.split('_');
      console.log( 'trimArray', trimArray );
      toTrim = '';
      trimArray.forEach( (element, i) => {
        if ( i > 0 ) {
          if ( i === 1 ) {
          toTrim = element ;
          } else {
            toTrim = toTrim + '_' + element ;
          }
        }
      });

      return toTrim;
    }

    viewDocument() {
      const a = document.createElement('a');
      a.target = 'blank';
      if (this.student.isDiplomaInS3) {
        a.href = DownloadAnyFileOrDocFromS3.download + this.student.diplomaS3Path;
      } else {
        a.href = Files.url + this.student.diploma;
      }
      a.click();
    }
  }

