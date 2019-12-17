import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gujarat',
  templateUrl: './gujarat.component.html',
  styleUrls: ['./gujarat.component.scss']
})
export class GujaratComponent implements OnInit {

  obj = {
    "path": "../../../assets/images/gujrat2.png",
    "message": "Welcome to Gujrat Tourism",
    "warning": "jao kabhi gujrat mein",
    "tourism": "gr"
  };
  constructor() { }

  ngOnInit() {
  }

}
