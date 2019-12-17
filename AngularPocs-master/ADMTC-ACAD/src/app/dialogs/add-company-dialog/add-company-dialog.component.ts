import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Country } from '../../models/country.model';
import { Company } from '../../models/company.model';
import { UserService } from '../../services/users.service';
import { CompanyService } from '../../services/company.service';
import { CountryData } from '../../components/student/country';
declare var swal: any;

@Component({
    selector: 'app-add-company-dialog',
    templateUrl: './add-company-dialog.component.html',
    styleUrls: ['./add-company-dialog.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvents($event)'
    }
})
export class AddCompanyDialogComponent implements OnInit {
    form: FormGroup;
    company: Company;
    companyID: any;
    countryCode = [];
    afterSubmit:boolean = false;
    schoolId: string = '' ;
    CountrySearchString: string = 'France';
    constructor(private dialogRef: MdDialogRef<AddCompanyDialogComponent>,
        private translate: TranslateService, private service: UserService, private companyService: CompanyService, private _fb: FormBuilder) {
    }


    payroll: any[] = [
        { value: 'Yes', view: 'Yes' },
        { value: 'No', view: 'No' }
    ];

    tax: any[] = [
        { value: 'Yes', view: 'Yes' },
        { value: 'No', view: 'No' }
    ]

    capitalTypes: any[] = [
        { value: "EUR", view: "EUR" },
        { value: "USD", view: "USD" },
    ]

    countryList: any[] = CountryData.CountryList;
    allCountry = CountryData.CountryList;

    ngOnInit() {
        console.log( this.schoolId );
        this.form = new FormGroup({
            companyName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
            brand: new FormControl('', Validators.maxLength(40)),
            typeOfCompany: new FormControl('', Validators.maxLength(40)),
            noRC: new FormControl('', Validators.maxLength(40)),
            capital: new FormControl(''),
            activity: new FormControl('', Validators.maxLength(40)),
            noOfEmployeeInFrance: new FormControl('', Validators.maxLength(40)),
            payroll: new FormControl(''),
            taxLearning: new FormControl(''),
            capitalType: new FormControl(''),
            location: new FormControl([]),
            addresses: this._fb.array([
                this.initAddress(),
            ])
        });
    }

    handleKeyboardEvents(event: KeyboardEvent) {
        if (event.keyCode == 27) {
            this.cancel(event.keyCode);
        }
    }

    cancel(company) {
        console.log("companyName",company);
        this.dialogRef.close(company);
    }

    cancelForm(){
        this.dialogRef.close();
    }

    getAddressesArray() { return <FormArray>this.form.get('addresses'); }

    initAddress() {
        return this._fb.group({
            AddressLine1: ['', [Validators.required, Validators.maxLength(500)]],
            AddressLine2: ['', [Validators.maxLength(500)]],
            ZipCode: ['', [Validators.maxLength(5),Validators.required, Validators.pattern('[0-9]{5}')]],
            City: ['', [Validators.required, Validators.maxLength(58)]],
            Country: ['1', [Validators.required, Validators.maxLength(58)]]
        });
    }

    addAddress() {
        const control = <FormArray>this.form.controls['addresses'];
        control.push(this.initAddress());
    }

    removeAddress(i: number) {
        const control = <FormArray>this.form.controls['addresses'];
        control.removeAt(i);
    }

    addCompany() {

      let formvalue = this.form.value;
        if (this.form.valid) {
            this.afterSubmit = true;
            this.company = new Company();

            Object.assign(this.company, this.form.value)

            //formvalue.location = formvalue.addresses;
            console.log(formvalue);
            formvalue.addresses.forEach((element,i) => {
              element.Country = this.countryCode[i];
            });
            formvalue.noOfEmployeeInFrance = formvalue.noOfEmployeeInFrance.toString();
            formvalue.schoolId = this.schoolId ;
            this.companyService.addCompanies(formvalue).subscribe(res => {
              if (res) {
                  if (res.code === 200) {
                      swal({
                          title: this.translate.instant('COMPANY.MESSAGE.TITLE'),
                          text: this.translate.instant('COMPANY.MESSAGE.COMPANY_ADD_SUCCESS'),
                          type: 'success',
                          allowEscapeKey:true,
                          confirmButtonText: this.translate.instant('COMPANY.MESSAGE.COMPANY_ADD_SUCCESS_BUTTON')
                      }).then(function () {
                          this.cancel(res.data);
                      }.bind(this));
                  }
                  else {
                      swal({
                          title: 'Attention',
                          text: this.translate.instant(res.message),
                          allowEscapeKey:true,
                          type: 'warning'
                      });
                  }

              }
          }, (error) => {
              swal({
                title: 'Attention',
                text: this.translate.instant('USERS.MESSAGE.USERUPDATEFAILED'),
                allowEscapeKey:true,
                type: 'warning'
               });
          });


            // swal({
            //     title: 'Success',
            //     text: this.translate.instant('COMPANY.MESSAGE.COMPANYADDSUCCESS'),
            //     type: 'success',
            //     confirmButtonText: 'OK'
            // }).then(function () {
            //     this.dialogRef.close(this.company);
            // }.bind(this));
            //        swal(
            //            'Attention',
            //            this.translate.instant('USERS.MESSAGE.USERUPDATEFAILED'),
            //            'warning'
            //        );
        }
    }

    searchCountryList(event) {
      if (this.CountrySearchString.length > 1 ) {
        const val = event.target.value.toLowerCase();
        const temp = this.countryList.filter(function (d) {
          return (
            (d.countryName !== '' && d.countryName.toLowerCase().indexOf(val) !== -1));
        });
        this.countryList = temp;
      } else {
        this.countryList = this.allCountry;
      }
    }

    selectedCountry(country,i){
      this.countryCode[i] = country.id;
      this.countryCode[i+1] = country.id;
    }

}
