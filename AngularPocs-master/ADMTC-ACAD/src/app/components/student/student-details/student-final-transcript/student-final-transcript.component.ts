import { StudentsService } from './../../../../services/students.service';
import { map } from 'rxjs/operator/map';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ButtonStatus } from '../../../../shared/button-status';
import { TranscriptModel } from './final-transcript-model';
import { FinalTranscriptService } from '../../../settings/settingSteps/final-transcript-dialog/final-transcript.service';
import { TranslateService } from 'ng2-translate';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import _ from 'lodash';
import { UtilityService } from '../../../../services';
import { PDFResultService } from '../../../settings/settingSteps/final-transcript-dialog/pdf-result.service';
declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('StudentDetailsComponent2');
log.color = 'blue';

@Component({
  selector: 'app-student-final-transcript',
  templateUrl: './student-final-transcript.component.html',
  styleUrls: ['./student-final-transcript.component.scss'],
  providers: [DatePipe, PDFResultService]
})
export class StudentFinalTranscriptComponent implements OnInit, OnChanges {

  transcript: TranscriptModel;
  status: ButtonStatus;
  title: string;
  subtitle: string;
  transcriptDetail: any;
  datePipe: DatePipe;
  allDates = {
    schoolDate: '',
    juryDecisionDate: '',
    studentDecisionDate: '',
    retakeTestResult: '',
    afterFinalRetakeDecisionGeneratedOn: ''
  };
  resultStatusArray = ['pass', 'failed', 'retaking', 'eliminated'];
  juryDecision: string = '';
  @Input() student;
  finalRetakeTests: any;
  jurySelectTests: any;
  juryFinalDecision: any;

  studentSelectTests = [];
  showSchoolDecisionControl = false;
  isAdminOrCertifierAdmin = false;
  displayAcadBlock = false;
  studentEmployabilityNTransState = null;
  studentRetakeDecisionArray = ['accept', 'refuse'];
  studentRetakeDecision: string = '';
  displayStudentTest = false;
  juryFinalDecisionArray = ['PASS1', 'PASS2', 'FAILED', 'ELIMINATED'];

  isPreviousCourse = false;

  constructor(private transcriptService: FinalTranscriptService,
    private translateService: TranslateService,
    private utilityService: UtilityService,
    private pdfResultService: PDFResultService,
    private studentsService: StudentsService) {
    this.transcript = new TranscriptModel();
  }

  ngOnInit() {
    this.isPreviousCourse = this.studentsService.isPreviousCourseState;
    this.datePipe = new DatePipe(this.translateService.currentLang);
    this.transcript.setDefaultState();

    // Change Date Trans
    this.translateService.onLangChange.subscribe(
      () => {
        this.datePipe = new DatePipe(this.translateService.currentLang);
        if (this.transcriptDetail && this.transcriptDetail.finalTranscriptGeneratedOn) {
          this.allDates.schoolDate = this.getTranslatedDate(this.transcriptDetail.finalTranscriptGeneratedOn);
          this.allDates.juryDecisionDate = this.transcriptDetail.juryDecisionGeneratedOn ?
            this.getTranslatedDate(this.transcriptDetail.juryDecisionGeneratedOn) :
            this.getTranslatedDate(this.convertDateObject(new Date()));
          this.allDates.studentDecisionDate = this.transcriptDetail.studentDecisionGeneratedOn ?
            this.getTranslatedDate(this.transcriptDetail.studentDecisionGeneratedOn) :
            this.getTranslatedDate(this.convertDateObject(new Date()));
          this.allDates.afterFinalRetakeDecisionGeneratedOn = this.transcriptDetail.afterFinalRetakeDecisionGeneratedOn ?
          this.getTranslatedDate(this.transcriptDetail.afterFinalRetakeDecisionGeneratedOn) :
          this.getTranslatedDate(this.convertDateObject(new Date()));
        }
      }
    )

    this.showSchoolDecisionControl = this.utilityService.checkUserIsAcademicAdminDirector() ||
      this.utilityService.checkUserIsDirectorSalesAdmin() || this.utilityService.checkUserIsStudent() ||
      this.utilityService.checkUserIsAdminOfCertifier();

   this.isAdminOrCertifierAdmin =  (this.utilityService.checkUserIsDirectorSalesAdmin() ||
   this.utilityService.checkUserIsAdminOfCertifier());
  }

  ngOnChanges(changes: SimpleChanges): void {
    log.data('ngOnChanges changes', changes.student, changes.student.firstChange);
    this.getState(changes.student.firstChange);
    this.juryDecision = '';
    this.studentRetakeDecision = '';
    this.jurySelectTests = [];
  }

  setCard() {
    switch (this.transcriptDetail.finalTranscriptStatus) {
      case 'transcript_not_send':
        this.transcript.setTranscriptNotSentState();
        break;
      case 'transcript_sent':
        this.transcript.setTranscriptSentState();
        break;
      case 'school_board_pass':
        this.transcript.schoolBoardPass();
        break;
      case 'school_board_fail':
        this.transcript.schoolBoardFail();
        break;
      case 'school_board_eliminated':
        this.transcript.schoolBoardEliminated();
        break;
      case 'school_board_retake':
        this.transcript.schoolBoardRetake();
        break;
      case 'student_refuse_retake':
        this.transcript.studentRefuseRetake();
        break;
      case 'student_accept_retake':
        this.transcript.studentAcceptRetake();
        break;
      case 'student_retake_fail':
        // Will Display Previous State Due to Change in FLow of Final Transcrpt
        if (this.transcriptDetail.hasJuryFinallyDecided) {
          this.transcript.studentRetakeFail();
        } else {
          this.transcript.studentAcceptRetake();
        }
        break;
      case 'student_retake_pass':
        // Will Display Previous State Due to Change in FLow of Final Transcrpt
        if (this.transcriptDetail.hasJuryFinallyDecided) {
          this.transcript.studentRetakePass();
        } else {
          this.transcript.studentAcceptRetake();
        }
        break;
      default:
        this.transcript.setDefaultState();
        break;
    }
  }

  getState(isFirst?: boolean) {
    this.transcriptService.getTranscriptState(this.student._id)
      .subscribe(res => {
        log.data('getTranscriptState', res);
        if (res.data && res.data.transcript && res.data.transcript[0]) {
          this.transcriptDetail = res.data.transcript[0];
          this.allDates.schoolDate = this.getTranslatedDate(this.transcriptDetail.finalTranscriptGeneratedOn);
          this.allDates.juryDecisionDate = this.transcriptDetail.juryDecisionGeneratedOn ?
            this.getTranslatedDate(this.transcriptDetail.juryDecisionGeneratedOn) :
            this.getTranslatedDate(this.convertDateObject(new Date()));
          this.allDates.studentDecisionDate = this.transcriptDetail.studentDecisionGeneratedOn ?
            this.getTranslatedDate(this.transcriptDetail.studentDecisionGeneratedOn) :
            this.getTranslatedDate(this.convertDateObject(new Date()));
          this.allDates.afterFinalRetakeDecisionGeneratedOn = this.transcriptDetail.afterFinalRetakeDecisionGeneratedOn ?
            this.getTranslatedDate(this.transcriptDetail.afterFinalRetakeDecisionGeneratedOn) :
            this.getTranslatedDate(this.convertDateObject(new Date()));
          this.setCard();
          if (this.transcriptDetail.retakeTestsForStudents && this.transcriptDetail.retakeTestsForStudents.length > 0) {
            this.jurySelectTests = this.transcriptDetail.retakeTestsForStudents;
            this.jurySelectTests = _.orderBy(this.jurySelectTests, ['name'], ['asc']);
            const allJuryTest = [...this.jurySelectTests];
            this.studentSelectTests = _.filter(allJuryTest, (test) => {
              return test.isTestAcceptedByStudent;
            });
            this.finalRetakeTests = [];
          } else {
            this.finalRetakeTests = res.data.finalRetakeTest;
            this.finalRetakeTests = _.orderBy(this.finalRetakeTests, ['name'], ['asc']);
          }
          this.juryDecision = this.transcriptDetail.juryDecisionForFinalTranscript &&
            this.transcriptDetail.juryDecisionForFinalTranscript !== 'initial' ?
            this.transcriptDetail.juryDecisionForFinalTranscript : '';
            this.studentEmployabilityNTransState = _.cloneDeep(this.transcriptDetail.studentId);
            this.transcriptDetail.studentId = this.transcriptDetail.studentId._id;
          // if (isFirst && this.transcriptDetail.isValidated) {
          //   this.displayAcadDecisonBlock();
          // }
          if (this.transcriptDetail.afterFinalRetakeDecision) {
            this.juryFinalDecision = this.getResultAfterReTake(this.transcriptDetail.afterFinalRetakeDecision);
          }
        } else {
          this.transcriptDetail = null;
          this.finalRetakeTests = null;
          this.transcript.setDefaultState();
        }
      });
  }

  getTranslatedDate(dateObject) {
    if (dateObject) {
      const date = new Date(dateObject.year,
        (dateObject.month - 1),
        dateObject.date
      );
      const translateDay = this.translateService.instant('FINAL_TRANSCRIPT.DAY.' + moment(date).format('ddd').toUpperCase());
      return translateDay + ' ' + this.datePipe.transform(date);
    }
  }

  swalBeforeJuryDescision(existingDecison, currentDecison, isFinalDecison = false) {
    if (existingDecison !== currentDecison) {
      // Setting the Confirm Button Disable time to 6
      let timeDisabledinSec = 10;
      swal({
        title: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S1.TITLE'),
        html: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S1.TEXT', {
          nameOfStudent: this.student.firstName + ' ' + this.student.lastName,
          certificationStatus: this.translateService.instant(
            'FINAL_TRANSCRIPT.CERTIFICATION_STATUS.' + existingDecison.toUpperCase()),
          juryDecision: this.translateService.instant('FINAL_TRANSCRIPT.CERTIFICATION_STATUS.' + currentDecison.toUpperCase())
        }),
        type: 'warning',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S1.OK_IN', { timer: timeDisabledinSec }),
        cancelButtonText: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S1.NO'),
        onOpen: () => {
          swal.disableConfirmButton()
          const confirmButtonRef = swal.getConfirmButton();

          // TimerLoop for derementing timeDisabledinSec
          const timerLoop = setInterval(() => {
            timeDisabledinSec -= 1;
            confirmButtonRef.innerText = this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S1.OK_IN',
              { timer: timeDisabledinSec });
          }, 1000
          );
          // Resetting timerLoop to stop after required time of execution
          setTimeout(() => {
            confirmButtonRef.innerText = this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S1.YES');
            swal.enableConfirmButton();
            clearTimeout(timerLoop);
          }, (timeDisabledinSec * 1000));
        }
      }).then((isConfirm) => {
        if (isFinalDecison) {
          this.sendJuryFinalDecision();
        } else {
          this.submitJuryDescision();
        }
      }, (dismiss) => {
      });
    } else {
      if (isFinalDecison) {
        this.sendJuryFinalDecision();
      } else {
        this.submitJuryDescision();
      }
    }
  }

  submitJuryDescision() {
    if (this.juryDecision) {
      const juryDecisionGeneratedOn = this.convertDateObject(new Date());
      const existingTranscriptDetails = _.cloneDeep(this.transcriptDetail);
      this.transcriptDetail.juryDecisionGeneratedOn = juryDecisionGeneratedOn;
      this.transcriptDetail.juryDecisionForFinalTranscript = this.juryDecision;
      this.transcriptDetail.finalTranscriptStatus = this.transcriptStatusSwitch();
      this.transcriptDetail.isValidated = true;
      log.data('submitJuryDescision this.transcriptDetail', this.transcriptDetail);

      if (this.juryDecision === 'retaking') {
        const retakeTestsByJury = [];
        this.jurySelectTests.forEach((element, index) => {
          retakeTestsByJury.push({
            testId: element._id,
            name: element.name,
            position: index
          })
        });
        this.transcriptDetail.retakeTestsForStudents = retakeTestsByJury;
      }
      const payload = {
        data: this.transcriptDetail
      };
      this.transcriptService.updateTranscript(this.transcriptDetail._id, payload).subscribe(
        (response) => {
          if (response.data && response.data._id) {
            this.updateTranscriptDetails(response.data);
          } else if (response.data === 'NO_EMPLOYABILITY_SURVEY') {
            this.juryDecision = '';
            this.transcriptDetail = existingTranscriptDetails;
            swal({
              title: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S2.TITLE'),
              html: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S2.TEXT'),
              type: 'warning',
              allowEscapeKey: true,
              confirmButtonText: this.translateService.instant('OK'),
            });
          }
        }
      )
    }
  }

  alertSubmitStudentDescision() {
    let timeDisabledinSec = 10;
    let textConditionCheck = 'FINAL_TRANSCRIPT.FINAL_S5.TEXT_RE'
    let str = '';
    if ( this.studentRetakeDecision === 'accept' ) {
      textConditionCheck = 'FINAL_TRANSCRIPT.FINAL_S5.TEXT_AC';
      str = '<ol style="display:inline-block;">';
      this.studentSelectTests.forEach(test => {
        str += `<li style="text-align:left !important;">${test.name}</li>`;
      });
      str += '</ol>';
    }

    swal({
      title: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S5.TITLE'),
      html: this.translateService.instant( textConditionCheck, {
        testList: str
      }),
      type: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S1.OK_IN', { timer: timeDisabledinSec }),
      cancelButtonText: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S1.NO'),
      onOpen: () => {
        swal.disableConfirmButton();
        const confirmButtonRef = swal.getConfirmButton();

        // TimerLoop for derementing timeDisabledinSec
        const timerLoop = setInterval(() => {
          timeDisabledinSec -= 1;
          confirmButtonRef.innerText = this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S1.OK_IN',
            { timer: timeDisabledinSec });
        }, 1000
        );
        // Resetting timerLoop to stop after required time of execution
        setTimeout(() => {
          confirmButtonRef.innerText = this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S1.YES'),
          swal.enableConfirmButton();
          clearTimeout(timerLoop);
        }, (timeDisabledinSec * 1000));
      }
    }).then((isConfirm) => {
      this.submitStudentDescision();
    }, (dismiss) => {
    });

  }

  submitStudentDescision() {
    if (this.studentRetakeDecision === 'accept') {
      const retakeTestsByJury = [];
      this.jurySelectTests.forEach(
        (juryTest, index) => {
          const newObject = {
            testId: juryTest.testId,
            name: juryTest.name,
            position: index,
            isTestAcceptedByStudent: juryTest.isTestAcceptedByStudent
          };
          retakeTestsByJury.push();
          this.studentSelectTests.forEach(
            (studentSelTest) => {
              if (juryTest.testId === studentSelTest.testId) {
                newObject.isTestAcceptedByStudent = true;
              }
            }
          );
          retakeTestsByJury.push(newObject);
        }
      )
      this.transcriptDetail.retakeTestsForStudents = retakeTestsByJury;
      this.transcriptDetail.studentDecision = 'retaking';
      this.transcriptDetail.finalTranscriptStatus = 'student_accept_retake';
    } else {
      this.transcriptDetail.studentDecision = 'failed';
      this.transcriptDetail.finalTranscriptStatus = 'student_refuse_retake';
    }
    this.transcriptDetail.studentDecisionGeneratedOn = this.convertDateObject(new Date());
    log.data('submitStudentDescision transcriptDetail', this.transcriptDetail);

    const payload = {
      data: this.transcriptDetail
    };
    this.transcriptService.updatefinalTranscriptStudentsDecision(this.transcriptDetail._id, payload).subscribe(
      (response) => {
        if (response.data) {
          this.updateTranscriptDetails(response.data);
        }
      }
    );
  }

  updateTranscriptDetails(transcriptDetailsDate) {
    this.transcriptDetail = transcriptDetailsDate;
    this.allDates.schoolDate = this.getTranslatedDate(this.transcriptDetail.finalTranscriptGeneratedOn);
    this.allDates.juryDecisionDate = this.transcriptDetail.juryDecisionGeneratedOn ?
      this.getTranslatedDate(this.transcriptDetail.juryDecisionGeneratedOn) :
      this.getTranslatedDate(this.convertDateObject(new Date()));
    this.allDates.studentDecisionDate = this.transcriptDetail.studentDecisionGeneratedOn ?
      this.getTranslatedDate(this.transcriptDetail.studentDecisionGeneratedOn) :
      this.getTranslatedDate(this.convertDateObject(new Date()));
    this.allDates.afterFinalRetakeDecisionGeneratedOn = this.transcriptDetail.afterFinalRetakeDecisionGeneratedOn ?
      this.getTranslatedDate(this.transcriptDetail.afterFinalRetakeDecisionGeneratedOn) :
      this.getTranslatedDate(this.convertDateObject(new Date()));
    this.setCard();
    this.juryDecision = this.transcriptDetail.juryDecisionForFinalTranscript;
    if (this.transcriptDetail.retakeTestsForStudents && this.transcriptDetail.retakeTestsForStudents.length > 0) {
      this.jurySelectTests = this.transcriptDetail.retakeTestsForStudents;
      this.jurySelectTests = _.orderBy(this.jurySelectTests, ['name'], ['asc']);
      const allJuryTest = [...this.jurySelectTests];
      this.studentSelectTests = _.filter(allJuryTest, (test) => {
        return test.isTestAcceptedByStudent;
      });
      this.finalRetakeTests = [];
    }
    this.successSwal();
  }

  transcriptStatusSwitch(): string {
    if (this.transcriptDetail.finalTranscriptStatus === 'transcript_sent') {
      switch (this.juryDecision) {
        case 'pass':
          return 'school_board_pass';
        case 'failed':
          return 'school_board_fail';
        case 'retaking':
          return 'school_board_retake';
        case 'eliminated':
          return 'school_board_eliminated';
        default:
          return this.transcriptDetail.finalTranscriptStatus;
      }
    }
  }

  convertDateObject(newDAte: Date) {
    return {
      year: newDAte.getFullYear(),
      month: (newDAte.getMonth() + 1),
      date: newDAte.getDate()
    };
  }

  juryValidateDisable() {
    if (this.juryDecision === 'retaking') {
      return this.jurySelectTests.length < 1;
    } else {
      return !this.juryDecision;
    }
  }

  displayAcadDecisonBlock() {
    this.transcriptService.getAcadBlockState(this.transcriptDetail.schoolId, this.transcriptDetail.rncpId)
      .subscribe((response) => {
        log.data('response.data', response.data);
        if (response.data && response.data.displayAcadBlock) {
          this.displayAcadBlock = response.data.displayAcadBlock;
        } else {
          this.displayAcadBlock = false;
        }
      });
  }

  getAcadDisplayBlock(): boolean {
      return this.transcriptDetail.juryDecisionForFinalTranscript &&
              this.transcriptDetail.juryDecisionForFinalTranscript === 'retaking' &&
              this.jurySelectTests.length > 0;
  }

  studentRetakeDecisionState(event) {
    if ( this.studentRetakeDecision === 'accept' ) {
      this.displayStudentTest = true;
      swal({
        title: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S4.TITLE'),
        text: this.translateService.instant('FINAL_TRANSCRIPT.FINAL_S4.TEXT'),
        type: 'info',
        confirmButtonClass: 'btn-danger',
        allowEscapeKey: true,
        confirmButtonText: this.translateService.instant('FINAL_TRANSCRIPT.UNDERSTOOD')
      });
    } else {
      this.displayStudentTest = false;
    }
  }

  successSwal() {
    swal({
      type: 'success',
      title: this.translateService.instant('SUCCESS'),
      allowEscapeKey: true,
      confirmButtonText: 'OK'
    })
  }

  checkIfPDFIsAvailable() {
    let displayState = true;

    // Add Below Condition for Letting Students with retake to Access Final Transcript PDF
    // || this.transcriptDetail.juryDecisionForFinalTranscript === 'retaking'
    if ( this.transcriptDetail &&
         ( this.transcriptDetail.juryDecisionForFinalTranscript === 'pass' ) ) {
      displayState = this.studentEmployabilityNTransState &&
        this.studentEmployabilityNTransState.allowFinalTranscriptGen &&
        this.studentEmployabilityNTransState.employabilitySurveyId &&
        this.studentEmployabilityNTransState.employabilitySurveyId.surveyStatus !== 'sentToStudent';
    } else if ( this.transcriptDetail && this.transcriptDetail.juryDecisionForFinalTranscript === 'retaking' ) {
      displayState = this.transcriptDetail && this.transcriptDetail.hasJuryFinallyDecided &&
                      this.studentEmployabilityNTransState &&
                      this.studentEmployabilityNTransState.allowFinalTranscriptGen &&
                      this.studentEmployabilityNTransState.employabilitySurveyId &&
                      this.studentEmployabilityNTransState.employabilitySurveyId.surveyStatus !== 'sentToStudent';
    }

    return this.transcriptDetail && this.transcriptDetail.isValidated && displayState;
  }

  downloadPDFResult() {
    const hasJuryDecided = this.transcriptDetail && this.transcriptDetail.hasJuryFinallyDecided;
    this.pdfResultService.getStudentResultDetails(this.student,
      hasJuryDecided ? this.getResultAfterReTake(this.transcriptDetail.afterFinalRetakeDecision) :
      this.transcriptDetail.juryDecisionForFinalTranscript,
      false, hasJuryDecided).subscribe();
  }

  studentDesCondition(): boolean {
    let disable = true;
    if ( this.studentRetakeDecision === 'accept' ) {
      disable = this.studentSelectTests && this.studentSelectTests.length < 1;
    } else if (this.studentRetakeDecision === 'refuse' ) {
      disable = false;
    }
    return disable;
  }

  sendJuryFinalDecision() {
    const payload = {
      finalTransciptId : this.transcriptDetail._id,
      finalJuryDecision : this.juryFinalDecision,
      lang: this.translateService.currentLang.toUpperCase()
    };
    this.transcriptService.finalTranscriptJuryFinalDecision(payload).subscribe(
      (response) => {
        if (response.data) {
          log.data('transcriptService.finalTranscriptJuryFinalDecision', response.data);
          this.successSwal();
          this.updateTranscriptDetails(response.data);
        }
    });
  }

  getResultAfterReTake(state: string) {
    switch (state) {
      case 'PASS2':
      case 'PASS3':
      return 'PASS2';
      default:
        return state;
    }
  }

  submitFinalJuryDecision() {
    const existingDecision = this.getResultAfterReTake(this.transcriptDetail.afterFinalRetakeDecision);
    this.swalBeforeJuryDescision(existingDecision, this.juryFinalDecision, true);
  }

  returnColorOnState(state) {
    if ( state === 'FAILED' ||  state === 'ELIMINATED' ) {
      return 'red';
    } else if ( state ) {
      return 'greenyellow';
    }
  }
}
