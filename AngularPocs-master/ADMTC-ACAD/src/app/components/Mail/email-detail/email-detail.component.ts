import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ReplyMailComponent } from './../reply-mail/reply-mail.component';
import { ForwardMailComponent } from './../forward-mail/forward-mail.component';
import { ReplyAllMailComponent } from './../reply-all-mail/reply-all-mail.component';

@Component({
  selector: 'app-email-detail',
  templateUrl: './email-detail.component.html',
  styleUrls: ['./email-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailDetailComponent {

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

  mailDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '720px',
    height: '530px'
  };

  constructor(public dialogref: MdDialogRef<EmailDetailComponent>,
    public dialog: MdDialog,
    public replyMailDialogRef: MdDialogRef<ReplyMailComponent>,
    public forwardMailDialogRef: MdDialogRef<ForwardMailComponent>,
    public replyAllMailDialogRef: MdDialogRef<ReplyAllMailComponent>,
  ) {

  }

  closeDialog(): void {
    this.dialogref.close();
  }

  //this function execute when reply icon is clicked
  onReplyMail() {

    this.dialogref.close();
    this.mailDialogConfig.data = {};
    this.replyMailDialogRef = this.dialog.open(ReplyMailComponent, this.mailDialogConfig);
    this.replyMailDialogRef.componentInstance.senderId = this.senderId;
    this.replyMailDialogRef.componentInstance.recipientId = this.recipientId;
    this.replyMailDialogRef.componentInstance.recipientEmail = this.receipientEmail;
    this.replyMailDialogRef.componentInstance.subject = "Re:" + this.subject;
    //this.replyMailDialogRef.componentInstance.replyMessage = this.message;
    // this.replyMailDialogRef.componentInstance.replyMailMessage = this.message;
    //this.replyMailDialogRef.componentInstance.replyMailMessage = "<p>&nbsp;</p><p>&nbsp;</p><p>----------Forwarded message----------</p><p>From :  <b>" + this.senderName + "</b> </p><p>Date :" + this.messageDate + " </p><p>Subject : " + this.subject + "</p><p>To : " + this.receipientName + "</p><p>" + this.message + "</p>"
    if (this.senderId != "") {
      this.replyMailDialogRef.componentInstance.selectedRecepientsList.push({ id: this.senderId, email: this.senderEmail, display: this.senderName + " " + this.senderEmail });
    }
  }

  //this function execute when forward icon is clicked
  onForwardMail() {
    this.dialogref.close();
    this.mailDialogConfig.data = {};
    this.forwardMailDialogRef = this.dialog.open(ForwardMailComponent, this.mailDialogConfig);
    this.forwardMailDialogRef.componentInstance.senderId = this.senderId;
    // this.forwardMailDialogRef.componentInstance.forwardMessage = this.message;
    // this.forwardMailDialogRef.componentInstance.forwardMailMessage = this.message;

    this.forwardMailDialogRef.componentInstance.forwardMailMessage = "<p>----------Forwarded message----------</p><p>From :  <b>" + this.senderName + "</b> </p><p>Date :" + this.messageDate + " </p><p>Subject : " + this.subject + "</p><p>To : " + this.receipientName + "</p><p>" + this.message + "</p>"
    this.forwardMailDialogRef.componentInstance.forwardSubjet = "fw: " + this.subject;
  }

  //this function execute when reply-all icon is clicked
  onReplytoAllMail() {
    this.dialogref.close();
    this.mailDialogConfig.data = {};
    this.replyAllMailDialogRef = this.dialog.open(ReplyAllMailComponent, this.mailDialogConfig);
    this.replyAllMailDialogRef.componentInstance.senderId = this.senderId;
    this.replyAllMailDialogRef.componentInstance.recipientId = this.recipientId;
    this.replyAllMailDialogRef.componentInstance.recipientEmail = this.receipientEmail;
    this.replyAllMailDialogRef.componentInstance.subject = "Re:" + this.subject;
    // this.replyAllMailDialogRef.componentInstance.message = this.message;
    // this.replyAllMailDialogRef.componentInstance.replyallMailMessage = this.message;

    if (this.senderId != "") {
      this.replyAllMailDialogRef.componentInstance.selectedRecepientsList.push({ id: this.senderId, email: this.senderEmail, display: this.senderName + " " + this.senderEmail });
    }

  }

  //this function execute when we click to delete mail
  onDeleteMail() {
    var userIdList = [];
    userIdList.push(this.userId);

    if (this.mailCategory == "trash") {
      // write the code to permanantly delete the mail from trash
    }
    else {
      // write the code to delete the mail and put it to Trash folder
    }

    //code to call the api call ..need to write yet
    // this.MailService.deleteMail(userIdList).then(
    //   task => {

    //   },
    //   (error) => {
    //     this.snackBar.open(error, 'Ok', {duration: 2000});
    //   }
    // );
  }

}
