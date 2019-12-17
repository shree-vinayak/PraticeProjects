import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Required for Logging on console
import { Log } from "ng2-logger";
import { Student } from 'app/models/student.model';
const log = Log.create("StudentMentorEvalComponent");
log.color = "green";

@Component({
  selector: 'app-mentor-eval',
  templateUrl: './student-mentor-eval.component.html',
  styleUrls: ['./student-mentor-eval.component.css']
})


export class StudentMentorEvalComponent implements OnInit {

  /*************************************************************************
   *   VARIABLES
  *************************************************************************/
  sentToMentor = false;
  validatedByMentor = false;
  validatedByAcademic = false;
  studentMentorEvalID;
  @Input() mentorevaluation: StudentMentorEvalComponent;
  @Output() emitStatustoDetails: EventEmitter<string> = new EventEmitter();
  @Input() student;
  constructor() {
    log.info('Constructor Invoked');
  }

  ngOnInit() {
    console.log(this.mentorevaluation);
    this.setMentorEvaluationStatus();
  }
  ngOnChanges() {
    console.log('On change status');
    console.log('student', this.student);
    this.setMentorEvaluationStatus();
  }
  setMentorEvaluationStatus() {
    console.log('this.student--------------------->');
    console.log(this.student);
    this.studentMentorEvalID = this.student;
    if (this.student.mentorEvaluationId !== 'undefined' && this.student.mentorEvaluationId) {
      let checkstatus = this.student.mentorEvaluationId.mentorEvaluationStatus;
      this.sentToMentor = false;
      this.validatedByMentor = false;
      this.validatedByAcademic = false;
      if (checkstatus === 'sentToMentor') {
        this.sentToMentor = true;
      } else if (checkstatus === 'filledByMentor') {
        this.sentToMentor = true;
        this.validatedByMentor = true;
      } else if (checkstatus === 'validatedByAcadStaff') {
        this.sentToMentor = true;
        this.validatedByMentor = true;
        this.validatedByAcademic = true;
      } else if ( checkstatus === 'expeditedByAcadStaff' ) {
        this.sentToMentor = true;
        this.validatedByMentor = true;
        this.validatedByAcademic = true;
      }
    } else {
      this.sentToMentor = false;
      this.validatedByMentor = false;
      this.validatedByAcademic = false;
    }

    console.log('this.sentToMentor------------------------------>');
    console.log(this.sentToMentor);
    console.log(this.validatedByMentor);
    console.log(this.validatedByAcademic);
    console.log('this.sentToMentor------------------------------>');

  }
  updateStudentDetails(event) {
    console.log('updateStudentDetails----------->Student mentor eval'+ event);
    this.emitStatustoDetails.emit(event);
   }
}
