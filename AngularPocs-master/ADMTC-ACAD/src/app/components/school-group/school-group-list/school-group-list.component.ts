import {
  Component,
  ViewChild,
  OnInit,
  Pipe,
  PipeTransform
} from '@angular/core';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { Router } from '@angular/router';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { TranslateService } from 'ng2-translate';
import { CustomerService } from '../../customer/customer.service';
import {
  MdButtonToggleGroup,
  MdDialogRef,
  MdDialogConfig,
  MdDialog
} from '@angular/material';
import _ from 'lodash';
import { LoginService } from 'app/services/login.service';

@Component({
  selector: 'app-school-group-list',
  templateUrl: './school-group-list.component.html',
  styleUrls: ['./school-group-list.component.css']
})
export class SchoolGroupListComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  @ViewChild(MdButtonToggleGroup) mdToggleButtonGroup: MdButtonToggleGroup;
  RNCPSearchItem;
  textSearch = '';
  schools: any = [];
  filteredSchools: any = [];
  page = new Page();
  sort = new Sort();
  reorderable = true;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  certifier;
  serchedCertifier = [];
  user;
  checkifUrgent;
  SampleMessages: boolean;
  DisplayMailPopupConfig: MdDialogConfig = {
    disableClose: true,
    width: '65%',
    height: '65%'
  };
  checkadmtc = false;

  /*************************************************************************
   *   CONSTRUCTOR
   *************************************************************************/
  constructor(
    private service: RNCPTitlesService,
    private router: Router,
    private translate: TranslateService,
    private customerService: CustomerService,
    public dialog: MdDialog,
    private loginservice: LoginService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = 'shortName';
    this.sort.sortmode = 'asc';
  }

  /*************************************************************************
   *   EVENTS
   *************************************************************************/
  ngOnInit() {
    this.user = this.loginservice.getLoggedInUser();
    this.service.resetState();
    this.getTitleList();
  }

  /*************************************************************************
   *   METHODS
   *************************************************************************/
  getTranslated(text: string) {
    return this.translate.instant(text);
  }

  goToRncpTitle(data: any): void {
    console.log(data);
    this.customerService.setSelectedSchoolId(data._id, data.shortName);
    this.router.navigate(['school-group', data._id]);
  }

  getTitleList(): void {
    console.log(this.user.entity.groupOfSchools);
    this.page.totalElements = this.user.entity.groupOfSchools.length;
    this.schools = this.user.entity.groupOfSchools;
    this.filteredSchools = Object.assign([], this.schools);
  }

  assignSchools() {
    this.filteredSchools = Object.assign([], this.schools);
    this.textSearch = '';
  }

  filterSchools(event) {
    if (event.target.value !== '') {
      this.filteredSchools = Object.assign([], this.schools).filter(
        school =>
          school.shortName
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) > -1
      );
    } else {
      this.assignSchools();
    }
  }

  searchSchool(event) {
    if (event.target.value !== '') {
    }
  }
}
