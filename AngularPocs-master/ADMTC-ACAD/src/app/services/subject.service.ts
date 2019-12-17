import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoginService } from './login.service';
import { Observable } from 'rxjs/Observable';
import { Subject, Base} from '../shared/global-urls';


@Injectable()
export class SubjectService {

  constructor(private http: Http, private loginService: LoginService) {

  }

  handlerError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }

  getAllSubject() {
    return this.http.get(Subject.url + '?token=' + this.loginService.getToken())
    .map((response) => {
      const res = response.json();
      console.log(res);
        return {
          subjectList: res.data,
          total: res.total
        }
    });
  }
  getTitleSubject(id){

    return this.http.get(Base.url + 'academic/rncp-titles/' + id + '/expertise?token=' + this.loginService.getToken())
    .map((response) => {
      let res = response.json();
      console.log(res);
        return {
          subjectList: res.data,
          total: res.total
        };
    });
  }

  createSubject(data) {
    return this.http.post(Subject.url + '?token=' + this.loginService.getToken(), data).map(response => {
      const data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }

  updateSubject(id, data) {
    return this.http.put(Subject.url + '/' + id + '?token=' + this.loginService.getToken(), data).map(response => {
      const data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }

  removeSubject(id, expId) {

    return this.http.delete(Subject.url + '/' + id + '?token=' + this.loginService.getToken() + '&expertiseId=' + expId).map(response => {
      const data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }
  removeTest(id, subId) {
    return this.http.delete(Base.url + 'academic/subjectTest/' + id + '?token=' + this.loginService.getToken() + '&SubjectId=' + subId).map(response => {
      const data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }



}
