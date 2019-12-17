import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private http: HttpClient) { }

  addPackage(body: any) {
    return this.http.post(environment.apiEndpoint + 'package', body);
  }

  getPackages() {
    return this.http.get(environment.apiEndpoint + 'packages');
  }


}
