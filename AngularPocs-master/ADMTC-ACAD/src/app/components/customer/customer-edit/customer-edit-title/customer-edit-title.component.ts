import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CustomerService } from '../../customer.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Page } from './../../../../models/page.model';
import { Sort } from './../../../../models/sort.model';

@Component({
  selector: 'admtc-customer-edit-title',
  templateUrl: './customer-edit-title.component.html',
  styleUrls: ['./customer-edit-title.component.scss']
})
export class CustomerEditTitleComponent implements OnInit {

  customerId: string;
  public rncpTitles : any[];
    contacts: any[];
  errorMessage: string;
  private subscription: Subscription;
  page = new Page();
  sort = new Sort();
  constructor(private customerService: CustomerService,
              private route: ActivatedRoute,
              private router: Router,
              private translate : TranslateService) {
    
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      params => {
        if (params.hasOwnProperty('customerId')) {
          this.customerId = params['customerId'];
          this.getCustomer(this.customerId);
        } else {
          this.errorMessage = 'There is no parameter';
        }
      });
    
  }

  // getCustomer(customerId) {
  //   this.customerService
  //     .getCustomersList(this.page,this.sort)
  //      .then(ListData => {
  //       console.log(ListData);
  //       this.rncpTitles = ListData;
  //     });
  // }

     getCustomer(customerId) {
    this.customerService
      .getCustomer(customerId)
      .subscribe(
        customer => {
         this.rncpTitles = customer.rncpTitles;
          // console.log('bhavik title');
          // console.log(customer.rncpTitles);
        },
        error =>  this.errorMessage = <any>error
      );
  }



}
