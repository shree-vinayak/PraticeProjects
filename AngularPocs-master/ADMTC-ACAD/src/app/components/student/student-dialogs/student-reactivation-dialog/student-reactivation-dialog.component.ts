import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { StudentsService } from '../../../../services/students.service';

// required for logging
import { Log } from 'ng2-logger';
const log = Log.create('StudentReactivationDialogComponent');
log.color = 'blue';

declare var swal: any;
@Component({
  selector: 'app-student-reactivation-dialog',
  templateUrl: './student-reactivation-dialog.component.html',
  styleUrls: ['./student-reactivation-dialog.component.scss']
})
export class StudentReactivationDialogComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  public studentReactivateForm: FormGroup;
  studentDetails;

  /*************************************************************************
   *   CONSTRUCTOR
  *************************************************************************/
  constructor(
    private dialogRef: MdDialogRef < StudentReactivationDialogComponent > ,
    @Inject(MD_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private studentService: StudentsService) { }

  /*************************************************************************
   *   EVENTS
  *************************************************************************/
  ngOnInit() {
    this.studentReactivateForm = new FormGroup({
      reasonForReactivation: new FormControl('', [Validators.required]),
      dateOfReactivation: new FormControl('', [Validators.required])
    });
  }

  /*************************************************************************
   *   METHODS
  *************************************************************************/
  reactivateStudent() {
    let self = this;
    const reasonObject = this.studentReactivateForm.value;
    reasonObject.lang = this.translate.currentLang.toUpperCase();
    this.studentService.reactivateStudent(this.studentDetails._id, reasonObject)
      .subscribe((response) => {
          log.data('this.studentService.reactivateStudent deleteStudent', response );
          if(response.data) {
            this.cancelReactivation(true);
              swal({
                  title:self.translate.instant('STUDENT.MESSAGE.SUCCESS'),
                  // html: self.translate.instant("STUDENT.MESSAGE.DEACTIVATEDSUCCESS.TEXT",{
                  //   LName: this.studentDetails.lastName,
                  //   FName: this.studentDetails.firstName
                  // }),
                  allowEscapeKey:true,
                  type:'success',
                  confirmButtonText: self.translate.instant('JOBDESCRIPTIONFORM.S6.OK')
                })
          } else {
            {
                swal({
                    type:'warning',
                    title:self.translate.instant('STUDENT.MESSAGE.DEACTIVATEDFAIL.TITLE'),
                    html: self.translate.instant('STUDENT.MESSAGE.DEACTIVATEDFAIL.TEXT'),
                    allowEscapeKey:true,
                    confirmButtonText: self.translate.instant('IDEAS.IDEASDELETE.UNDERSTOOD')
                  })
            }
          }
      });
  }

  cancelReactivation(state) {
    this.dialogRef.close(state);
  }
}
