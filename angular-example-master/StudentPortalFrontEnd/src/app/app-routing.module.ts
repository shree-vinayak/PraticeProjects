import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ShowstudentComponent } from './showstudent/showstudent.component';
import { StudentRegisterComponent } from './student-register/student-register.component';
import { ShowAssignmentComponent } from './show-assignment/show-assignment.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { UploadQuestionComponent } from './upload-question/upload-question.component';
import { ShowQuestionComponent } from './show-question/show-question.component';

const routes: Routes = [
  { path:'', component: LoginComponent },
  { path:'login', component: LoginComponent },
  { path:'logout', component: LogoutComponent},
  { path:'showStudent', component: ShowstudentComponent},
  { path:'studentRegister', component: StudentRegisterComponent},
  { path:'showAssignment', component: ShowAssignmentComponent},
  { path:'addAssignment/:id', component: AddAssignmentComponent},
  { path:'uploadQuestion', component: UploadQuestionComponent},
  { path:'showQuestion', component: ShowQuestionComponent},
  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
