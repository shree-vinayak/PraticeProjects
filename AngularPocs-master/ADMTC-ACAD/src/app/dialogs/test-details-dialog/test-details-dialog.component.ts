import { UtilityService } from './../../services/utility.service';
import { Component, OnInit } from '@angular/core';
import { Test } from '../../models/test.model';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { MoveItemDialogComponent } from '../move-item-dialog/move-item-dialog.component';
import { ViewTestDialogComponent } from '../view-test-dialog/view-test-dialog.component';
import { TestService } from '../../services/test.service';
import { AcademicKitService } from '../../services/academic-kit.service';
import { LoginService } from '../../services/login.service';
import { DatePipe } from '@angular/common';
import { GlobalConstants } from '../../shared/settings/global-constants';
declare var swal: any;

@Component({
  selector: 'app-test-details-dialog',
  templateUrl: './test-details-dialog.component.html',
  styleUrls: ['./test-details-dialog.component.scss'],
  providers: [DatePipe]
})
export class TestDetailsDialogComponent implements OnInit {

  public test: Test;
  public positionStack: number[];
  academicKit: any;
  datePipe: DatePipe;
  correctionTypes = [];
  showViewButton: boolean = false;

  testTypes = [
    {
      value: 'oral',
      view: 'Oral'
    },
    {
      value: 'written',
      view: 'Written'
    },
    {
      value: 'Memoire-ECRIT',
      view: 'Memoire-ECRIT'
    },
    {
      value: 'Memoire-ORAL',
      view: 'Memoire-ORAL'
    },
    // {
    //   value: 'skillsassessment',
    //   view: 'SkillsAssessment'
    // },
    {
      value: 'free-continuous-control',
      view: 'FreeContinuousControl'
    },
    // {
    //   value: 'case-studies',
    //   view: 'CaseStudies'
    // },
    // {
    //   value: 'external-review',
    //   view: 'External Review'
    // },
    // {
    //   value: 'competition',
    //   view: 'Competition'
    // },
    // {
    //   value: 'business-game',
    //   view: 'BusinessGame'
    // },
    // {
    //   value: 'combined-test',
    //   view: 'Combined Test'
    // },
    {
      value: 'mentor-evaluation',
      view: 'MentorEvaluation'
    },
    {
      value: 'Jury',
      view: 'Jury'
    },
    // {
    //   value: 'External Test (TOEIC, etc.)',
    //   view: 'ExamenExterne'
    // },
    {
      value: 'School-Mentor-Evaluation',
      view: 'School-Mentor-Evaluation'
    }
  ];

  organisers = [
    {
      value: 'center1',
      view: 'Center 1'
    },
    {
      value: 'center2',
      view: 'Center 2'
    },
    {
      value: 'center3',
      view: 'Center 3'
    }
  ];
  documentTypes = [
    {
      value: 'guideline',
      view: 'Guidelines'
    },
    {
      value: 'test',
      view: 'Test'
    },
    {
      value: 'scoring-rules',
      view: 'Scoring Rules'
    },
    {
      value: 'studentnotification',
      view: 'Notification to Student'
    },
    {
      value: 'other',
      view: 'Other'
    }
  ];
  configMove: MdDialogConfig = {
    // disableClose: true,
    width: '50%',
    height: '80%'
  };
  configViewTest: MdDialogConfig = {
    // disableClose: true,
    width: '80%',
    height: '80%'
  };

  user: any;
  moveItemsDialog: MdDialogRef<MoveItemDialogComponent>;
  viewTestDialog: MdDialogRef<ViewTestDialogComponent>;

  constructor(
    private dialogRef: MdDialogRef<TestDetailsDialogComponent>,
    private loginService: LoginService,
    public acadService: AcademicKitService,
    private translate: TranslateService,
    private dialog: MdDialog,
    private testService: TestService,
    private utilityService: UtilityService) {
  }

  ngOnInit() {
    this.correctionTypes = GlobalConstants.correctionTypes;
    this.user = this.loginService.getLoggedInUser();
    this.acadService.getAcademicKit().subscribe(kit => {
      this.academicKit = kit;
    });
  //  console.log(this.test);
    this.showViewButton = this.utilityService.checkUserIsFromGroupOfSchools();
  }

  getTypeView(type) {

    return this.testTypes.find((type) => {
    //  console.log(type.value);
    //  console.log(this.test.type);
      return type.value.toUpperCase() === this.test.type.toUpperCase();
    }).view;
  }

  getCorrectionType() {
    return this.correctionTypes.find((type) => {
      return type.value === this.test.correctionType;
    }).view;
  }

  getOrganiser() {
    return this.organisers.find((type) => {
      return type.value.toUpperCase() === this.test.organiser.toUpperCase();
    }).view;
  }

  getDocType(val) {
    // console.log(val);
    return this.documentTypes.find((doc) => {
      return (doc.value === val);
    }).view;
    // return  '';
  }

  editTest() {
    console.log("Edit Test : ", this.test);
    this.testService.editTest(Object.assign({}, this.test), [...this.positionStack]);
    this.acadService.setTestStack([...this.positionStack]);
    this.closeDialog({ type: 'edit', stack: [...this.positionStack] });
  }

  duplicateTest() {
    // console.log("Duplicate Test : ");
  }

  moveTest() {
    // console.log("Move Test : ");
    this.moveItemsDialog = this.dialog.open(MoveItemDialogComponent, this.configMove);
    this.moveItemsDialog.componentInstance.itemtype = 'test';
    // console.log(this.positionStack);
    this.moveItemsDialog.componentInstance.folderPosition = [...this.positionStack];
    // let pos = this.positionStack.pop();
    this.moveItemsDialog.afterClosed().subscribe(function (status) {
      if (status) {
        this.positionStack = [...status.stack, this.positionStack[this.positionStack.length - 1]];
        this.closeDialog({ type: 'move', stack: this.positionStack });
      } else {
        // this.positionStack.push(pos);
      }
    }.bind(this));
  }

  removeTest() {
    console.log("Remove Test : ", this.positionStack);
    swal({
      title: 'Attention',
      text: this.translate.instant('DASHBOARD.MESSAGES.CONFIRMREMOVETEST'),
      type: 'question',
      showCancelButton: true,
      allowEscapeKey:true,
      cancelButtonText: this.translate.instant('NO'),
      confirmButtonText: this.translate.instant('YES')
    }).then(function () {
      this.acadService.removeTest(this.test)
        .subscribe(function (status) {
          console.log(status);
          if (status) {
            let cat = this.academicKit.categories[this.positionStack[0]];
            for (var i = 1; i < this.positionStack.length - 1; i++) {
              cat = cat.subCategories[this.positionStack[i]];
            }

            const testIndex = cat.tests.findIndex( (test) => {
              return this.test._id === test._id;
            });
            cat.tests.splice(testIndex, 1);
            swal({
              title:'Success',
              text: this.translate.instant('DASHBOARD.MESSAGES.REMOVETESTSUCCESS'),
              allowEscapeKey:true,
              type: 'success'
            }).then(function () {
              this.dialogRef.close({type: 'delete', tests: cat.tests});
            }.bind(this));
          } else {
            swal({
              title: 'Attention',
              text: this.translate.instant('DASHBOARD.MESSAGES.REMOVETESTERROR'),
              allowEscapeKey:true,
              type:'warning'
            });
          }
        }.bind(this));
    }.bind(this), function (dismiss) {

      if (dismiss === 'cancel') {

      }
    });
  }

  closeDialog(object?: any) {
    this.dialogRef.close(object);
  }

  viewTest() {
    this.viewTestDialog = this.dialog.open(ViewTestDialogComponent, this.configViewTest);
    this.viewTestDialog.componentInstance.test = this.test;
    // this.viewTestDialog.componentInstance.itemtype = 'test';
    //this.viewTestDialog.componentInstance.folderPosition = [...this.positionStack];
    this.viewTestDialog.afterClosed().subscribe(function (status) {
      if (status) {
        this.positionStack = [...status.stack, this.positionStack[this.positionStack.length - 1]];
        this.closeDialog({ type: 'move', stack: this.positionStack });
      } else {
        // this.positionStack.push(pos);
      }
    }.bind(this));
  }

  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    return this.datePipe.transform(date);
  }
  getTranslateWhat(name) {
    if (name) {
      const value = this.translate.instant('TEST.AUTOTASK.' + name.toUpperCase());
      return value !== 'TEST.AUTOTASK.' + name.toUpperCase() ? value : name;
    } else {
      return '';
    }
  }
}
