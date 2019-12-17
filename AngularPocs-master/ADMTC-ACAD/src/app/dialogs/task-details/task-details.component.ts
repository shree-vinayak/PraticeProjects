import { Component, OnInit, ViewChild } from '@angular/core';
import { Tasks } from 'app/models/tasks.model';
import { MdDialogRef, MdInputModule } from '@angular/material';
import { Form, FormsModule } from '@angular/forms';
import { UtilityService } from 'app/services/utility.service';
import { TranslateService } from 'ng2-translate';
import { TasksService } from 'app/services/tasks.service';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from '../../shared/global-urls';
import { Document } from '../../models/document.model'
import { AcademicKitService } from '../../services/academic-kit.service';
import { AppSettings } from '../../app-settings';

declare var swal: any;
@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  task;
  testName: string;
  testCompDate;
  isAssignByLoginUser = false;
  isTaskDone = false;
  comment = '';
  actionTaken = '';
  isDetailsReadOnly = false;
  isStudeDetailRevisTask = false;
  isInternalTask = false;
  documentExpected: any[] = [];
  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });
  documentIndex:any = '';
  @ViewChild('uploadExpextedDoc') uploadInput: any;

  constructor(private dialogRef: MdDialogRef<TaskDetailsComponent>,
    private acadService: AcademicKitService,
    private taskService: TasksService,
    private translate: TranslateService,
    private utility : UtilityService) {

  }

  ngOnInit() {
    if (this.task) {
      this.actionTaken = this.task.actionTaken;

      this.comment = this.task.comments;
      this.isDetailsReadOnly = this.task.taskStatus === 'Done' ? true : false;
      this.isStudeDetailRevisTask = this.task.type === 'finalCertificateRevision' ? true : false;
      this.isTaskDone = this.isDetailsReadOnly;
    }
    console.log('ngOnInit isStudeDetailRevisTask', this.isStudeDetailRevisTask);

    if (this.documentExpected && this.documentExpected.length > 0) {
      this.setUploaderSubcriptions();
    }
  }

  civiltyCount(gender: string) {
    return this.utility.computeCivility(gender, this.translate.currentLang.toLowerCase());
  }

  closeDialog(status) {
    this.dialogRef.close(status);
  }

  updateTask() {
    if (this.task) {
      const currentTask = this.task;
      currentTask.actionTaken = this.actionTaken;
      currentTask.taskStatus = this.isTaskDone ? 'Done' : 'Todo';
      currentTask.comments = this.comment;
      if (this.documentExpected && this.documentExpected.length) {
        currentTask['documentExpected']  = this.documentExpected;
      }
      const self = this;

      this.taskService.updateTask(currentTask._id, currentTask).subscribe((response) => {
        if (response.data) {
          self.dialogRef.close(response.data);
          swal({
            title: 'Bravo!',
            text: this.translate.instant('TASK.MESSAGE.TASKSAVESUCCESS'),
            allowEscapeKey: true,
            type: 'success',
            confirmButtonText: this.translate.instant('TASK.MESSAGE.OK'),
          });
        } else {
          swal({
            title: 'Attention',
            text: this.translate.instant('TASK.MESSAGE.TASKUPDATEFAILED'),
            allowEscapeKey: true,
            type: 'warning'
          });
        }
      });
    }
  }

  getTranslateADMTCSTAFFKEY(name) {
    console.log(name);
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  openUploadWindow(index) {
    this.documentIndex = index;
    this.uploadInput.nativeElement.click();
  }

  setUploaderSubcriptions() {
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.uploadDocument();
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
      console.log('this.uploader.onSuccessItem', res);
      if (res.status === 'OK') {
        const newDocument: Document = {
          'name': this.documentExpected[this.documentIndex]['name'],
          'filePath': res.data.filepath,
          'fileName': item.file.name,
          'publicationDate': null,
          'documentType': 'documentExpected',
          'type': 'other',
          'lang': this.translate.currentLang,
          'S3FileName': res.data.s3FileName ? res.data.s3FileName : '',
          'storedInS3': res.data.s3FileName ? true : false,
        };
        this.acadDocUpload(newDocument);
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

  acadDocUpload(document) {
    if (this.isInternalTask) {
      document['isInternalTask'] = true;
    }
    document['addTaskDocUpload'] = true;
    this.acadService.addDocument(document).subscribe(doc => {
      console.log('acadService.addDocument doc', doc);
      if (doc._id) {
        this.clearUploadQueue();
        this.uploadSuccessSwal();
        this.documentExpected[this.documentIndex]['documentId'] = doc._id;
      }
    });
  }

  uploadSuccessSwal() {
    swal({
      title: this.translate.instant('DASHBOARD.TASK_S8.TITLE'),
      html: this.translate.instant('DASHBOARD.TASK_S8.TEXT'),
      type: 'success',
      allowEscapeKey: true,
      allowOutsideClick: false,
      confirmButtonText: this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK.BUTTON')
    });
  }


  uploadDocument() {
    const docName = this.documentExpected[this.documentIndex]['name'];
    swal({
      title: this.translate.instant('DASHBOARD.TASK_S7.TITLE', { docName: docName }),
      text: this.translate.instant('DASHBOARD.TASK_S7.TEXT'),
      type: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('DASHBOARD.TASK_S7.YES'),
      cancelButtonText: this.translate.instant('DASHBOARD.TASK_S7.NO'),
    }).then( (isConfirm) => {
      this.uploader.queue[0].upload();
    },(dismiss) => {
      this.clearUploadQueue();
    });
  }

  clearUploadQueue() {
    this.uploader.clearQueue();
    this.uploadInput.nativeElement.value = '';
  }

  hasAllDocUploaded() {
    if ( this.documentExpected && this.documentExpected.length ) {
      const allDocs = [...this.documentExpected];
      const docUploaded = allDocs.filter( doc => doc && doc.documentId);

      return (this.documentExpected.length !== docUploaded.length);
    } else {
      return false;
    }
  }
}
