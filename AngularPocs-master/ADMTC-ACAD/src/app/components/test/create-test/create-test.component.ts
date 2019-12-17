import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  NavigationCancel
} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { TestService } from '../../../services/test.service';
import { Test } from '../../../models/test.model';
import { RNCPTitlesService } from '../../../services';
import { AppSettings } from '../../../app-settings';
import { FifthStepComponent } from '../steps/fifth-step/fifth-step.component';

declare var swal: any;

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent implements OnInit {
  progress = 0;
  expanded = false;
  test: Test;
  isRNCPPublished = false;
  isFiftStep = false;

  constructor(
    private testService: TestService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private rncpTitleService: RNCPTitlesService
  ) {}

  ngOnInit() {
    this.testService.getTest().subscribe(test => {
      this.test = test;
      const step = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
      this.changeProgress(step);
    });

    this.rncpTitleService.getSelectedRncpTitle().subscribe(rncpTitle => {
      this.isRNCPPublished = rncpTitle.isPublished;
    });

    const step = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this.changeProgress(step);

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        const step = this.router.url.substr(
          this.router.url.lastIndexOf('/') + 1
        );
        this.changeProgress(step);
      }
    });

    this.router.events.subscribe(
      function(val) {
        if (val instanceof NavigationCancel) {
          const step = this.router.url.substr(
            this.router.url.lastIndexOf('/') + 1
          );
          switch (step) {
            case 'first':
              if (this.test.type === null || this.test.type === '') {
                swal({
                  title: 'Attention',
                  text: this.translate.instant('TEST.ERRORS.NOTESTTYPE'),
                  allowEscapeKey: true,
                  type: 'warning'
                });
              } else {
                swal({
                  title: 'Attention',
                  text: this.translate.instant(
                    'TEST.ERRORS.COMPLETECURRENTSTEP'
                  ),
                  allowEscapeKey: true,
                  type: 'warning'
                });
              }
              break;
            case 'second':
              if (!this.testService.checkCorrectionGridSections(this.test)) {
                swal({
                  title: 'Attention',
                  type: 'warning',
                  allowEscapeKey: true,
                  html:
                    '<b>' +
                    this.translate.instant('TEST.ERRORS.COMPLETECURRENTSTEP') +
                    '</b>' +
                    '<ul style="text-align: center">' +
                    '<br>' +
                    // '<li>' + this.translate.instant('TEST.ERRORS.ATLEASTHEADER') + '</li>' +
                    '<li><span style="position: relative; left: -20px;">' +
                    this.translate.instant('TEST.ERRORS.ATLEASTONESECTION') +
                    '</span></li>' +
                    '</ul>'
                });
              } else {
              }
              break;
            case 'third':
              swal({
                title: 'Attention',
                text: this.translate.instant('TEST.ERRORS.COMPLETECURRENTSTEP'),
                allowEscapeKey: true,
                type: 'warning'
              });
              break;
            case 'fourth':
              swal({
                title: 'Attention',
                text: this.translate.instant('TEST.ERRORS.COMPLETECURRENTSTEP'),
                allowEscapeKey: true,
                type: 'warning'
              });
              break;
            case 'fifth':
              swal({
                title: 'Attention',
                text: this.translate.instant('TEST.ERRORS.COMPLETECURRENTSTEP'),
                allowEscapeKey: true,
                type: 'warning'
              });
              break;
            default:
          }
        }
      }.bind(this)
    );
  }

  changeProgress(step) {
    switch (step) {
      case 'first':
        this.progress = this.test.controlledTest ? 33.33 : 20;
        break;
      case 'second':
        this.progress = 40;
        break;
      case 'third':
        this.progress = 60;
        break;
      case 'fourth':
        this.progress = this.test.controlledTest ? 66.66 : 80;
        break;
      case 'fifth':
        this.progress = 100;
        break;
      case 'default':
        this.progress = 0;
    }
  }

  expand(event: boolean) {
    this.expanded = event;
  }

  checkPublishTestConditions(leave, isPublish: boolean) {
    this.testService.checkPublishTestConditions().subscribe(data => {
      console.log(data);
      const conditions = data.data;
      if (conditions.toPublish) {
        this.saveTest(leave, isPublish);
      } else {
        const schools = conditions.acadDirFound.length ? conditions.acadDirFound : [];
        let str = '';
        if (schools.length > 0) {
          str = '<ol style="display:inline-block;">';
          schools.forEach(s => {
            str += '<li style="text-align:left !important;">' + s.schoolName  + '</li>';
          });
          str += '</ol>';
        }
        if (conditions.acadDirFound.length && conditions.certiAdminFound < 1) {
          const conditionalText = this.translate.instant('TEST.TESTCREATE_S2.REASONT_BOTH', {schoolShortName: str});
          this.testPublishConditionsFailed(conditionalText);
        } else if (conditions.acadDirFound.length) {
          const conditionalText = this.translate.instant('TEST.TESTCREATE_S2.REASON_NOT_ACAD_DIR', {schoolShortName: str});
          this.testPublishConditionsFailed(conditionalText);
        } else if (conditions.certiAdminFound.length < 1) {
          const conditionalText = this.translate.instant('TEST.TESTCREATE_S2.REASON_NOT_CERT_ADMIN', {schoolShortName: str});
          this.testPublishConditionsFailed(conditionalText);
        }
      }
    });
  }

  testPublishConditionsFailed(conditionalText) {
    swal({
      title: this.translate.instant('TEST.TESTCREATE_S2.TITLE'),
      html: conditionalText,
      type: 'warning',
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: this.translate.instant('TEST.TESTCREATE_S2.SAVEANDLEAVE'),
    }).then((isConfirm) => {
      if (isConfirm) {
        this.saveTest(true, false);
      }
    });
  }

  saveTest(leave, isPublish?: boolean) {
    const self = this;
    // Setting the Confirm Button Disable time to 6
    if (isPublish) {
      let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
      swal({
        title: this.translate.instant('TEST.TESTCREATE_S1.TITLE'),
        html: this.translate.instant('TEST.TESTCREATE_S1.TEXT'),
        type: 'warning',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: this.translate.instant(
          'TEST.TESTCREATE_S1.CONFIRM_IN',
          { timer: timeDisabledinSec }
        ),
        cancelButtonText: this.translate.instant('TEST.TESTCREATE_S1.CANCEL'),
        onOpen: () => {
          swal.disableConfirmButton();
          const confirmButtonRef = swal.getConfirmButton();

          // TimerLoop for derementing timeDisabledinSec
          const timerLoop = setInterval(() => {
            timeDisabledinSec -= 1;
            confirmButtonRef.innerText = this.translate.instant(
              'TEST.TESTCREATE_S1.CONFIRM_IN',
              { timer: timeDisabledinSec }
            );
          }, 1000);

          // Resetting timerLoop to stop after required time of execution
          setTimeout(() => {
            confirmButtonRef.innerText = this.translate.instant(
              'TEST.TESTCREATE_S1.CONFIRM'
            );
            swal.enableConfirmButton();
            clearTimeout(timerLoop);
          }, timeDisabledinSec * 1000);
        }
      }).then(function(isConfirm) {
        self.saveOrPublishTest(leave, isPublish);
      }, function(dismiss) {}.bind(this));
    } else {
      self.saveOrPublishTest(leave, false);
    }
  }

  cancelTest() {
    swal({
      title: 'Attention',
      text: this.translate.instant('TEST.MESSAGES.CLOSECONFIRM'),
      type: 'question',
      showCancelButton: true,
      cancelButtonText: this.translate.instant('NO'),
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('YES')
    }).then(
      () => {
        this.testService.cancelTest().subscribe(
          function() {
            console.log('test');
            this.router.navigateByUrl('/dashboard');
          }.bind(this)
        );
      },
      function(dismiss) {
        if (dismiss === 'cancel') {
        }
      }
    );
  }
  saveOrPublishTest(leave, isPublish) {
    if (this.testService.getValidation() || this.test._id) {
      this.testService
        .submitTest(true, isPublish ? isPublish : false)
        .subscribe(status => {
          console.log('Save Test :', status);
          if (status) {
            swal({
              title: this.translate.instant('CONGRATULATIONS'),
              text: this.translate.instant('TEST.MESSAGES.TESTSAVESUCCESS'), // 'Vous venez de créer l\'épreuve',
              allowEscapeKey: false,
              allowOutsideClick: false,
              type: 'success'
            }).then(() => {
              //  this.testService.updateTest(this.test);
              if (leave) {
                this.router.navigate(['/dashboard']);
              }
            });
          } else {
            swal({
              title: 'Attention',
              text: this.translate.instant('TEST.ERRORS.TESTCREATIONERROR'),
              allowEscapeKey: true,
              type: 'warning'
            });
          }
        });
    } else {
      console.log('else');
      const step = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
      switch (step) {
        case 'first':
          if (this.test.type === null || this.test.type === '') {
            swal({
              title: 'Attention',
              text: this.translate.instant('TEST.ERRORS.NOTESTTYPE'),
              allowEscapeKey: true,
              type: 'warning'
            });
          } else {
            swal({
              title: 'Attention',
              text: this.translate.instant('TEST.ERRORS.COMPLETECURRENTSTEP'),
              allowEscapeKey: true,
              type: 'warning'
            });
          }
          break;
        case 'second':
        if (!this.testService.checkCorrectionGridSections(this.test)) {
          swal({
            title: 'Attention',
            type: 'warning',
            allowEscapeKey: true,
            html:
              '<b>' +
              this.translate.instant('TEST.ERRORS.COMPLETECURRENTSTEP') +
              '</b>' +
              '<ul style="text-align: center">' +
              '<br>' +
              // '<li>' + this.translate.instant('TEST.ERRORS.ATLEASTHEADER') + '</li>' +
              '<li><span style="position: relative; left: -20px;">' +
              this.translate.instant('TEST.ERRORS.ATLEASTONESECTION') +
              '</span></li>' +
              '</ul>'
          });
        }
          break;
        case 'third':
          swal({
            title: 'Attention',
            text: this.translate.instant('TEST.ERRORS.COMPLETECURRENTSTEP'),
            allowEscapeKey: true,
            type: 'warning'
          });
          break;
        case 'fourth':
          swal({
            title: 'Attention',
            text: this.translate.instant('TEST.ERRORS.COMPLETECURRENTSTEP'),
            allowEscapeKey: true,
            type: 'warning'
          });
          break;
        case 'fifth':
          swal({
            title: 'Attention',
            text: this.translate.instant('TEST.ERRORS.COMPLETECURRENTSTEP'),
            allowEscapeKey: true,
            type: 'warning'
          });
          break;
        default:
      }
    }
  }

  eventChange(event) {
    if (event instanceof FifthStepComponent) {
      this.isFiftStep = true;
    } else {
      this.isFiftStep = false;
    }
  }
}
