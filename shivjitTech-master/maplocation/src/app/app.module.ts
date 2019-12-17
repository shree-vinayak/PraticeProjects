import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// import { AgmCoreModule } from '@agm/core';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapViewComponent } from './components/map-view/map-view.component';

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyACkzaoFfDGO24oge2P1RL8F7ptX392LqU'
    // })
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiYXJ1bnJhdGhvcmUiLCJhIjoiY2sxbHEzaW9zMDdwMzNucDM0MDZqNGV5eSJ9.5KFcvhs2SnHnXEho_lXauw',
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
