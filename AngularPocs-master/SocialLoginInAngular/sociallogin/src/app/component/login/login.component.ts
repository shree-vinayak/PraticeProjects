import { Component, OnInit } from '@angular/core';
import { SocialUser, AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: any = SocialUser;

  constructor(private socialAuthService: AuthService, private userService: LoginService) { }

  ngOnInit() {
  }

  googlelogin() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      if (userData != null) {
        this.user = userData;
        console.log('userData', this.user);
        console.log("userId", this.user.id);
        const userObject = {
          userId: this.user.id,
          name: this.user.name,
          email: this.user.email
        }
        this.userService.saveUser(userObject).subscribe(userData => {
          console.log('userData', userData);
          alert("usersaved Successfully");
        })
      }
    });
  }

  // Method to log out.
  signOut(): void {
    this.socialAuthService.signOut();
    this.user = null;
    console.log('User signed out.');
  }

}
