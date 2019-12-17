import { AcademicKitService } from './../../../../../services/academic-kit.service';
import { InternalNotesService } from './../internal-notes.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from 'app/shared/global-urls';
import { TranslateService } from 'ng2-translate';
import swal from 'sweetalert2';
import { Document } from 'app/models/document.model';
import { AppSettings } from 'app/app-settings';


@Component({
  selector: 'app-add-additional-note-dialog',
  templateUrl: './add-additional-note-dialog.component.html',
  styleUrls: ['./add-additional-note-dialog.component.css']
})
export class AddAdditionalNoteDialogComponent implements OnInit {
  currentInternalDocString = '';
  internalExpectedDoc: { name: string }[] = [];
  form: FormGroup;
  submitted = false;
  isRequired = false;
  documentsList = [];
  selectedInternalNote: string;
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

  constructor(public dialogref: MdDialogRef<AddAdditionalNoteDialogComponent>,
    private fb: FormBuilder,
    private internalNotesService: InternalNotesService,
    public translate: TranslateService,
    private acadService: AcademicKitService

  ) {
    this.handelFileUploads();
  }

  ngOnInit() {
    this.initializeFormGroup();
  }
  initializeFormGroup() {
    this.form = this.fb.group({
      addedNote: ['', Validators.required],
      addedDocuments: ['']
    });
  }

  addDocuments() {
    if (this.currentInternalDocString.trim()) {
      this.internalExpectedDoc.push({ name: this.currentInternalDocString });
      this.internalExpectedDoc = [..._.uniqBy(this.internalExpectedDoc, (doc) => doc.name.trim().toLowerCase())];
      this.currentInternalDocString = '';
    }
  }
  removeDocument(index) {
    this.internalExpectedDoc.splice(index, 1);
    this.documentsList.splice(index, 1);
  }

  openUploadWindow() {
    if (this.currentInternalDocString !== '') {
      this.uploadInput.nativeElement.click();
    }
  }
  clearUploadQueue() {
    this.uploader.clearQueue();
    this.uploadInput.nativeElement.value = '';
  }
  handelFileUploads() {

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      const fileExtension = file.file.name.split('.').pop();
      this.upload();
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
        const document = {
          'name': this.currentInternalDocString,
          'type': 'other',
          'documentType': 'internalNote',
          'storedInS3': res.data.s3FileName ? true : false,
          'S3FileName': res.data.s3FileName ? res.data.s3FileName : '',
          'lang': this.translate.currentLang,
          'createdAt': new Date(),
          'filePath': res.data.filepath,
          'fileName': item.file.name
        };
        this.addDocuments();
        // this.acadService.addDocument(document).subscribe(docs => {
        //   console.log(docs);
        //   this.documentsList.push(docs._id);
        //   this.clearUploadQueue();
        // });
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
  upload() {
    this.uploader.queue[0].upload();
  }


  addAdditionalNotes(value) {
    if (this.form.valid) {
      console.log(this.selectedInternalNote);
      this.submitted = true;
      const formValues = this.form.value;
      const data = {
        'addedNote': value.addedNote,
        'addedDocuments': this.documentsList
      };
      const self = this;

      // Setting the Confirm Button Disable time to 6
      let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
      swal({
        title: this.translate.instant('INTERNAL_NOTE.NOTE_S4.TITLE'),
        text: this.translate.instant('INTERNAL_NOTE.NOTE_S4.TEXT'),
        type: 'warning',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('INTERNAL_NOTE.NOTE_S4.OK'),
        cancelButtonText: this.translate.instant('INTERNAL_NOTE.NOTE_S4.NO'),
        onOpen: () => {
          swal.disableConfirmButton()
          const confirmButtonRef = swal.getConfirmButton();

          // TimerLoop for derementing timeDisabledinSec
          const timerLoop = setInterval(() => {
            timeDisabledinSec -= 1;
            confirmButtonRef.innerText = this.translate.instant('INTERNAL_NOTE.NOTE_S4.OK_IN', { timer: timeDisabledinSec });
          }, 1000
          );

          // Resetting timerLoop to stop after required time of execution
          setTimeout(() => {
            confirmButtonRef.innerText = this.translate.instant('INTERNAL_NOTE.NOTE_S4.OK');
            swal.enableConfirmButton();
            clearTimeout(timerLoop);
          }, (timeDisabledinSec * 1000));
        }
      }).then((isConfirm) => {
        if (isConfirm) {
          this.internalNotesService.createAdditionalNotes(data, this.selectedInternalNote).subscribe(res => {
            this.dialogref.close(true);
          });
        } else {
          this.closeDialog();
        }

      }, function (dismiss) {
        self.clearUploadQueue();
        if (dismiss === 'cancel') {
        }
      });
    }
  }
  closeDialog() {
    this.dialogref.close(false);
  }

}
