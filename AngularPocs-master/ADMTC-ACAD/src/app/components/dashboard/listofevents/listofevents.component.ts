import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { TestCorrectionService } from '../../../services/test-correction.service';
import { Router } from '@angular/router';
import { MdDialogConfig, MdDialogRef, MdDialog } from '@angular/material';
import { TestDetailsDialogComponent } from '../../../dialogs/test-details-dialog/test-details-dialog.component';
import { AcademicKitService } from '../../../services/academic-kit.service';
//import { Test } from '../../../shared/global-urls';
import { isNullOrUndefined } from 'util';
import { AddEventDialogComponent } from '../../../dialogs/add-event-dialog/add-event-dialog.component';
import { Event } from '../../../models/events.model';
import { TranslateService } from 'ng2-translate';
import { DashboardService } from '../../../services/dashboard.service';
import swal from 'sweetalert2';
import _ from 'lodash';
import { LoginService } from 'app/services/login.service';
@Component({
  selector: "list-of-events",
  templateUrl: "./listofevents.component.html",
  styleUrls: ["./listofevents.component.scss"],
  providers: [DashboardService]
})
export class ListOfEventsComponent implements OnInit {
  @Input() listofEvents;
  @Input() rncpTitle;
  loggedInUserId = '';
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
  selected;
  event = new Event();
  positionStack = [];
  schoolsList = [];

  configTest: MdDialogConfig = {
    disableClose: true,
    width: "600px",
    height: "80%",
    position: {
      top: "",
      bottom: "",
      left: "",
      right: ""
    }
  };

  configEvent: MdDialogConfig = {
    disableClose: false,
    width: '450px'
  };
  isEditable: boolean = false;

  allSchool = 'All Schools';
  test;
  rows = [];
  allListOfEvents = [];
  addEventDialogComponent: MdDialogRef<AddEventDialogComponent>;
  testDetailsDialog: MdDialogRef<TestDetailsDialogComponent>;
  constructor(
    private testCorrectionService: TestCorrectionService,
    private router: Router,
    private dialog: MdDialog,
    private acadkitservice: AcademicKitService,
    public translate: TranslateService,
    private dashboardService: DashboardService,
    private loginService: LoginService
  ) {
    this.selected = [];
    //this.rows = this.listofEvents;
  }

  ngOnInit() {
    const loggedInUserObj = this.loginService.getLoggedInUser();
    this.loggedInUserId = loggedInUserObj._id;
  }

  onActivate(event) {
  }

  onSelect(selected) {
    //  if(this.selected){
    if (!this.isEditable && selected.cellIndex !== 4) {
      this.openTestDetailsDialog(this.selected[0].test, this.selected[0]);
    }

    //  }

  }

  

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
    
    if (this.sort.sortby === 'shortName') {
      let self = this;

      var arr = this.listofEvents.map(function (x) {

        if(x.isAllSchools) {
          x.sortName = self.translate.instant('DASHBOARD.UPCOMINGEVENT.ALL_SCHOOLS');
        } else {
          if (x.schools.length > 0) {
              x.sortName = x.schools[0].shortName;
          }
        }
       return x;
        
    })
    
      this.listofEvents = _.orderBy(this.listofEvents, ['sortName'], [this.sort.sortmode]);
    } else {
      this.listofEvents = _.orderBy(this.listofEvents, [this.sort.sortby], [this.sort.sortmode]);
    }
  }

  goToTestCorrection(id: any) {
    this.testCorrectionService.selectTest(id);
    this.router.navigate(["test-correction"]);
  }

  openTestDetailsDialog(testid: any, row: any) {
    if (row.eventType === 'test') {
      console.log(this.acadkitservice.getTestStack());
      this.acadkitservice.getTest(testid).subscribe(response => {
        this.test = response;
        const stack = [...this.positionStack, 0];
        this.testDetailsDialog = this.dialog.open(
          TestDetailsDialogComponent,
          this.configTest
        );
        this.testDetailsDialog.componentInstance.test = this.test;
        this.testDetailsDialog.componentInstance.positionStack = stack;
        this.testDetailsDialog.afterClosed().subscribe(
          function (status) {
            if (status) {
              if (status.type === "move") {
                status.stack.pop();
                this.positionStack = status.stack;
              } else if (status.type === "edit") {
                status.stack.pop();
                this.positionStack = status.stack;
                this.router.navigateByUrl("/create-test");
              }
            }
          }.bind(this)
        );
      });
    } else {

    }

  }

  edit(data) {
    this.isEditable = true;
    const self = this;
    if (data && data._id !== null) {
      this.addEventDialogComponent = this.dialog.open(AddEventDialogComponent, this.configEvent);
      this.addEventDialogComponent.componentInstance.eventModel = data;
      this.addEventDialogComponent.afterClosed().subscribe((listofEvents) => {
        this.isEditable = false;
        self.dashboardService.getUpcomingEvents(self.rncpTitle._id).subscribe(res => {
          self.listofEvents = res;
        });
      });
    }
  }

  delete(data) {

    const self = this;
    swal({
      title: self.translate.instant('DASHBOARD.UPCOMINGEVENT.deletedTitle'),
      html: self.translate.instant('DASHBOARD.UPCOMINGEVENT.deletedMessage'),
      type: 'warning',
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonText: self.translate.instant('YES'),
      cancelButtonText: self.translate.instant('NO')
    }).then(function () {


      if (data._id) {
        self.dashboardService.deleteUpcominfEvents(data._id).subscribe((data) => {
          if (data.nModified === 1) {
            swal('Success', self.translate.instant('DASHBOARD.UPCOMINGEVENT.EVENTDELETESUCCESS'), 'success').then(function () {
              //  self.GetAllTasks();
              self.dashboardService.getUpcomingEvents(self.rncpTitle._id).subscribe(res => {
                self.listofEvents = res;
              });
            }.bind(this));
          }
          return data;
        });
      }

    }, function (dismiss) {
      if (dismiss === 'cancel') {
      }
    });

  }
}
