import { Injectable } from '@angular/core';
import { Http, Jsonp, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate/ng2-translate';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Base, Documents } from '../../shared/global-urls';
import { LoginService } from '../../services/login.service';

// import { Page } from './../model/page';
// import { Sort } from './../model/sort';

import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import { AppSettings } from '../../app-settings';
import { ApplicationUrls } from '../../shared/settings/application-urls';

const CUSTOMER_API: string = Base.url + 'academic/schools';
const CERTIFIER_API: string = Base.url + 'academic/school/Certifiers';
const DEALS_API: string = Base.url + 'academic/deals';
const CONTACTS_API: string = Base.url + 'academic/contacts';
const ROLES_API: string = Base.url + 'roles/';
const HISTORYTASKS_API: string = Base.url + '/academic/tasks';
const MESSAGETASK_API: string = Base.url + '/academic/mails/Inbox';
const TEMPLATETASK_API: string = Base.url + '/academic/template';
const AUTOCOMPLETE_API: String = Base.url + '/autocomplete/user-types';




@Injectable()
export class CustomerService {

  limit = 1000;

  schoolId = '';
  schoolShortName = '';
  currentSchool =  {
                    _id: '',
                    schoolShortName: ''
                   };
  academicUrls: any = AppSettings.urls.academic;
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: Http,
    private translate: TranslateService,
    private loginService: LoginService
  ) { }

  getLanguageFr() {
    const browserLang: string = this.translate.getBrowserLang();
    if (browserLang === 'fr') {
      return true;
    } else {
      return false;
    }
  }


 getCertifierBySchool(schoolId) {
   console.log("schoolId",schoolId);
    return this.http.get(Base.url + 'academic/rncpTitles/getAllByCertifier' + '/' + schoolId + '?token=' + this.loginService.getToken())
    .map(res => {
      const response = res.json();
      return response;
    });
  }

  getCustomers(): Observable<any> {
    return this.http
      .get(CUSTOMER_API + '?limit=0' + '&token=' + this.loginService.getToken())
      .map((response: Response) => response.json().data);
  }

  getCustomersList(page, sort): Promise<any> {
    return this.http.get(CUSTOMER_API + '?page=' + 1
      + '&limit=' + 0 + '&sortby=' + sort.sortby + '&sortmode=' + sort.sortmode
      + '&token=' + this.loginService.getToken())
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getSchoolsBasedOnLoggedInUserType() {
    return this.http.post(ApplicationUrls.academic.getSchoolsBasedOnLoggedInUserType + '?token=' + this.loginService.getToken(), {})
      .map( schools => {
        return schools.json();
      });
  }

  getSchoolBasedOnRNCP(rncpIds) {
    return this.http.post(ApplicationUrls.academic.schoolBasedOnRNCP + '?token=' + this.loginService.getToken(), rncpIds)
      .map( schools => {
        return schools.json();
      });
  }

  getCustomersListForCertifier(page, sort, rncpId): Promise<any> {
    return this.http.get(CUSTOMER_API + '?certifier=true&page=' + 1
      + '&limit=' + this.limit
      + '&sortby=' + sort.sortby
      + (rncpId ? '&rncpId=' + rncpId : ' ')
      + '&sortmode=' + sort.sortmode
      + '&token=' + this.loginService.getToken())
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  getCustomersListForPreparationCenter(page, sort): Promise<any> {
    return this.http.get(CUSTOMER_API + '?preparationCenter=true&page=' + 1
      + '&limit=' + this.limit + '&sortby=' + sort.sortby + '&sortmode=' + sort.sortmode
      + '&token=' + this.loginService.getToken())
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
    getCustomersListSorted() {
    return this.http.get(this.academicUrls.prepCenters + '?token=' + this.loginService.getToken())
      .map(response => response.json())
      .catch(this.handleError);
  }

  getAllCertifier(page?: Page, sort?: Sort) {
    return this.http.get(CERTIFIER_API + '?token=' + this.loginService.getToken() + '&page=' + (page.pageNumber + 1)
      + '&limit=' + page.size + '&sortby=' + sort.sortby + '&sortmode=' + sort.sortmode)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getAllCertifierSorted() {
    return this.http.get(CERTIFIER_API + '?token=' + this.loginService.getToken() + '&sortby=' + 'shortName' + '&limit=1000')
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getContactList(page: Page, sort: Sort): Promise<any> {

    return this.http.get(CONTACTS_API + '?page=' + (page.pageNumber + 1)
      + '&limit=' + page.size + '&sortby=' + sort.sortby + '&sortmode=' + sort.sortmode + '&token=' + this.loginService.getToken())
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }


  getCustomer(customerId): Observable<any> {
    console.log(CUSTOMER_API + '/' + customerId);
    return this.http.get(CUSTOMER_API + '/' + customerId + '?token=' + this.loginService.getToken())
      // .map(this.extractData)
      .map((response: Response) => response.json().data);
    // .do(data => console.log('server data:', data))  // debug
    // .catch(this.handleError);
  }

  getCustomerById(id: string): Observable<any> {
    return this.http.get(CUSTOMER_API + '/' + id + '?token=' + this.loginService.getToken(), {
      headers: this.headers
    })
      .map(response => response.json());
  }

  getCertifierRNCPTitles(id: string): Observable<any> {
    return this.http.get(this.academicUrls.getCertifierRNCPTitles + id + '?token=' + this.loginService.getToken(), {
      headers: this.headers
    })
      .map(response => response.json());
  }

  updateSchoolDetail(customerId, data) {
    console.log(CUSTOMER_API);
    return this.http.put(CUSTOMER_API + '/' + customerId + '?token=' + this.loginService.getToken(), data)
      .map((response: Response) => response.json());
  }

  updateCustomer(customerId, data) {
    return this.http.put(CUSTOMER_API + '/' + customerId + '?token=' + this.loginService.getToken(), data)
      .map((response: Response) => response.json());

  }

  updateAddress(customerId, addressId, data) {
    return this.http.put(CUSTOMER_API + '/' + customerId + '/addresses/' + addressId + '?token=' + this.loginService.getToken(), data)
      .map((response: Response) => response.json());

  }

  updateContact(contactId, data) {
    return this.http.put(CONTACTS_API + '/' + contactId + '?token=' + this.loginService.getToken(), data)
      .map((response: Response) => response.json());
  }

  createContact(data) {
    console.log(data);
    return this.http.post(CONTACTS_API + '?token=' + this.loginService.getToken(), data)
      .map((response: Response) => response.json());
  }

  deleteContact(contactId) {
    return this.http.delete(CONTACTS_API + '?ids=' + contactId + '?token=' + this.loginService.getToken())
      .map((response: Response) => response.json());
  }

  getDeal(dealId): Observable<any> {
    return this.http.get(DEALS_API + '/' + dealId)
      .map((response: Response) => response.json().data);
  }

  getAutoComplete(type): Observable<any> {
    return this.http.get(AUTOCOMPLETE_API + '/' + type)
      .map((response: Response) => response.json().data);
  }

  getHistoryTask(dealId): Observable<any> {
    return this.http.get(HISTORYTASKS_API + '?category=activity&deal=' + dealId + '&token=' + this.loginService.getToken())
      .map((response: Response) => response.json().data);
  }

  getPendingTask(dealId): Observable<any> {
    // console.log(dealId);
    return this.http.get(HISTORYTASKS_API + '?category=todo&deal=' + dealId + '&token=' + this.loginService.getToken())
      .map((response: Response) => response.json().data);
  }

  getMessageTask(): Observable<any> {
    return this.http.get(MESSAGETASK_API + '?token=' + this.loginService.getToken())
      .map((response: Response) => {
        console.log(response.json());
        response.json().data;
      })
  }

  getDocumentTask(): Observable<any> {
    return this.http.get(TEMPLATETASK_API + '?token=' + this.loginService.getToken())
      .map((response) => response.json().data);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body.data || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

  getRoles() {
    return ['Academic Comittee',
      'Headmaster',
      'President of Jury',
      'Signatory'];
  }
  seacrhCity(term: string) {
    const search = new URLSearchParams();
    search.set('keyword', term);
    return this.http.get(Base.url + 'autocomplete/cities', { search }).map((response) => response.json().data);
  }
  seacrhSchool(term: string) {
    const search = new URLSearchParams();
    search.set('keyword', term);
    return this.http.get(Base.url + 'autocomplete/schools', { search }).map((response) => response.json().data);
  }

  searchSchool(schoolName: string, pageNumber: number) {
    const search = new URLSearchParams();
    search.set('schoolName', schoolName);
    return this.http.get(Base.url + 'academic/schools/search?schoolName=' + schoolName + '&token=' + this.loginService.getToken() + '&page=' + (pageNumber + 1) + '&limit=20&sortby=&sortmode=asc').map((response) => response.json());
  }

  saveScoolQuick(sch) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(Base.url + 'academic/schools/quick-add', sch, options);
  }
  userType(dt) {
    const req = new XMLHttpRequest();
    req.open('GET', Base.url + 'api/autocomplete/user-types/academic');
    req.onload = () => { dt(JSON.parse(req.response).data); };
    req.send();
  }

  setSelectedSchoolId(schoolId: string, schoolShortName: string) {
    this.schoolId = schoolId;
    this.schoolShortName = schoolShortName;
  }
  getSelectedSchoolId() {
    console.log(this.schoolId);
    if (this.schoolId !== '' && this.schoolShortName !== '') {
      const school = {
        schoolId: this.schoolId,
        schoolName: this.schoolShortName
      };
      return school;
    }
  }

  getDocsForStudent(studentId, rncpId, schoolId) {
    return  this.http.get(Documents.studentDocuments + '/' + studentId + '?token=' + this.loginService.getToken()
    + `&schoolId=${schoolId}&rncpId=${rncpId}`).map( res => {
      console.log(res);
      return res.json().data;
    });
  }

  getSchoolSpecializations(schoolId) {
  return this.http.get(this.academicUrls.schoolSpecializations + schoolId + '?token=' + this.loginService.getToken())
    .map(response => response.json())
    .catch(this.handleError);
  }
}
