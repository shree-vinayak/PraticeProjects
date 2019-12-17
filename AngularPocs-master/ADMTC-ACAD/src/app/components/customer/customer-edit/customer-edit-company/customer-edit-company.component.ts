import { Component, OnInit } from '@angular/core';
import {CustomerService} from '../../customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MdDialog, MdDialogRef, MdDialogConfig} from '@angular/material';
import {CompanyPopupComponent} from './company-popup/company-popup.component';

@Component({
  selector: 'lk-admtc-customer-edit-company',
  templateUrl: './customer-edit-company.component.html',
  styleUrls: ['./customer-edit-company.component.scss']
})
export class CustomerEditCompanyComponent implements OnInit {

  taxSalaryChecked: boolean = false;
  customerId: string;
  private customer: any;
  companyEditForm: FormGroup;
  errorMessage: string;
  private subscription: Subscription;
  legalTypes = ["SAS", "Association loi 1901", "Sarl ", "SA", "Eurl", "Selarl", "SASU", "SNC"];
  currencies = ["EUR", "USD"];
  titles = ["mr", "mrs", "ms"];
  roles = [];
  showAmount = false;
 public dialog: MdDialogRef<CompanyPopupComponent>;
  constructor(private customerService: CustomerService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog1: MdDialog,
              private fb: FormBuilder) {
    this.getRoles();
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      params => {
        if (params.hasOwnProperty('customerId')) {
          this.customerId = params['customerId'];
          this.getCustomer(this.customerId);
        } else {
          this.errorMessage = 'There is no parameter';
        }
      });
  }

  getRoles(){
    this.roles=this.customerService.getRoles();
  }
    popupConfig: MdDialogConfig;


  makeProfile(){
    this.popupConfig= {
      // data:{
      //   customerId: this.customerId
      //   // contactData: this.editContact
      // },
      disableClose: false,
      width: '350px',
      height: '350px',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      }
    };
  }




      openCompanyPopup() {
    // console.log(this.popupConfig);
    this.makeProfile();
    this.dialog = this.dialog1.open(CompanyPopupComponent, this.popupConfig);
    this.dialog.afterClosed().subscribe(result => {
      // console.log('this is the pop up after add a contact in customers', result);
      this.onNewCertifications=null;
      this.getCustomer(this.customerId);
    });
  }


   onNewCertifications() {
    this.openCompanyPopup();
  }


  getCustomer(customerId) {
    this.customerService.getCustomer(customerId)
      .subscribe(
        customer => {
          this.customer = customer;
          // console.log(this.customer);
          if(this.customer.taxStatus){
          this.taxSalaryChecked = this.customer.taxStatus.salaryTax;
        }
          this.initForm();
        }
      );
  }

  checkLegalRepresentative(lr) {
    if (lr == null) {
      return this.fb.group({
        title: '',
        position: '',
        firstName: '',
        lastName: '',
        landlinePhone: '',
        mobilePhone: '',
        directPhone: '',
        email: '',
        roleAdmtc: '',
      })
    } else {
        return this.fb.group({
          title: this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalRepresentative.title : "",
          position: this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalRepresentative.position : "",
          firstName: this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalRepresentative.firstName : "",
          lastName: this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalRepresentative.lastName : "",
          landlinePhone: this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalRepresentative.landlinePhone : "",
          mobilePhone: this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalRepresentative.mobilePhone : "",
          directPhone: this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalRepresentative.directPhone : "",
          email: this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalRepresentative.email : "",
          roleAdmtc: this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalRepresentative.roleAdmtc : "",
        })
    }
  }

  initForm() {
    // console.log("bhavik company cer");
        // console.log( this.customer.legalDetails.certifications);
    this.companyEditForm = this.fb.group({

      identity: this.fb.group({
        companyName: this.customer && this.customer.legalDetails ? this.customer.legalDetails.companyName : "",
        legalType:  this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalType : "",
        capitalAmmount:  this.customer && this.customer.legalDetails ? this.customer.legalDetails.capitalAmmount : "",
        capitalCurrency:  this.customer && this.customer.legalDetails ? this.customer.legalDetails.capitalCurrency : "",
        siretNumber:  this.customer && this.customer.legalDetails ? this.customer.legalDetails.siretNumber : "",
        professionalRegistrationNumber:  this.customer && this.customer.legalDetails ? this.customer.legalDetails.professionalRegistrationNumber : "",
        certifications:  this.customer && this.customer.legalDetails ? this.customer.legalDetails.certifications : "",
      }),
      legalRepresentative: this.checkLegalRepresentative(this.customer && this.customer.legalDetails ? this.customer.legalDetails.legalRepresentative : ""),
      taxes: this.fb.group({
        apprenticeTax: this.customer && this.customer.taxStatus ? this.customer.taxStatus.apprenticeTax : "",
        vatTaxable: this.customer && this.customer.taxStatus ? this.customer.taxStatus.vatTaxable : "",
        salaryTax:this.customer && this.customer.taxStatus ?  this.customer.taxStatus.salaryTax : "",
        salaryTaxAmmount: this.customer && this.customer.taxStatus ? this.customer.taxStatus.salaryTaxAmmount : "",
        capitalCurrency: this.customer && this.customer.legalDetails ? this.customer.legalDetails.capitalCurrency : ""
      })
    });
  }

  onUpdateSchool(myForm) {

    // console.log(myForm);

    let shortName = this.customer.shortName;
    let longName = this.customer.longName;

    let companyName = myForm.identity.companyName;
    let legalType = myForm.identity.legalType;
    let capitalAmmount = myForm.identity.capitalAmmount;
    let capitalCurrency = myForm.identity.capitalCurrency;
    let siretNumber =  myForm.identity.siretNumber;
    let professionalRegistrationNumber = myForm.identity.professionalRegistrationNumber;
    let certifications = []; // it is pending

    let apprenticeTax = myForm.taxes.apprenticeTax;
    let vatTaxable = myForm.taxes.vatTaxable;
    let salaryTax = myForm.taxes.salaryTax;
    let salaryTaxAmmount = myForm.taxes.salaryTaxAmmount;

    let legalDetails = ({
      companyName, legalType, capitalAmmount, capitalCurrency, siretNumber, professionalRegistrationNumber, certifications
    });

    let taxStatus = ({
      apprenticeTax, vatTaxable, salaryTax, salaryTaxAmmount
    })

    let customer = ({
      shortName, longName, legalDetails, taxStatus
    })

    this.customerService.updateCustomer(this.customer._id, customer)
      .subscribe((data) => {
        let response = data;
        if (response.code == 400) {
          let msg = response.message;
          this.errorMessage = msg;
          // console.log('message: ', this.errorMessage);
        }
        else {
          // console.log(response);
          this.getCustomer(response.data._id);
          //this.customer = response.data;
        }
        //return data;
      });

    // console.log("bhavik company ");
    // console.log(myForm);
  }

  onCheckSalaryTax(){
    if(!this.taxSalaryChecked){
      this.taxSalaryChecked=true;
    }else{
      this.taxSalaryChecked=false;
    }
  }
}
