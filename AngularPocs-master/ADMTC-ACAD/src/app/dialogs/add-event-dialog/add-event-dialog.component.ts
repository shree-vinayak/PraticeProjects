import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdSlideToggleChange } from '@angular/material';
import { AddExpertiseDialogComponent } from '../../components/parameter-rncp/rncp-test/add-expertise-dialog/add-expertise-dialog.component';
import { UserService } from '../../services/users.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TestService } from '../../services/test.service';
import { CustomerService } from '../../components/customer/customer.service';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import { DashboardService } from '../../services/dashboard.service';
import { Event } from '../../models/events.model';
import swal from 'sweetalert2';
import * as moment from 'moment';
//declare var swal: any;


@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.scss'],
  providers: [DashboardService]
})
export class AddEventDialogComponent implements OnInit {

  userTypes: any = [];
  addEventForm: FormGroup;
  selectedUserTypes: any = [];
  selectedMultipleUserTypes: any = [];
  selectedMultipleSchools: any = [];
  preparationCenter = [];
  schools: any = [];
  checkFromValid = true;
  schoolList = [];
  rncp = '';
  eventModel: Event = new Event();
  page = new Page();
  sort = new Sort();
  showSchools = false;

  constructor(private dialogRef: MdDialogRef<AddEventDialogComponent>,
              private userservice: UserService,
              private translate: TranslateService,
              private fb: FormBuilder,
              private dashboardService: DashboardService,
              private testService: TestService,
    private schoolService: CustomerService,
    ) { }

  ngOnInit() {
    this.intializeFormGroup();

    this.userservice.getUserTypesWithIsUserCollection('academic', true).subscribe((response) => {
      this.userTypes = [];
      const items = response.data;
      response.data = response.data.sort(this.keysrt('name'));
      items.forEach((item) => {
        this.userTypes.push({ 'id': item._id, 'text': this.getTranslateADMTCSTAFFKEY(item.name) });

        if (this.eventModel.userTypes) {
            for (var i = 0; i < this.eventModel.userTypes.length; i++) {
              var selected = this.eventModel.userTypes[i];
              if(selected == item['_id']){
                this.selectedMultipleUserTypes.push({
                  id: selected,
                  text:  this.getTranslateADMTCSTAFFKEY(item['name'])
                  });
              }
            }
        }
        this.intializeFormGroup();
      });
      console.log(this.userTypes);
      console.log(this.selectedMultipleUserTypes);

    });

    this.getSchools();


    console.log('this.eventModel');
    console.log(this.eventModel);

  }

  getSchools() {
    const self = this;
    this.testService.getPreparationCenters().subscribe((res) => {
      const data = res;
      console.log('schools', data, res);
      this.schoolList = [];
      if (data) {
        data.forEach((item) => {
          if (item) {
            this.schoolList.push({text: item.shortName,id: item._id});
          }
        });
       // this.schoolList = this.schoolList.sort(self.keysrt('text'));
      }
    });

    if (this.eventModel.schools) {
      this.eventModel.schools.forEach((item) => {
        if (item) {
          this.selectedMultipleSchools.push({text: item['shortName'], id: item['_id']});
        }
      });
    }

  }


  closeDialog(object?: any) {
    this.dialogRef.close(object);
  }
  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) { return 1; }
      else if (a[key] < b[key]) { return -1; };
      return 0;
    };
  }
  getTranslateADMTCSTAFFKEY(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  intializeFormGroup() {
    this.addEventForm = this.fb.group({
      userTypes: [this.selectedMultipleUserTypes, Validators.required],
      schools: [this.selectedMultipleSchools],
      fromDate: [this.eventModel.fromDate ? new Date(this.eventModel.fromDate) : '', Validators.required],
      toDate: [this.eventModel.toDate ? new Date(this.eventModel.toDate) : '', Validators.required],
      name: [this.eventModel.name ? this.eventModel.name : '', Validators.required],
      isAllSchools: [this.eventModel.isAllSchools ? this.eventModel.isAllSchools : !this.showSchools, Validators.required]
    });

    this.addEventForm.controls['fromDate'].valueChanges.subscribe(res => {
      this.addEventForm.get('toDate').enable();
      this.checkFromValid = false;
    });

    if (this.addEventForm.controls['fromDate'].value !== null || this.addEventForm.controls['fromDate'].value !== '' ) {
      this.addEventForm.get('toDate').enable();
      this.checkFromValid = false;
    }
    // this.addEventForm.controls['fromDate'].valueChanges.subscribe( res => {
    //   this.checkFromValid = false;
    // });

    if (this.eventModel) {
      this.showSchools = !this.eventModel.isAllSchools;
    }
  }

  disablePastDates() {
    if (this.addEventForm.controls['fromDate'].value !== null || this.addEventForm.controls['fromDate'].value !== '') {
      const from = new Date(this.addEventForm.controls['fromDate'].value);
      return new Date(from.getFullYear(), from.getMonth(), from.getDate() - 1);
    }
  }

  changeTypes(event) {
    console.log(event);
    this.selectedMultipleUserTypes = [];
    if (event.length) {
      const ut = event;
      ut.forEach((item) => {
        console.log(item.id);
      //  this.eventModel.userTypes.push(item.id);
        this.selectedMultipleUserTypes.push(item.id);
      });

    //  this.eventModel.userTypes = this.selectedMultipleUserTypes;
    }
  }

  changeSchool(event) {
    this.schools = [];
    if (event.length) {
      const sc = event;
      sc.forEach((item) => {
        this.schools.push(item.id);
      });
    }
  }

  addEvent() {
    if (this.showSchools === false) {
      this.eventModel.schools = [];
      this.schoolList.forEach(element => {
        this.eventModel.schools.push(element.id);
      });
    } else {
      this.eventModel.schools = this.schools;
    }

    this.eventModel.name = this.addEventForm.value.name;
    this.eventModel.userTypes = this.selectedMultipleUserTypes;
    this.eventModel.rncp = this.rncp;
    this.eventModel.isAllSchools = !this.showSchools;
    this.eventModel.fromDate = moment(this.addEventForm.value.fromDate).format('YYYY-MM-DD');
    this.eventModel.toDate = moment(this.addEventForm.value.toDate).format('YYYY-MM-DD');

    if (this.addEventForm.valid) {
      const startTime = moment(this.addEventForm.value.fromDate);
      const endTime = moment(this.addEventForm.value.toDate);
      if (moment(endTime).isBefore(startTime)) {
        swal({
          title: this.translate.instant('SETTINGS.SCHOLERSEASON.INVALIDDATETITLE'),
          text: this.translate.instant('SETTINGS.SCHOLERSEASON.INVALIDDATETEXT'),
          type: 'warning',
          allowEscapeKey:true,
          confirmButtonText: 'OK'
        });

      } else {
        if (this.eventModel && this.eventModel['_id']) {
          this.dashboardService.updateUpcominfEvents(this.eventModel).subscribe(res => {
            console.log(res);
            if (res) {
              this.dialogRef.close();
              swal({
                title: this.translate.instant('DASHBOARD.UPCOMINGEVENT.EDIT.TITLE'),
                html: this.translate.instant('DASHBOARD.UPCOMINGEVENT.EDIT.TEXT', { eventName: this.eventModel.name }),
                type: 'success',
                allowEscapeKey: true,
                confirmButtonText: this.translate.instant('DASHBOARD.UPCOMINGEVENT.EDIT.OK')
              });
            } else {
              swal({
                title: 'Attention',
                text: this.translate.instant('Error'),
                allowEscapeKey:true,
                type: 'warning'
              });
            }
          });
        } else {
          this.dashboardService.setUpcominfEvents(this.eventModel).subscribe(res => {
            if (res) {
              swal({
                title: this.translate.instant('CONGRATULATIONS'),
                text: this.translate.instant('DASHBOARD.UPCOMINGEVENT.EVENTSUCCESSFUL', { eventName: this.eventModel.name }),
                type: 'success',
                allowEscapeKey:true,
                confirmButtonText: 'OK'
              }).then(() => {
                this.dialogRef.close();
              });
              // alert("User update Successfully");

            } else {
              swal({
                title: 'Attention',
                text: this.translate.instant('Error'),
                allowEscapeKey: true,
                type: 'warning'
              });
            }
          });
        }


    }

    }

  //  this.dialogRef.close(this.eventModel);
  //  Object.assign(this.eventModel, this.addEventForm.value);
    console.log('Event Model', this.eventModel);
  }

  toggleIsAllSchools(event: MdSlideToggleChange) {
    console.log('toggle', event.checked);
  //  this.addEventForm.controls.isAllSchools.setValue(event.checked);
    if (!event.checked) {
      this.showSchools = true;
    //  this.addEventForm.controls['isAllSchools'].setValue(false);
    }else {
      this.showSchools = false;
      // const tempSchoolList = [];
      // this.schools.array.forEach(element => {
      //   tempSchoolList.push(element._id);
      // });
      // this.addEventForm.controls['schools'].setValue(tempSchoolList);
    //  this.addEventForm.controls['isAllSchools'].setValue(true);
    }
    console.log('Form', this.addEventForm.value);
  }
}
