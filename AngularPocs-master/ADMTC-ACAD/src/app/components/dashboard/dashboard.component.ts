import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../models/category.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { AddCategoryDialogComponent } from '../../dialogs/add-category-dialog/add-category-dialog.component';
import { TestService } from '../../services/test.service';
import { DashboardService } from '../../services/dashboard.service';
import { AcademicKitService } from '../../services/academic-kit.service';
import { TranslateService } from 'ng2-translate';
import { Page } from '../../models/page.model';
import { SendMentorEvaluationComponent } from '../../dialogs/send-mentor-evaluation/send-mentor-evaluation.component';
import { acadkitCreateHelperComponent } from '../../dialogs/acadkit-create-helper/acadkit-create-helper.component';
import _ from 'lodash';
import { CustomerService } from '../customer/customer.service';
import { AddEventDialogComponent } from '../../dialogs/add-event-dialog/add-event-dialog.component';
import { Sort } from '../../models/sort.model';
import { LoginService } from '../../services/login.service';
import { UtilityService } from 'app/services/utility.service';
import { TableFilterStateService } from '../../services/table-fliter-state.service';
declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('DashboardComponent');
log.color = 'red';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  id;
  categories: Array<Category>;
  user;
  academicKit: any;
  searchPendingTask: string = '';
  @Input() rncpTitle: any;
  modifyCategoriesView = false;
  positionStack = [];
  sort = new Sort();
  isSearching: boolean = false;
  todoModetaskList = [];
  page = new Page();
  allUserTypes = [];
  schoolListforSelect = [];
  filterSchool: any = '';
  filterUsertype: any = '';
  userTypes = [];
  allSchools = [];
  allTypes = [];
  @Output() updateKit = new EventEmitter<boolean>();
  configExpectedDocTask: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };
  configCat: MdDialogConfig = {
    disableClose: false,
    width: '400px'
  };
  configMentor: MdDialogConfig = {
    disableClose: false,
    width: '80%',
    height: '90%'
  };
  configacadkitCreateHelper: MdDialogConfig = {
    disableClose: false,
    width: '70%',
    height: 'auto%'
  };
  configEvent: MdDialogConfig = {
    disableClose: false,
    width: '450px'
  };

  addEventDialogComponent: MdDialogRef<AddEventDialogComponent>;
  addCategoryDialog: MdDialogRef<AddCategoryDialogComponent>;
  sendMentorEvaluationDialog: MdDialogRef<SendMentorEvaluationComponent>;
  acadkitCreateHelperDialog: MdDialogRef<acadkitCreateHelperComponent>;
  // expectedDocumentDetailsTaskDialog: MdDialogRef<>;
  allPendingTask;
  @Input() listofEvents;

  validateIfAcademicKitExists: boolean;
  showPendingTasks: boolean = false;
  checkDialogForACADkit = true;
  schoolId: string = '';
  isUpcomingEvent: boolean = false;

  selectedCategoryIdToModify: string;

  constructor(private appService: RNCPTitlesService,
    private acadService: AcademicKitService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MdDialog,
    private translate: TranslateService,
    private testService: TestService,
    private dashboardService: DashboardService,
    private loginService: LoginService,
    public utilityService: UtilityService,
    private schoolService: CustomerService,
    private tableFilterStateService: TableFilterStateService) {
    log.info('Constructor Invoked');
    console.log('DashboardComponent :Constructor invoked');
    this.validateIfAcademicKitExists = true;
  }

  ngOnInit() {

    this.page.pageNumber = 0;
    this.page.size = 50;
    this.sort.sortmode = 'asc';
    this.sort.sortby = 'dueDate';

    // To set school-id if user is Chief of Group of Schools
    this.schoolId = this.schoolService.schoolId && this.utilityService.checkUserIsFromGroupOfSchools()
                    ? this.schoolService.schoolId : '';

    this.showPendingTasks = (this.utilityService.checkUserIsAcademicAdminDirector() ||
                             this.utilityService.checkUserIsDirectorSalesAdmin() ||
                             this.utilityService.checkUserIsAdminOrDirectorOfCertifier() ||
                             this.utilityService.checkUserIsFromGroupOfSchools());
    const loggedIn = this.loginService.getLoggedInUser();
    this.user = loggedIn;
    this.id = this.route.snapshot.params['id'];
    this.acadService.resetState();
    this.appService.getSelectedRncpTitle().subscribe((title) => {
      this.rncpTitle = title;
    });
    this.route.params.subscribe(params => {
      if (params['taskId'] && params['id']) {
        this.getDashboardData(params['id']);
        this.appService.selectRncpTitle(params['id']).subscribe(rncpTitleObj => {
          this.rncpTitle = this.rncpTitle ? this.rncpTitle : rncpTitleObj;
        });
      } else if (params['rncpId']) {
        this.route.queryParams.subscribe(qParams => {
          if (qParams && qParams.hasOwnProperty('goto') && qParams.goto === 'pending') {
            this.getDashboardData(params['rncpId'], false);
          } else {
            this.getDashboardData(params['rncpId'], true);
          }
          this.appService.selectRncpTitle(params['rncpId']).subscribe(rncpTitleObj => {
            this.rncpTitle = this.rncpTitle ? this.rncpTitle : rncpTitleObj;
          });
        });
      } else {
        // Since the details of RNCP title are already fetched. Do not reload the tree. 
        this.getDashboardData(this.rncpTitle._id,false,false);
      }
    });



    this.runScript();

  }

  ngOnChanges() {
    this.acadService.getAcademicKit().subscribe((kit) => {
      this.academicKit = kit;
    });
  }

  
  setFilterState() {
    const filterState = this.tableFilterStateService.pendingTaskListFilterState;
    log.data('setFilterState( filterState', filterState);
     if ( filterState ) {
       this.sort.sortby = filterState.sortby ? filterState.sortby : '';
       this.sort.sortmode = filterState.sortmode ? filterState.sortmode : 'asc';
       this.page.pageNumber = filterState.pageNumber ? filterState.pageNumber : 0;

       this.searchPendingTask = filterState.searchText ? filterState.searchText : '';
       this.filterSchool = filterState.school ? filterState.school : '';
       this.filterUsertype = filterState.userType ? filterState.userType : '';
       if (this.filterSchool.id) {
         this.schoolId = this.filterSchool.id;
       }
     }
   }

  openDialogForCloneBasic() {
    // show academic kit creation option PopUp only once.
    if (this.academicKit.categories) {
      if (this.academicKit.categories.length === 0) {
        // set validation flag to false, since you dont want to validate multiple times as the observables returns data.
        this.validateIfAcademicKitExists = false;
        this.openACADkitCreateHelperDialog();
        this.checkDialogForACADkit = false;
      }
    }

  }

  openACADkitCreateHelperDialog() {
    if (this.checkDialogForACADkit !== null) {
      this.acadkitCreateHelperDialog = this.dialog.open(acadkitCreateHelperComponent, this.configacadkitCreateHelper);
      this.acadkitCreateHelperDialog.componentInstance.rncpTitle = this.rncpTitle;
      this.acadkitCreateHelperDialog.afterClosed().subscribe((value) => {
        if (value.success) {
          this.academicKit = value.data.academicKit;
        }
      });
    }
  }


  runScript() {
    const self = this;
    document.onkeyup = function (evt) {
      if (evt.keyCode === 27) {
        const dialogCloseBtn = document.getElementById('BtnCloseDialog');
        if (dialogCloseBtn !== undefined && dialogCloseBtn != null) {
          dialogCloseBtn.click();
        }
      }
    };
  }

  automate() {
    this.acadService.createAcademicKit().subscribe(status => {
      if (status) {
        const newCat = new Category('Test Category', '', 'Description of Test Cateogry');
        this.acadService.addCategory(newCat).subscribe(category => {
          if (category) {
            this.academicKit.categories.push(category);
            this.positionStack.push(0);
            this.modifyCategoriesView = true;
          }
        });
      }
    });

  }

  createAcademicKit() {
    this.acadService.createAcademicKit().subscribe((status) => {
      if (status) {
        swal({
          title: 'Success',
          type: 'success',
          allowEscapeKey: true,
          confirmButtonText: 'OK'
        });
      } else {
        swal({
          title: 'Attention',
          type: 'warning',
          allowEscapeKey: true,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  addNewCategory() {
    this.addCategoryDialog = this.dialog.open(AddCategoryDialogComponent, this.configCat);
    this.addCategoryDialog.afterClosed().subscribe((value) => {
      if (value instanceof Category) {
        const newCat = value;
        newCat.parentRNCPTitle = this.rncpTitle._id;
        this.acadService.addCategory(newCat).subscribe(cat => {
          if (cat) {
            this.academicKit.categories.push(cat);
            this.acadService.updateKit();
          }
        });
      }
    });
    this.updateKit.emit(true);
  }

  updateCurrentKit(event) {
    this.appService.updateSelectedRncpTitle().subscribe((status) => {
      if (status) {
        this.appService.getSelectedRncpTitle().subscribe((data) => {
          this.academicKit = data.academicKit;
        });
      }
    });
  }

  goToCategoryList() {
    this.acadService.setModifyView(false);
    this.positionStack = [];
  }


  manageCategories() {
    this.positionStack = [];
    this.acadService.setModifyView(true);
  }

  manageCategory(event: Event) {
    console.log(event);
    this.positionStack = [event];
    this.acadService.setModifyView(true);
  }

  sendMentorEvaluation() {
    this.sendMentorEvaluationDialog = this.dialog.open(SendMentorEvaluationComponent, this.configMentor);
    this.sendMentorEvaluationDialog.componentInstance.rncpTitle = this.rncpTitle;
    this.sendMentorEvaluationDialog.afterClosed().subscribe((value) => {
    });
  }

  addEvent() {
    this.addEventDialogComponent = this.dialog.open(AddEventDialogComponent, this.configEvent);
    this.addEventDialogComponent.componentInstance.rncp = this.rncpTitle._id;
    this.addEventDialogComponent.afterClosed().subscribe((res) => {
      this.dashboardService.getUpcomingEvents(this.rncpTitle._id).subscribe((title) => {
        this.listofEvents = title;
        console.log(this.listofEvents);
      });
      // eventmodel.rncp = this.rncpTitle._id;
      // this.dashboardService.setUpcominfEvents(eventmodel).subscribe(res =>{
      //   console.log(res);
      // })
    });
  }


  filterPendingTask(searchText) {
  }

  searchinUser(pendingTask): string {
    if (pendingTask.task.userSelection) {
      if (pendingTask.task.userSelection.selectionType) {
        if (pendingTask.task.userSelection.selectionType === 'user') {
          return pendingTask.task.userSelection.name;
        } else if (pendingTask.task.userSelection.selectionType === 'userType') {
          return pendingTask.task.userSelection.name;
        } else { return ''; }
      } else { return ''; }
    } else { return ''; }
  }

  getTranslateName(name) {
    if (name) {
      const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
      return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
    } else {
      return '';
    }
  }

  scrollToCalender() {
    const domDocument = document.querySelector('#calendar');
    if (domDocument) {
      domDocument.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getDashboardData(rncpId, isUpcomingEvent: boolean=false,reloadTree:boolean=true) {
    this.isUpcomingEvent = isUpcomingEvent;
    if (!this.showPendingTasks) {
      this.dashboardService.getUpcomingEvents(rncpId).subscribe((title) => {
        this.listofEvents = title;
      });
    }

    if(reloadTree)
    {
      this.appService.getRNCPTitlesById(rncpId).subscribe((title) => {
        this.rncpTitle = title.data;
        this.academicKit = title.data.academicKit;
        this.openDialogForCloneBasic();
      });
    } else{
      this.academicKit = this.rncpTitle.academicKit;
      this.openDialogForCloneBasic();
    }
    this.acadService.getAcademicKit().subscribe((kit) => {
      this.academicKit = kit;
    });
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const stack = this.testService.getCurrentStack();
        if (stack.length > 0) {
          this.positionStack = stack;
        }
      }
    });
    this.acadService.getModifyView().subscribe((val) => {
      this.modifyCategoriesView = val;
    });
  }

  getTranslateWhat(name) {
    if (name) {
      const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
      return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
    } else {
      return '';
    }
  }


  checkForUserTypesArray(pendingTask, typeId) {
    const types = pendingTask.userSelection.userId.types;
    const type = _.findIndex(types, function (t) {
      return t._id === typeId;
    });
    if (type > -1) {
      return true;
    } else {
      return false;
    }
  }


  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) {
        return 1;
      } else if (a[key] < b[key]) {
        return -1;
      };
      return 0;
    };
  }

  updatePendingTasks(allnPendingTasksObject) {
  }

  updateUpComingEventList(event) {
    if (this.rncpTitle._id && event) {
      this.dashboardService.getUpcomingEvents(this.rncpTitle._id).subscribe((events) => {
        this.listofEvents = events;
        if (this.isUpcomingEvent) {
          this.scrollToCalender();
        }
      });
    }
  }

  selectedCategory(id: string) {
    this.selectedCategoryIdToModify = id;
  }
}
