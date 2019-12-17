import {
  Component,
  ViewChild,
  OnInit,
  Pipe,
  PipeTransform,
  OnDestroy
} from "@angular/core";
import { RNCPTitlesService } from "../../../services/rncp-titles.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Page } from "../../../models/page.model";
import { Sort } from "../../../models/sort.model";
import { TranslateService } from "ng2-translate";
import _ from "lodash";
import { Subscription } from "rxjs";
import { CustomerService } from "../../customer/customer.service";
import { LoginService } from "app/services/login.service";

@Component({
  selector: "app-school-title-list",
  templateUrl: "./school-title-list.component.html",
  styleUrls: ["./school-title-list.component.css"]
})
export class SchoolTitleListComponent implements OnInit, OnDestroy {
  RNCPSearchItem;
  textSearch = "";
  rncpTitles: any = [];
  page = new Page();
  sort = new Sort();
  reorderable = true;
  ngxDtCssClasses = {
    sortAscending: "fa fa-caret-up",
    sortDescending: "fa fa-caret-down",
    pagerLeftArrow: "icon-left",
    pagerRightArrow: "icon-right",
    pagerPrevious: "icon-prev",
    pagerNext: "icon-skip"
  };
  certifier;
  serchedCertifier = [];
  user;
  checkifUrgent;
  SampleMessages: boolean;

  schoolId;

  checkadmtc: boolean = false;
  private subscription: Subscription;
  constructor(
    private service: RNCPTitlesService,
    private router: ActivatedRoute,
    private routes: Router,
    private translate: TranslateService,
    private customerService: CustomerService,
    private loginService: LoginService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = 'shortName';
    this.sort.sortmode = "asc";
  }

  ngOnInit() {
    const self = this;
    this.subscription = this.router.queryParams.subscribe(qParams => {
      self.subscription = self.router.params.subscribe(params => {
        if (params.hasOwnProperty('id') && params.hasOwnProperty('id')) {
          self.service.resetState();
          self.schoolId = params['id'];
          self.getTitleList();
          self.user = this.loginService.getLoggedInUser();
          self.checkuserType();
        } else {
          console.log('NO Test ID');
        }
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  automate() {
    const demoId = '1';
    this.service.selectRncpTitle(demoId).subscribe(title => {
      this.routes.navigate(['dashboard']);
    });
  }

  getTranslated(text: string) {
    return this.translate.instant(text);
  }

  goToRncpTitle(id: any): void {
    const schoolId = this.customerService.schoolId ? this.customerService.schoolId : ''  ;
    this.service.selectRncpTitle(id).subscribe(() => {
      this.routes.navigate(['dashboard'], schoolId ? { queryParams: { schoolId: schoolId }} : {} );
    });
  }

  getTitleList(): void {
    console.log('sort object', this.sort);

    this.customerService.getCustomer(this.schoolId).subscribe(school => {
      console.log(school[0]);
      if (school && school[0].rncpTitles && school[0].rncpTitles.length) {
        this.rncpTitles = _.filter(school[0].rncpTitles, function(r) {
          return r.isPublished === true;
        });
        this.RNCPSearchItem = this.rncpTitles;
        this.page.totalElements = this.rncpTitles.length;
        console.log(this.rncpTitles);
        const a = _.uniqBy(this.rncpTitles, 'certifier.shortName');
        this.certifier = _.sortBy(a, 'certifier.shortName');
      }
    });
  }

  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.getTitleList();
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    console.log('Sort :', this.sort);
    this.page.pageNumber = 0;
    this.getTitleList();
  }

  searchRNCP(event) {
    if (this.RNCPSearchItem !== '' && event.target.value) {
      const val = event.target.value.toLowerCase();
      const temp = _.filter(this.RNCPSearchItem, function(d) {
        if (d.shortName && d.shortName) {
          return (
            (d.shortName !== '' &&
              d.shortName.toLowerCase().indexOf(val) !== -1) ||
            (d.longName.toLowerCase().indexOf(val) !== -1 &&
              d.longName !== '') ||
            (d.certifier &&
              d.certifier.shortName !== '' &&
              d.certifier.shortName.toLowerCase().indexOf(val) !== -1) ||
            (d.certifier &&
              d.certifier.longName.toLowerCase().indexOf(val) !== -1 &&
              d.certifier.longName !== '')
          );
        }
      });
      this.rncpTitles = temp;
    } else {
      this.rncpTitles = this.RNCPSearchItem;
    }
  }

  select(val) {
    console.log(val);
    if (val) {
      if (val === 'All') {
        this.rncpTitles = this.RNCPSearchItem;
        this.textSearch = '';
      } else {
        const dataList = _.filter(this.RNCPSearchItem, function(d) {
          if (d.certifier && d.certifier.shortName) {
            return d.certifier.shortName === val;
          }
        });
        this.textSearch = '';
        this.rncpTitles = dataList;
      }
    }
  }

  checkuserType() {
    if (this.user !== undefined && this.user) {
      if (this.user.entity.type === 'admtc') {
        this.checkadmtc = true;
      } else {
        this.checkadmtc = false;
      }
    }
  }
}
