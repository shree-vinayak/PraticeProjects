import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../service/http-client.service';
import { Router } from '@angular/router';
import { Login } from '../model/login';

@Component({
  selector: 'app-showstudent',
  templateUrl: './showstudent.component.html',
  styleUrls: ['./showstudent.component.css']
})
export class ShowstudentComponent implements OnInit {
 user:any =[];


  constructor(private httpClientService: HttpClientService,
    private router: Router,) { }

  ngOnInit() {

    this.httpClientService.getStudentService().subscribe(data => {
      console.log("student",data);
         this.user = data;
         console.log(this.user);
    });

  }

  deleteStudent(id):void{
    console.log("id is ",id);
    this.httpClientService.deleteStudentService(id).subscribe(data =>{
      this.ngOnInit();
    })   
  }

  
}
