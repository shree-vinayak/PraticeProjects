import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../../../services/users.service';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { IdeasCategory } from '../../../../models/Ideas_category.model'
import { SchoolBoard } from '../../../../models/schoolboard_result.model'

import { TranslateService } from 'ng2-translate';
import { SettingService } from '../../../../services/settings.service'
import { Observable } from 'rxjs/Observable';

declare var swal: any;

@Component({
    selector: 'app-schoolBoard',
    templateUrl: './schoolBoard.component.html'

})
export class SchoolBoardResult implements OnInit {
    form: FormGroup;
    schoolBoardCategoryList: SchoolBoard[];
    schoolBoard: SchoolBoard;
    constructor(private service: UserService, private router: Router, private translate: TranslateService, private settingService: SettingService) {

        this.form = new FormGroup({
            schoolBoardCategoryName: new FormControl('', Validators.required)
        })
    }

    ngOnInit() {

    }


    addSchoolBoardCategory() {
        if (this.form.valid) {
            this.schoolBoard = new SchoolBoard();
            Object.assign(this.schoolBoard, this.form.value)
            this.settingService.addSchoolBoardCategory(this.schoolBoard);
            swal({
                title: 'Success',
                text: this.translate.instant('SETTINGS.MESSAGE.SUCESSSCHOOLBOARD'),
                type: 'success',
                allowEscapeKey:true,
                confirmButtonText: 'OK'
            }).then(function () {
                //let categoryname = this.form.get("categoryName");
                //categoryname.setValue(""); 
                this.getSchoolBoardCategory();
            }.bind(this));
        }
    }

    getSchoolBoardCategory() {
        this.settingService.getSchoolBoardCategory().subscribe((response) => {
            console.log("Response");
            this.schoolBoardCategoryList = response;
            console.log(this.schoolBoardCategoryList);
        });
    }

    deleteSchoolBoardCategory(id) {
        return this.settingService.deleteSchoolCategory(id).subscribe(response => {
            console.log(response);
        });
    }
}
