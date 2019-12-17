import { Component, OnInit } from '@angular/core';
import { PackageService } from 'src/app/service/package.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {



  pkgType: string = '';
  packages: any[];

  constructor(private packageService: PackageService) { }

  ngOnInit() {
    this.packageService.getPackages().subscribe((data: any) => {
      this.packages = data.obj;
      console.log('data', data);
    })
  }

  subscribe(pkg) {
    if (this.pkgType === '') {
      Swal.fire({
        type: "error",
        title: 'Please Select varsion',
        timer: 1500,
        showConfirmButton: false
      });
    }
    else {

    }

  }

  radioChangeHandler(event: any) {
    this.pkgType = event.target.value;

  }
}