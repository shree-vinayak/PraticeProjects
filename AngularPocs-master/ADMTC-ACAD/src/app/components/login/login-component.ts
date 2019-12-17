import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import { UserService } from '../../services/users.service';
import { LoginService } from '../../services/login.service';
import { GlobalConstants } from '../../shared/settings';
import { TranslateService } from 'ng2-translate';
import { UserIdleService } from 'angular-user-idle';
declare var swal: any;
import * as moment from 'moment';
import { LinkedInService } from 'angular-linkedin-sdk';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isValid: any = '';
  studentUserTypeID = '';
  studentUserTypeName = '';
  isCompany = false;
  returnUrl: string;
  showUnregisteredTudentAlert = true;
  allowLinkedInLogin = false;
  constructor(
    private router: Router,
    private service: UserService,
    private loginService: LoginService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private userIdle: UserIdleService,
    private _linkedInService: LinkedInService,
    private configService: ConfigService
  ) { }

  ngOnInit() {

    if ( this.loginService.getLoggedInUser() ) {
      this.router.navigate(['/mailbox']);
    }

    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
   
    // this.setStudentType('student');
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = decodeURIComponent(returnUrl);

    this.configService.getConfigDetails().subscribe(data => {
      if (data.login && data.login.allowSocialLogin) {
        this.allowLinkedInLogin = data.login.allowLinkedInLogin ? data.login.allowLinkedInLogin : false;
      }
    });

  }

  changeValue() {
    this.isValid = '';
  }

  forgotpassword() {
    this.router.navigate(['/forgotpassword']);
  }

  login() {
    if (this.form.valid) {
      // localStorage.removeItem("currentUser");
      localStorage.removeItem('loginuser');
      localStorage.removeItem('token');
      this.loginService.loginRegistredUser(this.form.value.username, this.form.value.password).subscribe((status) => {
        if (status && status.code && (status.code === 'WRONG_PASSWORD' || status.code === 'USER_NOT_FOUND')) {
          this.isValid = false;
        } else if (status != null) {
          const result = status.user;
          if (result.status === 'deleted') {
            swal(
              'Alert',
              this.translate.instant('LOGIN.USERNAME OR PASSWORD INVALID'),
              'error'
            );
          } else {
            if (status != null) {
              this.afterLogin(status);
            }
          }
        } else {
          this.isValid = false;
        }
      });
    }
  }
  isUserIdle() {
    console.log('idle start watching');
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      // this.logout();
    });
  }

  public loginLinkedIn() {
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
              loginFrom: 'linkedin',
              lang: this.translate.currentLang.toLowerCase()
            };
            this.socialLogin(loginData);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            console.log('RAW API call completed');
          }
        });
  }

  socialLogin(loginData) {
    this.loginService.socialLogin(loginData).subscribe( data => {
      console.log(data);
      if (data) {
        this.afterLogin(data);
      } else {
        swal({
          type: 'warning',
          title: this.translate.instant('SOCIAL_LOGIN.SOCIAL_LOGIN_USER_NOT_REGISTERED.TITLE'),
          text: this.translate.instant('SOCIAL_LOGIN.SOCIAL_LOGIN_USER_NOT_REGISTERED.TEXT')
        });
      }
    });
  }

  afterLogin(status) {
    const result = status.user;
    if (result !== undefined || result != null) {
      this.isUserIdle();
      localStorage.setItem('loginuser', JSON.stringify(result));
      localStorage.setItem('token', status.token);
      this.isValid = true;
      this.service.setIsLoginFlag(true);
      localStorage.setItem(GlobalConstants.localStorageKeys.timeStamp, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
      if (this.returnUrl !== '' && this.returnUrl !== '/' &&
        this.returnUrl !== null && this.returnUrl !== '/rncp-titles') {
        /* Rediriect User on the Redirect URL when redirectURL is present */
        localStorage.setItem(GlobalConstants.jobDescToken, this.returnUrl);
        this.router.navigateByUrl(this.returnUrl);
      } else if (result.entity.type === 'academic' || result.entity.type === 'admtc') {
          this.isCompany = false;
          this.loginService.updateFolderPermission();
          if (result.isUserStudent === true) {
            this.router.navigate(['myfile']);
          } else {
            localStorage.setItem('showUnregisteredStudentAlert', JSON.stringify(true));
            this.router.navigate(['rncp-titles']);
          }
      } else if (result.entity.type === 'company') {
        /* MENTOR LOGIN  */
        this.router.navigate(['students']);
        this.isCompany = true;
      } else if (result.entity.type === 'group-of-schools') {
        /* GROUP Of SCHOOL LOGIN  */
        this.router.navigate(['school-group']);
      }
    } else {
      this.isValid = false;
    }
  }

  
}
