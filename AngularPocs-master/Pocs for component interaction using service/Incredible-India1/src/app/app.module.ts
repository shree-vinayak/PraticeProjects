import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MpComponent } from './components/mp/mp.component';
import { GujaratComponent } from './components/gujarat/gujarat.component';
import { RajasthanComponent } from './components/rajasthan/rajasthan.component';
import { HeaderComponent } from './components/header/header.component';
import { CommonHeaderComponent } from './components/common-header/common-header.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    MpComponent,
    GujaratComponent,
    RajasthanComponent,
    HeaderComponent,
    CommonHeaderComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
