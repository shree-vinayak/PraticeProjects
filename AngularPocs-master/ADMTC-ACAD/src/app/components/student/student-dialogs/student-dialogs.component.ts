import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { StudentsService } from '../../../services/students.service';

// required for logging
import { Log } from "ng2-logger";
const log = Log.create("StudentDialogComponent");
log.color = "blue";

declare var swal: any;

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialogs.component.html',
  styleUrls: ['./student-dialogs.component.scss']
})

export class StudentDialogComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
    public studentDeleteForm: FormGroup;
    studentDetails;

  /*************************************************************************
   *   CONSTRUCTOR
  *************************************************************************/
  constructor(
    private dialogRef: MdDialogRef < StudentDialogComponent > ,
    @Inject(MD_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private studentService: StudentsService) { }

  /*************************************************************************
   *   EVENTS
  *************************************************************************/
  ngOnInit() {
    this.studentDeleteForm = new FormGroup({
        reasonForResignation: new FormControl('', [Validators.required]),
        dateOfResignation: new FormControl('', [Validators.required])
      });
  }

  
  /*************************************************************************
   *   METHODS
   *************************************************************************/
  deleteStudent(){
    let self = this;
    const reasonObject = this.studentDeleteForm.value;
    reasonObject.lang = this.translate.currentLang.toUpperCase();
    this.studentService.deactivateStudent(this.studentDetails._id, reasonObject)
      .subscribe((response) => {
          log.data('this.studentService.deactivateStudent deleteStudent', response );
          if(response.data && (response.data._id === this.studentDetails._id)) {
            this.dialogRef.close(true);
              swal({
                  title:self.translate.instant("STUDENT.MESSAGE.DEACTIVATEDSUCCESS.TITLE"),
                  html: self.translate.instant("STUDENT.MESSAGE.DEACTIVATEDSUCCESS.TEXT",{
                    LName: this.studentDetails.lastName,
                    FName: this.studentDetails.firstName
                  }),
                  allowEscapeKey:true,
                  type:"success",
                  confirmButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S6.OK')
                })
          } else {
            {
                swal({
                    type:"warning",
                    title:self.translate.instant("STUDENT.MESSAGE.DEACTIVATEDFAIL.TITLE"),
                    html: self.translate.instant("STUDENT.MESSAGE.DEACTIVATEDFAIL.TEXT"),
                    allowEscapeKey:true,
                    confirmButtonText: self.translate.instant('IDEAS.IDEASDELETE.UNDERSTOOD')
                  })
            } 
          }
      })
  }

  cancelDelete() {
    this.dialogRef.close(false);
  }
}
