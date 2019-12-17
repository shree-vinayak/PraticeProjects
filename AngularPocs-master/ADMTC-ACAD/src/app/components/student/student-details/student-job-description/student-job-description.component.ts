import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { StudentJobDescription } from './studen-job-description.model';
import { StudentsService } from '../../../../services/students.service';

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('StudentJobDescriptionComponent');
log.color = 'blue';

@Component({
  selector: 'app-student-job-description',
  templateUrl: './student-job-description.component.html',
  styleUrls: ['./student-job-description.component.css']
})
export class StudentJobDescriptionComponent implements OnInit, OnChanges {


  /*************************************************************************
 *  VARIABLES
*************************************************************************/
  @Input() jobDescription: StudentJobDescription;
  @Output() emitStatustoDetails: EventEmitter<string> = new EventEmitter();
  jobDescriptionByEmail: StudentJobDescription;

  sentToMentor = false;
  sentToStudent = false;
  validateByMentor = false;
  validateByAcademic = false;
  checkJobdescEmptyMessage = false;

  /*************************************************************************
   *  CONSTRUCTOR
  *************************************************************************/
  constructor(private studentService: StudentsService) {
  }

  /*************************************************************************
   *   EVENTS
  *************************************************************************/
  ngOnInit() {
    log.data('this.jobDescription', this.jobDescription);
    if (this.jobDescription === undefined) {
      this.checkJobdescEmptyMessage = false;
      let user = localStorage.getItem('loginuser');
      if (user !== undefined && user) {
        user = JSON.parse(user);
        const emailId = (<any>user).email;
        // this.studId = '5a2b8445b9b8b11f77496797'; //this.s
        this.studentService.getStudentIdByEmail(emailId)
          .subscribe(student => {
            log.data('email res', student);
            this.jobDescriptionByEmail = new StudentJobDescription(
              student.data._id,
              student.data.jobDescriptionId.status,
              student.data.jobDescriptionId._id,
              student.data.jobDescriptionId.sendNotification
            );
            log.data('email this.jobDescriptionByEmail', this.jobDescriptionByEmail);
            // this.checkStatus(this.jobDescriptionByEmail.notification_status);
          })
        console.log(user);
      }
    }else{
      this.checkJobdescEmptyMessage = true;
    }
  }

  ngOnChanges() {
    console.log(this.jobDescription)
    if (this.jobDescription) {
      this.sentToStudent = false;
      this.sentToMentor = false;
      this.validateByMentor = false;
      this.validateByAcademic = false;

      log.info('this.jobDescription', this.jobDescription);
      // this.checkStatus(this.jobDescription.notification_status, );
    }
    log.data('this.jobDescription', this.jobDescription);
  }

  /*************************************************************************
   *    METHODS
  *************************************************************************/
  checkStatus(notify) {
    this.sentToStudent = false;
    this.sentToMentor = false;
    this.validateByMentor = false;
    this.validateByAcademic = false;
    switch (notify.status) {
      case 'sent_to_student':
        this.sentToStudent = notify.sendNotification;
        log.info("sent_to_student", this.sentToStudent);
        break;

      case 'sent_to_mentor':
        log.info("sent_to_mentor");
        this.sentToStudent = notify.sendNotification;
        this.sentToMentor = true;
        break;

      case 'validated_by_mentor':
        log.info("validated_by_mentor");
        this.sentToStudent = notify.sendNotification;
        this.sentToMentor = true;
        this.validateByMentor = true;
        break;

      case 'validated_by_acad_staff':
        log.info("validated_by_acad_staff ");
        this.sentToStudent = notify.sendNotification;
        this.sentToMentor = true;
        this.validateByMentor = true;
        this.validateByAcademic = true;
        this.emitStatustoDetails.emit('validated_by_acad_staff');
        break;
      case 'expedite_by_acad_staff':
        log.info("expedite_by_acad_staff ");
        this.sentToStudent = notify.sendNotification;
        this.sentToMentor = true;
        this.validateByMentor = false;
        this.validateByAcademic = true;
        this.emitStatustoDetails.emit('expedite_by_acad_staff');
        break;
        case 'expedite_by_acad_staff_student':
        log.info("expedite_by_acad_staff_student");
        this.sentToStudent = notify.sendNotification;
        this.sentToMentor = false;
        this.validateByMentor = false;
        this.validateByAcademic = true;
        this.emitStatustoDetails.emit('expedite_by_acad_staff_student');
        break;
      default:
        log.info('Notification Status must me Intiial', notify);
        this.sentToStudent = false;
        this.sentToMentor = false;
        this.validateByMentor = false;
        this.validateByAcademic = false;
    }
  }
}
