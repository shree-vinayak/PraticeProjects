import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MpComponent } from './components/mp/mp.component';
import { GujaratComponent } from './components/gujarat/gujarat.component';
import { RajasthanComponent } from './components/rajasthan/rajasthan.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'mp', component: MpComponent },
  { path: 'gujarat', component: GujaratComponent },
  { path: 'rajasthan', component: RajasthanComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
