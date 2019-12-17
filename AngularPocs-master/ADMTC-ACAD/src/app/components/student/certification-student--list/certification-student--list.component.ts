import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { StudentsService } from '../../../services/students.service';
import { UtilityService } from '../../../services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
declare var swal: any;

// Required for logging
import { Log } from 'ng2-logger';
import { Sort } from '../../../models/sort.model';
import { Page } from '../../../models/page.model';
const log = Log.create('CertificationStudentListComponent');
log.color = 'green';

@Component({
  selector: 'app-certification-student--list',
  templateUrl: './certification-student--list.component.html',
  styleUrls: ['./certification-student--list.component.scss']
})
export class CertificationStudentListComponent implements OnInit {
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

  getStudentParams: any;
  allStudentsForCertification = [];
  studentsForCertification = [];
  selectedStudents = [];
  allSchools: any[] = [];

  schoolSelectModel: any = '';
  selectedStatus: any;
  isSearching: boolean = false;

  statusList = [
    { status: 'CERTIFICATE_ISSUANCE.SENT_TO_STUDENT', value: 'sent_to_student' },
    { status: 'CERTIFICATE_ISSUANCE.DETAILS_CONFIRMED', value: 'details_confirmed' },
    { status: 'CERTIFICATE_ISSUANCE.DETAILS_NEED_REVISION', value: 'details_need_revision' },
    { status: 'CERTIFICATE_ISSUANCE.CERTIFICATE_ISSUED', value: 'certificate_issued' },
  ];

  rncpClassScholarTitle = '';

  constructor(
    private studentService: StudentsService,
    private translate: TranslateService,
    public utilityservice: UtilityService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    log.info('Constructor Invoked');
  }

  ngOnInit() {
    log.info('ngOnInit Invoked!');
    this.page.pageNumber = 0;
    this.page.totalElements = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
    if (window.innerHeight > 1000) {
      this.page.size = 15;
    } else {
      this.page.size = 12;
    }

    this.activatedRoute.queryParams.subscribe(
      (qParams) => {
        this.getStudentParams = qParams;
        this.getFinalCertificationStudents(true);
      }
    );

    this.activatedRoute.params.subscribe(
      (params) => {
        if (params.hasOwnProperty('rncpClassScholarText')) {
          this.getTitleFormat(params['rncpClassScholarText']);
        }
    });
  }

  getFinalCertificationStudents(first?: boolean) {
    this.selectedStudents = [];
    this.studentService.getFinalCertificationStudents(this.getStudentParams).subscribe(
      (response) => {
        log.data('response', response);
        if (response.data) {
          this.allStudentsForCertification = _.orderBy(
            response.data,
            ['school.shortName', 'lastName'],
            ['asc']
          );
          this.studentsForCertification = [...this.allStudentsForCertification];
          this.page.totalElements = response.total;
          if (first) {
            this.getSchoolForFinalCertificate();
          }
        }
    });
  }

  getSchoolForFinalCertificate() {
    this.studentService.getSchoolForFinalCertificate(this.getStudentParams).subscribe(
      (response) => {
        if (response.data && response.data.length) {
          log.data(' getSchoolForFinalCertificate response', response);
          this.allSchools = response.data.map(
            school => {
              return { text: school.shortName,
                       id: school._id };
          });
          this.allSchools = [..._.orderBy(
            this.allSchools, ['text'], ['asc'])];
        }
    });
  }

  onSelect(event) {
    this.selectedStudents = event.selected;
  }
  changePage(event) {
  }

  sortPage(sortInfo) {
    const sortMode = sortInfo.newValue;
    const sortBy = sortInfo.column.name;

    if (sortBy === 'isDiplomaInS3') {
      // For Diploma and S3-Srored Dipolma Custom Sorting
      this.studentsForCertification = [..._.orderBy(this.studentsForCertification, (student) => {
        if ( (student.isDiplomaInS3 || student.diploma) ) {
          return '1';
        } else {
          return '0';
        }
      }, [sortMode])];
      this.allStudentsForCertification = [..._.orderBy(this.allStudentsForCertification, (student) => {
        if ( (student.isDiplomaInS3 || student.diploma) ) {
          return '1';
        } else {
          return '0';
        }
      }, [sortMode])];
    } else {
      this.studentsForCertification = [..._.orderBy(this.studentsForCertification, [sortBy], [sortMode])];
      this.allStudentsForCertification = [..._.orderBy(this.allStudentsForCertification, [sortBy], [sortMode])];
    }

    this.page.pageNumber = 0;
  }

  getStudentForFilter() {
    let allStudentsCertification = [...this.allStudentsForCertification];
    const schoolObj = this.schoolSelectModel[0] &&  this.schoolSelectModel[0].id ?
                this.schoolSelectModel[0].id : null;

    if (schoolObj) {
      allStudentsCertification = [..._.filter(
        allStudentsCertification, (student) => {
          return student.school._id === schoolObj;
        }
      )];
    }

    if (this.selectedStatus) {
      allStudentsCertification = [..._.filter(
        allStudentsCertification, (student) => {
          return student.certificateIssuanceStatus === this.selectedStatus;
        }
      )];
    }

    this.studentsForCertification = allStudentsCertification;
    this.page.pageNumber = 0;
    this.isSearching = true;
    this.selectedStudents = [];
  }

  resetSearch() {
    this.studentsForCertification = [...this.allStudentsForCertification];
    this.isSearching = false;
    this.schoolSelectModel = '';
    this.selectedStatus = '';
    this.page.pageNumber = 0;
    this.selectedStudents = [];
  }

  gotoRNCPCards() {
    this.router.navigate(['rncp-titles']);
  }

  sendSelectedStudentsForCertification() {

    // It was an urgent requirement and that's why this code is written because it should send to only the students who are passing following criteria

    if (this.selectedStudents.length) {
      // allStudentsEligibleToSend && notEligibleStudents for getting the eligible and not eligible students
      const allStudentsEligibleToSend = [..._.filter(this.selectedStudents, (s) => {
        return s.allowFinalTranscriptGen === true && s.employabilitySurveyId.surveyStatus === 'validatedByAcadDir' &&
        (s.isDiplomaInS3 || s.diploma);
      })];

      const notEligibleStudents = [..._.differenceWith(this.selectedStudents, allStudentsEligibleToSend), _.isEqual];

      console.log('Eligible', allStudentsEligibleToSend);
      console.log('Not Eligible', notEligibleStudents);

      if (notEligibleStudents.filter((s) => s.hasOwnProperty('_id')).length) {
        swal({
          type: 'warning',
          title: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S5.TITLE'),
          html: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S5.TEXT'),
          allowEscapeKey: true,
          confirmButtonText: this.translate.instant('FINAL_TRANSCRIPT.UNDERSTOOD'),
        }).then((isConfirm) => {
          this.sendEligibleStudentsForCertification(this.selectedStudents);
        });
      } else {
        this.sendEligibleStudentsForCertification(this.selectedStudents);
      }
    }
  }

  sendEligibleStudentsForCertification(eligibleStudents: any[]) {
    if (eligibleStudents.length) {
      const studentIds = [];
      eligibleStudents.forEach(
        (student) => studentIds.push(student._id)
      );
      const lang = this.translate.currentLang.toLowerCase();
      this.studentService.sendStudentsForCertification({ studentIds, lang }).subscribe(
        (response) => {
          if (response.data && response.data === 'ok') {
            // this.gotoRNCPCards();
            swal({
              type: 'success',
              title: 'Bravo!',
              html: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S4.TEXT'),
              allowEscapeKey: true,
              confirmButtonText: this.translate.instant('FINAL_TRANSCRIPT.UNDERSTOOD'),
            });
          } else if (response.data && response.data === 'Already sent') {
            swal({
              type: 'info',
              html: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S1.TEXT'),
              title: 'Attention!',
              allowEscapeKey: true,
              confirmButtonText: this.translate.instant('FINAL_TRANSCRIPT.UNDERSTOOD'),
            });
          }
          this.getFinalCertificationStudents();
        });
    }
  }

  sendCERT_N7ToDownloadCertificate() {
    if (this.selectedStudents.length) {
      const students = [];
      this.selectedStudents.forEach(
        (student) => students.push(student._id)
      );
      const lang = this.translate.currentLang.toLowerCase();
      log.data('sendCERT_N7ToDownloadCertificate students', students);
      this.studentService.sendCERT_N7ToDownloadCertificate({ students, lang }).subscribe(
        (response) => {
          log.data('sendCERT_N7ToDownloadCertificate response', response);
          if (response.data) {
            this.successSwal();
          }
        });
    }
  }

  successSwal() {
    swal({
      // type: 'success',
      // title: 'The download link is send to your mailbox',//this.translate.instant('SUCCESS'),
      // text: 'The Notification with the download link for each student has been sent. From there you can click the link to download per individual or batch.',
      // allowEscapeKey: true,
      // confirmButtonText: 'OK'


      type: 'success',
      title: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S7.TITLE'),
      html: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S7.TEXT'),
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S7.Button'),
    })
  }
  getFinalResultAfterReTake(result: string) {
    if (result === 'PASS1' || result === 'PASS2' || result === 'PASS3') {
      return 'PASS';
    } else if (result === 'FAILED' || result === 'ELIMINATED') {
      return 'FAILED';
    }
  }

  getTitleFormat(text) {
    this.rncpClassScholarTitle = text.replace(/#/gi, ' - ')
  }
}
