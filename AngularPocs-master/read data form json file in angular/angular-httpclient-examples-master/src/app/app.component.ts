import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from './data.service';
import { Product } from './product';
import { Family } from './family';
import { Location } from './location';
import { Transaction } from './transaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private products: Product[] = [];
  private families: Family[] = [];
  private locations: Location[] = [];
  private transactions: Transaction[] = [];



  constructor(private dataService: DataService) {


  }

  get_products() {
    this.dataService.get_products().subscribe((res: any) => {
      console.log(res);
      this.products = res.products;
    });


    const por = {
      id: 5,
      name: "ankit",
      cost: 20000,
      quantity: 5,
      locationId: 2000,
      familyId: 6
    }

    // this.dataService.post_products(por).subscribe(res => {
    //   console.log(res);
    // });

  }
  get_families() {
    this.dataService.get_families().subscribe((res: Family[]) => {
      this.families = res;
    });
  }

  get_locations() {
    this.dataService.get_locations().subscribe((res: Location[]) => {
      console.log(res);
      this.locations = res;
    });
  }

  get_transactions() {
    this.dataService.get_transactions().subscribe((res: Transaction[]) => {
      console.log(res);
      this.transactions = res;
    });
  }




}
