import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentsService } from '../../../services/students.service';
import { Router, ActivatedRoute } from '@angular/router';


// required for logging
import { Log } from "ng2-logger";
import { LoginService } from '../../../services/login.service';
const log = Log.create("StudentInfoComponent");
log.color = "blue";

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent implements OnInit, OnDestroy {

  /*************************************************************************
  *   VARIABLES
  *************************************************************************/
  user;
  student;
  studentIdWithIndex;
  activateDetails: boolean = false;
  isPreviousCourse = false;

  /*************************************************************************
     *   CONSTRUCTOR
  *************************************************************************/
  constructor(private studentsService:StudentsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private loginService: LoginService) { }

  /*************************************************************************
   *   EVENTS
  *************************************************************************/
  ngOnInit() {
    log.info('ngOnInit Invoked');

    // Getting User Info From Local Storage
    this.user = this.loginService.getLoggedInUser();

    this.studentsService.isPreviousCourseState = false;
    this.getCurrentRouterState();
  }

  ngOnDestroy(): void {
    this.studentsService.isPreviousCourseState = false;
  }

  /*************************************************************************
   *   METHODS
  *************************************************************************/

  getCurrentRouterState() {
    this.activatedRoute.params.subscribe(
      (params) => {
        if ( params.hasOwnProperty('rncpId') && params.hasOwnProperty('schoolId') ) {
          log.info('ngOnInit Invoked params', params);
          this.studentsService.isPreviousCourseState = true;
          this.getPreviousCourseDetails(params);
        } else {
          log.info('ngOnInit Invoked No params');
          this.studentsService.isPreviousCourseState = false;
          this.getStudentDetailsForMyFile();
        }
      }
    )
  }

  getPreviousCourseDetails(params) {
    const payloadObject = {
      ...params,
      email: this.user.email
    };

    this.studentsService.getPreviousCoursesDetails(payloadObject).subscribe(
      (student) => {
        this.setStudentForDisplay(student);
      }
    );
  }

  getStudentDetailsForMyFile() {

    if (this.user !== undefined && this.user) {
        const emailId = this.user.email;
        // Using Email ID of Student for getting Student Details
        this.studentsService.getStudentIdByEmail(emailId)
          .subscribe( student => {
            this.setStudentForDisplay(student);
          })
    } else {
      this.router.navigate(['/login']);
    }
  }

  setStudentForDisplay(student) {
    log.data( 'email res', student);
    this.studentIdWithIndex = {
      student: student.data,
      index: 'studentInfo'
    };
    this.activateDetails = true;
  }

}
