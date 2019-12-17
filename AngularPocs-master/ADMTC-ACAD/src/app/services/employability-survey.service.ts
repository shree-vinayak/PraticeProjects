import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoginService } from './login.service';
import { EmployabilitySurvey } from '../shared/global-urls';
import { ApplicationUrls } from 'app/shared/settings';


@Injectable()
export class EmployabilitySurveyService {

  constructor(private http:Http,
              private loginService: LoginService) { }

  sendSurvey(rncpId, classId, scholarSeasonId, lang) {
    let body = {
      rncpId : rncpId,
      classId : classId,
      scholarSeasonId : scholarSeasonId,
      lang: lang
    }
    return this.http.post(EmployabilitySurvey.sendUrl+ '?token=' + this.loginService.getToken() , body).map((data: Response) => data.json());
  }

  updateSurvey(surveyId, survey) {
    const  data  =  {data : survey} ;
    return this.http.put(EmployabilitySurvey.updateSurvey + surveyId + '?token=' + this.loginService.getToken(), data).map(response => {
      return response.json().data;
    });
  }

  getSurvey(surveyId) {
    return this.http.get(EmployabilitySurvey.getSurvey + surveyId + '?token=' + this.loginService.getToken()).map(response => {
      return response.json().data;
    });
  }
  sendReminder(rncpId, classId, scholarSeasonId, lang){
    let body = {
      rncpId: rncpId,
      classId: classId,
      scholarSeasonId: scholarSeasonId,
      lang: lang
    }
    return this.http.post(EmployabilitySurvey.remindUrl + '?token=' + this.loginService.getToken(), body).map((data: Response) => data.json());
  }

  getEmplyabilitySurveys(body) {
    return this.http.post( ApplicationUrls.academic.exportEmployabilitySurveyCSV + '?token=' + this.loginService.getToken() ,body).map( res => {
      return res.json().data;
    });
  }

}
