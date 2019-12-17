import {
  AfterViewChecked,
  Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer,
  ViewChild
} from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate';
// import { QuestionnaireService } from '../../services/questionnaire.service';
import { EmailtemplateService } from '../../services/emailtemplate.service';
import { MentorEvaluationService } from '../../services/mentor-evaluation.service';
import { CustomValidators } from 'ng2-validation';
import swal from 'sweetalert2';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { LoginService } from '../../services/login.service';
import { PDFService } from '../../services/pdf.service';
import { PRINTSTYLES, STYLES } from './styles';
import { Print } from '../../shared/global-urls';
import { TestService } from '../../services/test.service';
import { Test } from '../../models/test.model';
import { DatePipe } from '@angular/common';
import { Questionnaire } from '../../components/mentor-evaluation/questionnaire.model';
import { QuestionnaireService } from '../../components/mentor-evaluation/questionnaire.service';
import 'rxjs/Rx';
import { map } from 'rxjs/operator/map';
import { startWith } from 'rxjs/operator/startWith';
import { element } from 'protractor';

@Component({
  selector: 'app-send-mentor-evaluation',
  templateUrl: './send-mentor-evaluation.component.html',
  styleUrls: ['./send-mentor-evaluation.component.scss'],
  providers: [ QuestionnaireService,EmailtemplateService,RNCPTitlesService,LoginService,MentorEvaluationService,DatePipe],
})

export class SendMentorEvaluationComponent implements OnInit {

  @ViewChild('pagesElement') documentPagesRef: ElementRef;
  @Output() expandView: EventEmitter<boolean> = new EventEmitter();
  public questionnaireForm: FormGroup;
  formSubmit = false;

  mailTemplateList = [];
  QuestionnaireList = [];
  GridList = [];
  rncpTitle: any;
  user: any;
  selectedQuestionnaire: any;
  selectedGrid: any;
  test = new Test();
  @Input() expanded;
  pages: number;
  pageSectionsArray: any[] = [];
  visiblePage = 1;
  docFooterText = '';
  students: number[] = [];
  filteredGrid = [];
  filteredQuestionare = [];
  filteredMailTemplete = [];
  filteredmailRemainder= [];
  questionnaires: Questionnaire[] = [];
  questionareSearchString = '';
  gridSearchString = '';
  remainderMailSearchString = '';
  mailTemplateSearchString = '';
  questionairedata : any = [];
  studentId: any = [];
  documentTypes = [
    {
      value: 'guideline',
      view: 'Guidelines'
    },
    {
      value: 'test',
      view: 'Test'
    },
    {
      value: 'scoring-rules',
      view: 'Scoring Rules'
    },
    {
      value: 'studentnotification',
      view: 'Notification to Student'
    },
    {
      value: 'other',
      view: 'Other'
    }
  ];
  constructor( private fb: FormBuilder,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private QuestionnaireService: QuestionnaireService,
    public translate: TranslateService,
    public dialogref: MdDialogRef<SendMentorEvaluationComponent>,
    private EmailtemplateService: EmailtemplateService,
    private MentorEvaluationService: MentorEvaluationService,
    private pdfService: PDFService,
    private appService: RNCPTitlesService,
    private loginService: LoginService,
    private testService: TestService,
    public datepipe: DatePipe) {
      
      console.log(this.dialogref);
      let items = this.dialogref._containerInstance.dialogConfig.data;
      this.studentId = Array.from(new Set(items));
    }
 
  ngOnInit() {
    this.user = this.loginService.getLoggedInUser();
    console.log('Logged In User');
    console.log(this.user);
    console.log('RNCP TITLE');
    console.log(this.rncpTitle);
 
    this.questionnaireForm = this.fb.group({
      date: ['', [ Validators.required, CustomValidators.date ]],
      questionnaire: ['',Validators.compose([Validators.required])],
      template: ['',Validators.compose([Validators.required])],
      grid: ['',Validators.compose([Validators.required])],
      remainder: ['',Validators.compose([Validators.required])],
      message: [''],
      subject: ['',Validators.compose([Validators.required])],
      remaindermessage: [''],
      remaindersubject: ['',Validators.compose([Validators.required])]
    });

    this.getTemplates();
    this.getQuestionnaire();
    this.getGrid();
  }

  closeDialog(): void {
    this.dialogref.close();
  }

  myNgModelDateChange(value) {
    this.questionnaireForm.controls["date"].setValue(value);
  }

  getTemplates(): void {
    this.EmailtemplateService.getTemplates().then(data => {
      console.log(data.data);
      this.mailTemplateList = data.data;
      this.filteredMailTemplete = this.mailTemplateList;
      this.filteredmailRemainder = this.mailTemplateList;
    });
  }
  getQuestionnaire(): void {
    this.QuestionnaireService.listQuestionnaire().subscribe(data => {
      console.log(data.data);
      this.questionnaires = data.data;
      this.filteredQuestionare = this.questionnaires;
      console.log("Inside getquestionnaire",this.questionnaires);
      // this.questionnaireForm.controls['questionnaire'] = new FormControl();
      // this.filterQuestionnaires = this.questionnaireForm.controls['questionnaire'].valueChanges
      // .pipe(
      //   startWith(''),
      //   map(questionnaire => questionnaire ? this.filterQuestionnaires(questionnaire) : this.questionnaires.slice())
      // );

    });
  }
  getGrid(): void {
    this.MentorEvaluationService.getGridLists(this.rncpTitle._id)
    .subscribe(res => {
      console.log("gridList:Response",res);
      res.forEach(element => {
        if(element.type == "mentor-evaluation"){
          this.GridList.push(element);
        }
      });

      console.log('this.RncpTests');
      console.log("GridList",this.GridList);
      this.filteredGrid = this.GridList;
    });
  }

  changeMailTemplate(event){

    this.filteredMailTemplete = this.mailTemplateList;
    if (this.mailTemplateSearchString != "") {
      let val = event.target.value.toLowerCase();
      console.log('Search Text :'+val);
      let temp = this.filteredMailTemplete.filter(function (mail) {
        return (
          (mail.name != '' && mail.name.toLowerCase().indexOf(val) !== -1));
      });
      console.log("temp",temp);
      this.filteredMailTemplete = temp;
    } else {
      this.filteredMailTemplete = this.mailTemplateList;
    }

    this.mailTemplateList.forEach(element => {
        if(element._id == event.value){
          console.log(element);
          this.questionnaireForm.controls["message"].setValue(element.message);
          this.questionnaireForm.controls["subject"].setValue(element.subject);
        }
    });
  }

  changeRemainderMailTemplate(event){

    this.filteredmailRemainder = this.mailTemplateList;
    if (this.questionareSearchString != "") {
      let val = event.target.value.toLowerCase();
      console.log('Search Text :'+val);
      let temp = this.filteredmailRemainder.filter(function (mail) {
        return (
          (mail.name != '' && mail.name.toLowerCase().indexOf(val) !== -1));
      });
      console.log("temp",temp);
      this.filteredmailRemainder = temp;
    } else {
      this.filteredmailRemainder = this.mailTemplateList;
    }

    this.mailTemplateList.forEach(element => {
        if(element._id == event.value){
          console.log(element);
          this.questionnaireForm.controls["remaindermessage"].setValue(element.message);
          this.questionnaireForm.controls["remaindersubject"].setValue(element.subject);
        }
    });
  }

  changeQuestionnaire(event){
    console.log(event.target.value);
    console.log(this.questionareSearchString);
    console.log("questionnaires:",this.questionnaires);

    this.filteredQuestionare = this.questionnaires;
    if (this.questionareSearchString != "") {
      let val = event.target.value.toLowerCase();
      console.log('Search Text :'+val);
      let temp = this.filteredQuestionare.filter(function (questionare) {
        return (
          (questionare.questionnaireName != '' && questionare.questionnaireName.toLowerCase().indexOf(val) !== -1));
      });
      console.log("temp",temp);
      this.filteredQuestionare = temp;
      this.questionairedata = temp;
      console.log("questionaire",this.questionairedata);
      // temp.forEach(element=>{
      //   console.log(element);
      // })
      if (temp && temp[0]._id) {
        this.questionnaireForm.controls["questionnaire"].setValue(temp[0]._id);
      }
    } else {
      this.filteredQuestionare = this.questionnaires;
    }

    this.questionnaires.forEach(element => {
      if(element._id == event.value){
        this.selectedQuestionnaire = element;
        console.log(this.selectedQuestionnaire);
        console.log(this.getQuestionnairePage());
      }
    });

   
  }

  changeGrid(event){
    console.log(event.value);
    console.log("this.GridList",this.GridList);
    this.filteredGrid = this.GridList;

    if (this.gridSearchString != "") {
      let val = event.target.value.toLowerCase();
      console.log('Search Text :'+val);
      let temp = this.filteredGrid.filter(function (grid) {
        return (
          (grid.name != '' && grid.name.toLowerCase().indexOf(val) !== -1));
      });
      console.log("temp",temp);
      this.filteredGrid = temp;
      if (temp && temp[0]._id) {
        this.questionnaireForm.controls['grid'].setValue(temp[0]._id);
      }
    } else {
      this.filteredGrid = this.GridList;
    }

    this.GridList.forEach(element => {
      if(element._id == event.value){
        this.selectedGrid = element;
        this.test = element;
        this.renderData();
        console.log(this.selectedGrid);
      }
    });
  }

  onSelectQuestionare(data){
    console.log("selected Questionare",data);
    if (data && data._id) {
      this.questionnaireForm.controls["questionnaire"].setValue(data._id);
    }
  }

  onSelectGrid(data){
    console.log("Selected Grid",data);
    if (data && data._id) {
      this.questionnaireForm.controls['grid'].setValue(data._id);
    }
  }

  save(){
    console.log(this.questionnaireForm.value);
    this.formSubmit = true;

    // if (!this.questionnaireForm.valid) {
    //   return;
    // }
    const formValues = this.questionnaireForm.value;
console.log("form values",formValues);
    let dataPost = {
      'student': this.studentId,
      'createdDate': formValues.date,
      'questionnaireTemplate': formValues.questionnaire,
      'test': formValues.grid,
      'mentorEvaluationStatus':'sentToMentor'
    }
    console.log(dataPost);

    this.MentorEvaluationService.createMentorEvaluation(dataPost)
        .subscribe(value => {
          console.log('HTTP Response data');
          console.log(typeof value['data']);
          if (value['data']) {
            console.log(value['data']['_id']);
            this.closeDialog();
            swal({
              title:'Success', 
              text: this.translate.instant('MENTOREVALUATION.MentorEvaluationCreatedSuccess'), 
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

  expanding(event: boolean) {
    this.expanded = event;
  }

  downloadPDF() {
    this.formSubmit = true;
    if (!this.questionnaireForm.valid) {
      return;
    }

    const target = this.documentPagesRef.nativeElement.children;
    const outer = document.createElement('div');
    outer.innerHTML = '';
    let html = PRINTSTYLES;
    html += `<div class="ql-editor document-parent"><div>`;
    for (const element of target) {
      const wrap = document.createElement('div');
      const el = element.cloneNode(true);
      el.style.display = 'block';
      wrap.appendChild(el);
      html += wrap.innerHTML;
    }
    /*Add Email Template */

    html += this.getEmailTemplatePage();
    html += "<br><br>";

    /*Add Questionnaire */
    html += this.getQuestionnairePage();
    html += "<br><br>";

    html += this.getLastPage();
    html += `</div></div>`;
     console.log(html);
    const filename = 'testing';
    const landscape = false;
    this.pdfService.getPDF(html, filename, landscape).subscribe(res => {
      if (res.status === 'OK') {
        const element = document.createElement('a');
        element.href = Print.url + res.filePath;
        element.target = '_blank';
        element.setAttribute('download', res.filename);
        element.click();
      }
    });
   }

   getEmailTemplatePage(){
    let testDetails = `<div style="font-size: 14px; padding: 1rem;">`;
    testDetails += "<h4>"+this.translate.instant('MENTOREVALUATION.EMAILTEMPLATE.TITLE')+"</h4> <br>";
    let EmailTemplate = this.questionnaireForm.controls["message"].value;
    testDetails += "<h4>Email Template</h4> <br>";
    testDetails += EmailTemplate;
    testDetails += `</div>`;
    return testDetails;
   }

   getQuestionnairePage(){

    let testDetails = `<div style="font-size: 14px; padding: 1rem;">`;
    testDetails += "<h4>"+this.translate.instant('MENTOREVALUATION.QUESTIONNAIRE.TITLE')+"</h4> <br>";
    for (const key in this.selectedQuestionnaire.questions) {
      const value = this.selectedQuestionnaire.questions[key];
      testDetails += `<p>` + (Number(key) + 1) + ')  ' + value.question + `</p>`;
      if (value.answerType === 'SingleOption' || value.answerType === 'MultipleOptions') {
        testDetails += `<p><ul>`;
        for (const k in value.options) {
          testDetails += `<li>` + value.options[k] + `</li>`;
        }
        testDetails += `</ul></p>`;
      }
    }
    testDetails += `</div>`;
    return testDetails;

   }

   getLastPage() {
    let testDetails = `<div style="font-size: 14px; padding: 1rem;">` +
      `<h2>` + this.translate.instant('TEST.IDENTITY') + `</h2>` +
      `<p>` + this.translate.instant('TEST.TESTNAME') + ` : ` + this.test.name + `</p>` +
      `<p>` + this.translate.instant('TEST.TESTTYPE') + ` : ` + this.test.type + `</p>` +
      `<p>` + this.translate.instant('TEST.TESTDATE') + ` : ` + this.datepipe.transform(this.test.date , 'EEE d MMM, y') + `</p>` +
      `<p>` + this.translate.instant('TEST.DATETYPE') + ` : ` +
      this.translate.instant(this.test.dateType === 'fixed' ? 'FIXED' : 'LIMIT') + `</p>` +
      `<p>` + this.translate.instant('TEST.MAXSCORE') + ` : ` + this.test.maxScore + `</p>` +
      `<p>` + this.translate.instant('TEST.COEFFICIENT') + ` : ` + this.test.coefficient + `</p>` +
      `<p>` + this.translate.instant('TEST.CORRECTIONTYPE') + ` : ` + this.test.correctionType + `</p>` +
      `<p>` + this.translate.instant('TEST.ORGANISER') + ` : ` + this.test.organiser + `</p>` +
      `<h2>` + this.translate.instant('TEST.CALENDERSTEPS') + `</h2>`;


    if (this.test.calendar.steps.length > 0) {
      for (let i = 0; i < this.test.calendar.steps.length; i++) {
        let dateString = '';
        if (this.test.calendar.steps[i].date.type === 'fixed') {
          dateString = this.getPrintDate(this.test.calendar.steps[i].date['value']);
        } else {
          dateString = this.translate.instant(this.test.calendar.steps[i].date['before'] ? 'BEFORE' : 'AFTER') + ' ' +
            this.test.calendar.steps[i].date['days'] + ' ' + this.translate.instant('DAYS');
        }
        testDetails += `<p>` + (i + 1) + '.  ' + dateString + ' : ' + this.test.calendar.steps[i].text + `</p>`;
      }
    } else {
      testDetails += `<p>` + this.translate.instant('TEST.NOSTEPS') + `</p>`;
    }

    testDetails += `<h2>` + this.translate.instant('DOCUMENT.DOCUMENTS') + `</h2>`;

    if (this.test.documents.length > 0) {
      for (let i = 0; i < this.test.documents.length; i++) {
        testDetails += `<p>` + (i + 1) + '.  ' + this.getDocType(this.test.documents[i].type) + ' : ' +
          this.test.documents[i].name + `</p>`;
      }
    } else {
      testDetails += `<p>` + this.translate.instant('DOCUMENT.NODOCUMENTS') + `</p>`;
    }

    testDetails += `</div>`;
    return testDetails;
  }

  print(){
    console.log('Print');
  }


  /* Preview Test - start */
  showBottomGrid(index) {
    // console.log(this.pages, index);
    return (this.pages === index);
  }

  renderData() {
    const sections = this.test.correctionGrid.correction.sections;
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
    // console.log(this.pages);
  }

  getArrayExceptFirst() {
    return this.pageSectionsArray.slice(1);
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

  setNoOfStudents() {
    this.students =
      (this.test.correctionGrid.groupDetails && this.test.correctionGrid.groupDetails.noOfStudents) ?
        Array(this.test.correctionGrid.groupDetails.noOfStudents) :
        [];
  }

  getTitleWidth() {
    const correction = this.test.correctionGrid.correction;
    if (correction.commentArea) {
      if (correction.showDirectionsColumn) {
        if (correction.showLetterMarksColumn && correction.showNumberMarksColumn) {
          return '30%';
        } else {
          return '35%';
        }
      } else {
        return '35%';
      }
    } else {
      if (correction.showDirectionsColumn) {
        if (correction.showLetterMarksColumn && correction.showNumberMarksColumn) {
          return '35%';
        } else {
          return '40%';
        }
      } else {
        return '70%';
      }
    }
  }

  getDirectionWidth() {
    const correction = this.test.correctionGrid.correction;
    if (correction.commentArea) {
      return '30%';
    } else {
      return '40%';
    }
  }

  getMaxScore() {
    let a = 0;
    this.test.correctionGrid.correction.sections.forEach((section, index) => {
      a += section.maximumRating;
    });
    return a;
  }

  getMaxCustomScore() {
    return this.test.correctionGrid.correction.totalZone.additionalMaxScore;
  }

  editTest() {
    this.test.name = 'My test 1';
    this.testService.updateTest(this.test);
  }

  getDDMMYY() {
    const date = new Date();
    const yy = date.getFullYear().toString().substr(2, 2);
    const mm = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1); // getMonth() is zero-based
    const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const d = '' + dd + mm + yy;
    console.log(d);
    return d;
  }

  getPrintDate(d) {
    let date: any = new Date(d);
    let dd: any = date.getDate();
    let mm: any = date.getMonth() + 1; // January is 0!

    const yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    date = dd + '/' + mm + '/' + yyyy;
    return date;
  }


  getDocType(val) {
    return this.documentTypes.find((doc) => {
      return (doc.value === val);
    }).view;
  }
  expand() {
    this.expanded = !this.expanded;
    this.expandView.emit(this.expanded);
  }


  onSelectquestionnaire(result: any) {
    console.log("ketan");
    // if (result) {
    //   this.questionnaireservice.getquestionnaireById(result._id).subscribe(questionnaire => {
    //     this.dialogRef.close(questionnaire.data);
    //   });
    // }
  }
  changeQuestionnaireData(data){
  let mydata = data;
  this.questionairedata = [mydata];
  }
  /* Preview Test - end */
}
