import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../../../../safe-html.pipe';
import { Questionnaire } from '../../../questionnaire.model';
import { QuestionnaireService } from 'app/components/mentor-evaluation/questionnaire.service';

@Component({
  selector: 'app-questionnaire-document',
  templateUrl: './questionnaire-document.component.html',
  styleUrls: ['./questionnaire-document.component.scss']
})
export class QuestionnaireDocumentComponent implements OnInit {
  visiblePage = 1;
  pages: number;
  questionnaire = new Questionnaire;
  pageSectionsArray: any[] = [];
  constructor(
    public questionnaireservice: QuestionnaireService
  ) { }

  ngOnInit() {
    this.questionnaireservice.getQuestionnaire().subscribe((questionnaire) => {
      this.questionnaire = questionnaire;
    //  this.docFooterText = 'ADMTC – ' + this.translate.instant('TEST.EVALUATIONGRID') + ' ' + test.name + ' – ' + this.rncpTitle.shortName + ' – ' + this.currentYear + ' / ' + this.nextYear;
    //  this.setNoOfStudents();
      // this.questionnaireservice.updateQuestionnaire(questionnaire);
      console.log()
      if(questionnaire && questionnaire.questionnaireGrid){
        this.renderData();
      }

    });
  }

  showPreviousPage() {
    if (this.visiblePage > 1) {
      this.visiblePage = this.visiblePage - 1;
    }
  }

  showNextPage() {
    if (this.visiblePage < this.pages) {
      this.visiblePage = this.visiblePage + 1;
    }
  }
  renderData() {
    const sections = this.questionnaire.questionnaireGrid.correction.sections;
    this.pageSectionsArray = [[]];
    let pageArrayIndex = 0;
    for (let i = 0; i <= sections.length - 1; i++) {
      const section = sections[i];
      if (this.pageSectionsArray[pageArrayIndex]) {
        this.pageSectionsArray[pageArrayIndex].push(section);
      } else {
        this.pageSectionsArray.push([section]);
      }
      if (section.pageBreak && i !== sections.length - 1) {
        pageArrayIndex = pageArrayIndex + 1;
        this.pageSectionsArray.push([]);
      }
    }
    this.pages = this.pageSectionsArray.length;
  }
  showBottomGrid(index) {
    return (this.pages === index);
  }
}
