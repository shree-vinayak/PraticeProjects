import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '../../../../../node_modules/@angular/material';
import { SendQuestionnaireDialogComponent } from './send-questionnaire-dialog/send-questionnaire-dialog.component';
import { QuestionnaireService } from '../questionnaire.service';
import { RncpTitle } from '../../../shared/global-urls';
import { RNCPTitlesService, ScholarSeasonService } from '../../../services';

@Component({
  selector: 'app-questionnaire-board',
  templateUrl: './questionnaire-board.component.html',
  styleUrls: ['./questionnaire-board.component.css']
})
export class QuestionnaireBoardComponent implements OnInit {
  templateName:any;
  sendDate:any;
  Title:any;
  scholarSeason:any;
  class:any;
  recipient:any;
  questionnaireType:any;
  status:any;
  action:any;
  questions:any = [];
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
 
  filterCreator: any;
  filterRncpTitle: any;
  filterQuestionnaireType: any;
  filterClass: any;
  filterScholarSeason: any;
  selectRncpId: any;
  selectedScholarSeason: any;
  selectedQuestionnaire: any;
  selecetedClass: any;
  selectedcreator: any;

  schoolList: any;
  classList: any;
  scholarSeasonsList: any;
  rncpList: any;
  questionnaireList: any;
  creatorList: any;
  dialogRef: MdDialogRef<SendQuestionnaireDialogComponent>;

  constructor(public dialog: MdDialog, 
              private questionService: QuestionnaireService,
              private rncpService:RNCPTitlesService,
              private scholarSeasonService: ScholarSeasonService
  ) { }

  ngOnInit() {
    this.getTableContent();
    this.getRNCPlist();
    this.getQuestionnaireList();
    this.getCreatorList();
  }

    sort(){}

  sendQuestionnaire() {
    let config: MdDialogConfig = {
      disableClose: true,
      width: '500px'
    };
    this.dialogRef = this.dialog.open(
      SendQuestionnaireDialogComponent,
      config
    );
    this.dialogRef.afterClosed().subscribe((data) =>{
      console.log(data);
    });
  }

  getTableContent() {
    this.questionService.getQuestionnaireTableContent().subscribe(res => {
      this.questions = res.data;
    });
  }

  getRNCPlist() {
    this.rncpService.getAllRNCPTitlesShortName().subscribe(res => {
      this.rncpList = res.data;
    });
  }

  getQuestionnaireList() {
    this.questionService.getAllQuestionnaireResponse()
      .subscribe(response => {
        this.questionnaireList = response.data;
      });
  }
  getCreatorList(){
    this.questionService.getCreatorList().subscribe( res =>{
      this.creatorList = res.data;
    });
  }

  onSelectCreator(creator){

  }
  onSelectRncp(title) {
    this.selectRncpId = title._id;
    // get ScholerSeason
    this.scholarSeasonService.getScholarSeasonByRcnp(this.selectRncpId)
      .subscribe(res => {
        this.scholarSeasonsList = res.data;
      });

    //get Classes
    this.rncpService.getClassesNosort(this.selectRncpId)
      .subscribe(res => {
        this.classList = res.classes;
      });
    }

  onSelectScholarSeason(season){
    this.selectedScholarSeason = season._id;
  }
  onSelectQues(ques) {
    this.selectedQuestionnaire = ques.questionnaireTemplateId._id;
  }
  onSelectClass(list) {
  this.selecetedClass = list._id;
  }
  searchQuestionnaire() {

  }
  resetSearch() {

  }
  selectCreator(creator){
    this.selectCreator = creator._id;
  }
}
