import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Base, AlertUrl } from '../shared/global-urls';
import { Observable } from 'rxjs/Observable';
import { UtilityService } from './utility.service';
@Injectable()
export class AlertService {

  constructor(private http: Http, private loginService: LoginService, private utility: UtilityService) { }

  getToken() {
    return this.loginService.getToken();
  }

  getLoggedUser(){
    return this.loginService.getLoggedInUser();
  }

  searchRecipients(keyword: string) {
    const search = new URLSearchParams();
    search.set('keyword', keyword);
    return this.http
      .get(AlertUrl.autocomplete + '/' + keyword + '?token=' + this.loginService.getToken() )
      .map((response) => {
        console.log(response.json());
        response.json().data;
      });
  }

  searchTranslatedRecipients(keyword: string) {
    const search = new URLSearchParams();
    search.set('keyword', keyword);
    return this.http
      .get(AlertUrl.autocomplete + '/' + keyword + '?token=' + this.loginService.getToken() )
      .map((response) => {
        console.log(response.json());
        const uTypes = response.json().data;
        if (uTypes.length) {
          uTypes.forEach((u, i) => {
            uTypes[i].name = this.utility.getTranslateADMTCSTAFFKEY(u.name);
          });
        }
        return uTypes;
      });
  }

  handlerError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }

  saveAlert(data){
      return this.http.post(AlertUrl.url + '?token=' + this.getToken(), data)
        .map(res => res.json())
        .catch(this.handlerError);
  }

  getAllAlert(){
    return this.http.get(AlertUrl.url + '?token=' + this.getToken())
    .map(res => res.json())
    .catch(this.handlerError);
  }

  deleteAlert(id){
    return this.http.delete(AlertUrl.url + id + '?token=' + this.getToken());
  }

  updateAlert(id, data){
    return this.http.put(AlertUrl.url + id + '?token=' + this.getToken(), data)
        .map(res => res.json())
        .catch(this.handlerError);
  }

  getListOfAlertUsertype(){
    return this.http.get(AlertUrl.alertUserUrl  + '?token=' + this.getToken())
    .map(res => res.json())
    .catch(this.handlerError);
  }

  saveAlertResponse(id, data){
    return this.http.post(AlertUrl.alertUserUrl + '/' + id + '?token=' + this.getToken(), data)
        .map(res => res.json())
        .catch(this.handlerError);
  }

  getButtonCount(id, data){
    return this.http.post(AlertUrl.url +id + '/response/count'  + '?token=' + this.getToken(), data)
    .map(res => res.json())
    .catch(this.handlerError);
  }

  getDetailsForCsv(id){
    return this.http.get(AlertUrl.url + id + '/csv'  + '?token=' + this.getToken())
    .map(res => res.json())
    .catch(this.handlerError);
  }
  

  getFilteredAlertList(publication, alertId){
    return this.http.get(AlertUrl.url + publication + '/' + alertId  + '?token=' + this.getToken())
    .map(res => res.json())
    .catch(this.handlerError);
  }
}
