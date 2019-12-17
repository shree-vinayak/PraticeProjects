import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,

}  from '@angular/material';

const MaterialComponents=[
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
];

@NgModule({

  imports: [MaterialComponents],
  exports:[MaterialComponents]
})
export class MaterialModule { }
