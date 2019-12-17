import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AboutComponent } from './component/about/about.component';
import { ServiceComponent } from './component/service/service.component';
import { OurValuesComponent } from './component/our-values/our-values.component';
import { ClientReviewsComponent } from './component/client-reviews/client-reviews.component';
import { ContactComponent } from './component/contact/contact.component';



const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "services", component: ServiceComponent },
  { path: "ourValues", component: OurValuesComponent },
  { path: "clientReviews", component: ClientReviewsComponent },
  { path: "contact", component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
