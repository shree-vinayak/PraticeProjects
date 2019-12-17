import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, RequestOptions } from '@angular/http';
import { Jsonp, URLSearchParams, Headers, Response } from '@angular/http';
import { LoginService } from 'app/services/login.service';
import { Observable } from 'rxjs/Observable';
import { MentorEvaluation,Base} from '../../shared/global-urls';
import { Sort } from 'app/models/sort.model';
import { Page } from 'app/models/page.model';
import { AppSettings } from '../../app-settings';
import { TranslateService } from 'ng2-translate';
@Injectable()
export class CrossCorrectionService {

  private Urls = AppSettings.urls.academic;
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: Http, private loginService: LoginService, private translate: TranslateService,) { }

  getTests(rncpId:string,classId: string, page: Page, sort: Sort) {
    if (rncpId && classId) {
      return this.http
        .get(this.Urls.crossCorrector +  '/' + rncpId +'/' + classId + '/tests'
          + '?token=' + this.loginService.getToken()
          + '&page=' + (page.pageNumber + 1)
          + '&limit=' + page.size
          + '&sortby=' + sort.sortby
          + '&sortmode=' + sort.sortmode)
        .map(res => {
          const response = res.json();
          return {
            tests: response.data,
            total: response.data.length
          };
        });
    } else {
      return Observable.create(observer => observer.next([]));
    }
  }
  getTestForQc(rncpId , classId) {
    if (rncpId && classId) {
      const data = {
        rncpId : rncpId,
        classId : classId
      };

      return this.http.post(this.Urls.testForQc + '?token=' + this.loginService.getToken(), data).map( res => {
        const response = res.json();
        return {
          tests: response.data,
          total: response.data.length
        };
      });
    }
  }

  getRecords(data){
    const lang = this.translate.currentLang.toUpperCase();
    return this.http.post(this.Urls.crossCorrector + '/getRecords?lang=' + lang + '&token=' + this.loginService.getToken() + "&limit=0",data).map(response => {
      const res = response.json();
      return res;
    })
    .catch(this.handleError);
  }
  getStudent(data){
    const lang = this.translate.currentLang.toUpperCase();
    return this.http.post(this.Urls.crossCorrector + '/getStudents?lang=' + lang + '&token=' + this.loginService.getToken(),data).map(response => {
      const res = response.json();
      return res;
    })
    .catch(this.handleError);
  }
  getSchoolsAndCorrectors(data){
    const lang = this.translate.currentLang.toUpperCase();
    return this.http.post(this.Urls.crossCorrector + '/getSchoolsAndCorrectors?lang=' + lang + '&token=' + this.loginService.getToken(),data).map(response => {
      const res = response.json();
      return res;
    })
    .catch(this.handleError);
  }

  saveCrossCorrection(data) {
    const lang = this.translate.currentLang.toUpperCase();
    return this.http.put(this.Urls.crossCorrector + '/createBulk?lang=' + lang + '&token=' + this.loginService.getToken(),data).map(response => {
        const res = response.json();
        return res;

      })
      .catch(this.handleError);
  }
  sendCrossNotification(data) {
    const lang = this.translate.currentLang.toUpperCase();
    return this.http.post(this.Urls.crossCorrector + '/sendNotification?lang=' + lang + '&token=' + this.loginService.getToken(),data).map(response => {
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

  getStudentsForCorrection(taskId){
    const lang = this.translate.currentLang.toUpperCase();
    return this.http.get(this.Urls.crossCorrector + '/getStudentsForCorrection/'+taskId+'?lang=' + lang + '&token=' + this.loginService.getToken()).map(res => {
      const response = res.json();
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    })
    .catch(this.handleError);
  }
  completeTask(taskId,data){
    const lang = this.translate.currentLang.toUpperCase();
    return this.http.post(this.Urls.crossCorrector + '/submitCrossCorrection/'+taskId+'?lang=' + lang + '&token=' + this.loginService.getToken(),data).map(response => {
      return response;
    });
  }

  getCorrectorsAndStudentsforSendCopyTask(postObject){
    return this.http.post(this.Urls.getCorrectorsAndStudents + '?token=' + this.loginService.getToken(), postObject)
                          .map(response => {
                                              const res = response.json();
                                              return res;
                                            });
  }

  getCertifierDetailsToSendCopy(taskId){
    return this.http.get(this.Urls.validateSendCopiesByCertifier + taskId + '?token=' + this.loginService.getToken())
                          .map(response => {
                                              const res = response.json();
                                              return res;
                                            });
  }

  createMarkEntryForCorrectorsAfterSendCopy(postObject){
    return this.http.post(this.Urls.createMarkEntryForCorrectors + '?token=' + this.loginService.getToken(), postObject)
                          .map(response => {
                                              const res = response.json();
                                              return res;
                                            });
  }

  handleError(error: Response) {
    console.error('Error :', error);
    return Observable.throw(error);
  }

}
