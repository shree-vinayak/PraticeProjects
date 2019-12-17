import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Http, Response } from '@angular/http';
import { Classes,Base, StudentURL, RncpTitle, optimizedRNCPtitles } from '../shared/global-urls';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Page } from '../models/page.model';
import { Sort } from '../models/sort.model';
import { ClassModel } from '../models/class.model';
import { LoginService } from './login.service';
import { AppSettings } from '../app-settings';
import { TranslateService } from 'ng2-translate';
import { ApplicationUrls } from '../shared/settings';

@Injectable()
export class RNCPTitlesService {
  selectedTitle = new BehaviorSubject<any>(null);
  private Urls = AppSettings.urls.academic;
  isFromAcadKit = false;
  constructor(
    private http: Http,
    private translate: TranslateService,
    private loginService: LoginService) {
  }

  getRNCPTitles(page: Page, sort: Sort) {
    return this.http
      .get(this.Urls.rncpTitle + '?token='
        + this.loginService.getToken()
        + '&page=' + (page.pageNumber + 1)
        + '&limit=' + page.size + '&sortby='
        + sort.sortby + '&sortmode=' + sort.sortmode)
      .map((response) => {
        let res = response.json();
        return {
          titles: res.data,
          total: res.total
        };
      });
  }

  getRNCPTitleListView(page?: Page, sort?: Sort) {
    return this.http
      .get(this.Urls.rncpTitleListView + '?token='
        + this.loginService.getToken())
      .map((response) => {
        let res = response.json();
        return {
          titles: res.data,
          total: res.total
        };
      });
  }
  getRNCPTitlesLists(){
    return this.http
      .get(this.Urls.rncpTitleListView + '?token='
        + this.loginService.getToken())
      .map((response) => {
        let res = response.json();
        return {
          titles: res.data,
          total: res.total
        };
      });
  }

  getRNCPWithClasses() {
    return this.http
    .get(this.Urls.rncpTitlesWithClasses + '?token='
      + this.loginService.getToken())
    .map((response) => {
      let res = response.json();
      return {
        titles: res.data,
        total: res.total
      };
    });
  }

  getRNCPTitlesById(id) {
    return this.http
      .get(this.Urls.rncpTitle + '/' + id + '?token='
        + this.loginService.getToken())
      .map((response) => {
        return response.json();
      });
  }

  selectRncpTitle(id) {
    return this.http
      .get( this.Urls.rncpTitle + '/' + id
        + '?token=' + this.loginService.getToken()
      )
      .map((response) => {
        const title = response.json().data;
        console.log(response);
        this.selectedTitle.next(title);
        return this.selectedTitle.getValue();
      });
  }

  updateSelectedRncpTitle() {
    const updateResult = new Subject<boolean>();

    const url = this.Urls.rncpTitle + '/' + this.selectedTitle.getValue()['_id'] + '?token=' + this.loginService.getToken();
    this.http
      .put(url, this.selectedTitle.getValue())
      .map(res => res.json()).subscribe((res) => {

      if (res.status === 'OK') {
        updateResult.next(true);
      } else {
        updateResult.next(false);
      }
      this.selectedTitle.next(res.data);
    });

    return updateResult;
  }

  getOptimizedRNCPById(rncpId) {
    return this.http.get(optimizedRNCPtitles.getUrl + '/' + rncpId + '?token=' + this.loginService.getToken()).map( res => {
      return res.json().data;
    });
  }

  // Below written method is for getting Scholar Season based on Given RNCP Title and Today's Date

  getSelectedScholarSeason(rncpId) {
    if (rncpId) {
      return this.http
        .get(this.Urls.rncpTitle + '/' + rncpId + '/scholarSeason/date' +  '?token=' + this.loginService.getToken())
        .map( res => {
          const response = res.json();
          return response.data;
        });
    }
  }

  getSelectedRncpTitle() {
    return this.selectedTitle;
  }

  setSelectedRncpTitle(rncp) {
    this.selectedTitle = rncp;
  }

  setSelectedRncpTitleSubject(rncp) {
    this.selectedTitle.next(rncp);
  }

  resetState() {
  }

  getClasses(titleID: string, page?: Page, sort?: Sort) {
    if (titleID) {
      return this.http
        .get(this.Urls.globalRncpTitle + '/' + titleID + '/classes'
          + '?token=' + this.loginService.getToken()
          + '&page=' + (page.pageNumber + 1)
          + '&limit=' + page.size
          + '&sortby=' + sort.sortby
          + '&sortmode=' + sort.sortmode)
        .map(res => {
          const response = res.json();
          return {
            classes: response.data,
            total: response.total
          };
        });
    } else {
      return Observable.create(observer => observer.next([]));
    }
  }
  getClassesNosort(titleID: string) {
    if (titleID) {
      return this.http
        .get(this.Urls.globalRncpTitle + '/' + titleID + '/classes'
          + '?token=' + this.loginService.getToken())
        .map(res => {
          const response = res.json();
          return {
            classes: response.data,
            total: response.total
          };
        });
    } else {
      return Observable.create(observer => observer.next([]));
    }
  }


  addClass(classObj: ClassModel, titleID: string) {
    return this.http
      .post(this.Urls.globalRncpTitle + '/' + titleID + '/classes' + '?token=' + this.loginService.getToken(), classObj)
      .map(response => {
        const res = response.json();
        console.log(res);
        if (res['status'] === 'OK') {
          return true;
        } else {
          return false;
        }
      })
      .catch(this.handleError);
  }

  handleError(error: Response) {
    console.error('Error :', error);
    return Observable.throw(error);
  }

  updateClass(classObj: any) {
    classObj.parentRNCPTitle = classObj.parentRNCPTitle._id;
    console.log('Update : ', classObj);
    return this.http
      .put(this.Urls.globalRncpTitle + '/' + classObj.parentRNCPTitle + '/classes/' + classObj._id + '?token=' + this.loginService.getToken(), classObj)
      .map(response => {
        const res = response.json();
        console.log(res);
        if (res['status'] === 'OK') {
          return true;
        } else {
          return false;
        }
      })
      .catch(this.handleError);
  }

  deleteClass(parentRNCPTitle,id) {

    return this.http
      .delete(this.Urls.globalRncpTitle + '/' + parentRNCPTitle + '/classes/' + id + '?token=' + this.loginService.getToken())
      .map(response => {
        const res = response.json();
        console.log(res);
        if (res['status'] === 'OK') {
          return true;
        } else {
          return false;
        }
      })
      .catch(this.handleError);
  }

  getStudentByClass(id){
    if (id) {
      return this.http
        .get(Classes.classUrl + '/' + id + '/students'
          + '?token=' + this.loginService.getToken()
        )
        .map(res => {
          const response = res.json();
          return {
            students: response.data,
            total: response.total
          };
        });
    } else {
      return Observable.create(observer => observer.next([]));
    }
  }

  updateRNCPTitleByIdObject(id, data) {
    return this.http.put(this.Urls.rncpTitle + '/' + id + '?token=' + this.loginService.getToken(), data).map(response => {
        const res = response.json();
        console.log(res);
        if (res['status'] === 'OK') {
          return true;
        } else {
          return false;
        }
      })
      .catch(this.handleError);
  }
  updateStatus(id,status) {
    const lang = this.translate.currentLang.toUpperCase();
    return this.http.put(Base.url + 'academic/rncpTitle/' + id + '/' + status + '?lang=' + lang + '&token=' + this.loginService.getToken(),{}).map(response => {
        const res = response.json();
        console.log(res);
        if (res['status'] === 'OK') {
          return true;
        } else {
          return false;
        }
      })
      .catch(this.handleError);
  }
  updateConditions(id, data) {
    return this.http.put(Base.url + 'academic/rncpTitle/' + id + '/updateConditions?token=' + this.loginService.getToken(),data).map(response => {
        const res = response.json();
        console.log(res);
        if (res['status'] === 'OK') {
          return true;
        } else {
          return false;
        }
      })
      .catch(this.handleError);
  }

  getUnregisteredStudents(body) {
    return this.http.post(StudentURL.unRegisteredStudents + '?token=' + this.loginService.getToken(), body).map( res => {
      const response = res.json();
      return response;
    });
  }

  getAllRNCPTitlesShortName() {
    return this.http.get(RncpTitle.getUrlShortName + '?token=' + this.loginService.getToken() + '&limit=0')
      .map((response) => {
        return response.json();
      });
  }

  setFromAcadKit(status) {
    return this.isFromAcadKit = status;
  }

  getFromAcadKit() {
    return this.isFromAcadKit;
  }

  getRNCPTitlesOPtimized(page: Page, sort: Sort) {
    return this.http
      .get(optimizedRNCPtitles.getUrl + '?token='
        + this.loginService.getToken()
        + '&page=' + (page.pageNumber + 1)
        + '&limit=' + page.size + '&sortby='
        + sort.sortby + '&sortmode=' + sort.sortmode)
      .map((response) => {
        let res = response.json();
        return {
          titles: res.data,
          total: res.total
        };
      });
  }

  getSchoolsByRncp(rncpId){
    let body ={
      rncpId: rncpId
    }
    return this.http.post((ApplicationUrls.academic.getSchoolsBasedOnLoggedInUserType + '?token=' + this.loginService.getToken()), body).map( res=>res.json())
  }

  getRNCPDetails(rncpId) {
    return this.http.get(RncpTitle.getRNCPDetails + rncpId + '?token=' + this.loginService.getToken()).map(rncp => {
      return rncp.json();
    });
  }

  editRNCPSpecializations(specializations, rncpId) {
    return this.http.put(RncpTitle.rncpSpecializationsEdit + rncpId + '?token=' + this.loginService.getToken(), specializations).map(rncp => {
      return rncp.json();
    });
  }

  getRncpAdmtcDir() {
    return this.http.get(ApplicationUrls.academic.rncpAdmtcDir + '?token=' + this.loginService.getToken()).map(rncp =>
       rncp.json()
    );
  }

  getAcadKitDocs(rncpId) {
    return this.http.get(ApplicationUrls.academic.acaddocumentsRncp + rncpId + '?token=' + this.loginService.getToken()).map(rncp =>
       rncp.json()
    );
  }

  getPublishedForStudentsDocument(rncpId) {
    return this.http.get(`${ApplicationUrls.academic.getPublishedForStudentsDocument}${rncpId}?token=${this.loginService.getToken()}`)
    .map(rncp => rncp.json() );
  }
}
