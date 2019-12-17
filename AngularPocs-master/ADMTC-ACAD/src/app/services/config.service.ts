import { Injectable } from '@angular/core';
import { AppSettings } from '../app-settings';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { LoginService } from './login.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('ConfigService');
log.color = 'violet';

@Injectable()
export class ConfigService {
  newFeatureConfigUrl = AppSettings.urls.academic.newFeatureConfig;
  configDetails: any;

  constructor(private http: Http, private loginService: LoginService) { }

  getConfigDetails(): Observable<any> {

    // if (this.configDetails && this.configDetails._id) {
    //   return Observable.of(this.configDetails);
    // }

    return this.http
      .get(`${this.newFeatureConfigUrl}?token=${this.loginService.getToken()}`)
      .map(resp => {
        const response = resp.json();
        if (response.status === 'OK') {
          this.configDetails = response.data;
          return response.data;
        } else {
          return {};
        }
      })
      .catch(error => {
        log.data('getConfigDetails error', error);
        return 'An Error Occured while retirving configuration';
      });
  }
}
