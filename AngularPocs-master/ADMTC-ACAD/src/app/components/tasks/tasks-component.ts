import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/users.service';
import { TasksService } from '../../services/tasks.service';
import { Tasks } from '../../models/tasks.model';
import { AddTaskDialogComponent } from '../../dialogs/add-task-dialog/add-task-dialog.component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { Page } from '../../models/page.model';
import { Sort } from '../../models/sort.model';
import { DatePipe } from '@angular/common';
import { TaskDetailsComponent } from 'app/dialogs/task-details/task-details.component';
import { ExpectedDocTaskComponent } from 'app/dialogs/expected-doc-task/expected-doc-task.component';
import { AcademicKitService } from 'app/services/academic-kit.service';
import { BehaviorSubject } from 'rxjs';
import { Test } from 'app/models/test.model';
import { Document } from 'app/models/document.model';
import { UtilityService } from '../../services/utility.service';
import _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AssignCorrectorDialogComponent } from 'app/dialogs/assign-corrector-dialog/assign-corrector-dialog.component';
import { AssignCorrectorProblematicDialogComponent } from 'app/dialogs/assign-corrector-problematic-dialog/assign-corrector-problematic-dialog.component';
import { TestCorrectionService } from '../../services/test-correction.service';
import { TestService } from 'app/services/test.service';
import { LoginService } from 'app/services/login.service';
import { RNCPTitlesService } from '../../services/rncp-titles.service';
import { ProblematicTaskDialogComponent } from '../student/student-dialogs/problematic-task-dailog/problematic-dailog.component';
import { CrossCorrectionDialogComponent } from 'app/components/cross-correction/cross-correction-dialog/cross-correction-dialog.component';
import { CreateCrosscorrectorDialogComponent } from '../../dialogs/create-crosscorrector-dialog/create-crosscorrector-dialog.component';
import { AddTestTaskDialogComponent } from './add-test-task-dialog/add-test-task-dialog.component';
import { SendCopiesTaskDialogComponent } from '../cross-correction/send-copies-task-dialog/send-copies-task-dialog.component';
import { TableFilterStateService } from '../../services/table-fliter-state.service';
import { FinalTranscriptRetakeDialogComponent } from '../../dialogs/final-transcript-retake-dialog/final-transcript-retake-dialog.component';

declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
import { StudentCertDetailEditDialogComponent } from '../student/student-dialogs/student-cert-detail-edit-dialog/student-cert-detail-edit-dialog.component';
const log = Log.create('TasksComponent');
log.color = 'violet';


@Component({
  selector: 'app-task',
  templateUrl: './tasks-component.html',
  styleUrls: ['./tasks-component.scss'],
  providers: [DatePipe]
})
export class TasksComponent implements OnInit {
  fltrTask = '';
  fltrTitle = '';
  sortName: any;
  loggedInUserId = '';
  fltrSales = '';
  selected = [];
  tasksList: Tasks[];
  task: Tasks;
  TotalTasksList = [];
  isSearching: boolean = false;
  page = new Page();
  userTypeBind = [];
  filterByStatus: any;
  sort = new Sort();
  allUserTypes = [];
  userTypes = [];
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
  searchText: string;
  // Add Task dialog object
  crossCorrectionDialog: MdDialogRef<CrossCorrectionDialogComponent>;
  expectedDocTaskDialog: MdDialogRef<ExpectedDocTaskComponent>;
  addTaskDialogComponent: MdDialogRef<AddTaskDialogComponent>;
  TaskDetailsDialog: MdDialogRef<TaskDetailsComponent>;
  AddTestTaskDialog: MdDialogRef<AddTestTaskDialogComponent>;
  creatCrossCorrectorDialog: MdDialogRef<CreateCrosscorrectorDialogComponent>;
  ProblematicDialog: MdDialogRef<ProblematicTaskDialogComponent>;
  assignCorrectorDialog: MdDialogRef<AssignCorrectorDialogComponent>;
  assignCorrectorProblematicDialog: MdDialogRef<AssignCorrectorProblematicDialogComponent>;
  sendCrossCorrectorCopyDialog: MdDialogRef<SendCopiesTaskDialogComponent>;
  finalTranscriptRetakeDialogComponent: MdDialogRef<FinalTranscriptRetakeDialogComponent>;
  // Add Task dialog property
  configCat: MdDialogConfig = {
    disableClose: true,
    width: '600px'
  };
  configcrossCorrectionDialog: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'urgentMsg-backdrop'
  };
  configDetails: MdDialogConfig = {
    disableClose: false,
    width: '500px'
  };
  configDoc: MdDialogConfig = {
    disableClose: true,
    width: '600px',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };
  configAssignCorrector: MdDialogConfig = {
    disableClose: true,
    width: '600px',
    //  height: '80%',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };

  configAssignCorrectorProblematic: MdDialogConfig = {
    disableClose: true,
    width: '600px',
    //  height: '80%',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };
  
  configSendCopyCrossCorrector: MdDialogConfig = {
    disableClose: false,
    width: '540px'
  };
  checkIsDirectorSalesAdmin = false;
  highlightTaskId = '';
  showAddEditTaskButton: boolean = false;
  showAddTestTaskButton: boolean = false;
  searchInternalTask = false;
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
    private tableFilterStateService: TableFilterStateService
  ) {
    this.page.pageNumber = 0;
    this.page.totalElements = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    this.filterByStatus = 'Todo';
    if (window.innerHeight > 1000) {
      this.page.size = 15;
    } else {
      this.page.size = 12;
    }
  }
  ngOnInit() {
    // const login = JSON.parse(localStorage.loginuser);
    this.login = this.loginService.getLoggedInUser();
    this.checkIsDirectorSalesAdmin = this.utilityservice.checkUserIsDirectorSalesAdmin();

    this.loggedInUserId = this.login._id ? this.login._id : '';

    this.setFilterState();

    this.GetAllTasks(true);

    this.getAllUserTypesWithEntity();
    this.obserLangChangeForUserTypeTranslations();

    this.showAddEditTaskButton = this.addTaskButtonPermisson();
  }


  setFilterState() {
    const filterState = this.tableFilterStateService.myTaskListFilterState;

    log.data('setFilterState( filterState', filterState);

    if (filterState) {
      this.sort.sortby = filterState.sortby ? filterState.sortby : '';
      this.sort.sortmode = filterState.sortmode ? filterState.sortmode : 'asc';
      this.page.pageNumber = filterState.pageNumber ? filterState.pageNumber : 0;

      this.searchText = filterState.searchText ? filterState.searchText : '';
      this.filterByStatus = filterState.taskStatus ? filterState.taskStatus : '';
      this.userTypeBind = filterState.userTypeId ? filterState.userTypeId : [];
    }
  }

  getAllUserTypesWithEntity() {
    this.service.getUserTypesByIsUserCollection().subscribe((response) => {
      this.allUserTypes = response;
      console.log(response);
      this.userTypes = [];

      this.allUserTypes.forEach((item) => {
        const typeEntity = this.utilityservice.getTranslateADMTCSTAFFKEY(item.name)
          + ' / ' + this.utilityservice.getTranslateENTITY(item.entity);
        this.userTypes.push({ id: item._id, text: typeEntity });
      });
      this.userTypes = this.userTypes.sort(this.keysrt('text'));
    });
  }

  obserLangChangeForUserTypeTranslations() {
    this._subscription = this.translate.onLangChange.subscribe((params) => {
      if (this.allUserTypes !== []) {
        this.userTypes = [];
        this.allUserTypes.forEach((item) => {
          const typeEntity = this.utilityservice.getTranslateADMTCSTAFFKEY(item.name)
            + ' / ' + this.utilityservice.getTranslateENTITY(item.entity);
          this.userTypes.push({ id: item._id, text: typeEntity });
        });
        this.userTypes = this.userTypes.sort(this.keysrt('text'));
      }
    });
  }

  changePage(pageInfo): void {
    if (this.page.pageNumber !== pageInfo.offset) {
      this.page.pageNumber = pageInfo.offset;
      log.data('changePage(pageInfo) this.page.pageNumber', this.page.pageNumber);
      this.GetAllTasks();
    }
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
    this.GetAllTasks();
  }



  filterInternaltasks() {
    this.searchInternalTask = true;
    this.userTypeBind = [];
    this.searchText = '';
    this.filterByStatus = '';
    this.GetAllTasks();
  }

  GetAllTasks(openDialog?: boolean) {
    const userTypeId = this.userTypeBind[0] && this.userTypeBind[0].id ? this.userTypeBind[0].id : '';
    const filterByStatusText = this.filterByStatus && this.filterByStatus !== 'ALL' ? this.filterByStatus : '';
    const type = this.searchInternalTask ? 'internalTask' : '';
    if (this.searchText || filterByStatusText || userTypeId || type) {
      this.isSearching = true;
    } else {
      this.isSearching = false;
    }

    this.taskservice.getTasks(this.page.pageNumber, this.page.size, this.sort.sortby, this.sort.sortmode,
      this.searchText, filterByStatusText, userTypeId, type).subscribe(
        (response) => {
          if (response.tasks) {
            this.TotalTasksList = response.tasks;
            this.assignIsEditableFlagToEachTask();
            this.tasksList = this.TotalTasksList;
            this.page.totalElements = response.total;
            if (openDialog) {
              this.computeDialogOpensForFirstLoad();
            }
          }
        }
      );
  }

  assignIsEditableFlagToEachTask() {
    this.TotalTasksList.forEach((task) => {
      if ((task.userSelection.selectionType === 'user') &&
        task.userSelection.userId && (task.userSelection.userId._id === this.loggedInUserId)) {
        task.isEditable = false;
        if (this.utilityservice.checkUserIsAcademicDirector() &&
          (task.description.toLowerCase() === 'assign corrector' && task.taskStatus.toLowerCase() === 'done')) {
          task.isEditable = true;
        }
      } else if (task.userSelection.selectionType === 'userType' && task.userSelection.userTypeId) {
        const assignedToUserTask = this.login.types.filter(e => {
          return e._id === task.userSelection.userTypeId._id;
        });
        if (assignedToUserTask.length === 1) {
          task.isEditable = false;
        } else {
          task.isEditable = true;
        }
      } else {
        task.isEditable = true;
      }
    });
  }

  computeDialogOpensForFirstLoad() {
    //  When Task Link is clicked for Student and Mentor
    this.activatedroute.params.subscribe(params => {
      if (params.hasOwnProperty('id')) {

        if (params.hasOwnProperty('taskId') && params['id'] === 'selected') {

          console.log('Selected Task : ' + params['taskId'])
          this.highlightTaskId = params['taskId'];

        } else if (params.hasOwnProperty('taskId')) {

          const taskIndex = _.findIndex(this.TotalTasksList, function (o) { return o._id === params['taskId']; });
          if (taskIndex > -1) {
            this.event = {
              celIndex: 0,
              row: this.TotalTasksList[taskIndex],
              type: 'click'
            };
            this.onActivate(this.event);
          } else {
            this.taskservice.getTaskDetail(params['taskId']).subscribe(data => {
              let taskDetails = data;
              if (taskDetails.task) {
                taskDetails = _.cloneDeep(data.task);
                taskDetails.rncp = data.parentRNCPTitle;
                taskDetails.userSelection.userId = data.task.userSelection;
                taskDetails.test = data.test;
                log.data('internaltask.getTaskDetail', taskDetails);
                this.event = {
                    celIndex: 0,
                    row: taskDetails,
                    type: 'click'
                };
                this.onActivate(this.event);
              } else {
                this.irrelevantTaskError();
              }
            });
          }
        }
      } else if (params.hasOwnProperty('taskId') && params.hasOwnProperty('open')) {
        if ( params['open'].toLowerCase() === 'internaltask')  {
          this.taskservice.getTaskDetail(params['taskId']).subscribe(data => {
            let taskDetails = data;
            if (taskDetails.task) {
              taskDetails = _.cloneDeep(data.task);
              taskDetails.rncp = data.parentRNCPTitle;
              taskDetails.userSelection.userId = data.task.userSelection;
              taskDetails.test = data.test;
              log.data('internaltask.getTaskDetail', taskDetails);
              this.openManualTaskDialog(taskDetails);
            }
          });
        }
      } else if (params.hasOwnProperty('taskId') && params.hasOwnProperty('open') &&
        params['open'].toLowerCase() === 'assigncorrector') {
        const taskIndex = _.findIndex(this.TotalTasksList, (task) => { return task._id === params['taskId']; });
        if (taskIndex > -1) {
          const task = this.TotalTasksList[taskIndex];
          if (task._id) {
            this.editdialog(task, task._id);
          }
        } else {
          this.taskservice.getTaskDetail(params['taskId']).subscribe(data => {
            let assignCorrTask = data;
            if (assignCorrTask.task) {
              assignCorrTask = '';
              assignCorrTask = _.cloneDeep(data.task);
              assignCorrTask.rncp = data.parentRNCPTitle;
              assignCorrTask.userSelection.userId = data.task.userSelection;
              assignCorrTask.test = data.test;
              log.data('assignCorrTask.getTaskDetail', assignCorrTask);
              this.editdialog(assignCorrTask, assignCorrTask._id);
            }
          });
        }
      }
    });
  }

  irrelevantTaskError() {
    this.translate.reloadLang(this.translate.currentLang).subscribe(sub => {
      swal({
          title: this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.ERROR'),
          html: this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.TEXT'),
          type: 'error',
          allowEscapeKey: true,
          confirmButtonClass: 'btn-danger',
          confirmButtonText: this.translate.instant('TASK.MESSAGE.OK'),
        });
      });
  }

  onActivate($event) {
    console.log($event);
    if ($event.type === 'click' && $event.cellIndex !== 9) {
      console.log($event);
      if ($event.row.taskStatus !== 'Done' || $event.row.type.toLowerCase() === 'addtask' || $event.row.type.toLowerCase() === 'internaltask') {
        this.handleTaskSelection($event.row);
      }
    }
  }

  handleTaskSelection(selectedRow) {
    log.data('handleTaskSelection(selectedRow)', selectedRow);
    const self = this;
    this.taskservice.getTaskDetail(selectedRow._id).subscribe(data => {
      let taskDetails = data;
      if (taskDetails.task) {
        taskDetails = '';
        taskDetails = _.cloneDeep(data.task);
        taskDetails.rncp = data.parentRNCPTitle;
        taskDetails.userSelection.userId = data.task.userSelection;
        taskDetails.test = data.test;
        if (selectedRow.classId) {
          taskDetails.classId = selectedRow.classId;
        }
        log.data('taskservice.getTaskDetail', taskDetails);
      }

      if (taskDetails.type.toLowerCase() === 'addtask' || taskDetails.type.toLowerCase() === 'internaltask') {
        this.openManualTaskDialog(taskDetails, selectedRow);
      } else if (taskDetails.type.toLowerCase() === 'studentconfirmcertificate' && taskDetails.taskStatus !== 'Done') {
        this.redirectToStudentCertification(selectedRow, taskDetails);
      } else if (taskDetails.type.toLowerCase() === 'finalcertificaterevision') {
        this.openEditStudentDialog(selectedRow);
      } else if ((taskDetails.type.toLowerCase() === 'submitstudentsforretaketest' ||
        taskDetails.type.toLowerCase() === 'redomarksentry') && taskDetails.taskStatus !== 'Done') {
        this.onClickMarksEntryTask(taskDetails);
      } else if (taskDetails.type.toLowerCase() === 'crosscorrection' && taskDetails.taskStatus !== 'Done') {
        console.log(taskDetails);
        this.onClickMarksEntryTask(taskDetails);
      } else if (((taskDetails.type.toLowerCase() === 'calendarstep'
        && taskDetails.description.toLowerCase() === 'assign corrector') || taskDetails.type === 'retakeAssignCorrector')
        && taskDetails.taskStatus !== 'Done') {
        if (+taskDetails.test.registeredStudents === 0) {
          this.noStudentsInClassSwal();
        } else {
          if (this.utilityservice.checkUserIsAcademicDirector()) {
            this.checkUnregisteredStudents(taskDetails);
          } else {
            this.onClickAssignCorrector(taskDetails);
          }
        }
      } else if ((taskDetails.description.toUpperCase() === 'ASSIGN CORRECTOR' &&
        taskDetails.type.toLowerCase() === 'assigncorrectorforcertadmin')) {
        this.openAssignCorrector(taskDetails, false, true);
      } else if ((taskDetails.description.toUpperCase() === 'ASSIGN CORRECTOR OF PROBLEMATIC' &&
      taskDetails.type.toLowerCase() === 'assigncorrectorproblematic')) {
      this.openAssignCorrectorProblematic(taskDetails, false, true);
      } else if ((taskDetails.description.toUpperCase().trim() === 'CREATE GROUPS')
        && taskDetails.type === 'calendarStep'
        && taskDetails.taskStatus !== 'Done') {
        if (this.utilityservice.checkUserIsAcademicDirector()) {
          this.checkUnregisteredStudents(taskDetails);
        } else {
          this.onClickCreateGroupsTask(taskDetails);
        }
      } else if ((taskDetails.description.toUpperCase().trim() === 'ENTER MARKS'
        || taskDetails.description.toUpperCase().trim() === 'MARKS ENTRY' || taskDetails.description === 'Mark Entry for Final Retake Test')
        && (taskDetails.type === 'calendarStep' || taskDetails.type === 'admtcCorrection'
          || taskDetails.type === 'certifierMarksEntry' || taskDetails.type === 'finalRetakeMarksEntry')
        && taskDetails.taskStatus !== 'Done') {
        if (+taskDetails.test.registeredStudents === 0) {
          this.noStudentsInClassSwal();
        } else {
          if (this.utilityservice.checkUserIsAcademicDirector()) {
            this.checkUnregisteredStudents(taskDetails);
          } else {
            this.onClickMarksEntryTask(taskDetails);
          }
        }
      } else if ((taskDetails.description.toLowerCase() === '"validate the test correction"' ||
        taskDetails.type === 'testCorrection' || taskDetails.type.toLowerCase() === 'validatecrosscorrection'
        || taskDetails.type.toLowerCase() === 'certifiervalidation' ||
        taskDetails.type === 'validateTestCorrectionForFinalRetake')
        && taskDetails.taskStatus !== 'Done') {
        if (this.utilityservice.checkUserIsAcademicDirector() || this.utilityservice.checkUserIsDirectorSalesAdmin() ||
          this.utilityservice.checkUserIsAdminOfCertifier()) {
          this.redirectToValidateCorrection(taskDetails);
        }
      } else if ((taskDetails.type === 'problematicTask' || (taskDetails.type === 'validateProblematicTask'))
      ) {
        if (this.loggedInUserId === taskDetails.userSelection.userId._id || this.utilityservice.checkUserIsDirectorSalesAdmin()) {
          const task = taskDetails;
          this.ProblematicDialog = this.dialog.open(ProblematicTaskDialogComponent, this.configDetails);
          this.ProblematicDialog.componentInstance.problematicTask = task;
        }
      } else if ((taskDetails.description.toLowerCase() === 'assign cross corrector' && taskDetails.type === 'calendarStep')
        && taskDetails.taskStatus !== 'Done') {
        if (this.utilityservice.checkUserIsAcademicDirector()) {
          this.checkUnregisteredStudents(taskDetails);
        } else {
          this.onClickAssignCrossCorrector(taskDetails);
        }
      } else if ((taskDetails.type.toLowerCase() === 'documentsexpected' || taskDetails.type === 'reuploadExpectedDocument' ||
      taskDetails.type === 'uploadFinalRetakeDocument') && taskDetails.taskStatus !== 'Done') {
        console.log(taskDetails);
        if (this.utilityservice.checkUserIsAcademicDirector()) {
          this.checkUnregisteredStudents(taskDetails);
        } else {
          this.onExpectedDocTaskClick(taskDetails);
        }
      } else if ((taskDetails.description.toLowerCase() === 'create cross corrector' && taskDetails.type === 'calendarStep')
        && taskDetails.taskStatus !== 'Done') {
        if (this.utilityservice.checkUserIsAcademicDirector()) {
          this.checkUnregisteredStudents(taskDetails);
        } else {
          this.onClickCreateCrossCorrector(taskDetails);
        }
      } else if ((taskDetails.type.toLowerCase() === 'sendcopies-crosscorrector' ||
        taskDetails.type.toLowerCase() === 'sendcopies-validate') &&
        taskDetails.taskStatus !== 'Done') {
        this.sendCrossCorrectorCopyDialog = this.dialog.open(SendCopiesTaskDialogComponent, this.configSendCopyCrossCorrector);
        this.sendCrossCorrectorCopyDialog.componentInstance.task = taskDetails;
        this.sendCrossCorrectorCopyDialog.componentInstance.isSendToCrossCorrectortask =
          taskDetails.type.toLowerCase() === 'sendcopies-crosscorrector' ? true : false;
        this.sendCrossCorrectorCopyDialog.componentInstance.isAssignByLoginUser = this.loggedInUserId === taskDetails.createdBy._id ? true : false;
        this.sendCrossCorrectorCopyDialog.afterClosed().subscribe((task) => {
          if (task && task._id && task.taskStatus === 'Done') {
            this.checkForUpdatingTaskList(task, true);
          }
        });
      } else if ((taskDetails.description.toLowerCase() === 'send the evaluation to company\'s mentor' ||
        taskDetails.description.toLowerCase() === 'validation of mentor evaluation') &&
        taskDetails.taskStatus !== 'Done') {
        // Getting School Id from Entity of User to whom the Task is assigned
        const schoolId = taskDetails.userSelection && taskDetails.userSelection.entity && taskDetails.userSelection.entity.school ?
          taskDetails.userSelection.entity.school._id : '';

        // Setting Tab number for Routing to Student Card or Student Table based on task Description
        const tabNumber = 0;

        // Setting Optional Params for type and status identification
        const optionalParams = taskDetails.description.toLowerCase() === 'validation of mentor evaluation' ?
          { goto: 'mentorEval', status: 'filledByMentor' } : {};

        if (schoolId) {
          // Routing to Student Card or Student Table
          this.setFilterStateinService();
          this.router.navigate(['/school', schoolId, 'edit', tabNumber, optionalParams]);
        }
      } else if (taskDetails.type.toLowerCase() === 'employabilitysurveyforstudent') {
        this.onClickEmployibilitySurvery(taskDetails);
      } else if (taskDetails.type.toLowerCase() === 'admtcjurydecision') {
        if (taskDetails.description.toLowerCase() === 'enter jury decision for student in') {
          this.router.navigate(['school', selectedRow.school._id, 'edit', 0, { goto: 'finalCertification' }],
            { queryParams: { rncpId: taskDetails.rncp._id, classId: taskDetails.classId._id } });
        } else if (taskDetails.description.toLowerCase() === 'enter student decision for final retake test') {
          this.openFinalRetakeTestTask(taskDetails)
        }
      } else if (taskDetails.type.toLowerCase() === 'assignqualitycontrolcorrector'
        && taskDetails.description.toLowerCase() === 'assign quality control corrector') {
        this.openAssignCorrector(taskDetails, false, false , true );
      } else if (taskDetails.type.toLowerCase() === 'marksentryforqualitycontrol'
        && taskDetails.description.toLowerCase() === 'mark entry for quality control') {
        this.onClickMarksEntryTask(taskDetails);
      }
    },
      error => log.data('taskservice.getTaskDetail', error));
  }

  redirectToValidateCorrection(taskDetails) {
    this.titlesService.setFromAcadKit(false);
    let schoolId = taskDetails.userSelection.userId.entity.school ? taskDetails.userSelection.userId.entity.school._id : null;

    if (!schoolId && taskDetails.type.toLowerCase() === 'validatecrosscorrection') {
      if (taskDetails.crossCorrectionFor) {
        schoolId = taskDetails.crossCorrectionFor.entity ? taskDetails.crossCorrectionFor.entity.school._id : '';
      }
    } else if (taskDetails.type.toLowerCase() === 'certifiervalidation') {
      schoolId = taskDetails.test.school;
    } else if (taskDetails.type === 'validateTestCorrectionForFinalRetake') {
      schoolId = this.selected[0].school._id;
    }

    this.setFilterStateinService();
    this.router.navigate(['test-correction/' + taskDetails.rncp._id + '/' + taskDetails.test._id + '/' + taskDetails._id],
      schoolId ? { queryParams: { school: schoolId } } : {});
  }

  openManualTaskDialog(taskDetails, selectedTask?: any) {
    this.TaskDetailsDialog = this.dialog.open(TaskDetailsComponent, this.configDetails);
    this.TaskDetailsDialog.componentInstance.task = taskDetails.type.toLowerCase() === 'finalcertificaterevision' ? selectedTask : taskDetails;
    this.TaskDetailsDialog.componentInstance.isAssignByLoginUser = this.loggedInUserId === taskDetails.createdBy._id ? true : false;
    this.TaskDetailsDialog.componentInstance.isInternalTask = taskDetails && taskDetails.type.toLowerCase() === 'internaltask';
    this.TaskDetailsDialog.componentInstance.documentExpected = taskDetails && taskDetails.documentExpected ? taskDetails.documentExpected : [];
    this.TaskDetailsDialog.afterClosed().subscribe((task) => {
      if (task && task._id && task.taskStatus === 'Done') {
        this.markTaskAsDone(task._id);
      }
    });
  }

  editdialog(row, id) {
    console.log(row);
    let self = this;
    if ((row.description.toLowerCase() === 'assign corrector' || row.type === 'retakeAssignCorrector') && row.taskStatus === 'Done') {
      // For Editing Assign Corrector task after Task is Marked Done
      this.editAssignCorrectorTask(id, row.test._id);
    } else if (row.type.toLowerCase() === 'addtask') {
      this.AddTaskDialogOpen(row, id, true);
    } else if (row.test && row.userSelection.userId && row.userSelection.userId.entity.school) {
      // checkIfCorrectionStarted.
      this.testservice.checkIfCorrectionStarted(row.test._id, row.userSelection.userId.entity.school._id).subscribe((data) => {
        if (data) {
          swal({
            type: 'error',
            title: this.translate.instant('TASK.MESSAGE.CHANGE_S1_TITLE'),
            html: this.translate.instant('TASK.MESSAGE.CHANGE_S1_MESSAGE'),
            confirmButtonText: this.translate.instant('TASK.MESSAGE.CHANGE_S1_Btn')
          });
        }
      });
    }
  }

  editAssignCorrectorTask(taskId: string, testId: string) {
    this.taskservice.checkIfMarksEntryIsStarted(testId, taskId).subscribe(response => {
      if (response.data === false) {
        log.data('checkIfMarksEntryIsStarted checkIfMarksEntryIsStarted.response.data ', response.data);
        this.taskservice.getTaskDetail(taskId).subscribe(data => {
          const taskDetails = _.cloneDeep(data.task);
          taskDetails.rncp = data.parentRNCPTitle;
          taskDetails.userSelection.userId = data.task.userSelection;
          taskDetails.test = data.test;
          this.onClickAssignCorrector(taskDetails, true);
        });
      } else if (response.data === true) {
        swal({
          type: 'error',
          title: this.translate.instant('TASK.MESSAGE.CHANGE_S1_TITLE'),
          html: this.translate.instant('TASK.MESSAGE.CHANGE_S1_MESSAGE'),
          confirmButtonText: this.translate.instant('TASK.MESSAGE.CHANGE_S1_Btn')
        });
      }
    });
  }

  deleteTask(id, createdBy) {
    const self = this;
    if (this.loggedInUserId === createdBy._id || this.utilityservice.checkUserIsDirectorSalesAdmin()) {
      swal({
        title: 'Attention',
        text: this.translate.instant('TASK.MESSAGE.TASKDELETECONFIRM') + ' ' + ' ?',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: this.translate.instant('NO'),
        confirmButtonText: this.translate.instant('YES')
      }).then(() => {
        self.taskservice.removeTask(id).subscribe(
          (data) => {
            this.GetAllTasks();
            swal(
              'Success',
              this.translate.instant('TASK.MESSAGE.TASKDELETESUCCESS'),
              'success'
            );
          });
      });
    } else {
      swal({
        type: 'error',
        title: this.translate.instant('TASK.MESSAGE.NOTABLETODELETETITLE'),
        html: this.translate.instant('TASK.MESSAGE.NOTABLETODELETETEXT'),
        confirmButtonText: this.translate.instant('TASK.MESSAGE.OK')
      });
    }
  }

  AddTaskDialogOpen(row, taskid, isEdit = false) {
    this.addTaskDialogComponent = this.dialog.open(AddTaskDialogComponent, this.configCat);
    if (taskid !== null) {
      this.addTaskDialogComponent.componentInstance.taskid = taskid;
      this.addTaskDialogComponent.componentInstance.task = row;
      console.log(row);
    }
    this.addTaskDialogComponent.afterClosed().subscribe((task) => {
      if (task._id) {
        this.checkForUpdatingTaskList(task, false, isEdit);
      }
    });
  }


  resetSearch() {
    this.searchText = '';
    this.filterByStatus = '';
    this.isSearching = false;
    this.searchInternalTask = false;
    this.userTypeBind = [];
    this.page.pageNumber = 0;
    this.GetAllTasks();
  }

  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) { return 1; }
      else if (a[key] < b[key]) { return -1; };
      return 0;
    };
  }

  ChangeUserTitle(event) {
    log.data('ChangeUserTitle(event)', event);
    this.userTypeBind = [event];
    this.page.pageNumber = 0;
    this.GetAllTasks();
  }

  stringSearch(str: string, filterStr: string): boolean {
    if (str && filterStr) {
      return str.toLowerCase().indexOf(filterStr.toLowerCase()) !== -1;
    }
    return false;
  }

  checkForUserTypesArray(types, typeId) {
    const type = _.findIndex(types, function (t) {
      return t._id === typeId;
    });

    if (type > -1) {
      return true;
    } else {
      return false;
    }
  }

  getTranslateWhat(name, task?: any) {

    if (task) {
      if (task.type.toLowerCase() === 'employabilitysurveyforstudent') {
        const dueDate = new Date(task.dueDate);
        const dateString = dueDate.getDate() + '/' + (dueDate.getMonth() + 1) + '/' + dueDate.getFullYear();
        if (this.translate.currentLang.toLowerCase() === 'en') {
          return 'Employability Survey to complete before ' + dateString;
        } else {
          return 'Enquête d\'employabilité à completer avant le ' + dateString;
        }
      } else if (task.type.toLowerCase() === 'admtcjurydecision' ||
        task.type === 'retakeAssignCorrector' ||
        task.type === 'validateTestCorrectionForFinalRetake' ||
        task.type === 'finalRetakeMarksEntry') {
        let value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
        value = value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
        if (task.classId) {
          value =  value + ' - ' + task.classId.name + ' - ' + task.school.shortName;
        } else {
          value = value + ' - ' + task.school.shortName;
        }
        return value;
      } else if (task.type === 'documentsExpected' || task.type === 'reuploadExpectedDocument' || task.type === 'uploadFinalRetakeDocument') {
        if (task.type === 'uploadFinalRetakeDocument') {
          return this.translate.instant('TASK.FORDOCUPLOADTASK') + ' ' + task.description + ' ' + this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK.FOR_FINAL_RETAKE');
        } else {
          // this.translate.instant('TASK.FORDOCUPLOADTASK')
          return  ' ' + task.description ;
        }
      } else if(task.type === 'assignCorrectorProblematic') {
        return ' ' + `${task.rncp.shortName}: ${this.translate.instant('TEST.AUTOTASK.ASSIGN_CORRECTOR_PROBLEMATIC')}` 
      }
    }

    /*************************
    /* CODE:LESSONS
    /************************/
    //BELOW IS A WRONG WAY OF HANDLING LOGIC TO CHECK IF task is null.
    //The same check is done in multiple else blocks. The same could be avoided if above approach was used,
    // where task ==null is done in top level if.
    //TODO: Optimize code to use Switch block instead.

    if (task && task.type === 'validateProblematicTask') {
      if (this.translate.currentLang.toLowerCase() === 'en') {
        let taskDetails = name.split(' : ');
        taskDetails[taskDetails.length - 1] = 'Validate Problematics';
        taskDetails = taskDetails.join(' : ');
        return taskDetails;
      } else {
        let taskDetails = name.split(' : ');
        taskDetails[taskDetails.length - 1] = 'Notes de problématique à valider';
        taskDetails = taskDetails.join(' : ');
        return taskDetails;
      }
    } else if (task && task.type && task.type.toLowerCase() === 'finalcertificaterevision') {
      if (task.studentId && task.studentId._id) {
        const nameCivility = this.utilityservice.computeCivility(task.studentId.sex,
          this.translate.currentLang.toUpperCase()) + ' ' + task.studentId.firstName + ' ' + task.studentId.lastName;
        const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase()) + ' : ' + nameCivility;
        return value;
      } else if (name) {
        const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
        return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
      }
    } else if (task && task.type && task.type.toLowerCase() === 'validatecrosscorrection') {
      if (task.crossCorrectionFor) {
        const nameCivility = this.utilityservice.computeCivility(task.crossCorrectionFor.sex,
          this.translate.currentLang.toUpperCase()) + ' ' + task.crossCorrectionFor.lastName;
        const schoolWithCorrector = ' ' + task.crossCorrectionFor.entity.school.shortName + ' ' + nameCivility;
        const value = this.translate.instant('TEST.AUTOTASK.' + 'validatecrosscorrection'.toUpperCase()) + ' ' + schoolWithCorrector;
        return value;
      } else if (name) {
        const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
        return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
      }
    } else if (task && task.description && task.description.toLowerCase() === 'validation of mentor evaluation') {
      if (task.studentId) {
        const nameCivility = task.studentId.firstName + ' ' + task.studentId.lastName;
        const value = this.translate.instant('TEST.AUTOTASK.' + 'validation of mentor evaluation'.toUpperCase()) + ' - ' + nameCivility;
        return value;
      } else if (name) {
        const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
        return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
      }
    } else if (task && task.type && (task.type.toLowerCase() === 'assigncorrectorforcertadmin' ||
      task.type.toLowerCase() === 'certifiermarksentry' || task.type.toLowerCase() === 'certifiervalidation')) {
      if (task.school) {
        const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase()) + ' - ' + task.school.shortName;
        return value;
      } else if (name) {
        const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
        return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
      }
    } else if (name) {
      const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
      return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
    } else {
      return '';
    }
  }

  addTaskButtonPermisson(): boolean {
    if (this.utilityservice.checkUserIsDirectorSalesAdmin() ||
      this.utilityservice.checkUserIsAcademicAdminDirector() ||
      this.utilityservice.checkUserIsAdminOrDirectorOfCertifier() ||
      this.utilityservice.checkUserIsFromGroupOfSchools()) {
      return true;
    } else {
      return false;
    }
  }

  filterByTaskStatus(event?: any) {
    this.page.pageNumber = 0;
    this.GetAllTasks();
  }

  onExpectedDocTaskClick(task) {
    this.taskservice.getExpectedDocTask(task.test._id, task.uniqueID).subscribe(res => {
      console.log(res.data);
      const expectedDocTask = res.data;
      this.expectedDocTaskDialog = this.dialog.open(ExpectedDocTaskComponent, this.configDoc);
      this.expectedDocTaskDialog.componentInstance.taskRNCP = task.rncp._id;
      this.expectedDocTaskDialog.componentInstance.taskDetails = task;
      this.expectedDocTaskDialog.componentInstance.expectedDocTask = expectedDocTask;
      this.expectedDocTaskDialog.componentInstance.isRetakeTestUploadTask = task.type && task.type === 'reuploadExpectedDocument'
        && expectedDocTask.docUploadDateRetakeExam ? true : false;
      this.expectedDocTaskDialog.componentInstance.docDetail = {
        taskId: task._id,
        titleShortName: task.rncp.shortName,
        testName: task.test.name,
        subjectName: task.test.subjectId.subjectName,
        studentFirstName: task.userSelection.userId.firstName,
        studentLastName: task.userSelection.userId.lastName,
        userSelection: task.userSelection,
        isGroupTest: task.test.groupTest,
        forEachStudent: task.forEachStudent
      }
      this.expectedDocTaskDialog.afterClosed().subscribe((value: Document) => {
        if (value) {
          this.taskservice.completeTask(task._id).subscribe((result) => {
            console.log(result.data);
            const taskResponse = result.data;
            if (result.data && result.data._id) {
              this.markTaskAsDone(result.data._id);
              this.acadService.addDocument(value).subscribe(doc => {
                // Changed by Shreyas P - Document is to be saved into a
                // different folder already handled by above call
                // console.log(value);
                // this.acadService.addDocumentToTest(task.test._id, doc._id).subscribe(res => {
                //   console.log(res);
                // });
              });
            }
          });
        }
      });
    });
  }

  checkUnregisteredStudents(taskDetails) {
    if (this.utilityservice.checkUserIsAcademicDirector()) {
      const body = {
        rncpId: [taskDetails.rncp._id],
        schoolId: [this.login.entity.school._id]
      };
      this.titlesService.getUnregisteredStudents(body).subscribe(res => {

        const students = res.total < 10 ? res.data : res.data.slice(0, 9);
        if (res.total > 0) {

          swal({
            title: this.translate.instant('WHEN_UNREGISTERED_STUDENTS_IN_ONE_RNCP.TITLE'),
            html: this.translate.instant('WHEN_UNREGISTERED_STUDENTS_IN_ONE_RNCP.TEXT'),
            type: 'error',
            allowEscapeKey: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: this.translate.instant('WHEN_UNREGISTERED_STUDENTS_IN_ONE_RNCP.BUTTON'),
            closeOnConfirm: false,
          }).then(function (isConfirm) {
            if (isConfirm) {
            } else {
              this.cancel();
            }
          }.bind(this));
        } else {
          if (((taskDetails.type.toLowerCase() === 'calendarstep' && taskDetails.description.toLowerCase() === 'assign corrector') || taskDetails.type === 'retakeAssignCorrector') && taskDetails.taskStatus !== 'Done') {
            this.onClickAssignCorrector(taskDetails);

          } else if ((taskDetails.description.toUpperCase().trim() === 'CREATE GROUPS') && taskDetails.type === 'calendarStep' && taskDetails.taskStatus !== 'Done') {
            this.onClickCreateGroupsTask(taskDetails);

          } else if ((taskDetails.description.toUpperCase().trim() === 'ENTER MARKS' ||
            taskDetails.description.toUpperCase().trim() === 'MARKS ENTRY')
            && (taskDetails.type === 'calendarStep' || taskDetails.type === 'admtcCorrection')
            && taskDetails.taskStatus !== 'Done') {
            console.log('Go to Test Correction');
            this.onClickMarksEntryTask(taskDetails);
          } else if ((taskDetails.description.toUpperCase().trim() === 'ASSIGN CROSS CORRECTOR')
            && taskDetails.type === 'calendarStep' && taskDetails.taskStatus !== 'Done') {
            this.onClickAssignCrossCorrector(taskDetails);
          } else if ((taskDetails.description.toUpperCase().trim() === 'CREATE CROSS CORRECTOR')
            && taskDetails.type === 'calendarStep' && taskDetails.taskStatus !== 'Done') {
            this.onClickCreateCrossCorrector(taskDetails);
          } else if ((taskDetails.type.toLowerCase() === 'documentsexpected' || taskDetails.type === 'reuploadExpectedDocument' || taskDetails.type === 'uploadFinalRetakeDocument') && taskDetails.taskStatus !== 'Done') {
            this.onExpectedDocTaskClick(taskDetails);
          } else if (taskDetails.type.toLowerCase() === 'admtcjurydecision') {

          }
        }
      });
    }
  }

  redirectToStudentCertification(selectedRow, taskDetails) {
    if ( this.utilityservice.checkUserIsStudent() ) {
      this.router.navigate(['myfile', { goto: 'detailofcertification' }],
      { queryParams: { swal: 'certS8' } });
    } else {
      this.router.navigate(['school', selectedRow.school._id, 'edit', 0, taskDetails.studentId ,
      { goto: 'detailofcertification' }],
      { queryParams: { rncpId: taskDetails.rncp._id, classId: taskDetails.classId._id, swal: 'certS8' } });
    }
  }

  openEditStudentDialog(task) {
    const studentEditDialog = this.dialog.open(StudentCertDetailEditDialogComponent, {
      disableClose: true,
      width: '650px'
    });
    studentEditDialog.componentInstance.taskDetails = task;
    studentEditDialog.afterClosed().subscribe(
      (taskDetail) => {
        if (taskDetail._id) {
          this.checkForUpdatingTaskList(taskDetail, true);
        }
    });
  }

  onClickAssignCorrector(taskDetails, isEditAssignCorrector?: boolean) {
    const taskObj = taskDetails;
    if (taskDetails && taskDetails['rncp'] && taskDetails['rncp']['_id']) {
      this.titlesService.selectRncpTitle(taskDetails['rncp']['_id']).subscribe(() => { });
    }
    const schoolId = taskDetails.userSelection.userId.entity.school ? taskDetails.userSelection.userId.entity.school._id : null;
    this.testCorrectionService.selectTest(taskDetails.test._id);
    this.testCorrectionService.selectTask(taskDetails._id);
    if (taskDetails.test['groupTest']) {
      const self = this;
      this.testservice.getTestGroupFromTest(taskDetails.test['_id'], schoolId ? schoolId : '').subscribe((data) => {
        if (data && data.length) {
          this.openAssignCorrector(taskObj, isEditAssignCorrector);
        } else {
          // When ACAD DIR or CORRECTOR try to MARK ENTRY before CREATING GROUP
          swal({
            title: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertTitle'),
            html: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertText'),
            type: 'warning',
            showCancelButton: true,
            allowEscapeKey: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertOk'),
            cancelButtonClass: 'btn-danger',
            cancelButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertCancle')
          }).then(function (isConfirm) {

            for (let i = 0; i < self.TotalTasksList.length; i++) {

              if (
                self.TotalTasksList[i] && self.TotalTasksList[i]['test'] &&
                self.TotalTasksList[i]['test']['_id'] === taskDetails.test['_id'] &&
                self.TotalTasksList[i]['description'].toUpperCase().trim() === 'CREATE GROUPS' &&
                self.TotalTasksList[i]['type'] === 'calendarStep' &&
                self.TotalTasksList[i]['userSelection'] && self.TotalTasksList[i]['userSelection']['userId'] &&
                self.TotalTasksList[i]['userSelection']['userId']['_id'] === taskDetails['userSelection']['userId']['_id']) {

                console.log(self.TotalTasksList[i]);
                self.testCorrectionService.selectTest(taskDetails.test._id);
                const schoolId = taskDetails.userSelection.userId.entity.school ? taskDetails.userSelection.userId.entity.school._id : null;
                self.router.navigate(['create-group-test', taskDetails.rncp._id, taskDetails.test['_id'], self.TotalTasksList[i]['_id']],
                  schoolId ? { queryParams: { school: schoolId } } : {});
                break;
              }

            }



          }, function (dismiss) {
            self.router.navigate(['/admtc-acad/tasks']);
          }.bind(this));
        }
      });
    } else {
      this.openAssignCorrector(taskObj, isEditAssignCorrector);
    }
  }

  onClickAssignCorrectorProblematic(taskDetails, isEditAssignCorrector?: boolean) {
    const taskObj = taskDetails;
    if (taskDetails && taskDetails['rncp'] && taskDetails['rncp']['_id']) {
      this.titlesService.selectRncpTitle(taskDetails['rncp']['_id']).subscribe(() => { });
    }
    const schoolId = taskDetails.userSelection.userId.entity.school ? taskDetails.userSelection.userId.entity.school._id : null;
    this.testCorrectionService.selectTest(taskDetails.test._id);
    this.testCorrectionService.selectTask(taskDetails._id);
    if (taskDetails.test['groupTest']) {
      const self = this;
      this.testservice.getTestGroupFromTest(taskDetails.test['_id'], schoolId ? schoolId : '').subscribe((data) => {
        if (data && data.length) {
          this.openAssignCorrectorProblematic(taskObj, isEditAssignCorrector);
        } else {
          // When ACAD DIR or CORRECTOR try to MARK ENTRY before CREATING GROUP
          swal({
            title: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertTitle'),
            html: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertText'),
            type: 'warning',
            showCancelButton: true,
            allowEscapeKey: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertOk'),
            cancelButtonClass: 'btn-danger',
            cancelButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertCancle')
          }).then(function (isConfirm) {

            for (let i = 0; i < self.TotalTasksList.length; i++) {

              if (
                self.TotalTasksList[i] && self.TotalTasksList[i]['test'] &&
                self.TotalTasksList[i]['test']['_id'] === taskDetails.test['_id'] &&
                self.TotalTasksList[i]['description'].toUpperCase().trim() === 'CREATE GROUPS' &&
                self.TotalTasksList[i]['type'] === 'calendarStep' &&
                self.TotalTasksList[i]['userSelection'] && self.TotalTasksList[i]['userSelection']['userId'] &&
                self.TotalTasksList[i]['userSelection']['userId']['_id'] === taskDetails['userSelection']['userId']['_id']) {

                console.log(self.TotalTasksList[i]);
                self.testCorrectionService.selectTest(taskDetails.test._id);
                const schoolId = taskDetails.userSelection.userId.entity.school ? taskDetails.userSelection.userId.entity.school._id : null;
                self.router.navigate(['create-group-test', taskDetails.rncp._id, taskDetails.test['_id'], self.TotalTasksList[i]['_id']],
                  schoolId ? { queryParams: { school: schoolId } } : {});
                break;
              }

            }



          }, function (dismiss) {
            self.router.navigate(['/admtc-acad/tasks']);
          }.bind(this));
        }
      });
    } else {
      this.openAssignCorrectorProblematic(taskObj, isEditAssignCorrector);
    }
  }

  onClickCreateGroupsTask(taskDetails) {
    this.testCorrectionService.selectTest(taskDetails.test._id);
    const schoolId = taskDetails.userSelection.userId.entity.school ? taskDetails.userSelection.userId.entity.school._id : null;
    this.setFilterStateinService();
    this.router.navigate(['create-group-test', taskDetails.rncp._id, taskDetails.test['_id'], taskDetails._id],
      schoolId ? { queryParams: { school: schoolId } } : {});
  }

  onClickEmployibilitySurvery(taskDetails) {
    this.router.navigate(['/academic/employibility-survey', taskDetails.employabilitySurveyId]);
  }

  onClickMarksEntryTask(taskDetails) {
    this.titlesService.setFromAcadKit(false);
    if (taskDetails && taskDetails['rncp'] && taskDetails['rncp']['_id']) {
      this.titlesService.selectRncpTitle(taskDetails['rncp']['_id']).subscribe(() => { });
    }
    let schoolId = '';
    if (taskDetails.type === 'finalRetakeMarksEntry') {
      schoolId = this.selected[0].school._id;
    } else if (taskDetails.type.toLowerCase() === 'certifiermarksentry' ||
      taskDetails.type.toLowerCase() === 'marksEntryForQualityControl' ) {
      schoolId = taskDetails.test.school;
    } else {
      schoolId = taskDetails.userSelection.userId.entity.school ?
        taskDetails.userSelection.userId.entity.school._id :
        (taskDetails.test.school ? taskDetails.test.school : '');
    }


    this.testCorrectionService.selectTest(taskDetails.test._id);
    this.testCorrectionService.selectTask(taskDetails._id);
    if (taskDetails.test['groupTest']) {
      const self = this;
      this.testservice.getTestGroupFromTest(taskDetails.test['_id'], schoolId ? schoolId : '').subscribe((data) => {
        if (data && data.length) {
          this.setFilterStateinService();
          this.router.navigate(['test-correction', taskDetails.rncp._id, taskDetails.test._id, taskDetails._id],
            schoolId ? { queryParams: { school: schoolId } } : {});
        } else {
          // When ACAD DIR or CORRECTOR try to MARK ENTRY before CREATING GROUP

          swal({
            title: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertTitle'),
            html: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertText'),
            type: 'warning',
            showCancelButton: true,
            allowEscapeKey: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertOk'),
            cancelButtonClass: 'btn-danger',
            cancelButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.CreateGroupAlertCancle')
          }).then(function (isConfirm) {
            self.router.navigate(['create-group-test', taskDetails.rncp._id, taskDetails.test['_id'], taskDetails._id]);
          }, function (dismiss) {
            self.router.navigate(['/admtc-acad/tasks']);
          }.bind(this));
        }
      });

    } else {
      this.setFilterStateinService();
      this.router.navigate(['test-correction', taskDetails.rncp._id, taskDetails.test._id, taskDetails._id],
        schoolId ? { queryParams: { school: schoolId } } : {});
    }
  }

  checkSeletcedTask(row) {
    if (row && this.highlightTaskId && row._id === this.highlightTaskId) {
      return 'blue';
    }
    return '';
  }

  openAssignCorrector(taskDetails, isEditAssignCorrector: boolean, isCertiAdminAssCorTask?: boolean, isQc?: boolean) {
    let self = this;
    this.assignCorrectorDialog = this.dialog.open(AssignCorrectorDialogComponent, this.configAssignCorrector);
    this.assignCorrectorDialog.componentInstance.task = taskDetails;
    this.assignCorrectorDialog.componentInstance.rncp = taskDetails.rncp;
    this.assignCorrectorDialog.componentInstance.isFinalRetakeAssignCorrector = taskDetails.type === 'retakeAssignCorrector' ? true : false;
    this.assignCorrectorDialog.componentInstance.isEditAssignCorrector = isEditAssignCorrector ? isEditAssignCorrector : false;
    this.assignCorrectorDialog.componentInstance.isCertifierAssignCorTask = isCertiAdminAssCorTask ? true : false;
    this.assignCorrectorDialog.componentInstance.schoolId = isCertiAdminAssCorTask && taskDetails.school ? taskDetails.school._id : null;
    this.assignCorrectorDialog.componentInstance.isQC = isQc;
    this.assignCorrectorDialog.afterClosed().subscribe((task) => {
      if (task) {
        console.log(task);
        self.taskservice.completeTask(task._id).subscribe((result) => {
          log.data('openAssignCorrector completeTask result.data', result.data);
          if (result.data && result.data._id && !isEditAssignCorrector) {
            this.checkForUpdatingTaskList(result.data, true);
          } else if (isEditAssignCorrector) {
            this.GetAllTasks();
          }
        });
      }
    });
  }

  openAssignCorrectorProblematic(taskDetails, isEditAssignCorrector: boolean, isCertiAdminAssCorTask?: boolean) {
    let self = this;
    this.assignCorrectorProblematicDialog = this.dialog.open(AssignCorrectorProblematicDialogComponent, this.configAssignCorrectorProblematic);
    this.assignCorrectorProblematicDialog.componentInstance.task = taskDetails;
    this.assignCorrectorProblematicDialog.componentInstance.rncp = taskDetails.rncp;
    this.assignCorrectorProblematicDialog.componentInstance.school = taskDetails.school;
    this.assignCorrectorProblematicDialog.componentInstance.isFinalRetakeAssignCorrector = taskDetails.type === 'retakeAssignCorrector' ? true : false;
    this.assignCorrectorProblematicDialog.componentInstance.isEditAssignCorrector = isEditAssignCorrector ? isEditAssignCorrector : false;
    this.assignCorrectorProblematicDialog.componentInstance.isCertifierAssignCorTask = isCertiAdminAssCorTask ? true : false;
    this.assignCorrectorProblematicDialog.componentInstance.schoolId = isCertiAdminAssCorTask && taskDetails.school ? taskDetails.school._id : null;

    this.assignCorrectorProblematicDialog.afterClosed().subscribe((task) => {
      if (task) {
        this.GetAllTasks();
      }
    });
  }

  openFinalRetakeTestTask(taskDetails) {
    let self = this;
    this.finalTranscriptRetakeDialogComponent = this.dialog.open(FinalTranscriptRetakeDialogComponent, this.configAssignCorrector);
    this.finalTranscriptRetakeDialogComponent.componentInstance.taskDetails = taskDetails;
    this.finalTranscriptRetakeDialogComponent.afterClosed().subscribe((task) => {
    });
  }

  onClickAssignCrossCorrector(taskDetails) {
    console.log(taskDetails);
    if (taskDetails && taskDetails.rncp && taskDetails.test && taskDetails.test.class) {
      this.setFilterStateinService();
      this.router.navigate(['tools/cross-correction', taskDetails.rncp._id, taskDetails.test.class._id, taskDetails.test._id]);
    }
  }

  onClickCreateCrossCorrector(taskDetails) {
    this.creatCrossCorrectorDialog = this.dialog.open(CreateCrosscorrectorDialogComponent, this.configDetails);
    this.creatCrossCorrectorDialog.componentInstance.task = taskDetails;
    this.creatCrossCorrectorDialog.componentInstance.isAssignByLoginUser = this.loggedInUserId === taskDetails.createdBy._id ? true : false;
    this.creatCrossCorrectorDialog.afterClosed().subscribe((task) => {
      log.data('onClickCreateCrossCorrector task', task);
      if (task && task._id && task.taskStatus) {
        this.checkForUpdatingTaskList(task, true);
      }
    });
  }

  noStudentsInClassSwal() {
    swal({
      type: 'error',
      title: this.translate.instant('TASK.MESSAGE.NO_STUDENT_MARKS_ENTRY_TITLE'),
      text: this.translate.instant('TASK.MESSAGE.NO_STUDENT_MARKS_ENTRY_TEXT'),
      allowEscapeKey: true,
      showCancelButton: false,
      confirmButtonText: this.translate.instant('BACKEND.STUDENT.UNDERSTOOD')
    });
  }

  AddTestTaskDialogOpen() {
    this.AddTestTaskDialog = this.dialog.open(AddTestTaskDialogComponent, this.configDetails);
    this.AddTestTaskDialog.afterClosed().subscribe((task) => {
      if (task._id) {
        this.checkForUpdatingTaskList(task, false);
      }
    });
  }

  checkForUpdatingTaskList(task, markDone?: boolean, isEdit?: boolean) {
    if (this.page.size > this.tasksList.length) {
      this.GetAllTasks();
    }

    if (markDone) {
      this.markTaskAsDone(task._id);
    }

    if (isEdit) {
      this.GetAllTasks();
    }
  }

  markTaskAsDone(taskId: string) {
    const spliceIndex = _.findIndex(this.tasksList, (task) => {
      return task._id && task._id === taskId;
    });
    if (spliceIndex > -1) {
      if (this.filterByStatus === 'Todo') {
        if ((this.tasksList.length + 4) < this.page.size) {
          this.GetAllTasks();
        } else {
          this.tasksList.splice(spliceIndex, 1);
          this.tasksList = [...this.tasksList];
          --this.page.totalElements;
        }
      } else {
        this.tasksList[spliceIndex].taskStatus = 'Done';
      }
    }
    const allSpliceIndex = _.findIndex(this.TotalTasksList, (task) => {
      return task._id && task._id === taskId;
    });
    if (allSpliceIndex > -1) {
      if (this.filterByStatus === 'Todo') {
        this.TotalTasksList.splice(allSpliceIndex, 1);
        this.TotalTasksList = [...this.TotalTasksList];
      } else {
        this.TotalTasksList[allSpliceIndex].taskStatus = 'Done';
      }
    }
  }

  setFilterStateinService() {

    const filterCache: any = {
      sortby: this.sort.sortby,
      sortmode: this.sort.sortmode,
      pageNumber: this.page.pageNumber
    };

    if (this.searchText) {
      filterCache.searchText = this.searchText;
    }

    if (this.filterByStatus) {
      filterCache.taskStatus = this.filterByStatus;
    }

    const userTypeId = this.userTypeBind[0] && this.userTypeBind[0].id ? this.userTypeBind : null;
    if (userTypeId) {
      filterCache.userTypeId = userTypeId;
    }

    log.data('setTaskListFilterState(filterCache)', filterCache);
    this.tableFilterStateService.myTaskListFilterState = filterCache;
  }

}
