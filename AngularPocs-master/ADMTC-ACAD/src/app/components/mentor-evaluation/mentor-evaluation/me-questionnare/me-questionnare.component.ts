import { Component, OnInit, SimpleChange } from '@angular/core';
import { QuestionnaireService } from 'app/components/mentor-evaluation/questionnaire.service';
import swal from 'sweetalert2';
import { TranslateService } from 'ng2-translate';
import { ListQuestionnaireComponent } from './list-questionnaire/list-questionnaire.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Questionnaire } from '../../questionnaire.model';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-me-questionnare',
  templateUrl: './me-questionnare.component.html',
  styleUrls: ['./me-questionnare.component.css']
})
export class MeQuestionnareComponent implements OnInit {
  public dialogRefQuestionnaire: MdDialogRef<ListQuestionnaireComponent>;
  selectedQuestionare: any;
  editable = true;
  questionnaire = new Questionnaire();
  ListQuestionnaireConfig: MdDialogConfig = {
    disableClose: true,
    width: '30%',
    height: '50%'
  };
  readyToSave = false;

  ListEditQuestionnaireConfig: MdDialogConfig = {
    disableClose: true,
    data: this.editable,
    width: '30%',
    height: '50%'
  };
  isValid = false;
  constructor(
    private questionnaireservice: QuestionnaireService,
    public translate: TranslateService,
    private dialog: MdDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router 
  ) {
    console.log('Inside dialog:', dialog);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.hasOwnProperty('id')) {
        this.questionnaireservice.getquestionnaireById(params['id']).subscribe(questionnaire => {
          this.selectedQuestionare = questionnaire.data;
          this.questionnaireservice.updateQuestionnaire(this.selectedQuestionare);
        });
      }
    });
    this.questionnaireservice.updateFormValidateIndicate(false);
    this.questionnaireservice.getFormValidateStatus().subscribe((status) => {
      this.readyToSave = status;
    });
  }

  ngOnChanges(changes: SimpleChange) {
    this.questionnaireservice.updateQuestionnaire(changes);
  }

  // Duplicate Questionnaire Button Removed In Questionnaire Creation UI
  // createDuplidateQuestionnaireDialog() {
  //   this.dialogRefQuestionnaire = this.dialog.open(ListQuestionnaireComponent, this.ListEditQuestionnaireConfig);
  //   this.dialogRefQuestionnaire.componentInstance.operation = 'duplidate';
  //   this.editable = false;
  //   this.dialogRefQuestionnaire.afterClosed().subscribe(result => {
  //     this.dialogRefQuestionnaire = null;
  //     if (result) {
  //       this.questionnaireservice.updateQuestionnaire(result);
  //     }
  //   });
  // }

  // Edit Questionnaire Button Removed In Questionnaire Creation UI
  // editQuestionnaireDialog() {
  //   this.dialogRefQuestionnaire = this.dialog.open(ListQuestionnaireComponent, this.ListQuestionnaireConfig);
  //   this.dialogRefQuestionnaire.componentInstance.operation = 'edit';
  //   this.dialogRefQuestionnaire.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.questionnaireservice.updateQuestionnaire(result);
  //     }
  //   });
  // }

  validateQuestionnaire() {
    console.log('this.readyToSave');
    console.log(this.readyToSave);
    this.questionnaireservice.updateFormValidateIndicate(true);

  }

  saveQuestionnaire() {
    const self = this;
    self.questionnaireservice.updateQuestionData().subscribe(value => {
      if (value['data']) {
        let selectedQuestionnaire;
        if (value.data[0]) {
          this.selectedQuestionare = value['data'][0];
        } else if (value.data._id) {
          this.selectedQuestionare = value.data;
        }
        this.questionnaireservice.updateQuestionnaire(this.selectedQuestionare);
        selectedQuestionnaire = this.selectedQuestionare.questionnaireName;
        swal({
          title: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.updateQuestionnaireSuccessTitle'),
          html: self.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.Messages.updateQuestionnaireSuccessText', { 'name': selectedQuestionnaire }),
          type: 'success',
          allowEscapeKey: true,
          showCancelButton: false,
          confirmButtonText: self.translate.instant('SETTINGS.USERTYPES.S1.Ok')
        });
        this.questionnaireservice.updateFormValidateIndicate(false);
        // this.questionnaireservice.updateQuestionnaire(new Questionnaire());
        // this.editable = false;
        this.router.navigate(['tools', 'questionnaire-tools']);
      } else {
        swal({
          html: value.message,
          type: 'warning',
          allowEscapeKey: true,
          confirmButtonText: self.translate.instant('SETTINGS.USERTYPES.S1.Ok')
        });
      }
    });
  }


}
