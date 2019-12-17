
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import _ from 'lodash';
import { Category } from '../../../models/category.model';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { TestCorrection } from '../../../models/correction.model';
import { TestCorrectionService } from '../../../services/test-correction.service';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { UserService } from '../../../services/users.service';
import { FormConfirmationComponent } from '../../../dialogs/form-confimation-dialog/form-confimation-dialog.component';
import { MdDialogConfig, MdDialog, MdDialogRef, MdSelect } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { PDFService } from '../../../services/pdf.service';
import { Print } from '../../../shared/global-urls';
import { TestService } from '../../../services/test.service';


declare var swal: any;

@Component({
selector: 'app-questionnaire-answer-corrections',
templateUrl: './questionnaire-answer-corrections.component.html',
styleUrls: ['./questionnaire-answer-corrections.component.scss'],
})

export class QuestionnaireAnswerCorrectionsComponent implements OnInit {
correction;
page = new Page();
sort = new Sort();
students: any[] = [];
searchedStudents: any[] = [];
selectedIndex: number;
StudentList;
filterStudentList;
SearchStudent;
currentLoginUser: any = "";
selectedRncpTitle: any;
formConfirmValue: string = "";
oldStudentValue: string = "";
oldStudentName: string = "";
isMissingCopy: boolean = false
configDoc: MdDialogConfig = {
  disableClose: true,
  width: '600px',
  height: '80%',
  position: {
    top: '',
    bottom: '',
    left: '',
    right: ''
  }
};

// OnChanges Implement Methods


formConfigmDoc: MdDialogConfig = {
  disableClose: true,
  width: '500px',
  height: '',
  position: {
    top: '',
    bottom: '',
    left: '',
    right: ''
  }
};
selectedStudentArray = [];

public testCorrection = new TestCorrection();
reorderable = true;
ngxDtCssClasses = {
  sortAscending: 'fa fa-caret-up',
  sortDescending: 'fa fa-caret-down',
  pagerLeftArrow: 'icon-left',
  pagerRightArrow: 'icon-right',
  pagerPrevious: 'icon-prev',
  pagerNext: 'icon-skip'
};
testDetails;
public form: FormGroup;
listServiceFeature = [];
private totalMarks = [];
testCorrect;
private today;
private currentSchoolYear;
rncpTitle;
schoolId: string = '';

formConfirmationComponent: MdDialogRef<FormConfirmationComponent>;

selectedStudent = null;
selectedTestId = null;
updatingCorrection = false;

studentSelect: any;

constructor(private testCorrectionService: TestCorrectionService,
            private testService: TestService,
            private fb: FormBuilder,
            private router: ActivatedRoute,
            private routes: Router,
            private dialog: MdDialog,
            private translate: TranslateService,
            private appService: RNCPTitlesService,
            private service: UserService,
            private pdfService: PDFService,
            public dialogref: MdDialogRef<QuestionnaireAnswerCorrectionsComponent>,) {
  //let id: number = this.router.params['id'];
  let student;
  let test = {};
  this.router.params.subscribe(params => {
    student = params['id'];
    //debugger;
    //test = params['testId'];
  });

  test['student'] = [null, Validators.required];
  this.form = this.fb.group(test);

  this.testCorrect = new TestCorrection();

}


filteredStudents: Observable<any[]>;

filter(val: any): any[] {
  console.log("val");
  console.log(val);
  const students = this.students.filter(std => {
    return std.correctedTests ? false : true;
  });

  console.log("students");
  console.log(students);
  return val.length >= 3 ? students.filter(option =>
    (option.lastName + " " + option.firstName).toLocaleLowerCase().includes(val.trim().toLowerCase())) : students;

  //option.firstName.toLowerCase().contains(val.toLowerCase()) || option.lastName.toLowerCase().contains(val.toLowerCase())) : this.options;
}

//test(e) {

//}


ngOnInit() {
  this.testCorrectionService.resetCorrectionData();

  this.currentLoginUser = this.service.getCurrentUserInfo();
  let selectedTestId = this.testCorrectionService.getSelectedTest();
  this.selectedTestId = selectedTestId;
  if (!selectedTestId) {
    this.routes.navigate(['rncp-titles']);
  } else if (typeof selectedTestId == 'function') {
    this.routes.navigate(['rncp-titles']);
  } else {
    this.testCorrectionService.getTest(selectedTestId).subscribe((value) => {
      this.testDetails = value;
      let rncpTitle;
      this.rncpTitle = this.selectedRncpTitle.longName;
      rncpTitle = this.selectedRncpTitle.longName;

      if (this.testDetails.class != undefined && this.testDetails.class != null) {
        this.testCorrectionService.getStudentForTestCorrection(selectedTestId, this.schoolId).subscribe((data) => {
          this.students = data;
          console.log("students");
          console.log(this.students);
          this.searchedStudents = data;
          this.filteredStudents = Observable.create(observer => {
            observer.next(this.students.filter(std => {
              return std.correctedTests ? false : true;
            }));

          });


          this.selectedStudent = this.students[0]._id;
          this.selectedStudentArray = [this.students[0]];
          this.ChangeStudent({ value: this.selectedStudent });
        });
      }
    });
  }
}

downloadPDF() {
  const ele = document.getElementById("pdfdoc");
  const html = ele.innerHTML;
  ele.style.visibility = "hidden";
  ele.innerHTML = html;
  ele.className = "apple";
  console.log(this.testCorrection);
  //debugger;
  const filename = "test.pdf";
  const landscape = false;
  this.pdfService.getPDF(html, filename, landscape, true).subscribe(res => {
    if (res.status === 'OK') {
      const element = document.createElement('a');
      element.href = Print.url + res.filePath;
      element.target = '_blank';
      element.setAttribute('download', res.filename);
      element.click();
    }
  });
}

loadStudentCorrections(correction: any, studentId) {
  if (correction != null) {
    this.updatingCorrection = true;

    this.today = new Date();
    let nextYear = Number(new Date().getFullYear()) + 1;
    this.currentSchoolYear = new Date().getFullYear() + '-' + nextYear;
    let test = {};
    let header = [];
    let footer = [];
    let sections = [];
    let testCorrect = correction;
    let rncpTitle;
    rncpTitle = this.rncpTitle;

    _.forEach(correction.correctionGrid.header.fields, function (val, key) {
      test['header' + key] = [val.value, Validators.required];
    });

    //footer
    _.forEach(correction.correctionGrid.footer.fields, function (val, key) {
      test['footer' + key] = [val.value, Validators.required];
    });

    //total
    _.forEach(correction.correctionGrid.correction.sections, (val, key) => {
      test['total' + key] = [val.rating, Validators.required];
      test['comment' + key] = [val.comments];
      _.forEach(val.subSections, (v, k) => {
        test['subSection-' + key + '-' + k] = [v.rating, Validators.required];
        this.listServiceFeature[key + '_' + k] = v.rating;
      });
    });

    //Comment
    _.forEach(correction.correctionGrid.correction.sections, function (val, key) {
      _.forEach(val.subSections, function (v, k) {
        test['comment-' + key + '-' + k] = [v.comments];
      });
    });
    // test['student'] = [studentId, Validators.required];
    this.testCorrect = testCorrect;
    console.log('Existing Correction :', this.testCorrect);

    //test['student'] = [null, Validators.required];
    this.form = this.fb.group(test);
    this.subscribeFormChanges();
  }
  else {
    this.updatingCorrection = false;

    this.today = new Date();
    let nextYear = Number(new Date().getFullYear()) + 1;
    this.currentSchoolYear = new Date().getFullYear() + '-' + nextYear;
    // this.StudentList = this.testCorrectionService.getStudent();
    // this.filterStudentList = this.StudentList;
    let rncpTitle;
    this.rncpTitle = this.selectedRncpTitle.longName;
    rncpTitle = this.selectedRncpTitle.longName;
    let test = {};
    let header = [];
    let footer = [];
    let sections = [];
    this.testCorrect = new TestCorrection();
    this.testCorrect.test = this.testDetails._id;
    this.testCorrect.corrector = this.service.getCurrentUserInfo()._id;
    this.testCorrect.student = studentId;
    console.log('New Correction :', this.testCorrect);
    let testCorrect = this.testCorrect;
    rncpTitle = this.rncpTitle;
    const headerInfo = this.testCorrectionService.getHeader();

    _.forEach(this.testDetails.correctionGrid.header.fields, function (val, key) {

      let obj = {
        'type': val.type,
        'label': val.value,
        'value': headerInfo ? headerInfo.header.fields[key].value : null,
        'dataType': val.dataType,
        'align': val.align
      };
      switch (val.type) {
        case 'dateRange':
          obj.value = new Date();
          testCorrect.correctionGrid.header.fields.push(obj);
          break;
        case 'dateFixed':
          obj.value = new Date();
          testCorrect.correctionGrid.header.fields.push(obj);
          break;
        case 'currentSchoolYear':
          obj.value = new Date().getFullYear() + '-' + nextYear;
          testCorrect.correctionGrid.header.fields.push(obj);
          break;
        case 'titleName':
          obj.value = rncpTitle;
          testCorrect.correctionGrid.header.fields.push({
            'type': val.type,
            'label': val.value,
            'value': rncpTitle,
            'dataType': val.dataType,
            'align': val.align
          });
          break;
        case 'status':
          testCorrect.correctionGrid.header.fields.push(obj);
          break;
        default:
          testCorrect.correctionGrid.header.fields.push(obj);
      }
      test['header' + key] = [headerInfo ? headerInfo.header.fields[key].value : null, Validators.required];

    });

    const footerInfo = this.testCorrectionService.getFooter();
    _.forEach(this.testDetails.correctionGrid.footer.fields, function (val, key) {
      test['footer' + key] = [footerInfo ? footerInfo.footer.fields[key].value : null, Validators.required];
      testCorrect.correctionGrid.footer.fields.push({
        'type': val.type,
        'label': val.value,
        'value': footerInfo ? footerInfo.footer.fields[key].value : null,
        'dataType': val.dataType,
        'align': val.align
      });
    });

    _.forEach(this.testDetails.correctionGrid.correction.sections, function (val, key) {
      test['total' + key] = [0, Validators.required];
      test['comment' + key] = [null];
      testCorrect.correctionGrid.correction.sections.push({
        title: val.title,
        rating: 0,
        comments: '',
        subSections: []
      });
      _.forEach(val.subSections, function (v, k) {
        test['subSection-' + key + '-' + k] = [null, Validators.required];
      });

    });
    this.listServiceFeature = [];

    _.forEach(this.testDetails.correctionGrid.correction.sections, function (val, key) {
      _.forEach(val.subSections, function (v, k) {
        test['comment-' + key + '-' + k] = [null];
        testCorrect.correctionGrid.correction.sections[key].subSections.push({
          title: val.title,
          rating: '',
          comments: '',
        });
      });
    });


    //test['student'] = [null, Validators.required];
    this.form = this.fb.group(test);

    this.subscribeFormChanges();
  }
}

subscribeFormChanges() {
  this.form.valueChanges.subscribe((data) => {
    this.testCorrectionService.addHeader(this.testCorrect.correctionGrid);
    this.testCorrectionService.addFooter(this.testCorrect.correctionGrid);

  });

  //this.filteredStudents = this.form.controls.student.valueChanges
  //    .startWith(null)
  //    .map(val => val ? this.filter(val) : this.students.slice());


  console.log("filteredStudents");
  console.log(this.filteredStudents);
}

sortPage(sortInfo): void {
  this.sort.sortby = sortInfo.column.prop;
  this.sort.sortmode = sortInfo.newValue;
  this.page.pageNumber = 0;
}

blurEvent(event, value, i, formValue, rowIndex) {
  var re = /^[0-9]+$/;
  let total = 0;
  this.testCorrect.correctionGrid.correction.total = 0;
  this.testCorrect.correctionGrid.correction.additionalTotal = 0;
  if (!re.test(event.target.value)) {
    event.target.value = 0;
    this.listServiceFeature[i + '_' + rowIndex] = 0;
  }
  if (event.target.value > value) {
    event.target.value = 0;
    this.listServiceFeature[i + '_' + rowIndex] = 0;
  }
  this.testCorrect.correctionGrid.correction.sections[i].subSections[rowIndex].rating = event.target.value;

  this.total(event, value, re, i, formValue, total, rowIndex);

}

searchStudentsTable(event) {
  let val = event.target.value;
  console.log('Search : ', val);
  this.searchedStudents = val.length >= 3 ? this.students.filter(option =>
    (option.lastName + ' ' + option.firstName).toLocaleLowerCase().includes(val.trim().toLowerCase())) : this.students;
}




openFormConfirmationDialog(id) {
  this.formConfirmationComponent = this.dialog.open(FormConfirmationComponent, this.formConfigmDoc);
  this.formConfirmationComponent.afterClosed().subscribe((value) => {
    if (value != "") {
      if (value == "SubmitAndGo") {
        if (!this.form.valid) {
          // show popup for please fill up all required information
          swal({
            title:'Attention',
            text: this.translate.instant('TESTCORRECTIONS.MESSAGE.REQUIREDFIELDMESSAGE'),
            allowEscapeKey:true,
            type:'warning'
          });
        }
        else {
          this.submit(null, id);
          //this.ChangeStudent({ value: id });
        }
      }
      else if (value == "CancleAndGo") {
        this.ChangeStudent({ value: id });
      }
      else if (value == "Cancel") {
        //this.ChangeStudent({ value: this.oldStudentValue });
        const student = this.students.find((std) => {
          return std._id === this.oldStudentValue;
        });
        this.selectedStudentArray = [student];
        this.selectedStudent = this.oldStudentValue;
      }
    }
  });
}


total(event, value, re, i, formValue, total, rowIndex) {
  for (let key in this.listServiceFeature) {
    let res = key.split("_")
    if (res[0] == i) {
      if (this.listServiceFeature[key]) {
        if (!re.test(event.target.value)) {

        } else if (event.target.value > value) {

        } else {
          total = Number(total) + Number(this.listServiceFeature[key]);
        }
      }
    }
  }
  let obj = {}
  for (let key in formValue) {
    if (key == 'total' + i) {
      formValue[key] = total;
      obj[key] = total;
      //console.log(obj);
      this.form.patchValue(obj)
    }
    if (key.substring(0, 5) == 'total') {
      this.testCorrect.correctionGrid.correction.total =
        Number(this.testCorrect.correctionGrid.correction.total) + Number(formValue[key]);
    }
  }

  this.testCorrect.correctionGrid.correction.additionalTotal =
    (this.testDetails.correctionGrid.correction.totalZone.additionalMaxScore * this.testCorrect.correctionGrid.correction.total)
    / this.testDetails.maxScore;
  this.testCorrect.correctionGrid.correction.additionalTotal =
    this.testCorrect.correctionGrid.correction.additionalTotal
      .toFixed(this.testDetails.correctionGrid.correction.totalZone.decimalPlaces);
}

studentSelected(event: any) {
  //if (this.form.dirty) {
  //    this.openFormConfirmationDialog(event.selected[0]._id);
  //}
  //else {
  //    this.ChangeStudent({ value: event.selected[0]._id });
  //}
  if (!this.form.valid || this.form.dirty) {
    const student = this.students.find((std) => {
      return std._id === this.oldStudentValue;
    });
    this.selectedStudentArray = [student];
    this.selectedStudent = this.oldStudentValue;

    this.studentSelect = this.oldStudentName;
    swal({
      title: 'Attention',
      text: this.translate.instant('TESTCORRECTIONS.MESSAGE.REQUIREDFIELDMESSAGE'),
      allowEscapeKey:true,
      type: 'warning'
    });
  }
  else {
    //this.studentSelect = event.selected[0].lastName + " " + event.selected[0].firstName;
    this.ChangeStudent({ value: event.selected[0]._id });
  }
}

changeMissingCopy(e) {
  if (e.checked) {
    this.isMissingCopy = true;
  }
  else {
    this.isMissingCopy = false;
  }
  console.log("Checkbox changes");
  console.log(e);
}

ChangeStudentFromDropdown(e) {
  console.log("Selected Student");
  console.log(e);
  //this.studentSelect.setAttribute("value", e.lastName + " " + e.firstName);
  if (!this.form.valid || this.form.dirty) {
    this.studentSelect = this.oldStudentName;
    swal({
      title: 'Attention',
      text: this.translate.instant('TESTCORRECTIONS.MESSAGE.REQUIREDFIELDMESSAGE'),
      allowEscapeKey:true,
      type: 'warning'
    });
  }
  else {
    this.studentSelect = e.lastName + " " + e.firstName;
    this.ChangeStudent({ value: e._id });
    //this.ChangeStudent({ value: e.value });
  }

  //console.log("Old StudentID");
  //console.log(this.oldStudentValue);
  //console.log("New StudentID")
  //console.log(e.value);
  //if (this.form.dirty) {
  //    this.openFormConfirmationDialog(e.value);
  //}
  //else {
  //    this.ChangeStudent({ value: e.value });
  //}
}

testChange(e) {
  this.filteredStudents = Observable.create(function (observer) {
    console.log("filter");
    let filterValue = this.filter(e.target.value)
    console.log(filterValue);
    observer.next(filterValue);
  }.bind(this));
}


ChangeStudent(e) {
  console.log("ChangeStudent");
  console.log(e);
  // this.selectedIndex = e;
  const selectedStudentID = e.value;
  this.oldStudentValue = selectedStudentID;
  this.testCorrect.student = selectedStudentID;
  const student = this.students.find((std) => {
    return std._id === selectedStudentID;
  });

  this.oldStudentName = student.lastName + " " + student.firstName;
  this.studentSelect = student.lastName + " " + student.firstName;
  //this.studentSelect.setAttribute("value", student.lastName + " " + student.firstName);
  this.selectedStudentArray = [student];
  this.selectedStudent = selectedStudentID;
  if (student != null) {
    if (student.correctedTests != null) {
      const c = student.correctedTests[0].correction;
      // let a = Object.assign(correction, student.correctedTests[0].correction);
      this.loadStudentCorrections(JSON.parse(JSON.stringify(c)), selectedStudentID);
    } else {
      this.loadStudentCorrections(null, selectedStudentID);
    }
  }
}

cancleClick() {
  swal({
    title: 'Attention',
    text: this.translate.instant('TESTCORRECTIONS.MESSAGE.CANCELCORRECTION'),
    type: 'question',
    showCancelButton: true,
    allowEscapeKey:true,
    cancelButtonText: this.translate.instant('NO'),
    confirmButtonText: this.translate.instant('YES')
  }).then(() => {
    this.routes.navigate(['/dashboard']);
  }, function (dismiss) {
    if (dismiss === 'cancel') {
    }
  });
}

getScore(row) {
  // debugger;
  if (row.correctedTests) {
    if (row.correctedTests[0].correction.missingCopy) {
      // console.log(row.correctedTests[0].correction.missingCopy);
      return this.translate.instant('TESTCORRECTIONS.MISSINGCOPY');
    }
  }

  if (this.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal === true) {
    // correction.correctionGrid.correction.additionalTotal
    let additionalTotal = row.correctedTests ? row.correctedTests[0].correction.correctionGrid.correction.additionalTotal : null;
    return additionalTotal !== null ? additionalTotal + ' / ' + this.testDetails.correctionGrid.correction.totalZone.additionalMaxScore : '-';
  }
  else {
    return row.correctedTests ? row.correctedTests[0].correction.correctionGrid.correction.total + ' / ' + this.testDetails.maxScore : '-';
  }

}

getAllStudentsCorrected() {
  if (!this.form.valid || this.form.dirty) {
    return false;
  } else {
    return this.students.every(function(i) { return i.correctedTests ? (i.correctedTests.length === 1) : false; });
  }
}


submit(type?: string, id?: string) {
  //id is coming when user change student from grid and dropdown
  if (this.form.valid) {
    // debugger;
    console.log('Valid Correction Form: ', this.testCorrect, this.form.value);

    const studentID = this.testCorrect.student;
    if (!this.updatingCorrection) {
      this.testCorrectionService.addNewCorrection(this.testCorrect).subscribe(status => {

        if (status) {
          swal({
            title: 'Success',
            text: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONSUCCESS'),
            type: 'success',
            allowEscapeKey:true,
            confirmButtonText: 'OK'
          });
          this.testCorrectionService.getStudentForTestCorrection(this.selectedTestId, this.schoolId).subscribe((data) => {

            this.students = data;
            if (type === 'previous') {
              const studentIndex = this.students.findIndex((s, i) => {
                return studentID === s._id;
              });
              this.selectedStudent = this.students[studentIndex > 0 ? studentIndex - 1 : 0]._id;
            } else if (type === 'next') {
              const studentIndex = this.students.findIndex((s, i) => {
                return studentID === s._id;
              });
              this.selectedStudent = this.students[
                (studentIndex < this.students.length - 1) ? studentIndex + 1 : this.students.length - 1
                ]._id;


            } else {
              if (id != null && id != undefined) {
                this.selectedStudent = id;
              }
              else {
                this.selectedStudent = studentID;
              }

            }
            this.ChangeStudent({ value: this.selectedStudent });
          });
        } else {
          swal({
            title: 'Attention',
            text: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONADDERROR'),
            allowEscapeKey:true,
            type: 'warning'
          });
        }
      });
    } else {
      this.testCorrectionService.updateCorrection(this.testCorrect).subscribe(status => {

        if (status) {
          swal({
            title: 'Success',
            text: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONSUCCESS'),
            type: 'success',
            allowEscapeKey:true,
            confirmButtonText: 'OK'
          });
          this.testCorrectionService.getStudentForTestCorrection(this.selectedTestId, this.schoolId).subscribe((data) => {
            this.students = data;
            if (type === 'previous') {
              const studentIndex = this.students.findIndex((s, i) => {
                return studentID === s._id;
              });
              this.selectedStudent = this.students[studentIndex > 0 ? studentIndex - 1 : 0]._id;
            } else if (type === 'next') {
              const studentIndex = this.students.findIndex((s, i) => {
                return studentID === s._id;
              });
              this.selectedStudent = this.students[
                (studentIndex < this.students.length - 1) ? studentIndex + 1 : this.students.length - 1
                ]._id;
            } else {
              if (id != null && id != undefined) {
                this.selectedStudent = id;
              }
              else {
                this.selectedStudent = studentID;
              }
            }
            this.ChangeStudent({ value: this.selectedStudent });
          });
        } else {
          swal({
            title: 'Attention',
            text: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONUPDATEERROR'),
            allowEscapeKey:true,
            type: 'warning'
          });
        }
      });
    }
  } else {
    console.log('Invalid Correction Form : ', this.testCorrect, this.form.value);
    swal({
      title: 'Attention',
      text: this.translate.instant('TESTCORRECTIONS.MESSAGE.REQUIREDFIELDMESSAGE'),
      allowEscapeKey:true,
      type: 'warning'
    });
  }
}

submitAll(){
  if(this.getAllStudentsCorrected()) {
    swal({
      title: 'Success',
      text: this.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTED'),
      allowEscapeKey:true,
      type: 'success'
    }).then(() => {
      this.routes.navigate(['/dashboard']);
    });
  }
}

closeDialog(): void {
  this.dialogref.close({success:false});
}

}


