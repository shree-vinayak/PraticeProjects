import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate';
import { ViewQuestionnaireComponent } from './viewquestionnaire/viewquestionnaire.component';
import swal from 'sweetalert2';
import { QuestionnaireService } from '../../../../services/questionnaire.service';
@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  providers: [QuestionnaireService]

})
export class QuestionnaireComponent implements OnInit {

  public questionnaireForm: FormGroup;
  questionnaireList = [];
  questionList = [];
  optionsList = [];
  formSubmit = false;
  showAnswerOptions = false;
  public dialogRef: MdDialogRef<ViewQuestionnaireComponent>;
  viewtemplateConfig: MdDialogConfig = {
    disableClose: true,
    width: '60%',
    height: '60%'
  };
  EditQuestionStatus = false;
  EditQuestionStatusIndex = '';
  QuestionnaireId = '';

  constructor(
    private fb: FormBuilder,
    private QuestionnaireService: QuestionnaireService,
    public translate: TranslateService,
    public dialog: MdDialog,
  ) {

    this.questionnaireForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      question: [''],
      answertype: [''],
      option: [''],

    });

  }


  ngOnInit(): void {
    this.getQuestionnaire();
  }

  getQuestionnaire(): void {
    this.QuestionnaireService.getQuestionnaires().then(data => {
      console.log('getQuestionnaire');
      console.log(data.data);
      this.questionnaireList = data.data;
    });
  }

  viewQuestionnaire(data) {
    console.log('data');
    console.log(data);

    this.questionnaireForm.controls['name'].setValue(data.name);
    this.questionList = data.questions;
    this.QuestionnaireId = data._id;

    // this.dialogRef = this.dialog.open(ViewQuestionnaireComponent, this.viewtemplateConfig);
    // this.dialogRef.componentInstance.QuestionnaireData = data;
    // this.dialogRef.componentInstance.QuestionnaireId = data._id;
    // this.dialogRef.afterClosed().subscribe(result => {
    //   this.dialogRef = null;
    //   this.getQuestionnaire();
    // });
    // return false;

  }

  addMoreQuestion() {
    var formValues = this.questionnaireForm.value;
    if (formValues.question != "" && formValues.answertype != "") {
      this.questionList.push({ 'question': formValues.question, 'answerType': formValues.answertype, options: this.optionsList });
      this.questionnaireForm.controls['question'].setValue('');
      this.questionnaireForm.controls['answertype'].setValue('');
      this.optionsList = [];
      this.showAnswerOptions = false;
    }
  }
  addMoreOptions() {
    console.log(this.EditQuestionStatus);
    var formValues = this.questionnaireForm.value;
    if (formValues.option != "") {
      this.optionsList.push(formValues.option);
      this.questionnaireForm.controls['option'].setValue('');
    }
  }
  removeQuestion(index) {
    this.questionList.splice(index, 1);
  }
  EditQuestion(index){
    this.EditQuestionStatus = true;
    this.EditQuestionStatusIndex = index;
    // this.questionnaireForm.setValue(this.questionList[index]);
     console.log(this.questionList[index])

    this.questionnaireForm.controls['question'].setValue(this.questionList[index].question);
    this.questionnaireForm.controls['answertype'].setValue(this.questionList[index].answerType);
    this.optionsList = this.questionList[index].options;

    this.showAnswerOptions = true;

  }
  saveQuestion(){
    if(this.EditQuestionStatus){
      var formValues = this.questionnaireForm.value;
      console.log(formValues.question);
      console.log(this.questionList[this.EditQuestionStatusIndex]);
      this.questionList[this.EditQuestionStatusIndex].question = formValues.question;
      this.questionList[this.EditQuestionStatusIndex].answerType = formValues.answertype;
      this.questionList[this.EditQuestionStatusIndex].options = this.optionsList;

      this.questionnaireForm.controls['question'].setValue('');
      this.questionnaireForm.controls['answertype'].setValue('');
      this.optionsList = [];
      this.showAnswerOptions = false;

      this.EditQuestionStatus = false;
      this.EditQuestionStatusIndex = '';
    }


  }
  answerTypeChange(event) {
    if (event.value == "MultipleOptions" || event.value == 'SingleOption') {
      this.showAnswerOptions = true;
    } else {
      this.showAnswerOptions = false;
    }
  }


  deleteQuestionnaire(data) {
    let QuestionnaireService = this.QuestionnaireService;
    let thistranslate = this.translate;
    let self = this;
    swal({
      title: thistranslate.instant('MENTOREVALUATION.QUESTIONNAIRE.deletedWarningTitle'),
      text: thistranslate.instant('MENTOREVALUATION.QUESTIONNAIRE.deletedWarningMessage'),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey:true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(function () {

      self.QuestionnaireService.removeQuestionnaire(data._id).map((data) => {
        swal({
          title:'Deleted!', 
          text:thistranslate.instant('MENTOREVALUATION.QUESTIONNAIRE.deletedSuccess'),
          allowEscapeKey:true,
          type:'success'});
        self.getQuestionnaire();
        return data;
      }).subscribe();

    }, function (dismiss) {
      if (dismiss === 'cancel') {

      }
    })
  }

  sendTemplate() {
    this.formSubmit = true;
    if (!this.questionnaireForm.valid) {
      return;
    }
    var formValues = this.questionnaireForm.value;

    let dataPost = {
      'name': formValues.name,
      'purpose': 'testing',
      'questions': this.questionList,
      'version': '1',
      'status': 'active'
    }
    console.log(dataPost);


    if(this.QuestionnaireId){
      this.QuestionnaireService.updateQuestionnaire(this.QuestionnaireId, dataPost)
      .subscribe(value => {
        console.log('HTTP Response data');
        console.log(typeof value['data']);
        if (value['data']) {
          this.formSubmit = true;
          this.optionsList = [];
          this.questionList = [];
          this.showAnswerOptions = false;
          this.questionnaireForm.reset();
          this.getQuestionnaire();
          this.QuestionnaireId = "";
          swal({
            title: 'Success',
            text: this.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.updatedSuccess'),
            allowEscapeKey:true,
            type: 'success'
        })
        } else {
          swal({
            title:'Oops...',
            text: value['message'],
            allowEscapeKey:true,
            type:'error'
          })
        }
      });
    }else{
      this.QuestionnaireService.createQuestionnaire(dataPost)
      .subscribe(value => {
        console.log('HTTP Response data');
        console.log(typeof value['data']);
        if (value['data']) {
          console.log(value['data']['_id']);
          this.formSubmit = true;
          this.optionsList = [];
          this.questionList = [];
          this.showAnswerOptions = false;
          this.questionnaireForm.reset();
          this.getQuestionnaire();
          swal({
            title:'Success',
            text:this.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.CreatedSuccess'), 
            allowEscapeKey:true,
            type:'success'})
        } else {
          swal({
            title:'Oops...', 
            text:value['message'], 
            allowEscapeKey:true,
            type:'error'
          })
        }
      });
    }



  }

  revert() {
    this.formSubmit = true;
    this.optionsList = [];
    this.questionList = [];
    this.showAnswerOptions = false;
    this.questionnaireForm.reset();
  }


}

