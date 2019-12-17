import { Component, OnInit, OnChanges, DoCheck, AfterViewInit, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MapViewComponent implements OnInit {
  map;
  coordinate;
  saveLocation;
  lists;
  isEditable: boolean;
  isClicked: boolean;
  selectedLocation;
  paint = { 'background-color': 'green', 'background-opacity': 0.1 };
  constructor(private request: RequestService) {
    this.isClicked = true;
  }

  ngOnInit() {
    (mapboxgl as any).accessToken = environment.accessToken;
    this.loadMap();
    this.getAll();
  }

  // Get map
  loadMap() {
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      // style: 'mapbox://styles/mapbox/satellite-v9',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [75.8946704864502, 22.72542485190831], // starting position
      zoom: 3 // starting zoom
    });
    this.map.on('click', (event) => {
      this.isClicked = false;
      const point = this.map.getLayer('points');
      if (point) {
        this.map.removeLayer('points');
        this.map.removeSource('points');
        this.map.removeImage('icon');
      }
      this.coordinate = event.lngLat.wrap();
      this.addMarker(this.coordinate);
    });
  }

  addMarker(coordinate) {
    this.map.loadImage('./assets/image/marker-icon-8.png', (err, image) => {
      this.map.addImage('icon', image);
      this.map.addLayer({
        id: 'points',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [coordinate.lng, coordinate.lat]
              }
            }]
          }
        },
        layout: {
          'icon-image': 'icon',
          'icon-size': 0.4
        }
      });
    });
  }

  // get All Saved Location
  async getAll() {
    await this.request.getAll().subscribe((res) => {
      this.lists = res;
    });
  }

  // Save Location
  async onSave() {
    this.saveLocation = {
      longitude: this.coordinate.lng,
      latitude: this.coordinate.lat,
    };

    try {
      // get place from coordiname
      await this.request.getCoordinatePlace(this.coordinate).subscribe(async (res: any) => {
        if (res.features.length !== 0) {
          this.saveLocation.locationName = res.features[0].place_name;

          // save data to DB
          await this.request.post(this.saveLocation).subscribe((after) => {
            this.getAll();
            this.onReset();
          });
        } else {
          alert('No place name found');
        }
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  // Edit Location
  async onEdit(id) {
    this.onReset();
    this.isEditable = true;
    await this.request.get(id).subscribe((res: any) => {
      const coordinate = {
        lng: res.longitude,
        lat: res.latitude
      };
      this.selectedLocation = id;
      this.addMarker(coordinate);
      this.map.flyTo(
        {
          center: [coordinate.lng, coordinate.lat],
          speed: 0.4,
          zoom: 3
        }
      );
    });
  }

  // Update Location
  async onUpdate(locationId) {
    this.saveLocation = {
      id: locationId,
      longitude: this.coordinate.lng,
      latitude: this.coordinate.lat,
    };
    console.log('Final Response for update', this.saveLocation);
    // get place from coordiname
    await this.request.getCoordinatePlace(this.coordinate).subscribe(async (res: any) => {
      this.saveLocation.locationName = res.features[0].place_name;

      // save data to DB
      await this.request.put(this.saveLocation).subscribe((after) => {
        console.log('After Save: ', after);
        this.getAll();
        this.onReset();
      });
    });
  }

  // Delete Location
  async onDelete(id) {
    // delete record from Db
    await this.request.delete(id).subscribe((res) => {
      console.log('Successfuly Delete');
      this.getAll();
    });
  }

  // Reset or cancle
  onReset() {
    this.map.setZoom(2);
    this.map.setCenter({ lng: '75.8946704864502', lat: '22.72542485190831' });
    this.isEditable = false;
    this.isClicked = true;
    const point = this.map.getLayer('points');
    if (point) {
      this.map.removeLayer('points');
      this.map.removeSource('points');
      this.map.removeImage('icon');
    }
  }
}
