import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
        <h3>{{ title }}</h3>
        <h6 innerHTML="{{message}}"></h6><br><br>
        <button type="button" color="green" md-raised-button
            (click)="dialogRef.close(true)">OK</button>
        <button type="button" md-button
            (click)="dialogRef.close()">Cancel</button>
    `,
})
export class ConfirmDialog {

  public title: string;
  public message: string;

  constructor(public dialogRef: MdDialogRef<ConfirmDialog>) {

  }
}
