import { Component, OnInit, ViewChild } from '@angular/core';
import { MdAutocompleteTrigger } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomerService } from '../customer/customer.service';
import _ from 'lodash';
import { Page } from 'app/models/page.model';
import { QualityControlService } from '../../services/quality-control.service';
import { Sort } from '../../models/sort.model';
import { TranslateService } from 'ng2-translate';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';


@Component({
  selector: 'app-quality-control',
  templateUrl: './quality-control.component.html',
  styleUrls: ['./quality-control.component.scss']
})
export class QualityControlComponent implements OnInit {

  rncpClassTestName = '';
  testId: string;
  schoolList = [];
  delimeterList = [
    { key: 'COMMA', value: ',' },
    { key: 'SEMICOLON', value: ';' },
    { key: 'TAB', value: '\t' }
  ];
  delimiterSelected = this.delimeterList[0].value;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  page = new Page();
  sort = new Sort();
  qualityControlList = [];
  fillteredQualityControlList = [];
  filterObject = {
    school: [],
    filterText: ''
  };
  constructor(
    public activatedRoute: ActivatedRoute,
    private custService: CustomerService,
    private qualityControlService: QualityControlService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    this.routeChangeSubcribe();
  }
  // :rncpId/:classId/:testId'
  routeChangeSubcribe() {
    this.activatedRoute.params.subscribe(params => {
      this.testId = params['testId'];
      this.getStudentsQualityControlTable(params['testId']);
      this.getAllSchoolsBasedOnRncp({'rncpIds': [params['rncpId']]});
      const routeData = JSON.parse(params['routeData']);
      this.rncpClassTestName = `${routeData.rncp.name} - ${routeData.class.name} - ${routeData.test.name}`;
    });
  }

  getAllSchoolsBasedOnRncp(payload) {
    this.custService.getSchoolBasedOnRNCP(payload).subscribe(schools => {
      this.schoolList = schools.data.filter( school => school && school._id);
      this.schoolList = [..._.orderBy(this.schoolList.map(school => ({
        id: school._id,
        text: school.shortName
      })), ['text'], ['asc'])];
    });
  }

  getStudentsQualityControlTable(testId) {
    this.qualityControlService.getStudentsForQualityControlTable(testId).subscribe(
      (response) => {
        console.log('getStudentsQualityControlTable ', response.data);
        this.qualityControlList = response.data;
        /*this.fillteredQualityControlList = response.data;*/
        this.fillteredQualityControlList = _.orderBy(this.qualityControlList, ['studentLastName'], ['asc']);
        this.page.totalElements = this.fillteredQualityControlList.length;
      }
    );
  }

  filteredListOfQC() {
    this.fillteredQualityControlList = this.qualityControlList.filter(
      (qControl) => {
        let filtertext = true;
        let filterSchool = true;

        if (this.filterObject.filterText) {
          filtertext = qControl.school !== '' &&
            qControl.studentLastName.toLowerCase().indexOf(this.filterObject.filterText.toLowerCase()) !== -1;
        }

        if (this.filterObject.school.length) {
          filterSchool = qControl.schoolId === this.filterObject.school[0].id;
        }

        return filtertext && filterSchool;
    });

  }

  resetSearch() {
    this.filterObject.school = [];
    this.filterObject.filterText = '';
    this.getStudentsQualityControlTable(this.testId);
  }
  selectDelimiter(del) {
    console.log(this.delimiterSelected);
    console.log(del);

  }

  exportCSV () {
    const exportedStudents = this.qualityControlList;

    const studentsBeingExported = exportedStudents.map( student => {
      return {
        'studentFirstName': _.get(student, 'studentFirstName', ''),
        'studentLasttName': _.get(student, 'studentLastName', ''),
        'school': _.get(student, 'school', ''),
        'testCorrectionMark': _.get(student, 'testMarks', ''),
        'qualityControlMark': _.get(student, 'QCMarks', ''),
        'different': _.get(student, 'difference', ''),
      }
    });
    const options = {
      fieldSeparator: this.delimiterSelected === 'tab' ? '\t' : this.delimiterSelected,
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: [
        this.translate.instant('STUDENT_INFORMATION.FIRSTNAME'),
        this.translate.instant('STUDENT_INFORMATION.LASTNAME'),
        this.translate.instant('SCHOOLTITLE'),
        this.translate.instant('QUALITY_CONTROL.Test_correction_mark'),
        this.translate.instant('QUALITY_CONTROL.Quality_Control_mark'),
        this.translate.instant('QUALITY_CONTROL.Different'),
      ]
    };
    const setCSVFileName = this.translate.instant('QUALITY_CONTROL.TITLE') + '-' + this.rncpClassTestName;
    new Angular2Csv(studentsBeingExported, setCSVFileName, options);
  }

  changeSchool(event) {
    this.filterObject.school = [];
    this.filterObject.school.push(event);
    this.filteredListOfQC();
  }
  sortPage(sortInfo) {
    const sortMode = sortInfo.newValue;
    const sortBy = sortInfo.column.name;
    this.fillteredQualityControlList = _.orderBy(this.qualityControlList, [sortBy], [sortMode]);
  }
}
