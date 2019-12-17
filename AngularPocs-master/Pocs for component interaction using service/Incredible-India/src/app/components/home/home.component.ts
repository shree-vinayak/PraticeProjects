import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/interaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _interactionService: InteractionService, private router: Router) { }

  ngOnInit() {
  }

  mpTourism() {
    let obj = {
      "path": "../../../assets/images/mp2.jpeg",
      "message": "Welcome to madhya pradesh",
      "warning": "jao kabhi morena mein",
      "tourism": "mp"
    };
    this._interactionService.sendMessage(obj);
    this.router.navigate([`/madhya`]);
  }

  gujratTourism() {
    let obj = {
      "path": "../../../assets/images/gujrat2.png",
      "message": "Welcome to Gujrat Tourism",
      "warning": "jao kabhi gujrat mein",
      "tourism": "gr"
    };
    this._interactionService.sendMessage(obj);
    this.router.navigate([`/gujrat`]);
  }

  rajsthanTourism() {
    let obj = {
      "path": "../../../assets/images/rajsthan2.jpeg",
      "message": "Welcome to Rajasthan Tourism",
      "warning": "jao kabhi Rajsthan mein",
      "tourism": "rj"
    };
    this._interactionService.sendMessage(obj);
    this.router.navigate([`/rajasthan`]);
  }

}
