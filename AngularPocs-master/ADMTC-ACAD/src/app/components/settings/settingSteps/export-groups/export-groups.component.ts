import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { RNCPTitlesService, TestService, StudentsService, UtilityService } from '../../../../services';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';
import _ from 'lodash';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as moment from 'moment';

@Component({
  selector: 'app-export-groups',
  templateUrl: './export-groups.component.html',
  styleUrls: ['./export-groups.component.scss'],
  encapsulation: ViewEncapsulation.None,
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})
export class ExportGroupsComponent implements OnInit {

  page = new Page();
  sort = new Sort();
  public form: FormGroup;
  rncpTitles = [];
  title;
  filteredOptionsRNCPTitle: Observable<string[]>;
  selectedRNCP;

  classes = [];
  class;
  filteredOptionsClass: Observable<string[]>;
  selectedClass;

  tests = [];
  test;
  filteredOptionsTest: Observable<string[]>;
  selectedTest;
  formSubmit = false;
  students = [];
  studentsBeingExported = [];
  delimeterList = [
    { key: 'COMMA', value: ',' },
    { key: 'SEMICOLON', value: ';' },
    { key: 'TAB', value: '\t' }
  ];
  delimiterSelected = null;

  constructor(
    private fb: FormBuilder,
    private titleService: RNCPTitlesService,
    private testService: TestService,
    public dialogref: MdDialogRef<ExportGroupsComponent>,
    private studentService: StudentsService,
    private translate: TranslateService,
    private utilityService: UtilityService
  ) {

    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';

    this.form = this.fb.group({
      title: ['', Validators.required],
      class: ['', Validators.required],
      test: ['', Validators.required]
    });

    this.title = this.form.controls['title'];
    this.class = this.form.controls['class'];
    this.test = this.form.controls['test'];
    this.filteredOptionsRNCPTitle = this.title.valueChanges.startWith(null).map(list => list ? this.filterRNCPTitle(list) : this.rncpTitles.slice());
    this.filteredOptionsClass = this.class.valueChanges.startWith(null).map(list => list ? this.filterClass(list) : this.classes.slice());
    this.filteredOptionsTest = this.test.valueChanges.startWith(null).map(list => list ? this.filterTests(list) : this.tests.slice());
  }

  ngOnInit() {
    this.titleService
      .getAllRNCPTitlesShortName()
      .subscribe(data => {
        this.rncpTitles = _.sortBy(data.data, ['shortName']);
        this.form.controls['title'].setValue('');
      });
  }

  filterRNCPTitle(name: string) {
    return this.rncpTitles.filter(list => list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  filterClass(name: string) {
    return this.classes.filter(list => list.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  filterTests(name: string) {
    return this.tests.filter(list => list.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  OnSelectRNCPTitle(data) {
    let self = this;
    this.classes = [];
    if (data && data._id) {
      this.selectedRNCP = data;

      self.titleService.getClasses(this.selectedRNCP._id, self.page, self.sort).subscribe(data => {
        if (data.total === 0) {
          self.classes = [];
        } else {
          self.classes = data.classes;
        }
        self.form.controls['class'].setValue('');
      });

    }
  }

  OnSelectClass(data) {
    this.tests = [];

    if (data && data._id) {
      this.selectedClass = data._id;
      this.testService.getGroupTestsBasedOnClassAndRNCP(this.selectedRNCP._id, this.selectedClass).subscribe(tests => {
        if (tests.data.length === 0) {
          this.tests = [];
        } else {
          this.tests = tests.data;
        }
        this.form.controls['test'].setValue('');
      });

    }
  }
  OnSelectTest(data) {
    if (data && data._id) {
      this.selectedTest = data;
    }
  }

  closeDialog(): void {
    this.dialogref.close();
  }

  exportStudentsWithGroups() {
    this.studentService.getStudentsToExportWithTheirGroup(this.selectedTest._id).subscribe(students => {
      this.students = students.data;

      this.studentsBeingExported = this.students.map(student => {
        return {
          'schoolShortName': student.school.shortName,
          'rncpShortName': student.rncpTitle.shortName,
          'class': student.currentClass.name,
          'scholarSeason': student.scholarSeason.scholarseason,
          'civility': this.utilityService.computeCivility(student.sex, this.translate.currentLang),
          'firstName': student.firstName,
          'lastName': student.lastName,
          'email': student.email,
          // Below lines are commented because it will be used for on demand customers' request
          'groupTest': student.groupDetails && student.groupDetails.test ? student.groupDetails.test.name : '',
          'groupName': student.groupDetails ? student.groupDetails.name : ''
        };
      });

      const options = {
        fieldSeparator: this.delimiterSelected,
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: true,
        headers: [
          this.translate.instant('STUDENT_EXPORT_COLUMNS.SCHOOL'),
          this.translate.instant('STUDENT_EXPORT_COLUMNS.RNCPTITLE'),
          this.translate.instant('STUDENT_EXPORT_COLUMNS.CLASS'),
          this.translate.instant('STUDENT_EXPORT_COLUMNS.SCHOLAR_SEASON'),
          this.translate.instant('STUDENT_EXPORT_COLUMNS.STUDENT_CIVILITY'),
          this.translate.instant('STUDENT_EXPORT_COLUMNS.STUDENT_FIRST_NAME'),
          this.translate.instant('STUDENT_EXPORT_COLUMNS.STUDENT_LAST_NAME'),
          this.translate.instant('STUDENT_EXPORT_COLUMNS.EMAIL'),
          // Below lines are commented because it will be used for on demand customers' request
          this.translate.instant('STUDENT_EXPORT_COLUMNS.GROUP_TEST'),
          this.translate.instant('STUDENT_EXPORT_COLUMNS.GROUP_NAME'),
        ]
      };

      const setCSVFileName = 'Students_Export_Groups ' + this.selectedRNCP.shortName + ' ' + this.selectedTest.name + ' ' + moment().format('DD-MM-YYYY');

      new Angular2Csv(this.studentsBeingExported, setCSVFileName, options);
      this.dialogref.close();
    });


  }

  selectDelimiter(delimiter) {
    this.delimiterSelected = delimiter.value;
  }

}
