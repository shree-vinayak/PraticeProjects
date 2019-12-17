import { Component, OnInit } from '@angular/core';
import { version } from 'moment';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css']
})

export class VersionComponent implements OnInit {

  public AppVersion = '';

  constructor() { }

  ngOnInit() {
    const packages = require('../../../../package.json');
    this.AppVersion = packages.version;
  }

}
