import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { CustomerService } from '../../customer/customer.service';
import { StudentsService } from '../../../services/students.service';
import { LoginService } from '../../../services/login.service';
import { StudentFilter } from '../../../models/studentfilter.model';
import { GlobalConstants } from '../../../shared/settings/global-constants';
import { Subscription } from 'rxjs/Subscription';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { StudentReactivationDialogComponent } from '../student-dialogs/student-reactivation-dialog/student-reactivation-dialog.component';
import _ from 'lodash';

// required for logging
import { Log } from 'ng2-logger';
const log = Log.create('StudentInactiveTableComponent');
log.color = 'blue';

declare var swal: any;

@Component({
  selector: 'app-student-inactive-table',
  templateUrl: './student-inactive-table.component.html',
  styleUrls: ['./student-inactive-table.component.scss']
})
export class StudentInactiveTableComponent implements OnInit {

  firstRNCPTitle: string;
  loggedInUserId: string;
  userClassTitle: string;
  searchText: any;
  rncptitle: string;
  isSearching: boolean;
  customerId: string;
  selectedIndexForStudentsTab: number = 0;
  studentFilterObject: StudentFilter = new StudentFilter();
  private subscription: Subscription;
  RNCPTitles = [];
  studentIdList = [];
  testsList = [];
  page = new Page();
  sort = new Sort();
  classType: any = [];
  selectedstudents = [];
  StudentList: any = null;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };

  
  public reactivateStudentDialog: MdDialogRef<StudentReactivationDialogComponent>;
  reactivateStudentConfig: MdDialogConfig = {
    disableClose: true,
    width: '500px'
  };
  constructor(
    public utilityService: UtilityService,
    private router: Router,
    private dialog: MdDialog,
    public dialog1: MdDialog,
    public dialog2: MdDialog,
    public reactivateStudentdialog: MdDialog,
    private translate: TranslateService,
    private schoolService: CustomerService,
    private studentService: StudentsService,
    private route: ActivatedRoute,
    private loginService: LoginService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      if (params.hasOwnProperty('customerId')) {
        this.customerId = params['customerId'];
      }
      if ( this.route.snapshot.queryParams['rncpId'] ) {
        this.rncptitle = this.route.snapshot.queryParams['rncpId'];
      } else {
        this.rncptitle = '';
      }

      if (params.hasOwnProperty('selectedTabIndex')) {
        this.selectedIndexForStudentsTab = params['selectedTabIndex'];
        if (+params['selectedTabIndex'] === 2) {
          const logInUser = this.loginService.getLoggedInUser();
          this.loggedInUserId = logInUser._id;

          this.schoolService.getCustomer(this.customerId).subscribe(school => {
            log.data('this.schoolService.getCustomer', school[0]);
            let rncps = [];
            if( !this.utilityService.checkUserIsDirectorSalesAdmin() && !this.utilityService.checkUserIsFromGroupOfSchools()) {
              logInUser.assignedRncpTitles.forEach((rncpId, index) => {
                const rncpTitle = school[0].rncpTitles.filter(function(rncpObj) {
                  return rncpObj._id && rncpObj._id === rncpId;
                });
                if ( rncpTitle[0] && rncpTitle[0]._id ) {
                  rncps.push(rncpTitle[0]);
                }
              });
            } else {
              rncps = school[0].rncpTitles;
            }
            this.RNCPTitles = _.orderBy(rncps, ['shortName'], ['asc']);
            if (this.RNCPTitles[0]._id) {
              this.firstRNCPTitle = this.RNCPTitles[0]._id;
              if ( !this.rncptitle ) {
                this.rncptitle = this.firstRNCPTitle;
              }
              this.getRncpAssoClass(this.rncptitle);
            }
            this.searchUserList(true, params['customerId']);
          });

          this.page.pageNumber = 0;
          this.page.size = GlobalConstants.NoOfRecordsPerPage;
          this.page.totalElements = 0;
          this.sort.sortby = '';
          this.sort.sortmode = 'asc';
        }
      }

    });
    const event = {
      selected: []
    };
    this.onStudentSelected(event);
  }

  getRncpAssoClass(rncp_id) {
    this.studentService.getAllClassesRNCPTitle(rncp_id).subscribe(response => {
      this.classType = _.orderBy(response.data, ['shortName'], ['asc']);

      // To Set Default Class for RNCP Title with 1 Class
      if ( this.classType.length === 1 ) {
        this.userClassTitle = this.classType[0]._id;
      } else {
        this.userClassTitle = '';
      }
    });
  }

  searchUserList(isFirst: boolean, schoolId?: string) {
    // const testlist = this.testsList;
    this.isSearching = true;

    this.studentFilterObject.rncpTitle =
      this.rncptitle !== '' ? this.rncptitle : '';
    this.studentFilterObject.lastName =
      this.searchText !== '' ? this.searchText : '';
    this.studentFilterObject.schoolId = this.customerId;
    this.studentFilterObject.currentClass = this.userClassTitle;
    this.studentFilterObject.registrationStatus = 'deactivated';
    this.page.size = GlobalConstants.NoOfRecordsPerPage;
    this.page.totalElements = 0;
    this.studentService.getListOfStudentsWithTests(this.studentFilterObject).subscribe(response => {

      this.StudentList = response.data.students;

      this.testsList = null;
      this.testsList = response.data.subjectTests;
      this.page.totalElements = this.StudentList.length;
      this.page.pageNumber = response.paginate.page - 1;
      this.page.size = response.paginate.limit;
      this.page.totalPages = Math.ceil(
        response.total / GlobalConstants.NoOfRecordsPerPage
      );
    });
  }

  goToAddStudent() {
    this.router.navigateByUrl(
      '/add-student/' + this.customerId + '/' + this.selectedIndexForStudentsTab
    );
  }

  onStudentSelected(event) {
    if (event.selected.length > 0) {
      this.selectedstudents = [];
      this.studentIdList = [];
      this.selectedstudents = event.selected;
      if (this.selectedstudents.length > 0) {
        this.selectedstudents.forEach(student => {
          this.studentIdList.push(student._id);
        });
      }
    }
  }

  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
  }

  checkUploaded(docs) {
    const indexOf = _.findIndex(docs, { isUploaded: false });
    if (indexOf > -1) {
      return false;
    } else {
      return true;
    }
  }

  sortPage(sortInfo): void {
    const sortMode = sortInfo.newValue;
    const sortBy = sortInfo.column.name;
    if( sortBy === 'jobDescriptionId.status') {
      // For JobDescription Status based Sorting
      this.StudentList = _.orderBy(this.StudentList, function (student) {
        if ( student.jobDescriptionId && student.jobDescriptionId.status ) {
          const jobDescStatus = student.jobDescriptionId.status;
          switch (jobDescStatus) {
            case 'sent_to_student':
            if ( student.jobDescriptionId.sendNotification ) {
              return '1';
            } else {
              return'0';
            }
            case 'sent_to_mentor':
            case 'validated_by_mentor':
              return '2';
            case 'validated_by_acad_staff':
            case 'expedite_by_acad_staff':
            case 'expedite_by_acad_staff_student':
              return '3';
          }
        } else {
          return '0';
        }
      }, [sortMode]);
  } else if (sortBy === 'problematicId.problematicStatus' ) {
    // For Problematic Status based Sorting
    this.StudentList = _.orderBy(this.StudentList, function (student) {
      if ( student.problematicId && student.problematicId.problematicStatus ) {
        const probleamticStatus = student.problematicId.problematicStatus;
        switch (probleamticStatus) {
          case 'sent_to_student':
          case 'rejected_by_acadDpt':
          case 'rejected_by_certifier':
            return '1';
          case 'sent_to_acadDpt':
          case 'resubmitted_to_acadDpt':
            return '2';
          case 'validated_by_acadDpt':
            return '3';
          case 'sent_to_certifier':
            return '4';
          case 'validated_by_certifier':
            return '5';
        }
      } else {
        return '0';
      }
     }, [sortMode]);

    } else {
      this.StudentList = _.orderBy(this.StudentList, [sortBy], [sortMode]);
    }
  }

  resetSearch() {
    // ToDo implement this
    this.studentFilterObject = new StudentFilter();
    this.searchText = '';
    this.userClassTitle = '';
    this.rncptitle = this.firstRNCPTitle;
    this.page.pageNumber = 0;
    this.page.size = GlobalConstants.NoOfRecordsPerPage;
    this.page.totalElements = 0;
    this.page.totalPages = 5;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    this.isSearching = false;
    this.searchUserList(true);
    this.selectedstudents = [];
    const event = {
      selected: []
    };
    this.onStudentSelected(event);
  }

  reactivateStudent(student) {
    log.data('reactivateStudent(student)', student);
    const self = this;
    swal({
      title: self.translate.instant('STUDENT.MESSAGE.REACTIVATE_STUDENT.TITLE'),
      html: self.translate.instant('STUDENT.MESSAGE.REACTIVATE_STUDENT.TEXT', {
        Civility: self.utilityService.computeCivility(
          student.sex,
          self.translate.currentLang.toUpperCase()
        ),
        LName: student.lastName,
        FName: student.firstName
      }),
      type: 'warning',
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: self.translate.instant(
        'STUDENT.MESSAGE.REACTIVATE_STUDENT.REACTIVATE'
      ),
      cancelButtonText: self.translate.instant(
        'STUDENT.MESSAGE.DEACTIVATEDSTUDENTACTION.Cancel'
      ),
      closeOnConfirm: true
    }).then(
      function (isConfirm) {
        if (isConfirm) {
          self.reactivateStudentDialog = self.reactivateStudentdialog.open(
            StudentReactivationDialogComponent,
            self.reactivateStudentConfig
          );
          self.reactivateStudentDialog.componentInstance.studentDetails = student;
          self.reactivateStudentDialog.afterClosed().subscribe(updated => {
            if (updated) {
              self.searchUserList(true);
              self.selectedstudents = [];
              const event = {
                selected: []
              };
              self.onStudentSelected(event);
            }
          });
        }
      }.bind(this)
    );
  }

  onExportPDF() {
    // ToDo implement this
  }

}
