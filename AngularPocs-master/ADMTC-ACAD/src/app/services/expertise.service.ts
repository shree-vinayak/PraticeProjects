import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoginService } from './login.service';
import { Observable } from 'rxjs/Observable';
import { Expertise,Base} from '../shared/global-urls';
import { ApplicationUrls } from '../shared/settings';


@Injectable()
export class ExpertiseService {

  constructor(private http: Http,private loginService: LoginService) {

  }

  handlerError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }

  getAllExpertise(){
    return this.http.get(Expertise.url + '?token=' + this.loginService.getToken())
    .map((response) => {
      let res = response.json();
      console.log(res);
        return {
          expertiseList: res.data,
          total: res.total
        }
    });
  }
  getTitleExpertise(id){
    return this.http.get(Base.url + 'academic/rncp-titles/' + id + '/expertise?token=' + this.loginService.getToken())
    .map((response) => {
      const res = response.json();
        return {
          expertiseList: res.data,
          total: res.total
        }
    });
  }

  getTitleExpertiseBaseodOnRNCPAndClass(rncpId, classId) {
    return this.http.get(Base.url + 'academic/rncp-titles/' + rncpId + '/' + classId + '/expertise?token=' + this.loginService.getToken())
    .map((response) => {
      const res = response.json();
        return {
          expertiseList: res.data,
          total: res.total
        }
    });
  }

  createExpertise(data) {
    return this.http.post(Expertise.url + '?token=' + this.loginService.getToken(), data).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status == 0) {

      }
      return error;
    });
  }

  updateExpertise(id, data) {
    return this.http.put(Expertise.url +'/'+ id + '?token=' + this.loginService.getToken(), data).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status == 0) {

      }
      return error;
    });
  }

  updateMultipleExpertise(data){
    return this.http.post(Expertise.multipleUpdate + '?token=' + this.loginService.getToken(), data).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status == 0) {

      }
      return error;
    });
  }

  removeExpertise(id) {
    return this.http.delete(Expertise.url + '/' + id + '?token=' + this.loginService.getToken());
  }

  duplicateCondition(cloneFromClassId: string, cloneToClassId: string) {
    const body = {
      'cloneFromClass': cloneFromClassId,
      'cloneToClass': cloneToClassId
    };
    return this.http.post(ApplicationUrls.academic.duplicateExpertise + '?token=' + this.loginService.getToken(), body).map(data => {
      return data.json();
    });

  }

  generateExpertisePDFForOrganizationFolder(rncpId, body) {
    return this.http.post(ApplicationUrls.academic.generatePdfForOrganizationsFolder + rncpId + '?token=' + this.loginService.getToken(), body).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status == 0) {

      }
      return error;
    });
  }

}
