import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { UserService } from '../../services/users.service';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CalenderStep } from '../../models/calendarstep.model';
import swal from 'sweetalert2';
import { TranslateService } from 'ng2-translate';
import { CalendarStepService } from '../../services/calendar-step.service';
import { Observable } from 'rxjs/Observable';

import {
  DateAdapter, MD_DATE_FORMATS, MdDateFormats, MdDialog, MdDialogConfig, MdDialogRef,
  NativeDateAdapter
} from '@angular/material';

@Component({
  selector: 'app-edit-calender-step-dialog',
  templateUrl: './edit-calender-step-dialog.component.html',
  styleUrls: ['./edit-calender-step-dialog.component.scss']
})
export class EditCalenderStepDialogComponent implements OnInit {

  editCalenderForm: FormGroup;
  userTypes = [];
  calenderStep: CalenderStep;
  formSubmit = false;
  isModify = false;

  constructor(public translate: TranslateService,
    public userservice: UserService,
    public calendarservice: CalendarStepService,
    private dialogRef: MdDialogRef<EditCalenderStepDialogComponent>,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.userservice.getUserTypesByEntities('academic').subscribe((response) => {
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
  initiateGroup() {
    console.log(this.calenderStep);
    
      this.editCalenderForm = new FormGroup({
        'title': new FormControl(this.isModify ? this.calenderStep.title : '', Validators.required),
        'userTypeId': new FormControl(this.isModify ? this.calenderStep._id : '', Validators.required),
        'beforeDays': new FormControl(this.isModify ? this.calenderStep.beforeDays : '', Validators.required),
        'numberOfDays': new FormControl(this.isModify ? this.calenderStep.numberOfDays : '', Validators.required)
      });
    

  }

  editCalenderStep() {
    const self = this;
    this.calenderStep = {
      _id: this.isModify ? this.calenderStep['_id'] : '',
      title: this.editCalenderForm.controls['title'].value,
      beforeDays: this.editCalenderForm.controls['beforeDays'].value,
      userTypeId: this.editCalenderForm.controls['userTypeId'].value,
      numberOfDays: this.editCalenderForm.controls['numberOfDays'].value
    };
    if (this.isModify) {
      this.calendarservice.editcalendarStep(this.calenderStep)
        .subscribe((response) => {
          if (response.code === 200) {
            swal({
              title: 'Success',
              text: this.translate.instant('SETTINGS.CALENDARSTEPS.EDITMSG'),
              type: 'success',
              allowEscapeKey:true,
              confirmButtonText: 'OK'
            }).then(function () {
              self.closeDialog(true);
            }.bind(this));
          } else {
            swal({
              title: 'Error',
              text: this.translate.instant('SETTINGS.CALENDARSTEPS.FAILUREMSG'),
              allowEscapeKey:true,
              type: 'error',
              confirmButtonText: 'OK'
            }).then(function () {
            }.bind(this));
          }
        });
    } else {
      this.calendarservice.addcalendarStep(this.calenderStep)
        .subscribe((response) => {
          if (response.code === 200) {
            swal({
              title: 'Success',
              text: this.translate.instant('SETTINGS.CALENDARSTEPS.ADDMSG'),
              allowEscapeKey:true,
              type: 'success',
              confirmButtonText: 'OK'
            }).then(function () {
              self.closeDialog(true);
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
    // this.closeDialog();
  }

  closeDialog(object?: any) {
    this.dialogRef.close(object);
  }
// To Get ADMTCSTAFFKEY translations
  getTranslateADMTCSTAFFKEY(name){
    let value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value != 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

}
