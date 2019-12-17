import { UtilityService } from 'app/services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from '../../shared/global-urls';
import { TranslateService } from 'ng2-translate';
import { Document } from '../../models/document.model';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { AcademicKitService } from '../../services/academic-kit.service';
import { AppSettings } from '../../app-settings';

declare var swal: any;

@Component({
  selector: 'app-add-document-dialog',
  templateUrl: './add-document-dialog.component.html',
  styleUrls: ['./add-document-dialog.component.scss']
})
export class AddDocumentDialogComponent implements OnInit {
  rncpTitleID: any;
  form: FormGroup;
  document: Document;
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

  showPublishForStudentCheckBox = false;
  isPublishedForStudent = false;

  constructor(private dialog: MdDialog,
              private dialogRef: MdDialogRef<AddDocumentDialogComponent>,
              private translate: TranslateService,
              private appService: RNCPTitlesService,
              private acadService: AcademicKitService,
              private utilityService: UtilityService) {
    this.form = new FormGroup({
      type: new FormControl('', Validators.required),
      documentName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      selectFiles: new FormControl('')
    });
  }

  ngOnInit() {
    console.log(this.document);
    if (this.document) {
      this.form = new FormGroup({
        type: new FormControl(this.document.type, Validators.required),
        documentName: new FormControl(this.document.name, [Validators.required, Validators.minLength(2)]),
        selectFiles: new FormControl(this.document.fileName),
        _id: new FormControl(this.document._id)
      });

      this.isPublishedForStudent = this.document.publishedForStudent;
    }
    this.appService.getSelectedRncpTitle().subscribe(title => {
      this.rncpTitleID = title._id;
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log(item, response, status, headers);
      swal({
        title: 'Attention',
        text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey:true,
        type: 'warning'
      });
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      if (res.status === 'OK') {
        console.log(item, response, status, headers);
        if ( this.isPublishedForStudent ) {
          this.studentUploadDoc();
          const doc: Document = {
            parentRNCPTitle: this.rncpTitleID,
            name: this.form.value.documentName,
            publicationDate: undefined,
            type: this.form.value.type,
            filePath: res.data.filepath,
            fileName: item.file.name,
            documentType: 'uploadedFromAcadKit',
            lang: this.translate.currentLang,
            S3FileName: res.data.s3FileName,
            storedInS3: res.data.s3FileName ? true : false
          };
          if (doc.documentType === 'uploadedFromAcadKit') {
            doc.publishedForStudent = this.isPublishedForStudent;
          }
          this.dialogRef.close(doc);
        } else {
          // this.normalDocUpload();
          swal({
            title: 'Success',
            text: this.translate.instant('DASHBOARD.MESSAGES.UPLOADSUCCESS'),
            allowEscapeKey:true,
            type: 'success',
            confirmButtonText: 'OK'
          }).then( () => {
            if (this.document && this.document._id) {
              const doc: Document = {
                parentRNCPTitle: this.rncpTitleID,
                name: this.form.value.documentName,
                publicationDate: this.document && this.document.publicationDate ? this.document.publicationDate : undefined,
                type: this.form.value.type,
                filePath: res.data.filepath,
                fileName: item.file.name,
                documentType: this.document.documentType ? this.document.documentType : 'uploadedFromAcadKit',
                lang: this.translate.currentLang,
                S3FileName: res.data.s3FileName,
                parentCategory: this.document.parentCategory,
                parentTest: this.document.parentTest ? this.document.parentTest : null,
                storedInS3: res.data.s3FileName ? true : false
              };
              if (this.document.uploadedForOtherUser) {
                doc['uploadedForOtherUser'] = this.document.uploadedForOtherUser;
              } else if (this.document.uploadedForStudent) {
                doc['uploadedForStudent'] = this.document.uploadedForStudent;
              } else if (this.document.uploadedForGroup) {
                doc['uploadedForGroup'] = this.document.uploadedForGroup;
              }
              this.dialogRef.close(doc);
              this.clearUploadQueue();
              this.form.reset();
            } else {
              this.addDocumentToAcadKit(res, item);
            }
          });
        }

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

    this.showPublishForStudentCheckBox = this.utilityService.checkUserIsDirectorSalesAdmin() && (
      ( this.document && this.document.documentType === 'uploadedFromAcadKit' ) || !this.document );
  }

  normalDocUpload() {
    swal({
      title: 'Success',
      text: this.translate.instant('DASHBOARD.MESSAGES.UPLOADSUCCESS'),
      allowEscapeKey: true,
      type: 'success',
      confirmButtonText: 'OK'
    });
  }

  studentUploadDoc() {
    swal({
      title: 'Bravo !',
      text: this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S2.TEXT'),
      allowEscapeKey: true,
      type: 'success',
      confirmButtonText: this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S2.BTN')
    });
  }

  addDocumentToAcadKit(res, item) {
    const doc: Document = {
      parentRNCPTitle: this.rncpTitleID,
      name:  this.form.value.documentName,
      publicationDate: undefined,
      documentType: 'uploadedFromAcadKit',
      type: this.form.value.type,
      filePath: res.data.filepath,
      fileName: item.file.name,
      S3FileName: res.data.s3FileName ? res.data.s3FileName : '',
      storedInS3: res.data.s3FileName ? true : false,
      // parentCategory: this.document.parentCategory ? this.document.parentCategory : ''
    };
    if (this.document !== undefined) {
      doc.parentCategory = this.document.parentCategory ? this.document.parentCategory : '';
    }
    doc.publishedForStudent = this.isPublishedForStudent;
    this.dialogRef.close(doc);
    this.clearUploadQueue();
    this.form.reset();
  }

  openUploadWindow() {
    if (this.form.valid) {
      this.uploadInput.nativeElement.click();
    } else {
      this.form.controls['documentName'].markAsTouched();
      this.form.controls['type'].markAsTouched();
    }
  }

  upload() {
    if (this.form.valid) {

      if (this.isPublishedForStudent) {
        this.changePublishCondition(true);
      } else {
        this.uploader.queue[0].upload();
      }
    } else {
      this.form.controls['documentName'].markAsTouched();
      this.form.controls['type'].markAsTouched();
    }
  }

  clearUploadQueue() {
    this.uploader.clearQueue();
    this.uploadInput.nativeElement.value = '';
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    console.log("in submit");
    if (this.form.valid) {
      console.log(this.form.value);
      if (this.uploader.queue[0]) {
        this.uploader.queue[0].upload();
      }else {
        if( this.isPublishedForStudent && this.isPublishedForStudent !== this.document.publishedForStudent ) {
          this.changePublishCondition();
        } else {
          this.submmitDocumentDetails();
        }
      }
      // let obj1 = {
      //   _id: this.document._id,
      //   name: this.form.value.documentName,
      //   type: this.form.value.documentType,
      //   filePath: this.document.filePath,
      //   fileName: this.document.fileName,
      //   parentCategory: this.document.parentCategory,
      //   parentTest: this.document.parentTest,
      //   parentRNCPTitle: this.document.parentRNCPTitle,
      //   createdAt: new Date()
      // };
      // this.acadService.updateDocument(obj1).subscribe(title => {
      //   console.log(title);
      // });
    } else {
      this.form.controls['documentName'].markAsTouched();
      this.form.controls['type'].markAsTouched();
    }
    // this.testService.updateTest(this.test);
  }

  changePublishCondition(isAdd: boolean = false) {
    let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
    swal({
      title: this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S1.TITLE'),
      html: this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S1.TEXT', {
        docname: this.form.get('documentName').value
      }),
      type: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S1.YES_IN', { timer: timeDisabledinSec }),
      cancelButtonText: this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S1.NO'),
      onOpen: () => {
        swal.disableConfirmButton();
        const confirmButtonRef = swal.getConfirmButton();

        // TimerLoop for derementing timeDisabledinSec
        const timerLoop = setInterval(() => {
          timeDisabledinSec -= 1;
          confirmButtonRef.innerText = this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S1.YES_IN',
          { timer: timeDisabledinSec });
        }, 1000
        );

        // Resetting timerLoop to stop after required time of execution
        setTimeout(() => {
          confirmButtonRef.innerText = this.translate.instant('PUBLISHABLE_FOR_STUDENTS.PUBLISHDOC_S1.YES');
          swal.enableConfirmButton();
          clearTimeout(timerLoop);
        }, (AppSettings.global.timeDisabledinSecForSwal * 1000));
      }
    }).then( (isConfirm) => {
      if (isAdd) {
        this.uploader.queue[0].upload();
      } else {
        this.submmitDocumentDetails();
      }
    }, ( dismiss) => {

    });
  }

  submmitDocumentDetails() {
    console.log('in this123', this.document);
    const documentDetails: Document = {
      parentRNCPTitle: this.rncpTitleID,
      name:  this.form.value.documentName,
      publicationDate: this.document.publicationDate ? this.document.publicationDate : undefined,
      documentType: this.document.documentType,
      type: this.form.value.type,
      filePath: this.document.filePath,
      fileName: this.document.fileName,
      S3FileName: this.document.S3FileName,
      storedInS3: this.document.storedInS3,
      parentCategory: this.document.parentCategory,
    };
    if (this.document.documentType === 'uploadedFromAcadKit') {
      documentDetails.publishedForStudent = this.isPublishedForStudent;
    }
    console.log(documentDetails);
    this.dialogRef.close(documentDetails);
  }

  toggleStudentPublish(event) {
    this.isPublishedForStudent = event.checked;
    if ( event.checked )
    console.log('toggleStudentPublish this.isPublishedForStudent', this.isPublishedForStudent);
  }
}
