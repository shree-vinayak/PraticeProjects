import { Injectable } from '@angular/core';
import { Http, Jsonp, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Questionnaire } from '../shared/global-urls';
import { LoginService } from './login.service';
import { Base } from '../shared/global-urls';
@Injectable()
export class QuestionnaireService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  constructor(private http: Http,private loginService: LoginService) {

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


  getQuestionnaires(): Promise<any> {
    return this.http.get(Questionnaire.url + '?token=' + this.loginService.getToken(), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  createQuestionnaire(data) {
    let headers = new Headers({ 'Accept': 'application/json', 'Authorization': 'JWT ' + this.loginService.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(Questionnaire.url + '?token=' + this.loginService.getToken(), data, options).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status == 0) {

      }
      return error;
    });
  }

  updateQuestionnaire(id, data) {
    let stringifiedData = JSON.stringify(data);
    let options = new RequestOptions({ headers: this.headers });
    return this.http.put(Questionnaire.url2 + '/' + id + '?token=' + this.loginService.getToken(), data, options).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status == 0) {

      }
      return error;
    });
  }
  getQuestionnairesById(id) {
    return this.http.get(Questionnaire.url2 + '/' + id + '?token=' + this.loginService.getToken())
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }
  removeQuestionnaire(id) {
    return this.http.delete(Questionnaire.url2 + '/' + id + '?token=' + this.loginService.getToken());
  }


}
