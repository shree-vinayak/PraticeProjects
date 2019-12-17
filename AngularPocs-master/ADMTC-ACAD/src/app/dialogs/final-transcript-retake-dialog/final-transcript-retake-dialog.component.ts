import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { UtilityService } from '../../services/utility.service';
import { Router } from '@angular/router'
import { FinalTranscriptService } from '../../components/settings/settingSteps/final-transcript-dialog/final-transcript.service';

import { Log } from "ng2-logger";
const log = Log.create('FinalTranscriptRetakeDialogComponent');
log.color = 'gray';

declare var swal: any;

@Component({
  selector: 'app-final-transcript-retake-dialog',
  templateUrl: './final-transcript-retake-dialog.component.html',
  styleUrls: ['./final-transcript-retake-dialog.component.scss']
})
export class FinalTranscriptRetakeDialogComponent implements OnInit {

  constructor(private dialogRef: MdDialogRef<FinalTranscriptRetakeDialogComponent>,
    private translate: TranslateService,
    private utilityService: UtilityService,
    private router: Router,
    private finalTranscriptService: FinalTranscriptService) { }

  taskDetails;
  studentList;

  ngOnInit() {
    log.data('ngOnInit taskDetails', this.taskDetails);
    this.getStudentsFinalTranscriptRetake();
  }

  computeCivility(gender: string) {
    return this.utilityService.computeCivility(gender, this.translate.currentLang.toLowerCase());
  }

  closeDialog(status) {
    this.dialogRef.close(status);
  }

  completeRetakeTestTask() {
    if (this.taskDetails.rncp && this.taskDetails.test && this.taskDetails.classId) {
      this.router.navigate(['school', this.taskDetails.test.school, 'edit', 0, {goto: 'finalCertification'}],
      { queryParams: { rncpId: this.taskDetails.rncp._id, classId: this.taskDetails.classId._id } });
      this.closeDialog(false);
    }
  }

  getStudentsFinalTranscriptRetake() {
    if (this.taskDetails.rncp && this.taskDetails.test && this.taskDetails.classId) {
      this.finalTranscriptService.getStudentsFinalTranscriptRetake(this.taskDetails.rncp._id, this.taskDetails.test.school,
        this.taskDetails.classId._id).subscribe(
          (response) => {
            if ( response.status == 'OK' && response.data.length) {
              this.studentList = response.data;
            }
          }
        )
    }
  }
}
