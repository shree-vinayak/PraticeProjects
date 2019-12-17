import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { DashboardService } from '../../../services/dashboard.service';
import { TestCorrectionService } from '../../../services/test-correction.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialogRef, MdDialogConfig, MdDialog } from '@angular/material';
import { DashboardCalenderTaskComponent } from '../../../dialogs/dashboard-calender-task/dashboard-calender-task.component';
import { ExpectedDocTaskComponent } from 'app/dialogs/expected-doc-task/expected-doc-task.component';
import { Document } from '../../../models/document.model';
import { AcademicKitService } from '../../../services/academic-kit.service';
import { TasksService } from '../../../services/tasks.service';
import { Tasks } from '../../../models/tasks.model';
import { Test } from 'app/models/test.model';
import { TestService } from '../../../services/test.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AssignCorrectorDialogComponent } from '../../../dialogs/assign-corrector-dialog/assign-corrector-dialog.component';
import { UtilityService } from 'app/services/utility.service';
import { Subscription } from 'rxjs/Subscription';
import _ from 'lodash';
import { ProblematicTaskDialogComponent } from '../../student/student-dialogs/problematic-task-dailog/problematic-dailog.component';
import { LoginService } from '../../../services/login.service';
import { CrossCorrectionDialogComponent } from '../../cross-correction/cross-correction-dialog/cross-correction-dialog.component';
import { CreateCrosscorrectorDialogComponent } from '../../../dialogs/create-crosscorrector-dialog/create-crosscorrector-dialog.component';
import { SendCopiesTaskDialogComponent } from '../../cross-correction/send-copies-task-dialog/send-copies-task-dialog.component';
import { TaskDetailsComponent } from '../../../dialogs/task-details/task-details.component';
import { UserService } from '../../../services/users.service';
import { CustomerService } from '../../customer/customer.service';
import { TableFilterStateService } from '../../../services/table-fliter-state.service';
import { FinalTranscriptRetakeDialogComponent } from '../../../dialogs/final-transcript-retake-dialog/final-transcript-retake-dialog.component';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
import { StudentCertDetailEditDialogComponent } from '../../student/student-dialogs/student-cert-detail-edit-dialog/student-cert-detail-edit-dialog.component';
import {AssignCorrectorProblematicDialogComponent} from '../../../dialogs/assign-corrector-problematic-dialog/assign-corrector-problematic-dialog.component';
const log = Log.create('PendingTasksComponent');
log.color = 'violet';

@Component({
  selector: 'pending-tasks',
  templateUrl: './pendingtasks.component.html',
  styleUrls: ['./pendingtasks.component.scss']
})
export class PendingTasksComponent implements OnInit, OnChanges {
  test = new BehaviorSubject<Test>(new Test());
  @Output() updateKit = new EventEmitter<boolean>();
  @Output() updateUpComingEventList: EventEmitter<any> = new EventEmitter<any>();
  @Input() rncpTitle;
  pendingTasks = [];
  selected;
  user = null;
  configcrossCorrectionDialog: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'urgentMsg-backdrop'
  };
  expectDoc: MdDialogConfig = {
    disableClose: true,
    width: '450px',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };
  positionStack = [];

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
  crossCorrectionDialog: MdDialogRef<CrossCorrectionDialogComponent>;
  expectedDocTaskDialog: MdDialogRef<ExpectedDocTaskComponent>;
  calenderTaskDialog: MdDialogRef<DashboardCalenderTaskComponent>;
  assignCorrectorDialog: MdDialogRef<AssignCorrectorDialogComponent>;
  assignCorrectorProblematicDialog: MdDialogRef<AssignCorrectorProblematicDialogComponent>;
  ProblematicDialog: MdDialogRef<ProblematicTaskDialogComponent>;
  creatCrossCorrectorDialog: MdDialogRef<CreateCrosscorrectorDialogComponent>;
  sendCrossCorrectorCopyDialog: MdDialogRef<SendCopiesTaskDialogComponent>;
  TaskDetailsDialog: MdDialogRef<TaskDetailsComponent>;
  finalTranscriptRetakeDialogComponent: MdDialogRef<FinalTranscriptRetakeDialogComponent>;
  sort = new Sort();
  page = new Page();
  task = new Tasks();
  allPendingTask = [];
  subscription: Subscription;
  reorderable = true;
  toggleSort = true;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };

  configDetails: MdDialogConfig = {
    disableClose: false,
    width: '500px'
  };

  isSearching = false;
  schoolListforSelect = [];
  filterSchool: any = '';
  filterUsertype: any = '';

  allUserTypes = [];
  userTypes = [];
  schoolId = '';

  searchPendingTask = '';

  private _searchTextSubject: Subject<string> = new Subject<string>();
  private searchTextObservable = this._searchTextSubject.asObservable();

  constructor(private service: RNCPTitlesService,
    private taskService: TasksService,
    private dialog: MdDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private testCorrectionService: TestCorrectionService,
    private acadService: AcademicKitService,
    private testservice: TestService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    public utilityService: UtilityService,
    private appService: RNCPTitlesService,
    private loginService: LoginService,
    private userService: UserService,
    private schoolService: CustomerService,
    private tableFilterStateService: TableFilterStateService
  ) {
    this.selected = [];
    this.initializeTextStream();
  }

  ngOnInit() {
    this.user = this.loginService.getLoggedInUser();
    this.getUserTypes();
    this.subscribeForTestDeletionTaskRefresh();
  }

  ngOnChanges(changes: SimpleChanges) {
    log.data('ngOnChanges(changes', changes);
    if ( changes.rncpTitle && changes.rncpTitle.currentValue &&
        changes.rncpTitle.currentValue._id && !this.schoolListforSelect.length) {
          this.resetPageSort();
          this.setFilterState();
          this.getPendingTasks(true);
          this.getRNCPAssociatedSchools(changes.rncpTitle.currentValue);
    }
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
       if (this.filterSchool[0] && this.filterSchool[0].id) {
         this.schoolId = this.filterSchool[0].id;
       }
     }
   }
  // To Auto Open Task when user tries to Access Task by clicking on Link
  autoOpenTask() {
    this.activatedRoute.params.subscribe(params => {
      if (params.hasOwnProperty('taskId')) {
        this.allPendingTask = this.pendingTasks;
        const task = this.pendingTasks.filter(tasks =>
          tasks._id === params['taskId']
        );
        this.translate.reloadLang(this.translate.currentLang).subscribe(sub => {
          if (task.length < 1) {
            swal({
              title: this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.ERROR'),
              html: this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.TEXT'),
              type: 'error',
              allowEscapeKey: true,
              confirmButtonClass: 'btn-danger',
              confirmButtonText: this.translate.instant('TASK.MESSAGE.OK'),
            }).then((isConfirm) => {
              this.setFilterStateinService();
              this.router.navigate(['rncp-titles']);
            });
          } else {
            this.handleTaskSelection(task[0]);
          }
        });
      }
    });
  }

  resetPageSort() {
    this.page.pageNumber = 0;
    this.page.size = 50;
    this.sort.sortmode = 'asc';
    this.sort.sortby = 'dueDate';
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.name;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
    this.getPendingTasks();
  }

  changePage(pageInfo): void {
    if ( this.page.pageNumber !== pageInfo.offset ) {
      this.page.pageNumber = pageInfo.offset;
      this.getPendingTasks();
    }
  }

  setSchoolIdforSchoolGroupChief() {
    // To set school-id if user is Chief of Group of Schools
    if ( this.schoolService.schoolId && this.utilityService.checkUserIsFromGroupOfSchools() ) {
      this.schoolId = this.schoolService.schoolId;
    }
  }

  getPendingTasks(updateEventList?: boolean): void {
    this.setSchoolIdforSchoolGroupChief();
    const rncpId = this.rncpTitle ? this.rncpTitle._id : '';
    const userTypeId = this.filterUsertype[0] && this.filterUsertype[0].id ? this.filterUsertype[0].id : '';

    this.dashboardService.getPendingTasks(rncpId, this.sort, this.page, this.schoolId, this.searchPendingTask, userTypeId)
      .subscribe(
        (response) => {
          this.pendingTasks = response.data;
          this.allPendingTask = response.data;
          this.page.totalElements = response.total;
          if (updateEventList) {
            this.autoOpenTask();
            this.updateUpComingEventList.emit(updateEventList);
          }
      });
  }

  handleTaskSelection(row) {
    log.data('handleTaskSelection row', row);
    this.taskService.getTaskDetail(row._id).subscribe(taskDetail => {
      log.data('taskservice.getTaskDetail', taskDetail);
      let myTaskDetails: any;
      if ( taskDetail.task ) {
        myTaskDetails = '';
        myTaskDetails = _.cloneDeep(taskDetail.task);
        myTaskDetails.rncp = taskDetail.parentRNCPTitle;
        myTaskDetails.userSelection.userId = taskDetail.task.userSelection;
        myTaskDetails.test = taskDetail.test;
        if (row.classId) {
          myTaskDetails.classId = row.classId;
        }
        log.data('taskservice.getTaskDetail', myTaskDetails);
      }

      if ((
        (row.description.toUpperCase().trim() === 'ENTER MARKS' ||
          row.description.toUpperCase().trim() === 'MARKS ENTRY' ||
          row.description === 'Mark Entry for Final Retake Test'
        )
        && (row.type === 'calendarStep' || row.type === 'admtcCorrection' || row.type === 'finalRetakeMarksEntry' ||
        row.type ===  'certifierMarksEntry' || row.type.toLowerCase() ===  'certifiervalidation')) ||
        (row.description.toUpperCase().trim() === 'VALIDATE THE TEST CORRECTION' || row.type === 'validateTestCorrectionForFinalRetake')
      ) {
        if ( +taskDetail.test.registeredStudents === 0 ) {
          this.noStudentsInClassSwal();
        } else {
          if (this.utilityService.checkUserIsAcademicAdminDirector()) {
            this.checkUnregisteredStudents(taskDetail);
          } else {
            this.onClickMarksEntryTask(taskDetail);
          }
        }
      } else if (row.type.toLowerCase() === 'studentconfirmcertificate' && myTaskDetails.taskStatus !== 'Done') {
        this.redirectToStudentCertification(row, myTaskDetails);
      } else if (row.type.toLowerCase() === 'submitstudentsforretaketest' || row.type.toLowerCase() === 'redomarksentry' ) {
        console.log('allowReTakeExam');
        console.log(taskDetail);
        this.onClickMarksEntryTask(taskDetail);
      } else if (row.type.toLowerCase() === 'crosscorrection') {
        this.onClickMarksEntryTask(taskDetail);
      }  else if (((row.description.toUpperCase() === 'ASSIGN CORRECTOR') && row.type === 'calendarStep') || row.type === 'retakeAssignCorrector') {
          if ( +taskDetail.test.registeredStudents === 0 ) {
            this.noStudentsInClassSwal();
          } else {
            if (this.utilityService.checkUserIsAcademicAdminDirector()) {
              this.checkUnregisteredStudents(taskDetail);
            } else {
              this.onClickAssignCorrector(taskDetail);
            }
        }
      } else if ((row.description.toUpperCase() === 'ASSIGN CORRECTOR') && row.type.toLowerCase() === 'assigncorrectorforcertadmin') {
        this.openAssignCorrector(taskDetail, true);
      } else if ((row.description.toUpperCase().trim() === 'CREATE GROUPS') && row.type === 'calendarStep') {
        if (this.utilityService.checkUserIsAcademicAdminDirector()) {
          this.checkUnregisteredStudents(taskDetail);
        } else {
          this.onClickCreateGroupsTask(taskDetail);
        }
      } else if ((row.description.toUpperCase().trim() === 'ASSIGN CROSS CORRECTOR') && row.type === 'calendarStep') {
        if (this.utilityService.checkUserIsAcademicDirector()) {
          this.checkUnregisteredStudents(taskDetail);
        } else {
          this.onClickCrossCorrection(taskDetail);
        }
      //  This condition for assign corrector of problematic
      } else if ((row.description.toUpperCase().trim() === 'ASSIGN CORRECTOR OF PROBLEMATIC')
        && row.type === 'assignCorrectorProblematic') {
        this.openAssignCorrectorProblematic(row, false, true);
      } else if ((row.type === 'problematicTask') || (row.type === 'validateProblematicTask')) {
        if (this.user._id === taskDetail.task.userSelection._id || this.utilityService.checkUserIsDirectorSalesAdmin()) {
          this.ProblematicDialog = this.dialog.open(ProblematicTaskDialogComponent, this.configDetails);
          this.ProblematicDialog.componentInstance.problematicTask = taskDetail.task;
        }
      } else if ((row.description.toUpperCase().trim() === 'CREATE CROSS CORRECTOR') && row.type === 'calendarStep') {
        if (this.utilityService.checkUserIsAcademicDirector()) {
          this.checkUnregisteredStudents(taskDetail);
        } else {
          this.onClickCreateCrossCorrector(taskDetail);
        }
      } else if (row.type === 'documentsExpected' || row.type === 'reuploadExpectedDocument' || row.type === 'uploadFinalRetakeDocument') {
        if (this.utilityService.checkUserIsAcademicAdminDirector()) {
          this.checkUnregisteredStudents(taskDetail);
        } else {
          this.onExpectedDocTaskClick(taskDetail);
        }

      } else if ( (row.type.toLowerCase() === 'sendcopies-crosscorrector' ||
                  row.type.toLowerCase() === 'sendcopies-validate') && row.taskStatus !== 'Done') {
        this.sendCrossCorrectorCopyDialog = this.dialog.open(SendCopiesTaskDialogComponent, this.configSendCopyCrossCorrector);
        this.sendCrossCorrectorCopyDialog.componentInstance.task = myTaskDetails;
        this.sendCrossCorrectorCopyDialog.componentInstance.isSendToCrossCorrectortask =
            myTaskDetails.type.toLowerCase() === 'sendcopies-crosscorrector' ? true : false;
        this.sendCrossCorrectorCopyDialog.componentInstance.isAssignByLoginUser = this.user._id === myTaskDetails.createdBy._id ? true : false;
        this.sendCrossCorrectorCopyDialog.afterClosed().subscribe((task) => {
          if (task && task._id && task.taskStatus ) {
           this.spliceForDonetask(task._id);
          }
        });
      } else if (myTaskDetails.type.toLowerCase() === 'addtask' || myTaskDetails.type.toLowerCase() === 'internaltask') {
        this.openManualTask(myTaskDetails, row);
      } else if ( myTaskDetails.type.toLowerCase() === 'finalcertificaterevision') {
        this.openEditStudentDialog(row);
      } else if ( (myTaskDetails.description.toLowerCase() === 'send the evaluation to company\'s mentor' ||
                   myTaskDetails.description.toLowerCase() === 'validation of mentor evaluation') &&
                   myTaskDetails.taskStatus !== 'Done') {
          // Getting School Id from Entity of User to whom the Task is assigned
          const schoolId = myTaskDetails.userSelection && myTaskDetails.userSelection.entity && myTaskDetails.userSelection.entity.school ?
                            myTaskDetails.userSelection.entity.school._id : '';

          // Setting Tab number for Routing to Student Card or Student Table based on task Description
          const tabNumber = 0;

          // Setting Optional Params for type and status identification
          const optionalParams = myTaskDetails.description.toLowerCase() === 'validation of mentor evaluation' ?
                                  { goto: 'mentorEval', status: 'filledByMentor' } : {};

          if ( schoolId ) {
            // Routing to Student Card or Student Table
            this.setFilterStateinService();
            this.router.navigate([ '/school', schoolId, 'edit', tabNumber, optionalParams]);
          }
      } else if (myTaskDetails.type.toLowerCase() === 'employabilitysurveyforstudent' ) {
        this.onClickEmployibilitySurvery(myTaskDetails);
      } else if (myTaskDetails.type.toLowerCase() === 'admtcjurydecision') {
        if (myTaskDetails.description.toLowerCase() ===  'enter jury decision for student in') {
          this.router.navigate(['school', row.school._id, 'edit', 0, {goto: 'finalCertification'}],
          { queryParams: { rncpId: row.rncp._id, classId: row.classId._id } });
        } else if (myTaskDetails.description.toLowerCase() ===  'enter student decision for final retake test') {
          this.openFinalRetakeTestTask(myTaskDetails);
        }
      }else if (myTaskDetails.type.toLowerCase() === 'assignqualitycontrolcorrector' &&
        myTaskDetails.description.toLowerCase() === 'assign quality control corrector') {
        this.openAssignCorrector(taskDetail, false, true);
      } else if (myTaskDetails.type.toLowerCase() === 'marksentryforqualitycontrol' &&
        myTaskDetails.description.toLowerCase() === 'mark entry for quality control') {
        this.onClickMarksEntryTask(taskDetail);
      } else {
        this.calenderTaskDialog = this.dialog.open(DashboardCalenderTaskComponent, this.configDoc);
        this.calenderTaskDialog.componentInstance.task = taskDetail.task;
        this.calenderTaskDialog.componentInstance.testName = taskDetail.test ? taskDetail.test.name : '';
        this.calenderTaskDialog.componentInstance.testCompDate = taskDetail.computedDate ? taskDetail.computedDate : '';
      }
    });
  }

  getTranslateWhat(name, task?: any) {
    if (task) {
      if (task.type.toLowerCase() === 'employabilitysurveyforstudent') {
        const dueDate = new Date(task.dueDate);
        const dateString = dueDate.getDate() + '/' + (dueDate.getMonth() + 1) + '/' + dueDate.getFullYear();
        if (this.translate.currentLang.toLowerCase() === 'en') {
        return 'Employability Survey to complete before ' + dateString;
        }else {
          return 'Enquête d\'employabilité à completer avant le ' + dateString;
        }
      } else if (task.type.toLowerCase() === 'admtcjurydecision' || task.type === 'retakeAssignCorrector' || task.type === 'validateTestCorrectionForFinalRetake' || task.type === 'finalRetakeMarksEntry') {
        let value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
        value = value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
        if (task.classId) {
          value = value + ' - ' + task.classId.name + ' - ' + task.school.shortName;
        } else {
          value = value + ' - ' + task.school.shortName;
        }

        return value;
      } else if (task.type === 'documentsExpected' || task.type === 'reuploadExpectedDocument' || task.type === 'uploadFinalRetakeDocument') {
        if (task.type === 'uploadFinalRetakeDocument') {
          return this.translate.instant('UPLOAD') + ' ' + task.description + ' ' + this.translate.instant('DASHBOARD.EXPECTED_DOC_TASK.FOR_FINAL_RETAKE');
        } else {
          return this.translate.instant('UPLOAD') + ' ' + task.description;
        }
      } else if (task.type === 'calendarStep' && task.test.groupTest && task.test.correctionType === 'cp' && task.description.toLowerCase() === 'assign corrector') {
        let value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
        value = value + ' - ' + task.school.shortName;
        return value;
      }
    }

    /*************************
    /* CODE:LESSONS
    /************************/
    // BELOW IS A WRONG WAY OF HANDLING LOGIC TO CHECK IF task is null.
    // The same check is done in multiple else blocks. The same could be avoided if above approach was used,
    // where task ==null is done in top level if.
    // TODO: Optimize code to use Switch block instead.

    if (task && task.type === 'validateProblematicTask') {
      if (this.translate.currentLang.toLowerCase() === 'en') {
        let taskDetails = name.split(' : ');
        taskDetails[taskDetails.length - 1] = 'Validate Problematics';
        taskDetails = taskDetails.join(' : ');
        return taskDetails;
      } else {
        let taskDetails = name.split(' : ');
        taskDetails[ taskDetails.length - 1 ] = 'Notes de problématique à valider';
        taskDetails = taskDetails.join( ' : ' );
        return taskDetails;
      }
    } else if ( task && task.type && task.type.toLowerCase() === 'validatecrosscorrection') {
      if ( task.crossCorrectionFor ) {
        const nameCivility = this.utilityService.computeCivility(task.crossCorrectionFor.sex,
                              this.translate.currentLang.toUpperCase()) + ' ' + task.crossCorrectionFor.lastName;
        const schoolWithCorrector = ' ' + task.crossCorrectionFor.entity.school.shortName + ' ' + nameCivility;
        const value = this.translate.instant('TEST.AUTOTASK.' + 'validatecrosscorrection'.toUpperCase()) + ' ' + schoolWithCorrector;
        return value;
      } else if (name) {
        const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
        return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
      }
    } else if ( task && task.type && ( task.type.toLowerCase() === 'assigncorrectorforcertadmin' ||
                task.type.toLowerCase() === 'certifiermarksentry' || task.type.toLowerCase() === 'certifiervalidation')) {
      if ( task.school ) {
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

  closeDialog() {
    this.assignCorrectorDialog.close();
  }
  onActivate(event) {
  }

  onSelect(selectedTask) {
    if (selectedTask.type === 'click') {
      this.handleTaskSelection(this.selected[0]);
    }
  }

  onClickEmployibilitySurvery(taskDetails) {
    this.router.navigate([ '/academic/employibility-survey', taskDetails.employabilitySurveyId]);
  }


  redirectToStudentCertification(selectedRow, taskDetails) {
    if ( this.utilityService.checkUserIsStudent() ) {
      this.router.navigate(['myfile', { goto: 'detailofcertification' }],
      { queryParams: { swal: 'certS8' } });
    } else {
      this.router.navigate(['school', selectedRow.school._id, 'edit', 0, taskDetails.studentId,
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
          this.spliceForDonetask(taskDetail._id);
        }
    });
  }

  openManualTask(myTaskDetails, rowTask){
    this.TaskDetailsDialog = this.dialog.open(TaskDetailsComponent, this.configDetails);
    this.TaskDetailsDialog.componentInstance.task = myTaskDetails.type.toLowerCase() === 'finalcertificaterevision' ? rowTask : myTaskDetails;
    this.TaskDetailsDialog.componentInstance.isAssignByLoginUser = this.user._id === myTaskDetails.createdBy._id ? true : false;
    this.TaskDetailsDialog.componentInstance.isInternalTask = myTaskDetails && myTaskDetails.type.toLowerCase() === 'internaltask';
    this.TaskDetailsDialog.componentInstance.documentExpected = myTaskDetails && myTaskDetails.documentExpected ? myTaskDetails.documentExpected : [];
    this.TaskDetailsDialog.afterClosed().subscribe((task) => {
      if (task && task._id && task.taskStatus ) {
       this.spliceForDonetask(task._id);
      }
    });
  }

  getAssignedTo(userSelection) {
    if (userSelection) {
      if ( userSelection.userId ) {
        const user = userSelection.userId;
        let civility = '';
        let schoolName = '';
        if (user.sex) {
          civility = this.utilityService.computeCivility(user.sex, this.translate.currentLang.toUpperCase());
        }
        if (user.entity && user.entity.school) {
          schoolName = user.entity.school.shortName;
        }
        const name = user.firstName + ' ' + user.lastName;
        return civility + ' ' + name + (user.entity.school ? ' - ' + schoolName : '');
      } else if ( userSelection.testGroupId ) {
        const schoolName = userSelection.testGroupId.school ? userSelection.testGroupId.school.shortName : 'good';
        return userSelection.testGroupId.name + ' - ' + schoolName;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  checkUnregisteredStudents(row) {
    if (this.utilityService.checkUserIsAcademicAdminDirector()) {
      const body = {
        rncpId: [this.rncpTitle._id],
        schoolId: [this.user.entity.school._id]
      };
      this.service.getUnregisteredStudents(body).subscribe(res => {
        const students = res.total;
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
          if ((
            (row.task.description.toUpperCase().trim() === 'ENTER MARKS' ||
              row.task.description.toUpperCase().trim() === 'MARKS ENTRY')
            && (row.task.type === 'calendarStep' || row.task.type === 'admtcCorrection')) || ((row.task.description.toUpperCase().trim() === 'VALIDATE THE TEST CORRECTION'))
          ) {
            this.onClickMarksEntryTask(row);
          }  else if (((row.task.description.toUpperCase().trim() === 'ASSIGN CORRECTOR') && row.task.type === 'calendarStep') || row.type === 'retakeAssignCorrector') {
            this.onClickAssignCorrector(row);
          } else if ((row.task.description.toUpperCase().trim() === 'CREATE GROUPS') && row.task.type === 'calendarStep') {
            this.onClickCreateGroupsTask(row);
          } else if (row.task.description.toUpperCase().trim() === 'ASSIGN CROSS CORRECTOR' && row.task.type === 'calendarStep') {
            this.onClickCrossCorrection(row);
          } else if (row.task.description.toUpperCase().trim() === 'CREATE CROSS CORRECTOR' && row.task.type === 'calendarStep') {
            this.onClickCreateCrossCorrector(row);
          } else if (row.task.type === 'documentsExpected' || row.task.type === 'reuploadExpectedDocument' || row.task.type === 'uploadFinalRetakeDocument') {
            this.onExpectedDocTaskClick(row);
          } else if (row.task.type.toLowerCase() === 'employabilitysurveyforstudent' ) {
            this.onClickEmployibilitySurvery(row.task);
          } else if (row.task.type.toLowerCase() === 'admtcjurydecision') {
            this.router.navigate(['school', row.school._id, 'edit', 0, {goto: 'finalCertification'}],
            { queryParams: { rncpId: row.rncp._id, classId: row.classId._id } });
          }
        }

      });
    }
  }

  onExpectedDocTaskClick(row) {
    this.taskService.getExpectedDocTask(row.test._id, row.task.uniqueID).subscribe(res => {
      const expectedDocTask = res.data;
      this.expectedDocTaskDialog = this.dialog.open(ExpectedDocTaskComponent, this.configDoc);
      this.expectedDocTaskDialog.componentInstance.taskRNCP = row.task.rncp;
      this.expectedDocTaskDialog.componentInstance.taskDetails = row.task;
      this.expectedDocTaskDialog.componentInstance.expectedDocTask = expectedDocTask;
      this.expectedDocTaskDialog.componentInstance.isRetakeTestUploadTask = row.task.type && row.task.type === 'reuploadExpectedDocument'
                                                                            && expectedDocTask.docUploadDateRetakeExam ? true : false;
      this.expectedDocTaskDialog.componentInstance.docDetail = {
        taskId: row.task._id,
        titleShortName: row.parentRNCPTitle.shortName,
        testName: row.test.name,
        subjectName: row.test.subjectId.subjectName,
        studentFirstName: row.task.userSelection.firstName,
        studentLastName: row.task.userSelection.lastName,
        userSelection: row.task.userSelection,
        isGroupTest: row.test.groupTest,
        forEachStudent: row.task.forEachStudent
      };
      this.expectedDocTaskDialog.afterClosed().subscribe((value: Document) => {
        if (value) {
          console.log(value);
          Object.assign(this.task, row.task);
          const id = this.route.snapshot.params['id'];
          this.taskService.completeTask(this.task._id).subscribe((result) => {
          if ( result.data && result.data._id ) {
            this.spliceForDonetask(result.data._id);
            this.acadService.addDocument(value).subscribe(doc => {
              // Changed by Shreyas P - Document is to be saved into a different folder already handled by above call
              // replaced call to updateKit with getKit.
              // this.acadService.addDocumentToTest(row.task.test, doc._id).subscribe(res => {
              //  this.acadService.updateKit();
              //  this.updateKit.emit(true);
              // });
              this.appService.selectRncpTitle(row.parentRNCPTitle._id).subscribe();
              this.updateKit.emit(true);
            });
          }
          });
        }
        this.updateKit.emit(true);
      });
    });
  }


  openFinalRetakeTestTask(taskDetails) {
    const self = this;
    this.finalTranscriptRetakeDialogComponent = this.dialog.open(FinalTranscriptRetakeDialogComponent, this.configAssignCorrector);
    this.finalTranscriptRetakeDialogComponent.componentInstance.taskDetails = taskDetails;
    this.finalTranscriptRetakeDialogComponent.afterClosed().subscribe((task) => {
    });
  }
  onClickAssignCorrector(row) {
    console.log(row);
    let schoolId = '';
    if (this.selected[0].test.correctionType === 'cp' && row.test.groupTest === true) {
      schoolId = this.selected[0].school._id;
    } else {
      schoolId = row.test.school ? row.test.school : '';
    }
    this.testCorrectionService.selectTest(row.test._id);
    this.testCorrectionService.selectTask(row.task._id);
    if (row.test['groupTest']) {
      const self = this;
      this.testservice.getTestGroupFromTest(row.test['_id'], schoolId).subscribe((data) => {
        if (data && data.length) {
          this.openAssignCorrector(row);
        } else {
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

            for (let i = 0; i < self.pendingTasks.length; i++) {

              if (
                self.pendingTasks[i] && self.pendingTasks[i]['test'] &&
                self.pendingTasks[i]['test']['_id'] === row.test['_id'] &&
                self.pendingTasks[i]['description'].toUpperCase().trim() === 'CREATE GROUPS' &&
                self.pendingTasks[i]['type'] === 'calendarStep' &&
                self.pendingTasks[i]['userSelection'] && self.pendingTasks[i]['userSelection']['userId'] &&
                self.pendingTasks[i]['userSelection']['userId']['_id'] === row['task']['userSelection']['_id']) {

                console.log(self.pendingTasks[i]);
                self.testCorrectionService.selectTest(row.test._id);
                let schoolIdParam = '';
                schoolIdParam = row['task']['userSelection'].entity.school ? row['task']['userSelection'].entity.school._id : null;
                self.setFilterStateinService();
                self.router.navigate(['create-group-test', row.parentRNCPTitle._id, row.test['_id'], self.pendingTasks[i]['_id']],
                schoolIdParam ? { queryParams: { school: schoolIdParam } } : {});
                break;
              }

            }

          }, function (dismiss) {
            self.router.navigate(['/dashboard']);
          }.bind(this));
        }
      });
    } else {
      this.openAssignCorrector(row);
    }

  }

  onClickMarksEntryTask(row) {
    this.appService.setFromAcadKit(false);
    let schoolId = '';
    if (row.task.type === 'finalRetakeMarksEntry' || row.task.type === 'validateTestCorrectionForFinalRetake') {
      schoolId = this.selected[0].school._id;
    } else {
      schoolId = row.test.school ? row.test.school : '';
    }

    const taskDetails = row.task;

    if ( !schoolId && row.task.type.toLowerCase() === 'validatecrosscorrection' ) {
      if ( taskDetails.crossCorrectionFor ) {
        schoolId = taskDetails.crossCorrectionFor.entity ? taskDetails.crossCorrectionFor.entity.school._id : '';
      }
    }

       // Set School Id based on the test since this is certifier
    if (taskDetails.type.toLowerCase() === 'certifiermarksentry' || taskDetails.type.toLowerCase() === 'certifiervalidation'
      || taskDetails.type.toLowerCase() === 'marksEntryForQualityControl') {
      schoolId = row.test.school;
    }

    this.testCorrectionService.selectTest(row.test._id);
    this.testCorrectionService.selectTask(row.task._id);
    if (row.test['groupTest']) {
      const self = this;
      this.testservice.getTestGroupFromTest(row.test['_id'], schoolId).subscribe((data) => {
        if (data && data.length) {
          self.setFilterStateinService();
          this.router.navigate(['test-correction'],
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
            self.setFilterStateinService();
            self.router.navigate(['create-group-test', row.parentRNCPTitle._id, row.test['_id'], row.task._id]);
          }, function (dismiss) {
            self.router.navigate(['/dashboard']);
          }.bind(this));

        }
      });

    } else {
      this.setFilterStateinService();
      this.router.navigate(['test-correction'],
        schoolId ? { queryParams: { school: schoolId } } : {});
    }
  }
  onClickCreateGroupsTask(row) {
    const schoolId = row.test.school ? row.test.school : '';
    this.testCorrectionService.selectTest(row.test._id);
    this.setFilterStateinService();
    this.router.navigate(['create-group-test', row.parentRNCPTitle._id, row.test['_id'], row.task._id],
      schoolId ? { queryParams: { school: schoolId } } : {});
  }

  openAssignCorrector(row, isCertiAdminAssignCorTask?: boolean, isQc?: boolean) {
    log.data('openAssignCorrector', row );
    this.assignCorrectorDialog = this.dialog.open(AssignCorrectorDialogComponent, this.configAssignCorrector);
    row.task.test = row.test;
    this.assignCorrectorDialog.componentInstance.task = row.task;
    this.assignCorrectorDialog.componentInstance.rncp = row.parentRNCPTitle ? row.parentRNCPTitle : row.rncp;
    this.assignCorrectorDialog.componentInstance.isFinalRetakeAssignCorrector = row.task.type === 'retakeAssignCorrector' ? true : false;
    this.assignCorrectorDialog.componentInstance.isCertifierAssignCorTask = isCertiAdminAssignCorTask ? true : false;
    this.assignCorrectorDialog.componentInstance.schoolId = row['task']['userSelection'].entity.school ? row['task']['userSelection'].entity.school._id : null;
    this.assignCorrectorDialog.componentInstance.isQC = isQc;
    // this.assignCorrectorDialog.componentInstance.schoolId = isCertiAdminAssignCorTask && row.school  ? row.school._id : null;
    this.assignCorrectorDialog.afterClosed().subscribe((task) => {
      if (task) {
        Object.assign(this.task, row.task);
        this.taskService.completeTask(this.task._id).subscribe((result) => {
          if ( result.data && result.data._id ) {
            this.spliceForDonetask(result.data._id);
          }
        });
      }
    });
  }
  onClickCrossCorrection(row) {
    console.log(row);
    if (row && row.parentRNCPTitle && row.test && row.test.class) {
      this.setFilterStateinService();
      this.router.navigate(['tools/cross-correction', row.parentRNCPTitle._id, row.test.class._id, row.test._id]);
    }
  }
  onClickCreateCrossCorrector(taskDetails) {
    console.log(taskDetails);
    this.creatCrossCorrectorDialog = this.dialog.open(CreateCrosscorrectorDialogComponent, this.configDetails);
    this.creatCrossCorrectorDialog.componentInstance.task = taskDetails.task;
    this.creatCrossCorrectorDialog.componentInstance.isAssignByLoginUser = this.user._id === taskDetails.task.createdBy._id ? true : false;
    this.creatCrossCorrectorDialog.afterClosed().subscribe((task) => {
      log.data('onClickCreateCrossCorrector task', task);
      if (task && task._id && task.taskStatus ) {
       this.spliceForDonetask(task._id);
      }
    });
  }

  openAssignCorrectorProblematic(taskDetails, isEditAssignCorrector: boolean, isCertiAdminAssCorTask?: boolean) {
    log.data(taskDetails);
    const self = this;
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
        this.spliceForDonetask(task);
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

  spliceForDonetask(taskId: string) {

    const spliceIndex = _.findIndex(this.pendingTasks, (task) => {
      return task._id && task._id === taskId;
    });

    if (spliceIndex > -1) {
      this.pendingTasks.splice(spliceIndex, 1);
      this.pendingTasks = [...this.pendingTasks];
      --this.page.totalElements;
      if ( this.page.size > this.page.totalElements ) {
        this.getPendingTasks();
      }
    }
    const allSpliceIndex = _.findIndex(this.allPendingTask, (task) => {
      return task._id && task._id === taskId;
    });

    if (allSpliceIndex > -1) {
      this.allPendingTask.splice(allSpliceIndex, 1);
      this.allPendingTask = [...this.allPendingTask];
    }
  }


  resetSearch() {
    this.resetPageSort();
    this.filterSchool = '';
    this.filterUsertype = '';
    this.schoolId = '';
    this.searchPendingTask = '';
    this.isSearching = false;
    this.getPendingTasks();
  }

  getUserTypes() {
    this.userService.getUserTypesByIsUserCollection().subscribe((response) => {
      this.allUserTypes = response;
      console.log(response);
      this.userTypes = [];

      this.allUserTypes.forEach((item) => {
        const typeEntity = this.getTranslateADMTCSTAFFKEY(item.name)
          + ' / ' + this.getTranslateENTITY(item.entity);
        this.userTypes.push({ id: item._id, text: typeEntity });
      });

      this.userTypes = _.orderBy(this.userTypes, ['text'], ['asc']);

      this.page.totalPages = Math.ceil(this.userTypes.length / 10);
    });
    this.translate.onLangChange.subscribe((params) => {
      if (this.allUserTypes !== []) {
        this.userTypes = [];
        this.allUserTypes.forEach((item) => {
          const typeEntity = this.getTranslateADMTCSTAFFKEY(item.name)
            + ' / ' + this.getTranslateENTITY(item.entity);
          this.userTypes.push({ id: item._id, text: typeEntity });
        });
      this.userTypes = _.orderBy(this.userTypes, ['text'], ['asc']);
      }
    });
  }


  getTranslateADMTCSTAFFKEY(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  getTranslateENTITY(name) {
    const value = this.translate.instant('SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase());
    return value !== 'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase() ? value : name;
  }

  getRNCPAssociatedSchools(rncpTitlewithSchools) {
    log.data('getRNCPAssociatedSchools rncpTitlewithSchools', rncpTitlewithSchools);
    const preparationCenters = rncpTitlewithSchools.preparationCenters;


    const schoolList = [];
    preparationCenters.forEach((item) => {
      schoolList.push({ text: item.shortName, id: item._id });
    });

    this.schoolListforSelect = _.orderBy(schoolList, ['text'], ['asc']);
  }

  subscribeForTestDeletionTaskRefresh() {
    this.dashboardService.refreshPendingTask.subscribe((state) => {
      if (state) {
        this.getPendingTasks(true);
      }
    });
  }

  filterPendingTask(searchText: string) {
    if ( searchText ) {
      this._searchTextSubject.next(searchText);
    }
  }

  initializeTextStream() {
    this.searchTextObservable
      .debounceTime(2000)
      .distinctUntilChanged()
      .subscribe(
        (text) => {
          this.searchPendingTask = text;
          this.page.pageNumber = 0;
          this.getPendingTasks();
        }
      );
  }

  fiterBySchool(event) {
    if ( event.id ) {
      this.filterSchool = [event];
      this.schoolId = event.id;
      this.page.pageNumber = 0;
      this.getPendingTasks();
    }
  }

  fiterByUserType(event) {
    if (event.id) {
      this.filterUsertype = [event];
      this.page.pageNumber = 0;
      this.getPendingTasks();
    }
  }

  setFilterStateinService() {

    const filterCache: any = {
      sortby: this.sort.sortby,
      sortmode: this.sort.sortmode,
      pageNumber: this.page.pageNumber
    };

    if ( this.searchPendingTask ) {
      filterCache.searchText = this.searchPendingTask;
    }

    if ( this.filterSchool[0] && this.filterSchool[0].id ) {
      filterCache.school = this.filterSchool;
    }

    if ( this.filterUsertype[0] && this.filterUsertype[0].id ) {
      filterCache.userType = this.filterUsertype;
    }

    log.data('setTaskListFilterState(filterCache)', filterCache);
    this.tableFilterStateService.pendingTaskListFilterState = filterCache ;
  }
}
