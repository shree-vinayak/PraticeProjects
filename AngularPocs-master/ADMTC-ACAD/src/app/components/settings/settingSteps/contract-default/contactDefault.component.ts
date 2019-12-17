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

@Component({
    selector: 'app-contactDefault',
    templateUrl: './contactDefault.component.html'

})
export class ContractDefault implements OnInit {
    form: FormGroup;
    currencyList: any[] = [
        { value: "EUR", view: "EUR" },
        { value: "USD", view: "USD" },
    ]

    constructor() {

    }

    ngOnInit() {

        this.form = new FormGroup({
            StudentNess: new FormControl('', Validators.required),
            Currency: new FormControl('', Validators.required),
            StandaredShareOfCertified :new FormControl('',Validators.required)
        })
    }
}
