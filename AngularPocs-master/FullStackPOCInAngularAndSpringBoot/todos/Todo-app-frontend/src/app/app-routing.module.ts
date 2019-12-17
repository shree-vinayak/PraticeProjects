import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodosComponent } from './components/todos/todos.component';


const routes: Routes = [
  {path:'',redirectTo:'todos',pathMatch:'full'},
  {path:'todos',component:TodosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
