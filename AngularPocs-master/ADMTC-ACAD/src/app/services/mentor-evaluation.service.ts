import { Injectable } from '@angular/core';
import { Http, Jsonp, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { MentorEvaluation, Base } from '../shared/global-urls';
import { LoginService } from './login.service';
import { TranslateService } from 'ng2-translate';
import { ApplicationUrls } from '../shared/settings';
@Injectable()
export class MentorEvaluationService {

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: Http, private loginService: LoginService,private translate: TranslateService,) {

  }


  // Hadling the error if api return with error
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Promise.reject(errMsg || error);
  }


  getMentorEvaluations(): Promise<any> {
    return this.http.get(MentorEvaluation.url + '?token=' + this.loginService.getToken(), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  createMentorEvaluation(data) {
    let headers = new Headers({ 'Accept': 'application/json', 'Authorization': 'JWT ' + this.loginService.getToken() });
    let options = new RequestOptions({ headers: headers });
    let lang = this.translate.currentLang;
    return this.http.post(Base.url + 'mentorEvaluation/responses' + '?lang='+lang+'&token=' + this.loginService.getToken(), data, options).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }

  updateMentorEvaluation(id, data) {
    let stringifiedData = JSON.stringify(data);
    let options = new RequestOptions({ headers: this.headers });
    return this.http.put(MentorEvaluation.url + '/' + id + '?token=' + this.loginService.getToken(), data, options).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }
  removeMentorEvaluation(id) {
    return this.http.delete(MentorEvaluation.url + '/' + id + '?token=' + this.loginService.getToken());
  }
  getMentorEvaluateById(id) {
    return this.http.get(MentorEvaluation.url + '/' + id + '?token=' + this.loginService.getToken())
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }


  getGridLists(id) {
    return this.http.post(Base.url + 'mentorEvaluation/searchSubjectTestFromRncp' + '?token=' + this.loginService.getToken(), { rncpTitle: id })
      .map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });


  }


  /*Answer Reponse methods - start */
  createMentorEvaluationAnswer(data) {
    let headers = new Headers({ 'Accept': 'application/json', 'Authorization': 'JWT ' + this.loginService.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(MentorEvaluation.urlResponse + '?token=' + this.loginService.getToken(), data, options).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }
  getMentorEvaluationbyResponse(id) {
    return this.http.get(Base.url + 'mentorEvaluation/responses/' + id + '?token=' + this.loginService.getToken())
      .map(response => response.json())
      .catch(this.handleError);
  }

  setMentorEvaluationbyResponse(data) {
    return this.http.put(Base.url + 'mentorEvaluation/responses/' + data._id + '?token=' + this.loginService.getToken() +
                        '&lang=' + this.translate.currentLang.toLowerCase(), data)
      .map(
      response => {
        return response.json();
      }
      );
  }

  saveEvaliationGrid(id, data) {
    return this.http.post(Base.url + 'mentorEvaluation/responses/' + id + '/testCorrection?token=' + this.loginService.getToken() +
                          '&lang=' + this.translate.currentLang.toLowerCase(), data)
      .map(
      response => {
        return response.json();
      }
      );
  }
  /*Answer Reponse methods - end */

  generateMarksEntryPDF(data) {
    return this.http.post(ApplicationUrls.mentorEvaluation.generateMarksEntryPDF + `?token=${this.loginService.getToken()}` , data)
    .map(res => { return res.json();
    });
  }
}
