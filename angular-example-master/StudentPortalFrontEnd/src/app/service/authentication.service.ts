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
    return !(user === null);
    //return !(userEmailId === null);
  }

  isUserType() {
  //  let userType = sessionStorage.getItem("userType");
  let userType = JSON.parse(sessionStorage.getItem('user')).userType;
    return (userType === "admin");
  }

  logOut() {
   // sessionStorage.removeItem('userEmailId')
   sessionStorage.removeItem('user')
  }
}
