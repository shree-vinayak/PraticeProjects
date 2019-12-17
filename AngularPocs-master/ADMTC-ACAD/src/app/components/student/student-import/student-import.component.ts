import { ApplicationUrls } from './../../../shared/settings';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { TranslateService } from "ng2-translate";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Observable } from "rxjs/Rx";
import { StudentsService } from "../../../services/students.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ScholarSeasonService } from '../../../services/scholar-season.service';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload, Files, Print } from '../../../shared/global-urls';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LoginService } from '../../../services/login.service';


// required for logging
import { Log } from "ng2-logger";
const log = Log.create("StudentImportComponent");
log.color = "blue";

declare var swal: any;

@Component({
  selector: 'app-student-import',
  templateUrl: './student-import.component.html',
  styleUrls: ['./student-import.component.scss']
})
export class StudentImportComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  formCourse: FormGroup;
  formCourseSubmit: boolean = false;
  public scholarSeasonData = [];
  public RNCPTitles = [];
  public classesOfRNCP = [];
  schoolId = '';
  filePreviewPath: SafeUrl = '';
  @ViewChild('importFile') importFile: any;
  fileUploader: FileUploader ;
  isFileUploaded = false;
  uploadedFileName = '';
  fileNameToShow = '';
  selectedIndexForStudentsTab: number = 1;
  delimeterList = [
                    { key: 'COMMA', value: ',' },
                    { key: 'SEMICOLON', value: ';' },
                    { key: 'TAB', value: '|' }
                  ];
  // For Getting Comma Separated Import Student CSV Template when no delimiter is selected
  templateCSVDownloadName: string = 'comma';

  /*************************************************************************
   *   CONSTRUCTOR
   *************************************************************************/
  constructor(
    private translate: TranslateService,
    private studentService: StudentsService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private scholarservice: ScholarSeasonService,
    public sanitizer: DomSanitizer,
    private loginService: LoginService
  ) {}

  /*************************************************************************
   *   EVENTS
   *************************************************************************/
  ngOnInit() {
    this.initializeCourseForm();

    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('schoolId')) {
        this.schoolId = params['schoolId'];
      } else {
      }
    });

    const token = this.loginService.getToken();
    const uploadUrl = ApplicationUrls.academic.importStudentUpload + this.schoolId +
                     '?token=' + token + '&type=student';

    this.fileUploader = new FileUploader({
      url: uploadUrl,
      isHTML5: true,
      disableMultipart: false
    });

    this.scholarservice.getAssociatedscholerSeason(this.schoolId).subscribe(
      (data: any) => {
        if(data && data.length > 0){
          this.scholarSeasonData = [];
          for (const element of data) {
            if (element.scholarseason) {
              this.scholarSeasonData.push(element);
            }
          }}
      },
      (error: Response) => log.data('scholarservice.getAssociatedscholerSeason error', error)
    );


    this.fileUploader.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.fileNameToShow = file.file.name;
      const fileExtension = file.file.name.split('.').pop();
      if ( fileExtension.toLowerCase() === 'csv' ) {
        this.fileUploader.queue[0].upload();
        this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file._file)
        );
      } else {
        var self = this;
        swal({
          title: this.translate.instant('STUDENT_IMPORT.UPLOAD_RESTRICT_TO_CSV.TITLE'),
          text: this.translate.instant('STUDENT_IMPORT.UPLOAD_RESTRICT_TO_CSV.TEXT'),
          allowEscapeKey: true,
          confirmButtonText: this.translate.instant('STUDENT_IMPORT.UPLOAD_RESTRICT_TO_CSV.BUTTON'),
          type: 'error'
        }).then(function () {
          self.resetForm();
        }.bind(this));
      }
    };

    this.fileUploader.onErrorItem = (item, response, status, headers) => {
      swal({
        title: 'Attention',
        text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey: true,
        type: 'warning'
      });
    };

    this.fileUploader.onSuccessItem = (item, response, status, headers) => {
      this.isFileUploaded = true;
      const refileUploaderResponse = JSON.parse(response);
      this.uploadedFileName = refileUploaderResponse.data.fileName;
      this.fileUploader.clearQueue();
    };
  }

  /*************************************************************************
   *   METHODS
   *************************************************************************/

   initializeCourseForm() {
    this.formCourse = this._formBuilder.group({
      scholarSeason: ['', Validators.required],
      rncpTitle: ['', Validators.required],
      currentClass: ['', Validators.required],
      fileDelimeter : ['', Validators.required]
    });
  }

  selectScholarSeason(id) {
    this.RNCPTitles = [];
    for (const scholarseasondata of this.scholarSeasonData) {
      if (scholarseasondata._id === id) {
        this.RNCPTitles = scholarseasondata.rncptitles;
      }
    }
  }

  changeRNCPTitles(rncpTitleId) {
    // Production
    this.studentService
      .getAllClassesRNCPTitle(rncpTitleId)
      .subscribe(response => {
        this.classesOfRNCP = response.data;
      });
  }

  importStudent(formValue) {
    if ( this.formCourse.valid ) {
      formValue.school = this.schoolId;
      formValue.fileName = this.uploadedFileName;
      formValue.lang = this.translate.currentLang;
      this.studentService.importStudentForSchool(formValue).subscribe( (response) => {
        if (  response.data.studentsNotAdded && (response.data.studentsNotAdded.length > 0  || !response.data.studentsAdded) ) {
          const noOfSuccessfullStudentImport = response.data.studentsAdded ? response.data.studentsAdded.length : 0;
          const noOfUnsuccessfullStudentImport = response.data.studentsNotAdded ? response.data.studentsNotAdded.length : 0;
          swal({
            title: this.translate.instant(
              'STUDENT_IMPORT.UNSUCCESSFULL_IMPORT.TITLE'
            ),
            html: this.translate.instant('STUDENT_IMPORT.UNSUCCESSFULL_IMPORT.TEXT', {
              noOfSuccessfullStudentImport: noOfSuccessfullStudentImport,
              noOfUnsuccessfullStudentImport: noOfUnsuccessfullStudentImport
            }),
            type: 'info',
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('STUDENT_IMPORT.UNSUCCESSFULL_IMPORT.BUTTON')
          }).then(function (isConfirm) {
            if (isConfirm) {
              this.router.navigate(['/school/' + this.schoolId + '/edit/' + this.selectedIndexForStudentsTab]);
            }
          }.bind(this))
          .catch(swal.noop);
        } else if ( ( response.data.studentsNotAdded && response.data.studentsNotAdded.length < 1 ) ) {
          swal({
            title: this.translate.instant(
              'STUDENT_IMPORT.SUCCESSFULL_IMPORT.TITLE'
            ),
            html: this.translate.instant('STUDENT_IMPORT.SUCCESSFULL_IMPORT.TEXT'),
            type: 'success',
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('STUDENT_IMPORT.SUCCESSFULL_IMPORT.BUTTON')
          }).then(function (isConfirm) {
            if (isConfirm) {
              this.router.navigate(['/school/' + this.schoolId + '/edit/' + this.selectedIndexForStudentsTab]);
            }
          }.bind(this))
          .catch(swal.noop);
        } else {
          swal({
            title: this.translate.instant(
              'STUDENT_IMPORT.DELIMITER_UNSUCCESSFULL_IMPORT.TITLE'
            ),
            type: 'error',
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('STUDENT_IMPORT.UNSUCCESSFULL_IMPORT.BUTTON')
          }).catch(swal.noop)
        }
      });
    }
  }

  resetForm() {
    this.formCourse.reset();
    this.fileNameToShow = '';
    this.fileUploader.clearQueue();
  }

  openUploadWindow() {
    this.fileUploader.clearQueue();
    this.importFile.nativeElement.click();
  }

  cancel() {
    this.router.navigate(['/school/' + this.schoolId + '/edit/' + this.selectedIndexForStudentsTab]);
  }

  changeSampleDownloadName( delimiterType: string ) {
    if ( delimiterType ) {
      this.templateCSVDownloadName = delimiterType.toLowerCase();
    } else {
      this.templateCSVDownloadName = 'comma';
    }
  }

  csvTypeSelection() {
    const inputOptions = {
      ',': this.translate.instant('Export_S1.COMMA'),
      ';': this.translate.instant('Export_S1.SEMICOLON'),
      '|': this.translate.instant('Export_S1.TAB')
    };

    swal({
      type: 'question',
      title: this.translate.instant('Export_S1.TITLE'),
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('Export_S1.OK'),
      input: 'radio',
      inputOptions: inputOptions,
      inputValidator: value => {
        return new Promise((resolve, reject) => {
          if (value) {
            resolve();
          } else {
            reject(this.translate.instant('Export_S1.INVALID'));
          }
        });
      }
    }).then(separator => {
      const delimiterSelection = this.delimeterList.find( element => element.value === separator);
      this.templateCSVDownloadName = delimiterSelection.key.toLowerCase();
      this.downloadCSVTemplate();
    });
  }

  downloadCSVTemplate() {
    const element = document.createElement('a');

    // element.href = ApplicationUrls.academic.importStudentTemplateDownload + this.templateCSVDownloadName +
    //               '.csv&token=' + this.loginService.getToken();

    element.href = ApplicationUrls.academic.importStudentTemplateDownload + this.templateCSVDownloadName + '_' + this.translate.currentLang +
      '.csv&token=' + this.loginService.getToken();

    element.target = '_blank';
    element.setAttribute('download', 'Student Import CSV');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
