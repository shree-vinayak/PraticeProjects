import { Component, OnInit } from '@angular/core';
import { Login } from '../model/login';
import { HttpClientService } from '../service/http-client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css']
})
export class StudentRegisterComponent implements OnInit {

  student:Login=new Login();
  constructor(private httpClientService: HttpClientService,
    private router: Router,) { }

  ngOnInit() {
  }

  

registerStudent(){
  this.httpClientService.registerStudentService(this.student).subscribe(data =>{
    alert("Student  created successfully.");
  });
}  

}
