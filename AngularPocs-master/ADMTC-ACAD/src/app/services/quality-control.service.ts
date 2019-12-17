import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApplicationUrls } from '../shared/settings/application-urls';
import { LoginService } from './login.service';

@Injectable()
export class QualityControlService {
  constructor(private http: Http,
            private loginService: LoginService) { }

  getStudentsForQualityControlTable(testId) {
    return this.http.get(
        ApplicationUrls.academic.studentsForQualityControlTable + '/' + testId + '?token=' + this.loginService.getToken(),
        ).map((res) => {
          const response = res.json();
          return response;
        });
  }

  checkIfTestIsDoneOrNot(testId) {
    return this.http.get(
      ApplicationUrls.academic.checkIfTestIsDoneOrNot + testId + '?token=' + this.loginService.getToken(),
      ).map((res) => {
        const response = res.json();
        return response;
    });
  }
}
