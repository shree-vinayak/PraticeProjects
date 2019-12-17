import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  name: any


  loginForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]),//Validators.email,
    password: new FormControl(null, Validators.required)
  });


  constructor(private _router: Router, private _user: UserService) { }

  ngOnInit() {
  }

  login() {
    if (!this.loginForm.valid) {
      alert("invalid form")
    }
    else {
      this._user.login(this.loginForm.value).subscribe(
        (data: any) => {

          console.log('data', data);
          if (data.status === "SUCCESS") {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("role", data.obj.role);
            sessionStorage.setItem("username", data.obj.username);
            sessionStorage.setItem("userId", data.obj.userId);
            if (data.obj.role === "SUPERADMIN") {
              this._router.navigate(['/superadmin'], {
                queryParams: {
                  "name": data.obj.name
                }
              });
            }
            if (data.obj.role === "ADMIN") {
              this._router.navigate(['/admin']);
            }
          }
          else {
            this._router.navigate(['/login'])
          }


        }
      )
    }
  }

}
