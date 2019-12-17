import { Component, OnInit } from '@angular/core';
import { UserService, StudentsService, TestService, TasksService, UtilityService } from '../../../services';
import _ from 'lodash';
import { TranslateService } from 'ng2-translate';
import { MdDialogRef } from '@angular/material';

declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('AddTestTaskDialogComponent');
log.color = 'violet';

@Component({
  selector: 'app-add-test-task-dialog',
  templateUrl: './add-test-task-dialog.component.html',
  styleUrls: ['./add-test-task-dialog.component.scss']
})
export class AddTestTaskDialogComponent implements OnInit {

  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  RNCPTitles = [];
  selectedRNCP = [];

  Classes = [];
  selectedClass = [];

  Tests = [];
  selectedTest = [];

  Tasks = [];
  selectedTask = [];

  Users = [];
  selectedUser = [];

  /*************************************************************************
   *   CONSTRUCTOR
   *************************************************************************/
  constructor(
    private userService: UserService,
    private studentService: StudentsService,
    private testService: TestService,
    private taskService: TasksService,
    private translate: TranslateService,
    private utitlity: UtilityService,
    private dialogRef: MdDialogRef<AddTestTaskDialogComponent>,
  ) { }

  /*************************************************************************
   *   EVENTS
   *************************************************************************/
  ngOnInit() {
    this.getAllRNCPTitles();

  }

  /*************************************************************************
   *   METHODS
   *************************************************************************/
  ChangeRNCPTitle(event) {
    if (event.id) {
      console.log(event);
      this.Tasks = [];
      this.Users = [];
      this.Tests = [];
      this.Classes = [];
      this.selectedTask = [];
      this.selectedUser = [];
      this.selectedTest = [];
      this.selectedClass = [];
      this.getClassesBasedOnSelectedRNCP(event.id);
    }
  }

  getAllRNCPTitles() {
    this.userService.getAllRNCPTitlesShortName().subscribe(titles => {
      this.RNCPTitles = [];
      titles.data.forEach(title => {
        this.RNCPTitles.push(
        {
          'id': title._id,
          'text': title.shortName
        }
      );
      this.RNCPTitles = [..._.sortBy(this.RNCPTitles, ['text'])];
      });
    });
  }


  ChangeClass(event) {
    if (event.id) {
      console.log(event);
      this.Tasks = [];
      this.Users = [];
      this.Tests = [];
      this.selectedTask = [];
      this.selectedUser = [];
      this.selectedTest = [];
      this.getTestsBasedOnSelectedClass(event.id);
    }
  }

  getClassesBasedOnSelectedRNCP(rncpId) {
    this.studentService.getAllClassesRNCPTitle(rncpId).subscribe(classes => {
      this.Classes = [];
      classes.data.forEach(classs => {
        this.Classes.push(
          {
            'id': classs._id,
            'text': classs.name
          }
        );
        this.Classes = [..._.sortBy(this.Classes, ['text'])];
      });
    });
  }

  ChangeTest(event) {
    if (event.id) {
      this.Tasks = [];
      this.Users = [];
      this.selectedTask = [];
      this.selectedUser = [];
      console.log(event);
      this.getTasksBasedOnSelectedTest(event.id);
    }
  }

  getTestsBasedOnSelectedClass(classId) {
    this.testService.getTestsBasedOnClassId(classId).subscribe( tests => {
      this.Tests = [];
      tests.forEach(test => {
        this.Tests.push(
          {
            'id': test._id,
            'text': test.name
          }
        );
        this.Tests = [..._.sortBy(this.Tests, ['text'])];
      });
    });
  }

  ChangeTask(event) {
    if (event.id) {
      console.log(event);
      this.Users = [];
      this.selectedUser = [];
      this.selectedTask.push(event.id._id);
      this.getUsers(event.id);
    }
  }

  getTasksBasedOnSelectedTest(testId) {
    this.taskService.getTasksBasedOnTest(testId).subscribe(tasks => {
      this.Tasks = [];
      tasks.data.forEach(task => {
        this.Tasks.push(
          {
            'id': task,
            'text': this.getTranslatedTaskName(task.description.toUpperCase())
          }
        );
        this.Tasks = [..._.sortBy(this.Tasks, ['text'])];
      });
    });
  }


  ChangeUser(event) {
    if (event.id) {
      this.selectedUser.push(event);
      console.log(event);
    }
  }

  getUsers(taskObject) {

    const userTypeId = taskObject.userSelection.userTypeId;
    this.userService.getUserToAssignTasks(this.selectedRNCP[0].id, userTypeId).subscribe(users => {
      this.Users = [];
      users.data.forEach(user => {
        this.Users.push(
          {
            'id': user,
            'text': this.utitlity.computeCivility(user.sex, this.translate.currentLang) + ' ' + user.lastName + ' ' + user.firstName
          }
        );
        this.Users = [..._.sortBy(this.Users, function(u){ return u.lastName; })];
      });
    });
  }

  getTranslatedTaskName(text) {
    const value = this.translate.instant('TEST.AUTOTASK.' + text);
    return value != 'TEST.AUTOTASK.' + text ? value : text;
  }

  createManualTestTask() {
    const parentTaskId: string = this.selectedTask[0].id._id;
    const userIds: string[] = [];
    this.selectedUser.forEach( user => {
      userIds.push(user.id._id);
    });
    this.taskService.createManualTestTask(parentTaskId, userIds).subscribe( res => {
      log.data('createManualTestTask res.data', res.data);
      if ( res.data && res.data && res.data[0] ) {
        // Close the Dialog and Display Swal Alert
        this.closeDialog(res.data[0]);
        swal({
          title: this.translate.instant('USERS.MESSAGE.SUCCESS'),
          allowEscapeKey: true,
          type: 'success'
        });
      }
    });
  }

  closeDialog(state) {
    this.dialogRef.close(state);
  }

}
