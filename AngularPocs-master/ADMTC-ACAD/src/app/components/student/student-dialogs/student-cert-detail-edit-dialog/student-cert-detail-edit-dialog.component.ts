import { TasksService } from './../../../../services/tasks.service';
import { StudentsService } from './../../../../services/students.service';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { StudentConstants } from '../../student-constants';
import { CountryData } from '../../country';
declare var swal: any;
import * as moment from 'moment';

// required for logging
import { Log } from 'ng2-logger';
import { UtilityService } from 'app/services';
const log = Log.create('StudentCertDetailEditDialogComponent');
log.color = 'blue';

@Component({
  selector: 'app-student-cert-detail-edit-dialog',
  templateUrl: './student-cert-detail-edit-dialog.component.html',
  styleUrls: ['./student-cert-detail-edit-dialog.component.scss']
})
export class StudentCertDetailEditDialogComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  formIdentity: FormGroup;
  student: any = {};
  sexType: Array<object> = StudentConstants.sexType;
  countryList: any[] = CountryData.CountryList;

  formIdentitySubmit = false;
  taskDetails: any = {};

  /*************************************************************************
   *   CONSTRUCTOR
  *************************************************************************/
  constructor(private dialogRef: MdDialogRef<StudentCertDetailEditDialogComponent>,
    private studentService: StudentsService,
    private taskservice: TasksService,
    private utility: UtilityService,
    private translate: TranslateService,
    private _fb: FormBuilder) {
    log.info('Contructor Invoked');
    this.initializeForm();
  }

  /*************************************************************************
   *   EVENTS
  *************************************************************************/
  ngOnInit() {
    this.getStudentDetailsForCertiIssue();
  }

  /*************************************************************************
   *   METHODS
   *************************************************************************/
  getStudentDetailsForCertiIssue() {
    this.studentService.getStudentDetailsForCertiIssue(
        this.taskDetails.studentId._id ? this.taskDetails.studentId._id : this.taskDetails.studentId
      ).subscribe(
      (response) => {
        log.data('getStudentDetailsForCertiIssue studentData', response);
        if (response.data) {
          this.student = response.data;
          this.initializeForm()
        }
      }
    )
  }

  initializeForm() {
    let studentBd = '';
    if (this.student.dateOfBirth) {
      const birthDate = new Date(this.student.dateOfBirth);
      studentBd =
        birthDate.getDate() +
        '-' +
        (birthDate.getMonth() + 1) +
        '-' +
        birthDate.getFullYear();
    }
    this.formIdentity = this._fb.group({
      sex: [this.student.sex ? this.student.sex : '', Validators.required],
      firstName: [this.student.firstName ? this.student.firstName : '', [Validators.required, Validators.maxLength(40)]],
      lastName: [this.student.lastName ? this.student.lastName : '', [Validators.required, Validators.maxLength(40)]],
      dateOfBirth: [studentBd, [Validators.required]],
      placeOfBirth: [this.student.placeOfBirth ? this.student.placeOfBirth : '', Validators.required],
      //      country: [cooool ? this.student.nationality : '1', [Validators.required, Validators.maxLength(40)]],
      telePhone: [this.student.telePhone ? this.student.telePhone : '', [Validators.required, Validators.maxLength(10)]],
      nationality: [this.student.nationality ? this.student.nationality : '1', [Validators.required, Validators.maxLength(40)]],
      address: this._fb.group({
        'line1': [this.student.address && this.student.address.line1 ? this.student.address.line1 : '', [Validators.required]],
        'line2': [this.student.address && this.student.address.line2 ? this.student.address.line2 : ''],
        // tslint:disable-next-line:max-line-length
        'postalCode': [this.student.address && this.student.address.postalCode ? this.student.address.postalCode : '',[ Validators.required,Validators.maxLength(9)]],
        'city': [this.student.address && this.student.address.city ? this.student.address.city : '', Validators.required],
        'country': [this.student.address && this.student.address.country ? this.student.address.country : '1']
      }),
    });
  }

  changeControlValue(control: AbstractControl, isFirstName = true) {
    control.setValue(this.utility.convertNameCasing(control.value, isFirstName));
  }

  saveStudentDetails() {
    this.formIdentitySubmit = true
    const formValues = this.formIdentity.value;
    log.data('saveStudentDetails formValues', formValues);
    if (formValues.dateOfBirth) {
      formValues.dateOfBirth = moment(formValues.dateOfBirth, 'DD-MM-YYYY').format('MM-DD-YYYY');
    }
    log.data('saveStudentDetails formValues afterDate Format', formValues);

    this.studentService.updateStudent(this.student._id, formValues).subscribe(
      response => {
        log.data('studentService updateStudent studentt', response);
        if (response._id) {
          this.markTaskAsComplete();
        }
      });
  }

  markTaskAsComplete() {
    this.taskservice.completeTask(this.taskDetails._id).subscribe((result) => {
      log.data('openAssignCorrector completeTask result.data', result.data);
      if (result.data) {
        this.taskSuccessSwal();
        this.closeDialog(result.data);
      }
    });
  }

  taskSuccessSwal() {
    swal({
      title: 'Bravo!',
      text: this.translate.instant('TASK.MESSAGE.TASKSAVESUCCESS'),
      allowEscapeKey: true,
      type: 'success',
      confirmButtonText: this.translate.instant('TASK.MESSAGE.OK'),
    });
  }

  closeDialog(state: any = false) {
    this.dialogRef.close(state);
  }
}
