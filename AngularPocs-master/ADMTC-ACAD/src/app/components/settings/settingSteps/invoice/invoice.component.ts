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
    selector: 'app-invoice',
    templateUrl: './invoice.component.html'

})
export class Invoice implements OnInit {

    form: FormGroup;
    constructor() {

    }

    ngOnInit() {
        this.form = new FormGroup({
            VatTaxRate: new FormControl('', Validators.required),
            InvoiceAddress: new FormControl('', Validators.required),
            InvoiceSequenceNumber: new FormControl('', Validators.required),
            AccountHolder: new FormControl('', Validators.required),
            Domicilation: new FormControl('', Validators.required),
            Iban: new FormControl('', Validators.required),
            BICCode:new FormControl('',Validators.required)
            
        })
    }
}
