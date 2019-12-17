import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SuperadminComponent } from './component/superadmin/superadmin.component';
import { AdminComponent } from './component/admin/admin.component';
import { CreateAdminComponent } from './component/create-admin/create-admin.component';
import { AuthGuard } from './guards/auth.guard';
import { ShowservicesComponent } from './component/showservices/showservices.component';
import { HomeComponent } from './component/home/home.component';
import { CreatePackageComponent } from './component/create-package/create-package.component';
import { ActivateUsersComponent } from './component/activate-users/activate-users.component';
import { ShowPackagesComponent } from './component/show-packages/show-packages.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "superadmin", component: SuperadminComponent, canActivate: [AuthGuard] },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuard] },
  { path: "registration", component: CreateAdminComponent, canActivate: [AuthGuard] },
  { path: "createPackage", component: CreatePackageComponent, canActivate: [AuthGuard] },
  { path: "activatedUsers", component: ActivateUsersComponent, canActivate: [AuthGuard] },
  { path: "showPackages", component: ShowPackagesComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
