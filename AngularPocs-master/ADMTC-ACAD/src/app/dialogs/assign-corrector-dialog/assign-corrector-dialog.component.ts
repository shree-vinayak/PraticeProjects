import { AppSettings } from './../../app-settings';
import { LoginService } from './../../services/login.service';
import { UtilityService, TestService } from 'app/services';
import { Component, OnInit, OnChanges } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { UserService } from '../../services/users.service';
import { TranslateService } from 'ng2-translate';
import * as moment from 'moment';
import { DashboardService } from '../../services/dashboard.service';
import _ from 'lodash';
import { DatePipe } from '@angular/common';
declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('AssignCorrectorDialogComponent');
log.color = 'violet';

@Component({
  selector: 'app-assign-corrector-dialog',
  templateUrl: './assign-corrector-dialog.component.html',
  styleUrls: ['./assign-corrector-dialog.component.scss'],
  providers: [DashboardService, DatePipe]
})
export class AssignCorrectorDialogComponent implements OnInit {
  //  public test;
  public task;
  correctorId = '';
  userList = [];
  users = [];
  dateType = '';
  assignBody = null;
  rncp = null;
  correctorObj;
  message = '';
  message2 = '';
  testDate;
  datePipe: DatePipe;
  date = null;
  disableSubmit = true;
  userName = '';
  correctorAssigned = [];
  isEditAssignCorrector: boolean = false;
  isFinalRetakeAssignCorrector = false;
  assignedCorrectors = [];
  assignedUsers = [];
  displayAssignedCorrectors: boolean = false;
  isCertifierAssignCorTask: boolean = false;
  schoolId: string = null;
  isQC = false;
  constructor(
    private dialogRef: MdDialogRef<AssignCorrectorDialogComponent>,
    private userservice: UserService,
    public translate: TranslateService,
    public dashboardservice: DashboardService,
    private utilityService: UtilityService,
    private loginService: LoginService,
    private testService: TestService
  ) { }

  ngOnInit() {

    this.getUsers();
    this.datePipe = new DatePipe(this.translate.currentLang);
    this.date = this.datePipe.transform(this.task.test.date);
    log.data('ngOnInit isEditAssignCorrector', this.isEditAssignCorrector)
  }

  getUsers() {
    this.userservice.getAcadStaffAndCorrectorUsers(
      this.rncp._id, this.schoolId ? this.schoolId : this.task.userSelection.entity.school._id, this.task._id).subscribe(result => {
      const userlist = result.data;
      for (const ul of userlist) {
        this.userList.push({
          text: this.translate.instant('USERS.ADDEDITUSER.CIVILITY.' + ul.civility) + ' ' + ul.firstName + ' ' + ul.lastName,
          id: ul,
        });
        this.userList = [...this.userList];
      }
      this.userList = this.userList.sort(this.keysrt('text'));
      if ( this.isEditAssignCorrector ) {
        this.computeAssignedCorrectors();
      }
    });
  }

  computeAssignedCorrectors() {
    const assignedCorrectors = _.intersectionWith(this.userList, this.task.correctorsAssigned, (user, correctorAssigned) => {
      return (correctorAssigned.correctorId && (correctorAssigned.correctorId._id === user.id._id));
    });

    this.assignedCorrectors = [...assignedCorrectors];

    if ( this.task.correctorsAssigned.length >= 1 ) {
      log.data('computeAssignedCorrectors this.task.correctorsAssigned length', this.task.correctorsAssigned.length);
      log.data('computeAssignedCorrectors this.task.correctorsAssigned', this.task.correctorsAssigned);

      this.assignedUsers = [];

      this.task.correctorsAssigned.forEach(correctorsAssign => {
        this.assignedUsers.push(
          { text: this.utilityService.computeCivility(correctorsAssign.correctorId.sex, this.translate.currentLang.toUpperCase()) + ' ' +
              correctorsAssign.correctorId.firstName + ' ' + correctorsAssign.correctorId.lastName,
            numberOfStudents: correctorsAssign.noOfStudents}
        );
      });

      this.displayAssignedCorrectors = true;
      log.data('computeAssignedCorrectors() assignedUsers', this.assignedUsers);
      log.data('computeAssignedCorrectors() displayAssignedCorrectors', this.displayAssignedCorrectors);
    }
  }

  selectedFromList(event) {
    this.displayAssignedCorrectors = false;
    log.data('selectedFromList(event) displayAssignedCorrectors', this.displayAssignedCorrectors);
  }

  removedFromList(event) {
    this.displayAssignedCorrectors = false;
    log.data('removedFromList(event) displayAssignedCorrectors', this.displayAssignedCorrectors);
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) { return 1; } else if (a[key] < b[key]) { return -1; };
      return 0;
    };
  }

  changeUser(event) {
    this.users = [];
    this.dateType = this.translate.instant('TEST.DATETYPES.' + this.task.test.dateType.toUpperCase());
    const today = new Date();
    const todayDate = moment(new Date());
    const dateObj = new Date(this.task.test.date);
    const thirtyDaysAfterTest = moment(new Date(new Date(today).setDate(today.getDate() + 30)));
    //  this.testDate = new Date(dateObj.setDate(dateObj.getDate() - 30)).toDateString();
    this.testDate = moment(dateObj).isBetween(todayDate, thirtyDaysAfterTest) ?
      today.toDateString() : new Date(new Date(dateObj).setDate(dateObj.getDate() - 30)).toDateString();
    this.testDate = this.datePipe.transform(this.testDate);
    log.data('changeUser this.testDate', this.testDate);

    if (event.length) {
      const users = event;
      users.forEach((item) => {
        this.users.push({
          id: item.id,
          text: item.text,
          //  types: item.types,
        });
        this.users = [...this.users];
      });
    }
    if (event.length === 1 && this.task.test.registeredStudents >= event.length) {
      const loggedInUser = JSON.parse(localStorage.getItem('loginuser'));
      const userId = this.users[0].id._id;
      if (loggedInUser._id === userId) {
        this.message = this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.ASSIGN_CORRECTOR_HIMSELF_MESSAGE', { testDate: this.testDate, dateType: this.dateType });
        this.assignBody = {
          correctorAssigned: [{
            correctorId: event[0].id._id,
            noOfStudents: this.task.test.registeredStudents
          }],
          lang: this.translate.currentLang.toUpperCase()
        };
        this.disableSubmit = false;
      } else {
        this.userName = this.users[0].text;
        this.message = this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.ASSIGN_CORRECTOR_MESSAGE', { userName: this.userName, testDate: this.testDate, dateType: this.dateType });
        this.assignBody = {
          correctorAssigned: [{
            correctorId: event[0].id._id,
            noOfStudents: this.task.test.registeredStudents
          }],
          lang: this.translate.currentLang.toUpperCase()
        };
      }
      this.disableSubmit = false;
    } else if (event.length > 1 && this.task.test.registeredStudents >= event.length) {
      this.message = this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.ASSIGN_SEVERAL_CORRECTORS1');
      if (this.task.test.registeredStudents % event.length === 0) {
        this.correctorAssigned = [];
        event.forEach(element => {
          //  this.correctorAssigned = [];
          this.users.push({
            text: element.text,
            numberOfStudents: this.task.test.registeredStudents / event.length
          });

          this.users = _.remove(this.users, function (user) {
            return user.numberOfStudents;
          });

          this.correctorAssigned.push({
            correctorId: element.id._id,
            noOfStudents: this.task.test.registeredStudents / event.length
          });

          this.correctorAssigned = [...this.correctorAssigned];
          this.users = [...this.users];

          this.assignBody = {
            correctorAssigned: this.correctorAssigned,
            lang: this.translate.currentLang.toUpperCase()
          };
        });
        this.disableSubmit = false;
      } else {
        this.correctorAssigned = [];
        event.forEach(element => {
          this.users.push({
            text: element.text,
            numberOfStudents: Math.floor(this.task.test.registeredStudents / event.length)
            //  numberOfStudents: this.users[0] && this.numberOfStudents this.users ? Math.floor(this.task.test.registeredStudents / event.length) : Math.floor(this.task.test.registeredStudents / event.length) + (this.task.test.registeredStudents % event.length)
          });

          this.users = _.remove(this.users, function (user) {
            return user.numberOfStudents;
          });

          this.correctorAssigned.push({
            correctorId: element.id._id,
            noOfStudents: Math.floor(this.task.test.registeredStudents / event.length)
          });
          this.users[0].numberOfStudents = Math.floor(this.task.test.registeredStudents / event.length) + (this.task.test.registeredStudents % event.length);
          this.correctorAssigned[0].noOfStudents = Math.floor(this.task.test.registeredStudents / event.length) + (this.task.test.registeredStudents % event.length);
          this.correctorAssigned = [...this.correctorAssigned];
          this.users = [...this.users];
          this.assignBody = {
            correctorAssigned: this.correctorAssigned,
            lang: this.translate.currentLang.toUpperCase()
          };
        });
      }
      this.message2 = this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.ASSIGN_SEVERAL_CORRECTORS2', { testDate: this.testDate, dateType: this.dateType });
      this.disableSubmit = false;

    } else if (this.task.test.registeredStudents < event.length) {
      this.message = this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.ASSIGNCORRECTORS_EXCEED');
      this.disableSubmit = true;
    } else {
      this.message = '';
      this.disableSubmit = true;
    }

  }

  cancel(state) {
    this.dialogRef.close(state);
  }

  submit() {
    if (!this.isEditAssignCorrector) {
      this.assignBody.schoolId =  this.isCertifierAssignCorTask ? this.task.test.school : this.task.userSelection.entity.school._id;
    } else {
      this.assignBody.oldCorrectors = this.task.correctorsAssigned;
      this.assignBody.schoolId = this.task.test.school;
    }
    this.assignBody.taskId = this.task._id;

    let textnCorrectorsName: any = {};

    let assignedCorrectors = [];

    if (this.assignBody.correctorAssigned.length > 1) {
      assignedCorrectors = _.intersectionWith(this.userList, this.assignBody.correctorAssigned,
        (user, correctorAssigned) => {
          return (correctorAssigned.correctorId && (correctorAssigned.correctorId === user.id._id));
        }
      );
      log.data('checkAssignedUser many assignedCorrectors', assignedCorrectors);
      let manyCorrectorName = '';
      assignedCorrectors.forEach((user) => {
        manyCorrectorName += `${user.text} <br/>`;
      });
      textnCorrectorsName = {
        text: 'TEXT_MANY',
        correctorsName: manyCorrectorName
      };
    } else if (this.assignBody.correctorAssigned.length === 1 && this.assignBody.correctorAssigned[0].correctorId) {
      const correctorId = this.assignBody.correctorAssigned[0].correctorId;
      if (correctorId === this.loginService.getLoggedInUser()._id) {
        log.data('checkAssignedUser selfUser');
        textnCorrectorsName = {
          text: 'TEXT_SELF_ONE',
          correctorsName: ''
        };
      } else {
        const otherUser = this.userList.find((user) => {
          return correctorId === user.id._id;
        });
        log.data('checkAssignedUser otherUser', otherUser);
        textnCorrectorsName = {
          text: 'TEXT_OTHER_ONE',
          correctorsName: otherUser.text
        };
      }
    }

    // Function to Execute When Corrector Assignmnet is confirmed by User
    const confirmAssignment = () => {
      this.dashboardservice.assignCorrectorSubmit(this.task.test._id, this.assignBody).subscribe(
        response => {
          if (response.code === 200) {
            this.dialogRef.close(this.task);
            swal({
              title: this.translate.instant('SUCCESS'),
              allowEscapeKey: true,
              type: 'success',
              confirmButtonText: 'OK'
            });
          }
        });
    };

    // Function to Execute When Corrector Assignmnet for Final Retake Test is confirmed by User
    const assignFinalReTake = () => {
      this.dashboardservice.finalAssignCorrectorSubmit(this.task.test._id, this.assignBody).subscribe(
        response => {
          if (response.code === 200) {
            this.dialogRef.close(this.task);
            swal({
              title: this.translate.instant('SUCCESS'),
              allowEscapeKey: true,
              type: 'success',
              confirmButtonText: 'OK'
            });
          }
        });
    };

    // Function to Execute When Corrector is changed for Final Retake
    const confirmchangeAssignCorrectorFinalReTake = () => {
      this.dashboardservice.changeAssignCorrectorForFinalRetake(this.task.test._id, this.assignBody).subscribe(
        response => {
          if (response.code === 200) {
            this.dialogRef.close(this.task);
            swal({
              title: this.translate.instant('SUCCESS'),
              allowEscapeKey: true,
              type: 'success',
              confirmButtonText: 'OK'
            });
          }
        });
    };

    // Function to Execute When Corrector Assignmnet is confirmed by User
    const confirmchangeAssignCorrector = () => {
      this.dashboardservice.changeAssignCorrector(this.task.test._id, this.assignBody).subscribe(
        response => {
          if (response.code === 200) {
            this.dialogRef.close(this.task);
            swal({
              title: this.translate.instant('SUCCESS'),
              allowEscapeKey: true,
              type: 'success',
              confirmButtonText: 'OK'
            });
          }
        });
    };

    let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
    swal({
      type: 'warning',
      title: this.translate.instant('ASSIGN_CORR.TITLE'),
      html: this.translate.instant('ASSIGN_CORR.' + textnCorrectorsName.text , {
        testName: this.task.test ? this.task.test.name : '',
        correctorsName: textnCorrectorsName.correctorsName
      }),
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('ASSIGN_CORR.I_CONFIRM_IN', { timer: timeDisabledinSec }),
      cancelButtonText: this.translate.instant('CANCEL'),
      onOpen: () => {
        swal.disableConfirmButton()
        const confirmButtonRef = swal.getConfirmButton();

        // TimerLoop for derementing timeDisabledinSec
        const timerLoop = setInterval(() => {
            timeDisabledinSec -= 1;
            confirmButtonRef.innerText = this.translate.instant('ASSIGN_CORR.I_CONFIRM_IN', { timer: timeDisabledinSec });
          }, 1000
        );

        // Resetting timerLoop to stop after required time of execution
        setTimeout(() => {
          confirmButtonRef.innerText = this.translate.instant('ASSIGN_CORR.I_CONFIRM');
          swal.enableConfirmButton();
          clearTimeout(timerLoop);
        }, (timeDisabledinSec * 1000));
      }
    }).then((isConfirm) => {
      if (this.isFinalRetakeAssignCorrector && !this.isEditAssignCorrector) {
        assignFinalReTake();
      } else if (!this.isEditAssignCorrector) {
        confirmAssignment();
      } else if (this.isEditAssignCorrector && this.task.type === 'retakeAssignCorrector') {
        confirmchangeAssignCorrectorFinalReTake();
      } else {
        confirmchangeAssignCorrector();
      }
    }, (dismiss) => {
    });
  }

  assignQualityCOntrollers() {
    let single = false;
    let multiple = false;
    const timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
    this.assignBody.taskId = this.task._id;

    let textnCorrectorsName: any = {};
    let assignedCorrectors = [];
    if (this.assignBody.correctorAssigned.length > 1) {
      assignedCorrectors = _.intersectionWith(this.userList, this.assignBody.correctorAssigned,
        (user, correctorAssigned) => {
          return (correctorAssigned.correctorId && (correctorAssigned.correctorId === user.id._id));
        }
      );
      log.data('checkAssignedUser many assignedCorrectors', assignedCorrectors);
      let manyCorrectorName = '';
      assignedCorrectors.forEach((user) => {
        manyCorrectorName += `${user.text} <br/>`;
      });
      textnCorrectorsName = {
        text: 'TEXT_MANY',
        correctorsName: manyCorrectorName
      };
      single = true;
    } else if (this.assignBody.correctorAssigned.length === 1 && this.assignBody.correctorAssigned[0].correctorId) {
      const correctorId = this.assignBody.correctorAssigned[0].correctorId;
      if (correctorId === this.loginService.getLoggedInUser()._id) {
        log.data('checkAssignedUser selfUser');
        textnCorrectorsName = {
          text: 'TEXT_SELF_ONE',
          correctorsName: ''
        };
      } else {
        const otherUser = this.userList.find((user) => {
          return correctorId === user.id._id;
        });
        log.data('checkAssignedUser otherUser', otherUser);
        textnCorrectorsName = {
          text: 'TEXT_OTHER_ONE',
          correctorsName: otherUser.text
        };
      }
      multiple = true;
    }

    if (this.assignedCorrectors.length === 1) {

      let formattedCivility: string;
      if (this.translate.currentLang.toLowerCase() === 'fr') {
        if(this.assignedCorrectors[0].id.civility === 'MR') {
          formattedCivility = 'M.';
        } else {
          formattedCivility = 'Mme';
        }
      } else if (this.translate.currentLang.toLowerCase() === 'en') {
        if (this.assignedCorrectors[0].id.civility === 'MR') {
          formattedCivility = 'Mr';
        } else {
          formattedCivility = 'Mrs';
        }
      }

      swal({
        type: 'warning',
        title: this.translate.instant('QUALITY_CONTROL.QUALITY_S1.TITLE'),
        html: this.translate.instant('QUALITY_CONTROL.QUALITY_S1.TEXT',
          {testName: this.task.test.name, qName: formattedCivility + ' ' + this.assignedCorrectors[0].id.firstName + ' ' + this.assignedCorrectors[0].id.lastName}),
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('QUALITY_CONTROL.QUALITY_S1.SUCCESSIN', { timer: timeDisabledinSec }),
        cancelButtonText: this.translate.instant('CANCEL'),
        onOpen: () => {
          this.showTimer();
        }
      }).then((isConfirm) => {
        this.assignCorr();
      }, (dismiss) => {
      });
    } else if (this.assignedCorrectors.length > 1) {
      // this.assignCorr();
      let str = '<ol style="display:flex;flex-direction: column;align-items: center;">';
      this.assignedCorrectors.forEach(element => {
        str += '<li style="text-align:left !important;">' +
          this.utilityService.computeCivility(element.id.sex, this.translate.currentLang.toUpperCase())
          + ' ' + element.id.firstName + ' ' + element.id.lastName + '</li>';
      });
      swal({
        type: 'warning',
        title: this.translate.instant('QUALITY_CONTROL.QUALITY_S2.TITLE'),
        html: this.translate.instant('QUALITY_CONTROL.QUALITY_S2.TEXT', {testName: this.task.test.name, qList: str}),
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('QUALITY_CONTROL.QUALITY_S1.SUCCESS', { timer: timeDisabledinSec }),
        cancelButtonText: this.translate.instant('CANCEL'),
        onOpen: () => {
          this.showTimer();
        }
      }).then((isConfirm) => {
        this.assignCorr();
      }, (dismiss) => {
      });
    }
  }

  showTimer() {
    let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
    swal.disableConfirmButton();
    const confirmButtonRef = swal.getConfirmButton();

    // TimerLoop for derementing timeDisabledinSec
    const timerLoop = setInterval(() => {
        timeDisabledinSec -= 1;
        confirmButtonRef.innerText = this.translate.instant('QUALITY_CONTROL.QUALITY_S1.SUCCESSIN', { timer: timeDisabledinSec });
      }, 1000
    );

    // Resetting timerLoop to stop after required time of execution
    setTimeout(() => {
      confirmButtonRef.innerText = this.translate.instant('QUALITY_CONTROL.QUALITY_S1.SUCCESS');
      swal.enableConfirmButton();
      clearTimeout(timerLoop);
    }, (timeDisabledinSec * 1000));
  }

  assignCorr() {
    this.testService.assignQualityCorrectors(this.assignBody, this.task.test._id).subscribe(
      res => {
        if (res.code === 200) {
          this.dialogRef.close(this.task);
        }
      }
    );
  }
}
