import { AppSettings } from './../../app-settings';
import { LoginService } from './../../services/login.service';
import { UtilityService } from 'app/services';
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
import { ProblematicCorrectorService } from '../../services/problematic-corrector.service';
const log = Log.create('AssignCorrectorProblematicDialogComponent');
log.color = 'violet';

@Component({
  selector: 'app-assign-corrector-problematic-dialog',
  templateUrl: './assign-corrector-problematic-dialog.component.html',
  styleUrls: ['./assign-corrector-problematic-dialog.component.scss'],
  providers: [DashboardService, DatePipe],
})
export class AssignCorrectorProblematicDialogComponent implements OnInit {
  //  public test;
  public task;
  correctorId = '';
  userList = [];
  users = [];
  dateType = '';
  assignBody = null;
  rncp = null;
  school = null;
  correctorObj;
  message = '';
  message2 = '';
  message3 = '';
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
  schoolLength = 0;
  assignedCorrector = [];
  constructor(
    private dialogRef: MdDialogRef<AssignCorrectorProblematicDialogComponent>,
    private userservice: UserService,
    public translate: TranslateService,
    public dashboardservice: DashboardService,
    private utilityService: UtilityService,
    private loginService: LoginService,
    private problematicCorrectorService: ProblematicCorrectorService,
  ) {}

  ngOnInit() {
    this.getUsers();
    this.datePipe = new DatePipe(this.translate.currentLang);
    // this.date = this.datePipe.transform(this.task.dueDate);
    this.date = moment(this.task.dueDate).format('DD MMM YYYY');
    this.problematicCorrectorService
      .countTotalOfSchool(this.rncp._id)
      .subscribe(response => {
        const resp = response.json();
        this.schoolLength = resp.total;
      });
  }

  getUsers() {
    this.problematicCorrectorService
      .findCorrectorCertifier({
        schoolId: this.school ? this.school._id : this.task.test.school,
        rncpTitle: this.rncp._id,
      })
      .subscribe(result => {
        const listCorrector = result.json();
        for (const lc of listCorrector.data) {
          this.userList.push({
            text:
              this.translate.instant(
                'USERS.ADDEDITUSER.CIVILITY.' + lc.civility,
              ) +
              ' ' +
              lc.firstName +
              ' ' +
              lc.lastName,
            id: lc,
          });
        }
        this.userList = [...this.userList];
        this.userList = this.userList.sort(this.keysrt('text'));
        if (this.isEditAssignCorrector) {
          this.computeAssignedCorrectors();
        }
      });
  }

  computeAssignedCorrectors() {
    const assignedCorrectors = _.intersectionWith(
      this.userList,
      this.task.correctorsAssigned,
      (user, correctorAssigned) => {
        return (
          correctorAssigned.correctorId &&
          correctorAssigned.correctorId._id === user.id._id
        );
      },
    );

    this.assignedCorrectors = [...assignedCorrectors];

    if (this.task.correctorsAssigned.length >= 1) {
      log.data(
        'computeAssignedCorrectors this.task.correctorsAssigned length',
        this.task.correctorsAssigned.length,
      );
      log.data(
        'computeAssignedCorrectors this.task.correctorsAssigned',
        this.task.correctorsAssigned,
      );

      this.assignedUsers = [];

      this.task.correctorsAssigned.forEach(correctorsAssign => {
        this.assignedUsers.push({
          text:
            this.utilityService.computeCivility(
              correctorsAssign.correctorId.sex,
              this.translate.currentLang.toUpperCase(),
            ) +
            ' ' +
            correctorsAssign.correctorId.firstName +
            ' ' +
            correctorsAssign.correctorId.lastName,
          numberOfStudents: correctorsAssign.noOfStudents,
        });
      });

      this.displayAssignedCorrectors = true;
      log.data('computeAssignedCorrectors() assignedUsers', this.assignedUsers);
      log.data(
        'computeAssignedCorrectors() displayAssignedCorrectors',
        this.displayAssignedCorrectors,
      );
    }
  }

  selectedFromList(event) {
    this.displayAssignedCorrectors = false;
    log.data(
      'selectedFromList(event) displayAssignedCorrectors',
      this.displayAssignedCorrectors,
    );
  }

  removedFromList(event) {
    this.displayAssignedCorrectors = false;
    log.data(
      'removedFromList(event) displayAssignedCorrectors',
      this.displayAssignedCorrectors,
    );
  }

  keysrt(key) {
    return function(a, b) {
      if (a[key] > b[key]) {
        return 1;
      } else if (a[key] < b[key]) {
        return -1;
      }
      return 0;
    };
  }

  changeUser(event) {
    this.users = [];

    if (event.length) {
      const users = event;
      users.forEach(item => {
        this.users.push({
          id: item.id,
          text: item.text,
          //  types: item.types,
        });
        this.users = [...this.users];
      });
    }
    if (event.length === 1 && this.schoolLength >= event.length) {
      const loggedInUser = JSON.parse(localStorage.getItem('loginuser'));
      const userId = this.users[0].id._id;
      if (loggedInUser._id === userId) {
        this.message = this.translate.instant(
          'DASHBOARD.ASSIGN_CORRECTOR.ASSIGN_CORRECTOR_HIMSELF_MESSAGE',
          { testDate: this.testDate, dateType: this.dateType },
        );
        this.assignBody = {
          correctorAssigned: [
            {
              correctorId: event[0].id._id,
            },
          ],
          lang: this.translate.currentLang.toUpperCase(),
        };
        this.disableSubmit = false;
      } else {
        this.userName = this.users[0].text;
        this.message = this.translate.instant(
          'DASHBOARD.ASSIGN_CORRECTOR.ASSIGN_CORRECTOR_PROBLEMATIC_MESSAGE',
          {
            userName: this.userName,
          },
        );
        this.assignBody = {
          correctorAssigned: [
            {
              correctorId: event[0].id._id,
            },
          ],
          lang: this.translate.currentLang.toUpperCase(),
        };
      }
      this.disableSubmit = false;
    } else if (event.length > 1 && this.schoolLength >= event.length) {
      this.message = this.translate.instant(
        'DASHBOARD.ASSIGN_CORRECTOR.ASSIGN_SEVERAL_PROBLEMATIC_CORRECTORS1',
      );
      this.userName = '';
      for(let i =0; i < this.users.length; i++) {
        this.userName += ` ${this.users[i].text} `  
      }
      // this.userName = this.users[1].text;
      this.message3 = this.translate.instant(
        'DASHBOARD.ASSIGN_CORRECTOR.ASSIGN_SEVERAL_CORRECTORS3',
        {
          userName: this.userName,
        },
      );
      this.message2 = this.translate.instant(
        'DASHBOARD.ASSIGN_CORRECTOR.ASSIGN_SEVERAL_CORRECTORS2',
        { testDate: this.testDate, dateType: this.dateType },
      );
      this.disableSubmit = false;
    } else if (this.schoolLength < event.length) {
      this.message = this.translate.instant(
        'DASHBOARD.ASSIGN_CORRECTOR.ASSIGNCORRECTORSSCHOOL_EXCEED',
      );
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
    let textnCorrectorsName: any = {};

    let assignedCorrectors = [];
    const correctorProblematics: string[] = [];

    for (const usr of this.users) {
      correctorProblematics.push(usr.id._id);
    }

    if (this.users.length > 1) {
      let manyCorrectorName = '';
      this.users.forEach((user) => {
        manyCorrectorName += `${user.text} <br/>`;
      });
      textnCorrectorsName = {
        text: 'TEXT_MANY_PROBLEMATIC',
        correctorsName: manyCorrectorName
      };
    } else if (this.users.length === 1) {
      const correctorId = this.users[0].id;
      if (correctorId === this.loginService.getLoggedInUser()._id) {
        textnCorrectorsName = {
          correctorsName: ''
        };
      } else {
        const otherUser = this.userList.find((user) => {
          return correctorId === user.id;
        });
        log.data('checkAssignedUser otherUser', otherUser);
        textnCorrectorsName = {
          text: 'TEXT_OTHER_ONE_PROBLEMATIC',
          correctorsName: otherUser.text
        };
      }
    }

    let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
    swal({
      type: 'warning',
      title: this.translate.instant('ASSIGN_CORR.TITLE'),
      html: this.translate.instant('ASSIGN_CORR.' + textnCorrectorsName.text ,
        {
          correctorsName: textnCorrectorsName.correctorsName
        }),
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('ASSIGN_CORR.I_CONFIRM_IN', {
        timer: timeDisabledinSec,
      }),
      cancelButtonText: this.translate.instant('CANCEL'),
      onOpen: () => {
        swal.disableConfirmButton();
        const confirmButtonRef = swal.getConfirmButton();

        // TimerLoop for derementing timeDisabledinSec
        const timerLoop = setInterval(() => {
          timeDisabledinSec -= 1;
          confirmButtonRef.innerText = this.translate.instant(
            'ASSIGN_CORR.I_CONFIRM_IN',
            { timer: timeDisabledinSec },
          );
        }, 1000);

        // Resetting timerLoop to stop after required time of execution
        setTimeout(() => {
          confirmButtonRef.innerText = this.translate.instant(
            'ASSIGN_CORR.I_CONFIRM',
          );
          swal.enableConfirmButton();
          clearTimeout(timerLoop);
        }, timeDisabledinSec * 1000);
      },
    }).then(
      isConfirm => {
        if (isConfirm) {
          this.problematicCorrectorService
            .assignCorrectorOfProblematic({
              correctorProblematics: correctorProblematics,
              rncpTitle: this.rncp._id,
              taskId: this.task._id,
            })
            .subscribe(response => {
              const resp = response.json();
              console.log(response);
              if (resp.code === 200) {
                swal('Success !', '', 'success');
                this.dialogRef.close(this.task._id);
              } else {
                swal('Error', '', 'error');
                this.dialogRef.close(this.task);
              }
            });
        }
      },
      dismiss => {},
    );
  }
}
