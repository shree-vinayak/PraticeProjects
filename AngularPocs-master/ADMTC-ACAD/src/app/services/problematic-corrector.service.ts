import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { UserTypes, Base } from '../shared/global-urls';
import { Http } from '@angular/http';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class ProblematicCorrectorService {
  constructor(private http: Http, private loginService: LoginService, private translate: TranslateService) {}

  // It will excepting users with type Corrector of Problematic and Admin Certifier from BE
  findCorrectorCertifier(data: { schoolId: string; rncpTitle: string }) {
    return this.http.get(
      `${
        Base.url
      }academic/problematic/correctorProblematic/find?token=${this.loginService.getToken()}&schoolId=${
        data.schoolId
      }&rncpTitle=${data.rncpTitle}`,
    );
  }

  // It will assign corrector of problematic
  assignCorrectorOfProblematic(data: {
    correctorProblematics: string[];
    rncpTitle: string;
    taskId: string;
  }) {
    return this.http.post(
      `${
        Base.url
      }academic/problematic/assign/correctors?token=${this.loginService.getToken()}&lang=${this.translate.currentLang}`,
      data,
    );
  }

  // Will return all school that corrected by current corrector of problematic (Decide by token)
  getSchoolCorrectionByCorrector() {
    return this.http.get(
      `${
        Base.url
      }academic/problematic/find/byCorrector?token=${this.loginService.getToken()}`,
    );
  }

  getSchoolByTheTitle(titleId: string) {
    return this.http.get(
      `${
        Base.url
      }academic/problematic/getSchool/byTheTitle/${titleId}?token=${this.loginService.getToken()}`,
    );
  }

  // Will return all student by school and title
  getStudentCorrectionOfProlematic(data: { rncpId: string; schoolId: string }) {
    console.log(
      `${Base.url}academic/problematic/find/student/${data.rncpId}/${
        data.schoolId
      }?token=${this.loginService.getToken()}`,
    );
    return this.http.get(
      `${Base.url}academic/problematic/find/student/${data.rncpId}/${
        data.schoolId
      }?token=${this.loginService.getToken()}`,
    );
  }

  // Count the school length of the title
  countTotalOfSchool(rncpId: string) {
    return this.http.get(
      `${
        Base.url
      }academic/problematic/countTotalSchoolOnTitle/${rncpId}?token=${this.loginService.getToken()}`,
    );
  }

  // It will call the title from the correction of problematic
  getAllThetitle() {
    return this.http.get(
      `${
        Base.url
      }academic/problematic/getTheTitle/byTheCorrector?token=${this.loginService.getToken()}`,
    );
  }
}
