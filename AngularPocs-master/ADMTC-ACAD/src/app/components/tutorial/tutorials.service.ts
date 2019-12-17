import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../app-settings';
import { LoginService } from '../../services/login.service';


@Injectable()
export class TutorialsService {

    academicUrls = AppSettings.urls.academic;

  constructor(private http: Http,
             private loginService: LoginService) {

  }

  handlerError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }


  getAllTutorials() {
    return this.http.get(`${this.academicUrls.allTutorials}?token=${this.loginService.getToken()}`)
    .map(res => { return res.json(); } );
  }

  deleteTutorial(tutorialId) {
    return this.http.delete(`${this.academicUrls.deleteTutorial}${tutorialId}?token=${this.loginService.getToken()}`)
    .map(res => { return res.json(); } );
  }

  filterTutorialList(params) {
    return this.http.post(`${this.academicUrls.filterTutorial}?token=${this.loginService.getToken()}`, params)
    .map(res => { return res.json(); } );
  }

  addnewTutorial(params) {
    return this.http.post(`${this.academicUrls.saveTutorial}?token=${this.loginService.getToken()}`, params)
    .map(res => { return res.json(); } );
  }


  ediTutorial(tutorialId, params) {
    return this.http.put(`${this.academicUrls.updateTutorial}${tutorialId}?token=${this.loginService.getToken()}`, params)
    .map(res => { return res.json(); } );
  }

  usersForSendTutorial(params) {
    return this.http.post(`${this.academicUrls.usersForSendTutorial}?token=${this.loginService.getToken()}`, params)
    .map(res => { return res.json(); } );
  }

  sendTutorial(params) {
    return this.http.post(`${this.academicUrls.sendTutorial}?token=${this.loginService.getToken()}`, params)
    .map(res => { return res.json(); } );
  }
}
