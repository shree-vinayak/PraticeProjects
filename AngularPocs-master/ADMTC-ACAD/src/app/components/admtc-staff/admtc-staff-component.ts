import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/users.service';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import { UserFilter } from '../../models/userfilter.model';
import { ADMTCStaffDialogComponent } from '../../dialogs/admtc-staff-menu-dialog/admtc-staff-menu-component';
import { PCUserDialogComponent } from '../../dialogs/pc-user-menu-dialog/pc-user-menu-component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { UtilityService } from '../../services/utility.service';
import { CustomerService } from '../customer/customer.service';
import _ from 'lodash';
import { CertifierSelection } from '../../shared/enums/certifierselection';
import { GlobalConstants } from '../../shared/settings/global-constants';
import { ComposeMailComponent } from 'app/components/Mail/compose-mail/compose-mail.component';
import { Subscription } from 'rxjs/Subscription';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { ConfigService } from '../../services/config.service';
import { SuperuserService } from '../../services/superuser.service';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as moment from 'moment';

// required for logging
import { Log } from 'ng2-logger';
const log = Log.create('ADMTCStaffComponent');
log.color = 'purple';

declare var swal: any;

@Component({
  selector: 'app-admtcusers',
  templateUrl: './admtc-staff-component.html',
  styleUrls: ['./admtc-staff-component.scss']
})
export class ADMTCStaffComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  users: any = [];
 // certifiers: any = [];
  RNCPTitles: any = [];
  allRNCPTitles = [];
  preparationCenter: any = [];
  allPreparationCenter: any = [];
  isPrepCenter: boolean = false;
  isSearching: boolean = false;
  userTypes: any = [];
  userList: any = [];
  currentLoginUser: any = '';
  certifier: string;
  rncptitle: string = '';
  searchText: string = '';
  statusFilterSelection: string = 'all';
  preparationcenterSearchString: string = '';
  RNCPSearchString: string = '';
  usertypeSearch: string = '';
  searchBy: string = '';
  schoolID: string;
  sortBY: string;
  selectedPrecenter: string = '';
  loggedInUserId: string;
  countRNCPTitles;
  allUserTypes = [];
  userFilterObject: UserFilter = new UserFilter();
  CertifierSelection = CertifierSelection;
  prepOrCertitfierDisp: boolean = false;
  changeRNCPTitleModel: any;
  changeUserTyepModel: any;
  selectedIndexForStudentsCard: number = 0;
  private _subscription: Subscription = new Subscription();

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
  // ADMTC staff dialog object
  admtcStaffDialogComponent: MdDialogRef<ADMTCStaffDialogComponent>;
  public dialogRef: MdDialogRef<ComposeMailComponent>;
  selectedUser = [];

  // ADMTC staff dialog property
  configCat: MdDialogConfig = {
    disableClose: false,
    width: '450px'
  };
  sendMailBox: MdDialogConfig = {
    disableClose: false,
    width: '1000px',
    height: '80%'
  };

  displayUserN6Icon: boolean = false;

  statusoptions = [
    {
      text: 'ALL',
      color: '',
      value: 'all'
    },
    {
      text: 'INCORRECT_EMAIL',
      color: 'red',
      value: 'incorrectEmail'
    },
    {
      text: 'PENDING',
      color: 'black',
      value: 'notRegistered'
    },
    {
      text: 'ACTIVE_STATUS',
      color: 'greenyellow',
      value: 'registered'
    }
  ];

  selectedDelimiter = ''; // For Export User
  

  /*************************************************************************
   *   CONSTRUCTOR
   *************************************************************************/
  constructor(
    private service: UserService,
    private router: Router,
    private dialog: MdDialog,
    private translate: TranslateService,
    public utilityservice: UtilityService,
    private schoolService: CustomerService,
    public dialog2: MdDialog,
    private rncpTitleService: RNCPTitlesService,
    private configService: ConfigService,
    private superuserService: SuperuserService
  ) {}

  /*************************************************************************
   *   EVENTS
   *************************************************************************/
  ngOnInit() {
    const logInUser = JSON.parse(localStorage.getItem('loginuser'));
    this.loggedInUserId = logInUser._id;

    // this.service.getAllCertifier().subscribe(response => {
    //   this.certifiers = response;
    // });

    // this.service.getAllRNCPTitles().subscribe((response) => {
    //   this.RNCPTitles = response.data;
    //   this.allRNCPTitles = response.data;
    //   this.countRNCPTitles = this.allRNCPTitles.length;
    // });
    this.service.getAllRNCPTitlesShortName().subscribe(response => {
      const data = response.data;
      this.RNCPTitles = [];
      if (data) {
        data.forEach(rep => {
          this.RNCPTitles.push({
            id: rep._id,
            text: rep.shortName
          });
        });
      }
      this.RNCPTitles = this.RNCPTitles.sort(this.keysrt('text'));
      this.allRNCPTitles = this.RNCPTitles;
      this.countRNCPTitles = this.allRNCPTitles.length;
      log.info('countRNCPTitles', this.countRNCPTitles);
    });

    this.page.pageNumber = 0;
    // this.page.size = GlobalConstants.NoOfRecordsPerPage;
    this.page.size = 1000;
    this.page.totalElements = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    this.getUserList();

    this.service.getUserTypesByIsUserCollection(true).subscribe(response => {
      this.allUserTypes = response;
      this.userTypes = [];

      this.allUserTypes.forEach(item => {
        const typeEntity =
          this.getTranslateADMTCSTAFFKEY(item.name) +
          ' / ' +
          this.getTranslateENTITY(item.entity);
        this.userTypes.push({ id: item._id, text: typeEntity });
      });
      this.userTypes = this.userTypes.sort(this.keysrt('text'));
      this.page.totalPages = Math.ceil(this.userTypes.length / 10);
    });
    this._subscription = this.translate.onLangChange.subscribe(params => {
      if (this.allUserTypes !== []) {
        this.userTypes = [];
        this.allUserTypes.forEach(item => {
          const typeEntity =
            this.getTranslateADMTCSTAFFKEY(item.name) +
            ' / ' +
            this.getTranslateENTITY(item.entity);
          this.userTypes.push({ id: item._id, text: typeEntity });
        });
        this.userTypes = this.userTypes.sort(this.keysrt('text'));
      }
    });

    this.configService.getConfigDetails().subscribe(
      (data) => {
        if (data.notifications) {
          this.displayUserN6Icon = data.notifications.USER_N6;
        }
        log.data('getConfigDetails configurations', this.displayUserN6Icon);
      },
      (error) => {
        log.data('getConfigDetails data', error);
      }
    );
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._subscription.unsubscribe();
  }
  /*************************************************************************
   *   METHODS
   *************************************************************************/

  getUserList(): void {
    // New Things
    // All Records Fetched in One call hence Page no. should be 1 by default
    const noOfRecords = 0;
    // this.service
    //   .getAllRegisteredUsers(
    //     noOfRecords,
    //     this.certifier,
    //     this.rncptitle,
    //     this.preparationcenterSearchString,
    //     this.usertypeSearch,
    //     this.searchText,
    //     this.sort.sortby,
    //     this.sort.sortmode
    //   )
    //   .subscribe(response => {
    //     this.userList = null;
    //     this.userList = response.data;
    //     this.page.totalElements = response.total;
    //   });
      this.service
      .getAllUsersListView()
      .subscribe(response => {
        this.userList = null;
        this.userList = response.data;
        this.page.totalElements = response.total;
      });
      
  }

  searchUserList(isFirst: boolean): void {
    this.isSearching = true;
    this.userFilterObject.userName =
      this.searchText !== '' ? this.searchText : '';
    this.userFilterObject.rncpTitle =
      this.rncptitle !== '' ? this.rncptitle : '';
    this.userFilterObject.schoolId =
      this.selectedPrecenter !== '' ? this.selectedPrecenter : '';
    this.userFilterObject.userType =
      this.usertypeSearch !== '' ? this.usertypeSearch : '';
    this.userFilterObject.searchBy = this.searchBy;
    this.userFilterObject.userStatus = this.statusFilterSelection === 'all' ? '' : this.statusFilterSelection;
    this.page.size = 1000;
    this.page.totalElements = 0;

    // this.page.totalPages = 5;
    // All Records Fetched in One call hence Page no. should be 1 by default
    const pageNumber = 0;
    const numberofRecords = 0;
    this.service
      .getFilteredUserListView(this.userFilterObject, pageNumber, numberofRecords)
      .subscribe(response => {
        this.userList = null;
        this.userList = response.data;
        this.page.totalElements = response.total;
        this.page.pageNumber = response.paginate.page - 1;
        this.page.size = response.paginate.limit;
        this.page.totalPages = Math.ceil(response.total / 10);
      });
  }

  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    // if (this.isSearching) {
    //   this.searchUserList(false);
    // } else {
    //   this.getUserList();
    // }
  }

  changeUpdatePage(): void {
    if (this.isSearching) {
      this.searchUserList(false);
    } else {
      this.getUserList();
    }
  }

 

  sortPage(sortInfo): void {
    const sortMode = sortInfo.newValue;
    const sortBy = sortInfo.column.name;
    this.page.pageNumber = 0;
    let self = this;

    if (sortInfo.column.name === 'entity') {
      var arr = this.userList.map(function(x) {
        if (x.entity.groupOfSchools !== null) {
          if (x.entity.groupOfSchools.length > 0) {
            x.sortName = x.entity.groupOfSchools[0].shortName;
          }
        }
        if (x.entity.groupOfSchools !== null) {
          if (x.entity.groupOfSchools.length === 0) {
            if (x.entity.school !== undefined) {
              if (x.entity.school !== null) {
                x.sortName = x.entity.school.shortName;
              }
            }
          }
        }
        if (x.entity.groupOfSchools === null) {
          if (x.entity.school !== undefined) {
            if (x.entity.school !== null) {
              x.sortName = x.entity.school.shortName;
            }
          }
        }
        return x;
      });
      this.userList = _.orderBy(
        this.userList,
        ['sortName'],
        [sortInfo.newValue]
      );
    }

    // Implemented sort for assignT0 in all lang
    if (sortInfo.column.name === 'assignedRncpTitles[0].shortName') {
      var arr = this.userList.map(function(x) {
        if (x.assignedRncpTitles !== null) {
          if (x.assignedRncpTitles.length !== 0) {
            if (self.countRNCPTitles > x.assignedRncpTitles.length) {
              x.sortName = self.utilityservice.getTranslateADMTCSTAFFKEY(
                x.assignedRncpTitles[0].shortName
              );
            } else {
              x.sortName = self.translate.instant('USERS.ALL_RNCP_TITLES');
            }
          }
        }
        return x;
      });
      this.userList = _.orderBy(
        this.userList,
        ['sortName'],
        [sortInfo.newValue]
      );
    }

    // Implemented sort for usertypes in all lang
    if (sortInfo.column.name === 'types[0].name') {
      var arr = this.userList.map(function(x) {
        if (x.types !== null) {
          if (x.types.length !== 0) {
            x.sortName = self.utilityservice.getTranslateADMTCSTAFFKEY(
              x.types[0].name
            );
          }
        }
        return x;
      });
      this.userList = _.orderBy(
        this.userList,
        ['sortName'],
        [sortInfo.newValue]
      );
    }

    // Implemented sort for entityTypes in all lang
    if (sortInfo.column.name === 'entity.type') {
      var arr = this.userList.map(function(x) {
        if (x.entity !== null) {
          if (x.entity.type !== undefined) {
            x.sortName = self.getTranslateENTITY(x.entity.type);
          }
        }
        return x;
      });
      this.userList = _.orderBy(
        this.userList,
        ['sortName'],
        [sortInfo.newValue]
      );
    }

    if (sortInfo.column.name === 'lastName') {
      this.userList = _.orderBy(this.userList, [sortBy], [sortMode]);
    }
  }

  setLoginUser(id) {
    this.service.loginUser = id;
  }

  editUser(record) {
    this.ADMTCStaffDialog(record);
  }

  ADMTCStaffDialog(record) {
    const selfRef = this;
    this.service.loginUser = 1;
    this.admtcStaffDialogComponent = this.dialog.open(
      ADMTCStaffDialogComponent,
      this.configCat
    );
    if (record !== null) {
      this.admtcStaffDialogComponent.componentInstance.userid = record;
    }
    this.admtcStaffDialogComponent.afterClosed().subscribe(newCompanyName => {
      if (newCompanyName) {
        this.changeUpdatePage();
      }
      if (newCompanyName !== undefined) {
        this.service.addClass(newCompanyName).subscribe(response => {});
      }
    });
  }

  deleteRegisteredUser(
    id: string,
    sex: string,
    firstname: string,
    lastname: string
  ) {
    const civility = this.translate.instant(
      sex === 'M'
        ? 'USERS.ADDEDITUSER.CIVILITY.MR'
        : 'USERS.ADDEDITUSER.CIVILITY.MRS'
    );
    swal({
      title: 'Attention',
      text:
        this.translate.instant('USERS.MESSAGE.DELETECONFIRMMESSAGE') +
        ' ' +
        civility +
        ' ' +
        firstname +
        ' ' +
        lastname +
        ' ' +
        ' ?',
      type: 'question',
      allowEscapeKey: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant('NO'),
      confirmButtonText: this.translate.instant('YES')
    }).then(
      () => {
        this.service.deleteRegisteredUser(id).subscribe(status => {
          if (status) {
            swal({
              title: this.translate.instant('USERS.MESSAGE.ADDTITLE'),
              text: this.translate.instant('USERS.MESSAGE.DELETESUCCESS'),
              allowEscapeKey: true,
              type: 'success',
              confirmButtonText: this.translate.instant(
                'JOBDESCRIPTIONFORM.S6.OK'
              )
            }).then(
              function() {
                // this.getUserList();
                this.changeUpdatePage();
              }.bind(this)
            );
          } else {
            swal({
              title: 'Attention',
              text: this.translate.instant('USERS.MESSAGE.DELETEFAILED'),
              allowEscapeKey: true,
              type: 'warning'
            });
          }
        });
      },
      function(dismiss) {
        if (dismiss === 'cancel') {
        }
      }
    );

    this.page.pageNumber = 0;
  }

  openPopUpForEditDialog(id) {
    const self = this;
    this.admtcStaffDialogComponent = this.dialog.open(
      ADMTCStaffDialogComponent,
      this.configCat
    );
    if (id !== null) {
      this.admtcStaffDialogComponent.componentInstance.userid = id;
    }
    this.admtcStaffDialogComponent.afterClosed().subscribe(newCompanyName => {
      if (newCompanyName) {
        self.changeUpdatePage();
      }
    });
  }

  changeSelection(event) {
    if (event.value) {
      this.prepOrCertitfierDisp = true;
      this.selectedPrecenter = '';
      this.searchBy = event.value;
      this.searchUserList(true);
      switch (event.value) {
        case 'certifier':
          this.getCertifier();
          break;
        case 'preparation-center':
          this.getPerparationCenter();
          break;
      }
      this.RNCPTitles = this.allRNCPTitles;
    }
  }

  getCertifier(initiated = false) {
    const self = this;
    this.schoolService.getAllCertifierSorted().then(res => {
      const data = res.data;
      log.data('getCertifier res.data', res.data);
      this.preparationCenter = [];
      if (data) {
        data.forEach(item => {
          if (item.certifier) {
            this.preparationCenter.push(item.certifier);
            this.allPreparationCenter.push(item.certifier);
          }
        });
        if (!initiated) {
          this.preparationcenterSearchString = '';
        }
        log.data('this.preparationCenter', this.preparationCenter);
        this.isPrepCenter = false;
      }
    });
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

  getPerparationCenter(initiated = false) {
    const self = this;
    const page = {
      pageNumber: 0
    };
    const sort = {
      sortby: 'shortName',
      sortmode: 'asc'
    };
    this.schoolService.getCustomersList(page, sort).then(res => {
      this.preparationCenter = res.data;
      this.allPreparationCenter = res.data;
      if (!initiated) {
        this.preparationcenterSearchString = '';
      }
      this.isPrepCenter = true;
    });
  }

  searchSchoolList(event) {
    if (this.preparationcenterSearchString !== '') {
      const val = event.target.value.toLowerCase();
      const temp = this.preparationCenter.filter(function(d) {
        return (
          d.shortName !== '' && d.shortName.toLowerCase().indexOf(val) !== -1
        );
      });
      this.preparationCenter = temp;
    } else {
      this.preparationCenter = this.allPreparationCenter;
      this.RNCPTitles = this.allRNCPTitles;
      this.selectedPrecenter = '';
    }
  }

  selectedPrepcentre(school) {
    const filteredRNCP = [];
    this.RNCPTitles = this.allRNCPTitles;
    log.data('selectedPrepcentre(prepCenter)', school);
    log.data(
      'selectedPrepcentre(prepCenter) this.allRNCPTitles',
      this.RNCPTitles
    );
    this.selectedPrecenter = school._id;
    this.searchUserList(true);
    if (this.isPrepCenter) {
      school.rncpTitles.forEach(rncpTitle => {
        const rncps = _.filter(this.RNCPTitles, { id: rncpTitle._id });
        filteredRNCP.push(...rncps);
        log.data('selectedPrepcentre', filteredRNCP);
      });
      this.RNCPTitles = null;
      this.RNCPTitles = filteredRNCP;
      log.data('selectedPrepcentre RNCPTitles', this.RNCPTitles);
    } else {
      school.rncpTitles.forEach(rncpTitle => {
        const rncps = _.filter(this.RNCPTitles, { id: rncpTitle });
        filteredRNCP.push(...rncps);
        log.data('selectedPrepcentre', filteredRNCP);
      });
      this.RNCPTitles = null;
      this.RNCPTitles = filteredRNCP;
      log.data('selectedPrepcentre RNCPTitles', this.RNCPTitles);
    }
  }

  resetSearch() {
    this.userFilterObject = new UserFilter();
    this.searchText = '';
    this.rncptitle = '';
    this.selectedPrecenter = '';
    this.usertypeSearch = '';
    this.searchBy = '';
    this.preparationcenterSearchString = '';
    this.RNCPTitles = this.allRNCPTitles;
    this.prepOrCertitfierDisp = false;
    this.changeRNCPTitleModel = '';
    this.changeUserTyepModel = '';
    this.statusFilterSelection = 'all';

    log.data('resetSearch userFilterObject', this.userFilterObject);
    this.page.pageNumber = 0;
    this.page.size = 1000;
    // this.page.size = GlobalConstants.NoOfRecordsPerPage;
    this.page.totalElements = 0;
    this.page.totalPages = 5;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    this.getUserList();
    this.isSearching = false;
  }

  getTranslateENTITY(name) {
    let value = this.translate.instant(
      'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase()
    );
    return value !== 'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase()
      ? value
      : name;
  }
  getTranslateUserType(name) {
    let value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }
  filterAdmin(types) {
    const adminFlag = types.filter(type => type.name.toLowerCase() === 'admin');
    if (adminFlag.length === 1) {
      return true;
    } else {
      return false;
    }
  }
  getTranslateADMTCSTAFFKEY(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  sendMail(data) {
    this.selectedUser.push(data);
    this.dialogRef = this.dialog2.open(ComposeMailComponent, this.sendMailBox);
    // this.dialogRef.componentInstance.studentId = data._id;
    this.dialogRef.componentInstance.student = data;
    // this.dialogRef.componentInstance.selectedStudent = this.selectedUser;
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
    return false;
  }

  ChangeRNCPTitle(event) {
    if (event.id) {
      this.rncptitle = event.id;
      this.searchUserList(true);
    }
  }

  ChangeUserTitle(event) {
    if (event.id) {
      this.usertypeSearch = event.id;
      this.searchUserList(true);
    }
  }

  KeyPressSearchUserList(event) {
    if (event.keyCode == 13) {
      this.searchUserList(true);
    }
  }

  goToSelectedSchool(schoolid) {
    // Link To Go To Student Card Tab When Clicked on School Name in the User List
    const linkToSchoolStudentCardsTab = '/school/' + schoolid + '/edit/' + this.selectedIndexForStudentsCard;
    this.router.navigateByUrl(linkToSchoolStudentCardsTab);
  }

  goToRNCPDashboard(rncpid) {
    // To Go To ACAD Kit Of Selected RNCP Title
    this.rncpTitleService.selectRncpTitle(rncpid).subscribe(() => {
      this.router.navigate(['dashboard']);
    });
  }

  requestEmailCorrection(userDetails): void {
    log.data('requestEmailCorrection(userDetails)', userDetails);

    // Send Email Correction mail to ACAD Dir fir Confrimed by Swal
    const sendEmailToAcadDir = (isConfirm) => {
      this.service.requestCorrectionInEmailByAcad(userDetails._id, this.translate.currentLang.toLowerCase()).subscribe(
        (response) => {
          log.data('requestCorrectionInEmailByAcad response', response);
          if ( response.ok ) {
            this.changeUpdatePage();
            swal({
              type: 'success',
              title: this.translate.instant('SUCCESS'),
              allowEscapeKey: true,
              confirmButtonText: 'OK',
            });
          }
        },
        (error) => log.error(error)
      );
    }

    const userCivility = this.utilityservice.computeCivility(userDetails.sex, this.translate.currentLang.toUpperCase())

    swal({
      type: 'question',
      title: this.translate.instant('USER_S5.TITLE'),
      html: this.translate.instant('USER_S5.TEXT', {
        userCivility: userCivility,
        userFirstName: userDetails.firstName,
        userLastName: userDetails.lastName
      }),
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('USER_S5.SEND'),
      cancelButtonText: this.translate.instant('CANCEL')
    }).then( sendEmailToAcadDir, (dismiss) => {
        log.data('requestEmailCorrection(userDetails) dismiss', dismiss);
      }
    )
  }

  getUserAsPerStatus() {
    log.data('getUserAsPerStatus statusFilterSelection', this.statusFilterSelection);
    this.searchUserList(false);
  }
  
  superUserMode(userId) {
    if ( userId ) {
      log.data('superUserMode studentId', userId);
      this.superuserService.startSuperUserMode(userId).subscribe();
    }
  }

  // Code for Export Users

  onExportCSV() {
    const inputOptions = {
      ',': this.translate.instant('Export_S1.COMMA'),
      ';': this.translate.instant('Export_S1.SEMICOLON'),
      tab: this.translate.instant('Export_S1.TAB')
    };

    swal({
      type: 'question',
      title: this.translate.instant('Export_S1.TITLE'),
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('Export_S1.OK'),
      input: 'radio',
      inputOptions: inputOptions,
      inputValidator: value => {
        return new Promise((resolve, reject) => {
          if (value) {
            resolve();
          } else {
            reject(this.translate.instant('Export_S1.INVALID'));
          }
        });
      }
    }).then(separator => {
      this.selectedDelimiter = separator;
      this.exportUserCSV();
    });
  }

  exportUserCSV() {
    const users = this.userList.map( u => {
      let schools = '';
      let rncpList = '';
      let userTypes = '';
      let status = '';
      let zipCodes = '';
      let schoolCities = '';

      if (u.entity && u.entity.groupOfSchools && u.entity.groupOfSchools.length) {
        u.entity.groupOfSchools.forEach(s => {
          schools = schools + s.shortName + ', ';
          zipCodes = zipCodes + (s.schoolAddress && s.schoolAddress.postalCode ? (s.schoolAddress.postalCode + ', ') : '') ;
          schoolCities = schoolCities + (s.schoolAddress && s.schoolAddress.city ? (s.schoolAddress.city + ', ') : '') ;
        });
      } else if (u.entity && u.entity.school) {
        schools = u.entity.school.shortName ? u.entity.school.shortName : '';
        zipCodes =  u.entity.school.schoolAddress &&  u.entity.school.schoolAddress.postalCode ?  u.entity.school.schoolAddress.postalCode : '';
        schoolCities = u.entity.school.schoolAddress && u.entity.school.schoolAddress.city ? u.entity.school.schoolAddress.city : '';
      }

      if (u.assignedRncpTitles.length) {
        u.assignedRncpTitles.forEach(r => {
          rncpList = rncpList + r.shortName + ', ';
        });
      }

      if (u.types.length) {
        u.types.forEach(u => {
          userTypes = userTypes + this.getTranslateUserType(u.name) + ', ';
        });
      }

      if (u.status) {
        if (u.incorrectEmail) {
          status = this.translate.instant('STUDENT.MESSAGE.INCORRECT_EMAIL');
        } else if (!u.incorrectEmail && u.isRegistered) {
          status = this.translate.instant('STUDENT.MESSAGE.ACTIVE_STATUS');
        } else if (!u.incorrectEmail && !u.isRegistered) {
          status = this.translate.instant('STUDENT.MESSAGE.NONACTIVE_STATUS');
        }
      }

      return {
        'civility': this.utilityservice.computeCivility(u.sex, this.translate.currentLang),
        'firstName': u.firstName,
        'lastName': u.lastName,
        'schools': schools,
        'postalCode': zipCodes,
        'city': schoolCities,
        'rncp': rncpList,
        'entity': this.getTranslateENTITY(u.entity.type),
        'userTypes': userTypes,
        'status': status,
        'email': u.email,
        'creationDate': u.createdAt ? moment(u.createdAt).format('DD-MM-YYYY') : ''
      };
    });
    const options = {
      fieldSeparator: this.selectedDelimiter === 'tab' ? '\t' : this.selectedDelimiter,
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: [
        this.translate.instant('Export_Users.Civility'),
        this.translate.instant('Export_Users.FirstName'),
        this.translate.instant('Export_Users.LastName'),
        this.translate.instant('STUDENT_EXPORT_COLUMNS.SCHOOL'),
        this.translate.instant('Export_Users.SchoolZipCode'),
        this.translate.instant('Export_Users.SchoolCity'),
        this.translate.instant('STUDENT_EXPORT_COLUMNS.RNCPTITLE'),
        this.translate.instant('USERLISTTABLE.ENTITY'),
        this.translate.instant('Export_Users.Usertypes'),
        this.translate.instant('TASK.STATUS'),
        this.translate.instant('Export_Users.Email'),
        this.translate.instant('Export_Users.Date_Creation')
      ]
    };
  
    const setCSVFileName = this.translate.instant('Export_Users.Userlist') + ' ' + moment().format('DD-MM-YYYY');

    new Angular2Csv(users, setCSVFileName, options);
    swal({
      type: 'success',
      title: this.translate.instant('SUCCESS'),
      allowEscapeKey: true,
      confirmButtonText: 'OK'
    });
  }
}
