import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MdDialogRef, MdDialog, MD_DIALOG_DATA } from '@angular/material';
import { UserService, RNCPTitlesService, ScholarSeasonService, UtilityService } from '../../../services';
import { Page } from '../../../models/page.model';
import { Sort } from '../../../models/sort.model';
import swal from 'sweetalert2';
import { TranslateService } from 'ng2-translate';
import { EmployabilitySurveyService } from '../../../services/employability-survey.service';
import { AppSettings } from '../../../app-settings';
import _ from 'lodash';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as moment from 'moment';

@Component({
  selector: 'app-employability-dialog',
  templateUrl: './employability-dialog.component.html',
  styleUrls: ['./employability-dialog.component.scss']
})
export class EmployabilityDialogComponent implements OnInit {
  listRNCPTitle: any = [];
  classList: any;
  form: any;
  selectedRNCP: any;
  classes: any;
  page: any = new Page();
  sort: any = new Sort();
  scholars: any;
  selectedScholarSeason: any;
  selectedScholarSeasonId: any;
  selectedClass: any;
  selectedClassId: any;
  selectedRNCPName: string;
  selectedRNCPShortName: string;
  date:any;

  delimeterList = [
    { key: 'COMMA', value: ',' },
    { key: 'SEMICOLON', value: ';' },
    { key: 'TAB', value: '\t' }
  ];
  delimiterSelected = null;
  isExpostESCSV = false;


  constructor(private fb: FormBuilder,
    public dialogref: MdDialogRef<EmployabilityDialogComponent>,
    public dialog: MdDialog,
    @Inject(MD_DIALOG_DATA) public data: any,
    private titleService: RNCPTitlesService,
    private scholarService: ScholarSeasonService,
    private translate: TranslateService,
    private employabilityService: EmployabilitySurveyService,
    private utilityService: UtilityService
    ) { }

  ngOnInit() {
    this.buildForm();
    // this.getScholarSeasons();
    this.getAllRNCP();
  }

  buildForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      class: ['', Validators.required],
      scholar: ['', Validators.required]
    });
  }
  getAllRNCP(){
    this.titleService.getRNCPTitlesOPtimized(this.page,this.sort)
    .subscribe( data =>{
      this.listRNCPTitle = data.titles;
    })
  }
  onSelectScholarSeason(data) {
    this.selectedScholarSeason = data.scholarseason;
    this.selectedScholarSeasonId = data._id;
  }
  OnSelectRNCPTitle(data) {
    let self = this;
    this.classes = [];
    if (data && data._id) {
      this.selectedRNCPName = data.longName;
      this.selectedRNCPShortName = data.shortName;
      this.selectedRNCP = data._id;

      self.titleService.getClassesNosort(this.selectedRNCP).subscribe(data => {
        if (data.total === 0) {
          self.classes = [];
        } else {
          self.classes = data.classes;
        }

        self.form.controls['class'].setValue('');
      });
      self.scholarService.getScholarSeasonByRcnp(this.selectedRNCP)
      .subscribe( data =>{
        this.scholars = data.data;
      })
    }

  }
  onSelectedClass(data) {
    this.selectedClass = data.name;
    this.selectedClassId = data._id;
  }
  enterEmployabilitySurvey() {
    let self = this;
    let timeDisabledinSec = AppSettings.global.timeDisabledinSecForSwal;
    swal({
      title: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.TITLE'),
      text:
        this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.TEXT')
        +" "+ this.selectedRNCPName
        +" "+ this.selectedClass
        +" "+ this.selectedScholarSeason,
      type: 'question',
      allowEscapeKey: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CANCEL'),
      confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM', { timer: timeDisabledinSec }),
      onOpen: () => {
        swal.disableConfirmButton();
        const confirmBtnRef = swal.getConfirmButton();
        const timerLoop = setInterval(() => {
          timeDisabledinSec -= 1;
          confirmBtnRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM') + ' in ' + timeDisabledinSec +' sec';
        }, 1000
        );

        setTimeout(() => {
          confirmBtnRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM');
          swal.enableConfirmButton();
          clearTimeout(timerLoop);
        }, (timeDisabledinSec * 1000));
      }
    }).then(
      (result) => {
        this.sendSurvey()
        .subscribe(res => {
          let alredySent = res.data;
          if (alredySent && alredySent.notSentToIds.length) {
            if (alredySent.sentOn) {
              let timeStamp = alredySent.sentOn;
              this.date = timeStamp.split('T')[0].split('-');
              let timeDisabledinSeconds = AppSettings.global.timeDisabledinSecForSwal;
              swal({
                title: this.translate.instant('EMPLOYABILITY_SURVEY.SW_2.TITLE'),
                text: this.translate.instant('EMPLOYABILITY_SURVEY.SW_2.TEXT1')
                  + " " + this.selectedRNCPName
                  + " " + this.selectedClass
                  + " " + this.selectedScholarSeason
                  + " at " + `${this.date[2]}/${this.date[1]}/${this.date[0]} ` + this.translate.instant('EMPLOYABILITY_SURVEY.SW_2.TEXT2'),
                type: 'warning',
                allowEscapeKey: true,
                showCancelButton: true,
                cancelButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CANCEL'),
                confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM', { timer: timeDisabledinSeconds }),
                onOpen: () => {
                  swal.disableConfirmButton();
                  const confirmButtonRef = swal.getConfirmButton();
                  const time = setInterval(() => {
                    timeDisabledinSeconds -= 1;
                    confirmButtonRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM') + ' in ' + timeDisabledinSeconds + ' sec';
                  }, 1000);

                  setTimeout(() => {
                    confirmButtonRef.innerText = this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT.CONFIRM');
                    swal.enableConfirmButton();
                    clearTimeout(time);
                  }, (timeDisabledinSeconds * 1000));
                }
              }).then(
                () => {

                  this.sendReminder().subscribe(res=>{
                    swal({
                      title: this.translate.instant('EMPLOYABILITY_SURVEY.Success'),
                      text: this.translate.instant('EMPLOYABILITY_SURVEY.SW_2.REMINDER')
                        + " " + this.selectedRNCPName
                        + " " + this.selectedClass
                        + " " + this.selectedScholarSeason,
                      type: 'success',
                      allowEscapeKey: true,
                      showCancelButton: false,
                      confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT_A.CONFIRM'),
                    })
                      .then(() => {
                        self.closeDialog();
                      })
                  })
                },
                function (dismiss) {
                  if (dismiss === "cancel") {
                    self.closeDialog();
                  }
                }
              )

            }
          }else{
            swal({
              title: this.translate.instant('EMPLOYABILITY_SURVEY.Success'),
              text: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT_A.TITLE')
                + " " + this.selectedRNCPName
                + " " + this.selectedClass
                + " " + this.selectedScholarSeason,
              type: 'success',
              allowEscapeKey: true,
              showCancelButton: false,
              confirmButtonText: this.translate.instant('EMPLOYABILITY_SURVEY.SWEET_ALERT_A.CONFIRM'),
            }).then(() => {
              self.closeDialog();
            })

          }
        })
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          self.closeDialog();
        }
      }
    )
  }


  sendSurvey(){
    let lang = this.translate.currentLang;
    if (this.selectedRNCP && this.selectedClassId && this.selectedScholarSeasonId)
      return this.employabilityService.sendSurvey(this.selectedRNCP, this.selectedClassId, this.selectedScholarSeasonId, lang)
  }

  sendReminder(){
    let lang = this.translate.currentLang;
    if (this.selectedRNCP && this.selectedClassId && this.selectedScholarSeasonId)
      return this.employabilityService.sendReminder(this.selectedRNCP, this.selectedClassId, this.selectedScholarSeasonId,lang)
  }
  closeDialog(): void {
    this.dialogref.close({ status: false, selectedClassId: '', selectedRNCP: '', selectedScholarSeasonId: '' });
  }

  exportESCSV() {
    const body = {
      'rncpId': this.selectedRNCP,
      'classId': this.selectedClassId,
      'scholarSeasonId': this.selectedScholarSeasonId
    };
    this.employabilityService.getEmplyabilitySurveys(body).subscribe( data => {
      console.log(data);
      if (data && data.length > 0) {
        this.generateESCSV(data);
      }
    });
  }

  generateESCSV(students: any[]) {
    const rncpType = this.checkIfRMOOrCMOE();
    const options = {
      fieldSeparator: this.delimiterSelected,
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      headers: [
        this.translate.instant('STUDENT_EXPORT_COLUMNS.SCHOOL'),
        this.translate.instant('STUDENT_EXPORT_COLUMNS.RNCPTITLE'),
        this.translate.instant('STUDENT_EXPORT_COLUMNS.CLASS'),
        this.translate.instant('STUDENT_EXPORT_COLUMNS.SCHOLAR_SEASON'),
        this.translate.instant('STUDENT_EXPORT_COLUMNS.STUDENT_CIVILITY'),
        this.translate.instant('STUDENT_EXPORT_COLUMNS.STUDENT_FIRST_NAME'),
        this.translate.instant('STUDENT_EXPORT_COLUMNS.STUDENT_LAST_NAME'),
        this.translate.instant('STUDENT_EXPORT_COLUMNS.EMAIL'),
        this.translate.instant('CERTIFIER'),
        this.translate.instant('USERLISTTABLE.FNAME'),
        this.translate.instant('USERLISTTABLE.LNAME'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.POSTAL_ADDRESS'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.ZIPCODE'),
        this.translate.instant('USERS.CITY'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.MOBILE'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.PHONE'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTACT_BLOCK.PERSONAL_EMAIL'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTACT_BLOCK.PROFESSIONAL_EMAIL'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.PARENT_BLOCK.LAST_NAME_N_FIRST_NAME'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.PARENT_BLOCK.COMPLETE_MAILING_ADD'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.MOBILE'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.PHONE'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTACT_BLOCK.PERSONAL_EMAIL'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTACT_BLOCK.PROFESSIONAL_EMAIL'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTACT_BLOCK.PROFESSION'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.SITUATION_BLOCK.Q_JOB_SITUATION'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.FORM_OPTIONS.JOB_SITUATIONS.OTHER'),
        this.translate.instant('EMPLOYABILITY_SURVEY.FORM.PROFESSIONAL_ACTIVITY_BLOCK.TITLE_HELD'),
      ]
    };


    if (rncpType === 'RMO') {
      for(let i = 0; i < 14; i++) {
        options.headers.push(this.translate.instant('RMO.Q' + (i+1)));
      }
    } else if(rncpType === 'DMOE') {
      for(let i = 0; i < 17; i++) {
        options.headers.push(this.translate.instant('DMOE.Q' + (i+1)));
      }
    }

    const profActivityAndContractBlockHeader = [
      this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTRACT_BLOCK.START_DATE'),
      this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTRACT_BLOCK.END_DATE'),
      this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTRACT_BLOCK.STATUS'),
      this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTRACT_BLOCK.GROSS_SALARY'),
      this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTRACT_BLOCK.COMISSION'),
      this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTRACT_BLOCK.COMISSION_ANNUAL'),
      this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTRACT_BLOCK.COMPANY_NAME'),
      this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTRACT_BLOCK.BUSINESS_SECTOR'),
      this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTRACT_BLOCK.COMPANY_WEBSITE'),
    ]

    options.headers = options.headers.concat(profActivityAndContractBlockHeader);

    const studentsBeingExported = students.map((student) => {
      const q = student.quesAns;
      let surveyData = {
        'schoolShortName': _.get(student, 'studentSchool', ''),
        'rncpShortName': _.get(student, 'rncp', ''),
        'class': _.get(student, 'class', ''),
        'scholarSeason': _.get(student, 'scholarSeason', ''),
        'civility': this.utilityService.computeCivility(student.studentSex, this.translate.currentLang),
        'firstName': _.get(student, 'studentFirstName', ''),
        'lastName': _.get(student, 'studentLastName', ''),
        'email': _.get(student, 'studentEmail', ''),
        'certifier': '',
        'USERLISTTABLE.FNAME': _.get(q, 'firstName', ''),
        'USERLISTTABLE.LNAME': _.get(q, 'lastName', ''),
        'POSTAL_ADDRESS': _.get(q, 'postalAddress', ''),
        'ZIPCODE': _.get(q, 'postalCode', ''),
        'USERS.CITY': _.get(q, 'city', ''),
        'MOBILE': q.cellPhone ? q.cellPhone : '',
        'PHONE': q.phone ? q.phone : '',
        'CONTACT_BLOCK.PERSONAL_EMAIL': _.get(q, 'personalMail', ''),
        'CONTACT_BLOCK.PROFESSIONAL_EMAIL': _.get(q, 'professionalMail', ''),
        'PARENT_BLOCK.LAST_NAME_N_FIRST_NAME': _.get(q, 'parent_surnameAndFirstName', ''),
        'PARENT_BLOCK.COMPLETE_MAILING_ADD': _.get(q, 'parent_completeMailingAddress', ''),
        'PARENT_BLOCK.MOBILE': q.parent_cellPhone ? q.parent_cellPhone : '',
        'PARENT_BLOCK.PHONE': q.parent_phone ? q.parent_phone : '',
        'PARENT_BLOCK.PERSONAL_EMAIL': _.get(q, 'parent_personalMail', ''),
        'PARENT_BLOCK.PROFESSIONAL_EMAIL': _.get(q, 'parent_professionalMail', ''),
        'CONTACT_BLOCK.PROFESSION': _.get(q, 'parent_profession', ''),
        'SITUATION_BLOCK.Q_JOB_SITUATION': q.currentSituation_currentJob ? this.translate.instant('EMPLOYABILITY_SURVEY.FORM.FORM_OPTIONS.JOB_SITUATIONS.' + q.currentSituation_currentJob) : '',
        'FORM_OPTIONS.JOB_SITUATIONS.OTHER': _.get(q, 'currentSituation_comments', ''),
        'PROFESSIONAL_ACTIVITY_BLOCK.TITLE_HELD': _.get(q, 'titleOfPositionHeld', ''),
      };

      if (student.certifier !== 'initial') {
        surveyData['certifier'] = this.translate.instant('EMPLOYABILITY_SURVEY.CERTIFICATION.' + student.certifier.toUpperCase());
      } else {
        surveyData['certifier'] = '';
      }

      if (this.checkIfRMOOrCMOE() === 'RMO') {
        for(let i = 0; i < 14; i++) {
          surveyData['Q' + (i+1)] = this.translate.instant('EMPLOYABILITY_SURVEY.FORM.FORM_OPTIONS.BOOLEAN.' + (q['RMO_Q' + (i+1)]));
        }

      } else if (this.checkIfRMOOrCMOE() === 'DMOE') {
        for(let i = 0; i < 17; i++) {
          surveyData['Q' + (i+1)] = this.translate.instant('EMPLOYABILITY_SURVEY.FORM.FORM_OPTIONS.BOOLEAN.' + (q['DMOE_Q' + (i+1)]));
        }
      }

      surveyData['START_DATE'] = !q.contract_startDate || _.isEmpty(q.contract_startDate) ? ''  : moment(q.contract_startDate).format('DD-MM-YYYY');
      surveyData['END_DATE'] = !q.contract_endDate || _.isEmpty(q.contract_endDate) ? '' : moment(q.contract_endDate).format('DD-MM-YYYY');
      surveyData['STATUS'] = q.contract_status ? this.translate.instant('EMPLOYABILITY_SURVEY.FORM.CONTRACT_BLOCK.JOB_STATUS.' + q.contract_status.toUpperCase()) : '';
      surveyData['GROSS_SALARY'] = q.contract_grossSalary ? q.contract_grossSalary : 0;
      surveyData['COMISSION'] = q.contract_comissionAnually ? q.contract_comissionAnually : 0;
      surveyData['COMISSION_ANNUAL'] = q.contract_comissionInEuros ? q.contract_comissionInEuros : 0;
      surveyData['COMPANY_NAME'] = _.get(q, 'contract_companyName', '');
      surveyData['BUSINESS_SECTOR'] = _.get(q, 'contract_companyBusinessSector', '');
      surveyData['COMPANY_WEBSITE'] = _.get(q, 'contract_companyWebsite', '');


      return surveyData;
    });

    const setCSVFileName = (this.translate.instant('EMPLOYABILITY_SURVEY.CSVFileName'))
    + '-' + this.selectedRNCPShortName + '-' + this.selectedClass + '-' + this.selectedScholarSeason;

    new Angular2Csv(studentsBeingExported, setCSVFileName, options);
      swal({
        type: 'success',
        title: this.translate.instant('SUCCESS'),
        allowEscapeKey: true,
        confirmButtonText: 'OK'
      });

    this.dialogref.close();


  }

  checkIfRMOOrCMOE() {
    if(this.selectedRNCPShortName.includes('RMO')) {
      return 'RMO';
    } else if(this.selectedRNCPShortName.includes('DMOE')) {
      return 'DMOE';
    }
  }

  selectDelimiter(delimiter) {
    this.delimiterSelected = delimiter.value;
  }


}
