import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { LoginService } from './login.service';
import { CalenderStep } from '../models/calendarstep.model';
import { Calenderstep } from '../shared/global-urls';

@Injectable()
export class CalendarStepService {

  constructor(private http: Http,
    private loginservice: LoginService
  ) { }

  getCalenderSteps() {
    return this.http.get(Calenderstep.getUrl + '?token=' + this.loginservice.getToken())
      .map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });
  }


  addcalendarStep(calendarStep: CalenderStep) {
    const body = JSON.stringify(calendarStep);
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.post(Calenderstep.getUrl + '?token=' + this.loginservice.getToken(), body, {
      headers: header
    })
      .map((data: Response) => data.json());
  }

  editcalendarStep(calendarStep: CalenderStep) {
    const body = JSON.stringify(calendarStep);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(Calenderstep.getUrl + calendarStep._id + '?token=' + this.loginservice.getToken(), body, {
      headers: headers
    })
      .map((data: Response) => data.json());
  }

  deletecalenderStep(id) {
    return this.http.delete(Calenderstep.getUrl + '/' + id + '?token=' + this.loginservice.getToken())
      .map((response: Response) => response.json());
  }

}
