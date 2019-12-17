import { Component, OnInit, OnDestroy } from '@angular/core';
import { TestService, DashboardService, UtilityService } from 'app/services';
import { Test } from 'app/models/test.model';
import { Router } from '@angular/router';
import { Sort } from 'app/models/sort.model';
import { Page } from 'app/models/page.model';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
declare var swal: any;

@Component({
  selector: 'app-fifth-step',
  templateUrl: './fifth-step.component.html',
  styleUrls: ['./fifth-step.component.scss']
})
export class FifthStepComponent implements OnInit, OnDestroy {
  test = new Test();
  sort = new Sort();
  page = new Page();
  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };
  pendingTasks = [];
  subscription: Subscription;

  constructor(
    private testService: TestService,
    private router: Router,
    private dashboardService: DashboardService,
    private utilityService: UtilityService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = 50;
    this.subscription = this.testService.getTest().subscribe(data => {
      this.test = data;


      this.test.date = new Date(this.test.date).toDateString();

      if (this.test.dateReTakeExam) {
        this.test.dateReTakeExam = new Date(this.test.dateReTakeExam).toDateString();
      }

      if (this.test.schools.length > 1) {
        this.test.schools.forEach((s) => {
          s.testDate = new Date(s.testDate).toDateString();
        });
      }

      // remove the below field if tes is NOT RETAKE
      for (let ed of this.test.expectedDocuments) {
        if (!this.test.allowReTakeExam) {
          delete ed['docUploadDateRetakeExam'];
        }
        // VERY CRITICAL LINE, IF THE BELOW GIVEN LINE IS REMOVED, DAY - 1 ISSUE WILL HAPPEN AGAIN
        if (ed.deadlineDate.type === 'fixed') {
          ed.deadlineDate.deadline = new Date(ed.deadlineDate.deadline).toDateString();
        }
      }
      this.getPendingTasks();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goToPreviousStep() {
    // this.testService.updateTest(this.test);
    const url = '/create-test/fourth';
    this.router.navigateByUrl(url);
  }

  submitTest() {
    const testname = this.test.name;
    this.testService.updateTest(this.test);
    this.testService.submitTest().subscribe(
      function(status) {
        if (status) {
          swal({
            title: this.translate.instant('CONGRATULATIONS'),
            allowEscapeKey: true,
            text: this.translate.instant('TEST.MESSAGES.TESTCREATIONSUCCESS', {
              value: testname
            }), // 'Vous venez de créer l\'épreuve',
            type: 'success'
          }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        } else {
          swal({
            title: 'Attention',
            text: this.translate.instant('TEST.ERRORS.TESTCREATIONERROR'),
            allowEscapeKey: true,
            type: 'warning'
          });
        }
      }.bind(this)
    );
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
    if (this.page.pageNumber !== pageInfo.offset) {
      this.page.pageNumber = pageInfo.offset;
      this.getPendingTasks();
    }
  }

  getPendingTasks() {
    this.testService
      .getPreviewOfTasks(this.test)
      .subscribe(response => {
        this.pendingTasks = response.data;
        // this.page.totalElements = response.total;
      });
  }

  getAssignedTo(userType) {
    if (userType) {
      const value = this.translate.instant('ADMTCSTAFFKEY.' + userType.toUpperCase());
      return value !== 'ADMTCSTAFFKEY.' + userType.toUpperCase() ? value : userType;
    }
  }

  getTranslateWhat(name, task?: any) {
    if (task) {
      if (task.type.toLowerCase() === 'employabilitysurveyforstudent') {
        const dueDate = new Date(task.dueDate);
        const dateString = dueDate.getDate() + '/' + (dueDate.getMonth() + 1) + '/' + dueDate.getFullYear();
        if (this.translate.currentLang.toLowerCase() === 'en') {
        return 'Employability Survey to complete before ' + dateString;
        }else {
          return "Enquête d'employabilité à completer avant le " + dateString;
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
      }
    }


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

  getTranslateENTITY(name) {
    let value = this.translate.instant(
      'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase()
    );
    return value !== 'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase()
      ? value
      : name;
  }

  onSort(event, data) {

    const prop = event.column.prop;
    const dir = event.newValue;
    const rows = [..._.orderBy([...this.pendingTasks], [prop], [dir])];

    this.pendingTasks = [...rows];
  }
}
