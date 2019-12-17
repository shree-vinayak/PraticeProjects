import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { forbiddenNameValidator } from 'src/app/shared/user-name.validator';
import { passwordValidator } from 'src/app/shared/password.validator';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {
  adminForm: FormGroup
  servicesdb: any[];


  get name() {
    return this.adminForm.get('name');
  }

  constructor(private userService: UserService, private _router: Router) {
    this.adminForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), forbiddenNameValidator(/password/)]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      services: new FormControl('', [Validators.required])
    }, { validators: passwordValidator });
  }

  ngOnInit() {
    this.getServices();

  }

  addAdmin() {
    const adminUser = {
      name: this.adminForm.value.name,
      username: this.adminForm.value.username,
      password: this.adminForm.value.password,
      role: this.adminForm.value.role,
      userSubscriptionMapping: []
    };
    this.adminForm.value.services.map((value) => {
      adminUser.userSubscriptionMapping.push({ subscriptionId: value });
    });

    this.userService.addAdmin(adminUser).subscribe((data: any) => {
      console.log('data', data);
    })

  }

  getServices() {
    this.userService.getService().subscribe((data: any) => {
      this.servicesdb = data.obj;
    })
  }

}
