import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Page } from 'app/models/page.model';
import { Sort } from 'app/models/sort.model';
import _ from 'lodash';
import { TranslateService } from 'ng2-translate';
import { CrossCorrectionService } from 'app/components/cross-correction/cross-correction.service';
import { RNCPTitlesService } from 'app/services/rncp-titles.service';
import { Subscription } from 'rxjs';
import { TestCorrectionService, UtilityService } from 'app/services';
import { MdAutocompleteTrigger } from '@angular/material';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
declare var swal: any;
import * as moment from 'moment';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-cross-correction-list',
  templateUrl: './cross-correction-list.component.html',
  styleUrls: ['./cross-correction-list.component.scss']
})
export class CrossCorrectionListComponent implements OnInit, OnDestroy {

  @ViewChild(MdAutocompleteTrigger) autoSchool;
  @ViewChild(MdAutocompleteTrigger) autoCorrector;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public form: FormGroup;
  public formSchoolCorrecting: FormGroup;
  SelectedTitleName;
  selectedSchoolForFilter;
  school;
  filteredOptionsSchool: Observable<string[]>;
  filteredOptionsSchoolCorrecting: Observable<string[]>;
  selectedRNCP;
  searchedStudents: any[] = [];
  AllStudentsLists: any[] = [];
  searchedSchools: any[] = [];
  selectedIndex = 0;
  allSchools = [];
  updatedCorrections = [];
  allSchoolData = [];
  delimeterList = [
    { key: 'COMMA', value: ',' },
    { key: 'SEMICOLON', value: ';' },
    { key: 'TAB', value: '\t' }
  ];
  delimiterSelected = this.delimeterList[0].value;

  page = new Page();
  reorderable = true;

  students: any[] = [];
  ngxDtCssClasses = { sortAscending: 'fa fa-caret-up', sortDescending: 'fa fa-caret-down', pagerLeftArrow: 'icon-left', pagerRightArrow: 'icon-right', pagerPrevious: 'icon-prev', pagerNext: 'icon-skip' };
  private subscription: Subscription;
  titleId;
  classId;
  TestId;
  schoolCorrectingList = [];
  schoolAllListTab2 = [];
  selectedRNCPDetails;
  isSaved = false;
  testDetails;
  classDetails;
  sort = new Sort();
  selectedSchoolText = [];
  assignedSchoolCorrecting = [];
  constructor(
    private router: Router,
    private activerouter: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private svrcrosscorrection: CrossCorrectionService,
    private appService: RNCPTitlesService,
    private testCorrectionService: TestCorrectionService,
    private location: Location,
    public utilityService: UtilityService
  ) {
    this.form = this.fb.group({ school: [''], schoolCorrectingFilter: [''] });
    this.school = this.form.controls['school'];
    this.filteredOptionsSchool = this.form.get('school').valueChanges
      .startWith(null)
      .map(list => list ? this.filterSchool(list) : this.schoolCorrectingList.slice());

    this.filteredOptionsSchoolCorrecting = this.form.get('schoolCorrectingFilter').valueChanges
      .startWith(null)
      .map(School => School ? this.filterSchoolCorrecting(School) : this.assignedSchoolCorrecting.slice());

    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';

    this.delimiterSelected = this.delimeterList[0].value;
  }

  ngOnInit() {
    // this.updatedCorrections = [];
    this.subscription = this.activerouter.params.subscribe(qParams => {
      if (qParams['titleId'] && qParams['classId'] && qParams['TestId']) {
        this.titleId = qParams['titleId'];
        this.classId = qParams['classId'];
        this.TestId = qParams['TestId'];

        // Get RNCP Title Details
        this.appService.getRNCPTitlesById(this.titleId).subscribe((title) => {
          this.selectedRNCPDetails = title.data;
          this.SelectedTitleName = this.selectedRNCPDetails.shortName;
        });

        // Get Class Details
        this.appService.getClasses(this.titleId, this.page, this.sort).subscribe(data => {
          if (data.total === 0) {

          } else {
            for (let i = 0; i < data.classes.length; i++) {
              const element = data.classes[i];
              if (element._id === this.classId) {
                this.classDetails = element;
                console.log(this.classDetails);
              }

            };
          }

        });

        // Get Test Details
        this.testCorrectionService.getTest(this.TestId).subscribe((value) => {
          this.testDetails = value;
          console.log(this.testDetails);
        });

        this.isSaved = false;

        // Get Cross Correction list based on selected Title, Class and Test
        this.getCrossCorrections();

      } else {
        console.log('Invalid Url');
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openSchoolSuggestionList() {
    this.autoSchool.openPanel();

    // For School Filter List, CHeck if the School Origin's all students are assigned, if assigned font-color of that school needs to be green
    this.schoolCorrectingList.forEach(school => {
      let count = 0;
      const filteredStudents = this.AllStudentsLists.filter(student => {
        if (student['schoolOriginId']['_id'] === school._id) {
          count++;
          return (student['schoolOriginId']['_id'] === school._id) && student['schoolCorrectingCorrectorId'];
        }
      });
      if (count === 0) {
        school['showGreen'] = false;
      } else {
        if (filteredStudents.length === count) {
          school['showGreen'] = true;
          // return true;
        } else {
          school['showGreen'] = false;
          // return false;
        }
      }
    });


    this.filteredOptionsSchool = this.form.get('school')
      .valueChanges.startWith('')
      .map(list => list ? this.filterSchool(list) : this.schoolCorrectingList.slice());
    this.schoolCorrectingList = [...this.schoolCorrectingList];
  }

  getCrossCorrections() {
    const self = this;
    this.svrcrosscorrection.getSchoolsAndCorrectors({ rncpId: this.titleId, classId: this.classId }).subscribe(res => {
      if (res && res.data) {
        console.log(res.data);
        this.allSchoolData = res.data
        self.schoolCorrectingList = res.data;
        this.getassignedSchoolCorrectingList();
        self.getSchoolAllListTab2();
      }
    }, (error) => { });
    this.updateForm();
  }

  updateForm() {
    const self = this;
    this.svrcrosscorrection.getRecords({ rncpTitleId: this.titleId, classId: this.classId, testId: this.TestId }).subscribe(res => {
      if (res && res.data) {
        if (res.data.length === 0) {
          self.svrcrosscorrection.getStudent({ 'rncpId': this.titleId, 'classId': this.classId }).subscribe(resStudent => {
            console.log(resStudent);
            if (resStudent.data.length > 0) {
              self.searchedStudents = [];
              self.AllStudentsLists = [];
              for (let i = 0; i < resStudent.data.length; i++) {
                const element = resStudent.data[i];

                const convertToCrossSchema = {
                  classId: this.classId,
                  rncpTitleId: this.titleId,
                  scholarSeasonId: element.scholarSeason,
                  schoolCorrectingCorrectorId: '',
                  schoolCorrectingId: '',
                  schoolOriginId: {
                    longName: element.school['longName'],
                    shortName: element.school['shortName'],
                    _id: element.school['_id']
                  },
                  studentId: {
                    firstName: element['firstName'],
                    lastName: element['lastName'],
                    sex: element['sex'],
                    _id: element['_id']
                  },
                  testId: this.TestId
                };

                self.searchedStudents.push(convertToCrossSchema);
                self.AllStudentsLists.push(convertToCrossSchema);
              }

              const test = [];
              for (let index = 0; index < self.searchedStudents.length; index++) {
                const element = self.searchedStudents[index];
                test['school' + index] = ['', Validators.required];
                test['corrector' + index] = ['', Validators.required];
                self.selectedSchoolText[index] = [];
              }
              self.formSchoolCorrecting = self.fb.group(test);
              self.isSaved = self.formSchoolCorrecting.valid;
              self.getSchoolAllListTab2();
              this.saveAllDataWhileLoadingItForFirstTime();
            }
          }, (error) => { });
        } else {
          this.AssignDataToForm(res.data, false);
        }
      }
    }, (error) => { });
  }

  getassignedSchoolCorrectingList() {
    this.assignedSchoolCorrecting = this.schoolCorrectingList;
    this.assignedSchoolCorrecting = [...this.assignedSchoolCorrecting];
  }

  AssignDataToForm(data, isSearched) {
    this.AllStudentsLists = data;
    if (this.selectedSchoolForFilter) {
      this.searchedStudents = [];
      this.AllStudentsLists.forEach(student => {
        if (this.selectedSchoolForFilter === student['schoolOriginId']['_id']) {
          this.searchedStudents.push(student);
        }
      });
    } else {
      this.searchedStudents = [];
      this.searchedStudents = data;
    }

    let test = [];
    this.searchedStudents.forEach((student, index) => {
      const element = student;
      test['school' + index] = [element['schoolCorrectingId'] ? element['schoolCorrectingId']['_id'] : '', Validators.required];
      test['corrector' + index] = [element['schoolCorrectingCorrectorId'] ? element['schoolCorrectingCorrectorId']['_id'] : '', Validators.required];
      this.selectedSchoolText[index] = [{
        id: element['schoolCorrectingCorrectorId'] ? element['schoolCorrectingId']['_id'] : '',
        text: element['schoolCorrectingCorrectorId'] ? element['schoolCorrectingId']['shortName'] : ''
      }];
    });

    this.formSchoolCorrecting = this.fb.group(test);
    this.isSaved = this.formSchoolCorrecting.valid;
    // this.searchedStudents = _.sortBy(this.searchedStudents, function(s) {
    //   return s.schoolOriginId.shortName;
    // });
    if (!isSearched) {
      this.getSchoolAllListTab2();
    }
  }

  /*Filters Functions */
  filterSchool(name: string) {
    return this.schoolCorrectingList.filter(list => list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterSchoolCorrecting(name: string) {
    return this.assignedSchoolCorrecting.filter(list => list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  resetSearch() {
    this.form.controls['school'].setValue('');
    this.form.controls['schoolCorrectingFilter'].setValue('');
    this.selectedSchoolForFilter = '';
    this.updatedCorrections = [];
    this.getCrossCorrections();
    this.table.offset = 0;
    // this.selectedSchoolForFilter ? this.AssignDataToForm(this.AllStudentsLists, false) : this.buildCorrectionTable(this.AllStudentsLists);
  }
  OnSelectSchool(data) {
    this.table.offset = 0;
    if (data && data._id) {

      this.selectedSchoolForFilter = data._id;


      this.searchedStudents = [];
      this.AllStudentsLists.forEach((student, i) => {
        if (this.selectedSchoolForFilter === student['schoolOriginId']['_id']) {
          this.searchedStudents.push(student);
        }
      });

    } else {
      this.searchedStudents = this.AllStudentsLists;
    }
    this.AssignDataToForm(this.AllStudentsLists, true);
  }
  sortPage(sortInfo): void {
    const sort = new Sort();
    sort.sortby = sortInfo.column.prop;
    sort.sortmode = sortInfo.newValue;
    this.table.offset = 0;
    this.searchedStudents = _.orderBy(this.searchedStudents, [sort.sortby], [sort.sortmode]);
    this.buildCorrectionTable(this.searchedStudents);
  }

  sortPageForSchools(sortInfo) {
    const sort = new Sort();
    sort.sortby = sortInfo.column.prop;
    sort.sortmode = sortInfo.newValue;
    this.table.offset = 0;
    this.allSchools = _.orderBy(this.allSchools, [sort.sortby], [sort.sortmode]);
    console.log(this.allSchools);
  }



  /*Save Operations */
  save(leave) {

    console.log('updated', this.updatedCorrections);

    this.svrcrosscorrection.saveCrossCorrection({ data: this.updatedCorrections }).subscribe(res => {
      if (res['status'] === 'OK') {
        this.updatedCorrections = [];
        swal({
          title: this.translate.instant('CrossCorrection.CROSS_S2.Title'),
          text: false,
          type: 'success',
          allowEscapeKey: true,
          confirmButtonText: this.translate.instant('CrossCorrection.CROSS_S2.Button')
        });
        this.isSaved = true;
        this.updateForm();
        if (leave) {
          this.location.back();
        }
      }
    }, (error) => { });

  }

  sendNotification() {
    const self = this;
    const data = {
      rncpId: this.titleId,
      classId: this.classId,
      testId: this.TestId,
      lang: this.translate.currentLang,
      schoolId: ''
    };

    if (this.selectedSchoolForFilter) {
      data.schoolId = this.selectedSchoolForFilter;
    }
    swal({
      title: this.translate.instant('CrossCorrection.CROSS_S1.Title'),
      text: this.translate.instant('CrossCorrection.CROSS_S1.Text'),
      type: 'question',
      allowEscapeKey: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant('CrossCorrection.CROSS_S1.Cancle'),
      confirmButtonText: this.translate.instant('CrossCorrection.CROSS_S1.OK')
    }).then(
      () => {

        self.svrcrosscorrection.sendCrossNotification(data).subscribe(status => {

          if (status) {
            this.updatedCorrections = [];
            swal({
              title: self.translate.instant('CrossCorrection.CROSS_S4.Title'),
              text: self.translate.instant('CrossCorrection.CROSS_S4.Text'),
              type: 'success',
              allowEscapeKey: true,
              confirmButtonText: self.translate.instant('CrossCorrection.CROSS_S4.Button')
            });
            self.location.back();
            return data;
          }
        }, (error) => { });
      },
      function (dismiss) {
        if (dismiss === 'cancel') {
        }
      }
    );
  }


  CheckAllStudentAssigned() {
    // When all the corrections are assigned and saved, then only show the "Send Notification" button.
    if (this.AllStudentsLists.length > 0 && this.updatedCorrections.length < 1) {
      const hasCrossCorrectorAssignedToUpdated = _.every(this.AllStudentsLists, function (student) {
        return student.schoolCorrectingCorrectorId && student.schoolCorrectingId;
      });
      if (hasCrossCorrectorAssignedToUpdated) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    // return this.formSchoolCorrecting && this.formSchoolCorrecting.valid && this.isSaved;
  }

  changeSchoolCorrectingList(event, row, index) {
    console.log(event);
    console.log(row);
    const newObject = {};
    let schoolCorrectingCorrectorObject = {};
    const self = this;
    this.isSaved = false;
    this.formSchoolCorrecting.controls['corrector' + index].setValue('');
    this.formSchoolCorrecting.value['corrector' + index] = '';
    this.formSchoolCorrecting.controls['school' + index].setValue(event.id._id);

    this.schoolCorrectingList.forEach(element => {
      if (event.id._id === element._id && element.correctors.length === 1) {
        self.formSchoolCorrecting.controls['corrector' + index].setValue(element.correctors[0]._id);
        self.formSchoolCorrecting.value['corrector' + index] = element.correctors[0]._id;
        newObject['schoolCorrectingCorrectorId'] = element.correctors[0]._id;
        schoolCorrectingCorrectorObject = element.correctors[0];
      }
    });

    newObject['classId'] = row.classId._id;
    newObject['rncpTitleId'] = row.rncpTitleId._id;
    newObject['scholarSeasonId'] = row.scholarSeasonId._id;
    newObject['testId'] = row.testId._id;
    newObject['schoolOriginId'] = row.schoolOriginId._id;
    newObject['studentId'] = row.studentId._id;
    newObject['schoolCorrectingId'] = event.id._id;
    newObject['_id'] = row._id;

    this.searchedStudents.forEach((student, i) => {
      if (student.studentId._id === row.studentId._id) {
        student['schoolCorrectingId'] = event.id;
        // student['schoolCorrectingCorrectorId'] = schoolCorrectingCorrectorObject;
        _.isEmpty(schoolCorrectingCorrectorObject) ? '' : (student['schoolCorrectingCorrectorId'] = schoolCorrectingCorrectorObject);
        if (event.id.correctors.length !== 1) {
          delete student['schoolCorrectingCorrectorId'];
        }

      }
    });
    this.updatedCorrections.push(newObject);

    this.searchedStudents = [...this.searchedStudents];
    this.getSchoolAllListTab2();
  }

  getSchoolAllListTab2() {
    const resultArray = [];
    this.schoolCorrectingList.forEach(school => {
      resultArray.push({
        shortName: school['shortName'],
        _id: school['_id'],
        students: 0,
        correction: 0,
        diff: 0,
      });
    });

    resultArray.forEach(school => {
      const students = _.filter(this.AllStudentsLists, function (s) {
        return s['schoolOriginId']['_id'] === school._id;
      });
      const correction = _.filter(this.AllStudentsLists, function (s) {
        if (s['schoolCorrectingId'] && s['schoolCorrectingId']['_id'] && s['schoolCorrectingCorrectorId'] && s['schoolCorrectingCorrectorId']['_id']) {
          return s['schoolCorrectingId']['_id'] === school._id;
        }
      });
      school['students'] = students.length;
      school['correction'] = correction.length;
      school['diff'] = correction.length - students.length;
    });
    this.allSchools = resultArray;
  }

  onLinkClick(event) {
    this.selectedIndex = event.index;
    if (this.selectedIndex === 1) {
      this.getSchoolAllListTab2();
    }
  }

  getSchoolCorrectingList(schoolOriginId) {
    const schoolCorrecting = _.filter(this.schoolCorrectingList, function (o) {
      return o._id !== schoolOriginId;
    });

    let schoolsLists = [];
    if (schoolCorrecting) {
      schoolCorrecting.forEach(rep => {
        schoolsLists.push({
          id: rep,
          text: rep.shortName
        });
      });
    }
    schoolsLists = schoolsLists.sort(this.keysrt('text'));

    return schoolsLists;
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) { return 1; }
      else if (a[key] < b[key]) { return -1; };
      return 0;
    };
  }


  saveAllDataWhileLoadingItForFirstTime() {
    const dataPost = [];

    for (let i = 0; i < this.AllStudentsLists.length; i++) {
      const newObject = {};
      newObject['classId'] = this.AllStudentsLists[i]['classId'];
      newObject['rncpTitleId'] = this.AllStudentsLists[i]['rncpTitleId'];
      newObject['scholarSeasonId'] = this.AllStudentsLists[i]['scholarSeasonId'];
      newObject['testId'] = this.AllStudentsLists[i]['testId'];
      newObject['schoolOriginId'] = this.AllStudentsLists[i]['schoolOriginId']['_id'];
      newObject['studentId'] = this.AllStudentsLists[i]['studentId']['_id'];
      if (this.formSchoolCorrecting.value['corrector' + i] !== '') {
        newObject['schoolCorrectingCorrectorId'] = this.formSchoolCorrecting.value['corrector' + i];
      }
      if (this.formSchoolCorrecting.value['school' + i] !== '') {
        newObject['schoolCorrectingId'] = this.formSchoolCorrecting.value['school' + i];
      }
      if (this.AllStudentsLists[i]._id) {
        newObject['_id'] = this.AllStudentsLists[i]._id;
      }
      dataPost.push(newObject);
    }
    this.svrcrosscorrection.saveCrossCorrection({ data: dataPost }).subscribe(res => {
      console.log(res);
      this.updateForm();
    });
  }

  changeCorrector(corrector, studentId, row) {
    if (this.updatedCorrections.length < 1) {
      this.createAssignedCorrectorObj(corrector._id, row);
    } else {
      this.updatedCorrections.forEach((student, i) => {
        if (student.studentId === studentId) {
          this.updatedCorrections[i]['schoolCorrectingCorrectorId'] = corrector._id;
        } else {
          this.createAssignedCorrectorObj(corrector._id, row);
        }
      });
    }
    this.searchedStudents.forEach((student, i) => {
      if (student.studentId._id === studentId) {
        student['schoolCorrectingCorrectorId'] = corrector;
        console.log(student);
      }
    });
    this.searchedStudents = [...this.searchedStudents];

    // Changing Correction And Diff Count in "List of All Schools" table
    this.getSchoolAllListTab2();
  }

  changeCorrectorEvent(event, row) {
    // const studentId = row['studentId']['_id'];
    // if (this.updatedCorrections.length < 1) {
    //   this.createAssignedCorrectorObj(event.value, row);
    // } else {
    //   this.updatedCorrections.forEach((student, i) => {
    //     if (student.studentId === studentId) {
    //       this.updatedCorrections[i]['schoolCorrectingCorrectorId'] = event.value;
    //     } else {
    //       this.createAssignedCorrectorObj(event.value, row);
    //     }
    //   });
    // }

    // this.searchedStudents.forEach((student, i) => {
    //   if (student.studentId._id === studentId) {
    //     student['schoolCorrectingCorrectorId'] = event.value;
    //     console.log(student);
    //   }
    // });

    // console.log(this.updatedCorrections);
    // // Changing Correction And Diff Count in "List of All Schools" table
    // this.getSchoolAllListTab2();
  }

  createAssignedCorrectorObj(schoolCorrectingCorrector, row) {
    const newObject = {};
    newObject['classId'] = row.classId._id;
    newObject['rncpTitleId'] = row.rncpTitleId._id;
    newObject['scholarSeasonId'] = row.scholarSeasonId._id;
    newObject['testId'] = row.testId._id;
    newObject['schoolOriginId'] = row.schoolOriginId._id;
    newObject['studentId'] = row.studentId._id;
    newObject['schoolCorrectingId'] = row['schoolCorrectingId']['_id'];
    newObject['schoolCorrectingCorrectorId'] = schoolCorrectingCorrector;
    newObject['_id'] = row._id;
    this.updatedCorrections.push(newObject);
  }

  OnSelectSchoolCorrecting(school) {
    console.log(school);
    this.table.offset = 0;
    const schoolId = school._id;
    if (school && school._id) {
      this.searchedStudents = _.filter(this.searchedStudents, function (student) {
        if (student['schoolCorrectingId']) {
          return student['schoolCorrectingId']['_id'] === schoolId;
        }
      });
      console.log(this.searchedStudents);
      this.buildCorrectionTable(this.searchedStudents);
    }
  }

  openSchoolCorrectingSuggestionList() {
    this.autoCorrector.openPanel();
    // this.filteredOptionsSchool = Observable.of(this.schoolCorrectingList);
    this.filteredOptionsSchoolCorrecting = this.form.get('schoolCorrectingFilter').valueChanges.startWith('').map(list => list ? this.filterSchoolCorrecting(list) : this.assignedSchoolCorrecting.slice());
  }

  buildCorrectionTable(students) {
    const test = [];
    students.forEach((student, index) => {
      const element = student;
      test['school' + index] = [element['schoolCorrectingId'] ? element['schoolCorrectingId']['_id'] : '', Validators.required];
      test['corrector' + index] = [element['schoolCorrectingCorrectorId'] ? element['schoolCorrectingCorrectorId']['_id'] : '', Validators.required];
      this.selectedSchoolText[index] = [{
        id: element['schoolCorrectingCorrectorId'] ? element['schoolCorrectingId']['_id'] : '',
        text: element['schoolCorrectingCorrectorId'] ? element['schoolCorrectingId']['shortName'] : ''
      }];
    });
    this.formSchoolCorrecting = this.fb.group(test);
    this.isSaved = this.formSchoolCorrecting.valid;
  }

  getUnAssignedCorrectors() {
    let correction = 0;
    this.allSchools.forEach(school => {
      correction = correction + school['correction'];
    });
    return this.AllStudentsLists.length - correction;
  }

  exportCSV() {
    const exportEntry = [];
    const allStudents = this.AllStudentsLists;

    this.allSchoolData.forEach( school => {
      const students = _.filter(allStudents, function(s) {
        return s.schoolOriginId._id === school._id;
      });

      if (students.length > 0) {
        let entryToMake = [];
        this.allSchoolData.forEach( schoolCorrecting => {
          if (schoolCorrecting._id !== school._id) {
            entryToMake = _.filter(students, function(s) {
              return s.schoolCorrectingCorrectorId && schoolCorrecting._id === s.schoolCorrectingId._id;
            });

            if (entryToMake.length > 0) {
              exportEntry.push({
                'rncp': this.SelectedTitleName,
                'schoolOriginShortName': school.shortName,
                'schoolOriginAddress': school.schoolAddress.address1 + ', ' + school.schoolAddress.city + ', ' + school.schoolAddress.postalCode,
                'noOfActiveStudents': students.length,
                'schoolCorrectingshortName': entryToMake[0].schoolCorrectingId.shortName,
                'schoolCorrectingAddress': entryToMake[0].schoolCorrectingId.schoolAddress.address1 + ', ' + entryToMake[0].schoolCorrectingId.schoolAddress.city + ', ' + entryToMake[0].schoolCorrectingId.schoolAddress.postalCode,
                'studentToBeCorrected': entryToMake.length
              });
            }
          }
        });

      }
    });
    const options = {
      fieldSeparator: this.delimiterSelected,
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: [
        this.translate.instant('CROSSCORRECTION_EXPORT_COLUMNS.RNCPTITLE'),
        this.translate.instant('CROSSCORRECTION_EXPORT_COLUMNS.SCHOOL_ORIGIN'),
        this.translate.instant('CROSSCORRECTION_EXPORT_COLUMNS.SCHOOL_ORIGIN_ADDRESS'),
        this.translate.instant('CROSSCORRECTION_EXPORT_COLUMNS.ACTIVE_STUDENTS'),
        this.translate.instant('CROSSCORRECTION_EXPORT_COLUMNS.SCHOOL_CORRECTING'),
        this.translate.instant('CROSSCORRECTION_EXPORT_COLUMNS.SCHOOL_CORRECTIN_ADDRESS'),
        this.translate.instant('CROSSCORRECTION_EXPORT_COLUMNS.STUDENTS_TO_BE_CORRECTED')
      ]
    };


    const setCSVFileName = (this.SelectedTitleName + ' ' + this.testDetails.name + ' ' + moment().format('DD-MM-YYYY')).replace(/  +/g, ' ');

    new Angular2Csv(exportEntry, setCSVFileName, options);
    console.log(exportEntry);
  }

  selectDelimiter(delimiter) {
    this.delimiterSelected = delimiter.value;
  }

}

