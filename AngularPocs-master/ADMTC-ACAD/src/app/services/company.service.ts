import { ApplicationUrls } from 'app/shared/settings';
import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Company } from '../models/company.model';
import { Companies } from '../shared/global-urls';
import { LoginService } from '../services/login.service';
import 'rxjs/add/operator/catch';

@Injectable()
export class CompanyService {
    academicUrls = ApplicationUrls.academic;
    companyList: Company[] = [];
    token: any = '';
    constructor(private http: Http, private loginService: LoginService) {

        this.token = this.loginService.getToken();

    }

    handlerError(error: Response) {
        console.error(error);
        return Observable.throw(error);
    }

    addCompany(company: Company) {
        this.companyList.push(company);
        return this.companyList;
    }

    getCompanyById(id: string) {
        return this.companyList.filter(h => h.id === id)[0];
    }

    getCompany() {
        return this.companyList;
    }

    getCompanieList(): Observable<any> {
        return this.http.get(Companies.url + '?token=' + this.loginService.getToken())
            .map((response) => response.json());
    }

    getCompanies() {
        let token = this.loginService.getToken();
        return this.http.get(Companies.url + '?token=' + token + '&limit=100')
            .map((response) => {
                const res = response.json();
                return {
                    data: res.data,
                    total: res.total
                };
            });
    }
    getCompaniesLinkedToSchool(schoolId) {
        let token = this.loginService.getToken();
        return this.http.get(this.academicUrls.companinesLinkedToSchool + schoolId + '?token=' + token + '&limit=100')
            .map((response) => {
                const res = response.json();
                return {
                    data: res.data,
                    total: res.total
                };
            });
    }
    addCompanies(data) {
      const token = this.loginService.getToken();
      return this.http.post(Companies.url + '?token=' + token, data)
      .map(res => res.json())
      .catch(this.handlerError);
  }

}
