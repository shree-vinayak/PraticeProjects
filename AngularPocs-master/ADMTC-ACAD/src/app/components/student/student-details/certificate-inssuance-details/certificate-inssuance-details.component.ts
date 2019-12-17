import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { CertificationtCardStatusModel } from './certificate-status-card.model';
import { UtilityService } from '../../../../services';
import { TranslateService } from 'ng2-translate';
import { CountryData } from '../../country';
import _ from 'lodash';
import { DatePipe } from '@angular/common';
import { ReviseCertificationDetailsComponent } from '../../student-dialogs/revise-certification-details/revise-certification-details.component';
import { PDFResultService } from '../../../settings/settingSteps/final-transcript-dialog/pdf-result.service';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from 'app/services/students.service';
import { AppSettings } from '../../../../app-settings';
declare var swal: any;

import { Log } from 'ng2-logger';
const log = Log.create('CertificateInssuanceDetailsComponent');
log.color = 'blue';

@Component({
  selector: 'app-certificate-inssuance-details',
  templateUrl: './certificate-inssuance-details.component.html',
  styleUrls: ['./certificate-inssuance-details.component.scss'],
  providers: [PDFResultService]
})
export class CertificateInssuanceDetailsComponent implements OnInit, OnChanges {
  @Input() student;
  @Output() updateStudent: EventEmitter<any> = new EventEmitter();
  datePipe: DatePipe;

  certificationCardsStatus: CertificationtCardStatusModel = new CertificationtCardStatusModel();
  countryList: any[] = CountryData.CountryList;
  isPreviousCourse = false;

  constructor(private utilityService: UtilityService,
    private mdDialog: MdDialog,
    private studentService: StudentsService,
    private route: ActivatedRoute,
    private pdfResultService: PDFResultService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.isPreviousCourse = this.studentService.isPreviousCourseState;
    this.datePipe = new DatePipe(this.translate.currentLang);
    this.translate.onLangChange.subscribe(
      () => {
        this.datePipe = new DatePipe(this.translate.currentLang);
    });
    this.displayCERT_S8();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.certificationCardsStatus.setDefaultState();
    if (this.student && this.student.certificateIssuanceStatus) {
      this.setCardState(this.student.certificateIssuanceStatus);
    }
  }

  
  setCardState(certificationStatus) {
    switch (certificationStatus) {
      case 'sent_to_student':
        this.certificationCardsStatus.setSentToStudentState();
        break;
      case 'details_confirmed':
        this.certificationCardsStatus.setDetailsConfirmedState();
        break;
      case 'details_need_revision':
        this.certificationCardsStatus.setDetailsNeedRevState();
        break;
      case 'details_revision_done':
        this.certificationCardsStatus.setDetailsRevDoneState();
        break;
      case 'certificate_issued':
        this.certificationCardsStatus.setCertificateIssuedtState();
        break;
      default:
        this.certificationCardsStatus.setDefaultState();
        break;
    }
  }

  getCivility(sex) {
    return this.utilityService.computeCivility(sex, this.translate.currentLang);
  }

  getCountryName(id, tranlateFor) {
    const countryObject = _.find(this.countryList, { 'id': id });
    if (countryObject) {
      return this.translate.instant(tranlateFor + '.' + countryObject.countryName);
    }
    return id;
  }


  getTranslateddate(date) {
    return this.datePipe.transform(date);
  }

  requestRevision() {
    const dialogReviseCertificationDetails = this.mdDialog.open(
      ReviseCertificationDetailsComponent, {
        disableClose: true,
        width: '520px'
      }
    );
    dialogReviseCertificationDetails.componentInstance.studentId = this.student._id;
    dialogReviseCertificationDetails.afterClosed().subscribe(
      state => {
        if (state) {
          this.student.certificateIssuanceStatus = 'details_need_revision';
          this.setCardState(this.student.certificateIssuanceStatus);
          this.updateStudent.emit(this.student);
        }
      });
  }



  confirmCertificateDetails() {
    // Setting the Confirm Button Disable time to 6
    const timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
    swal({
      title: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S2.TITLE'),
      html: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S2.TEXT'),
      type: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S2.OK_IN', { timer: timeDisabledinSec }),
      cancelButtonText: this.translate.instant('CANCEL'),
      onOpen: () => {
        swal.disableConfirmButton();
        const confirmButtonRef = swal.getConfirmButton();
        let timeDisabled = timeDisabledinSec;

        // TimerLoop for derementing timeDisabledinSec
        const timerLoop = setInterval(() => {
          timeDisabled -= 1;
          confirmButtonRef.innerText = this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S2.OK_IN',
            { timer: timeDisabled });
         }, 1000
        );

        // Resetting timerLoop to stop after required time of execution
        setTimeout(() => {
          confirmButtonRef.innerText = this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S2.OK');
          swal.enableConfirmButton();
          clearTimeout(timerLoop);
        }, (timeDisabledinSec * 1000));
      }
    }).then((isConfirm) => {
      this.getCertificateDetails();
    });
  }

  getCertificateDetails() {
    this.pdfResultService.getStudentResultDetails(this.student, this.student.finalTranscriptId.juryDecisionForFinalTranscript, true)
    .subscribe(
      (response) => {
        if (response.html) {
          this.sendBodyCertificate(response);
        }
    });
  }


  sendBodyCertificate(htmlNTitle) {
    const generateObject = {
      studentId: this.student._id,
      lang: this.translate.currentLang.toLowerCase(),
      htmlForPdf: htmlNTitle.html,
      fileName: htmlNTitle.fileName
    };
    this.studentService.generateCertificatePdf(generateObject).subscribe(
      (response) => {
        if (response && response._id) {
          this.student.certificateIssuanceStatus = response.certificateIssuanceStatus;
          this.student.certificateIssuedOn = response.certificateIssuedOn;
          this.student.certificatePdfLink = response.certificatePdfLink;
          this.student.finalTranscriptPdfLink = response.finalTranscriptPdfLink;
          this.setCardState(this.student.certificateIssuanceStatus);
          this.updateStudent.emit(this.student);
          this.successSwal();
        }
    });
  }

  getCertificationPdf() {
    if (this.student.finalTranscriptPdfLink) {
      const element = document.createElement('a');
      element.href = this.student.finalTranscriptPdfLink;
      element.target = '_blank';
      element.click();
    }
  }

  successSwal() {
    swal({
      type: 'success',
      title: this.translate.instant('SUCCESS'),
      allowEscapeKey: true,
      confirmButtonText: 'OK'
    })
  }

  displayCERT_S8() {
    const qParamSwalValue = this.route.snapshot.queryParams['swal'];
    if ( qParamSwalValue && qParamSwalValue.toLowerCase() === 'certs8') {
      swal({
        title: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S8.TITLE'),
        html: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S8.TEXT'),
        type: 'warning',
        allowEscapeKey: true,
        allowOutsideClick: true,
        confirmButtonText: this.translate.instant('CERTIFICATE_ISSUANCE.CERT_S8.BTN')
      });
    }
  }

  getTranslatedDate(dateObject) {
    if (dateObject) {
      const date = new Date(dateObject.year,
        (dateObject.month - 1),
        dateObject.date
      );
      return this.datePipe.transform(date);
    }
  }

  getCetificateIssuanceDate(): string {
    if (this.student.certificateIssuedOn) {
      const dateString = this.getTranslatedDate(this.student.certificateIssuedOn);
      return dateString;
    }
    return '';
  }
}
