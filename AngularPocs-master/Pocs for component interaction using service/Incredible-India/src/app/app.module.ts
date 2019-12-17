import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { GujratComponent } from './components/gujrat/gujrat.component';
import { RajasthanComponent } from './components/rajasthan/rajasthan.component';
import { MpComponent } from './components/mp/mp.component';
import { CommonComponent } from './components/common/common.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    GujratComponent,
    RajasthanComponent,
    MpComponent,
    CommonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
