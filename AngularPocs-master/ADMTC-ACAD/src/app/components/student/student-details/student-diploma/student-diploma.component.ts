import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload, Files, DownloadAnyFileOrDocFromS3 } from '../../../../shared/global-urls';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';
import { StudentsService } from 'app/services/students.service';
import { ApplicationUrls } from '../../../../shared/settings';
import { LoginService } from '../../../../services/login.service';

declare var swal: any;

// required for logging
import { Log } from 'ng2-logger';
const log = Log.create('StudentDiplomaComponent');
log.color = 'blue';

@Component({
  selector: 'app-student-diploma',
  templateUrl: './student-diploma.component.html',
  styleUrls: ['./student-diploma.component.css']
})
export class StudentDiplomaComponent implements OnInit, OnChanges {

/*************************************************************************
 *   VARIABLES
*************************************************************************/
  @ViewChild('deplomaphoto') uploadInputDeploma: any;
  @Input() studentWithDiploma;
  @Output() updateStudent: EventEmitter<object> = new EventEmitter();
  canSubmit;
  serverimgPath = ApplicationUrls.baseApi;
  viewFilePath: string = '';
  canView: boolean = false;

  uploaderDeploma: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });
  isFileUploaded: boolean = false;
  studentRegistrationForm: FormGroup;
  public filePreviewPathDeploma:any='';
  incomingDiplomaDetails;
  lastDiplomaObtainedTitle: string = '';
  lastDiplomaObtainedfile: string;
  isMentor: boolean = false;
/*************************************************************************
 *   CONSTRUCTOR
*************************************************************************/
  constructor( private fb: FormBuilder,
    public translate: TranslateService,
    public sanitizer: DomSanitizer,
    private studentsService: StudentsService,
    private loginService: LoginService ) {
      log.data('Constructor Invoked');
      this.studentRegistrationForm = this.fb.group({
        'diploma': [''],
        'lastObtainedDiploma': [''],
        'diplomaS3Path': [''],
        'isDiplomaInS3': [false],
       });
  }

/*************************************************************************
  *   EVENTS
*************************************************************************/
  ngOnInit() {
     this.uploaderDeploma.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.isFileUploaded = true;
      this.filePreviewPathDeploma  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
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
       this.studentWithDiploma.isDiplomaInS3 = res.data && !!res.data.s3FileName;
       this.registerStudent( this.studentRegistrationForm.value);
       this.uploaderDeploma.clearQueue();
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

  ngOnChanges(chnages: SimpleChanges) {
    const currentUser = this.loginService.getLoggedInUser();
    const currentLoginUserType = currentUser && currentUser.types && currentUser.types[0] ? currentUser.types[0].name : '' ;
    if (this.studentWithDiploma.diploma !== '' && this.studentWithDiploma.diplomaS3Path == '') {
      this.canView = true;
      this.isFileUploaded = false;
      this.viewFilePath = this.studentWithDiploma.diploma;
      this.lastDiplomaObtainedTitle = this.studentWithDiploma.lastObtainedDiploma;
      this.lastDiplomaObtainedfile = this.trimFileName(this.studentWithDiploma.diploma);
    } else if (this.studentWithDiploma.diplomaS3Path !== ''){
      this.canView = true;
      this.isFileUploaded = false;
      this.viewFilePath = this.studentWithDiploma.diplomaS3Path;
      this.lastDiplomaObtainedTitle = this.studentWithDiploma.lastObtainedDiploma;
      this.lastDiplomaObtainedfile = this.trimFileName(this.studentWithDiploma.diplomaS3Path);
    } else {
      this.canView = false;
      this.isFileUploaded = false;
      this.viewFilePath = '';
      this.lastDiplomaObtainedTitle = '';
      this.lastDiplomaObtainedfile = '';
      // this.studentRegistrationForm.reset();
    }

    // Disable the Form If User Is Mentor
    if ( currentLoginUserType === 'mentor') {
      this.studentRegistrationForm.disable();
      this.isMentor = true;
    } else {
      this.studentRegistrationForm.enable();
      this.isMentor = false;
    }
  }


/*************************************************************************
*   METHODS
*************************************************************************/
  registerStudent(value: any) {
    console.log('form', this.studentRegistrationForm);
    // const studentWithDiploma = this.studentWithDiploma;
    // value.lastObtainedDiploma = value.lastObtainedDiploma;
    // studentWithDiploma.rncpShortName + '-'
    //                           + studentWithDiploma.firstName + studentWithDiploma.lastName + '-'
    //                           + 'DDO-' +
    log.data( 'Value to Post',value )
    if (this.studentRegistrationForm.valid){
        console.log('form', this.studentRegistrationForm);
        this.studentsService.updateStudent(this.studentWithDiploma.studentId,value)
        .subscribe((response)=>{
          console.log( response);
          this.updateStudent.emit(response);
          this.studentWithDiploma.diplomaS3Path  = response.diplomaS3Path;
          this.viewFilePath = response.diploma;
          this.lastDiplomaObtainedTitle = response.lastObtainedDiploma;
          this.lastDiplomaObtainedfile = this.trimFileName(response.diploma);
          this.canView = true;
          this.isFileUploaded = false;
        if (response) {
               swal({
                    title: 'Success',
                    html: this.translate.instant('STUDENT_INFORMATION.SUCCESSMESSAGE', {
                      Civility: response.civility,
                      LName: response.lastName,
                      FName: response.firstName
                    }),
                    type: 'success',
                    confirmButtonClass: 'btn-danger',
                    allowEscapeKey: true,
                    confirmButtonText: this.translate.instant('SUGGESTION.OK'),
                    closeOnConfirm: false,
                }).then(function(isConfirm) {
                  if (isConfirm) {
                      // localStorage.removeItem("loginuser");
                      // localStorage.removeItem("token");
                      // localStorage.removeItem("currentUser");
                  }
                }.bind(this));

            }else{
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

  openUploadWindowDeploma() {
    this.uploadInputDeploma.nativeElement.click();
  }

  clearUploadQueue() {
    this.uploaderDeploma.clearQueue();
    this.uploadInputDeploma.nativeElement.value = '';
  }

  upload(){
    // if (this.studentRegistrationForm.valid) {
      log.data('lastObtainedDiploma valid',this.studentRegistrationForm.controls['lastObtainedDiploma'].valid );
      log.data('This upload() called')
      // this.uploaderDeploma.onAfterAddingFile = (file) => {
        // file.withCredentials = false;
        this.uploaderDeploma.queue[0].upload();
        // this.filePreviewPathDeploma  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      //  };
      // this.uploaderDeploma.queue[0].upload();
      //  this.filePreviewPathDeploma  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
    // } else {
      // this.studentRegistrationForm.controls['documentName'].markAsTouched();
      // this.studentRegistrationForm.controls['documentType'].markAsTouched();
    // }
  }

  viewDocument() {
    const a = document.createElement('a');
    a.target = 'blank';
    if (this.studentWithDiploma.isDiplomaInS3) {
      a.href = this.studentWithDiploma.diplomaS3Path ?
              encodeURI(DownloadAnyFileOrDocFromS3.download + this.studentWithDiploma.diplomaS3Path) :
              encodeURI(DownloadAnyFileOrDocFromS3.download + this.studentRegistrationForm.controls['diplomaS3Path'].value);
    } else {
      a.href = Files.url + encodeURI(this.viewFilePath);
    }
    a.click();
  }

    trimFileName( toTrim: string ) {
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
}
