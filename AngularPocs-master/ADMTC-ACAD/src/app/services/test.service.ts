import { AppSettings } from './../app-settings';
import { Test } from '../models/test.model';
import { Subject } from 'rxjs/Rx';
import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoginService } from './login.service';
import { Base, Server, Calenderstep, Tests } from '../shared/global-urls';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AcademicKitService } from './academic-kit.service';
import { RNCPTitlesService } from './rncp-titles.service';
import { TranslateService } from 'ng2-translate';
import { ApplicationUrls } from 'app/shared/settings';

@Injectable()
export class TestService {
  test = new BehaviorSubject<Test>(new Test());
  testChanged = new Subject<Test>();
  categoryStack: number[] = [];
  editing: boolean;
  index: number;
  rncpTitleID: string;
  combinedList;
  validate;
  statusUpdateUrl = AppSettings.urls.academic.statusUpdateForTest;
  correctionGridSections: boolean[] = [];

  constructor(
    private http: Http,
    private loginService: LoginService,
    private appService: RNCPTitlesService,
    private acadService: AcademicKitService,
    private translate: TranslateService
  ) {
    this.appService.getSelectedRncpTitle().subscribe(title => {
      // let t = this.test.getValue();
      // t.parentRNCPTitle = title? title._id : '';
      // console.log(t);
      // this.test.next(t);
      this.rncpTitleID = title ? title._id : '';
    });
  }

  getclass(rncp?: string) {
    const selectedRncpTitleID = rncp ? rncp : this.rncpTitleID;
    return this.http
      .get(
        Server.url +
          'academic/rncp-title/' +
          selectedRncpTitleID +
          '/classes' +
          '?token=' +
          this.loginService.getToken()
      )
      .map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });
  }
  getTestByRNCPTitle(rncp?: string) {
    const rncpTitleID = rncp ? rncp : this.rncpTitleID;
    return this.http
      .get(
        Base.url +
          'academic/rncp-titles/' +
          rncpTitleID +
          '/tests' +
          '?token=' +
          this.loginService.getToken()
      )
      .map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });
  }

  storeCombinedList(list) {
    this.combinedList = list;
  }
  getStoreCombinedList() {
    return this.combinedList;
  }

  editTest(test: any, posStack: number[]) {
    this.editing = true;
    console.log(test, posStack);
    this.test.next(test);
    this.index = posStack.pop();
    this.categoryStack = [...posStack];
  }

  getTest() {
    if (!this.editing) {
      this.categoryStack = this.acadService.getTestStack();
    }
    // console.log('Get Test: ', this.test);
    // console.log("Stack: ", this.categoryStack);
    return this.test;
  }

  getCurrentStack() {
    return this.categoryStack ? [...this.categoryStack] : [];
  }

  updateNewTest(test) {
    this.test.next(test);
    this.editing = false;
    console.log('Update Test: ', this.test.getValue());
    // this.testChanged.next(this.test);
  }
  updateTest(test) {
    this.test.next(test);
    console.log('Update Test: ', this.test.getValue());
    // this.testChanged.next(this.test);
  }

  submitTest(save?: boolean, isPublish?: boolean) {
    return Observable.create(
      function(observer) {
        const t = this.test.getValue();

        // VERY CRITICAL LINE, IF THE BELOW GIVEN LINE IS REMOVED, DAY - 1 ISSUE WILL HAPPEN AGAIN
        t.date = new Date(t.date).toDateString();

        if (t.dateReTakeExam) {
          t.dateReTakeExam = new Date(t.dateReTakeExam).toDateString();
        }

        if (t.schools.length > 1) {
          t.schools.forEach((s) => {
            s.testDate = new Date(s.testDate).toDateString();
          });
        }

        // remove the below field if tes is NOT RETAKE
        for (let ed of t.expectedDocuments) {
          if (!t.allowReTakeExam) {
            delete ed['docUploadDateRetakeExam'];
          }
          // VERY CRITICAL LINE, IF THE BELOW GIVEN LINE IS REMOVED, DAY - 1 ISSUE WILL HAPPEN AGAIN
          if (ed.deadlineDate.type === 'fixed') {
            ed.deadlineDate.deadline = new Date(ed.deadlineDate.deadline).toDateString();
          }
        }
        if (isPublish) {
          t['isPublished'] = true;
        } else {
          t['isPublished'] = false;
        }
        console.log(t);
        if (save) {
          t.incompleteCreation = false;
        } else {
          t.incompleteCreation = false;
        }
        // t.parentRNCPTitle = this.rncpTitleID;

        if (this.editing) {
          this.acadService.editTest(t).subscribe(
            function(status) {
              if (status) {
                // this.test.next(new Test());
                this.editing = true;
                // this.categoryStack = [];
                observer.next(true);
              } else {
                observer.next(false);
              }
            }.bind(this)
          );
        } else {
          this.acadService.addTest(t).subscribe(
            function(status) {
              // console.log("test service :", status);
              //  this.editing = false;
              if (status) {
                // this.test.next(new Test());
                this.editing = false;
                // this.categoryStack = [];
                observer.next(true);
              } else {
                observer.next(false);
              }
            }.bind(this)
          );
        }
      }.bind(this)
    );
  }

  cancelTest() {
    return Observable.create(observer => {
      this.test.next(new Test());
      this.editing = false;
      observer.next(true);
    });
  }

  checkCreatingTest() {
    if (this.categoryStack && this.categoryStack.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  checkFirstStep() {
    const test = this.test.getValue();
    if (
      test.name !== '' &&
      test.type !== '' &&
      test.correctionType !== '' &&
      test.organiser !== '' &&
      test.date !== '' &&
      test.dateType !== ''
    ) {
      if (test.allowReTakeExam && test.dateReTakeExam) {
        return true;
      } else if (!test.allowReTakeExam) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkControlled() {
    return this.test.getValue().controlledTest;
  }

  checkSecondStep() {
    const test = this.test.getValue();
    if (
      this.checkFirstStep() &&
      this.checkIfAllowedToNavigateFromSecondToThird(test)
    ) {
      if (test.correctionGrid.correction.sections.length > 0) {
        return this.checkCorrectionGridSections(test);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkThirdStep() {
    if (this.checkControlled) {
      if (this.checkFirstStep()) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        this.checkFirstStep() &&
        (!this.test.getValue().controlledTest || this.checkSecondStep())
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkTest() {
    if (this.checkThirdStep()) {
      return true;
    } else {
      return false;
    }
  }

  setValidation(data) {
    this.validate = data;
  }

  getValidation() {
    console.log('Get Validation', this.validate);
    return this.validate;
  }

  getPreparationCenters() {
    return this.http
      .get(
        Server.url +
          'academic/rncp-titles/' +
          this.rncpTitleID +
          '/preparationCenters?token=' +
          this.loginService.getToken()
      )
      .map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });
  }

  /* API FOR GROUP TEST */
  getTestGroupFromTest(Id, school: string) {
    let reqUrl =
      Server.url +
      'academic/testGroupFromTest/' +
      Id +
      '/' +
      school +
      '?token=' +
      this.loginService.getToken();
    return this.http.get(reqUrl).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }
  checkIfCorrectionStarted(testId, SchoolId) {
    let reqUrl =
      Server.url +
      'academic/test-correction/' +
      testId +
      '/' +
      SchoolId +
      '/check-if-started?type=schoolId&token=' +
      this.loginService.getToken();
    return this.http.get(reqUrl).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }

  saveTestGroupFromTest(Id, data, school: string) {
    const lang = this.translate.currentLang.toUpperCase();
    const reqUrl =
      Server.url +
      'academic/testGroupFromTest/' +
      Id +
      '/' +
      school +
      '?lang=' +
      lang +
      '&token=' +
      this.loginService.getToken();

    return this.http.post(reqUrl, data).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }

  saveManualGroupsAsDraft(Id, data, school: string) {
    const lang = this.translate.currentLang.toUpperCase();
    const reqUrl = ApplicationUrls.academic.saveManualGroupsAsDraft + Id + '/' + school + '?lang=' + lang + '&token=' + this.loginService.getToken();

    return this.http.post(reqUrl, data).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }


  generateTestGroupFromTest(Id, school?: string) {
    const reqUrl =
      Server.url +
      'academic/testGroup/' +
      Id +
      '/' +
      school +
      '/generateAutomatic?token=' +
      this.loginService.getToken();
    return this.http.get(reqUrl).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }

  updateTestDetails(Id, data) {
    return this.http
      .put(
        Tests.url + '/' + Id + '?token=' + this.loginService.getToken(),
        data
      )
      .map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });
  }

  getTestsBasedOnClassId(classId) {
    return this.http
      .get(
        Tests.getTestsBasedOnClass +
          classId +
          '/tests' +
          '?token=' +
          this.loginService.getToken()
      )
      .map(tests => {
        return tests.json().data;
      });
  }

  getGroupTestsBasedOnClassAndRNCP(rncpId, classId) {
    return this.http
      .get(
        Tests.getGroupTests +
          rncpId +
          '/' +
          classId +
          '/tests' +
          '?token=' +
          this.loginService.getToken()
      )
      .map(tests => {
        return tests.json();
      });
  }

  getStatusUpdateofTest(postObject) {
    return this.http
      .post(
        `${this.statusUpdateUrl}?token=${this.loginService.getToken()}`,
        postObject
      )
      .map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });
  }

  checkIfAllowedToNavigateFromSecondToThird(test) {
    this.correctionGridSections = [];

    // Below code will check if all the sections' maximum rating is collectively equals to the total of their subsections' maximum ratings or not
    if (
      test.correctionGrid &&
      test.correctionGrid.correction &&
      test.correctionGrid.correction.sections
    ) {
      test.correctionGrid.correction.sections.forEach((s, index) => {
        let ssRating = 0;
        s.subSections.forEach(ss => {
          ssRating += ss.maximumRating;
        });
        ssRating === s.maximumRating
          ? (this.correctionGridSections[index] = true)
          : (this.correctionGridSections[index] = false);
      });
      console.log(this.correctionGridSections);
      if (this.correctionGridSections.includes(false)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  checkCorrectionGridSections(test) {
    const sections = test.correctionGrid.correction.sections;
    let incomplete = false;
    for (const section of sections) {
      if (section.title === '') {
        incomplete = true;
        break;
      } else {
        for (const subsec of section.subSections) {
          if (subsec.title === '') {
            incomplete = true;
            break;
          }
        }
        if (incomplete) {
          break;
        }
      }
    }
    if (incomplete) {
      return false;
    } else {
      return true;
    }
  }

  getPreviewOfTasks(test) {
    return this.http.post(ApplicationUrls.academic.getPreviewOfTasks + '?lang=' + this.translate.currentLang + '&token=' + this.loginService.getToken(), test).map(data => {
      return data.json();
    });
  }
  assignQualityCorrectors(data, testId) {
    return this.http.post(ApplicationUrls.academic.testCorrections + testId + '/assignCorrectorForQC?token=' + this.loginService.getToken(), data).map( data => {
      return data.json();
    });
  }

  checkPublishTestConditions() {
    return this.http.get(ApplicationUrls.academic.checkPublishTestConditions + this.rncpTitleID +   '?token=' + this.loginService.getToken()).map(data => {
      return data.json();
    });
  }
}
