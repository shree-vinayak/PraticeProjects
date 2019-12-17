import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  // GET Coordinate List
  getCoordinatePlace(endpoint) {
    return this.http.get(environment.mapApiPoint + endpoint.lng + ',' + endpoint.lat + '.json?access_token=' + environment.accessToken);
  }

  // GET All
  getAll() {
    return this.http.get(environment.apiEndpoint + 'getAll');
  }

  // GET
  get(id) {
    return this.http.get(environment.apiEndpoint + id);
  }

  // POST List
  post(body) {
    return this.http.post(environment.apiEndpoint, body);
  }

  // PUT List
  put(body) {
    return this.http.put(environment.apiEndpoint, body);
  }

  // DELETE List
  delete(id) {
    return this.http.delete(environment.apiEndpoint + id);
  }
}
