import { Injectable } from '@angular/core';
import { Http, Jsonp, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { EmailTemplate, MentorEvaluation } from '../shared/global-urls';
import { LoginService } from './login.service';
@Injectable()
export class EmailtemplateService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  constructor(private http: Http,
    private loginService: LoginService) {

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


  getTemplates(): Promise<any> {
    return this.http.get(EmailTemplate.url + '?token=' + this.loginService.getToken(), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  createTempalte(data) {
    const headers = new Headers({ 'Accept': 'application/json', 'Authorization': 'JWT ' + this.loginService.getToken() });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(EmailTemplate.url + '?token=' + this.loginService.getToken(), data, options).map(response => {
      const data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }

  updateTemplate(id, data) {
    const stringifiedData = JSON.stringify(data);
    const options = new RequestOptions({ headers: this.headers });
    return this.http.put(EmailTemplate.url2 + '/' + id + '?token=' + localStorage.getItem('token'), data, options).map(response => {
      const data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }
  removeTemplate(id) {
    return this.http.delete(EmailTemplate.url2 + '/' + id + '?token=' + this.loginService.getToken());
  }
  getMailTags() {
    return this.http.get(MentorEvaluation.url + '/mailTags?token=' + this.loginService.getToken(), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }


}
