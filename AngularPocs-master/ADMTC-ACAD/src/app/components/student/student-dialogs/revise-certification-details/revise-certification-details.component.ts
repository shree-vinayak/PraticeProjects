import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { MdDialogRef } from '@angular/material';
import { StudentsService } from '../../../../services/students.service';
declare var swal: any;

// required for logging
import { Log } from 'ng2-logger';
import { FormGroup, FormControl, Validators } from '@angular/forms';
const log = Log.create('ReviseCertificationDetailsComponent');
log.color = 'blue';

@Component({
  selector: 'app-revise-certification-details',
  templateUrl: './revise-certification-details.component.html',
  styleUrls: ['./revise-certification-details.component.scss']
})
export class ReviseCertificationDetailsComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  studentId: string;
  revisionForm: FormGroup;
  /*************************************************************************
   *   CONSTRUCTOR
  *************************************************************************/
  constructor(
    private dialogRef: MdDialogRef <ReviseCertificationDetailsComponent> ,
    private translate: TranslateService,
    private studentService: StudentsService) {
        log.info('Constructor Invoked');
     }

  /*************************************************************************
   *   EVENTS
  *************************************************************************/
  ngOnInit() {
    this.revisionForm = new FormGroup({
      description: new FormControl('', [Validators.required])
    });
  }

  /*************************************************************************
   *   METHODS
   *************************************************************************/

  sendRevisionRequest() {
    if ( this.revisionForm.valid ) {
      log.info('sendRevisionRequest Invoked');
      const params = {
        studentId: this.studentId,
        taskSummary: this.revisionForm.get('description').value,
        lang: this.translate.currentLang.toLowerCase()
    };
    this.studentService.sendRevisionRequest(params).subscribe(
      (response) => {
        if (response.data && response.data._id ) {
          log.data('this.studentService.sendRevisionRequest response', response);
          swal({
            type: 'success',
            title: 'Bravo!',
            html: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S3.TEXT'),
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('FINAL_TRANSCRIPT.UNDERSTOOD'),
          });
          this.dialogRef.close(true);
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
