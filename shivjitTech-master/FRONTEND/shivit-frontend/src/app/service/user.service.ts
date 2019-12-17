import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


let header = new HttpHeaders({
  'Content-Type': 'application/json',
  // 'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Headers': 'Content-Type',
  // 'Access-Control-Request-Method': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
});

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  login(body: any) {
    return this._http.post('http://localhost:8762/login', body);
  }

  addService(body: any) {
    return this._http.post('http://localhost:8762/subscription/service', body);
  }


  // headers = new HttpHeaders({ authorization: 'Bearer ' + sessionStorage.getItem('token') });
  getService() {
    return this._http.get('http://localhost:8762/subscription/services');//, { headers: this.headers }
  }

  getServiceForUser() {
    return this._http.get(`http://localhost:8762/subscription/users/${sessionStorage.getItem('userId')}/services`);
  }

  addAdmin(adminUser: any) {
    return this._http.post('http://localhost:8762/userRegistration', adminUser)
  }
}
