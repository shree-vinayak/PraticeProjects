import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from '../questionnaire.service';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { Router } from '@angular/router';
import _ from 'lodash';
// import swal from 'sweetalert2';
declare var swal: any;
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-questionnaire-template',
  templateUrl: './questionnaire-template.component.html',
  styleUrls: ['./questionnaire-template.component.scss']
})
export class QuestionnaireTemplateComponent implements OnInit {
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  page = new Page();
  reorderable = true;
  sort = new Sort();
  selected = [];
  questionnaires = [];
  quest:any;

  constructor(
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.selected = [];
    this.page.pageNumber = 0;
    this.page.totalElements = 0;
    this.page.totalPages = 5;
    this.page.size = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
  }

  ngOnInit() {
    this.getAllQuestionnaires();
  }

  getAllQuestionnaires() {
    this.questionnaireService
      .getAllQuestionnaires(this.page.pageNumber + 1)
      .subscribe(response => {
        console.log(response);
        this.questionnaires = response.data;
        this.page.totalElements = response.total;
      });
  }

  onSelect(event) {
    console.log(event);
    this.selected = event.selected;
  }

  sortPage(sortInfo): void {
    this.sort = new Sort();
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
    console.log('before', this.questionnaires);
    this.questionnaires = _.orderBy(this.questionnaires, this.sort.sortby, this.sort.sortmode);
    // this.questionnaires = [...this.questionnaires];
    console.log('after', this.questionnaires);
    // this.searchAfterModeCheck();
  }

  changePage(pageInfo): void {
    if (this.page.pageNumber !== pageInfo.offset) {
      this.page.pageNumber = pageInfo.offset;
      // this.searchAfterModeCheck();
    }
  }

  cloneQuestionnaire(questionnaireId) {
    let self= this;
    swal({
      type: 'question',
      input: 'text',
      title: this.translate.instant('QUESTIONNAIRE.SW9.TEXT'),
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('Export_S1.OK'),
      inputValue: '',
      inputValidator: value => {
        return new Promise((resolve, reject) => { 
          if (value) {
            this.questionnaireService
              .cloneQuestionnaire(questionnaireId, value)
              .subscribe(quest => {
                if (quest.code == 200) {
                  this.quest = quest.data;
                  resolve();
                } else {
                  reject(this.translate.instant('QUESTIONNAIRE.SW9.ERROR'));
                 }
              });
          } else {
            reject(this.translate.instant('QUESTIONNAIRE.SW9.NODATA'));
          }
        });
      }
    }).then(() => {
      swal({
        type: 'success',
        title: this.translate.instant('QUESTIONNAIRE.SUCCESS_SW.TITLE'),
        confirmButtonText: this.translate.instant('QUESTIONNAIRE.SUCCESS_SW.OK')
      })
      this.getAllQuestionnaires();
      const name = 'tools/questionnaire-data/' + this.quest['_id'];
      this.router.navigate([name]);
    })
  }

  checkClone(questionnaireId, questionnaireName){
    
  }
  //  this.questionnaireService
  // .cloneQuestionnaire(questionnaireId, questionnaireName)
  // .subscribe(quest => {
  //   if (quest) {
  //     this.getAllQuestionnaires();
  //     const name = 'tools/questionnaire-data/' + quest['_id'];
  //     this.router.navigate([name]);
  //   }
  // });

  editQuestionnaire(questionnaireId) {
    const name = 'tools/questionnaire-data/' + questionnaireId;
    this.router.navigate([name]);
  }

  deleteQuestionnaire(questionnaireId) {
    this.questionnaireService.deleteQuestionnaireById(questionnaireId).subscribe(questionnaire => {
      this.getAllQuestionnaires();
      console.log(questionnaire);
    });
  }
}
