import { TestService } from '../../../services/test.service';
import { DatePipe } from '@angular/common';
import {
  AfterViewChecked,
  Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer,
} from '@angular/core';
import { Test } from '../../../models/test.model';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { TranslateService } from 'ng2-translate';
import { PDFService } from '../../../services/pdf.service';
import { PRINTSTYLES, STYLES } from './styles';
import { Print } from '../../../shared/global-urls';
import { ViewChild } from '@angular/core';
import { UserService } from '../../../services/users.service';
import * as moment from 'moment';

declare var jsPDF: any;
declare var html2canvas: any;

@Component({
  selector: 'app-test-document',
  templateUrl: './test-document.component.html',
  styleUrls: ['./test-document.component.scss'],
  // styles: [STYLES],
  providers: [DatePipe]
})
export class TestDocumentComponent implements OnInit, AfterViewChecked {
  @Output() expandView: EventEmitter<boolean> = new EventEmitter();
  test = new Test();
  @Input() expanded;
  rncpTitle;
  datePipe: DatePipe;
  userTypes = [];
  // @ViewChild('expectedDocuments') elEx: ElementRef;
  @ViewChild('document') el: ElementRef;
  @ViewChild('pagesElement') documentPagesRef: ElementRef;
  @ViewChild('docRender') elRend: ElementRef;
  @ViewChild('documentLink') docLink: ElementRef;
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
  students: number[] = [];

  pages: number;
  pageSectionsArray: any[] = [];
  visiblePage = 1;
  docFooterText = '';
  scholarSeason = '';
  dt = new Date();
  currentYear = this.dt.getFullYear();
  nextYear = this.dt.getFullYear() + 1;

  constructor(private testService: TestService,
    private appService: RNCPTitlesService,
    private renderer: Renderer,
    private translate: TranslateService,
    private pdfService: PDFService,
    private userservice: UserService,
    public datepipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.datePipe = new DatePipe(this.translate.currentLang);
    this.appService.getSelectedRncpTitle().subscribe((title) => {
      if(title){
        this.rncpTitle = title;
      }
    });

    this.appService.getSelectedScholarSeason(this.rncpTitle._id).subscribe((season) => {
      if (season.length !== 0) {
        this.scholarSeason = season[0].scholarseason;
      }
    });


    this.testService.getTest().subscribe((test) => {
      if (!test.correctionGrid.orientation) {
        test.correctionGrid.orientation = 'portrait';
      }
      this.test = test;
      console.log(test);
      this.docFooterText = 'ADMTC – ' + this.translate.instant('TEST.EVALUATIONGRID') + ' ' + test.name + ' – ' + this.rncpTitle.shortName + ' – ' + this.currentYear + ' / ' + this.nextYear;
      this.setNoOfStudents();

      this.renderData();
    });
    this.userservice.getUserTypesByEntities('academic')
      .subscribe(
      (response) => {
        this.userTypes = response.data;
        console.log(this.userTypes);
      }
      );
  }

  ngAfterViewChecked() {
    // console.log("View chnged");
  }

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
    let penalty = 0;
    let bonus = 0;
    if (this.test.type === 'free-continuous-control') {
      a = 20;
    } else {
        this.test.correctionGrid.correction.sections.forEach((section, index) => {
          a += section.maximumRating;
        });

    }
    // if (a > 100) {
    //   a = 100;
    // }
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

  getLastPage() {
    let testDetails = `<div style="font-size: 14px; padding: 1rem;">` +
      `<h2>` + this.translate.instant('TEST.IDENTITY') + `</h2>` +
      `<p>` + this.translate.instant('TEST.TESTNAME') + ` : ` + this.test.name + `</p>` +
      `<p>` + this.translate.instant('TEST.TESTTYPE') + ` : ` + this.translate.instant('PARAMETERS-RNCP.TEST.TYPE.' + this.test.type) + `</p>` +
      `<p>` + this.translate.instant('TEST.TESTDATE') + ` : ` + this.getTranslatedDate(this.test.date) + `</p>` +
      `<p>` + this.translate.instant('TEST.DATETYPE') + ` : ` +
      this.translate.instant('TEST.DATETYPES.' + this.test.dateType.toUpperCase()) + `</p>` +
      // `<p>` + this.translate.instant('TEST.MAXSCORE') + ` : ` + this.test.maxScore + `</p>` +
      `<p>` + this.translate.instant('TEST.COEFFICIENT') + ` : ` + this.test.coefficient + `</p>` +
      `<p>` + this.translate.instant('TEST.CORRECTIONTYPE') + ` : ` + this.translate.instant('TEST.CORRECTIONTYPES.' + this.test.correctionType.toUpperCase()) + `</p>` +
      //  `<p>` + this.translate.instant('TEST.ORGANISER') + ` : ` + this.test.organiser + `</p>` +
      `<h2>` + this.translate.instant('TEST.CALENDERSTEPS') + `</h2>`;


    if (this.test.calendar.steps.length > 0) {
      for (let i = 0; i < this.test.calendar.steps.length; i++) {
        let dateString = '';
        if (this.test.calendar.steps[i].date.type === 'fixed') {
          dateString = this.getTranslatedDate(this.test.calendar.steps[i].date['value']);
        } else {
          dateString = this.translate.instant(this.test.calendar.steps[i].date['before'] ? 'BEFORE' : 'AFTER') + ' ' +
            this.test.calendar.steps[i].date['days'] + ' ' + this.translate.instant('DAYS');
        }
        testDetails += `<p>` + (i + 1) + '.  ' + this.getTranslateWhat(this.test.calendar.steps[i].text) + ' : ' + dateString + `</p>`;
      }
    } else {
      testDetails += `<p>` + this.translate.instant('TEST.NOSTEPS') + `</p>`;
    }

    testDetails += `<h2>` + this.translate.instant('DOCUMENT.DOCUMENTS') + `</h2>`;

    if (this.test.documents.length > 0) {
      for (let i = 0; i < this.test.documents.length; i++) {
        let dateString = '';
        if (this.test.documents[i].publicationDate.type === 'fixed') {
          dateString = this.getTranslatedDate(this.test.documents[i].publicationDate['publicationDate']);
        } else {
          dateString = this.translate.instant(this.test.documents[i].publicationDate['before'] ? 'BEFORE' : 'AFTER') + ' ' +
            this.test.documents[i].publicationDate['days'] + ' ' + this.translate.instant('DAYS');
        }
        //  doc.text(20, y = y + 24, (i + 1) + '.  ' + this.getDocType(this.test.documents[i].type) + ' : ' + this.test.documents[i].name);
        testDetails += `<p>` + (i + 1) + '.  ' + this.test.documents[i].name + ' : ' + this.translate.instant('DOCUMENTTYPES.' + this.test.documents[i].type.toUpperCase()) + ' : ' + dateString + `</p>`;
      }
    } else {
      testDetails += `<p>` + this.translate.instant('DOCUMENT.NODOCUMENTS') + `</p>`;
    }

    testDetails += `<h2>` + this.translate.instant('TEST.DOCUMENTSEXPECTED') + `</h2>`;

    if (this.test.expectedDocuments.length > 0) {
      for (let i = 0; i < this.test.expectedDocuments.length; i++) {
        let dateString = '';
        if (this.test.expectedDocuments[i].deadlineDate.type === 'fixed') {
          dateString = this.getTranslatedDate(this.test.expectedDocuments[i].deadlineDate['deadline']);
        } else {
          dateString = this.translate.instant(this.test.expectedDocuments[i].deadlineDate['before'] ? 'BEFORE' : 'AFTER') + ' ' +
            this.test.expectedDocuments[i].deadlineDate['days'] + ' ' + this.translate.instant('DAYS');
        }
        //  doc.text(20, y = y + 24, (i + 1) + '.  ' + this.getDocType(this.test.documents[i].type) + ' : ' + this.test.documents[i].name);
        testDetails += `<p>` + (i + 1) + '.  ' + this.test.expectedDocuments[i].documentName + ' : ' + dateString + `</p>`;
      }
    } else {
      testDetails += `<p>` + this.translate.instant('EXPECTEDDOCUMENT.NODOCUMENTS') + `</p>`;
    }
    testDetails += `</div>`;
    // testDetails += `<div *ngIf="docFooterText" style="text-align: center !important; position: fixed !important; bottom: 10px !important;">` + 'ADMTC – ' + this.translate.instant('TEST.EVALUATIONGRID') + ' ' + this.test.name + ' – ' + this.rncpTitle.shortName +
    //   ' – ' + (this.scholarSeason !== null ? this.scholarSeason : '') + `</div>`;
    return testDetails;
  }

  getDocumentUserType(documentUserType: string) {
    for (const element of this.userTypes) {
      if (element._id === documentUserType) {
        return element.name;
      }
    }
  }

  downloadPDF() {
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
    html += `</div></div>`;
    html += this.getLastPage();
    // html += `<div *ngIf="docFooterText" style="text-align: center !important; position: fixed !important; bottom: 10px !important; font-size: 12px; !important">` + 'ADMTC – ' + this.translate.instant('TEST.EVALUATIONGRID') + ' ' + this.test.name + ' – ' + this.rncpTitle.shortName +
    //   ' – ' + (this.scholarSeason !== null ? this.scholarSeason : '') + `</div>`;
    // console.log(html);
    const filename = this.rncpTitle.shortName + '_' + this.test.name;
    const landscape = this.test.correctionGrid.orientation === 'landscape' ? true : false;
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

  downloadPDF_old() {
    const l = 842, b = 595;
    const orientation = this.test.correctionGrid.orientation === 'landscape' ? 'l' : 'p';
    const sizeArray = this.test.correctionGrid.orientation === 'landscape' ? [l * 2, b * 2] : [b * 2, l * 2];
    // document.getElementsByTagName('body')[0].style.height = '70in';
    // document.getElementsByTagName('body')[0].style.width = '20in';
    const doc = new jsPDF(orientation, 'pt', sizeArray);

    const e = this.documentPagesRef.nativeElement.children[0];
    const rect = e.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'pt';
    canvas.style.height = rect.height + 'pt';
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.translate(-rect.left, -rect.top);


    console.log(this.documentPagesRef.nativeElement);
    for (let size = 0; size < this.pages; size++) {
      doc.addPage();
    }
    // this.visiblePage = 1;
    for (let i = 0; i < this.documentPagesRef.nativeElement.children.length; i++) {
      this.documentPagesRef.nativeElement.children[i].setAttribute('style', 'display: none');
    }
    // this.documentPagesRef.nativeElement.children[0].setAttribute('style', 'display: block');

    this.print(doc, 1, canvas);

  }

  print(doc: any, index: number, cnv: any) {
    if (index >= 2) {
      this.documentPagesRef.nativeElement.children[index - 2].setAttribute('style', 'display: none');
    }
    this.documentPagesRef.nativeElement.children[index - 1].setAttribute('style', 'display: block');
    const e = this.documentPagesRef.nativeElement.children[index - 1];
    const rect = e.getBoundingClientRect();
    console.log('Print page', index);
    const ctx = cnv.getContext('2d');
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    html2canvas(e.children[0], {
      canvas: cnv,
      letterRendering: true,
      width: rect.width,
      height: rect.height,
      onrendered: function (canvas: any) {
        doc.setPage(index);
        const data = canvas.toDataURL('image/png');
        doc.addImage(data, 'PNG', 0, 0);
        if (index === this.pages) {
          this.printDoc(doc);
        } else {
          const i = +index + 1;
          this.print(doc, i, cnv);
        }
      }.bind(this)
    });
  }

  printDoc(doc) {
    document.getElementsByTagName('body')[0].style.height = 'auto';
    document.getElementsByTagName('body')[0].style.width = 'auto';


    doc.setPage(this.pages + 1);
    let y = 70;
    doc.setFontSize(28);
    doc.text(20, y, this.translate.instant('TEST.IDENTITY'));
    doc.setFontSize(18);
    doc.text(20, y = y + 30, this.translate.instant('TEST.TESTNAME') + ' : ' + this.test.name);
    doc.text(20, y = y + 24, this.translate.instant('TEST.TESTTYPE') + ' : ' + this.translate.instant('PARAMETERS-RNCP.TEST.TYPE.' + this.test.type));

    doc.text(20, y = y + 24, 'Test ' + this.translate.instant('TEST.TESTDATE') + ' : ' + this.getTranslatedDate(this.test.date));
    doc.text(20, y = y + 24, this.translate.instant('TEST.DATETYPE') + ' : ' +
      this.translate.instant('TEST.DATETYPES.' + this.test.dateType.toUpperCase()));
    // doc.text(20, y = y + 24, this.translate.instant('TEST.MAXSCORE') + ' : ' + this.test.maxScore);
    doc.text(20, y = y + 24, this.translate.instant('TEST.COEFFICIENT') + ' : ' + this.test.coefficient);
    doc.text(20, y = y + 24, this.translate.instant('TEST.CORRECTIONTYPE') + ' : ' + this.translate.instant('TEST.CORRECTIONTYPES.' + this.test.correctionType.toUpperCase()));
    //  doc.text(20, y = y + 24, this.translate.instant('TEST.ORGANISER') + ' : ' + this.test.organiser);

    doc.setFontSize(28);
    doc.text(20, y = y + 60, this.translate.instant('TEST.CALENDERSTEPS'));
    doc.setFontSize(18);
    y = y + 6;
    if (this.test.calendar.steps.length > 0) {
      for (let i = 0; i < this.test.calendar.steps.length; i++) {
        let dateString = '';
        if (this.test.calendar.steps[i].date.type === 'fixed') {
          dateString = this.getTranslatedDate(this.test.calendar.steps[i].date['value']);
        } else {
          dateString = this.translate.instant(this.test.calendar.steps[i].date['before'] ? 'BEFORE' : 'AFTER') + ' ' +
            this.test.calendar.steps[i].date['days'] + ' ' + this.translate.instant('DAYS');
        }
        doc.text(20, y = y + 24, (i + 1) + '.  ' + this.getTranslateWhat(this.test.calendar.steps[i].text) + ' : ' + dateString);
      }
    } else {
      doc.text(20, y = y + 24, this.translate.instant('TEST.NOSTEPS'));
    }
    doc.setFontSize(28);
    doc.text(20, y = y + 60, this.translate.instant('DOCUMENT.DOCUMENTS'));
    doc.setFontSize(18);
    y = y + 6;
    if (this.test.documents.length > 0) {
      for (let i = 0; i < this.test.documents.length; i++) {
        let dateString = '';
        if (this.test.documents[i].publicationDate.type === 'fixed') {
          dateString = this.getTranslatedDate(this.test.documents[i].publicationDate['publicationDate']);
        } else {
          dateString = this.translate.instant(this.test.documents[i].publicationDate['before'] ? 'BEFORE' : 'AFTER') + ' ' +
            this.test.documents[i].publicationDate['days'] + ' ' + this.translate.instant('DAYS');
        }
        doc.text(20, y = y + 24, (i + 1) + '.  ' + this.test.documents[i].name + ' : ' + ' : ' + this.translate.instant('DOCUMENTTYPES.' + this.test.documents[i].type.toUpperCase()) + dateString);
      }
    } else {
      doc.text(20, y = y + 24, this.translate.instant('DOCUMENT.NODOCUMENTS'));
    }

    doc.setFontSize(28);
    doc.text(20, y = y + 60, this.translate.instant('TEST.DOCUMENTSEXPECTED'));
    doc.setFontSize(18);
    y = y + 6;
    if (this.test.expectedDocuments.length > 0) {
      for (let i = 0; i < this.test.expectedDocuments.length; i++) {
        let dateString = '';
        if (this.test.expectedDocuments[i].deadlineDate.type === 'fixed') {
          dateString = this.getTranslatedDate(this.test.expectedDocuments[i].deadlineDate['deadline']);
        } else {
          dateString = this.translate.instant(this.test.expectedDocuments[i].deadlineDate['before'] ? 'BEFORE' : 'AFTER') + ' ' +
            this.test.expectedDocuments[i].deadlineDate['days'] + ' ' + this.translate.instant('DAYS');
        }
        doc.text(20, y = y + 24, (i + 1) + '.  ' + this.test.expectedDocuments[i].documentName + ' : ' + dateString);
      }
    } else {
      doc.text(20, y = y + 24, this.translate.instant('EXPECTEDDOCUMENT.NODOCUMENTS'));
    }
    doc.save(this.rncpTitle.shortName + '_' + this.test.name + '_' + this.getDDMMYY() + '.pdf');
    // let link = document.createElement('a');
    // link.setAttribute('target', '_blank');
    // link.setAttribute('href', doc.output('datauristring'));
    // link.click();
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

  getTranslateWhat(name) {
    if (name) {
      const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
      return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
    } else {
      return '';
    }
  }

  getTranslateADMTCSTAFFKEY(name) {
    // console.log(name);
    if (name) {
      const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
      return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
    }
  }

  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    return this.datePipe.transform(date, 'EEE d MMM, y');
  }

  getLocalDate(date) {
    if (this.translate.currentLang.toLowerCase() === 'en') {
      return moment(date).format('MM/DD/YYYY');
    }
    return moment(date).format('DD/MM/YYYY');
  }
}
