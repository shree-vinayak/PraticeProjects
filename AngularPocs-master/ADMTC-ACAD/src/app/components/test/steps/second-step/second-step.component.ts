import { Component, OnInit, ViewChild } from '@angular/core';
import { MdCheckboxChange, MdDialog, MdDialogConfig, MdDialogRef, MdSlideToggleChange } from '@angular/material';
import { TextDialogComponent } from './dialogs/text-dialog/text-dialog.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Test } from '../../../../models/test.model';
import { TestService } from '../../../../services/test.service';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';

declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('SecondStepComponent');
log.color = 'green';

@Component({
  selector: 'app-second-step',
  templateUrl: './second-step.component.html',
  styleUrls: ['./second-step.component.scss']
})
export class SecondStepComponent implements OnInit {
  test = new Test();
  correctionGridSections: boolean[] = [];

  requiredFieldsTypes = [
    {
      value: 'eventName',
      view: 'Name of the Event',
      type: 'text',
      removed: false
    },
    {
      value: 'dateRange',
      view: 'Date Range',
      type: 'date',
      removed: false
    },
    {
      value: 'dateFixed',
      view: 'Date Fixed',
      type: 'date',
      removed: false
    },
    {
      value: 'titleName',
      view: 'Title Name',
      type: 'text',
      removed: false
    },
    {
      value: 'status',
      view: 'Status',
      type: 'text',
      removed: false
    }
  ];
  fieldTypes = [
    {
      value: 'date',
      view: 'Date'
    },
    {
      value: 'text',
      view: 'Text'
    },
    {
      value: 'number',
      view: 'Number'
    },
    {
      value: 'pfereferal',
      view: 'PFE Referal'
    },
    {
      value: 'jurymember',
      view: 'Jury Member'
    },
    {
      value: 'longtext',
      view: 'Long Text'
    },
    {
      value: 'signature',
      view: 'Signature'
    },
    {
      value: 'correctername',
      view: 'Corrector Name'
    },
    {
      value: 'mentorname',
      view: 'Mentor Name'
    }
  ];

  headerFields = [];
  footerFields = [];
  penaltyFields = [];
  bonusFields = [];

  config: MdDialogConfig = {
    disableClose: true
  };

  textDialog: MdDialogRef<TextDialogComponent>;

  sections: {
    title: string,
    maximumRating: number,
    subSections: {
      title: string,
      maximumRating: number
    }[]
  }[] = [
      {
        title: '',
        maximumRating: 0,
        subSections: [{
          title: '',
          maximumRating: 0
        }]
      }
    ];

  decimalPlacesValues = ['0', '1', '2'];
  decimalPlaces = '0';
  totalZoneScore = 0;
  showOptions = false;

  // form: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private dialog: MdDialog,
    private testService: TestService,
    private translate: TranslateService) {

    log.info('Constructor Invoked');
  }

  ngOnInit() {
    this.testService.getTest().subscribe((test) => {
      this.test = test;
      this.updateValidationOfSections(this.test.correctionGrid.correction.sections);
      this.populateFields();
    });
    // this.totalZoneScore = this.test.correctionGrid.correction.totalZone.decimalPlaces;
  }

  populateFields() {

    for (let f of this.requiredFieldsTypes) {
      f.removed = false;
    }
    this.headerFields = this.test.correctionGrid.header.fields.map(function (field, i) {
      // let required = false;
      const required = this.requiredFieldsTypes.find((f, index) => {
        if (f.value === field.type) {
          f.removed = true;
          // this.requiredFieldsTypes.splice(index, 1);
          return true;
        } else {
          return false;
        }
      });
      if (this.headerFields[i] && this.headerFields[i].editing) {
        return this.headerFields[i];
      } else {
        return Object.assign({ required: required, editing: false }, field);
      }
    }.bind(this));

    this.footerFields = this.test.correctionGrid.footer.fields.map(function (field, i) {
      // console.log(i, this.footerFields[i].editing);
      if (this.footerFields[i] && this.footerFields[i].editing) {
        return this.footerFields[i];
      } else {
        return Object.assign({ editing: false }, field);
      }
    }.bind(this));

    this.decimalPlaces = this.test.correctionGrid.correction.totalZone.decimalPlaces.toString();
    this.totalZoneScore = this.test.correctionGrid.correction.totalZone.additionalMaxScore;
    this.penaltyFields = this.test.correctionGrid.correction.penalties;
    this.bonusFields = this.test.correctionGrid.correction.bonuses;
  }

  getTextFromHtml(html: string) {
    const el = document.createElement('div');
    el.innerHTML = html;
    let data = el.textContent || el.innerText || '';
    data = data.replace(/\s+/g, ' ');
    // console.log(this.data);
    return data.length > 35 ? data.substr(0, 35) + '...' : data;
  }

  changeGroupHeaderText(event) {
    this.test.correctionGrid.groupDetails.headerText = event.target.value;
    this.testService.updateTest(this.test);
  }

  changeGroupNoOfStudents(event: any) {
    let val = event.target.value;
    if (+val <= 0) {
      val = 1;
      event.target.value = 1;
    }
    // console.log(val);
    this.test.correctionGrid.groupDetails.noOfStudents = +val;
    this.testService.updateTest(this.test);
  }

  toggleOrientation(event: MdSlideToggleChange) {
    this.test.correctionGrid.orientation = event.checked ? 'landscape' : 'portrait';
    this.testService.updateTest(this.test);
  }

  openTextDialog(forSection: string) {
    switch (forSection) {
      case 'top-header':
        this.textDialog = this.dialog.open(TextDialogComponent, this.config);
        this.textDialog.componentInstance.textValue = this.test.correctionGrid.header.text;
        this.textDialog.afterClosed().subscribe((result) => {
          this.test.correctionGrid.header.text = result || '';
          this.testService.updateTest(this.test);
          console.log(this.test.correctionGrid.header.text);
        });
        break;
      case 'footer-text':
        this.textDialog = this.dialog.open(TextDialogComponent, this.config);
        this.textDialog.componentInstance.textValue = this.test.correctionGrid.footer.text;
        this.textDialog.afterClosed().subscribe((result) => {
          this.test.correctionGrid.footer.text = result || '';
          this.testService.updateTest(this.test);
          console.log(this.test.correctionGrid.footer.text);
        });
        break;
      default:
        console.log("Error dialog not available");
    }
  }

  addHeaderField(field, index, required) {
    let hf = this.headerFields;
    let align = (hf.length === 0 || hf[hf.length - 1].dataType === 'longtext') ? 'left' : hf[hf.length - 1].align === 'left' ? 'right' : 'left';
    hf.push({
      required: required,
      editing: true,
      value: field.view,
      type: field.value,
      dataType: field.type,
      align: align
    });
    this.test.correctionGrid.header.fields.push({
      value: field.view,
      dataType: field.type,
      type: field.value,
      align: align
    });
    if (index !== -1) {
      this.requiredFieldsTypes[index].removed = true;
    }
    console.log(this.headerFields, this.requiredFieldsTypes);
    this.testService.updateTest(this.test);
  }

  removeHeaderField(index) {
    let field = this.headerFields[index];
    if (field.required === true) {
      let a = this.requiredFieldsTypes.find((f) => {
        return f.value === field.type
      });
      if (a) {
        a.removed = false;
      }
    }
    this.headerFields.splice(index, 1);
    console.log(this.headerFields, this.requiredFieldsTypes);
    this.test.correctionGrid.header.fields.splice(index, 1);
    this.testService.updateTest(this.test);
  }

  saveHeaderField(index) {
    let field = this.headerFields[index];
    if (field.value !== '') {
      field.editing = false;
      console.log(this.headerFields, this.requiredFieldsTypes);
      this.test.correctionGrid.header.fields[index] = {
        value: field.value,
        dataType: field.dataType,
        type: field.type,
        align: field.align
      };
      this.testService.updateTest(this.test);
    } else {
      swal({
        title:'Error!',
        text: 'Cannot create empty field',
        allowEscapeKey:true,
        type:'warning'
      });
    }
  }

  editHeaderField(index) {
    this.headerFields[index].editing = true;
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
    this.test.correctionGrid.footer.fields.push({
      value: field.view,
      dataType: field.type,
      type: field.value,
      align: align
    });
    this.testService.updateTest(this.test);
  }

  removeFooterField(index) {
    this.footerFields.splice(index, 1);
    this.test.correctionGrid.footer.fields.splice(index, 1);
    // this.test.correctionGrid.footer.fields.splice(index, 1);
    this.testService.updateTest(this.test);
  }

  saveFooterField(index) {
    const field = this.footerFields[index];
    if (field.value !== '') {
      field.editing = false;
      this.test.correctionGrid.footer.fields[index] = {
        value: field.value,
        dataType: field.dataType,
        type: field.type,
        align: field.align
      };
      this.testService.updateTest(this.test);
    } else {
      swal({
        title:'Error!',
        text:'Cannot create empty field',
        allowEscapeKey:true,
        type:'warning'
      });
    }
  }

  editFooterField(index) {
    this.footerFields[index].editing = true;
  }

  footerTextPositionChanged(event: MdCheckboxChange) {
    console.log(event);
    this.test.correctionGrid.footer.textBelow = event.checked;
    this.testService.updateTest(this.test);
  }

  changeTotalZoneDisplay(event: MdCheckboxChange) {
    console.log(event);
    this.test.correctionGrid.correction.displayFinalTotal = event.checked;
    this.testService.updateTest(this.test);
  }

  changeAdditionalTotalZoneDisplay(event: MdCheckboxChange) {
    console.log(event);
    this.test.correctionGrid.correction.totalZone.displayAdditionalTotal = event.checked;
    this.testService.updateTest(this.test);
  }

  updateTotalZone() {
    this.test.correctionGrid.correction.totalZone = {
      additionalMaxScore: this.totalZoneScore,
      displayAdditionalTotal: true,
      decimalPlaces: parseInt(this.decimalPlaces)
    };
    this.testService.updateTest(this.test);
  }

  changeView(event: MdCheckboxChange) {
    if (event.checked) {
      this.test.correctionGrid.correction.showAsList = true;
    } else {
      this.test.correctionGrid.correction.showAsList = false;
    }
    this.testService.updateTest(this.test);
  }

  changeNotationMarksView(event: MdCheckboxChange) {
    if (event.checked) {
      this.test.correctionGrid.correction.showNotationsMarks = true;
    } else {
      this.test.correctionGrid.correction.showNotationsMarks = false;
    }
    this.testService.updateTest(this.test);
  }

  changeFinalComments(event: MdCheckboxChange) {
    if (event.checked) {
      this.test.correctionGrid.correction.showFinalComments = true;
    } else {
      this.test.correctionGrid.correction.showFinalComments = false;
    }
    this.testService.updateTest(this.test);
  }

  toggleCommentArea(event: MdCheckboxChange) {
    console.log(event);
    this.test.correctionGrid.correction.commentArea = event.checked;
    this.testService.updateTest(this.test);
  }

  updateCommentArea(value) {
    console.log(value);
    this.test.correctionGrid.correction.commentsHeader = value;
    this.testService.updateTest(this.test);
    // this.test.correctionGrid.correction.commentsHeader = element.value;
    // this.testService.updateTest(this.test);
  }

  toggleDirectionsArea(event: MdCheckboxChange) {
    console.log(event);
    this.test.correctionGrid.correction.showDirectionsColumn = event.checked;
    this.testService.updateTest(this.test);
  }

  updateDirectionsArea(value) {
    console.log(value);
    this.test.correctionGrid.correction.directionsColumnHeader = value;
    this.testService.updateTest(this.test);
    // this.test.correctionGrid.correction.commentsHeader = element.value;
    // this.testService.updateTest(this.test);
  }

  toggleNumberMarksColumn(event: MdCheckboxChange) {
    console.log(event);
    this.test.correctionGrid.correction.showNumberMarksColumn = event.checked;
    this.testService.updateTest(this.test);
  }

  updateNumberMarksColumnHeader(value) {
    console.log(value);
    this.test.correctionGrid.correction.numberMarksColumnHeader = value;
    this.testService.updateTest(this.test);
    // this.test.correctionGrid.correction.commentsHeader = element.value;
    // this.testService.updateTest(this.test);
  }

  toggleLetterMarksColumn(event: MdCheckboxChange) {
    console.log(event);
    this.test.correctionGrid.correction.showLetterMarksColumn = event.checked;
    this.testService.updateTest(this.test);
  }

  updateLetterMarksColumnHeader(value) {
    console.log(value);
    this.test.correctionGrid.correction.letterMarksColumnHeader = value;
    this.testService.updateTest(this.test);
    // this.test.correctionGrid.correction.commentsHeader = element.value;
    // this.testService.updateTest(this.test);
  }

  updateFinalCommentArea(value) {
    console.log(value);
    this.test.correctionGrid.correction.finalCommentsHeader = value;
    this.testService.updateTest(this.test);
  }

  changeDecimalPlaces(event: MdCheckboxChange) {
    console.log(this.decimalPlaces);
    this.test.correctionGrid.correction.totalZone.decimalPlaces = parseInt(this.decimalPlaces);
    this.testService.updateTest(this.test);
  }

  addNewSection() {
    this.test.correctionGrid.correction.sections.push({
      title: '',
      maximumRating: 10,
      pageBreak: false,
      subSections: [{
        title: '',
        maximumRating: 10,
        direction: ''
      }]
    });
    const l = this.test.correctionGrid.correction.sections.length;
    this.testService.updateTest(this.test);
    this.updateValidationOfSections(this.test.correctionGrid.correction.sections);
    setTimeout(function () {
      const str = `section-${l - 1}`;
      const ele = document.getElementById(str);
      // ele.scrollIntoView({
      //   behavior: "smooth",
      //   block: "start",
      // });
      // window.scrollTo(0, ele.offsetTop);
    }.bind(this), 500);
  }

  addSubSection(index: number) {
    const sections = this.test.correctionGrid.correction.sections;
    let total = 0;
    const maxrating = sections[index].maximumRating;
    for (const subsection of sections[index].subSections) {
      total += subsection.maximumRating;
    }
    if (total < maxrating) {
      sections[index].subSections.push({
        title: '',
        maximumRating: (maxrating - total),
        direction: ''
      });
      this.testService.updateTest(this.test);
      this.updateValidationOfSections(this.test.correctionGrid.correction.sections);
    } else {
      swal({
        title: 'Error!',
        text: this.translate.instant('TEST.ERRORS.CANNOTADDMORENOTATION'),
        allowEscapeKey: true,
        type: 'warning'
      });
    }


  }

  editSectionTitle(index: number) {
    const section = this.test.correctionGrid.correction.sections[index];
    this.textDialog = this.dialog.open(TextDialogComponent, this.config);
    this.textDialog.componentInstance.textValue = section.title;
    this.textDialog.afterClosed().subscribe((result) => {
      section.title = result || '';
      this.testService.updateTest(this.test);
      this.updateValidationOfSections(this.test.correctionGrid.correction.sections);
    });
  }

  editSubSectionTitle(secIndex: number, subSecIndex: number) {
    const subSection = this.test.correctionGrid.correction.sections[secIndex].subSections[subSecIndex];
    this.textDialog = this.dialog.open(TextDialogComponent, this.config);
    this.textDialog.componentInstance.textValue = subSection.title;
    this.textDialog.afterClosed().subscribe((result) => {
      subSection.title = result || '';
      this.testService.updateTest(this.test);
      this.updateValidationOfSections(this.test.correctionGrid.correction.sections);
    });
  }

  editSubSectionDirection(secIndex: number, subSecIndex: number) {
    const subSection = this.test.correctionGrid.correction.sections[secIndex].subSections[subSecIndex];
    this.textDialog = this.dialog.open(TextDialogComponent, this.config);
    this.textDialog.componentInstance.textValue = subSection.direction;
    this.textDialog.afterClosed().subscribe((result) => {
      subSection.direction = result || '';
      this.testService.updateTest(this.test);
    });
  }

  editSectionTotal(index: number, event: Event) {
    // console.log(index, );
    const section = this.test.correctionGrid.correction.sections[index];
    let total = 0;
    for (const subsection of section.subSections) {
      total += subsection.maximumRating;
    }
    if (+(event.target['value']) >= 0 && total <= +(event.target['value'])) {
      section.maximumRating = +(event.target['value']);
      this.testService.updateTest(this.test);
      this.updateValidationOfSections(this.test.correctionGrid.correction.sections);
    } else {
      event.target['value'] = section.maximumRating;
      swal({
        title: 'Error!',
        text: 'Cannot save section, Max Score exceeded for notations.',
        allowEscapeKey: true,
        type: 'warning'
      });
    }
  }

  updateValidationOfSections(sections) {
    sections.forEach((s, index) => {
      let ssRating = 0;
      s.subSections.forEach(ss => {
        ssRating += ss.maximumRating;
      });
      ssRating === s.maximumRating
        ? (this.correctionGridSections[index] = true)
        : (this.correctionGridSections[index] = false);
    });
    console.log(this.correctionGridSections);
  }

  editNotationTotal(secIndex: number, subSecIndex: number, event: Event) {
    const section = this.test.correctionGrid.correction.sections[secIndex];
    const subSection = section.subSections[subSecIndex];
    let total = 0;
    for (const subsection of section.subSections) {
      total += subsection.maximumRating;
    }
    total = total - subSection.maximumRating + +(event.target['value']);
    if (section.maximumRating >= 0 && total <= section.maximumRating) {
      subSection.maximumRating = +(event.target['value']);
      this.testService.updateTest(this.test);
      this.updateValidationOfSections(this.test.correctionGrid.correction.sections);
    } else {
      event.target['value'] = subSection.maximumRating;
      swal({
        title: 'Error!',
        text: 'Cannot save notation, Max Score exceeded for notations.',
        allowEscapeKey: true,
        type: 'warning'
      });
    }
  }

  saveSection(index: number) {
    const section = this.test.correctionGrid.correction.sections[index];
    let total = 0;
    let detailsError = false;
    for (const subsection of section.subSections) {
      total += subsection.maximumRating;
      if (subsection.title === '') {
        detailsError = true;
      }
    }
    if (section.title !== '' && !detailsError) {
      if (section.maximumRating >= 0 && total <= section.maximumRating) {
        this.testService.updateTest(this.test);
      } else {
        swal({
          title: 'Error!',
          text: 'Cannot save section, Max Score exceeded for notations.',
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    } else {
      swal({
        title: 'Error!',
        text: 'Please fill all details.',
        allowEscapeKey: true,
        type: 'warning'
      });
    }
  }

  removeSection(index: number) {
    // this.sections.splice(index, 1);
    swal({
      title: 'Attention',
      text: this.translate.instant('TEST.MESSAGES.CONFIRMREMOVESECTION'),
      type: 'question',
      showCancelButton: true,
      allowEscapeKey: true,
      cancelButtonText: this.translate.instant('NO'),
      confirmButtonText: this.translate.instant('YES')
    }).then(() => {
      this.test.correctionGrid.correction.sections.splice(index, 1);
      this.testService.updateTest(this.test);
      this.updateValidationOfSections(this.test.correctionGrid.correction.sections);
    }, function (dismiss) {
      if (dismiss === 'cancel') {
      }
    });
  }

  removeSubSection(sectionIndex: number, subSectionIndex: number) {
    // this.sections.splice(index, 1);
    swal({
      title: 'Attention',
      text: this.translate.instant('TEST.MESSAGES.CONFIRMREMOVESUBSECTION'),
      type: 'question',
      showCancelButton: true,
      allowEscapeKey: true,
      cancelButtonText: this.translate.instant('NO'),
      confirmButtonText: this.translate.instant('YES')
    }).then(() => {
      this.test.correctionGrid.correction.sections[sectionIndex].subSections.splice(subSectionIndex, 1);
      this.testService.updateTest(this.test);
      this.updateValidationOfSections(this.test.correctionGrid.correction.sections);
    }, function (dismiss) {
      if (dismiss === 'cancel') {
      }
    });
  }

  addPageBreak(index: number) {
    this.test.correctionGrid.correction.sections[index].pageBreak = true;
    this.testService.updateTest(this.test);
  }

  removePageBreak(index: number) {
    this.test.correctionGrid.correction.sections[index].pageBreak = false;
    this.testService.updateTest(this.test);
  }

  changePenaltyDisplay(event: MdCheckboxChange) {
    this.test.correctionGrid.correction.showPenalties = event.checked;
    this.testService.updateTest(this.test);
  }

  updatePenaltiesHeader(value) {
    this.test.correctionGrid.correction.penaltiesHeader = value;
    this.testService.updateTest(this.test);
  }

  changeEliminationDisplay(event: MdCheckboxChange) {
    this.test.correctionGrid.correction.showEliminations = event.checked;
    this.testService.updateTest(this.test);
  }

  addPenalty() {
    const pf = this.penaltyFields;
    pf.push({
      title: '',
      count: 1,
      editing: true
    });
  }

  savePenaltyField(index: number) {
    const field = this.penaltyFields[index];
    if (field.title !== '') {
      if (field.count > 0) {
        field.editing = false;
        this.test.correctionGrid.correction.penalties = this.penaltyFields.map((field) => {
          return {
            title: field.title,
            count: field.count
          };
        });
        this.testService.updateTest(this.test);
      } else {
        swal({
          title: 'Error!',
          text: 'Value must be positive.',
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    } else {
      swal({
        title: 'Error!',
        text: 'Cannot create empty field',
        allowEscapeKey: true,
        type: 'warning'
      });
    }
  }

  editPenaltyField(index: number) {
    this.penaltyFields[index].editing = true;
  }

  removePenaltyField(index: number) {
    this.penaltyFields.splice(index, 1);
    this.test.correctionGrid.correction.penalties = this.penaltyFields.map((field) => {
      return {
        title: field.title,
        count: field.count
      };
    });
    this.testService.updateTest(this.test);
  }

  changeBonusDisplay(event: MdCheckboxChange) {
    this.test.correctionGrid.correction.showBonuses = event.checked;
    this.testService.updateTest(this.test);
  }

  updateBonusesHeader(value) {
    this.test.correctionGrid.correction.bonusesHeader = value;
    this.testService.updateTest(this.test);
  }

  addBonus() {
    const bf = this.bonusFields;
    bf.push({
      title: '',
      count: 1,
      editing: true
    });
  }

  saveBonusField(index: number) {
    const field = this.bonusFields[index];
    if (field.title !== '') {
      if (field.count > 0) {
        field.editing = false;
        this.test.correctionGrid.correction.bonuses = this.bonusFields.map((field) => {
          return {
            title: field.title,
            count: field.count
          };
        });
        this.testService.updateTest(this.test);
      } else {
        swal({
          title: 'Error!',
          text: 'Value must be positive.',
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    } else {
      swal({
        title: 'Error!',
        allowEscapeKey: true,
        text: 'Cannot create empty field',
        type: 'warning'
      });
    }
  }

  editBonusField(index: number) {
    this.bonusFields[index].editing = true;
  }

  removeBonusField(index: number) {
    this.bonusFields.splice(index, 1);
    this.test.correctionGrid.correction.bonuses = this.bonusFields.map((field) => {
      return {
        title: field.title,
        count: field.count
      };
    });
    this.testService.updateTest(this.test);
  }

  goToNextStep() {
    console.log('NextStep');
    this.testService.updateTest(this.test);
    this.router.navigate(['create-test', 'third']).then(() => {
      console.log('Navigated');
    }, () => {
      console.log('Error Navigating');

    });
  }

  goToPreviousStep() {
    // this.testService.updateTest(this.test);
    this.router.navigateByUrl('/create-test/first');
  }
}
