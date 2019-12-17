import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoginService } from './login.service';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../app-settings';


@Injectable()
export class TutorialService {

    academicUrls = AppSettings.urls.academic;

  constructor(private http: Http,
             private loginService: LoginService) {

  }

  handlerError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }


  getTutorialListBasedOnUser(params) {
    return this.http.post(`${this.academicUrls.tutorials}?token=${this.loginService.getToken()}`, params)
    .map(res => { return res.json(); } );
  }

}
