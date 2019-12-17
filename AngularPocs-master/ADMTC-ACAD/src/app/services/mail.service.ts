import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Base, MailBox } from '../shared/global-urls';

import { Page } from './../models/page.model';
import { Sort } from './../models/sort.model';

import { Mail } from './../models/mail';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Injectable()
export class MailService {


  private headers = new Headers({ 'Content-Type': 'application/json' });
  private bodyOption = new RequestOptions({ headers: this.headers });

  constructor(private http: Http, private loginService: LoginService, private translate: TranslateService) { }

  getToken() {
    return this.loginService.getToken();
  }

  getMails(type: String, page: Page, sort: Sort): Promise<any> {
    return this.http.get(MailBox.url + '/type/' + type + '?page=' +
      (page.pageNumber + 1) + '&limit=' + page.size + '&sortby=' + sort.sortby + '&sortmode=' +
      sort.sortmode + '&token=' + this.getToken(), this.bodyOption)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  searchRecipients(keyword: string) {
    const search = new URLSearchParams();
    search.set('keyword', keyword);
    return this.http
      .get(Base.url + 'academic/mail/recipients?keyword=' + keyword + '&token=' + this.getToken())
      .map((response) => response.json().data);
  }

  countUnreadMailbyMailType(type: string, mailType: string) {
    const data = { 'type': type, 'mailType': mailType };
    return this.http
      .post(MailBox.unreadUrl + '?token=' + this.getToken(), JSON.stringify(data), { headers: this.headers })
      .map((response) => response.json());
  }

  sendMail(mail: Mail): Promise<Mail> {
    return this.http
      .post(MailBox.url + '?token=' + this.getToken(), JSON.stringify(mail), { headers: this.headers })
      .toPromise()
      .then(this.extractReturnData)
      .catch(this.handleError);
  }

  contactSendMail(mail: Mail): Promise<Mail> {

    return this.http
    .post(MailBox.mailUrl + '?token=' + this.getToken() + '&lang=' + this.translate.currentLang, JSON.stringify(mail), { headers: this.headers })
    .toPromise()
    .then(this.extractReturnData)
    .catch(this.handleError);
  }

  sendMailJobDescription(mail: Mail): Promise<Mail> {
    return this.http
      .post(Base.url + 'jobDescription/academicStaffN1ToStudents?token=' + this.getToken(), JSON.stringify(mail), { headers: this.headers })
      .toPromise()
      .then(this.extractReturnData)
      .catch(this.handleError);
  }

  findMailCivility(mailList) {
    return this.http
      .post(MailBox.InfoByMailId + '?token=' + this.getToken(), { 'emails': JSON.stringify(mailList) }, { headers: this.headers })
      .map((response) => response.json());
  }
  sendMailGroupTest(mail: Mail, id, school: string): Promise<Mail> {
    return this.http
      .post(Base.url + 'academic/testGroup/' + id + '/' + school + '/notifyStudForGroup?token=' +
      this.getToken(), JSON.stringify(mail), { headers: this.headers })
      .toPromise()
      .then(this.extractReturnData)
      .catch(this.handleError);
  }

  private extractReturnData(res: Response) {
    const response = res.json();
    let errorMessage = 'Some unknown error occurred';
    if (response['code'] === 200) {
      return response;
    } else if (response['message']) {
      errorMessage = response['message'];
    }
    return Promise.reject(errorMessage);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  updateMail(data) {
    return this.http.put(MailBox.url + '/' + '?token=' + this.getToken(), data, this.bodyOption);
  }
  
  updateUrgentMessage(data) {
    return this.http.put(MailBox.url + '/' + data._id + '?token=' + this.getToken(), data, this.bodyOption);
  }

  updateSingleMail(data) {
    return this.http.put(
      MailBox.url + '/' + data._id + '?token=' + this.getToken(), data, this.bodyOption)
      .map((data) => {
        const response = data.json();
        return data;
      });
  }

  uploadAttachment(data) {
    const headers = new Headers({ 'Accept': 'application/json', 'Authorization': 'JWT ' + this.getToken() });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(Base.url + 'academic/file-upload?token=' + this.getToken(), data, options).map(response => {
      const data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }


  /*Method For mailbox*/

  urgentMail(): Promise<any> {
    return this.http.get(MailBox.urgntMails + '/getUrgetMails?token=' + this.getToken(), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
}
