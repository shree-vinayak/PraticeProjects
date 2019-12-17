import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from '../questionnaire.service';

@Component({
  selector: 'app-questionnaire-recipient',
  templateUrl: './questionnaire-recipient.component.html',
  styleUrls: ['./questionnaire-recipient.component.css']
})
export class QuestionnaireRecipientComponent implements OnInit {
  tabledata: any = [];
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };

  constructor(private questionnaireService: QuestionnaireService) {

  }

  ngOnInit() {
    this.getData(10);
  }

  getData(limit) {
    let pageLimit = limit;
    this.questionnaireService.getRecepientTableData(pageLimit)
      .subscribe(res => {
        console.log(res);
        this.tabledata = res.data;
      });
  }
  sort() {

  }
}
