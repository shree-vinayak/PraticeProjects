  import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
  import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
  import {Subscription} from 'rxjs/Subscription';
  import {ActivatedRoute, Router} from '@angular/router';
  import { Observable } from 'rxjs/Observable';
  import { TranslateService } from 'ng2-translate';
  import swal from 'sweetalert2';
  import _ from 'lodash';
import { QuestionnaireService } from '../../../../services/questionnaire.service';
import { EmailtemplateService } from 'app/services/emailtemplate.service';
import { MentorEvaluationService } from '../../../../services/mentor-evaluation.service';
import { TestCorrectionService } from '../../../../services/test-correction.service';

  @Component({
    selector: 'app-questionnaire-answer',
    templateUrl: './questionnaire-answer.component.html',
    styleUrls: ['./questionnaire-answer.component.scss'],
    providers: [QuestionnaireService,EmailtemplateService,MentorEvaluationService,TestCorrectionService]

  })
  export class QuestionnaireAnswerComponent implements OnInit {

    public questionnaireForm: FormGroup;
    selectedQuestionnaire;
    questionList = [];
    optionsList = [];
    formSubmit = false;
    showAnswerOptions = false;
    mentorEvaluateId;
    studentId;
    MentorEvaluate:any;
    public dialogRef: MdDialogRef<QuestionnaireAnswerComponent>;
    testDetails;
    viewtemplateConfig: MdDialogConfig = {
      disableClose: true,
      width: '60%',
      height: '60%'
    };
    private subscription: Subscription;
    questionnaireFormSubmitted = false;

    constructor(
      private fb: FormBuilder,
      private QuestionnaireService: QuestionnaireService,
      public translate: TranslateService,
      public dialog: MdDialog,
      private EmailtemplateService: EmailtemplateService,
      private MentorEvaluationService: MentorEvaluationService,
      private route: ActivatedRoute,
      private router: Router,
      private testCorrectionService: TestCorrectionService,
    ) {

      this.questionnaireForm = this.fb.group({});

    }

    ngOnInit(): void {


    this.subscription = this.route.params.subscribe(
      params => {
        console.log(params);
        if (params.hasOwnProperty('Id')) {
          this.mentorEvaluateId = params['Id'];
          this.getMentorEvaluateById(this.mentorEvaluateId);
        } else {
          this.router.navigate(['/']);
        }
        if (params.hasOwnProperty('studentId')) {
          this.studentId = params['studentId'];
          this.getMentorEvaluateById(this.mentorEvaluateId);
        } else {
          this.router.navigate(['/']);
        }
      });
    }

    getMentorEvaluateById(id): void {
      this.MentorEvaluationService.getMentorEvaluateById(id).then(data => {
        console.log('getMentorEvaluateById');
        console.log(data.data);
        this.MentorEvaluate = data.data;
        this.getQuestionnaire(data.data.questionnaireTemplate);
        this.getTestDetails(data.data.evaluationGridTemplate);
      });
    }
    getQuestionnaire(id): void {
      this.QuestionnaireService.getQuestionnairesById(id).then(data => {
        console.log('getQuestionnaire');
        console.log(data.data);
        this.selectedQuestionnaire = data.data;
        console.log(this.selectedQuestionnaire);
        let testForm = {};
        let questionList = [];
        let fb = this.fb;


        _.forEach(this.selectedQuestionnaire.questions, function (val, key) {


          if (val.answerType === 'MultipleOptions'){
            let answer = [];
            _.forEach(val.options, function (i) {
              answer.push({[i]: null})
            })
            questionList.push({ question: val.question, answer: answer,options:val.options});
            testForm['question' + key] = [null, Validators.required];
          }else{
            questionList.push({ question: val.question, answer: null,options:val.options});
            testForm['question' + key] = [null, Validators.required];
          }

        });
        this.questionList = questionList;
        console.log(this.questionList);
        this.questionnaireForm = this.fb.group(testForm);
      });
    }

    getTestDetails(id){
      this.testCorrectionService.getTest(id).subscribe((value) => {
        this.testDetails = value;
        console.log("testDetails");
        console.log(this.testDetails);

      });
    }

    cancel(){
      this.router.navigate(['/']);
    }

    submitQuestionnaire(){
      console.log(this.questionList);

      let postQuestionList = this.questionList;


      for(let i=0;i<postQuestionList.length;i++){

        if(typeof postQuestionList[i].answer == 'object'){
          let newanswer = '';
          for (var k in postQuestionList[i].answer){
            if (postQuestionList[i].answer.hasOwnProperty(k)) {
                console.log(typeof postQuestionList[i].answer[k]);
                 if(typeof postQuestionList[i].answer[k] == 'boolean' || typeof postQuestionList[i].answer[k] == 'undefined'){
                  console.log("Key is " + k + ", value is" + postQuestionList[i].answer[k]);
                   if(postQuestionList[i].answer[k]){
                    newanswer = newanswer + k;
                   }
                 }
            }
         }
         postQuestionList[i].answer = '';
         postQuestionList[i].answer = newanswer;
        }
        postQuestionList[i].answer = String(postQuestionList[i].answer)


      }

      console.log(postQuestionList);


      // if (!this.questionnaireForm.valid) {
      //   return;
      // }

      var formValues = this.questionnaireForm.value;

      let dataPost = {
        'mentorEvaluation': this.mentorEvaluateId,
        'mentor': this.MentorEvaluate.academicStaff._id,
        'student': this.studentId,
        'parentRncpTitle': this.MentorEvaluate.rncpTitle._id,
        'submittedDate': new Date(),
        'questionnaire': postQuestionList,
        'evaluationGrid': this.MentorEvaluate.evaluationGridTemplate
      }
      console.log(dataPost);

      swal({
        title: 'Attention',
        text: this.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.CONFIRMRESUBMIT'),
        type: 'question',
        showCancelButton: true,
        allowEscapeKey:true,
        cancelButtonText: this.translate.instant('NO'),
        confirmButtonText: this.translate.instant('YES')
      }).then(function () {
        this.MentorEvaluationService.createMentorEvaluationAnswer(dataPost)
        .subscribe(value => {
          console.log('HTTP Response data');
          console.log(typeof value['data']);
          if (value['data']) {
            console.log(value['data']['_id']);
            this.questionnaireForm.reset();
            swal({
              title:'Success', 
              text: this.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.SubmittedSuccess'),
              allowEscapeKey:true,
              type:'success'
            });
            this.router.navigate(['/']);
          } else {
            swal({
              title:'Oops...',
              text: value['message'],
              allowEscapeKey:true,
              type:'error'
            });
          }
        });
      }.bind(this), function (dismiss) {

        if (dismiss === 'cancel') {

        }
      });


    }



  }


