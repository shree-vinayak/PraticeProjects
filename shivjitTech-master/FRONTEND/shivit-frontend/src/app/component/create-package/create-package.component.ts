import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PackageService } from 'src/app/service/package.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.css']
})
export class CreatePackageComponent implements OnInit {

  packageForm: FormGroup;

  constructor(private _router: Router, private packageService: PackageService, private authService: AuthService) {
    this.packageForm = new FormGroup({
      pkgName: new FormControl("", [Validators.required]),
      description: new FormControl('', [Validators.required]),
      sqlFileName: new FormControl('', [Validators.required])

    })
  }

  ngOnInit() {
  }

  addPackage() {
    console.log('asave', this.packageForm.value)

    this.packageService.addPackage(this.packageForm.value).subscribe(
      (data: any) => {
        console.log(data)

        if (data.status === 'SUCCESS') {
          Swal.fire({
            type: 'success',
            title: 'Successfuly Saved...',
            timer: 1500,
            showConfirmButton: false
          });
          this._router.navigate(['/showPackages'])
        } else {
          Swal.fire({
            type: 'error',
            title: 'Failed',
            timer: 1500,
            showConfirmButton: false
          });
          // this.authService.logoutUser();
          this._router.navigate(['/showPackages'])
        }
      }
    )
  }

}
