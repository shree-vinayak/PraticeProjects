import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../services/students.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { StudentCard } from './../student.card.model';
import { TranslateService } from 'ng2-translate';
import { UtilityService } from 'app/services/utility.service';
import { LoginService } from '../../../services/login.service';
import { CustomerService } from '../../customer/customer.service';

declare var swal: any;

// Required for logging
import { Log } from 'ng2-logger';
import { ProblematicCorrectorService } from '../../../services/problematic-corrector.service';
const log = Log.create('StudentDashboardComponent');
log.color = 'green';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  student: any;
  studentId: any;
  studentList: any[];
  studentUnregisteredStudent = false;
  index: any;
  studentIdListWithIndex: Array<Object> = [];
  studentIdWithIndex;
  selectedIndexForStudentsTab: number;
  private subscription: Subscription;
  StudentSearchString: string;
  customerId: string;
  activeId: string;
  activateDetails = false;
  totalStudents = [];
  paramsGoTo: string = '';
  paramStatus: string = '';
  changedStudent: Object = {
    student: '',
    index: '',
  };
  firstRNCPTitle: string = '';
  rncptitleId: string = '';
  classId: string = '';
  RNCPTitles: any[] = [];
  allClasses: any[] = [];
  filterSearchText: string = '';
  getListofStudent: boolean = true;

  /*************************************************************************
   *   CONSTRUCTOR
   *************************************************************************/
  constructor(
    private studentService: StudentsService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    public utilityService: UtilityService,
    private schoolService: CustomerService,
    private loginService: LoginService,
    private problematicCorrectorService: ProblematicCorrectorService,
  ) {
    log.info('Constructor Invoked');
  }

  /*************************************************************************
   *   EVENTS
   *************************************************************************/
  ngOnInit() {
    this.studentList = [];
    this.subscription = this.route.params.subscribe(params => {
      if (params.hasOwnProperty('customerId')) {
        this.customerId = params['customerId'];
      }

      if (params.hasOwnProperty('studentId')) {
        this.studentId = params['studentId'];

        if (this.route.snapshot.queryParams['rncpId']) {
          this.rncptitleId = this.route.snapshot.queryParams['rncpId'];
        } else {
          this.getStudentForRNCP(this.studentId);
        }
      }
      if (params.hasOwnProperty('goto')) {
        this.paramsGoTo = params['goto'];
        if (this.route.snapshot.queryParams['rncpId']) {
          this.rncptitleId = this.route.snapshot.queryParams['rncpId'];
        }
        if (this.route.snapshot.queryParams['classId']) {
          this.classId = this.route.snapshot.queryParams['classId'];
        }
      }
      if (params.hasOwnProperty('status')) {
        this.paramStatus = params['status'];
      }

      if (params.hasOwnProperty('selectedTabIndex')) {
        this.selectedIndexForStudentsTab =
          params.hasOwnProperty['selectedTabIndex'];
        if (+params['selectedTabIndex'] === 0) {
          const logInUser = this.loginService.getLoggedInUser();
          this.schoolService.getCustomer(this.customerId).subscribe(school => {
            let rncps = [];
            if (
              !this.utilityService.checkUserIsDirectorSalesAdmin() &&
              !this.utilityService.checkUserIsFromGroupOfSchools()
            ) {
              logInUser.assignedRncpTitles.forEach((rncpId, index) => {
                const rncpTitle = school[0].rncpTitles.filter(function(
                  rncpObj,
                ) {
                  return rncpObj._id && rncpObj._id === rncpId;
                });
                if (rncpTitle[0] && rncpTitle[0]._id) {
                  rncps.push(rncpTitle[0]);
                }
              });
            } else {
              rncps = school[0].rncpTitles;
            }
            this.RNCPTitles = _.orderBy(rncps, ['shortName'], ['asc']);
            if (this.RNCPTitles[0]._id) {
              this.firstRNCPTitle = this.RNCPTitles[0]._id;
              if (!this.rncptitleId) {
                this.rncptitleId = this.firstRNCPTitle;
              }
            }
            if (this.getListofStudent) {
              this.getstudentList(this.customerId, true);
            }
          });
        } else if (+params['selectedTabIndex'] === 1) {
          this.activateDetails = false;
        }
      }
    });
  }

  /*************************************************************************
   *   METHODS
   *************************************************************************/

  getstudentList(customerId, isFirst?: boolean, resetDetails?: boolean) {
    let queryString =
      '&prepcenter=' + customerId + '&rncpTitleId=' + this.rncptitleId;

    if (this.classId) {
      queryString += '&classId=' + this.classId;
    }
    if (this.filterSearchText) {
      queryString += '&searchText=' + this.filterSearchText;
    }
    this.studentService.getAllStudent(queryString).subscribe(list => {
      this.totalStudents = list.studentList.result;
      this.studentList = _.orderBy(
        list.studentList.result,
        ['lastName'],
        ['asc'],
      );
      const unregisteredStudent = this.studentList.filter(function(student) {
        return student.status && student.status === 'pending';
      });

      if (unregisteredStudent.length > 0) {
        this.studentUnregisteredStudent = true;
      } else {
        this.studentUnregisteredStudent = false;
      }

      if (isFirst) {
        this.getRncpAssoClass(this.rncptitleId, this.classId ? true : false);
        if (this.studentId !== undefined) {
          this.studentList.forEach((element, i) => {
            if (this.studentId === element._id) {
              this.student = element;
              this.index = i;
            }
          });
          this.emitStudent(this.student, this.index);
        } else if (
          this.paramsGoTo !== '' &&
          this.paramsGoTo.toLowerCase() === 'finalcertification' &&
          !this.studentId
        ) {
          this.emitStudent(this.studentList[0], 0);
        } else if (
          this.paramsGoTo !== '' &&
          (this.paramsGoTo.toLowerCase() === 'problematic' ||
            this.paramsGoTo.toLowerCase() === 'mentoreval')
        ) {
          // To select Card based on status of Problematic Or MentorEval and Open Details For Link
          this.detailsOfStudentWithProblematic(this.paramStatus);
        }
      }

      if (resetDetails) {
        this.activateDetails = false;
      }
    });

  }

  openCreateStudentPopup() {
    this.router.navigateByUrl('/add-student/' + this.customerId);
  }

  selectedStudent(event) {
    this.studentId = event['_id'];
  }

  emitStudent(student, i) {
    if (this.activeId !== student._id) {
      this.studentIdWithIndex = {
        student: student,
        index: i,
      };
      this.activeId = student._id;
      this.activateDetails = true;
    }
  }

  studentChanged(studentWithIndex) {
    log.data('studentChanged studentWithIndex', studentWithIndex);
    this.changedStudent = studentWithIndex;
    const index = _.findIndex(this.studentList, {
      _id: studentWithIndex.student._id,
    });
    this.studentList[index] = studentWithIndex.student;
    this.studentList = [...this.studentList];
    // this.getstudentList(this.customerId);
  }

  triggerMailToUnregisteredStudents() {
    const schoolObject = {
      schoolId: this.customerId,
      // 'students': [],
      lang: this.translate.currentLang.toUpperCase(),
    };
    this.studentService.studentTriggerMail(schoolObject).subscribe(response => {
      const status = response.code === 200 ? true : false;
      swal({
        title: status
          ? this.translate.instant('STUDENT.MESSAGE.SUCCESS')
          : this.translate.instant('BACKEND.STUDENT.SORRY'),
        html: status
          ? this.translate.instant(response.data)
          : this.translate.instant('BACKEND.STUDENT.SENDREGISTERMAIL.ERROR'),
        allowEscapeKey: true,
        type: status ? 'success' : 'warning',
        confirmButtonText: status
          ? this.translate.instant('BACKEND.STUDENT.THANKYOU')
          : this.translate.instant('BACKEND.STUDENT.UNDERSTOOD'),
      });
    });
  }

  detailsOfStudentWithProblematic(status: string) {
    if (this.paramsGoTo.toLowerCase() === 'problematic') {
      if (status) {
        for (let index = 0; index < this.studentList.length; index++) {
          // Check for First Problmatic Status Match and Open Details of that Student
          if (
            this.studentList[index].problematicId &&
            this.studentList[index].problematicId.problematicStatus === status
          ) {
            this.emitStudent(this.studentList[index], index);
            break;
          } else if (
            status === 'sent_to_certifier' &&
            (this.studentList[index].problematicId &&
              this.studentList[index].problematicId.problematicStatus ===
                'resubmitted_to_certifier')
          ) {
            this.emitStudent(this.studentList[index], index);
            break;
          }
        }
      } else {
        for (let index = 0; index < this.studentList.length; index++) {
          // Open student with Active Problematic Independant of Status
          if (this.studentList[index].problematicId) {
            this.emitStudent(this.studentList[index], index);
            break;
          }
        }
      }
    } else if (this.paramsGoTo.toLowerCase() === 'mentoreval' && status) {
      for (let index = 0; index < this.studentList.length; index++) {
        // Check for First Mentor Eval Status Match and Open Details of that Student
        if (
          this.studentList[index].mentorEvaluationId &&
          this.studentList[index].mentorEvaluationId.mentorEvaluationStatus ===
            status
        ) {
          this.emitStudent(this.studentList[index], index);
          break;
        }
      }
    }
  }

  getRncpAssoClass(rncp_id, firstLoad?: boolean) {
    // this.studentService.setRNCPforSTudentDetails(rncp_id);
    // this.studentService.setClassforStudentDetails(this.classId);
    this.studentService.getAllClassesRNCPTitle(rncp_id).subscribe(response => {
      this.allClasses = _.orderBy(response.data, ['shortName'], ['asc']);

      // To Set Default Class for RNCP Title with 1 Class
      if (this.allClasses.length === 1) {
        this.classId = this.allClasses[0]._id;
      } else if (!firstLoad) {
        this.classId = '';
      }
    });
  }

  getStudentForRNCP(studentId) {
    this.getListofStudent = false;
    this.studentService.getStudentDetails(studentId).subscribe(response => {
      const student = response.data.result;
      this.studentList = [student];
      this.emitStudent(student, 0);
      this.rncptitleId = student.rncpTitle._id;
      this.getstudentList(this.customerId, true);
      this.getListofStudent = true;
    });
  }

  resetSearch() {
    this.rncptitleId = this.firstRNCPTitle;
    this.classId = '';
    this.filterSearchText = '';
    this.getstudentList(this.customerId);
    this.activateDetails = false;
    this.activeId = '';
    this.getRncpAssoClass(this.rncptitleId);
  }
  // onSelectClass(id) {
  //   this.studentService.setClassforStudentDetails(id);
  // }
}
