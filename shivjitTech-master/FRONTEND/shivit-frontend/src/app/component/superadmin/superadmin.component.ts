import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent implements OnInit {

  name: any = "";
  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this.onload();
  }

  onload() {
    if (this._route.snapshot.queryParamMap.has('name')) {
      this.name = this._route.snapshot.queryParamMap.get('name')
    }
  }

}
