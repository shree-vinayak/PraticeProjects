import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Documents } from '../../shared/global-urls';
import { LoginService } from 'app/services/login.service';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';

@Injectable()
export class DoctestService {

  constructor(
    private http: Http,
    private loginService: LoginService
  ) { }

  getAllDocTest() {
    return this.http.get(Documents.getallDocTest + '&token=' + this.loginService.getToken()).map( response => {
      return response.json().data;
    });
  }

  searchAndFilter(searchBody, page: Page, sort: Sort) {
    return this.http.post(Documents.documentSearchFilter + '?token=' + this.loginService.getToken() +
                          '&limit=' + page.size + '&page=' + (page.pageNumber + 1) +
                          '&sortby=' + sort.sortby + '&sortmode=' + sort.sortmode
                          , searchBody).map( response => {
      return response.json();
    });
  }
}
