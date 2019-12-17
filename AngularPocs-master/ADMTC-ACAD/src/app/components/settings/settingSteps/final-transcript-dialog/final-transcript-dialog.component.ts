import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { FinalTranscriptService } from './final-transcript.service';
import { UtilityService } from '../../../../services/utility.service';
import { RNCPTitlesService } from '../../../../services';
import { PDFService } from '../../../../services/pdf.service';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';
import { Print } from '../../../../shared/global-urls';
import { PRINTSTYLES } from '../../../test/test-document/styles';
import { TestCorrectionService } from '../../../../services/test-correction.service';

import { TranslateService } from 'ng2-translate';
import { Angular2Csv } from 'angular2-csv';
import _ from 'lodash';
import * as moment from 'moment';
declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('FinalTranscriptDialogComponent');
log.color = 'purple';

@Component({
  selector: 'app-final-transcript-dialog',
  templateUrl: './final-transcript-dialog.component.html',
  styleUrls: ['./final-transcript-dialog.component.scss'],
  providers: [FinalTranscriptService]
})
export class FinalTranscriptDialogComponent implements OnInit {
  page = new Page();
  sort = new Sort();
  public form: FormGroup;

  transcriptSelections = [
    'SCHOLAR_BOARD_SUBMISSION',
    'INPUT_FINAL_DECISION',
    'EXPORT_AFTER_DECISION_JURY',
    'EXPORT_RETAKE_ONLY',
    'PDF_RETAKE_TEST_RESULT',
    'SUBMISSION_AFTER_RETAKE',
    'SUCCESS_STATISTICS'
  ];

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

  formSubmit: boolean = false;

  selection: string = '';
  delimiterSelection: any = null;

  delimeterList = [
    { key: 'COMMA', value: ',' },
    { key: 'SEMICOLON', value: ';' },
    { key: 'TAB', value: '\t' }
  ];

  disableSubmit = false;
  displayDelimiterSelection = false;
  finalTransState = '';
  selectTestLength = 0;

  allRetakeTests: any[] = [];
  pageSectionsArray;
  testDetails;
  searchedStudents;
  visiblePage = 1;
  pdfDocument = '';

  @ViewChild('pagesElement') documentPagesRef: ElementRef;

  constructor(
    private fb: FormBuilder,
    private titleService: RNCPTitlesService,
    public dialogref: MdDialogRef<FinalTranscriptDialogComponent>,
    private translate: TranslateService,
    private utilityService: UtilityService,
    private finalTranscriptService: FinalTranscriptService,
    private router: Router,
    private pdfService: PDFService,
    private testCorrectionService: TestCorrectionService,
    private ref: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      selection: ['', Validators.required],
      rncpTitle: ['', Validators.required],
      class: ['', Validators.required],
      scholarSeason: ['', Validators.required],
      delimiter: ['', Validators.required],
      retakeTests: ['', Validators.required]
    });

    this.title = this.form.controls['rncpTitle'];
    this.scholarSeason = this.form.controls['scholarSeason'];
    this.class = this.form.controls['class'];

    this.filteredOptionsRNCPTitle = this.title.valueChanges
      .startWith(null)
      .map(
        list => (list ? this.filterRNCPTitle(list) : this.rncpTitles.slice())
      );

    this.filteredOptionsScholarSeason = this.scholarSeason.valueChanges
      .startWith(null)
      .map(
        list =>
          list ? this.filterScholarSeason(list) : this.scholarSeasones.slice()
      );

    this.filteredOptionsClass = this.class.valueChanges
      .startWith(null)
      .map(list => (list ? this.filterClass(list) : this.classes.slice()));
  }

  ngOnInit(): void {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    this.getAllRNCPList();
  }

  filterRNCPTitle(name: string) {
    return this.rncpTitles.filter(
      list => list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  filterScholarSeason(name: string) {
    return this.scholarSeasones.filter(
      list => list.scholarseason.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  filterClass(name: string) {
    return this.classes.filter(
      list => list.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  getAllRNCPList() {
    this.titleService.getAllRNCPTitlesShortName().subscribe(response => {
      log.data('getAllRNCPTitlesShortName data', response);
      this.rncpTitles = _.sortBy(response.data, ['shortName']);
      this.form.controls['rncpTitle'].setValue('');
    });
  }


  chooseSelection(event) {
    if (event) {
      if (this.selection) {
        this.disableSubmit = false;
      } else {
        this.disableSubmit = true;
      }

      if (this.selection === 'INPUT_FINAL_DECISION' ||
        this.selection === 'PDF_RETAKE_TEST_RESULT') {
        this.displayDelimiterSelection = false;
        this.form.get('delimiter').disable();
        this.form.get('delimiter').clearValidators();
      } else {
        this.displayDelimiterSelection = true;
        this.form.get('delimiter').enable();
        this.form.get('delimiter').setValidators([Validators.required]);
      }


      if (this.selection === 'PDF_RETAKE_TEST_RESULT') {
        this.form.get('retakeTests').enable();
        this.form.get('retakeTests').setValidators([Validators.required]);
        this.getRetakeTestsForPdf();
      } else {
        this.form.get('retakeTests').disable();
        this.form.get('retakeTests').clearValidators();
      }
    }
  }

  OnSelectRNCPTitle(data) {
    this.scholarSeasones = [];
    if (data && data._id && this.selectedRNCP !== data) {
      this.selectedRNCP = data;
      this.resetfinalTransStateNtests();

      this.titleService
        .getSelectedScholarSeason(this.selectedRNCP._id)
        .subscribe(response => {
          log.data('getSelectedScholarSeason', response);
          if (response.length > 0) {
            this.scholarSeasones = _.sortBy(response, ['scholarseason']);
          } else {
            this.scholarSeasones = [];
          }
          this.form.controls['scholarSeason'].setValue('');
          this.form.controls['class'].setValue('');
        });
    }
  }

  OnSelectScholarSeason(data) {
    this.classes = [];
    if (data && data._id && this.selectedscholarSeason !== data) {
      this.selectedscholarSeason = data;
      this.resetfinalTransStateNtests();

      this.titleService
        .getClasses(this.selectedRNCP._id, this.page, this.sort)
        .subscribe(response => {
          log.data('OnSelectScholarSeason getClasses', response);
          if (response.total > 0) {
            this.classes = _.sortBy(response.classes, ['name']);
          } else {
            this.classes = [];
          }
          this.form.controls['class'].setValue('');
        });
    }
  }

  OnSelectClass(data) {
    if (data && data._id && this.selectedClass !== data) {
      this.selectedClass = data;
      this.resetfinalTransStateNtests();
      this.getFinalTranscriptStatus();
      if (this.selection === 'PDF_RETAKE_TEST_RESULT') {
        this.getRetakeTestsForPdf();
      }
    }
  }


  OnSelectDelimiter(data) {
    log.data('OnSelectDelimiter(data)', data);
    if (data) {
      this.delimiterSelection = data;
    }
  }

  resetfinalTransStateNtests() {
    this.selection = '';
    this.finalTransState = '';
    this.allRetakeTests = [];

  }

  submitTranscriptActions() {
    switch (this.selection) {
      case 'SCHOLAR_BOARD_SUBMISSION':
      case 'EXPORT_AFTER_DECISION_JURY':
      case 'EXPORT_RETAKE_ONLY':
      case 'SUBMISSION_AFTER_RETAKE':
        this.getTranscriptDetailsCSV(this.selection);
        break;
      case 'INPUT_FINAL_DECISION':
        this.redirectToTranscriptSchool();
        break;
      case 'PDF_RETAKE_TEST_RESULT':
        this.getTestDetails();
        break;
      case 'SUCCESS_STATISTICS':
        this.getSuccessStatistics();
        this.getFinalTranscriptStudentStatistic();
        break;
    }
  }

  getSuccessStatistics() {
    const parameters: any = { rncpId: this.selectedRNCP._id,
      classId: this.selectedClass._id,
      scholarSeasonId: this.selectedscholarSeason._id
    };
    this.finalTranscriptService.getFinalTranscriptStatisticPassFail(parameters).subscribe(
      (response) => {
        log.data('finalTranscriptService.getFinalTranscriptStatisticPassFail', response);
        this.getTranscriptDetailsCSV(this.selection);
        if (response.data && response.data.schools) {
          this.generateSchoolStatsCSV(response.data.schools, response.data.nationals);
        }
      });
  }

  getFinalTranscriptStudentStatistic() {
    const parameters: any = { rncpId: this.selectedRNCP._id,
      classId: this.selectedClass._id,
      scholarSeasonId: this.selectedscholarSeason._id
    };
    this.finalTranscriptService.getFinalTranscriptStudentStatistic(parameters).subscribe(
      (response) => {
        log.data('finalTranscriptService.getFinalTranscriptStudentStatistic', response);
        if (response.data && response.data && response.data.length) {
          this.generateStudentStatsCSV(response.data);
        }
      });
  }

  generateStudentStatsCSV(studentData) {
    let subjects = [];
    if ( studentData[0] && studentData[0].subjects ) {
      subjects =   [...studentData[0].subjects];
    }
    const titleColumn  = {
      school: this.translate.instant('FinalTranscript.School'),
      civility: this.translate.instant('Export_S1_COLUMNS.CIVILITY'),
      firstName: this.translate.instant('Export_S1_COLUMNS.FIRST_NAME'),
      lastName: this.translate.instant('Export_S1_COLUMNS.LAST_NAME'),
      final_ranking: this.translate.instant('FinalTranscript.RANKING'),
      final_marks: this.translate.instant('STUDENT.MARKS')
    };

    subjects.forEach( subject => {
      titleColumn[subject._id + '_ranking'] = this.translate.instant('FinalTranscript.RANKING');
      titleColumn[subject._id + '_marks'] = this.translate.instant('STUDENT.MARKS');
    });
    const headerColumns = [{}, titleColumn];

    studentData = [..._.orderBy(studentData, ['schoolShortName'], ['asc'])];

    const studentDataCSV = studentData.map((student) => {
      const studentCsvObj = {
        school: student.schoolShortName,
        civility: this.utilityService.computeCivility(student.studentSex,this.translate.currentLang),
        firstName: student.studentFirstName,
        lastName: student.studentLastName,
        final_ranking: student.finalScore ? !student.finalScore.rank ? 0 : student.finalScore.rank : '',
        final_marks: student.finalScore ? !student.finalScore.mark ? 0 : student.finalScore.mark : ''
      };
      subjects.forEach((subject) => {
        const studentSub = student.subjects.find((studentSubject) => studentSubject._id === subject._id);
        studentCsvObj[subject._id + '_ranking'] = studentSub && studentSub.hasOwnProperty('rank') ?
                                                    !studentSub.rank ? 0 : studentSub.rank : '';
        studentCsvObj[subject._id + '_marks'] = studentSub && studentSub.hasOwnProperty('total') ?
                                                    !studentSub.total ? 0 : studentSub.total : '';
      });

      return studentCsvObj;
    });

    const CSVData = [...headerColumns, ...studentDataCSV];



    const headersForCSV = [this.translate.instant('FinalTranscript.STUDENT_RANKING'), '', '', '',
    this.translate.instant('FinalTranscript.Final_Score'), ''];
    subjects.forEach(subject => {
      headersForCSV.push(subject.name);
      headersForCSV.push('');
    });
    log.data('headersForCSV after subjects loop', headersForCSV);

    const options = {
      fieldSeparator:
        this.delimiterSelection === 'tab' ? '\t' : this.delimiterSelection,
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      headers: headersForCSV
    };

    const setCSVFileName = this.translate.instant('FinalTranscript.STUDENT_RANKING');

    new Angular2Csv(CSVData, setCSVFileName, options);
    this.successSwalAndCloseDialog();
  }


  generateSchoolStatsCSV(schoolData, nationaldata) {
    const schoolStatsArray = [
      {}, {
        1: this.selectedRNCP.shortName, 2: '',
        3: this.selectedClass.name, 4: '',
        5: this.selectedscholarSeason.scholarseason,
        6: '', 7: '', 8: '', 9: ''
      }, {}, {1: '', 2: '', 3: '', 4: '1st Jury', 5: '', 6: '', 7: '', 8: '2nd Jury', 9: ''}, {
        1: this.translate.instant('FinalTranscript.SCHOOLS'),
        2: this.translate.instant('TEST.NOOFSTUDENTS'),
        3: this.translate.instant('FinalTranscript.RANKING'),
        4: this.translate.instant('FinalTranscript.CERTIFICATION_STATE.PASS1'),
        5: this.translate.instant('FinalTranscript.CERTIFICATION_STATE.FAILED'),
        6: this.translate.instant('FinalTranscript.CERTIFICATION_STATE.ELIMINATEDS'),
        7: this.translate.instant('FinalTranscript.RANKING'),
        8: this.translate.instant('FinalTranscript.CERTIFICATION_STATE.PASS1'),
        9: this.translate.instant('FinalTranscript.CERTIFICATION_STATE.FAILED'),
        10: this.translate.instant('FinalTranscript.CERTIFICATION_STATE.ELIMINATEDS')
      }
    ];

    if (nationaldata.hasOwnProperty('firstJury')) {
      schoolStatsArray.push({
        1: this.translate.instant('FinalTranscript.NATIONAL'),
        2: nationaldata.hasOwnProperty('totalStudents') ? nationaldata.totalStudents : '',
        3: '',
        4: nationaldata.firstJury.hasOwnProperty('pass') ? nationaldata.firstJury.pass + '%' : '',
        5: nationaldata.firstJury.hasOwnProperty('fail') ? nationaldata.firstJury.fail + '%' : '',
        6: nationaldata.firstJury.hasOwnProperty('eliminated') ? nationaldata.firstJury.eliminated + '%' : '',
        7: '',
        8: nationaldata.secondJury.hasOwnProperty('pass') ? !nationaldata.secondJury.pass ? '0%' :nationaldata.secondJury.pass + '%' : '',
        9: nationaldata.secondJury.hasOwnProperty('fail') ? !nationaldata.secondJury.fail ? '0%' : nationaldata.secondJury.fail + '%' : '',
        10: nationaldata.secondJury.hasOwnProperty('eliminated') ? !nationaldata.secondJury.eliminated ? '0%'
        : nationaldata.secondJury.eliminated + '%' : ''
      });
    }

      const schoolDataAray = [..._.orderBy(schoolData, ['shortName'], ['asc'])];
    if (schoolDataAray && schoolDataAray.length) {
      schoolDataAray.forEach(school => {
        schoolStatsArray.push(
          {
            1: school.shortName,
            2: school.hasOwnProperty('totalStudents') ? school.totalStudents : '',
            3: school.firstJury.hasOwnProperty('rank') ? school.firstJury.rank : '',
            4: school.firstJury.hasOwnProperty('pass') ? school.firstJury.pass + '%' : '',
            5: school.firstJury.hasOwnProperty('fail') ? school.firstJury.fail + '%' : '',
            6: school.firstJury.hasOwnProperty('eliminated') ? school.firstJury.eliminated + '%' : '',
            7: school.secondJury.hasOwnProperty('rank') ? school.secondJury.rank : '',
            8: school.secondJury.hasOwnProperty('pass') ? !school.secondJury.pass ? '0%' : school.secondJury.pass + '%' : '',
            9: school.secondJury.hasOwnProperty('fail') ? !school.secondJury.fail ? '0%' : school.secondJury.fail + '%' : '',
            10: school.secondJury.hasOwnProperty('eliminated') ? !school.secondJury.eliminated ? '0%' :
                                                              school.secondJury.eliminated + '%' : ''
        })});
    }

    const headersForCSV = [this.translate.instant('FinalTranscript.SCHOOL_RANKINGS'), '', '', '', '', '', '', '', ''];
    log.data('headersForCSV after subjects loop', headersForCSV);

    const options = {
      fieldSeparator:
        this.delimiterSelection === 'tab' ? '\t' : this.delimiterSelection,
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      headers: headersForCSV
    };

    const setCSVFileName = this.translate.instant('FinalTranscript.SCHOOL_RANKINGS');

    new Angular2Csv(schoolStatsArray, setCSVFileName, options);
  }
  getTranscriptDetailsCSV(selection) {
    log.data(
      'getTranscriptDetails selectedClass delimiterSelection',
      this.selectedClass,
      this.delimiterSelection
    );

    const parameters: any = { rncpId: this.selectedRNCP._id, classId: this.selectedClass._id };
    const getDataFromFinalTrasn = selection === 'EXPORT_AFTER_DECISION_JURY' ||
      selection === 'EXPORT_RETAKE_ONLY' ||
      selection === 'SUBMISSION_AFTER_RETAKE' || selection === 'SUCCESS_STATISTICS';

    if (getDataFromFinalTrasn) {
      parameters.reqFinalTranscript = true;
      if (selection === 'SUBMISSION_AFTER_RETAKE') {
        parameters.dataForFinalRetake = true;
      }
    }

    this.finalTranscriptService
      .getRecordsForFinalTranscript(parameters)
      .subscribe(
        response => {
          log.data('getTranscriptDetails response', response);
          if ( response.data &&
            response.data.students &&
            response.data.subjects ) {
            this.exportTestStatusCSV(
              response.data.subjects,
              response.data.students,
              getDataFromFinalTrasn
            )
          } else {
            this.someErrorOccuredSwal();
          }
        },
        error => {
          log.data('getTranscriptDetails error', error);
          this.someErrorOccuredSwal();
        }
      );
  }

  redirectToTranscriptSchool() {
    const params = {
      rncpId: this.selectedRNCP._id,
      scholarSeasonId: this.selectedscholarSeason._id,
      classId: this.selectedClass._id
    };

    this.finalTranscriptService.getSchoolRedirect(params).subscribe(
      (response) => {
        if (response.data && response.data._id) {
          const schoolId = response.data._id;
          log.data('redirectToTranscriptSchool response.data', response.data);
          this.router.navigate(['school', schoolId, 'edit', 0, { goto: 'finalCertification' }],
            { queryParams: { rncpId: this.selectedRNCP._id, classId: this.selectedClass._id } });
          this.closeDialog();
        }
    })
  }

  exportTestStatusCSV(subjects, studentsData, reqFinalTranscript: boolean) {

    const getSelectedTests = (tests, onlyStudentSelected: boolean): string => {
      let retakeTestsString = '';
      tests.forEach(test => {
        if (!onlyStudentSelected || test.isTestAcceptedByStudent) {
          retakeTestsString += test.name + '\n';
        }
      });

      return retakeTestsString;
    };

    log.data('exportTestStatusCSV reqFinalTranscript', reqFinalTranscript);
    let transcriptStudents = studentsData.map(student => {
      const csvColumnValues = {
        schoolShortName: student.school.shortName,
        rncpShortName: student.rncpTitle.shortName,
        class: student.currentClass.name,
        scholarSeason: student.scholarSeason.scholarseason,
        civility: this.utilityService.computeCivility(
          student.sex,
          this.translate.currentLang
        ),
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,

        // Certification_Status: student.certificationStatus
        //   ? this.translate.instant(
        //     'FinalTranscript.CERTIFICATION_STATE.' +
        //     student.certificationStatus.toUpperCase()
        //   )
        //   : '',
      };
      // Needed for CSV Generation of SUCCESS_STATISTICS
      if ( this.selection === 'SUCCESS_STATISTICS' ) {
        csvColumnValues['DATE_BIRTH'] = student.dateOfBirth ? student.dateOfBirth : '';
        csvColumnValues['PLACE_BIRTH'] = student.placeOfBirth ? student.placeOfBirth : '';
      }
        // Transcript Status Fileds
        csvColumnValues['Final_Score'] = _.get(student, 'finalScore', ' ');

        if (this.selection === 'SCHOLAR_BOARD_SUBMISSION') {
          csvColumnValues['Certification_Status'] = student.certificationStatus ? this.translate.instant('FinalTranscript.CERTIFICATION_STATE.' + student.certificationStatus.toUpperCase()) : '';
        } else {
          csvColumnValues['Certification_Status'] = 
          reqFinalTranscript && student.finalTranscriptId && student.finalTranscriptId.afterFinalRetakeDecision ?
          this.translate.instant('FINAL_TRANSCRIPT.CERTIFICATION_STATUS.' + student.finalTranscriptId.afterFinalRetakeDecision.toUpperCase()) :
          (student.finalTranscriptId && student.finalTranscriptId.juryDecisionForFinalTranscript && student.finalTranscriptId.juryDecisionForFinalTranscript && student.finalTranscriptId.juryDecisionForFinalTranscript.toUpperCase() === 'PASS' ?
          this.translate.instant('FINAL_TRANSCRIPT.CERTIFICATION_STATUS.' + student.finalTranscriptId.juryDecisionForFinalTranscript.toUpperCase()) :
          student.finalTranscriptId && student.finalTranscriptId.certificationStatus ?
          this.translate.instant('FinalTranscript.CERTIFICATION_STATE.' + student.finalTranscriptId.certificationStatus.toUpperCase()) : '');
        }


        csvColumnValues['Decision_Jury'] =  reqFinalTranscript && student.finalTranscriptId && student.finalTranscriptId.juryDecisionForFinalTranscript &&
        student.finalTranscriptId.juryDecisionForFinalTranscript !== 'initial' ?
        this.translate.instant('FINAL_TRANSCRIPT.CERTIFICATION_STATUS.' + student.finalTranscriptId.juryDecisionForFinalTranscript.toUpperCase())
        : '';

      // Not Need for CSV Generation After Completion of Retake Tests
      if (this.selection !== 'SUBMISSION_AFTER_RETAKE' && this.selection !== 'SUCCESS_STATISTICS') {
        csvColumnValues['Suggested_Retake'] = reqFinalTranscript && student.finalTranscriptId &&
          student.finalTranscriptId.retakeTestsForStudents
          ? getSelectedTests(student.finalTranscriptId.retakeTestsForStudents, false)
          : ' ';
        }

      // Only Required After Initialization of Final Transcript Flow for Students
      if (reqFinalTranscript) {
        if (this.selection !== 'SUBMISSION_AFTER_RETAKE' && this.selection !== 'SUCCESS_STATISTICS') {
          csvColumnValues['studentDecision'] = student.finalTranscriptId && student.finalTranscriptId.studentDecision &&
            student.finalTranscriptId.studentDecision !== 'initial' ?
            this.translate.instant('Export_S1_COLUMNS.STUDENT_DESCISION.' + student.finalTranscriptId.studentDecision.toUpperCase())
            : '';
        }
        csvColumnValues['retakeTestsForStudents'] = reqFinalTranscript && student.finalTranscriptId &&
          student.finalTranscriptId.retakeTestsForStudents ?
          getSelectedTests(student.finalTranscriptId.retakeTestsForStudents, true)
          : ' ';
      }

      // Dynamic Test Property and Mark value ingection based on number of subjects
      subjects.forEach(subject => {
        const subjectId = subject._id.toString();
        const subjectFromStudent = student.subjects.find(subject => {
          return subject._id && subject._id === subjectId;
        });

        csvColumnValues[subjectId] = subjectFromStudent ? subjectFromStudent.total : '';
        if (subject.tests.length > 1) {
          subject.tests.forEach(subjectTest => {
            const subjectTestId = subjectTest._id.toString();
            let subjectTestIdFromStudent = null;
            if (subjectFromStudent) {
              subjectTestIdFromStudent = subjectFromStudent.tests.find(test => {
                return test._id && test._id === subjectTestId;
              });
            }
            csvColumnValues[subjectTestId] = subjectTestIdFromStudent && subjectTestIdFromStudent.total !== false ? subjectTestIdFromStudent.total : ' ';
          });
        }
      });

      return csvColumnValues;
    });

    if (this.selection === 'EXPORT_RETAKE_ONLY' || this.selection === 'SUBMISSION_AFTER_RETAKE') {
      const retakeTransString = this.translate.instant('FINAL_TRANSCRIPT.CERTIFICATION_STATUS.RETAKING');
      transcriptStudents = [..._.filter(transcriptStudents, (student) => {
        return student.Decision_Jury === retakeTransString;
      })];
      if ( this.selection === 'SUBMISSION_AFTER_RETAKE') {
        transcriptStudents = [..._.forEach(transcriptStudents, (student) => {
          student['Decision_Jury'] = ' ';
        })];
      }
    }

    // CSV Custom Header Colum With Translations and Subject & Test Names
    const csvCustomHeaderColum = {
      schoolShortName: this.translate.instant('Export_S1_COLUMNS.SCHOOL'),
      rncpShortName: this.translate.instant('Export_S1_COLUMNS.RNCP_TITLE'),
      class: this.translate.instant('Export_S1_COLUMNS.CLASS'),
      scholarSeason: this.translate.instant('Export_S1_COLUMNS.SCOLAR_SEASON'),
      civility: this.translate.instant('Export_S1_COLUMNS.CIVILITY'),
      firstName: this.translate.instant('Export_S1_COLUMNS.FIRST_NAME'),
      lastName: this.translate.instant('Export_S1_COLUMNS.LAST_NAME'),
      email: this.translate.instant('Export_S1_COLUMNS.EMAIL'),
    };

    if (this.selection === 'SUBMISSION_AFTER_RETAKE' || this.selection === 'SUCCESS_STATISTICS') {
      if ( this.selection === 'SUCCESS_STATISTICS' ) {
        csvCustomHeaderColum['DATE_BIRTH'] = this.translate.instant('Export_S1_COLUMNS.Date of Birth');
        csvCustomHeaderColum['PLACE_BIRTH'] = this.translate.instant('Export_S1_COLUMNS.Place of Birth');
      }
      csvCustomHeaderColum['Final_Score'] = this.translate.instant('Export_S1_COLUMNS.FINAL_SCORE_AFTER_RETAKE');
      csvCustomHeaderColum['Certification_Status'] = this.translate.instant('Export_S1_COLUMNS.CERTIFICATION_STATUS_AFTER_RETAKE');
      csvCustomHeaderColum['Decision_Jury'] = this.translate.instant('Export_S1_COLUMNS.JURY_DECISION_AFTER_RETAKE');
      // csvCustomHeaderColum['Suggested_Retake'] = this.translate.instant('FinalTranscript.Suggested_Retake');
    } else {
      csvCustomHeaderColum['Final_Score'] = this.translate.instant('FinalTranscript.Final_Score');
      csvCustomHeaderColum['Certification_Status'] = this.translate.instant('FinalTranscript.Certification_Status');
      csvCustomHeaderColum['Decision_Jury'] = this.translate.instant('FinalTranscript.Decision_Jury');
      csvCustomHeaderColum['Suggested_Retake'] = this.translate.instant('FinalTranscript.Suggested_Retake');
    }

    if (reqFinalTranscript) {
      if (this.selection !== 'SUBMISSION_AFTER_RETAKE' && this.selection !== 'SUCCESS_STATISTICS') {
        csvCustomHeaderColum['studentDecision'] = this.translate.instant('Export_S1_COLUMNS.Student Decision');
      }
      csvCustomHeaderColum['retakeTestsForStudents'] = this.translate.instant('Export_S1_COLUMNS.Student Retake');
    }

    subjects.forEach(subject => {
      const subjectId = subject._id.toString();
      csvCustomHeaderColum[subjectId] = subject.subjectName;
      if (subject.tests.length > 1) {
        subject.tests.forEach(subjectTest => {
          const subjectTestId = subjectTest._id.toString();
          csvCustomHeaderColum[subjectTestId] = subjectTest.name;
        });
      }
    });

    transcriptStudents.unshift(csvCustomHeaderColum);
    log.data('exportTestStatusCSV transcriptStudents', transcriptStudents);

    // Header With Co-efficient Only
    let headersForCSV = ['', '', '', '', '', '', '', '', '', '', '', ''];
    if (this.selection === 'EXPORT_AFTER_DECISION_JURY') {
      headersForCSV = [...headersForCSV.concat(['', ''])];
    }
    subjects.forEach(subject => {
      headersForCSV.push(subject.coefficient);
      if (subject.tests.length > 1) {
        subject.tests.forEach(test => {
          headersForCSV.push('');
        });
      }
    });

    log.data('headersForCSV after subjects loop', headersForCSV);

    const options = {
      fieldSeparator:
        this.delimiterSelection === 'tab' ? '\t' : this.delimiterSelection,
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      headers: headersForCSV
    };

    let setCSVFileName = `${this.translate.instant('FinalTranscript.' + this.selection)} - ${this.selectedRNCP.shortName} - ${
      this.selectedClass.name
      } - ${this.translate.instant('FinalTranscript.title')} - ${moment().format('DD-MM-YYYY')}`;

    if (this.selection === 'SUCCESS_STATISTICS') {
      setCSVFileName = this.translate.instant('FinalTranscript.Student Final Result');
    }

    new Angular2Csv(transcriptStudents, setCSVFileName, options);
    if (this.selection !== 'SUCCESS_STATISTICS') {
      this.successSwalAndCloseDialog();
    }
  }

  closeDialog(): void {
    this.dialogref.close();
  }

  successSwalAndCloseDialog() {
    swal({
      type: 'success',
      title: this.translate.instant('SUCCESS'),
      allowEscapeKey: true,
      confirmButtonText: 'OK'
    }).then(isConfirm => {
      this.closeDialog();
    });
  }

  getFinalTranscriptStatus() {
    const params = {
      rncpId: this.selectedRNCP._id,
      scholarSeasonId: this.selectedscholarSeason._id,
      classId: this.selectedClass._id
    };
    this.finalTranscriptService.getFinalTranscriptStatus(params).subscribe(
      (response) => {
        if (response.status === 'OK' && response.data) {
          log.data('getFinalTranscriptStatus response', response);
          this.finalTransState = response.data;
        }
      }
    );
  }

  getRadioDisableState() {
    switch (this.finalTransState) {
      case 'trans_State_1':
        return [false, true, true, true, true, true, true];
      case 'trans_State_2':
        return [false, false, true, true, true, true, true];
      case 'trans_State_3':
        return [true, true, false, false, false, false, true];
      case 'trans_State_4':
        return [true, true, false, false, false, false, false];
      default:
        return [true, true, true, true, true, true, true];
    }
  }

  someErrorOccuredSwal() {
    swal({
      title: this.translate.instant('STUDENT.MESSAGE.ERRORTIT'),
      html: this.translate.instant('STUDENT.MESSAGE.FAILEDMESSAGE'),
      confirmButtonClass: 'btn-danger',
      confirmButtonText: this.translate.instant(
        'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_BTN'
      ),
      type: 'error',
      allowEscapeKey: true
    });
  }

  getRetakeTestsForPdf() {
    const params = {
      rncpId: this.selectedRNCP._id,
      scholarSeasonId: this.selectedscholarSeason._id,
      classId: this.selectedClass._id
    };
    this.finalTranscriptService.getFinalTranscriptTestsForFinalRetake(params).subscribe(
      (response) => {
        if (response.status === 'OK' && response.data.length) {
          const allRetakeTestsResp = [...response.data.map((testREsp) => { return { text: testREsp.name, id: testREsp._id } })];
          this.allRetakeTests = [..._.sortBy(allRetakeTestsResp, ['text'])];
        }
      });
  }

  getTestDetails() {

    const pdfGenerate = () => {
      const testIds = [this.form.get('retakeTests').value['id']];

      this.finalTranscriptService.getFinalTranscriptgetCorrectionsPDF({ testIds }).subscribe(
        (response) => {
          if (response.data && response.data.length) {
            this.selectTestLength = response.data.length;
            this.testDetails = response.data[0].test;
            this.searchedStudents = [..._.sortBy(response.data[0].corrections, ['student.school.shortName'])];
            this.renderData();
          }
        });
    }

    swal({
      title: this.translate.instant('FINAL_TRANSCRIPT.FINAL_PDFQ.TITLE'),
      html: this.translate.instant('FINAL_TRANSCRIPT.FINAL_PDFQ.TEXT', {
        testNames: this.form.get('retakeTests').value['text']
      }),
      type: 'question',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('FINAL_TRANSCRIPT.FINAL_S1.YES'),
      cancelButtonText: this.translate.instant('FINAL_TRANSCRIPT.FINAL_S1.NO'),
    }).then(function (isConfirm) {
      if (isConfirm) {
        pdfGenerate();
      }
    });
  }

  renderData() {
    const sections = this.testDetails.correctionGrid.correction.sections;
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
    setTimeout(
      () => this.downloadPDFDetails(), 10
    );
  }


  downloadPDFDetails() {
    const ele = document.getElementById('pdfdocFORDetails');
    let totalPage = this.searchedStudents.length * this.pageSectionsArray.length - 1;
    let html = '<div ><div class="doc-page-no" style="text-align:right;font-size:12px;margin-right:30px;margin-bottom:-95%"></div>';
    html = html + `<div class="document orientation-portrait"><div class="pa-1" style="height:0.5%;"></div></div>`;

    const target = this.documentPagesRef.nativeElement.children;
    const outer = document.createElement('div');
    outer.innerHTML = '';
    let studentsHtml = '';
    for (const element of target) {
      const wrap = document.createElement('div');
      const el = element.cloneNode(true);
      el.style.display = 'block';
      wrap.appendChild(el);
      studentsHtml += wrap.innerHTML;
    }
    studentsHtml = studentsHtml.replace(/\$/g, ' ');
    html += `<div class="ql-editor document-parent" style="margin-top: -355px;">` + studentsHtml + `</div></div>`;
    this.pdfDocument = this.pdfDocument + html;
    this.generatePDF(this.pdfDocument);
  }

  generatePDF(html) {
    const filename = `${this.selectedRNCP.shortName} - ${this.selectedClass.name} - ${this.form.get('retakeTests').value['text']
      } - ${this.translate.instant('FINAL_TRANSCRIPT.RESULTS_BEFORE_FINAL_RETAKE')} - ${moment().format('DD-MM-YYYY')}`;
    const landscape = false;
    const htmlAndStyle = PRINTSTYLES + html;
    this.pdfService.getPDF(htmlAndStyle, filename, landscape, true).subscribe(res => {
      if (res.status === 'OK') {
        var link = document.createElement('a');
        link.setAttribute("type", "hidden"); // make it hidden if needed
        link.download = res.filename;
        link.target = '_blank';
        link.href = Print.url + res.filePath;
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.successSwalAndCloseDialog();
      }
    });
  }


  getScore(row) {
    const correctedTests = row.correctedTests;

    if (correctedTests && correctedTests && correctedTests[0] && row.correctedTests[0].correction) {
      if (row.correctedTests[0].correction.missingCopy) {
        return this.translate.instant('TESTCORRECTIONS.MISSINGCOPY');
      }
    }


    if (this.testDetails.groupTest && row['testCorrectionId'] && row['testCorrectionId']['_id']) {
      if (row['testCorrectionId'].missingCopy) {
        return this.translate.instant('TESTCORRECTIONS.MISSINGCOPY');
      }
      if (this.testDetails && this.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal === true) {
        return row['testCorrectionId'] && row['testCorrectionId']['_id'] ?
          row['testCorrectionId']['correctionGrid']['correction']['additionalTotal'] : '-';
      } else {
        return row['testCorrectionId'] && row['testCorrectionId']['_id'] ?
          row['testCorrectionId']['correctionGrid']['correction']['total'] : '-';
      }
    }


    if (this.testDetails && this.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal === true) {
      const additionalTotal = correctedTests && correctedTests[0] && correctedTests[0].correction ?
        correctedTests[0].correction.correctionGrid.correction.additionalTotal : '-';
      return additionalTotal;
    } else {
      return correctedTests && correctedTests && correctedTests[0] && correctedTests[0].correction ?
        correctedTests[0].correction.correctionGrid.correction.total : '-';
    }

  }


  getMaxScore() {
    if (this.testDetails.type === 'free-continuous-control') {
      return 20;
    }

    let a = 0;
    this.testDetails.correctionGrid.correction.sections.forEach((section, index) => {
      a += section.maximumRating;
    });
    return a;
  }


  getTitleWidth() {
    const correction = this.testDetails.correctionGrid.correction;
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

  getArrayExceptFirst() {
    return this.pageSectionsArray.slice(1);
  }
  //get the section index for section page PDF.
  getSectionIndex(sectionIndex, indesPSA) {
    if (indesPSA !== 0 && this.pageSectionsArray) {
      let preIndex = parseInt(indesPSA) - 1;
      return parseInt(sectionIndex) + parseInt(this.pageSectionsArray[preIndex] ? this.pageSectionsArray[preIndex].length : 0)
    } else {
      return parseInt(sectionIndex);
    }
  }
}
