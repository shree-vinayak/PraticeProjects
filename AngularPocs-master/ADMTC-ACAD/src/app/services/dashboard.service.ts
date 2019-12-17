import { TestCorrection } from '../models/correction.model';
import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RNCPTitlesService } from './rncp-titles.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AcademicKitService } from './academic-kit.service';
import { PendingTasks, UpcomingEvents, AssignCorrector } from '../shared/global-urls';
import { LoginService } from './login.service';
import { Sort } from '../models/sort.model';
import { AppSettings } from '../app-settings';
import { Page } from '../models/page.model';
import { TranslateService } from 'ng2-translate';


@Injectable()
export class DashboardService {
  test = new BehaviorSubject<TestCorrection>(new TestCorrection());
  private _pendingTaskRefreshSubject: Subject<boolean> = new Subject<boolean>();
  refreshPendingTask = this._pendingTaskRefreshSubject.asObservable();
  limit = 0;
  testCorrectionUrl = AppSettings.urls.academic.testCorrection;

  constructor(private http: Http,
    private appService: RNCPTitlesService,
    private acadService: AcademicKitService,
    private loginservice: LoginService,
    private translate: TranslateService,) {

  }

  getPendingTasks(rncpId, sort: Sort, page: Page, schoolId?: string, searchText?: string, userTypeId?: string) {

    const schoolQString = schoolId ? '&schoolId=' + schoolId : '';
    const searchTextQString = searchText ? '&searchText=' + searchText : '';
    const userTypeIdQString = userTypeId ? '&userTypeId=' + userTypeId : '';

    return this.http.get(PendingTasks.url + '?token=' + this.loginservice.getToken() + '&title=' + rncpId +
      '&lang=' + this.translate.currentLang.toLowerCase() +
      '&sortby=' + sort.sortby + '&sortmode=' + sort.sortmode + '&limit=' + page.size + '&page=' + (page.pageNumber + 1) +
      schoolQString + searchTextQString + userTypeIdQString).map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response;
        } else {
          return [];
        }
      });
  }

  getUpcomingEvents(id) {
    return this.http.get(UpcomingEvents.url + id + '?token=' + this.loginservice.getToken() +
      '&limit=' + this.limit).map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });
  }

  setUpcominfEvents(data) {
    return this.http.post(UpcomingEvents.setUrl + '?token=' + this.loginservice.getToken(), data).map(res => {
      const response = res.json();
      console.log(response);
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }
  updateUpcominfEvents(data) {
    return this.http.put(UpcomingEvents.setUrl + '/' + data._id + '?token=' + this.loginservice.getToken(), data).map(res => {
      const response = res.json();
      console.log(response);
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }
  deleteUpcominfEvents(id) {
    return this.http.delete(UpcomingEvents.setUrl + '/' + id + '?token=' + this.loginservice.getToken()).map(res => {
      const response = res.json();
      console.log(response);
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }

  assignCorrectorSubmit(testId, assignCorrectorBody) {
    return this.http.post(AssignCorrector.assignCorrectorUrl + testId + '/assignCorrector' + '?token=' + this.loginservice.getToken(), assignCorrectorBody).map(res => {
      const response = res.json();
      return response;
    });
  }

  finalAssignCorrectorSubmit(testId, assignCorrectorBody) {
    return this.http.post(AssignCorrector.finalRetakeAssignCorrector + testId + '/assignCorrectorForFinalRetake' + '?token=' + this.loginservice.getToken(), assignCorrectorBody).map(res => {
      const response = res.json();
      return response;
    });
  }

  changeAssignCorrector(testId, changeCorrectorBody) {
    return this.http.post(this.testCorrectionUrl + testId + '/changeAssignCorrector' + '?token=' +
                          this.loginservice.getToken(), changeCorrectorBody)
                      .map(res => {
                            const response = res.json();
                            return response;
                          });
  }

  changeAssignCorrectorForFinalRetake(testId, changeCorrectorBody) {
    return this.http.post(this.testCorrectionUrl + testId + '/changeAssignCorrectorForFinalRetake' + '?token=' +
                          this.loginservice.getToken(), changeCorrectorBody)
                      .map(res => {
                            const response = res.json();
                            return response;
                          });
  }

  refreshTaskListAfterTestDeletion(refreshState: boolean) {
    this._pendingTaskRefreshSubject.next(refreshState);
  }
}
