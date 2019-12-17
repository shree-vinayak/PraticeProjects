import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { matchingPasswords, maxLengthbetween } from '../../../custome-validation/custom-validator';
import { UserService } from '../../../services/users.service';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from '../../../services/login.service';
import { User } from '../../../models/user.model';
import { UtilityService } from '../../../services/utility.service';
import { ApplicationUrls, GlobalConstants } from '../../../shared/settings';
import { LinkedInService } from 'angular-linkedin-sdk';
import _ from 'lodash';
import { ConfigService } from '../../../services/config.service';
declare var swal: any;

@Component({
  selector: 'app-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.scss']
})
export class SetPasswordComponent implements OnInit {
  public form: FormGroup;
  id;
  token;
  returnUrl : string = '';
  userData: Array<User>;
  civility = '';
  male = true;
  privacyCheck: boolean = false;
  displayCookieConcent: boolean = true;
  allowLinkedInLogin = false;
  private subscription: Subscription;
  constructor(
    private _fb: FormBuilder,
    private zone: NgZone,
    public translate: TranslateService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private service: UserService,
    private loginService: LoginService,
    public utilityService: UtilityService,
    private _linkedInService: LinkedInService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = decodeURIComponent(returnUrl);
    if (this.returnUrl === '' ||  this.returnUrl === '/' ||
    this.returnUrl === null || this.returnUrl === '/rncp-titles') {
      this.returnUrl = this.service.mentorLoginURL;
    }
    localStorage.removeItem('loginuser');
    this.service.setIsLogoutFlag();
    const idData = this.route.snapshot.params['id'];
    const tokenData = this.route.snapshot.queryParams['token'];


    let tokenExpiredMessage = this.translate.instant('USERS.SETPASSWORD.ERROR.');
    tokenExpiredMessage = tokenExpiredMessage === 'USERS.SETPASSWORD.SETPASSWORDLINKEXPIRED' ?
      'Ce lien à expiré. cliquer sur Mot de Passe Oublié pour recevoir in nouveau lien.'
      : tokenExpiredMessage;

    this.service.checkSetPassword(tokenData).subscribe((response) => {
      if (!response.isValid) {
        const self = this;
        this.translate.reloadLang(this.translate.currentLang).subscribe( sub => {
        swal({
          type: 'error',
          title: this.translate.instant('USERS.SETPASSWORD.ERROR.TITLE'),
          html: this.translate.instant('USERS.SETPASSWORD.ERROR.EXPMSG'),
          showCancelButton: true,
          confirmButtonText: this.translate.instant('USERS.SETPASSWORD.ERROR.FORGOTPASS'),
          cancelButtonText: this.translate.instant('USERS.SETPASSWORD.ERROR.LOGIN')
        }).then(function (isConfirm) {
          if (isConfirm) {
            self.router.navigateByUrl('/forgotpassword');
          }
        }, function (dismiss) {
          if (dismiss === 'cancel') {
            self.router.navigateByUrl('/login');
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
        if (params.hasOwnProperty('id')) {
          this.id = params['id'];
        } else {
        }
      });

    this.subscription = this.route
      .queryParams
      .subscribe(params => {
        if (params.hasOwnProperty('token')) {
          this.token = params['token'];
        }
      });

    this.form = this._fb.group({
      'password': ['', [Validators.required]],
      'confirmPassword': ['', [Validators.required]]
    }, { validator: matchingPasswords('password', 'confirmPassword') });

    this.configService.getConfigDetails().subscribe(data => {
      if (data.login && data.login.allowSocialLogin) {
        this.allowLinkedInLogin = data.login.allowLinkedInLogin ? data.login.allowLinkedInLogin : false;
      }
    });

  }

  redirect(pathName: string) {
    this.router.navigate(['/' + pathName]);
  }

  save(value) {
    if (this.form.valid) {
      const data = {
        password: value.password,
        repeatPassword: value.confirmPassword
      };
      this.service.setPassword(this.id, this.token, data).subscribe((response) => {
        if (response.hasOwnProperty('code')) {
          if (response.code === 200) {
            swal({
              title: this.translate.instant('SET_PASSWORD.TITLE'),
              text: this.translate.instant('SET_PASSWORD.MESSAGE'),
              type: 'success',
              allowEscapeKey: true,
              confirmButtonText: this.translate.instant('SET_PASSWORD.BUTTON')
            });
            const email = response.data.email;
            this.loginService.loginRegistredUser(email, value.password).subscribe((status) => {
              this.checkLogin(status);
            });
          } else {
            swal({
              title: 'Alert',
              text: response.message,
              allowEscapeKey: true,
              type: 'error'
            });
          }
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

  hideConcentText() {
    this.displayCookieConcent = false;
  }
  public subscribeToLogin() {
    this._linkedInService.login().subscribe({
      next: (state) => {
        // state will always return true when login completed
        if (state) {
          this.rawApiCall();
        }
      },
      complete: () => {
        // this.getProfileData(this._linkedInService.getSdkIN().ENV.auth.oauth_token);
        // this.rawApiCall();
      }
    });
  }

  public rawApiCall() {
    const url = '/people/~:(id,email-address)?format=json';
    this._linkedInService.raw(url)
      .asObservable()
        .subscribe({
          next: (data: any) => {
            console.log(data);
            const loginData = {
              email: data.emailAddress,
              registerFrom: 'linkedin',
              lang: this.translate.currentLang.toLowerCase()
            };
            this.socialRegister(loginData);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            console.log('RAW API call completed');
          }
        });
  }

  socialRegister(loginData) {
    this.loginService.socialRegister(loginData, this.userData[0]._id, this.userData[0].authToken).subscribe( data => {
      console.log(data);
      if (data.data) {
        this.checkLogin(data.data);
        swal({
          title: this.translate.instant('SET_PASSWORD.TITLE'),
          text: this.translate.instant('SET_PASSWORD.MESSAGE'),
          type: 'success',
          allowEscapeKey: true,
          confirmButtonText: this.translate.instant('SET_PASSWORD.BUTTON')
        });
      } else {
        swal({
          type: 'success',
          title: this.translate.instant('SOCIAL_LOGIN.SOCIAL_S3.TITLE'),
          
        });
      }
    });
  }

  checkIfStudentorMentor() {
    if (this.userData) {
      const isUserStudentOrMentor = _.find(this.userData[0].types, function(uT) {
        return uT.name === 'student' || uT.name === 'mentor';
      });
      return isUserStudentOrMentor;
    }
  }

  checkLogin(status) {
    if (status != null) {
      const result = status.user;
      if (result !== undefined || result != null) {
        localStorage.setItem('loginuser', JSON.stringify(result));
        localStorage.setItem('token', status.token);
          this.service.setIsLoginFlag(true);
          if (result.entity.type === 'company') {
            if (this.returnUrl !== '' && this.returnUrl !== '/' &&
            this.returnUrl !== null && this.returnUrl !== '/rncp-titles') {
            /* Rediriect User on the Redirect URL when redirectURL is present */
            this.router.navigateByUrl(this.returnUrl);
           } else {
            this.router.navigate(['students']);
           }
          } else if (result.entity.type === 'group-of-schools') {
            /* GROUP Of SCHOOL LOGIN  */
            this.router.navigate(['school-group']);
          } else {
            if (result.isUserStudent === true) {
              this.router.navigate(['photoDiploma']);
            } else {
              this.loginService.updateFolderPermission();
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
  }
}
