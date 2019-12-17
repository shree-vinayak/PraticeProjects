import { Http, Response } from '@angular/http';
import { Test } from '../../../../models/test.model';
import { TestService } from '../../../../services/test.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef, MdSlideToggleChange, MdAutocomplete } from '@angular/material';
import _ from 'lodash';
import { TranslateService } from 'ng2-translate';
import { AcademicStaffUser } from '../../../../models/user_academicstaff.model';
import { UserService } from '../../../../services/users.service';
import { DatePipe } from '@angular/common';
import { CalendarStepService } from '../../../../services/calendar-step.service';

import { Base } from '../../../../shared/global-urls';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { UserTypeService } from '../../../../services';
declare var swal: any;

@Component({
  selector: 'app-fourth-step',
  templateUrl: './fourth-step.component.html',
  styleUrls: ['./fourth-step.component.scss'],
  providers: [DatePipe]
})
export class FourthStepComponent implements OnInit {
  academicStaffUsers = [];
  userTypes = [];
  acadUserTypes = [];
  form: FormGroup;
  newStep = false;
  descending = true;
  relativeDate = false;
  currentSort = 'date';
  test = new Test();
  datePipe: DatePipe;
  ids = 0;
  // date = new Date();
  sortedSteps: {
    id: number;
    text: string;
    sender: string;
    actor: string;
    date:
    | {
      type: 'fixed';
      value: string;
    }
    | {
      type: 'relative';
      before: boolean;
      days: number;
    };
    createdFrom: 'manual'
  }[] = [];
  stepFields = [
    {
      value: 'text',
      view: 'Texte'
    },
    {
      value: 'sender',
      view: 'Sender'
    },
    {
      value: 'actor',
      view: 'Actor'
    },
    {
      value: 'date',
      view: 'Date'
    }
  ];
  fillAllError: string;
  calendarList = [];
  filteredOptions: Observable<string[]>;
  text: any;

  constructor(
    private testService: TestService,
    private router: Router,
    private calendarstepservice: CalendarStepService,
    private dialog: MdDialog,
    private translate: TranslateService,
    private userservice: UserService,
    private http: Http,
    private fb: FormBuilder,
    private usertypeService: UserTypeService
  ) {
    this.form = new FormGroup({
      text: new FormControl('', Validators.required),
      sender: new FormControl('', Validators.required),
      actor: new FormControl('', Validators.required),
      date: new FormControl(null, [CustomValidators.date, Validators.required]),
      numberOfDays: new FormControl('', [
        CustomValidators.gte(0),
        Validators.required
      ]),
      daysBefore: new FormControl('before')
    });

    this.text = this.form.controls['text'];
    this.filteredOptions = this.text.valueChanges
      .startWith(null)
      .map(
        calendarstep =>
          calendarstep
            ? this.filterCalendar(calendarstep)
            : this.test.calendar.steps.slice()
      );
  }

  filterCalendar(name: string) {
    return this.test.calendar.steps.filter(
      calendarstep =>
        calendarstep.text.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }
  ngOnInit() {

    this.getRequiredUserTypes();
    this.datePipe = new DatePipe(this.translate.currentLang);
    this.translate.get('TEST.ERRORS.FILLALL').subscribe(text => {
      this.fillAllError = text;
    });
    this.testService.getTest().subscribe(test => {
      this.test = test;
      this.sortedSteps = Object.assign([], this.test.calendar.steps);
      this.sortedSteps = _.sortBy(this.sortedSteps, ['date']).reverse();
      this.ids = Math.max.apply(Math, this.test.calendar.steps.map(step => { return step.id; })) || 1;
    });

    // this.calendarstepservice.getCalenderSteps().subscribe(data => {
    //   this.calendarList = data;
    //   this.form.controls['text'].setValue('');
    // });
    this.userservice.getUserBasedOnUserType('admtc').subscribe(response => {
      for (const res of response.data) {
        this.academicStaffUsers.push(res);
      }
    });
  }

  filter(val: string) {
    return this.test.calendar.steps.filter(
      option => option.text.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  changeWhat(data) {
    if (data) {
      this.relativeDate = true;
      this.initFormRelativeDate();
      this.form.controls['daysBefore'].setValue(
        data.beforeDays === true ? 'before' : 'after'
      );
      this.form.controls['actor'].setValue(data.userTypeId._id);

      this.form.controls['numberOfDays'].setValue(data.numberOfDays);
    }
  }
  cancelNewStep() {
    this.newStep = false;
    this.form.patchValue({
      daysBefore: 'before'
    });
    this.form.reset();
    this.relativeDate = false;
  }

  recepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient
      ? selectedRecepient.display
      : null;
  }

  addStep() {
    // (<FormArray>this.form.get('steps')).controls.push(
    //   new FormGroup({
    //     text: new FormControl('', Validators.required),
    //     sender: new FormControl('', Validators.required),
    //     actor: new FormControl('', Validators.required),
    //     date: new FormControl('', [CustomValidators.date, Validators.required])
    //   })
    // );
    this.form = new FormGroup({
      text: new FormControl('', Validators.required),
      sender: new FormControl('', Validators.required),
      actor: new FormControl('', Validators.required),
      date: new FormControl(null, [CustomValidators.date]),
      numberOfDays: new FormControl('', [CustomValidators.gte(0)]),
      daysBefore: new FormControl('before')
    });
    this.newStep = true;
  }

  removeStep(index: number, calendarStep) {
    // (<FormArray>this.form.get('steps')).controls.splice(index, 1);
    swal({
      title: 'Attention',
      text: this.translate.instant('CONFIRMDELETE', {
        value: this.translate.instant('TEST.THISSTEP')
      }),
      type: 'question',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('YES'),
      cancelButtonText: this.translate.instant('NO')
    }).then(() => {
      console.log(this.sortedSteps);
      const a = this.sortedSteps.splice(index, 1)[0];

      const i = this.test.calendar.steps.find(step => {
        return step.id === a.id;
      });
      console.log(this.sortedSteps);
      this.test.calendar.steps = this.sortedSteps;
      console.log(this.test.calendar.steps);
      return this.sortedSteps;
      // this.sortedSteps = [...this.sortedSteps];
      // const ind = this.test.calendar.steps.indexOf(i);
      // // console.log(ind, i);
      // this.test.calendar.steps.splice(ind, 1);
      //  this.testService.updateTest(this.test);
    });
  }

  addStepToTest() {
    const ctls = this.form.controls;
    ctls['text'].markAsTouched();
    ctls['sender'].markAsTouched();
    ctls['actor'].markAsTouched();
    //  ctls['date'].markAsTouched();
    //  ctls['numberOfDays'].markAsTouched();
    if (!this.relativeDate) {
      if (
        ctls['text'].valid &&
        ctls['sender'].valid &&
        ctls['actor'].valid &&
        ctls['date'].valid
      ) {
        this.test.calendar.steps.push({
          id: this.ids,
          text: this.form.value.text,
          sender: this.form.value.sender,
          actor: this.form.value.actor,
          date: {
            type: 'fixed',
            value: this.form.value.date
          },
          createdFrom: 'manual'
        });
        this.sortedSteps.push({
          id: this.ids++,
          text: this.form.value.text,
          sender: this.form.value.sender,
          actor: this.form.value.actor,
          date: {
            type: 'fixed',
            value: this.form.value.date
          },
          createdFrom: 'manual'
        });
        this.sortSteps();
        this.newStep = false;
        this.form.reset();
        this.form.patchValue({
          daysBefore: 'before'
        });
        this.relativeDate = false;

        // this.sortedSteps.splice(_.sortedIndex(this.sortedSteps, this.form.value), 0, this.form.value);
        this.testService.updateTest(this.test);
      } else {
        swal({
          title: 'Attention',
          text: this.translate.instant('TEST.ERRORS.FILLALL'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    } else {
      if (
        ctls['text'].valid &&
        ctls['sender'].valid &&
        ctls['actor'].valid &&
        ctls['numberOfDays'].valid
      ) {
        this.test.calendar.steps.push({
          id: this.ids,
          text: this.form.value.text,
          sender: this.form.value.sender,
          actor: this.form.value.actor,
          date: {
            type: 'relative',
            before: this.form.value.daysBefore === 'before',
            days: this.form.value.numberOfDays
          },
          createdFrom: 'manual'
        });
        this.sortedSteps.push({
          id: this.ids++,
          text: this.form.value.text,
          sender: this.form.value.sender,
          actor: this.form.value.actor,
          date: {
            type: 'relative',
            before: this.form.value.daysBefore === 'before',
            days: this.form.value.numberOfDays
          },
          createdFrom: 'manual'
        });
        this.sortSteps();
        this.newStep = false;
        this.form.reset();
        this.form.patchValue({
          daysBefore: 'before'
        });
        this.relativeDate = false;

        // this.sortedSteps.splice(_.sortedIndex(this.sortedSteps, this.form.value), 0, this.form.value);
        this.testService.updateTest(this.test);
      } else {
        swal({
          title: 'Attention',
          text: this.translate.instant('TEST.ERRORS.FILLALL'),
          allowEscapeKey: true,
          type: 'warning'
        });
      }
    }

    //   this.form.controls['steps'][0].updateValueAndValidity(true);
  }

  initFormRelativeDate() {
    if (!this.relativeDate) {
      this.form = this.fb.group({
        text: new FormControl(this.form.value.text, Validators.required),
        sender: new FormControl(this.form.value.sender, Validators.required),
        actor: new FormControl(this.form.value.actor, Validators.required),
        date: new FormControl(null, [
          CustomValidators.date,
          Validators.required
        ])
        // numberOfDays: new FormControl('', [CustomValidators.gte(0), Validators.required]),
        // daysBefore: new FormControl('before')
      });
    } else {
      this.form = this.fb.group({
        text: new FormControl(this.form.value.text, Validators.required),
        sender: new FormControl(this.form.value.sender, Validators.required),
        actor: new FormControl(this.form.value.actor, Validators.required),
        // date: new FormControl(null, [CustomValidators.date]),
        numberOfDays: new FormControl('', [
          CustomValidators.gte(0),
          Validators.required
        ]),
        daysBefore: new FormControl('before')
      });
    }
  }
  changeDateType(event: MdSlideToggleChange) {
    this.relativeDate = event.checked;
    this.initFormRelativeDate();
  }

  checkNumberOfDays() {
    if (this.form.value.numberOfDays < 0) {
      this.form.patchValue({
        numberOfDays: 0
      });
    }
  }

  setSortOrder() {
    console.log(this.descending);
    this.sortedSteps.reverse();
  }

  sortSteps(field?: string) {
    this.currentSort = field ? field : this.currentSort;

    if (this.descending) {
      this.sortedSteps = _.sortBy(this.sortedSteps, [
        this.currentSort
      ]).reverse();
    } else {
      this.sortedSteps = _.sortBy(this.sortedSteps, [this.currentSort]);
    }
  }

  submitTest() {
    const testname = this.test.name;
    this.testService.updateTest(this.test);
    this.testService.submitTest().subscribe(
      function (status) {
        if (status) {
          swal({
            title: this.translate.instant('CONGRATULATIONS'),
            allowEscapeKey: true,
            text: this.translate.instant('TEST.MESSAGES.TESTCREATIONSUCCESS', {
              value: testname
            }), // 'Vous venez de créer l\'épreuve',
            type: 'success'
          }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        } else {
          swal({
            title: 'Attention',
            text: this.translate.instant('TEST.ERRORS.TESTCREATIONERROR'),
            allowEscapeKey: true,
            type: 'warning'
          });
        }
      }.bind(this)
    );
  }

  goToPreviousStep() {
    // this.testService.updateTest(this.test);
    const url = this.test.controlledTest
      ? '/create-test/first'
      : '/create-test/third';
    this.router.navigateByUrl(url);
  }


  getUserTypeName(id) {
    for (const utype of this.userTypes) {
      if (utype._id === id) {
        return utype.name;
      }
    }
  }

  getSenderName(id) {
    for (const utypename of this.academicStaffUsers) {
      if (utypename._id === id) {
        return utypename.firstName + ' ' + utypename.lastName;
      }
    }
    for (const utypename of this.acadUserTypes) {
      if (utypename._id === id) {
        const value = this.translate.instant('ADMTCSTAFFKEY.' + utypename.name.toUpperCase());
        return value !== 'ADMTCSTAFFKEY.' + utypename.name.toUpperCase() ? value : name;
      }
    }

  }

  getTranslateADMTCSTAFFKEY(name) {
    if (name) {
      const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
      return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
    }
  }

  getTranslateWhat(name) {
    if (name) {
      const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
      return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
    } else {
      return '';
    }
    // step.text.toUpperCase() == "MARKS ENTRY" ? "TEST.DATETYPES.MARKS" | translate : step.text;
  }

  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    return this.datePipe.transform(new Date(date));
  }

  getRequiredUserTypes() {
    this.usertypeService.getAllUserType().subscribe(uTypes => {
      this.userTypes = _.filter(uTypes.list, function (o) {
        return o.entity === 'academic' ||
          (o.entity === 'company' && o.name.toLowerCase() === 'mentor') ||
          (o.entity === 'certifier' && (o.name.toLowerCase() === 'president-of-jury' || o.name.toLowerCase() === 'admin' || o.name.toLowerCase() === 'corrector-certifier' || o.name.toLowerCase() === 'corrector-quality')) ||
          (o.entity === 'admtc' && o.name.toLowerCase() === 'director');
      });
      this.acadUserTypes = _.filter(uTypes.list, function (o) {
        return o.entity === 'academic';
      });
    });
  }

  goToNextStep() {
    this.testService.updateTest(this.test);
    this.router.navigateByUrl('/create-test/fifth');
  }
}

