import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { matchingPasswords } from '../../../custome-validation/custom-validator';
import { UserService } from '../../../services/users.service';
import { LoginService } from '../../../services/login.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../../models/user.model';
import { GlobalConstants, ApplicationUrls } from '../../../shared/settings';
declare var swal: any;

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  public form: FormGroup;
  id;
  userData: Array<User>;
  civility = '';
  male: boolean = true;
  token;
  privacyCheck: boolean = false;

  private subscription: Subscription;
  constructor(private _fb: FormBuilder,
    private loginService: LoginService,
    public translate: TranslateService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private service: UserService,
  ) {

  }

  ngOnInit() {
    localStorage.removeItem('loginuser');
    this.service.setIsLogoutFlag();
    const tokenData = this.route.snapshot.params['token'];
    if (tokenData === 'undefined') {
      swal({
        title: 'Alert',
        text: 'Token is Undefined',
        allowEscapeKey: true,
        type: 'error'
      });
      localStorage.removeItem('loginuser');
      this.service.setIsLogoutFlag();
      this.router.navigate(['login']);
    }
    this.service.checkSetPassword(tokenData).subscribe((response) => {
      if (!response.isValid) {
      this.translate.reloadLang(this.translate.currentLang).subscribe( sub => {
        const self = this;
        swal({
          type: 'error',
          title: this.translate.instant('USERS.SETPASSWORD.ERROR.TITLE'),
          html: this.translate.instant('USERS.SETPASSWORD.ERROR.EXPMSG'),
          showCancelButton: false,
          // confirmButtonText: this.translate.instant('USERS.SETPASSWORD.ERROR.FORGOTPASS'),
          confirmButtonText: this.translate.instant('USERS.SETPASSWORD.ERROR.LOGIN')
        }).then(function (isConfirm) {
          if (isConfirm) {
            self.router.navigate(['/login']);
          }
        }.bind(this));
      }
    )};
    
      if (response.isValid) {
        this.userData = response.user;
        this.userData.forEach(user => {
          if (user.civility === 'MR') {
            this.male = true;
          }
          if (user.civility === 'MRS') {
            this.male = false;
          }

        });
      }

    });
    this.subscription = this.route.params.subscribe(
      params => {
        if (params.hasOwnProperty('token')) {
          this.token = params['token'];
        }
      });



    this.form = this._fb.group({
      'password': ['', [Validators.required]],
      'confirmPassword': ['', [Validators.required]]
    }, {
        validator: matchingPasswords('password', 'confirmPassword')
      });

  }

  save(value) {
    if (this.form.valid) {
      const data = {
        password: value.password,
        repeatPassword: value.confirmPassword
      };
      this.service.recoverPassword(this.token, data).subscribe((response) => {
        if (response.code === 200) {
          this.translate.reloadLang(this.translate.currentLang).subscribe( sub => {
          swal({
            title: this.translate.instant('RESET_PASSWORD.TITLE'),
            text: this.translate.instant('RESET_PASSWORD.MESSAGE'),
            type: 'success',
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('RESET_PASSWORD.BUTTON')
          })
        });
          const email = response.data.email;
          this.loginService.loginRegistredUser(email, value.password).subscribe((status) => {
            if (status != null) {
              const result = status.user;
              localStorage.setItem('loginuser', JSON.stringify(result));
              localStorage.setItem('token', status.token);
              if (result !== undefined || result != null) {
                  this.service.setIsLoginFlag(true);
                  if (result.entity.type === 'company') {
                    this.router.navigate(['students']);
                  } else if (result.entity.type === 'group-of-schools') {
                    this.router.navigate(['school-group']);
                  }  else {
                    if (result.isUserStudent === true) {
                      this.router.navigate(['myfile']);
                    } else {
                      this.router.navigate(['rncp-titles']);
                    }
                  }
              } else {
                swal({
                  title: 'Alert',
                  text: 'Failed to Auto Login',
                  allowEscapeKey: true,
                  type: 'error'
                });
              }
            } else {
              swal({
                title: 'Alert',
                text: 'Failed to Auto Login',
                allowEscapeKey: true,
                type: 'error'
              });
            }
          });
        } else {
          swal({
            title: 'Warning',
            text: response.message,
            allowEscapeKey: true,
            type: 'warning'
          });
        }

      });
    }
  }

 
  gotoPrivacyPolicy() {
    const privacyPolicylink = document.createElement('a');
    privacyPolicylink.target = '_blank';

    if (this.translate.currentLang.toLowerCase() === 'en') {
      privacyPolicylink.href = ApplicationUrls.baseApi + GlobalConstants.privacyPolicy.ENLink;
    } else {
      privacyPolicylink.href = ApplicationUrls.baseApi + GlobalConstants.privacyPolicy.FRLink;
    }

    privacyPolicylink.setAttribute('visibility', 'hidden');
    document.body.appendChild(privacyPolicylink);
    privacyPolicylink.click();
    document.body.removeChild(privacyPolicylink);
  }

  privacyCheckEvent(event) {
    if (event.hasOwnProperty('checked')) {
      this.privacyCheck = event.checked;
    }
  }
}
