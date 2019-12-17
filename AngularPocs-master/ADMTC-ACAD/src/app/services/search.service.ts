import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SearchTests } from '../shared/global-urls';
import { LoginService } from './login.service';

@Injectable()
export class SearchService {

  constructor(
    private http: Http,
    private loginService: LoginService
  ) {
  }

  searchTests(keyword: string) {
    return this.http.get(SearchTests.url + '?token=' + this.loginService.getToken(), { params: { keyword: keyword } }).map(res => {
      let response = res.json();
      console.log('Search Test', response);
      if (response.status === 'OK') {
        return response.data;
      } else {
        return [];
      }
    });
  }

}
