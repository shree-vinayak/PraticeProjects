import { Component } from '@angular/core';

import {MatDialog, MatDialogConfig} from "@angular/material";
import { CourseDialogComponent } from './course-dialog/course-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DialogAndPopup';

  constructor(private dialog: MatDialog) {}


  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners'
  };

    this.dialog.open(CourseDialogComponent, dialogConfig);
}
}
