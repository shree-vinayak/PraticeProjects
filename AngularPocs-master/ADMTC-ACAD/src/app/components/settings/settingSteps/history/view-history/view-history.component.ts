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
import { element } from 'protractor';
import { DatePipe } from '@angular/common';
import { forEach } from '@angular/router/src/utils/collection';
import { ComposeMailComponent } from 'app/components/Mail/compose-mail/compose-mail.component';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss'],
  providers: [MailService],
  encapsulation: ViewEncapsulation.None,
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})
export class ViewHistoryComponent implements OnInit {

  viewMessageData;
  datePipe;
  allHistory;
  currentSelectedIndexView;
  mailDialogConfig: MdDialogConfig = {
    disableClose: true,
    width: '720px',
    height: '530px'
  };
  public replyMailDialogRef: MdDialogRef<ComposeMailComponent>;
  public forwardMailDialogRef: MdDialogRef<ComposeMailComponent>;
  public replyAllMailDialogRef: MdDialogRef<ComposeMailComponent>;
  constructor(
    public translate: TranslateService,
    public dialog: MdDialog,
    public dialogref: MdDialogRef<ViewHistoryComponent>,
  ) {

  }

  ngOnInit(): void {

    // const re = new RegExp('<a ([^]+)>[^"]+a>', 'g');
    console.log(this.viewMessageData);
    this.viewMessageData.notificationMessage = this.viewMessageData.notificationMessage.replace(/(<a.*?\a>)/gi, '');

    for (let i = 0; i < this.allHistory.length; i++) {
      if (this.allHistory[i]['_id'] === this.viewMessageData['_id']) {
        this.currentSelectedIndexView = i;
      }
    }

  }

  getTranslatedDate(date) {
    this.datePipe = new DatePipe(this.translate.currentLang);
    return this.datePipe.transform(date, 'fullDate');
  }

  OpenMailPopupRequest(data, tag) {

    const convertToMailSchema = [];
    convertToMailSchema['senderProperty'] = {sender: data && data.from ? data.from : {}};
    convertToMailSchema['isUrgentMail'] = false;
    convertToMailSchema['recipientProperty'] = [];
    convertToMailSchema['recipientProperty'].push({recipient: data.to});
    convertToMailSchema['attachments'] = [];
    convertToMailSchema['subject'] = data.notificationSubject;
    convertToMailSchema['createdAt'] = data.createdAt;
    convertToMailSchema['message'] = data.notificationMessage;

    this.mailDialogConfig.data = {};
    this.replyMailDialogRef = this.dialog.open(ComposeMailComponent, this.mailDialogConfig);
    this.replyMailDialogRef.componentInstance.tags = [tag];
    this.replyMailDialogRef.componentInstance.currentMailData = convertToMailSchema;
    console.log('data', data);

      this.replyMailDialogRef.componentInstance.isSenderReq = false;


    this.replyMailDialogRef.afterClosed().subscribe(result => {
      if (result === 'updateMailList') {

      }
      this.replyMailDialogRef = null;
    });
  }

  onPreviousMessage(data) {
    console.log(this.viewMessageData);
    console.log(this.currentSelectedIndexView);
    if (this.viewMessageData && this.currentSelectedIndexView !== 0) {
      this.currentSelectedIndexView = this.currentSelectedIndexView - 1;
      this.viewMessageData = this.allHistory[this.currentSelectedIndexView];
      const re = new RegExp('<a ([^]+)>[^"]+a>', 'g');
      this.viewMessageData.notificationMessage =
      this.viewMessageData.notificationMessage.replace(re, '');

    }

  }
  onNextMessage(data) {
    console.log(this.viewMessageData);
    console.log(this.currentSelectedIndexView);
    if (this.viewMessageData && (this.currentSelectedIndexView + 1) < this.allHistory.length) {
      this.currentSelectedIndexView = this.currentSelectedIndexView + 1;
      this.viewMessageData = this.allHistory[this.currentSelectedIndexView];
      const re = new RegExp('<a ([^]+)>[^"]+a>', 'g');
      this.viewMessageData.notificationMessage =
      this.viewMessageData.notificationMessage.replace(re, '');
    }
  }
  checkIsPreviousBtnShow() {
    return this.currentSelectedIndexView !== 0 ? true : false;
  }
  checkIsNextBtnShow() {
    return this.currentSelectedIndexView !== this.allHistory.length - 1 ? true : false;
  }

  closeDialog(): void {
    this.dialogref.close();
  }

}
