﻿import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { SchoolService } from '../../services/school.service';
import { CustomerService } from '../../components/customer/customer.service';
import { UserService } from '../../services/users.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';
import { Page } from 'app/models/page.model';
import { Sort } from 'app/models/sort.model';
import { RNCPTitlesService, UtilityService } from '../../services';
import { CountryData } from '../../components/student/country';
import { FileUploader } from 'ng2-file-upload';
import { FileUpload } from '../../shared/global-urls';
import { DomSanitizer } from '@angular/platform-browser';
import { AcademicKitService } from '../../services/academic-kit.service';
declare var swal: any;

@Component({
  selector: 'app-add-rncp-dialog',
  templateUrl: './add-rncp-dialog.component.html',
  styleUrls: ['./add-rncp-dialog.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class AddRncpDialogComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  isRNCPEdit = false;
  isAddSchool = false;
  editableRNCPDetails = null;
  filteredOptions: Observable<string[]>;
  schoolList: any = [];
  filteredcertifier: any = [];
  userModel: User;
  schoolSearchString = '';
  schoolId = '';
  // specializations: any;
  public userid: string;
  countryList: any[] = CountryData.CountryList;
  rncpLevel = [
    { value: 'I', viewValue: 'I' },
    { value: 'II', viewValue: 'II' },
    { value: 'III', viewValue: 'III' },
    { value: 'IV', viewValue: 'IV' },
    { value: 'V', viewValue: 'V' }
  ];

  page = new Page();
  sort = new Sort();
  minDate = new Date(new Date().setDate(new Date().getDate() - 1));
  get specializations(): FormArray {
    return <FormArray>this.form.get('specializations');
  };
  admtcDirList: any[] = [];
  uploaderRncpImage: FileUploader = new FileUploader({
    url: FileUpload.uploadUrl,
    isHTML5: true,
    disableMultipart: false
  });
  isImageUploaded = false;
  filePreviewPathImage: any = null;
  @ViewChild('rncpImageUpload') uploadInputRNCP: any;
  rncpFileNameId = {
    name: '',
    id: ''
  };

  constructor(private dialogRef: MdDialogRef<AddRncpDialogComponent>,
    private translate: TranslateService,
    private customerService: CustomerService,
    private schoolService: SchoolService,
    private fb: FormBuilder,
    public sanitizer: DomSanitizer,
    private rncpService: RNCPTitlesService,
    private utilityService: UtilityService,
    private acadService: AcademicKitService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 100;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';
  }

  ngOnInit() {
    const rncpEditObj = this.editableRNCPDetails && this.editableRNCPDetails.rncpUpdated ? this.editableRNCPDetails.rncpUpdated : null;

    this.rncpFileNameId.id = rncpEditObj && rncpEditObj.pdfBackgroundURL ? rncpEditObj.pdfBackgroundURL : '' ;
    this.rncpFileNameId.name = rncpEditObj && rncpEditObj.pdfBackgroundURL &&  rncpEditObj.pdfBackgroundURL.fileName ? rncpEditObj.pdfBackgroundURL.fileName : '' ;

    this.getRncpAdmtcDir();
    this.form = this.fb.group({
      schoolShortName: new FormControl('', [Validators.required]),
      schoolLongName: new FormControl('', [Validators.required]),
      operationRoleType: new FormControl(''),
      schoolId: new FormControl('', Validators.required),
      codeRncp: new FormControl(rncpEditObj && rncpEditObj.rncpCode ? rncpEditObj.rncpCode : '',
        [Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]{5}')]),
      shortNameRncp: new FormControl(rncpEditObj && rncpEditObj.shortName ? rncpEditObj.shortName : '', Validators.required),
      longNameRncp: new FormControl(rncpEditObj && rncpEditObj.longName ? rncpEditObj.longName : '', Validators.required),
      rncpLevel: new FormControl(rncpEditObj && rncpEditObj.rncpLevel ? rncpEditObj.rncpLevel : '', Validators.required),
      admtcDirResponsible: new FormControl(rncpEditObj && rncpEditObj.admtcDirResponsible ?
        rncpEditObj.admtcDirResponsible._id : ''),
      journalText: new FormControl(rncpEditObj && rncpEditObj.journalText ? rncpEditObj.journalText : '', Validators.required),
      journalDate: new FormControl(rncpEditObj && rncpEditObj.journalDate ? rncpEditObj.journalDate : '', Validators.required),
      address1: new FormControl('', Validators.required),
      address2: new FormControl(''),
      postalCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      specializations: rncpEditObj && rncpEditObj.specializations.length > 0 ?
        this.fb.array(this.buildSpecialzationsWithPredefinedSpecialzations(rncpEditObj.specializations)) :
        this.fb.array([]),
      schoolRef: new FormControl(''),
      country: new FormControl('', [Validators.required]),
    });
    this.loadCertifier();

    if (this.isRNCPEdit) {
      this.form.disable();
      this.form.get('journalText').enable();
      this.form.get('journalText').clearValidators();
      this.form.get('journalDate').enable();
      this.form.get('journalDate').clearValidators();
      this.form.controls['specializations'].enable();
      this.form.controls['admtcDirResponsible'].enable();
    } else {
      this.disableFormControlsConditionally(this.isAddSchool);
    }
    this.initializeUploader();
  }


  disableFormControlsConditionally(isAddSchool) {
    if (!isAddSchool) {
      this.form.controls['schoolShortName'].disable();
      this.form.controls['schoolLongName'].disable();
      this.form.controls['address1'].disable();
      this.form.controls['address2'].disable();
      this.form.controls['postalCode'].disable();
      this.form.controls['city'].disable();

      this.form.controls['schoolRef'].disable();
      this.form.controls['country'].disable();

      this.form.controls['schoolId'].enable();

    } else {
      this.form.controls['schoolShortName'].enable();
      this.form.controls['schoolLongName'].enable();
      this.form.controls['address1'].enable();
      this.form.controls['address2'].enable();
      this.form.controls['postalCode'].enable();
      this.form.controls['city'].enable();

      this.form.controls['schoolRef'].enable();
      this.form.controls['country'].enable();

      this.form.controls['schoolId'].disable();
    }
  }

  addSpecialization(spec) {
    console.log(spec.value);
    if (spec.value) {
      const specializations = this.form.get('specializations') as FormArray;
      specializations.push(this.buildSpecialization(spec.value));
    }
  }

  removeSpecialization(i) {
    const specializations = this.form.get('specializations') as FormArray;
    // if (specializations.length > 1) {
    specializations.removeAt(i);
    // }
  }

  buildSpecialzationsWithPredefinedSpecialzations(specializations) {
    // const specs = this.form.get('specializations') as FormArray;
    const specs = [];
    for (let spec of specializations) {
      specs.push(this.fb.group({
        name: new FormControl(spec.name),
        _id: new FormControl(spec._id),
        isSpecializationAssigned: spec.isSpecializationAssigned
      }));
    }
    return specs;

  }

  buildSpecialization(specName?: string) {
    return new FormGroup({
      name: new FormControl(specName ? specName : ''),
    });
  }




  handleKeyboardEvents(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  cancelForm() {
    this.dialogRef.close(false);
  }

  save(value) {
    this.submitted = true;

    let data = {};
    if (!this.isRNCPEdit) {
      data = {
        isSchoolNew: this.isAddSchool,
        isSchoolCertifier: true,
        schoolShortName: value.schoolShortName,
        schoolLongName: value.schoolLongName,
        schoolid: this.schoolId,
        isRNCPNew: true,
        rncpCode: value.codeRncp.toString(),
        rncpLevel: value.rncpLevel,
        admtcDirResponsible: value.admtcDirResponsible,
        rncpShortName: value.shortNameRncp,
        rncpLongName: value.longNameRncp,
        journalText: value.journalText,
        journalDate: value.journalDate,
        schoolAddress: {
          address1: value.address1,
          address2: value.address2,
          postalCode: value.postalCode,
          city: value.city,
        },
        rncpid: '',
        specializations: value.specializations,
        schoolRef: value.schoolRef,
        country: value.country
      };


      this.schoolService.addNewSchoolRncp(data).subscribe(response => {
        if (response.data) {
          swal({
            title: this.translate.instant('NEW_SCHOOL.SUCCESS'),
            text: this.translate.instant('NEW_SCHOOL.RNCP_ADDED'),
            allowEscapeKey: true,
            type: 'success'
          }).then(function () {
            this.dialogRef.close(response);
          }.bind(this));
        } else {
          swal({
            title: 'Oops...',
            text: this.translate.instant('MailBox.SOME_UNKNOWN_ERROR'),
            allowEscapeKey: true,
            type: 'error'
          }).then(function () {
            this.dialogRef.close(false);
          }.bind(this));
        }
      });
    } else {
      data = {
        specializations: value.specializations,
        admtcDirResponsible: value.admtcDirResponsible,
        journalText: value.journalText,
        journalDate: value.journalDate
      };
      if (this.rncpFileNameId.id) {
        data['pdfBackgroundURL'] = this.rncpFileNameId.id;
        data['bgImageName'] = this.rncpFileNameId.name;
      }
      this.rncpService.editRNCPSpecializations(data, this.editableRNCPDetails.rncpUpdated._id).subscribe(rncp => {
        if (rncp.data) {
          swal({
            title: this.translate.instant('NEW_SCHOOL.SUCCESS'),
            text: this.translate.instant('NEW_SCHOOL.RNCP_EDITED'),
            allowEscapeKey: true,
            type: 'success'
          }).then(function () {
            this.dialogRef.close(rncp);
          }.bind(this));
        } else {
          swal({
            title: 'Oops...',
            text: this.translate.instant('MailBox.SOME_UNKNOWN_ERROR'),
            allowEscapeKey: true,
            type: 'error'
          }).then(function () {
            this.dialogRef.close(false);
          }.bind(this));
        }
      });
    }
  }

  addNewSchool() {
    this.isAddSchool = true;
    this.disableFormControlsConditionally(true);
  }

  changeSchool(list) {
    console.log(list);
  }

  loadCertifier() {
    const self = this;
    this.customerService
      .getCustomersList(this.page, this.sort)
      .then(ListData => {
        console.log('getCustomersList :ListData', ListData);
        this.page.totalElements = ListData.total;
        this.schoolList = ListData.data;
        this.filteredcertifier = ListData.data;
      });
  }

  changeCertifier(event) {
    if (this.schoolSearchString !== '') {
      const val = event.target.value.toLowerCase();
      const temp = this.filteredcertifier.filter(function (school) {
        return (
          (school.shortName !== '' && school.shortName.toLowerCase().indexOf(val) !== -1));
      });
      this.filteredcertifier = temp;
    } else {
      this.filteredcertifier = this.schoolList;
    }
  }

  onSelectedSchool(school) {
    this.schoolId = school._id;
  }

  cancelSchoolDetail() {
    this.isAddSchool = false;
    this.disableFormControlsConditionally(false);
  }

  checkRncpCode(value) {
    if (value.toString().length <= 5) {
      this.form.controls['codeRncp'].setErrors(null);
    } else {
      console.log('Invalid');
      this.form.controls['codeRncp'].setErrors({ 'incorrect': true });
    }
  }

  onCodeKey(event) {

  }

  getNameOfDir(user) {
    const fullName = `${this.utilityService.computeCivility(user.sex, this.translate.currentLang)
      } ${user.firstName} ${user.lastName}`;
    return fullName;
  }

  getRncpAdmtcDir() {
    this.rncpService.getRncpAdmtcDir().subscribe(
      (dataDirList) => {
        console.log('rncpService.getRncpAdmtcDir( dataDirList', dataDirList);
        if (dataDirList.data && dataDirList.data.length) {
          this.admtcDirList = dataDirList.data;
          if (!this.form.controls['admtcDirResponsible'].value) {
            const defaultADMTCDir = this.admtcDirList.find(d => d.firstName === 'Corinne' && d.lastName === 'CRESPIN')._id;
            this.form.controls['admtcDirResponsible'].setValue(defaultADMTCDir);
          }
        }
      });
  }

  // Image Upload Block
  initializeUploader() {

    this.uploaderRncpImage.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.isImageUploaded = true;
      this.rncpFileNameId.name = file.file.name;
      this.filePreviewPathImage = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      console.log('this.uploaderRncpImage.onAfterAddingFile this.filePreviewPathImage', this.filePreviewPathImage);
      this.uploaderRncpImage.queue[0].upload();
    };

    this.uploaderRncpImage.onErrorItem = (item, response, status, headers) => {
      console.log('this.uploaderRncpImage.onErrorItem', item, response, status, headers);
      this.rncpFileNameId.name  = '';
      swal({
        title: 'Attention',
        text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
        allowEscapeKey: true,
        type: 'warning'
      });
    };

    this.uploaderRncpImage.onSuccessItem = (item, response, status, headers) => {
      const res = JSON.parse(response);
      if (res.status === 'OK') {
        console.log('res.data.filepath', res.data.filepath);
        const document = {};
        document['parentRNCPTitle'] = this.editableRNCPDetails && this.editableRNCPDetails.rncpUpdated ?
                                        this.editableRNCPDetails.rncpUpdated._id : '';
        document['fileName'] = this.rncpFileNameId.name;
        document['S3FileName'] = res && res.data && res.data.s3FileName ? res.data.s3FileName : '';
        document['storedInS3'] = res && res.data && res.data.s3FileName ? true : false;
        this.uploadDocument(document);
        this.uploaderRncpImage.clearQueue();
      } else {
        console.log(item, response, status, headers);
        swal({
          title: 'Attention',
          text: this.translate.instant('DASHBOARD.ERRORS.UPLOADERROR'),
          allowEscapeKey: true,
          type: 'warning'
        });
        this.uploaderRncpImage.clearQueue();
      }
    };
  }

  openUploadWindowDeploma() {
    this.uploadInputRNCP.nativeElement.click();
  }

  clearUploadQueue() {
    this.uploadInputRNCP.clearQueue();
    this.uploadInputRNCP.nativeElement.value = '';
  }

  uploadDocument(newDocument) {
    this.acadService.addDocument(newDocument).subscribe(response => {
      if (response._id) {
        this.rncpFileNameId.id = response._id;
      }
    });
  }
}
