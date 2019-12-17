import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  mpTourism() {
    this.router.navigate([`/mp`]);
  }

  gujratTourism() {
    this.router.navigate([`/gujarat`]);
  }

  rajsthanTourism() {
    this.router.navigate([`/rajasthan`]);
  }

}
