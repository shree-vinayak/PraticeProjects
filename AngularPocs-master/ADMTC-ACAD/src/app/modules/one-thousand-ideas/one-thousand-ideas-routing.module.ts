import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OneThousandIdeasComponent } from './one-thousand-ideas.component';
import { AuthGuard } from '../../route-guards/auth.guard';
const routes: Routes = [{
	path:'ideas',
	component: OneThousandIdeasComponent,
	canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OneThousandIdeasRoutingModule { }
