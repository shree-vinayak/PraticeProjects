import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { QuestionnaireService } from 'app/components/mentor-evaluation/questionnaire.service';
import { AcademicKitService } from '../../../../../services/academic-kit.service';
import { MeQuestionnareComponent } from 'app/components/mentor-evaluation/mentor-evaluation/me-questionnare/me-questionnare.component';
// import { MentorEvaluationService } from '../../../../../services/mentor-evaluation.service';

@Component({
    selector: 'app-list-questionnaire',
    templateUrl: './list-questionnaire.component.html',
    styleUrls: ['./list-questionnaire.component.scss']
})
export class ListQuestionnaireComponent implements OnInit {
    form: FormGroup;
    competence;
    operation;
    formSubmit = false;
    questionnaireList;
    questionnaireListSearchString: string;
    totalquestionnaire = [];
    searchResults: any[];
    showHint = true;
    searching: boolean = false;
    isDuplicate:boolean = false;
    selectionType = '';
    //   meQuestionnareComponent : MeQuestionnareComponent
    constructor(
        private dialogRef: MdDialogRef<ListQuestionnaireComponent>,
        private questionnaireservice: QuestionnaireService) { }

    ngOnInit() {
        this.form = new FormGroup({
            competenceName: new FormControl(this.competence ? this.competence.competenceName : '', Validators.required),
            id: new FormControl(this.competence ? this.competence._id : ''),
        });
        this.showHint = false;
        this.searching = true;
        this.questionnaireservice.listQuestionnaire().subscribe(value => {
            if (value['data']) {

                this.searchResults = value['data'];
                this.searchResults.forEach(sresult => {
                  if (this.selectionType == 'duplidate') {
                      this.isDuplicate = true;
                  }else if(this.selectionType == 'edit'){
                      this.isDuplicate = false;
                  }
              });
              this.searching = false;
            }
        });
        this.selectionType = this.dialogRef.componentInstance.operation;
    }

    cancel() {
        this.dialogRef.close(false);
    }

    continue() {
        this.formSubmit = true;
        if (this.form.valid) {
            const dataPost = this.form.value;
            this.dialogRef.close(dataPost);
        }
    }

    onSearch(search) {
        let questionnaire = {
            questionnaireName: search
        };
        if (search.trim().length >= 2) {
            this.showHint = false;
            this.searching = true;
            this.questionnaireservice.filterQuestionnaire(questionnaire).subscribe(results => {
                this.searchResults = results.data;
                this.searchResults.forEach(sresult => {
                    if (this.selectionType == 'duplidate') {
                        this.isDuplicate = true;
                    }else if(this.selectionType == 'edit'){
                        this.isDuplicate = false;
                    }
                });
                this.searching = false;
            });
        } else {
            this.showHint = true;
            this.searching = false;

            if(search.trim() == ""){
              this.showHint = false;
              this.searching = true;
              this.questionnaireservice.listQuestionnaire().subscribe(value => {
                if (value['data']) {
                    this.searchResults = value['data'];
                    this.searchResults.forEach(sresult => {
                      if (this.selectionType == 'duplidate') {
                          this.isDuplicate = true;
                      }else if(this.selectionType == 'edit'){
                          this.isDuplicate = false;
                      }
                  });
                  this.searching = false;
                }
            });
            }

        }
    }

    duplicatequestionnaire(result: any) {
        if (result) {
            this.questionnaireservice.getquestionnaireById(result._id).subscribe(questionnaire => {
              if(questionnaire.data){
                let result = questionnaire.data;
                result._id = null;
                if(result['competence'].length){
                  for (var indexCompetence = 0; indexCompetence < result['competence'].length; indexCompetence++) {
                    result['competence'][indexCompetence]['_id'] = null;
                    for (var indexSegment = 0; indexSegment <  result['competence'][indexCompetence]['segment'].length; indexSegment++) {
                      result['competence'][indexCompetence]['segment'][indexSegment]['_id'] = null;
                      for (var indexQuestion = 0; indexQuestion <  result['competence'][indexCompetence]['segment'][indexSegment]['question'].length; indexQuestion++) {
                        result['competence'][indexCompetence]['segment'][indexQuestion]['question'][indexQuestion]['_id'] = null;
                      }
                    }
                  }
                }
                this.dialogRef.close(result);
              }else{
                this.dialogRef.close({});
              }
            });
        }

    }

    onSelectquestionnaire(result: any) {
        if (result) {
            this.questionnaireservice.getquestionnaireById(result._id).subscribe(questionnaire => {
                this.dialogRef.close(questionnaire.data);
            });
        }
    }
}
