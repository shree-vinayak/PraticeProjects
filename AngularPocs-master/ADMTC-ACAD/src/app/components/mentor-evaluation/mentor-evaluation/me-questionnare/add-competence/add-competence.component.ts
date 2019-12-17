import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-competence',
  templateUrl: './add-competence.component.html',
  styleUrls: ['./add-competence.component.scss']
})
export class AddCompetenceComponent implements OnInit {
  form: FormGroup;
  competence;
  formSubmit = false;
  constructor(
    private dialogRef: MdDialogRef<AddCompetenceComponent>,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      competenceName: new FormControl(this.competence ? this.competence.competenceName : '', Validators.required),
      id: new FormControl(this.competence ? this.competence._id : ''),
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  continue() {
    this.formSubmit = true;
    console.log(this.form);
    if (this.form.valid) {
      const dataPost = this.form.value;
      this.dialogRef.close(dataPost);
    }
  }
}
