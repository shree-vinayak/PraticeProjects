

import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate';
import swal from 'sweetalert2';
import { QuestionnaireService } from '../../../../../services/questionnaire.service';
@Component({
  selector: 'app-viewquestionnaire',
  templateUrl: './viewquestionnaire.component.html',
  styleUrls: ['./viewquestionnaire.component.scss'],
  providers: [ QuestionnaireService],
  encapsulation: ViewEncapsulation.None,
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})
export class ViewQuestionnaireComponent implements OnInit {

  @Input() taskId;


  recepientsList: Observable<Array<string>>;
  selectedRecepientsList = [];
  composeProcess = false;
  composeMailMessage: string;
  filename;
  text;
  subject;
  date;
  PopupTitle;
  QuestionnaireId = "";
  QuestionnaireData;
  formSubmit = false;
  questionList = [];
  optionsList = [];
  showAnswerOptions = false;
  public questionnaireForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogref: MdDialogRef<ViewQuestionnaireComponent>,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,

    private QuestionnaireService: QuestionnaireService,
    @Inject(MD_DIALOG_DATA) public data: any,
    public translate: TranslateService
  ) {

    this.questionnaireForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      question: [''],
      answertype: [''],
      option: [''],

    });

  }

  ngOnInit(): void {
      this.questionnaireForm.controls['name'].setValue(this.QuestionnaireData.name);
      this.questionList = this.QuestionnaireData.questions;
      this.composeMailMessage = this.QuestionnaireData.message;
  }


  closeDialog(): void {
    this.dialogref.close();
  }

  addMoreQuestion(){
    var formValues = this.questionnaireForm.value;
    if(formValues.question != "" && formValues.answertype != ""){
      this.questionList.push({'question': formValues.question,'answerType': formValues.answertype,options: this.optionsList });
      this.questionnaireForm.controls['question'].setValue('');
      this.questionnaireForm.controls['answertype'].setValue('');
      this.optionsList = [];
      this.showAnswerOptions = false;
    }
  }
  addMoreOptions(){
    var formValues = this.questionnaireForm.value;
    if(formValues.option != ""){
      this.optionsList.push( formValues.option);
      this.questionnaireForm.controls['option'].setValue('');
    }
  }
  removeQuestion(index){
    this.questionList.splice(index, 1);
  }
  answerTypeChange(event){
    if(event.value == "MultipleOptions" || event.value == 'SingleOption'){
      this.showAnswerOptions = true;
    }else{
      this.showAnswerOptions = false;
    }
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

      this.QuestionnaireService.updateQuestionnaire(this.QuestionnaireId, dataPost)
        .subscribe(value => {
          console.log('HTTP Response data');
          console.log(typeof value['data']);
          if (value['data']) {
            console.log(value['data']['_id']);
            this.closeDialog();
            swal({
              title:'Success',
              text: this.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.updatedSuccess'), 
              allowEscapeKey:true,
              type:'success'
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


  }


}
