import { CrossCorrectionService } from './../cross-correction.service';
import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { UtilityService } from '../../../services/utility.service';
import { TasksService } from '../../../services';

import { Log } from "ng2-logger";
const log = Log.create('SendCopiesTaskDialogComponent');
log.color = 'red';

declare var swal: any;

@Component({
  selector: 'app-send-copies-task-dialog',
  templateUrl: './send-copies-task-dialog.component.html',
  styleUrls: ['./send-copies-task-dialog.component.scss']
})
export class SendCopiesTaskDialogComponent implements OnInit {
  task;
  // testName: string;
  isAssignByLoginUser = false;
  isTaskDone = false;
  isSendToCrossCorrectortask = true;
  comment = '';
  actionTaken = '';
  crossCorrectionDetails = null;
  certifierDetailsToSendCopies = null;
  constructor(private dialogRef: MdDialogRef<SendCopiesTaskDialogComponent>,
    private translate: TranslateService,
    private utilityService: UtilityService,
    private crossCorrectionService: CrossCorrectionService,
    private taskService: TasksService) {
  }

  ngOnInit() {
    if (this.task) {
      this.actionTaken = this.task.actionTaken;

      this.comment = this.task.comments;
    }
    log.data('isSendToCrossCorrectortask', this.isSendToCrossCorrectortask);
    if ( this.isSendToCrossCorrectortask ) {
      this.getCrossCorectorSchoolandStudents();
    } else {
      this.getCertifierForValidationDetails();
    }
  }

  computeCivility(gender: string) {
    return this.utilityService.computeCivility(gender, this.translate.currentLang.toLowerCase());
  }

  closeDialog(status) {
    this.dialogRef.close(status);
  }

  getCrossCorectorSchoolandStudents() {
    const postObject = {
                  rncpId: this.task.rncp._id,
                  classId: this.task.test.class._id,
                  testId: this.task.test._id,
                  taskId: this.task._id,
                  lang: this.translate.currentLang.toLowerCase()
                }
    this.crossCorrectionService.getCorrectorsAndStudentsforSendCopyTask(postObject).subscribe( 
      response => {
        log.data('crossCorrectionService.getCorrectorsAndStudentsforSendCopyTask response', response);
        if ( response.data && response.data[0] ) {
          this.crossCorrectionDetails = response.data[0];
          log.data('crossCorrectionService.getCorrectorsAndStudentsforSendCopyTask crossCorrectionDetails', this.crossCorrectionDetails);
        }
       },
      error => log.data('crossCorrectionService.getCorrectorsAndStudentsforSendCopyTask error', error));
  }

  getCertifierForValidationDetails() {
    this.crossCorrectionService.getCertifierDetailsToSendCopy(this.task._id).subscribe(
      response => {
        log.data('crossCorrectionService.getCertifierDetailsToSendCopy response', response);
        if ( response.data ) {
          this.certifierDetailsToSendCopies = response.data;
          log.data('crossCorrectionService.getCertifierDetailsToSendCopy crossCorrectionDetails', this.certifierDetailsToSendCopies);
        }
       },
      error => log.data('crossCorrectionService.getCertifierDetailsToSendCopy error', error));
  }

  getTranslateADMTCSTAFFKEY(name) {
    console.log(name);
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  completeSendCopiesTask() {
        const currentTask = this.task;
        currentTask.actionTaken = this.actionTaken;
        currentTask.taskStatus = this.isTaskDone ? 'Done' : 'Todo';
        currentTask.comments = this.comment;
        const self = this;

        this.taskService.updateTask(currentTask._id, currentTask).subscribe((response) => {
          if (response.data) {
            log.data('completeSendCopiesTask response.data', response.data);
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
