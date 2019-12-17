import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MailService } from 'app/services/mail.service';
import { ComposeMailComponent } from './../compose-mail/compose-mail.component';
import 'rxjs/Rx';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { EmailDetailComponent } from './../email-detail/email-detail.component';
import { DatePipe } from '@angular/common';
import { ReplyMailComponent } from '../reply-mail/reply-mail.component';
import { ForwardMailComponent } from '../forward-mail/forward-mail.component';
import { ReplyAllMailComponent } from '../reply-all-mail/reply-all-mail.component';
import { Mail } from 'app/models/mail';
import { Page } from 'app/models/page.model';
import { Sort } from 'app/models/sort.model';
import { Files } from 'app/shared/global-urls';
import { LoginService } from 'app/services/login.service';
import { DialogsService } from '../confirm-dialog/dialogs.service';
import { AddUrgentMessageComponent } from 'app/dialogs/add-urgent-message-dialog/add-urgent-message-dialog.component';
import swal from 'sweetalert2';
import { setInterval } from 'timers';
import { UtilityService } from 'app/services/utility.service';
import _ from 'lodash';
import { ResizeSvc } from 'app/shared/resize_svc';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-mail',
  templateUrl: './list-mail.component.html',
  styleUrls: ['./list-mail.component.scss'],
  providers: [MailService, DatePipe, DialogsService,ResizeSvc],
  encapsulation: ViewEncapsulation.None,
})
export class ListMailComponent implements OnInit, OnDestroy {

  @ViewChild('SearchTool') SearchTool: any;

  IsReplyBtn = false;
  IsReplyAllBtn = false;
  IsForwardBtn = false;
  IsDeleteBtn = false;
  IsImportantBtn = false;
  IsMovetoInboxBtn = false;
  reorderable = true;
  hideResetButton = false;

  isSearching = false;

  inboxCount = 0;
  importantCount = 0;

  mailCountFlag: Subscription;
  mailListSearchItem = '';
  searchSchoolItem = '';
  searchTitleItem = '';
  searchSalesItem = '';
  searchDealItem = '';
  emailDetails = [];


  addUrgentMessageDialogComponent: MdDialogRef<AddUrgentMessageComponent>;
  mailsList = [];
  getCountOfCC = [];
  recpList = [];
  ccList = [];
  totalMailList = [];
  page = new Page();
  sort = new Sort();
  isbtnShown = false;

  mailCategories = [
    {
      key: 'inbox',
      name: 'INBOX',
      icon: 'fa-inbox'
    },
    {
      key: 'sent',
      name: 'SENT',
      icon: 'fa-paper-plane'
    },
    {
      key: 'important',
      name: 'IMPORTANT',
      icon: 'fa-hand-paper-o'
    },
    {
      key: 'draft',
      name: 'DRAFT',
      icon: 'fa-archive'
    },
    {
      key: 'trash',
      name: 'TRASH',
      icon: 'fa-trash'
    }
  ];
  selectedMailCategory = 'inbox';
  selectedMails = [];

  ngxDtCssClasses = {
    sortAscending: 'fa fa-caret-up',
    sortDescending: 'fa fa-caret-down',
    pagerLeftArrow: 'icon-left',
    pagerRightArrow: 'icon-right',
    pagerPrevious: 'icon-prev',
    pagerNext: 'icon-skip'
  }
  composeMailDialogRef: MdDialogRef<ComposeMailComponent>;
  emailDetailDialogRef: MdDialogRef<EmailDetailComponent>;
  composeMailDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '800px',
    height: '530px'
  };

  configCat: MdDialogConfig = {
    disableClose: false,
    width: '600px',
    backdropClass: 'urgentMsg-backdrop'
  };

  myControl = new FormControl();
  arr_SalesStaff = new Array<SalesStaff>();
  arr_school = new Array<School>();
  arr_title = new Array<Title>();
  arr_deal = new Array<Deal>();
  filteredSalesStaff: Observable<SalesStaff[]>;
  filteredSchool: Observable<School[]>;
  filteredTitle: Observable<Title[]>;
  filteredDeal: Observable<Deal[]>;


  viewMessageData = {};
  viewSingleMessageData;

  mailCategory: string;
  userId: string;

  senderId: string;
  senderName: string;
  senderEmail: string;

  recipientId: string;
  receipientName: string;
  receipientEmail: string;
  subject: string;
  message: string;
  messageDate: string;

  isAdmin: boolean;
  user: any = {};

  mailDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '720px',
    height: '530px'
  };
  display_GROUP_EMAIL = false;
  private resizeSvc: ResizeSvc;
  isMobileView = false;

  public replyMailDialogRef: MdDialogRef<ComposeMailComponent>;
  public forwardMailDialogRef: MdDialogRef<ComposeMailComponent>;
  public replyAllMailDialogRef: MdDialogRef<ComposeMailComponent>;

  public result: any;
  isAutorized = false;
  constructor(
    private MailService: MailService,
    private utility: UtilityService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private dialogsService: DialogsService,
    public translate: TranslateService,
    private loginService: LoginService,
    private datePipe: DatePipe,
    private configService: ConfigService,
    pResizeSvc:ResizeSvc,) {
      this.resizeSvc = pResizeSvc;
  }

  getCivility(value): string {
    if (value) {
      return this.utility.computeCivility(value, this.translate.currentLang);
    } else {
      return '';
    }
  }

  resetSearch() {
    if (this.SearchTool) {
      this.SearchTool.nativeElement.value = '';
    }
    this.getMails();
  }

  ngOnDestroy() {
    this.mailCountFlag.unsubscribe();
  }
  ngOnInit() {

    this.resizeSvc.layout.subscribe((val) => {
      console.log('resizeSvc layout ' + val);

        if (val === 'xs' || val === 'sm'){
          this.isMobileView = true;
        }else{
          this.isMobileView = false;
        }



    });

    this.page.pageNumber = 0;
    this.page.size = 20;
    this.page.totalElements = 0;
    this.sort.sortby = 'createdAt';
    this.sort.sortmode = 'desc';
    this.getMails();
    this.updateUnreadCount();
    const mailCounter = Observable.interval(300000);
    this.mailCountFlag = mailCounter.subscribe(() => {
      this.updateUnreadCount();
    });
    /******************for sales staff filter*********************/
    this.filteredSalesStaff = this.myControl.valueChanges
      .startWith(null)
      .map(date => date && typeof date === 'object' ? date.name : date)
      .map(name => name ? this.filterSalesStaff(name) : this.arr_SalesStaff.slice());

    /******************for position filter*********************/
    this.filteredSchool = this.myControl.valueChanges
      .startWith(null)
      .map(from => from && typeof from === 'object' ? from.name : from)
      .map(name => name ? this.filterSchool(name) : this.arr_school.slice());

    /******************for sales filter*********************/
    this.filteredTitle = this.myControl.valueChanges
      .startWith(null)
      .map(to => to && typeof to === 'object' ? to.name : to)
      .map(name => name ? this.filterTitle(name) : this.arr_title.slice());

    /******************for sales filter*********************/
    this.filteredDeal = this.myControl.valueChanges
      .startWith(null)
      .map(subject => subject && typeof subject === 'object' ? subject.name : subject)
      .map(name => name ? this.filterDeal(name) : this.arr_deal.slice());

    this.getConfigDetails();
  }

  checkWhichMailsRead() {
    if(this.totalMailList) {
      var currentUser = this.loginService.getLoggedInUser();
      this.totalMailList.forEach((mail, index) => {
        mail.recipientProperty.forEach((recipientProp) => {
          recipientProp.recipient.forEach((recipient) => {
            if(recipient == currentUser.email
                || (recipient.mail && recipient.mail == currentUser.email)){
              mail.IsCheckReadFlag = recipientProp.isRead;
            }
          });
        })
      });
    }
  }

  getFileName(fileName: String): string {
    if (fileName) {
      return fileName.substring(fileName.lastIndexOf('/') + 1);
    }
    return '';
  }

  downloadFile(fileName: String) {
    const a = document.createElement('a');
    a.target = 'blank';
    a.href = Files.url + fileName;
    a.download = this.getFileName(fileName);
    a.click();
  }
  filterSalesStaff(name: string): SalesStaff[] {
    return this.arr_SalesStaff.filter(option => new RegExp(`^${name}`, 'gi').test(option.name));
  }
  displaySalesStaff(salesStaff: SalesStaff): string {
    return salesStaff ? salesStaff.name : null;
  }
  filterSchool(name: string): School[] {
    return this.arr_school.filter(option => new RegExp(`^${name}`, 'gi').test(option.name));
  }
  displaySchool(from: School): string {
    return from ? from.name : '';
  }
  filterTitle(name: string): Title[] {
    return this.arr_title.filter(option => new RegExp(`^${name}`, 'gi').test(option.name));
  }
  displayTitle(to: Title): string {
    return to ? to.name : '';
  }
  filterDeal(name: string): Deal[] {
    return this.arr_deal.filter(option => new RegExp(`^${name}`, 'gi').test(option.name));
  }
  displayDeal(subject: Deal): string {
    return subject ? subject.name : '';
  }
  public openDialog(data) {
    let title = 'Are you sure?';
    let message = 'You are about to delete this message';
    if (this.translate.currentLang === 'fr') {
      title = 'tes-vous sr?';
      message = 'Vous allez supprimer ce message';
    }
    const thisOnDelete = this.onDeleteMail;
    // console.log(data._id);
    // console.log(this.selectedMails);
    this.selectedMails = [];
    this.selectedMails.push({ '_id': data._id });
    // console.log(this.selectedMails);
    const self = this;
    const thisMailService = this.MailService;
    swal({
      title: this.translate.instant('MailBox.MESSAGES.ATTENTION'),
      text: this.translate.instant('MailBox.MESSAGES.ASKMSG'),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('MailBox.MESSAGES.YES'),
      cancelButtonText: this.translate.instant('MailBox.MESSAGES.NO')
    }).then(function () {
      const userIdList = [];
      userIdList.push(data._id);
      // console.log(userIdList);


      let dataPost = {};

      if (self.selectedMailCategory === 'inbox' || self.selectedMailCategory === 'important') {
        dataPost = {
          'ids': userIdList,
          'recipientProperty': {
            'mailType': 'trash'
          }
        };
      }
      if (self.selectedMailCategory === 'sent' || self.selectedMailCategory === 'draft') {
        dataPost = {
          'ids': userIdList,
          'senderProperty': {
            'mailType': 'trash'
          }
        };
      }

      if (self.selectedMailCategory === 'trash') {
        dataPost = {
          'ids': userIdList,
          'recipientProperty': {
            'mailType': 'deleted'
          }
        };
      }

      thisMailService.updateMail(dataPost).map((data) => {
        const response = data.json();
        swal({
          title: self.translate.instant('MailBox.MESSAGES.DELETED'),
          text: self.translate.instant('MailBox.MESSAGES.DELMSG'),
          allowEscapeKey: true,
          type: 'success',
          confirmButtonText: self.translate.instant('MailBox.MESSAGES.OK'),
        });
        self.viewMessageData = {};
        self.selectedMails = [];
        self.getMails();
        self.selectedMails = [];
        return data;

      }).subscribe(() => {
        self.updateUnreadCount();
      });


    }, function (dismiss) {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      if (dismiss === 'cancel') {

      }
    });
  }

  getMails(): void {
    this.selectedMails = [];
    const self = this;
    this.MailService
      .getMails(this.selectedMailCategory, this.page, this.sort)
      .then(mailsData => {
        if (mailsData.code === 200) {
          this.isAutorized = true;
          this.page.totalElements = mailsData.total;
          // this.mailsList = mailsData.data;
          this.getCivilityFromMail(mailsData.data);
          this.totalMailList = mailsData.data;
          this.checkWhichMailsRead();
         // this.filterMailListsOnSalesStaff({}, true);
          this.arr_SalesStaff = [];
          this.arr_school = [];
          this.arr_title = [];
          this.arr_deal = [];
          const SalesStafflist = this.totalMailList.map(function (item) {
            return (item.senderProperty && item.recipientProperty && item.senderProperty.sender && item.recipientProperty.recipient);
          }).filter((x, i, a) => a.indexOf(x) === i);
          const SchoolList = this.totalMailList.map(function (item) {
            return (item.senderProperty && item.senderProperty.sender);
          }).filter((x, i, a) => a.indexOf(x) === i);
          const TitleList = this.totalMailList.map(function (item) {
            return (item.senderProperty && item.recipientProperty && item.senderProperty.title && item.recipientProperty.title);
          }).filter((x, i, a) => a.indexOf(x) === i);
          const DealList = this.totalMailList.map(function (item) { return item.subject; }).filter((x, i, a) => a.indexOf(x) === i);
          // console.log('********** SalesStafflist ****************');
          // console.log(SalesStafflist);
          this.setusertype();
          for (const entry of SalesStafflist) {
            const ss = new SalesStaff(entry);
            this.arr_SalesStaff.push(ss);
          }
          for (const entry of SchoolList) {
            const ss = new School(entry);
            this.arr_school.push(ss);
          }
          for (const entry of TitleList) {
            const ss = new Title(entry);
            this.arr_title.push(ss);
          }
          for (const entry of DealList) {
            const ss = new Deal(entry);
            this.arr_deal.push(ss);
          }
          self.updateUnreadCount();
        } else {
          swal({
            title: 'Warning',
            html: mailsData.message,
            type: 'warning',
            showCancelButton: false,
            allowEscapeKey: true,
            confirmButtonText: this.translate.instant('SETTINGS.USERTYPES.S1.Ok')
          });
        }
      });
  }

  updateUnreadCount() {
    this.MailService.countUnreadMailbyMailType('unread', 'inbox').subscribe((response) => {
      if (response.hasOwnProperty('count')) {
        this.inboxCount = response.count;
      }
    });
    this.MailService.countUnreadMailbyMailType('all', 'important').subscribe((response) => {
      if (response.hasOwnProperty('count')) {
        this.importantCount = response.count;
      }
    });
  }

  changePage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.getMails();
  }

  sortPage(sortInfo): void {
    if (this.mailsList.length > 0) {
      this.sort.sortby = sortInfo.column.prop;
      this.sort.sortmode = sortInfo.newValue;
      this.page.pageNumber = 0;
      this.getMails();
    }
  }

  mailRowActivated($event): void {
    if ($event.type === 'click' && $event.cellIndex !== 0) {
      if ($event.row) {
        this.onSelectMessage($event.row);
      }
    }
    // event.type=='dblclick' && this.openAddEditTaskDialog(event.row._id);
    // console.log(event)
  }

  onMailSelected({ selected }) {
    /*this.selectedMails.splice(0, this.selectedMails.length);
    this.selectedMails.push(...selected);*/
    this.selectedMails = selected;
    if (this.selectedMails.length > 0) {
      this.IsDeleteBtn = true;
      this.IsImportantBtn = true;
      this.isbtnShown = true;

      if (this.selectedMailCategory === 'inbox') {
        this.IsImportantBtn = true;
      } else {
        this.IsImportantBtn = false;
      }

      if (this.selectedMailCategory === 'important') {
        this.IsMovetoInboxBtn = true;
      } else {
        this.IsMovetoInboxBtn = false;
      }

    } else {
      this.IsDeleteBtn = false;
      this.IsImportantBtn = false;
      this.isbtnShown = false;
      this.IsMovetoInboxBtn = false;
    }
    console.log('Select Event', selected, this.selectedMails);

  }

  // this function execute when we click to delete mail
  onDeleteMail() {

   console.log(this.selectedMails)

    const userIdList = [];
    this.selectedMails.forEach(function (recipient) {
      userIdList.push(recipient._id);
    });
    let dataPost = {};

    if (this.selectedMailCategory === 'inbox' || this.selectedMailCategory === 'important') {
      dataPost = {
        'ids': userIdList,
        'recipientProperty': {
          'mailType': 'trash'
        }
      };
    }
    if (this.selectedMailCategory === 'sent' || this.selectedMailCategory === 'draft') {
      dataPost = {
        'ids': userIdList,
        'senderProperty': {
          'mailType': 'trash'
        }
      };
    }

    if (this.selectedMailCategory === 'trash') {
      dataPost = {
        'ids': userIdList,
        'recipientProperty': {
          'mailType': 'deleted'
        }
      };
    }

    let title = 'Are you sure?';
    let message = 'You are about to delete this message';
    if (this.translate.currentLang === 'fr') {
      title = 'tes-vous sr?';
      message = 'Vous allez supprimer ce message';
    }
    const self = this;
    const thisMailService = this.MailService;

    swal({
      title: this.translate.instant('MailBox.MESSAGES.ATTENTION'),
      text: this.translate.instant('MailBox.MESSAGES.ASKMSG'),
      type: 'warning',
      showCancelButton: true,
      allowEscapeKey: true,
      confirmButtonText: this.translate.instant('MailBox.MESSAGES.YES'),
      cancelButtonText: this.translate.instant('MailBox.MESSAGES.NO')
    }).then(function () {
      thisMailService.updateMail(dataPost).map((data) => {
        const response = data.json();
        swal({
          title: self.translate.instant('MailBox.MESSAGES.DELETED'),
          text: self.translate.instant('MailBox.MESSAGES.DELMSG'),
          allowEscapeKey: true,
          type: 'success',
          confirmButtonText: self.translate.instant('MailBox.MESSAGES.OK'),
        });
        self.getMails();
        self.updateUnreadCount();
        self.selectedMails = [];
        return data;
      }).subscribe();
    }, function (dismiss) {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      if (dismiss === 'cancel') {
      }
    });


  }

  // this function execute when we click to Important Mail
  MailMoveTo(mailType) {
    console.log(mailType)
    if (mailType) {
      const userIdList = [];
      console.log(this.selectedMails)
      this.selectedMails.forEach(function (recipient) {
        userIdList.push(recipient._id);
      });
      const dataPost = {
        'ids': userIdList,
        'recipientProperty': {
          'mailType': mailType
        }
      };

      const self = this;
      // code to call the api call ..need to write yet
      this.MailService.updateMail(dataPost).map((data) => {
        const response = data.json();
        this.getMails();
        return data;
      }).subscribe(() => {
        self.updateUnreadCount();
        self.selectedMails = [];
      });

    }
  }

  changeSelectedMailCategory(mailCategory: string) {

    console.log(mailCategory)
    this.selectedMailCategory = mailCategory;
    this.sort.sortby = 'createdAt';
    this.sort.sortmode = 'desc';
    this.page.pageNumber = 0;
    this.mailListSearchItem = '';
    this.IsDeleteBtn = false;
    this.IsImportantBtn = false;
    this.IsMovetoInboxBtn = false;
    this.isbtnShown = false;
    this.resetSearch();
    this.viewMessageData = {};
  }

  // code to search from Mail List
  searchMailList() {
    // code to get the mails List based on parameter search
    // if (this.mailListSearchItem != "") {
    //  var list= this.mailsList;
    //   this.mailsList = this.totalMailList.filter(b => b.subject == this.mailListSearchItem
    //   || b.updatedAt==this.mailListSearchItem
    //   || b.sender.fullName==this.mailListSearchItem

    //   // || b.recipient!=null ? b.recipient.fullName==this.mailListSearchItem : false
    //   || b.updatedAt==this.mailListSearchItem

    //   );
    // }
    // else {
    //   this.mailsList = this.totalMailList;
    // }

    /// modified filter boby in mail box to filter by from,to and subject
    //  if (this.mailListSearchItem != "") {
    //    this.mailsList= this.totalMailList.filter((v) => {
    //           if (v.recipient!=null) {
    //             if( v.recipient.fullName.toLowerCase()==this.mailListSearchItem.toLowerCase()){
    //                return true;
    //             }
    //           }
    //           if(v.subject.toLowerCase() == this.mailListSearchItem.toLowerCase() ||
    // v.updatedAt.toLowerCase() == this.mailListSearchItem.toLowerCase() ||
    // v.sender.fullName.toLowerCase() == this.mailListSearchItem.toLowerCase()) {
    //             return true;
    //           }
    //       });
    //  }
    // else {
    //        this.mailsList=this.totalMailList
    //      }

    // Latest Modified method for filtering Date,From,to and subject In mail-box list

    if (this.mailListSearchItem !== '') {

      this.mailsList = this.totalMailList.filter((v) => {
        if (v.recipient != null) {
          if (v.recipient.fullName.toLowerCase().indexOf(this.mailListSearchItem.toLowerCase()) !== -1) {
            return true;
          }
        }
        if (v.subject.toLowerCase().indexOf(this.mailListSearchItem.toLowerCase()) !== -1
          || v.updatedAt.toLowerCase().indexOf(this.mailListSearchItem.toLowerCase()) !== -1
          || v.sender.fullName.toLowerCase().indexOf(this.mailListSearchItem.toLowerCase()) !== -1) {
          return true;
        }
      });
    } else {
      this.mailsList = this.totalMailList;
    }
  }

  filterMailLists() {

    if (this.searchSchoolItem === '' && this.searchSchoolItem === '' && this.searchSchoolItem === '' && this.searchSchoolItem === '') {
      // need to write the code when all filter fields are empty
    }
    else {
      //  this.mailsList = this.totalMailList.filter(b => b.subject == this.searchSchoolItem
      //                 || b.status==this.searchTitleItem
      //                 || b.status==this.searchSalesItem
      //                 || b.status==this.searchDealItem

      // );

    }

  }

  showFullEmailDetails(id: any) {
    this.emailDetails = this.totalMailList.filter(m => m._id === id);
    this.composeMailDialogConfig.data = {};
    this.emailDetailDialogRef = this.dialog.open(EmailDetailComponent, this.composeMailDialogConfig);
    if (this.emailDetails.length > 0) {

      this.emailDetailDialogRef.componentInstance.mailCategory = this.selectedMailCategory;
      this.emailDetailDialogRef.componentInstance.userId = this.emailDetails[0]._id;
      this.emailDetailDialogRef.componentInstance.senderId = this.emailDetails[0].sender != null ? this.emailDetails[0].sender._id : '';
      this.emailDetailDialogRef.componentInstance.senderEmail = this.emailDetails[0].sender != null ? this.emailDetails[0].sender.email : '';
      this.emailDetailDialogRef.componentInstance.senderName = this.emailDetails[0].sender != null ? this.emailDetails[0].sender.fullName : '';
      this.emailDetailDialogRef.componentInstance.recipientId = this.emailDetails[0].recipient != null ? this.emailDetails[0].recipient._id : '';
      this.emailDetailDialogRef.componentInstance.receipientEmail = this.emailDetails[0].recipient != null ? this.emailDetails[0].recipient.email : '';
      this.emailDetailDialogRef.componentInstance.receipientName = this.emailDetails[0].recipient != null ? this.emailDetails[0].recipient.fullName : '';
      this.emailDetailDialogRef.componentInstance.subject = this.emailDetails[0].subject;
      this.emailDetailDialogRef.componentInstance.message = this.emailDetails[0].message;
      this.emailDetailDialogRef.componentInstance.messageDate = this.emailDetails[0].createdAt;
    }

    // this.composeMailDialogRef.afterClosed().subscribe(result => {
    //   if(result == 'updateMailList') {
    //     this.getMails();
    //   }
    //   this.emailDetailDialogRef = null;
    // });
  }

  openComposeMailDialog(isGroupEmail = false) {
    this.composeMailDialogConfig.data = {};
    this.composeMailDialogRef = this.dialog.open(ComposeMailComponent, this.composeMailDialogConfig);
    this.composeMailDialogRef.componentInstance.tags = ['compose-new'];
    // this.composeMailDialogRef.componentInstance.isGroupEmail = isGroupEmail;
    if (isGroupEmail) {
      this.composeMailDialogRef.componentInstance.setGroupEmailCondition();
    }
    this.composeMailDialogRef.afterClosed().subscribe(result => {
      if (result === 'updateMailList') {
        this.getMails();
      }
      this.composeMailDialogRef = null;
    });
  }

  updateToReadFlag(_id: string) {
    var self = this;
    if (this.selectedMailCategory.toString() === 'inbox' || this.selectedMailCategory.toString() === 'important') {
      // var mailData: any = Object.assign({}, this.viewMessageData);
      // Object assign will only do a shallow copy and cannot be used here.
      var mailData: any = _.cloneDeep(this.viewMessageData);
      delete mailData.$$index;
      var currentUser = this.loginService.getLoggedInUser();
      var changeNeeded = false;
      if (mailData.recipientProperty && currentUser) {
         mailData.recipientProperty.forEach((recipientProperty) => {
          recipientProperty.recipient.forEach((recipient) => {
            if (recipientProperty.isRead == false && ( (recipient.email === currentUser.email) || (recipient === currentUser.email) )) {
              recipientProperty.isRead = true;
              changeNeeded = true;
            }
            recipientProperty.recipient = [recipient.email];
          })
        });
      }
      if(changeNeeded) {
        if (mailData.senderProperty && mailData.senderProperty.sender && mailData.senderProperty.sender.email) {
          mailData.senderProperty.sender = mailData.senderProperty.sender.email;
        }
        this.MailService.updateSingleMail(mailData).subscribe(() => {
          self.updateUnreadCount();
          self.getMails();
        });
      }
    };
  }


  onSelectMessage(data) {
    this.viewMessageData = data;

    this.getCountOfCC = data.recipientProperty;


    this.recpList = [];
    this.ccList = [];

    this.getCountOfCC.forEach((elem, index) => {
      if (elem.rank === 'a') {
        this.recpList.push(elem);
      }
      if(elem.rank === 'cc') {
        this.ccList.push(elem);
      }
    });

    if (this.selectedMailCategory === 'draft') {
      this.OpenDraftPopUp(this.viewMessageData);
    }

    this.mailsList.forEach((elem, index) => {
      if (elem['_id'] === this.viewMessageData['_id']) {
        this.viewMessageData['$$index'] = index;
      }
    });
    /* Updating unread to read */
    this.updateToReadFlag(data._id);
  }

  OpenDraftPopUp(MailData) {
    if (MailData._id) {
      this.composeMailDialogConfig.data = {};
      this.composeMailDialogRef = this.dialog.open(ComposeMailComponent, this.composeMailDialogConfig);
      this.composeMailDialogRef.componentInstance.isDraftMail = true;
      this.composeMailDialogRef.componentInstance.DraftData = MailData;
      this.composeMailDialogRef.afterClosed().subscribe(result => {
        if (result === 'updateMailList') {
          this.getMails();
        }
        this.composeMailDialogRef = null;
      });
    }
  }

  onPreviousMessage(data) {
    if (this.viewMessageData && this.viewMessageData['$$index'] !== 0) {
      const currentIndex = this.viewMessageData['$$index'] - 1;
      this.viewMessageData = this.mailsList[currentIndex];
      this.viewMessageData['$$index'] = currentIndex;
      this.updateToReadFlag(this.viewMessageData['_id']);
    }
  }
  onNextMessage(data) {
    if (this.viewMessageData && (this.viewMessageData['$$index'] + 1) < this.mailsList.length) {
      const currentIndex = this.viewMessageData['$$index'] + 1;
      this.viewMessageData = this.mailsList[currentIndex];
      this.viewMessageData['$$index'] = currentIndex;
      this.updateToReadFlag(this.viewMessageData['_id']);
    }
  }
  checkIsPreviousBtnShow() {
    let prevBtn = this.viewMessageData['$$index'] === 0 ? false : true;
    return prevBtn;
  }
  checkIsNextBtnShow() {
    return this.viewMessageData['$$index'] === this.mailsList.length - 1 ? false : true;
  }

  // this function execute when reply, reply all, forward icon is clicked
  // data : it should accept Mail Data.
  // tag : it accept which type of mail is this.
  OpenMailPopupRequest(data, tag) {
    this.mailDialogConfig.data = {};
    this.replyMailDialogRef = this.dialog.open(ComposeMailComponent, this.mailDialogConfig);
    this.replyMailDialogRef.componentInstance.tags = [tag];
    this.replyMailDialogRef.componentInstance.currentMailData = data;
    console.log("data", data);
    if (this.selectedMailCategory === 'sent') {
      this.replyMailDialogRef.componentInstance.isSenderReq = false;
    }

    this.replyMailDialogRef.afterClosed().subscribe(result => {
      if (result === 'updateMailList') {
        this.getMails();
      }
      this.replyMailDialogRef = null;
    });
  }

  getSenderFullName(sender) {
    const senders = sender;
    if (senders) {
      if (senders.sender) {
        if (senders.sender.hasOwnProperty('email')) {
          const recObj = senders.sender;
          return this.getCivility(recObj.sex) + ' ' + recObj.firstName + ' ' + recObj.lastName;
        } else {
          return senders.recipient;
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  getRecipientFullName(recipient) {
    const recipients = recipient;
    if (recipients) {
      if (recipients.recipient[0]) {
        if (recipients.recipient[0].hasOwnProperty('email')) {
          const senderObj = recipients.recipient[0];
          return this.getCivility(senderObj.sex) + ' ' + senderObj.firstName + ' ' + senderObj.lastName;
        } else {
          return recipients.recipient[0];
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  //  /*Filter Function - Start*/
  filterMailListsOnSalesStaff(event, SearchTool = false) {
    let val = '';
    if (SearchTool) {
      if (this.SearchTool) {
        val = this.SearchTool.nativeElement.value.toLowerCase();
      }
    } else {
      val = event.target.value.toLowerCase();
    }
    // const val = event.target.value.toLowerCase();
    const self = this;
    // console.log('Value Data', val);
    if (val !== null || val !== undefined) {
      this.hideResetButton = true;
      const temp = this.totalMailList.filter(function (d) {
        return ((self.getSenderFullName(d.senderProperty) && self.getSenderFullName(d.senderProperty).toString().toLowerCase().indexOf(val) !== -1)
          || (self.getRecipientFullName(d.recipientProperty[0]).toString().toLowerCase().indexOf(val) !== -1)
          || (d.subject.toString().toLowerCase().indexOf(val) !== -1)
          || (d.message.toString().toLowerCase().indexOf(val) !== -1));
      });
      this.mailsList = temp;
    }
  }

  filterMailListsFrom(event) {
    const val = event.target.value.toLowerCase();
    if (val != null || val !== undefined) {
      this.hideResetButton = true;
      const temp = this.totalMailList.filter(function (d) {
        return (d.sender.fullName.toString().toLowerCase().startsWith(val.toString().toLowerCase()));
      });
      this.mailsList = temp;
    }
  }

  filterMailListsTitle(event) {
    const val = event.target.value.toLowerCase();
    if (val != null || val !== undefined) {
      this.hideResetButton = true;
      const temp = this.totalMailList.filter(function (d) {
        return (d.sender.title.toString().toLowerCase().startsWith(val.toString().toLowerCase())
          || d.recipient.title.toString().toLowerCase().startsWith(val.toString().toLowerCase()));
      });
      this.mailsList = temp;
    }
  }

  getCivilityFromMail(data) {
    try {
      const mailIdsList = [];
      const self = this;
      if (data) {
        data.forEach((mail) => {
          if (mail.senderProperty) {
            if (mail.senderProperty.sender) {
              if (mailIdsList.indexOf(mail.senderProperty.sender) === -1) {
                mailIdsList.push(mail.senderProperty.sender);
              }
            }
          }
          if (mail.recipientProperty) {
            mail.recipientProperty.forEach((receiver) => {
              if (receiver.recipient) {
                receiver.recipient.forEach((ids) => {
                  if (mailIdsList.indexOf(ids) === -1) {
                    mailIdsList.push(ids);
                  }
                });
              }
            });
          }
        });
        // console.log(mailIdsList);
        if (mailIdsList.length > 0) {
          this.MailService.findMailCivility(mailIdsList).subscribe((response) => {
            const emailList = response.data;
            if (emailList) {
              emailList.forEach((mail) => {
                self.updateCivility(mail.email, mail);
              });
            }
            self.mailsList = self.totalMailList;
            self.filterMailListsOnSalesStaff({}, true);
          });
        }
      } else {
        this.mailsList = data;
      }
    } catch (e) {
      this.mailsList = data;
    }
  }

  updateCivility(mailId, AccDetails) {
    if (mailId && AccDetails) {
      const self = this;
      this.totalMailList.forEach((data, index) => {
        if (data.senderProperty.sender) {
          if (!Array.isArray(data.senderProperty.sender)) {
            if (data.senderProperty.sender === mailId) {
              self.totalMailList[index].senderProperty.sender = AccDetails;
            }
          }
        }
        if (data.recipientProperty) {
          data.recipientProperty.forEach((receiver, rcIndex) => {
            if (receiver.recipient) {
              receiver.recipient.forEach((id, idIndex) => {
                if (!Array.isArray(id)) {
                  if (id === mailId) {
                    self.totalMailList[index].recipientProperty[rcIndex].recipient[idIndex] = AccDetails;
                  }
                }
              });
            }
          });
        }
      });
      // console.log(self.totalMailList);
    }
  }

  filterMailListsDeal(event) {
    const val = event.target.value.toLowerCase();
    if (val != null || val !== undefined) {
      this.hideResetButton = true;
      const temp = this.totalMailList.filter(function (d) {
        return (d.subject.toString().toLowerCase().startsWith(val.toString().toLowerCase()));
      });
      this.mailsList = temp;
    }
  }

  clearSearch(event) {
    this.myControl.reset();
    this.hideResetButton = false;
    this.getMails();
  }
  closeViewMailBox() {
    this.viewMessageData = {};
  }

  rowClass = (row) => {
    return {
      'selected-row-table': this.viewMessageData && row ? row._id === this.viewMessageData['_id'] : false
    };
  }


  setusertype() {
    this.user = localStorage.getItem('loginuser');
    // console.log('User: MailBox', this.user);
    if (this.user !== undefined && this.user) {
      this.user = JSON.parse(this.user);
    }
    if (this.user !== undefined && this.user) {
      if (this.user.email !== '') {
        if (this.user.entity.type === 'admtc') {

          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
    }
  }
  openUrgentMailDialog() {
    this.addUrgentMessageDialogComponent = this.dialog.open(AddUrgentMessageComponent, this.configCat);
    this.addUrgentMessageDialogComponent.afterClosed().subscribe((status) => {
      if (status) {
        // this.GetAllTasks();
      }
    });
  }
  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    return this.datePipe.transform(date, 'fullDate');
  }

  getTranslateUserType(name) {
    let value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  getConfigDetails() {
    this.configService.getConfigDetails().subscribe(
      (data) => {
        if (data.notifications) {
          this.display_GROUP_EMAIL = data.menu ? data.menu.GROUP_EMAIL : false;
        }
      },
      (error) => {
        console.log('getConfigDetails data', error);
      }
    );
  }
}
export class SalesStaff {
  name: string;
  constructor(uname: string) {
    this.name = uname;
  }
}
export class School {
  name: string;
  constructor(uname: string) {
    this.name = uname;
  }
}
export class Title {
  name: string;
  constructor(uname: string) {
    this.name = uname;
  }
}
export class Deal {
  name: string;
  constructor(uname: string) {
    this.name = uname;
  }
}
