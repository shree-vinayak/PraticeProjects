import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
  baseUrl: string = "http://localhost:3000";

  constructor(private httpClient: HttpClient) {

  }

  get_products() {
    return this.httpClient.get(this.baseUrl + '/products/1');
  }

  // get_products() {
  //   return this.httpClient.get("../assets/mydata.json");
  // }
  get_families() {
    return this.httpClient.get(this.baseUrl + '/families');
  }
  get_locations() {
    return this.httpClient.get(this.baseUrl + '/locations');
  }
  get_transactions() {
    return this.httpClient.get(this.baseUrl + '/families');
  }

  post_products(pro) {
    return this.httpClient.post(this.baseUrl + '/products', pro);
  }

}
