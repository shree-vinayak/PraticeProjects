import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rajasthan',
  templateUrl: './rajasthan.component.html',
  styleUrls: ['./rajasthan.component.scss']
})
export class RajasthanComponent implements OnInit {

  obj = {
    "path": "../../../assets/images/rajsthan2.jpeg",
    "message": "Welcome to Rajasthan Tourism",
    "warning": "jao kabhi Rajsthan mein",
    "tourism": "rj"
  };
  constructor() { }

  ngOnInit() {
  }

}
