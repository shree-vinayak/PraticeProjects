import { LoginService } from './../../../services/login.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../customer.service';
import { Subscription } from 'rxjs/Subscription';
import { UtilityService } from 'app/services/utility.service';
import _ from "lodash";

// Required for logging
import { Log } from 'ng2-logger';
const log = Log.create('CustomerEditComponent');
log.color = 'red';

@Component({
  selector: 'admtc-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroupSchool') tabGroup;

  selectedIndex: number;
  schoolShortName: String = '';
  custumerId;
  nonAcademic = true;
  studentActive: true;
  // This variable will hold user is prob corrector or not
  isProblematicCorrector = false;
  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    public utility: UtilityService,
    public loginService: LoginService
  ) {
    // Default index for tab will be school (0)
    this.selectedIndex = 0;
    log.info('Constructor Invoked');
  }

  ngOnInit() {
    log.info('ngOnInit');

    // Default tab selected will be student
    this.selectedIndex = 0;
    const user = this.loginService.getLoggedInUser();
    if ((user.entity.type === 'academic' || user.entity.type === 'group-of-schools' ) 
          && !this.utility.checkUserIsAdminOrDirectorOfCertifier()) {
      this.nonAcademic = false;
    }
    this.decideIsCorrectorOfProblematic(user.types, user.operationRoleType);
    this.subscription = this.route.params.subscribe(params => {
      if (params.hasOwnProperty('selectedTabIndex')) {
        this.selectedIndex = +params['selectedTabIndex'];
      }
      if (params.hasOwnProperty('customerId')) {
        this.custumerId = params['customerId'];
        if(this.customerService.currentSchool && this.customerService.currentSchool._id === this.custumerId){
          this.schoolShortName = this.customerService.currentSchool.schoolShortName;
        } else if ( this.loginService.getLoggedInUser().entity.type !== 'academic'
                    || this.utility.checkUserIsAdminOrDirectorOfCertifier() ) {
          this.customerService
          .getCustomer(this.custumerId)
          .subscribe(costumer => {
            if( _.isArray(costumer) ) {
            this.schoolShortName = costumer[0].shortName;
            } else {
            this.schoolShortName = costumer.shortName;
            }
          });
        }
      } else {
        // console.log("CustomerId not found");
      }
    });
  }

  ngAfterViewInit() {
    this.tabGroup.selectedIndex = this.selectedIndex;
  }
  onNavigateBack() {
    this.router.navigate(['/school']);
  }
  resetRouter(event) {
    log.info('ResetRouter linked:' + event);
    this.selectedIndex = event;
    let selectedIndex;
    this.subscription = this.route.params.subscribe(params => {
      if (params.hasOwnProperty('customerId')) {
        this.custumerId = params['customerId'];
        selectedIndex = +params['selectedTabIndex'];
        if (selectedIndex !== this.selectedIndex) {
          this.router.navigate(['/school/' + this.custumerId + '/edit/' + this.selectedIndex]);
        }
      }
    });
  }

  // Set variable isProblematicCorrector as true or false
  decideIsCorrectorOfProblematic(userTypes: any[], operationRoleType: string) {
    this.isProblematicCorrector = false;
    if (operationRoleType === 'certifier') {
      for (const type of userTypes) {
        if (type.name === 'Admin') {
          this.isProblematicCorrector = false;
          break;
        } else if (type.name === 'Corrector-of-Problematic') {
          this.isProblematicCorrector = true;
        }
      }
    }
  }

  // studentActive(){
  //   this.index = true;
  // }
}
