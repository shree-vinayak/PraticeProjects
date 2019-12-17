import { ConfigService } from './../../../services/config.service';
import { LoginService } from './../../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { UtilityService } from '../../../services/utility.service';
import { CustomerService } from '../../customer/customer.service';
import { StudentsService } from '../../../services/students.service';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { UserService } from '../../../services/users.service';

import { ComposeMailComponent } from '../../Mail/compose-mail/compose-mail.component';
import { StudentDialogComponent } from '../student-dialogs/student-dialogs.component';
import { SuperuserService } from '../../../services/superuser.service';
import { AppSettings } from '../../../app-settings';
import { Files, DownloadAnyFileOrDocFromS3 } from '../../../shared/global-urls';

import _ from 'lodash';
import * as moment from 'moment';

declare var swal: any;
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

// Required for logging
import { Log } from 'ng2-logger';
import { EmployabilityDialogComponent } from 'app/components/employability-survey/employability-dialog/employability-dialog.component';
import { EmployabilitySurveyService } from 'app/services/employability-survey.service';
import { ApplicationUrls } from '../../../shared/settings/application-urls';
const log = Log.create('AdmtcStudentTableComponent');
log.color = 'green';

@Component({
  selector: 'app-admtc-student-table',
  templateUrl: './admtc-student-table.component.html',
  styleUrls: ['./admtc-student-table.component.scss']
})
export class AdmtcStudentTableComponent implements OnInit {
  /*************************************************************************
   *   VARIABLES
   *************************************************************************/
  allStudentList: any[] = [];
  serverimgPath = ApplicationUrls.baseApi;
  page = new Page();
  sort = new Sort();
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  selectedIndexForStudentsCard: number = 0;

  studentsBeingExported = [];
  selectedStudents = [];

  // Filter Option Arrays
  RNCPTitles: any[] = [];
  allClasses: any[] = [];
  allSchools: any[] = [];
  allPrepCenters: any[] = [];

  // Filter Parameter Models
  schoolId: string = '';
  rncptitleId: string = '';
  classId: string = '';
  filterSearchText: string = '';
  isSearching: boolean = false;
  schoolSelectModel: any = '';

  // All RNCP Titles By Default
  allRNCPTitles: any[] = [];
  user: any = {};

  // To Diplay Buttons Based on Logged in User
  showViewStudentButton: boolean = false;
  showEditDeleteMailButton: boolean = false;
  showStudN6Icon: boolean = false;
  thumbsUp: boolean = false;
  showThumbdupButton: boolean = false;
  certifier_label :any;

  public dialogRef: MdDialogRef<ComposeMailComponent>;
  public deleteStudentDialog: MdDialogRef<StudentDialogComponent>;
  employabilityDialog: MdDialogRef<EmployabilityDialogComponent>;

  sendMailBox: MdDialogConfig = {
    disableClose: true,
    width: '800px',
    height: '530px'
  };

  deleteStudentConfig: MdDialogConfig = {
    disableClose: true,
    width: '500px'
  };

  configEmployabilityDialog: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'urgentMsg-backdrop'
  };
  // For Logged In User Indentification
  loggedInUser: any;
  allStudentsSelected: boolean = false;
  selectedDelimiter = '';

  /*************************************************************************
   *   CONSTRUCTOR
   *************************************************************************/
  constructor(
    private studentService: StudentsService,
    private router: Router,
    private translate: TranslateService,
    public utilityservice: UtilityService,
    private schoolService: CustomerService,
    private service: UserService,
    public deleteStudentdialog: MdDialog,
    public sendMailDialog: MdDialog,
    private loginService: LoginService,
    private configService: ConfigService,
    private superuserService: SuperuserService,
    private emplyabilityDialog: MdDialog,
    private employabilityService: EmployabilitySurveyService
  ) {}

  /*************************************************************************
   *   EVENTS
   *************************************************************************/
  ngOnInit() {
    log.info('ngOnInit Invoked!');

    this.page.pageNumber = 0;
    this.page.size = 0;
    this.page.totalElements = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    this.getStudents(true);
    this.showViewStudentButton = this.utilityservice.checkUserIsAdminOrDirectorOfCertifier();
    this.showEditDeleteMailButton = this.utilityservice.checkUserIsDirectorSalesAdmin();
    this.loggedInUser = this.loginService.getLoggedInUser();
    this.getConfigForStudN6();
    this.showThumbdupButton = ( this.utilityservice.checkUserIsAcademicDirector() || this.utilityservice.checkUserIsDirectorSalesAdmin());
  }

  /*************************************************************************
   *   METHODS
   *************************************************************************/

  getStudents(isFirst?: boolean, isForExportCSV?: boolean) {
    const params: any = this.getParamsForStudent(isForExportCSV);

    this.studentService
      .getAllStudentForADMTC(params, this.page.size, this.page.pageNumber + 1)
      .subscribe(list => {
        if (isForExportCSV) {
          const allStudentList = _.orderBy(
            list.studentList,
            ['school.shortName'],
            ['asc']
          );
          this.exportStudentCSV(allStudentList);
        } else {
          this.allStudentList = _.orderBy(
            list.studentList,
            ['lastName'],
            ['asc']
          );
          this.page.totalElements = list.total;
          if (isFirst) {
            this.getPerparationCenter();
            this.getAllRNCPTitles();
          }
        }
        this.certifier_label = this.allStudentList[0].rncpTitle.certifier.shortName;
        console.log(this.certifier_label)
      });
  }

  getParamsForStudent(isForExportCSV?: boolean) {
    const params: any = {};

    if (this.schoolId) {
      params.prepcenter = this.schoolId;
    }
    if (this.rncptitleId) {
      params.rncpTitleId = this.rncptitleId;
    }
    if (this.classId) {
      params.classId = this.classId;
    }
    if (this.filterSearchText) {
      params.searchText = this.filterSearchText;
    }

    if ( isForExportCSV ) {
      params.groupDetails = true;
      if ( !this.allStudentsSelected ) {
        const studentIdArray = [];
        this.selectedStudents.forEach((student) => {
          studentIdArray.push(student._id);
        });
        params.studentIds = studentIdArray;
      }
    } else if (_.isEmpty(params)) {
      this.isSearching = false;
    } else {
      this.isSearching = true;
    }
    return params;
  }

  sortPage(sortInfo): void {
    const sortMode = sortInfo.newValue;
    const sortBy = sortInfo.column.name;
    // this.allStudentList = _.orderBy(this.allStudentList, [sortBy], [sortMode]);
    if( sortBy === 'jobDescriptionId.status') {
      // For JobDescription Status based Sorting
      this.allStudentList = _.orderBy(this.allStudentList, function (student) {
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
            default:
            return '0';
          }
        } else {
          return '0';
        }
      }, [sortMode]);
    } else if (sortBy === 'mentorEvaluationId.mentorEvaluationStatus' ) {
      // For Mentor Evaluation tatus based Sorting
      this.allStudentList = _.orderBy(this.allStudentList, function (student) {
        if ( student.mentorEvaluationId && student.mentorEvaluationId.mentorEvaluationStatus ) {
          const mentorEvaluationId = student.mentorEvaluationId.mentorEvaluationStatus;
          switch (mentorEvaluationId) {
            case 'sentToMentor':
              return '1';
            case 'filledByMentor':
              return '2';
            case 'validatedByAcadStaff':
            case 'expeditedByAcadStaff':
              return '3';
          }
        } else {
          return '0';
        }
      }, [sortMode]);
    } else if (sortBy === 'problematicId.problematicStatus' ) {
      // For Problematic Status based Sorting
      this.allStudentList = _.orderBy(this.allStudentList, function (student) {
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
      this.allStudentList = _.orderBy(this.allStudentList, [sortBy], [sortMode]);
    }
  }

  changePage(event): void {
    if (this.page.pageNumber !== event.offset) {
      // this.page.pageNumber = event.offset;
      // this.getStudents();
    }
  }

  getPerparationCenter() {
    const self = this;
    const page = {
      pageNumber: 0
    };
    const sort = {
      sortby: 'shortName',
      sortmode: 'asc'
    };
    this.schoolService.getCustomersList(page, sort).then(res => {
      this.allSchools = [];
      this.allPrepCenters = res.data;
      res.data.forEach(item => {
        this.allSchools.push({ id: item._id, text: item.shortName });
      });
      this.allSchools = [...this.allSchools];
    });
  }

  getAllRNCPTitles() {
    this.service.getAllRNCPTitlesShortName().subscribe(response => {
      const data = response.data;
      if (data.length > 0) {
        this.allRNCPTitles = [];
        this.allRNCPTitles = _.orderBy(data, ['shortName'], ['asc']);
        this.RNCPTitles = this.allRNCPTitles;
      }
    });
  }

  schoolRNCPTitle(selectedSchool) {
    if (selectedSchool.id) {
      this.schoolId = selectedSchool.id;
      const schoolForRNCP = this.allPrepCenters.filter(function (school) {
        return school._id && school._id === selectedSchool.id;
      });

      const RncpTitleOfSchool = schoolForRNCP[0].rncpTitles;
      let rncps = [];
      if ( this.showViewStudentButton ) {
        this.loggedInUser.assignedRncpTitles.forEach((rncpId, index) => {
          const rncpTitle = RncpTitleOfSchool.filter(function (rncpObj) {
            return rncpObj._id && rncpObj._id === rncpId;
          });
          if (rncpTitle[0] && rncpTitle[0]._id) {
            rncps.push(rncpTitle[0]);
          }
        });
        this.RNCPTitles = rncps;
      } else {
        this.RNCPTitles = RncpTitleOfSchool;
      }
    }
  }

  getRncpAssoClass(rncp_id) {
    this.studentService.getAllClassesRNCPTitle(rncp_id).subscribe(response => {
      log.data('getRncpAssoClass(rncp_id', response, response.data);
      this.allClasses = _.orderBy(response.data, ['name'], ['asc']);
    });
    this.classId = '';
  }

  resetSearch() {
    this.schoolId = '';
    this.schoolSelectModel = '';
    this.rncptitleId = '';
    this.classId = '';
    this.filterSearchText = '';
    this.isSearching = false;
    this.RNCPTitles = this.allRNCPTitles;
    this.allClasses = [];
    this.getStudents();
  }

  sendMail(student) {
    this.dialogRef = this.sendMailDialog.open(ComposeMailComponent, this.sendMailBox);
    this.dialogRef.componentInstance.student = student;
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
    return false;
  }

  onEdit(student) {
    this.router.navigate([
      '/school/' +
      student.school._id +
      '/edit/' +
      this.selectedIndexForStudentsCard +
      '/' +
      student._id
    ], { queryParams: { rncpId: student.rncpTitle._id }});
  }

  deleteStudent(student) {
    const self = this;
    swal({
      title: self.translate.instant('STUDENT.MESSAGE.CONFIRMDEACTIVETITLE'),
      html: self.translate.instant('STUDENT.MESSAGE.CONFIRMDEACTIVE', {
        Civility: self.utilityservice.computeCivility(
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
          self.deleteStudentDialog.componentInstance.studentDetails = student;
          self.deleteStudentDialog.afterClosed().subscribe(updated => {
            if (updated) {
              self.getStudents();
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
      this.getStudents(false, true);
    });
  }


exportStudentCSV(studentsToExport) {
  let docPath = '';

  const computeJobDescriptStatus = (jobDescpStatus) => {
    switch (jobDescpStatus) {
      case 'sent_to_student':
        return this.translate.instant('STUDENT.SENTTOSTUDENT');

      case 'sent_to_mentor':
      case 'validated_by_mentor':
        return this.translate.instant('STUDENT.SENT_TO_SCHOOL');

      case 'validated_by_acad_staff':
      case 'expedite_by_acad_staff':
      case 'expedite_by_acad_staff_student':
        return this.translate.instant('STUDENT.VALIDATEBYACADEMICDPT');

      default:
        return 'X';
    }
  };

  const studentsBeingExported = studentsToExport.map(student => {
    return {
      'schoolShortName': _.get(student, 'school.shortName', ''),
      'rncpShortName': _.get(student, 'rncpTitle.shortName', ''),
      'class': _.get(student, 'currentClass.name', ''),
      'scholarSeason': _.get(student, 'scholarSeason.scholarseason', ''),
      'civility': this.utilityservice.computeCivility(_.get(student, 'sex', ''), this.translate.currentLang),
      'firstName': _.get(student, 'firstName', ''),
      'lastName': _.get(student, 'lastName', ''),
      'email': _.get(student, 'email', ''),

      'groupTest': _.get(student, 'groupDetails.0.test.name', ''),
      'groupName': _.get(student, 'groupDetails.0.name', ''),
      'diploma': _.get(student, 'lastObtainedDiploma', ''),
      'uploaded': student.diploma || student.isDiplomaInS3 ?
                  this.translate.instant('EMPLOYABILITY_SURVEY.FORM.FORM_OPTIONS.BOOLEAN.YES') :
                  this.translate.instant('EMPLOYABILITY_SURVEY.FORM.FORM_OPTIONS.BOOLEAN.NO'),
      'link-dip': this.generateLinkForDoc(student),

      'DateOfDiplomaUpload': student.diplomaUploadDate ? moment(student.diplomaUploadDate).format('DD-MM-YYYY') : '',

      'jobDescriptionId': student.jobDescriptionId && student.jobDescriptionId.status ?
                          computeJobDescriptStatus(student.jobDescriptionId.status) :
                          'X',
      'problematicId': student.problematicId && student.problematicId.problematicStatus ?
                      this.translate.instant('STUDENT.PROBLEMATIC.SENDNOTIFICATIenON.' + student.problematicId.problematicStatus.toUpperCase()) :
                      'X',
      'mentorEvaluationId': student.mentorEvaluationId && student.mentorEvaluationId.mentorEvaluationStatus ?
                            this.translate.instant('STUDENT.' + student.mentorEvaluationId.mentorEvaluationStatus.toUpperCase()) :
                            'X'
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
      this.translate.instant('STUDENT_EXPORT_COLUMNS.SCHOOL'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.RNCPTITLE'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.CLASS'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.SCHOLAR_SEASON'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.STUDENT_CIVILITY'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.STUDENT_FIRST_NAME'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.STUDENT_LAST_NAME'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.EMAIL'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.GROUP_TEST'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.GROUP_NAME'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.Diploma'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.Uploaded'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.Link-Dip'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.DateOfDiplomaUpload'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.JOBDESCRIPTION'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.PROBLEMATIC'),
      this.translate.instant('STUDENT_EXPORT_COLUMNS.MENTOR')
    ]
  };

  const setCSVFileName = (this.translate.currentLang.toUpperCase() === 'EN' ? 'Students' : 'Apprenants') + ' '
    + 'Export ADMTC PRO' + ' ' + moment().format('DD-MM-YYYY');

  new Angular2Csv(studentsBeingExported, setCSVFileName, options);
  swal({
    type: 'success',
    title: this.translate.instant('SUCCESS'),
    allowEscapeKey: true,
    confirmButtonText: 'OK'
  });
}

  onSelect(selectedStudents) {
    if (this.page.totalElements === selectedStudents.selected.length) {
      this.allStudentsSelected = true;
    } else {
      this.allStudentsSelected = false;
    }
    this.selectedStudents = selectedStudents.selected;
  }

  getConfigForStudN6(): void {
    if (this.utilityservice.checkUserIsDirectorSalesAdmin()) {
      this.configService.getConfigDetails().subscribe(
        (data) => {
          if (data.notifications) {
            this.showStudN6Icon = data.notifications.STUD_N6;
          }
        },
        (error) => {
          log.data('getConfigDetails configurations data', error);
        }
      );
    }
  }

  requestStudEmailCorrection(student) {
    log.data('requestStudEmailCorrection(student)', student);

    // Send Email Correction mail to ACAD Dir fir Confrimed by Swal
    const sendEmailToAcadDir = () => {
      const postData = {
        studentId: student._id,
        schoolId: student.school._id,
        rncpId: student.rncpTitle ? student.rncpTitle._id : '',
        lang: this.translate.currentLang.toLowerCase()
      };

    log.data('requestStudEmailCorrection sendEmailToAcadDir postData', postData);
      this.studentService.requestStudentEmailChange(postData).subscribe(
        (response) => {
          log.data('requestCorrectionInEmailByAcad response', response);
          if ( response && response.status === 'A0111') {
            this.getStudents();
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

    const studentCivility = this.utilityservice.computeCivility(student.sex, this.translate.currentLang.toUpperCase());

    swal({
      type: 'question',
      title: this.translate.instant('USER_S5.TITLE'),
      html: this.translate.instant('USER_S5.TEXT', {
        userCivility: studentCivility,
        userFirstName: student.firstName,
        userLastName: student.lastName
      }),
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('USER_S5.SEND'),
      cancelButtonText: this.translate.instant('CANCEL')
    }).then(
      (isConfirm) => sendEmailToAcadDir(),
      (dismiss) => log.data('requestEmailCorrection(userDetails) dismiss', dismiss)
    );
  }

  superUserMode(userId) {
    if ( userId ) {
      log.data('superUserMode studentId', userId);
      this.superuserService.startSuperUserMode(userId).subscribe();
    }
  }
 thumbsToggle(flag, student, index){
   console.log(this.allStudentList);
  if(flag){
    let timeDisabled = AppSettings.global.timeDisabledinSecForSwalMini;
    swal({
      title: this.translate.instant('THUMBSUP.SW2.TITLE'),
      html: this.translate.instant('THUMBSUP.SW2.TEXT'),
      type: 'warning',
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM', { timer: timeDisabled }),
      cancelButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CANCEL'),
      onOpen: () => {
        swal.disableConfirmButton();
        const confirmBtnRef = swal.getConfirmButton();
        const time = setInterval(() => {
          timeDisabled -= 1;
          confirmBtnRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM') + ' in '  + timeDisabled + ' sec';
        },1000);

      setTimeout(() => {

        confirmBtnRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM');
        swal.enableConfirmButton();
        clearTimeout(time);
      }, (timeDisabled * 1000));
      }

    }).then(
      () => {
        console.log(student);
        let data = {
          allowFinalTranscriptGen: false,
          studentId: student._id
        }
        this.studentService.sendThumbsUpStatus(data)
        .subscribe(res => {
          this.allStudentList[index].allowFinalTranscriptGen = false;
        })
      },
      function (dismiss) {
      }
    );
  }else {
    let timeDisabledSec = AppSettings.global.timeDisabledinSecForSwalMini;
    swal({
      title: this.translate.instant('THUMBSUP.SW1.TITLE'),
      html: this.translate.instant('THUMBSUP.SW1.TEXT'),
      type: 'warning',
      allowEscapeKey: true,
      showCancelButton:true,
      confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM'),
      cancelButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CANCEL'),
      onOpen: () => {
        swal.disableConfirmButton();
        const confirmButtonRef  = swal.getConfirmButton();
        const disabledTime = setInterval( () => {
            timeDisabledSec -= 1;
          confirmButtonRef .innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM') + ' in ' + timeDisabledSec + ' sec '
        }, 1000);

        setTimeout(() => {
          confirmButtonRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM');
          swal.enableConfirmButton();
          clearTimeout(disabledTime);
        }, (timeDisabledSec * 1000));
      }
    }).then(
      () => {
        let data = {
          allowFinalTranscriptGen: true,
          studentId: student._id
        }
        this.studentService.sendThumbsUpStatus(data)
          .subscribe(res => {
            this.allStudentList[index].allowFinalTranscriptGen = true;
          })
      },
      function (dismiss) {
      }
    )
  }
 }

  generateLinkForDoc(student) {
    let linkToDoc = '';
    if (student.isDiplomaInS3 && student.diplomaS3Path) {
      linkToDoc = DownloadAnyFileOrDocFromS3.download + student.diplomaS3Path;
    } else if (student.diploma) {
      linkToDoc = Files.url + student.diploma;
    } else {
      linkToDoc = '';
    }
    return linkToDoc;
  }

  getFinalResultAfterReTake(result: string) {
    if (result === 'PASS1' || result === 'PASS2' || result === 'PASS3') {
      return 'PASS';
    } else if (result === 'FAILED' || result === 'ELIMINATED') {
      return 'FAILED';
    }
  }

  openEmployabilitySurveyDialog() {
    this.employabilityDialog = this.emplyabilityDialog.open(EmployabilityDialogComponent, this.configEmployabilityDialog);
    this.employabilityDialog.componentInstance.isExpostESCSV = true;
  }
}
