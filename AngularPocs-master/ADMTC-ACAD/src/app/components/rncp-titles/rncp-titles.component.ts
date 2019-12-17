import { Component, ViewChild, OnInit, Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { Router } from '@angular/router';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import { TranslateService } from 'ng2-translate';
import { MdButtonToggleGroup, MdDialogRef, MdDialogConfig, MdDialog } from '@angular/material';
import { MailService } from '../../services/mail.service';
import { DisplayMailPopupComponent } from '../Mail/display-mail-popup/display-mail-popup.component';
import _ from 'lodash';
import { LoginService } from 'app/services/login.service';
import { UtilityService } from '../../services/utility.service';
import { TableFilterStateService } from '../../services/table-fliter-state.service';

declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
import { AlertService } from '../../services/alert.service';
const log = Log.create('RncpTitlesComponent');
log.color = 'grey';


@Component({
  selector: 'app-rncp-titles',
  templateUrl: './rncp-titles.component.html',
  styleUrls: ['./rncp-titles.component.scss'],
  providers: [MailService]
})

export class RncpTitlesComponent implements OnInit, OnDestroy {
  @ViewChild(MdButtonToggleGroup) mdToggleButtonGroup: MdButtonToggleGroup;
  RNCPSearchItem;
  showUnregisteredStudentSweetAlert = true;
  textSearch = '';
  rncpTitles: any = [];
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
  public dialogRefDisplayMail: MdDialogRef<DisplayMailPopupComponent>;
  DisplayMailPopupConfig: MdDialogConfig = {
    disableClose: true,
    width: '850px',
    height: '65%'
  };
  checkadmtc = false;
  newAlert = false;
  getAlertUserList: any;


  constructor(private service: RNCPTitlesService,
    private router: Router,
    private translate: TranslateService,
    private MailService: MailService,
    public dialog: MdDialog,
    public loginService: LoginService,
    public utilityService: UtilityService,
    private tableFilterStateService: TableFilterStateService,
    private alertService: AlertService
  ) {
    log.info('Constructor Invoked');

    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = 'shortName';
    this.sort.sortmode = 'asc';
  }
  doButtonReset() {
    this.mdToggleButtonGroup.selected = null;
  }

  ngOnInit() {
    this.user = this.loginService.getLoggedInUser();
    this.checkUnregisterdStudents();
    this.service.resetState();
    this.getTitleList();
    this.doButtonReset();
    this.checkuserType();
    this.checkifUrgentMessage();
    this.checkIfNewAlert();
  }

  ngOnDestroy() {
    log.info('ngOnDestroy Invoked');
  }

  automate() {
    const demoId = '1';
    this.service.selectRncpTitle(demoId).subscribe(title => {
      this.router.navigate(['dashboard']);
    });
  }

  getTranslated(text: string) {
    return this.translate.instant(text);
  }

  goToRncpTitle(id: any): void {
    this.service.selectRncpTitle(id)
    .subscribe(() => {
      this.tableFilterStateService.pendingTaskListFilterState = null ;
      this.router.navigate(['dashboard']);
    });
  }

  getTitleList(): void {
    log.info('Loading Rncp Titles');
    this.service.getRNCPTitleListView(this.page, this.sort).subscribe((titles) => {
      this.rncpTitles = titles.titles;
      this.RNCPSearchItem = this.rncpTitles;
      this.page.totalElements = titles.total;
      log.data('rncp', this.rncpTitles);
      const a = _.uniqBy(this.rncpTitles, 'certifier.shortName');
      this.certifier = _.sortBy(a, 'certifier.shortName');
    });
  }

  //TODO: Remove this function if not required
  // changePage(pageInfo): void {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getTitleList();
  // }

  // sortPage(sortInfo): void {
  //   this.sort.sortby = sortInfo.column.prop;
  //   this.sort.sortmode = sortInfo.newValue;
  //   this.page.pageNumber = 0;
  //   this.getTitleList();
  // }
  //END TODO: Remove this function if not required

  searchRNCP(event) {
    this.doButtonReset();
    if (this.RNCPSearchItem !== '' && event.target.value) {
      const val = event.target.value.toLowerCase();
      const temp = _.filter(this.RNCPSearchItem, function (d) {
        if (d.shortName && d.shortName) {
          return ((d.shortName !== '' && d.shortName.toLowerCase().indexOf(val) !== -1) ||
            (d.longName.toLowerCase().indexOf(val) !== -1 && d.longName !== '') ||
            (d.certifier && d.certifier.shortName !== '' && d.certifier.shortName.toLowerCase().indexOf(val) !== -1));
        }
      });
      this.rncpTitles = temp;
    } else {
      this.rncpTitles = this.RNCPSearchItem;
    }
  }

  select(val) {
    if (val) {
      if (val === 'All') {
        this.rncpTitles = this.RNCPSearchItem;
        this.textSearch = '';
        this.doButtonReset();
      } else {
        const dataList = _.filter(this.RNCPSearchItem, function (d) {
          if (d.certifier && d.certifier.shortName) {
            return d.certifier.shortName === val;
          }
        });
        this.textSearch = '';
        this.rncpTitles = dataList;
      }
    }
  }
  checkifUrgentMessage() {
    this.MailService.urgentMail().then(response => {
      console.log('response', response);
      if (response.data.length > 0) {
        this.checkifUrgent = response.data[0];
        console.log('response of read', response.data[0].recipientProperty[0].isRead, response.data[0])
        let readData = false;
        const recipientsList = response.data[0].recipientProperty;
        const currentLogin = this.loginService.getLoggedInUser()
        if (Array.isArray(recipientsList)) {
          recipientsList.forEach((recipient) => {
            if (recipient.recipient[0] === currentLogin.email) {
              readData = recipient.isRead;
            }
          });
        }
        const tags = response.data[0].tags;
        if (readData === false && this.checkadmtc === false && tags.indexOf('compose-new') > -1) {
          this.OpnDisplayPopup();
        }
      }
    });
  }

  checkIfNewAlert(){
    const currentLogin = this.loginService.getLoggedInUser();
    console.log(currentLogin);
    this.alertService.getListOfAlertUsertype().subscribe((res: any) => {
      this.getAlertUserList = res.data;
      console.log('inside 1', this.getAlertUserList);

     if(this.getAlertUserList && this.getAlertUserList.published === true){
      console.log('inside 1', this.getAlertUserList.published);
        this.newAlert = true;
     }


     if(this.newAlert === true ){
       this.OpnDisplayAlertPopup();
     }
    });





  }


  OpnDisplayAlertPopup(){
    this.dialogRefDisplayMail = this.dialog.open(DisplayMailPopupComponent, this.DisplayMailPopupConfig);
    if(this.newAlert === true){
      this.dialogRefDisplayMail.componentInstance.newAlert = true;
      this.dialogRefDisplayMail.componentInstance.alertData = this.getAlertUserList;
    }
  }
  OpnDisplayPopup() {

    

    this.dialogRefDisplayMail = this.dialog.open(DisplayMailPopupComponent, this.DisplayMailPopupConfig);
    this.dialogRefDisplayMail.componentInstance.operation = 'edit';
    this.dialogRefDisplayMail.afterClosed().subscribe(result => {
      this.dialogRefDisplayMail = null;
    });
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
  checkUnregisterdStudents() {
    if (this.utilityService.checkUserIsAcademicDirector() && localStorage.getItem('showUnregisteredStudentAlert') === 'true') {
      const body = {
        rncpId: this.user.assignedRncpTitles,
        schoolId: [this.user.entity.school._id]
      };
      this.service.getUnregisteredStudents(body).subscribe(res => {
        const students = res.total < 10 ? res.data : res.data.slice(0, 9);
        if (res.total > 0) {
          let str = '<ol style="display:inline-block;">';
          students.forEach(element => {
            str += '<li style="text-align:left !important;">' +
              this.utilityService.computeCivility(element.sex, this.translate.currentLang.toUpperCase())
              + ' ' + element.firstName + ' ' + element.lastName + '</li>';
          });
          str += '</ol>';
          this.translate.reloadLang(this.translate.currentLang).subscribe(() => {
            swal({
              title: this.translate.instant('WHEN_UNREGISTERED_STUDENTS.TITLE'),
              html: this.translate.instant('WHEN_UNREGISTERED_STUDENTS.TEXT', { studentlist: str }),
              type: 'warning',
              allowEscapeKey: true,
              confirmButtonClass: 'btn-danger',
              confirmButtonText: this.translate.instant('WHEN_UNREGISTERED_STUDENTS.BUTTON'),
              closeOnConfirm: false,
            }).then(function (isConfirm) {
              if (isConfirm) {
                localStorage.setItem('showUnregisteredStudentAlert', JSON.stringify(false));
              } else {
                localStorage.setItem('showUnregisteredStudentAlert', JSON.stringify(false));
                this.cancel();
              }
            }.bind(this));
          });
        }
      });
    }
  }
}
