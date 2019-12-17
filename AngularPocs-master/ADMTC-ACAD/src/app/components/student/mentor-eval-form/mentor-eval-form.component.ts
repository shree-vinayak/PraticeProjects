import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, EmailValidator, FormControl } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { Student } from '../../../models/student.model';
import { JobDescription } from '../../../models/jobdescription.model';
import { StudentsService } from '../../../services/students.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from '../../../services/login.service';
import { DatePipe } from '@angular/common';
import { CompanyService } from '../../../services/company.service';
import { MentorEvaluationService } from '../../../services/mentor-evaluation.service';
import _ from 'lodash';
declare var swal: any;

// required for logging
import { Log } from 'ng2-logger';
import { MentorEvaluation } from 'app/shared/global-urls';
import { UtilityService } from '../../../services/utility.service';
const log = Log.create('JobDescriptionFormComponent');
log.color = 'blue';

@Component({
  selector: 'app-mentor-eval-form',
  templateUrl: './mentor-eval-form.component.html',
  styleUrls: ['./mentor-eval-form.component.scss'],
  providers: [MentorEvaluationService]
})
export class MentorEvaluationFormComponent implements OnInit, OnChanges {

  @Input() jobDescriptionDetail;
  @Output() emitStatustoDetails: EventEmitter<string> = new EventEmitter();
  public jobDescriptionForm: FormGroup;
  public mentorEvalForm: FormGroup;
  public jobDescription: JobDescription;
  public token: any;
  public maxDate: any;
  public expectedFromStudentNumber = 0;
  public missionsActivitiesAutonomyNumber = 0;
  public knowledgeNumber = 0;
  public knowledgeHowNumber = 0;
  public compnayObjectiveNumber = 0;
  public step = 2;
  public userTypes: any;
  public studentId: any;
  public student: any;
  public isReadOnly = true;
  ansType: string;
  qtName = '';
  myData = [];
  public autonomyLevels: any = [
    { value: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT1', viewValue: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT1' },
    { value: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT2', viewValue: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT2' },
    { value: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT3', viewValue: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT3' },
    { value: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT4', viewValue: 'JOBDESCRIPTIONFORM.MISSIONSACTIVITIESANDAUTONOMY.AUTONOMYLEVEL.OPT4' }
  ];
  private subscription: Subscription;
  // public notificationEditorComponentDialog: MdDialogRef<NotificationEditorComponent>;
  public config: MdDialogConfig = {
    disableClose: true
  };

  companylist = [];
  selectedCompany: any;

  currentUser;
  currentLoginUserType;
  IsToken = false;
  currentUserEntityType: string;
  queryToken = '';

  @Input() mentorEvalID;

  QuestionnaireData = [];
  MasterDetails = [];
  form: FormArray;

  comptenceNumber = 0;
  questionnaireNumber = 0;
  questionNumber = 0;
  segmentNumber = 0;
  studentName = '';
  rncpTitle = '';
  school = '';
  mentor = '';
  companies = [];
  assignedClass;
  mainDataObj = {
    questionnaireTemplate: {
      competence: [{
        segment: [{
          question: [{
            questionName: '',
            answerType: '',
            answer: '',
            options: [''],
            sortOrder: 1,
            _id: ''
          }],
          segmentName: '',
          sortOrder: 1,
          _id: ''
        }],
        competenceName: '',
        sortOrder: '',
        _id: ''
      }],
    },
    test: {
      parentRNCPTitle: {
        _id: ''
      },
      _id: ''
    },
    mentorEvaluationStatus: '',
    signatureOfTheCompanyMentor: false,
    signatureOfTheAcadDept: false
  };

  answerArr = [];
  signatureOfTheMentorChekbox;
  validateByACADChekbox;
  questionnaireSubmit = true;

  // Set To false by Default Since Questionairre is omitted from Current Flow
  displayQuestionairre = false;
  isPreviousCourse = false;

  constructor(
    private router: Router,
    public utility: UtilityService,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private studentsService: StudentsService,
    public translate: TranslateService,
    public dialog: MdDialog,
    private loginService: LoginService,
    public datepipe: DatePipe,
    private companyService: CompanyService,
    private mentorEvalService: MentorEvaluationService) {
    log.info('Constructor Invoked!');
  }

  ngOnInit() {
    this.isPreviousCourse = this.studentsService.isPreviousCourseState;
    const self = this;
    this.currentUser = this.loginService.getLoggedInUser();
    this.currentLoginUserType = this.currentUser && this.currentUser.types && this.currentUser.types[0] ? this.currentUser.types[0].name : '';
    this.currentUserEntityType = this.currentUser && this.currentUser.entity && this.currentUser.entity.type ? this.currentUser.entity.type : '';

    console.log('currentLoginUserType');
    console.log(this.currentLoginUserType);
    console.log('currentUserEntityType');
    console.log(this.currentUserEntityType);



    this.subscription = this.route.params.subscribe(
      params => {
        console.log(params);
        if (params.hasOwnProperty('id')) {
          console.log('inside if');
          this.mentorEvalID = params['id'];
          this.getQuestionnaireById(this.mentorEvalID);

        } else {
          console.log('else');
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.mentorEvalID);
    if (typeof this.mentorEvalID.mentorEvaluationId !== 'undefined' && this.mentorEvalID.mentorEvaluationId) {
      if (typeof this.mentorEvalID.mentorEvaluationId._id !== 'undefined' && this.mentorEvalID.mentorEvaluationId._id !== '') {
        console.log('this.mentorEvalID.mentorEvaluationId._id : ' + this.mentorEvalID.mentorEvaluationId._id)
        this.getQuestionnaireById(this.mentorEvalID.mentorEvaluationId._id);
      } else {
        console.log('this.mentorEvalID.mentorEvaluationId : ' + this.mentorEvalID.mentorEvaluationId)
        this.getQuestionnaireById(this.mentorEvalID.mentorEvaluationId);
      }
    }
  }



  getQuestionnaireById(id) {
    let self = this;
    console.log('inside method : ' + id);
    this.mentorEvalService.getMentorEvaluationbyResponse(id).subscribe(response => {
      console.log(response.data);

      self.mainDataObj = response.data;
      self.studentName = response.data.student.firstName + ' ' + response.data.student.lastName;
      self.rncpTitle = response.data.test.parentRNCPTitle.longName;
      self.school = response.data.student.school.shortName;
      self.mentor = response.data.mentor.firstName + ' ' + response.data.mentor.lastName;
      self.assignedClass = response.data.student.currentClass.name;
      self.companies = _.filter(response.data.student.companies, function (o) { return o.isActive === true; });

      console.log('self.mainDataObj.signatureOfTheCompanyMentor' + self.mainDataObj.signatureOfTheCompanyMentor);

      self.signatureOfTheMentorChekbox = self.mainDataObj.signatureOfTheCompanyMentor;
      self.validateByACADChekbox = self.mainDataObj.signatureOfTheAcadDept;
      console.log('self.signatureOfTheMentorChekbox' + self.signatureOfTheMentorChekbox);

      if (self.mainDataObj.mentorEvaluationStatus === 'sentToMentor' && self.currentLoginUserType === 'mentor' && self.currentUserEntityType === 'company') {
        self.isReadOnly = false;
      }
      // if(this.mainDataObj.mentorEvaluationStatus == "filledByMentor" && this.currentLoginUserType == "Academic-Director" && this.currentUserEntityType == "academic"){
      //   this.isReadOnly = false;
      // }

      if (response.data.questionnaireTemplate) {
        this.qtName = response.data.questionnaireTemplate.questionnaireName;
        this.myData = response.data.questionnaireTemplate.competence;
        console.log(this.myData);
      }
      console.log(response.data.test.questionnaire);
      console.log(response.data.test.addedQuestionnaire);

      if (!response.data.test.addedQuestionnaire || typeof response.data.test.questionnaire == 'undefined' || response.data.test.questionnaire === '' ) {
        this.questionnaireSubmit = true;
      } else {
        this.questionnaireSubmit = false;
      }

    });
  }

  onradioChange(event, i, j, k, indexOption, selectedOption, AllOptions) {
    this.myData[i]['segment'][j]['question'][k].answer = event.value;
  }
  onChkChange(event, i, j, k, indexOption, selectedOption, AllOptions) {
    if (typeof this.answerArr[i] === 'undefined') {
      this.answerArr[i] = [];
      this.answerArr[i][j] = [];
      this.answerArr[i][j][k] = [];
    }

    if (this.myData[i]['segment'][j]['question'][k].answer !== '') {
      this.answerArr[i][j][k] = this.myData[i]['segment'][j]['question'][k].answer.split(', ');
    }


    AllOptions.forEach(element => {
      if (element === selectedOption) {
        if (event.checked) {
          this.answerArr[i][j][k].push(selectedOption);
        } else {
          _.pull(this.answerArr[i][j][k], selectedOption);
        }
      }
    });
    this.myData[i]['segment'][j]['question'][k].answer = _.map(this.answerArr[i][j][k]).join(', ');
  }

  validateCheckBoxIsChecked(i, j, k, option) {
    if (this.myData[i]['segment'][j]['question'][k].answer !== '') {
      const array = this.myData[i]['segment'][j]['question'][k].answer.split(', ');
      for (let x = 0; x < array.length; x++) {
        if (array[x] === option) {
          return 'checked';
        }
      }
    }
    return false;
  }
  validateRadioIsChecked(i, j, k, option) {
    return 'checked';
  }

  changeValue(event, i, j, k) {
    this.myData[i]['segment'][j]['question'][k].answer = event.target.value;
  }
  changeValueDatePicker(event, i, j, k) {
    this.myData[i]['segment'][j]['question'][k].answer = event;
  }


  saveData() {
    const self = this;
    this.mainDataObj.questionnaireTemplate.competence = this.myData;
    this.mainDataObj.signatureOfTheCompanyMentor = this.signatureOfTheMentorChekbox;
    this.mainDataObj.signatureOfTheAcadDept = this.validateByACADChekbox;
    console.log(this.mainDataObj);
    this.mentorEvalService.setMentorEvaluationbyResponse(this.mainDataObj).subscribe(res => {
      console.log(res);
      // const response = res.data;
      // self.router.navigate(['evaluation-grid/' + response._id]);

      swal({ title: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S6_TITLE'), allowEscapeKey: true, html: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S4_TEXT'), type: 'success', confirmButtonText: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S4_BTN')}).then(() => {
        self.questionnaireSubmit = true;
      });


    });
  }

  submitWithUpdatedStatus() {
    const self = this;
    this.mainDataObj.questionnaireTemplate.competence = this.myData;
    this.mainDataObj.signatureOfTheCompanyMentor = this.signatureOfTheMentorChekbox;
    this.mainDataObj.signatureOfTheAcadDept = this.validateByACADChekbox;

    console.log(this.mainDataObj);
    this.mentorEvalService.setMentorEvaluationbyResponse(this.mainDataObj).subscribe(res => {
      console.log(res);
      const response = res.data;
      // self.router.navigate(['evaluation-grid/' + response._id]);


      swal({ title: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S4_TITLE'), allowEscapeKey: true, html: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S6_TEXT'), type: 'success', confirmButtonText: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S6_BTN')}).then(() => {
        //self.questionnaireSubmit = true;
      });


    });
  }

  checkIsvalidate() {
    let flag = true;
    this.myData.forEach(competence => {
      competence['segment'].forEach(segment => {
        segment['question'].forEach(question => {
          if (question.answer === '') {
            flag = false;
          }
        });
      });
    });

    if (!this.signatureOfTheMentorChekbox) {
      flag = false;
    }
    if (this.mainDataObj.mentorEvaluationStatus === 'filledByMentor' && !this.validateByACADChekbox) {
      flag = false;
    }

    return flag;
  }

  checkUserIsAcademicDirector(){
    return this.utility.checkUserIsAcademicDirector();
  }

  updateStudentDetails(event) {
    console.log('updateStudentDetails----------->mentor eval form'+ event);
    this.emitStatustoDetails.emit(event);
    // this.questionnaireSubmit = false;
   }

}
