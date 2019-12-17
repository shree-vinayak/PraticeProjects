import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mp',
  templateUrl: './mp.component.html',
  styleUrls: ['./mp.component.scss']
})
export class MpComponent implements OnInit {

  obj = {
    "path": "../../../assets/images/mp2.jpeg",
    "message": "Welcome to madhya pradesh",
    "warning": "jao kabhi morena mein",
    "tourism": "mp"
  };
  constructor() { }

  ngOnInit() {
  }

}
