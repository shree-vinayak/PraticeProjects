import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './component/footer/footer.component';
import { SuperadminComponent } from './component/superadmin/superadmin.component';
import { AdminComponent } from './component/admin/admin.component';
import { CreateAdminComponent } from './component/create-admin/create-admin.component';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { HeaderComponent } from './component/header/header.component';
import { ShowservicesComponent } from './component/showservices/showservices.component';
import { TokenInterceptorService } from './service/token-interceptor.service';
import { HomeComponent } from './component/home/home.component';
import { CreatePackageComponent } from './component/create-package/create-package.component';
import { ShowPackagesComponent } from './component/show-packages/show-packages.component';
import { UnactivatedUsersComponent } from './component/unactivated-users/unactivated-users.component';
import { ActivateUsersComponent } from './component/activate-users/activate-users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    SuperadminComponent,
    AdminComponent,
    CreateAdminComponent,
    HeaderComponent,
    ShowservicesComponent,
    HomeComponent,
    CreatePackageComponent,
    ShowPackagesComponent,
    UnactivatedUsersComponent,
    ActivateUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
