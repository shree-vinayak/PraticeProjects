import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, EmailValidator, FormControl } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { matchingPasswords } from '../../../custome-validation/custom-validator';
import { UserService } from '../../../services/users.service';
import { Subscription } from 'rxjs/Subscription';
import { GlobalConstants } from '../../../shared/settings/global-constants';
declare var swal: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public form: FormGroup;
  id;
  token;
  private subscription: Subscription;
  recaptchaTicked = false;
  recaptchaKey = GlobalConstants.googleRecaptchaKey;
  // captchaForm: FormGroup;
  constructor(private _fb: FormBuilder,

    public translate: TranslateService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private service: UserService,
  ) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      email: ['', [Validators.required]],
      recaptcha: new FormControl('', [Validators.required]),
    });
    //  this.captchaForm = new FormGroup({
    // });
    console.log('ngOnInit recaptchaKey', this.recaptchaKey);
  }

  save(value) {
    console.log(value);
    console.log(this.form);
    if (this.form.valid) {
      const data = {
        email: value.email,
        lang: this.translate.currentLang,
        recaptcha: value.recaptcha
      };
      this.service.forgotPassword(data).subscribe((response) => {
        console.log(response);
        if (response.code === 400) {
          swal({
            title: this.translate.instant('FORGOT_PASSWORD.TITLE'),
            text: this.translate.instant('FORGOT_PASSWORD.MESSAGE'),
            type: 'error',
            allowEscapeKey:true,
            confirmButtonText: this.translate.instant('FORGOT_PASSWORD.BUTTON')
          });
          this.form.controls['recaptcha'].setValue('');
        }
        if (response.code === 200) {
          //if user already sent forgot password's email within 24 hours
          if (response.data.isAlreadySent == true) {
            swal({
              title: this.translate.instant('PASSWORD_RESETED_24H.TITLE'),
              html: this.translate.instant('PASSWORD_RESETED_24H.MESSAGE'),
              type: 'warning',
              allowEscapeKey:true,
              confirmButtonText: this.translate.instant('PASSWORD_RESETED_24H.BUTTON')
            });
          } else {
            swal({
              title: this.translate.instant('PASSWORD_RESETED.TITLE'),
              html: this.translate.instant('PASSWORD_RESETED.MESSAGE'),
              type: 'info',
              allowEscapeKey:true,
              confirmButtonText: this.translate.instant('PASSWORD_RESETED.BUTTON')
            });
          }
          this.router.navigate(['/login']);
        }
      });
    }
  }
  resolved(captchaResponse: string) {
    if (captchaResponse && captchaResponse.length !== 0) {
      this.recaptchaTicked = true;
    } else {
      this.recaptchaTicked = false;
    }
  }

}
