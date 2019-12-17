import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../../../services/users.service';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { IdeasCategory } from '../../../../models/Ideas_category.model'
import { SchoolBoard } from '../../../../models/schoolboard_result.model'
import { StudentStatusModel } from '../../../../models/studentStatus.model'
import { TranslateService } from 'ng2-translate';
import { SettingService } from '../../../../services/settings.service'
import { Observable } from 'rxjs/Observable';
declare var swal: any;

@Component({
    selector: 'app-studentStatus',
    templateUrl: './studentStatus.component.html'

})
export class StudentStatus implements OnInit {
    form: FormGroup;
    studentStatusList: StudentStatusModel[];
    studentStatus: StudentStatusModel;
    constructor(private service: UserService, private router: Router, private dialog: MdDialog, private translate: TranslateService, private settingService: SettingService) {

    }
    ngOnInit() {
        this.form = new FormGroup({
            statusName: new FormControl('', Validators.required),
            statusDescription: new FormControl('', Validators.required)
        })
    }

    addStudentStatusCategory() {
     
        if (this.form.valid) {
            this.studentStatus = new StudentStatusModel();
            Object.assign(this.studentStatus, this.form.value)
            this.settingService.addStudentStatusCategory(this.studentStatus);
            swal({
                title: 'Success',
                text: this.translate.instant('SETTINGS.MESSAGE.STUDENTSTATUS'),
                type: 'success',
                allowEscapeKey:true,
                confirmButtonText: 'OK'
            }).then(function () {
                //let categoryname = this.form.get("categoryName");
                //categoryname.setValue(""); 
                this.getStudentStatusCategory();
            }.bind(this));
        }
    }

    getStudentStatusCategory() {
        this.settingService.getStudentStatusCategory().subscribe((response) => {
            console.log("Response");
            this.studentStatusList = response;
            console.log(this.studentStatusList);
        });
    }

    deleteStudentStatusCategory(id) {
        return this.settingService.deleteStudentStatusCategory(id).subscribe(response => {
            console.log(response);
        });
    }
}
