import { TestCorrection } from '../models/correction.model';
import { Subject } from 'rxjs/Rx';
import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RNCPTitlesService } from './rncp-titles.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AcademicKitService } from './academic-kit.service';
import { TestCorrections, Tests, Students, Classes, Documents } from '../shared/global-urls';

import _ from 'lodash';
import { LoginService } from './login.service';

declare var require: any;

const URL = 'http://localhost:3000/test';

@Injectable()
export class TestCorrectionService {
  test = new BehaviorSubject<TestCorrection>(new TestCorrection());
  student = null;
  selectedTest = null;
  selectedTask = null;
  header = null;
  footer = null;

  constructor(private http: Http,
              private appService: RNCPTitlesService,
              private acadService: AcademicKitService,
              private loginService: LoginService) {

  }

  selectTest(id) {
    this.selectedTest = id;
  }

  getSelectedTest() {
    return this.selectedTest;
  }

  selectTask(id) {
    this.selectedTask = id;
  }
  getSelectedTask() {
    return this.selectedTask;
  }

  getTest(testId) {
    return this.http.get(Tests.url + '/' + testId + '?token=' + this.loginService.getToken()).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }

  getStudent() {
    return this.http.get(Students.url + '?token=' + this.loginService.getToken()).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }

  addCorrection(url, correctionObj) {
    return this.http.post(TestCorrections.url + url + '?token=' + this.loginService.getToken(), correctionObj).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }

  getCorrection(url) {
    return this.http.get(TestCorrections.url + url + '?limit=' + 100 + '&token=' + this.loginService.getToken()).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }

  addHeader(header) {
    this.header = header;
  }

  addFooter(footer) {
    this.footer = footer;
  }

  getHeader() {
    return this.header;
  }

  getFooter() {
    return this.footer;
  }

  getStudentForTestCorrection(testId, schoolId: string) {
    let reqUrl = Tests.url + '/' + testId + '/' + schoolId + '/students' + '?token=' + this.loginService.getToken();
    return this.http.get(reqUrl).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }

  addNewCorrection(correction: any, taskId?: string) {
    const url = `${TestCorrections.url}/${correction.test}/corrections/?token=${this.loginService.getToken()}${taskId}`;
    return this.http
      .post(url, correction)
      .map(response => {
        const res = response.json();
        console.log(res);
        if (res.status === 'OK') {
          return res.data;
        } else {
          return null;
        }
      });
  }

  updateCorrection(correction: any, flag?, taskid? ) {
    let taskId = '';
    let testId = correction.test;
    if (correction.test.hasOwnProperty('_id'))
    {
      testId = correction.test._id;
    }
    if (flag) {
       taskId = taskid;
    }

    const url = `${TestCorrections.url}/${testId}/corrections/${correction._id}?token=${this.loginService.getToken()}&taskid=${taskId}`;
    return this.http
      .put(url, correction)
      .map(response => {
        const res = response.json();
        console.log(res);
        if (res.status === 'OK') {
          return res.data;
        } else {
          return null;
        }
      });
  }


  resetCorrectionData() {
    // this.test = new BehaviorSubject<TestCorrection>(new TestCorrection());
    this.student = null;
    // this.selectedTest = null;
    this.header = null;
    this.footer = null;
  }

  validateDocument(correctionId, body) {
    return this.http.post(Documents.validateDocument + correctionId + '/document/review' + '?token=' + this.loginService.getToken(), body).map( res => {
      return res;
    });
  }

  getStudentsForFinalRetake(taskId: string) {
    return this.http.get(TestCorrections.finalRetakeStudents + taskId + '?token=' + this.loginService.getToken()).map( res => {
      return res.json().data;
    });
  }
}
