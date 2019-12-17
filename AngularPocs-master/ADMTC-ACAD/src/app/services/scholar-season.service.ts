import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { LoginService } from './login.service';
import { Season } from '../models/scholerseason.model';
import { ScholerSeason } from '../shared/global-urls';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ScholarSeasonService {

  constructor(private http: Http,
    private loginservice: LoginService
  ) { }

  getscholerSeason(): Observable<any> {
    return this.http.get(ScholerSeason.getUrl + '?token='
      + this.loginservice.getToken()
    ).map((response: Response) => response.json().data);
  }

  getAssociatedscholerSeason(id): Observable<any> {
    return this.http.get(ScholerSeason.associatedScholarSeason + id + '/scholarseason' + '?token='
      + this.loginservice.getToken()
    ).map((response: Response) => response.json().data);
  }

  addscholerSeason(season: Season) {
    const body = JSON.stringify(season);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(ScholerSeason.getUrl + '?token=' + this.loginservice.getToken(), body, {
      headers: headers
    })
      .map((data: Response) => data.json());
  }

  oneditscholerSeason(id, season: Season) {
    const body = JSON.stringify(season);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(ScholerSeason.getUrl + '/' + id + '?token=' + this.loginservice.getToken(), body, {
      headers: headers
    })
      .map((data: Response) => data.json());

  }

  getRNCPnotinSeason(dates) {
    const body = JSON.stringify(dates);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(ScholerSeason.notinSeasonUrl + '?token=' + this.loginservice.getToken(), body, {
      headers: headers
    }).map((data: Response) => data.json());
  }
  getAllScholarSeasons(){
    return this.http.get(ScholerSeason.getUrl + '?token=' + this.loginservice.getToken()).map((data: Response) => data.json());
  }
  getScholarSeasonByRcnp(id){
    return this.http.get(ScholerSeason.getSeasonsbyRncpUrl + id + '?token=' + this.loginservice.getToken())
    .map((data: Response) => data.json());
  }

}
