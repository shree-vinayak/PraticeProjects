import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { LogoutComponent } from './logout/logout.component';
import { ShowstudentComponent } from './showstudent/showstudent.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StudentRegisterComponent } from './student-register/student-register.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { ShowAssignmentComponent } from './show-assignment/show-assignment.component';
import { UploadQuestionComponent } from './upload-question/upload-question.component';
import { ShowQuestionComponent } from './show-question/show-question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    LogoutComponent,
    ShowstudentComponent,
    StudentRegisterComponent,
    HeaderComponent,
    AddAssignmentComponent,
    ShowAssignmentComponent,
    UploadQuestionComponent,
    ShowQuestionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    BrowserAnimationsModule,
    MaterialModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AddAssignmentComponent]
})
export class AppModule { }
