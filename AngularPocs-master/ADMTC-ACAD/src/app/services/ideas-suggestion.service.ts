import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Http, Response } from '@angular/http';
import { IdeasURL } from '../shared/global-urls';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Page } from '../models/page.model';
import { Sort } from '../models/sort.model';
import { Idea } from '../models/idea.model';
import { LoginService } from './login.service';

@Injectable()
export class IdeasSuggestionService {
  limit = 1000;


  constructor(
    private http: Http,
    private loginService: LoginService
  ) { }

  getOneThousandIdeas(page: Page, sort: Sort) {

    const token = this.loginService.getToken();
    let url = IdeasURL.url + '?page=' + (page.pageNumber + 1) + '&limit=' + this.limit + '&sortby=' + sort.sortby + '&sortmode=' + sort.sortmode + '&token=' + token;

    return this.http.get(url)
      .map((response) => {
        let res = response.json();
        console.log('response', res);
        return res;
      });
  }
  isStudent() {
    const user = this.loginService.getLoggedInUser();
    if (user.isUserStudent === true) {
      return true;
    }
    return false;
  }
  isMentor() {
    const user = this.loginService.getLoggedInUser();
    if (user !== undefined && user) {
      if (user.types && user.types[0] && user.types[0].name === 'mentor') {
        return true;
      }
    }
    return false;
  }


  /* do like on idea */
  doLike(lang, ideaId) {
    const token = this.loginService.getToken();
    return this.http.post(IdeasURL.url + ideaId + '/like' + '?token=' + token, lang)
      .map(res => {
        let response = res.json();
        console.log(response);
        if (response.status === 'OK') {
          return {
            point: response.data.pointCount,
            ideaId: ideaId
          };
        } else {
          return false;
        }
      });
  }

  deleteIdea(ideaId) {
    const token = this.loginService.getToken();
    return this.http.delete(IdeasURL.url + ideaId + '?token=' + token)
      .map(res => {
        let response = res.json();
        console.log(response);
        if (response.data.nModified === 1) {
          return true;
        } else {
          return false;
        }
      });
  }

  addIdeas(ideaObj: Idea) {
    const token = this.loginService.getToken();
    const url = IdeasURL.url;
    return this.http
      .post(url + '?token=' + token, ideaObj)
      .map(res => {
        const response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });
  }

  editIdeas(ideaObj: Idea) {
    const token = this.loginService.getToken();
    const url = IdeasURL.url;
    return this.http
      .put(url + ideaObj._id + '?token=' + token, ideaObj)
      .map(res => {
        let response = res.json();
        if (response.status === 'OK') {
          return response.data;
        } else {
          return [];
        }
      });
  }

}
