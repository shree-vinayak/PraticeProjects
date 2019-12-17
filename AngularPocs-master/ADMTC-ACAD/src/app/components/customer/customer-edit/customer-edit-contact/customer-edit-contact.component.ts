import { log } from 'util';
import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {CustomerService} from '../../customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MdDialog, MdDialogRef, MdDialogConfig} from '@angular/material';
import {ContactPopupComponent} from './contact-popup/contact-popup.component';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Page } from '../../../../models/page.model';
import { Sort } from '../../../../models/sort.model';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';

@Component({
  selector: 'lk-admtc-customer-edit-contact',
  templateUrl: './customer-edit-contact.component.html',
  styleUrls: ['./customer-edit-contact.component.scss']
})
export class CustomerEditContactComponent implements OnInit {
   rncpTitles: any = [];
   page = new Page();
  sort = new Sort();
  reorderable = true;
  customerId;
  contacts: any[];
  TotalContactList : any[];
  roles = [];
  errorMessage: string;
  private subscription: Subscription;
  selectedOption: string;
  editContact: any[];

  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  };

  public dialog: MdDialogRef<ContactPopupComponent>;
  lastCloseResult: string;
   ContactListSearchItem = "";
  popupConfig: MdDialogConfig;;

  constructor(private customerService: CustomerService,
              private service: RNCPTitlesService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog1: MdDialog,
              private translate: TranslateService
              ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 100;
    this.page.totalPages = 10;
    this.sort.sortby = '';
    this.sort.sortmode = 'asc';

     }

  ngOnInit() {

      this.service.resetState();
    // this.getTitleList();

    this.subscription = this.route.params.subscribe(
      params => {
        console.log(params);
        if (params.hasOwnProperty('customerId')) {
          this.customerId = params['customerId'];
          this.getCustomer(this.customerId);

        } else {
          this.errorMessage = 'There is no parameter';
        }
      });
    this.getRoles();
  }

  searchContactList(event) {
    if (this.ContactListSearchItem != "") {
      const val = event.target.value.toLowerCase();
      const temp = this.TotalContactList.filter(function (d) {
        return (
          (d.firstName != '' && d.firstName.toLowerCase().indexOf(val) !== -1));
      });
      this.contacts = temp;
    } else {
      this.contacts = this.TotalContactList;
    }
  }
  getRoles(){
    this.roles=this.customerService.getRoles();
  }

   changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.getTitleList();
  }


  getTitleList(): void {
    this.customerService.getContactList(this.page, this.sort).then((titles) => {

      this.rncpTitles = titles.data;
      this.page.totalElements = titles.total;
    });
  }

   sortPage(sortInfo): void {
    this.sort.sortby = sortInfo.column.prop;
    this.sort.sortmode = sortInfo.newValue;
    this.page.pageNumber = 0;
    this.getTitleList();
  }

  makeProfile(){
    this.popupConfig= {
      data:{
        customerId: this.customerId,
        contactData: this.editContact,
      },
      disableClose: false,
      width: '450px',
      height: '400px',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      }
    };
  }

  getCustomer(customerId) {
    console.log('customer call')
    this.customerService
      .getCustomer(customerId)
      .subscribe(
        customer => {
          this.contacts = customer.users;
          this.TotalContactList = customer.users;

         // this.rncpTitles = customer.rncpTitles;
          console.log('this.contacts');
          console.log(this.contacts);
        },
        error =>  this.errorMessage = <any>error
      );
  }

  /*getRoles() {
    this.customerService.getRoles()
      .subscribe(
        roles => {
          this.roles = roles;
        },
        error =>  this.errorMessage = <any>error
      );
  }*/

  openContactPopup() {
    console.log(this.popupConfig);
    this.makeProfile();
    this.dialog = this.dialog1.open(ContactPopupComponent, this.popupConfig);
    this.dialog.componentInstance.cId = this.customerId;
    this.dialog.afterClosed().subscribe(result => {
      console.log('this is the pop up after add a contact in customers', result);
      this.dialog = null;
      this.editContact=null;
      this.getCustomer(this.customerId);
    });
  }

  onNewContact() {
    this.openContactPopup();
  }

  onSendMessage(data){
     console.log(data);
    this.editContact=data;
   this.openContactPopup();
  }

  onEditContact(data) {
    console.log(data);
    this.editContact=data;
    this.openContactPopup();
  }

  onDeleteContact(data) {
    console.log(data);
    if (confirm(this.translate.instant("Customer.EditContact.ConfirmDeleteContact") + data.fullName + '?') == true){
      // console.log("delete contact! Id : ", data);
      this.customerService.deleteContact(data._id)
        .subscribe(
          (data)=>{
            let response = data;
            if (response.code == 400) {
              let msg = response.message;
              this.errorMessage = msg;
              console.log('message: ', this.errorMessage);
            }
            else {
              console.log(response);
              this.getCustomer(this.customerId);
            }
          }
        )
    }
  }

  onDeleteRole(data, role){
    console.log("click on delete role", "Contact :", data, "role", role);
    if (confirm(this.translate.instant("Customer.EditContact.ConfirmDeleteRole") +
        role +
        this.translate.instant("Customer.EditContact.for") +
        data.position + " " + data.fullName + "?") == true){
      let i : number = 0;
      for(let userType of data.userTypes){
        if(userType.name==role){
          // console.log(i);
          data.userTypes.splice(i, 1);
          console.log("After remove", data);
          this.updateContact(data);
          return;
        }
        i++;
      }
    }
  }

  updateContact(data){
    console.log(data);
    data["schools"] = [this.customerId];
    const contactId = data._id;
    delete data._id;
    delete data.avatar;
    console.log(data);
    this.customerService.updateContact(contactId, data)
      .subscribe(
        (data)=>{
          let response = data;
          if (response.code == 400) {
            let msg = response.message;
            this.errorMessage = msg;
            console.log('message: ', this.errorMessage);
          }
          else {
            console.log(response);
            this.getCustomer(this.customerId);
          }
        }
      )
  }

  sendMessage(data){
    console.log('Send Message'+data);
  }

  EditUser(data){
    console.log('Edit Contact'+data);
  }

  DeleteUser(data){
    if(confirm('Are you sure You want to delete this contact?')){
      // this.row.splice(,1);
      console.log('Delete Bhavik Contact'+data);
    }

  }






}
