import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from 'app/services/login.service';
import { UtilityService } from 'app/services/utility.service';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { MailService } from '../../../services/mail.service';
import { Mail } from './../../../models/mail';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import { concat } from 'rxjs/operator/concat';
@Component({
  selector: 'app-reply-mail',
  templateUrl: './reply-mail.component.html',
  styleUrls: ['./reply-mail.component.scss'],
  providers: [MailService],
  encapsulation: ViewEncapsulation.None,
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})

export class ReplyMailComponent {
  categoryName: any;
  @Input() taskId;
  mail = new Mail();
  senderId: string;
  recipientId: string;
  isSugesstion: boolean = false;
  currentUser;
  composeMailMessage: string = "";
  recipientEmail: string;
  replyMessage: string;
  subject: string;
  replyMailMessage: string;
  isUrgentMail : boolean;
  recepientsList: Observable<Array<string>>;
  selectedRecepientsList = [];
  public isDraftMail = false;
  public DraftData = [];
  showCCInput = false;
  showBCCInput = false;
  
  
  ccrecepientsList: Observable<Array<string>>;
  bccrecepientsList: Observable<Array<string>>;
  isShared:boolean = false;
  ccselectedRecepientsList = [];
  bccselectedRecepientsList = [];
  attachmnetsPaths = [];
  public replyMailForm: FormGroup;
  public mailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogref: MdDialogRef<ReplyMailComponent>,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private MailService: MailService,
    private _login: LoginService,
    private utility: UtilityService,
    private translate: TranslateService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    this.replyMailForm = this.fb.group({
      search_receiver: [''],
      recipientMail: [''],
      message: ['', Validators.required],
      subject: [''],
      cc: ['', []],
      bcc: ['', []]
    });
   

  }
 
  ngOnInit(): void {
    this.getRecipients();
    this.getCurrentUser();
    this.getSignature();
    /* reply mail to 1001 ideas */
    if(this.dialogref.componentInstance.data.user){
      if(this.dialogref.componentInstance.data.user.email){
        this.isSugesstion = true;
        this.replyMailForm.controls['search_receiver'].setValue(this.dialogref.componentInstance.data.user.email);
        this.categoryName = this.translate.instant(this.dialogref.componentInstance.data.category);
         this.subject = 'RE :  '+ this.categoryName;
         this.replyMailForm.controls['subject'].setValue(this.subject);
         this.LoadAttachments(this.dialogref.componentInstance.data['attachments']);
        }
    }
  }
  /* for reply mail to 1001 ideas */
  getSignature(){
   let body = '<br/><br/>';
    // body += '<br/><br/><br/><br/><br/>';
    body += '------------' + 'Message' + '------------';
    body += '<br/><b> ' + this.translate.instant('dashboardMessage.FROM') + '</b> : ';
    body += this.getSenderFullNameReply(this.dialogref.componentInstance.data['user']);
    // body += '<br/><b> ' + this.translate.instant('dashboardMessage.TO') + '</b> : ';
    // body += this.getRecipientFullNameReply(this.currentUser);
    body += '<br/><b> Date </b> : ' + this.getTranslatedDate(this.data['createdAt']);
    this.categoryName = this.translate.instant(this.dialogref.componentInstance.data.category);
    this.subject = this.categoryName;
    body += '<br/><b> ' + this.translate.instant('MailBox.composeMail.subject') + ' </b> : ' + this.subject;
    body += '<br/><br/>';
    body += this.data['suggestion'];
    body += '<br/><br/>';
    body += this.utility.computeCivility(this.currentUser.sex, this.translate.currentLang);
    body += ' ' + this.currentUser.firstName + ' ' + this.currentUser.lastName;
    body += ',</br>' + this.currentUser.position;
    this.composeMailMessage = body;
    // this.replyMailForm.controls['subject'].setValue('RE  : ' + this.categoryName);
    
  }

  getCurrentUser(): void {
    this.currentUser = this._login.getLoggedInUser();
    console.log("this.currentUser", this.currentUser);
  }

  /* for reply mail to 1001 ideas */
  getSenderFullNameReply(sender) {
    const senders = sender;
    console.log(senders);
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

 /* for replys mail to 1001 ideas */
 getRecipientFullNameReply(recipient) {
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

getTranslatedDate(date) {
  const datePipe = new DatePipe(this.translate.currentLang);
  return datePipe.transform(date, 'fullDate');
}

  getCivility(value) {
    return this.utility.computeCivility(value, this.translate.currentLang);
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
      this.attachmnetsPaths.forEach((files) => {
        MailAttachment.push(files.path);
      });
      new_mail.emails = receiversArray;
      new_mail.subject = formValues.subject;
      new_mail.message = formValues.message;
      new_mail.isSent = false;
      new_mail.attachments = MailAttachment;
      new_mail.tags = ['draft'];

      const self = this;

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

  // removeSelectedRecepient(index, type) {
  //   if (type) {
  //     switch (type) {
  //       case 'to':
  //         this.selectedRecepientsList.splice(index, 1);
  //         break;
  //       case 'cc':
  //         this.ccselectedRecepientsList.splice(index, 1);
  //         break;
  //       case 'bcc':
  //         this.bccselectedRecepientsList.splice(index, 1);
  //         break;

  //     }
  //   }
  // }


  getRecipients() {
    this.recepientsList = this.replyMailForm.controls.search_receiver.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(keyword => {
        if (typeof keyword === 'object') {
          const isAlreadySelected = this.selectedRecepientsList.filter(recipient => recipient.id === keyword.id);
          if (isAlreadySelected.length === 0) {
            this.selectedRecepientsList.push(keyword);
          }
          this.replyMailForm.controls.search_receiver.setValue(null);
          return [];
        }
        return this.MailService.searchRecipients(keyword);
      })
  }

  removeSelectedRecepient(index) {
    this.selectedRecepientsList.splice(index, 1);
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

  closeDialog() {
    this.dialogref.close();
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  sendMail(): void {
    const formValues = this.replyMailForm.value;
    const receiversArray = [];
    this.selectedRecepientsList.forEach(function (recipient) {
      receiversArray.push({ "recipient": recipient.email, "rank": 'a', 'mailType': 'inbox' });
    });
    for(var i = 0; i< this.selectedRecepientsList.length ; i++){
      this.isUrgentMail = this.selectedRecepientsList[i].isUrgent;
    }
    if (formValues.search_receiver !== null && formValues.search_receiver !== undefined) {
      const str_array = formValues.search_receiver.split(',');
      for (let i = 0; i < str_array.length; i++) {
        str_array[i] = str_array[i].replace(/^\s*/, '').replace(/\s*$/, '');
        if (this.validateEmail(str_array[i])) {
          receiversArray.push({ 'recipient': str_array[i], 'rank': 'a', 'mailType': 'inbox' });
        }
      }
    }

    const new_mail = new Mail();
    // new_mail.sender = this.senderId;
    // new_mail.receivers = receiversArray;
    // new_mail.mailType = 'inbox';
    // new_mail.subject = formValues.subject;
    // // new_mail.message = formValues.message;
    // new_mail.description = formValues.message;

    new_mail.emails = receiversArray;
    // new_mail.mailType = "sent";
    new_mail.subject = formValues.subject;
    new_mail.message = formValues.message;
    new_mail.isSent = true;
    new_mail.tags = ['reply-mail'];
    if(this.isUrgentMail == true){
      new_mail.isUrgentMail = true;
    }else{
      new_mail.isUrgentMail = false;
    }

    this.MailService.sendMail(new_mail).then(
      task => {
        //this.dialogref.close('updateMailList');
        this.dialogref.close();
        if (task.status === 'OK') {
          this.snackBar.open('Mail Sent', 'Ok', { duration: 2000 });
        }
      },
      (error) => {
        this.snackBar.open(error, 'Ok', { duration: 2000 });
      }
    );
  }

  //file-upload section starts

  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';

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

      const formats = ['.pdf', '.txt', '.doc', '.xls', '.png', '.jpeg', '.jpg', '.gif'];

      if (formats.indexOf(strsubstring) === -1) {
        swal({
          title: 'Oops...',
          text: 'Invalid format',
          allowEscapeKey: true,
          type: 'error'
        });
        return;
      }

      // if (strsubstring !== '.pdf' || strsubstring !== '.doc' || strsubstring !== '.xls'
      //   || strsubstring === '.txt' || strsubstring !== '.png' || strsubstring !== '.jpeg' ||
      //   strsubstring === '.jpg' || strsubstring !== '.gif') {
      //   console.log('valid format');
      // } else {
      //   swal({
      //     title: 'Oops...',
      //     text: 'Invalid format',
      //     allowEscapeKey: true,
      //     type: 'error'
      //   });
      //   return;
      // }

      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(files[i]);
    }

  }

  _handleReaderLoaded(e) {

    const reader = e.target;
    const fileType = reader.result.split(';')[0].split(':')[1];
    this.imageSrc.push({
      'type': fileType,
      'data': reader.result
    });
    // this.imageSrc.push( reader.result);
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

  // file-upload section ends


}
