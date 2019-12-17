import { Component, Input, OnInit, ViewChild, ElementRef, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import _ from 'lodash';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import { TestCorrection } from '../../../models/correction.model';
import { TestCorrectionService } from '../../../services/test-correction.service';
import { UserService } from '../../../services/users.service';
import { FormConfirmationComponent } from '../../../dialogs/form-confimation-dialog/form-confimation-dialog.component';
import { MdDialogConfig, MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { TestService } from '../../../services/test.service';
import { TestDetailsDialogComponent } from '../../../dialogs/test-details-dialog/test-details-dialog.component';
declare var swal: any;
import { FileUploader } from 'ng2-file-upload';
import { FileUpload, Print } from '../../../shared/global-urls';
import { AcademicKitService } from '../../../services/academic-kit.service';
import { Subscription } from 'rxjs/Subscription';
import { UtilityService } from '../../../services/utility.service';
import { DatePipe } from '@angular/common';
import { MentorEvaluationService } from 'app/services/mentor-evaluation.service';
import { StudentsService } from 'app/services/students.service';
import { evalPDFModal } from './evaluation-pdf.modal';
import { PDFService } from '../../../services';
@Component({
  selector: 'evaluation-grid',
  templateUrl: './evaluation-grid.component.html',
  styleUrls: ['./evaluation-grid.component.scss']
})


export class EvaluationGridComponent implements OnInit {
  @Input() mentorEvalID;
  @Output() emitStatustoDetails: EventEmitter<string> = new EventEmitter();
  correction;
  page = new Page();
  sort = new Sort();
  students: any[] = [];
  groups: any[] = [];
  searchedStudents: any[] = [];
  searchedGroup: any[] = [];
  selectedIndex: number;
  StudentList;
  filterStudentList;
  SearchStudent;
  SearchGroup;
  positionStack = [];
  currentLoginUser: any = '';
  selectedRncpTitle: any;
  formConfirmValue: string = '';
  oldStudentValue: string = '';
  oldStudentName: string = '';
  isMissingCopy: boolean = false
  configDoc: MdDialogConfig = {disableClose: true,width: '600px',height: '80%',position: {top: '',bottom: '',left: '',right: ''}};
  configExpectedDoc: MdDialogConfig = {disableClose: true,width: '600px',height: 'auto',position: {top: '',bottom: '',left: '',right: ''}};
  formConfigmDoc: MdDialogConfig = {disableClose: true,width: '500px',height: '',position: {top: '',bottom: '',left: '',right: ''}};
  selectedStudentArray = [];
  selectedGroupArray = [];
  selectedGroup : any;
  public testCorrection = new TestCorrection();
  reorderable = true;
  ngxDtCssClasses = {sortAscending: 'fa fa-caret-up',sortDescending: 'fa fa-caret-down',pagerLeftArrow: 'icon-left',pagerRightArrow: 'icon-right',pagerPrevious: 'icon-prev',pagerNext: 'icon-skip'};
  testDetails;
  public form: FormGroup;
  listServiceFeature = [];
  listJury = [];
  private totalMarks = [];
  testCorrect;
  private today;
  private currentSchoolYear;
  rncpTitle;
  testDetailsDialog: MdDialogRef<TestDetailsDialogComponent>;
  formConfirmationComponent: MdDialogRef<FormConfirmationComponent>;
  selectedStudent = null;
  selectedTestId = null;
  updatingCorrection = false;
  studentSelect: any;
  groupSelect:any;
  uploader: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });
  evalPdf = new evalPDFModal();
  @ViewChild('userphoto') uploadInput: any;
  // addExpectedDocumentDialog: MdDialogRef<AddExpectedDocumentDialogComponent>;
  // absenceJustifiedDialog: MdDialogRef<AbsenceJustifiedDialogComponent>;
  document;
  student;
  selectedStudentDetails;
  selectedGroupDetails;
  taskId;
  studentId;
  user;
  datePipe;

  mainDataObj = {
    corrections: [],
    questionnaireTemplate: {
      competence: [{
        segment: [{
          question: [{
            questionName: '',
            answerType: '',
            answer: '',
            options: [''],
            sortOrder: 1,
            _id: ''
          }],
          segmentName: '',
          sortOrder: 1,
          _id: ''
        }],
        competenceName: '',
        sortOrder: '',
        _id: ''
      }],
    },
    test: {
      parentRNCPTitle: {
        _id: ''
      },
      _id: ''
    },
    mentorEvaluationStatus: '',
    signatureOfTheCompanyMentor:false,
    signatureOfTheAcadDept:false,
    testCorrectionId :{}
  };
  currentUser;
  currentLoginUserType;
  currentUserEntityType;
  public isReadOnly = true;
  public isADMTCAfterValidation = false;
  schoolId: string = '';
  showExpidteMentEvalButton: boolean = false;
  showActionButtonCard: boolean = true;
  @ViewChild('TopLeftHeader') elementView: ElementRef;

  private subscription: Subscription;
  constructor(private testCorrectionService: TestCorrectionService,
    private testService: TestService,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private routes: Router,
    private dialog: MdDialog,
    private translate: TranslateService,
    private service: UserService,
    private acadService: AcademicKitService,
    public utilityService: UtilityService,
    private mentorEvalService: MentorEvaluationService,
    private studentsService: StudentsService,
    private pdfService:PDFService) {
    let student;
    const test = {};
    this.router.params.subscribe(params => {
      student = params['id'];
    });

    test['student'] = [null, Validators.required];
    this.form = this.fb.group(test);
    this.testCorrect = new TestCorrection();


  }

  filteredStudents: Observable<any[]>;
  filteredGroup: any[] = [];
  filter(val: any): any[] {
    const students = this.students.filter(std => {
      //return std.correctedTests && !std.correctedTests[0].correction.missingCopy ? false : true;
      return true;
    });
    return val.length >= 3 ? students.filter(option =>
      (option.lastName + ' ' + option.firstName).toLocaleLowerCase().includes(val.trim().toLowerCase())) : students;
  }


  ngOnInit() {
    this.currentLoginUser = this.service.getCurrentUserInfo();
    this.currentUser = JSON.parse(localStorage.getItem('loginuser'));
    this.currentLoginUserType = this.currentUser && this.currentUser.types && this.currentUser.types[0] ? this.currentUser.types[0].name : '';
    this.currentUserEntityType = this.currentUser && this.currentUser.entity && this.currentUser.entity.type ? this.currentUser.entity.type : '';

    let self = this;
    this.subscription = this.router.queryParams.subscribe(qParams => {
      self.subscription = self.router.params.subscribe(params => {
         if (params['evalId']) {
          self.mentorEvalID = params['id'];
          self.getQuestionnaireById(params['id']);
         }

       });
     });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.isReadOnly = true;
    this.isADMTCAfterValidation = false;
    this.showExpidteMentEvalButton = false;
    this.showActionButtonCard = true;
    if (typeof this.mentorEvalID.mentorEvaluationId !== 'undefined' && this.mentorEvalID.mentorEvaluationId) {
      if (typeof this.mentorEvalID.mentorEvaluationId._id !== 'undefined' && this.mentorEvalID.mentorEvaluationId._id !== '') {
        this.getQuestionnaireById(this.mentorEvalID.mentorEvaluationId._id);
      } else {
        this.getQuestionnaireById(this.mentorEvalID.mentorEvaluationId);
      }
    }else{
      this.getQuestionnaireById(this.mentorEvalID);
    }
  }

  getQuestionnaireById(id) {
    let self = this;
    this.mentorEvalService.getMentorEvaluationbyResponse(id).subscribe(res => {
      console.log(res.data);
      self.mainDataObj = res.data;

      if ( self.mainDataObj.mentorEvaluationStatus == 'sentToMentor' &&
          (self.utilityService.checkUserIsMentor() ||
          self.utilityService.checkUserIsAcademicDirector() ||
          self.utilityService.checkUserIsDirectorSalesAdmin())) {
        self.isReadOnly = false;
        if ( self.utilityService.checkUserIsAcademicDirector() ) {
          this.showExpidteMentEvalButton = true;
        }
      }

      if (self.mainDataObj.mentorEvaluationStatus === 'expeditedByAcadStaff' ||
          self.mainDataObj.mentorEvaluationStatus === 'validatedByAcadStaff' )  {
          if (self.utilityService.checkUserIsDirectorSalesAdmin()) {
            this.isReadOnly = false;
            this.isADMTCAfterValidation = true;
            this.showActionButtonCard = true;
          } else {
            this.showActionButtonCard = false;
          }
      }


      const response = res.data;
      self.selectedRncpTitle = response.test.parentRNCPTitle;
      self.selectedTestId = response.test._id;
      self.studentId = response.student._id;
      self.selectedStudent = response.student._id;
      self.InitTestCorrectionData();
    });
  }


  InitTestCorrectionData(){
    let self = this;
    this.testCorrectionService.resetCorrectionData();
    console.log('this.studentId');
    console.log(this.studentId)



    this.testCorrectionService.getTest(this.selectedTestId).subscribe((value) => {
        this.testDetails = value;

        console.log('this.testDetails');
        console.log(this.testDetails);

        this.rncpTitle = this.selectedRncpTitle.longName;
        //this.loadStudentBasedOnUser();

        this.studentsService.getStudentDetails(self.selectedStudent).subscribe(res =>{
          console.log('StudentDetail',res.data);
          this.selectedStudentDetails = res.data.result[0];
          this.studentSelect = res.data.result[0].lastName + ' ' + res.data.result[0].firstName;
          this.selectedStudentArray = [res.data.result];

           //LOAD CORRECTION IF ALREADY SAVED
          if(this.mainDataObj && this.mainDataObj.testCorrectionId && this.mainDataObj.testCorrectionId['_id']){
            this.loadStudentCorrections(this.mainDataObj.testCorrectionId, self.selectedStudent);
          }else{
            this.loadStudentCorrections(null, self.selectedStudent);
          }

        });
      });


    /*Upload Student Photo*/
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.uploader.queue[0].upload();
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      swal({
        title: 'Attention',
        html: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey:true,
        type: 'warning'
      });
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      let res = JSON.parse(response);
      let documentData = {
        'parentRNCPTitle': this.student.rncpTitle,
        'name': this.selectedRncpTitle.shortName + '-'+ this.document.documentName+ '-' +this.testDetails.name +'-' +this.student.firstName + this.student.lastName + '-'+this.document.documentName,
        'type': item.file.type,
        'filePath': res.data.filepath,
        'fileName': item.file.name,
        'publicationDate': {
          'type': 'fixed',
          'publicationDate': new Date()
        },
        'testCorrection': this.student.correctedTests[0].correction._id
      };

      if (res.status === 'OK') {
        this.acadService.addStudentDocument(documentData).subscribe(d => {
          if (d) {
             this.document.isUploaded = true;
             this.document.document = d._id;

             this.updateTestCorrection(this.student.correctedTests[0].correction);
             swal({
              title: this.translate.instant('STUDENT.expectedDocUploadSuccess.Title'),
              html: this.translate.instant('STUDENT.expectedDocUploadSuccess.Text',{TestDocName:this.document.documentName,StudentCivility:this.utilityService.computeCivility(this.student.civility,this.translate.currentLang),StudentFirstName:this.student.firstName,StudentLastName:this.student.lastName}),
              allowEscapeKey:true,
              type:'success'
             });
          }else{
            swal({
              title: 'Attention',
              html: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
              allowEscapeKey:true,
              type: 'warning'
            });
          }
        });

      } else {
        swal({
          title: 'Attention',
          html: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
          allowEscapeKey:true,
          type: 'warning'
        });
      }
    };
  }

  loadStudentBasedOnUser(){
    if (this.testDetails.class !== undefined && this.testDetails.class != null) {


        console.log('UserTYpe');
        if (this.currentLoginUser !== undefined && this.currentLoginUser) {
            if (this.currentLoginUser.types && this.currentLoginUser.types[0] && this.currentLoginUser.types[0].name.toUpperCase() === 'CORRECTOR') {
              // Student List For User Type COrrector
              if(this.testDetails && this.testDetails.correctorAssigned.length){
                let NewStudent = [];
                for (var index = 0; index < this.testDetails.correctorAssigned.length; index++) {
                  var element = this.testDetails.correctorAssigned[index];
                  if(this.currentLoginUser._id === element.correctorId){
                    for (var i = 0; i < element.students.length; i++) {
                      var student = element.students[i];
                      let mathchedarray = [];
                      for (var j = 0; j < student.correctedTests.length; j++) {
                        var correctedTests = student.correctedTests[j];
                        if(correctedTests.test == this.testDetails._id){
                          mathchedarray.push(correctedTests);
                          student.correctedTests = [];
                          break;
                        }
                      }
                      student.correctedTests = mathchedarray;
                      NewStudent.push(student);
                    }
                  }
                }
                this.students = NewStudent;
                this.searchedStudents = NewStudent;
                if(this.students.length){
                  this.filteredStudents = Observable.create(observer => {
                    observer.next(this.students.filter(std => {
                      return std.correctedTests ? false : true;
                    }));
                  });
                  /*Goto Uncorrected student */
                  let isUncorrected = null;
                  for (var index = 0; index < this.students.length; index++) {
                    var element = this.students[index];
                    if (element.correctedTests == null) {
                      isUncorrected = element;
                      break;
                    }
                  }
                  if(isUncorrected){
                    this.selectedStudent = isUncorrected._id;
                    this.selectedStudentArray = [isUncorrected];
                    this.ChangeStudent({ value: this.selectedStudent });
                  }else{
                    this.selectedStudent = this.students[0]._id;
                    this.selectedStudentArray = [this.students[0]];
                    this.ChangeStudent({ value: this.selectedStudent });
                  }
                }
              }

            }else{
              /// Comment all test related student fill the coorection.
              this.testCorrectionService.getStudentForTestCorrection(this.selectedTestId, this.schoolId).subscribe((data) => {
                  if (data) {
                    this.students = data;
                    this.searchedStudents = data;

                    this.filteredStudents = Observable.create(observer => {
                      observer.next(this.students.filter(std => {
                        return std.correctedTests ? false : true;
                      }));
                    });

                    /*Goto Uncorrected student */
                    let isUncorrected = null;
                    for (var index = 0; index < this.students.length; index++) {
                      var element = this.students[index];
                      if (element.correctedTests == null) {
                        isUncorrected = element;
                        break;
                      }
                    }

                    if(isUncorrected){
                      this.selectedStudent = isUncorrected._id;
                      this.selectedStudentArray = [isUncorrected];
                      this.ChangeStudent({ value: this.selectedStudent });
                    }else{
                      this.selectedStudent = this.students[0]._id;
                      this.selectedStudentArray = [this.students[0]];
                      this.ChangeStudent({ value: this.selectedStudent });
                    }
                  }
              });
            }
        }
    }
  }

  loadStudentCorrections(correction: any, studentId) {

    console.log('correction');
    console.log(correction);
    console.log(studentId);
    let self = this;


    self.listJury = [];

    if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL' ) && self.testDetails.juryMax){
      for (var index = 0; index < self.testDetails.juryMax; index++) {
        self.listJury.push([]);
      }
     this.testCorrect.correctionGrid.correction.totalJuryAvgRating = '';
    }
    if(self.testDetails.type == 'free-continuous-control'){
     this.testCorrect.correctionGrid.correction.total = '';
    }

    if (correction != null) {
      this.updatingCorrection = true;

      this.today = new Date();
      const nextYear = Number(new Date().getFullYear()) + 1;
      this.currentSchoolYear = new Date().getFullYear() + '-' + nextYear;
      const test = {};
      const header = [];
      const footer = [];
      const sections = [];
      const testCorrect = correction;
      let rncpTitle;
      rncpTitle = this.rncpTitle;


      if(correction.correctionGrid.header.fields.length){
        _.forEach(correction.correctionGrid.header.fields, function (val, key) {
          test['header' + key] = [val && val.value ? val.value : ''];
        });
      }else{
        const headerInfo = this.testCorrectionService.getHeader();
        _.forEach(this.testDetails.correctionGrid.header.fields, function (val, key) {
          const obj = {
            'type': val.type,
            'label': val.value,
            'value': headerInfo ? headerInfo.header.fields[key].value : null,
            'dataType': val.dataType,
            'align': val.align
          };
          switch (val.type) {
            case 'dateRange':
              obj.value = new Date();
              testCorrect.correctionGrid.header.fields.push(obj);
              break;
            case 'dateFixed':
              obj.value = new Date();
              testCorrect.correctionGrid.header.fields.push(obj);
              break;
            case 'currentSchoolYear':
              obj.value = new Date().getFullYear() + '-' + nextYear;
              testCorrect.correctionGrid.header.fields.push(obj);
              break;
            case 'titleName':
              obj.value = rncpTitle;
              testCorrect.correctionGrid.header.fields.push({
                'type': val.type,
                'label': val.value,
                'value': rncpTitle,
                'dataType': val.dataType,
                'align': val.align
              });
              break;
            case 'status':
              testCorrect.correctionGrid.header.fields.push(obj);
              break;
            default:
              testCorrect.correctionGrid.header.fields.push(obj);
          }
          test['header' + key] = [headerInfo ? headerInfo.header.fields[key].value : null];

        });
      }




      // footer
      if(correction.correctionGrid.footer.fields.length){
        _.forEach(correction.correctionGrid.footer.fields, function (val, key) {
          // test['footer' + key] = [val.value, Validators.required];
          test['footer' + key] = [val && val.value ? val.value : ''];
        });
      }else{
        const footerInfo = this.testCorrectionService.getFooter();
        _.forEach(this.testDetails.correctionGrid.footer.fields, function (val, key) {
          test['footer' + key] = [footerInfo && footerInfo.footer.fields[key] ? footerInfo.footer.fields[key].value : null, Validators.required];
          testCorrect.correctionGrid.footer.fields.push({
            'type': val.type,
            'label': val.value,
            'value': footerInfo && footerInfo.footer.fields[key] ? footerInfo.footer.fields[key].value : null,
            'dataType': val.dataType,
            'align': val.align
          });
        });
      }


      // total
      _.forEach(correction.correctionGrid.correction.sections, (val, key) => {
        test['total' + key] = [val && val.rating ? val.rating : 0, Validators.required];
        test['comment' + key] = [val && val.comments ? val.comments: ''];
        _.forEach(val.subSections, (v, k) => {
          test['subSection-' + key + '-' + k] = [v && v.rating ? v.rating: 0, Validators.required];
          this.listServiceFeature[key + '_' + k] = v.rating;
        });
      });

      // Comment, directions, marksnumber, marksletters
      _.forEach(correction.correctionGrid.correction.sections, function (val, key) {
        _.forEach(val.subSections, function (v, k) {
          test['comment-' + key + '-' + k] = [v && v.comments ? v.comments: '' ];
          test['directions-' + key + '-' + k] = [v && v.directions ? v.directions: ''];
          test['marksnumber-' + key + '-' + k] = [v && v.marksnumber ? v.marksnumber: '' ];
          test['marksletters-' + key + '-' + k] = [v && v.marksletters ? v.marksletters: ''];

          if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
            if( v && v.jury.length ){
              for (var index = 0; index < v.jury.length; index++) {
                test['jury-' + key + '-'+k+'-' +index+'-name'] = [v.jury ? v.jury[index].name : null];
                test['jury-' + key + '-'+k+'-' +index+'-marks'] = [v.jury ? Number(v.jury[index].marks) : null];
                self.listJury[index].push({name:v.jury ? v.jury[index].name : null,marks:v.jury ? Number(v.jury[index].marks) : null})
              }
            }else{
              for (var index = 0; index < self.testDetails.juryMax; index++) {
                test['jury-' + key + '-'+k+'-' +index+'-name'] = [null];
                test['jury-' + key + '-' + k +'-' +index+'-marks'] = [null];
                self.listJury[index].push({name:'',marks:''})
              }
            }
          }
        });
      });


       // penalties
       _.forEach(correction.correctionGrid.correction.penalty, function (val, key) {
        test['penalties-' + key] = [val && val.rating ? val.rating : '',Validators.required];
       });
       // bonuses
       _.forEach(correction.correctionGrid.correction.bonus, function (val, key) {
        test['bonuses-' + key] = [val && val.rating ? val.rating: '',Validators.required ];
      });

      if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
        test['ttlJuryAvgRating'] = [testCorrect && testCorrect.correctionGrid.correction.totalJuryAvgRating ? testCorrect.correctionGrid.correction.totalJuryAvgRating : 0];
      }
      if(self.testDetails.type == 'free-continuous-control'){
        test['finalTtl'] = [testCorrect && testCorrect.correctionGrid.correction.total ? testCorrect.correctionGrid.correction.total : ''];
      }
      if(this.testDetails.correctionGrid.correction.showEliminations){
        test['elimination'] = [false];
        test['eliminationReason'] = [ ''];
      }
      this.testCorrect = testCorrect;
      this.form = this.fb.group(test);
      this.subscribeFormChanges();
    } else {
      this.updatingCorrection = false;
      this.today = new Date();
      const nextYear = Number(new Date().getFullYear()) + 1;
      this.currentSchoolYear = new Date().getFullYear() + '-' + nextYear;
      let rncpTitle;
      this.rncpTitle = this.selectedRncpTitle.longName;
      rncpTitle = this.selectedRncpTitle.longName;
      const test = {};
      const header = [];
      const footer = [];
      const sections = [];
      this.testCorrect = new TestCorrection();
      this.testCorrect.test = this.testDetails._id;
      this.testCorrect.corrector = this.service.getCurrentUserInfo() ? this.service.getCurrentUserInfo()._id : '';
      this.testCorrect.student = studentId;
      const testCorrect = this.testCorrect;
      rncpTitle = this.rncpTitle;
      const headerInfo = this.testCorrectionService.getHeader();

      _.forEach(this.testDetails.correctionGrid.header.fields, function (val, key) {

        const obj = {
          'type': val.type,
          'label': val.value,
          'value': headerInfo ? headerInfo.header.fields[key].value : null,
          'dataType': val.dataType,
          'align': val.align
        };
        switch (val.type) {
          case 'dateRange':
            obj.value = new Date();
            testCorrect.correctionGrid.header.fields.push(obj);
            break;
          case 'dateFixed':
            obj.value = new Date();
            testCorrect.correctionGrid.header.fields.push(obj);
            break;
          case 'currentSchoolYear':
            obj.value = new Date().getFullYear() + '-' + nextYear;
            testCorrect.correctionGrid.header.fields.push(obj);
            break;
          case 'titleName':
            obj.value = rncpTitle;
            testCorrect.correctionGrid.header.fields.push({
              'type': val.type,
              'label': val.value,
              'value': rncpTitle,
              'dataType': val.dataType,
              'align': val.align
            });
            break;
          case 'status':
            testCorrect.correctionGrid.header.fields.push(obj);
            break;
          default:
            testCorrect.correctionGrid.header.fields.push(obj);
        }
        test['header' + key] = [headerInfo ? headerInfo.header.fields[key].value : null];

      });

      const footerInfo = this.testCorrectionService.getFooter();
      _.forEach(this.testDetails.correctionGrid.footer.fields, function (val, key) {
        test['footer' + key] = [footerInfo && footerInfo.footer.fields[key] ? footerInfo.footer.fields[key].value : null, Validators.required];
        testCorrect.correctionGrid.footer.fields.push({
          'type': val.type,
          'label': val.value,
          'value': footerInfo && footerInfo.footer.fields[key] ? footerInfo.footer.fields[key].value : null,
          'dataType': val.dataType,
          'align': val.align
        });
      });

      _.forEach(this.testDetails.correctionGrid.correction.sections, function (val, key) {
        test['total' + key] = [0, Validators.required];
        test['comment' + key] = [null];
        testCorrect.correctionGrid.correction.sections.push({
          title: val.title,
          rating: 0,
          comments: '',
          subSections: []
        });
        _.forEach(val.subSections, function (v, k) {
          test['subSection-' + key + '-' + k] = [null,Validators.required];
        });

      });
        this.listServiceFeature = [];

      _.forEach(this.testDetails.correctionGrid.correction.sections, function (val, key) {
        _.forEach(val.subSections, function (v, k) {
          test['comment-' + key + '-' + k] = [null];
          test['directions-' + key + '-' + k] = [null];
          test['marksnumber-' + key + '-' + k] = [null];
          test['marksletters-' + key + '-' + k] = [null];


          let juryObject = [];
          if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
            for (var index = 0; index < self.testDetails.juryMax; index++) {
              test['jury-' + key + '-'+k+'-' +index+'-name'] = ['Jury - '+(index + 1)];
              test['jury-' + key + '-' + k +'-' +index+'-marks'] = [null];
              self.listJury[index].push({name:'Jury - '+(index + 1),marks:''})
              juryObject.push({name:'Jury - '+(index + 1),marks:''});
            }
          }

          testCorrect.correctionGrid.correction.sections[key].subSections.push({
            title: val.title,
            rating: '',
            comments: '',
            directions: '',
            marksnumber: '',
            marksletters: '',
            jury:juryObject
          });
        });
      });

      // penalties
      _.forEach(this.testDetails.correctionGrid.correction.penalties, function (val, key) {
          test['penalties-' + key] = [val && val.rating ? val.rating: '',Validators.required];
      });
      // bonuses
      _.forEach(this.testDetails.correctionGrid.correction.bonuses, function (val, key) {
        test['bonuses-' + key] = [val && val.rating ? val.rating: '',Validators.required];
      });

      if(this.testDetails.correctionGrid.correction.showEliminations){
        test['elimination'] = [false];
        test['eliminationReason'] = [''];
      }

      if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
        test['ttlJuryAvgRating'] = [''];
      }
      if(self.testDetails.type == 'free-continuous-control'){
        test['finalTtl'] = [''];
      }
      this.form = this.fb.group(test);
      this.subscribeFormChanges();
    }
  }

  subscribeFormChanges() {
    this.form.valueChanges.subscribe((data) => {
      this.testCorrectionService.addHeader(this.testCorrect.correctionGrid);
      this.testCorrectionService.addFooter(this.testCorrect.correctionGrid);
    });
  }

  sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
  }

  blurEventPenalties(event, value, i, formValue, rowIndex) {
    const re = /^[0-9]+$/;
    this.testCorrect.correctionGrid.correction.total = 0;
    if (event.target.value > value) {event.target.value = 0;}
    this.total(event, value, re, i, formValue, 0, rowIndex);
  }
  blurEventBonuses(event, value, i, formValue, rowIndex) {
    const re = /^[0-9]+$/;
    this.testCorrect.correctionGrid.correction.total = 0;
    if (!re.test(event.target.value)) {event.target.value = 0;}
    if (event.target.value > value) {event.target.value = 0;}
    this.total(event, value, re, i, formValue, 0, rowIndex);

  }

  blurEventJury(event, value, i, formValue, rowIndex) {
    const re = /^[0-9]+$/;
    let total = 0;
    this.testCorrect.correctionGrid.correction.total = 0;
    this.testCorrect.correctionGrid.correction.totalJuryAvgRating = 0;
    this.testCorrect.correctionGrid.correction.additionalTotal = 0;
    let totalMarks = 0;
    if((this.testDetails.type == 'Jury' || this.testDetails.type == 'Memoire-ORAL')  && this.testDetails.juryMax){
      for (var index = 0; index < this.testDetails.juryMax; index++) {
        if(!formValue['jury-'+i+'-'+rowIndex+'-'+index+'-marks'] || formValue['jury-'+i+'-'+rowIndex+'-'+index+'-marks'] > value){
          this.form.controls['jury-'+i+'-'+rowIndex+'-'+index+'-marks'].setValue(0);
          formValue['jury-'+i+'-'+rowIndex+'-'+index+'-marks'] = 0;
        }
        totalMarks = totalMarks + formValue['jury-'+i+'-'+rowIndex+'-'+index+'-marks'];
      }
      let avg = Number( totalMarks / this.testDetails.juryMax ).toFixed(1);
      if (avg > value) {
        event.target.value = 0;
        this.listServiceFeature[i + '_' + rowIndex] = 0;
      }else{
        this.listServiceFeature[i + '_' + rowIndex] = avg;
      }
      this.testCorrect.correctionGrid.correction.sections[i].subSections[rowIndex].rating = Number(avg);
      this.total(event, value, re, i, formValue, total, rowIndex);
    }



  }
  blurEvent(event, value, i, formValue, rowIndex) {
    const re = /^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/;
    let total = 0;
    this.testCorrect.correctionGrid.correction.total = 0;
    this.testCorrect.correctionGrid.correction.totalJuryAvgRating = 0;
    this.testCorrect.correctionGrid.correction.additionalTotal = 0;
    if (!re.test(event.target.value)) {
      event.target.value = 0;
      this.listServiceFeature[i + '_' + rowIndex] = 0;
    }
    if (event.target.value > value) {
      event.target.value = 0;
      this.listServiceFeature[i + '_' + rowIndex] = 0;
    }
    this.testCorrect.correctionGrid.correction.sections[i].subSections[rowIndex].rating = event.target.value;
    this.total(event, value, re, i, formValue, total, rowIndex);
  }
  blurEventFreeControl(event, value) {
    const re = /^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/;
    if (!re.test(event.target.value)) {
      event.target.value = 0;
      this.form.controls['finalTtl'].setValue(0);
    }
    if (event.target.value > 20) {
      event.target.value = 0;
      this.form.controls['finalTtl'].setValue(0);
    }
  }


  searchStudentsTable(event) {
    const val = event.target.value;
    this.searchedStudents = val.length >= 2 ? this.students.filter(option =>
      (option.lastName + ' ' + option.firstName).toLocaleLowerCase().includes(val.trim().toLowerCase())) : this.students;
  }
  searchGroupTable(event) {
    const val = event.target.value;
    this.searchedGroup = val.length >= 2 ? this.groups.filter(option =>
      (option.name).toLocaleLowerCase().includes(val.trim().toLowerCase())) : this.groups;
  }

  openTestDetails() {
    const stack = [...this.positionStack, 0];
    this.testDetailsDialog = this.dialog.open(TestDetailsDialogComponent, this.configDoc);
    this.testDetailsDialog.componentInstance.test = this.testDetails;
    this.testDetailsDialog.componentInstance.positionStack = stack;
    this.testDetailsDialog.afterClosed().subscribe(
      function (status) {
        if (status) {
          if (status.type === 'move') {
            status.stack.pop();
            this.positionStack = status.stack;
          } else if (status.type === 'edit') {
            status.stack.pop();
            this.positionStack = status.stack;
            this.routes.navigateByUrl('/create-test');
          }
        }
      }.bind(this)
    );
  }

  closeDialog(object?: any) {
    this.testDetailsDialog.close(object);
  }

  openFormConfirmationDialog(id) {
    this.formConfirmationComponent = this.dialog.open(FormConfirmationComponent, this.formConfigmDoc);
    this.formConfirmationComponent.afterClosed().subscribe((value) => {
      if (value !== '') {
        if (value === 'SubmitAndGo') {
          if (!this.form.valid) {
            swal({
              title: 'Attention',
              html: this.translate.instant('TESTCORRECTIONS.MESSAGE.REQUIREDFIELDMESSAGE'),
              allowEscapeKey:true,
              type:'warning'
            });
          } else {
            this.submit(null, id);
          }
        } else if (value === 'CancleAndGo') {
          this.ChangeStudent({ value: id });
        } else if (value === 'Cancel') {
          const student = this.students.find((std) => {
            return std._id === this.oldStudentValue;
          });
          this.selectedStudentArray = [student];
          this.selectedStudent = this.oldStudentValue;
        }
      }
    });
  }


  total(event, value, re, i, formValue, total, rowIndex) {

    for (const key in this.listServiceFeature) {
      const res = key.split('_');
      if (Number(res[0]) === i) {
        if (this.listServiceFeature[key]) {
          if (!re.test(event.target.value)) {
          } else if (event.target.value > value) {
          } else {
            total = Number(total) + Number(this.listServiceFeature[key]);
          }
        }
      }
    }
    const obj = {};
    for (const key in formValue) {
      if (key === 'total' + i) {
        
        //Check if number has decimals.If yes show only two decimals
        if(Number(total) % 1 != 0){
          total = total.toFixed(2);}

    
        formValue[key] = total;
        obj[key] = total;
        

        this.testCorrect.correctionGrid.correction.sections[i].rating = total;
        this.form.patchValue(obj);
      }
      if (key.substring(0, 5) === 'total') {
        let totalValue = Number(this.testCorrect.correctionGrid.correction.total) + Number(formValue[key]);

        //Check if number has decimals.If yes show only two decimals
        if(totalValue % 1 != 0)
          totalValue = Number(totalValue.toFixed(2));

        this.testCorrect.correctionGrid.correction.total = totalValue;
      }
    }

     //Calculate penalties & bonuses
     let penalties = 0;
     let bonuses = 0;
     for (var index = 0; index < this.testDetails.correctionGrid.correction.penalties.length; index++) {
       if(!formValue['penalties-'+index]){
         formValue['penalties-'+index] = 0;
       }
       penalties = penalties + Number(formValue['penalties-'+index]);
     }
     for (var index = 0; index < this.testDetails.correctionGrid.correction.bonuses.length; index++) {
       if(!formValue['bonuses-'+index]){
         formValue['bonuses-'+index] = 0;
       }
       bonuses = bonuses + Number(formValue['bonuses-'+index]);
     }
     this.testCorrect.correctionGrid.correction.total = (this.testCorrect.correctionGrid.correction.total + Number(bonuses)) - penalties;

     if(this.testCorrect.correctionGrid.correction.total > this.getMaxScore()){
      this.testCorrect.correctionGrid.correction.total = this.getMaxScore();
     }

     if(Math.sign(this.testCorrect.correctionGrid.correction.total) === -1){
      this.testCorrect.correctionGrid.correction.total = 0;
     }


    this.testCorrect.correctionGrid.correction.additionalTotal =(this.testDetails.correctionGrid.correction.totalZone.additionalMaxScore * this.testCorrect.correctionGrid.correction.total)/ this.getMaxScore();
    // Check for decimal place
    if (this.testCorrect.correctionGrid.correction.additionalTotal == Math.floor(this.testCorrect.correctionGrid.correction.additionalTotal)) {
      this.testCorrect.correctionGrid.correction.additionalTotal =this.testCorrect.correctionGrid.correction.additionalTotal.toFixed(0);
    } else {
        this.testCorrect.correctionGrid.correction.additionalTotal =this.testCorrect.correctionGrid.correction.additionalTotal.toFixed(1);
    }



    if(this.testDetails.type == 'Jury' || this.testDetails.type == 'Memoire-ORAL' ){
      this.testCorrect.correctionGrid.correction.totalJuryAvgRating =  Number(this.testCorrect.correctionGrid.correction.total.toFixed(1));
      this.testCorrect.correctionGrid.correction.total = Number(this.testCorrect.correctionGrid.correction.total.toFixed(1));
    }

    if(this.testCorrect.correctionGrid.correction.elimination){
      this.testCorrect.correctionGrid.correction.total = 0;
    }
  }

  getTotalForJury(){
    let FinalTotlal = 0;
    for (const key in this.form.value) {
      if (key.substring(0, 5) === 'total') {
        FinalTotlal = Number(FinalTotlal) + Number(this.form.value[key]);
      }
    }
    return FinalTotlal;
  }

  studentSelected(row) {
    console.log(row);
    this.ChangeStudent({ value: row._id });
  }

  changeMissingCopy(e) {
    let self = this;
    if (e.checked) {
      this.isMissingCopy = true;
    } else {
      this.isMissingCopy = false;
      if (this.testCorrect != null) {
        this.updatingCorrection = true;
        this.today = new Date();
        const nextYear = Number(new Date().getFullYear()) + 1;
        this.currentSchoolYear = new Date().getFullYear() + '-' + nextYear;
        const test = {};
        const header = [];
        const footer = [];
        const sections = [];

        let rncpTitle;
        rncpTitle = this.rncpTitle;

        _.forEach(this.testCorrect.correctionGrid.header.fields, function (val, key) {
          // test['header' + key] = [val.value, Validators.required];
          test['header' + key] = [val && val.value ? val.value : ''];
        });

        // footer
        _.forEach(this.testCorrect.correctionGrid.footer.fields, function (val, key) {
          // test['footer' + key] = [val.value, Validators.required];
          test['footer' + key] = [val && val.value ? val.value : ''];
        });

        // total
        _.forEach(this.testCorrect.correctionGrid.correction.sections, (val, key) => {
          test['total' + key] = ['', Validators.required];
          test['comment' + key] = [''];
          _.forEach(val.subSections, (v, k) => {
            test['subSection-' + key + '-' + k] = ['', Validators.required];
            this.listServiceFeature[key + '_' + k] = '';
          });
        });

        // Comment, directions, marksnumber, marksletters
        _.forEach(this.testCorrect.correctionGrid.correction.sections, function (val, key) {
          _.forEach(val.subSections, function (v, k) {
            test['comment-' + key + '-' + k] = [''];
            test['directions-' + key + '-' + k] = [ ''];
            test['marksnumber-' + key + '-' + k] = [ '' ];
            test['marksletters-' + key + '-' + k] = [ ''];

            if((self.testDetails.type == 'Jury' || self.testDetails.type == 'Memoire-ORAL')  && self.testDetails.juryMax){
              for (var index = 0; index < self.testDetails.juryMax; index++) {
                test['jury-' + key + '-'+k+'-' +index+'-name'] = [null];
                test['jury-' + key + '-'+k+'-' +index+'-marks'] = [null];
                self.listJury[index].push({name:'',marks:''})
              }
            }

          });
        });
         // penalties
        _.forEach(this.testDetails.correctionGrid.correction.penalties, function (val, key) {
            test['penalties-' + key] = [val && val.rating ? val.rating: '' ];
        });
        // bonuses
        _.forEach(this.testDetails.correctionGrid.correction.bonuses, function (val, key) {
            test['bonuses-' + key] = [val && val.rating ? val.rating: '' ];
        });

        this.form = this.fb.group(test);
        this.subscribeFormChanges();
      }
    }
  }

  checkIsReadyToSend(){
    return this.mainDataObj && this.mainDataObj.testCorrectionId && this.mainDataObj.testCorrectionId['_id'];
  }

  checkIsValidToSaveScore(){

    if(this.testCorrect.correctionGrid.correction.elimination){
      if(this.testCorrect.correctionGrid.correction.eliminationReason == ''){
        return false;
      }else{
        return true;
      }
    }

    if(this.form.valid && this.testDetails.type !== 'free-continuous-control'){
      return true;
    }else{
      if(this.testCorrect.missingCopy){
        return true;
      }
      if(this.testDetails && this.testDetails.type == 'free-continuous-control' && this.testCorrect.correctionGrid.correction.total){
        return true;
      }
    }
    return false;
  }

  ChangeStudentFromDropdown(e) {
        this.studentSelect = e.lastName + ' ' + e.firstName;
        this.ChangeStudent({ value: e._id });
  }

  testChange(e) {
    this.filteredStudents = Observable.create(function (observer) {
      const filterValue = this.filter(e.target.value);
      observer.next(filterValue);
    }.bind(this));
  }


  ChangeStudent(e) {
    const selectedStudentID = e.value;
    this.oldStudentValue = selectedStudentID;
    this.testCorrect.student = selectedStudentID;
    const student = this.students.find((std) => {
      return std._id === selectedStudentID;
    });
    this.selectedStudentDetails = student;
    this.oldStudentName = student.lastName + ' ' + student.firstName;
    this.studentSelect = student.lastName + ' ' + student.firstName;
    this.selectedStudentArray = [student];
    this.selectedStudent = selectedStudentID;
    if (student != null) {
      if (student.correctedTests != null && student.correctedTests[0] && student.correctedTests[0].correction) {
        const c = student.correctedTests[0].correction;
        this.loadStudentCorrections(JSON.parse(JSON.stringify(c)), selectedStudentID);
      } else {
        this.loadStudentCorrections(null, selectedStudentID);
      }
    }
  }

  cancleClick() {
    let self = this;
    swal({
      title: 'Attention',
      html: self.translate.instant('TESTCORRECTIONS.MESSAGE.CANCELCORRECTION'),
      type: 'question',
      showCancelButton: true,
      allowEscapeKey:true,
      cancelButtonText: self.translate.instant('NO'),
      confirmButtonText: self.translate.instant('YES')}).then(() => {
        self.routes.navigate(['/students']);
    }, function (dismiss) {
      if (dismiss === 'cancel') {
      }
    });
  }

  getScore(row) {
    if (row.correctedTests && row.correctedTests && row.correctedTests[0] && row.correctedTests[0].correction) {
      if (row.correctedTests[0].correction.missingCopy) {
        return this.translate.instant('TESTCORRECTIONS.MISSINGCOPY');
      }
    }



    if(this.testDetails.groupTest && row['testCorrectionId'] && row['testCorrectionId']['_id']){
      if (row['testCorrectionId'].missingCopy) {
        return this.translate.instant('TESTCORRECTIONS.MISSINGCOPY');
      }
      return row['testCorrectionId'] && row['testCorrectionId']['_id'] ? row['testCorrectionId']['correctionGrid']['correction']['total']: '-';
    }


     if (this.testDetails && this.testDetails.correctionGrid.correction.totalZone.displayAdditionalTotal === true) {
       const additionalTotal = row.correctedTests && row.correctedTests[0] && row.correctedTests[0].correction ? row.correctedTests[0].correction.correctionGrid.correction.additionalTotal : '-';
       //return additionalTotal !== null ? additionalTotal + ' / ' + this.testDetails.correctionGrid.correction.totalZone.additionalMaxScore : '-';
         return additionalTotal;
     }else {
      return row.correctedTests && row.correctedTests && row.correctedTests[0] && row.correctedTests[0].correction ? row.correctedTests[0].correction.correctionGrid.correction.total : '-';
    }

  }


  getAllStudentsCorrected() {
    if (!this.form.valid || this.form.dirty) {
      return false;
    } else {
      if(this.testDetails.groupTest){
        return this.groups.every(function (i) { return i.testCorrectionId && i.testCorrectionId._id ? true : false; });
      }else{
        return this.students.every(function (i) { return i.correctedTests ? (i.correctedTests.length === 1) : false; });
      }
    }
  }
  getAllStudentsValidated() {
    let self = this;
    if (!this.form.valid || this.form.dirty || this.currentLoginUser.types[0].name.toUpperCase() === 'CORRECTOR') {
      return false;
    } else {
      if(this.testDetails.groupTest){
        return this.groups.every(function (i) { return i.testCorrectionId && i.testCorrectionId._id ? true : false; });
      }else{
        return this.students.every(function (i) { return i.correctedTests && i.correctedTests.length === 1 ?  i.correctedTests[0].correction.missingCopy ? i.correctedTests[0].correction.isJustified !== '' : self.docUploaded(i) : false; });
      }
    }
  }
  getCorrectedStudentsCorrected() {
    let total = 0;
    for (var index = 0; index < this.students.length; index++) {
      var element = this.students[index];
      if( element.correctedTests && element.correctedTests.length === 1){
        total = total + 1;
      }

    }
    return total;
  }


  submit(type?: string, id?: string) {
    let self = this;
    const studentID = this.testCorrect.student;

    if((self.testDetails.type === 'Jury' || self.testDetails.type === 'Memoire-ORAL')  && self.testDetails.juryMax){
      _.forEach(self.testDetails.correctionGrid.correction.sections, function (val, key) {
        _.forEach(val.subSections, function (v, k) {
          let juryObject = [];
          if(self.testDetails.type == 'Jury' && self.testDetails.juryMax){
            for (var index = 0; index < self.testDetails.juryMax; index++) {
              juryObject.push({name:self.form.value['jury-' + key + '-'+k+'-' +index+'-name'],marks:self.form.value['jury-' + key + '-'+k+'-' +index+'-marks']});
            }
          }
          self.testCorrect.correctionGrid.correction.sections[key].subSections[k].jury = juryObject;
        });
      });
      this.testCorrect.correctionGrid.correction.total = this.testCorrect.correctionGrid.correction.totalJuryAvgRating;
    }

     // penalties
     self.testCorrect.correctionGrid.correction.penalty = [];
     self.testCorrect.correctionGrid.correction.bonus = [];
     _.forEach(this.testDetails.correctionGrid.correction.penalties, function (val, key) {
      self.testCorrect.correctionGrid.correction.penalty.push({title:val['title'],rating:self.form.value['penalties-'+key]});
     });
      // bonuses
      _.forEach(this.testDetails.correctionGrid.correction.bonuses, function (val, key) {
        self.testCorrect.correctionGrid.correction.bonus.push({title:val['title'],rating:self.form.value['bonuses-'+key]});
      });



    if(this.testDetails.groupTest){
      this.testCorrect.testGroupId = this.selectedGroupDetails._id;
      this.testCorrect.isGroupCorrection = true;
    }

    if ( this.isADMTCAfterValidation ) {
      this.submitAll();
    } else if (this.testCorrect.missingCopy) {

      this.mentorEvalService.saveEvaliationGrid(this.mainDataObj['_id'],this.testCorrect).subscribe(response => {
        this.mainDataObj.testCorrectionId = response.data;
        if ( type === 'EXPEDITE' ) {
          this.validateAll()
        } else {
          self.updateTestCorrectionForm(self,type,studentID,id,response);
        }
      });
    } else {
      // id is coming when user change student from grid and dropdown


      if (this.form.valid || this.testCorrect.correctionGrid.correction.elimination) {
          for (var index = 0; index < this.testDetails.expectedDocuments.length; index++) {
            var element = this.testDetails.expectedDocuments[index];
            element.uploadStatus = false;
          }
          this.testCorrect.expectedDocuments = this.testDetails.expectedDocuments;
          this.mentorEvalService.saveEvaliationGrid(this.mainDataObj['_id'],this.testCorrect).subscribe(response => {
            this.mainDataObj.testCorrectionId = response.data;
            if ( type === 'EXPEDITE' ) {
              this.validateAll();
            } else {
              self.updateTestCorrectionForm(self,type,studentID,id,response);
            }
          });
      } else {
        swal({
          title: 'Attention',allowEscapeKey:true, html: this.translate.instant('TESTCORRECTIONS.MESSAGE.REQUIREDFIELDMESSAGE'),type: 'warning'});
      }
    }

  }

  updateTestCorrectionForm(self,type,studentID,id,response){
    if (response.status === 'OK') {
        swal({
          title: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONSUCCESSTitle'),
          html: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONSUCCESS_MENT',
          {StudentCivility: !this.testDetails.groupTest ? this.utilityService.computeCivility(this.selectedStudentDetails['civility'],this.translate.currentLang) : '',
          StudentFirstName:  !this.testDetails.groupTest ? this.selectedStudentDetails.firstName: '',
          StudentLastName:  !this.testDetails.groupTest ? this.selectedStudentDetails.lastName : ''}),
          allowEscapeKey:true,
          type: 'success',
          confirmButtonText: 'OK'
        });
      this.getQuestionnaireById(this.mainDataObj['_id']);
    } else {
      swal({
        title: 'Attention',
        html: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONUPDATEERROR'),
        allowEscapeKey:true,
        type: 'warning'
      });
    }
  }


  submitAll(): void {
    let self = this;

    if ( !this.isADMTCAfterValidation ) {
      this.mainDataObj.mentorEvaluationStatus = 'filledByMentor';
    }

    this.mentorEvalService.setMentorEvaluationbyResponse(this.mainDataObj).subscribe(res => {
      const response = res.data;
      this.emitStatustoDetails.emit('mentorEvalUpdate');
      if (this.isADMTCAfterValidation) {
        swal({
          title: this.translate.instant('SUCCESS'),
          allowEscapeKey: true,
          type: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        swal({
          title: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S5_TITLE'),
          allowEscapeKey: true,
          html: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S5_TEXT',
            {
              StudentCivility: !this.testDetails.groupTest ? this.utilityService.computeCivility(this.selectedStudentDetails['civility'], this.translate.currentLang) : '',
              StudentFirstName: !this.testDetails.groupTest ? this.selectedStudentDetails.firstName : '',
              StudentLastName: !this.testDetails.groupTest ? this.selectedStudentDetails.lastName : ''
            }),
          type: 'success',
          confirmButtonText: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S5_BTN')
        });
        if (this.utilityService.checkUserIsMentor()) {
          self.routes.navigate(['/students']);
        }
      }
    });
  }

  submitScoreToSchoolCheck() {
    swal({
      type: 'warning',
      title: this.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S15.TITLE',
      {
        StudentCivility: !this.testDetails.groupTest ? 
                          this.utilityService.computeCivility(this.selectedStudentDetails['civility'], this.translate.currentLang) : '',
        StudentFirstName: !this.testDetails.groupTest ? this.selectedStudentDetails.firstName : '',
        StudentLastName: !this.testDetails.groupTest ? this.selectedStudentDetails.lastName : ''
      }),
      allowEscapeKey: true,
      html: this.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S15.TEXT'),
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#139613',
      confirmButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S15.BTN1'),
      cancelButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S15.BTN2')
    }).then((isConfirm) => {
      if (isConfirm) {
        this.submitAll();
      }
    },(dismiss) => {
      if (dismiss === 'cancel') {
        this.submit('');
      }
    });
  }

  validateAll() {
    let self = this;
    let html = this.makePDF();
    let data = {
      student: {
        _id: this.selectedStudentDetails._id,
        rncpTitle: this.selectedRncpTitle._id
      },
      testCorrectionId: this.selectedStudentDetails.correctedTests[0]._id,
      htmlForPdf: html,
      docName:  this.selectedRncpTitle.shortName + ' - ' + this.testDetails.name + ' - ' + this.studentSelect,
    }
    this.mainDataObj.corrections = [data];
    this.mainDataObj.mentorEvaluationStatus = this.showExpidteMentEvalButton ? 'expeditedByAcadStaff' : 'validatedByAcadStaff';

    this.mentorEvalService.setMentorEvaluationbyResponse(this.mainDataObj).subscribe(res => {
      const response = res.data;

      swal({
        title: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S6.TITLE'),
        allowEscapeKey: true,
        html: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S6.TEXT',
        {StudentCivility: !this.testDetails.groupTest ?
                          this.utilityService.computeCivility(
                            this.selectedStudentDetails.sex,
                            this.translate.currentLang.toLowerCase()) : '',
        StudentFirstName:  !this.testDetails.groupTest ? this.selectedStudentDetails.firstName: '',
        StudentLastName:  !this.testDetails.groupTest ? this.selectedStudentDetails.lastName : ''}),
        type: 'success',
        confirmButtonText: self.translate.instant('TESTCORRECTIONS.MESSAGE.MENTQUEST_S6.BTN')
      });

      if ( !self.router.snapshot.params['customerId'] ) {
        const schoolId = this.currentLoginUser && this.currentLoginUser.entity &&
                         this.currentLoginUser.entity.school ? this.currentLoginUser.entity.school._id : '';
        if ( schoolId ) {
          const linkToSchoolStudentCardsTab = '/school/' + schoolId + '/edit/' + 0;
          this.routes.navigateByUrl(linkToSchoolStudentCardsTab);
        }
      } else if ( this.showExpidteMentEvalButton ) {
        this.getQuestionnaireById(this.mainDataObj['_id']);
      }
      this.emitStatustoDetails.emit('mentorEvalUpdate');
    });
  }

  checkIsExpectedDocument() {
    if (this.testDetails && this.testDetails.expectedDocuments && this.testDetails.expectedDocuments.length) {
      return this.testDetails.expectedDocuments;
    }
    return false;
  }
  checkIsCorrectionID(row) {
    if (row && row.correctedTests && row.correctedTests[0] && row.correctedTests[0].correction && row.correctedTests[0].correction._id) {
      if(!row.correctedTests[0].correction.missingCopy){
        return true;
      }
    }
    return false;
  }
  docUploaded(row){
    if(this.checkIsCorrectionID(row)) {
      for (var index = 0; index < row.correctedTests[0].correction.expectedDocuments.length; index++) {
        var element = row.correctedTests[0].correction.expectedDocuments[index];
        if(!element.isUploaded) {
          return false;
        }
      }
    }

    return true;
  }


  updateTestCorrection(testCorrect){
    this.testCorrectionService.updateCorrection(testCorrect).subscribe(status => {
      if (status) {
        this.testCorrectionService.getTest(this.selectedTestId).subscribe((value) => {
          this.testDetails = value;
          this.loadStudentBasedOnUser();
        });

      } else {
        swal({title: 'Attention',allowEscapeKey:true, html: this.translate.instant('TESTCORRECTIONS.MESSAGE.CORRECTIONUPDATEERROR'),type: 'warning'});
      }
    });
  }

  getMaxScore() {

    if(this.testDetails.type == 'free-continuous-control'){
      return 20;
    }

    let a = 0;
    this.testDetails.correctionGrid.correction.sections.forEach((section, index) => {
      a += section.maximumRating;
    });
    return a;
  }

  getMaxCustomScore() {
    return this.testDetails.correctionGrid.correction.totalZone.additionalMaxScore;
  }


  getTopLeftHeaderHeight(){
    return this.elementView.nativeElement.offsetHeight;
  }

  eliminateStudent(event){
    console.log(event);
    let self = this;
    if(!this.testCorrect.correctionGrid.correction.elimination){
      swal({
        title: this.translate.instant('TESTCORRECTIONS.MESSAGE.ELIMINATION-WARNING-TITLE'),
        html: this.translate.instant('TESTCORRECTIONS.MESSAGE.ELIMINATION-WARNING-TEXT'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.ELIMINATION-WARNING-CONFIRM'),
        cancelButtonText: this.translate.instant('TESTCORRECTIONS.MESSAGE.ELIMINATION-WARNING-CANCLE')
      }).then(function(isConfirm) {
        if (isConfirm) {
          self.testCorrect.correctionGrid.correction.total = 0;
        }
      }, function(dismiss) {
        if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those
        self.testCorrect.correctionGrid.correction.elimination = false;
        } else {
          throw dismiss;
        }
      })
    }
  }

  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    return this.datePipe.transform(date,'d MMM y');
  }

  makePDF(){
    console.log(this.selectedStudentDetails); 
    let detailsObj = {
      testDetails: this.testDetails,
      selectedRNCP: this.selectedRncpTitle,
      selectedStudent: this.studentSelect,
      form:this.form.value,
      sections: this.testDetails.correctionGrid.correction.sections,
      testCorrect: this.testCorrect,
      scholarSeason: this.selectedStudentDetails.scholarSeason.scholarseason,
      school: this.selectedStudentDetails.school.shortName,
      max: this.getMaxScore(),
      jury: this.getTotalForJury(),
      customMax: this.getMaxCustomScore()
    }
    let translateObj = {
      tablehead: this.translate.instant('TESTCORRECTIONS.Note'),
      finalMark: this.translate.instant('TESTCORRECTIONS.FinalMark'),
      name: this.translate.instant('MENTOR_EVAL_PDF.NAME'),
      school: this.translate.instant('MENTOR_EVAL_PDF.SCHOOL')
    }

    
    let bodyobj = this.evalPdf.pdfGen(detailsObj, translateObj);
    let css = this.evalPdf.CSSGenr();
    return css + bodyobj;
    //to test the pdf gen on front end (without sending an API call)
  //   console.log(html);
  //   let filename = "mentor eval";
  //   this.pdfService.getPDF(html, filename, false).subscribe(res => {
  //     if (res.status === 'OK') {
  //       const element = document.createElement('a');
  //       element.href = Print.url+ res.filePath;
  //       element.target = '_blank';
  //       element.setAttribute('download', res.filename);
  //       element.click();
  //     }
  //   });
  }


}
