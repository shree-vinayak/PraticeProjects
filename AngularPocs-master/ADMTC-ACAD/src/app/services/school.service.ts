import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Http, Response } from '@angular/http';
import { Certifiers } from '../shared/global-urls';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Category } from '../models/category.model';
import { Document } from '../models/document.model';
import { Test } from '../models/test.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Page } from '../models/page.model';
import { Sort } from '../models/sort.model';
import { DemoData } from '../shared/demo-data';
import { Base } from '../shared/global-urls';
import { LoginService } from './login.service';

@Injectable()
export class SchoolService {

  // demo code
  titles: any[] = [];

  // new code
  selectedTitle = new BehaviorSubject<any>(null);

  constructor(
    private http: Http,
    private loginService: LoginService
  ) {
    // this.automate();
  }


  getSchools(page: Page, sort: Sort) {

    return this.http.get(Certifiers.getUrl + '?page=' + (page.pageNumber + 1)
      + '&limit=' + page.size + '&sortby=' + sort.sortby + '&sortmode=' + sort.sortmode + '?token=' + this.loginService.getToken())
      .map((response) => {
        const res = response.json();
        return {
          titles: res.data,
          total: res.total
        };
      });
  }

  addNewSchoolRncp(data){
    return this.http.post(Base.url + 'academic/quickCreate/RncpAndSchool' + '?token=' + this.loginService.getToken(), data).map(res =>{
      let response = res.json();
      if (response) {
        return response;
      } else {
        return [];
      }
    });
  }
  updateSchoolRncp(id, data){
    return this.http.put(Base.url + 'academic/schools/' + id + '?token=' + this.loginService.getToken(), data).map(res =>{
      let response = res.json();
      if (response) {
        return response;
      } else {
        return [];
      }
    });
  }



}
