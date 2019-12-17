import { Component } from '@angular/core';
// import { mapboxgl } from 'mapbox-gl/src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  lat: number = 51.678418;
  lng: number = 7.809007;
  title = 'maplocation';
  paint = { 'background-color': 'green', 'background-opacity': 0.1 };
  constructor() {
    // this.renderMap();
  }
  placeMarker(event) {
    console.log('Google Map Click: ', event);
  }
  // renderMap() {
  //   let map = new mapboxgl.Map({
  //     container: 'map',
  //     style: 'mapbox://styles/mapbox/streets-v11'
  //   });
  // }

}
