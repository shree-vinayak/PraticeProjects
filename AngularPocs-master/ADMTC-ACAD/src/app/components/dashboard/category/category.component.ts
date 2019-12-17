import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  MdDialog,
  MdDialogConfig,
  MdDialogRef,
  MdMenuTrigger
} from '@angular/material';
import { Router } from '@angular/router';
import { Sort } from 'app/models/sort.model';
import { AcademicKitService } from 'app/services/academic-kit.service';
import { LoginService } from 'app/services/login.service';
import { UtilityService } from 'app/services/utility.service';
import { DocumentDetailsDialogComponent } from '../../../dialogs/document-details-dialog/document-details-dialog.component';
import { TestDetailsDialogComponent } from '../../../dialogs/test-details-dialog/test-details-dialog.component';
import { DashboardService } from '../../../services/dashboard.service';
import { MoveItemService } from '../../../services/move-item.service';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { TranslateService } from 'ng2-translate';
import { CustomerService } from '../../customer/customer.service';
import { FinalTranscriptService } from '../../settings/settingSteps/final-transcript-dialog/final-transcript.service';

declare var _: any;
declare var swal: any;

// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('CategoryComponent');
log.color = 'green';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Output()
  updateKit = new EventEmitter<boolean>();
  @Output()
  pendingTasks;
  @Output()
  manageCategory = new EventEmitter<number>();
  @Output() selectedCategoryId = new EventEmitter<string>();
  @Input()
  category?: any;
  @Input()
  showEdit: boolean;
  @Input()
  selectItem: boolean;
  @Input()
  index?: number;
  @Input()
  parent?: any;
  @Input()
  parentFolderName?: any;
  sort = new Sort();
  hidden: boolean;
  selected: boolean;
  expandedFields = {
    category: false,
    documents: false,
    tests: false,
    testDoc: [false]
  };
  configDoc: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };
  configCat: MdDialogConfig = {
    disableClose: false,
    width: '800px',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };
  configTest: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    height: '80%',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };
  user;
  rightClickActivate = false;
  showSchool = true;

  @ViewChild(MdMenuTrigger)
  trigger: MdMenuTrigger;

  documentDetailsDialog: MdDialogRef<DocumentDetailsDialogComponent>;
  testDetailsDialog: MdDialogRef<TestDetailsDialogComponent>;

  constructor(
    private dialog: MdDialog,
    private appService: RNCPTitlesService,
    private router: Router,
    private translate: TranslateService,
    private moveItemService: MoveItemService,
    public acadService: AcademicKitService,
    private dashboardService: DashboardService,
    private loginService: LoginService,
    public utilityService: UtilityService,
    private customerService: CustomerService,
    private finalTranscriptService: FinalTranscriptService
  ) {
    // log.info('Constructor Invoked!');
  }

  ngOnInit() {
    this.user = this.loginService.getLoggedInUser();

    // Checking Authorization of user to see the school folder under '06. EPREUVES DE LA CERTIFICATION'
    if (this.parentFolderName === '06. EPREUVES DE LA CERTIFICATION') {
      this.checkUserIsAuthorizedToSeeSchoolFolder(this.category);
    }

    this.category.subCategories = _.sortBy(this.category.subCategories, [
      'title'
    ]);
    this.sortCategories();

    // This function is created to sort all the documents come under 06. EPREUVES DE LA CERTIFICATION folder
    // this.checkSixthCatToSort(this.category);

    if (this.selectItem) {
      const stack = this.getParent(this.parent, [this.index]);
      stack.reverse();
      this.moveItemService.getMovingStack().subscribe(st => {
        if (_.isEqual(st.stack, stack) && st.type === 'category') {
          this.hidden = true;
        } else {
          this.hidden = false;
          this.moveItemService.getPositionStack().subscribe(selectedStack => {
            if (
              selectedStack.length > 0 &&
              selectedStack.length >= stack.length
            ) {
              let same = true;
              for (let i = 0; i < stack.length; i++) {
                if (selectedStack[i] !== stack[i]) {
                  same = false;
                  break;
                }
              }
              if (same) {
                this.expandedFields.category = true;
                if (
                  selectedStack.length === stack.length &&
                  selectedStack[selectedStack.length - 1] ===
                    stack[stack.length - 1]
                ) {
                  this.selected = true;
                } else {
                  this.selected = false;
                }
              } else {
                this.selected = false;
              }
            } else {
              this.selected = false;
            }
          });
        }
      });
    }
  }

  getParentObject() {
    const a = Object.assign({}, this.category);
    Object.assign(a, { parent: this.parent, index: this.index });
    return a;
  }

  manageThisCategory() {
    this.selectedCategoryId.emit(this.category._id);
    this.manageCategory.emit(this.index);
  }

  selectCategory(category?) {
    this.expandedFields.category = !this.expandedFields.category;
    const stack = this.getParent(this.parent, [this.index]);
    stack.reverse();
    this.moveItemService.updateSelectedCategory(stack);
    this.acadService.toCategory.next(category);
  }

  // checkSixthCatToSort(cat) {
  //   // This function is created to sort all the documents come under 06. EPREUVES DE LA CERTIFICATION folder
  //   if (cat.title === '06. EPREUVES DE LA CERTIFICATION' && cat.subCategories) {
  //     cat.subCategories.forEach(element => {
  //       const classCateg = element;
  //       if (classCateg.subCategories) {
  //         classCateg.subCategories.forEach(classes => {
  //           const testCateg = classes;
  //           if (testCateg.subCategories) {
  //             testCateg.subCategories.forEach(test => {
  //               const testFolder = test;
  //               testFolder.subCategories.forEach(testDoc => {
  //                 if (testDoc.documents.length > 0) {
  //                   const delimiter = '-';
  //                   testDoc.documents.forEach((docName, index) => {
  //                     // let splitArray = docName.name.split(delimiter);
  //                     // if (splitArray.length > 5) {
  //                     //   const start = splitArray.length - 3;
  //                     //   splitArray = docName.name.split(delimiter).slice(start);
  //                     //   const nameToDisplay = splitArray.join(' ');
  //                     //   testDoc.documents[index].name = nameToDisplay.trim();
  //                     // }
  //                   });

  //                   // testDoc.documents = _.sortBy(testDoc.documents, function (d) {
  //                   //   return d.name.toLowerCase();
  //                   // });
  //                 }
  //               });
  //             });
  //           }

  //         });
  //       }
  //     });
  //   }

  // }
  checkFurther(categ) {
    while (categ.subCategories && categ.subCategories.length > 0) {}
  }

  openDocumentDetails(document, category, test?) {
    let testRetake = null;
    if (
      test &&
      document.uploadedForStudent &&
      document.uploadedForStudent.finalTranscriptId &&
      document.uploadedForStudent.finalTranscriptId.retakeTestsForStudents &&
      document.uploadedForStudent.finalTranscriptId.retakeTestsForStudents.length &&
      !document.uploadedForStudent.finalTranscriptId.hasJuryFinallyDecided
    ) {
      testRetake = _.find(
        document.uploadedForStudent.finalTranscriptId.retakeTestsForStudents,
        { testId: test._id }
      );
    }

    if (
      testRetake &&
      (this.utilityService.checkUserIsAcademicDirector() ||
        this.utilityService.checkUserIsFromGroupOfSchools())
    ) {
      this.juryDecisionNotAccessibleSwal();
    } else if (
      test &&
      (test.correctionType === 'pc' || test.correctionType === 'cp') &&
      (this.utilityService.checkUserIsAcademicDirector() ||
        this.utilityService.checkUserIsFromGroupOfSchools())
    ) {
      if (
        document.uploadedForStudent &&
        document.uploadedForStudent.finalTranscriptId &&
        document.uploadedForStudent.finalTranscriptId.retakeTestsForStudents &&
        !document.uploadedForStudent.finalTranscriptId.hasJuryFinallyDecided
      ) {
        this.checkIfDocAccesible(
          document.uploadedForStudent._id,
          document,
          category
        );
      } else {
        this.displayDocumentDetailDialog(document, category, test);
      }
    } else {
      this.displayDocumentDetailDialog(document, category, test);
    }
  }

  displayDocumentDetailDialog(document, category, test ?: any) {
    const index = this.category.documents.findIndex(function(val, i) {
      if (val.name === document.name) {
        return i;
      }
    });

    const stack = this.getParent(this.parent, [index, this.index]);
    const router = this.router;
    stack.reverse();
    this.documentDetailsDialog = this.dialog.open(
      DocumentDetailsDialogComponent,
      this.configDoc
    );
    this.documentDetailsDialog.componentInstance.document = document;
    this.documentDetailsDialog.componentInstance.folderName = category.title;
    this.documentDetailsDialog.componentInstance.category = category;
    this.documentDetailsDialog.componentInstance.positionStack = stack;
    const expanded = this.expandedFields;
    this.documentDetailsDialog.afterClosed().subscribe((docs) => {
      if (docs && docs.eventType === 'delete') {
        this.category.documents = [...docs];
        this.dashboardService.refreshTaskListAfterTestDeletion(true);
        // this.acadService.updateCategory(this.category).subscribe();
      } else if (docs && docs.eventType === 'update') {
        if (docs.document.documentType === 'uploadedFromTestCreation') {
          const ind = test.documents.findIndex( d => d._id === docs.document._id);
          if (ind > -1) {
            test.documents[ind] = {...docs.document};
          }
        } else {
          const ind = category.documents.findIndex( d => d._id === docs.document._id);
          if (ind > -1) {
            category.documents[ind] = {...docs.document};
          }
        }
      }
      this.expandedFields = expanded;
    });
  }

  openTestDetails(test) {
    this.appService.setFromAcadKit(true);

    const expanded = this.expandedFields;
    const index = this.category.tests.findIndex((val, i) => {
      if (val.name === test.name) {
        return i;
      }
    });

    const stack = this.getParent(this.parent, [index, this.index]);

    // const isPFE = test.isPFE ? test.isPFE : false;
    stack.reverse();
    let currParent = this.parent;
    let isChildOfTestCorrectionFolder = false;
    let schoolId = null;
    while (currParent != null) {
      if (currParent.title === '06. EPREUVES DE LA CERTIFICATION') {
        isChildOfTestCorrectionFolder = true;
      } else {
        schoolId = currParent.school;
      }
      currParent = currParent.parent;
    }
    if (isChildOfTestCorrectionFolder) {
      // if ((this.utilityService.checkUserIsAcademicDirector()  || this.utilityService.checkUserIsFromGroupOfSchools())) {
      //   this.juryDecisionNotAccessibleSwal();
      // } else if ( (test.correctionType === 'pc' || test.correctionType === 'cp') &&
      //     ( this.utilityService.checkUserIsAcademicDirector()  ||
      //     this.utilityService.checkUserIsFromGroupOfSchools())) {
      //   this.checkIfResultAccesible(test, schoolId);
      // } else {
      //   this.redirectToResults(test, schoolId);
      // }
      if (
        this.utilityService.checkUserIsAcademicDirector() ||
        this.utilityService.checkUserIsFromGroupOfSchools()
      ) {
          this.finalTranscriptService.getAcadBlockStateByJuryState(schoolId, this.parent.parentRNCPTitle, test._id).subscribe(response => {
          log.data('response.data', response.data);
          if (test.correctionType === 'pc' || test.correctionType === 'cp') {
            if (response.data && response.data.hasJuryDecidedForAll) {
              this.redirectToResults(test, schoolId);
            } else {
              this.juryDecisionNotAccessibleSwal();
            }
          } else if (response.data && response.data.finalRetake) {
            if (response.data && response.data.hasJuryFinallyDecided) {
              this.redirectToResults(test, schoolId);
            } else {
              this.juryDecisionNotAccessibleSwal();
            }
          } else if (response.data && !response.data.finalRetake) {
            this.redirectToResults(test, schoolId);
          } else {
            this.juryDecisionNotAccessibleSwal();
          }
        });

      } else {
        this.redirectToResults(test, schoolId);
      }
    } else {
      this.testDetailsDialog = this.dialog.open(
        TestDetailsDialogComponent,
        this.configTest
      );
      this.testDetailsDialog.componentInstance.test = test;
      this.testDetailsDialog.componentInstance.positionStack = stack;
      this.testDetailsDialog.afterClosed().subscribe(status => {
        // this.updateKit.emit(true);
        if (status) {
          if (status.type === 'move') {
            status.stack.pop();
            this.expandedFields = expanded;
          } else if (status.type === 'edit') {
            this.router.navigateByUrl('/create-test');
          } else if (status.type === 'delete') {
            this.dashboardService.refreshTaskListAfterTestDeletion(true);
            this.category.tests = status.tests;
            this.expandedFields = expanded;
          }
          // this.acadService.updateCategory(this.category).subscribe();
          this.updateKit.emit(true);
        }
        this.expandedFields = expanded;
      });
    }
  }

  redirectToResults(test, schoolId) {
    const queryParamsValue = {
      school: schoolId
    };

    if (test.correctionType === 'pc') {
      queryParamsValue['crossCorrection'] = true;
    }
    this.router.navigate(
      ['test-correction', this.parent.parentRNCPTitle, test._id],
      { queryParams: queryParamsValue }
    );
  }

  checkIfDocAccesible(studentId, document, category) {
    this.finalTranscriptService
      .getFinalTranscriptStatusForAcadKit(studentId)
      .subscribe(response => {
        log.data('response.data', response.data);
        if (response.data && response.data.hasJuryDecided) {
          this.displayDocumentDetailDialog(document, category);
        } else {
          this.juryDecisionNotAccessibleSwal();
        }
      });
  }

  checkIfResultAccesible(test, schoolId) {
    this.finalTranscriptService
      .getAcadBlockStateByJuryState(
        schoolId,
        this.parent.parentRNCPTitle,
        test._id
      )
      .subscribe(response => {
        log.data('response.data', response.data);
        if (response.data && response.data.hasJuryDecidedForAll) {
          this.redirectToResults(test, schoolId);
        } else {
          this.juryDecisionNotAccessibleSwal();
        }
      });
  }

  juryDecisionNotAccessibleSwal() {
    swal({
      title: this.translate.instant(
        'CrossCorrection.CROSSCORRECTION_NOT_ACCESSIBLE.title'
      ),
      html: this.translate.instant(
        'CrossCorrection.CROSSCORRECTION_NOT_ACCESSIBLE.text'
      ),
      allowEscapeKey: true,
      type: 'warning',
      confirmButtonText: this.translate.instant(
        'CrossCorrection.CROSSCORRECTION_NOT_ACCESSIBLE.button'
      )
    });
  }

  redirectToCreateGroupsUI(test, parentCategory: string) {
    this.acadService
      .getTaskIdForCreateGroups(this.parent.parent.parent.school, test._id)
      .subscribe(task => {
        const taskId = task.data._id;
        if (taskId) {
          this.router.navigate(
            [
              'create-group-test',
              this.parent.parentRNCPTitle,
              test._id,
              taskId
            ],
            { queryParams: { school: this.category.school } }
          );
        }
      });
  }

  openCategoryDetails(index: number) {
    const stack = this.getParent(this.parent, [index, this.index]);
  }

  getParent(parent: any, stack: number[]) {
    if (parent) {
      if (parent.parent != null) {
        stack.push(parent.index);
        return this.getParent(parent.parent, stack);
      } else {
        stack.push(parent.index);
        return stack;
      }
    } else {
      return stack;
    }
  }

  isCorrector() {
    if (this.user !== undefined && this.user) {
      if (
        this.user.types &&
        this.user.types[0] &&
        this.user.types[0].name === 'corrector'
      ) {
        return true;
      }
    }
    return false;
  }

  checkFolderPermission(folderName, permission) {
    /* Check the folder permission - start */
    let key = '';
    if (folderName.trim() === '01. ADMISSIONS') {
      key = 'admissions';
    }
    if (folderName.trim() === '02. ANNALES EPREUVES') {
      key = 'annalesEpreuves';
    }
    if (folderName.trim() === '03. BOITE A OUTILS') {
      key = 'boiteaOutils';
    }
    if (folderName.trim() === '04. ORGANISATION') {
      key = 'organisation';
    }
    if (folderName.trim() === '05. PROGRAMME') {
      key = 'programme';
    }
    if (folderName.trim() === '06. EPREUVES DE LA CERTIFICATION') {
      key = 'epreuvesCertification';
    }
    if (folderName.trim() === '07. ARCHIVES') {
      key = 'archives';
    }
    if (folderName.trim() === 'COMMUNICATION') {
      key = 'communication';
    }

    if (key === '') {
      return true;
    }
    if (this.user.types.length) {
      const typeArr = ['sales', 'management', 'admin', 'chief-group-academic'];
      for (let index = 0; index < this.user.types.length; index++) {
        const element = this.user.types[index];
        if (typeArr.indexOf(element['name'].toLowerCase()) > -1) {
          return true;
        }
      }
    }
    if (
      this.user &&
      this.user.userFolderPermissions &&
      this.user.userFolderPermissions[key][permission]
    ) {
      return true;
    }
    return false;
    /* Check the folder permission - end */
  }

  getTestDocuments(documents) {
    return _.filter(documents, function(o) {
      return o.status !== 'deleted';
    });
  }

  checkUserIsAuthorizedToSeeSchoolFolder(category) {
    if (category.school) {
      if (
        this.user.entity.type === 'admtc' ||
        this.utilityService.checkUserIsAdminOfCertifier() ||
        this.utilityService.checkUserIsDirectorOfCertifier()
      ) {
        this.showSchool = true;
      } else if (this.utilityService.checkUserIsFromGroupOfSchools()) {
        if (
          this.customerService.getSelectedSchoolId().schoolId ===
          category.school
        ) {
          this.showSchool = true;
        } else {
          this.showSchool = false;
        }
      } else {
        if (
          this.user.entity.school &&
          this.user.entity.school._id === category.school
        ) {
          this.showSchool = true;
        } else {
          this.showSchool = false;
        }
      }
    } else {
      this.showSchool = false;
    }

    // if (typeof category.school !== 'undefined' && category.school !== '' && category.school !== null && this.user.entity.type !== 'admtc') {
    //   if (this.user.entity.school && this.user.entity.school._id === category.school) {
    //     return true;
    //   }
    // } else {
    //   return true;
    // }
    // return false;
  }

  onRightClickToDownloadAllDocs(event) {
    event.preventDefault();
    this.rightClickActivate = true;
    this.trigger.openMenu();
  }

  downloadAllDocs(catId) {
    const self = this;
    swal({
      type: 'warning',
      title: this.translate.instant('DOWNLOAD_All_DOC.TITLE'),
      html: this.translate.instant('DOWNLOAD_All_DOC.TEXT'),
      confirmButtonText: this.translate.instant('DOWNLOAD'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('CANCEL')
    }).then(
      isConfirm => {
        self.acadService.downloadAllDocs(catId);
      },
      cancel => {}
    );
  }

  getStudentsCount(category, parentFolderName) {
    this.expandedFields.category = !this.expandedFields.category;
    if (
      parentFolderName === '06. EPREUVES DE LA CERTIFICATION' &&
      category.documents.length > 0 &&
      this.parent && this.parent.parent
    ) {
      this.acadService
        .getNumberOfStudents(
          this.parent.parent.school,
          category.tests[0].class,
          category.tests[0]._id
        )
        .subscribe(count => {
          if (count) {
            if (category.tests[0].groupTest) {
              category['numberOfStudentsOrGroups'] = count.data.numberOfGroups;
            } else if (this.checkIfOtherUserWithNoForEach(category.tests[0])) {
              // Only *1* Doc will be uploaded for All Students in this case
              category['numberOfStudentsOrGroups'] = 1;
            } else {
              category['numberOfStudentsOrGroups'] =
                count.data.numberOfStudents;
            }
          }
        });
    }
  }

  checkIfOtherUserWithNoForEach(test) {
    if (
      test.expectedDocuments[0] &&
      test.expectedDocuments[0].isForAllStudents === false &&
      test.expectedDocuments[0].documentUserType &&
      test.expectedDocuments[0].documentUserType.name !== 'student'
    ) {
      return true;
    } else {
      return false;
    }
  }

  getDocumentsLengthBasedOnDocumentType(documents) {
    const docs = _.filter(documents, function(d) {
      return d.documentType === 'documentExpected';
    });
    return docs.length;
  }

  getDocumentsUnderResult(documents) {
    const filteredDocs = _.filter(documents, function(d) {
      return d.documentType === 'StudentTestCorrection';
    });
    return _.sortBy(filteredDocs, function(d) {
      if (d.uploadedForStudent) {
        return d.uploadedForStudent.lastName.toLowerCase();
      } else if (d.uploadedForGroup) {
        return d.uploadedForGroup.name.toLowerCase();
      }
    });
  }

  sortDocsBasedOnStudentLastName(docs) {
    return _.sortBy(docs, function(d) {
      if (d.uploadedForStudent) {
        return d.uploadedForStudent.lastName.toLowerCase();
      } else if (d.uploadedForOtherUser) {
        return d.uploadedForOtherUser.lastName.toLowerCase();
      } else if (d.uploadedForGroup) {
        return d.uploadedForGroup.name.toLowerCase();
      } else {
        return d.name.toLowerCase();
      }
    });
  }
  checkIsRetakeMode(test) {
    if (test['correctionStatusForSchools'].length) {
      for (
        let index = 0;
        index < test['correctionStatusForSchools'].length;
        index++
      ) {
        const element = test['correctionStatusForSchools'][index];
        if (
          element.school === this.category.school &&
          element.isRetakeGoingOn
        ) {
          return true;
        }
      }
    }

    return false;
  }

  // Acad-dir: This function will give the tests which are published
  // Admtc: It will show all the tests.
  getPublishedTestsIfAcadDir(tests, parentFolderName) {
    // return tests;
    if (
      tests.length > 0 &&
      this.parentFolderName !== '06. EPREUVES DE LA CERTIFICATION'
    ) {
      if (this.utilityService.checkUserIsAcademicDirector()) {
        const publishedTest = _.filter(tests, { isPublished: true });
        return publishedTest;
      } else {
        return tests;
      }
    } else {
      return tests;
    }
  }
  sortCategories () {
    const docArray = _.orderBy(this.category.documents , [doc => doc.name.toLowerCase()], 'asc');
    this.category.documents = docArray;
  }

  getSortedDocuments(documentList) {
    return [..._.orderBy(documentList, ['name'], ['asc'])];
  }
}
