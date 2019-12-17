import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  isUserLoggedIn() {
    // let userEmailId = sessionStorage.getItem('userEmailId');
    let user = JSON.parse(sessionStorage.getItem('user'));
    // console.log("isUserLoggedIn", user.userEmailId);
    console.log('inside the isUserLoggedIn')
    return !(user === null);
    //return !(userEmailId === null);
  }

  logOut() {
    // sessionStorage.removeItem('userEmailId')
    sessionStorage.removeItem('user')
  }
}
