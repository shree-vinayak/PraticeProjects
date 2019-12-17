import { Subscription } from 'rxjs';
import { forEach } from '@angular/router/src/utils/collection';
import { StudentCardComponent } from './../../student-card/student-card.component';
import { Component, OnInit, Input, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { StudentsService } from 'app/services/students.service';
import { FormGroup, FormArray, FormBuilder, Validators, EmailValidator, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { LoginService } from 'app/services/login.service';
import { DatePipe } from '@angular/common';
import { CompanyService } from 'app/services/company.service';
import { UtilityService } from 'app/services/utility.service';
import { PDFService } from 'app/services/pdf.service';
import swal from 'sweetalert2';
import { GlobalConstants } from '../../../../shared/settings';
import ProblematicStatusCardModel from './problematic-status-card.model';
import { AddTaskDialogComponent } from '../../../../dialogs/add-task-dialog/add-task-dialog.component';
import { Problematic } from './problematic.model';
import ProblematicFormModel from './problematic-form.model';
import { ProblematicTask } from './problematic.model';
import _ from 'lodash';

import { PRINTSTYLES, STYLES } from './styles';
import { Print } from 'app/shared/global-urls';

import { Log } from 'ng2-logger';
const log = Log.create('StudentProblematicComponent');
log.color = 'blue';

@Component({
  selector: 'app-student-problematic',
  templateUrl: './student-problematic.component.html',
  styleUrls: ['./student-problematic.component.scss'],
  providers: [DatePipe]
})
export class StudentProblematicComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('pagesElement') documentPagesRef: ElementRef;
  currentLoggedInUserId = '';
  level;
  signatureOf = 'signatureOfTheAcadDir';
  subscription: Subscription = new Subscription();
  ProblematicForm: FormGroup;
  cardStatusAndText: ProblematicStatusCardModel[];
  studentProblematicInfo: Problematic;
  @Input() problematicOfStudent;
  problematicOfAllStudent;
  @Input() student;
  datePipe: DatePipe;
  selectedStudentId: any;
  addTaskDialogComponent: MdDialogRef<AddTaskDialogComponent>;
  taskDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '600px'
  };
  isCardsVisible = true;
  get Answers() { return <FormArray>this.ProblematicForm.get('Answers'); }
  isPreviousCourse = false;
  cardStatus = [
    'sent_to_student',
    'sent_to_acadDpt',
    'rejected_by_acadDpt',
    'rejected_by_certifier',
    'validated_by_acadDpt',
    'sent_to_certifier',
    'validated_by_certifier',
    'resubmitted_to_certifier'
  ];
  private static readonly sentToStudentIdx = 0;
  private static readonly sentToAcadIdx = 1;
  private static readonly validByAcadIdx = 2;
  private static readonly sentToCertifierIdx = 3;
  private static readonly validByCertifierIdx = 4;

  private static readonly defaultCardStatusModel: ProblematicStatusCardModel[] = [
    new ProblematicStatusCardModel(
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SENT_TO_STUDENT',
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SENT_TO_STUDENT',
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SENT_TO_STUDENT'
    ),
    new ProblematicStatusCardModel(
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SENT_TO_ACAD_DPT',
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SENT_TO_ACAD_DPT',
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SENT_TO_ACAD_DPT'
    ),
    new ProblematicStatusCardModel(
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.REVIEWED_BY_ACAD_DPT',
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.Validated_BY_ACAD_DPT',
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.REJECTED_BY_ACAD_DPT'
    ),
    new ProblematicStatusCardModel(
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SENT_TO_CERTIFIER',
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SENT_TO_CERTIFIER',
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.SENT_TO_CERTIFIER'
    ),
    new ProblematicStatusCardModel(
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.REVIEVED_BY_CERTIFIER',
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.VALIDATED_BY_CERTIFIER',
      'STUDENT.PROBLEMATIC.SENDNOTIFICATION.REJECTED_BY_CERTIFIER'
    ),
  ];
  formModel: ProblematicFormModel;
  currentUserRole: String;

  constructor(private studentsService: StudentsService,
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public translate: TranslateService,
    public dialog: MdDialog,
    private loginService: LoginService,
    public datepipe: DatePipe,
    private companyService: CompanyService,
    public utilityService: UtilityService,
    private pdfService: PDFService) {
    log.info('Constructor Invoked');
    this.formModel = new ProblematicFormModel();
    this.cardStatusAndText = StudentProblematicComponent.defaultCardStatusModel;
  }


  ngOnInit() {
    this.isPreviousCourse = this.studentsService.isPreviousCourseState;
    this.subscription = this.route.params.subscribe(params => {
      const problematicId = params['problematicId'];
      if (problematicId) {
        this.isCardsVisible = false;
        this.getProblematicForStudent(problematicId);
      }
    });

    this.initUserRole();
    log.data('ngOnInit this.ProblematicForm', this.ProblematicForm);
  }

  ngOnChanges() {
    if (this.student && this.student.problematicId) {
      this.isCardsVisible = false;
      this.getProblematicForStudent(this.student.problematicId._id);
    } else {
      this.cardStatusAndText.forEach((cardStatus) => {
        cardStatus.setDefault();
      });
      this.formModel.setDefault();
      this.isCardsVisible = true;
    }
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }

  initUserRole(): void {
    const currentLoggedInUser = this.loginService.getLoggedInUser();
    this.currentLoggedInUserId = currentLoggedInUser._id;
    currentLoggedInUser.types.forEach((type) => {
      if (type.name === 'student') {
        this.currentUserRole = 'student';
      } else if (this.utilityService.checkUserIsAdminOrDirectorOfCertifier()) {
        this.currentUserRole = 'certifier';
        this.signatureOf = 'signatureOfTheCertifier';
      } else if (this.utilityService.checkUserIsAcademicAdminDirector()) {
        this.currentUserRole = 'acadDir';
        this.signatureOf = 'signatureOfTheAcadDir';
      } else if (this.utilityService.checkUserIsDirectorSalesAdmin()) {
        this.currentUserRole = 'admtc';
        this.signatureOf = 'signatureOfTheAcadDir';
      }
    });
    // Will check if this user just corrector of problematic and not a certifier admin
    if (this.utilityService.isJustProbCorrector()) {
      this.currentUserRole = 'Corrector-of-Problematic';
      this.signatureOf = 'signatureOfTheCertifier';
    }
  }

  initializeProblematicForm() {
    this.ProblematicForm = this._formBuilder.group({
      question1: this.questionFormGroupInit(1),
      question2: this.questionFormGroupInit(2),
      question3: this.questionFormGroupInit(3),
      signatureOfTheAcadDir: [
        this.studentProblematicInfo && this.studentProblematicInfo.signatureOfTheAcadDir ?
          this.studentProblematicInfo.signatureOfTheAcadDir : '',
        (this.currentUserRole === 'acadDir') ? [Validators.required] : []
      ],
      signatureOfTheCertifier: [
        this.studentProblematicInfo && this.studentProblematicInfo.signatureOfTheCertifier ?
          this.studentProblematicInfo.signatureOfTheCertifier : '',
        this.currentUserRole === 'certifier' ? [Validators.required] : []
      ],
      signatureOfTheStudent: [
        this.studentProblematicInfo && this.studentProblematicInfo.signatureOfTheStudent ?
          this.studentProblematicInfo.signatureOfTheStudent : '',
        this.currentUserRole === 'student' ? [Validators.required] : []
      ],
      generalComments: this._formBuilder.array(this.generalCommentsFormArrayInit())
    });
    log.data('ngOnInit this.ProblematicForm', this.ProblematicForm);
  }

  questionFormGroupInit(number) {
    return this._formBuilder.group({
      comments: this._formBuilder.array(this.commentsFormArrayInit(number)),
      answer: [this.studentProblematicInfo ? this.studentProblematicInfo['question' + number].answer : '',
      this.currentUserRole === 'student' ? [Validators.required] : []],
      question: [this.studentProblematicInfo ? this.studentProblematicInfo['question' + number].question : '', [Validators.required]],
    });
  }

  commentsFormArrayInit(number) {
    const commentsArray = [];
    if (this.studentProblematicInfo && this.studentProblematicInfo['question' + number].comments.length > 0) {
      this.studentProblematicInfo['question' + number].comments.forEach(element => {
        commentsArray.push(this._formBuilder.group({
          comment: element.comment,
          date: element.date,
          user: element.user
        }));
      });
      if (this.formModel.enableComment) {
        commentsArray.push(
          this._formBuilder.group({
            comment: '',
            date: new Date(),
            user: this.currentLoggedInUserId
          }));
      }
    } else if (this.formModel.enableComment) {
      commentsArray.push(
        this._formBuilder.group({
          comment: '',
          date: new Date(),
          user: this.currentLoggedInUserId
        }));
    }
    return commentsArray;
  }

  generalCommentsFormArrayInit() {
    const commentsArray = [];
    if (this.studentProblematicInfo && this.studentProblematicInfo.generalComments.length > 0) {
      this.studentProblematicInfo.generalComments.forEach(element => {
        commentsArray.push(this._formBuilder.group({
          comment: element.comment,
          date: element.date,
          user: element.user
        }));
      });
      if (this.formModel.enableComment) {
        commentsArray.push(
          this._formBuilder.group({
            comment: '',
            date: new Date(),
            user: this.currentLoggedInUserId
          }));
      }
    } else if (this.formModel.enableComment) {
      commentsArray.push(
        this._formBuilder.group({
          comment: '',
          date: new Date(),
          user: this.currentLoggedInUserId
        }));

    }
    return commentsArray;
  }

  getProblematicForStudent(problematicId) {
    this.studentsService.getProblemeticData(problematicId).subscribe(res => {
      if (res && res.data[0]) {
        this.studentProblematicInfo = res.data[0];
        this.student = this.studentProblematicInfo.studentId;
        this.formModel.update(this.currentUserRole, this.studentProblematicInfo.problematicStatus);

        if ((this.studentProblematicInfo.problematicStatus === 'resubmitted_to_certifier') &&
          this.studentProblematicInfo.generalComments &&
          (this.studentProblematicInfo.generalComments.length >= 3)) {
          this.formModel.hideReject = true;
        }

        this.initializeProblematicForm();
        this.statusCardUpdate(this.studentProblematicInfo.problematicStatus);
        this.isCardsVisible = true;
      } else if ( res && ( res.data.length === 0 ) ) {
        this.translate.reloadLang( this.translate.currentLang ).subscribe( () => {
          swal({
            title: this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.ERROR'),
            html: this.translate.instant('DASHBOARD.ASSIGN_CORRECTOR.TEXT'),
            type: 'error',
            allowEscapeKey: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: this.translate.instant('TASK.MESSAGE.OK'),
          }).then(function (isConfirm) {
          }.bind(this));
        });
      } else {
        this.someErrorOccuredSwal();
      }
    });
  }

  getCivility(sex) {
    return this.utilityService.computeCivility(sex, this.translate.currentLang);
  }

  AcadValidate(Accepted) {
    const self = this;
    const SignControl = this.ProblematicForm.controls['signatureOfTheAcadDir'];
    if (SignControl.value) {
      if (Accepted) {
        if ((this.currentUserRole === 'acadDir') || (this.currentUserRole === 'admtc') &&
          (self.studentProblematicInfo.problematicStatus === 'sent_to_acadDpt' ||
            self.studentProblematicInfo.problematicStatus === 'resubmitted_to_acadDpt')) {
          self.studentProblematicInfo.signatureOfTheAcadDir = true;
          self.studentProblematicInfo.problematicStatus = 'validated_by_acadDpt';
          // Todo API Call to Update Status of Problematic to Validated by Acad Dir
          this.studentsService.updateProblemetic(this.studentProblematicInfo).subscribe(res => {
            if (res.data && res.data._id) {
              this.studentProblematicInfo = res.data;
              this.statusCardUpdate(this.studentProblematicInfo.problematicStatus);
              this.formModel.update(this.currentUserRole, this.studentProblematicInfo.problematicStatus);
              swal({
                type: 'success',
                title: this.translate.instant('PROBLEMATICFORM.VALIDMSG.TITLE'),
                html: this.translate.instant('PROBLEMATICFORM.VALIDMSG.TEXT'),
                allowEscapeKey: true,
                confirmButtonText: this.translate.instant('PROBLEMATICFORM.VALIDMSG.BTN')
              });
            } else {
              this.someErrorOccuredSwal();
            }
          });

        } else {
          const SignControl = this.ProblematicForm.controls['signatureOfTheCertifier'];
          const fullName = this.getCivility(this.student.sex) + ' ' + this.student.firstName + ' ' + this.student.lastName;
          if (SignControl.value) {
            swal({
              type: 'question',
              title: this.translate.instant('PROBLEMATICFORM.CHECK_CERTIFIER_VALIDATE.TITLE'),
              html: this.translate.instant('PROBLEMATICFORM.CHECK_CERTIFIER_VALIDATE.TEXT', { StufullName: fullName }),
              confirmButtonText: this.translate.instant('PROBLEMATICFORM.CHECK_CERTIFIER_VALIDATE.BTN1'),
              showCancelButton: true,
              cancelButtonText: this.translate.instant('PROBLEMATICFORM.CHECK_CERTIFIER_VALIDATE.BTN2')
            }).then((isConfirm) => {
              console.log(isConfirm);
              this.studentProblematicInfo.question1.comments = this.ProblematicForm.value.question1.comments;
              this.studentProblematicInfo.question2.comments = this.ProblematicForm.value.question2.comments;
              this.studentProblematicInfo.question3.comments = this.ProblematicForm.value.question3.comments;
              this.studentProblematicInfo.signatureOfTheCertifier = true;
              this.studentProblematicInfo.problematicStatus = 'validated_by_certifier';
              this.studentProblematicInfo.generalComments = this.ProblematicForm.value.generalComments;
              this.studentsService.updateProblemetic(this.studentProblematicInfo).subscribe(res => {
                if (res.data) {
                  this.studentProblematicInfo = res.data;
                  this.statusCardUpdate(this.studentProblematicInfo.problematicStatus);
                  this.formModel.update(this.currentUserRole, this.studentProblematicInfo.problematicStatus);
                  swal({
                    type: 'success',
                    title: this.translate.instant('PROBLEMATICFORM.SUCCESS_CERTIFIER_VALIDATE.TITLE'),
                    html: this.translate.instant('PROBLEMATICFORM.SUCCESS_CERTIFIER_VALIDATE.TEXT', { StufullName: fullName }),
                    allowEscapeKey: true,
                    confirmButtonText: this.translate.instant('PROBLEMATICFORM.SUCCESS_CERTIFIER_VALIDATE.BTN')
                  });
                } else {
                  this.someErrorOccuredSwal();
                }
              });
            }, (cancel) => { });

          }
        }
      } else {
        if ((this.currentUserRole === 'acadDir') || (this.currentUserRole === 'admtc') &&
          (self.studentProblematicInfo.problematicStatus === 'sent_to_acadDpt' ||
            self.studentProblematicInfo.problematicStatus === 'resubmitted_to_acadDpt')) {
          const self = this;
          const fullName = this.getCivility(this.student.sex)
            + ' ' + this.student.firstName + ' ' + this.student.lastName;
          swal({
            type: 'question',
            title: this.translate.instant('PROBLEMATICFORM.REJECTMSG.TITLE'),
            html: this.translate.instant('PROBLEMATICFORM.REJECTMSG.TEXT', { StufullName: fullName }),
            confirmButtonText: this.translate.instant('PROBLEMATICFORM.REJECTMSG.BTN1'),
            showCancelButton: true,
            cancelButtonText: this.translate.instant('PROBLEMATICFORM.REJECTMSG.BTN2')
          }).then((isConfirm) => {
            self.addTaskForRejectedProblematic();
          }, (cancel) => { });
        } else if ((this.currentUserRole === 'certifier' || this.currentUserRole === 'admtc' || this.utilityService.isJustProbCorrector())
          && (this.ProblematicForm.get('signatureOfTheAcadDir').value === true)) {
          const self = this;
          const fullName = this.getCivility(this.student.sex)
            + ' ' + this.student.firstName + ' ' + this.student.lastName;
          swal({
            type: 'question',
            title: this.translate.instant('PROBLEMATICFORM.REJECTMSG.TITLE'),
            html: this.translate.instant('PROBLEMATICFORM.REJECTMSG.CERTIFIER_TEXT', { StufullName: fullName }),
            confirmButtonText: this.translate.instant('PROBLEMATICFORM.REJECTMSG.BTN1'),
            showCancelButton: true,
            cancelButtonText: this.translate.instant('PROBLEMATICFORM.REJECTMSG.BTN2')
          }).then((isConfirm) => {
            self.certifierRejectProblematic();
          }, (cancel) => { });
        }
      }
    }
  }

  downloadPDF() {
    const target = this.documentPagesRef.nativeElement.children;
    const outer = document.createElement('div');
    outer.innerHTML = '';
    let html = PRINTSTYLES;
    html += `<div class="ql-editor document-parent" style="background-color: #474747" ><div>`;
    for (const element of target) {
      const wrap = document.createElement('div');
      const el = element.cloneNode(true);
      el.style.display = 'block';
      el.style.backgroundColor = '#424242';
      wrap.appendChild(el);
      html += wrap.innerHTML;
    }
    html += `</div></div>
    `;

    // console.log(html);
    // const filename =  this.translate.instant('PARAMETERS-RNCP.PDF.filename', {Titlename:this.selectedRNCPDetails.shortName, Date:this.datepipe.transform(this.selectedRNCPDetails.updatedAt, 'ddMMyyyy') }) ;
    const filename = 'Student Problematic PDf';
    const landscape = false;
    this.pdfService.getPDF(html, filename, landscape).subscribe(res => {
      if (res.status === 'OK') {
        const element = document.createElement('a');
        element.href = Print.url + res.filePath;
        element.target = '_blank';
        element.setAttribute('download', res.filename);
        element.click();
      }
    });
  }

  statusCardUpdate(status) {
    this.cardStatusAndText.forEach((cardStatus) => {
      cardStatus.setDefault();
    });
    switch (status) {
      case 'sent_to_student':
        this.cardStatusAndText[StudentProblematicComponent.sentToStudentIdx].setDone();
        break;
      case 'resubmitted_to_acadDpt':
      case 'sent_to_acadDpt':
        this.cardStatusAndText[StudentProblematicComponent.sentToStudentIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.sentToAcadIdx].setDone();
        break;
      case 'rejected_by_acadDpt':
        this.cardStatusAndText[StudentProblematicComponent.sentToStudentIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.sentToAcadIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.validByAcadIdx].setFailed();
        break;
      case 'validated_by_acadDpt':
        this.cardStatusAndText[StudentProblematicComponent.sentToStudentIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.sentToAcadIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.validByAcadIdx].setDone();
        break;
      case 'sent_to_certifier':
        this.cardStatusAndText[StudentProblematicComponent.sentToStudentIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.sentToAcadIdx].setHidden();
        this.cardStatusAndText[StudentProblematicComponent.validByAcadIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.sentToCertifierIdx].setDone();
        break;
      case 'rejected_by_certifier':
        this.cardStatusAndText[StudentProblematicComponent.sentToStudentIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.sentToAcadIdx].setHidden();
        this.cardStatusAndText[StudentProblematicComponent.validByAcadIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.sentToCertifierIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.validByCertifierIdx].setFailed();
        break;
      case 'resubmitted_to_certifier':
        this.cardStatusAndText[StudentProblematicComponent.sentToStudentIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.sentToAcadIdx].setHidden();
        this.cardStatusAndText[StudentProblematicComponent.validByAcadIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.sentToCertifierIdx].setDone();
        this.cardStatusAndText[StudentProblematicComponent.sentToCertifierIdx].textKey = 'STUDENT.PROBLEMATIC.SENDNOTIFICATION.RESUBMITTED_TO_CERTIFIER';
        this.cardStatusAndText[StudentProblematicComponent.validByCertifierIdx].setDefault();
        break;
      case 'validated_by_certifier':
        this.cardStatusAndText.forEach((cardStatus) => {
          cardStatus.setDone();
        });
        break;
      default:
        this.cardStatusAndText.forEach((cardStatus) => {
          cardStatus.setDefault();
        });
        break;
    }
  }

  sendProblematic() {
    const self = this;
    const SignControl = this.ProblematicForm.controls['signatureOfTheStudent'];
    if (SignControl.value && this.ProblematicForm.valid) {
      this.ProblematicForm.value.question1._id = this.studentProblematicInfo.question1._id;
      this.ProblematicForm.value.question2._id = this.studentProblematicInfo.question2._id;
      this.ProblematicForm.value.question3._id = this.studentProblematicInfo.question3._id;
      this.studentProblematicInfo.question1 = this.ProblematicForm.value.question1;
      this.studentProblematicInfo.question2 = this.ProblematicForm.value.question2;
      this.studentProblematicInfo.question3 = this.ProblematicForm.value.question3;
      this.studentProblematicInfo.signatureOfTheStudent = true;
      if (this.studentProblematicInfo.problematicStatus === 'sent_to_student') {
        this.studentProblematicInfo.problematicStatus = 'sent_to_acadDpt';
      } else if (this.studentProblematicInfo.problematicStatus === 'rejected_by_certifier') {
        this.studentProblematicInfo.problematicStatus = 'resubmitted_to_certifier';
        this.studentProblematicInfo.signatureOfTheCertifier = false;
      } else {
        this.studentProblematicInfo.signatureOfTheAcadDir = false; ;
        this.studentProblematicInfo.problematicStatus = 'resubmitted_to_acadDpt';
      }
      this.studentsService.updateProblemetic(this.studentProblematicInfo).subscribe(res => {
        if (res.data) {
          this.studentProblematicInfo = res.data;
          this.statusCardUpdate(this.studentProblematicInfo.problematicStatus);
          this.formModel.update(this.currentUserRole, this.studentProblematicInfo.problematicStatus);
          if (this.studentProblematicInfo.problematicStatus === 'resubmitted_to_certifier') {
            swal({
              type: 'success',
              title: this.translate.instant('PROBLEMATICFORM.SUCCESS_STUDENT_SEND_CERTIFIER.TITLE'),
              html: this.translate.instant('PROBLEMATICFORM.SUCCESS_STUDENT_SEND_CERTIFIER.TEXT'),
              allowEscapeKey: true,
              confirmButtonText: this.translate.instant('PROBLEMATICFORM.SUCCESS_STUDENT_SEND.BTN')
            });
          } else {
            swal({
              type: 'success',
              title: this.translate.instant('PROBLEMATICFORM.SUCCESS_STUDENT_SEND.TITLE'),
              html: this.translate.instant('PROBLEMATICFORM.SUCCESS_STUDENT_SEND.TEXT'),
              allowEscapeKey: true,
              confirmButtonText: this.translate.instant('PROBLEMATICFORM.SUCCESS_STUDENT_SEND.BTN')
            });
          }
        } else {
          this.someErrorOccuredSwal();
        }
      });
    }

  }

  studentSaveProblematic() {
    if (this.studentProblematicInfo.problematicStatus !== 'validated_by_certifier') {
      this.studentProblematicInfo.signatureOfTheStudent = this.ProblematicForm.get('signatureOfTheStudent').value;
      this.assignQuestionAnswerToProblematic();
    } else {
      this.studentProblematicInfo.question1.comments = this.ProblematicForm.value.question1.comments;
      this.studentProblematicInfo.question2.comments = this.ProblematicForm.value.question2.comments;
      this.studentProblematicInfo.question3.comments = this.ProblematicForm.value.question3.comments;
      this.studentProblematicInfo.generalComments = this.ProblematicForm.value.generalComments;
    }
    this.studentsService.updateProblemetic(this.studentProblematicInfo).subscribe(res => {
      if (res.data) {
        this.studentProblematicInfo = res.data;
        this.statusCardUpdate(this.studentProblematicInfo.problematicStatus);
        this.formModel.update(this.currentUserRole, this.studentProblematicInfo.problematicStatus);
        if (this.studentProblematicInfo.problematicStatus !== 'validated_by_certifier') {
          swal({
            type: 'success',
            title: this.translate.instant('PROBLEMATICFORM.STUDENT_SAVE_SUCCESS.TITLE'),
            html: this.translate.instant('PROBLEMATICFORM.STUDENT_SAVE_SUCCESS.TEXT'),
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('PROBLEMATICFORM.SUCCESS_STUDENT_SEND.BTN')
          });
        } else {
          swal({
            type: 'success',
            title: this.translate.instant('PROBLEMATICFORM.PROB_SAVE_SUCCESS.TITLE'),
            html: this.translate.instant('PROBLEMATICFORM.PROB_SAVE_SUCCESS.TEXT'),
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('PROBLEMATICFORM.SUCCESS_STUDENT_SEND.BTN')
          });
        }
      } else {
        this.someErrorOccuredSwal();
      }
    });
  }

  assignQuestionAnswerToProblematic() {
    this.ProblematicForm.value.question1._id = this.studentProblematicInfo.question1._id;
    this.ProblematicForm.value.question2._id = this.studentProblematicInfo.question2._id;
    this.ProblematicForm.value.question3._id = this.studentProblematicInfo.question3._id;
    this.studentProblematicInfo.question1 = this.ProblematicForm.value.question1;
    this.studentProblematicInfo.question2 = this.ProblematicForm.value.question2;
    this.studentProblematicInfo.question3 = this.ProblematicForm.value.question3;
  }

  addTaskForRejectedProblematic() {
    this.studentProblematicInfo.signatureOfTheAcadDir = true;
    this.studentProblematicInfo.signatureOfTheStudent = false;
    this.studentProblematicInfo.problematicStatus = 'rejected_by_acadDpt';
    const studentRNCP = this.studentProblematicInfo.studentId.rncpTitle ?
      this.studentProblematicInfo.studentId.rncpTitle : this.student.rncpTitle;
    this.studentProblematicInfo.task = new ProblematicTask(studentRNCP._id);
    log.data('addTaskForRejectedProblematic this.studentProblematicInfo', this.studentProblematicInfo);

    this.addTaskDialogComponent = this.dialog.open(AddTaskDialogComponent, this.taskDialogConfig);
    // this.addTaskDialogComponent.componentInstance.taskid = '';
    this.addTaskDialogComponent.componentInstance.task = null;
    this.addTaskDialogComponent.componentInstance.isProblematicTask = true;
    this.addTaskDialogComponent.componentInstance.studentProblematicInfo = this.studentProblematicInfo;
    this.addTaskDialogComponent.componentInstance.RNCPTitles = [{
      id: studentRNCP._id,
      text: studentRNCP.shortName
    }];
    this.addTaskDialogComponent.afterClosed().subscribe((problematicData) => {
      if (problematicData) {
        this.studentProblematicInfo = problematicData;
        this.statusCardUpdate(this.studentProblematicInfo.problematicStatus);
        this.formModel.update(this.currentUserRole, this.studentProblematicInfo.problematicStatus);
      }
    });
  }

  certifierRejectProblematic() {
    this.studentProblematicInfo.question1.comments = this.ProblematicForm.value.question1.comments;
    this.studentProblematicInfo.question2.comments = this.ProblematicForm.value.question2.comments;
    this.studentProblematicInfo.question3.comments = this.ProblematicForm.value.question3.comments;
    this.studentProblematicInfo.generalComments = this.ProblematicForm.value.generalComments;
    this.studentProblematicInfo.problematicStatus = 'rejected_by_certifier';
    this.studentProblematicInfo.signatureOfTheCertifier = true;
    this.studentProblematicInfo.signatureOfTheStudent = false;
    this.studentProblematicInfo.studentId = this.studentProblematicInfo.studentId._id;
    this.studentsService.updateProblemetic(this.studentProblematicInfo).subscribe(res => {
      if (res.data) {
        const fullName = this.getCivility(this.student.sex)
          + ' ' + this.student.firstName + ' ' + this.student.lastName;
        this.studentProblematicInfo = res.data;
        this.statusCardUpdate(this.studentProblematicInfo.problematicStatus);
        this.formModel.update(this.currentUserRole, this.studentProblematicInfo.problematicStatus);
        swal({
          type: 'success',
          title: this.translate.instant('PROBLEMATICFORM.CERTIFIER_REJECTMSG_SUCCESS.TITLE'),
          html: this.translate.instant('PROBLEMATICFORM.CERTIFIER_REJECTMSG_SUCCESS.TEXT', { StufullName: fullName }),
          allowEscapeKey: true,
          confirmButtonText: this.translate.instant('PROBLEMATICFORM.CERTIFIER_REJECTMSG_SUCCESS.BTN')
        });
      } else {
        this.someErrorOccuredSwal();
      }
    });
  }

  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    return this.datePipe.transform(date);
  }
  someErrorOccuredSwal() {
    swal({
      title: this.translate.instant('STUDENT.MESSAGE.ERRORTIT'),
      html : this.translate.instant('STUDENT.MESSAGE.FAILEDMESSAGE'),
      confirmButtonClass: 'btn-danger',
      confirmButtonText: this.translate.instant('STUDENT.PROBLEMATIC.SENDNOTIFICATION.SUCCESS_BTN'),
      type: 'error',
      allowEscapeKey: true,
    }).then(function (isConfirm) {
    }.bind(this));
  }
  // signatureClicked(value) {
  //   log.data('signatureClicked value', value);
  //   if(value && this.ProblematicForm.valid){
  //     this.formModel.enableButtons = true;
  //   } else {
  //     this.formModel.enableButtons = false;
  //   }
  // }
}
