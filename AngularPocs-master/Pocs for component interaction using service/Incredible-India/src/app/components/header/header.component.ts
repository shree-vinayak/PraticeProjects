import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/interaction.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  header: string = "header";
  path: any = "";
  message: any = "";
  warning: any = "";
  tourism: any = "";

  constructor(private _interactionService: InteractionService) { }

  ngOnInit() {
    this._interactionService.teacherMessage$.subscribe(
      (obj: any) => {
        this.path = obj.path;
        this.message = obj.message;
        this.warning = obj.warning;
        this.tourism = obj.tourism;
        this.header = "asdfasf";
        console.log(this.path);
        console.log(this.message);
        console.log(this.warning);
        console.log(this.tourism);
      });
  }

}
