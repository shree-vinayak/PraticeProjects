import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/users.service';
import { UtilityService } from 'app/services/utility.service';
import { Page } from 'app/models/page.model';
import { Sort } from 'app/models/sort.model';
import { UserFilter } from 'app/models/userfilter.model';
import { ADMTCStaffDialogComponent } from 'app/dialogs/admtc-staff-menu-dialog/admtc-staff-menu-component';
import { PCUserDialogComponent } from 'app/dialogs/pc-user-menu-dialog/pc-user-menu-component';
import { MdDialog, MdDialogConfig, MdDialogRef, MdMenuTrigger } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { CustomerService } from '../../customer/customer.service';
import { StudentsService } from 'app/services/students.service';
import _ from 'lodash';
import { GlobalConstants } from 'app/shared/settings/global-constants';
import { Subscription } from 'rxjs/Subscription';
import { StudentFilter } from 'app/models/studentfilter.model';
import { ApplicationUrls } from 'app/shared/settings';
import { ComposeMailComponent } from 'app/components/Mail/compose-mail/compose-mail.component';
import { JobDescriptionNotificationDialogComponent } from '../../customer/customer-edit/customer-edit-student/job-description-notification-dialog/job-description-notification-dialog.component';
import { MentorEvaluationService } from 'app/services/mentor-evaluation.service';
import { StudentDialogComponent } from '../student-dialogs/student-dialogs.component';
import { AddTaskDialogComponent } from '../../../dialogs/add-task-dialog/add-task-dialog.component';
import { LoginService } from '../../../services/login.service';
import { TestCorrectionService } from '../../../services/test-correction.service';
import { DownloadAnyFileOrDocFromS3 } from '../../../shared/global-urls';
import { AppSettings } from '../../../app-settings';

// required for logging
import { Log } from 'ng2-logger';
import { DisplayMailPopupComponent } from '../../Mail/display-mail-popup/display-mail-popup.component';
import { AlertService } from 'app/services/alert.service';
const log = Log.create('StudentDetailListComponent');
log.color = 'blue';

declare var swal: any;

declare const jsPDF;
@Component({
  selector: 'app-student-detailslist',
  templateUrl: './student-details-list.component.html',
  styleUrls: ['./student-details-list.component.scss']
})
export class StudentDetailListComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  selectedstudents = [];
  users: any = [];
  RNCPTitles: any = [];
  isPrepCenter = false;
  isSearching = false;
  isjobdescription = false;
  isproblematic = false;
  isSendCertiDegree = false;
  isEvaluation = false;
  studentId: string;
  customerId: string;
  deteUserDate = '';
  deteUserReason = '';
  rncptitle = '';
  firstRNCPTitle = '';
  userClassTitle = '';
  searchText = '';
  certifier_label;
  loggedInUserId: string;
  studentFilterObject: StudentFilter = new StudentFilter();
  StudentList: any = null;
  imgUrl = ApplicationUrls.imageBasePath + 'assets/images/default_img.png';
  Subscription: Subscription;
  selectedIndexForStudentsTab: Number;
  selectedIndexForStudentsCard: Number = 0;
  classType: any = [];
  public jobDescriptionDialog: MdDialogRef<JobDescriptionNotificationDialogComponent>;
  public dialogRef: MdDialogRef<ComposeMailComponent>;
  public deleteStudentDialog: MdDialogRef<StudentDialogComponent>;
  popupConfig: MdDialogConfig;
  public dialogRefDisplayMail: MdDialogRef<DisplayMailPopupComponent>;
  DisplayMailPopupConfig: MdDialogConfig = {
    disableClose: true,
    width: '850px',
    height: '65%'
  };
  studentIdList = [];
  testsList = [];
  page = new Page();
  sort = new Sort();
  reorderable = true;
  showThumbsUpBtn:boolean =false;
  transcriptColor:any;
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  customer = {
    schoolId: '',
    rncpId: ''
  };
  selectedRNCP = [];

  admtcStaffDialogComponent: MdDialogRef<ADMTCStaffDialogComponent>;
  serverimgPath = ApplicationUrls.baseApi;

  // ADMTC staff dialog property
  configCat: MdDialogConfig = {
    disableClose: true,
    width: '450px'
  };
  sendMailBox: MdDialogConfig = {
    disableClose: true,
    width: '800px',
    height: '530px'
  };

  deleteStudentConfig: MdDialogConfig = {
    disableClose: true,
    width: '500px'
  };

  private subscription: Subscription;
  private RNCPSubscription: Subscription;
  private classSubscription: Subscription;

  addTaskDialogComponent: MdDialogRef<AddTaskDialogComponent>;
  taskDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '600px'
  };
  getAlertUserList: any;
  newAlert: boolean;

  /*************************************************************************
   *   CONSTRUCTOR
   *************************************************************************/
  constructor(
    public utilityService: UtilityService,
    private service: UserService,
    private router: Router,
    private dialog: MdDialog,
    public dialog1: MdDialog,
    public dialog2: MdDialog,
    public deleteStudentdialog: MdDialog,
    private translate: TranslateService,
    private schoolService: CustomerService,
    private studentService: StudentsService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private mentorEvaluationService: MentorEvaluationService,
    private testCorrectionService: TestCorrectionService,
    private alertService: AlertService
  ) { }

  /*************************************************************************
   *   EVENTS
   *************************************************************************/
  ngOnInit() {
    console.log("inn");
    this.subscription = this.route.params.subscribe(params => {
      if (params.hasOwnProperty('customerId')) {
        this.customerId = params['customerId'];
      }
      if (params.hasOwnProperty('selectedTabIndex')) {
        this.selectedIndexForStudentsTab = params['selectedTabIndex'];
        if (+params['selectedTabIndex'] === 1) {
          const logInUser = this.loginService.getLoggedInUser();
          this.loggedInUserId = logInUser._id;

          this.schoolService.getCustomer(this.customerId).subscribe(school => {
            let rncps = [];
            if (!this.utilityService.checkUserIsDirectorSalesAdmin() && !this.utilityService.checkUserIsFromGroupOfSchools()) {
              logInUser.assignedRncpTitles.forEach((rncpId, index) => {
                const rncpTitle = school[0].rncpTitles.filter(function (rncpObj) {
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
              // this.rncptitle = this.firstRNCPTitle;
              // this.getRncpAssoClass(this.firstRNCPTitle);
            }
            this.searchUserList(true, params['customerId']);
          });

          this.page.pageNumber = 0;
          this.page.size = GlobalConstants.NoOfRecordsPerPage;
          this.page.totalElements = 0;
          this.sort.sortby = '';
          this.sort.sortmode = 'asc';
          this.getAllUsers();
        }
      }
    });
    const event = {
      selected: []
    };
    this.onStudentSelected(event);
    this.showThumbsUpBtn = (this.utilityService.checkUserIsAcademicDirector() ||this.utilityService.checkUserIsDirectorSalesAdmin()) ;

    // this.RNCPSubscription  = this.studentService.getRNCPofStudent().subscribe( res => {
    //   if (res) {
    //     this.rncptitle = res;
    //     this.getRncpAssoClass(res);

    //   } else {
    //     this.rncptitle = this.firstRNCPTitle;
    //     this.getRncpAssoClass(this.firstRNCPTitle);
    //   }
    // });

    // this.classSubscription = this.studentService.getClassofStudent().subscribe( res => {
    //   if (res) {
    //     this.userClassTitle = res;
    //   }
    // });

    this.checkIfNewAlert();
  }
  /*************************************************************************
   *   METHODS
   *************************************************************************/

  checkIfNewAlert(){
    console.log("inn");
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

  
  getAllUsers() {
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('customerId')) {
        this.customer.schoolId = params['customerId'];
      }
    });
  }

  sendMentorEvaluation() {
    if (this.studentIdList && this.studentIdList.length) {
      const data = {
        student: this.studentIdList
      };
      this.mentorEvaluationService
        .createMentorEvaluation(data)
        .subscribe(value => {
          if (value.data) {
            this.searchUserList(true);
            this.selectedstudents = [];
            const event = {
              selected: []
            };
            this.onStudentSelected(event);
            swal({
              title: this.translate.instant(
                'TESTCORRECTIONS.MESSAGE.MENTQUEST_S12_TITLE'
              ),
              text: this.translate.instant(
                'TESTCORRECTIONS.MESSAGE.MENTQUEST_S12_TEXT'
              ),
              allowEscapeKey: true,
              type: 'success',
              confirmButtonText: this.translate.instant(
                'TESTCORRECTIONS.MESSAGE.MENTQUEST_S12_BTN'
              )
            });
          } else if (value.code === 400) {
            swal({
              title: 'Oops...',
              text: 'Something went Wrong',
              allowEscapeKey: true,
              type: 'error'
            });
          } else {
            swal({
              title: 'Oops...',
              text: 'Something went Wrong',
              allowEscapeKey: true,
              type: 'error'
            });
          }
        });
    }
  }


  onExportPDF() {
    const self = this;
    if (self.selectedstudents.length > 0) {
      swal({
        type: 'question',
        title: this.translate.instant(
          'STUDENT.PROBLEMATIC.SENDNOTIFICATION.ChoosedocumentTitle'
        ),
        html: this.translate.instant('STUDENT.PROBLEMATIC.SENDNOTIFICATION.Choosedocument') + '<br/>' +
          '<form><input type="checkbox"><span style="padding-left:10px;">' + this.translate.instant('STUDENT.FILESTUDENT') +
          '</span>&nbsp;&nbsp; <input type="checkbox"><span style="padding-left:10px;">' + this.translate.instant('STUDENT.JOBDESCRIPTION') +
          '</span><br><input type="checkbox"><span style="padding-left:10px;">' + this.translate.instant('STUDENT.PROBLEMATICPDF') +
          '</span>&nbsp;&nbsp;<input type="checkbox"><span style="padding-left:10px;">' + this.translate.instant('STUDENT.MENTORPDF') +
          '</span><br></form>',
        confirmButtonClass: 'btn-danger',
        allowEscapeKey: true,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('STUDENT.PDF/PRINT'),
        cancelButtonClass: 'btn-danger',
        cancelButtonText: this.translate.instant('CANCEL')
      }).then(
        function (isConfirm) {
          if (isConfirm) {
            if (self.selectedstudents.length > 1) {
              swal({
                text:
                  'to inform that all the document of all students selected will be generated in 1 single page file',
                type: 'info',
                confirmButtonClass: 'btn-danger',
                allowEscapeKey: true,
                showCancelButton: true
              }).then(
                function (isConfirm) {
                  if (isConfirm) {
                    const doc = new jsPDF();
                    const col = [];
                    const rows = [];
                    doc.text(col, rows);
                    doc.save('Test.pdf');
                  }
                },
                function (dismiss) {
                  if (dismiss === 'cancel') {
                  }
                }.bind(this)
              );
            } else {
              const doc = new jsPDF();
              const col = [];
              const rows = [];

              doc.text(col, rows);
              doc.save('Test.pdf');
            }
          }
        },
        function (dismiss) {
          if (dismiss === 'cancel') {
          }
        }.bind(this)
      );
    } else {
      swal({
        title: this.translate.instant('STUDENT.PRINT_S1'),
        type: 'error',
        confirmButtonClass: 'btn-danger',
        allowEscapeKey: true,
        confirmButtonText: this.translate.instant('JOBDESCRIPTIONFORM.S6.OK')
      });
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
              if( student.jobDescriptionId.sendNotification ) {
                return '1';
              } else {
                return '0';
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

  getRncpAssoClass(rncp_id) {

    if (this.selectedstudents.length > 0) {
      this.checkProblematicStatus(rncp_id);
    }

    this.studentService.getAllClassesRNCPTitle(rncp_id).subscribe(response => {
      this.classType = _.orderBy(response.data, ['shortName'], ['asc']);

      // To Set Default Class for RNCP Title with 1 Class
      // if (!this.userClassTitle) {
      if ( this.classType.length === 1 ) {
        this.userClassTitle = this.classType[0]._id;
      } else {
        this.userClassTitle = '';
      }
    //   }else {
    //     this.classSubscription = this.studentService.getClassofStudent().subscribe(res => {
    //       if (res) {
    //         this.userClassTitle = res;
    //       }
    //     });
    // }

    });

  }

  getAssoClassStudent() {
    // if (false) {
    // this.searchUserList(true);
    // }
  }

  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
  }

  searchUserList(isFirst: boolean, schoolId?: string) {
    const testlist = this.testsList;
    this.isSearching = true;

    this.studentFilterObject.rncpTitle =
      this.rncptitle !== '' ? this.rncptitle : '';
    this.studentFilterObject.lastName =
      this.searchText !== '' ? this.searchText : '';
    this.studentFilterObject.schoolId = this.customerId;

    this.studentFilterObject.currentClass = this.userClassTitle;
    this.page.size = GlobalConstants.NoOfRecordsPerPage;
    this.page.totalElements = 0;
    this.studentService.getListOfStudentsWithTests(this.studentFilterObject).subscribe(response => {
      this.StudentList = response.data.students;
      this.testsList = response.data.subjectTests;
      this.page.totalElements = this.StudentList.length;
      this.page.pageNumber = response.paginate.page - 1;
      this.page.size = response.paginate.limit;
      this.certifier_label = this.StudentList[0] && this.StudentList[0].rncpTitle.certifier.shortName;
      this.page.totalPages = Math.ceil(
        response.total / GlobalConstants.NoOfRecordsPerPage
      );
    });
  }

  resetSearch() {
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

  onProblematic() {
    const self = this;
    swal({
      title: this.translate.instant(
        'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SEND_TO_MANY.TITLE'
      ),
      html: this.translate.instant(
        'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SEND_TO_MANY.TEXT'
      ),
      type: 'question',
      confirmButtonClass: 'btn-danger',
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonText: this.translate.instant(
        'STUDENT.PROBLEMATIC.SENDNOTIFICATION.BUTTON1'
      ),
      cancelButtonText: this.translate.instant(
        'STUDENT.PROBLEMATIC.SENDNOTIFICATION.BUTTON2'
      ),
      closeOnConfirm: false
    }).then(
      function (isConfirm) {
        if (isConfirm) {
          if (self.studentIdList && self.studentIdList.length) {
            self.studentService
              .sendProblematicToStudent(self.studentIdList)
              .subscribe(response => {
                if (response.data) {
                  self.searchUserList(true);
                  if (response.data.problematicNotSentTo.length > 0) {
                    let str = '<ol style="display:inline-block;">';
                    response.data.problematicNotSentTo.forEach(element => {
                      str += '<li style="text-align:left !important;">' +
                        self.utilityService.computeCivility(element.sex, self.translate.currentLang.toUpperCase())
                        + ' ' + element.firstName + ' ' + element.lastName + '</li>';
                    });
                    str += '</ol>';
                    self.translate.reloadLang(self.translate.currentLang).subscribe(() => {
                      swal({
                        title: self.translate.instant('STUDENT.PROBLEMATIC.SENDNOTIFICATION.NOT_SENT_TO.TITLE'),
                        html: self.translate.instant('STUDENT.PROBLEMATIC.SENDNOTIFICATION.NOT_SENT_TO.TEXT', { studentlist: str }),
                        type: 'warning',
                        allowEscapeKey: true,
                        confirmButtonClass: 'btn-danger',
                        confirmButtonText: self.translate.instant('STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_BTN'),
                        closeOnConfirm: false,
                      });
                    });
                  } else if (self.studentIdList.length === 1) {
                    const student = self.selectedstudents[0];
                    const fullName = self.utilityService.computeCivility(student.sex, self.translate.currentLang.toLowerCase()) +
                      " " + student.firstName + " " + student.lastName;
                    swal({
                      title: self.translate.instant(
                        "STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_TIT"
                      ),
                      text: self.translate.instant(
                        "STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_TEXT",
                        { FullName: fullName }
                      ),
                      type: "success",
                      allowEscapeKey: true,
                      confirmButtonText: self.translate.instant(
                        "STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_BTN"
                      )
                    });
                  } else {
                    swal({
                      type: 'success',
                      title: self.translate.instant('NEW_SCHOOL.SUCCESS'),
                      text: self.translate.instant('STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_TIT'),
                      confirmButtonText: self.translate.instant('STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_BTN')
                    });
                  }
                  self.selectedstudents = [];
                } else {
                  swal({
                    type: 'warning',
                    title: this.translate.instant('STUDENT.MESSAGE.ERRORTIT'),
                    text: self.translate.instant('STUDENT.MESSAGE.FAILEDMESSAGE'),
                    confirmButtonText: self.translate.instant('STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_BTN')
                  });
                }
              });
          } else {
            swal({
              type: 'warning',
              title: this.translate.instant('STUDENT.MESSAGE.ERRORTIT'),
              text: self.translate.instant('STUDENT.MESSAGE.FAILEDMESSAGE'),
              confirmButtonText: self.translate.instant('STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_BTN')
            });
          }
        }
      },
      function (dismiss) {
        if (dismiss === 'cancel') {
        }
      }.bind(this)
    );
  }

  // FilterRecords(data) {
  //   const testlist = this.testsList;
  //   const dasc = [];
  //   if (data === 1) {
  //     const mydata = this.StudentList;
  //     for (let i = 0; i < mydata.length; i++) {
  //       if (
  //         mydata[i].jobDescriptionId != null ||
  //         mydata[i].jobDescriptionId !== undefined
  //       ) {
  //         if (
  //           mydata[i].jobDescriptionId.status === 'not_sent_to_student_yet' ||
  //           mydata[i].jobDescriptionId.status === 'sent_to_mentor' ||
  //           mydata[i].jobDescriptionId.status === 'validated_by_mentor'
  //         ) {
  //           dasc.push(mydata[i]);
  //         }
  //       }
  //     }
  //     this.StudentList = dasc;
  //     this.testsList = testlist;
  //     this.page.totalElements = dasc.length;
  //   }
  // }
  openJobDescriptionNotification() {
    this.jobDescriptionDialog = this.dialog1.open(
      JobDescriptionNotificationDialogComponent,
      this.popupConfig
    );
    this.jobDescriptionDialog.componentInstance.selectedStudent = this.selectedstudents;
    this.jobDescriptionDialog.componentInstance.customer = this.StudentList[0].school;
    this.jobDescriptionDialog.afterClosed().subscribe(result => {
      this.jobDescriptionDialog = null;
    });
    const studentIdList = [];
    this.jobDescriptionDialog.afterClosed().subscribe(result => {
      this.jobDescriptionDialog = null;
      if (this.studentService.jobDescriptionSendToStudents) {
        this.searchUserList(true);
        this.selectedstudents = [];
        const event = {
          selected: []
        };
        this.onStudentSelected(event);
      }
    });
  }

  onStudentSelected(event) {


    if (event.selected.length > 0) {
      this.selectedstudents = [];
      this.studentIdList = [];
      this.selectedstudents = event.selected;

      this.checkProblematicStatus(this.rncptitle);

      if (this.selectedstudents.length > 0) {
        this.isjobdescription = true;
        this.isEvaluation = true;
        this.isSendCertiDegree = true;
        this.selectedstudents.forEach(student => {
          this.studentIdList.push(student._id);
        });
      } else {
        this.isjobdescription = false;
        this.isEvaluation = false;
        this.isSendCertiDegree = false;
      }
    } else {
      this.selectedstudents = [];
      this.isjobdescription = false;
      this.isproblematic = false;
      this.isEvaluation = false;
      this.isSendCertiDegree = false;
    }
  }

  // If selected students are more than zero and selected RNCP "hasProblematic === true" show the button else disable it
  checkProblematicStatus(rncpId) {
    this.selectedRNCP = this.RNCPTitles.filter(p => {
      return p._id === rncpId;
    });

    if (this.selectedRNCP && this.selectedRNCP[0].hasProblematic) {
      this.isproblematic = true;
    } else {
      this.isproblematic = false;
    }
  }


  deleteStudent(data) {
    const self = this;
    swal({
      title: self.translate.instant('STUDENT.MESSAGE.CONFIRMDEACTIVETITLE'),
      html: self.translate.instant('STUDENT.MESSAGE.CONFIRMDEACTIVE', {
        Civility: self.utilityService.computeCivility(
          data.sex,
          self.translate.currentLang.toUpperCase()
        ),
        LName: data.lastName,
        FName: data.firstName
      }),
      type: 'warning',
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: self.translate.instant(
        'STUDENT.MESSAGE.DEACTIVATEDSTUDENTACTION.Resignation'
      ),
      cancelButtonText: self.translate.instant(
        'STUDENT.MESSAGE.DEACTIVATEDSTUDENTACTION.Cancel'
      ),
      closeOnConfirm: true
    }).then(
      function (isConfirm) {
        if (isConfirm) {
          self.deleteStudentDialog = self.deleteStudentdialog.open(
            StudentDialogComponent,
            self.deleteStudentConfig
          );
          self.deleteStudentDialog.componentInstance.studentDetails = data;
          self.deleteStudentDialog.afterClosed().subscribe(updated => {
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
      },
      function (dismiss) {
        if (dismiss === 'cancel') {
        }
      }.bind(this)
    );
  }

  goToAddStudent() {
    this.router.navigateByUrl(
      '/add-student/' + this.customerId + '/' + this.selectedIndexForStudentsTab
    );
  }

  onEdit(student) {
    this.router.navigate([
      '/school/' +
      this.customer.schoolId +
      '/edit/' +
      this.selectedIndexForStudentsCard +
      '/' +
      student._id
    ], { queryParams: { rncpId: student.rncpTitle._id }});
  }

  sendMail(data) {
    this.selectedstudents.push(data);
    this.dialogRef = this.dialog2.open(ComposeMailComponent, this.sendMailBox);
    // this.dialogRef.componentInstance.studentId = data._id;
    this.dialogRef.componentInstance.student = data;
    // this.dialogRef.componentInstance.selectedStudent = this.selectedstudents;
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
    return false;
  }

  checkUploaded(docs) {
    const indexOf = _.findIndex(docs, { isUploaded: false });
    if (indexOf > -1) {
      return false;
    } else {
      return true;
    }
  }

  goToStudentImport() {
    this.router.navigateByUrl(
      '/import-student/' + this.customerId
    );
  }

  sendCertiDegree() {
    const data = {
      students: this.selectedstudents
    };


    this.studentService.sendCertiDegree(data).subscribe((response) => {
      log.data('sendCertiDegree', response);

      // swal({
      //   title: this.translate.instant(
      //     'STUDENT_IMPORT.SUCCESSFULL_IMPORT.TITLE'
      //   ),
      //   html: this.translate.instant('STUDENT_IMPORT.SUCCESSFULL_IMPORT.TEXT'),
      //   type: 'success',
      //   allowEscapeKey: true,
      //   confirmButtonText: this.translate.instant('STUDENT_IMPORT.SUCCESSFULL_IMPORT.BUTTON')
      // });

    });

  }

  getTestDocStatus(correctedTests, subjectTestId): string {

    const currentCorrectedTest = correctedTests.filter(function (correctedTest) {
      return correctedTest.test && correctedTest.test.subjectTestId === subjectTestId;
    });


    if (
      currentCorrectedTest.length > 0 &&
      currentCorrectedTest[0].correction &&
      currentCorrectedTest[0].correction.expectedDocuments &&
      currentCorrectedTest[0].correction.expectedDocuments.length > 0
    ) {
      return currentCorrectedTest[0].correction.expectedDocuments[0].validationStatus;
    }
    return 'initial';
  }

  getMarksForStudent(student, subjectTestId) {

    const currentCorrectedTest = student.correctedTests.filter(function (correctedTest) {
      return correctedTest.test && correctedTest.test.subjectTestId === subjectTestId;
    });

    if (currentCorrectedTest.length > 0) {

      // if ((currentCorrectedTest[0].test.correctionType === 'pc' || currentCorrectedTest[0].test.correctionType === 'cp') &&
      //     (this.utilityService.checkUserIsAcademicDirector() || this.utilityService.checkUserIsFromGroupOfSchools())) {
      //   // This if block is only temprory, we don't show marks to the acad-director until jury enters their decision when correction type of test is "pc"
      //   return '';
      // }

      if (
        (
        (student.finalTranscriptId && student.finalTranscriptId.juryDecisionForFinalTranscript && student.finalTranscriptId.juryDecisionForFinalTranscript === 'retaking') ||
        (student.finalTranscriptId && student.finalTranscriptId.studentDecision && student.finalTranscriptId.studentDecision === 'retaking')) &&
        (this.utilityService.checkUserIsAcademicDirector() || this.utilityService.checkUserIsFromGroupOfSchools())
      ) {
        const testRetake = _.find(student.finalTranscriptId.retakeTestsForStudents, {'testId': currentCorrectedTest[0].test._id});
        if (testRetake) {
          return '';
        }
        // return '';
      }

      if (currentCorrectedTest[0].test.type === 'mentor-evaluation') {
        return this.getTotal(currentCorrectedTest[0]);
      } else {
        if (currentCorrectedTest[0].test.correctionType !== 'pc' && currentCorrectedTest[0].test.correctionType !== 'cp') {
          const checkCorrectionStatus = currentCorrectedTest[0].test.correctionStatusForSchools.filter(s => {
            return s.school === student.school._id && (
              s.correctionStatus === 'validatedByAcadDir' || s.correctionStatus === 'validatedByCertiAdmin'
            );
          });
          if (checkCorrectionStatus.length > 0) {
            return currentCorrectedTest[0] && currentCorrectedTest[0].correction ? this.getTotal(currentCorrectedTest[0]) : '';
          } else {
            return '';
          }
        } else {
          if ((student.finalTranscriptId && student.finalTranscriptId.isValidated) ||
              this.utilityService.checkUserIsDirectorSalesAdmin()) {
            return this.getTotal(currentCorrectedTest[0]);
          } else {
            return '';
          }
        }

      }
    }
  }

  getTotal(currentCorrectedTest) {
    const total = currentCorrectedTest.correction.correctionGrid.correction.total;
    const additionalTotal = currentCorrectedTest.correction.correctionGrid.correction.additionalTotal;

    // Check if AdditionalTotal needs to be displayed.
    if(currentCorrectedTest.test.correctionGrid.correction.totalZone.displayAdditionalTotal)
    {
      if (additionalTotal || additionalTotal === 0) {
        return additionalTotal;
      }
    }

  // return total score
   if (total) {
      return total;
    } else { return ''; }
  }

  onRightClick(event, student, subjectTestId) {
    const self = this;
    const correctedTests = student.correctedTests;
    const studentId = student._id;
    const studentUserId = student.userId;
    const rncpId = student.rncpTitle._id;
    event.preventDefault();
    const currentCorrectedTest = correctedTests.filter(function (correctedTest) {
      return correctedTest.test && correctedTest.test.subjectTestId === subjectTestId;
    });
    swal({
      type: 'question',
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: this.translate.instant('VALIDATE'),
      cancelButtonClass: 'btn-danger',
      cancelButtonText: this.translate.instant('REJECT')
    }).then(function (isConfirm) {
      if (isConfirm) {
        const body = {
          documentId: currentCorrectedTest[0].correction.expectedDocuments[0].document._id,
          status: 'validated'
        };
        self.testCorrectionService.validateDocument(
          currentCorrectedTest[0].correction._id,
          body
        ).subscribe(res => {
          if (res) {
            self.testCorrectionService.validateDocument(currentCorrectedTest[0].correction._id, body).subscribe(response => {
              if (response) {
                self.searchUserList(true, self.customerId);
              }
            });
          }
        });
      }
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        self.addTaskForRejectedDocument(student, subjectTestId);
      }
    }.bind(this))
      .catch(swal.noop);
  }

  openUploadedDocument(correctedTests, subjectTestId) {
    const currentCorrectedTest = correctedTests.filter(function (correctedTest) {
      return correctedTest.test && correctedTest.test.subjectTestId === subjectTestId;
    });
    if (
      currentCorrectedTest.length > 0
      && currentCorrectedTest[0].correction.expectedDocuments &&
      currentCorrectedTest[0].correction.expectedDocuments.length > 0
    ) {
      const doc = currentCorrectedTest[0].correction.expectedDocuments[0].document;
      const element = document.createElement('a');
      if (doc.storedInS3) {
        element.href = DownloadAnyFileOrDocFromS3.download + doc.S3FileName;
      } else {
        element.href = ApplicationUrls.baseApi + doc.filePath;
      }
      element.target = '_blank';
      element.setAttribute('download', doc.fileName);
      element.click();
    }
  }

  addTaskForRejectedDocument(student, subjectTestId) {
    const self = this;
    const correctedTests = student.correctedTests;
    const studentId = student._id;
    const studentUserId = student.userId;
    const rncpId = student.rncpTitle;
    const currentCorrectedTest = correctedTests.filter(function (correctedTest) {
      return correctedTest.test && correctedTest.test.subjectTestId === subjectTestId;
    });
    this.addTaskDialogComponent = this.dialog.open(AddTaskDialogComponent, this.taskDialogConfig);
    // this.addTaskDialogComponent.componentInstance.taskid = '';
    this.addTaskDialogComponent.componentInstance.isDocUploadTask = true;
    this.addTaskDialogComponent.componentInstance.studentBeingValidated = student.firstName + ' ' + student.lastName;
    this.addTaskDialogComponent.componentInstance.RNCPTitles = [{ id: rncpId._id, text: rncpId.shortName }];
    this.addTaskDialogComponent.afterClosed().subscribe((taskDetail) => {
      if (taskDetail) {
        const body = {
          testId: currentCorrectedTest[0].test._id,
          documentId: currentCorrectedTest[0].correction.expectedDocuments[0].document._id,
          userId: studentUserId,
          rncpTitleId: rncpId._id,
          status: 'rejected',
          task: {
            dueDate: taskDetail.dueDate,
            description: taskDetail.description,
            uniqueId: currentCorrectedTest[0].test.expectedDocuments[0]._id
          }
        };
        self.testCorrectionService.validateDocument(currentCorrectedTest[0].correction._id, body).subscribe(res => {
          if (res) {
            this.searchUserList(true, this.customerId);
          }
        });
      }
    });
  }

  downloadStudentTestCorrection(correctedTests, subjectTestId) {
    const currentCorrectedTest = correctedTests.filter(function (correctedTest) {
      return correctedTest.test && correctedTest.test.subjectTestId === subjectTestId;
    });
    if (
      currentCorrectedTest.length > 0
      && currentCorrectedTest[0].correction.markEntryDocument
    ) {
      const doc = currentCorrectedTest[0].correction.markEntryDocument;
      const element = document.createElement('a');
      if (doc.storedInS3) {
        element.href = DownloadAnyFileOrDocFromS3.download + doc.S3FileName;
      } else {
        element.href = ApplicationUrls.baseApi + doc.filePath;
      }
      element.target = '_blank';
      element.setAttribute('download', doc.fileName);
      element.click();
    }
  }

  thumbsToggle(flag, student, index) {
    if (flag) {
      let timeDisabled = AppSettings.global.timeDisabledinSecForSwalMini;
      swal({
        title: this.translate.instant('THUMBSUP.SW2.TITLE'),
        html: this.translate.instant('THUMBSUP.SW2.TEXT'),
        type: 'warning',
        allowEscapeKey: true,
        showCancelButton:true,
        confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM', { timer: timeDisabled }) + ' in 3 sec',
        cancelButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CANCEL'),
        onOpen: () => {
          swal.disableConfirmButton();
          const confirmBtnRef = swal.getConfirmButton();
          const time = setInterval(() => {
            timeDisabled -= 1;
            confirmBtnRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM') + ' in '  + timeDisabled + ' sec';
          }, 1000);

          setTimeout(() => {

            confirmBtnRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM');
            swal.enableConfirmButton();
            clearTimeout(time);
          }, (timeDisabled * 1000));
        }

      }).then(
        () => {
          let data = {
            allowFinalTranscriptGen: false,
            studentId: student._id
          }
          this.studentService.sendThumbsUpStatus(data)
            .subscribe(res => {
              this.StudentList[index].allowFinalTranscriptGen = false;

            })
        },
        function (dismiss) {
        }
      )
    } else {
      let timeDisabledSec = AppSettings.global.timeDisabledinSecForSwalMini;
      swal({
        title: this.translate.instant('THUMBSUP.SW1.TITLE'),
        html: this.translate.instant('THUMBSUP.SW1.TEXT'),
        type: 'warning',
        allowEscapeKey: true,
        showCancelButton:true,
        confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM') + 'in 3 sec',
        cancelButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CANCEL'),
        onOpen: () => {
          swal.disableConfirmButton();
          const confirmButtonRef = swal.getConfirmButton();
          const disabledTime = setInterval(() => {
            timeDisabledSec -= 1;
            confirmButtonRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM') + ' '+'in'+' ' + timeDisabledSec + ' sec'
          }, 1000)

          setTimeout(() => {
            confirmButtonRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM');
            swal.enableConfirmButton();
            clearTimeout(disabledTime);
          }, (timeDisabledSec * 1000));
        }
      }).then(
        () => {
          this.StudentList[index].allowFinalTranscriptGen = true;
          let body = {
            "allowFinalTranscriptGen":true,
            "studentId": student._id
          }
          this.studentService.sendThumbsUpStatus(body).subscribe(res=>{
          })
          // this.thumbsUp = false;
        },
        function (dismiss) {
        }
      );
    }
  }
  getFinalResultAfterReTake(result: string) {
    if (result === 'PASS1' || result === 'PASS2' || result === 'PASS3') {
      return 'PASS';
    } else if (result === 'FAILED' || result === 'ELIMINATED') {
      return 'FAILED';
    }
  }
}
