import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent implements OnInit {
  @Input() object: any;
  constructor() { }

  ngOnInit() {
    console.log('Object: ', this.object);
  }

}
