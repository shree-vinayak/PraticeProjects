import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../customer.service';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { AddSchoolComponent } from '../add-school/add-school.component';
import { AddAcademicSchoolDialogComponent } from 'app/dialogs/add-academic-school-dialog/add-academic-school-dialog.component';
import { Page } from 'app/models/page.model';
import { Sort } from 'app/models/sort.model';
import { Subject } from 'rxjs/Subject';
import _ from 'lodash';
import { AddRncpDialogComponent } from 'app/dialogs/add-rncp-dialog/add-rncp-dialog.component';
import { ComposeMailComponent } from 'app/components/Mail/compose-mail/compose-mail.component';
import { LoginService } from 'app/services/login.service';
import { UtilityService } from '../../../services/utility.service';
import { CertifierSelection } from '../../../shared/enums/certifierselection';
import { UserService } from 'app/services/users.service';
// let jsPDF = require('jspdf');
// req uire('jspdf-autotable');
// import { AppConfig } from ../../../app.config';
declare const jsPDF;
// var jsPDF = require('jspdf');
// require('jspdf-autotable');

// Required for logging
import { Log } from 'ng2-logger';
import { RNCPTitlesService } from '../../../services';
import { ProblematicCorrectorService } from '../../../services/problematic-corrector.service';
const log = Log.create('CustomerListComponent');
log.color = 'green';

@Component({
  selector: 'admtc-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class CustomerListComponent implements OnInit {
  temp = [];
  customers: any[] = [];
  Totalcustomers: any[] = [];
  public dialogRef: MdDialogRef<AddSchoolComponent>;
  addSchoolDialog: MdDialogRef<AddAcademicSchoolDialogComponent>;
  addRncpDailog: MdDialogRef<AddRncpDialogComponent>;
  errorMessage: string;
  fltrSchool = '';
  fltrTitle = '';
  fltrSales = '';
  certifierList =[];
  currentSelectedRNCP = '';
  isADMTCUser = false;
  loadingIndicator = true;
  config: MdDialogConfig = {
    disableClose: true,
    width: '700px',
    height: '750px',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    },
  };

  isProblematicCorrector = false;

  configSchool: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'school-backdrop'
    // height:
  };
  public dialogRefMail: MdDialogRef<ComposeMailComponent>;
  sendMailBox: MdDialogConfig = {
    disableClose: false,
    width: '800px',
    height: '530px'
  };

  configRncp: MdDialogConfig = {
    disableClose: false,
    width: '600px'
    // height:"70%"
  };

  page = new Page();
  sort = new Sort();
  reorderable = true;
  // ngxDtCssClasses = AppConfig.ngxDtCssClasses;
  // ngxDtCssClasses = '';
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  SchoolListSearchItem = '';
  isSearchSchool: boolean;
  CertifierSelection = CertifierSelection;
  changeRNCPTitleModel: any;
  RNCPTitles: any = [];
  isSearching = false;
  value;
  prevValue;
  searchBy;

  private subject: Subject<any> = new Subject();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    public dialog: MdDialog,
    public dialog2: MdDialog,
    private loginService: LoginService,
    private service: UserService,
    public utility: UtilityService,
    private rncpService: RNCPTitlesService,
    private problematicCorrectorService: ProblematicCorrectorService,
  ) {
    this.page.pageNumber = 0;
    this.page.totalElements = 0;
    this.page.totalPages = 20;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    this.subject.debounceTime(5000).subscribe(searchTextValue => {
      this.searchSchoolList(searchTextValue);
    });
    log.info('Constructor Invoked');
  }

  getCustomersList(): void {
    this.filterStudent(false, {}, 'default');

    // this.filterStudent(false,{}, type = 'default',  {});
    // this.customerService
    //   .getCustomersList(this.page, this.sort)
    //   .then(ListData => {
    //     log.data('getCustomersList :ListData', ListData);
    //     this.page.totalElements = ListData.total;
    //     this.customers = ListData.data;
    //     this.Totalcustomers = ListData.data;
    //     // this.ChangeRNCPTitle({ id: this.currentSelectedRNCP });
    //     // this.searchSchoolList(this.SchoolListSearchItem);
    //   });
  }

  onExportPDF() {
    // this.getCustomersList();
    // var elementToPrint = this.getCustomersList(); //The html element to become a pdf
    // const pdf = new jsPDF();
    //   doc.save('web.pdf');

    // var customer = this.getCustomersList();
    const doc = new jsPDF();
    const col = [
      'School',
      'City',
      'Contact Person',
      'position',
      'Phone Number',
      'RNCP Titles',
    ];
    const rows = [];

    this.customers.forEach((item, index) => {
      const temp = [index, item.users[index]];
      rows.push(temp);
    });
    doc.text(col, rows);
    doc.save('Test.pdf');
  }

  ngOnInit() {
    const user = this.loginService.getLoggedInUser();
    if (
      user.entity.type === 'academic' &&
      user.operationRoleType !== 'certifier'
    ) {
      this.onEdit(user.entity.school._id);
    } else if (user.entity.type === 'admtc') {
      this.isADMTCUser = true;
      log.data('User- Entity', user.entity);
    }

    // it will set  this.isProblematicCorrector as true or false
    this.decideIsCorrectorOfProblematic(user.types, user.operationRoleType);
    this.getAllRNCPWithSHortName();
    this.getCustomersList();
    this.loadSchoolForCOrrectorProblmeatic();
  }

  keysrt(key) {
    return function(a, b) {
      if (a[key] > b[key]) {
        return 1;
      } else if (a[key] < b[key]) {
        return -1;
      }
      return 0;
    };
  }

  searchSchoolList(event) {
    const self = this;
    this.isSearching = true;
    // To check is Text is Entered
    if (this.SchoolListSearchItem !== '') {
      const val = this.SchoolListSearchItem.toLowerCase();
      // Filter Based on Short Name and Long Name
      const temp = this.Totalcustomers.filter(function (school) {
        let titleExists = true;
        if (school.rncpTitles.length && self.currentSelectedRNCP) {
          const status = school.rncpTitles.filter(function (o) {
            return o._id === self.currentSelectedRNCP;
          });
          if (!status.length) {
            titleExists = false;
          }
        }
        return (
          titleExists &&
          ((school.shortName !== '' &&
            school.shortName.toLowerCase().indexOf(val) !== -1) ||
            (school.longName !== '' &&
              school.longName.toLowerCase().indexOf(val) !== -1))
        );
      });
      this.customers = temp;
      // To Reset the page to Show Schools from Scroll Top
      this.page.totalElements = this.customers.length;
      this.page.pageNumber = 0;
    }
  }

  getFilterSchool() {
    this.customerService
      .searchSchool(this.SchoolListSearchItem, this.page.pageNumber)
      .subscribe(response => {
        this.customers = response.data
          ? (this.customers = response.data)
          : (this.customers = this.Totalcustomers);
        this.page.totalElements = response.total;
      });
  }

  onNewSchool() {
    this.dialogRef = this.dialog.open(AddSchoolComponent, this.config);
    this.dialogRef.afterClosed().subscribe(result => {
      log.data('this is the pop up From School', result);
      this.dialogRef = null;
      if (result) {
        this.getCustomersList();
      }
    });
  }

  onEdit(schoolId, schoolShortName?: string) {
    log.info('in edit');
    // Setting the Current School Short Name to Display above Student Cards
    this.customerService.currentSchool._id = schoolId;
    this.customerService.currentSchool.schoolShortName = schoolShortName;
    this.router.navigate([schoolId, 'edit', 0], { relativeTo: this.route });
  }

  onCustomerDeals(customerId, dealId) {
    log.data(dealId);
    this.router.navigate([customerId, 'deals', dealId], {
      relativeTo: this.route,
    });
  }
  changeSelection(event) {
    this.isSearching = true;
    if (event.value === 'certifier') {
      this.customerService
        .getCustomersListForCertifier(
          this.page,
          this.sort,
          this.currentSelectedRNCP,
        )
        .then(ListData => {
          this.page.totalElements = ListData.total;
          this.customers = ListData.data;
          this.Totalcustomers = ListData.data;
        });
    }
    if (event.value === 'preparation-center') {
      this.customerService
        .getCustomersListForPreparationCenter(this.page, this.sort)
        .then(ListData => {
          this.page.totalElements = ListData.total;
          this.customers = ListData.data;
          this.Totalcustomers = ListData.data;
        });
    }
  }
  ChangeRNCPTitle(event) {
    this.isSearching = true;
    if (event.id && event.id !== '') {
      const val = event.id;
      this.currentSelectedRNCP = event.id;
      const customers = [];
      if (this.Totalcustomers.length) {
        this.Totalcustomers.forEach(function (e) {
          if (e.rncpTitles.length) {
            const status = e.rncpTitles.filter(function (o) {
              return o._id === val;
            });
            if (status.length) {
              customers.push(e);
            }
          }
        });
      }

      this.customers = customers;
      this.page.totalElements = this.customers.length;
      this.page.pageNumber = 0;
    }
  }

  filterStudent(searchonText = false, event, type = 'default', value?: any) {
    if (value !== undefined) {
      this.prevValue = value;
    }

    if (type === 'RNCP' && event.id) {
      this.currentSelectedRNCP = event.id;
    }
    if (searchonText && this.SchoolListSearchItem !== '') {
      this.searchSchoolList({});
      return;
    }
    if (this.prevValue !== undefined && this.prevValue !== '') {
      if (this.prevValue === 'certifier') {
        this.customerService
          .getCustomersListForCertifier(
            this.page,
            this.sort,
            this.currentSelectedRNCP,
          )
          .then(ListData => {
            this.page.totalElements = ListData.total;
            this.customers = ListData.data;
            this.Totalcustomers = ListData.data;
            // this.ChangeRNCPTitle({ id: this.currentSelectedRNCP });
            this.searchSchoolList({});
          });
      }
      if (this.prevValue === 'preparation-center') {
        this.customerService
          .getCustomersListForPreparationCenter(this.page, this.sort)
          .then(ListData => {
            this.page.totalElements = ListData.total;
            this.customers = ListData.data;
            this.Totalcustomers = ListData.data;
            this.ChangeRNCPTitle({ id: this.currentSelectedRNCP });
            this.searchSchoolList({});
          });
      }
    } else if (this.utility.isJustProbCorrector()) {
      this.problematicCorrectorService.getSchoolByTheTitle(event.id).subscribe(response => {
        const resp = response.json();
        const schools  = [];
        for (const data of resp.data) {
          for (const school of data.schools) {
            const dataSchool = school;
            dataSchool['rncpTitles'] = [{id: data.rncpTitle._id, shortName: data.rncpTitle.shortName}];
            schools.push(dataSchool);
          }
        }
        this.customers = schools;
      });
    } else {
      this.customerService
        .getCustomersList(this.page, this.sort)
        .then(ListData => {
          log.data('getCustomersList :ListData', ListData);
          this.page.totalElements = ListData.total;
          this.customers = ListData.data;
          this.Totalcustomers = ListData.data;
          this.ChangeRNCPTitle({ id: this.currentSelectedRNCP });
          this.searchSchoolList({});
        });
    }
  }

  resetSearch() {
    this.searchBy = '';
    this.prevValue = '';
    this.changeRNCPTitleModel = '';
    this.SchoolListSearchItem = '';
    this.currentSelectedRNCP = '';

    this.page.pageNumber = 0;
    this.page.totalElements = 0;
    this.page.totalPages = 20;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    if (this.utility.isJustProbCorrector()) {
      this.loadSchoolForCOrrectorProblmeatic();
    } else {
      this.getCustomersList();
    }
    this.isSearching = false;
  }
  updateFilterSchool(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.longName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.customers = temp;
  }

  updateFilterType(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.shortName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.customers = temp;
  }

  updateFilterSalesPerson(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.longName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.customers = temp;
  }

  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
    this.customers = _.orderBy(
      this.customers,
      [this.sort.sortby],
      [this.sort.sortmode],
    );
    // this.getCustomersList();
  }

  onAddSchool() {
    log.info('Inside onAddSchool');
    this.addSchoolDialog = this.dialog.open(
      AddAcademicSchoolDialogComponent,
      this.configSchool,
    );
    this.addSchoolDialog.afterClosed().subscribe(schoolValues => {
      log.info('Inside admtc-staff-menu Component: addNewSchool', schoolValues);
      if (schoolValues) {
        this.getCustomersList();
      }
    });
  }

  editSchoolDislog(row) {
    log.info('Inside editSchoolDislog');
    this.customerService.getCertifierBySchool(row._id).subscribe(response => {
      this.certifierList = response.data;
      this.addSchoolDialog = this.dialog.open(
        AddAcademicSchoolDialogComponent,
        this.configSchool,
      );
      this.addSchoolDialog.componentInstance.selectedSchoolDetails = row;
      this.addSchoolDialog.componentInstance.isSchoolEdit = true;
      this.addSchoolDialog.componentInstance.certifierList = this.certifierList;
      this.addSchoolDialog.afterClosed().subscribe(schoolValues => {
        console.log('schoolValues');
        console.log(schoolValues);
        if (schoolValues) {
          this.filterStudent(false, event, 'default');
        }
      });
    });
  }

  onAddRncp() {
    log.info('Inside onAddRncp');
    this.addRncpDailog = this.dialog.open(
      AddRncpDialogComponent,
      this.configRncp,
    );
    this.addRncpDailog.afterClosed().subscribe(rncplValues => {
      if (rncplValues) {
        log.info(
          'Inside admtc-staff-menu Component: addNewSchool',
          rncplValues,
        );
        this.getCustomersList();
        this.getAllRNCPWithSHortName();
      }
    });
  }

  sendMail(data) {
    this.dialogRefMail = this.dialog2.open(
      ComposeMailComponent,
      this.sendMailBox,
    );
    this.dialogRefMail.componentInstance.selectedUsers = data.users;
    this.dialogRefMail.afterClosed().subscribe(result => {
      this.dialogRefMail = null;
    });
    return false;
  }

  getAllRNCPWithSHortName() {
    if (this.isProblematicCorrector) {
      this.problematicCorrectorService.getAllThetitle().subscribe(response => {
        const resp = response.json();
        this.RNCPTitles = [];
        if (resp.data.length > 0) {
          resp.data.forEach(rep => {
            this.RNCPTitles.push({
              id: rep.rncpTitle.id,
              text: rep.rncpTitle.shortName,
            });
          });
        }
        this.RNCPTitles = this.RNCPTitles.sort(this.keysrt('text'));
      });
    } else {
      this.service.getAllRNCPTitlesShortName().subscribe((response) => {
        const data = response.data;
        this.RNCPTitles = [];
        if (data) {
          data.forEach((rep) => {
            this.RNCPTitles.push({
              id: rep._id,
              text: rep.shortName
            });
          });
        }
        this.RNCPTitles = this.RNCPTitles.sort(this.keysrt('text'));
      });
    }
  }

  openEditRNCP(title) {
    console.log(title);
    if (this.utility.checkUserIsDirectorSalesAdmin()) {
      this.rncpService.getRNCPDetails(title._id).subscribe( rncp => {
        console.log(rncp);
        this.addRncpDailog = this.dialog.open(AddRncpDialogComponent, this.configRncp);
        this.addRncpDailog.componentInstance.isRNCPEdit = true;
        this.addRncpDailog.componentInstance.editableRNCPDetails = rncp.data;
        this.addRncpDailog.afterClosed().subscribe((rncplValues) => {
          if (rncplValues) {
            log.info('Inside admtc-staff-menu Component: addNewSchool', rncplValues);
            this.getCustomersList();
            this.getAllRNCPWithSHortName();
          }
        });
      });
    }
  }

  loadSchoolForCOrrectorProblmeatic() {
    const schools = [];
    if (this.isProblematicCorrector) {
      this.problematicCorrectorService.getSchoolCorrectionByCorrector().subscribe(
        (response) => {
          const resp = response.json();
          console.log(resp);
          for (const data of resp.data) {
            for (const school of data.schools) {
              const dataSchool = school;
              dataSchool['rncpTitles'] = [{id: data.rncpTitle._id, shortName: data.rncpTitle.shortName}];
              schools.push(dataSchool);
            }
          }
          this.customers = schools;
        }
      );
    }
  };

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
}
