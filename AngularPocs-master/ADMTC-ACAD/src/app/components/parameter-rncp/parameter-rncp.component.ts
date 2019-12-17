import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-parameter-rncp',
  templateUrl: './parameter-rncp.component.html',
  styleUrls: ['./parameter-rncp.component.scss']
})
export class ParameterRncpComponent implements OnInit {
  activatedTag: string;
  constructor(private router: Router, ) { }

  ngOnInit() {
    this.activatedTag = 'activation';
  }

  changeRoute() {
    const name = '/tools/parameter-rncp/' + this.activatedTag;
    this.router.navigate([name]);
  }

}
