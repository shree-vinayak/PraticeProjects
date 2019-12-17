import { AppSettings } from './../../../../app-settings';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

import { Observable } from 'rxjs/Rx';

import { RNCPTitlesService, TestService } from '../../../../services';
import { UtilityService } from '../../../../services/utility.service';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';

import { TranslateService } from 'ng2-translate';
import { Angular2Csv } from 'angular2-csv';
import _ from 'lodash';
import * as moment from 'moment';
declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('StatusUpdateDialogComponent');
log.color = 'purple';

@Component({
  selector: 'app-status-update',
  templateUrl: './status-update.component.html',
  styleUrls: ['./status-update.component.scss'],
})
export class StatusUpdateDialogComponent implements OnInit {
  page = new Page();
  sort = new Sort();
  public statusUpdateForm: FormGroup;

  rncpTitles = [];
  title;
  filteredOptionsRNCPTitle: Observable<string[]>;
  selectedRNCP;

  scholarSeasones = [];
  scholarSeason = null;
  filteredOptionsScholarSeason: Observable<string[]>;
  selectedscholarSeason;

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

  requireExportCsv: boolean = false;
  sendNotification: boolean = false;
  isExpectedDoc: boolean = false;

  submitButtonDisabled: boolean = true;

  serverimgPath: string = AppSettings.urls.baseApi;

  constructor(
    private fb: FormBuilder,
    private titleService: RNCPTitlesService,
    private testService: TestService,
    public dialogref: MdDialogRef<StatusUpdateDialogComponent>,
    private translate: TranslateService,
    private utilityService: UtilityService,
  ) {
    this.statusUpdateForm = this.fb.group({
      rncpTitle: ['', Validators.required],
      scholarSeason: ['', Validators.required],
      class: ['', Validators.required],
      test: ['', Validators.required],
    });

    this.title = this.statusUpdateForm.controls['rncpTitle'];
    this.scholarSeason = this.statusUpdateForm.controls['scholarSeason'];
    this.class = this.statusUpdateForm.controls['class'];
    this.test = this.statusUpdateForm.controls['test'];

    this.filteredOptionsRNCPTitle = this.title.valueChanges
      .startWith(null)
      .map(list =>
        list ? this.filterRNCPTitle(list) : this.rncpTitles.slice(),
      );

    this.filteredOptionsScholarSeason = this.scholarSeason.valueChanges
      .startWith(null)
      .map(list =>
        list ? this.filterScholarSeason(list) : this.scholarSeasones.slice(),
      );

    this.filteredOptionsClass = this.class.valueChanges
      .startWith(null)
      .map(list => (list ? this.filterClass(list) : this.classes.slice()));

    this.filteredOptionsTest = this.test.valueChanges
      .startWith(null)
      .map(list => (list ? this.filterTests(list) : this.tests.slice()));
  }

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    this.getAllRNCPList();
  }

  getAllRNCPList() {
    this.titleService.getAllRNCPTitlesShortName().subscribe(response => {
      log.data('getAllRNCPTitlesShortName data', response);
      this.rncpTitles = _.sortBy(response.data, ['shortName']);
      this.statusUpdateForm.controls['rncpTitle'].setValue('');
    });
  }
  filterRNCPTitle(name: string) {
    return this.rncpTitles.filter(
      list => list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0,
    );
  }

  filterScholarSeason(name: string) {
    return this.scholarSeasones.filter(
      list =>
        list.scholarseason.toLowerCase().indexOf(name.toLowerCase()) === 0,
    );
  }

  filterClass(name: string) {
    return this.classes.filter(
      list => list.name.toLowerCase().indexOf(name.toLowerCase()) === 0,
    );
  }

  filterTests(name: string) {
    return this.tests.filter(
      list => list.name.toLowerCase().indexOf(name.toLowerCase()) === 0,
    );
  }

  OnSelectRNCPTitle(data) {
    this.scholarSeasones = [];
    if (data && data._id) {
      this.selectedRNCP = data;

      this.titleService
        .getSelectedScholarSeason(this.selectedRNCP._id)
        .subscribe(data => {
          log.data('getSelectedScholarSeason', data);
          if (data.length > 0) {
            this.scholarSeasones = _.sortBy(data, ['scholarseason']);
          } else {
            this.scholarSeasones = [];
          }
          this.statusUpdateForm.controls['scholarSeason'].setValue('');
          this.statusUpdateForm.controls['class'].setValue('');
          this.statusUpdateForm.controls['test'].setValue('');
        });
    }
  }

  OnSelectScholarSeason(data) {
    this.classes = [];
    if (data && data._id) {
      this.selectedscholarSeason = data;

      this.titleService
        .getClasses(this.selectedRNCP._id, this.page, this.sort)
        .subscribe(data => {
          log.data('OnSelectScholarSeason getClasses', data);
          if (data.total > 0) {
            this.classes = _.sortBy(data.classes, ['name']);
          } else {
            this.classes = [];
          }
          this.statusUpdateForm.controls['class'].setValue('');
          this.statusUpdateForm.controls['test'].setValue('');
        });
    }
  }

  OnSelectClass(data) {
    this.tests = [];
    if (data && data._id) {
      this.selectedClass = data._id;

      this.testService
        .getTestsBasedOnClassId(this.selectedClass)
        .subscribe(tests => {
          log.data(
            'getTestsBasedOnClassId getTestsBasedOnClassId tests',
            tests,
          );
          if (tests.length > 0) {
            this.tests = _.sortBy(tests, ['name']);
          } else {
            this.tests = [];
          }
          this.statusUpdateForm.controls['test'].setValue('');
        });
    }
  }
  OnSelectTest(data) {
    if (data && data._id) {
      log.data('OnSelectTest data', data);
      this.isExpectedDoc = false;
      this.selectedTest = data;
      if (
        this.selectedTest.expectedDocuments &&
        this.selectedTest.expectedDocuments.length > 0
      ) {
        this.isExpectedDoc = true;
      }
      this.getSubmitButtonState();
    }
  }

  closeDialog(): void {
    this.dialogref.close();
  }

  notificationEvent(event) {
    if (event.hasOwnProperty('checked')) {
      this.sendNotification = event.checked;
      this.getSubmitButtonState();
    }
    log.data(
      'notificationEvent event sendNotification',
      event,
      this.sendNotification,
    );
  }

  csvEvent(event) {
    if (event.hasOwnProperty('checked')) {
      this.requireExportCsv = event.checked;
      this.getSubmitButtonState();
    }
    log.data('csvEvent event requireExportCsv', event, this.requireExportCsv);
  }

  getStatusOfTest() {
    const getStatusofStudent = (separator?: any) => {
      const postObject = {
        send_TASK_N7: this.sendNotification,
        generateCSVData: this.requireExportCsv,
        testId: this.selectedTest._id,
        lang: this.translate.currentLang.toLowerCase(),
      };
      this.testService.getStatusUpdateofTest(postObject).subscribe(response => {
        if (
          response.data &&
          response.data.length > 0 &&
          this.requireExportCsv
        ) {
          this.exportTestStatusCSV(separator, response.data);
        } else if (response.sent) {
          swal({
            type: 'success',
            title: this.translate.instant('SUCCESS'),
            allowEscapeKey: true,
            confirmButtonText: 'OK',
          }).then(isConfirm => {
            this.closeDialog();
          });
        }
      });
    };

    if (this.requireExportCsv) {
      const inputOptions = {
        ',': this.translate.instant('Export_S1.COMMA'),
        ';': this.translate.instant('Export_S1.SEMICOLON'),
        tab: this.translate.instant('Export_S1.TAB'),
      };

      swal({
        type: 'question',
        title: this.translate.instant('Export_S1.TITLE'),
        allowEscapeKey: true,
        confirmButtonText: this.translate.instant('Export_S1.OK'),
        input: 'radio',
        inputOptions: inputOptions,
        inputValidator: value => {
          return new Promise((resolve, reject) => {
            if (value) {
              resolve();
            } else {
              reject(this.translate.instant('Export_S1.INVALID'));
            }
          });
        },
      }).then(separator => {
        log.data(' separator', separator);
        getStatusofStudent(separator);
      });
    } else {
      getStatusofStudent();
    }
  }

  exportTestStatusCSV(separator, studentsData) {
    const studentsBeingExported = studentsData.map(student => {
      const document = _.get(
        student.correctedTests,
        '0.correction.expectedDocuments[0].document',
        null,
      );

      // Covert YYYYMMDD to YYYY-MM-DD
      let theDate = '';
      if (document && document.createdAt) {
        console.log(document.createdAt);
        for (let i = 0; i < document.createdAt.length; i++) {
          if (i === 4) {
            theDate += `-${document.createdAt[i]}`;
          } else if (i === 6) {
            theDate += `-${document.createdAt[i]}`;
          } else if (i > 7) {
            break;
          } else {
            theDate += document.createdAt[i];
          }
        }

      }
      const csvData = {
        schoolShortName: student.school.shortName,
        rncpShortName: student.rncpTitle.shortName,
        class: student.currentClass.name,
        scholarSeason: student.scholarSeason.scholarseason,
        civility: this.utilityService.computeCivility(
          student.sex,
          this.translate.currentLang,
        ),
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        TEST_NAME: this.selectedTest.name ? this.selectedTest.name : '',
      };

      if ( this.isExpectedDoc ) {
        csvData['Expected Doc Name'] = this.selectedTest.expectedDocuments[0].documentName ?
                                       this.selectedTest.expectedDocuments[0].documentName : '';
        csvData['File Name'] = document && document.fileName ? document.fileName : '';
        csvData['Link to download'] =  document && document.filePath ?
                                        this.serverimgPath + document.filePath : '';
        csvData['Upload Date'] = document && document.updatedAt ?
                                 moment(document.updatedAt).format('DD/MM/YYYY') : '';
        csvData['Upload Time'] = document && document.updatedAt ?
                                 moment(document.updatedAt).format('hh:mm:ss A') : '';
      }

      const additionalTotal = _.get(
        student.correctedTests,
        '0.correction.correctionGrid.correction.additionalTotal',
        null,
      );
      const total = _.get(
        student.correctedTests,
        '0.correction.correctionGrid.correction.total',
        null,
      );
      csvData['Marks'] = additionalTotal
        ? additionalTotal
        : total
        ? total
        : ' ';

      if (this.selectedTest.groupTest) {
        csvData['Group'] = _.get(
          student.correctedTests,
          '0.correction.testGroupId.name',
          ' ',
        );
      }

      return csvData;
    });

    log.data(
      'exportTestStatusCSV studentsBeingExported',
      studentsBeingExported,
    );

    const headerArray = [
      this.translate.instant('Export_S1_COLUMNS.SCHOOL'),
      this.translate.instant('Export_S1_COLUMNS.RNCP_TITLE'),
      this.translate.instant('Export_S1_COLUMNS.CLASS'),
      this.translate.instant('Export_S1_COLUMNS.SCOLAR_SEASON'),
      this.translate.instant('Export_S1_COLUMNS.CIVILITY'),
      this.translate.instant('Export_S1_COLUMNS.FIRST_NAME'),
      this.translate.instant('Export_S1_COLUMNS.LAST_NAME'),
      this.translate.instant('Export_S1_COLUMNS.EMAIL'),
      this.translate.instant('Export_S1_COLUMNS.TEST_NAME'),
    ];

    if (this.isExpectedDoc) {
      const additionalDocHeaders = [
        this.translate.instant('Export_S1_COLUMNS.Expected Doc Name'),
        this.translate.instant('Export_S1_COLUMNS.File Name'),
        this.translate.instant('Export_S1_COLUMNS.Link to download'),
        this.translate.instant('Export_S1_COLUMNS.Upload Date'),
        this.translate.instant('Export_S1_COLUMNS.Upload Time'),
      ];
      additionalDocHeaders.forEach(docHeader => headerArray.push(docHeader));
    }

    headerArray.push(this.translate.instant('Export_S1_COLUMNS.SCORE'));

    if (this.selectedTest.groupTest) {
      log.data(
        'exportTestStatusCSV this.selectedTest.groupTest',
        this.selectedTest.groupTest,
      );
      headerArray.push(this.translate.instant('Export_S1_COLUMNS.Group'));
    }

    log.data('exportTestStatusCSV headerArray', headerArray);
    const options = {
      fieldSeparator: separator === 'tab' ? '\t' : separator,
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: headerArray,
    };

    const setCSVFileName = `${this.selectedRNCP.shortName} - ${
      this.selectedTest.name
    } - DOC - ${moment().format('DD-MM-YYYY')}`;

    new Angular2Csv(studentsBeingExported, setCSVFileName, options);
    swal({
      type: 'success',
      title: this.translate.instant('SUCCESS'),
      allowEscapeKey: true,
      confirmButtonText: 'OK',
    }).then(isConfirm => {
      this.closeDialog();
    });
  }

  getSubmitButtonState() {
    if (this.statusUpdateForm.valid) {
      this.submitButtonDisabled =
        !this.requireExportCsv && !this.sendNotification;
    } else {
      this.submitButtonDisabled = true;
    }
  }

  // Convert time from YYYYMMDD to DD-MM-YY
  convertDateMaually(str: string): string {
    if (!/^(\d){8}$/.test(str)) {
      return 'invalid date';
    }
    const y = parseInt(str.substr(0, 4));
    const m = parseInt(str.substr(4, 2));
    const d = parseInt(str.substr(6, 2));
    const theDate = new Date(y, m, d);
    return theDate.toDateString();
  }
}
