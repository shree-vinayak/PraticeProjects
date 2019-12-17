import { Component, OnInit } from '@angular/core';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ComposeDocumenttestEmailComponent } from './compose-documenttest-email/compose-documenttest-email.component';
import { DoctestService } from './doctest.service';
import { UtilityService, ExpertiseService, LoginService } from '../../services';
import { Files } from '../../shared/global-urls';
import { CustomerService } from '../customer/customer.service';
import { RNCPTitlesService } from 'app/services/rncp-titles.service';
import _ from 'lodash';
import { TestService } from '../../services/test.service';
import { StudentsService } from '../../services/students.service';
declare var swal: any;
@Component({
  selector: 'app-doctesttable',
  templateUrl: './doctesttable.component.html',
  styleUrls: ['./doctesttable.component.scss']
})
export class DoctesttableComponent implements OnInit {

  page = new Page();
  reorderable = true;
  sort = new Sort();

  wholeExpertiseListObject = [];


  // List of booleans to show the filter
  showRNCPList = false;
  showTestList = false;

  // selected filters
  selectedRNCP = [];
  selectedSchool = [];
  selectedClass = [];
  selectedStudent = [];
  selectedExpertise = [];
  selectedSubject = [];
  selectedTest = [];
  selectedDocType = [];

  searchDocument = '';

  schoolLists = [];
  titleLists = [];
  allTitleLists = [];
  classLists = [];
  studentLists = [];
  expertiseLists = [];
  subjectLists = [];
  testLists = [];
  typeOfDocLists = [];
  typeOfDocs = [
    { id: 'documentExpected', text: 'Doc_Expected', },
    { id: 'StudentTestCorrection', text: 'Correction_Grid' },
    { id: 'missingCopy', text: 'Doc. Justif Absence' },
    { id: 'internalTask', text: 'Internal_Task' }
  ];
  docTestRecords = [];

  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  selected = [];

  sendMailBox: MdDialogConfig = {
    disableClose: false,
    width: '1000px',
    height: '80%'
  };

  isFilterMode: boolean = false;

  public dialogRef: MdDialogRef<ComposeDocumenttestEmailComponent>;
  constructor(
    public composeEmailDialog: MdDialog,
    public translate: TranslateService,
    public docTestService: DoctestService,
    public utility: UtilityService,
    public custService: CustomerService,
    public titleService: RNCPTitlesService,
    private testService: TestService,
    private studentService: StudentsService,
    private expertiseService: ExpertiseService,
    private loginService: LoginService
  ) {
    this.selected = [];
    this.page.pageNumber = 0;
    this.page.totalElements = 0;
    this.page.totalPages = 5;
    this.page.size = 11;
    this.sort.sortby = 'createdAt';
    this.sort.sortmode = 'desc';
  }

  ngOnInit() {
    this.typeOfDocs.forEach((item, index) => {
      const typeEntity = this.getTranslateDocType(item.text);
      this.typeOfDocLists.push({ id: item.id, text: typeEntity });
    });
    this.typeOfDocLists = [...this.typeOfDocLists];

    this.translate.onLangChange.subscribe((params) => {
      if (this.typeOfDocLists !== []) {
        this.typeOfDocLists = [];
        this.typeOfDocs.forEach((item, index) => {
          const typeEntity = this.getTranslateDocType(item.text);
          this.typeOfDocLists.push({ id: item.id, text: typeEntity });
        });
        this.typeOfDocLists = [...this.typeOfDocLists];
      }
    });

    this.getAllDocTest(true);
  }


  changeSchoolFilterTyped(event) {
    if (event.id) {
      this.testLists = [];
      this.titleLists = [];
      this.titleLists = [...this.titleLists];

      // If the school selection is changed, all the other selected filters should be empty
      if (this.selectedSchool.length) {
        this.selectedClass = [];
        this.selectedExpertise = [];
        this.selectedRNCP = [];
        this.selectedStudent = [];
        this.selectedSubject = [];
        this.selectedTest = [];
      }
      // If the school selection is changed, all the other selected filters should be empty ENDS HERE

      event.id.rncpTitles.forEach((item) => {
        this.titleLists.push({ id: item._id, text: item.shortName });
      });

      // If the logged in user is acad-dir he should be able to see rncp that are assigned to him
      if (this.utility.checkUserIsAcademicDirector()) {
        const acadDirRNCP = this.loginService.getLoggedInUser().assignedRncpTitles.map( r => { return {'id': r }; } );
        this.titleLists = _.intersectionBy( this.titleLists, acadDirRNCP, 'id');
      }

      this.titleLists = [...this.titleLists.sort(this.keysrt('text'))];
    } else {
      this.selectedClass = [];
      this.selectedExpertise = [];
      this.selectedRNCP = [];
      this.selectedStudent = [];
      this.selectedSubject = [];
      this.selectedTest = [];
    }
  }

  getAllDocTest(isFirstLoad?: boolean) {
    const emptyBody = {};
    this.docTestService.searchAndFilter(emptyBody, this.page, this.sort).subscribe(res => {
      console.log(res);
      this.docTestRecords = res.data;
      // this.page.totalElements = 881;
      this.page.totalElements = res.total;
      this.isFilterMode = false;
      if ( isFirstLoad ) {
        this.getAllSchools();
      }
    });
  }

  changeTitleFilter(event) {
    console.log(event);
    if (event.id) {
      console.log(event.id);

      // If the RNCP selection is changed, all the other selected filters should be empty
      if (this.selectedRNCP.length > 0) {
        this.selectedClass = [];
        this.selectedExpertise = [];
        this.selectedStudent = [];
        this.selectedSubject = [];
        this.selectedTest = [];
      }
      // If the school RNCP is changed, all the other selected filters should be empty ENDS HERE

      // When RNCP is selected Classes will be fetched
      this.testService.getclass(event.id).subscribe(res => {
        const data = res;
        this.classLists = [];
        if (data) {
          data.forEach(rep => {
            this.classLists.push({
              id: rep._id,
              text: rep.name
            });
          });
        }
        this.classLists = this.classLists.sort(this.keysrt('text'));
      });

      this.getExpertise(event.id);
      this.getTests(event.id);
    } else {
      this.selectedClass = [];
      this.selectedExpertise = [];
      this.selectedTest = [];
    }
  }

  changeClassFilter(event) {
    console.log(event);
    this.studentLists = [];
    if (event.id) {

      // If the Class selection is changed, all the other dependent selected filters on it should be empty
      if (this.selectedClass.length > 0) {
        this.selectedStudent = [];
      }
      // If the Class selection is changed, all the other dependent selected filters on it should be empty ENDS HERE

      this.getAllStudents(event.id);
    } else {
      this.selectedStudent = [];
    }
  }


  changeExpertiseFilter(event) {
    console.log(event);
    if (event.id) {

      // If the Expertise selection is changed, all the other dependent selected filters on it should be empty
      if (this.selectedExpertise.length > 0) {
        this.selectedSubject = [];
      }
      // If the Expertise selection is changed, all the other dependent selected filters on it should be empty ENDS HERE

      this.getSubjects(event.id);
    } else {
      this.selectedSubject = [];
    }
  }

  changeSubjectFilter(event) {
  }

  changeStudentFilter(event) {
  }

  changeTestFilter(event) {
  }

  changeTypeOfDocFilter(event) {
  }

  searchBasedOnFilter(isSearched?: boolean) {
    this.selected = [];
    const searchBody = {
      studentId: this.selectedStudent.length <= 0 ? '' : this.selectedStudent[0].id,
      schoolId: this.selectedSchool.length <= 0 ? '' : this.selectedSchool[0].id._id,
      rncpId: this.selectedRNCP.length <= 0 ? '' : this.selectedRNCP[0].id,
      classId: this.selectedClass.length <= 0 ? '' : this.selectedClass[0].id,
      testId: this.selectedTest.length <= 0 ? '' : this.selectedTest[0].id,
      subjectId: this.selectedSubject.length <= 0 ? '' : this.selectedSubject[0].id,
      expertiseId: this.selectedExpertise.length <= 0 ? '' : this.selectedExpertise[0].id,
      documentType: this.selectedDocType.length <= 0 ? '' : this.selectedDocType[0].id,
      keyword: this.searchDocument
    };
    console.log(searchBody);
    if ( isSearched ) {
      this.page.pageNumber = 0;
    }
    this.docTestService.searchAndFilter(searchBody, this.page, this.sort).subscribe(docs => {
      this.docTestRecords = docs.data;
      // this.page.totalElements = 881;
      this.page.totalElements = docs.total;
      this.isFilterMode = true;
    });
  }
  resetSearch() {

    this.selectedClass = [];
    this.selectedExpertise = [];
    this.selectedRNCP = [];
    this.selectedSchool = [];
    this.selectedStudent = [];
    this.selectedSubject = [];
    this.selectedTest = [];
    this.selectedDocType = [];

    this.searchDocument = '';
    this.selected = [];
    this.isFilterMode = false;
    this.page.pageNumber = 0;
    this.searchAfterModeCheck();
  }
  onActivate($event) {
  }

  sortPage(sortInfo): void {
    const sort = new Sort();
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.searchAfterModeCheck();
  }

  changePage(pageInfo): void {
    if ( this.page.pageNumber !== pageInfo.offset ) {
      this.page.pageNumber = pageInfo.offset;
      this.searchAfterModeCheck();
    }
  }

  sortColumn() {
  }

  viewdialog() {

  }

  forwardTask() {

  }

  onCheckboxChangeFn(event) {
    console.log(event);
  }
  selectFn(rowsSelected) {
    console.log(rowsSelected);
  }
  sendMail(data) { }

  onSelect(event) {
    console.log(event);
    this.selected = event.selected;
  }

  forwardMailSingle(row) {
    console.log(row);
    this.dialogRef = this.composeEmailDialog.open(ComposeDocumenttestEmailComponent, this.sendMailBox);
    this.dialogRef.componentInstance.mailDataForDocTestTable = [row];
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
  }

  forwardMailToMultiple() {
    console.log(this.selected);
    if (this.selected.length > 0) {
      this.dialogRef = this.composeEmailDialog.open(ComposeDocumenttestEmailComponent, this.sendMailBox);
      this.dialogRef.componentInstance.mailDataForDocTestTable = this.selected;
      this.dialogRef.afterClosed().subscribe(result => {
        this.dialogRef = null;
      });
    } else {
      swal({
        title: this.translate.instant('DOCTESTTABLE.Select_At_Least_One.Title'),
        confirmButtonText: this.translate.instant('DOCTESTTABLE.Select_At_Least_One.Button'),
        allowEscapeKey: true,
        type: 'error'
      });
    }
  }
  downloadDocumentorCorrectionGrid(row) {
    const a = document.createElement('a');
    a.target = '_blank';
    a.href = Files.url + row.filePath;
    a.download = row.fileName;
    window.open(a.href, '_blank');
  }

  getAllSchools() {
    this.custService
      .getSchoolsBasedOnLoggedInUserType()
      .subscribe(schools => {
        const data = schools.data;
        this.schoolLists = [];
        if (data) {
          data.forEach(rep => {
            this.schoolLists.push({
              id: rep,
              text: rep.shortName
            });
          });
        }
        this.schoolLists = this.schoolLists.sort(this.keysrt('text'));
      });
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) { return 1; }
      else if (a[key] < b[key]) { return -1; };
      return 0;
    };
  }
  onClickRNCP() {
    this.titleLists = [];
    this.titleLists = [...this.titleLists];
  }

  getAllStudents(classId) {
    let queryString = '';

    if (this.selectedSchool.length > 0) {
      queryString += '&prepcenter=' + this.selectedSchool[0].id._id;
    }
    if (this.selectedRNCP.length > 0) {
      queryString += '&rncpTitleId=' + this.selectedRNCP[0].id;
    }
    if (classId) {
      queryString += '&classId=' + classId;
    }
    this.studentService.getAllStudent(queryString).subscribe(students => {
      console.log(students);
      if (students) {
        students.studentList.result.forEach(stu => {
          this.studentLists.push({
            id: stu._id,
            text: stu.firstName + ' ' + stu.lastName
          });
        });
      }
      this.studentLists = [...this.studentLists.sort(this.keysrt('text'))];
    });
  }

  getExpertise(rncpId) {
    this.expertiseLists = [];
    this.expertiseService.getTitleExpertise(rncpId).subscribe(exp => {
      console.log(exp.expertiseList);
      if (exp && exp.expertiseList) {
        exp.expertiseList.forEach(expertise => {
          this.expertiseLists.push({
            id: expertise._id,
            text: expertise.blockOfExperise
          });
        });
        this.wholeExpertiseListObject = exp.expertiseList;
        this.expertiseLists = [...this.expertiseLists.sort(this.keysrt('text'))];
      }

    });
  }

  getSubjects(expertiseId) {
    this.subjectLists = [];
    const expertiseIndex = _.findIndex(this.wholeExpertiseListObject, { '_id': expertiseId });
    console.log(expertiseIndex);
    if (expertiseIndex > -1 && this.wholeExpertiseListObject[expertiseIndex].subject) {
      console.log(this.wholeExpertiseListObject[expertiseIndex]);
      this.wholeExpertiseListObject[expertiseIndex].subject.forEach(sub => {
        this.subjectLists.push({
          id: sub._id,
          text: sub.subjectName
        });
      });
      console.log(this.wholeExpertiseListObject[expertiseIndex].subject);
      console.log(this.subjectLists);
      this.subjectLists = [...this.subjectLists.sort(this.keysrt('text'))];
    }


  }


  getTests(rncpId) {
    this.testLists = [];
    this.testService.getTestByRNCPTitle(rncpId).subscribe(tests => {
      tests.forEach(test => {
        this.testLists.push({
          id: test._id,
          text: test.name
        });
      });
      this.testLists = [...this.testLists.sort(this.keysrt('text'))];
    });
  }

  getTranslateDocType(text) {
    const value = this.translate.instant('DOCTESTTABLE.' + text);
    return value !== 'DOCTESTTABLE.' + text ? value : text;
  }

  searchAfterModeCheck() {
    if ( this.isFilterMode ) {
      this.searchBasedOnFilter();
    } else {
      this.getAllDocTest();
    }
  }

}
