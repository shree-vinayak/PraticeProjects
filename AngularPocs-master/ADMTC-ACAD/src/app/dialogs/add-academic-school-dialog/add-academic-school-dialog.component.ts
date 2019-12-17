import { UtilityService } from 'app/services/utility.service';
import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { SchoolService } from '../../services/school.service';
import { UserService } from '../../services/users.service';
import { CustomerService } from './../../components/customer/customer.service';
import { CountryData } from '../../components/student/country';
import _ from 'lodash';
import { RNCPTitlesService } from '../../services';
declare var swal: any;

@Component({
    selector: 'app-add-academic-school-dialog',
    templateUrl: './add-academic-school-dialog.component.html',
    styleUrls: ['./add-academic-school-dialog.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvents($event)'
    }
})
export class AddAcademicSchoolDialogComponent implements OnInit {
    form: FormGroup;
    isCertifier = false;
    isRncpAutoComplete = true;
    certifierFormSubmit = false;
    submitted = false;
    isSchoolEdit = false;
    RNCPTitles: any = [];
    RNCPTitleList = [];
    TotalCertifierList = [];
    CertifierList = [];
    selectedCertifierList = [];
    isAddRncp = false;
    isSchoolCertifier = false;
    isSchoolNew = true;
    selectedSchoolDetails;
    certifierList;
    selectedTitles: any = [];
    CertifierSelection = [{
        view: 'PREPARATIONCENTER',
        value: 'preparation-center',
        selected: true
    }, {
        view: 'CERTIFIER',
        value: 'certifier',
        selected: false
    }];

    specializations = [];
    rncpListWithFullObj = [];

    rncpLevel = [
        { value: 'I', viewValue: 'I' },
        { value: 'II', viewValue: 'II' },
        { value: 'III', viewValue: 'III' },
        { value: 'IV', viewValue: 'IV' },
        { value: 'V', viewValue: 'V' }
    ];

  countryList: any[] = CountryData.CountryList;
  admtcDirList: any[] = [];

    constructor(
        private translate: TranslateService,
        private service: UserService,
        private schoolService: SchoolService,
        private customerService: CustomerService,
        private dialogRef: MdDialogRef<AddAcademicSchoolDialogComponent>,
        private utilityService: UtilityService,
        private rncpService: RNCPTitlesService
    ) {
    }

    ngOnInit() {
        if (this.isSchoolEdit && this.selectedSchoolDetails && this.selectedSchoolDetails.specializations &&  this.selectedSchoolDetails.specializations.length > 0) {
          this.specializations = [...this.selectedSchoolDetails.specializations];
        }


        this.form = new FormGroup({
            shortName: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.shortName ? this.selectedSchoolDetails.shortName : '', [Validators.required, this.utilityService.noWhitespaceValidator]),
            longName: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.longName ? this.selectedSchoolDetails.longName : '', [Validators.required, this.utilityService.noWhitespaceValidator]),
            address1: new FormControl(this.selectedSchoolDetails &&  this.selectedSchoolDetails.schoolAddress && this.selectedSchoolDetails.schoolAddress.address1 ? this.selectedSchoolDetails.schoolAddress.address1 : '', [Validators.required]),
            address2: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.schoolAddress && this.selectedSchoolDetails.schoolAddress.address2 ? this.selectedSchoolDetails.schoolAddress.address2 : ''),
            postalCode: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.schoolAddress && this.selectedSchoolDetails.schoolAddress.postalCode ? this.selectedSchoolDetails.schoolAddress.postalCode : '',[Validators.required]),
            city: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.schoolAddress && this.selectedSchoolDetails.schoolAddress.city ? this.selectedSchoolDetails.schoolAddress.city : '',[Validators.required]),
            operationRoleType: new FormControl(''),
            assignedRncpTitles: new FormControl(''),
            assignedCertifier: new FormControl(''),
            specializations: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.specializations && this.selectedSchoolDetails.specializations.length > 0 ? this.selectedSchoolDetails.specializations : [],),
            codeRncp: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.codeRncp ? this.selectedSchoolDetails.codeRncp : '', [Validators.required, Validators.maxLength(5),Validators.pattern('^[0-9]{5}')]),
            shortNameRncp: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.shortNameRncp ? this.selectedSchoolDetails.shortNameRncp : '', [Validators.required]),
            longNameRncp: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.longNameRncp ? this.selectedSchoolDetails.longNameR1ncp : '', [Validators.required]),
            rncpLevel: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.rncpLevel ? this.selectedSchoolDetails.rncpLevel : '', [Validators.required]),
            admtcDirResponsible: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.admtcDirResponsible ?
                this.selectedSchoolDetails.admtcDirResponsible : ''),
            schoolRef: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.schoolRef ? this.selectedSchoolDetails.schoolRef : ''),
            country: new FormControl(this.selectedSchoolDetails && this.selectedSchoolDetails.country ? this.selectedSchoolDetails.country : '', [Validators.required]),
            retakeCenter: new FormControl(),
            region: new FormControl()
        });
        this.fillRNCP();

        if (this.selectedSchoolDetails && this.selectedSchoolDetails.rncpTitles) {
          this.getSelectedSpecializations();
            this.RNCPTitles = [];
            this.selectedSchoolDetails['rncpTitles'].forEach(element => {
                this.selectedTitles.push({
                    id: element['_id'],
                    text: element['shortName']
                });
                this.RNCPTitles.push(element['_id']);
                this.form.controls['assignedRncpTitles'].setValue(this.selectedTitles);
            });
        }

        if( this.certifierList && this.certifierList.length > 0 ) {
            this.certifierList.forEach(element => {
                this.CertifierList.push({
                    text: element.shortName,
                    id: element._id
                });

                this.selectedCertifierList.push({
                    text: element.shortName,
                    id: element._id
                });
                this.form.controls['assignedCertifier'].setValue(this.selectedCertifierList);
            });
        }
        this.getRncpAdmtcDir()
    }

    handleKeyboardEvents(event: KeyboardEvent) {
        if (event.keyCode === 27) {
            this.cancel();
        }
    }

    getSelectedSpecializations() {
      let selectedSpecs = [];
        if (this.selectedSchoolDetails && this.selectedSchoolDetails.rncpTitles && this.selectedSchoolDetails.rncpTitles.length > 0) {
          for (const rncp of this.selectedSchoolDetails.rncpTitles) {
            if (rncp.specializations && rncp.specializations.length > 0) {
              for (const spec of rncp.specializations) {
                selectedSpecs.push(spec);
              }
            }
          }
          selectedSpecs = _.uniqBy(selectedSpecs, '_id');
        }
        this.specializations = _.unionBy(this.specializations, selectedSpecs, '_id');
    }

    cancel() {
        this.dialogRef.close(false);
    }
    cancelAddRNCPTitle() {
        this.isAddRncp = false;
    }

    enableDisableControl(enabled) {
        if (enabled) {
            this.form.controls['codeRncp'].enable();
            this.form.controls['longNameRncp'].enable();
            this.form.controls['shortNameRncp'].enable();
            this.form.controls['rncpLevel'].enable();
            this.form.controls['admtcDirResponsible'].enable();
            this.form.controls['address1'].enable();
            this.form.controls['address2'].enable();
            this.form.controls['postalCode'].enable();
            this.form.controls['city'].enable();
            this.form.controls['schoolRef'].enable();
            this.form.controls['country'].enable();

            this.form.controls['assignedRncpTitles'].disable();
        } else {
            this.form.controls['codeRncp'].disable();
            this.form.controls['longNameRncp'].disable();
            this.form.controls['shortNameRncp'].disable();
            this.form.controls['rncpLevel'].disable();
            this.form.controls['admtcDirResponsible'].disable();
            this.form.controls['address1'].disable();
            this.form.controls['address2'].disable();
            this.form.controls['postalCode'].disable();
            this.form.controls['city'].disable();
            this.form.controls['assignedRncpTitles'].enable();
            this.form.controls['schoolRef'].enable();
            this.form.controls['country'].enable();
        }
    }

    save(value) {
      console.log(value);
        this.submitted = true;
        if(!value.shortName || !value.longName || !value.address1 || !value.postalCode || !value.city){
          return false;
        }

        if (this.selectedSchoolDetails && this.selectedSchoolDetails['_id']) {
            // UPDATE SCHOOL
            if (this.RNCPTitles.length <= 0) {
                return;
            }
            const specValues = [];
            if(this.form.value.specializations.length > 0) {
              for (let spec of this.form.value.specializations) {
                const findSpecFromSchool = _.find(this.selectedSchoolDetails.specializations, {'_id': spec._id});
                if (findSpecFromSchool) {
                  specValues.push(findSpecFromSchool);
                } else {
                  spec['isSpecializationAssigned'] = false;
                  specValues.push(spec);
                }
              }
          }

            const self = this;
            const formValue = this.form.value;
            const data = {
                'shortName': formValue.shortName,
                'longName': formValue.longName,
                schoolAddress: {
                    'address1': value.address1,
                    'address2': value.address2,
                    'postalCode': value.postalCode,
                    'city': value.city,
                },
                'preparationCenterFor': this.RNCPTitles,
                'certifierFor': [],
                'schoolRef': formValue.schoolRef,
                'country': formValue.country,
                'specializations': specValues
            };
            this.enableDisableControl(false);
            if (this.form.invalid) {
                this.enableDisableControl(true);
                // return;
            }
            this.selectedCertifierList.forEach((certifier) => {
                self.TotalCertifierList.forEach((cert) => {
                    if (certifier.id === cert.rncpCode) {
                        data.certifierFor.push(cert);
                    }
                });
            });
            this.customerService.updateCustomer(this.selectedSchoolDetails['_id'], data)
                .subscribe((response) => {
                    if (response.code === 200) {
                        swal({
                            type: 'success',
                            title: this.translate.instant('NEW_SCHOOL.SUCCESS'),
                            text: this.translate.instant('NEW_SCHOOL.UPDATEMSG', { shortName: data.shortName }),
                            confirmButtonText: 'OK'
                        });
                        this.dialogRef.close(response);
                    } else {
                        swal({
                            type: 'warning',
                            title: this.translate.instant('NEW_SCHOOL.MESSAGE.FAILED'),
                            text: this.translate.instant('NEW_SCHOOL.MESSAGE.FAILED_MSG'),
                            confirmButtonText: 'ok'
                        });
                    }
                });
        } else {
            // CREATE NEW SCHOOL
            if (!this.isAddRncp) {
                if (this.RNCPTitles.length <= 0) {
                    return;
                }
            }
            this.enableDisableControl(this.isAddRncp);
            if (this.form.invalid) {
                this.enableDisableControl(true);
                return;
            }
            console.log('rncpid:', this.RNCPTitles);
            const data = {
                isSchoolNew: this.isSchoolNew,
                isSchoolCertifier: this.isSchoolCertifier,
                schoolShortName: value.shortName,
                schoolLongName: value.longName,
                schoolid: '',
                isRNCPNew: this.isAddRncp,
                rncpCode: value.codeRncp,
                rncpLevel: value.rncpLevel,
                admtcDirResponsible: value.admtcDirResponsible,
                rncpShortName: value.shortNameRncp,
                rncpLongName: value.longNameRncp,
                specializations: value.specializations,
                schoolAddress: {
                    address1: value.address1,
                    address2: value.address2,
                    postalCode: value.postalCode,
                    city: value.city,
                },
                rncpid: this.RNCPTitles,
                schoolRef: value.schoolRef,
                country: value.country
            };
            this.schoolService.addNewSchoolRncp(data)
                .subscribe(response => {
                    if (response.data) {
                        swal({
                            title: this.translate.instant('NEW_SCHOOL.TITLE'),
                            text: this.translate.instant('NEW_SCHOOL.TEXT', {
                                schoolShortName: data.schoolShortName
                            }),
                            allowEscapeKey: true,
                            type: 'success'
                        }).then(function () {
                            this.dialogRef.close(response);
                        }.bind(this));
                    } else {

                        if (response.message === 'schoolExists') {
                            swal({
                                title: this.translate.instant('NEW_SCHOOL.MESSAGE.schoolExistsTitle'),
                                text: this.translate.instant('NEW_SCHOOL.MESSAGE.schoolExistsText', { schoolShortName: value.shortName }),
                                allowEscapeKey: true,
                                confirmButtonText: this.translate.instant('NEW_SCHOOL.MESSAGE.schoolExistsbutton'),
                                type: 'error'
                            }).then(function () {
                                // this.dialogRef.close(response);
                            }.bind(this));
                        } else {
                            swal({
                                title: 'Oops...',
                                text: this.translate.instant('MailBox.SOME_UNKNOWN_ERROR'),
                                allowEscapeKey: true,
                                type: 'error'
                            }).then(function () {
                                // this.dialogRef.close(response);
                            }.bind(this));
                        }
                    }
                });
        }
        this.enableDisableControl(true);
    }

    addCertifier() {
        this.certifierFormSubmit = true;
        if (this.form.controls['rncpLevel'].valid && this.form.controls['shortNameRncp'].valid
            && this.form.controls['longNameRncp'].valid && this.form.controls['codeRncp'].valid) {
            const CodeRNCP = this.form.controls['codeRncp'].value;
            const longName = this.form.controls['longNameRncp'].value;
            const shortName = this.form.controls['shortNameRncp'].value;
            const level = this.form.controls['rncpLevel'].value;
            const address1 = this.form.controls['address1'].value;
            const address2 = this.form.controls['address2'].value;
            const postalCode = this.form.controls['postalCode'].value;
            const city = this.form.controls['city'].value;
            const schoolRef = this.form.controls['schoolRef'].value;
            const country = this.form.controls['country'].value;
            const admtcDirResponsible = this.form.controls['admtcDirResponsible'].value;

            this.TotalCertifierList.push({
                rncpCode: CodeRNCP,
                rncpLevel: level,
                admtcDirResponsible: admtcDirResponsible,
                shortName: shortName,
                longName: longName,
                schoolAddress: {
                    address1: address1,
                    address2: address2,
                    postalCode: postalCode,
                    city: city
                },
                schoolRef: schoolRef,
                country: country
            });
            this.CertifierList.push({
                text: shortName,
                id: CodeRNCP
            });
            this.selectedCertifierList.push({
                text: shortName,
                id: CodeRNCP
            });
            this.form.controls['assignedCertifier'].setValue(this.selectedCertifierList);
            this.isAddRncp = false;
            this.certifierFormSubmit = false;
            // this.form.controls['codeRncp'].reset();
            // this.form.controls['longNameRncp'].reset();
            // this.form.controls['shortNameRncp'].reset();
            // this.form.controls['rncpLevel'].reset();
            // this.form.controls['address1'].reset();
            // this.form.controls['address2'].reset();
            // this.form.controls['postalCode'].reset();
            // this.form.controls['city'].reset();


        }
    }

    changeCertifier(event) {
        console.log(event);
    }

    changeSelection(event) {
        if (event.value) {
            switch (event.value) {
                case 'certifier':
                    this.isCertifier = true;
                    this.isSchoolCertifier = true;
                    this.CertifierSelection['selected'];

                    this.isAddRncp = true;
                    this.isCertifier = false;
                    this.isRncpAutoComplete = false;
                    this.RNCPTitles = '';
                    this.form.controls['codeRncp'].setValue('');
                    this.form.controls['shortNameRncp'].setValue('');
                    this.form.controls['longNameRncp'].setValue('');
                    this.form.controls['rncpLevel'].setValue('');
                    this.form.controls['admtcDirResponsible'].setValue('');
                    this.form.controls['schoolRef'].setValue('');
                    this.form.controls['country'].setValue('');
                    // this.form.controls['address1'].setValue('');
                    // this.form.controls['address2'].setValue('');
                    // this.form.controls['postalCode'].setValue('');
                    // this.form.controls['city'].setValue('');
                    break;
                case 'preparation-center':
                    this.isCertifier = false;
                    this.isSchoolCertifier = false;
                    this.isRncpAutoComplete = true;
                    this.isAddRncp = false;
                    break;
            }
        }
    }

    changeRNCP(event) {
        // this.RNCPTitles = [];
        if (event) {
          this.RNCPTitles.push(event.id);

          // Add specializations of selected RNCP and if spec is already there don't add the specialization again
          const selectedRNCP = this.rncpListWithFullObj.find(rncp =>  rncp._id === event.id);
          if (selectedRNCP && selectedRNCP.specializations && selectedRNCP.specializations.length > 0) {
            for (const spec of selectedRNCP.specializations) {
              const isSpecInSpecializationsArray = this.specializations.find(s => spec._id === s._id)
              if (!isSpecInSpecializationsArray) {
                this.specializations.push({_id: spec._id, name: spec.name});
              }
            }
          }

        }
    }

    fillRNCP() {
        this.service.getAllRNCPTitlesShortName().subscribe((response) => {
            const RNCP = response.data;
            this.rncpListWithFullObj = response.data;
            this.RNCPTitleList = [];
            RNCP.forEach((item) => {
                this.RNCPTitleList.push({
                    text: item.shortName,
                    id: item._id
                });
            });
        });
    }

    rncpRemoveEvent(event) {
      console.log(event);
      this.RNCPTitles = this.RNCPTitles.filter(rncp => rncp !== event.id);
      const selectedSpecializations = [...this.form.controls['specializations'].value];
      let selectedSpecializationsCopy = [...selectedSpecializations]; // Copy variable of selectedSpecializations
      const removedRNCPFullObj = this.rncpListWithFullObj.find(rncp => event.id === rncp._id);

      // Logic for removing selected specializations
      if (selectedSpecializations.length && removedRNCPFullObj && removedRNCPFullObj.specializations.length) {
        removedRNCPFullObj.specializations.forEach((removedRncpSpec, i) => {
          selectedSpecializations.forEach((selectedSpec, j) => {
            if (removedRncpSpec._id === selectedSpec._id) {
              selectedSpecializationsCopy = selectedSpecializationsCopy.filter(ss => selectedSpec._id !== ss._id);
            }
          });
        });
        this.form.controls['specializations'].setValue(selectedSpecializationsCopy);
      }

      // Logic for removing available specializations
      const diff = _.differenceBy(this.specializations, removedRNCPFullObj.specializations, '_id');
      this.specializations = diff;

    }

    getRNCPofSpec(specId) {
      for (const rncp of this.rncpListWithFullObj) {
        if (rncp.specializations && rncp.specializations.length > 0) {
          const rncpFound = _.find(rncp.specializations, {'_id': specId});
          if (rncpFound) {
            return rncp.shortName;
          }
        }
      }
    }

    disableCheckSpecializations(spec) {
      if (this.selectedSchoolDetails && this.selectedSchoolDetails.specializations.length > 0) {
        const findSpecFromSchool = _.find(this.selectedSchoolDetails.specializations, {'_id': spec._id});
        if (findSpecFromSchool && findSpecFromSchool.hasOwnProperty('isSpecializationAssigned')) {
          return spec.isSpecializationAssigned;
        }
      }
      return false;
    }

    getRncpAdmtcDir() {
      this.rncpService.getRncpAdmtcDir().subscribe(
        (dataDirList) => {
          if (dataDirList.data && dataDirList.data.length) {
            this.admtcDirList = dataDirList.data;
          }
      });
    }

    getNameOfDir(user) {
      const fullName = `${this.utilityService.computeCivility(user.sex, this.translate.currentLang)
                        } ${user.firstName} ${user.lastName}`;
      return fullName;
    }

}
