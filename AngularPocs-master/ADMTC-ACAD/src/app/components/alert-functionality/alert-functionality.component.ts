import { Component, OnInit } from '@angular/core';
import { AddAlertDialogComponent } from './add-alert-dialog/add-alert-dialog.component';
import { MdDialogRef, MdDialogConfig, MdDialog } from '@angular/material';
import { AlertService } from 'app/services/alert.service';
import { TranslateService } from 'ng2-translate';
import _ from 'lodash';
import { AlertUserResponseDialogComponent } from './alert-user-response-dialog/alert-user-response-dialog.component';
import { AppSettings } from '../../app-settings';
declare var swal: any;
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { UtilityService } from 'app/services';
import { Page } from 'app/models/page.model';
import { Sort } from 'app/models/sort.model';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-alert-functionality',
  templateUrl: './alert-functionality.component.html',
  styleUrls: ['./alert-functionality.component.scss']
})
export class AlertFunctionalityComponent implements OnInit {
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
  configSchool: MdDialogConfig = {
    disableClose: false,
    width: '800px'
  };
  dialogref: MdDialogRef<AddAlertDialogComponent>;
  dialogrefCount: MdDialogRef<AlertUserResponseDialogComponent>;
  listOfAlerts: any;
  listOfAlertsTemp = [];
  loggedID: any;
  loggeduserId: string;
  buttonCount: any;
  searchableAlertsList = [];
  listfinal: any;
  selectedDelimiter: any;
  listForCSV: any;
  alertsTitle = '';
  alertStatus = 'ALL';
  CSVFileName: string;

  selectedSearchedAlert = [];


  constructor(
    public dialog: MdDialog,
    private alertService: AlertService,
    private translate: TranslateService,
    public utilityService: UtilityService
  ) {
    this.loggedID = this.alertService.getLoggedUser();
    this.loggeduserId = this.loggedID._id;
  }

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = 20;
    this.page.totalElements = 0;
    this.sort.sortby = 'createdAt';
    this.sort.sortmode = 'desc';
    this.getAllAlert();

    // this.updateUnreadCount();
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.name;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
    this.getAllAlert();
  }

  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
  }

  onSort(event, data) {
    const prop = event.column.prop;
    const dir = event.newValue;
    const rows = [..._.orderBy([...this.listOfAlerts], [prop], [dir])];

    this.listOfAlerts = [...rows];
  }
  getTranslateUserType(name) {
    let value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  getFiltered() {
    const titleid = this.selectedSearchedAlert.length && this.selectedSearchedAlert[0].id ? this.selectedSearchedAlert[0].id : '';
    const alertstatus = this.alertStatus;

    if (titleid) {
      this.listOfAlerts = _.filter([...this.listOfAlertsTemp], (t) => t._id === titleid);
    } else if (this.alertStatus !== 'ALL') {
      this.listOfAlerts = _.filter([...this.listOfAlertsTemp], (t) => t.published.toString() === this.alertStatus);
    }
    // this.alertService
    //   .getFilteredAlertList(status, titleid)
    //   .subscribe((res: any) => {
    //     this.listOfAlerts = res.data;
    //     this.searchableAlertsList = [];
    //     if (res) {
    //       this.listOfAlerts.forEach(item => {
    //         if (item._id) {
    //           this.searchableAlertsList.push(item._id);
    //         }
    //       });
    //     }
    //   });
  }

  clearFields() {
    this.alertsTitle = '';
    this.alertStatus = 'ALL';
    this.selectedSearchedAlert = [];
    this.getAllAlert();
  }
  getCsvDetail(id: any) {
    this.alertService.getDetailsForCsv(id).subscribe((res: any) => {
      this.CSVFileName = res.data.fileName;
      this.listForCSV = res.data.response;

      const allStudentList = _.orderBy(this.listForCSV, ['firstName'], ['asc']);
      this.generateCsv(allStudentList);
    });
  }
  generateCsv(CSVData) {
    const studentsBeingExported = CSVData.map(alert => {
      let usertype = '';
      alert.userType.forEach(element => {
        usertype += element + ',';
      });

      return {
        civ: _.get(alert, 'civ', ''),
        firstName: _.get(alert, 'firstName', ''),
        lastName: _.get(alert, 'lastName', ''),
        school: _.get(alert, 'school', ''),
        dsf: usertype,
        responsedAt: _.get(alert, 'responsedAt', ''),
        response: _.get(alert, 'response', '')
      };
    });

    const options = {
      fieldSeparator:
        this.selectedDelimiter === 'tab' ? '\t' : this.selectedDelimiter,
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: [
        this.translate.instant('ALERT_FUNCTIONALITY.CSV_HEADER.Civ'),
        this.translate.instant('ALERT_FUNCTIONALITY.CSV_HEADER.FirstName'),
        this.translate.instant('ALERT_FUNCTIONALITY.CSV_HEADER.LastName'),
        this.translate.instant('ALERT_FUNCTIONALITY.CSV_HEADER.School'),
        this.translate.instant('ALERT_FUNCTIONALITY.CSV_HEADER.UserType'),
        this.translate.instant('ALERT_FUNCTIONALITY.CSV_HEADER.Date_and_Time'),
        this.translate.instant('ALERT_FUNCTIONALITY.CSV_HEADER.Answer')
        // this.translate.instant('ALERT_FUNCTIONALITY.CSV_HEADER.FirstName'),
        // 'Civ',
        // 'FirstName',
        // 'LastName',
        // 'School',
        // 'UserType',
        // 'Date and Time',
        // 'Answer'
      ]
    };

    const setCSVFileName = this.CSVFileName;

    new Angular2Csv(studentsBeingExported, setCSVFileName, options);
  }

  openResponseDialog(rowdata) {
    const inputOptions = {
      ',': this.translate.instant('Export_S1.COMMA'),
      ';': this.translate.instant('Export_S1.SEMICOLON'),
      tab: this.translate.instant('Export_S1.TAB')
    };

    const data = {
      button1: rowdata.button1,
      button2: rowdata.button2
    };

    this.alertService
      .getButtonCount(rowdata._id, data)
      .subscribe((res: any) => {
        this.buttonCount = res.data;
        if (rowdata.requiredResponse === false) {
          swal({
            type: 'warning',
            title: this.translate.instant(
              'ALERT_FUNCTIONALITY.POPUP.NOT_ANSWER'
            ),
            html:
              '<div>' +
              '<div style="width:50%;  background-color:black;color:white; float:left">' +
              this.translate.instant('ALERT_FUNCTIONALITY.POPUP.TOTAL_CLICK', {
                button: rowdata.button1
              }) +
              '</div>' +
              '<div style="width:50%;background-color:black; color:white; float:right">' +
              this.translate.instant('ALERT_FUNCTIONALITY.POPUP.TOTAL_CLICK', {
                button: rowdata.button2
              }) +
              '</div>' +
              '<div style="width:50%; color:white; background-color: #3a4b53; float:left">' +
              this.buttonCount.button1 +
              '</div>' +
              '<div style="width:50%; color:white; background-color: #3a4b53; float:right">' +
              this.buttonCount.button2 +
              '</div><p>' +
              this.translate.instant('ALERT_FUNCTIONALITY.POPUP.text') +
              '</p>',
            showCancelButton: true,
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant(
              'ALERT_FUNCTIONALITY.POPUP.DOWNLOAD'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
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
          }).then(
            separator => {
              this.selectedDelimiter = separator;
              this.getCsvDetail(rowdata._id);
            },
            function(dismiss) {
              if (dismiss === 'cancel' || dismiss === 'close') {
                // ignore
              }
            }
          );
        } else {
          swal({
            type: 'warning',
            title: this.translate.instant('ALERT_FUNCTIONALITY.POPUP.ANSWER'),
            html:
              '<div><hr><p>' +
              this.translate.instant('ALERT_FUNCTIONALITY.POPUP.text') +
              '</p></div>',
            showCancelButton: true,
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant(
              'ALERT_FUNCTIONALITY.POPUP.DOWNLOAD'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
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
          }).then(
            separator => {
              this.selectedDelimiter = separator;
              this.getCsvDetail(rowdata._id);
            },
            function(dismiss) {
              if (dismiss === 'cancel' || dismiss === 'close') {
                // ignore
              }
            }
          );
        }
      });
  }

  openAlertDialog(action, data) {
    if (
      (action === 'edit' || action === 'duplicate') &&
      data.published === true
    ) {
      swal({
        title: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S4.TITLE'),
        html: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S4.TEXT'),
        type: 'error',
        allowEscapeKey: true,
        showCancelButton: false,
        confirmButtonText: this.translate.instant(
          'ALERT_FUNCTIONALITY.ALERT_S4.BUTTON'
        )
      });
    } else {
      this.dialogref = this.dialog.open(
        AddAlertDialogComponent,
        this.configSchool
      );
      if (action === 'edit') {
        this.dialogref.componentInstance.selectedAlert = data;
      }
      if (action === 'duplicate') {
        if (data) {
          console.log('duplicate', data);
          data.name = '';
          data._id = '';
        }
        this.dialogref.componentInstance.selectedAlert = data;
      }
      this.dialogref.afterClosed().subscribe(value => {
        if(value === 'refresh') {
          this.getFiltered();
        }
      });
    }
  }

  getAllAlert() {
    this.searchableAlertsList = [];
    this.alertService.getAllAlert().subscribe((res: any) => {
      this.listOfAlerts = res.data;
      this.listOfAlertsTemp = [...res.data];
      res.data.forEach((item) => {
        this.searchableAlertsList.push({ id: item._id, text: item.name });
      });
      this.searchableAlertsList = [...this.searchableAlertsList.sort(this.keysrt('text'))];
      // this.searchableAlertsList = res.data;
      this.page.totalElements = res.total;
    });
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) {
        return 1;
      } else if (a[key] < b[key]) {
        return -1;
      }
      return 0;
    };
  }

  deleteAlert(data: any) {
    if (data.published === true) {
      swal({
        title: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S4.TITLE'),
        html: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S4.TEXT'),
        type: 'error',
        allowEscapeKey: true,
        showCancelButton: false,
        confirmButtonText: this.translate.instant(
          'ALERT_FUNCTIONALITY.ALERT_S4.BUTTON'
        )
      });
    } else {
      let timeDisabled = AppSettings.global.timeDisabledinSecForSwalMini;
      swal({
        title: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S5.TITLE'),
        html: this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S5.TEXT', {
          alertTitle: data.name
        }),
        type: 'question',
        allowEscapeKey: true,
        showCancelButton: true,
        confirmButtonText: this.translate.instant(
          'ALERT_FUNCTIONALITY.ALERT_S5.BUTTON'
        ),
        cancelButtonText: this.translate.instant(
          'ALERT_FUNCTIONALITY.ALERT_S5.CANCEL'
        ),
        onOpen: () => {
          swal.disableConfirmButton();
          // const cancelBtnRef = swal.cancelButtonText;
          const confirmBtnRef = swal.getConfirmButton();
          const time = setInterval(() => {
            timeDisabled -= 1;
            confirmBtnRef.innerText =
              this.translate.instant('ALERT_FUNCTIONALITY.ALERT_S5.BUTTON') +
              ' in ' +
              timeDisabled +
              ' sec';
            // cancelBtnRef.innerText = this.translate.instant('ALERT_FUNCTIONALITY.PUBLISH.CANCEL');
          }, 1000);

          setTimeout(() => {
            confirmBtnRef.innerText = this.translate.instant(
              'ALERT_FUNCTIONALITY.ALERT_S5.BUTTON'
            );
            swal.showCancelButton = this.translate.instant(
              'ALERT_FUNCTIONALITY.ALERT_S5.CANCEL'
            );
            swal.enableConfirmButton();
            clearTimeout(time);
          }, timeDisabled * 1000);
        }
      }).then(
        () => {
          this.alertService.deleteAlert(data._id).subscribe((res: any) => {
            if (res) {
              swal({
                title: this.translate.instant(
                  'ALERT_FUNCTIONALITY.ALERT_S6.TITLE'
                ),
                html: this.translate.instant(
                  'ALERT_FUNCTIONALITY.ALERT_S6.TEXT',
                  {
                    name: data.name
                  }
                ),
                type: 'success',
                allowEscapeKey: true,
                showCancelButton: false,
                confirmButtonText: this.translate.instant(
                  'ALERT_FUNCTIONALITY.ALERT_S6.BUTTON'
                )
              });
              this.getAllAlert();
            }
          });
        },
        function(dismiss) {}
      );
    }
  }
}
