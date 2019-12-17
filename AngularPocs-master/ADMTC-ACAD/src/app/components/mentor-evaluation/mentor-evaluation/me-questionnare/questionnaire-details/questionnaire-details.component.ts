import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { TextDialogComponent } from '../../../../test/steps/second-step/dialogs/text-dialog/text-dialog.component';
import { MdDialog, MdDialogRef, MdDialogConfig, MdCheckboxChange } from '@angular/material';
import { Questionnaire } from '../../../questionnaire.model';
import { QuestionnaireService } from '../../../questionnaire.service';
import swal from 'sweetalert2';
import { AddCompetenceComponent } from '../add-competence/add-competence.component';
import {
  FormArray, FormBuilder, FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import _ from 'lodash';
import { LoginService } from '../../../../../services';
import { QuestionnaireConsts } from './questionnaire-consts';

// required for logging
import { Log } from 'ng2-logger';
const log = Log.create('QuestionnaireDetailsComponent');
log.color = 'green';

@Component({
  selector: 'app-questionnaire-details',
  templateUrl: './questionnaire-details.component.html',
  styleUrls: ['./questionnaire-details.component.scss']
})
export class QuestionnaireDetailsComponent implements OnInit {
  @ViewChild('questionnaireName') questionnaireName: ElementRef;
  @Input() isValid: boolean = false;
  form: FormArray;

  selectedQuestionare: any;
  public segmentNumber = 0;
  public competenceNumber = 0;
  blockOfCompetencePlaceholder = [];
  questionnaireForm: FormGroup;
  competenceList = [];
  textDialog: MdDialogRef<TextDialogComponent>;
  config: MdDialogConfig = {
    disableClose: true
  };
  footerFields = [];
  headerFields = [];
  public dialogRefCompetence: MdDialogRef<AddCompetenceComponent>;
  AddCompetenceDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '40%',
    height: '40%'
  };
  questionnaire = new Questionnaire;
  questionnaireType = '';


  formSubmit = false;
  user = null;

  questionnaireConsts = QuestionnaireConsts;

  constructor(
    private dialog: MdDialog,
    private questionnaireservice: QuestionnaireService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private loginService: LoginService
  ) {
    log.info('Constructor Invoked');
  }

  ngOnInit() {
    this.user = this.loginService.getLoggedInUser();
    this.form = this.fb.array([]);
    this.questionnaireservice.updateFormValidateStatus(false);
    this.questionnaireservice.updateFormValidateIndicate(false);
    // this.onChanges();
    this.questionnaireName.nativeElement.value = '';
    this.questionnaire.createdBy = this.user._id;
    this.questionnaireservice.updateQuestionnaire('');
    this.questionnaireservice.getQuestionnaire().subscribe((questionnaire) => {
      if (this.form.controls.length < 1) {
        if (questionnaire) {
          this.questionnaire = questionnaire;
          this.getCompetence(this.questionnaire);
          this.questionnaireName.nativeElement.value = this.questionnaire.questionnaireName;
          this.questionnaireType = this.questionnaire.questionnaireType;
          this.questionnaire.createdBy = this.user._id;
          this.updateFormValidateStatus();
        } else {
          this.form = this.fb.array([]);
          this.questionnaireName.nativeElement.value = '';
          this.segmentNumber = 0;
          this.competenceNumber = 0;
        }
      }
    });
    this.questionnaireservice.getFormValidateIndicate().subscribe((status) => {
      this.formSubmit = status;
    });
  }



  getCompetence(result) {
    this.form = this.fb.array([]);
    this.competenceNumber = 0;
    result['competence'] = _.orderBy(result['competence'], ['sortOrder'], ['asc']);
    for (let i = 0; i < result['competence'].length; i++) {
      this.competenceList.push(result['competence'][i]);
      this.GenerateCompetenceForm(result['competence'][i]);
    }
  }


  openTextDialog(forSection: string) {
    switch (forSection) {
      case 'top-header':
        this.textDialog = this.dialog.open(TextDialogComponent, this.config);
        this.textDialog.componentInstance.textValue = this.questionnaire.questionnaireGrid.header.text;
        this.textDialog.afterClosed().subscribe((result) => {
          this.questionnaire.questionnaireGrid.header.text = result || '';
          this.questionnaireservice.updateQuestionnaire(this.questionnaire);
        });
        break;
      case 'footer-text':
        this.textDialog = this.dialog.open(TextDialogComponent, this.config);
        this.textDialog.componentInstance.textValue = this.questionnaire.questionnaireGrid.footer.text;
        this.textDialog.afterClosed().subscribe((result) => {
          this.questionnaire.questionnaireGrid.footer.text = result || '';
          this.questionnaireservice.updateQuestionnaire(this.questionnaire);
        });
        break;
      case 'direction-text':
        this.textDialog = this.dialog.open(TextDialogComponent, this.config);
        this.textDialog.componentInstance.textValue = this.questionnaire.questionnaireGrid.header.direction;
        this.textDialog.afterClosed().subscribe((result) => {
          this.questionnaire.questionnaireGrid.header.direction = result || '';
          this.questionnaireservice.updateQuestionnaire(this.questionnaire);
        });
        break;
      case 'questionnaire-title-text':
        this.textDialog = this.dialog.open(TextDialogComponent, this.config);
        this.textDialog.componentInstance.textValue = this.questionnaire.questionnaireGrid.header.title;
        this.textDialog.afterClosed().subscribe((result) => {
          this.questionnaire.questionnaireGrid.header.title = result || '';
          this.questionnaireservice.updateQuestionnaire(this.questionnaire);
        });
        break;
      default:
    }
  }
  footerTextPositionChanged(event: MdCheckboxChange) {
    this.questionnaire.questionnaireGrid.footer.textBelow = event.checked;
    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
  }
  addFooterField(field) {
    const ff = this.footerFields;
    const align = (ff.length === 0 || ff[ff.length - 1].dataType === 'longtext') ? 'left' : ff[ff.length - 1].align === 'left' ? 'right' : 'left';
    ff.push({
      editing: true,
      value: field.view,
      type: field.value,
      dataType: field.type,
      align: align
    });
    this.questionnaire.questionnaireGrid.footer.fields.push({
      value: field.view,
      dataType: field.type,
      type: field.value,
      align: align
    });
    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
  }

  removeFooterField(index) {
    this.footerFields.splice(index, 1);
    this.questionnaire.questionnaireGrid.footer.fields.splice(index, 1);
    // this.test.questionnaireGrid.footer.fields.splice(index, 1);
    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
  }

  saveFooterField(index) {
    const field = this.footerFields[index];
    if (field.value !== '') {
      field.editing = false;
      this.questionnaire.questionnaireGrid.footer.fields[index] = {
        value: field.value,
        dataType: field.dataType,
        type: field.type,
        align: field.align
      };
      this.questionnaireservice.updateQuestionnaire(this.questionnaire);
    } else {
      swal(
        'Error!',
        'Cannot create empty field',
        'warning'
      );
    }
  }

  editFooterField(index) {
    this.footerFields[index].editing = true;
  }
  addHeaderField(field, index, required) {

    const hf = this.headerFields;
    const align = (hf.length === 0 || hf[hf.length - 1].dataType === 'longtext') ? 'left' : hf[hf.length - 1].align === 'left' ? 'right' : 'left';
    hf.push({
      required: required,
      editing: true,
      value: field.view,
      type: field.value,
      dataType: field.type,
      align: align
    });
    this.questionnaire.questionnaireGrid.header.fields.push({
      value: field.view,
      dataType: field.type,
      type: field.value,
      align: align
    });
    if (index !== -1) {
      this.questionnaireConsts.requiredFieldsTypes[index].removed = true;
    }
    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
  }

  removeHeaderField(index) {
    let field = this.headerFields[index];
    if (field.required === true) {
      const a = this.questionnaireConsts.requiredFieldsTypes.find((f) => {
        return f.value === field.type
      });
      if (a) {
        a.removed = false;
      }
    }
    this.headerFields.splice(index, 1);
    this.questionnaire.questionnaireGrid.header.fields.splice(index, 1);
    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
  }

  saveHeaderField(index) {
    const field = this.headerFields[index];
    if (field.value !== '') {
      field.editing = false;
      this.questionnaire.questionnaireGrid.header.fields[index] = {
        value: field.value,
        dataType: field.dataType,
        type: field.type,
        align: field.align
      };
      this.questionnaireservice.updateQuestionnaire(this.questionnaire);
    } else {
      swal(
        'Error!',
        'Cannot create empty field',
        'warning'
      );
    }
  }

  editHeaderField(index) {
    this.headerFields[index].editing = true;
  }

  setQuestionnaireName(value) {
    this.questionnaire.questionnaireName = value;
    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
    this.updateFormValidateStatus();
  }
  setCommentsHeader(value) {
    // Code to do processing will come here
  }
  GenerateCompetenceForm(data) {
    this.segmentNumber = 0;
    const control = this.form;
    const addrCtrl = this.fb.group({
      competenceName: [data ? data.competenceName : '', Validators.required],
      // _id: [data ? data._id ? data._id : data.id ? data.id : '' : ''],
      segment: this.fb.array([]),
      sortOrder: [Number(this.form.value.length) + 1]
    });
    control.push(addrCtrl);
    if (data.segment && data.segment.length) {
      data.segment = _.orderBy(data.segment, ['sortOrder'], ['asc']);
      data.segment.forEach(element => {
        this.GenerateSegmentForm(this.competenceNumber, element);
        this.segmentNumber = this.segmentNumber + 1;
      });
    }
    this.competenceNumber = this.competenceNumber + 1;
    this.updateFormValidateStatus();
  }

  addNewSegment(competenceIndex) {
    const segments = this.form.value[competenceIndex].segment;
    this.GenerateSegmentForm(competenceIndex, {
      segmentName: '',
      id: '',
      question: []
    });
  }

  AddQuestion(competenceIndex, segmentIndex) {
    this.GenerateQuestionForm(competenceIndex, segmentIndex, { 'questionType': '', 'questionName': '', 'id': '' });
  }

  GenerateSegmentForm(competenceIndex, data) {
    const control = this.form;
    const segmentControl = this.form.controls[competenceIndex]['controls']['segment'];
    const addrCtrl = this.fb.group({
      segmentName: [data ? data.segmentName : '', Validators.required],
      // _id: [data ? data._id ? data._id : data.id ? data.id : '' : ''],
      question: this.fb.array([]),
      sortOrder: [Number(this.form.value[competenceIndex].segment.length) + 1]
    });
    segmentControl.push(addrCtrl);
    if (data.question.length) {
      data.question = _.orderBy(data.question, ['sortOrder'], ['asc']);
      data.question.forEach(element => {
        this.GenerateQuestionForm(competenceIndex, this.segmentNumber, element);
      });
    }
    this.updateFormValidateStatus();
  }
  GenerateQuestionForm(competenceIndex, segmentIndex, data) {
    const control = this.form;
    const questionControl = this.form.controls[competenceIndex]['controls']['segment'].controls[segmentIndex]['controls']['question'];
    const addrCtrl = this.fb.group({
      'questionType': [data && data.questionType ? data.questionType : '', data && data.isField ? [] : Validators.required],
      'questionName': [data && data.questionName ? data.questionName : '', data && data.isField ? [] : Validators.required],
      // '_id': [data ? data._id ? data._id : data.id ? data.id : '' : ''],
      'isField': [data && data.isField ? data.isField : false, Validators.required],
      'isAnswerRequired': [data && data.isAnswerRequired ? data.isAnswerRequired : false],
      'options': [data && typeof data.options == 'object' ? data.options : []],
      'answer': [''],
      'questionnaireFieldKey': [data && data.questionnaireFieldKey ? data.questionnaireFieldKey : ''],
      'sortOrder': [Number(this.form.value[competenceIndex].segment[segmentIndex].question.length) + 1]
    });
    questionControl.push(addrCtrl);
    this.form.value[competenceIndex].segment[segmentIndex].question.push(data);
    this.updateFormValidateStatus();
  }



  checkIsMutiOption(competenceIndex, segmentIndex, questionIndex) {
    const type = this.form.value[competenceIndex]['segment'][segmentIndex]['question'][questionIndex].questionType;
    if (type === 'multipleOption' || type === 'singleOption') {
      return !this.form.value[competenceIndex]['segment'][segmentIndex]['question'][questionIndex].isField;;
    }
    return false;
  }
  addMoreOptions(competenceIndex, segmentIndex, questionIndex) {
    const optionValue = this.form.value[competenceIndex]['segment'][segmentIndex]['question'][questionIndex].answer;
    if (optionValue) {
      const optionPosition = this.form.value[competenceIndex]['segment'][segmentIndex]['question'][questionIndex].options.length;
      this.form.value[competenceIndex]['segment'][segmentIndex]['question'][questionIndex].options.push({optionText: optionValue, position: optionPosition});
      this.form.value[competenceIndex]['segment'][segmentIndex]['question'][questionIndex].answer = '';
      this.form.controls[competenceIndex]['controls']['segment'].controls[segmentIndex]['controls']['question'].controls[questionIndex]['controls']['answer'].setValue('');
      this.updateDocumentObject();
    }
  }


  removeCompetence(competenceIndex) {
    const self = this;
    swal({
      title: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedCompetenceWarningTitle'),
      // html: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedCompetenceWarningMessage'),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: self.translate.instant('YES'),
      cancelButtonText: self.translate.instant('NO')
    }).then(function () {
      self.form.controls.splice(competenceIndex, 1);
      self.form.value.splice(competenceIndex, 1);
      self.updateDocumentObject();
      swal({
        // title: 'Deleted!',
        title: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedCompetenceSuccess'),
        allowEscapeKey: true,
        type: 'success'
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') { }
    });
  }

  removeSegment(competenceIndex, segmentIndex) {
    const self = this;
    swal({
      title: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedSegmentWarningTitle'),
      // html: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedSegmentWarningMessage'),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: self.translate.instant('YES'),
      cancelButtonText: self.translate.instant('NO')
    }).then(function () {
      self.form.controls[competenceIndex]['controls']['segment']['controls'].splice(segmentIndex, 1);
      self.form.value[competenceIndex]['segment'].splice(segmentIndex, 1);
      self.updateDocumentObject();
      swal({
        title: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedSegmentSuccess'),
        // text: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedSegmentSuccess'),
        allowEscapeKey: true,
        type: 'success'
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') { }
    });
  }

  removeQuestion(competenceIndex, segmentIndex, questionIndex) {
    const self = this;
    swal({
      title: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedQuestionWarningTitle'),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: self.translate.instant('YES'),
      cancelButtonText: self.translate.instant('NO')
    }).then(function () {
      self.form.controls[competenceIndex]['controls']['segment']['controls'][segmentIndex]['controls']['question']['controls'].splice(questionIndex, 1);
      self.form.value[competenceIndex]['segment'][segmentIndex]['question'].splice(questionIndex, 1);
      self.updateDocumentObject();
      swal({
        title: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedQuestionSuccess'),
        text: '',
        confirmButtonText: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedQuestionSuccessOk'),
        allowEscapeKey: true,
        type: 'success'
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') { }
    });
  }

  removeOption(competenceIndex, segmentIndex, questionIndex, optionIndex) {
    const self = this;
    swal({
      title: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedOptionWarningTitle'),
      // html: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedOptionWarningMessage'),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: self.translate.instant('YES'),
      cancelButtonText: self.translate.instant('NO')
    }).then(function () {
      self.form.value[competenceIndex]['segment'][segmentIndex]['question'][questionIndex].options.splice(optionIndex, 1);
      self.updateDocumentObject();
      // swal({
      //   title: 'Deleted!',
      //   text: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.deletedOptionSuccess'),
      //   allowEscapeKey:true,
      //   type: 'success'
      // });
    }, function (dismiss) {
      if (dismiss === 'cancel') { }
    });

  }


  addNewCompetenceDialog() {
    const valueTests = this.form.value;
    this.GenerateCompetenceForm('');
    this.competenceList.push('');
  }

  changeIsAnswerRequired(checkboxValue, competenceIndex, segmentIndex, questionIndex) {
    this.questionnaire.competence = this.form.value;
    this.questionnaire['competence'][competenceIndex]['segment'][segmentIndex]['question'][questionIndex].isAnswerRequired = checkboxValue.checked;
    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
  }

  changeIsField(isField, competenceIndex, segmentIndex, questionIndex) {
    this.questionnaire.competence = this.form.value;
    this.questionnaire['competence'][competenceIndex]['segment'][segmentIndex]['question'][questionIndex].isField = isField.checked;
    const stringPath = `${competenceIndex}.segment.${segmentIndex}.question.${questionIndex}`;

    const valueOfQuestion = this.form.get(stringPath).value;
    if (valueOfQuestion.isField) {
      this.form.get(stringPath + '.questionnaireFieldKey').setValidators([Validators.required]);
      this.form.get(stringPath + '.questionName').clearValidators();
      this.form.get(stringPath + '.questionType').clearValidators();
      if (this.form.get(stringPath + '.questionName').invalid) {
        this.form.get(stringPath + '.questionName').setValue('');
        this.form.get(stringPath + '.questionType').setValue('');
      }
    } else {
      this.form.get(stringPath + '.questionnaireFieldKey').clearValidators();
      this.form.get(stringPath + '.questionName').setValidators([Validators.required]);
      this.form.get(stringPath + '.questionType').setValidators([Validators.required]);
    }

    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
    this.updateFormValidateStatus();
  }

  updateDocumentObject() {
    this.questionnaire.competence = this.form.value;
    this.updateFormValidateStatus();
    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
  }

  updateFormValidateStatus() {
    let status = this.form.valid;
    if (!this.questionnaire.questionnaireName || !this.questionnaire.questionnaireType) {
      status = false;
    }
    this.questionnaireservice.updateFormValidateStatus(status);
  }

  changeQuestionnaireType(queType) {
    this.questionnaire.questionnaireType = queType.value;
    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
    this.updateFormValidateStatus();
  }

  onQuestionnaireFieldsChange(field, competenceIndex, segmentIndex, questionIndex) {
    this.questionnaire.competence = this.form.value;
    this.questionnaire['competence'][competenceIndex]['segment'][segmentIndex]['question'][questionIndex].questionnaireFieldKey = field.value;
    this.questionnaireservice.updateQuestionnaire(this.questionnaire);
    this.updateFormValidateStatus();
  }
}
