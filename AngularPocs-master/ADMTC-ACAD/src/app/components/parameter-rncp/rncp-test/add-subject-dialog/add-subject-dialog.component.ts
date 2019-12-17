import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA,MdSlideToggleChange} from '@angular/material';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { UserService } from '../../../../services/users.service';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { SubjectService } from '../../../../services/subject.service';

declare var swal: any;

@Component({
  selector: 'add-subject-dialog',
  templateUrl: './add-subject-dialog.component.html',
  styleUrls: ['./add-subject-dialog.componet.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class AddSubjectDialogComponent implements OnInit {
  form: FormGroup;
  public RNCPtitleId: string;
  public modify: boolean;
  title = 'Add Subject';
  subject;
  selectedRNCP;
  expertise;
  formSubmit = false;

  constructor(private dialogRef: MdDialogRef<AddSubjectDialogComponent>,
              private translate: TranslateService, private service: UserService,
              private appService: RNCPTitlesService,
              private fb: FormBuilder,
              private subjectService: SubjectService,) {
  }

  ngOnInit() {

    this.form = new FormGroup({
      minimumScoreForCertification: new FormControl(this.subject ? this.subject.minimumScoreForCertification : '',Validators.required),
      coefficient: new FormControl(this.subject && this.subject.coefficient ? this.subject.coefficient : 1 ,Validators.required),
      //countForTitleFinalScore: new FormControl(this.subject ? this.subject.coefficient : '',Validators.required),
      subjectName: new FormControl(this.subject ? this.subject.subjectName : '',Validators.required),
      subjectTest:this.fb.array([])
    });
  }


  toggleFinalScore(event: MdSlideToggleChange) {
    this.form.controls.countForTitleFinalScore.setValue(event.checked);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  handleKeyboardEvents(event: KeyboardEvent) {
    if (event.keyCode == 27) {
      this.cancel();
    }
  }

  checkMaxLength(event,name){
    console.log(event.target.value);
    if(event.target.value){
      console.log(event.target.value);
      console.log(event.target.value.toString().length);
      if(event.target.value.toString().length > 2){
        this.form.controls[name].setValue('');
      }
    }
  }

  continue() {
    this.formSubmit = true;
    console.log(this.form.value);
     if (this.form.valid) {
      let dataPost = this.form.value;
      dataPost.rncpTitle= this.selectedRNCP;
      dataPost.expertise= this.expertise;
      dataPost.coefficient= dataPost.coefficient.toString();
      dataPost.minimumScoreForCertification= dataPost.minimumScoreForCertification.toString();
      console.log(dataPost);
      this.dialogRef.close(dataPost);

      // this.subjectService.createSubject(dataPost).subscribe(value => {
      //   console.log('Subject Created');
      //   if (value['data']) {
      //     swal({
      //       title: 'Success',
      //       text: this.translate.instant('PARAMETERS-RNCP.TEST.addSubjectSuccess'),
      //       type: 'success',
      //       confirmButtonText: 'OK'
      //     }).then(function () {
      //       this.dialogRef.close(value['data']);
      //     }.bind(this));
      //   } else {
      //     swal(
      //       'Attention',
      //       this.translate.instant('PARAMETERS-RNCP.TEST.addSubjectFail'),
      //       'warning'
      //     );
      //   }
      // });
     }
  }
}
