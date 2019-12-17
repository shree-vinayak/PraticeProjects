import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, Validators.required)
  });

  constructor(private _router: Router, private _user: UserService) { }

  ngOnInit() {
  }

  moveToRegister() {
    this._router.navigate(['/register']);
  }

  login() {
    if (!this.loginForm.valid) {
      console.log('Invalid'); return;
    }
    else {
      this._user.login(JSON.stringify(this.loginForm.value))
        .subscribe(
          data => {
            console.log(data);
            sessionStorage.setItem("user", JSON.stringify(data));
            this._router.navigate(['/list']);
          },
          error => console.error(error)
        )
    }
  }

}