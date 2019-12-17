import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from '../../shared/global-urls';
import { MdDialog, MdDialogRef, MdSlideToggleChange } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { AcademicKitService } from '../../services/academic-kit.service';
import { Document } from '../../models/document.model';
import { CustomValidators } from 'ng2-validation';
import { SafeUrl } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppSettings } from '../../app-settings';
declare var swal: any;

@Component({
  selector: 'app-expected-doc-task',
  templateUrl: './expected-doc-task.component.html',
  styleUrls: ['./expected-doc-task.component.scss']
})
export class ExpectedDocTaskComponent implements OnInit {
  rncpTitleID: any;
  document: Document;
  taskRNCP = null;
  taskDetails = null;
  expectedDocTask = null;
  filePreviewPath: SafeUrl = '';
  docDetail: any = null;
  mdDate = new Date().toLocaleString('en-GB');
  docRelativeDate = false;
  documentType = {
    'pfe': 'PFE',
    'oral': 'Oral',
    'ecrit': 'Ecrit',
    'interro': 'Interro'
  };
  documentTypes = [
    {
      value: 'guideline',
      view: 'Guidelines'
    },
    {
      value: 'test',
      view: 'Test'
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
      value: 'other',
      view: 'Other'
    }
  ];
  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });

  @ViewChild('uploadFileControl') uploadInput: any;

  isRetakeTestUploadTask = false;

  constructor(private dialog: MdDialog,
    private dialogRef: MdDialogRef<ExpectedDocTaskComponent>,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.rncpTitleID = this.taskRNCP;

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      const fileExtension = file.file.name.split('.').pop();
      if (fileExtension.toLowerCase() !== 'pdf') {
        console.log(file.file.size);
        console.log(file.file.size / 1024 / 1024);
        swal({
          title: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_PDF.TITLE'),
          text: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_PDF.TEXT'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_PDF.BUTTON'),
          type: 'error'
        }).then(function () {
          this.clearUploadQueue();
        }.bind(this));
      } else if (file.file.size / 1024 / 1024 > 100) {
        swal({
          title: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_FILESIZE.TITLE'),
          html: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_FILESIZE.TEXT'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: this.translate.instant('TEST.UPLOAD_RESTRICT_TO_FILESIZE.BUTTON'),
          type: 'warning'
        }).then(function () {
          this.clearUploadQueue();
        }.bind(this));
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
        const newDocument: Document = {
          'parentRNCPTitle': this.rncpTitleID,
          'name': this.generateDocName(),
          'filePath': res.data.filepath,
          'fileName': item.file.name,
          'publicationDate': this.expectedDocTask.deadlineDate,
          'documentType': 'documentExpected',
          'type': 'documentExpected',
          'lang': this.translate.currentLang,
          'S3FileName': res.data.s3FileName ? res.data.s3FileName : '',
          'storedInS3': res.data.s3FileName ? true : false,
        };
        if (this.docDetail) {
          newDocument.taskId = this.docDetail.taskId;
        }
        this.dialogRef.close(newDocument);
        this.clearUploadQueue();
        swal({
          title: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK.SUCCESS'),
          type: 'success',
          allowEscapeKey: true,
          allowOutsideClick: false,
          confirmButtonText: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK.BUTTON')
        });

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

  checkClickedOutside() {

  }

  generateDocName(): string {
    console.log(this.docDetail);

    if (this.docDetail && this.expectedDocTask) {
      let fileUserName = this.docDetail.studentLastName + ' - ' + this.docDetail.studentFirstName;
      if (this.docDetail.userSelection.selectionType === 'testGroup' || (this.docDetail.isGroupTest && this.docDetail.forEachStudent)) {
        fileUserName = this.docDetail.userSelection.groupName;
      }
      const detail = this.docDetail;
      return detail.titleShortName
        + ' - '
        + detail.subjectName
        + ' - '
        + detail.testName
        + ' - '
        + fileUserName
        + ' - '
        + this.expectedDocTask.documentName;
    }
    return '';
  }

  openUploadWindow() {
    this.uploadInput.nativeElement.click();
  }

  upload() {
    const self = this;
    const testName = this.docDetail.testName;

    // Setting the Confirm Button Disable time to 6
    let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
    swal({
      title: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK_UPLOAD_WARNING.TITLE', { testName: testName }),
      text: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK_UPLOAD_WARNING.TEXT'),
      type: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK_UPLOAD_WARNING.OK_IN', { timer: timeDisabledinSec }),
      cancelButtonText: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK_UPLOAD_WARNING.NO'),
      onOpen: () => {
        swal.disableConfirmButton();
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
  }

  clearUploadQueue() {
    this.uploader.clearQueue();
    this.uploadInput.nativeElement.value = '';
  }

  cancel() {
    this.dialogRef.close();
  }
}


