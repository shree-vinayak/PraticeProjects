import { Component, OnInit } from '@angular/core';
import { InteractionService } from '../../interaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnInit {

  path: any = "";
  message: any = "";
  warning: any = "";
  tourism: any;

  constructor(private _interactionService: InteractionService, private router: Router) {
    console.log('upload');
    this._interactionService.teacherMessage$.subscribe(
      (obj: any) => {
        this.path = obj.path;
        this.message = obj.message;
        this.warning = obj.warning;
        this.tourism = obj.tourism;
        console.log(this.path);
        console.log(this.message);
        console.log(this.warning);
        console.log(this.tourism);

      });
  }

  ngOnInit() {

  }

}
