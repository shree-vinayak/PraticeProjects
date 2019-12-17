import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//import { contactMdl } from '../../../../model/contact';
import { CustomValidators } from 'ng2-validation';
import { CustomerService } from '../../../customer.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './contact-popup.component.html',
  styleUrls: ['./contact-popup.component.scss'],
})
export class ContactPopupComponent implements OnInit {

  public contactform : FormGroup;
  // roles = {
  //   "Academic Comitee" : "Customer.AddContact.AcademicComitee",
  //   "Headmaster" : "Customer.AddContact.Headmaster",
  //   "President of Jury" : "Customer.AddContact.PresidentOfJury",
  //   "Signatory" :
  // }
  cId;
  roles = [];
  rolesId=[];
  rolesEdit=[];
  autocompleteRole=[];
  errorMessage: String='';
  private subscription : Subscription;
  costumerId: string;
  contactData:any;
  editingMode: boolean=false;
  contactId: string;
  data;
   //@Inject(MD_DIALOG_DATA) private data: {customerId:string, contactData:any};
  constructor( 
 // @Inject(MD_DIALOG_DATA) private data: {customerId:string, contactData:any},
    public dialogRef: MdDialogRef<ContactPopupComponent>,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private customerService : CustomerService,
             

      ) {

      this.getRoles();
      console.log(this.data);
      this.data = {customerId:this.cId, contactData:null}
      if(this.data.contactData){
        // console.log(this.data.contactData._id);
        this.editingMode=true;
        this.contactId=this.data.contactData._id;
      }
      this.buildFormGroup();
    }

  ngOnInit(): void {
    console.log(this.cId);
this.route.params.subscribe(params => {
       console.log(params,"params")
    });
    // console.log(this.dialogRef, this.dialog);
    this.costumerId=this.data.customerId;
    this.contactData=this.data.contactData;
    // console.log(this.contactData);
    if(this.contactData!=null){
      //console.log("Editing contact mode");
      this.patchContactValue();
    }
    this.getAutocomplete();
    // console.log(this.data.customerId);

  }

  getRoles(){
    this.roles=this.customerService.getRoles();
  }

  buildFormGroup(){
    this.contactform = this.fb.group({
        title: [{value: '', disabled:this.editingMode}, Validators.required],
        position: ['', Validators.required],
        firstName: [{value: '', disabled:this.editingMode}, Validators.required],
        lastName: [{value: '', disabled:this.editingMode}, Validators.required],
        phone: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
        mobile: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
        directLinePortable: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
        email: ['', Validators.compose([Validators.required, CustomValidators.email])],
        roleAdmtc: ['', Validators.required]
      });
  }

  patchContactValue(){
    // console.log("patching value", this.contactform.value);
    this.getRoleAdmtc();
    this.contactform.patchValue({
      title : this.contactData.title,
      position: this.contactData.position,
      firstName: this.contactData.firstName,
      lastName: this.contactData.lastName,
      phone: this.contactData.landlinePhone,
      mobile: this.contactData.mobilePhone,
      email: this.contactData.email,
      roleAdmtc: this.rolesEdit,
    })
    this.contactform.controls.title.disabled;
    // console.log("After patching value :", this.contactform)
  }

  getAutocomplete(){
    this.customerService.getAutoComplete('academic')
      .subscribe(
        (data)=>{
          // console.log(data);
          this.autocompleteRole=data;
        }
      );
  }

  getRoleAdmtc(){
    for(let userType of this.contactData.userTypes){
      // console.log(userType);
      this.rolesEdit.push(userType.name);
    }
    // console.log(this.rolesEdit);
  }

  getCustomersRolesId(){
    const rolesAdd = this.contactform.controls.roleAdmtc.value;
    // console.log(rolesAdd, this.autocompleteRole);
    for(let roleId of this.autocompleteRole){
      for(let role of rolesAdd){
        if(roleId.name==role){
          this.rolesId.push(roleId._id);
        }
      }
    }
    // console.log(this.rolesId);
  }

  createContact(data: any){
    // console.log(data);
    this.customerService.createContact(data)
      .subscribe(
        (data)=>{
          let response = data;
          if (response.code == 400) {
            let msg = response.message;
            this.errorMessage = msg;
            // console.log('message: ', this.errorMessage);
          }
          else {
            // console.log(response);
            this.dialogRef.close();
          }
        }
      )
  }

  updateContact(data: any){
    // console.log(data);
    this.customerService.updateContact(this.contactId, data)
      .subscribe(
        (data)=>{
          let response = data;
          if (response.code == 400) {
            let msg = response.message;
            this.errorMessage = msg;
            // console.log('message: ', this.errorMessage);
          }
          else {
            // console.log(response);
            this.dialogRef.close({result : response});
          }
        }
      )
  }

  save(data /*contactform : contactMdl*/){

    // console.log(data);

    if(this.contactform.valid){
      // console.log("Add contact form is valid");

      const title = this.contactform.controls.title.value;
      const position = this.contactform.controls.position.value;
      const firstName = this.contactform.controls.firstName.value;
      const lastName = this.contactform.controls.lastName.value;
      const landlinePhone = this.contactform.controls.phone.value;
      const mobilePhone = this.contactform.controls.mobile.value;
      const directPhone = this.contactform.controls.directLinePortable.value;
      const email = this.contactform.controls.email.value;
      this.getCustomersRolesId();
      const userTypes = this.rolesId;
      // console.log(userTypes);
      const schools = [this.costumerId];

      const data = ({
        title, firstName, lastName, position, userTypes, email, mobilePhone, landlinePhone,
        directPhone, schools
      })

      if(this.editingMode){
        this.updateContact(data);
      } else {
        this.createContact(data);
      }
    }

     else {
      // console.log("Add contact form is not valid")
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
