import { Component, OnInit } from '@angular/core';
import { Login } from '../model/login';
import { HttpClientService } from '../service/http-client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  login: Login = new Login();
  login1: Login = new Login();
  adminType = false;
  studentType = false;

  invalidLogin = false
  constructor(private httpClientService: HttpClientService,
    private router: Router,

  ) { }

  ngOnInit() {
  }

  checkLogin(): void {
    this.httpClientService.loginService(this.login).subscribe(data => {
  console.log("mein kya bol raha hu",data);

      if (data === null) {
        this.invalidLogin = true;
        alert("Envalid Login.");

      }

      else {
        this.login1 = data;

        if (this.login1[0].userType === "admin") {
          this.adminType = true;

        }
        if (this.login1[0].userType === "student") {
          this.studentType = true;
        }
        
        sessionStorage.setItem("user", JSON.stringify(this.login1[0]));
       // sessionStorage.setItem("userEmailId", this.login1[0].userEmailId);
       // sessionStorage.setItem("userType",this.login1[0].userType)

        this.invalidLogin = false;

        if (this.adminType) {
          this.router.navigate(["showStudent"]);
        }

        if(this.studentType){
          this.router.navigate(["showQuestion"]);
        }
      }



    });
  }

 

}
