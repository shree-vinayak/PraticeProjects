import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Country } from '../../models/country.model';
import { Company } from '../../models/company.model';
import { UserService } from '../../services/users.service';

import { Tasks } from '../../models/tasks.model'
import { TasksService } from '../../services/tasks.service';
declare var swal: any;

@Component({
    selector: 'app-form-confimation-dialog',
    templateUrl: './form-confimation-dialog.component.html',
    styleUrls: ['./form-confimation-dialog.component.scss']
})
export class FormConfirmationComponent implements OnInit {

    constructor(private dialogRef: MdDialogRef<FormConfirmationComponent>, private translate: TranslateService, private service: UserService, private _fb: FormBuilder, private taskService: TasksService) {
    }


    ngOnInit() {

    }

    submitAndGo() {
        this.dialogRef.close("SubmitAndGo");
    }

    cancelAndGo() {
        this.dialogRef.close("CancleAndGo");
    }

    cancel() {
        this.dialogRef.close("Cancel");
    }





}
