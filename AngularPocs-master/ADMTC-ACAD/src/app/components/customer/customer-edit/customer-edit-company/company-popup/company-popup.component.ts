import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-company-popup',
  templateUrl: './company-popup.component.html',
  styleUrls: ['./company-popup.component.scss']
})
export class CompanyPopupComponent implements OnInit {

  constructor(
  	public dialogRef: MdDialogRef<CompanyPopupComponent>
   	) {  
  	

  }

  ngOnInit() {
  }

 Cancel() {
    this.dialogRef.close();
  }

}
