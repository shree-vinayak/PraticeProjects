import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
} from "angular-6-social-login";
import { LoginComponent } from './component/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'
import { LoginService } from './service/login.service';

let config = new AuthServiceConfig(
  [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider("869507191934-tlsh90hohv3n2km6lmc8mp3cs94f7rll.apps.googleusercontent.com")
    }

  ]
);

export function provideConfig() {
  return config;
}



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }, LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
