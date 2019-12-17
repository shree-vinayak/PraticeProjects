import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from 'app/components/customer/customer.service';
import { MdDialogRef } from '@angular/material';
import { UserService } from 'app/services/users.service';
import { UtilityService, StudentsService } from '../../../../services';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs';
import { UserFilter } from 'app/models/userfilter.model';
import _ from 'lodash';
declare var swal: any;


@Component({
  selector: 'app-transfer-student-school-dialog',
  templateUrl: './transfer-student-school-dialog.component.html',
  styleUrls: ['./transfer-student-school-dialog.component.scss']
})
export class TransferStudentSchoolDialogComponent implements OnInit {

  schoolLists = [];
  schoolDestinationLists = [];
  selectedSchool = [];
  selectedDestinationSchool = [];

  schoolAllData = [];


  titleLists = [];
  selectedRNCP = [];

  initialUserTypes = [];
  studentList = [];
  selectedStudent = [];

  userList = [];
  leftUserList = [];
  rigthUserList = [];
  selectedLeftUser = [];
  selectedRightUser = [];


  userFilterObject: UserFilter = new UserFilter();


  constructor(
    private custService: CustomerService,
    private dialogRef: MdDialogRef<TransferStudentSchoolDialogComponent>,
    private userService: UserService,
    private utilityService: UtilityService,
    public translate: TranslateService,
    private studentService: StudentsService
  ) { }

  ngOnInit() {
    this.getAllSchools();
    // this.getAcademicDirectorAndCRAdmin();
  }


  selectSchool(event) {
    this.titleLists = [];
    this.selectedRNCP = null;
    this.selectedStudent = [];
    this.selectedDestinationSchool = [];
    if (event.id) {
      this.selectedRNCP = [];
      this.selectedLeftUser = [];
      event.id.rncpTitles.forEach(item => {
        this.titleLists.push({ id: item._id, text: item.shortName });
      });

      this.titleLists = [...this.titleLists.sort(this.keysrt('text'))];

      // this.getUserBasedOnSelectedSchool(event);
    }
  }

  selectDestinationSchool(event) {

  }


  schoolDestinationRemoved(event) {
    // this.selectedRNCP = [];
  }

  selectStudent(event) {
    if (event.id) {
      this.leftUserList = [];
      this.selectedLeftUser = [];
      this.selectedStudent = [];
      this.selectedStudent.push(event);
      if (this.selectedRNCP.length > 0) {
        // this.filterUserBasedOnRNCPAndUserType();
      }
    }
  }

  getAllSchools() {
    this.custService.getSchoolsBasedOnLoggedInUserType().subscribe(schools => {
      const data = schools.data;
      this.schoolAllData = [...schools.data];
      this.schoolLists = [];
      if (data) {
        data.forEach(rep => {
          this.schoolLists.push({
            id: rep,
            text: rep.shortName
          });
        });
      }
      this.schoolLists = this.schoolLists.sort(this.keysrt('text'));
    });
  }

  selectRNCP(event) {
    if (event.id) {
      this.selectedRNCP = [];
      this.leftUserList = [];
      this.selectedLeftUser = [];
      this.selectedRNCP.push(event);
      this.selectedStudent = [];
      this.selectedDestinationSchool = [];
      this.schoolDestinationLists = [];
      this.studentList = [];
      console.log(this.selectedRNCP);
      this.getStudentsBasedonSchoolAndRNCP();
      this.fillDestinationSchoolList();

    }
  }

  fillDestinationSchoolList() {
    if (this.schoolAllData.length > 0) {
      this.schoolAllData.forEach((s) => {
        const i = _.findIndex(s.rncpTitles, {'_id': this.selectedRNCP[0].id});
        if (i > -1 && s._id !== this.selectedSchool[0].id._id) {
          this.schoolDestinationLists.push({
            id: s._id,
            text: s.shortName
          });
        }
      });
      this.schoolDestinationLists = [...this.schoolDestinationLists.sort(this.keysrt('text'))];
    }
  }


  getStudentsBasedonSchoolAndRNCP() {
    const params = {
      'prepcenter': this.selectedSchool[0].id._id,
      'rncpTitleId': this.selectedRNCP[0].id
    };
    this.studentService.getAllStudentForADMTC(params, 0, 0).subscribe(list => {
      console.log(list);
      if (list && list.studentList.length) {
        list.studentList.forEach(s => {
          this.studentList.push({
            id: s._id,
            text: this.utilityService.computeCivility(s.sex, this.translate.currentLang) + ' ' + s.lastName + ' ' + s.firstName
          });
        });
        this.studentList = [...this.studentList.sort(this.keysrt('text'))];
      } else {
        this.studentList = [];
      }
    });
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) {
        return 1;
      } else if (a[key] < b[key]) {
        return -1;
      }
      return 0;
    };
  }

  closeDialog(state = false) {
    this.dialogRef.close(state);
  }

  transferStudent() {
    const self = this;
    swal({
      title: this.translate.instant('TRANSFER_STUDENT_SCHOOL.ChangeSchool_S1.TITLE'),
      html: this.translate.instant('TRANSFER_STUDENT_SCHOOL.ChangeSchool_S1.TEXT', {
        studentFullName: this.selectedStudent[0].text,
        originSchoolshortname: this.selectedSchool[0].text,
        destinationSchoolShortname: this.selectedDestinationSchool[0].text,
        titleshortname: this.selectedRNCP[0].text
      }),
      type: 'warning',
      allowEscapeKey: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant('CrossCorrection.CROSS_S1.Cancle'),
      confirmButtonText: this.translate.instant('TRANSFER_STUDENT_SCHOOL.ChangeSchool_S1.CONFIRM_BUTTON')
    }).then(() => {
      const body = {
        'studentTransferred': this.selectedStudent[0].id,
        'newSchool': this.selectedDestinationSchool[0].id,
        'lang': this.translate.currentLang
      };
      this.studentService.transferStudentToAnotherSchool(body).subscribe(res => {
        console.log(res.data);
        if (res.code === 200) {
          this.successSwal();
          this.closeDialog(true);
        } else if (res.code === 400) {
          if ( res.message && res.message.studentDetails ) {
            this.displayCHANGESCHOOL_S5Swal(res.message.studentDetails);
          } else {
            this.errorSwaln(res.message); 
          }
        }
      });
    });
  }


  displayCHANGESCHOOL_S5Swal(studentDetails) {
    swal({
      title: this.translate.instant('BACKEND.STUDENT.SORRY'),
      html: this.translate.instant('CHANGEMENT_RNCP_TITLE.CHANGESCHOOL_S5.TEXT', {
        studentName: `${this.utilityService.computeCivility(studentDetails.sex,
          this.translate.currentLang.toLowerCase())} ${studentDetails.firstName} ${studentDetails.lastName}`,
        oldTitle: studentDetails.rncpTitle.shortName,
        schoolName: studentDetails.school.shortName,
      }),
      allowEscapeKey: true,
      allowOutsideClick: true,
      type: 'warning',
      confirmButtonClass: 'btn-danger',
      confirmButtonText: this.translate.instant('OKAY')
    });
  }

  errorSwaln(message) {
    swal({
      type: 'error',
      title: message,
      // title: this.translate.instant('SUCCESS'),
      allowEscapeKey: true,
      confirmButtonText: 'OK'
      });
  }

  successSwal() {
    swal({
      type: 'success',
      title: this.translate.instant('SUCCESS'),
      allowEscapeKey: true,
      confirmButtonText: 'OK'
      });
  }
}
