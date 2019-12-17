import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-showservices',
  templateUrl: './showservices.component.html',
  styleUrls: ['./showservices.component.css']
})
export class ShowservicesComponent implements OnInit {

  services: any[]
  constructor(private userService: UserService, private route: Router) { }

  ngOnInit() {
    this.getService();
  }

  getService() {
    this.userService.getService().subscribe((data: any) => {

      console.log('data', data);
      if (data.status === 'SUCCESS') {
        this.services = data.obj;
      }
    });
  }

}
