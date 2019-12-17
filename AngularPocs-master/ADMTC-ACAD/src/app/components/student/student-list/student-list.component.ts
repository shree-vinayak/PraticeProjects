import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { from } from 'rxjs/observable/from';

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('StudentListComponent');
log.color = 'orange';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, OnChanges {

  /*************************************************************************
   *   VARIABLES
  *************************************************************************/
  @Input() studentListEmit: any;
  @Output() studentSelected: EventEmitter<any> = new EventEmitter();
  studentList: any;
  SchoolListSearchItem: any;
  index: number;

  /*************************************************************************
   *   CONSTRUCTOR
  *************************************************************************/
  constructor() {
    log.info('Constructor Invoked');
  }

  /*************************************************************************
   *   EVENTS METHODS
  *************************************************************************/
  ngOnInit() {
    this.studentList = this.studentListEmit;
  }

  ngOnChanges(studentListEmit) {
    this.studentList = this.studentListEmit;
  }

  emitStudent(student) {
    this.studentSelected.emit(student);
  }

  popStudent(event) {
    console.log('popStudent');
    for (let i = 0; i < this.studentList.length; i++) {
      if (this.studentList[i]._id = event._id) {
        this.studentList.pop(i);
      }
    }

  }

  /*************************************************************************
   *   METHODS
  *************************************************************************/
  updateStudent(event) {
    console.log(event);
  }
  searchSchoolList(event) {

  }

}
