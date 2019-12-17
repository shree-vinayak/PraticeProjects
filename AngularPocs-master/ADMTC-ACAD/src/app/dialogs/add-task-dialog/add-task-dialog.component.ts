import { UtilityService } from './../../services/utility.service';
import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdSlideToggleChange, DateAdapter, NativeDateAdapter, MD_NATIVE_DATE_FORMATS, MD_DATE_FORMATS } from '@angular/material';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Country } from '../../models/country.model';
import { Company } from '../../models/company.model';
import { UserService } from '../../services/users.service';
import { LoginService } from '../../services/login.service';
import { Tasks } from '../../models/tasks.model';
import { TasksService } from '../../services/tasks.service';
declare var swal: any;
import { DatePipe } from '@angular/common';
import { Problematic } from '../../components/student/student-details/student-problematic/problematic.model';
import { StudentsService } from '../../services/students.service';
import _ from 'lodash';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.scss'],
  providers: [DatePipe]
})
export class AddTaskDialogComponent implements OnInit {
  isProblematicTask: boolean = false;
  isDocUploadTask = false;
  studentProblematicInfo: Problematic;
  studentBeingValidated = ''; // From the student-details-list => Student first name + student last name
  form: FormGroup;
  company: Company;
  companyID: any;
  AssignTo: any = [];
  allUsers: any = [];
  modify = false;
  submitForm: boolean = false;
  userCatStatus = false;
  statusList = [{
    value: 'Todo',
    view: this.translate.instant('TASK.TODO')
  }, {
    value: 'InProgress',
    view: this.translate.instant('TASK.INPROGRESS')
  }, {
    value: 'Done',
    view: this.translate.instant('TASK.DONE')
  }];
  RNCPTitles: any = [];
  userIdList: any = [];
  userTypeList: any = [];
  taskid: string;
  isUserSelected = false;
  userName = '';
  task: Tasks;
  title: string;
  today = new Date();
  selectedRNCP;
  selectedUser;
  selectedRNCPDetails;
  currentUser;
  minDate = new Date(new Date().setDate(new Date().getDate() - 1));
  isInternalTask = false;
  currentInternalDocString = '';
  internalExpectedDoc: { name: string }[] = [];
  dispInternalTask = false;
  constructor(
    private dialogRef: MdDialogRef<AddTaskDialogComponent>,
    private translate: TranslateService,
    private service: UserService,
    private _fb: FormBuilder,
    private taskService: TasksService,
    private _login: LoginService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private configService: ConfigService,
    private studentsService: StudentsService,
    public utilityService: UtilityService) {
  }

  ngOnInit() {
    if (!this.isProblematicTask || !this.isDocUploadTask) {

      this.service.getAllRNCPTitlesShortName().subscribe((response) => {
        const data = response.data;
        this.RNCPTitles = [];
        if (data) {
          data.forEach((rep) => {
            this.RNCPTitles.push({
              id: rep._id,
              text: rep.shortName
            });
          });
        }
        this.RNCPTitles = this.RNCPTitles.sort(this.keysrt('text'));
      });

      this.currentUser = this._login.getLoggedInUser();
      // console.log('this.currentUser', this.currentUser);
      console.log('this.task', this.task);
      console.log('this.task', this.taskid);

      if (this.taskid !== undefined) {
        this.title = 'Edit Task';
        this.modify = true;
        this.AddinitializeFormGroup();
        this.userCatStatus = this.task.userSelection.selectionType === 'user' ? false : true;
        // this.taskService.getTaskById(this.taskid).subscribe(response => {
        //     this.modify = true;
        //     this.task = response
        //     console.log("Edit")
        console.log(this.task);
        //     console.log(response);
        //     this.initializeFormGroup();
        // });
        this.selectedRNCP = this.task.rncp['_id'];
        if (this.task.userSelection.userId) {
          this.selectedUser = this.task.userSelection.userId._id;
        }

        this.GetAllUser();
      } else {
        this.title = 'Add Task';
        this.modify = false;
        // this.initializeFormGroup();
        this.AddinitializeFormGroup();
      }


      this.service.getUserTypesByEntities('academic').subscribe((response) => {
        let items = response.data;
        // items = items.sort(this.keysrt('name'));
        console.log(response);
        this.userTypeList = [];
        items.forEach((item) => {
          this.userTypeList.push({ '_id': item._id, 'name': this.getTranslateADMTCSTAFFKEY(item.name) });
        });
        this.userTypeList = this.userTypeList.sort(this.keysrt('name'));
      });
    } else {
      this.title = 'STUDENT.PROBLEMATIC_TITLE';
      this.AddinitializeFormGroup();
    }
    this.getConfigDetails();
    if (this.task['documentExpected'].length) {
      this.internalExpectedDoc = this.task['documentExpected'];
    }
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key].toLocaleUpperCase() > b[key].toLocaleUpperCase()) {
        return 1;
      } else if (a[key].toLocaleUpperCase() < b[key].toLocaleUpperCase()) {
        return -1;
      }
      return 0;
    };
  }

  ChangeRNCPTitle(data) {
    if (data.hasOwnProperty('id')) {
      this.selectedRNCP = data.id;
      this.GetAllUser();
      this.form.get('userName').setValue('');
    }
  }
  ChangeAssignTo() {
    this.AssignTo.forEach(element => {
      if (element._id === this.selectedUser) {
        this.form.controls.userSelection['controls'].userTypeId.setValue(element.userType);
      }
    });

  }
  GetAllUser() {
    this.currentUser = this._login.getLoggedInUser();
    var userId = this.currentUser._id

    const body = {
      userId: userId,
      rncpTitleId: this.selectedRNCP
    }

    this.service.getUserByTitleAndType(body).subscribe((response) => {
      this.allUsers = response.data;
      this.allUsers = this.allUsers.sort(this.keysrt('firstName'));
      this.AssignTo = this.allUsers;
    });

    this.service.getUserTypesByEntities('academic').subscribe((response) => {
      let items = response.data;
      this.userTypeList = [];
      items = items.sort(this.keysrt('name'));
      console.log(response);
      items.forEach((item) => {
        this.userTypeList.push({ '_id': item._id, 'name': this.getTranslateADMTCSTAFFKEY(item.name) });
      });
      this.userTypeList = this.userTypeList.sort(this.keysrt('name'));
    });

  }

  getUserForInternalTask() {
    this.service.getUserForInternalTask().subscribe(
      (response) => {
        if (response.data) {
          this.allUsers = response.data;
          this.allUsers = this.allUsers.sort(this.keysrt('firstName'));
          this.AssignTo = this.allUsers;
        }
      }
    )
  }

  toggleFinalScore(event: MdSlideToggleChange) {
    this.userCatStatus = event.checked;
    if (this.userCatStatus === false) {
      this.form.get('userSelection.userTypeId').setValue(undefined);
    } else {
      this.form.get('userSelection.userId').setValue(undefined);
    }
    console.log('Toggle Value : ', this.userCatStatus);
  }

  deleteTask() {
    const self = this;
    swal({
      title: 'Attention',
      text: this.translate.instant('TASK.MESSAGE.TASKDELETECONFIRM') + ' ' + ' ?',
      type: 'question',
      allowEscapeKey: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant('NO'),
      confirmButtonText: this.translate.instant('YES')
    }).then(() => {
      self.taskService.removeTask(this.taskid).map((data) => {
        swal({
          title: 'Success',
          text: this.translate.instant('TASK.MESSAGE.TASKDELETESUCCESS'),
          allowEscapeKey: true,
          type: 'success'
        }).then(function () {
          self.dialogRef.close(true);
        }.bind(this));
      }).subscribe();

      // this.taskService.deleteTask(this.taskid);
      // swal('Success',this.translate.instant('TASK.MESSAGE.TASKDELETESUCCESS'),'success').then(function () {
      //     this.cancel();
      // }.bind(this));

      //    this.taskService.deleteTask(this.taskid).subscribe(status => {
      //        if (status) {
      //            swal(
      //                'Success',
      //                this.translate.instant('TASK.MESSAGE.TASKDELETESUCCESS'),
      //                'success'
      //            ).then(function () {
      //                debugger
      //                this.cancel();
      //            }.bind(this));
      //        }
      //        else {
      //            swal(
      //                'Attention',
      //                this.translate.instant('TASK.MESSAGE.TASKDELETEFAILED'),
      //                'warning'
      //            );
      //        }
      //    });
      // }, function (dismiss){
      //    if (dismiss === 'cancel') {
      //    }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  addTask() {
    this.task = new Tasks();
    console.log(this.form);
    if (this.form.valid && !this.isProblematicTask && !this.isDocUploadTask) {
      Object.assign(this.task, this.form.value);

      if (this.task.userSelection.selectionType.toString() === 'true') {
        this.task.userSelection.selectionType = 'userType';
        this.task.assignedTo = this.task.userSelection.userTypeId._id;
        this.task.userSelection.userId = undefined;
      } else {
        this.task.userSelection.selectionType = 'user';
        if (this.task.userSelection.userId) {
          this.task.assignedTo = this.task.userSelection.userId._id;
          this.task.userSelection.userTypeId = undefined;
        } else {
          this.isUserSelected = true;
          return;
        }
      }
      this.task.rncp = this.selectedRNCP;
      this.task.lang = this.translate.currentLang.toLocaleUpperCase();

      if (this.isInternalTask) {
        this.task['type'] = 'internalTask';
        this.task['rncp'] = undefined;
      }

      // if (this.internalExpectedDoc.length) {
        this.task['documentExpected'] = this.internalExpectedDoc;
      // }

      if (this.modify) {
        this.task._id = this.taskid;
        delete this.task['status'];
        this.task.createdBy = this.currentUser._id;
        this.task.createdDate = this.datepipe.transform(new Date(), 'MM-dd-yyyy');
        this.task.dueDate = this.datepipe.transform(this.task.dueDate, 'MM-dd-yyyy');
        this.task.taskStatus = 'Todo';

        const self = this;
        delete this.task['userName'];
        this.taskService.updateTask(this.taskid, this.task).subscribe(value => {
          console.log('Task Created');
          if (value['data']) {
            this.dialogRef.close(value.data);
            swal({
              title: 'Success',
              text: this.translate.instant('TASK.MESSAGE.TASKUPDATESUCCESS'),
              allowEscapeKey: true,
              type: 'success',
              confirmButtonText: 'OK'
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
      } else {
        this.task.createdBy = this.currentUser._id;
        this.task.createdDate = this.datepipe.transform(new Date(), 'MM-dd-yyyy');
        this.task.dueDate = this.datepipe.transform(this.task.dueDate, 'MM-dd-yyyy');
        this.task.taskStatus = 'Todo';
        const self = this;
        delete this.task['_id'];
        delete this.task['status'];
        delete this.task['userName'];

        console.log(this.task);
        this.taskService.createTask(this.task).subscribe(value => {
          console.log('Task Created');
          if (value['data']) {
            this.dialogRef.close(value.data);
            swal({
              title: this.translate.instant('USERS.MESSAGE.SUCCESS'),
              text: this.translate.instant('TASK.MESSAGE.TASKADDSUCCESS'),
              type: 'success',
              allowEscapeKey: true,
              confirmButtonText: 'OK'
            });
          } else {
            swal({
              title: 'Attention',
              text: this.translate.instant('TASK.MESSAGE.TASKADDFAILED'),
              allowEscapeKey: true,
              type: 'warning'
            });
          }
        });
      }
    } else if (this.form.valid && this.isProblematicTask) {
      this.createProbleamticTask();
    } else if (this.form.valid && this.isDocUploadTask) {
      this.createDocumentRejectedTask();
    } else {
      this.submitForm = true;
    }
  }

  AddinitializeFormGroup() {
    this.selectedRNCP = this.modify ? this.task.rncp['_id'] : '';
    this.form = new FormGroup({
      rncp: new FormControl(this.modify ? [{ id: this.task.rncp['_id'], text: this.task.rncp['shortName'] }] : '', Validators.required),
      userSelection: this.fb.group({
        'selectionType': [this.modify ? (this.task.userSelection.selectionType === 'user' ? false : true) : false],
        'userTypeId': [this.modify && this.task.userSelection.selectionType === 'userType' ? this.task.userSelection.userTypeId._id : ''],
        'userId': [this.modify && this.task.userSelection.selectionType === 'user' ? this.task.userSelection.userId._id : '']
      }),
      userName: new FormControl(''),
      priority: new FormControl(this.modify ? this.task.priority : '', Validators.required),
      dueDate: new FormControl(this.modify ? new Date(this.task.dueDate) : '', [Validators.required]),
      description: new FormControl(this.modify ? this.task.description : '', [Validators.required]),
    });

    if (this.modify) {
      if (this.task.userSelection.selectionType === 'user') {
        this.userName = this.task.userSelection.userId.firstName + ' ' + this.task.userSelection.userId.lastName;
        this.form.get('userName').setValue(this.userName);
        this.form.get('userSelection.userId').setValue(this.task.userSelection.userId._id);
        this.form.get('userSelection.userTypeId').setValue(undefined);
      }
    } else if (this.isProblematicTask) {
      const studentName = this.studentProblematicInfo.studentId.firstName + ' ' + this.studentProblematicInfo.studentId.lastName;
      this.form.get('rncp').setValue(this.RNCPTitles);
      this.form.get('priority').setValue(1);
      this.form.get('userName').setValue(studentName);
      this.form.get('rncp').disable();
      this.form.get('priority').disable();
      this.form.get('userName').disable();
      this.form.get('userSelection.selectionType').disable();
    } else if (this.isDocUploadTask) {
      this.form.get('rncp').setValue(this.RNCPTitles);
      this.form.get('priority').setValue(1);
      this.form.get('userName').setValue(this.studentBeingValidated);
      this.form.get('rncp').disable();
      this.form.get('priority').disable();
      this.form.get('userName').disable();
      this.form.get('userSelection.selectionType').disable();
    }
  }

  getTranslateADMTCSTAFFKEY(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  selectedUserName(user) {
    this.form.get('userSelection.userId').setValue(user._id);
    this.form.get('userSelection.userTypeId').setValue(undefined);
    this.isUserSelected = false;
  }

  searchUserList(event) {
    this.form.get('userSelection.userId').setValue(undefined);
    if (event.target.value !== '') {
      const val = event.target.value.toLowerCase();
      this.AssignTo = this.allUsers
      const temp = this.AssignTo.filter(function (user) {
        return (
          (user.lastName !== '' && user.lastName.toLowerCase().indexOf(val) !== -1));
      });
      this.AssignTo = temp;
    } else {
      this.AssignTo = this.allUsers;
    }
  }

  createProbleamticTask() {
    this.studentProblematicInfo.task.description = this.translate.instant('PROBLEMATICFORM.TASK_DESCP_INIT') + ' : ' + this.form.get('description').value;
    this.studentProblematicInfo.task.dueDate = this.form.get('dueDate').value;
    this.studentProblematicInfo.studentId = this.studentProblematicInfo.studentId._id;
    console.log('createProbleamticTask this.studentProblematicInfo', this.studentProblematicInfo);
    this.studentsService.updateProblemetic(this.studentProblematicInfo).subscribe(res => {
      console.log(res);
      if (res.data && res.data._id) {
        this.dialogRef.close(res.data);
      }
    });
  }

  createDocumentRejectedTask() {
    this.dialogRef.close({
      description: this.form.value.description,
      dueDate: this.form.get('dueDate').value
    });
  }

  // Internal task Changes

  toggleInternalTask(event: MdSlideToggleChange) {
    console.log('toggleInternalTask MdSlideToggleChange', event);
    this.isInternalTask = event.checked;
    if (this.isInternalTask) {
      this.getUserForInternalTask();
      this.userCatStatus = false;
      this.form.get('userSelection.userId').setValue(undefined);
      this.form.get('userSelection.userTypeId').setValue(undefined);
      this.form.get('rncp').setValue(undefined);
      this.form.get('rncp').clearValidators();
      this.form.get('rncp').disable();
    } else {
      this.GetAllUser();
      this.form.get('rncp').enable();
      this.form.get('rncp').setValidators([Validators.required]);
    }
  }

  addDocumentExpected() {
    if (this.currentInternalDocString.trim()) {
      this.internalExpectedDoc.push({ name: this.currentInternalDocString });
      this.internalExpectedDoc = [..._.uniqBy(this.internalExpectedDoc, (doc) => doc.name.trim().toLowerCase())];
      this.currentInternalDocString = '';
    }
  }

  removeDocumentExpected(index) {
    this.internalExpectedDoc.splice(index, 1);
  }

  getConfigDetails() {
    this.configService.getConfigDetails().subscribe(
      (data) => {
        if (data.dispInternalTask) {
          this.dispInternalTask = data.dispInternalTask;
        }
      },
      (error) => {
        console.log('getConfigDetails data', error);
      });
  }
}
