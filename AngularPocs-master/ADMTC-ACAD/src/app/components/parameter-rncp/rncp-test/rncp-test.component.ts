import {
  Component, ElementRef,
  OnInit, ViewChild
} from '@angular/core';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import {
  MdSlideToggleChange, MdDialog, MdDialogRef,
  MdDialogConfig
} from '@angular/material';
import {
  FormArray, FormBuilder, FormGroup, Validators, FormControl,
} from '@angular/forms';
import { SubjectService } from '../../../services/subject.service';
import { ExpertiseService } from '../../../services/expertise.service';
import swal from 'sweetalert2';
import { PRINTSTYLES, STYLES } from './styles';
import { Print } from '../../../shared/global-urls';
import { PDFService } from '../../../services/pdf.service';
import { TranslateService } from 'ng2-translate';
import { AddSubjectDialogComponent } from './add-subject-dialog/add-subject-dialog.component';
import { AddExpertiseDialogComponent } from './add-expertise-dialog/add-expertise-dialog.component';
import { AddTestDialogComponent } from './add-test-dialog/add-test-dialog.component';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { GlobalConstants } from '../../../shared/settings/global-constants';
import { ScholarSeasonService } from '../../../services';
import _ from 'lodash';
import { UtilityService } from '../../../services/utility.service';
import { DuplicateConditionDialogComponent } from '../duplicate-condition-dialog/duplicate-condition-dialog.component';
import { ConfigService } from 'app/services/config.service';


@Component({
  selector: 'app-rncp-test',
  templateUrl: './rncp-test.component.html',
  styleUrls: ['./rncp-test.component.scss']
})

export class RncpTestComponent implements OnInit {
  rncpTitles = [];
  TestType = GlobalConstants.TestType;
  subjectList = [];
  expertiseList = [];
  page = new Page();
  sort = new Sort();
  test = [];
  selectedRNCP;
  selectedClass;
  selectedRNCPDetails;
  classes = [];
  form: FormArray;
  RNCPform: FormGroup;
  docData = [];
  @ViewChild('pagesElement') documentPagesRef: ElementRef;
  @ViewChild('formSubmitBtton') formSubmitBtton: ElementRef;
  public subjectNumber = 0;
  public expertiseNumber = 0;
  public dialogRef: MdDialogRef<AddSubjectDialogComponent>;
  public dialogRefExpertise: MdDialogRef<AddExpertiseDialogComponent>;
  public dialogRefDuplicateCondition: MdDialogRef<DuplicateConditionDialogComponent>;
  public dialogRefTest: MdDialogRef<AddTestDialogComponent>;
  AddSubjectDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '40%',
    height: '50%'
  };
  AddExpertiseDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '40%',
    height: '70%'
  };
  DuplicateConditionDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '40%',
    height: '35%'
  };
  expertiseMaxPoints = 0;
  expertiseMarkPointStatus = false;
  docFooterText = '';
  filteredOptions: Observable<string[]>;
  filteredClasses: Observable<string[]>;
  text: any;
  classText: any;
  blockOfExpertisePlaceholder = [];
  loading = false;
  scholarSeason: any;
  constructor(
    private titleService: RNCPTitlesService,
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private expertiseService: ExpertiseService,
    private pdfService: PDFService,
    public translate: TranslateService,
    public dialog: MdDialog,
    public datepipe: DatePipe,
    private scholarSearvice: ScholarSeasonService,
    private utilityService: UtilityService,
    private configService: ConfigService
  ) {

    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 0;
    this.page.totalPages = 0;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';


    this.RNCPform = new FormGroup({
      text: new FormControl('', Validators.required),
      classText: new FormControl('', Validators.required)
    });

    this.text = this.RNCPform.controls['text'];
    this.classText = this.RNCPform.controls['classText'];
    this.filteredOptions = this.text.valueChanges.startWith(null)
      .map(list => list ? this.filterRNCPTitle(list) :
        this.rncpTitles.slice());

    this.filteredClasses = this.classText.valueChanges.startWith(null)
      .map(list => list ? this.filterClasses(list) :
        this.classes.slice());
  }
  filterRNCPTitle(name: string) {
    return this.rncpTitles.filter(list =>
      list.shortName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  filterClasses(name: string) {
    return this.classes.filter(list =>
      list.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  OnSelectRNCPTitle(data) {
    console.log(data);
    if (data && data._id) {
      this.selectedRNCP = data._id;
      this.classes = data.classes;
      this.RNCPform.controls['classText'].setValue('');
      this.getScholarSeason();
    }
  }

  OnSelectClass(classData) {
    if (classData && classData._id) {
      this.selectedClass = classData;
      this.getExpertise(true);
    }
  }

  ngOnInit() {

    const self = this;
    this.titleService
      .getRNCPWithClasses()
      .subscribe(data => {
        this.rncpTitles = data.titles.sort(self.keysrt('shortName'));
        this.RNCPform.controls['text'].setValue('');
      });

    this.form = this.fb.array([]);

  }
  keysrt(key) {
    return function (a, b) {
      if (a[key] > b[key]) { return 1; }
      if (a[key] < b[key]) { return -1; }
      return 0;
    }
  }
  // getSubjects(){
  //   this.form =  this.fb.array([]);
  //   this.subjectNumber = 0;
  //   this.titleService.selectRncpTitle(this.selectedRNCP).subscribe(() => {
  //     console.log(this.selectedRNCP);
  //     this.subjectService.getTitleSubject(this.selectedRNCP).subscribe((res) => {
  //       this.subjectList = [];
  //       for(let i=0;i<res.subjectList.length;i++){
  //         if(res.subjectList[i].status != "deleted"){
  //           this.subjectList.push(res.subjectList[i]);
  //           this.addNewSubject(0,res.subjectList[i],false);
  //         }
  //       }
  //     });
  //   });


  //   this.rncpTitles.forEach(element => {
  //     if(element._id == this.selectedRNCP){
  //       this.selectedRNCPDetails = element;
  //       console.log(this.selectedRNCPDetails);
  //     }
  //   });

  // }
  getExpertise(updateStatus) {
    this.form = this.fb.array([]);
    this.expertiseNumber = 0;
    this.subjectNumber = 0;
    this.expertiseService.getTitleExpertiseBaseodOnRNCPAndClass(this.selectedRNCP, this.selectedClass._id).subscribe((res) => {
      this.expertiseList = [];
      for (let i = 0; i < res.expertiseList.length; i++) {
        if (res.expertiseList[i].status !== 'deleted') {
          this.expertiseList.push(res.expertiseList[i]);
          this.GenerateExpertiseForm(res.expertiseList[i]);
          this.blockOfExpertisePlaceholder[this.blockOfExpertisePlaceholder.length] = 'PARAMETERS-RNCP.EXPERTISE.NAME.title'
        }
      }
    });
    // });

    /*Get Selected RNCP Titles */
    this.rncpTitles.forEach(element => {
      if (element._id === this.selectedRNCP) {
        this.selectedRNCPDetails = element;

        if(updateStatus) {
          this.expertiseMarkPointStatus = this.selectedRNCPDetails &&
            this.selectedRNCPDetails.expertiseMarkPointStatus ? this.selectedRNCPDetails.expertiseMarkPointStatus : false;
          this.expertiseMaxPoints = this.selectedRNCPDetails && this.selectedRNCPDetails.expertiseMaxPoints ?
          this.selectedRNCPDetails.expertiseMaxPoints : '';
        }else {
          element.expertiseMarkPointStatus = this.expertiseMarkPointStatus ;
          element.expertiseMaxPoints = this.expertiseMaxPoints;
        }

        this.docFooterText = 'ADMTC ' + this.selectedRNCPDetails.shortName + ' - ' + this.selectedClass.name + ' - CONDITIONS - ' + this.scholarSeason;


      }
    });

  }

  toggleFinalScore(event: MdSlideToggleChange, index) {
    this.form.controls[index]['controls'].countForTitleFinalScore.setValue(event.checked);
    if (!event.checked && !this.expertiseMarkPointStatus) {
      this.blockOfExpertisePlaceholder[index] = 'Option';
    } else {
      this.blockOfExpertisePlaceholder[index] = 'PARAMETERS-RNCP.EXPERTISE.NAME.title';
    }
    console.log(this.blockOfExpertisePlaceholder);
    console.log(index);
  }
  toggleexpertiseMarkPointStatus(event: MdSlideToggleChange, index) {
    this.expertiseMarkPointStatus = event.checked;
    for (let i = 0; i < this.expertiseList.length; i++) {
      if (!event.checked && !this.expertiseList[i].countForTitleFinalScore) {
        this.blockOfExpertisePlaceholder[i] = 'Option';
      } else {
        this.blockOfExpertisePlaceholder[index] = 'PARAMETERS-RNCP.EXPERTISE.NAME.title';
      }
    }
  }


  addNewExpertiseDialog() {
    const valueTests = this.form.value;
    let sum = 0.00;
    for (let j = 0; j < valueTests.length; j++) {
      sum = sum + Number(Number(valueTests[j].maxPoints));
    }
    if (this.expertiseMarkPointStatus && sum >= this.expertiseMaxPoints) {
      swal({
        title: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.ExpertiseMathchWithMaxPointTitle'),
        html: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.ExpertiseMathchWithMaxPointText', { MAXPOINTOFTHETITLE: this.expertiseMaxPoints }),
        type: 'warning',
        allowEscapeKey: true,
        showCancelButton: false,
        confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
      });
    } else {
      this.dialogRefExpertise = this.dialog.open(AddExpertiseDialogComponent, this.AddExpertiseDialogConfig);
      this.dialogRefExpertise.componentInstance.expertise = {};
      this.dialogRefExpertise.componentInstance.selectedRNCP = this.selectedRNCP;
      this.dialogRefExpertise.componentInstance.expertiseMaxPoints = Number(this.expertiseMaxPoints - Number(sum));
      this.dialogRefExpertise.componentInstance.expertiseMarkPointStatus = this.expertiseMarkPointStatus;
      this.dialogRefExpertise.componentInstance.specializations = this.getSpecializations();
      this.dialogRefExpertise.afterClosed().subscribe(result => {
        this.dialogRefExpertise = null;
        console.log(result);
        if (result) {
          console.log('Update Expertise Form');
          this.expertiseList.push(result);
          this.GenerateExpertiseForm(result);
        }
      });
    }

  }

  getSpecializations() {
    const specs = [...this.expertiseList.map(e => e.specialization)];
    const diff = _.differenceBy(this.selectedRNCPDetails.specializations, specs, '_id');
    return diff ? diff : this.selectedRNCPDetails.specializations;
  }

  GenerateExpertiseForm(data) {
    this.subjectNumber = 0;
    const control = this.form;
    const addrCtrl = this.fb.group({
      blockOfExperise: [data ? data.blockOfExperise : '', Validators.required],
      countForTitleFinalScore: [data ? data.countForTitleFinalScore : ''],
      maxPoints: [data ? data.maxPoints : 0],
      minScore: [data ? data.minScore : '', Validators.required],
      description: [data ? data.description : '', Validators.required],
      rncpTitle: [data ? data.rncpTitle : '', Validators.required],
      expertiseCredits: [data ? Math.abs(data.expertiseCredits) : ''],
      isSpecialization: [data ? data.isSpecialization : ''],
      id: [data ? data._id : ''],
      subject: this.fb.array([]),
      specialization: [data ? data.specialization : null]
    });
    control.push(addrCtrl);
    console.log('data.ExpertiseTest');
    console.log(data);
    if (data.subject && data.subject.length) {
      data.subject.forEach(element => {
        if (element.status !== 'deleted') {
          this.GenerateSubjectForm(this.expertiseNumber, element);
          this.subjectNumber = this.subjectNumber + 1;
        }
      });
    }
    this.expertiseNumber = this.expertiseNumber + 1;
  }


  addNewSubject(expertiseIndex) {

    // this.dialogRef = this.dialog.open(AddSubjectDialogComponent, this.AddSubjectDialogConfig);
    // this.dialogRef.componentInstance.subject = {};
    // this.dialogRef.componentInstance.selectedRNCP = this.selectedRNCP;
    // this.dialogRef.componentInstance.expertise = this.expertiseList[expertiseIndex]._id;
    // this.dialogRef.afterClosed().subscribe(result => {
    //   this.dialogRef = null;
    //   if(result){
    //     console.log('Need to update subject');
    //     this.GenerateSubjectForm(expertiseIndex,result);
    //     this.subjectNumber = this.subjectNumber + 1;
    //   }
    // });

    const subjects = this.form.value[expertiseIndex].subject;
    const ExpertiseMaxPoint = this.form.value[expertiseIndex].maxPoints;
    let sum = 0.00;
    for (let j = 0; j < subjects.length; j++) {
      sum = sum + Number(Number(subjects[j].maxPoints));
    }

    if (this.expertiseMarkPointStatus && sum >= ExpertiseMaxPoint) {
      swal({
        title: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.SubjectMathchWithMaxPointTitle'),
        html: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.SubjectMathchWithMaxPointText', { MAXPOINTOFTHETITLE: ExpertiseMaxPoint }),
        type: 'warning',
        allowEscapeKey: true,
        showCancelButton: false,
        confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
      });
    } else {
      this.GenerateSubjectForm(expertiseIndex, {
        minimumScoreForCertification: '',
        coefficient: 1,
        credits: 0,
        maxPoints: Number(ExpertiseMaxPoint - Number(sum)),
        countForTitleFinalScore: false,
        subjectName: '',
        id: '',
        subjectTest: []
      });
    }

  }

  GenerateSubjectForm(expertiseIndex, data) {
    const control = this.form;
    const subjectControl = this.form.controls[expertiseIndex]['controls']['subject'];
    console.log(subjectControl);
    const addrCtrl = this.fb.group({
      minimumScoreForCertification: [data ? data.minimumScoreForCertification : '', Validators.required],
      maxPoints: [data && data.maxPoints ? data.maxPoints : 0, Validators.required],
      coefficient: [data ? data.coefficient : 1],
      countForTitleFinalScore: [data ? data.countForTitleFinalScore : ''],
      credits: [data ? Math.abs(data.credits) : ''],
      subjectName: [data ? data.subjectName : '', Validators.required],
      id: [data ? data._id : ''],
      subjectTest: this.fb.array([])
    });
    subjectControl.push(addrCtrl);
    console.log(this.form.controls[expertiseIndex]['controls']['subject'])
    if (data.subjectTest.length) {
      data.subjectTest.forEach(element => {
        if (element.status !== 'deleted') {
          this.GenerateTestForm(expertiseIndex, this.subjectNumber, element);
        }
      });
    }

  }

  AddTest(expertiseIndex, subjectIndex) {
    const valueTests = this.form.value[expertiseIndex].subject[subjectIndex].subjectTest;
    let sum = 0.00;
    for (let j = 0; j < valueTests.length; j++) {
      sum = sum + Number(Number(valueTests[j].weight));
    }

    sum = Number(sum.toFixed(2));

    if (sum >= 100) {
      swal({
        title: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.WEIGHTSHOUDBEHUNDREDTitle'),
        html: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.WEIGHTSHOUDBEHUNDREDText'),
        type: 'warning',
        allowEscapeKey: true,
        showCancelButton: false,
        confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
      });
    } else {
      this.GenerateTestForm(expertiseIndex, subjectIndex, { 'weight': Number(100 - Number(sum)), 'type': '', 'evaluation': '', 'id': '' });
    }


    // this.dialogRefTest = this.dialog.open(AddTestDialogComponent, this.AddSubjectDialogConfig);
    // this.dialogRefTest.componentInstance.test = {};
    // this.dialogRefTest.componentInstance.selectedRNCP = this.selectedRNCP;
    // this.dialogRefTest.componentInstance.TestType = this.TestType;
    // this.dialogRefTest.afterClosed().subscribe(result => {
    //   this.dialogRefTest = null;
    //   console.log(result);
    //   if(result){
    //       console.log('Update Test Form');
    //       this.GenerateTestForm(expertiseIndex,subjectIndex,result)
    //   }
    // });
  }
  GenerateTestForm(expertiseIndex, subjectIndex, data) {
    const control = this.form;
    const subjectTestControl = this.form.controls[expertiseIndex]['controls']['subject'].controls[subjectIndex]['controls']['subjectTest'];
    const addrCtrl = this.fb.group({
      'weight': [data ? data.weight : ''],
      'type': [data ? data.type : '', Validators.required],
      'evaluation': [data ? data.evaluation : '', Validators.required],
      'id': [data ? data._id : ''],
      'parallelIntake': [data ? data.parallelIntake : false],
      'autoMark': [ data ? data.autoMark : '' ]
    });

    const autoMarkControl  = addrCtrl.get('autoMark');
    if (data.parallelIntake) {
      autoMarkControl.enable();
      autoMarkControl.setValidators([Validators.required, this.utilityService.minMaxValidation(0, 20)]);
    } else {
      autoMarkControl.clearValidators();
      autoMarkControl.disable();
    }

    subjectTestControl.push(addrCtrl);
    this.form.value[expertiseIndex].subject[subjectIndex].subjectTest.push(data);
  }

  checkMaxPointExpertise() {
    if (!this.expertiseMarkPointStatus) {
      return true;
    }
    const valueExpertise = this.form.value;
    const status = false;
    let sum = 0;
    if (valueExpertise.length) {
      for (let k = 0; k < valueExpertise.length; k++) {
        const valueSubject = this.form.value[k].subject;
        sum = sum + Number(this.form.value[k].maxPoints);
      }
    }

    if (sum !== Number(this.expertiseMaxPoints)) {
      swal({
        title: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.MaxPointValidatiionMessageTitle'),
        html: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.MaxPointValidatiionMessageText',
          { MAXPOINTOFTHETITLE: this.expertiseMaxPoints }),
        type: 'warning',
        showCancelButton: false,
        allowEscapeKey: true,
        confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
      });
      return false;
    }

    return true;
  }
  checkMaxPointSubject() {
    if (!this.expertiseMarkPointStatus) {
      return true;
    }

    const valueExpertise = this.form.value;
    const status = false;
    const sumArray = [];
    if (valueExpertise.length) {

      for (let k = 0; k < valueExpertise.length; k++) {
        const valueSubject = this.form.value[k].subject;

        if (valueSubject.length) {
          let sum = 0;
          for (let i = 0; i < valueSubject.length; i++) {
            if (valueSubject[i].maxPoints) {
              sum = sum + Number(valueSubject[i].maxPoints);
            }
          }
          sumArray.push({ data: valueExpertise[k], sum: sum, MAXPOINTOFTHETITLE: valueExpertise[k].maxPoints });
        }

      }
    }
    for (let i = 0; i < sumArray.length; i++) {
      console.log(sumArray[i].sum + '!=' + sumArray[i].MAXPOINTOFTHETITLE);
      if (sumArray[i].sum !== sumArray[i].MAXPOINTOFTHETITLE) {
        swal({
          title: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.MaxPointSubjectValidatiionMessageTitle'),
          html: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.MaxPointSubjectValidatiionMessageText',
            { MAXPOINTOFTHETITLE: sumArray[i].MAXPOINTOFTHETITLE }),
          type: 'warning',
          allowEscapeKey: true,
          showCancelButton: false,
          confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
        });
        return false;
      }
    }
    return true;


  }

  checkEvaluationEnterprise() {
    const valueExpertise = this.form.value;
    const status = false;
    let count = 0;
    if (valueExpertise.length) {
      for (let k = 0; k < valueExpertise.length; k++) {
        const valueSubject = this.form.value[k].subject;
        if (valueSubject.length) {
          for (let i = 0; i < valueSubject.length; i++) {
            if (valueSubject[i].subjectTest.length) {
              let sum = 0;
              for (let j = 0; j < valueSubject[i].subjectTest.length; j++) {
                if (valueSubject[i].subjectTest[j].type === "mentor-evaluation") {
                  count = count + 1;
                }
              }
            }
          }
        }
      }
    }

    if (count <= 1) {
      return true;
    } else {
      swal({
        title: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.EvaluationEnterpriseMaxOneTitle'),
        html: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.EvaluationEnterpriseMaxOneText'),
        type: 'warning',
        allowEscapeKey: true,
        showCancelButton: false,
        confirmButtonText: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.EvaluationEnterpriseMaxOnebtn')
      });
      return false;
    }
  }

  checkWeightPercentage() {
    const valueExpertise = this.form.value;
    const status = false;
    const sumArray = [];
    if (valueExpertise.length) {
      for (let k = 0; k < valueExpertise.length; k++) {
        const valueSubject = this.form.value[k].subject;
        if (valueSubject.length) {
          for (let i = 0; i < valueSubject.length; i++) {
            if (valueSubject[i].subjectTest.length) {
              let sum = 0;
              for (let j = 0; j < valueSubject[i].subjectTest.length; j++) {
                sum = sum + Number(valueSubject[i].subjectTest[j].weight);
              }
              sumArray.push({ data: valueSubject[i], sum: sum });
            }
          }
        }
      }
    }
    console.log(sumArray);
    for (let i = 0; i < sumArray.length; i++) {
      console.log(99 > sumArray[i].sum);
      console.log(100 < sumArray[i].sum);
      console.log(99 > sumArray[i].sum || 100 < sumArray[i].sum);
      // if(sumArray[i].sum > 99 &&  sumArray[i].sum <= 100){
      if (99 > sumArray[i].sum || 100 < sumArray[i].sum) {

        swal({
          title: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.WEIGHTSHOUDBEHUNDREDONSAVETitle'),
          html: this.translate.instant('PARAMETERS-RNCP.EXPERTISE.WEIGHTSHOUDBEHUNDREDONSAVEText'),
          type: 'warning',
          allowEscapeKey: true,
          showCancelButton: false,
          confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
        });
        return false;
      }
    }
    return true;
  }

  checkTestTypeRequired() {
    const valueExpertise = this.form.value;
    const status = false;
    const sweetAlertNLoopEnd = () => {
      swal({
        title: 'Warning',
        html: this.translate.instant('TESTCORRECTIONS.MESSAGE.REQUIREDFIELDMESSAGE'),
        type: 'warning',
        allowEscapeKey: true,
        showCancelButton: false,
        confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
      });
    };

    if (valueExpertise.length) {
      for (let k = 0; k < valueExpertise.length; k++) {
        const valueSubject = this.form.value[k].subject;
        const subjectControl = this.form.get(k + '.subject');
        if (valueSubject.length) {
          for (let i = 0; i < valueSubject.length; i++) {
            if (valueSubject[i].subjectTest.length) {
              for (let j = 0; j < valueSubject[i].subjectTest.length; j++) {
                if (!valueSubject[i].subjectName ||
                  !valueSubject[i].hasOwnProperty('minimumScoreForCertification') ||
                  !valueSubject[i].subjectTest[j].type ||
                  subjectControl.get(`${i}.subjectTest.${j}.autoMark`).invalid) {
                  sweetAlertNLoopEnd();
                  return false;
                }
              }
            }
          }
        }
      }
    }
    return true;
  }

  removeExpertise(index) {
    const data = this.expertiseList[index];
    console.log(index);
    console.log(this.expertiseList);
    const self = this;
    const thisexpertiseList = this.expertiseList;
    swal({
      title: self.translate.instant('PARAMETERS-RNCP.EXPERTISE.deletedExpertiseWarningTitle'),
      html: self.translate.instant('PARAMETERS-RNCP.EXPERTISE.deletedExpertiseWarningMessage'),
      type: 'warning',
      allowEscapeKey: true,
      showCancelButton: true,
      confirmButtonText: self.translate.instant('YES'),
      cancelButtonText: self.translate.instant('NO')
    }).then(function () {
      self.form.controls.splice(index, 1);
      self.form.value.splice(index, 1);


      if (data._id) {
        self.expertiseService.removeExpertise(data._id).map((data) => {        //
          // swal('Deleted!', self.translate.instant('PARAMETERS-RNCP.EXPERTISE.deletedExpertiseSuccess'), 'success');
          // console.log('Need to update Expertie');
          self.getExpertise(false);
          swal({
            title: self.translate.instant('PARAMETERS-RNCP.EXPERTISE.deletedExpertiseSuccessTitle'),
            html: self.translate.instant('PARAMETERS-RNCP.EXPERTISE.deletedExpertiseSuccess'),
            type: 'success',
            allowEscapeKey: true,
            showCancelButton: false,
            confirmButtonText: self.translate.instant('SETTINGS.USERTYPES.S1.Ok')
          });
          return data;
        }).subscribe();
      }

    }, function (dismiss) {
      if (dismiss === 'cancel') {

      }
    });
  }
  /*Remove Subject */
  removeSubject(expertiseIndex, subjectIndex) {
    const data = this.form.value[expertiseIndex].subject[subjectIndex];
    const self = this;
    swal({
      title: self.translate.instant('PARAMETERS-RNCP.TEST.deletedSubjectWarningTitle'),
      html: self.translate.instant('PARAMETERS-RNCP.TEST.deletedSubjectWarningMessage'),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: self.translate.instant('YES'),
      cancelButtonText: self.translate.instant('NO')
    }).then(function () {


      //swal('Deleted!', self.translate.instant('PARAMETERS-RNCP.TEST.deletedSubjectSuccess'), 'success');
      if (data && data.id) {
        self.subjectService.removeSubject(data.id, self.form.value[expertiseIndex]['id']).map((res) => {
          if (res.code == 400) {
            swal({
              title: 'Warning!',
              text: res.message,
              allowEscapeKey: true,
              type: 'warning'
            });
          } else {
            self.form.controls[expertiseIndex]['controls']['subject']['controls'].splice(subjectIndex, 1);
            self.form.value[expertiseIndex]['subject'].splice(subjectIndex, 1);
            swal({
              title: 'Deleted!',
              text: self.translate.instant('PARAMETERS-RNCP.TEST.deletedSubjectSuccess'),
              allowEscapeKey: true,
              type: 'success'
            });
          }
          console.log('Need to update subject');
          return res;
        }).subscribe();
      } else {
        self.form.controls[expertiseIndex]['controls']['subject']['controls'].splice(subjectIndex, 1);
        self.form.value[expertiseIndex]['subject'].splice(subjectIndex, 1);
        swal({
          title: 'Deleted!',
          text: self.translate.instant('PARAMETERS-RNCP.TEST.deletedSubjectSuccess'),
          allowEscapeKey: true,
          type: 'success'
        });
      }
    }, function (dismiss) {
      if (dismiss === 'cancel') {

      }
    });
  }
  removeTask(expertiseIndex, subjectIndex, testIndex) {
    const data = this.form.value[expertiseIndex].subject[subjectIndex].subjectTest[testIndex];
    const self = this;
    swal({
      title: self.translate.instant('PARAMETERS-RNCP.TEST.deletedTestWarningTitle'),
      html: self.translate.instant('PARAMETERS-RNCP.TEST.deletedTestWarningMessage'),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: self.translate.instant('YES'),
      cancelButtonText: self.translate.instant('NO')
    }).then(function () {

      //swal('Deleted!', self.translate.instant('PARAMETERS-RNCP.TEST.deletedTestSuccess'), 'success');
      if (data && data.id) {
        self.subjectService.removeTest(data.id, self.form.value[expertiseIndex].subject[subjectIndex]['id']).map((res) => {

          if (res.code == 400) {
            swal({
              title: 'Warning!',
              text: res.message,
              allowEscapeKey: true,
              type: 'warning'
            });
          } else {
            self.form.controls[expertiseIndex]['controls']['subject']['controls'][subjectIndex]['controls']['subjectTest']['controls'].splice(testIndex, 1);
            self.form.value[expertiseIndex]['subject'][subjectIndex]['subjectTest'].splice(testIndex, 1);
            swal({
              title: 'Deleted!',
              text: self.translate.instant('PARAMETERS-RNCP.TEST.deletedTestSuccess'),
              allowEscapeKey: true,
              type: 'success'
            });
            console.log('Need to update test');
          }
          return res;
        }).subscribe();
      } else {
        self.form.controls[expertiseIndex]['controls']['subject']['controls'][subjectIndex]['controls']['subjectTest']['controls'].splice(testIndex, 1);
        self.form.value[expertiseIndex]['subject'][subjectIndex]['subjectTest'].splice(testIndex, 1);
        swal({
          title: 'Deleted!',
          text: self.translate.instant('PARAMETERS-RNCP.TEST.deletedTestSuccess'),
          allowEscapeKey: true,
          type: 'success'
        });
      }
    }, function (dismiss) {
      if (dismiss === 'cancel') { }
    });
  }


  /*Form Submit */
  save(value) {

    if (this.checkTestTypeRequired() && this.checkMaxPointExpertise() && this.checkMaxPointSubject() && this.checkWeightPercentage() && this.checkEvaluationEnterprise()) {
      const self = this;
      let succesMessage = 0;
      const totalSubject = value.length;

      if (value && value.length > 0) {
        value.forEach(expertise => {
          expertise['classId'] = this.selectedClass._id;
        });
      }

      /*Update RNCP Title-start */
      const data = {
        expertiseMarkPointStatus: this.expertiseMarkPointStatus,
        expertiseMaxPoints: this.expertiseMaxPoints
      };

      const id = this.selectedRNCP;
      // delete data._id;
      console.log(data);
      console.log(id);
      this.loading = true;
      this.titleService.updateConditions(id, data).subscribe(status => {
        console.log('RNCPTITL UPDATE : ', status);
        if (status) {
          if (value.length === 0) {
            self.getExpertise(false);
            self.loading = false;
            swal({
              title: self.translate.instant('PARAMETERS-RNCP.EXPERTISE.updateExpertiseSuccessTitle'),
              html: self.translate.instant('PARAMETERS-RNCP.EXPERTISE.updateExpertiseSuccessText', { 'name': this.selectedRNCPDetails.shortName }),
              type: 'success',
              showCancelButton: false,
              allowEscapeKey: true,
              confirmButtonText: self.translate.instant('SETTINGS.USERTYPES.S1.Ok')
            });
          }

          return data;
        }
      }, (error) => { });
      /*Update RNCP Title-end */


      let MultipleExpertise = [];
      for (let i = 0; i < value.length; i++) {
        const dataPost = value[i];
        dataPost.rncpTitle = this.selectedRNCP;
        if (dataPost.countForTitleFinalScore == null) {
          dataPost.countForTitleFinalScore = false;
        }
        dataPost.order = i + 1;

        const valueSubject = dataPost.subject;
        if (valueSubject.length) {
          for (let j = 0; j < valueSubject.length; j++) {
            dataPost.subject[j].order = j + 1;
            if (valueSubject[j].subjectTest.length) {
              for (let k = 0; k < valueSubject[j].subjectTest.length; k++) {
                dataPost.subject[j].subjectTest[k].order = k + 1;
              }

            }
          }
        }
        if (dataPost.id == null || this.expertiseList[i]._id == null) {
          delete dataPost['_id'];
        }
        MultipleExpertise.push(dataPost);
        console.log(MultipleExpertise);
      }

      this.expertiseService.updateMultipleExpertise({ data: MultipleExpertise }).subscribe(value => {
        if (value['data']) {
          self.getExpertise(false);
          self.loading = false;
          swal({
            title: self.translate.instant('PARAMETERS-RNCP.EXPERTISE.updateExpertiseSuccessTitle'),
            html: self.translate.instant('PARAMETERS-RNCP.EXPERTISE.updateExpertiseSuccessText', { 'name': this.selectedRNCPDetails.shortName }),
            type: 'success',
            allowEscapeKey: true,
            showCancelButton: false,
            confirmButtonText: self.translate.instant('SETTINGS.USERTYPES.S1.Ok')
          });
          this.generateExpertisePDFForOrganizationFolder();
        }
      });
    } else {
      this.formSubmitBtton.nativeElement.click();
      // this.form.markAsDirty({onlySelf: false});
      // this.form.markAsTouched({onlySelf: false});
    }
  }

  downloadPDF() {
    const html = this.prepareHTMLForPDF().html;
    const filename = this.prepareHTMLForPDF().fileName;
    this.pdfService.getPDF(html, filename, false).subscribe(res => {
      if (res.status === 'OK') {
        const element = document.createElement('a');
        element.href = Print.url + res.filePath;
        element.target = '_blank';
        element.setAttribute('download', res.filename);
        element.click();
      }
    });
  }

  removeSlash(event, expertiseIndex, subjectIndex, testIndex) {
    console.log(event.target.value.replace(/\//g, ""));
    this.form.controls[expertiseIndex]['controls']['subject']['controls'][subjectIndex]['controls']['subjectTest']['controls'][testIndex]['controls']['evaluation'].setValue(event.target.value.replace(/\//g, ""));
    this.form.value[expertiseIndex]['subject'][subjectIndex]['subjectTest'][testIndex]['evaluation'] = event.target.value.replace(/\//g, "");
  }
  getScholarSeason() {
    this.scholarSearvice.getScholarSeasonByRcnp(this.selectedRNCP)
      .subscribe( res => {
        this.scholarSeason = res && res.data[0] && res.data[0].scholarseason ? res.data[0].scholarseason : '';
      });
  }
  makeValueAbsolute(val) {
    return Math.abs(val);
  }

  addSubject(value) { }

  onchangeTest(expertiseIndex, subjectIndex, testIndex) {
    const sliderControl = this.form.get(`${expertiseIndex}.subject.${subjectIndex}.subjectTest.${testIndex}.parallelIntake`);
    const autoMarkControl = this.form.get(`${expertiseIndex}.subject.${subjectIndex}.subjectTest.${testIndex}.autoMark`);

    if (sliderControl.value) {
      autoMarkControl.enable();
      autoMarkControl.setValidators([Validators.required, this.utilityService.minMaxValidation(0, 20)]);
    } else {
      autoMarkControl.clearValidators();
      autoMarkControl.setValue(null);
      autoMarkControl.disable();
    }
  }

  duplicateConditionDialog () {
    this.dialogRefDuplicateCondition = this.dialog.open(DuplicateConditionDialogComponent, this.DuplicateConditionDialogConfig);
    this.dialogRefDuplicateCondition.componentInstance.rncpList = [...this.rncpTitles];
    this.dialogRefDuplicateCondition.componentInstance.cloneToClass = this.selectedClass._id;
    this.dialogRefDuplicateCondition.componentInstance.cloneToClassName = this.selectedClass.name;
    this.dialogRefDuplicateCondition.afterClosed().subscribe(data => {
      if (data) {
        this.expertiseList = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].status !== 'deleted') {
            this.expertiseList.push(data[i]);
            this.GenerateExpertiseForm(data[i]);
            this.blockOfExpertisePlaceholder[this.blockOfExpertisePlaceholder.length] = 'PARAMETERS-RNCP.EXPERTISE.NAME.title';
          }
        }
      }
    });
  }

  prepareHTMLForPDF() {
    const target = this.documentPagesRef.nativeElement.children;
    const outer = document.createElement('div');
    outer.innerHTML = '';
    let html = PRINTSTYLES;
    html += `<div class="ql-editor document-parent"><div>`;
    for (const element of target) {
      const wrap = document.createElement('div');
      const el = element.cloneNode(true);
      el.style.display = 'block';
      wrap.appendChild(el);
      html += wrap.innerHTML;
    }
    html += `</div></div>`;

    // console.log(html);
    // const filename =  this.translate.instant('PARAMETERS-RNCP.PDF.filename', {Titlename:this.selectedRNCPDetails.shortName, Date:this.datepipe.transform(this.selectedRNCPDetails.updatedAt, 'ddMMyyyy') }) ;
    const filename = this.selectedRNCPDetails.shortName + '- CONDITIONS - ' + this.datepipe.transform(this.selectedRNCPDetails.updatedAt, 'ddMMyyyy');

    return {'html': html, 'fileName': filename};

  }

  generateExpertisePDFForOrganizationFolder() {
    this.configService.getConfigDetails().subscribe(data => {
      if (data && data.generateExpertisePDFForOrganizationFolder) {
        const pdfData = this.prepareHTMLForPDF();
        const body = {
          lang: this.translate.currentLang,
          html: pdfData.html,
          fileName: pdfData.fileName
        }
        this.expertiseService.generateExpertisePDFForOrganizationFolder(this.selectedRNCPDetails._id, body).subscribe(data => console.log(data));
      }
    });
  }

}
