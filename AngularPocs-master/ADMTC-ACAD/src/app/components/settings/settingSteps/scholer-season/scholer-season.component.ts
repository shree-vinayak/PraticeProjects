import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';

import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { UserService } from '../../../../services/users.service';

import { Season } from '../../../../models/scholerseason.model';
import { IdeasCategory } from '../../../../models/Ideas_category.model';
import { SchoolBoard } from '../../../../models/schoolboard_result.model';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';

import swal from 'sweetalert2';
import { TranslateService } from 'ng2-translate';
import { ScholarSeasonService } from '../../../../services/scholar-season.service';
import { Observable } from 'rxjs/Observable';
import {
  DateAdapter, MD_DATE_FORMATS, MdDateFormats, MdDialog, MdDialogConfig, MdDialogRef,
  NativeDateAdapter
} from '@angular/material';

import { ScholarSeasonEditDialogComponent } from '../../../../dialogs/scholar-season-edit-dialog/scholar-season-edit-dialog.component';

import _ from 'lodash';
import { GlobalConstants } from '../../../../shared/settings/global-constants';

@Component({
  selector: 'app-scholer-season',
  templateUrl: './scholer-season.component.html',
  styleUrls: ['./scholer-season.component.scss']
})
export class ScholerSeasonComponent implements OnInit {

  scholerSeason: Season;
  addScholerForm: FormGroup;

  AddNewStatus = false;
  rncpTitles: any = [];

  rncpTitlesIds: any = [];
  seasons: any = [];
  page = new Page();
  sort = new Sort();
  frdt;
  todt;
  dateObj = {
    to: '',
    from: ''
  };
  rncpTit: any = [];

  certifier;

  today = new Date();
  minDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());

  // Scholar Season dialog object
  seasonEditDialogComponent: MdDialogRef<ScholarSeasonEditDialogComponent>;

  // Scholar Season dialog property
  configCat: MdDialogConfig = {
    width: '750px'
  };

  studentaccesschecked = false;
  admissionchecked = false;
  annalesprevueschecked = false;

  bioteoutilschecked = false;
  communicationchecked = false;
  examenschecked = false;
  organisationchecked = false;
  programmechecked = false;
  epreuvescrtufationchecked = false;
  archiveschecked = false;

  constructor(public translate: TranslateService,
    public scholarservice: ScholarSeasonService,
    private dialog: MdDialog,
    public service: RNCPTitlesService,
    private router: Router, public datepipe: DatePipe) {

    this.page.size = GlobalConstants.NoOfRecordsPerPage;
    this.addScholerForm = new FormGroup({
      'scholerseason': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'fromdate': new FormControl('', Validators.required),
      'todate': new FormControl('', Validators.required),
      'rncptitles': new FormControl('', Validators.required)
    });
  }



  ngOnInit() {
    this.getAllScholerSeason();
  }


  getAllScholerSeason() {
    this.scholarservice.getscholerSeason()
      .subscribe(
      (data: any) => this.seasons = data,
      (error: Response) => console.log(error)
      );

    console.log(this.seasons);
  }


  addScholerSeason() {
    // if(this.addScholerForm.valid){

    var startTime = new Date(this.addScholerForm.value.fromdate);
    var endTime = new Date(this.addScholerForm.value.todate);
    console.log(this.addScholerForm.value);
    if (startTime < endTime) {
      const title = this.addScholerForm.value.scholerseason;
      this.scholarservice.addscholerSeason({
        scholarseason: this.addScholerForm.value.scholerseason,
        description: this.addScholerForm.value.description,
        from: this.datepipe.transform(this.addScholerForm.value.fromdate, 'yyyy-MM-dd'),
        to: this.datepipe.transform(this.addScholerForm.value.todate, 'yyyy-MM-dd'),
        rncptitles: this.rncpTit
      }).subscribe(
        response => {
          if (response.code === 200) {
            swal({
              title: this.translate.instant('TASK.MESSAGE.TASKUPDATETITLE'),
              html: this.translate.instant('SETTINGS.SCHOLERSEASON.SCHOLARSEASONADDSUCCESS', { Title: title }),
              type: 'success',
              allowEscapeKey: true,
              confirmButtonText: 'OK'
            }).then(function () {
              this.cancel();
            }.bind(this));
          } else if (response.code === 400) {
            swal({
              title: 'Error',
              text: this.translate.instant('TASK.MESSAGE.TASKEXIST'),
              type: 'error',
              allowEscapeKey: true,
              confirmButtonText: 'OK'
            }).then(function () {
              // this.cancel();
            }.bind(this));
          }
        },
        error => console.log(error),
        () => this.getAllScholerSeason()
        );
    } else {

      swal({
        title: this.translate.instant('SETTINGS.SCHOLERSEASON.INVALIDDATETITLE'),
        text: this.translate.instant('SETTINGS.SCHOLERSEASON.INVALIDDATETEXT'),
        type: 'warning',
        allowEscapeKey: true,
        confirmButtonText: 'OK'
      }).then(function () {
        // this.cancel();
      }.bind(this));
    }

  }


  getTitleList(control, event): void {
    if (event.target) {
      this.dateObj = {
        to: this.datepipe.transform(this.addScholerForm.controls['todate'].value, 'MM/dd/yyyy'),
        from: this.datepipe.transform(this.addScholerForm.controls['fromdate'].value, 'MM/dd/yyyy')
      };
    } else {
      this.dateObj = {
        to: this.datepipe.transform(control === 'to' && event ? event :
          this.addScholerForm.controls['todate'].value, 'MM/dd/yyyy'),
        from: this.datepipe.transform(control === 'from' && event ? event :
          this.addScholerForm.controls['fromdate'].value, 'MM/dd/yyyy')
      };
    }
    if (this.dateObj.to && this.dateObj.from) {
      this.scholarservice.getRNCPnotinSeason(this.dateObj).subscribe((titles) => {
        this.rncpTitles = titles.data;
      });
      this.rncpTit = [];
    }
  }

  cancel() {
    this.AddNewStatus = false;
    this.getAllScholerSeason();
  }

  fromDateChange(value) {
    this.addScholerForm.controls['fromdate'].setValue(value);
  }

  toDateChange(value) {
    this.addScholerForm.controls['todate'].setValue(value);
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

  addNewUserType() {
    this.AddNewStatus = true;
    this.rncpTit = [];
    this.addScholerForm = new FormGroup({
      'scholerseason': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'fromdate': new FormControl('', Validators.required),
      'todate': new FormControl('', Validators.required),
      'rncptitles': new FormControl('', Validators.required)
    });

  }

  scholerEdit(season) {
    this.seasonEditDialogComponent = this.dialog.open(ScholarSeasonEditDialogComponent, this.configCat);
    if (season !== null) {
      this.seasonEditDialogComponent.componentInstance.editseason = season;
    }
    this.seasonEditDialogComponent.afterClosed().subscribe((newScholarSeason) => {
      this.getAllScholerSeason();
    });
  }
}
