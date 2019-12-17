import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/users.service';
import { TasksService } from '../../../../services/tasks.service';
import { Tasks } from '../../../../models/tasks.model';
import { MdDialog, MdDialogConfig, MdDialogRef, MdDatepicker } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';
import { DatePipe } from '@angular/common';
import { AcademicKitService } from '../../../../services/academic-kit.service';
import { BehaviorSubject } from 'rxjs';
import { Test } from '../../../../models/test.model';
import { UtilityService } from '../../../../services/utility.service';
import _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { TestCorrectionService } from '../../../../services/test-correction.service';
import { TestService } from '../../../../services/test.service';
import { LoginService } from '../../../../services/login.service';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
declare var swal: any;
import { CustomerService } from 'app/components/customer/customer.service';

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('HistoryComponent');
log.color = 'violet';

import { ViewHistoryComponent } from 'app/components/settings/settingSteps/history/view-history/view-history.component';
import { ForwardHistoryComponent } from 'app/components/settings/settingSteps/history/forward-history/forward-history.component';

@Component({
  selector: 'app-history',
  templateUrl: './history-component.html',
  styleUrls: ['./history-component.scss'],
  providers: [DatePipe, TestService, LoginService, RNCPTitlesService]
})
export class HistoryComponent implements OnInit, OnDestroy {
  fltrTask = '';
  fltrTitle = '';
  sortName: any;
  loggedInUserId = '';
  fltrSales = '';
  selected = [];
  historyList: Tasks[];
  task: Tasks;
  usersList = [];
  isSearching = false;
  page = new Page();
  filterByStatus: any;
  sort = new Sort();
  allUserTypes = [];
  schoolsLists = [];
  allRNCPTitles = [];
  titleLists = [];
  testLists = [];
  userTypeLists = [];
  notificationRefLists = [];
  event: any;
  login: any;
  reorderable = true;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  private _subscription: Subscription = new Subscription();
  test = new BehaviorSubject<Test>(new Test());

  searchSchoolText = [];
  searchTitleText = [];
  searchTestText = [];
  searchUserTypeText = [];
  searchUserText = [];
  searchNotificationRefText = [];
  searchFromDate: any = null;
  searchToDate: any = null;
  searchSubjectText: string;

  // List of bolleans to show the filter
  showRNCPList = false;
  showTestList = false;

  configCat: MdDialogConfig = {
    disableClose: true,
    width: '600px'
  };

  checkIsDirectorSalesAdmin = false;
  highlightTaskId = '';

  public dialogRefViewHistory: MdDialogRef<ViewHistoryComponent>;
  public dialogRefForWardHistory: MdDialogRef<ForwardHistoryComponent>;
  sendMailBox: MdDialogConfig = {
    disableClose: false,
    width: '1000px',
    height: '80%'
  };

  sendMailBoxView: MdDialogConfig = {
    disableClose: false,
    width: '50%',
    height: '60%'
  };

  isToday: boolean = false;

  @ViewChild('toDate') toDatePicker: MdDatepicker<Date>;
  @ViewChild('endDate') endDatePicker: MdDatepicker<Date>;

  constructor(
    private testCorrectionService: TestCorrectionService,
    private service: UserService,
    private taskservice: TasksService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private dialog: MdDialog,
    private translate: TranslateService,
    private acadService: AcademicKitService,
    public datepipe: DatePipe,
    public utilityservice: UtilityService,
    private testservice: TestService,
    private loginService: LoginService,
    private titlesService: RNCPTitlesService,
    public custService: CustomerService,
    public dialog2: MdDialog
  ) {
    this.page.pageNumber = 0;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.page.size = 11;
    this.sort.sortby = 'sentDate';
    this.sort.sortmode = 'asc';
  }
  ngOnInit() {
    let self = this;
    // const login = JSON.parse(localStorage.loginuser);
    this.login = this.loginService.getLoggedInUser();
    this.checkIsDirectorSalesAdmin = this.utilityservice.checkUserIsDirectorSalesAdmin();
    console.log(this.login);
    this.loggedInUserId = this.login._id ? this.login._id : '';
    this.GetAllHistory(true);

    this._subscription = this.translate.onLangChange.subscribe(params => {
      if (this.allUserTypes !== []) {
        this.userTypeLists = [];
        this.allUserTypes.forEach(item => {
          const typeEntity =
            this.utilityservice.getTranslateADMTCSTAFFKEY(item.name) +
            ' / ' +
            this.utilityservice.getTranslateENTITY(item.entity);
          this.userTypeLists.push({ id: item._id, text: typeEntity });
        });
        this.userTypeLists = this.userTypeLists.sort(this.keysrt('text'));
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
  changePage(pageInfo): void {
    if ( this.page.pageNumber !== pageInfo.offset ) {
      this.page.pageNumber = pageInfo.offset;
      this.checkCurrentMode();
    }
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;

    // For Sorting Array
    this.page.pageNumber = 0;
    this.checkCurrentMode();
  }

  checkCurrentMode() {
    if ( this.isSearching ) {
      this.searchHistory();
    } else {
      this.GetAllHistory();
    }
  }

  GetAllHistory(isOnInIt?: boolean) {
    this.taskservice
      .getHistories(
        this.page.pageNumber,
        this.page.size,
        this.sort.sortby,
        this.sort.sortmode
      )
      .subscribe(response => {
        this.historyList = null;
        this.historyList = response.history;
        this.page.totalElements = response.total;
        this.isSearching = false;
        this.searchToDate = new Date();
        this.searchFromDate = new Date(new Date().setDate(new Date().getDate() - 7));
        if (isOnInIt) {
            this.getAllSchools();
            this.getAllRNCPTitles();
            this.getAllNotificationReference();
            this.getAllUserTypesByIsUserCollection();
        }
      });
  }

  onActivate($event) {
    console.log($event);
  }

  redirectToValidateCorrection(e) {
    this.router.navigate([
      'test-correction/' +
        e.row.rncp._id +
        '/' +
        e.row.test._id +
        '/' +
        e.row._id
    ]);
  }

  resetSearch() {
    this.searchSubjectText = '';
    this.filterByStatus = '';
    this.isSearching = false;
    this.searchSchoolText = [];
    this.searchTitleText = [];
    this.searchTestText = [];
    this.searchUserTypeText = [];
    this.searchUserText = [];
    this.searchNotificationRefText = [];
    this.searchFromDate = null;
    this.searchToDate = null;
    this.toDatePicker._selected = null;
    this.endDatePicker._selected = null;
    this.showRNCPList = false;
    this.showTestList = false;
    this.GetAllHistory();
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

  ChangeSchoolFilterTyped(event) {
    const values = this.custService.seacrhCity(event);
    values.subscribe(data => {
      if (!data || data.length === 0) {
        console.log('no data available');
      } else {
        let myid = data[0]._id;
      }
    });
    //this.schoolsLists = this.custService.seacrhSchool(event);
  }
  ChangeSchoolFilter(event) {
    if (event.id) {
      this.testLists = [];
      this.searchTitleText = [];
      this.searchTestText = [];
      this.showRNCPList = true;
      const selectedSchoolsRNCPTitlesId: {
        _id: string[];
      } = event.id.rncpTitles.map(a => {
        return { _id: a._id };
      });
      const titleListsBasedOnSchoolSelected: any[] = _.intersectionBy(
        this.allRNCPTitles,
        selectedSchoolsRNCPTitlesId,
        '_id'
      );
      this.titleLists = [];
      titleListsBasedOnSchoolSelected.forEach(item => {
        this.titleLists.push({ id: item._id, text: item.shortName });
      });
      this.titleLists = this.titleLists.sort(this.keysrt('text'));
    }
  }
  ChangeTitleFilter(event) {
    if (event.id) {
      this.testLists = [];
      this.showTestList = true;
      this.searchTestText = [];
      this.testservice.getTestByRNCPTitle(event.id).subscribe(res => {
        const tests: any[] = res;
        if (tests.length > 0) {
          tests.forEach(item => {
            this.testLists.push({ id: item._id, text: item.name });
          });
          this.testLists = this.testLists.sort(this.keysrt('text'));
          this.testLists = [...this.testLists];
        }
      });
    }
  }
  ChangeTestFilter(event) {
    console.log(event);
  }
  ChangeUserTypeFilter(event) {
    console.log(event);
    this.searchUserText = [];
    if (event.id) {
      this.service
        .userByFilter({ userType: event.id }, 0, 1000)
        .subscribe(response => {
          this.usersList = [];
          const users: any[] = response.data;
          if (users.length > 0) {
            users.forEach(item => {
              this.usersList.push({
                id: item._id,
                text: item.lastName + ' ' + item.firstName
              });
            });
            this.usersList = this.usersList.sort(this.keysrt('text'));
            this.usersList = [...this.usersList];
            console.log(this.usersList);
          }
        });
    }
  }
  ChangeUserFilter(event) {
    console.log(event);
  }
  ChangeNotificationRefListsFilter(event) {
    console.log(event);
  }
  searchSubjectFilter(event) {
    console.log(event);
  }
  searchHistory( requireFirst?: boolean, isToday?: boolean) {
    if ( requireFirst ) {
      this.page.pageNumber = 0;
    }

    if ( isToday === true ) {
      this.searchFromDate = new Date();
      this.searchToDate = new Date();
    }

    const data = {
      school:
        this.searchSchoolText &&
        this.searchSchoolText[0] &&
        this.searchSchoolText[0]['id'] &&
        this.searchSchoolText[0]['id']['_id']
          ? this.searchSchoolText[0]['id']['_id']
          : '',
      title:
        this.searchTitleText &&
        this.searchTitleText[0] &&
        this.searchTitleText[0]['id']
          ? this.searchTitleText[0]['id']
          : '',
      test:
        this.searchTestText &&
        this.searchTestText[0] &&
        this.searchTestText[0]['id']
          ? this.searchTestText[0]['id']
          : '',
      usertype:
        this.searchUserTypeText &&
        this.searchUserTypeText[0] &&
        this.searchUserTypeText[0]['id']
          ? this.searchUserTypeText[0]['id']
          : '',
      user:
        this.searchUserText &&
        this.searchUserText[0] &&
        this.searchUserText[0]['id']
          ? this.searchUserText[0]['id']
          : '',
      notificationReference:
        this.searchNotificationRefText &&
        this.searchNotificationRefText[0] &&
        this.searchNotificationRefText[0]['id']
          ? this.searchNotificationRefText[0]['id']
          : '',
      subject: this.searchSubjectText,
      fromDate : this.searchFromDate ? this.getYearMonthDate(this.searchFromDate) : '',
      toDate: this.searchToDate ? this.getYearMonthDate(this.searchToDate) : ''
    };

    log.data('history Postdate', data);
    this.taskservice.historyFilter(data, this.page, this.sort).subscribe(response => {
      this.isSearching = true;
      this.historyList = response.data;
      this.page.totalElements = response.total;
    });
  }

  getYearMonthDate(fullDateString): string {
    const date = new Date(fullDateString);

    const dateMonth = date.getMonth() + 1 > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString();

    const dateDay = date.getDate() + 1 > 9 ? date.getDate().toString() : '0' + date.getDate().toString();

    const dateString = `${date.getFullYear()}-${dateMonth}-${dateDay}`;

    return dateString;
  }

  checkForUserTypesArray(types, typeId) {
    const type = _.findIndex(types, function(t) {
      return t._id === typeId;
    });
    if (type > -1) {
      return true;
    } else {
      return false;
    }
  }

  getTranslateWhat(name) {
    if (name) {
      const value = this.translate.instant(
        'TEST.AUTOTASK.' + name.toUpperCase()
      );
      return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
    } else {
      return '';
    }
  }

  viewdialog(data) {
    let self = this;
    this.dialogRefViewHistory = this.dialog2.open(
      ViewHistoryComponent,
      this.sendMailBoxView
    );
    this.dialogRefViewHistory.componentInstance.viewMessageData = data;
    this.dialogRefViewHistory.componentInstance.allHistory = this.historyList;
    this.dialogRefViewHistory.afterClosed().subscribe(result => {
      this.dialogRefViewHistory = null;
    });
  }

  forwardTask(data) {
    let self = this;
    console.log(data.notificationMessage);
    let re = new RegExp('<a ([^]+)>[^"]+a>', 'g');
    data.notificationMessage = data.notificationMessage.replace(re, '');
    console.log(data.notificationMessage);

    let convertToMailSchema = [];
    convertToMailSchema['senderProperty'] = {
      sender: data && data.from ? data.from : {}
    };
    convertToMailSchema['isUrgentMail'] = false;
    convertToMailSchema['recipientProperty'] = [];
    convertToMailSchema['recipientProperty'].push({ recipient: data.to });
    convertToMailSchema['attachments'] = [];
    convertToMailSchema['subject'] = data.notificationSubject;
    convertToMailSchema['createdAt'] = data.createdAt;
    convertToMailSchema['message'] = data.notificationMessage;

    this.dialogRefForWardHistory = this.dialog2.open(
      ForwardHistoryComponent,
      this.sendMailBox
    );
    this.dialogRefForWardHistory.componentInstance.student = [];
    this.dialogRefForWardHistory.componentInstance.tags = ['foward-mail'];
    this.dialogRefForWardHistory.componentInstance.subjectName =
      data.notificationSubject;
    this.dialogRefForWardHistory.componentInstance.currentMailData = convertToMailSchema;
    this.dialogRefForWardHistory.afterClosed().subscribe(result => {
      this.dialogRefForWardHistory = null;
      self.checkCurrentMode();
    });
  }

  getAllSchools() {
    this.custService.getCustomersList(this.page, this.sort).then(ListData => {
      const data = ListData.data;
      this.schoolsLists = [];
      if (data) {
        data.forEach(rep => {
          this.schoolsLists.push({
            id: rep,
            text: rep.shortName
          });
        });
      }
      this.schoolsLists = this.schoolsLists.sort(this.keysrt('text'));
    });
  }

  getAllRNCPTitles() {
    this.titlesService.getAllRNCPTitlesShortName().subscribe(response => {
      if( response ) {
        log.data('titlesService.getAllRNCPTitlesShortName() response', response)
        this.allRNCPTitles = response.data;
      }
    });
  }

  getAllNotificationReference() {
    this.taskservice.getNotificationReference().subscribe(response => {
      if ( response && response.data ) {
        this.notificationRefLists = response.data.sort();
      }
    });
  }

  getAllUserTypesByIsUserCollection() {
    this.service.getUserTypesByIsUserCollection().subscribe(response => {
      this.allUserTypes = response;
      console.log(response);
      this.userTypeLists = [];

      this.allUserTypes.forEach(item => {
        const typeEntity =
          this.utilityservice.getTranslateADMTCSTAFFKEY(item.name) +
          ' / ' +
          this.utilityservice.getTranslateENTITY(item.entity);
        this.userTypeLists.push({ id: item._id, text: typeEntity });
      });
      this.userTypeLists = this.userTypeLists.sort(this.keysrt('text'));
    });
  }


  getMinDatevalidation() {
    // [min]="this.searchFromDate"
    return this.searchFromDate ? new Date(new Date().setDate(new Date(this.searchFromDate).getDate() + 1)) : null;
  }
}
