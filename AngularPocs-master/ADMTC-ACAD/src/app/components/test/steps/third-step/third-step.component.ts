import { Test } from '../../../../models/test.model';
import { TestService } from '../../../../services/test.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';
import { Document } from '../../../../models/document.model';
import { FileUpload, Documents } from '../../../../shared/global-urls';
import { TranslateService } from 'ng2-translate';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { AcademicKitService } from '../../../../services/academic-kit.service';
import { UserService } from '../../../../services/users.service';
import { Http } from '@angular/http';
import { ExpectedDocuments } from '../../../../models/expecteddocuments.model';
import { MdSlideToggleChange } from '@angular/material';
import { CustomValidators } from 'ng2-validation';
import { DatePipe } from '@angular/common';
import _ from 'lodash';
import { expand } from 'rxjs/operator/expand';
import { AppSettings } from '../../../../app-settings';
declare var swal: any;
import * as moment from 'moment';

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('ThirdStepComponent');
log.color = 'green';


@Component({
  selector: 'app-third-step',
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.scss'],
  providers: [DatePipe]
})
export class ThirdStepComponent implements OnInit {
  expectedDocuments: ExpectedDocuments[] = [];
  userTypes = [];
  test = new Test();
  newDoc = false;
  datePipe: DatePipe;
  newExpectedDoc = false;
  setHours = new Date(new Date().setHours(14, 0));
  mdDate = this.setHours.toLocaleString('en-GB');
  relativeDate = false;
  docRelativeDate = false;
  isStudent = false;
  @ViewChild('uploadFileControl') uploadInput: any;
  expectedForm: FormGroup;
  form: FormGroup;
  // defaultDate = new Date('ddmmyyyy') + '14 00';
  rncpTitleID: string;
  documentType = {
    pfe: 'PFE',
    oral: 'Oral',
    ecrit: 'Ecrit',
    interro: 'Interro'
  };
  documentTypes = [
    {
      value: 'guideline',
      view: 'Guidelines'
    },
    {
      value: 'other',
      view: 'Other'
    },
    {
      value: 'scoring-rules',
      view: 'Scoring Rules'
    },
    {
      value: 'studentnotification',
      view: 'Notification to Student'
    },
    {
      value: 'test',
      view: 'Test'
    }
  ];
  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });

  constructor(
    private fb: FormBuilder,
    private testService: TestService,
    private appService: RNCPTitlesService,
    private router: Router,
    private translate: TranslateService,
    private acadService: AcademicKitService,
    private userservice: UserService,
    private http: Http
  ) {
    //  log.info("Constructor Invoked");
    this.form = this.fb.group({
      documentType: ['', Validators.required],
      documentName: ['', [Validators.required, Validators.minLength(2)]],
      selectFiles: [''],
      publicationDate: [
        this.mdDate,
        [CustomValidators.date, Validators.required]
      ],
      numberOfDays: new FormControl('', [CustomValidators.gte(0)]),
      daysBefore: new FormControl('before')
    });

    this.expectedForm = this.fb.group({
      documentName: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      documentUserType: new FormControl('', Validators.required),
      deadlineDate: new FormControl('', [
        CustomValidators.date,
        Validators.required
      ]),
      numberOfDays: new FormControl('', [CustomValidators.gte(0)]),
      isForAllStudents: new FormControl(''),
      daysBefore: new FormControl('before'),
      docUploadDateRetakeExam: new FormControl('')
    });
  }

  ngOnInit() {
    //  console.log(this.defaultDate);
    this.datePipe = new DatePipe(this.translate.currentLang);
    this.sortDocumentType();
    // console.log('initiated');
    this.appService.getSelectedRncpTitle().subscribe(title => {
      if(title){
        this.rncpTitleID = title._id;
      }
    });
    this.testService.getTest().subscribe(test => {
      this.test = test;
    });
    // this.uploader.
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      //  console.log(item, response, status, headers);
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
        //  console.log(item, response, status, headers);
        let publicationDateObject: any;
        if (this.docRelativeDate === true) {
          publicationDateObject = {
            type: 'relative',
            before: this.form.get('daysBefore').value === 'after' ? false : true,
            days: this.form.get('numberOfDays') ? this.form.get('numberOfDays').value : 10
          };
        } else {
          const getDate: Date = this.form.get('publicationDate').value
          ? this.form.get('publicationDate').value
          : this.mdDate;

          const publicationDateObj = {
            year: getDate.getFullYear(),
            month: (getDate.getMonth() + 1),
            date: getDate.getDate(),
            hour: getDate.getHours(),
            minute: getDate.getMinutes(),
            timeZone: getDate.getTimezoneOffset().toString(),
          };
          publicationDateObject = {
            type: 'fixed',
            publicationDate: publicationDateObj
          };
        }

        const newDocument: Document = {
          'parentRNCPTitle': this.rncpTitleID,
          'name': this.form.value.documentName,
          'filePath': res.data.filepath,
          'fileName': item.file.name,
          'publicationDate': publicationDateObject,
          'documentType': 'uploadedFromTestCreation',
          'type': this.form.value.documentType,
          'lang': this.translate.currentLang,
          'S3FileName': res.data.s3FileName ? res.data.s3FileName : '',
          'storedInS3': res.data.s3FileName ? true : false,
        };
        console.log(newDocument);
        this.acadService.addDocument(newDocument).subscribe(doc => {
          if (this.form.value !== null) {
            this.test.documents.push(doc);
          }
        });
      } else {
        //  console.log(item, response, status, headers);
        swal({
          title: 'Attention',
          text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
      this.clearUploadQueue();
      this.form.reset();
      this.form.controls['publicationDate'].setValue(
        new Date().toLocaleString('en-GB')
      );
      this.testService.updateTest(this.test);
      this.newDoc = false;
    };
    this.userservice.getUserTypesByEntities('academic').subscribe(res => {
      //  this.userTypes = res.data;
      res.data.forEach(element => {
          this.userTypes.push(element);
      });
      console.log('user types', this.userTypes);
      this.userTypes = this.userTypes.sort(this.keysrt('name'));
      //  console.log(this.userTypes);
    });
    //  console.log(this.test);
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) return 1;
      if (a[key] < b[key]) return -1;
      return 0;
    };
  }

  sortDocumentType() {
    this.documentTypes = this.documentTypes.sort(this.keysrt('view'));
  }

  getDocType(val) {
    const view = this.documentTypes.find(doc => {
      return (doc.value = val);
    }).value;
    return this.translate.instant('DOCUMENTTYPES.' + view.toUpperCase());
  }

  openUploadWindow() {
    if (this.form.valid) {
      this.uploadInput.nativeElement.click();
    } else {
      this.form.controls['documentName'].markAsTouched();
      this.form.controls['documentType'].markAsTouched();
    }
  }

  removeDocument(index: number) {
    swal({
      title: 'Attention',
      text: this.translate.instant('CONFIRMDELETE', {
        value: this.translate.instant('DOCUMENT.THISDOCUMENT')
      }),
      type: 'question',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('YES'),
      cancelButtonText: this.translate.instant('NO')
    }).then(() => {
      this.test.documents.splice(index, 1);
      this.testService.updateTest(this.test);
    });
  }

  removeExpectedDocument(name: string, index: number) {
    swal({
      title: 'Attention',
      text: this.translate.instant('CONFIRMDELETE', {
        value: this.translate.instant('DOCUMENT.THISDOCUMENT')
      }),
      type: 'question',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('YES'),
      cancelButtonText: this.translate.instant('NO')
    }).then(() => {
      // for (const ed of this.test.expectedDocuments) {
      //   if (ed.documentName === id) {
      this.test.expectedDocuments.splice(index, 1);
      // this.test.expectedDocuments = this.test.expectedDocuments.filter(ed => ed.documentName !== name);
      // this.test.expectedDocuments = this.test.expectedDocuments.filter(ed =>
      //   ed.documentName !== null &&
      //   ed.documentUserType != null &&
      //   ed.deadlineDate !== null);
      //   }
      // }
      this.testService.updateTest(this.test);
    });
  }

  // upload() {
  //   if (this.form.valid) {
  //     this.uploader.queue[0].upload();
  //   } else {
  //     this.form.controls['documentName'].markAsTouched();
  //     this.form.controls['documentType'].markAsTouched();
  //   }
  // }

  upload() {
    if (this.form.valid) {
      const self = this;
      log.data(' upload() ', this.test);
      // const testName = '';

      // Setting the Confirm Button Disable time to 6
      let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
      swal({
        title: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK_UPLOAD_WARNING.TITLE', { testName: this.test.name }),
        text: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK_UPLOAD_WARNING.TEXT'),
        type: 'warning',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK_UPLOAD_WARNING.OK_IN', { timer: timeDisabledinSec }),
        cancelButtonText: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK_UPLOAD_WARNING.NO'),
        onOpen: () => {
          swal.disableConfirmButton()
          const confirmButtonRef = swal.getConfirmButton();

          // TimerLoop for derementing timeDisabledinSec
          const timerLoop = setInterval(() => {
            timeDisabledinSec -= 1;
            confirmButtonRef.innerText = this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK_UPLOAD_WARNING.OK_IN', { timer: timeDisabledinSec });
          }, 1000
          );

          // Resetting timerLoop to stop after required time of execution
          setTimeout(() => {
            confirmButtonRef.innerText = 'OK';
            swal.enableConfirmButton();
            clearTimeout(timerLoop);
          }, (timeDisabledinSec * 1000));
        }
      }).then(function (isConfirm) {
        self.uploader.queue[0].upload();
      }, function (dismiss) {
        self.clearUploadQueue();
      }.bind(this));
    } else {
      this.form.controls['documentName'].markAsTouched();
      this.form.controls['documentType'].markAsTouched();
    }
  }

  clearUploadQueue() {
    this.uploader.clearQueue();
    this.uploadInput.nativeElement.value = '';
  }

  goToPreviousStep() {
    // this.testService.updateTest(this.test);
    this.router.navigateByUrl('/create-test/second');
  }

  goToNextStep() {
    this.testService.updateTest(this.test);
    this.router.navigateByUrl('/create-test/fourth');
  }

  getDocumentUserType(documentUserType) {
    if (documentUserType.name) {
      return documentUserType.name;
    } else {
      for (const element of this.userTypes) {
        if (element._id === documentUserType) {
          return element.name;
        }
      }
    }
  }

  passExpectedFormData() {
    //  console.log('function instanciated');
    if (
      this.expectedForm.value.documenName !== '' &&
      this.expectedForm.value.documenUserType !== ''
    ) {
      if (
        this.expectedForm.value.documenName !== null &&
        this.expectedForm.value.documenUserType !== null
      ) {
        if (!this.relativeDate) {
          const expectedDocuments: ExpectedDocuments = {
            documentName: this.expectedForm.value.documentName,
            documentUserType: this.expectedForm.value.documentUserType,
            isForAllStudents: this.expectedForm.value.isForAllStudents,
            deadlineDate: {
              type: 'fixed',
              deadline: this.expectedForm.value.deadlineDate
            },
            docUploadDateRetakeExam: this.expectedForm.value.docUploadDateRetakeExam
          };
          //  console.log(expectedDocuments);
          this.test.expectedDocuments.push(expectedDocuments);
          //  console.log(this.expectedForm.value);
          this.testService.updateTest(this.test);
          this.newExpectedDoc = false;
          this.expectedForm.reset();

          //  console.log(this.expectedForm.value);
        } else {
          //  console.log(this.expectedForm.value);
          const expectedDocuments: ExpectedDocuments = {
            documentName: this.expectedForm.value.documentName,
            documentUserType: this.expectedForm.value.documentUserType,
            isForAllStudents: this.expectedForm.value.isForAllStudents,
            deadlineDate: {
              type: 'relative',
              before: this.expectedForm.value.daysBefore === 'before',
              days: this.expectedForm.value.numberOfDays
            },
            docUploadDateRetakeExam: this.expectedForm.value.docUploadDateRetakeExam
          };
          this.test.expectedDocuments.push(expectedDocuments);
          //  console.log(this.expectedForm.value);
          this.testService.updateTest(this.test);
          this.newExpectedDoc = false;
          this.expectedForm.reset();
          //  console.log(this.expectedForm.value);
        }
      }
      this.expectedForm.reset();
    }
    //   });
    // }
  }
  addNewDoc() {
    this.newDoc = true;
    // this.expectedForm.patchValue({
    //   publicationDate: this.mdDate
    // });
    // this.form = this.fb.group({
    //   'publicationDate': new FormControl(this.mdDate, [CustomValidators.date, Validators.required])
    // });
    this.form.controls['publicationDate'].setValue(this.mdDate);
    this.form.value.publicationDate = this.mdDate;
  }

  cancelNewDoc() {
    this.newDoc = false;
    this.docRelativeDate = false;
    this.clearUploadQueue();
    this.form.reset();
    this.form.controls['publicationDate'].setValue(
      new Date().toLocaleString('en-GB')
    );
    this.testService.updateTest(this.test);
  }

  addNewExpectedDoc() {
    this.newExpectedDoc = true;
  }

  cancelNewExpectedDoc() {
    this.newExpectedDoc = false;
    this.expectedForm.reset();
    this.expectedForm.patchValue({
      daysBefore: 'before'
    });
    this.relativeDate = false;
    this.form.controls['publicationDate'].setValue(
      new Date().toLocaleString('en-GB')
    );
    this.isStudent = false;
  }

  changeDateTypeForDocuments(event: MdSlideToggleChange) {
    this.docRelativeDate = event.checked;
    if (!this.docRelativeDate) {
      this.form.value.publicationDate = this.mdDate;
      this.form = this.fb.group({
        documentName: new FormControl(this.form.value.documentName, [
          Validators.required,
          Validators.minLength(2)
        ]),
        documentType: new FormControl(
          this.form.value.documentType,
          Validators.required
        ),
        publicationDate: new FormControl(this.mdDate, [
          CustomValidators.date,
          Validators.required
        ])
      });
      //  console.log(this.form.value);
    } else {
      this.form = this.fb.group({
        documentName: new FormControl(this.form.value.documentName, [
          Validators.required,
          Validators.minLength(2)
        ]),
        documentType: new FormControl(
          this.form.value.documentType,
          Validators.required
        ),
        // 'deadlineDate': new FormControl('', [CustomValidators.date, Validators.required]),
        numberOfDays: new FormControl('', [
          CustomValidators.gte(0),
          Validators.required
        ]),
        daysBefore: new FormControl('before'),
        publicationDate: new FormControl(this.mdDate)
      });
      //  console.log(this.form.value);
    }
  }

  changeDateType(event: MdSlideToggleChange) {
    this.relativeDate = event.checked;
    if (!this.relativeDate) {
      this.expectedForm = this.fb.group({
        documentName: new FormControl(this.expectedForm.value.documentName, [
          Validators.required,
          Validators.minLength(2)
        ]),
        documentUserType: new FormControl(
          this.expectedForm.value.documentUserType,
          Validators.required
        ),
        isForAllStudents: new FormControl(
          this.expectedForm.value.isForAllStudents,
          Validators.required
        ),
        deadlineDate: new FormControl('', [
          CustomValidators.date,
          Validators.required
        ]),
        docUploadDateRetakeExam: this.expectedForm.value.docUploadDateRetakeExam

        // 'numberOfDays': new FormControl('', [CustomValidators.gte(0)]),
        // 'daysBefore': new FormControl('before')
      });
      //  console.log(this.expectedForm.value);
    } else {
      this.expectedForm = this.fb.group({
        documentName: new FormControl(this.expectedForm.value.documentName, [
          Validators.required,
          Validators.minLength(2)
        ]),
        documentUserType: new FormControl(
          this.expectedForm.value.documentUserType,
          Validators.required
        ),
        isForAllStudents: new FormControl(
          this.expectedForm.value.isForAllStudents,
          Validators.required
        ),
        // 'deadlineDate': new FormControl('', [CustomValidators.date, Validators.required]),
        numberOfDays: new FormControl('', [
          CustomValidators.gte(0),
          Validators.required
        ]),
        daysBefore: new FormControl('before'),
        docUploadDateRetakeExam: this.expectedForm.value.docUploadDateRetakeExam

      });
      //  console.log(this.expectedForm.value);
    }
  }

  checkNumberOfDays() {
    if (this.expectedForm.value.numberOfDays < 0) {
      this.expectedForm.patchValue({
        numberOfDays: 0
      });
    }
  }
  checkNumberOfDaysForDocuments() {
    if (this.form.value.numberOfDays < 0) {
      this.form.patchValue({
        numberOfDays: 0
      });
    }
  }

  checkIfStudent(name: string, isSystemType) {
    //  console.log(name + isSystemType);
    if (!this.test.groupTest) {
      if (
        name === ('STUDENT' || 'étudiant'.toUpperCase()) &&
        isSystemType === true
      ) {
        this.isStudent = false;
        this.expectedForm.value.isForAllStudents = false;
        this.expectedForm.controls['isForAllStudents'].setValue(false);
      } else {
        this.isStudent = true;
        this.expectedForm.value.isForAllStudents = true;
        this.expectedForm.controls['isForAllStudents'].setValue(true);
      }
    } else {
      this.expectedForm.value.isForAllStudents = false;
      this.expectedForm.controls['isForAllStudents'].setValue(false);
    }
  }
  getTranslateADMTCSTAFFKEY(name) {
    // console.log(name);
    if (name) {
      const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
      return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
    }
  }

  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    if (date.hasOwnProperty('date')) {
        const publicationDateObj = date;
        date = new Date(publicationDateObj.year,
          (publicationDateObj.month - 1),
          publicationDateObj.date,
          publicationDateObj.hour,
          publicationDateObj.minute
      );
    }
    return this.datePipe.transform(date);
  }
}
