import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { TestService } from '../../../../services/test.service';
import { UserService } from '../../../../services/users.service';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CalenderStep } from '../../../../models/calendarstep.model';
import swal from 'sweetalert2';
import { TranslateService } from 'ng2-translate';
import { CalendarStepService } from '../../../../services/calendar-step.service';
import { Observable } from 'rxjs/Observable';

import { EditCalenderStepDialogComponent } from '../../../../dialogs/edit-calender-step-dialog/edit-calender-step-dialog.component';
import {
  DateAdapter, MD_DATE_FORMATS, MdDateFormats, MdDialog, MdDialogConfig, MdDialogRef,
  NativeDateAdapter
} from '@angular/material';
import { GlobalConstants } from "../../../../shared/settings/global-constants";
import { Page } from "../../../../models/page.model";;

@Component({
  selector: 'app-calender-steps',
  templateUrl: './calender-steps.component.html',
  styleUrls: ['./calender-steps.component.scss']
})
export class CalenderStepsComponent implements OnInit {

  calendarEditDialogComponent: MdDialogRef<EditCalenderStepDialogComponent>;
  AddNewCalendar = false;
  calenderList = [];
  addCalenderForm: FormGroup;
  calendarStep: CalenderStep;
  userTypes = [];
  page = new Page();

  configCat: MdDialogConfig = {
    width: '450px'
  };
 
  constructor(public translate: TranslateService,
    public userservice: UserService,
    public calendarstepservice: CalendarStepService,
    private dialog: MdDialog,
    private router: Router,
    public testservice: TestService) {
      this.page.size = GlobalConstants.NoOfRecordsPerPage

  }

  ngOnInit() {
    this.getCalendarStep();
    this.userservice.getUserTypesByEntities('academic').subscribe((response) => {
      //  this.userTypes = response.data;
      this.userTypes = response.data.sort(this.keysrt('name'));
      console.log(this.userTypes);
    });

    this.initiateGroup();
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) return 1;
      if (a[key] < b[key]) return -1;
      return 0;
    }
  }

  getCalendarStep() {
    this.calendarstepservice.getCalenderSteps().subscribe((response) => {
      this.calenderList = response;
      console.log(this.calenderList);
    });
  }

  initiateGroup() {
    this.addCalenderForm = new FormGroup({
      'title': new FormControl('', Validators.required),
      'userTypeId': new FormControl('', Validators.required),
      'beforeDays': new FormControl('', Validators.required),
      'numberOfDays': new FormControl('', Validators.required)
    });
  }

  addCalenderStep() {
    this.calendarstepservice.addcalendarStep(this.calendarStep)
      .subscribe((response) => {
        if (response.code === 200) {
          swal({
            title: 'Success',
            text: this.translate.instant('SETTINGS.CALENDARSTEPS.ADDMSG'),
            type: 'success',
            allowEscapeKey:true,
            confirmButtonText: 'OK'
          }).then(function () {
            this.cancel();
            this.getCalendarStep();
          }.bind(this));
        } else {
          swal({
            title: 'Error',
            text: this.translate.instant('SETTINGS.CALENDARSTEPS.FAILUREMSG'),
            type: 'error',
            allowEscapeKey:true,
            confirmButtonText: 'OK'
          }).then(function () {
          }.bind(this));
        }
      });
  }
  addNewCalender() {
    this.calendarEditDialogComponent = this.dialog.open(EditCalenderStepDialogComponent, this.configCat);
    this.calendarEditDialogComponent.componentInstance.isModify = false;
    this.calendarEditDialogComponent.afterClosed().subscribe((newScholarSeason) => {
      console.log("newScholarSeaso",newScholarSeason);
      this.getCalendarStep();
    });
  }
  cancel() {
    this.AddNewCalendar = false;
  }
  calenderEdit(row) {
    console.log(row._id);
    const id = '';
    this.calendarStep = {
      _id: row._id,
      title: row.title,
      beforeDays: row.beforeDays,
      userTypeId: row.userTypeId,
      numberOfDays: row.numberOfDays
    };

    this.calendarEditDialogComponent = this.dialog.open(EditCalenderStepDialogComponent, this.configCat);
    this.calendarEditDialogComponent.componentInstance.calenderStep = this.calendarStep;
    this.calendarEditDialogComponent.componentInstance.isModify = true;
    this.calendarEditDialogComponent.afterClosed().subscribe((newScholarSeason) => {
      this.getCalendarStep();
    });
  }

  calenderDel(data) {
    if (data) {
      const calendarstepservice = this.calendarstepservice;
      const thistranslate = this.translate;
      const self = this;
      const Title = data.title;
      swal({
        title: thistranslate.instant('SETTINGS.CALENDARSTEPS.DELWARNINGTITLE'),
        html: thistranslate.instant('SETTINGS.CALENDARSTEPS.DELWARNINGMSG') + '<br/>' + Title,
        type: 'warning',
        allowEscapeKey:true,
        showCancelButton: true,
        confirmButtonText: thistranslate.instant('SETTINGS.CALENDARSTEPS.YES'),
        cancelButtonText: thistranslate.instant('SETTINGS.CALENDARSTEPS.NO')
      }).then(function () {
        self.calendarstepservice.deletecalenderStep(data._id).map((data) => {
          swal({
            title: thistranslate.instant('SETTINGS.CALENDARSTEPS.DELCONFIRMTITLE'),
            html: thistranslate.instant('SETTINGS.CALENDARSTEPS.DELSUCCESSMSG', { Title: Title }),
            type: 'success',
            allowEscapeKey:true,
            confirmButtonText: thistranslate.instant('SETTINGS.CALENDARSTEPS.OK')
          });
          return data;
        }).subscribe((response) => {
          self.getCalendarStep();
        });
      }, function (dismiss) {
        if (dismiss === 'cancel') {

        }
      });
    }
  }
}
