import { LoginService } from './../../../../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as Quill from 'quill';
import { MdDialog, MdDialogRef } from '@angular/material';
import { UtilityService } from '../../../../../services/utility.service';
import swal from 'sweetalert2';
import { TranslateService } from 'ng2-translate';
import { MentorEvaluationService } from '../../../../../services/mentor-evaluation.service';

import { Log } from 'ng2-logger';
import { GlobalConstants } from '../../../../../shared/settings';
const log = Log.create('MentorEvalNotifComponent');
log.color = 'blue';

@Component({
  selector: 'app-mentoreval-notif-editor',
  templateUrl: './mentor-eval-notif.component.html',
  styleUrls: ['./mentor-eval-notif.component.scss']
})
export class MentorEvalNotifComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  student;
  currentUser;
  notificaitonText: string = '';
  subjectText: string = '';

  /*************************************************************************
   *   CONSTRUCTOR
   *************************************************************************/
  constructor(
    public dialogRef: MdDialogRef<MentorEvalNotifComponent>,
    private translate: TranslateService,
    private mentorEvaluationService: MentorEvaluationService,
    private utilityService: UtilityService,
    private datepipe: DatePipe,
    private loginService: LoginService
  ) {
    log.info('Contructor Invoked');
  }

  /*************************************************************************
   *   EVENTS
   *************************************************************************/
  ngOnInit() {
    this.currentUser = this.loginService.getLoggedInUser();
    this.initialNotifTextWithPlaceHolders();
  }

  /*************************************************************************
   *   METHODS
   *************************************************************************/

  initialNotifTextWithPlaceHolders() {
    this.notificaitonText = this.translate.instant(
      'MENTOR_EVAL_NOTIFICATIONS.MENTEVAL_N1.BODY',
      this.populatePlaceHolder()
    );
    this.subjectText = this.translate.instant(
      'MENTOR_EVAL_NOTIFICATIONS.MENTEVAL_N1.SUBJECT',
      { dueDate: this.populatePlaceHolder().dueDate }
    );
  }

  populatePlaceHolder() {
    const date = this.datepipe.transform(
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      'dd/M/yyyy'
    );
    let PlaceHoders;
    if (this.student) {
      PlaceHoders = {
        dueDate: date,
        schoolName: this.student['school'].shortName,
        TitreDéveloppé: this.student['rncpTitle'].longName,
        ApprenantCivilité: this.utilityService.computeCivility(
          this.student['sex'],
          this.translate.currentLang.toLowerCase()
        ),
        ApprenantPrenom: this.student['firstName'],
        ApprenantNom: this.student['lastName'],
        senderCivility: this.utilityService.computeCivility(
          this.currentUser.sex,
          this.translate.currentLang.toLowerCase()
        ),
        senderFirstName: this.currentUser.firstName,
        senderLastName: this.currentUser.lastName,
        senderPostion: this.currentUser.position ? this.currentUser.position : '',
        mentorGuideLink: GlobalConstants.mentorGuideLink,
        TuteurCivilité: '',
        TuteurPrenom: '',
        TuteurNom: ''
      };
      for (let index = 0; index < this.student['companies'].length; index++) {
        const element = this.student['companies'][index];
        if (element.isActive) {
          PlaceHoders.TuteurPrenom = element.mentors.firstName;
          PlaceHoders.TuteurNom = element.mentors.lastName;
          PlaceHoders.TuteurCivilité = this.utilityService.computeCivility(
            element.mentors.sex,
            this.translate.currentLang.toLowerCase()
          );
        }
      }
    } else {
      PlaceHoders = {
        dueDate: date,
        schoolName: this.student['school'].shortName,
        senderCivility: this.utilityService.computeCivility(
          this.currentUser.sex,
          this.translate.currentLang.toLowerCase()
        ),
        senderFirstName: this.currentUser.firstName,
        senderLastName: this.currentUser.lastName,
        senderPostion: this.currentUser.position ? this.currentUser.position : ''
      };
    }
    return PlaceHoders;
  }

  sendMentorEvaluation() {
    const data = {
      student: [this.student._id],
      lang: this.translate.currentLang.toLowerCase(),
      mailSubject: this.subjectText,
      mailBody: this.notificaitonText.replace(/<br>/gi, '')
    };
    this.mentorEvaluationService.createMentorEvaluation(data).subscribe(
      value => {
        if (value.data) {
          swal({
            title: this.translate.instant(
              'TESTCORRECTIONS.MESSAGE.MENTQUEST_S12_TITLE'
            ),
            text: this.translate.instant(
              'TESTCORRECTIONS.MESSAGE.MENTQUEST_S12_TEXT'
            ),
            allowEscapeKey: true,
            type: 'success',
            confirmButtonText: this.translate.instant(
              'TESTCORRECTIONS.MESSAGE.MENTQUEST_S12_BTN'
            )
          });
          this.closeDialog(true);
        } else if (value.code === 400) {
          swal({
            title: 'Oops...',
            text: this.translate.instant(
              'BACKEND.MENTOR_EVALUATION.NO_TEST_CREATED',
              { rncpTitle: this.student.rncpTitle.shortName }
            ),
            allowEscapeKey: true,
            type: 'error'
          });
        }
      },
      error => {
        swal({
          title: 'Oops...',
          text: 'Something went Wrong',
          allowEscapeKey: true,
          type: 'error'
        });
      }
    );
  }

  closeDialog(state) {
    this.dialogRef.close(state);
  }
}
