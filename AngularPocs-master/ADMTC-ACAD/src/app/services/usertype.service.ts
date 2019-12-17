import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoginService } from './login.service';
import { Observable } from 'rxjs/Observable';
import { UserTypes,Base} from '../shared/global-urls';


@Injectable()
export class UserTypeService {

  constructor(private http: Http,private loginService: LoginService) {

  }

  handlerError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }

  getAllUserType(){
    return this.http.get(UserTypes.userTypesUrlADMTC + '?limit=200&token=' + this.loginService.getToken())
    .map((response) => {
      let res = response.json();
      console.log(res);
        return {
          list: res.data,
          total: res.total
        }
    });
  }
  getUserTypeCount(id){
    return this.http.get(Base.url + 'user/count/userType/' + id + '?token=' + this.loginService.getToken())
    .map((response) => {
      return response.json();
    });
  }


  createUserType(data) {
    return this.http.post(UserTypes.userTypesUrlADMTC + '?token=' + this.loginService.getToken(), data).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }

  updateUserType(id, data) {
    return this.http.put(UserTypes.userTypesUrlADMTC + '/' + id + '?token=' + this.loginService.getToken(), data).map(response => {
      let data = response.json();
      return data;
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });
  }

  removeUserType(id) {
    return this.http.delete(UserTypes.userTypesUrlADMTC + '/' + id + '?token=' + this.loginService.getToken()).map(response => {
      return response.json();
    }).catch(error => {
      if (error.status === 0) {

      }
      return error;
    });;
  }



}
