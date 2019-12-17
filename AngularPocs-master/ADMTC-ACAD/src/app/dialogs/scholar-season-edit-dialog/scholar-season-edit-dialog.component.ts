import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { FormControl, FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { ScholarSeasonService } from '../../services/scholar-season.service';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import swal from 'sweetalert2';

@Component({
    selector: 'app-season-edit-dialog',
    templateUrl: './scholar-season-edit-dialog.component.html',
    styleUrls: ['./scholar-season-edit-dialog.component.scss']
})
export class ScholarSeasonEditDialogComponent implements OnInit {

    public editseason: any = [];
    editScholerForm: FormGroup;

    page = new Page();
    sort = new Sort();
    rncpTitles = [];

    rncpTit: any = [];

    public modify = true;

    constructor(public translate: TranslateService,
        private scholarservice: ScholarSeasonService,
        private rncpservice: RNCPTitlesService,
        private fb: FormBuilder,
        private dialogRef: MdDialogRef<ScholarSeasonEditDialogComponent>) {
        this.page.pageNumber = 0;
        this.page.size = 100;
        this.page.totalElements = 100;
        this.page.totalPages = 10;
        this.sort.sortby = '';
        this.sort.sortmode = 'asc';

        this.editScholerForm = this.fb.group({
            scholerseason: [this.editseason.scholarseason, [Validators.required]],
            description: [this.editseason.description, [Validators.required]],
            fromdate: [this.editseason.from, [Validators.required]],
            todate: [this.editseason.to, [Validators.required]],
            rncptitles: new FormControl()
        });

    }

    ngOnInit() {
        if (this.editseason.rncptitles) {
            for (const rncp of this.editseason.rncptitles) {
                this.rncpTit.push(rncp._id);
            }
        }
        this.getTitleList();
        this.editScholerForm.controls['scholerseason'].setValue(this.editseason.scholarseason);
        this.editScholerForm.controls['description'].setValue(this.editseason.description);
        this.editScholerForm.controls['fromdate'].setValue(new Date(this.editseason.from));
        this.editScholerForm.controls['todate'].setValue(new Date(this.editseason.to));
    }

    getTitleList(): void {
        this.rncpservice.getAllRNCPTitlesShortName().subscribe((titles) => {
            const RNCPS = titles.data;
            this.rncpTitles = [];
            RNCPS.forEach((item) => {
                if (this.rncpTit) {
                    if (this.rncpTit.indexOf(item._id) > -1) {
                        item.selected = true;
                        this.rncpTitles.push(item);
                    }
                }
            });
            this.scholarservice.getRNCPnotinSeason({ from: this.editseason.from, to: this.editseason.to }).subscribe((title) => {
                const allrncp = title.data;
                allrncp.forEach((item) => {
                    if (item) {
                        item.selected = false;
                        this.rncpTitles.push(item);
                    }
                });
            });
        });

    }


    editScholerSeason() {
        const title = this.editScholerForm.value.scholerseason;
        this.scholarservice.oneditscholerSeason(this.editseason._id, {
            scholarseason: this.editScholerForm.value.scholerseason,
            description: this.editScholerForm.value.description,
            from: this.editScholerForm.value.fromdate,
            to: this.editScholerForm.value.todate,
            rncptitles: this.rncpTit
        }).subscribe(
            response => {
                if (response.code === 200) {
                    swal({
                        title: this.translate.instant('TASK.MESSAGE.TASKUPDATETITLE'),
                        html: this.translate.instant('SETTINGS.SCHOLERSEASON.SCHOLARSEASONUPDATESUCCESS', { Title: title }),
                        type: 'success',
                        allowEscapeKey:true,
                        confirmButtonText: this.translate.instant('TASK.MESSAGE.OK')
                    }).then(function () {
                        this.cancel();
                    }.bind(this));
                } else if (response.code === 400) {
                    swal({
                        title: 'Error',
                        text: this.translate.instant('TASK.MESSAGE.TASKEXIST'),
                        type: 'error',
                        allowEscapeKey:true,
                        confirmButtonText: 'OK'
                    }).then(function () {
                        //this.cancel();
                    }.bind(this));
                }
            },
            error => console.log(error)
            );
    }

    fromDateChange(value) {
        this.editScholerForm.controls['fromdate'].setValue(value);
    }

    toDateChange(value) {
        this.editScholerForm.controls['todate'].setValue(value);
    }

    toCheck(value, event) {
        if (event.checked) {
            this.rncpTit.push(value._id);
        } else {
            const index: number = this.rncpTit.indexOf(value._id);
            if (index !== -1) {
                this.rncpTit.splice(index, 1);
            }
        }
    }

    cancel() {
        this.dialogRef.close();
    }

}
