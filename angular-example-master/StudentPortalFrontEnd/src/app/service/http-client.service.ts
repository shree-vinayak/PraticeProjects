import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Login } from '../model/login';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private httpClient:HttpClient,
  ) { }


  loginService(login){
    console.log("login service")
    console.log('111111')
    this.httpClient.get<Login>("http://localhost:8080/astute/company/get").subscribe(val => console.log(val));
    console.log('222222')
    return this.httpClient.post<Login>('http://localhost:2017/user/login',login);
  }

  getStudentService(){
    console.log("get Student service");
    return this.httpClient.get<Login>("http://localhost:2017/user/getStudent");
  }

  deleteStudentService(id){
    console.log("inside delete service")
    return this.httpClient.delete("http://localhost:2017/user/deleteStudent"+"/"+id)
  }
  
  registerStudentService(student:Login){
    console.log("inside register service")
    return this.httpClient.post<Login>("http://localhost:2017/user/registerStudent",student);

  }

  
}
