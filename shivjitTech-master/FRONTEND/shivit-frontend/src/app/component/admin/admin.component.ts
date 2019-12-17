import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  subscribedService: any[];


  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getServiceForUser();
  }

  getServiceForUser() {
    this.userService.getServiceForUser().subscribe((data: any) => {
      if (data.status === 'SUCCESS') {
        this.subscribedService = data.obj;
      }
    })
  }

}
