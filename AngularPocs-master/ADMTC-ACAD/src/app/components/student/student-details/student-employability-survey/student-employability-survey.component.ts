import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { UtilityService } from '../../../../services';
import { TranslateService } from 'ng2-translate';
import { NgForm } from '../../../../../../node_modules/@angular/forms';
import { EmployabilitySurveyService } from '../../../../services/employability-survey.service';
import { EmployibilitySurvey } from '../../../../models/employibility-survey.model';
import swal from 'sweetalert2';
import {
  Router,
  ActivatedRoute
} from '../../../../../../node_modules/@angular/router';
import _ from 'lodash';
import { MdDialog, MdDialogConfig, MdDialogRef } from '../../../../../../node_modules/@angular/material';
import { SurveyRejectDialogComponent } from './survey-reject-dialog/survey-reject-dialog.component';
import { AppSettings } from '../../../../app-settings';
import { StudentsService } from 'app/services/students.service';

@Component({
  selector: 'app-student-employability-survey',
  templateUrl: './student-employability-survey.component.html',
  styleUrls: ['./student-employability-survey.component.scss']
})
export class StudentEmployabilitySurveyComponent implements OnInit, OnChanges {
  @Input() student;
  isPreviousCourse = false;
  survey = new EmployibilitySurvey();
  isDMOE = false;
  employabilitySurveyId = '';
  questionBlock = [];
  public surveyRejectDialog: MdDialogRef<SurveyRejectDialogComponent>;
  rejectDisabled: boolean = false;
  isOnceSaved = false;
  jobSituation = [
    {
      key: 'INITIAL_TRAINING',
      queContinue: false,
    },
    {
      key: 'LEARNING',
      queContinue: false
    },
    {
      key: 'PRO_CONTRACT',
      queContinue: false
    },
    {
      key: 'JOB_SEARCH',
      queContinue: false
    },
    {
      key: 'INTERIM',
      queContinue: true
    },
    {
      key: 'CSD',
      queContinue: true
    },
    {
      key: 'CDI',
      queContinue: true
    },
    {
      key: 'AUTO_ENTREPRENEUR',
      queContinue: true
    },
    {
      key: 'BUSINESS_CREATION',
      queContinue: true
    },
    {
      key: 'CIVIC_SERVICE',
      queContinue: false
    },
    {
      key: 'OTHER',
      queContinue: false
    },
  ];
  showProfActivityAndContractBlock = false;
  isAcadDir = false;
  isAcadAdmin = false;
  deleteStudentConfig: MdDialogConfig = {
    disableClose: true,
    width: '500px'
  };
  constructor(
    public utilityService: UtilityService,
    public translate: TranslateService,
    private surveyService: EmployabilitySurveyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public surveyRejectdialog: MdDialog,
    private studentsService: StudentsService
  ) {}

  ngOnInit() {
    this.isPreviousCourse = this.studentsService.isPreviousCourseState;
    console.log(this.student);
    this.activatedRoute.params.subscribe(params => {
      if (params.hasOwnProperty('employibilitySurveyId')) {
        this.employabilitySurveyId = params['employibilitySurveyId'];
        this.getSurvey();
      } else {
        this.employabilitySurveyId = this.student.employabilitySurveyId;
        this.getSurvey();
      }
    });
    this.isAcadDir = this.utilityService.checkUserIsAcademicDirector();
    this.isAcadAdmin = this.utilityService.checkUserIsDirectorSalesAdmin();
    this.isPreviousCourse = this.studentsService.isPreviousCourseState;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.isOnceSaved = false;
    this.showProfActivityAndContractBlock = false;
    if (!changes.student.firstChange) {
      this.employabilitySurveyId =
        changes.student.currentValue.employabilitySurveyId;
      this.getSurvey();
    }
  }

  getSurvey() {
    this.rejectDisabled = false;
    this.surveyService
      .getSurvey(this.employabilitySurveyId)
      .subscribe(response => {
        console.log(response);
        this.survey = response;
        if (this.survey.rncpId.employabilitySurvey.isDMOE) {
          this.questionBlock = new Array(17);
        } else if (this.survey.rncpId.employabilitySurvey.isRMO) {
          this.questionBlock = new Array(14);
        }
        if (this.survey.currentSituation_currentJob) {
          this.selectJobStatus(this.survey.currentSituation_currentJob);
        }

        if (Number(this.survey.rejectionDetails.length) > 2){
            this.rejectDisabled = true;
        }
      });
  }

  submitSwal(form: NgForm, formType){
     console.log(this.survey)
     if (this.survey.surveyStatus === 'completedByStudent') {
        let timeDisabledInSec = AppSettings.global.timeDisabledinSecForSwal;
        swal({
          type: 'warning',
          title: this.translate.instant('EMPLOYABILITY_SURVEY.SENT_SURVEY_SUBMIT.TITLE'),
          text: this.translate.instant('EMPLOYABILITY_SURVEY.SENT_SURVEY_SUBMIT.TEXT') + ` ${this.survey.rncpId.shortName} ${this.survey.classId.name} ${this.survey.scholarSeasonId
            .scholarseason} ` + this.translate.instant('EMPLOYABILITY_SURVEY.SENT_SURVEY_SUBMIT.TEXT1') + this.dateFormat(this.survey.updatedAt),
          confirmButtonText:this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM'),
          showCancelButton: true,
          cancelButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SENT_SURVEY_SUBMIT.CANCEL'),
          onOpen: () => {
            swal.disableConfirmButton();
            const confirmBtn = swal.getConfirmButton();
            const timerLoop = setInterval(() => {
              timeDisabledInSec -= 1;
              confirmBtn.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM') + ' in ' + timeDisabledInSec + ' sec';
            }, 1000);
            setTimeout(() => {
              confirmBtn.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM');
              swal.enableConfirmButton();
              clearTimeout(timerLoop);
            }, (timeDisabledInSec * 1000));
          }
        }).then(() => {
          this.onSubmit(form, formType);
        },
          function (dismiss) {

          });
      } else {
       this.onSubmit(form, formType);
      }
  }
  onSubmit(form: NgForm, formType) {
    console.log(form.value);
    const data = form.value;
    data['_id'] = this.employabilitySurveyId;

    if (formType === 'submit') {
      this.survey.surveyStatus = 'completedByStudent';
      data['surveyStatus'] = 'completedByStudent';
    }
    this.setOptionalFieldstoDefault();
    this.surveyService
      .updateSurvey(this.employabilitySurveyId, data)
      .subscribe(response => {
        if (response) {
          this.survey.surveyStatus = response.surveyStatus;
          if (formType === 'save') {
            swal({
              type: 'info',
              title: this.translate.instant('Survey_S4.TITLE'),
              html: this.translate.instant('Survey_S4.TEXT'),
              confirmButtonText: this.translate.instant('Survey_S4.BUTTON')
            });
            this.isOnceSaved = true;
          } else if (formType === 'submit') {
            swal({
              type: 'success',
              title: this.translate.instant('Survey_S3.TITLE'),
              html: this.translate.instant('Survey_S3.TEXT'),
              confirmButtonText: this.translate.instant('Survey_S3.BUTTON')
            });
          }
        }
      });
  }

  setOptionalFieldstoDefault() {
    if (this.survey.experience_marketingExperience === 'NO') {
      this.survey.experience_marketingExperienceYes_experienceInMonths = 0;
      this.survey.experience_marketingExperienceYes_jobStatus = '';
      this.survey.experience_marketingExperienceYes_positionOccupied = '';
      this.survey.experience_marketingExperienceYes_practicingActivity = '';
    }

    if (this.survey.currentSituation_currentJob !== 'OTHER') {
      this.survey.currentSituation_comments = '';
    }
  }

  getTitleForExperienceBlock(titleString) {
    let translatedTitlewithRNCP: string = this.translate.instant(titleString);
    if (this.survey && this.survey.rncpId) {
      translatedTitlewithRNCP = translatedTitlewithRNCP.replace(
        '{title}',
        this.survey.rncpId.shortName
      );
    }
    return translatedTitlewithRNCP;
  }

  selectJobStatus(job) {
    const obj = _.find(this.jobSituation, {'key': job});
    if (obj && obj.queContinue) {
      this.showProfActivityAndContractBlock = true;
    } else {
      this.showProfActivityAndContractBlock = false;
    };
  }

  validateSurvey(){
    swal({
    type: 'question',
      title: this.translate.instant('EMPLOYABILITY_SURVEY.ACADIR_VAL_SW.title') + ` ${this.survey.studentId.firstName } ${this.survey.studentId.lastName}`,
      confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.ACADIR_VAL_SW.BTN1'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.ACADIR_VAL_SW.BTN2')
    }).then(
      ()=>{
        this.survey.surveyStatus = 'validatedByAcadDir';
        this.surveyService.updateSurvey(this.employabilitySurveyId, this.survey)
          .subscribe(res => {

          })
        swal({
          type: 'success',
          title: this.translate.instant('EMPLOYABILITY_SURVEY.REJECT_SWAL.S3.TITLE'),
          confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.REJECT_SWAL.S3.BUTTON')
        })
      },
      function (dismiss) {

      }
    )
  }
  surveyConfig: MdDialogConfig = {
    disableClose: true,
    width: '500px'
  };
  rejectSurvey(){
    let swalText = "BLANK";
    let len = Number(this.survey.rejectionDetails.length)
    console.log(len)
    if( len == 2){
       swalText = "EMPLOYABILITY_SURVEY.REJECT_SWAL.S2.TEXT";
    }
    let self= this;
    let timeDisabledInSec = AppSettings.global.timeDisabledinSecForSwalMini;
    swal({
      type: 'warning',
      title: this.translate.instant('EMPLOYABILITY_SURVEY.REJECT_SWAL.S1.TITLE'),
      html: this.translate.instant(swalText),
      showCancelButton: true,
      confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM', { timer: timeDisabledInSec}),
      cancelButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CANCEL'),
      onOpen: () => {
        swal.disableConfirmButton();
        const confirmBtn = swal.getConfirmButton();
        const timerLoop = setInterval(()=>{
          timeDisabledInSec -=1;
          confirmBtn.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM') + ' in ' + timeDisabledInSec + ' sec';
        }, 1000);
        setTimeout(() => {
          confirmBtn.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM');
          swal.enableConfirmButton();
          clearTimeout(timerLoop);
        }, (timeDisabledInSec * 1000));
       }

    }).then( ()=>
    {
      self.surveyRejectDialog = self.surveyRejectdialog.open(
        SurveyRejectDialogComponent,
        self.surveyConfig
      );

      self.surveyRejectDialog.componentInstance.surveyId = this.employabilitySurveyId;

      self.surveyRejectDialog.afterClosed()
        .subscribe(response => {
          console.log(response);
          if(response.reject){
            this.rejectDisabled = true;
            this.survey.surveyStatus = 'rejectedByAcadDir';
          }
        }
      );
    },
    function (dismiss) {

    }

    )

  }
  dateFormat(time){
    let date =time.split('T')[0].split('-');
    return ` ${date[2]}/${date[1]}/${date[0]}`

  }
}
