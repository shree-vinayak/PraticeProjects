import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  // To save the UserObject Object
  saveUser(user: any) {
    return this.http.post(`${environment.baseUrl}saveUser`, user);
  }

}
