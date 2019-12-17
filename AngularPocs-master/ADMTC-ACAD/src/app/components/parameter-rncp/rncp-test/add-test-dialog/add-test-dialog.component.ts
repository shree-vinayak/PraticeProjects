import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSlideToggleChange} from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { UserService } from '../../../../services/users.service';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { ExpertiseService } from '../../../../services/expertise.service';

declare var swal: any;

@Component({
  selector: 'add-test-dialog',
  templateUrl: './add-test-dialog.component.html',
  styleUrls: ['./add-test-dialog.componet.scss']

})
export class AddTestDialogComponent implements OnInit {
  form: FormGroup;
  public RNCPtitleId: string;
  public modify: boolean;
  title = 'Add Expertise';
  test;
  selectedRNCP;
  TestType;
  formSubmit = false;

  constructor(private dialogRef: MdDialogRef<AddTestDialogComponent>,
              private translate: TranslateService, private service: UserService,
              private appService: RNCPTitlesService,
              private fb: FormBuilder,
              private expertiseService: ExpertiseService, ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      weight: new FormControl(this.test ? this.test.weight : '', Validators.required),
      type: new FormControl(this.test ? this.test.type : '', Validators.required),
      evaluation: new FormControl(this.test ? this.test.evaluation : '', Validators.required),
      id: new FormControl(this.test ? this.test.id : '')
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  continue() {
    this.formSubmit = true;
    console.log(this.form);
     if (this.form.valid) {
      let dataPost = this.form.value;
      console.log(dataPost);
      this.dialogRef.close(dataPost);
      // this.expertiseService.createExpertise(dataPost).subscribe(value => {
      //   console.log('Expertise Created');
      //   if (value['data']) {
      //     swal({
      //       title: 'Success',
      //       text: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.addExpertiseSuccess'),
      //       type: 'success',
      //       confirmButtonText: 'OK'
      //     }).then(function () {
      //       this.dialogRef.close(value['data']);
      //     }.bind(this));
      //   } else {
      //     swal(
      //       'Attention',
      //       this.translate.instant('PARAMETERS-RNCP.EXPERTISE.addExpertiseFail'),
      //       'warning'
      //     );
      //   }
      // });
     }
  }
}
