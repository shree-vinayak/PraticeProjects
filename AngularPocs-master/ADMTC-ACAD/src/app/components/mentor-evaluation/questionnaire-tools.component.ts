import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../node_modules/ng2-translate';
import { OneThousandIdeasModule } from '../../modules/one-thousand-ideas/one-thousand-ideas.module';

@Component({
  selector: 'app-questionnaire-tools',
  templateUrl: './questionnaire-tools.component.html',
  styleUrls: ['./questionnaire-tools.component.scss']
})
export class QuestionnaireToolsComponent implements OnInit {
  activatedTag: string;
  issued: boolean = false;
  recipient: boolean = false;
  template: boolean = true;
  constructor(private router: Router, private translate: TranslateService) { }

  ngOnInit() {
    this.activatedTag = 'questionnaire-template';
  }

  changeRoute() {
    const name = '/tools/questionnaire-tools/' + this.activatedTag;
    this.router.navigate([name]);
  }

  addQuestionnaire() {
    const name = 'tools/questionnaire-data/';
    this.router.navigate([name]);
  }
  tabChange(event){
    const questionnaireTemplateTab = this.translate.instant('QUESTIONNAIRE_TOOLS.QUESTIONNAIRE_TEMPLATE');
    const questionnaireIssued = this.translate.instant('QUESTIONNAIRE_TOOLS.QUESTIONNAIRE_ISSUED');
    const recipient = this.translate.instant('QUESTIONNAIRE_TOOLS.RECIPIENT');
    switch (event.tab.textLabel) {
      case questionnaireIssued:
        this.issued = true;
        this.recipient = false;
        this.template = false;
        break;
      case recipient:
        this.recipient = true;
        this.template = false;
        this.issued = false;
        break;
      case questionnaireTemplateTab:
        this.template = true;
        this.issued = false;
        this.recipient = false;
        break;
    }
  }
}
