import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSlideToggleChange } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { UserService } from '../../../../services/users.service';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { ExpertiseService } from '../../../../services/expertise.service';

declare var swal: any;

@Component({
  selector: 'add-expertise-dialog',
  templateUrl: './add-expertise-dialog.component.html',
  styleUrls: ['./add-expertise-dialog.componet.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class AddExpertiseDialogComponent implements OnInit {
  form: FormGroup;
  public RNCPtitleId: string;
  public modify: boolean;
  public expertiseMarkPointStatus;
  public specializations = [];
  public selectedSpecialization = '';

  title = 'Add Expertise';
  expertise;
  selectedRNCP;
  formSubmit = false;
  expertiseMaxPoints;

  constructor(private dialogRef: MdDialogRef<AddExpertiseDialogComponent>,
    private translate: TranslateService, private service: UserService,
    private appService: RNCPTitlesService,
    private fb: FormBuilder,
    private expertiseService: ExpertiseService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      maxPoints: new FormControl(this.expertiseMaxPoints ? this.expertiseMaxPoints : 0),
      minScore: new FormControl(this.expertise ? this.expertise.minscore : ''),
      countForTitleFinalScore: new FormControl(this.expertise ? this.expertise.countForTitleFinalScore : true),
      blockOfExperise: new FormControl(this.expertise ? this.expertise.blockOfExperise : '', Validators.required),
      description: new FormControl(this.expertise ? this.expertise.description : '', Validators.required),
      rncpTitle: new FormControl(this.selectedRNCP ? this.selectedRNCP : '', Validators.required),
      id: new FormControl(this.expertise ? this.expertise._id : ''),
      isSpecialization: new FormControl(this.expertise.isSpecialization ? this.expertise.isSpecialization : false)
    });

    if (!this.expertise.hasOwnProperty('countForTitleFinalScore')) {
     // this.expertiseMarkPointStatus = true;
      this.form.controls.countForTitleFinalScore.setValue(true);
    }
  }

  getSelectedSpecializationObj() {
    const selectedSpecObj = this.selectedSpecialization ? this.specializations.find(s => this.selectedSpecialization === s._id) : null;
    if (selectedSpecObj) {
      return { _id: selectedSpecObj._id, name: selectedSpecObj.name};
    } else {
      return null;
    }
  }

  selectSpecialization(selectedSpecializationId) {
    this.selectedSpecialization = selectedSpecializationId;
  }


  toggleFinalScore(event: MdSlideToggleChange) {
    this.form.controls.countForTitleFinalScore.setValue(event.checked);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  handleKeyboardEvents(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.cancel();
    }
  }

  checkMaxLength(event, name) {
    console.log(event.target.value);
    if (event.target.value) {
      console.log(event.target.value);
      console.log(event.target.value.toString().length);
      if (event.target.value.toString().length > 2) {
        this.form.controls[name].setValue('');
      }
    }
  }

  continue() {
    this.formSubmit = true;
    console.log(this.form);
    if (this.form.valid) {
      const dataPost = this.form.value;
      if (dataPost.maxPoints == null) {
        dataPost.maxPoints = 0;
      }

      dataPost.minScore = dataPost.minScore.toString();
      dataPost.specialization = this.getSelectedSpecializationObj();
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
      //       allowEscapeKey:true,
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
