import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MpComponent } from './components/mp/mp.component';
import { GujratComponent } from './components/gujrat/gujrat.component';
import { RajasthanComponent } from './components/rajasthan/rajasthan.component';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'madhya', component: MpComponent },
  { path: 'gujrat', component: GujratComponent },
  { path: 'rajasthan', component: RajasthanComponent },
  { path: 'header', component: HeaderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
