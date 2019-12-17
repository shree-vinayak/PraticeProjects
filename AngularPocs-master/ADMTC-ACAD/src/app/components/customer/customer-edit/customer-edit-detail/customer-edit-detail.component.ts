import { Component, OnInit } from '@angular/core';
import {CustomerService} from '../../customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from "ng2-validation";

@Component({
  selector: 'lk-admtc-customer-edit-detail',
  templateUrl: './customer-edit-detail.component.html',
  styleUrls: ['./customer-edit-detail.component.scss']
})
export class CustomerEditDetailComponent implements OnInit {

  customerId: string;
  customer: any;
  detailEditForm: FormGroup;
  errorMessage: string;
  private subscription: Subscription;
  addAddress: boolean=false;
  titles = ["mr", "mrs", "ms"];
  roles = [];
  // private schoolDetailDaata;

  constructor(private customerService: CustomerService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder) { }

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
    this.getRoles();
  }

  getRoles(){
    this.roles=this.customerService.getRoles();
  }

  getCustomer(customerId) {
    this.customerService.getCustomer(customerId)
      .subscribe(
        customer => {
          this.customer = customer;
          console.log(this.customer);
          this.initForm();
        }
      );
  }

  checkNull(myVar) {
    if (myVar === null) {
      return '';
    } else { return myVar; }
  }

  checkHeadmaster(headmaster) {
    if (headmaster == null) {
      return this.fb.group({
        title: '',
        firstName: '',
        lastName: '',
        position: '',
        userTypes: '',
        email: '',
        mobilePhone: '',
        landlinePhone: '',
        directPhone: '',
        avatar: '',
        schools: '' // school id
      })
    } else {
        return this.fb.group({
          title: this.customer.addresses != null ? this.customer.addresses[0].headmaster.title : '',
          firstName: this.customer.addresses != null ? this.customer.addresses[0].headmaster.firstName : '',
          lastName: this.customer.addresses != null ? this.customer.addresses[0].headmaster.lastName : '',
          position: this.customer.addresses != null ? this.customer.addresses[0].headmaster.position : '',
          userTypes: this.customer.addresses != null ? this.customer.addresses[0].headmaster.userTypes : '',
          email: this.customer.addresses != null ? this.customer.addresses[0].headmaster.email : '',
          mobilePhone: this.customer.addresses != null ? this.customer.addresses[0].headmaster.mobilePhone : '',
          landlinePhone: this.customer.addresses != null ? this.customer.addresses[0].headmaster.landlinePhone : '',
          directPhone: this.customer.addresses != null ? this.customer.addresses[0].headmaster.directPhone : '',
          avatar: this.customer.addresses != null ? this.customer.addresses[0].headmaster.avatar : '',
          schools: this.customer._id
        })
    }
  }

  initForm() {
    this.detailEditForm = this.fb.group({
      identity: this.fb.group({
        shortName: this.customer.shortName,
        longName: this.customer.longName,
        belongToGroup: this.customer.belongToGroup,
        groupName: this.customer.groupName,
        logo: this.checkNull(this.customer.logo)
      }),
      addresses: this.fb.group({
        address: this.customer.addresses != null ? this.customer.addresses[0].address : '',
        postCode: this.customer.addresses != null && this.customer.addresses[0].city ? this.customer.addresses[0].city.postcode : '',
        city: this.customer.addresses != null && this.customer.addresses[0].city ? this.customer.addresses[0].city.cityName : '',
        country: this.customer.addresses != null ? this.customer.addresses[0].country : '',
        fax: this.customer.addresses != null ? this.customer.addresses[0].fax : '',
        phoneNumber: this.customer.addresses != null ? this.customer.addresses[0].phoneNumber : '',
        uaiCode: this.customer.addresses != null ? this.customer.addresses[0].uaiCode : ''

      }),
      headmaster: this.checkHeadmaster(this.customer.addresses != null ? this.customer.addresses[0].headmaster : ''),
      socialAddresses: this.fb.group({
        webUrl: this.customer.socialAddresses != null ? this.customer.socialAddresses[0].webUrl : '',
        email: this.customer.socialAddresses != null ? this.customer.socialAddresses[0].email : '',
        facebookUrl: this.customer.socialAddresses != null ? this.customer.socialAddresses[0].facebookUrl : '',
        twitterUrl: this.customer.socialAddresses != null ? this.customer.socialAddresses[0].twitterUrl : '',
        googleUrl: this.customer.socialAddresses != null ? this.customer.socialAddresses[0].googleUrl : '',
        instagramUrl: this.customer.socialAddresses != null ? this.customer.socialAddresses[0].instagramUrl : '',
        vimeoUrl: this.customer.socialAddresses != null ? this.customer.socialAddresses[0].vimeowebUrl : '',
        viadeoUrl: this.customer.socialAddresses != null ? this.customer.socialAddresses[0].viadeoUrl : '',
        linkedinUrl: this.customer.socialAddresses != null ? this.customer.socialAddresses[0].linkedinUrl : '',
        youtubeUrl: this.customer.socialAddresses != null ? this.customer.socialAddresses[0].youtubeUrl : ''
      })
    });
  }



  onUpdateSchool(myForm) {
    console.log(myForm);
    //let detailEditForm = myForm.value;


  // schoolDetailDaata = {

  //    address : myForm.addresses.address,
  //    city : myForm.addresses.city._id,
  //    country : myForm.addresses.country,
  //    phoneNumber :myForm.addresses.phoneNumber,
  //    fax : myForm.addresses.fax,
  //    uaiCode : myForm.addresses.uaiCode,
  //    postCode: myForm.addresses.postCode,
  // };

    console.log("BHavik School Detail");
    console.log(myForm);

    let schoolId = this.customer._id;
    let shortName = myForm.identity.shortName;
    let longName = myForm.identity.longName;
    let belongToGroup = myForm.identity.belongToGroup;
    let groupName = myForm.identity.groupName;
    let logo =  myForm.identity.logo;
    let socialAddresses = myForm.socialAddresses;
    let addresses = myForm.addresses;

    // let address = myForm.addresses.address;
    // let city = myForm.addresses.city._id;
    // let country = myForm.addresses.country;
    // let phoneNumber = myForm.addresses.phoneNumber;
    // let fax = myForm.addresses.fax;
    // let uaiCode= myForm.addresses.uaiCode;
    // let mainAddress = true;
    // ,uaiCode,address,fax,city,phoneNumber, country

    let title = myForm.headmaster.title;
    let firstName = myForm.headmaster.firstName;
    let lastName = myForm.headmaster.lastName;
    let position = myForm.headmaster.position;
    let email = myForm.headmaster.email;
    let mobilePhone = myForm.headmaster.mobilePhone;
    let landlinePhone = myForm.headmaster.landlinePhone;
    let directPhone = myForm.headmaster.directPhone;
    let schools = [schoolId];
    let addressId = this.customer.addresses[0]._id;
    //let userTypes = myForm.contact.userType;
    let userTypes = ['58f48bf85f45c48343c08f1c'] // headmaster

    const CUSTOMER = ({
      shortName, longName,belongToGroup,addresses, groupName, logo, socialAddresses
    });

    if (this.customer.addresses[0].headmaster == null) {
      let headmaster = ({
        title, firstName, lastName, position, email, mobilePhone, landlinePhone, directPhone, schools, userTypes
      });
      this.createHeadmaster(schoolId, addressId, headmaster)
    } else {
      let headmasterId = this.customer.addresses[0].headmaster._id;
      let headmaster = ({
        title, firstName, lastName, position, email, mobilePhone, landlinePhone, directPhone
      });
      this.updateHeadmaster(headmasterId, headmaster);
    }

    this.customerService.updateCustomer(schoolId, CUSTOMER)
      .subscribe((data) => {
        const response = data;
        if (response.code === 400) {
          const msg = response.message;
          this.errorMessage = msg;
          console.log('message: ', this.errorMessage);
        }
        else {
          console.log(response);
          this.getCustomer(response.data._id);
          //this.customer = response.data;
        }
        //return data;
      });
  }

  createHeadmaster (schoolId, addressId, headmaster) {
    console.log('schoolId: ' + schoolId);
    console.log('addressId: ' + addressId);
    this.customerService.createContact(headmaster)
      .subscribe((data) => {
        let response = data;
        if (response.code == 400) {
          let msg = response.message;
          this.errorMessage = msg;
          console.log('message: ', this.errorMessage);
        }
        else {
          console.log(response);
          // update all address data address
          //this.addHeadmasterToAddress(schoolId, addressId, response.data._id);
        }
        //return data;
      });
  }

  updateHeadmaster (headmasterId, headmaster) {
    this.customerService.updateContact(headmasterId, headmaster)
      .subscribe((data) => {
        let response = data;
        if (response.code == 400) {
          let msg = response.message;
          this.errorMessage = msg;
          console.log('message: ', this.errorMessage);
        }
        else {
          console.log(response);
          //this.getCustomer(this.customer._id);
        }
        //return data;
      });
  }

  onAddAddress(){
    console.log("Click on Add Address");
    if(!this.addAddress){
      this.addAddress=true;
    }else{
      this.addAddress=false;
    }
  }

  /*addHeadmasterToAddress(schoolId, addressId, headmasterId) {
    console.log('schoolId: ' + schoolId);
    console.log('addressId: ' + addressId);

    let headmaster = headmasterId;
    let data = ({ headmaster })

    this.customerService.updateAddress(schoolId, headmasterId, data)
      .subscribe((data) => {
        let response = data;
        if (response.code == 400) {
          let msg = response.message;
          this.errorMessage = msg;
          console.log('message: ', this.errorMessage);
        }
        else {
          console.log(response);
          console.log('headmaster inserted in address');
          this.getCustomer(this.customer._id);
        }
        //return data;
      });
  }*/
}
