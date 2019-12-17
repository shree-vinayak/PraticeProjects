import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MdSelect } from '@angular/material';
import { ExpertiseService } from '../../../services';
import { TranslateService } from 'ng2-translate';
import swal from 'sweetalert2';
import { AppSettings } from '../../../app-settings';

@Component({
  selector: 'app-duplicate-condition-dialog',
  templateUrl: './duplicate-condition-dialog.component.html',
  styleUrls: ['./duplicate-condition-dialog.component.scss']
})
export class DuplicateConditionDialogComponent implements OnInit {
  rncpList = [];
  classList = [];
  showRNCPList = true;
  // selectedRNCP = '';
  cloneToClass = '';
  cloneFromClass = '';
  cloneFromClassName = '';
  cloneToClassName = '';
  duplicateFromExistingClass = false;
  @ViewChild('selectedClass') selectedClass: MdSelect;
  constructor(
    public dialogRef: MdDialogRef<DuplicateConditionDialogComponent>,
    public expertiseService: ExpertiseService,
    public translate: TranslateService
  ) {}

  ngOnInit() {}

  closeDialog(data) {
    this.dialogRef.close(data);
  }

  selectRNCP(data) {
    console.log(data);
    if (data && data._id) {
      // this.selectedRNCP = data._id;
      this.classList = [...data.classes.filter(c => c._id !== this.cloneToClass)];
      this.selectedClass.writeValue('');
    }
  }

  selectClass (selectedClass) {
    this.cloneFromClass = selectedClass._id;
    this.cloneFromClassName = selectedClass.name;
  }

  duplicateCondition() {
    let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
    swal({
      title: this.translate.instant('PARAMETERS-RNCP.CONDITION_TAB_S2.TITLE', { className: this.cloneFromClassName }),
      text: this.translate.instant('PARAMETERS-RNCP.CONDITION_TAB_S2.TEXT'),
      type: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PARAMETERS-RNCP.CONDITION_TAB_S2.SUCCESS_BUTTON_IN', { timer: timeDisabledinSec }),
      cancelButtonText: this.translate.instant('PARAMETERS-RNCP.CONDITION_TAB_S2.CANCEL'),
      onOpen: () => {
        swal.disableConfirmButton();
        const confirmButtonRef = swal.getConfirmButton();

        // TimerLoop for derementing timeDisabledinSec
        const timerLoop = setInterval(() => {
          timeDisabledinSec -= 1;
          confirmButtonRef.innerText = this.translate.instant('PARAMETERS-RNCP.CONDITION_TAB_S2.SUCCESS_BUTTON_IN',
          { timer: timeDisabledinSec });
        }, 1000
        );

        // Resetting timerLoop to stop after required time of execution
        setTimeout(() => {
          confirmButtonRef.innerText = this.translate.instant('PARAMETERS-RNCP.CONDITION_TAB_S2.SUCCESS_BUTTON');
          swal.enableConfirmButton();
          clearTimeout(timerLoop);
        }, (AppSettings.global.timeDisabledinSecForSwal * 1000));
      }
    }).then( (isConfirm) => {
      this.expertiseService.duplicateCondition(this.cloneFromClass, this.cloneToClass).subscribe(data => {
        console.log(data);
        if (data.data && data.data.length > 0) {
          swal({
            title: this.translate.instant('PARAMETERS-RNCP.CONDITION_TAB_S3.TITLE'),
            html: this.translate.instant('PARAMETERS-RNCP.CONDITION_TAB_S3.TEXT', { classToName: this.cloneToClassName }),
            type: 'success',
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: this.translate.instant('PARAMETERS-RNCP.CONDITION_TAB_S3.SUCCESS_BUTTON'),
          });
          this.dialogRef.close(data.data);
        }
      });
    });

  }

}
