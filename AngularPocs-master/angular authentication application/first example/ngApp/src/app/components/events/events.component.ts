import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/service/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events = [];

  constructor(private _eventService: EventService) { }

  ngOnInit() {
    this._eventService.getEvents().subscribe(
      res => this.events = res,
      error => console.log(error)
    )
  }

}