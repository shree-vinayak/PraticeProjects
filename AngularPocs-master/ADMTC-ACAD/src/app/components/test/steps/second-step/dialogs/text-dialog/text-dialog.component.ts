import { Component, OnInit } from '@angular/core';
import * as Quill from 'quill';
// import * as renderer from 'quilljs-renderer';
import { MdDialogRef } from '@angular/material';
// import * as transformer from 'delta-transform-html';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
// renderer.loadFormat('html');
// let Document = renderer.Document;
@Component({
  selector: 'app-text-dialog',
  templateUrl: './text-dialog.component.html',
  styleUrls: ['./text-dialog.component.scss']
})
export class TextDialogComponent implements OnInit {

  public textValue: string;
  public form: FormGroup;
  constructor(public dialogRef: MdDialogRef <TextDialogComponent> ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'editor': new FormControl(this.textValue)
    });
  }

  register(){
    const value = this.form.value.editor;
    console.log(value);
    this.dialogRef.close(value);
  }

  closeDialog(){
    this.dialogRef.close(this.textValue);
  }

}
