import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../services/students.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentDetailsComponent2 } from '../student/student-details/student-details.component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { UtilityService } from '../../services';
import _ from 'lodash';

import { Log } from 'ng2-logger';
import { DisplayMailPopupComponent } from '../Mail/display-mail-popup/display-mail-popup.component';
import { AlertService } from 'app/services/alert.service';
const log = Log.create('StudentDashboardComponent');
log.color = 'blue';

@Component({
    selector: 'app-mentor-students',
    templateUrl: './mentor-students-component.html',
    providers: [StudentsService]
})
export class MentorStudentsComponent implements OnInit {
  student: any;
  studentId: any;
  studentList: any;
  totalStudentList: any;
  studentIdWithIndex;
  searchStudentString: string;
    user;
  customerId: string;
  activeId: string;
  activateDetails = false; 
  userType: string;
  changedStudent: Object = {
    student : '',
    index: ''
  };
  public dialogRefDisplayMail: MdDialogRef<DisplayMailPopupComponent>;
  DisplayMailPopupConfig: MdDialogConfig = {
    disableClose: true,
    width: '850px',
    height: '65%'
  };
  getAlertUserList: any;
  newAlert: boolean;
  constructor(
              private studentService: StudentsService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MdDialog,
              private loginService: LoginService,
              private alertService: AlertService,
              public utilityService: UtilityService) {
      log.info('Constructor Invoked');

  }

  ngOnInit() {
    this.checkIfNewAlert();
    
    if (this.utilityService.checkUserIsMentor()) {
      this.user = this.loginService.getLoggedInUser();
      this.getstudentList();
    }
  }

  checkIfNewAlert(){
    const currentLogin = this.loginService.getLoggedInUser();
    console.log(currentLogin);
    this.alertService.getListOfAlertUsertype().subscribe((res: any) => {
      this.getAlertUserList = res.data;
      console.log('inside 1', this.getAlertUserList);
  
     if(this.getAlertUserList && this.getAlertUserList.published === true){
      console.log('inside 1', this.getAlertUserList.published);
        this.newAlert = true;
     }
  
     if(this.newAlert === true ){
       this.OpnDisplayAlertPopup();
     }
    });
  }
  
  OpnDisplayAlertPopup(){
    this.dialogRefDisplayMail = this.dialog.open(DisplayMailPopupComponent, this.DisplayMailPopupConfig);
    if(this.newAlert === true){
      this.dialogRefDisplayMail.componentInstance.newAlert = true;
      this.dialogRefDisplayMail.componentInstance.alertData = this.getAlertUserList;
    }
  }

  updateStudent(event) {
    console.log(this.studentList);
    this.getstudentList();
  }

  getstudentList() {
    this.studentService.getAllStudentOfMentor(this.user['_id']).subscribe(
      list => {console.log(list);
        if(list.studentList.length){
          this.totalStudentList = list.studentList;
          this.studentList = this.totalStudentList;
        }
        console.log(this.studentList);
    });
  }


  searchStudentList(event) {
    const self = this;
    // To check is Text is Entered
    if (this.searchStudentString !== '') {
      const val = this.searchStudentString.toLowerCase();
      // Filter Based on Short Name and Long Name
      const temp = this.totalStudentList.filter(function (student) {
        return (
          ((student.firstName !== '' && student.firstName.toLowerCase().indexOf(val) !== -1)
          || (student.lastName !== '' && student.lastName.toLowerCase().indexOf(val) !== -1))
        );
      });
      this.studentList = temp;
    } else {
      this.studentList = this.totalStudentList;
    }
  }
  
  emitStudent(student,i){
    this.studentIdWithIndex = {
        student: student,
        index: i
    };
    this.activeId = student._id;
    this.activateDetails = true;
  }

  studentChanged(studentWithIndex){
    this.changedStudent = studentWithIndex;
    this.getstudentList();
  }
}

