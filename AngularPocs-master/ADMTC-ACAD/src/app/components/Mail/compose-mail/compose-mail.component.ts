import { Component, OnInit, ViewEncapsulation, Input, Inject, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { LoginService } from 'app/services/login.service';
import { MailService } from 'app/services/mail.service';
import { UtilityService } from 'app/services/utility.service';
import { TranslateService } from 'ng2-translate';
import swal from 'sweetalert2';
import { Mail } from 'app/models/mail';
import { DatePipe } from '@angular/common';
import _ from 'lodash';

// Required for Logging on console
import { Log } from 'ng2-logger';
import { UserService } from '../../../services/users.service';
const log = Log.create('ComposeMailComponent');
log.color = 'purple';

@Component({
  selector: 'app-task',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.scss'],
  providers: [MailService],
  encapsulation: ViewEncapsulation.None,
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})
export class ComposeMailComponent implements OnInit {

  showSubject = true;
  @Input() taskId;
  @ViewChild('myInput')
  currentFile: any;
  student;
  isContactUs = false;
  public currentMailData = [];
  public tags = [];
  private isUrgentFlag = false;
  public isSenderReq = true;

  mail = new Mail();
  recepientsList: Observable<Array<string>>;
  ccrecepientsList: Observable<Array<string>>;
  bccrecepientsList: Observable<Array<string>>;
  isShared = false;
  selectedRecepientsList = [];
  ccselectedRecepientsList = [];
  bccselectedRecepientsList = [];

  selectedUsers = [];

  public isDraftMail = false;
  public DraftData:any = [];

  composeProcess = false;
  composeMailMessage: string;
  public mailForm: FormGroup;
  attachmnetsPaths = [];
  currentUser;
  categoryName: any;
  subjectName: any;
  isSugesstion = false;
  subject: string;
  showCCInput = false;
  showBCCInput = false;

  disableAddEditing = true;
  displayBCC = false;
  displayCC = false;

  // Variables For Group Email 
  isGroupEmail = false;
  rncpTitleList: any[];
  userTypeList: any[];
  userTypeToggle = false;

  constructor(
    private fb: FormBuilder,
    public dialogref: MdDialogRef<ComposeMailComponent>,
    public dialog: MdDialog,
    private translate: TranslateService,
    private utility: UtilityService,
    public snackBar: MdSnackBar,
    private MailService: MailService,
    @Inject(MD_DIALOG_DATA) public data: any,
    private _login: LoginService,
    private userService: UserService
  ) {
    this.mailForm = this.fb.group({
      search_receiver: [],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      cc: ['', []],
      bcc: ['', []]
    });

  }

  ngOnInit(): void {
    this.getRecipients();
    this.getCurrentUser();

    // remove the validation for subject if it is hidden
    if (!this.showSubject) {
      this.mailForm.get('subject').clearValidators();
      this.mailForm.updateValueAndValidity();
      console.log(this.mailForm);
    }

    /* for share mail to 1001 ideas */
    if (this.dialogref.componentInstance.data) {
      if (this.dialogref.componentInstance.data.user) {
        if (this.dialogref.componentInstance.data.user.email) {
          this.isShared = true;
          this.getSignatureForShare();
        }
      }
    }
    if (!this.isShared) {
      this.mailSignature();
    }
    this.CheckforDraft();
    if (this.student) {
      this.MailForStudent();
    }
    if (this.selectedUsers.length) {
      this.MailForUsers();
    }

  }

  CheckforDraft() {
    if (this.isDraftMail) {
      if (this.DraftData && this.DraftData['_id']) {
        this.mailForm.controls['subject'].setValue(this.DraftData['subject']);
        this.composeMailMessage = this.DraftData['message'];
        const self = this;
        this.selectedRecepientsList = [];
        this.ccselectedRecepientsList = [];
        this.bccselectedRecepientsList = [];
        if (this.DraftData['recipientProperty']) {
          const receivers = this.DraftData['recipientProperty'];
          this.LoadRecepient(receivers, ['a', 'c', 'cc']);
        }
        this.LoadAttachments(this.DraftData['attachments']);
        if ( this.DraftData.isGroupParent ) {
          this.userTypeToggle = this.DraftData['userTypeSelection'];
          this.setGroupEmailCondition();
        }
      }
    }
  }

  LoadRecepient(receivers, RecAry, isSenderReq = false) {
    const self = this;
    receivers.forEach((element) => {
      if (element.rank === 'a' && RecAry.indexOf('a') > -1) {
        if (element.recipient[0]) {
          self.selectedRecepientsList.push({
            email: element.recipient[0].email,
            display: element.recipient[0].firstName + ' ' + element.recipient[0].lastName + ' <' + element.recipient[0].email + '>',
            civility: element.recipient[0].civility,
            sex: element.recipient[0].sex
          });
        }
      }
      if (element.rank === 'c' && RecAry.indexOf('c') > -1) {
        self.showBCCInput = true;
        if (element.recipient[0]) {
          self.bccselectedRecepientsList.push({
            email: element.recipient[0].email,
            display: element.recipient[0].firstName + ' ' + element.recipient[0].lastName + ' <' + element.recipient[0].email + '>',
            civility: element.recipient[0].civility,
            sex: element.recipient[0].sex
          });
        }
      }
      if (element.rank === 'cc' && RecAry.indexOf('cc') > -1) {
        self.showCCInput = false;
        if (element.recipient[0]) {
          self.ccselectedRecepientsList.push({
            email: element.recipient[0].email,
            display: element.recipient[0].firstName + ' ' + element.recipient[0].lastName + ' <' + element.recipient[0].email + '>',
            civility: element.recipient[0].civility,
            sex: element.recipient[0].sex
          });
        }
      }
    });

    if (isSenderReq) {
      const sender = this.currentMailData['senderProperty'].sender;
      this.selectedRecepientsList.push({
        email: sender.email,
        display: sender.firstName + ' ' + sender.lastName + ' <' + sender.email + '>',
        civility: sender.civility,
        sex: sender.sex
      });
    }

  }

  MailForUsers() {
    if (this.selectedUsers && this.selectedUsers.length) {

      this.selectedUsers.forEach(element => {
        if (element.rncpTitle && element.rncpTitle.shortName) {
          this.mailForm.controls['subject'].setValue(element.rncpTitle.shortName);
        }
        this.selectedRecepientsList = [];
        this.selectedRecepientsList.push({
          email: element.email,
          display: element.firstName + ' ' + element.lastName + ' <' + element.email + '>',
          civility: element.civility,
          sex: element.sex
        });
      });


    }
  }

  MailForStudent() {
    if (this.student && this.student.hasOwnProperty('_id')) {
      this.composeMailMessage = this.utility.computeCivility(this.student.sex, this.translate.currentLang);
      this.composeMailMessage += ' ' + this.student.firstName + ' ' + this.student.lastName + ' , </br></br></br></br></br>';
      this.composeMailMessage += this.utility.computeCivility(this.currentUser.sex, this.translate.currentLang);
      this.composeMailMessage += ' ' + this.currentUser.firstName + ' ' + this.currentUser.lastName;
      const usertypeName = this.currentUser.types[0].name;
      this.composeMailMessage += ',</br>' + this.translate.instant('ADMTCSTAFFKEY.' + usertypeName.toUpperCase()) + ',</br>';
      if (this.student.rncpTitle && this.student.rncpTitle.shortName) {
        this.mailForm.controls['subject'].setValue(this.student.rncpTitle.shortName);
      }
      this.selectedRecepientsList = [];
      this.selectedRecepientsList.push({
        email: this.student.email,
        display: this.student.firstName + ' ' + this.student.lastName + ' <' + this.student.email + '>',
        civility: this.student.civility,
        sex: this.student.sex
      });
    }
  }
  mailSignature() {
    const self = this;
    this.composeMailMessage = '<br/><br/><br/><br/><br/>';
    this.composeMailMessage += this.utility.computeCivility(this.currentUser.sex, this.translate.currentLang);
    this.composeMailMessage += ' ' + this.currentUser.firstName + ' ' + this.currentUser.lastName;
    if (this.disableAddEditing && this.currentUser && this.currentUser.types &&
        this.currentUser.types[0] && this.currentUser.types.length === 1) {
      const usertypeName = this.currentUser.types[0].name;
      this.composeMailMessage += ',</br>' + this.getTranslateUserType(usertypeName) + ',</br>';
    } else {
      this.composeMailMessage += ',</br>' + this.currentUser.position + ',</br>';
    }
    this.composeMailMessage += ',</br>' + this.currentUser && this.currentUser.entity && this.currentUser.entity.school ? this.currentUser.entity.school.longName : '';
    if (this.tags.indexOf('reply-mail') > -1 && this.currentMailData) {

      this.mailForm.controls['subject'].setValue('RE : ' + this.currentMailData['subject']);
      this.isUrgentFlag = this.currentMailData['isUrgentMail'];
      const receivers = this.currentMailData['recipientProperty'];
      this.LoadRecepient(receivers, [], this.isSenderReq);
      this.LoadAttachments(this.currentMailData['attachments']);
      this.composeMailMessage = this.AddMailBody('Message');

    } else if (this.tags.indexOf('foward-mail') > -1 && this.currentMailData) {

      this.LoadAttachments(this.currentMailData['attachments']);
      this.mailForm.controls['subject'].setValue('FW : ' + this.currentMailData['subject']);
      this.composeMailMessage = this.AddMailBody('Forwarded message');

    } else if (this.tags.indexOf('reply-all') > -1 && this.currentMailData) {

      this.LoadAttachments(this.currentMailData['attachments']);
      this.mailForm.controls['subject'].setValue('RE : ' + this.currentMailData['subject']);
      this.isUrgentFlag = this.currentMailData['isUrgentMail'];
      const receivers = this.currentMailData['recipientProperty'];
      this.LoadRecepient(receivers, ['c', 'cc'], this.isSenderReq);
      this.composeMailMessage = this.AddMailBody('Message');
    }
  }
  /* for share mail to 1001 ideas */
  getSignatureForShare() {


    let body = '<br/><br/>';
    // body += '<br/><br/><br/><br/><br/>';
    body += this.utility.computeCivility(this.currentUser.sex, this.translate.currentLang);
    body += ' ' + this.currentUser.firstName + ' ' + this.currentUser.lastName;
    body += ',</br>' + this.currentUser.position;
    body += '<br/><br/>';
    body += '------------' + 'Forward Message' + '------------';
    body += '<br/><b> ' + this.translate.instant('dashboardMessage.FROM') + '</b> : ';
    body += this.getSenderFullNameShare(this.dialogref.componentInstance.data['user']);
    body += '<br/><b> ' + this.translate.instant('dashboardMessage.TO') + '</b> : ';
    body += this.getRecipientFullNameShare(this.currentUser);
    body += '<br/><b> Date </b> : ' + this.getTranslatedDate(this.data['createdAt']);
    this.categoryName = this.translate.instant(this.dialogref.componentInstance.data.category);
    // this.replyMailForm.controls['subject'].setValue(this.categoryName);
    this.subject = this.categoryName;
    body += '<br/><b> ' + this.translate.instant('MailBox.composeMail.subject') + ' </b> : ' + this.subject;
    body += '<br/><br/>';

    body += this.data['suggestion'];
    this.composeMailMessage = body;
    this.subjectName = this.translate.instant('1001 Ideas');

    this.mailForm.controls['subject'].setValue(this.subjectName + ' : ' + this.subject);
    // return body;

  }
  AddMailBody(Caption) {
    let body = '<br/><br/><br/>';
    body += '------------' + Caption + '------------';
    body += '<br/><b> ' + this.translate.instant('dashboardMessage.FROM') + '</b> : ';
    body += this.getSenderFullName(this.currentMailData['senderProperty']);
    body += '<br/><b> ' + this.translate.instant('dashboardMessage.TO') + '</b> : ';
    body += this.getRecipientFullName(this.currentMailData['recipientProperty'][0]);
    body += '<br/><b> Date </b> : ' + this.getTranslatedDate(this.currentMailData['createdAt']);
    body += '<br/><b> ' + this.translate.instant('MailBox.composeMail.subject') + ' </b> : ' + this.currentMailData['subject'];
    body += '<br/><br/>';
    body += this.currentMailData['message'];
    return body;
  }

  getTranslatedDate(date) {
    const datePipe = new DatePipe(this.translate.currentLang);
    return datePipe.transform(date, 'fullDate');
  }

  getRecipients() {
    this.recepientsList = this.mailForm.controls.search_receiver.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(keyword => {
        if (typeof keyword === 'object') {
          const isAlreadySelected = this.selectedRecepientsList.filter(recipient => recipient.id === keyword.id);
          if (isAlreadySelected.length === 0) {
            this.selectedRecepientsList.push(keyword);
          }
          this.mailForm.controls.search_receiver.setValue(null);
          return [];
        }
        return this.MailService.searchRecipients(keyword);
      });

    this.ccrecepientsList = this.mailForm.controls.cc.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(keyword => {
        if (typeof keyword === 'object') {
          const isAlreadySelected = this.ccselectedRecepientsList.filter(recipient => recipient.id === keyword.id);
          if (isAlreadySelected.length === 0) {
            this.ccselectedRecepientsList.push(keyword);
          }
          this.mailForm.controls.cc.setValue(null);
          return [];
        }
        return this.MailService.searchRecipients(keyword);
      });

    this.bccrecepientsList = this.mailForm.controls.bcc.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(keyword => {
        if (typeof keyword === 'object') {
          const isAlreadySelected = this.bccselectedRecepientsList.filter(recipient => recipient.id === keyword.id);
          if (isAlreadySelected.length === 0) {
            this.bccselectedRecepientsList.push(keyword);
          }
          this.mailForm.controls.bcc.setValue(null);
          return [];
        }
        return this.MailService.searchRecipients(keyword);
      });
  }

  getCivility(value) {
    return this.utility.computeCivility(value, this.translate.currentLang);
  }

  getCurrentUser(): void {
    this.currentUser = this._login.getLoggedInUser();
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

  /* for share mail to 1001 ideas */
  getRecipientFullNameShare(recipient) {
    const recipients = recipient;
    if (recipients) {
      if (recipients) {
        if (recipients.hasOwnProperty('email')) {
          const senderObj = recipients;
          return this.getCivility(senderObj.sex) + ' ' + senderObj.firstName + ' ' + senderObj.lastName;
        } else {
          return recipients;
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
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

  /* for share mail to 1001 ideas */
  getSenderFullNameShare(sender) {
    const senders = sender;
    if (senders) {
      if (senders.hasOwnProperty('email')) {
        const recObj = senders;
        return this.getCivility(recObj.sex) + ' ' + recObj.firstName + ' ' + recObj.lastName;
      } else {
        return senders.recipient;
      }
    } else {
      return '';
    }
  }


  closeDialog(): void {
    const self = this;
    swal({
      title: this.translate.instant('MailBox.composeMail.DRAFT.TITLE'),
      html: this.translate.instant('MailBox.composeMail.DRAFT.TEXT'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('MailBox.composeMail.DRAFT.CONFIRMBTN'),
      cancelButtonText: this.translate.instant('MailBox.composeMail.DRAFT.DECBTN')
    }).then((result) => {
      if (result) {
        self.saveDraft();
        self.dialogref.close();
      }
    }, (dismiss) => {
      if (dismiss === 'cancel') {
        self.dialogref.close();
      }
    });
  }

  LoadAttachments(attachments) {
    if (attachments && Array.isArray(attachments)) {
      const self = this;
      attachments.forEach((file) => {
        self.attachmnetsPaths.push({
          path: file,
          name: self.getFileName(file)
        });
      });
    }
  }

  getFileName(fileName: String): string {
    if (fileName) {
      return fileName.substring(fileName.lastIndexOf('/') + 1);
    }
    return '';
  }

  saveDraft() {
    const formValues = this.mailForm.value;
    if (formValues.subject !== '' || formValues.message !== '' && formValues.message !== undefined) {
      const receiversArray = [];
      if (formValues.search_receiver) {
        const str_array = formValues.search_receiver.split(',');
        for (let i = 0; i < str_array.length; i++) {
          str_array[i] = str_array[i].replace(/^\s*/, '').replace(/\s*$/, '');
          if (this.validateEmail(str_array[i])) {
            receiversArray.push({ 'recipient': str_array[i], 'rank': 'a', 'mailType': 'draft' });
          }
        }
      }

      this.selectedRecepientsList.forEach(function (recipient) {
        receiversArray.push({ 'recipient': recipient.email, 'rank': 'a', 'mailType': 'draft' });
      });

      this.ccselectedRecepientsList.forEach(function (recipient) {
        receiversArray.push({ 'recipient': recipient.email, 'rank': 'cc', 'mailType': 'draft' });
      });

      this.ccselectedRecepientsList.forEach(function (recipient) {
        receiversArray.push({ 'recipient': recipient.email, 'rank': 'c', 'mailType': 'draft' });
      });

      const new_mail = new Mail();
      const MailAttachment = [];
      const MailAttachment1 = [];
      this.attachmnetsPaths.forEach((files) => {
        const obj = {
          filename: files.name,
          path: files.path
        }
        MailAttachment1.push(files.path);
        MailAttachment.push(obj);
      });
      new_mail.emails = receiversArray;
      new_mail.subject = formValues.subject;
      new_mail.message = formValues.message;
      new_mail.isSent = false;
      new_mail.attachments = MailAttachment1;
      new_mail.fileAttachments = MailAttachment;
      new_mail.tags = ['draft'];

      if (this.isGroupEmail) {
        new_mail.isGroupParent = this.isGroupEmail;
        new_mail.userTypeSelection = formValues.userTypeSelection;
        new_mail.groupDetails = this.computeGroupDetails();
      }

      const self = this;
      log.data('saveDraft new_mail', new_mail);
      this.MailService.sendMail(new_mail).then(
        task => {
          this.dialogref.close('updateMailList');
          if (task.status === 'OK') {
            swal({
              type: 'info',
              title: self.translate.instant('MailBox.MESSAGES.DRAFTMSG'),
              text: '',
              confirmButtonText: self.translate.instant('MailBox.MESSAGES.THANK')
            });
            self.deleteOldDraftMail();
            // this.snackBar.open('Mail Saved to Draft', 'Ok', { duration: 2000 });
          }
        },
        (error) => {
          swal({
            title: this.translate.instant('STUDENT.MESSAGE.ERRORTIT'),
            text: this.translate.instant('STUDENT.MESSAGE.ERRORMSG'),
            allowEscapeKey: true,
            type: 'error'
          });
        }
      );
    }
  }

  deleteOldDraftMail() {
    if (this.isDraftMail && this.DraftData['_id']) {
      const dataPost = {
        'ids': [this.DraftData['_id']],
        'senderProperty': {
          'mailType': 'deleted'
        }, 'recipientProperty': {
          'mailType': 'deleted'
        }
      };
      this.MailService.updateMail(dataPost).subscribe();
    }
  }

  removeSelectedRecepient(index, type) {
    if (type) {
      switch (type) {
        case 'to':
          this.selectedRecepientsList.splice(index, 1);
          break;
        case 'cc':
          this.ccselectedRecepientsList.splice(index, 1);
          break;
        case 'bcc':
          this.bccselectedRecepientsList.splice(index, 1);
          break;

      }
    }
  }

  recepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient ? selectedRecepient.display : null;
  }

  ccrecepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient ? selectedRecepient.display : null;
  }

  bccrecepientDisplayFunction(selectedRecepient) {
    return typeof selectedRecepient === 'object' && selectedRecepient ? selectedRecepient.display : null;
  }
  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  sendMail(): void {
    this.composeProcess = true;
    const formValues = this.mailForm.value;
    const receiversArray = [];
    // if (formValues.search_receiver) {
    //   const str_array = formValues.search_receiver.split(',');
    //   for (let i = 0; i < str_array.length; i++) {
    //     str_array[i] = str_array[i].replace(/^\s*/, '').replace(/\s*$/, '');
    //     if (this.validateEmail(str_array[i])) {
    //       receiversArray.push({ 'recipient': str_array[i], 'rank': 'a', 'mailType': 'inbox' });
    //     }
    //   }
    // }

    this.selectedRecepientsList.forEach(function (recipient) {
      receiversArray.push({ 'recipient': recipient.email, 'rank': 'a', 'mailType': 'inbox' });
    });

    // const str_arraycc = formValues.cc.split(',');
    // for (let i = 0; i < str_arraycc.length; i++) {
    //   str_arraycc[i] = str_arraycc[i].replace(/^\s*/, '').replace(/\s*$/, '');
    //   if (this.validateEmail(str_arraycc[i])) {
    //     receiversArray.push({ 'recipient': str_arraycc[i], 'rank': 'cc', 'mailType': 'inbox' });
    //   }
    // }

    this.ccselectedRecepientsList.forEach(function (recipient) {
      receiversArray.push({ 'recipient': recipient.email, 'rank': 'cc', 'mailType': 'inbox' });
    });

    // const str_arraybcc = formValues.bcc.split(',');
    // for (let i = 0; i < str_arraybcc.length; i++) {
    //   str_arraybcc[i] = str_arraybcc[i].replace(/^\s*/, '').replace(/\s*$/, '');
    //   if (this.validateEmail(str_arraybcc[i])) {
    //     receiversArray.push({ 'recipient': str_arraybcc[i], 'rank': 'c', 'mailType': 'inbox' });
    //   }
    // }

    this.bccselectedRecepientsList.forEach(function (recipient) {
      receiversArray.push({ 'recipient': recipient.email, 'rank': 'c', 'mailType': 'inbox' });
    });

    this.ccselectedRecepientsList.forEach(function (recipient) {
      receiversArray.push({ 'recipient': recipient.email, 'rank': 'c', 'mailType': 'inbox' });
    });

    const groupCondition =  this.isGroupEmail ? !(formValues.rncp.length || formValues.userTypes.length) : true;

    if (receiversArray.length < 1 && groupCondition) {

      return;
    }

    const new_mail = new Mail();
    const MailAttachment = [];
    const MailAttachment1 = [];
    this.attachmnetsPaths.forEach((files) => {
    
      const obj = {
        filename: files.name,
        path: files.path
      }
      MailAttachment.push(obj);
      MailAttachment1.push(files.path);
    });
    new_mail.emails = receiversArray;
    new_mail.subject = formValues.subject;
    new_mail.message = formValues.message;
    new_mail.isSent = true;
    new_mail.isUrgentMail = this.isUrgentFlag;
    new_mail.attachments = MailAttachment1;
    new_mail.fileAttachments = MailAttachment;
    // new_mail.tags = ['compose-new'];
    new_mail.tags = this.tags;
    if (this.isGroupEmail) {
      new_mail.isGroupParent = this.isGroupEmail;
      new_mail.userTypeSelection = formValues.userTypeSelection;
      new_mail.groupDetails = this.computeGroupDetails();
    }
    const self = this;
    log.data('sendMail new_mail', new_mail);

    /*
    * The isContactUs will be initialize when open the dialog
    * If just want send email just leave contact us, but if you want compose email as contact us
    * when you open this compose-mail.component remember to set the value
    * this.composeMailDialogRef.componentInstance.isContactUs = true; when open the dialog (this dialog)
    * */
    if (this.isContactUs) {
         this.MailService.contactSendMail(new_mail).then(
        task => {
          this.composeProcess = false;
          this.dialogref.close('updateMailList');
          swal({
            title: this.translate.instant('MailBox.composeMail.MESSAGES.TITLE'),
            text: this.translate.instant('MailBox.composeMail.MESSAGES.TEXT'),
            allowEscapeKey: true,
            type: 'success',
            confirmButtonText: this.translate.instant('MailBox.composeMail.MESSAGES.CONFIRMBTN'),
          });
          self.deleteOldDraftMail();
        },
        (error) => {
          // swal({ type: 'error', title: 'Mail Saved to Draft', text: error });
          swal({
            title: this.translate.instant('STUDENT.MESSAGE.ERRORTIT'),
            text: this.translate.instant('STUDENT.MESSAGE.ERRORMSG'),
            allowEscapeKey: true,
            type: 'error'
          });
          // this.snackBar.open(error, 'Ok', { duration: 2000 });
          this.composeProcess = false;
        }
      );
    } else {
      this.MailService.sendMail(new_mail).then(
        //  this.MailService.contactSendMail(new_mail).then(
        task => {
          this.composeProcess = false;
          this.dialogref.close('updateMailList');
          swal({
            title: this.translate.instant('MailBox.composeMail.MESSAGES.TITLE'),
            text: this.translate.instant('MailBox.composeMail.MESSAGES.TEXT'),
            allowEscapeKey: true,
            type: 'success',
            confirmButtonText: this.translate.instant('MailBox.composeMail.MESSAGES.CONFIRMBTN'),
          });
          self.deleteOldDraftMail();
        },
        (error) => {
          // swal({ type: 'error', title: 'Mail Saved to Draft', text: error });
          swal({
            title: this.translate.instant('STUDENT.MESSAGE.ERRORTIT'),
            text: this.translate.instant('STUDENT.MESSAGE.ERRORMSG'),
            allowEscapeKey: true,
            type: 'error'
          });
          // this.snackBar.open(error, 'Ok', { duration: 2000 });
          this.composeProcess = false;
        }
      );
    }

  }

  // file-upload section starts

  activeColor = 'green';
  baseColor = '#ccc';
  overlayColor = 'rgba(255,255,255,0.5)';

  iconColor: string;
  borderColor: string;

  dragging = false;
  loaded = false;
  imageLoaded = false;
  imageSrc = [];

  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  handleImageLoad() {
    this.imageLoaded = true;
    this.iconColor = this.overlayColor;
  }

  handleInputChange(e) {

    const files = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files;
    const pattern = /image-*/;
    this.loaded = false;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const filename = files[i].name;
      const index = filename.lastIndexOf('.');
      const strsubstring = filename.substring(index, filename.length);

      {
        const files = e.target.files || e.srcElement.files;
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
          this.MailService.uploadAttachment(formData)
            .subscribe(value => {

              if (value['data']) {
                this.attachmnetsPaths.push({
                  path: value.data.filepath,
                  name: filename
                });
              } else {
                swal({
                  title: 'Oops...',
                  text: 'Upload Fail. Please try again.',
                  allowEscapeKey: true,
                  type: 'error'
                });
              }
            });
        }
      reader.onload = this._handleReaderLoaded.bind(this, { fileName: filename });
      reader.readAsDataURL(files[i]);
    }
    this.resetFileState();
  }
  resetFileState() {
    this.currentFile.nativeElement.value = '';
  }
  removeAttachment(file) {
    this.attachmnetsPaths.splice(this.attachmnetsPaths.indexOf(file), 1);
    // this.imageSrc.splice(this.imageSrc.indexOf(file), 1);
  }

  _handleReaderLoaded({ fileName }, e) {
    const reader = e.target;
    const fileType = reader.result.split(';')[0].split(':')[1];
    this.imageSrc.push({
      'type': fileType,
      'name': fileName,
      'data': reader.result
    });
    this.loaded = true;
  }

  _setActive() {
    this.borderColor = this.activeColor;
    if (this.imageSrc.length === 0) {
      this.iconColor = this.activeColor;
    }
  }

  _setInactive() {
    this.borderColor = this.baseColor;
    if (this.imageSrc.length === 0) {
      this.iconColor = this.baseColor;
    }
  }

  getTranslateUserType(name) {
    let value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }
  // If Group Selection Code
  setGroupEmailCondition() {
    log.data('ngOnInit isGroupEmail', this.isGroupEmail);
    this.mailForm.addControl( 'rncp', new FormControl([]));
    this.mailForm.addControl( 'userTypeSelection', new FormControl(this.userTypeToggle));
    this.mailForm.addControl( 'userTypes', new FormControl([]));
    this.isGroupEmail = true;
    this.getRncpShortName();
    this.getNMapUserTypes();
  }

  getRncpShortName() {
    this.userService.getAllRNCPTitlesShortName().subscribe((response) => {
      if (response.data) {
        this.rncpTitleList = _.orderBy(response.data.map((rep) => {
          return {
            id: rep._id,
            text: rep.shortName
          };
        }), ['text']);

        if (this.isDraftMail) {
          const selectedRncps = this.DraftData.groupDetails.rncp.map((rep) => {
            return {
              id: rep._id,
              text: rep.shortName
            };
          });

          log.data('getRncpShortName selectedRncps', selectedRncps);
          this.mailForm.get('rncp').setValue(selectedRncps);
        }
      }
    });
  }

  getNMapUserTypes() {
    this.userService.getUserTypesByIsUserCollection(true).subscribe(response => {
      if (response.length) {
        this.userTypeList = _.orderBy(response.map((type) => {
          return {
            id: type._id,
            // Mappping Name with Type Name + Type Entity
            text: this.getTranslateADMTCSTAFFKEY(type.name) + ' / ' +
            this.getTranslateENTITY(type.entity)
          };
        }), ['text']);

        if (this.isDraftMail) {
          const selectedUserTypes = this.DraftData.groupDetails.userType.map((type) => {
            return {
              id: type._id,
              // Mappping Name with Type Name + Type Entity
              text: this.getTranslateADMTCSTAFFKEY(type.name) + ' / ' +
              this.getTranslateENTITY(type.entity)
            };
          });

          log.data('getNMapUserTypes selectedUserTypes', selectedUserTypes);
          this.mailForm.get('userTypes').setValue(selectedUserTypes);
        }
      } else {
        this.userTypeList = [];
      }
    });
  }

  getTranslateADMTCSTAFFKEY(name) {
    const value = this.translate.instant('ADMTCSTAFFKEY.' + name.toUpperCase());
    return value !== 'ADMTCSTAFFKEY.' + name.toUpperCase() ? value : name;
  }

  getTranslateENTITY(name) {
    const value = this.translate.instant(
      'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase()
    );
    return value !== 'SETTINGS.USERTYPES.ENTITYNAME.' + name.toUpperCase()
      ? value
      : name;
  }

  computeGroupDetails() {
    const rncp = this.mailForm.get('rncp').value.map(
      rncpItem => rncpItem.id
    );
    let userType = [];
    // Compute Array of Strings if UserTypeSelection is true
    if ( this.mailForm.get('userTypeSelection').value ) {
      userType = this.mailForm.get('userTypes').value.map(
        userTypeItem => userTypeItem.id
      );
    }

    return { rncp, userType };
  }
}

