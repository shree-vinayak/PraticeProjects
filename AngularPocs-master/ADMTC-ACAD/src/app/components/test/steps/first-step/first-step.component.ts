import { eventNames } from 'cluster';
import { Test } from '../../../../models/test.model';
import { TestService } from '../../../../services/test.service';
import { SubjectService } from '../../../../services/subject.service';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClassModel } from '../../../../models/class.model';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';

import { TranslateService } from 'ng2-translate';
// import { locale } from 'moment';
import * as moment from 'moment';
import {
  MdDialog, MdDialogConfig, MdDialogRef,
} from '@angular/material';
import _ from 'lodash';
import { DuplicateTestDialogComponent } from '../../../../dialogs/duplicate-test-dialog/duplicate-test-dialog.component';
import { UserService } from '../../../../services/users.service';

declare var swal: any;


// Required for Logging on console
import { Log } from 'ng2-logger';
import { QuestionnaireService } from 'app/components/mentor-evaluation/questionnaire.service';
import { GlobalConstants } from '../../../../shared/settings/global-constants';
import { UserTypeService } from '../../../../services';
import { Subscription } from '../../../../../../node_modules/rxjs';
const log = Log.create('FirstStepComponent');
log.color = 'green';
@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss']
})
export class FirstStepComponent implements OnInit, OnDestroy {
  subjects = [];
  correctorId = '';
  acadStaffId = '';
  adminOfCertifier = '';
  presidentOfJury = '';
  crossCorrectorId = '';
  correctorCertifierId = '';
  mentorId = '';
  admtcDirectorId = '';
  directorOfADMTCTypeId = '';
  test = new Test();
  submitted = false;
  classes = [];
  visibleDataType = [];
  rncpId = '';
  isDiffDate = false;
  preparationCenter = [];
  questionnaire = [];
  showQuestionnaireList = false;
  selectedSubject;
  firstUser = [];
  ids = 0;
  schools;
  freeControlTest = false;
  RncpTests = [];
  testTypes = GlobalConstants.TestType;
  showGroupAndFreeControlCheckBox = true;
  tempSubjects = [];
  subscription: Subscription;
  assignedADMTCDIRForRNCP = '';
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
  dateTypes = [];
  configSearch: MdDialogConfig = {
    disableClose: true,
    width: '60%',
    height: '80%'
  };
  public form: FormGroup;
  //  public formCombined: FormGroup;
  combinedFields = [];
  showCombined = false;
  subjectList = [];
  testList = [];
  markPointStatus;
  correctionTypes = [];
  dateTypesFiltered = [];
  student_no = false;
  certifierId;
  qcCertifierId;

  duplicateTestDialog: MdDialogRef<DuplicateTestDialogComponent>;

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    private router: Router,
    private testService: TestService,
    private dialog: MdDialog,
    private subjectService: SubjectService,
    private rncpService: RNCPTitlesService,
    private userservice: UserService,
    private questionnaireservice: QuestionnaireService,
    private userTypesService: UserTypeService,
  ) {
    log.info('Constructor Invoked');
  }

  processExpertiseList(expertiseList) {
    for (const expert of expertiseList) {
      if (expert.subject !== null) {
        for (const sub of expert.subject) {
          if (sub.status !== 'deleted') {
            this.subjects.push(sub);
          }
        }
      }
    }
    this.tempSubjects = this.subjects;
    if (this.test.class) {
      this.subjects = _.filter(this.subjects, {'classId': this.test.class});
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    console.log(this.test.type);
    this.testTypes = GlobalConstants.TestType;
    this.correctionTypes = GlobalConstants.correctionTypes;
    this.questionnaireservice.listQuestionnaire().subscribe(res => {
      this.questionnaire = res.data;
    });
    // this.testService.getclass()
    //   .subscribe(res => {
    //     this.classes = res;
    //   });
    this.getFirstUser();

    this.setUserTypesForAutoCalendarSteps();

    this.rncpService.getSelectedRncpTitle().subscribe((title) => {
      if (title) {
        this.assignedADMTCDIRForRNCP = title.admtcDirResponsible ? title.admtcDirResponsible._id : '';
        this.rncpId = title._id;
        if (title.expertiseMarkPointStatus === true) {
          this.markPointStatus = true;
        } else {
          this.markPointStatus = false;
        }
        this.subscription = this.testService.getclass()
          .subscribe(res => {
            this.classes = res;
          });
      }
    });

    this.subjectService.getTitleSubject(this.rncpId).subscribe((res) => {
      for (const response of res.subjectList) {
        if (response.status !== 'deleted') {
          this.subjectList.push(response);
        }
      }
      this.processExpertiseList(this.subjectList);
      if (this.test.subjectId !== '') {
        this.subjects.forEach((item) => {
          if (item._id === this.test.subjectId) {
            this.testList = item.subjectTest;
          }
        });
      }
      for (const t of this.testList) {
        if (t._id === this.test.subjectTestId) {
          this.form.value.name = t.evaluation;
          this.test.name = t.evaluation;
          //  this.form.value.subjectTestId = t._id;
        }
      }
    });

    this.dateTypes = [
      {
        view: 'FIXED',
        value: 'Fixed'
      },
      {
        view: 'DIFFERENT',
        value: 'Different'
      },
      {
        view: 'MARKS',
        value: 'Marks'
      }
    ];

    if (this.test.type === 'mentor-evaluation') {
      const e = [];
      e['checked'] = true;
      this.showQuestionnaire(e);
      this.correctionTypes = _.filter(this.correctionTypes, function(c) {
        return c.value !== 'ADMTC';
      });
    } else {
      this.correctionTypes = GlobalConstants.correctionTypes;
    }

    this.visibleDataType = this.dateTypes;

    this.testService.getTest().subscribe((test) => {
      this.test = test;
      this.buildForm(this.test.groupTest);

      // When Controlled Toggle is Changed (Free Control)
      this.form.controls['controlledTest'].valueChanges.subscribe(emit => {
        if (this.test.date !== null && this.test.date !== '') {
          this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'testType');
          this.checkConditionsForTestType(this.form.controls['type'].value);
        }
      });
      // When COntrolled Toggle is Changed (Free Control) Ends Here
      // When Correction Type is Changed (Cross Corrector)
      this.form.controls['correctionType'].valueChanges.subscribe(emit => {

        // Logic to hide grouptest toggle and free control toggle and Retake Exam
        if (this.form.controls['correctionType'].value === 'pc' || this.form.controls['correctionType'].value === 'cp') {
          this.showGroupAndFreeControlCheckBox = false;
          this.form.controls['controlledTest'].setValue(false);
          this.form.controls['allowReTakeExam'].setValue(false);
        } else {
          this.showGroupAndFreeControlCheckBox = true;
          this.form.controls['controlledTest'].setValue(this.test.controlledTest);
          this.form.controls['allowReTakeExam'].setValue(this.test.allowReTakeExam);
        }
        // Logic to hide grouptest toggle and free control toggle ends here

        if (this.test.date !== null && this.test.date !== '') {
          if (this.form.controls['correctionType'].value === 'pc') {
            this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'testType' && element.createdFrom !== 'crossCorrection' && element.createdFrom !== 'groupTest');
            this.createCalendarStepsForCrossCorrector();
          } else {
            if (this.form.controls['correctionType'].value === 'ADMTC') {
              this.test.calendar.steps = [];
              this.createCalendarStep('Marks Entry', this.directorOfADMTCTypeId, new Date(this.test.date).toDateString(), 'correctionType');
            } else {
              this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'testType' && element.createdFrom !== 'crossCorrection');
              this.checkConditionsForTestType(this.form.controls['type'].value);
            }
          }
        }

      });
      // When Correction Type is Changed (Cross Corrector) Ends Here
      // When Test Type Changes
      this.form.controls['type'].valueChanges.subscribe(emit => {
        if (this.form.value.type === 'mentor-evaluation') {
          const e = [];
          e['checked'] = true;
          this.showQuestionnaire(e);
          this.form['allowReTakeExam'] = false;
          this.form['groupTest'] = false;
          this.correctionTypes = _.filter(this.correctionTypes, function(c) {
            return c.value !== 'ADMTC';
          }); // Remove Correction Type "ADMTC"
        } else if (this.form.value.type === 'Memoire-ORAL') {
          this.form.controls['correctionType'].setValue('cp');
        } else {
          this.correctionTypes = GlobalConstants.correctionTypes;
        }

        if (this.form.value.type === 'free-continuous-control') {
          const e = [];
          e['checked'] = true;
          this.freeControlTest = true;
          this.form.controls['controlledTest'].setValue(true);
          this.onControlledToggleChange(e);
        } else {
          const e = [];
          e['checked'] = false;
          this.freeControlTest = false;
          this.form.controls['controlledTest'].setValue(false);
          this.onControlledToggleChange(e);
        }

        if (this.test.date !== null && this.test.date !== '' && this.form.controls['correctionType'].value !== 'pc') {
          this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'testType');
          this.checkConditionsForTestType(this.form.controls['type'].value);
        }
      });
      // When Test Type Changes Ends Here

      // When Test DateType changes
      this.form.controls['dateType'].valueChanges.subscribe(emit => {
        this.test.dateType = emit;
        if (this.test.date !== null && this.test.date !== '') {
          if (this.form.controls['correctionType'].value === 'ADMTC') {
            // If Correction Type is ADMTC create only "Marks Entry" Task for Corrine Crespine
            this.test.calendar.steps = [];
            this.createCalendarStep('Marks Entry', this.directorOfADMTCTypeId, new Date(this.test.date).toDateString(), 'correctionType');
          } else {
            if (this.form.controls['correctionType'].value !== 'pc') {
              this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'testType');
              this.checkConditionsForTestType(this.form.controls['type'].value);

              // For Group Test
              if (this.form.controls['groupTest'].value === true && this.form.controls['correctionType'].value !== 'pc') {
                this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'groupTest');
                this.setCalendarStepForGroupTest();
              }
            } else {
              this.test.calendar.steps = this.test.calendar.steps.filter(element =>
                element.createdFrom !== 'testType' && element.createdFrom !== 'crossCorrection' && element.createdFrom !== 'groupTest');
              const testDate = this.form.value.date;
              this.createCalendarStepsForCrossCorrector();
            }
          }

        }
      });
      // When Test DateType changes Ends Here
      // When Test Date changes
      this.form.controls['date'].valueChanges.subscribe(emit => {
        this.test.date = new Date(new Date(emit).setHours(12, 0)).toDateString();
        if (this.form.controls['qualityControl'].value === true) {
          this.createCalanderStepForQC();
        }
        if (this.form.controls['correctionType'].value !== 'pc') {
          this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'testType');
          this.checkConditionsForTestType(this.form.controls['type'].value);

          // For Group Test
          if (this.form.controls['groupTest'].value === true) {
            this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'groupTest');
            this.setCalendarStepForGroupTest();
          }
        } else {
          this.test.calendar.steps = this.test.calendar.steps.filter(element =>
            element.createdFrom !== 'testType' && element.createdFrom !== 'crossCorrection' && element.createdFrom !== 'groupTest');
          const testDate = this.form.controls['date'].value;
          this.createCalendarStepsForCrossCorrector();
        }
      });
      // When Test Date changes Ends Here
      // When Grouptest Toggle is changed
      this.form.controls['groupTest'].valueChanges.subscribe(emit => {

        this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'groupTest');
        if (this.test.date !== null && this.test.date !== '') {
          if (this.form.controls['groupTest'].value === true) {
            this.setCalendarStepForGroupTest();
          } else {
            this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'groupTest');
          }
        }
        
        // Logic to hide Retake Exam
        if (this.form.controls['groupTest'].value === true) {
          this.form.controls['allowReTakeExam'].setValue(false);
          this.form.controls['qualityControl'].setValue(false);
          this.form.controls['qualityControlDifference'].setValue('');
          this.form.controls['studentPerSchoolForQC'].setValue('');
        } else {
          this.form.controls['allowReTakeExam'].setValue(this.test.allowReTakeExam);
          // this.form.controls['qualityControl'].setValue(false);
          this.form.controls['qualityControlDifference'].setValue('');
          this.form.controls['studentPerSchoolForQC'].setValue('');
        }
        // Logic to hide Retake Exam ends here
      });

      this.form.valueChanges.subscribe(function () {
        this.testService.setValidation(this.form.valid);
        Object.assign(this.test, this.form.value);
        this.testService.updateTest(this.test);

        if (this.test.date !== null && this.test.date !== '') {
          if (this.test && this.test.dateType === 'Different') {
            this.checkDiff({ value: 'Different' });
          } else if (this.test && this.test.dateType === 'Fixed') {
            this.checkDiff({ value: 'Fixed' });
          } else if (this.test && this.test.dateType === 'Marks') {
          }
        }
      }.bind(this));

    });

    // get tests
    // this.testService.getTestByRNCPTitle()
    //   .subscribe(res => {
    //     this.RncpTests = res;
    //   });

    // Get Schools
    this.testService.getPreparationCenters().subscribe((res) => {
      this.preparationCenter = res;
      if (this.test && this.test.dateType === 'Different') {
        this.isDiffDate = true;
        this.form.value.schools = [];

        if (this.preparationCenter.length) {
          this.preparationCenter.forEach((p, index) => {
            const schoolFound = this.test.schools.find(s => s.schoolDetails === p._id);
            if (this.form.controls['schools']['controls'].length < this.preparationCenter.length) {
              this.form.controls['schools']['controls'].push(this.fb.group({
                schoolDetails: p._id,
                shortName: p.shortName,
                testDate: schoolFound && schoolFound.testDate ? new Date(schoolFound.testDate).toDateString() : new Date()
              }));
            }
          });
        }
        // for (let index = 0; index < this.preparationCenter.length; index++) {
        //   const element = this.preparationCenter[index];
        //   if (this.form.controls['schools']['controls'].length < this.preparationCenter.length) {
        //     this.form.controls['schools']['controls'].push(this.fb.group({
        //       schoolDetails: element._id,
        //       testDate: this.test.schools.length && this.test.schools[index] && this.test.schools[index].testDate && this.preparationCenter[index]._id === this.test.schools[index].schoolDetails ?
        //         new Date(this.test.schools[index].testDate).toDateString() :
        //         this.test.date ? new Date(this.test.date).toDateString() : new Date(),
        //       shortName: this.preparationCenter[index].shortName
        //     }));
        //   }
        // }
      }
      if (this.test && this.test.dateType === 'Fixed') {
        this.checkDiff({ value: 'Fixed' });
      }
    });

  }

  fillTestData(event) {
    if (event.value) {
      this.test.subjectTestId = event.value;
      for (const t of this.testList) {
        if (t._id === event.value) {
          //  console.log(t);
          this.test.weight = t.weight;
          this.test.type = t.type;
          this.form.value.name = t.evaluation;
          this.test.name = t.evaluation;
          this.testService.updateTest(this.test);
          this.form.controls['type'].updateValueAndValidity();
        }
      }
    }
  }

  changeTest(event) {
    if (event.value) {
      this.test.subjectId = event.value;
      this.testList = [];
      for (const s of this.subjects) {
        if (event.value === s._id) {
          if (s.subjectTest) {
            for (const test of s.subjectTest) {
              if (test.status !== 'deleted') {
                this.testList.push(test);
              }
            }
            if (this.markPointStatus === false) {
              if (s.coefficient !== null) {
                this.test.coefficient = s.coefficient;
              }
            } else {
              if (s.maxPoints !== null) {
                this.test.maxScore = s.maxPoints;
              }
            }
            this.testService.updateTest(this.test);
          }
        }
      }
    }
  }

  buildForm(IsGroupTest) {
    if (IsGroupTest) {
      this.form = this.fb.group({
        subjectId: [this.test.subjectId, Validators.required],
        subjectTestId: [this.test.subjectTestId, Validators.required],
        name: [this.test.name, Validators.required],
        maxScore: [this.test.maxScore ? this.test.maxScore : 0, Validators.required],
        coefficient: [this.test.coefficient, Validators.required],
        type: [this.test.type, Validators.required],
        weight: [this.test.weight],
        class: [this.test.class, Validators.required],
        correctionType: [this.test.correctionType, Validators.required],
        organiser: ['PREPARATIONCENTER', Validators.required],
        dateType: [this.test.dateType, Validators.required],
        date: [new Date(this.test.date).toDateString(), [CustomValidators.date, Validators.required]
        ],
        groupTest: [this.test.groupTest],
        correctionGrid: this.initGroup(),
        //  correctionGrid: { groupDetails: { noOfStudents: [this.test.correctionGrid.groupDetails.noOfStudents, Validators.required], minNoOfStudents: [this.test.correctionGrid.groupDetails.minNoOfStudents, Validators.required] } },
        controlledTest: [this.test.controlledTest],
        schools: this.fb.array([]),
        allowReTakeExam: [this.test.allowReTakeExam],
        dateReTakeExam: [this.test.dateReTakeExam ? new Date(this.test.dateReTakeExam).toDateString() : '', this.test.allowReTakeExam ? Validators.required : ''],
        parentRNCPTitle: [this.rncpId]
        // this.initSchools()
      });
    } else {
      //  console.log(this.test.date);
      this.form = this.fb.group({
        subjectId: [this.test.subjectId, Validators.required],
        subjectTestId: [this.test.subjectTestId, Validators.required],
        maxScore: [this.test.maxScore ? this.test.maxScore : 0],
        coefficient: [this.test.coefficient],
        type: [this.test.type, Validators.required],
        weight: [this.test.weight],
        class: [this.test.class, Validators.required],
        correctionType: [this.test.correctionType, Validators.required],
        organiser: ['PREPARATIONCENTER', Validators.required],
        dateType: [this.test.dateType, Validators.required],
        date: [new Date(this.test.date).toDateString(), [CustomValidators.date, Validators.required]],
        groupTest: [this.test.groupTest],
        // correctionGrid: this.initGroup(),
        // correctionGrid: { groupDetails: { noOfStudents: [this.test.correctionGrid.groupDetails.noOfStudents, Validators.required], minNoOfStudents: [this.test.correctionGrid.groupDetails.minNoOfStudents, Validators.required] } },
        controlledTest: [this.test.controlledTest],
        schools: this.fb.array([]),
        allowReTakeExam: [this.test.allowReTakeExam],
        dateReTakeExam: [this.test.dateReTakeExam ? new Date(this.test.dateReTakeExam).toDateString() : '', this.test.allowReTakeExam ? Validators.required : ''],
        parentRNCPTitle: [this.rncpId],
        qualityControl: [this.test.qualityControl],
        studentPerSchoolForQC: [this.test.studentPerSchoolForQC],
        qualityControlDifference: [this.test.qualityControlDifference]
      });
    }

    //  console.log(this.form);
    this.filterDateTypesBasedOnContolledTestOrAllowRetake();
  }

  filterDateTypesBasedOnContolledTestOrAllowRetake() {
    if (this.test.controlledTest || this.test.allowReTakeExam) {
      this.visibleDataType = this.dateTypes.filter((item) => { return item.value === 'Marks'; });
      this.form.controls['dateType'].setValue('Marks');
      this.isDiffDate = false;
    } else {
      this.visibleDataType = this.dateTypes;
    }
  }

  initGroup() {
    // initialize our Group
    return this.fb.group({
      groupDetails: this.initStudents(),
      header: this.initHeader(),
      footer: this.initFooter(),
      correction: [this.test.correctionGrid.correction]
    });
  }
  initStudents() {
    // initialize our Students
    return this.fb.group({
      noOfStudents: [this.test.correctionGrid.groupDetails.noOfStudents, Validators.required],
      minNoOfStudents: [this.test.correctionGrid.groupDetails.minNoOfStudents, Validators.required]
    });
  }
  initHeader() {
    return this.fb.group({
      text: [this.test.correctionGrid.header.text],
      fields: [this.test.correctionGrid.header.fields]
    });
  }

  initFooter() {
    return this.fb.group({
      text: [this.test.correctionGrid.footer.text],
      fields: [this.test.correctionGrid.footer.fields]
    });
  }

  initSchools(): FormGroup {
    return this.fb.group({
      schoolDetails: new FormControl(''),
      testDate: new FormControl(''),
      shortName: new FormControl('')
    });
  }

  addSchool() {
    this.schools = this.form.get('schools') as FormArray;
    this.schools.push(this.initSchools());
  }

  duplicateTest() {
    const testId = this.test._id ? this.test._id : null;
    this.duplicateTestDialog = this.dialog.open(DuplicateTestDialogComponent, this.configSearch);
    this.duplicateTestDialog.afterClosed().subscribe(function (test) {
      if (test) {
        console.log(test);
        this.test = test;
        //  this.test._id = testId;
        this.test.type = '';
        this.test.name = '';
        this.test.date = '';
        if (testId !== null) {
          this.test._id = testId;
        }
        this.test.class = null;
        this.test.subjectId = '';
        this.test.subjectTestId = '';
        this.test.date = null;
        this.testService.updateTest(test);
      }
    }.bind(this));
  }

  goToNextStep() {
    this.testService.setValidation(this.form.valid);
    this.submitted = true;
    if (this.form.invalid) {
    } else {
      this.testService.updateTest(Object.assign(this.test, this.form.value));
      const url = !this.form.value.controlledTest ? '/create-test/second' : '/create-test/fourth';
      this.router.navigateByUrl(url).catch((rejected) => {
      });
    }
  }

  onControlledToggle(e) {
    if (e.checked) {
      this.visibleDataType = this.dateTypes.filter((item) => { return item.value === 'Marks'; });
      this.form.controls['dateType'].setValue('Marks');
      this.isDiffDate = false;
      this.freeControlTest = true;
    } else {
      this.visibleDataType = this.dateTypes;
      this.freeControlTest = false;
    }

  }

  onControlledToggleChange(e) {
    if (e.checked) {
      console.log(e.checked);
      this.visibleDataType = this.dateTypes.filter((item) => { return item.value === 'Marks'; });
      this.form.controls['dateType'].setValue('Marks');
      this.isDiffDate = false;

      // When Test is Free Controlled Marks Entry Calendar Step is as it is
      this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'testType');
      this.checkConditionsForTestType(this.form.controls['type'].value);
    } else {
      this.visibleDataType = this.dateTypes;

      // When Test isnot Free Controlled Marks Entry Calendar Step has Who => "Corrector"
      this.test.calendar.steps = this.test.calendar.steps.filter(element => element.createdFrom !== 'testType');
      this.checkConditionsForTestType(this.form.controls['type'].value);
    }

  }

  updateMyDate(event) {
    if (this.test && this.form.value.schools) {
      this.test.schools = this.form.value.schools;
    }
  }

  checkDiff(event) {
    if (event.value === 'Different') {
      this.isDiffDate = true;
      this.form.value.schools = [];
      for (let index = 0; index < this.preparationCenter.length; index++) {
        const element = this.preparationCenter[index];
        if (this.form.controls['schools']['controls'].length < this.preparationCenter.length) {
          this.form.controls['schools']['controls'].push(this.fb.group({
            schoolDetails: element._id,
            testDate:
              this.test.date ? new Date(this.test.date).toDateString() : new Date().toDateString(),
            shortName: this.preparationCenter[index].shortName
          }));
        }
      }
    } else if (event.value === 'Fixed') {
      this.isDiffDate = false;
      const self = this;
      const schoolCtrl = this.form.controls['schools']['controls'];
      this.form.value.schools = [];
      console.log('fixed', this.test);
      for (let index = 0; index < this.preparationCenter.length; index++) {
        const element = this.preparationCenter[index];
        if (schoolCtrl.length < this.preparationCenter.length) {
          schoolCtrl.push(this.fb.group({
            schoolDetails: element._id,
            testDate: new Date(this.form.controls['date'].value).toDateString()
          }));
          this.form.value.schools.push({
            schoolDetails: element._id,
            testDate: new Date(this.form.controls['date'].value).toDateString()
          });
        }
      }
      this.test.schools = this.form.value.schools;
      this.testService.updateTest(this.test);
    } else if (event.value === 'Marks') {
      this.isDiffDate = false;
    }
  }

  setCalendarStepForGroupTest() {
    let dateAfter = '';
    const today = new Date().toDateString();
    const testDate = this.form.controls['date'].value;
    const thirtyDaysAfterTest = moment(new Date(new Date(today).setDate(new Date(today).getDate() + 30)).toDateString());
    dateAfter = moment(testDate).isBetween(today, thirtyDaysAfterTest) ? today : new Date(new Date(testDate).setDate(new Date(testDate).getDate() - 30)).toString();
    this.createCalendarStep('Create Groups', this.acadStaffId, dateAfter, 'groupTest', true, 30);
  }
  getFirstUser() {
    this.userservice.getUserBasedOnUserType('admtc')
      .subscribe(
        (response) => {
          const index = _.findIndex(response.data, { 'email': GlobalConstants.admtcAdminEmail });
          console.log(index);
          if (index > -1) {
            this.firstUser[0] = response.data[index];
            console.log(this.firstUser);
          } else {
            this.firstUser[0] = response.data[0];
            console.log(this.firstUser);
          }
        }
      );
  }
  setUserTypesForAutoCalendarSteps() {
    this.userTypesService.getAllUserType().subscribe(uTypes => {

      // Set Corrector, Academic Director and Cross-Corrector Of Entity Academic
      const acadObj = _.filter(uTypes.list, function (o) {
        return (o.name.toLowerCase() === 'corrector' ||
          o.name.toLowerCase() === 'academic-director' ||
          o.name.toLowerCase() === 'cross-corrector') && o.entity === 'academic';
      });
      const indexOfCorrector = _.findIndex(acadObj, function (o) { return o.name.toLowerCase() === 'corrector'; });
      const indexOfAcadDirector = _.findIndex(acadObj, function (o) { return o.name.toLowerCase() === 'academic-director'; });
      const indexOfCrossCorrector = _.findIndex(acadObj, function (o) { return o.name.toLowerCase() === 'cross-corrector'; });
      this.correctorId = acadObj[indexOfCorrector]._id;
      this.acadStaffId = acadObj[indexOfAcadDirector]._id;
      this.crossCorrectorId = acadObj[indexOfCrossCorrector]._id;

      // Set President-Of-Jury and Admin of Entity Certifier
      const presidentOfJuryAndAdminObj = _.filter(uTypes.list, function (o) {
        return (o.name.toLowerCase() === 'president-of-jury' ||
          o.name.toLowerCase() === 'admin' || o.name.toLowerCase() === 'corrector-certifier') && o.entity === 'certifier';
      });
      const indexOfPresidenOfJury = _.findIndex(presidentOfJuryAndAdminObj, function (o) { return o.name.toLowerCase() === 'president-of-jury'; });
      const indexOfAdmin = _.findIndex(presidentOfJuryAndAdminObj, function (o) { return o.name.toLowerCase() === 'admin'; });
      const indexOfCertifierCorrector = _.findIndex(presidentOfJuryAndAdminObj, function (o) { return o.name.toLowerCase() === 'corrector-certifier'; });
      const certifierObj = _.findIndex(presidentOfJuryAndAdminObj, function (o) {
        return o.name.toLowerCase() === 'admin' && o.entity === 'certifier'; });
      this.presidentOfJury = presidentOfJuryAndAdminObj[indexOfPresidenOfJury]._id;
      this.adminOfCertifier = presidentOfJuryAndAdminObj[indexOfAdmin]._id;
      this.correctorCertifierId = presidentOfJuryAndAdminObj[indexOfCertifierCorrector]._id;
      this.certifierId = presidentOfJuryAndAdminObj[certifierObj]._id;

      //Quality corrector
      const qualityCorrObj = _.filter(uTypes.list, function (o) {
        return (o.name.toLowerCase() === 'corrector-quality') && o.entity === 'certifier';
      });
      const qCertifierObj = _.findIndex(qualityCorrObj, function (o) {
        return o.name.toLowerCase() === 'corrector-quality' && o.entity === 'certifier';
      });
      this.qcCertifierId = qualityCorrObj[qCertifierObj]._id;
      // Set ADMTC Director
      const admtcDirectorObj = _.filter(uTypes.list, function (o) {
        return o.name.toLowerCase() === 'director' && o.entity === 'academic';
      });
      const admtcDirectorIndex = _.findIndex(admtcDirectorObj, function (o) { return o.name.toLowerCase() === 'director'; });
      this.admtcDirectorId = admtcDirectorObj[admtcDirectorIndex]._id;
      const admtcDircObj = _.find(uTypes.list, (type) => type.entity === 'admtc' &&  type.name.toLowerCase() === 'director' );
      this.directorOfADMTCTypeId = admtcDircObj['_id'];
    });
  }


  showQuestionnaire(event) {
    if (event.checked === true) {
      this.showQuestionnaireList = true;
      this.test.addedQuestionnaire = true;
    } else {
      this.showQuestionnaireList = false;
      this.test.addedQuestionnaire = false;
    }
  }
  setJuryMin(min) {
    console.log(min);
    if (this.test.type === 'Jury' || this.test.type === 'Memoire-ORAL') {
      this.test.juryMin = min;
    } else {
      min = 0;
      this.test.juryMin = min;
    }
  }

  setJuryMax(max) {
    if (this.test.type === 'Jury' || this.test.type === 'Memoire-ORAL') {
      this.test.juryMax = max;
    } else {
      max = 0;
      this.test.juryMax = max;
    }
  }
  setQuestionnaireId(event) {
    this.test.questionnaire = event.value;
  }
  checkConditionsForTestType(testtypes) {

    let dateBeforeThirty = '';
    let dateBeforeSixty = '';
    const marksEntryAssignedTo = this.test.correctionType === 'cp' ? this.correctorCertifierId : this.correctorId;
    const assignCorrectorAssignedTo = this.test.correctionType === 'cp' ? this.adminOfCertifier : this.acadStaffId;
    const today = new Date().toDateString();
    const testDate = new Date(this.form.controls['date'].value).toDateString();
    const thirtyDaysAfterTest = moment(new Date(new Date(today).setDate(new Date(today).getDate() + 30)));
    const sixtyDaysAfterTest = moment(new Date(new Date(today).setDate(new Date(today).getDate() + 60)));

    dateBeforeThirty = moment(testDate).isBetween(moment(today).format('YYYY-MM-DD'), thirtyDaysAfterTest, null, '[]') ? today : new Date(new Date(testDate).setDate(new Date(testDate).getDate() - 30)).toDateString();
    dateBeforeSixty = moment(testDate).isBetween(moment(today).format("YYYY-MM-DD"), sixtyDaysAfterTest, null, '[]') ? today : new Date(new Date(testDate).setDate(new Date(testDate).getDate() - 60)).toDateString();
    const dateForMarksEntry = this.test.dateType.toUpperCase() === 'FIXED' ? new Date(new Date(testDate).setDate(new Date(testDate).getDate() + 3)).toDateString() : new Date(testDate).toDateString();

    switch (testtypes) {
      case 'Oral':
        this.createCalendarStep('Assign Corrector', assignCorrectorAssignedTo, dateBeforeThirty, 'testType', true, 30);
        this.createCalendarStep('Marks Entry', this.form.controls['controlledTest'].value === true ? this.acadStaffId : marksEntryAssignedTo, dateForMarksEntry, 'testType');
        break;

      case 'Written':
        this.createCalendarStep('Assign Corrector', assignCorrectorAssignedTo, dateBeforeThirty, 'testType', true, 30);
        this.createCalendarStep('Marks Entry', this.form.controls['controlledTest'].value === true ? this.acadStaffId : marksEntryAssignedTo, dateForMarksEntry, 'testType');
        break;

      case 'Memoire-ECRIT':
        this.createCalendarStep('Assign Corrector', this.adminOfCertifier, dateBeforeThirty, 'testType', true, 30);
        this.createCalendarStep('Marks Entry', marksEntryAssignedTo, dateForMarksEntry, 'testType');
        break;

      case 'Memoire-ORAL':
        this.createCalendarStep('Assign Corrector', this.adminOfCertifier, dateBeforeSixty, 'testType', true, 30);
        this.createCalendarStep('Marks Entry', this.form.controls['controlledTest'].value === true ? this.acadStaffId : marksEntryAssignedTo, dateForMarksEntry, 'testType');
        break;

      case 'free-continuous-control':
        this.createCalendarStep('Marks Entry', this.form.controls['controlledTest'].value === true ? this.acadStaffId : marksEntryAssignedTo, dateForMarksEntry, 'testType');
        break;

      case 'mentor-evaluation':
        this.createCalendarStep('Send the Evaluation to Company\'s Mentor', this.acadStaffId, dateBeforeThirty, 'testType', false);
        this.createCalendarStep('Validation of Mentor Evaluation', this.acadStaffId, testDate, 'testType', false);
        break;

      case 'Jury':
        this.createCalendarStep('Assign Corrector', this.adminOfCertifier, dateBeforeSixty, 'testType', true, 30);
        this.createCalendarStep('Marks Entry', this.form.controls['controlledTest'].value === true ? this.acadStaffId : marksEntryAssignedTo, dateForMarksEntry, 'testType');
        break;

      case 'School-Mentor-Evaluation':
        this.createCalendarStep('Assign Corrector', assignCorrectorAssignedTo, dateBeforeThirty, 'testType', true, 30);
        this.createCalendarStep('Marks Entry', this.form.controls['controlledTest'].value === true ? this.acadStaffId : marksEntryAssignedTo, dateForMarksEntry, 'testType');
        break;
    }
  }

  createCalendarStep(stepName, actorId, dateValue, createdFromWhichField, isFixed?: boolean, days?: number) {
    if (this.test.dateType !== 'different' && !isFixed) {
      this.test.calendar.steps.push({
        id: this.ids,
        text: stepName,
        sender: this.assignedADMTCDIRForRNCP ? this.assignedADMTCDIRForRNCP : ( this.firstUser[0] ? this.firstUser[0]['_id'] : '' ),
        actor: actorId,
        date: {
          type: 'fixed',
          value: new Date(new Date(dateValue).setHours(12)).toDateString()
        },
        createdFrom: createdFromWhichField
      });
    } else {
      this.test.calendar.steps.push({
        id: this.ids,
        text: stepName,
        sender: this.assignedADMTCDIRForRNCP ? this.assignedADMTCDIRForRNCP : ( this.firstUser[0] ? this.firstUser[0]['_id'] : '' ),
        actor: actorId,
        date: {
          type: 'relative',
          before: true,
          days: days
        },
        createdFrom: createdFromWhichField
      });
    }
  }


  whenChangeCorrectionType(val) {
    const testDate = new Date(this.form.controls['date'].value).toDateString();
    if (val === 'pc') {
      this.createCalendarStep('Create Cross Corrector', this.acadStaffId, testDate, 'crossCorrection', true, 60);
    }
  }

  createCalendarStepsForCrossCorrector() {
    const testDate = new Date(this.form.controls['date'].value).toDateString();
    this.createCalendarStep('Create Cross Corrector', this.acadStaffId, testDate, 'crossCorrection', true, 60);
    this.createCalendarStep('Assign Cross Corrector', this.directorOfADMTCTypeId, testDate, 'crossCorrection', true, 30);
    this.createCalendarStep('Marks Entry', this.crossCorrectorId, testDate, 'crossCorrection', false);
  }

  getCorrectionTypes () {
    if (this.test.allowReTakeExam || this.test.groupTest) {
      return _.filter(this.correctionTypes, function (c) {
        return c.value !== 'pc';
      });
    } else {
      return this.correctionTypes;
    }
  }

  whenAllowReTakeChange (event) {
    console.log(event);
    if (event['checked']) {
      this.form.controls['groupTest'].setValue(false);
      this.form.controls['controlledTest'].setValue(false);
    } else {
      this.form.controls['groupTest'].setValue(this.test.groupTest);
      this.form.controls['controlledTest'].setValue(this.test.controlledTest);
    }
  }

  dateBasedOnTestType(date) {
    if (this.isDiffDate) {

    } else {

    }
  }

  createCalanderStepForQC() {
    let dateBeforeThirty = '';
    const today = new Date().toDateString();
    const testDate = new Date(this.form.controls['date'].value).toDateString();
    const thirtyDaysAfterTest = moment(new Date(new Date(today).setDate(new Date(today).getDate() + 30)));
    // tslint:disable-next-line:max-line-length
    const dateForMarksEntry = this.test.dateType.toUpperCase() === 'FIXED' ? new Date(new Date(testDate).setDate(new Date(testDate).getDate() + 3)).toDateString() : new Date(testDate).toDateString();
    dateBeforeThirty = moment(testDate).isBetween(moment(today).format('YYYY-MM-DD'), thirtyDaysAfterTest, null, '[]') ? today : new Date(new Date(testDate).setDate(new Date(testDate).getDate() - 30)).toDateString();
    this.test.calendar.steps = [];
    this.createCalendarStep('Assign Quality Control corrector', this.certifierId, dateBeforeThirty, 'qualityControl', true, 30);
    // tslint:disable-next-line:max-line-length
    this.createCalendarStep('Mark Entry for Quality Control', this.form.controls['qualityControl'].value === true ? this.qcCertifierId: this.correctorId, dateForMarksEntry, 'qualityControl');
  }

  allowQualityControl(event) {
    console.log('in quality');
    if (event['checked']) {
      this.student_no = true;
      this.createCalanderStepForQC();
      this.form.controls['qualityControl'].setValue(true);
      this.form.controls['studentPerSchoolForQC'].setValidators([Validators.required]);
      this.form.controls['qualityControlDifference'].setValidators([Validators.required]);
      this.checkConditionsForTestType(this.test.type);
    }else {
      this.student_no = false;
      this.form.controls['qualityControlDifference'].setValue('');
      this.form.controls['studentPerSchoolForQC'].setValue('');
      this.form.controls['qualityControl'].setValue(false);
      this.checkConditionsForTestType(this.test.type);
      //fs
    }
  }

  showQualityControl() {
    let showQc = false;
     if (this.test.type === 'free-continuous-control') {
       showQc =  false;
     }
    if (this.test.type === 'mentor-evaluation') {
      showQc =  false;
    } else if (this.freeControlTest) {
       showQc =  false;
     } else if (this.form.controls['groupTest'].value) {
       showQc = false;
     } else {
       showQc = true;
     }
     return showQc;
  }

  classChange(classData) {
    console.log(this.subjects);
    this.subjects = this.tempSubjects;
    this.subjects = _.filter(this.subjects, {'classId': classData.value});
    console.log(this.subjects);
    this.form.controls['subjectId'].setValue('');
    this.form.controls['subjectTestId'].setValue('');
    this.form.controls['type'].setValue('');
    this.test.calendar.steps.filter( steps => {
      return steps.createdFrom !== 'testType';
    });
  }
}
