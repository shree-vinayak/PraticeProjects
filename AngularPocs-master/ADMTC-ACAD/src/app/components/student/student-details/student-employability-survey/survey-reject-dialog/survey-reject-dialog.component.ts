import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../../../../../node_modules/@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '../../../../../../../node_modules/@angular/material';
import { TranslateService } from '../../../../../../../node_modules/ng2-translate';
import { StudentsService } from '../../../../../services';
import { EmployabilitySurveyService } from '../../../../../services/employability-survey.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-survey-reject-dialog',
  templateUrl: './survey-reject-dialog.component.html',
  styleUrls: ['./survey-reject-dialog.component.scss']
})

export class SurveyRejectDialogComponent implements OnInit {
  survey:any;
  surveyId:any;
  /*************************************************************************
 *   VARIABLES
 *************************************************************************/
  public surveyRejectionForm: FormGroup;
  studentDetails;

  /*************************************************************************
   *   CONSTRUCTOR
  *************************************************************************/
  constructor(
    private dialogRef: MdDialogRef<SurveyRejectDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private empSurveyService: EmployabilitySurveyService) { }

  /*************************************************************************
   *   EVENTS
  *************************************************************************/
  ngOnInit() {
    this.surveyRejectionForm = new FormGroup({
      reasonForRejection: new FormControl('', [Validators.required]),
      dateOfRejection: new FormControl('', [Validators.required])
    });
    this.empSurveyService.getSurvey(this.surveyId)
    .subscribe(res=>{
      this.survey = res;
    })
  }

  rejectStudent(){
    let body = {
      date: this.surveyRejectionForm.value.dateOfRejection,
      reason: this.surveyRejectionForm.value.reasonForRejection
    }
    this.survey.rejectionDetails.push(body)
    this.survey.surveyStatus = 'rejectedByAcadDir';
    this.empSurveyService.updateSurvey(this.surveyId, this.survey)
    .subscribe(res=>{
      swal({
        type: 'success',
        title: this.translate.instant('SUCCESS'),
        text: this.translate.instant('EMPLOYABILITY_SURVEY.REJECT_SWAL.S1B.TEXT'),
        showCancelButton: false,
        confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.REJECT_SWAL.S1B.OK'),
      }).then(()=>{
        this.dialogRef.close({ reject: true });
      })
    })
    
  }

validateStudent(){
  
  }

cancelDelete(){
  this.dialogRef.close({ reject : false});
}
}
