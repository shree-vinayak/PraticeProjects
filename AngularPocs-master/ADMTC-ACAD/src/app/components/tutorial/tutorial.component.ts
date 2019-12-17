import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  template: `
  <router-outlet></router-outlet>
  `
})
export class TutorialComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
