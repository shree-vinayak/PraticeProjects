import { Component, OnInit } from '@angular/core';
import { Tasks } from 'app/models/tasks.model';
import { MdDialogRef, MdInputModule } from '@angular/material';
import { Form, FormsModule } from '@angular/forms';
import { UtilityService } from 'app/services/utility.service';
import { TranslateService } from 'ng2-translate';
import { TasksService } from 'app/services/tasks.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('CreateCrosscorrectorDialogComponent');
log.color = 'orange';

@Component({
  selector: 'app-create-crosscorrector-dialog',
  templateUrl: './create-crosscorrector-dialog.component.html',
  styleUrls: ['./create-crosscorrector-dialog.component.css']
})
export class CreateCrosscorrectorDialogComponent implements OnInit {
  task;
  testName: string;
  testCompDate;
  isAssignByLoginUser = false;
  isTaskDone = false;
  comment = '';
  actionTaken = '';
  currentUser = null;
  isDetailsReadOnly: boolean = false;
  constructor(private dialogRef: MdDialogRef<CreateCrosscorrectorDialogComponent>,
    private taskService: TasksService,
    private translate: TranslateService,
    public utility: UtilityService,
    private router: Router,
    private loginService: LoginService
  ) {

  }

  ngOnInit() {
    this.currentUser = this.loginService.getLoggedInUser();
    if (this.task) {
      this.actionTaken = this.task.actionTaken;

      this.comment = this.task.comments;
      this.isDetailsReadOnly = this.task.taskStatus === 'Done' ? true : false;
      this.isTaskDone = this.isDetailsReadOnly;
    }
  }

  civiltyCount(gender: string) {
    this.utility.computeCivility(gender, this.translate.currentLang);
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
      const self = this;

      this.taskService.updateTask(currentTask._id, currentTask).subscribe((response) => {
        if (response.data) {
          log.data('updateTask create', response.data);
          self.dialogRef.close(response.data)
          swal({
            title: "Bravo!",
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
    let value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value != 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  createUser() {
    this.dialogRef.close();
    if (this.currentUser.entity.type.toLowerCase() === 'admtc') {
      this.router.navigate(['/admtc-users']);
    } else if (this.currentUser.entity.type.toLowerCase() === 'academic') {
      this.router.navigate(['/academic-users']);
    }
  }

}
