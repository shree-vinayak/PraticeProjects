import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RNCPTitlesService } from 'app/services/rncp-titles.service';
import { TestCorrectionService } from 'app/services/test-correction.service';
import { TestService } from 'app/services/test.service';
import { Observable } from 'rxjs/Observable';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { MdSlideToggleChange, MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { GroupTestNotificationDialogComponent } from './group-test-notification-dialog/group-test-notification-dialog.component';
import _ from 'lodash';
import { UtilityService } from '../../../services/utility.service';
import { DatePipe } from '@angular/common';
import { TasksService } from 'app/services/tasks.service';

// Required for Logging on console
import { Log } from 'ng2-logger';
import { LoginService } from 'app/services';
const log = Log.create('CreateGroupsComponent');
log.color = 'violet';

@Component({
  selector: 'app-create-groups',
  templateUrl: './create-groups.component.html',
  styleUrls: ['./create-groups.component.scss']
})
export class CreateGroupsComponent implements OnInit {

  private subscription: Subscription;
  selectedTestId;
  selectedRncpTitle;
  testDetails;

  toggle = false;

  searchedStudents: any[] = [];
  students: any[] = [];
  page = new Page();
  sort = new Sort();
  reorderable = true;
  checkIfCorrectionStartedBtn = false;
  schoolId: string;

  cards = [];

  datePipe;

  ngxDtCssClasses = {sortAscending: 'fa fa-caret-up', sortDescending: 'fa fa-caret-down', pagerLeftArrow: 'icon-left', pagerRightArrow: 'icon-right', pagerPrevious: 'icon-prev', pagerNext: 'icon-skip'};

  public form: FormGroup;
  public groupTestNotificationDialog: MdDialogRef<GroupTestNotificationDialogComponent>;
  popupConfig: MdDialogConfig;

  noOfGroupPossible = [];
  manualFirst = false;
  isADMTCDirOrAdmin = false;
  taskId;
  user;
  constructor(
    private testCorrectionService: TestCorrectionService,
    private testService: TestService,
    private router: ActivatedRoute,
    private routes: Router,
    private appService: RNCPTitlesService,
    private translate: TranslateService,
    private fb: FormBuilder,
    public dialog1: MdDialog,
    public utilityService: UtilityService,
    private taskService: TasksService,
    public loginService: LoginService,
  ) { }

  ngOnInit() {
    const self = this;
    this.subscription = this.router.queryParams.subscribe(qParams => {
      if (qParams.hasOwnProperty('school')) {
        this.schoolId = qParams['school'];
      }
      self.subscription = self.router.params.subscribe(params => {
         if (params['titleId'] && params['testId'] && params['taskId']) {
            self.appService.selectRncpTitle(params['titleId']).subscribe(() => {
               self.testCorrectionService.selectTest(params['testId']);
            });
            self.taskId = params['taskId'];
            this.selectedTestId = params['testId'];

            // checkIfCorrectionStarted.
            self.testService.checkIfCorrectionStarted(self.selectedTestId, self.schoolId).subscribe((data) => {
              console.log(data);
              console.log('data---------');

                self.checkIfCorrectionStartedBtn = data;
                console.log('self.checkIfCorrectionStartedBtn');
                console.log(self.checkIfCorrectionStartedBtn);

            });

            this.testCorrectionService.getTest(this.selectedTestId).subscribe((value) => {
              this.testDetails = value;

               this.toggle = this.testDetails.correctionGrid.groupDetails.groupsAllocation;

              // Get Students Related to this test
              if (this.testDetails.class !== undefined && this.testDetails.class != null) {
                this.testCorrectionService.getStudentForTestCorrection(this.testDetails._id, this.schoolId).subscribe((data) => {
                  if (data) {
                    this.students = data;
                    this.searchedStudents = _.orderBy(data, ['lastName'], ['asc']);

                    // Create Form for manually assign group for student
                    const test = [];
                    for (let index = 0; index < this.students.length; index++) {
                        const element = this.students[index];
                        test['studentGroup' + element._id] = ['', Validators.required];
                    }
                    console.log(test);
                    self.form = self.fb.group(test);

                    self.getGroups();

                  }
                });
              }

              // Get RNCP Title Details this test
              this.appService.getSelectedRncpTitle().subscribe((value) => {
                this.selectedRncpTitle = value;
              });
            });
         } else {
           console.log('NO Test ID');
         }
       });
     });





     this.setUser();
  }

  setUser() {
    const self = this;
    this.user = this.loginService.getLoggedInUser();
    if (this.user !== undefined && this.user) {
      if (this.user.types != null) {
        this.user.types.forEach(UserType => {
          if (['admin', 'director'].indexOf(UserType.name.toLowerCase()) !== -1 && this.user.entity.type === 'admtc'){
            console.log('UserType.name');
            console.log(UserType.name);
            self.isADMTCDirOrAdmin = true;
          }
        });
      }
    }
  }

  getGroups(){
    const self = this;
     // Get test Group for test if already there and assign to card.
     this.testService.getTestGroupFromTest(this.testDetails._id, this.schoolId).subscribe((data) => {
      if (data) {
        self.cards = data;
        // Populate Selected group for left student list.
          for (let i = 0; i < self.cards.length; i++) {
            const card = self.cards[i];
            self.cards[i]['checked'] = false;
            for (let index = 0; index < card.students.length; index++) {
              const student = card.students[index];
              if ( self.form.controls['studentGroup' + student._id] ) {
                self.form.controls['studentGroup' + student._id].setValue('std-' + i);
              }
            }
          }
          console.log(self.form.value);
      }
      // self.createEmptyGroupsIfManuall();
    });
  }

  // createEmptyGroupsIfManuall(){
  //   if(this.cards.length === 0 && !this.toggle){
  //     this.manualFirst = true;
  //     this.noOfGroupPossible = this.utilityService.calculateGroups(this.students.length, this.testDetails.correctionGrid.groupDetails.minNoOfStudents, this.testDetails.correctionGrid.groupDetails.noOfStudents);
  //     for (var i = 0; i < this.noOfGroupPossible.length; i++) {
  //       this.cards.push({'name':"Group "+this.utilityService.convertIntegerToCharacter(i),'students':[]});
  //     }
  //   }

  // }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
  }
  searchStudentsTable(event) {
    const val = event.target.value;
    this.searchedStudents = val.length >= 2 ? this.students.filter(option =>
      (option.lastName + ' ' + option.firstName).toLocaleLowerCase().includes(val.trim().toLowerCase())) : this.students;

      this.searchedStudents = _.orderBy(this.searchedStudents, ['lastName'], ['asc']);
  }

  toggleChange(event: MdSlideToggleChange) {
    console.log('toggle', event.checked);
    if (event.checked) {
      this.toggle = true;
    }else{
      this.toggle = false;
      // this.createEmptyGroupsIfManuall();
    }
  }

  generateGroup(){
    const self = this;
    console.log('generate auto');
    this.testService.generateTestGroupFromTest(this.testDetails._id, this.schoolId).subscribe((data) => {
      if ( data.length > 0 ) {
        self.manualFirst = false;
        self.getGroups();
      }else if (data && data.code === 400){
        swal({ title: self.translate.instant('TESTCORRECTIONS.GROUP.TestNotFoundTitle'), allowEscapeKey: true, html: self.translate.instant('TESTCORRECTIONS.GROUP.TestNotFoundText'), type: 'error', confirmButtonText: self.translate.instant('TESTCORRECTIONS.GROUP.TestNotFoundOk')}).then(() => {
          self.routes.navigate(['/dashboard']);
        });
      }
    });

  }

  getTitleForGeneratedGroup(){
    if (this.cards.length){

      const tmpArr = [];
      let text = '';

      for (let index = 0; index < this.cards.length; index++) {
        if (this.cards && this.cards[index] && this.cards[index].students){
          tmpArr.push(this.cards[index].students.length);
        }
      }
      const tmpObj = _.countBy(tmpArr);
      for (const key in tmpObj) {
        if (key) {
          text = text + '  ' + this.translate.instant('TESTCORRECTIONS.GROUP.GroupOfStudent', {groups: tmpObj[key], students: key});
        }
      }
      return text.length ? text.substring(0, text.length - 1) : '';
    }
    return '';
  }

  checkIsReadyToSave(){
    if (this.cards.length){
     return true;
    }
    return false;
  }
  checkIsReadyToSubmitManual() {
    if (this.form &&  this.cards.length){
     let flag = this.form.valid;
     for (let index = 0; index < this.cards.length; index++) {
      if (this.cards && this.cards[index] && this.cards[index].students && (this.cards[index].students.length === 0 || this.cards[index].name === '')){
        flag = false;
        break;
      }
     }
     return flag;
    }
    return false;
  }

  addNewGroup() {
    this.cards.push({'name': '', 'students': [], checked: false});
  }

  deleteSelected() {

    if (this.cards.length){
      const tmpArr = [];
      for (let index = 0; index < this.cards.length; index++) {
        if (!this.cards[index]['checked']){
          tmpArr.push(this.cards[index]);
        }else{
          if (this.cards[index].students.length){
            for (let j = 0; j < this.cards[index].students.length; j++) {
              this.form.controls['studentGroup' + this.cards[index].students[j]._id].setValue('');
              this.form.value['studentGroup' + this.cards[index].students[j]._id] = '';
            }
          }
        }
      }

      for (let index = 0; index < tmpArr.length; index++) {
          if (tmpArr[index].students.length){
            for (let j = 0; j < tmpArr[index].students.length; j++) {
              this.form.controls['studentGroup' + tmpArr[index].students[j]._id].setValue('std-' + index);
              this.form.value['studentGroup' + tmpArr[index].students[j]._id] = 'std-' + index;
            }
          }
      }
      console.log(this.form.value);
      this.cards = tmpArr;
    }
  }

  checkAllCardHasMinStudents() {
    let flag = true;
    if (!this.isADMTCDirOrAdmin){
      // Remove student from current group
      const min = this.testDetails.correctionGrid.groupDetails.minNoOfStudents;
      for (let j = 0; j < this.searchedStudents.length; j++) {
        for (let i = 0; i < this.cards.length; i++) {
          const card = this.cards[i];
          for (let index = 0; index < card.students.length; index++) {
            const studentCard = card.students[index];
            if (studentCard._id === this.searchedStudents[j]._id) {

              if (card.students.length < min) {
                flag = false;
                swal({
                  title: this.translate.instant('TESTCORRECTIONS.GROUP.MinNoticeTitle'),
                  text: this.translate.instant('TESTCORRECTIONS.GROUP.MinNoticeText', {min: min, groupname: card.name}),
                  allowEscapeKey: true,
                  type: 'warning',
                  confirmButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.MinNoticeOk'),
                });
                break;
              }
            }
          }
        }
      }
    }

    return flag;
  }

  submitManual(isDraft?: boolean) {
    console.log('submitManual group');
    const self = this;
    if (this.checkAllCardHasMinStudents()) {
      const postData = [];
      for (let i = 0; i < this.cards.length; i++) {
        const card = this.cards[i];
        postData.push({_id: card._id ? card._id : null, name: card.name ? card.name : '', students: []});
        for (let index = 0; index < card.students.length; index++) {
          const student = card.students[index];
          postData[i]['students'].push(student._id);
        }
      }

      if (isDraft) {
        this.testService.saveTestGroupFromTest(this.testDetails._id, {'data': postData, 'groupsAllocation': this.toggle}, this.schoolId).subscribe((data) => {
          console.log(data);
          if (data) {
            swal({
              title: this.translate.instant('TESTCORRECTIONS.GROUP.Group_S5.TITLE'),
              html: this.translate.instant('TESTCORRECTIONS.GROUP.Group_S5.TEXT'),
              allowEscapeKey: true,
              type: 'success',
              confirmButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.Group_S5.BUTTON'),
            });
          }
        });
      } else {
        this.testService.saveTestGroupFromTest(this.testDetails._id, {'data': postData, 'groupsAllocation': this.toggle}, this.schoolId).subscribe((data) => {
          if (data) {
            swal({
              title: this.translate.instant('TESTCORRECTIONS.GROUP.SAVESUCCESSTITLE'),
              html: this.translate.instant('TESTCORRECTIONS.GROUP.SAVESUCCESSTEXT'),
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.SAVESUCCESS-SAVENLEAVE'),
              cancelButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.SAVESUCCESS-SAVEONLY')
            }).then(function(isConfirm) {
              if (isConfirm) {
                self.taskService.completeTask(self.taskId).subscribe((result) => {
                  swal({ title: self.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTEDTitle'), allowEscapeKey: true, html: self.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTED'), type: 'success', confirmButtonText: self.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTEDBtn')}).then(() => {
                    self.routes.navigate(['/dashboard']);
                  });
                });
              }
            }, function(dismiss) {
              if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those

              } else {
                throw dismiss;
              }
            });
          }
        });
      }
    }
  }

  saveGroups() {
    const self = this;

    const postData = [];
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      postData.push({
        _id: card._id ? card._id : null,
        name: card.name ? card.name : '',
        students: []
      });

      for (let index = 0; index < card.students.length; index++) {
        const student = card.students[index];
        postData[i]['students'].push(student._id);
      }

    }

    this.testService.saveTestGroupFromTest(this.testDetails._id, {'data': postData, 'groupsAllocation': this.toggle}, this.schoolId).subscribe((data) => {
      if (data) {
        swal({
          title: this.translate.instant('TESTCORRECTIONS.GROUP.SAVESUCCESSTITLE'),
          html: this.translate.instant('TESTCORRECTIONS.GROUP.SAVESUCCESSTEXT'),
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.SAVESUCCESS-SAVENLEAVE'),
          cancelButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.SAVESUCCESS-SAVEONLY')
        }).then(function(isConfirm) {
          if (isConfirm) {
            self.taskService.completeTask(self.taskId).subscribe((result) => {
              swal({ title: self.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTEDTitle'), allowEscapeKey: true, html: self.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTED'), type: 'success', confirmButtonText: self.translate.instant('TESTCORRECTIONS.MESSAGE.ALLCORRECTIONSSUBMITTEDBtn')}).then(() => {
                self.routes.navigate(['/dashboard']);
              });
            });
          }
        }, function(dismiss) {
          if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those

          } else {
            throw dismiss;
          }
        });
      }
    });
  }

  cancleClick() {
    swal({
      title: 'Attention',
      text: this.translate.instant('TESTCORRECTIONS.MESSAGE.CANCELCORRECTION'),
      type: 'question',
      showCancelButton: true,
      allowEscapeKey: true,
      cancelButtonText: this.translate.instant('NO'),
      confirmButtonText: this.translate.instant('YES')}).then(() => {
      this.routes.navigate(['/dashboard']);
    }, function (dismiss) {
      if (dismiss === 'cancel') {
      }
    });
  }



  validateMinMax(event, student, field, studentId ?: string) {

    const max = this.testDetails.correctionGrid.groupDetails.noOfStudents;
    const min = this.testDetails.correctionGrid.groupDetails.minNoOfStudents;
    const flag = false;

    let isMaxError = false;
    let isMaxErrorCard;
    let maxCardIndex;
    let maxCardStudent;
    let isMinError = false;
    let isMinErrorCard;
    let minCardIndex;
    let minCardStudentIndex;

    // Remove student from current group
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];

      if ('std-' + i === event.value){
        if ((card.students.length + 1) > max){
          isMaxError = true;
          isMaxErrorCard = card;
        }else{
          maxCardIndex = i;
          maxCardStudent = student;
        }
      }

      for (let index = 0; index < card.students.length; index++) {
        const studentCard = card.students[index];
        if (studentCard._id === student._id){
          if ((card.students.length - 1) < min){
            isMinError = true;
            isMinErrorCard = card;
          }else{
            minCardIndex = i;
            minCardStudentIndex = index;
          }
        }
      }
    }

    if (!isMaxError && !isMinError){

        if (typeof maxCardIndex !== 'undefined'){
          this.cards[maxCardIndex]['students'].push(maxCardStudent);
          this.cards[maxCardIndex]['students'] = this.cards[maxCardIndex]['students'].slice();
        }
        if (typeof minCardIndex !== 'undefined'){
          this.cards[minCardIndex]['students'].splice(minCardStudentIndex, 1);
          this.cards[minCardIndex]['students'] = this.cards[minCardIndex]['students'].slice();
        }

    } else {
      if ( isMaxError) {
        swal({
          title: this.translate.instant('TESTCORRECTIONS.GROUP.MaxNoticeTitle'),
          text: this.translate.instant('TESTCORRECTIONS.GROUP.MaxNoticeText', {max: max, groupname: isMaxErrorCard.name}),
          allowEscapeKey: true,
          type: 'warning',
          confirmButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.MaxNoticeOk')
        });
        const value = this.computeGourpIdForStudent(studentId);
        console.log('value : ' + value);
        this.form.controls[field].setValue(value);
    } else if (isMinError) {
      swal({
        title: this.translate.instant('TESTCORRECTIONS.GROUP.MinNoticeTitle'),
        text: this.translate.instant('TESTCORRECTIONS.GROUP.MinNoticeText', {min: min, groupname: isMinErrorCard.name}),
        allowEscapeKey: true,
        type: 'warning',
        confirmButtonText: this.translate.instant('TESTCORRECTIONS.GROUP.MinNoticeOk'),
      });
      const value = this.computeGourpIdForStudent(studentId);
      console.log('value : ' + value);
      this.form.controls[field].setValue(value);
    }
  }
  }

  changeStudentGroup(event, student, field, studentId ?: string) {

    if (!this.isADMTCDirOrAdmin){
      this.validateMinMax(event, student, field, studentId);
    }else{
      let SourceCardIndex;
      let SourceCardStudent;
      let DistCardIndex;
      let DistCardStudentIndex;

      // Remove student from current group
      for (let i = 0; i < this.cards.length; i++) {
        const card = this.cards[i];
        if ('std-' + i === event.value){
          SourceCardIndex = i;
          SourceCardStudent = student;
        }
        for (let index = 0; index < card.students.length; index++) {
          const studentCard = card.students[index];
          if (studentCard._id === student._id){
            DistCardIndex = i;
            DistCardStudentIndex = index;
          }
        }
      }

      if (typeof SourceCardIndex !== 'undefined'){
        this.cards[SourceCardIndex]['students'].push(SourceCardStudent);
        this.cards[SourceCardIndex]['students'] = this.cards[SourceCardIndex]['students'].slice();
      }
      if (typeof DistCardIndex !== 'undefined'){
        this.cards[DistCardIndex]['students'].splice(DistCardStudentIndex, 1);
        this.cards[DistCardIndex]['students'] = this.cards[DistCardIndex]['students'].slice();
      }
    }
  }

  computeGourpIdForStudent(studentId) {
    for (let i = 0; i < this.cards.length; i++) {
      for (const student of this.cards[i].students) {
        if ( student._id === studentId ) {
          // if ( this.manualFirst ) {
          //   return card.name;
          // } else {
          //   return card._id;
          // }
          return 'std-' + i;
        }
      }
    }
    return '';
  }

  openGroupTestNotificationDialog() {
    this.groupTestNotificationDialog = this.dialog1.open(
      GroupTestNotificationDialogComponent,
      this.popupConfig
    );

    this.groupTestNotificationDialog.componentInstance.selectedRncpTitle = this.selectedRncpTitle;
    this.groupTestNotificationDialog.componentInstance.testDetails = this.testDetails;
    this.groupTestNotificationDialog.afterClosed().subscribe(result => {

            console.log('Result afterClosed' +  result);
    });
  }

  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    return this.datePipe.transform(date, 'd MMM y');
  }
  getTranslateTitle(title){

    if (this.translate.currentLang === 'fr'){
      return title.replace('Group', 'Groupe');
    }

    return title;
  }

  studentSelected (event) {
    log.data('studentSelected event', event);
  }
}
