import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private _router: Router) { }



  loggedIn() {
    const b = !!sessionStorage.getItem('token');
    return b;
  }

  gettoken() {
    return sessionStorage.getItem('token');
  }

  isSuperAdmin() {
    if (sessionStorage.getItem('role') === 'SUPERADMIN') {
      return true;
    }
    else
      return false
  }


  logoutUser() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
    this._router.navigate(['/home']);

  }
}
