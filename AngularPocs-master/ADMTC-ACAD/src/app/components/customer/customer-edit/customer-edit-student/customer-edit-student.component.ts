import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { UserService } from '../../../../services/users.service';
import { StudentsService } from '../../../../services/students.service';
import { CustomerService } from '../../customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';
import { TranslateService } from 'ng2-translate';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

import _ from 'lodash';

// import { PCUserDialogComponent } from '../../../../dialogs/pc-user-menu-dialog/pc-user-menu-component';
import { CreateStudentPopupComponent } from './create-student-popup/create-student-popup.component';

import { StudentDetailsComponent } from 'app/dialogs/student-details/student-details.component';

//import { SendStudentMailComponent } from '../../../../dialogs/send-student-mail/send-student-mail.component';

import { JobDescriptionNotificationDialogComponent } from './job-description-notification-dialog/job-description-notification-dialog.component';
import { ComposeMailComponent } from 'app/components/Mail/compose-mail/compose-mail.component';

declare var swal: any;

@Component({
  selector: 'app-customer-edit-student',
  templateUrl: './customer-edit-student.component.html',
  styleUrls: ['./customer-edit-student.component.scss']
})
export class CustomerEditStudentComponent implements OnInit {
  rncpTitle: any = [];
  page = new Page();
  sort = new Sort();
  StudentListSearchItem = '';
  reorderable = true;
  TotalStudentList: any[];
  studentList: any;
  tempStudentList: any;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  selectedStudent = [];

  customerId: any;
  errorMessage: any;
  editContact: any[];
  public dialog: MdDialogRef<CreateStudentPopupComponent>;

  public studentDetailsDialog: MdDialogRef<StudentDetailsComponent>;
  public dialogRef: MdDialogRef<ComposeMailComponent>;

  public jobDescriptionDialog: MdDialogRef<JobDescriptionNotificationDialogComponent>;
  customer;
  popupConfig: MdDialogConfig;
  private subscription: Subscription;
  configStdDetails: MdDialogConfig = {
    disableClose: false,
    width: '70%',
    height: '80%'
  };
  constructor(private customerService: CustomerService,
    private service: RNCPTitlesService,
    private userService: UserService,
    private studentService: StudentsService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog1: MdDialog,
    public dialog2: MdDialog,
    private translate: TranslateService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
  }

  ngOnInit() {
    console.log('ng on OnInit');

    this.subscription = this.route.params.subscribe(
      params => {
        if (params.hasOwnProperty('customerId')) {
          this.customerId = params['customerId'];
          console.log('customer ID' + this.customerId);

          this.getTitleList(this.customerId);

          this.customerService.getCustomer(this.customerId)
            .subscribe(
            customer => {
              this.customer = customer;
              console.log(this.customer);

            }
            );
        } else {
          this.errorMessage = 'There is no parameter';
        }
      });


  }

  onStudentSelected({ selected }) {
    this.selectedStudent = selected;
    console.log('Select Event', selected, this.selectedStudent);
  }

  // searchStudentList(event) {
  //   if (this.StudentListSearchItem != "") {
  //     const val = event.target.value.toLowerCase();
  //     const temp = this.TotalStudentList.filter(function (d) {
  //       return (
  //         (d.firstName != '' && d.firstName.toLowerCase().indexOf(val) !== -1));
  //     });
  //     this.contacts = temp;
  //   } else {
  //     this.contacts = this.TotalStudentList;
  //   }
  // }

  applyFilter(filter: String) {
    if (filter != null) {
      this.tempStudentList = this.studentList.filter(item => {
        if (item.name.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          return true;
        }
        return false;
      });
    }
  }


  getTranslated(text: string) {
    return this.translate.instant(text);
  }

  getTitleList(customerId): void {
    const queryString = '&prepcenter=' + customerId;
    this.studentService.getAllStudent( queryString ).subscribe(list => {
      this.studentList = list.studentList.result;
      const temp = _.filter(this.studentList, function (s) {
        return s.school._id === customerId;
      });
      this.studentList = temp;
      console.log(this.studentList);
      this.page.totalElements = list.total;
    });
  }


  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.getTitleList(this.customerId);
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
    this.getTitleList(this.customerId);
  }


  makeProfile() {
    this.popupConfig = {
      data: {
        customerId: this.customerId
      },
      disableClose: false,
      width: '400px',
      height: '600px',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      }
    };
  }


  openCreateStudentPopup() {
    this.router.navigateByUrl('/add-student/' + this.customerId);
    // this.makeProfile();
    // this.dialog = this.dialog1.open(CreateStudentPopupComponent, this.popupConfig);
    // this.dialog.afterClosed().subscribe(result => {
    //   this.dialog = null;
    //   this.getTitleList(this.customerId);
    // });
  }

  sendMentorEvaluation(data) {
    console.log(data);
    this.studentDetailsDialog = this.dialog1.open(StudentDetailsComponent, this.configStdDetails);
    this.studentDetailsDialog.componentInstance.studentId = data._id;
    this.studentDetailsDialog.componentInstance.student = data;
    this.studentDetailsDialog.componentInstance.customerId = this.customerId;
    this.studentDetailsDialog.afterClosed().subscribe((value) => {
      console.log(value);
      if (value) {
        swal({
          title: 'Success',
          text: this.translate.instant('STUDENT.MESSAGE.UPDATESUCCESS'),
          allowEscapeKey: true,
          type: 'success'
        }).then(function () {
          this.getTitleList(this.customerId);
        }.bind(this));
      }
    });
  }

  deActivateStudent(data) {
    console.log(data);

    swal({
      title: 'Attention',
      text: this.translate.instant('STUDENT.MESSAGE.CONFIRMDEACTIVE') + ' ' + data.firstName + ' ' + data.lastName + '  ?',
      type: 'question',
      showCancelButton: true,
      allowEscapeKey: true,
      cancelButtonText: this.translate.instant('NO'),
      confirmButtonText: this.translate.instant('YES')
    }).then(() => {

      let self = this;
      swal({
        title: self.translate.instant('STUDENT.MESSAGE.ENTERDATEOFDEACTIVE'),
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Date">' +
          '<input id="swal-input2" class="swal2-input" placeholder="Reason..">',
        showCancelButton: true,
        allowEscapeKey: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: function (email) {
          return new Promise(function (resolve, reject) {
            resolve();
          })
        },
        allowOutsideClick: false
      }).then(function (email) {
        delete data['$$index'];
        data.status = 'deactivated';
        self.studentService.updateStudent(data._id, data).subscribe(status => {
          if (status) {
            swal({
              title: 'Success',
              text: self.translate.instant('STUDENT.MESSAGE.DEACTIVATEDSUCCESS'),
              allowEscapeKey: true,
              type: 'success'
            }).then(function () {

            }.bind(this));
          }
          else {
            swal({
              title: 'Attention',
              text: self.translate.instant('STUDENT.MESSAGE.DEACTIVATEDFAIL'),
              allowEscapeKey: true,
              type: 'warning'
            });
          }
        });
      })
    }, function (dismiss) {
      if (dismiss === 'cancel') {
      }
    });

  }
  sendMailBox: MdDialogConfig = {
    disableClose: false,
    width: "1000px",
    height: '80%'
  };

  sendMail(data) {
    console.log(data);
    console.log('data');
    console.log(data);
    this.selectedStudent.push(data);
    this.dialogRef = this.dialog2.open(ComposeMailComponent, this.sendMailBox);
    // this.dialogRef.componentInstance.studentId = data._id;
    this.dialogRef.componentInstance.student = data;
    // this.dialogRef.componentInstance.selectedStudent = this.selectedStudent;
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
    return false;
  }

  openJobDescriptionNotification() {
    this.jobDescriptionDialog = this.dialog1.open(JobDescriptionNotificationDialogComponent, this.popupConfig);
    this.jobDescriptionDialog.componentInstance.selectedStudent = [this.selectedStudent];
    this.jobDescriptionDialog.componentInstance.customer = this.customer[0];
    this.jobDescriptionDialog.afterClosed().subscribe(result => {
      this.jobDescriptionDialog = null;
      console.log('update student');
      this.getTitleList(this.customerId);
    });
  }

  openJobDescriptionForm() {
    this.router.navigateByUrl('/job-description-form');
  }

}
